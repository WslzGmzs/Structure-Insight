import React from 'react';
import type { FileNode } from '../types';
import { getFileIcon } from './fileIcons';
import type { VisibleTreeRow } from './fileTreeRows';

const FILE_TREE_INDENT_REM = 1.25;

interface FileTreeRowProps {
  row: VisibleTreeRow;
  isActionMenuOpen: boolean;
  onFileSelect: (path: string) => void;
  onDeleteFile: (path: string) => void;
  onCopyPath: (path: string) => void;
  onToggleExclude: (path: string) => void;
  directoryFileCount: number;
  onToggleExpand: (path: string) => void;
  onToggleActionMenu: (path: string) => void;
  onCloseActionMenu: () => void;
}

function getRowStatus(node: FileNode): { statusClass: string; title: string; displayName: string } {
  let statusClass = node.status === 'processed' || !node.status ? '' : 'cursor-default';
  let title = node.path;
  let displayName = node.name;

  if (node.status === 'skipped') {
    statusClass += ' opacity-60';
    title = `${node.path} (已跳过)`;
  } else if (node.status === 'error') {
    statusClass += ' text-red-500/80';
    displayName = `错误: ${node.name}`;
    title = `${node.path} (错误: 无法读取文件)`;
  } else if (node.excluded) {
    statusClass += ' opacity-50 italic decoration-slate-400';
    title = `${node.path} (已排除)`;
  }

  return { statusClass, title, displayName };
}

export const FileTreeRow = React.memo(
  ({
    row,
    isActionMenuOpen,
    onFileSelect,
    onDeleteFile,
    onCopyPath,
    onToggleExclude,
    directoryFileCount,
    onToggleExpand,
    onToggleActionMenu,
    onCloseActionMenu,
  }: FileTreeRowProps) => {
    const { node, level, isOpen, isSelected, isFocused } = row;
    const { statusClass, title, displayName } = getRowStatus(node);

    const handleToggle = () => {
      onCloseActionMenu();
      if (node.isDirectory) {
        onToggleExpand(node.path);
      }
    };

    const handleSelect = () => {
      onCloseActionMenu();
      if (!node.isDirectory && node.status === 'processed') {
        onFileSelect(node.path);
      } else if (node.isDirectory) {
        handleToggle();
      }
    };

    const handleDelete = (event: React.MouseEvent) => {
      event.stopPropagation();
      onCloseActionMenu();
      onDeleteFile(node.path);
    };

    const handleToggleExcludeClick = (event: React.MouseEvent) => {
      event.stopPropagation();
      onCloseActionMenu();
      onToggleExclude(node.path);
    };

    const handleCopyPathClick = (event: React.MouseEvent) => {
      event.stopPropagation();
      onCloseActionMenu();
      onCopyPath(node.path);
    };

    const handleActionMenuToggle = (event: React.MouseEvent) => {
      event.stopPropagation();
      onToggleActionMenu(node.path);
    };

    const handleActionKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        onCloseActionMenu();
      }
    };

    const fileIcon = node.isDirectory ? null : getFileIcon(node.name);
    const iconElement = node.isDirectory ? (
      <i className={`fa-solid ${isOpen ? 'fa-folder-open' : 'fa-folder'} w-5 text-center text-sky-500`}></i>
    ) : (
      <i className={`${fileIcon!.icon} w-5 text-center ${fileIcon!.color}`}></i>
    );

    return (
      <div
        role="treeitem"
        aria-level={level}
        aria-expanded={node.isDirectory ? isOpen : undefined}
        aria-selected={isSelected || undefined}
        style={{ paddingLeft: `${Math.max(0, level - 1) * FILE_TREE_INDENT_REM}rem` }}
        className="list-none"
      >
        <div
          className={`group relative flex min-h-9 items-center py-1 px-2 rounded-md cursor-pointer hover:bg-light-border dark:hover:bg-dark-border/50 transition-colors duration-150 ${statusClass} ${isSelected ? 'bg-primary/10 dark:bg-primary/20' : ''} ${isFocused ? 'ring-1 ring-primary/50 bg-primary/5' : ''}`}
          onClick={handleSelect}
          title={title}
          data-path={node.path}
        >
          {node.isDirectory ? (
            <span
              className="w-4 text-center shrink-0"
              onClick={(event) => {
                event.stopPropagation();
                handleToggle();
              }}
            >
              <i
                className={`fa-solid fa-chevron-down text-xs transition-transform duration-200 text-light-subtle-text dark:text-dark-subtle-text ${isOpen ? 'rotate-0' : '-rotate-90'}`}
              ></i>
            </span>
          ) : (
            <span className="w-4 shrink-0"></span>
          )}

          <span className="shrink-0 ml-2">{iconElement}</span>
          <span className={`truncate text-sm flex-1 min-w-0 ml-2 ${node.excluded ? 'line-through' : ''}`}>
            {displayName}
          </span>

          {node.isDirectory && (
            <span className="text-[10px] text-light-subtle-text dark:text-dark-subtle-text shrink-0 ml-1 tabular-nums">
              {directoryFileCount}
            </span>
          )}

          {!node.isDirectory && (
            <div className="relative ml-2 flex w-7 shrink-0 items-center justify-center opacity-100 pointer-events-auto">
              <button
                onClick={handleActionMenuToggle}
                onKeyDown={handleActionKeyDown}
                type="button"
                aria-haspopup="menu"
                aria-expanded={isActionMenuOpen}
                aria-label={`更多 ${node.path} 操作`}
                data-file-action-trigger
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-light-border bg-light-bg text-xs text-light-subtle-text shadow-sm transition-colors hover:border-primary hover:text-primary dark:border-dark-border dark:bg-dark-bg"
                title="更多操作"
              >
                <i className="fa-solid fa-ellipsis"></i>
              </button>

              {isActionMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full z-30 mt-1 w-28 overflow-hidden rounded-lg border border-light-border bg-light-panel py-1 text-xs shadow-lg dark:border-dark-border dark:bg-dark-panel"
                  data-file-action-menu
                  onClick={(event) => event.stopPropagation()}
                  onKeyDown={handleActionKeyDown}
                >
                  <button
                    onClick={handleCopyPathClick}
                    type="button"
                    role="menuitem"
                    aria-label={`复制 ${node.path} 路径`}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-light-subtle-text transition-colors hover:bg-light-hover hover:text-primary dark:text-dark-subtle-text dark:hover:bg-dark-hover"
                  >
                    <i className="fa-solid fa-copy w-3 text-center"></i>
                    路径
                  </button>

                  {node.status === 'processed' && (
                    <button
                      onClick={handleToggleExcludeClick}
                      type="button"
                      role="menuitem"
                      aria-label={node.excluded ? `包含 ${node.path}` : `排除 ${node.path}`}
                      className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-light-subtle-text transition-colors hover:bg-light-hover hover:text-primary dark:text-dark-subtle-text dark:hover:bg-dark-hover"
                    >
                      <i className={`fa-solid ${node.excluded ? 'fa-eye' : 'fa-eye-slash'} w-3 text-center`}></i>
                      {node.excluded ? '包含' : '排除'}
                    </button>
                  )}

                  <button
                    onClick={handleDelete}
                    type="button"
                    role="menuitem"
                    aria-label={`删除 ${node.path}`}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-light-subtle-text transition-colors hover:bg-red-50 hover:text-red-500 dark:text-dark-subtle-text dark:hover:bg-red-950/30"
                  >
                    <i className="fa-solid fa-trash-can w-3 text-center"></i>
                    删除
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);
