import React from 'react';
import type { ProcessedFiles } from '../types';

interface UseGlobalShortcutsParams {
  processedData: ProcessedFiles | null;
  isSearchOpen: boolean;
  isSettingsOpen: boolean;
  isFileRankOpen: boolean;
  isSecurityFindingsOpen: boolean;
  isShortcutsOpen: boolean;
  isLoading: boolean;
  selectedFilePath: string | null;
  setIsSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFileRankOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSecurityFindingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsShortcutsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSave: () => Promise<void>;
  handleFileSelect: () => void | Promise<void>;
  handleCancel: () => void;
  closeTab: (path: string) => void;
}

function isEditableEventTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName.toLowerCase();
  if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
    return true;
  }

  return target.isContentEditable || Boolean(target.closest('[contenteditable="true"]'));
}

function isHandledShortcutKey(key: string): boolean {
  return key === 'f' || key === 's' || key === 'o' || key === '/' || key === 'w';
}

export function useGlobalShortcuts({
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
}: UseGlobalShortcutsParams) {
  React.useEffect(() => {
    const handleGlobalKeys = (event: KeyboardEvent) => {
      const normalizedKey = event.key.toLowerCase();

      if (
        (event.ctrlKey || event.metaKey) &&
        isHandledShortcutKey(normalizedKey) &&
        !isEditableEventTarget(event.target)
      ) {
        event.preventDefault();

        if (normalizedKey === 'f' && processedData) setIsSearchOpen((prev) => !prev);
        if (normalizedKey === 's' && processedData) void handleSave();
        if (normalizedKey === 'o') void handleFileSelect();
        if (normalizedKey === '/') setIsShortcutsOpen((prev) => !prev);
        if (normalizedKey === 'w' && selectedFilePath) closeTab(selectedFilePath);
      }

      if (event.key === 'Escape') {
        if (isShortcutsOpen) {
          event.preventDefault();
          setIsShortcutsOpen(false);
        } else if (isSearchOpen) {
          event.preventDefault();
          setIsSearchOpen(false);
        } else if (isFileRankOpen) {
          event.preventDefault();
          setIsFileRankOpen(false);
        } else if (isSecurityFindingsOpen) {
          event.preventDefault();
          setIsSecurityFindingsOpen(false);
        } else if (isSettingsOpen) {
          event.preventDefault();
          setIsSettingsOpen(false);
        } else if (isLoading) {
          event.preventDefault();
          handleCancel();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, [
    closeTab,
    handleCancel,
    handleFileSelect,
    handleSave,
    isFileRankOpen,
    isLoading,
    isSearchOpen,
    isSecurityFindingsOpen,
    isSettingsOpen,
    isShortcutsOpen,
    processedData,
    selectedFilePath,
    setIsFileRankOpen,
    setIsSearchOpen,
    setIsSecurityFindingsOpen,
    setIsSettingsOpen,
    setIsShortcutsOpen,
  ]);
}
