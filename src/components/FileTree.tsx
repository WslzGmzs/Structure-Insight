import React from 'react';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';
import type { FileNode } from '../types';
import { FileTreeRow } from './FileTreeRow';
import { collectExpandedDirectoryPaths, flattenVisibleTreeRows } from './fileTreeRows';

interface FileTreeProps {
  nodes: FileNode[];
  treeResetKey?: unknown;
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
  onFileSelect: (path: string) => void;
  onDeleteFile: (path: string) => void;
  onCopyPath: (path: string) => void;
  onToggleExclude: (path: string) => void;
  selectedFilePath: string | null;
}

const FILE_TREE_ROW_HEIGHT = 36;

function buildDirectoryFileCounts(nodes: FileNode[]): Map<string, number> {
  const counts = new Map<string, number>();

  const walk = (node: FileNode): number => {
    if (!node.isDirectory) {
      return 1;
    }

    let fileCount = 0;
    for (const child of node.children) {
      fileCount += walk(child);
    }

    counts.set(node.path, fileCount);
    return fileCount;
  };

  for (const node of nodes) {
    walk(node);
  }

  return counts;
}

const FileTree: React.FC<FileTreeProps> = ({
  nodes,
  treeResetKey,
  scrollContainerRef,
  onFileSelect,
  onDeleteFile,
  onCopyPath,
  onToggleExclude,
  selectedFilePath,
}) => {
  const [expandedPaths, setExpandedPaths] = React.useState<Set<string>>(() => collectExpandedDirectoryPaths(nodes));
  const [focusedPath, setFocusedPath] = React.useState<string | null>(null);
  const [openActionMenuPath, setOpenActionMenuPath] = React.useState<string | null>(null);
  const virtuosoRef = React.useRef<VirtuosoHandle>(null);
  const treeRef = React.useRef<HTMLDivElement>(null);
  const latestNodesRef = React.useRef(nodes);
  const directoryFileCounts = React.useMemo(() => buildDirectoryFileCounts(nodes), [nodes]);

  React.useEffect(() => {
    latestNodesRef.current = nodes;
  }, [nodes]);

  React.useEffect(() => {
    setExpandedPaths(collectExpandedDirectoryPaths(latestNodesRef.current));
    setFocusedPath(null);
    setOpenActionMenuPath(null);
  }, [treeResetKey]);

  const handleToggleExpand = React.useCallback((path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  }, []);

  const visibleRows = React.useMemo(
    () => flattenVisibleTreeRows(nodes, expandedPaths, selectedFilePath, focusedPath),
    [nodes, expandedPaths, selectedFilePath, focusedPath]
  );

  const visiblePaths = React.useMemo(() => visibleRows.map((row) => row.path), [visibleRows]);

  React.useEffect(() => {
    if (openActionMenuPath && !visiblePaths.includes(openActionMenuPath)) {
      setOpenActionMenuPath(null);
    }
  }, [openActionMenuPath, visiblePaths]);

  React.useEffect(() => {
    if (!openActionMenuPath) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      if (target.closest('[data-file-action-menu]') || target.closest('[data-file-action-trigger]')) {
        return;
      }

      if (treeRef.current?.contains(target)) {
        setOpenActionMenuPath(null);
        return;
      }

      setOpenActionMenuPath(null);
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [openActionMenuPath]);

  React.useEffect(() => {
    if (!focusedPath) {
      return;
    }

    const index = visiblePaths.indexOf(focusedPath);
    if (index >= 0) {
      virtuosoRef.current?.scrollToIndex({ index, align: 'center', behavior: 'auto' });
    }
  }, [focusedPath, visiblePaths]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape' && openActionMenuPath) {
        event.preventDefault();
        setOpenActionMenuPath(null);
        return;
      }

      if (!visiblePaths.length) {
        return;
      }

      const currentIdx = focusedPath ? visiblePaths.indexOf(focusedPath) : -1;

      switch (event.key) {
        case 'ArrowDown': {
          event.preventDefault();
          const next = currentIdx < visiblePaths.length - 1 ? currentIdx + 1 : 0;
          setFocusedPath(visiblePaths[next]);
          break;
        }
        case 'ArrowUp': {
          event.preventDefault();
          const prev = currentIdx > 0 ? currentIdx - 1 : visiblePaths.length - 1;
          setFocusedPath(visiblePaths[prev]);
          break;
        }
        case 'ArrowRight': {
          event.preventDefault();
          if (!focusedPath) {
            break;
          }

          const row = visibleRows.find((item) => item.path === focusedPath);
          if (row?.node.isDirectory && !row.isOpen) {
            handleToggleExpand(focusedPath);
          }
          break;
        }
        case 'ArrowLeft': {
          event.preventDefault();
          if (!focusedPath) {
            break;
          }

          const row = visibleRows.find((item) => item.path === focusedPath);
          if (row?.node.isDirectory && row.isOpen) {
            handleToggleExpand(focusedPath);
          }
          break;
        }
        case 'Enter': {
          event.preventDefault();
          if (!focusedPath) {
            break;
          }

          const row = visibleRows.find((item) => item.path === focusedPath);
          if (!row) {
            break;
          }

          if (row.node.isDirectory) {
            handleToggleExpand(focusedPath);
          } else if (row.node.status === 'processed') {
            onFileSelect(focusedPath);
          }
          break;
        }
        case 'Escape':
          setFocusedPath(null);
          break;
      }
    },
    [visiblePaths, visibleRows, focusedPath, handleToggleExpand, onFileSelect, openActionMenuPath]
  );

  const collapseAll = React.useCallback(() => {
    setOpenActionMenuPath(null);
    setExpandedPaths(new Set());
  }, []);

  const expandAll = React.useCallback(() => {
    setOpenActionMenuPath(null);
    setExpandedPaths(collectExpandedDirectoryPaths(nodes));
  }, [nodes]);

  const handleToggleActionMenu = React.useCallback((path: string) => {
    setOpenActionMenuPath((current) => (current === path ? null : path));
  }, []);

  const closeActionMenu = React.useCallback(() => {
    setOpenActionMenuPath(null);
  }, []);

  if (!nodes || nodes.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-light-subtle-text dark:text-dark-subtle-text">未加载文件。</div>
    );
  }

  return (
    <div
      ref={treeRef}
      className="p-2 h-full min-h-0 flex flex-col"
      role="tree"
      aria-label="资源管理器"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-center justify-between px-2 mb-2">
        <h3 className="text-xs font-semibold text-light-subtle-text dark:text-dark-subtle-text uppercase tracking-wider">
          资源管理器
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={expandAll}
            className="w-6 h-6 rounded flex items-center justify-center text-light-subtle-text hover:text-primary hover:bg-light-border dark:hover:bg-dark-border/50 transition-colors"
            title="全部展开"
          >
            <i className="fa-solid fa-angles-down text-xs"></i>
          </button>
          <button
            onClick={collapseAll}
            className="w-6 h-6 rounded flex items-center justify-center text-light-subtle-text hover:text-primary hover:bg-light-border dark:hover:bg-dark-border/50 transition-colors"
            title="全部折叠"
          >
            <i className="fa-solid fa-angles-up text-xs"></i>
          </button>
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <Virtuoso
          ref={virtuosoRef}
          style={{ height: '100%' }}
          data={visibleRows}
          fixedItemHeight={FILE_TREE_ROW_HEIGHT}
          computeItemKey={(_index, row) => row.path}
          increaseViewportBy={240}
          scrollerRef={(ref) => {
            if (scrollContainerRef) {
              scrollContainerRef.current = ref instanceof HTMLElement ? ref : null;
            }
          }}
          itemContent={(_index, row) => (
            <FileTreeRow
              row={row}
              isActionMenuOpen={openActionMenuPath === row.path}
              onFileSelect={onFileSelect}
              onDeleteFile={onDeleteFile}
              onCopyPath={onCopyPath}
              onToggleExclude={onToggleExclude}
              directoryFileCount={directoryFileCounts.get(row.path) ?? 0}
              onToggleExpand={handleToggleExpand}
              onToggleActionMenu={handleToggleActionMenu}
              onCloseActionMenu={closeActionMenu}
            />
          )}
        />
      </div>
    </div>
  );
};

export default React.memo(FileTree);
