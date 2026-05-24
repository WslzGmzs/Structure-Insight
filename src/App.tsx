import React from 'react';
import { useAppLogic } from './hooks/useAppLogic';
import Toast from './components/Toast';
import Header from './components/Header';
import MainContent from './components/MainContent';
import StatusBar from './components/StatusBar';
import ConfirmationDialog from './components/ConfirmationDialog';
import type { SettingsDialogActions, SettingsDialogValues } from './components/settings/types';

// Lazy-load heavy components
const SettingsDialog = React.lazy(() => import('./components/SettingsDialog'));
const SearchDialog = React.lazy(() => import('./components/SearchDialog'));
const FileRankDialog = React.lazy(() => import('./components/FileRankDialog'));
const KeyboardShortcutsDialog = React.lazy(() => import('./components/KeyboardShortcutsDialog'));
const SecurityFindingsDialog = React.lazy(() => import('./components/SecurityFindingsDialog'));

const SuspenseFallback = () => null;

function getProgressWidth(message: string | null): string {
  if (!message) return '90%';
  const match = message.match(/(\d+)\/(\d+)/);
  if (!match) return '90%';
  const current = parseInt(match[1]);
  const total = Math.max(1, parseInt(match[2]));
  return `${Math.min(95, (current / total) * 100)}%`;
}

function isFileDragEvent(event: React.DragEvent<HTMLElement>): boolean {
  const types = event.dataTransfer?.types;
  return Array.isArray(types) ? types.includes('Files') : Array.from(types ?? []).includes('Files');
}

