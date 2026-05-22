# Structure Insight

<p align="center">
  <a href="./README.md">中文</a> | <a href="./README.en.md">English</a>
</p>

[![Version](https://img.shields.io/badge/version-5.4.0-blue.svg)](./package.json)
[![Latest Release](https://img.shields.io/github/v/release/yeahhe365/Structure-Insight?label=release)](https://github.com/yeahhe365/Structure-Insight/releases)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![PWA](https://img.shields.io/badge/PWA-ready-5A0FC8.svg)](./public/manifest.json)
[![Live Demo](https://img.shields.io/badge/live-demo-2ea44f?logo=cloudflarepages&logoColor=white)](https://structure-insight-website.pages.dev/)

Structure Insight is a browser-first repository inspection and export tool for AI-assisted development. It helps you load a local project, understand its structure, filter the files that matter, review potential secrets, and export a clean codebase snapshot without uploading source files to a server.

- Live demo: [structure-insight-website.pages.dev](https://structure-insight-website.pages.dev/)
- Repository: [github.com/yeahhe365/Structure-Insight](https://github.com/yeahhe365/Structure-Insight)
- License: [MIT](./LICENSE)

## Table Of Contents

- [Why Use It](#why-use-it)
- [Feature Overview](#feature-overview)
- [Quick Start](#quick-start)
- [Using The App](#using-the-app)
- [Settings Reference](#settings-reference)
- [Filtering Rules](#filtering-rules)
- [Search And Navigation](#search-and-navigation)
- [Export Formats](#export-formats)
- [Privacy And Security](#privacy-and-security)
- [Browser Support](#browser-support)
- [Processing Details](#processing-details)
- [Development](#development)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Roadmap Notes](#roadmap-notes)
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

## Settings Reference

### Workspace

| Setting              | Details                                                                                                                    |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Theme mode           | Switches between light and dark UI themes.                                                                                 |
| Font size            | Controls code and structure reading density from `10px` to `24px`.                                                         |
| Word wrap            | Reduces horizontal scrolling in long code lines.                                                                           |
| Extract file content | When disabled, the app generates a structure-first view without reading file bodies.                                       |
| Large file threshold | Entered in KB. `0` disables the threshold. Files above the threshold are kept in the tree but skipped for body extraction. |
| Clear cache          | Resets local settings, recent project data, app caches, and service worker registrations where the browser allows it.      |

### Export

| Setting             | Details                                                                                                                |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| Export format       | Chooses `plain`, `markdown`, `xml`, or `json`.                                                                         |
| File summary        | Adds repository-level metadata and usage notes near the top of the export.                                             |
| Directory structure | Includes the generated tree in the export.                                                                             |
| Show line numbers   | Prefixes exported file content as `line                                                                                | content`. Preview line numbers are unaffected. |
| Remove empty lines  | Removes blank lines from exported file bodies before output is generated.                                              |
| Truncate Base64     | Replaces long `data:*;base64,...` values with `data:[TRUNCATED_BASE64_DATA]`.                                          |
| Split threshold     | `0` disables splitting. A positive character count saves files as `project.part1.ext`, `project.part2.ext`, and so on. |
| Header text         | Prepended context for project background, review goals, or constraints.                                                |
| Instruction text    | Extra downstream instructions, such as desired answer format or review priority.                                       |

### Defaults

- Default ignore rules: enabled.
- Ignore-file support: enabled.
- Empty directory export: disabled.
- Export format: plain text.
- Large file threshold: disabled with `0`.
- Split export threshold: disabled with `0`.
- Recent project limit: 5 projects.

## Filtering Rules

Filtering happens during processing and again when exports are rebuilt. The same rules are applied to the visible tree, file contents, empty directory handling, and exported context.

- Include and ignore fields accept comma-separated glob patterns, for example `src/**/*.ts,docs/**`.
- Pattern whitespace is trimmed; empty entries are ignored.
- Patterns are tested against both the normalized full path and the path with the top-level project folder removed. This makes patterns like `src/**/*.ts` work whether the imported root folder name is present or not.
- Include patterns are restrictive: when at least one include pattern is present, a file must match one of them.
- Ignore patterns are subtractive: a matched ignore pattern excludes the file even if it also matched an include pattern.
- Ignore files are discovered from `.gitignore`, `.ignore`, and `.repomixignore` files inside the imported project.
- Default ignored directories include `.git`, `node_modules`, `__pycache__`, `.vscode`, `.idea`, `dist`, `build`, `out`, and `target`.
- Binary and packaged asset extensions such as images, fonts, archives, executables, office documents, media files, and compiled outputs are kept in the tree but skipped for text extraction.
- Standalone `.zip` files are expanded in the browser. `.zip` files that are already inside an imported folder are treated as regular files instead of being expanded recursively.

## Search And Navigation

- Use `Ctrl/⌘ + F` to open project search after a project is loaded.
- Search supports case-sensitive matching, whole-word matching, and regular expressions.
- Regular expression queries longer than 256 characters are rejected.
- Regex patterns that can match an empty string are ignored to avoid infinite result loops.
- Some nested-quantifier patterns are rejected to reduce catastrophic backtracking risk.
- Search results include file path, match text, line number, and match index inside the file.
- The file tree is virtualized, so large projects can be browsed without mounting every visible row at once.

Keyboard shortcuts:

| Shortcut     | Action                                                |
| ------------ | ----------------------------------------------------- |
| `Ctrl/⌘ + O` | Open a project                                        |
| `Ctrl/⌘ + F` | Toggle search                                         |
| `Ctrl/⌘ + S` | Save export                                           |
| `Ctrl/⌘ + /` | Toggle keyboard shortcut help                         |
| `Ctrl/⌘ + W` | Close the current tab                                 |
| `Escape`     | Close dialogs; cancels loading when no dialog is open |

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

## Processing Details

- Text extraction uses browser file APIs and worker-friendly processing paths.
- Processing yields back to the browser periodically, which keeps the UI responsive during larger imports.
- File contents are sorted by path before export.
- The display root name is inferred from the imported folder when there is a single top-level directory.
- Manual in-app edits are merged into rebuilt exports so refresh/export behavior keeps user adjustments where possible.
- Deleted files are tracked as removed paths so they stay out of the generated export.
- Excluded files remain visible in the app state but are omitted from export content.
- Empty directories are included only when the setting is enabled and the directories pass the active filters.
- Security scanning runs on extracted and transformed export content, so options like Base64 truncation or empty-line removal can affect the final warning list.

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

### A `.zip` file inside a folder is not expanded

This is intentional. Only standalone `.zip` imports are expanded. Archives nested inside imported folders are kept as files to avoid unexpectedly expanding dependency caches or bundled artifacts.

### Pattern filters do not match as expected

Use comma-separated glob patterns, not newline-separated patterns. Try matching without the top-level folder name first, for example `src/**` instead of `my-project/src/**`.

## Roadmap Notes

The current product is a Web app. It does not yet ship a CLI, MCP server, or Claude Code Skill.

A future agent-facing integration would likely be built in layers:

1. Extract a headless core for project reading, filtering, tree generation, token estimation, secret scanning, and export generation.
2. Wrap that core in a CLI for local automation.
3. Expose stable MCP tools such as `analyze_project`, `export_context`, and `scan_secrets`.
4. Add a Claude Code Skill as workflow guidance on top of the CLI/MCP layer.

Keeping the browser UI separate from the headless core would make automation easier to test and safer to evolve.

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
