import { APP_ISSUES_URL, APP_NAME, APP_REPOSITORY_URL, APP_VERSION } from '../../services/appMetadata';

interface AboutSettingsSectionProps {
  stars: number | null;
  starsLoading: boolean;
}

const iconUrl = `${import.meta.env.BASE_URL}icon.svg`;

export const AboutSettingsSection = ({ stars, starsLoading }: AboutSettingsSectionProps) => {
  const starStatusText = starsLoading
    ? '正在获取 GitHub 数据…'
    : stars !== null
      ? `${stars.toLocaleString()} Stars`
      : 'GitHub 数据暂不可用';

  return (
    <div className="flex min-h-full flex-col items-center px-4 py-3 text-center">
      <div className="relative">
        <img
          src={iconUrl}
          alt={`${APP_NAME} Logo`}
          className="h-24 w-24 rounded-[28px] drop-shadow-[0_18px_40px_rgba(15,23,42,0.18)]"
        />
      </div>

      <div className="mt-5 max-w-xl space-y-4">
        <h3 className="text-[1.9rem] font-bold tracking-tight text-light-text dark:text-dark-text">{APP_NAME}</h3>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <div className="inline-flex items-center gap-3 rounded-full border border-light-border bg-light-panel px-4 py-2 shadow-sm dark:border-dark-border dark:bg-slate-900">
            <span className="font-mono text-sm font-bold text-light-text dark:text-dark-text">v{APP_VERSION}</span>
            <span className="h-3.5 w-px bg-light-border dark:bg-dark-border" />
            <span className="inline-flex items-center gap-2 text-xs font-medium text-light-subtle-text dark:text-dark-subtle-text">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {starStatusText}
            </span>
          </div>
        </div>

        <p className="text-sm leading-6 text-light-subtle-text dark:text-dark-subtle-text">
          面向代码结构理解、项目导出与目录探索的本地工作台。设置面板围绕导入、阅读和导出流程组织，
          让常用调整更容易扫描，也保持控件层级一致。
        </p>
      </div>

      <div className="mt-5 flex w-full max-w-md flex-col items-stretch justify-center gap-2.5 sm:flex-row">
        <a
          href={APP_REPOSITORY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200"
        >
          <i className="fa-solid fa-code-branch text-sm" />
          <span>查看 GitHub</span>
        </a>
        <a
          href={APP_ISSUES_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-light-border bg-light-panel px-5 py-2.5 text-sm font-medium text-light-text shadow-sm hover:border-primary/30 hover:text-primary dark:border-dark-border dark:bg-slate-900 dark:text-dark-text dark:hover:border-primary/30 dark:hover:text-primary"
        >
          <i className="fa-solid fa-bug text-sm" />
          <span>反馈问题</span>
        </a>
      </div>
    </div>
  );
};