const App: React.FC = () => {
  const codeViewRef = React.useRef<HTMLDivElement>(null);
  const leftPanelRef = React.useRef<HTMLDivElement>(null);
  const dragDepthRef = React.useRef(0);

  const logic = useAppLogic(codeViewRef, leftPanelRef);
  const { state, handlers, settings } = logic;

  const settingsDialogValues: SettingsDialogValues = {
    exportFormat: state.exportFormat,
    exportHeaderText: state.exportHeaderText,
    exportInstructionText: state.exportInstructionText,
    exportSplitMaxChars: state.exportSplitMaxChars,
    extractContent: state.extractContent,
    fontSize: state.fontSize,
    ignorePatterns: state.ignorePatterns,
    includeDirectoryStructure: state.includeDirectoryStructure,
    includeEmptyDirectories: state.includeEmptyDirectories,
    includeFileSummary: state.includeFileSummary,
    includePatterns: state.includePatterns,
    isDarkTheme: state.isDark,
    maxCharsThreshold: state.maxCharsThreshold,
    removeEmptyLines: state.removeEmptyLines,
    showLineNumbers: state.showLineNumbers,
    truncateBase64: state.truncateBase64,
    useDefaultPatterns: state.useDefaultPatterns,
    useGitignore: state.useGitignore,
    wordWrap: state.wordWrap,
  };

  const settingsDialogActions: SettingsDialogActions = {
    onClearCache: settings.handleClearCache,
    onSetExportFormat: settings.setExportFormat,
    onSetExportHeaderText: settings.setExportHeaderText,
    onSetExportInstructionText: settings.setExportInstructionText,
    onSetExportSplitMaxChars: settings.setExportSplitMaxChars,
    onSetFontSize: settings.setFontSize,
    onSetIgnorePatterns: settings.setIgnorePatterns,
    onSetIncludePatterns: settings.setIncludePatterns,
    onSetMaxCharsThreshold: settings.setMaxCharsThreshold,
    onToggleExtractContent: () => settings.setExtractContent(!state.extractContent),
    onToggleIncludeDirectoryStructure: () => settings.setIncludeDirectoryStructure(!state.includeDirectoryStructure),
    onToggleIncludeEmptyDirectories: () => settings.setIncludeEmptyDirectories(!state.includeEmptyDirectories),
    onToggleIncludeFileSummary: () => settings.setIncludeFileSummary(!state.includeFileSummary),
    onToggleRemoveEmptyLines: () => settings.setRemoveEmptyLines(!state.removeEmptyLines),
    onToggleShowLineNumbers: () => settings.setShowLineNumbers(!state.showLineNumbers),
    onToggleTheme: () => settings.setIsDark(!state.isDark),
    onToggleTruncateBase64: () => settings.setTruncateBase64(!state.truncateBase64),
    onToggleUseDefaultPatterns: () => settings.setUseDefaultPatterns(!state.useDefaultPatterns),
    onToggleUseGitignore: () => settings.setUseGitignore(!state.useGitignore),
    onToggleWordWrap: () => settings.setWordWrap(!state.wordWrap),
  };

  const handleDragEnter = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      if (!isFileDragEvent(event)) {
        return;
      }

      dragDepthRef.current += 1;
      handlers.setIsDragging(true);
    },
    [handlers]
  );

  const handleDragOver = React.useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDragLeave = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      if (!isFileDragEvent(event)) {
        return;
      }

      dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
      if (dragDepthRef.current === 0) {
        handlers.setIsDragging(false);
      }
    },
    [handlers]
  );

  const handleDrop = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      dragDepthRef.current = 0;
      handlers.setIsDragging(false);
      handlers.handleDrop(event);
    },
    [handlers]
  );

  return (
    <div
      className="flex flex-col h-full bg-light-bg dark:bg-dark-bg"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      role="application"
      aria-label="Structure Insight 代码分析工具"
      aria-busy={state.isLoading || state.isExporting}
    >
      {/* Loading progress bar */}
      {(state.isLoading || state.isExporting) && (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-light-border dark:bg-dark-border overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary via-cyan-500 to-amber-400 transition-[width] duration-150 ease-out"
            style={{ width: getProgressWidth(state.progressMessage) }}
          />
        </div>
      )}
      <Header
        onOpenFolder={handlers.handleFileSelect}
        onCopyAll={handlers.handleCopyAll}
        onSave={handlers.handleSave}
        onReset={handlers.handleReset}
        onCancel={handlers.handleCancel}
        onSettings={() => handlers.setIsSettingsOpen(true)}
        onToggleShortcuts={() => handlers.setIsShortcutsOpen(true)}
        onToggleSearch={() => handlers.setIsSearchOpen(true)}
        onToggleFileRank={() => handlers.setIsFileRankOpen(true)}
        onShowCode={() => handlers.setActiveView('code')}
        onShowStructure={() => handlers.setActiveView('structure')}
        hasContent={!!state.processedData}
        busyState={state.isLoading ? 'loading' : state.isExporting ? 'exporting' : null}
        activeView={state.activeView}
      />

      <MainContent state={state} handlers={handlers} codeViewRef={codeViewRef} leftPanelRef={leftPanelRef} />

      {state.processedData && (
        <StatusBar
          fileCount={state.stats.fileCount}
          totalLines={state.stats.totalLines}
          totalChars={state.stats.totalChars}
          selectedFileName={state.selectedFile?.path.split('/').pop()}
          isDark={state.isDark}
          processedData={state.processedData}
          onShowSecurityFindings={() => handlers.setIsSecurityFindingsOpen(true)}
        />
      )}

      <ConfirmationDialog
        isOpen={state.confirmation.isOpen}
        onClose={() => handlers.setConfirmation((c) => ({ ...c, isOpen: false }))}
        onConfirm={state.confirmation.onConfirm}
        title={state.confirmation.title}
        message={state.confirmation.message}
      />

      {state.isSearchOpen && (
        <React.Suspense fallback={<SuspenseFallback />}>
          <SearchDialog
            onClose={() => handlers.setIsSearchOpen(false)}
            onSearch={handlers.handleSearch}
            onNavigate={handlers.handleNavigate}
            resultsCount={state.searchResults.length}
            currentIndex={state.activeResultIndex}
          />
        </React.Suspense>
      )}

      {state.isFileRankOpen && (
        <React.Suspense fallback={<SuspenseFallback />}>
          <FileRankDialog
            isOpen={state.isFileRankOpen}
            onClose={() => handlers.setIsFileRankOpen(false)}
            files={state.processedData?.fileContents || []}
            onSelectFile={handlers.handleFileTreeSelect}
            onCopyPath={handlers.handleCopyPath}
            onDeleteFile={handlers.handleDeleteFile}
            onToggleExclude={handlers.handleToggleExclude}
          />
        </React.Suspense>
      )}

      {state.isSettingsOpen && (
        <React.Suspense fallback={<SuspenseFallback />}>
          <SettingsDialog
            isOpen={state.isSettingsOpen}
            onClose={() => handlers.setIsSettingsOpen(false)}
            values={settingsDialogValues}
            actions={settingsDialogActions}
          />
        </React.Suspense>
      )}
      {state.isShortcutsOpen && (
        <React.Suspense fallback={<SuspenseFallback />}>
          <KeyboardShortcutsDialog isOpen={state.isShortcutsOpen} onClose={() => handlers.setIsShortcutsOpen(false)} />
        </React.Suspense>
      )}
      {state.isSecurityFindingsOpen && (
        <React.Suspense fallback={<SuspenseFallback />}>
          <SecurityFindingsDialog
            isOpen={state.isSecurityFindingsOpen}
            onClose={() => handlers.setIsSecurityFindingsOpen(false)}
            findings={state.processedData?.securityFindings ?? []}
          />
        </React.Suspense>
      )}
      {state.toastMessage && (
        <Toast message={state.toastMessage} onDone={() => handlers.setToastMessage(null)} type={state.toastType} />
      )}
    </div>
  );
};

export default App;
