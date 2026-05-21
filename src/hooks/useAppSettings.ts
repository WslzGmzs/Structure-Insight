import React from 'react';
import type { ExportFormat } from '../services/exportBuilder';
import { MAX_CHARS_DEFAULT } from '../services/constants';
import { usePersistentState } from './usePersistentState';

const MAX_CHARS_THRESHOLD_MIGRATION_KEY = 'migration:maxCharsThresholdDefaultDisabled:v1';

export function useAppSettings() {
    const [isDark, setIsDark] = usePersistentState('theme', false);
    const [panelWidth, setPanelWidth] = usePersistentState('panelWidth', 30);
    const [extractContent, setExtractContent] = usePersistentState('extractContent', true);
    const [fontSize, setFontSize] = usePersistentState('fontSize', 14);
    const [wordWrap, setWordWrap] = usePersistentState('wordWrap', false);
    const [maxCharsThreshold, setMaxCharsThreshold] = usePersistentState('maxCharsThreshold', 0);
    const [includeFileSummary, setIncludeFileSummary] = usePersistentState('includeFileSummary', true);
    const [includeDirectoryStructure, setIncludeDirectoryStructure] = usePersistentState('includeDirectoryStructure', true);
    const [exportHeaderText, setExportHeaderText] = usePersistentState('exportHeaderText', '');
    const [exportInstructionText, setExportInstructionText] = usePersistentState('exportInstructionText', '');
    const [exportFormat, setExportFormat] = usePersistentState<ExportFormat>('exportFormat', 'plain');
    const [includePatterns, setIncludePatterns] = usePersistentState('exportIncludePatterns', '');
    const [ignorePatterns, setIgnorePatterns] = usePersistentState('exportIgnorePatterns', '');
    const [useDefaultPatterns, setUseDefaultPatterns] = usePersistentState('exportUseDefaultPatterns', true);
    const [useGitignore, setUseGitignore] = usePersistentState('exportUseGitignore', true);
    const [includeEmptyDirectories, setIncludeEmptyDirectories] = usePersistentState('exportIncludeEmptyDirectories', false);
    const [showLineNumbers, setShowLineNumbers] = usePersistentState('exportShowLineNumbers', false);
    const [removeEmptyLines, setRemoveEmptyLines] = usePersistentState('exportRemoveEmptyLines', false);
    const [truncateBase64, setTruncateBase64] = usePersistentState('exportTruncateBase64', false);
    const [exportSplitMaxChars, setExportSplitMaxChars] = usePersistentState('exportSplitMaxChars', 0);

    React.useEffect(() => {
        try {
            if (window.localStorage.getItem(MAX_CHARS_THRESHOLD_MIGRATION_KEY) === 'true') {
                return;
            }

            if (window.localStorage.getItem('maxCharsThreshold') === JSON.stringify(MAX_CHARS_DEFAULT)) {
                setMaxCharsThreshold(0);
            }

            window.localStorage.setItem(MAX_CHARS_THRESHOLD_MIGRATION_KEY, 'true');
        } catch {
            // Ignore storage access errors and keep using the in-memory default.
        }
    }, [setMaxCharsThreshold]);

    return {
        values: {
            isDark,
            panelWidth,
            extractContent,
            fontSize,
            wordWrap,
            maxCharsThreshold,
            includeFileSummary,
            includeDirectoryStructure,
            exportHeaderText,
            exportInstructionText,
            exportFormat,
            includePatterns,
            ignorePatterns,
            useDefaultPatterns,
            useGitignore,
            includeEmptyDirectories,
            showLineNumbers,
            removeEmptyLines,
            truncateBase64,
            exportSplitMaxChars,
        },
        setters: {
            setIsDark,
            setPanelWidth,
            setExtractContent,
            setFontSize,
            setWordWrap,
            setMaxCharsThreshold,
            setIncludeFileSummary,
            setIncludeDirectoryStructure,
            setExportHeaderText,
            setExportInstructionText,
            setExportFormat,
            setIncludePatterns,
            setIgnorePatterns,
            setUseDefaultPatterns,
            setUseGitignore,
            setIncludeEmptyDirectories,
            setShowLineNumbers,
            setRemoveEmptyLines,
            setTruncateBase64,
            setExportSplitMaxChars,
        },
    };
}

