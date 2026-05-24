import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import SettingsDialog from './SettingsDialog';
import type { SettingsDialogProps } from './settings/types';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

beforeEach(() => {
  vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    json: async () => ({ stargazers_count: 128 }),
  } as Response);
});

function createSettingsDialogProps(
  overrides: Partial<Omit<SettingsDialogProps, 'actions' | 'values'>> & {
    actions?: Partial<SettingsDialogProps['actions']>;
    values?: Partial<SettingsDialogProps['values']>;
  } = {}
): SettingsDialogProps {
  const { actions: actionOverrides, values: valueOverrides, ...dialogOverrides } = overrides;

  return {
    isOpen: true,
    onClose: vi.fn(),
    ...dialogOverrides,
    values: {
      exportFormat: 'plain',
      exportHeaderText: '',
      exportInstructionText: '',
      exportSplitMaxChars: 0,
      extractContent: true,
      fontSize: 14,
      ignorePatterns: '',
      includeDirectoryStructure: true,
      includeEmptyDirectories: false,
      includeFileSummary: true,
      includePatterns: '',
      isDarkTheme: false,
      maxCharsThreshold: 0,
      removeEmptyLines: false,
      showLineNumbers: false,
      truncateBase64: false,
      useDefaultPatterns: true,
      useGitignore: true,
      wordWrap: false,
      ...valueOverrides,
    },
    actions: {
      onClearCache: vi.fn(),
      onSetExportFormat: vi.fn(),
      onSetExportHeaderText: vi.fn(),
      onSetExportInstructionText: vi.fn(),
      onSetExportSplitMaxChars: vi.fn(),
      onSetFontSize: vi.fn(),
      onSetIgnorePatterns: vi.fn(),
      onSetIncludePatterns: vi.fn(),
      onSetMaxCharsThreshold: vi.fn(),
      onToggleExtractContent: vi.fn(),
      onToggleIncludeDirectoryStructure: vi.fn(),
      onToggleIncludeEmptyDirectories: vi.fn(),
      onToggleIncludeFileSummary: vi.fn(),
      onToggleRemoveEmptyLines: vi.fn(),
      onToggleShowLineNumbers: vi.fn(),
      onToggleTheme: vi.fn(),
      onToggleTruncateBase64: vi.fn(),
      onToggleUseDefaultPatterns: vi.fn(),
      onToggleUseGitignore: vi.fn(),
      onToggleWordWrap: vi.fn(),
      ...actionOverrides,
    },
  };
}

function renderDialog() {
  return render(<SettingsDialog {...createSettingsDialogProps()} />);
}

describe('SettingsDialog', () => {
  it('renders an app-style settings shell with a sidebar close button and wide modal surface', () => {
    const { container } = renderDialog();

    expect(screen.queryByText('菜单')).toBeNull();
    expect(screen.getByRole('button', { name: '关闭设置' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 2, name: '工作区设置' })).toBeTruthy();
    expect(screen.queryByText(/All-Model-Chat/)).toBeNull();

    const dialogSurface = container.querySelector('.max-w-6xl');
    expect(dialogSurface).toBeTruthy();
    expect(dialogSurface?.className).toContain('sm:w-[90vw]');
    expect(dialogSurface?.className).toContain('sm:h-[85vh]');
    expect(dialogSurface?.className).toContain('md:flex-row');
  });

  it('uses section navigation to switch between workspace, export, and about content', () => {
    renderDialog();

    expect(screen.getByRole('tablist', { name: '设置导航' })).toBeTruthy();
    expect(screen.getByRole('tab', { name: '工作区' }).getAttribute('aria-selected')).toBe('true');
    expect(screen.getByRole('heading', { level: 2, name: '工作区设置' })).toBeTruthy();
    expect(screen.queryByText('显示统计信息')).toBeNull();
    expect(screen.queryByText('阅读体验、本地处理和缓存管理。')).toBeNull();
    expect(screen.queryByText('导出设置')).toBeNull();

    fireEvent.click(screen.getByRole('tab', { name: '导出' }));

    expect(screen.getByRole('tab', { name: '导出' }).getAttribute('aria-selected')).toBe('true');
    expect(screen.getByRole('heading', { level: 2, name: '导出设置' })).toBeTruthy();
    expect(screen.queryByText('工作区设置')).toBeNull();

    fireEvent.click(screen.getByRole('tab', { name: '关于' }));

    expect(screen.getByRole('tab', { name: '关于' }).getAttribute('aria-selected')).toBe('true');
    expect(screen.getByRole('heading', { level: 2, name: '项目与版本' })).toBeTruthy();
    expect(screen.queryByText('导出设置')).toBeNull();
  });

  it('makes export line-number scope explicit', () => {
    renderDialog();

    fireEvent.click(screen.getByRole('tab', { name: '导出' }));

    expect(screen.getByText('导出时显示行号')).toBeTruthy();
    expect(screen.queryByText('显示行号')).toBeNull();
  });

  it('renders the about tab as a centered product showcase', () => {
    renderDialog();

    fireEvent.click(screen.getByRole('tab', { name: '关于' }));

    const logo = screen.getByAltText('Structure Insight Logo');

    expect(logo.getAttribute('src')).toBe('/icon.svg');
    expect(logo.parentElement?.className).not.toContain('bg-gradient-to-br');
    expect(screen.getByText('Structure Insight')).toBeTruthy();
    expect(screen.getByText('v5.4.0')).toBeTruthy();
    expect(screen.getByRole('link', { name: '查看 GitHub' })).toBeTruthy();
    expect(screen.queryByText(/All-Model-Chat/)).toBeNull();
  });

  it('fetches GitHub stars only when the about tab is opened', async () => {
    renderDialog();

    expect(globalThis.fetch).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('tab', { name: '导出' }));
    expect(globalThis.fetch).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('tab', { name: '关于' }));

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    });
  });

  it('keeps the current section when the parent rerenders while the dialog stays open', async () => {
    const props = createSettingsDialogProps({ onClose: () => {} });

    const { rerender } = render(<SettingsDialog {...props} />);

    fireEvent.click(screen.getByRole('tab', { name: '导出' }));
    expect(screen.getByRole('heading', { level: 2, name: '导出设置' })).toBeTruthy();

    rerender(<SettingsDialog {...props} values={{ ...props.values, showLineNumbers: true }} />);

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: '导出' }).getAttribute('aria-selected')).toBe('true');
      expect(screen.getByRole('heading', { level: 2, name: '导出设置' })).toBeTruthy();
    });
  });

  it('keeps focus in export text fields after typing updates settings', () => {
    const StatefulDialog = () => {
      const [exportHeaderText, setExportHeaderText] = React.useState('');

      return (
        <SettingsDialog
          {...createSettingsDialogProps({
            values: { exportHeaderText },
            actions: { onSetExportHeaderText: setExportHeaderText },
          })}
        />
      );
    };

    render(<StatefulDialog />);

    fireEvent.click(screen.getByRole('tab', { name: '导出' }));

    const headerField = screen.getByPlaceholderText('例如：请先理解项目结构，再指出最值得优先重构的模块。');
    headerField.focus();

    fireEvent.change(headerField, { target: { value: 'Keep typing' } });

    expect(document.activeElement).toBe(headerField);
  });
});
