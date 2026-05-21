import { Field, SectionGroup, SettingsRow, Toggle } from './SettingsControls';
import type { SettingsDialogProps } from './types';

interface WorkspaceSettingsSectionProps {
    settings: SettingsDialogProps;
}

const ThemeSegmentedControl = ({
    isDarkTheme,
    onToggleTheme,
}: Pick<SettingsDialogProps, 'isDarkTheme' | 'onToggleTheme'>) => (
    <div className="inline-flex rounded-lg border border-light-border bg-light-bg p-1 dark:border-dark-border dark:bg-slate-950">
        {[
            { id: 'light', label: '浅色', active: !isDarkTheme },
            { id: 'dark', label: '深色', active: isDarkTheme },
        ].map(option => (
            <button
                key={option.id}
                type="button"
                onClick={() => {
                    if (option.active) {
                        return;
                    }
                    onToggleTheme();
                }}
                className={[
                    'rounded-md px-3 py-1.5 text-xs font-semibold transition-colors',
                    option.active
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-light-subtle-text hover:text-light-text dark:text-dark-subtle-text dark:hover:text-dark-text',
                ].join(' ')}
            >
                {option.label}
            </button>
        ))}
    </div>
);

export const WorkspaceSettingsSection = ({ settings }: WorkspaceSettingsSectionProps) => {
    const maxCharsThresholdInKb = Math.round(settings.maxCharsThreshold / 1024);

    return (
        <div className="max-w-3xl mx-auto w-full space-y-6">
            <SectionGroup title="外观" icon="fa-palette">
                <SettingsRow label="主题模式" description="在浅色与深色阅读环境之间快速切换。">
                    <ThemeSegmentedControl
                        isDarkTheme={settings.isDarkTheme}
                        onToggleTheme={settings.onToggleTheme}
                    />
                </SettingsRow>
                <SettingsRow label="字体大小" description="即时调整阅读密度。" stacked>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-light-subtle-text dark:text-dark-subtle-text">
                                阅读尺寸
                            </span>
                            <span className="rounded-md bg-light-bg px-2 py-0.5 font-mono text-sm text-primary dark:bg-slate-950">
                                {settings.fontSize}px
                            </span>
                        </div>
                        <input
                            type="range"
                            id="font-size-slider"
                            min="10"
                            max="24"
                            step="1"
                            value={settings.fontSize}
                            onChange={(event) => settings.onSetFontSize(Number(event.target.value))}
                            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-light-border accent-primary dark:bg-dark-border"
                        />
                        <div className="flex justify-between px-1 text-[11px] font-mono text-light-subtle-text dark:text-dark-subtle-text">
                            <span>10px</span>
                            <span>17px</span>
                            <span>24px</span>
                        </div>
                    </div>
                </SettingsRow>
            </SectionGroup>

            <SectionGroup title="工作区行为" icon="fa-folder-tree">
                <SettingsRow
                    label="自动换行"
                    description="减少代码横向滚动，更接近聊天产品里的阅读方式。"
                    control={<Toggle id="word-wrap-toggle" label="自动换行" checked={settings.wordWrap} onChange={settings.onToggleWordWrap} />}
                />
                <SettingsRow
                    label="提取文件内容"
                    description="关闭后仅分析结构，适合体量更大的仓库。"
                    control={<Toggle id="extract-toggle" label="提取文件内容" checked={settings.extractContent} onChange={settings.onToggleExtractContent} />}
                />
                <SettingsRow label="大文件阈值" description="超过阈值时只保留路径，不提取正文。">
                    <div className="flex items-center gap-2">
                        <div className="w-24">
                            <Field
                                id="max-chars-input"
                                type="number"
                                min={0}
                                value={maxCharsThresholdInKb}
                                onChange={(value) => settings.onSetMaxCharsThreshold((Math.max(0, Number(value) || 0)) * 1024)}
                            />
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-light-subtle-text dark:text-dark-subtle-text">
                            KB
                        </span>
                    </div>
                </SettingsRow>
            </SectionGroup>

            <section className="rounded-2xl bg-gradient-to-br from-red-600 to-red-700 p-5 text-white shadow-lg shadow-red-900/20">
                <div className="mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
                    <i className="fa-solid fa-triangle-exclamation w-4 text-center" />
                    <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-white">Danger Zone</h4>
                </div>
                <div className="divide-y divide-white/10">
                    <div className="flex items-center justify-between gap-4 py-3">
                        <div>
                            <div className="text-sm font-semibold text-white">清除缓存</div>
                            <p className="mt-0.5 text-xs leading-5 text-white/75">重置所有本地设置与缓存项目数据。</p>
                        </div>
                        <button
                            type="button"
                            onClick={settings.onClearCache}
                            className="rounded-lg border border-white/20 bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-white/40"
                        >
                            清除缓存
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

