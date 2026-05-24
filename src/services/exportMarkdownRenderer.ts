import type { ProcessedFiles } from '../types';
import type { ExportOptions } from './exportTypes';
import {
  buildAnalysisSummary,
  buildDirectoryString,
  buildNotes,
  buildSecurityWarnings,
  SUMMARY_FILE_FORMAT_PLAIN,
  SUMMARY_GENERATION_HEADER,
  SUMMARY_PURPOSE,
  SUMMARY_USAGE_GUIDELINES,
} from './exportRendererShared';

export function renderMarkdown(data: ProcessedFiles, options: ExportOptions): string {
  const directoryString = buildDirectoryString(data);
  const analysisSummary = buildAnalysisSummary(data);
  const securityWarnings = buildSecurityWarnings(data);
  const sections: string[] = [];

  if (options.includeFileSummary) {
    sections.push(
      `${SUMMARY_GENERATION_HEADER}\n\n# File Summary\n\n## Purpose\n${SUMMARY_PURPOSE}\n\n## File Format\n${SUMMARY_FILE_FORMAT_PLAIN}\n5. Multiple file entries, each consisting of:\n  a. A header with the file path (## File: path/to/file)\n  b. The full contents of the file in a code block\n\n## Usage Guidelines\n${SUMMARY_USAGE_GUIDELINES}\n\n## Notes\n${buildNotes(data)}`
    );
  }

  if (options.userProvidedHeader.trim()) {
    sections.push(`# User Provided Header\n${options.userProvidedHeader.trim()}`);
  }

  if (options.includeDirectoryStructure) {
    sections.push(`# Directory Structure\n\`\`\`\n${directoryString}\n\`\`\``);
  }

  sections.push(
    [
      '# Repository Analysis',
      `- Files: ${data.fileContents.length}`,
      `- Lines: ${data.fileContents.reduce((sum, file) => sum + file.stats.lines, 0)}`,
      `- Characters: ${data.fileContents.reduce((sum, file) => sum + file.stats.chars, 0)}`,
      `- Estimated Tokens: ${analysisSummary.totalEstimatedTokens}`,
      `- Sensitive Findings: ${analysisSummary.securityFindingCount}`,
    ].join('\n')
  );

  if (options.includeFiles) {
    sections.push(
      `# Files\n\n${data.fileContents.map((file) => `## File: ${file.path}\n\`\`\`\n${file.content}\n\`\`\``).join('\n\n')}`
    );
  }

  if (securityWarnings.length > 0) {
    sections.push(
      `# Security Warnings\n${securityWarnings.map((finding) => `- [${finding.severity}] ${finding.filePath}: ${finding.message}`).join('\n')}`
    );
  }

  if (options.instruction.trim()) {
    sections.push(`# Instruction\n${options.instruction.trim()}`);
  }

  return `${sections.join('\n\n')}\n`;
}
