import { prepareExportData } from './exportData';
import type { BuildExportOutputParams, ExportArtifact } from './exportTypes';
import { generateRepomixPlainOutput } from './repomixPlainOutput';
import { renderJson } from './exportJsonRenderer';
import { renderMarkdown } from './exportMarkdownRenderer';
import { renderXml } from './exportXmlRenderer';

export type { BuildExportOutputParams, ExportArtifact, ExportFormat, ExportOptions } from './exportTypes';

export async function buildExportArtifact(params: BuildExportOutputParams): Promise<ExportArtifact> {
  const prepared = await prepareExportData(params);

  const output = (() => {
    switch (params.exportOptions.format) {
      case 'plain':
        return generateRepomixPlainOutput(prepared.data, params.exportOptions);
      case 'xml':
        return renderXml(prepared.data, params.exportOptions);
      case 'markdown':
        return renderMarkdown(prepared.data, params.exportOptions);
      case 'json':
        return renderJson(prepared.data, params.exportOptions);
      default:
        return generateRepomixPlainOutput(prepared.data, params.exportOptions);
    }
  })();

  return {
    output,
    analysisSummary: prepared.analysisSummary,
  };
}

export async function buildExportOutput(params: BuildExportOutputParams): Promise<string> {
  const artifact = await buildExportArtifact(params);
  return artifact.output;
}
