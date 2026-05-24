import React from 'react';
import InitialPrompt from './InitialPrompt';
import TabBar from './TabBar';
import ScrollSlider from './ScrollSlider';
import ScrollToTopButton from './ScrollToTopButton';
import type { MainContentProps } from './MainContent.types';
import { collectFileTypeCounts, FileTypeFilterToolbar, filterTreeByFileType } from './FileTypeFilterToolbar';
import { getFileTypeLabel } from '../services/fileTypeLabel';

export type { MainContentHandlers, MainContentState } from './MainContent.types';

const FileTree = React.lazy(() => import('./FileTree'));
const CodeView = React.lazy(() => import('./CodeView'));
const StructureView = React.lazy(() => import('./StructureView'));

const LoadingIndicator: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center h-full text-center p-4">
    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-primary/20 bg-primary/5 text-primary">
      <i className="fa-solid fa-folder-tree text-2xl"></i>
    </div>
    <p className="text-lg font-semibold mb-2">正在处理文件...</p>
    <p className="text-sm text-light-subtle-text dark:text-dark-subtle-text max-w-xs truncate">{message}</p>
  </div>
);

const SuspenseFallback: React.FC = () => (
  <div className="flex items-center justify-center h-full text-sm text-light-subtle-text dark:text-dark-subtle-text">
    正在加载视图...
  </div>
);

