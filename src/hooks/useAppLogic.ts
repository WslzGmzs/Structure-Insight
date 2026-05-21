import React from 'react';
import { useAppSettings } from './useAppSettings';
import { useWindowSize } from './useWindowSize';
import { useFileProcessing } from './useFileProcessing';
import { useInteraction } from './useInteraction';
import { useSearch } from './useSearch';
import { useExportActions } from './useExportActions';
import { useGlobalShortcuts } from './useGlobalShortcuts';
import { usePanelResize } from './usePanelResize';
import { useRecentProjects } from './useRecentProjects';
import { ConfirmationState, FileContent } from '../types';
import { clearPersistedAppData } from '../services/appStorage';

export const useAppLogic = (
    codeViewRef: React.RefObject<HTMLDivElement | null>,
    leftPanelRef: React.RefObject<HTMLDivElement | null>
) => {
    const [isDragging, setIsDragging] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isExporting, setIsExporting] = React.useState(false);
    const isBusyRef = React.useRef(false);
    React.useEffect(() => { isBusyRef.current = isLoading || isExporting; }, [isLoading, isExporting]);
    const [progressMessage, setProgressMessage] = React.useState('');
    const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
    const [isFileRankOpen, setIsFileRankOpen] = React.useState(false);
    const [isShortcutsOpen, setIsShortcutsOpen] = React.useState(false);
    const [isSecurityFindingsOpen, setIsSecurityFindingsOpen] = React.useState(false);
    const [toastMessage, setToastMessage] = React.useState<string | null>(null);
    const [toastType, setToastType] = React.useState<'success' | 'error' | 'info'>('success');
    const [confirmation, setConfirmation] = React.useState<ConfirmationState>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

    const { values: appSettings, setters: appSettingSetters } = useAppSettings();
    const {
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
    } = appSettings;
    const {
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
    } = appSettingSetters;

    const [selectedFilePath, setSelectedFilePath] = React.useState<string | null>(null);
    const [activeView, setActiveView] = React.useState<'structure' | 'code'>('structure');
    const [openFiles, setOpenFiles] = React.useState<string[]>([]);

    const windowSize = useWindowSize();
    const [mobileView, setMobileView] = React.useState<'tree' | 'editor'>('editor');
    const isMobile = React.useMemo(() => windowSize.width <= 768, [windowSize.width]);

    const { recentProjects, rememberRecentProject, forgetRecentProject } = useRecentProjects();

    const handleShowToast = React.useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
        setToastMessage(message);
        setToastType(type);
    }, []);

    const {
        processedData, setProcessedData, lastProcessedFiles, setLastProcessedFiles,
        lastEmptyDirectoryPaths, handleFileSelect, handleRecentProjectSelect, handleDrop, handleRefresh, handleCancel, abortControllerRef,
    } = useFileProcessing({
        extractContent, maxCharsThreshold, useDefaultIgnorePatterns: useDefaultPatterns, useGitignorePatterns: useGitignore,
        includePatterns, ignorePatterns, includeEmptyDirectories, setIsLoading, setProgressMessage,
        setMobileView, handleShowToast, isMobile, setSelectedFilePath, setActiveView, recentProjects,
        onRememberProject: rememberRecentProject,
        onForgetProject: forgetRecentProject,
    });

    const {
        editingPath, setEditingPath, markdownPreviewPaths,
        handleDeleteFile, handleFileTreeSelect, handleSaveEdit,
        handleToggleMarkdownPreview, clearInteractionState, handleCopyPath, handleToggleExclude,
    } = useInteraction({
        setProcessedData, handleShowToast, isMobile, setMobileView, setConfirmation,
        selectedFilePath, setSelectedFilePath, setActiveView,
        onDeleteConfirmed: (path: string) => {
            setOpenFiles(prev => prev.filter(openPath => openPath !== path));
            if (path === selectedFilePath) {
                setActiveView('structure');
            }
        },
    });

    const handleTabSelect = React.useCallback((path: string) => {
        setOpenFiles(prev => (prev.includes(path) ? prev : [...prev, path]));
        handleFileTreeSelect(path);
    }, [handleFileTreeSelect]);

    const closeTab = React.useCallback((path: string) => {
        if (editingPath === path) {
            setConfirmation({
                isOpen: true,
                title: '文件正在编辑中',
                message: '关闭标签页将丢失未保存的更改。是否继续？',
                onConfirm: () => {
                    setEditingPath(null);
                    setOpenFiles(prev => {
                        const next = prev.filter(p => p !== path);
                        if (path === selectedFilePath) {
                            const closedIdx = prev.indexOf(path);
                            const newSelected = next[Math.min(closedIdx, next.length - 1)] ?? null;
                            setSelectedFilePath(newSelected);
                            if (!newSelected) setActiveView('structure');
                        }
                        return next;
                    });
                },
            });
            return;
        }
        setOpenFiles(prev => {
            const next = prev.filter(p => p !== path);
            if (path === selectedFilePath) {
                const closedIdx = prev.indexOf(path);
                const newSelected = next[Math.min(closedIdx, next.length - 1)] ?? null;
                setSelectedFilePath(newSelected);
                if (!newSelected) setActiveView('structure');
            }
            return next;
        });
    }, [editingPath, selectedFilePath, setSelectedFilePath, setActiveView, setConfirmation, setEditingPath]);

    const {
        isSearchOpen, setIsSearchOpen, searchResults, activeResultIndex,
        searchQuery, searchOptions, handleSearch, handleNavigate, resetSearch,
    } = useSearch({
        processedData,
        openFile: handleTabSelect,
    });

    const handleDirDoubleClick = React.useCallback(() => {
        if (!isMobile) {
            return;
        }
        setActiveView('code');
        setMobileView('editor');
    }, [isMobile, setActiveView, setMobileView]);

    const selectedFile = React.useMemo<FileContent | null>(() => {
        if (!selectedFilePath || !processedData?.fileContents) return null;
        return processedData.fileContents.find(f => f.path === selectedFilePath) || null;
    }, [selectedFilePath, processedData]);

    const activeMatchIndexInFile = React.useMemo(() => {
        if (activeResultIndex === null || !selectedFilePath || searchResults.length === 0) return null;
        const currentResult = searchResults[activeResultIndex];
        if (currentResult && currentResult.filePath === selectedFilePath) {
            return currentResult.indexInFile;
        }
        return null;
    }, [activeResultIndex, selectedFilePath, searchResults]);

    const { handleCopyAll, handleSave } = useExportActions({
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
    });

    const handleReset = React.useCallback(() => {
        setConfirmation({
            isOpen: true,
            title: '重置应用程序',
            message: '您确定要重置应用程序吗？所有已加载的数据将被清除。',
            onConfirm: () => {
                if (abortControllerRef.current) abortControllerRef.current.abort();
                setProcessedData(null);
                setLastProcessedFiles(null);
                setIsLoading(false);
                setIsExporting(false);
                setProgressMessage('');
                setIsSettingsOpen(false);
                clearInteractionState();
                setSelectedFilePath(null);
                setOpenFiles([]);
                resetSearch();
                setIsFileRankOpen(false);
                setIsSecurityFindingsOpen(false);
                setActiveView('structure');
                handleShowToast('内容已重置。', 'info');
            },
        });
    }, [handleShowToast, clearInteractionState, resetSearch, abortControllerRef, setProcessedData, setLastProcessedFiles]);

    React.useEffect(() => {
        document.documentElement.classList.toggle('dark', isDark);
        document.documentElement.classList.toggle('light', !isDark);
        const lightTheme = document.getElementById('hljs-light-theme') as HTMLLinkElement | null;
        const darkTheme = document.getElementById('hljs-dark-theme') as HTMLLinkElement | null;
        if (lightTheme) lightTheme.disabled = isDark;
        if (darkTheme) darkTheme.disabled = !isDark;
    }, [isDark]);

    const handleClearCache = React.useCallback(() => {
        setConfirmation({
            isOpen: true,
            title: '清除缓存',
            message: '您确定要清除所有缓存的应用数据吗？此操作将重置所有设置。',
            onConfirm: async () => {
                await clearPersistedAppData({
                    localStorage: window.localStorage,
                    indexedDB: window.indexedDB,
                    caches: 'caches' in window ? window.caches : undefined,
                    navigator: window.navigator,
                });
                window.location.reload();
            },
        });
    }, []);

    const handleMobileViewToggle = React.useCallback(() => {
        if (processedData) {
            setMobileView(v => (v === 'editor' ? 'tree' : 'editor'));
        }
    }, [processedData]);

    const handleMouseDownResize = usePanelResize(leftPanelRef, setPanelWidth);

    useGlobalShortcuts({
        processedData,
        isSearchOpen,
        isSettingsOpen,
        isFileRankOpen,
        isSecurityFindingsOpen,
        isShortcutsOpen,
        isLoading,
        selectedFilePath,
        setIsSearchOpen,
        setIsSettingsOpen,
        setIsFileRankOpen,
        setIsSecurityFindingsOpen,
        setIsShortcutsOpen,
        handleSave,
        handleFileSelect,
        handleCancel,
        closeTab,
    });

    const stats = React.useMemo(() => {
        if (!processedData?.fileContents) return { fileCount: 0, totalLines: 0, totalChars: 0 };
        const activeFiles = processedData.fileContents.filter(f => !f.excluded);
        return {
            fileCount: activeFiles.length,
            totalLines: activeFiles.reduce((sum, f) => sum + f.stats.lines, 0),
            totalChars: activeFiles.reduce((sum, f) => sum + f.stats.chars, 0),
        };
    }, [processedData]);

    return {
        state: {
            processedData, isLoading, isExporting, isDragging, progressMessage, isSettingsOpen, toastMessage, toastType,
            editingPath, markdownPreviewPaths, confirmation,
            isDark, panelWidth, extractContent, fontSize, maxCharsThreshold, wordWrap,
            includeFileSummary, includeDirectoryStructure,
            exportHeaderText, exportInstructionText,
            exportFormat, includePatterns, ignorePatterns, useDefaultPatterns, useGitignore,
            includeEmptyDirectories, showLineNumbers, removeEmptyLines, truncateBase64, exportSplitMaxChars,
            lastProcessedFiles, mobileView, stats,
            isSearchOpen, isFileRankOpen, isShortcutsOpen, isSecurityFindingsOpen, searchResults, activeResultIndex, isMobile,
            selectedFilePath, selectedFile, activeView,
            openFiles,
            searchQuery, searchOptions, activeMatchIndexInFile,
            recentProjects,
        },
        handlers: {
            setIsDragging,
            handleDrop: (e: React.DragEvent) => { setIsDragging(false); handleDrop(e, isBusyRef.current); },
            handleFileSelect,
            handleRecentProjectSelect,
            handleCopyAll,
            handleSave,
            handleReset,
            handleRefresh,
            handleCancel,
            setIsSettingsOpen,
            setToastMessage,
            setConfirmation,
            handleDeleteFile,
            handleFileTreeSelect: handleTabSelect,
            closeTab,
            setEditingPath,
            handleSaveEdit,
            handleToggleMarkdownPreview,
            handleMouseDownResize,
            handleMobileViewToggle,
            setIsSearchOpen,
            setIsFileRankOpen,
            setIsShortcutsOpen,
            setIsSecurityFindingsOpen,
            handleSearch,
            handleNavigate,
            setActiveView,
            handleCopyPath,
            handleToggleExclude,
            handleDirDoubleClick,
        },
        settings: {
            setIsDark,
            setExtractContent,
            setFontSize,
            handleClearCache,
            setMaxCharsThreshold,
            setWordWrap,
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
};
