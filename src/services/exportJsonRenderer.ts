import type { ProcessedFiles } from '../types';
import type { ExportOptions } from './exportTypes';
import {
  buildAnalysisSummary,
  buildDirectoryString,
  buildNotes,
  buildSecurityWarnings,
  SUMMARY_FILE_FORMAT_JSON,
  SUMMARY_GENERATION_HEADER,
  SUMMARY_PURPOSE,
  SUMMARY_USAGE_GUIDELINES,
} from './exportRendererShared';

export function renderJson(data: ProcessedFiles, options: ExportOptions): string {
  const analysisSummary = buildAnalysisSummary(data);
  const securityWarnings = buildSecurityWarnings(data);
  return JSON.stringify(
    {
      ...(options.includeFileSummary && {
        fileSummary: {
          generationHeader: SUMMARY_GENERATION_HEADER,
          purpose: SUMMARY_PURPOSE,
          fileFormat: SUMMARY_FILE_FORMAT_JSON,
          usageGuidelines: SUMMARY_USAGE_GUIDELINES,
          notes: buildNotes(data),
        },
      }),
      ...(options.userProvidedHeader.trim() && {
        userProvidedHeader: options.userProvidedHeader.trim(),
      }),
      ...(options.includeDirectoryStructure && {
        directoryStructure: buildDirectoryString(data),
      }),
      analysis: {
        fileCount: data.fileContents.length,
        totalLines: data.fileContents.reduce((sum, file) => sum + file.stats.lines, 0),
        totalChars: data.fileContents.reduce((sum, file) => sum + file.stats.chars, 0),
        estimatedTokens: analysisSummary.totalEstimatedTokens,
        securityFindingCount: analysisSummary.securityFindingCount,
      },
      ...(options.includeFiles && {
        files: Object.fromEntries(data.fileContents.map((file) => [file.path, file.content])),
      }),
      ...(securityWarnings.length > 0 && {
        securityWarnings: securityWarnings.map((finding) => ({
          severity: finding.severity,
          filePath: finding.filePath,
          message: finding.message,
        })),
      }),
      ...(options.instruction.trim() && {
        instruction: options.instruction.trim(),
      }),
    },
    null,
    2
  );
}
