import React from 'react';
import type { FileContent, SearchOptions } from '../types';
import CodeFilePanel from './CodeFilePanel';

interface CodeViewProps {
  selectedFile: FileContent | null;
  editingPath: string | null;
  onStartEdit: (path: string) => void;
  onSaveEdit: (path: string, newContent: string) => void;
  onCancelEdit: () => void;
  markdownPreviewPaths: Set<string>;
  onToggleMarkdownPreview: (path: string) => void;
  onShowToast: (message: string) => void;
  fontSize: number;
  searchQuery: string;
  searchOptions: SearchOptions;
  activeMatchIndexInFile: number | null;
  onCopyPath: (path: string) => void;
  wordWrap?: boolean;
}

const CodeView: React.FC<CodeViewProps> = (props) => {
  const {
    selectedFile,
    editingPath,
    onStartEdit,
    onSaveEdit,
    onCancelEdit,
    markdownPreviewPaths,
    onToggleMarkdownPreview,
    onShowToast,
    fontSize,
    searchQuery,
    searchOptions,
    activeMatchIndexInFile,
    onCopyPath,
    wordWrap,
  } = props;

  if (!selectedFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4 text-light-subtle-text dark:text-dark-subtle-text">
        <i className="fa-solid fa-file-code text-5xl mb-4"></i>
        <p className="font-semibold">选择一个文件</p>
        <p className="text-sm">从左侧资源管理器中选择一个文件以查看其内容。</p>
      </div>
    );
  }

  return (
    <div className="h-full p-4 md:p-6 bg-light-bg dark:bg-dark-bg">
      <div key={selectedFile.path}>
        <CodeFilePanel
          file={selectedFile}
          isEditing={editingPath === selectedFile.path}
          onStartEdit={onStartEdit}
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
          isMarkdown={selectedFile.language === 'markdown'}
          isMarkdownPreview={markdownPreviewPaths.has(selectedFile.path)}
          onToggleMarkdownPreview={onToggleMarkdownPreview}
          onShowToast={onShowToast}
          fontSize={fontSize}
          searchQuery={searchQuery}
          searchOptions={searchOptions}
          activeMatchIndexInFile={activeMatchIndexInFile}
          onCopyPath={onCopyPath}
          wordWrap={wordWrap}
        />
      </div>
    </div>
  );
};

export default React.memo(CodeView);
