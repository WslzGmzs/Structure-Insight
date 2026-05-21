import React from 'react';
import { buildExportArtifact, type ExportFormat } from '../services/exportBuilder';
import { splitOutputText } from '../services/exportSplit';
import { copyTextToClipboard } from '../services/clipboard';
import type { ProcessedFiles } from '../types';

interface UseExportActionsParams {
    processedData: ProcessedFiles | null;
    lastProcessedFiles: File[] | null;
    lastEmptyDirectoryPaths: string[];
    exportFormat: ExportFormat;
    includeFileSummary: boolean;
    includeDirectoryStructure: boolean;
    includeEmptyDirectories: boolean;
    includePatterns: string;
    ignorePatterns: string;
    useDefaultPatterns: boolean;
    useGitignore: boolean;
    showLineNumbers: boolean;
    removeEmptyLines: boolean;
    truncateBase64: boolean;
    exportHeaderText: string;
    exportInstructionText: string;
    extractContent: boolean;
    maxCharsThreshold: number;
    exportSplitMaxChars: number;
    setIsExporting: (value: boolean) => void;
    setProgressMessage: (message: string) => void;
    handleShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const EXPORT_EXTENSION_BY_FORMAT: Record<ExportFormat, string> = {
    plain: 'txt',
    markdown: 'md',
    xml: 'xml',
    json: 'json',
};

function getSafeExportBaseName(rootName: string | undefined): string {
    return (rootName || 'structure-insight').replace(/[\\/?<>:*|"']/g, '_');
}

export function useExportActions({
    processedData,
    lastProcessedFiles,
    lastEmptyDirectoryPaths,
    exportFormat,
    includeFileSummary,
    includeDirectoryStructure,
    includeEmptyDirectories,
    includePatterns,
    ignorePatterns,
    useDefaultPatterns,
    useGitignore,
    showLineNumbers,
    removeEmptyLines,
    truncateBase64,
    exportHeaderText,
    exportInstructionText,
    extractContent,
    maxCharsThreshold,
    exportSplitMaxChars,
    setIsExporting,
    setProgressMessage,
    handleShowToast,
}: UseExportActionsParams) {
    const buildProjectContext = React.useCallback(async (progressCallback: (message: string) => void) => {
        if (!processedData || !lastProcessedFiles) return null;

        return await buildExportArtifact({
            currentData: processedData,
            rawFiles: lastProcessedFiles,
            emptyDirectoryPaths: lastEmptyDirectoryPaths,
            exportOptions: {
                format: exportFormat,
                includeFileSummary,
                includeDirectoryStructure,
                includeFiles: true,
                includeEmptyDirectories,
                includePatterns,
                ignorePatterns,
                useDefaultPatterns,
                useGitignore,
                showLineNumbers,
                removeEmptyLines,
                truncateBase64,
                userProvidedHeader: exportHeaderText,
                instruction: exportInstructionText,
            },
            extractContent,
            maxCharsThreshold,
            progressCallback,
        });
    }, [
        processedData,
        lastProcessedFiles,
        lastEmptyDirectoryPaths,
        exportFormat,
        includeFileSummary,
        includeDirectoryStructure,
        includeEmptyDirectories,
        includePatterns,
        ignorePatterns,
        useDefaultPatterns,
        useGitignore,
        showLineNumbers,
        removeEmptyLines,
        truncateBase64,
        exportHeaderText,
        exportInstructionText,
        extractContent,
        maxCharsThreshold,
    ]);

    const handleCopyAll = React.useCallback(async () => {
        setIsExporting(true);
        setProgressMessage('正在生成导出内容...');

        try {
            const artifact = await buildProjectContext(setProgressMessage);
            if (!artifact) return;

            const copied = await copyTextToClipboard(artifact.output);
            if (!copied) {
                handleShowToast('复制到剪贴板失败。', 'error');
                return;
            }

            const warningCount = artifact.analysisSummary.securityFindingCount ?? 0;
            if (warningCount > 0) {
                handleShowToast(`已复制内容，并检测到 ${warningCount} 条敏感信息提示。`, 'info');
                return;
            }
            handleShowToast('已将所有内容复制到剪贴板！');
        } catch (error) {
            console.error('Error copying packed output:', error);
            handleShowToast('复制到剪贴板失败。', 'error');
        } finally {
            setIsExporting(false);
            setTimeout(() => setProgressMessage(''), 1200);
        }
    }, [buildProjectContext, handleShowToast, setIsExporting, setProgressMessage]);

    const handleSave = React.useCallback(async () => {
        if (!processedData) return;
        setIsExporting(true);
        setProgressMessage('正在生成导出内容...');

        try {
            const artifact = await buildProjectContext(setProgressMessage);
            if (!artifact) return;

            const safeBaseName = getSafeExportBaseName(processedData.rootName);
            const parts = splitOutputText(artifact.output, exportSplitMaxChars);

            parts.forEach((part, index) => {
                const blob = new Blob([part], { type: 'text/plain;charset=utf-8' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = parts.length === 1
                    ? `${safeBaseName}.${EXPORT_EXTENSION_BY_FORMAT[exportFormat]}`
                    : `${safeBaseName}.part${index + 1}.${EXPORT_EXTENSION_BY_FORMAT[exportFormat]}`;
                a.click();
                URL.revokeObjectURL(a.href);
            });

            const warningCount = artifact.analysisSummary.securityFindingCount ?? 0;
            if (parts.length > 1) {
                handleShowToast(`导出文件已拆分保存，共 ${parts.length} 份。`, warningCount > 0 ? 'info' : 'success');
                return;
            }
            if (warningCount > 0) {
                handleShowToast(`已保存导出文件，并检测到 ${warningCount} 条敏感信息提示。`, 'info');
                return;
            }
            handleShowToast('导出文件已保存。');
        } catch (error) {
            console.error('Error saving packed output:', error);
            handleShowToast('保存导出文件失败。', 'error');
        } finally {
            setIsExporting(false);
            setTimeout(() => setProgressMessage(''), 1200);
        }
    }, [
        processedData,
        buildProjectContext,
        exportFormat,
        exportSplitMaxChars,
        handleShowToast,
        setIsExporting,
        setProgressMessage,
    ]);

    return { handleCopyAll, handleSave };
}

