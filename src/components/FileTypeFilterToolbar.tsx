import type { FileNode } from '../types';
import { compareFileTypeLabels, getFileTypeLabel } from '../services/fileTypeLabel';

interface FileTypeCount {
  label: string;
  count: number;
}

interface FileTypeFilterToolbarProps {
  fileTypes: FileTypeCount[];
  activeFilterType: string | null;
  hiddenSelectedFileName: string | null;
  onSelectFileType: (fileType: string | null) => void;
}

export function collectFileTypeCounts(nodes: FileNode[]): FileTypeCount[] {
  const counts = new Map<string, number>();

  const walk = (items: FileNode[]) => {
    for (const node of items) {
      if (node.isDirectory) {
        walk(node.children);
      } else {
        const label = getFileTypeLabel(node.name);
        counts.set(label, (counts.get(label) ?? 0) + 1);
      }
    }
  };

  walk(nodes);

  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => compareFileTypeLabels(a.label, b.label));
}

export function filterTreeByFileType(nodes: FileNode[], fileType: string | null): FileNode[] {
  if (!fileType) return nodes;
  return nodes.reduce<FileNode[]>((acc, node) => {
    if (node.isDirectory) {
      const filteredChildren = filterTreeByFileType(node.children, fileType);
      if (filteredChildren.length > 0) {
        acc.push({ ...node, children: filteredChildren });
      }
    } else if (getFileTypeLabel(node.name) === fileType) {
      acc.push(node);
    }
    return acc;
  }, []);
}

export const FileTypeFilterToolbar = ({
  fileTypes,
  activeFilterType,
  hiddenSelectedFileName,
  onSelectFileType,
}: FileTypeFilterToolbarProps) => {
  if (fileTypes.length === 0) {
    return null;
  }

  return (
    <div className="shrink-0 border-b border-light-border dark:border-dark-border">
      <div className="px-3 pt-2 text-[11px] text-light-subtle-text dark:text-dark-subtle-text">
        <span className="font-semibold uppercase tracking-[0.16em]">文件类型筛选</span>
        <p className="mt-1">筛选仅影响文件树浏览，不影响导出与右侧内容。</p>
      </div>
      <div className="flex flex-wrap gap-1.5 px-3 pt-2 pb-2">
        <button
          type="button"
          aria-label="全部"
          aria-pressed={activeFilterType === null}
          onClick={() => onSelectFileType(null)}
          className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
            activeFilterType === null
              ? 'bg-primary text-white'
              : 'bg-light-hover dark:bg-dark-hover text-light-subtle-text dark:text-dark-subtle-text hover:bg-primary/20 dark:hover:bg-primary/20'
          }`}
        >
          全部
        </button>
        {fileTypes.map((fileType) => (
          <button
            key={fileType.label}
            type="button"
            aria-label={fileType.label}
            aria-pressed={activeFilterType === fileType.label}
            onClick={() => onSelectFileType(activeFilterType === fileType.label ? null : fileType.label)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
              activeFilterType === fileType.label
                ? 'bg-primary text-white'
                : 'bg-light-hover dark:bg-dark-hover text-light-subtle-text dark:text-dark-subtle-text hover:bg-primary/20 dark:hover:bg-primary/20'
            }`}
          >
            <span>{fileType.label}</span>
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                activeFilterType === fileType.label ? 'bg-white/20' : 'bg-light-panel dark:bg-dark-panel'
              }`}
            >
              {fileType.count}
            </span>
          </button>
        ))}
      </div>
      {hiddenSelectedFileName && (
        <div className="px-3 pb-2">
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-300/50 bg-amber-50/80 px-3 py-2 text-xs text-amber-800 dark:border-amber-500/30 dark:bg-amber-950/30 dark:text-amber-200">
            <span>当前文件 {hiddenSelectedFileName} 未显示在当前筛选结果中。</span>
            <button
              type="button"
              onClick={() => onSelectFileType(null)}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 font-medium text-amber-900 transition-colors hover:bg-amber-100 dark:text-amber-100 dark:hover:bg-amber-900/40"
            >
              清除筛选
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
