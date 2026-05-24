import type { AnalysisSummary, ProcessedFiles } from '../types';

export type ExportFormat = 'plain' | 'xml' | 'markdown' | 'json';

export interface ExportOptions {
  format: ExportFormat;
  includeFileSummary: boolean;
  includeDirectoryStructure: boolean;
  includeFiles: boolean;
  includeEmptyDirectories: boolean;
  includePatterns: string;
  ignorePatterns: string;
  useDefaultPatterns: boolean;
  useGitignore: boolean;
  showLineNumbers: boolean;
  removeEmptyLines: boolean;
  truncateBase64: boolean;
  userProvidedHeader: string;
  instruction: string;
}

export interface BuildExportOutputParams {
  currentData: ProcessedFiles;
  rawFiles: File[];
  emptyDirectoryPaths: string[];
  exportOptions: ExportOptions;
  extractContent: boolean;
  maxCharsThreshold: number;
  progressCallback: (message: string) => void;
}

export interface ExportArtifact {
  output: string;
  analysisSummary: AnalysisSummary;
}
