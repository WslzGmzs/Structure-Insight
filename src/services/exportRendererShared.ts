import type { ProcessedFiles } from '../types';
import { summarizeAnalysis } from './analysisSummary';

export const SUMMARY_GENERATION_HEADER =
  'This file is a merged representation of the current codebase, prepared by Structure Insight.';

export const SUMMARY_PURPOSE = [
  "This file contains a packed representation of the entire repository's contents.",
  'It is designed to be easily consumable by AI systems for analysis, code review,',
  'or other automated processes.',
].join('\n');

export const SUMMARY_FILE_FORMAT_PLAIN = [
  'The content is organized as follows:',
  '1. This summary section',
  '2. Repository information',
  '3. Directory structure',
  '4. Repository files (if enabled)',
].join('\n');

export const SUMMARY_FILE_FORMAT_JSON = [
  'The content is organized as follows:',
  '1. This summary section',
  '2. Repository information',
  '3. Directory structure',
  '4. Repository files, each consisting of:',
  '   - File path as a key',
  '   - Full contents of the file as the value',
].join('\n');

export const SUMMARY_USAGE_GUIDELINES = [
  '- This file should be treated as read-only. Any changes should be made to the',
  '  original repository files, not this packed version.',
  '- When processing this file, use the file path to distinguish',
  '  between different files in the repository.',
  '- Be aware that this file may contain sensitive information. Handle it with',
  '  the same level of security as you would the original repository.',
].join('\n');

export function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export function buildDirectoryString(data: ProcessedFiles): string {
  const render = (nodes: ProcessedFiles['treeData'], indent = ''): string[] => {
    const lines: string[] = [];
    for (const node of nodes) {
      lines.push(`${indent}${node.name}${node.isDirectory ? '/' : ''}`);
      if (node.isDirectory && node.children.length > 0) {
        lines.push(...render(node.children, `${indent}  `));
      }
    }
    return lines;
  };

  if (data.rootName === 'Project' && data.treeData.length > 1 && data.treeData.every((node) => node.isDirectory)) {
    return data.treeData.map((node) => `[${node.name}]/\n${render(node.children, '  ').join('\n')}`).join('\n\n');
  }

  const rootNode =
    data.treeData.length === 1 && data.treeData[0].isDirectory && data.treeData[0].name === data.rootName
      ? data.treeData[0]
      : null;

  return render(rootNode ? rootNode.children : data.treeData).join('\n');
}

export function buildNotes(data: ProcessedFiles): string {
  const metadata = data.exportMetadata ?? {
    usesDefaultIgnorePatterns: false,
    usesGitignorePatterns: false,
    sortsByGitChangeCount: false,
  };
  const notes = [
    "- Some files may have been excluded based on detected ignore files and Structure Insight's export settings",
    '- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files',
  ];

  if (metadata.usesGitignorePatterns) {
    notes.push('- Files matching patterns in .gitignore, .ignore, or .repomixignore are excluded');
  }

  if (metadata.usesDefaultIgnorePatterns) {
    notes.push('- Files matching default ignore patterns are excluded');
  }

  return notes.join('\n');
}

export function buildAnalysisSummary(data: ProcessedFiles) {
  return data.analysisSummary ?? summarizeAnalysis(data.fileContents).analysisSummary;
}

export function buildSecurityWarnings(data: ProcessedFiles) {
  return data.securityFindings ?? data.fileContents.flatMap((file) => file.securityFindings ?? []);
}
