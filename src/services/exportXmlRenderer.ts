import type { ProcessedFiles } from '../types';
import type { ExportOptions } from './exportTypes';
import {
  buildAnalysisSummary,
  buildDirectoryString,
  buildNotes,
  buildSecurityWarnings,
  escapeXml,
  SUMMARY_FILE_FORMAT_PLAIN,
  SUMMARY_PURPOSE,
  SUMMARY_USAGE_GUIDELINES,
} from './exportRendererShared';

export function renderXml(data: ProcessedFiles, options: ExportOptions): string {
  const directoryString = buildDirectoryString(data);
  const analysisSummary = buildAnalysisSummary(data);
  const securityWarnings = buildSecurityWarnings(data);
  const parts: string[] = [];

  if (options.includeFileSummary) {
    parts.push(
      `<file_summary>\n<purpose>${escapeXml(SUMMARY_PURPOSE)}</purpose>\n<file_format>${escapeXml(SUMMARY_FILE_FORMAT_PLAIN)}</file_format>\n<usage_guidelines>${escapeXml(SUMMARY_USAGE_GUIDELINES)}</usage_guidelines>\n<notes>${escapeXml(buildNotes(data))}</notes>\n</file_summary>`
    );
  }

  if (options.userProvidedHeader.trim()) {
    parts.push(`<user_provided_header>${escapeXml(options.userProvidedHeader.trim())}</user_provided_header>`);
  }

  if (options.includeDirectoryStructure) {
    parts.push(`<directory_structure>${escapeXml(directoryString)}</directory_structure>`);
  }

  parts.push(
    `<repository_analysis><files>${data.fileContents.length}</files><lines>${data.fileContents.reduce((sum, file) => sum + file.stats.lines, 0)}</lines><characters>${data.fileContents.reduce((sum, file) => sum + file.stats.chars, 0)}</characters><estimated_tokens>${analysisSummary.totalEstimatedTokens}</estimated_tokens><sensitive_findings>${analysisSummary.securityFindingCount}</sensitive_findings></repository_analysis>`
  );

  if (options.includeFiles) {
    parts.push(
      `<files>\n${data.fileContents.map((file) => `<file path="${escapeXml(file.path)}">${escapeXml(file.content)}</file>`).join('\n')}\n</files>`
    );
  }

  if (securityWarnings.length > 0) {
    parts.push(
      `<security_warnings>\n${securityWarnings.map((finding) => `<warning severity="${escapeXml(finding.severity)}" path="${escapeXml(finding.filePath)}">${escapeXml(finding.message)}</warning>`).join('\n')}\n</security_warnings>`
    );
  }

  if (options.instruction.trim()) {
    parts.push(`<instruction>${escapeXml(options.instruction.trim())}</instruction>`);
  }

  return parts.join('\n\n');
}
