import type { ExportFormat } from '../../services/exportTypes';
import { Field, SectionGroup, SettingsRow, Toggle } from './SettingsControls';
import type { SettingsDialogProps } from './types';

interface ExportSettingsSectionProps {
  settings: SettingsDialogProps;
}

export const ExportSettingsSection = ({ settings }: ExportSettingsSectionProps) => {
  const { actions, values } = settings;

  return (
    <div className="max-w-3xl mx-auto w-full space-y-6">
      <SectionGroup title="导出结构" icon="fa-layer-group">
        <SettingsRow label="导出格式" description="决定上下文输出的最终载体。">
          <div className="w-full sm:w-64">
            <select
              id="export-format-select"
              value={values.exportFormat}
              onChange={(event) => actions.onSetExportFormat(event.target.value as ExportFormat)}
              className="w-full rounded-lg border border-light-border bg-light-bg px-3 py-2.5 text-sm text-light-text outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20 dark:border-dark-border dark:bg-slate-950 dark:text-dark-text"
            >
              <option value="plain">Plain</option>
              <option value="xml">XML</option>
              <option value="markdown">Markdown</option>
              <option value="json">JSON</option>
            </select>
          </div>
        </SettingsRow>
        <SettingsRow
          label="文件摘要"
          description="在导出开头保留概览信息。"
          control={
            <Toggle
              id="file-summary-toggle"
              label="文件摘要"
              checked={values.includeFileSummary}
              onChange={actions.onToggleIncludeFileSummary}
            />
          }
        />
        <SettingsRow
          label="目录结构"
          description="保留完整目录树，方便快速理解仓库轮廓。"
          control={
            <Toggle
              id="directory-structure-toggle"
              label="目录结构"
              checked={values.includeDirectoryStructure}
              onChange={actions.onToggleIncludeDirectoryStructure}
            />
          }
        />
      </SectionGroup>

      <SectionGroup title="内容处理" icon="fa-wand-magic-sparkles">
        <SettingsRow
          label="导出时显示行号"
          description="只影响导出正文；代码预览保留阅读行号，便于定位。"
          control={
            <Toggle
              id="line-numbers-toggle"
              label="导出时显示行号"
              checked={values.showLineNumbers}
              onChange={actions.onToggleShowLineNumbers}
            />
          }
        />
        <SettingsRow
          label="移除空行"
          description="收紧输出内容的空白体积。"
          control={
            <Toggle
              id="remove-empty-lines-toggle"
              label="移除空行"
              checked={values.removeEmptyLines}
              onChange={actions.onToggleRemoveEmptyLines}
            />
          }
        />
        <SettingsRow
          label="截断 Base64"
          description="避免长 data URL 直接淹没上下文。"
          control={
            <Toggle
              id="truncate-base64-toggle"
              label="截断 Base64"
              checked={values.truncateBase64}
              onChange={actions.onToggleTruncateBase64}
            />
          }
        />
        <SettingsRow label="拆分阈值" description="大于 0 时按字符数自动拆分导出文件。">
          <div className="w-full sm:w-48">
            <Field
              id="export-split-max-chars"
              type="number"
              min={0}
              value={values.exportSplitMaxChars}
              onChange={(value) => actions.onSetExportSplitMaxChars(Math.max(0, Number(value) || 0))}
            />
          </div>
        </SettingsRow>
      </SectionGroup>

      <SectionGroup title="过滤规则" icon="fa-filter">
        <SettingsRow label="包含模式" description="例如 `src/**/*.ts`、`docs/**`。" stacked>
          <Field
            id="include-patterns"
            value={values.includePatterns}
            onChange={actions.onSetIncludePatterns}
            placeholder="例如 src/**/*.ts,docs/**"
          />
        </SettingsRow>
        <SettingsRow label="忽略模式" description="例如 `**/*.test.ts`、`dist/**`。" stacked>
          <Field
            id="ignore-patterns"
            value={values.ignorePatterns}
            onChange={actions.onSetIgnorePatterns}
            placeholder="例如 **/*.test.ts,dist/**"
          />
        </SettingsRow>
        <SettingsRow
          label="默认忽略规则"
          description="使用内置忽略模式。"
          control={
            <Toggle
              id="default-patterns-toggle"
              label="默认忽略规则"
              checked={values.useDefaultPatterns}
              onChange={actions.onToggleUseDefaultPatterns}
            />
          }
        />
        <SettingsRow
          label="应用忽略文件"
          description="复用项目里的 `.gitignore`、`.ignore` 与 `.repomixignore` 规则。"
          control={
            <Toggle
              id="gitignore-toggle"
              label="应用忽略文件"
              checked={values.useGitignore}
              onChange={actions.onToggleUseGitignore}
            />
          }
        />
        <SettingsRow
          label="包含空目录"
          description="导出目录树时保留空目录节点。"
          control={
            <Toggle
              id="empty-directories-toggle"
              label="包含空目录"
              checked={values.includeEmptyDirectories}
              onChange={actions.onToggleIncludeEmptyDirectories}
            />
          }
        />
      </SectionGroup>

      <SectionGroup title="附加说明" icon="fa-pen-ruler">
        <SettingsRow label="头部说明" description="适合放项目背景、任务上下文或外部限制。" stacked>
          <Field
            id="export-header-text"
            multiline
            rows={3}
            value={values.exportHeaderText}
            onChange={actions.onSetExportHeaderText}
            placeholder="例如：请先理解项目结构，再指出最值得优先重构的模块。"
          />
        </SettingsRow>
        <SettingsRow label="指令说明" description="适合告诉 AI 希望得到的输出形式。" stacked>
          <Field
            id="export-instruction-text"
            multiline
            rows={3}
            value={values.exportInstructionText}
            onChange={actions.onSetExportInstructionText}
            placeholder="例如：先列 P0 / P1 问题，再给可执行的修改方案。"
          />
        </SettingsRow>
      </SectionGroup>
    </div>
  );
};
