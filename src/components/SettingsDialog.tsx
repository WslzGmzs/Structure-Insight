import React from 'react';
import { AboutSettingsSection } from './settings/AboutSettingsSection';
import { ExportSettingsSection } from './settings/ExportSettingsSection';
import { SETTINGS_SECTIONS } from './settings/settingsSections';
import { SettingsSidebar } from './settings/SettingsSidebar';
import type { SettingsDialogProps, SettingsSectionId } from './settings/types';
import { useGitHubStars } from './settings/useGitHubStars';
import { WorkspaceSettingsSection } from './settings/WorkspaceSettingsSection';

const SettingsDialog: React.FC<SettingsDialogProps> = (settings) => {
    const { isOpen, onClose } = settings;
    const [activeSection, setActiveSection] = React.useState<SettingsSectionId>('workspace');
    const { stars, starsLoading } = useGitHubStars(isOpen, activeSection);

    React.useEffect(() => {
        if (isOpen) {
            setActiveSection('workspace');
        }
    }, [isOpen]);

    React.useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    const currentSection = SETTINGS_SECTIONS.find(section => section.id === activeSection) ?? SETTINGS_SECTIONS[0];
    const panelId = `settings-panel-${activeSection}`;
    const panelLabelId = `settings-tab-${activeSection}`;

    const renderSectionContent = () => {
        switch (activeSection) {
            case 'workspace':
                return <WorkspaceSettingsSection settings={settings} />;
            case 'export':
                return <ExportSettingsSection settings={settings} />;
            case 'about':
                return <AboutSettingsSection stars={stars} starsLoading={starsLoading} />;
            default:
                return <WorkspaceSettingsSection settings={settings} />;
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            onClick={onClose}
        >
            <div
                className="w-full h-[100dvh] sm:h-[85vh] sm:w-[90vw] max-w-6xl overflow-hidden bg-light-panel shadow-2xl sm:rounded-xl dark:bg-slate-950 md:flex md:flex-row"
                onClick={(event) => event.stopPropagation()}
            >
                <SettingsSidebar
                    activeSection={activeSection}
                    sections={SETTINGS_SECTIONS}
                    onClose={onClose}
                    onSelectSection={setActiveSection}
                />

                <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-light-bg dark:bg-slate-950">
                    <header className="hidden flex-shrink-0 items-center px-8 py-6 md:flex">
                        <h2 className="text-2xl font-bold tracking-tight text-light-text dark:text-dark-text">
                            {currentSection.title}
                        </h2>
                    </header>

                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 no-scrollbar">
                        <section
                            id={panelId}
                            role="tabpanel"
                            aria-labelledby={panelLabelId}
                            className="space-y-4"
                        >
                            {renderSectionContent()}
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default React.memo(SettingsDialog);
