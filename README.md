# Structure Insight

English | [简体中文](./README.zh-CN.md)

Structure Insight is a browser-first repository inspection and export tool for AI-assisted development. It helps you load a local project, understand its structure, filter the files that matter, review potential secrets, and export a clean codebase snapshot without uploading source files to a server.

- Live demo: [structure-insight-website.pages.dev](https://structure-insight-website.pages.dev/)
- Repository: [github.com/yeahhe365/Structure-Insight](https://github.com/yeahhe365/Structure-Insight)
- License: [MIT](./LICENSE)

## Table Of Contents

- [Why Use It](#why-use-it)
- [Feature Overview](#feature-overview)
- [Quick Start](#quick-start)
- [Using The App](#using-the-app)
- [Export Formats](#export-formats)
- [Privacy And Security](#privacy-and-security)
- [Browser Support](#browser-support)
- [Development](#development)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## Why Use It

AI tools work better when the context is focused, current, and safe to share. Structure Insight gives you a local workspace for preparing that context:

- Explore large repositories without opening every file manually.
- Remove generated, dependency, cache, or test files before exporting.
- Keep `.gitignore`, `.ignore`, and `.repomixignore` behavior visible instead of guessing what was included.
- Estimate token size before pasting or saving a large prompt payload.
- Catch common secret patterns before context leaves your machine.
- Export the same repository view in several formats for different downstream tools.

## Feature Overview

### Import And Navigation

- Open a local folder with the browser file picker.
- Drop folders or `.zip` archives into the app.
- Expand `.zip` archives in the browser when they are selected as standalone files.
- Browse a virtualized file tree designed for large projects.
- Use syntax-highlighted code viewing with tabs and Markdown preview support.

### Filtering And Editing

- Apply default ignore rules for common dependency and build directories.
- Respect `.gitignore`, `.ignore`, and `.repomixignore` files.
- Add custom include and ignore patterns.
- Exclude, delete, or edit files from the in-app view before export.
- Reprocess recent local projects when supported by the browser.

### Analysis And Safety

- Count files, lines, characters, and estimated tokens.
- Summarize repository-level analysis in the exported output.
- Detect likely OpenAI API keys, private keys, AWS access keys, and inline secret assignments.
- Review security findings in a dedicated dialog before copying or saving exports.

### Export And Offline Use

- Export as plain text, Markdown, XML, or JSON.
- Copy the current export to the clipboard.
- Save exports to disk, with optional splitting for large outputs.
- Install as a PWA.
- Reuse the cached app shell after the first successful online load.

## Quick Start

Requirements:

- Node.js 20 or newer is recommended.
- npm, bundled with Node.js.

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

The Vite development server uses port `3000` by default.

For a production build:

```bash
npm run build
npm run preview
```

## Using The App

1. Open the live demo or start the local development server.
2. Click the folder picker, select a local project, or drop a folder or `.zip` file into the app.
3. Review the generated file tree, file metrics, token estimate, and security findings.
4. Use settings to adjust ignore rules, include patterns, export format, line numbers, empty-line removal, base64 truncation, and split size.
5. Optionally edit, exclude, or delete files from the in-app project view.
6. Copy the export or save it to disk.

The app operates on the current in-browser view. If you edit or remove files inside Structure Insight, those changes affect the generated export, not the original project on disk.

## Export Formats

| Format     | Best For                                                             |
| ---------- | -------------------------------------------------------------------- |
| Plain text | General AI prompts and tools that expect a Repomix-style text bundle |
| Markdown   | Human-readable review, documentation, and chat-based workflows       |
| XML        | Tools that prefer structured tags around files and metadata          |
| JSON       | Programmatic pipelines or custom post-processing                     |

Token counts are estimates for planning and comparison. They are not exact model-token guarantees.

## Privacy And Security

- File processing is designed to happen in the browser.
- The app does not intentionally upload loaded repository content.
- Recent project reopening uses browser storage and local file handles where supported.
- Sensitive-content scanning is heuristic and can miss real secrets or report false positives.
- Generated exports should be handled with the same care as the original source code.

## Browser Support

Structure Insight is built for modern browsers.

- Chromium-based browsers provide the best folder picker and File System Access API support.
- Other modern browsers can still use file input and drag-and-drop flows where supported.
- PWA installation and offline behavior depend on each browser's service worker support.
- Very large repositories are limited by browser memory, storage, and file-access constraints.

## Development

Useful scripts:

```bash
npm run dev           # Start the local development server
npm run build         # Build the production bundle into dist/
npm run preview       # Preview the production build locally
npm run lint          # Run ESLint
npm run typecheck     # Run TypeScript without emitting files
npm test -- --run     # Run the Vitest suite once
npm run test:watch    # Run Vitest in watch mode
npm run format        # Format files with Prettier
npm run format:check  # Check Prettier formatting
npm run check         # Run lint, typecheck, tests, and build
```

Run `npm run check` before pushing changes. It is the main verification command for this repository.

## Project Structure

```text
src/
  components/          React UI components and component tests
  components/settings/ Settings dialog sections and helpers
  hooks/               Application state and interaction hooks
  services/            File processing, exporting, scanning, storage, and workers
  types/               Domain-specific TypeScript types
tests/                 Root-level integration and asset checks
public/                PWA manifest, service worker, icons, and local highlight themes
dist/                  Production build output
```

Key implementation notes:

- Vite injects the package version into the app at build time.
- File processing and search use worker-friendly service modules.
- Heavy UI areas such as the file tree and code view are split into separate chunks.
- Core UI assets are local rather than loaded from runtime CDN dependencies.

## Deployment

For Cloudflare Pages or similar static hosts:

- Project root: repository root
- Build command: `npm run build`
- Output directory: `dist`
- Vite base path: `./`

The relative base path supports deployment under a subdirectory as well as at a domain root.

## Troubleshooting

### The folder picker is unavailable

Use a Chromium-based browser for the best File System Access API support, or use drag-and-drop / file input fallback where available.

### A recent project cannot be reopened

The browser may have revoked the stored file handle permission, or the underlying folder may have moved. Open the folder again to refresh the recent project entry.

### The export is too large

Use include patterns, ignore patterns, manual exclusion, or the split export setting. Also consider turning off content extraction for quick structure-only reviews.

### Security findings appear in generated output

Review each finding before sharing the export. The scanner is intentionally conservative and does not replace a full secret-scanning workflow.

## Contributing

1. Create a focused branch.
2. Keep changes small and aligned with the existing React, TypeScript, and service-module patterns.
3. Add or update tests when behavior changes.
4. Run `npm run check`.
5. Open a pull request with a short summary and verification notes.

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Vitest
- ESLint
- Prettier
- JSZip
- Highlight.js
- Marked and DOMPurify
- React Virtuoso

## License

Structure Insight is released under the [MIT License](./LICENSE).
