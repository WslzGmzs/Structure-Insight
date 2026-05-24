import type React from 'react';
import type { AppLogicHandlers, AppLogicState } from '../hooks/useAppLogicTypes';

export type MainContentState = Pick<
  AppLogicState,
  | 'activeMatchIndexInFile'
  | 'activeView'
  | 'editingPath'
  | 'fontSize'
  | 'isDragging'
  | 'isLoading'
  | 'isMobile'
  | 'lastProcessedFiles'
  | 'markdownPreviewPaths'
  | 'mobileView'
  | 'openFiles'
  | 'panelWidth'
  | 'processedData'
  | 'progressMessage'
  | 'recentProjects'
  | 'searchOptions'
  | 'searchQuery'
  | 'selectedFile'
  | 'selectedFilePath'
  | 'wordWrap'
>;

export type MainContentHandlers = Pick<
  AppLogicHandlers,
  | 'closeTab'
  | 'handleCopyPath'
  | 'handleDeleteFile'
  | 'handleFileSelect'
  | 'handleFileTreeSelect'
  | 'handleMouseDownResize'
  | 'handleMobileViewToggle'
  | 'handleRecentProjectSelect'
  | 'handleSaveEdit'
  | 'handleToggleExclude'
  | 'handleToggleMarkdownPreview'
  | 'setEditingPath'
  | 'setToastMessage'
>;

export interface MainContentProps {
  state: MainContentState;
  handlers: MainContentHandlers;
  codeViewRef: React.RefObject<HTMLDivElement | null>;
  leftPanelRef: React.RefObject<HTMLDivElement | null>;
}
