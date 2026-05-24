import type { SettingsSectionDefinition, SettingsSectionId } from './types';

interface SettingsSidebarProps {
  activeSection: SettingsSectionId;
  sections: SettingsSectionDefinition[];
  onClose: () => void;
  onSelectSection: (sectionId: SettingsSectionId) => void;
}

const SidebarTabButton = ({
  section,
  activeSection,
  onSelectSection,
}: {
  section: SettingsSectionDefinition;
  activeSection: SettingsSectionId;
  onSelectSection: (sectionId: SettingsSectionId) => void;
}) => {
  const isActive = activeSection === section.id;

  return (
    <button
      id={`settings-tab-${section.id}`}
      type="button"
      role="tab"
      aria-label={section.label}
      aria-controls={`settings-panel-${section.id}`}
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      onClick={() => onSelectSection(section.id)}
      className={[
        'flex flex-shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors outline-none select-none',
        'w-auto md:w-full focus-visible:ring-2 focus-visible:ring-primary/50',
        isActive
          ? 'bg-light-bg text-light-text shadow-sm dark:bg-slate-900 dark:text-dark-text'
          : 'text-light-subtle-text hover:bg-light-hover hover:text-light-text dark:text-dark-subtle-text dark:hover:bg-slate-900/60 dark:hover:text-dark-text',
      ].join(' ')}
    >
      <i
        className={[
          'fa-solid w-4 text-center transition-colors',
          section.icon,
          isActive ? 'text-primary' : 'text-light-subtle-text dark:text-dark-subtle-text',
        ].join(' ')}
      />
      <span>{section.label}</span>
    </button>
  );
};

export const SettingsSidebar = ({ activeSection, sections, onClose, onSelectSection }: SettingsSidebarProps) => (
  <aside className="flex w-full flex-shrink-0 flex-col border-b border-light-border bg-light-header dark:border-dark-border dark:bg-slate-900 md:w-64 md:border-b-0 md:border-r">
    <div className="flex items-center justify-between px-4 py-3 md:px-5 md:py-5">
      <button
        type="button"
        onClick={onClose}
        aria-label="关闭设置"
        className="flex h-9 w-9 items-center justify-center rounded-md text-light-subtle-text transition hover:bg-light-hover hover:text-light-text focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-dark-subtle-text dark:hover:bg-slate-800 dark:hover:text-dark-text"
      >
        <i className="fa-solid fa-times" />
      </button>
      <span className="font-semibold text-light-text dark:text-dark-text md:hidden">设置</span>
      <div className="w-9 md:hidden" />
    </div>

    <nav
      role="tablist"
      aria-label="设置导航"
      className="flex flex-1 gap-1 overflow-x-auto px-2 pb-2 md:flex-col md:overflow-x-hidden md:overflow-y-auto md:px-3 md:pb-3"
    >
      {sections.map((section) => (
        <SidebarTabButton
          key={section.id}
          section={section}
          activeSection={activeSection}
          onSelectSection={onSelectSection}
        />
      ))}
    </nav>
  </aside>
);