const MainContent: React.FC<MainContentProps> = ({ state, handlers, codeViewRef, leftPanelRef }) => {
  const { isMobile } = state;
  const fileTreeScrollRef = React.useRef<HTMLElement | null>(null);
  const [filterType, setFilterType] = React.useState<string | null>(null);

  const treeData = React.useMemo(() => state.processedData?.treeData ?? [], [state.processedData]);
  const fileTypes = React.useMemo(() => collectFileTypeCounts(treeData), [treeData]);
  const activeFilterType =
    filterType && fileTypes.some((fileType) => fileType.label === filterType) ? filterType : null;
  const filteredNodes = React.useMemo(
    () => filterTreeByFileType(treeData, activeFilterType),
    [treeData, activeFilterType]
  );
  const hiddenSelectedFileName = React.useMemo(() => {
    if (!activeFilterType || !state.selectedFilePath) {
      return null;
    }

    if (getFileTypeLabel(state.selectedFilePath) === activeFilterType) {
      return null;
    }

    return state.selectedFilePath.split('/').pop() ?? state.selectedFilePath;
  }, [activeFilterType, state.selectedFilePath]);

  React.useEffect(() => {
    if (filterType && activeFilterType === null) {
      setFilterType(null);
    }
  }, [activeFilterType, filterType]);

  const mobileFabIcon = () => {
    if (!state.processedData) return 'fa-list-ul';
    switch (state.mobileView) {
      case 'editor':
        return 'fa-list-ul';
      case 'tree':
        return 'fa-code';
      default:
        return 'fa-list-ul';
    }
  };

  return (
    <main className="flex-1 flex overflow-hidden relative">
      {state.isDragging && (
        <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center bg-white/70 dark:bg-dark-bg/70">
          <div className="border-4 border-dashed border-primary/60 rounded-2xl p-12 flex flex-col items-center gap-4 max-w-md mx-4">
            <i className="fa-solid fa-cloud-arrow-up text-5xl text-primary" />
            <p className="text-xl font-bold text-light-text dark:text-dark-text">拖放文件夹或 .zip 文件</p>
            <p className="text-sm text-light-subtle-text dark:text-dark-subtle-text">支持任意代码项目</p>
          </div>
        </div>
      )}

      {isMobile ? (
        <div className="relative w-full h-full overflow-hidden">
          {state.mobileView === 'tree' && state.processedData && (
            <div className="absolute inset-0 h-full bg-light-panel dark:bg-dark-panel flex flex-col">
              <FileTypeFilterToolbar
                fileTypes={fileTypes}
                activeFilterType={activeFilterType}
                hiddenSelectedFileName={hiddenSelectedFileName}
                onSelectFileType={setFilterType}
              />
              <div className="flex-1 min-h-0">
                <React.Suspense fallback={<SuspenseFallback />}>
                  <FileTree
                    nodes={filteredNodes}
                    treeResetKey={state.lastProcessedFiles}
                    onFileSelect={handlers.handleFileTreeSelect}
                    onDeleteFile={handlers.handleDeleteFile}
                    onCopyPath={handlers.handleCopyPath}
                    onToggleExclude={handlers.handleToggleExclude}
                    selectedFilePath={state.selectedFilePath}
                  />
                </React.Suspense>
              </div>
            </div>
          )}
          {state.mobileView === 'editor' && (
            <div className="absolute inset-0 h-full flex flex-col">
              {state.processedData && state.openFiles.length > 0 && (
                <TabBar
                  openFiles={state.openFiles}
                  selectedFilePath={state.selectedFilePath}
                  onTabSelect={handlers.handleFileTreeSelect}
                  onCloseTab={handlers.closeTab}
                />
              )}
              {state.isLoading ? (
                <LoadingIndicator message={state.progressMessage} />
              ) : state.processedData ? (
                <div ref={codeViewRef} className="flex-1 overflow-y-auto">
                  {state.activeView === 'structure' ? (
                    <React.Suspense fallback={<SuspenseFallback />}>
                      <StructureView
                        structureString={state.processedData.structureString}
                        fontSize={state.fontSize}
                        onShowToast={(msg) => handlers.setToastMessage(msg)}
                      />
                    </React.Suspense>
                  ) : (
                    <React.Suspense fallback={<SuspenseFallback />}>
                      <CodeView
                        selectedFile={state.selectedFile}
                        editingPath={state.editingPath}
                        onStartEdit={handlers.setEditingPath}
                        onSaveEdit={handlers.handleSaveEdit}
                        onCancelEdit={() => handlers.setEditingPath(null)}
                        markdownPreviewPaths={state.markdownPreviewPaths}
                        onToggleMarkdownPreview={handlers.handleToggleMarkdownPreview}
                        onShowToast={(msg) => handlers.setToastMessage(msg)}
                        fontSize={state.fontSize}
                        searchQuery={state.searchQuery}
                        searchOptions={state.searchOptions}
                        activeMatchIndexInFile={state.activeMatchIndexInFile}
                        onCopyPath={handlers.handleCopyPath}
                        wordWrap={state.wordWrap}
                      />
                    </React.Suspense>
                  )}
                </div>
              ) : (
                <div className="flex-1">
                  <InitialPrompt
                    onOpenFolder={handlers.handleFileSelect}
                    onOpenRecentProject={handlers.handleRecentProjectSelect}
                    recentProjects={state.recentProjects}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      ) : state.processedData ? (
        <>
          <div
            ref={leftPanelRef}
            className="relative h-full bg-light-panel dark:bg-dark-panel flex flex-col"
            style={{ width: `${state.panelWidth}%` }}
          >
            <div className="flex-1 min-h-0 flex flex-col">
              <FileTypeFilterToolbar
                fileTypes={fileTypes}
                activeFilterType={activeFilterType}
                hiddenSelectedFileName={hiddenSelectedFileName}
                onSelectFileType={setFilterType}
              />
              <div className="relative flex-1 min-h-0">
                <React.Suspense fallback={<SuspenseFallback />}>
                  <FileTree
                    nodes={filteredNodes}
                    treeResetKey={state.lastProcessedFiles}
                    scrollContainerRef={fileTreeScrollRef}
                    onFileSelect={handlers.handleFileTreeSelect}
                    onDeleteFile={handlers.handleDeleteFile}
                    onCopyPath={handlers.handleCopyPath}
                    onToggleExclude={handlers.handleToggleExclude}
                    selectedFilePath={state.selectedFilePath}
                  />
                </React.Suspense>
              </div>
            </div>
            <ScrollSlider scrollRef={fileTreeScrollRef} />
          </div>
          <div onMouseDown={handlers.handleMouseDownResize} className="w-1.5 h-full cursor-col-resize group z-10">
            <div className="w-full h-full bg-light-border dark:bg-dark-border group-hover:bg-primary transition-colors duration-200" />
          </div>
          <div className="flex-1 h-full overflow-hidden bg-light-bg dark:bg-dark-bg flex flex-col">
            {state.openFiles.length > 0 && (
              <TabBar
                openFiles={state.openFiles}
                selectedFilePath={state.selectedFilePath}
                onTabSelect={handlers.handleFileTreeSelect}
                onCloseTab={handlers.closeTab}
              />
            )}
            <div className="flex-1 h-full flex flex-col min-w-0">
              {state.isLoading ? (
                <LoadingIndicator message={state.progressMessage} />
              ) : (
                <div className="relative flex-1 min-h-0">
                  <div ref={codeViewRef} className="h-full overflow-y-auto no-scrollbar">
                    <div className={state.activeView === 'code' ? 'block min-h-full' : 'hidden'}>
                      <React.Suspense fallback={<SuspenseFallback />}>
                        <CodeView
                          selectedFile={state.selectedFile}
                          editingPath={state.editingPath}
                          markdownPreviewPaths={state.markdownPreviewPaths}
                          onStartEdit={handlers.setEditingPath}
                          onSaveEdit={handlers.handleSaveEdit}
                          onCancelEdit={() => handlers.setEditingPath(null)}
                          onToggleMarkdownPreview={handlers.handleToggleMarkdownPreview}
                          onShowToast={(msg) => handlers.setToastMessage(msg)}
                          fontSize={state.fontSize}
                          searchQuery={state.searchQuery}
                          searchOptions={state.searchOptions}
                          activeMatchIndexInFile={state.activeMatchIndexInFile}
                          onCopyPath={handlers.handleCopyPath}
                          wordWrap={state.wordWrap}
                        />
                      </React.Suspense>
                    </div>
                    <div className={state.activeView === 'structure' ? 'block min-h-full' : 'hidden'}>
                      <React.Suspense fallback={<SuspenseFallback />}>
                        <StructureView
                          structureString={state.processedData.structureString}
                          fontSize={state.fontSize}
                          onShowToast={(msg) => handlers.setToastMessage(msg)}
                        />
                      </React.Suspense>
                    </div>
                  </div>
                  <ScrollSlider scrollRef={codeViewRef} />
                  <ScrollToTopButton targetRef={codeViewRef} />
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 min-w-0 bg-light-bg dark:bg-dark-bg">
          <InitialPrompt
            onOpenFolder={handlers.handleFileSelect}
            onOpenRecentProject={handlers.handleRecentProjectSelect}
            recentProjects={state.recentProjects}
          />
        </div>
      )}
      {isMobile && state.processedData && (
        <button
          onClick={handlers.handleMobileViewToggle}
          aria-label={state.mobileView === 'tree' ? '切换到代码视图' : '切换到文件树'}
          className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center z-20"
        >
          <i className={`fa-solid ${mobileFabIcon()} text-xl`}></i>
        </button>
      )}
    </main>
  );
};

export default React.memo(MainContent);
