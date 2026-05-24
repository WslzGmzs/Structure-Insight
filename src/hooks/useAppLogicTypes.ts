import type React from 'react';
import type {
  ConfirmationState,
  FileContent,
  ProcessedFiles,
  RecentProject,
  SearchOptions,
  SearchResultItem,
} from '../types';
import type { ExportFormat } from '../services/exportTypes';

export type ActiveView = 'structure' | 'code';
export type MobileView = 'tree' | 'editor';
export type ToastType = 'success' | 'error' | 'info';

export interface AppStats {
  fileCount: number;
  totalLines: number;
  totalChars: number;
}

export interface AppLogicState {
  activeMatchIndexInFile: number | null;
  activeResultIndex: number | null;
  activeView: ActiveView;
  confirmation: ConfirmationState;
  editingPath: string | null;
  exportFormat: ExportFormat;
  exportHeaderText: string;
  exportInstructionText: string;
  exportSplitMaxChars: number;
  extractContent: boolean;
  fontSize: number;
  ignorePatterns: string;
  includeDirectoryStructure: boolean;
  includeEmptyDirectories: boolean;
  includeFileSummary: boolean;
  includePatterns: string;
  isDark: boolean;
  isDragging: boolean;
  isExporting: boolean;
  isFileRankOpen: boolean;
  isLoading: boolean;
  isMobile: boolean;
  isSearchOpen: boolean;
  isSecurityFindingsOpen: boolean;
  isSettingsOpen: boolean;
  isShortcutsOpen: boolean;
  lastProcessedFiles: File[] | null;
  markdownPreviewPaths: Set<string>;
  maxCharsThreshold: number;
  mobileView: MobileView;
  openFiles: string[];
  panelWidth: number;
  processedData: ProcessedFiles | null;
  progressMessage: string;
  recentProjects: RecentProject[];
  removeEmptyLines: boolean;
  searchOptions: SearchOptions;
  searchQuery: string;
  searchResults: SearchResultItem[];
  selectedFile: FileContent | null;
  selectedFilePath: string | null;
  showLineNumbers: boolean;
  stats: AppStats;
  toastMessage: string | null;
  toastType: ToastType;
  truncateBase64: boolean;
  useDefaultPatterns: boolean;
  useGitignore: boolean;
  wordWrap: boolean;
}

export interface AppLogicHandlers {
  closeTab: (path: string) => void;
  handleCancel: () => void;
  handleCopyAll: () => Promise<void>;
  handleCopyPath: (path: string) => void;
  handleDeleteFile: (path: string) => void;
  handleDirDoubleClick: () => void;
  handleDrop: (event: React.DragEvent) => void;
  handleFileSelect: () => Promise<void>;
  handleFileTreeSelect: (path: string) => void;
  handleMouseDownResize: (event: React.MouseEvent) => void;
  handleMobileViewToggle: () => void;
  handleNavigate: (direction: 'next' | 'prev') => void;
  handleRecentProjectSelect: (project: RecentProject) => Promise<void>;
  handleRefresh: () => Promise<void>;
  handleReset: () => void;
  handleSave: () => Promise<void>;
  handleSaveEdit: (path: string, newContent: string) => void;
  handleSearch: (query: string, options: SearchOptions) => void;
  handleToggleExclude: (path: string) => void;
  handleToggleMarkdownPreview: (path: string) => void;
  setActiveView: React.Dispatch<React.SetStateAction<ActiveView>>;
  setConfirmation: React.Dispatch<React.SetStateAction<ConfirmationState>>;
  setEditingPath: React.Dispatch<React.SetStateAction<string | null>>;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFileRankOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSecurityFindingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsShortcutsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setToastMessage: React.Dispatch<React.SetStateAction<string | null>>;
}

export interface AppLogicSettings {
  handleClearCache: () => void;
  setExportFormat: React.Dispatch<React.SetStateAction<ExportFormat>>;
  setExportHeaderText: React.Dispatch<React.SetStateAction<string>>;
  setExportInstructionText: React.Dispatch<React.SetStateAction<string>>;
  setExportSplitMaxChars: React.Dispatch<React.SetStateAction<number>>;
  setExtractContent: React.Dispatch<React.SetStateAction<boolean>>;
  setFontSize: React.Dispatch<React.SetStateAction<number>>;
  setIgnorePatterns: React.Dispatch<React.SetStateAction<string>>;
  setIncludeDirectoryStructure: React.Dispatch<React.SetStateAction<boolean>>;
  setIncludeEmptyDirectories: React.Dispatch<React.SetStateAction<boolean>>;
  setIncludeFileSummary: React.Dispatch<React.SetStateAction<boolean>>;
  setIncludePatterns: React.Dispatch<React.SetStateAction<string>>;
  setIsDark: React.Dispatch<React.SetStateAction<boolean>>;
  setMaxCharsThreshold: React.Dispatch<React.SetStateAction<number>>;
  setRemoveEmptyLines: React.Dispatch<React.SetStateAction<boolean>>;
  setShowLineNumbers: React.Dispatch<React.SetStateAction<boolean>>;
  setTruncateBase64: React.Dispatch<React.SetStateAction<boolean>>;
  setUseDefaultPatterns: React.Dispatch<React.SetStateAction<boolean>>;
  setUseGitignore: React.Dispatch<React.SetStateAction<boolean>>;
  setWordWrap: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface AppLogicReturn {
  state: AppLogicState;
  handlers: AppLogicHandlers;
  settings: AppLogicSettings;
}
