import type { ExportFormat } from '../../services/exportBuilder';

export type SettingsSectionId = 'workspace' | 'export' | 'about';

export interface SettingsSectionDefinition {
    id: SettingsSectionId;
    label: string;
    title: string;
    icon: string;
}

export interface SettingsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    isDarkTheme: boolean;
    onToggleTheme: () => void;
    extractContent: boolean;
    onToggleExtractContent: () => void;
    fontSize: number;
    onSetFontSize: (size: number) => void;
    onClearCache: () => void;
    maxCharsThreshold: number;
    onSetMaxCharsThreshold: (val: number) => void;
    wordWrap: boolean;
    onToggleWordWrap: () => void;
    includeFileSummary: boolean;
    onToggleIncludeFileSummary: () => void;
    includeDirectoryStructure: boolean;
    onToggleIncludeDirectoryStructure: () => void;
    exportFormat: ExportFormat;
    onSetExportFormat: (value: ExportFormat) => void;
    includePatterns: string;
    onSetIncludePatterns: (value: string) => void;
    ignorePatterns: string;
    onSetIgnorePatterns: (value: string) => void;
    useDefaultPatterns: boolean;
    onToggleUseDefaultPatterns: () => void;
    useGitignore: boolean;
    onToggleUseGitignore: () => void;
    includeEmptyDirectories: boolean;
    onToggleIncludeEmptyDirectories: () => void;
    showLineNumbers: boolean;
    onToggleShowLineNumbers: () => void;
    removeEmptyLines: boolean;
    onToggleRemoveEmptyLines: () => void;
    truncateBase64: boolean;
    onToggleTruncateBase64: () => void;
    exportSplitMaxChars: number;
    onSetExportSplitMaxChars: (value: number) => void;
    exportHeaderText: string;
    onSetExportHeaderText: (value: string) => void;
    exportInstructionText: string;
    onSetExportInstructionText: (value: string) => void;
}

