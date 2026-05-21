import type { SettingsSectionDefinition } from './types';

export const SETTINGS_SECTIONS: SettingsSectionDefinition[] = [
    {
        id: 'workspace',
        label: '工作区',
        title: '工作区设置',
        icon: 'fa-sliders',
    },
    {
        id: 'export',
        label: '导出',
        title: '导出设置',
        icon: 'fa-file-export',
    },
    {
        id: 'about',
        label: '关于',
        title: '项目与版本',
        icon: 'fa-circle-info',
    },
];

