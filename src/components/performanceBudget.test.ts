import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

function readSource(relativePath: string): string {
  return readFileSync(resolve(ROOT, relativePath), 'utf8');
}

describe('performance budget', () => {
  it('keeps framer-motion out of the main application interaction path', () => {
    const files = [
      'src/App.tsx',
      'src/components/MainContent.tsx',
      'src/components/InitialPrompt.tsx',
      'src/components/CodeView.tsx',
      'src/components/StructureView.tsx',
      'src/components/Toast.tsx',
      'src/components/ConfirmationDialog.tsx',
      'src/components/KeyboardShortcutsDialog.tsx',
      'src/components/SecurityFindingsDialog.tsx',
      'src/components/FileRankDialog.tsx',
      'src/components/ScrollToTopButton.tsx',
      'src/components/ScrollSlider.tsx',
      'src/components/SettingsDialog.tsx',
    ];

    for (const file of files) {
      expect(readSource(file), `${file} should not import framer-motion`).not.toContain('framer-motion');
    }
  });

  it('avoids heavy animation classes in high-frequency UI surfaces', () => {
    const files = [
      'src/App.tsx',
      'src/components/Header.tsx',
      'src/components/MainContent.tsx',
      'src/components/InitialPrompt.tsx',
      'src/components/CodeView.tsx',
      'src/components/StructureView.tsx',
      'src/components/ScrollSlider.tsx',
      'src/components/SettingsDialog.tsx',
      'src/components/FileRankDialog.tsx',
    ];

    for (const file of files) {
      const source = readSource(file);
      expect(source, `${file} should avoid transition-all on the main path`).not.toContain('transition-all');
      expect(source, `${file} should avoid backdrop-blur on the main path`).not.toContain('backdrop-blur');
    }

    expect(readSource('src/components/MainContent.tsx')).not.toContain('animate-bounce');
  });
});
