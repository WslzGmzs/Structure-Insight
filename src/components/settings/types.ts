import type { ExportFormat } from '../../services/exportTypes';

export type SettingsSectionId = 'workspace' | 'export' | 'about';

export interface SettingsSectionDefinition {
  id: SettingsSectionId;
  label: string;
  title: string;
  icon: string;
}

export interface SettingsDialogValues {
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
  isDarkTheme: boolean;
  maxCharsThreshold: number;
  removeEmptyLines: boolean;
  showLineNumbers: boolean;
  truncateBase64: boolean;
  useDefaultPatterns: boolean;
  useGitignore: boolean;
  wordWrap: boolean;
}

export interface SettingsDialogActions {
  onClearCache: () => void;
  onSetExportFormat: (value: ExportFormat) => void;
  onSetExportHeaderText: (value: string) => void;
  onSetExportInstructionText: (value: string) => void;
  onSetExportSplitMaxChars: (value: number) => void;
  onSetFontSize: (size: number) => void;
  onSetIncludePatterns: (value: string) => void;
  onSetIgnorePatterns: (value: string) => void;
  onSetMaxCharsThreshold: (val: number) => void;
  onToggleExtractContent: () => void;
  onToggleIncludeDirectoryStructure: () => void;
  onToggleIncludeEmptyDirectories: () => void;
  onToggleIncludeFileSummary: () => void;
  onToggleRemoveEmptyLines: () => void;
  onToggleShowLineNumbers: () => void;
  onToggleTheme: () => void;
  onToggleTruncateBase64: () => void;
  onToggleUseDefaultPatterns: () => void;
  onToggleUseGitignore: () => void;
  onToggleWordWrap: () => void;
}

export interface SettingsDialogProps {
  actions: SettingsDialogActions;
  isOpen: boolean;
  onClose: () => void;
  values: SettingsDialogValues;
}
