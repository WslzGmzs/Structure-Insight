# Structure Insight

[![版本](https://img.shields.io/badge/version-5.4.0-blue.svg)](./package.json)
[![最新发布](https://img.shields.io/github/v/release/yeahhe365/Structure-Insight?label=release)](https://github.com/yeahhe365/Structure-Insight/releases)
[![许可证：MIT](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![PWA](https://img.shields.io/badge/PWA-ready-5A0FC8.svg)](./public/manifest.json)
[![在线体验](https://img.shields.io/badge/live-demo-2ea44f?logo=cloudflarepages&logoColor=white)](https://structure-insight-website.pages.dev/)

[English](./README.md) | 简体中文

Structure Insight 是一个优先在浏览器本地运行的代码仓库检查与导出工具。它可以帮助你加载本地项目、理解目录结构、筛选关键文件、检查潜在敏感信息，并在不把源代码上传到服务器的前提下生成干净的代码上下文快照。

- 在线体验：[structure-insight-website.pages.dev](https://structure-insight-website.pages.dev/)
- 源码仓库：[github.com/yeahhe365/Structure-Insight](https://github.com/yeahhe365/Structure-Insight)
- 许可证：[MIT](./LICENSE)

## 目录

- [为什么使用它](#为什么使用它)
- [功能概览](#功能概览)
- [快速开始](#快速开始)
- [使用流程](#使用流程)
- [设置项参考](#设置项参考)
- [过滤规则](#过滤规则)
- [搜索与导航](#搜索与导航)
- [导出格式](#导出格式)
- [隐私与安全](#隐私与安全)
- [浏览器支持](#浏览器支持)
- [处理细节](#处理细节)
- [开发](#开发)
- [项目结构](#项目结构)
- [部署](#部署)
- [故障排查](#故障排查)
- [路线图说明](#路线图说明)
- [贡献](#贡献)

## 为什么使用它

AI 工具在上下文聚焦、及时、且可安全分享时效果更好。Structure Insight 提供了一个本地工作台，用来准备这类上下文：

- 不必逐个打开文件，也能快速浏览大型仓库。
- 在导出前移除生成文件、依赖目录、缓存文件或测试文件。
- 让 `.gitignore`、`.ignore`、`.repomixignore` 的效果可见，而不是靠猜测判断哪些文件被包含。
- 在粘贴或保存大型提示词上下文之前估算 token 规模。
- 在上下文离开本机之前提示常见敏感信息模式。
- 按不同下游工具的需求导出同一份仓库视图。

## 功能概览

### 导入与浏览

- 使用浏览器文件夹选择器打开本地项目。
- 将文件夹或 `.zip` 压缩包拖入应用。
- 当 `.zip` 作为独立文件选择时，可在浏览器中展开压缩包。
- 使用适合大型项目的虚拟化文件树浏览目录。
- 使用带语法高亮的代码视图、标签页和 Markdown 预览查看文件。

### 筛选与编辑

- 应用常见依赖目录和构建目录的默认忽略规则。
- 支持 `.gitignore`、`.ignore`、`.repomixignore`。
- 支持自定义包含规则和忽略规则。
- 在应用视图中排除、删除或编辑文件后再导出。
- 在浏览器支持时重新处理最近打开的本地项目。

### 分析与安全

- 统计文件数、行数、字符数和估算 token 数。
- 在导出内容中生成仓库级分析摘要。
- 检测疑似 OpenAI API key、私钥、AWS access key 和行内密钥赋值。
- 在复制或保存导出前，通过专门的安全提示弹窗复核发现项。

### 导出与离线使用

- 支持导出为纯文本、Markdown、XML 或 JSON。
- 可将当前导出内容复制到剪贴板。
- 可保存导出文件到磁盘，并可按大小拆分大型导出。
- 支持作为 PWA 安装。
- 首次成功在线加载后，可复用缓存的应用外壳。

## 快速开始

环境要求：

- 推荐使用 Node.js 20 或更新版本。
- npm，通常随 Node.js 一起安装。

安装依赖并启动开发服务器：

```bash
npm install
npm run dev
```

Vite 开发服务器默认使用 `3000` 端口。

构建生产版本：

```bash
npm run build
npm run preview
```

## 使用流程

1. 打开在线体验地址，或启动本地开发服务器。
2. 点击文件夹选择器选择本地项目，或将文件夹、`.zip` 文件拖入应用。
3. 查看生成的文件树、文件指标、token 估算和安全提示。
4. 在设置中调整忽略规则、包含规则、导出格式、行号、空行移除、base64 截断和拆分大小。
5. 可选地在应用中编辑、排除或删除某些文件。
6. 复制导出内容，或保存到磁盘。

应用操作的是浏览器中的当前项目视图。如果你在 Structure Insight 中编辑或移除文件，这些变化会影响生成的导出内容，不会修改磁盘上的原始项目。

## 设置项参考

### 工作区

| 设置项       | 说明                                                                             |
| ------------ | -------------------------------------------------------------------------------- |
| 主题模式     | 在浅色和深色 UI 主题之间切换。                                                   |
| 字体大小     | 控制代码和结构视图的阅读密度，范围是 `10px` 到 `24px`。                          |
| 自动换行     | 减少长代码行带来的横向滚动。                                                     |
| 提取文件内容 | 关闭后只生成结构优先视图，不读取文件正文。                                       |
| 大文件阈值   | 以 KB 为单位输入。`0` 表示禁用阈值。超过阈值的文件仍保留在树中，但跳过正文提取。 |
| 清除缓存     | 在浏览器允许的范围内重置本地设置、最近项目数据、应用缓存和 Service Worker 注册。 |

### 导出

| 设置项           | 说明                                                                                           |
| ---------------- | ---------------------------------------------------------------------------------------------- | -------------------------------- |
| 导出格式         | 选择 `plain`、`markdown`、`xml` 或 `json`。                                                    |
| 文件摘要         | 在导出开头加入仓库级元数据和使用说明。                                                         |
| 目录结构         | 在导出中包含生成的目录树。                                                                     |
| 导出时显示行号   | 将文件正文导出为 `行号                                                                         | 内容` 的形式；不影响预览区行号。 |
| 移除空行         | 生成输出前移除文件正文中的空白行。                                                             |
| 截断 Base64      | 将较长的 `data:*;base64,...` 替换为 `data:[TRUNCATED_BASE64_DATA]`。                           |
| 拆分阈值         | `0` 表示不拆分。设置为正数字符数后，会保存为 `project.part1.ext`、`project.part2.ext` 等文件。 |
| Header 文本      | 放置项目背景、审查目标或外部限制，会追加到导出内容前部。                                       |
| Instruction 文本 | 放置下游指令，例如希望 AI 使用的回答格式或审查优先级。                                         |

### 默认值

- 默认忽略规则：开启。
- 忽略文件支持：开启。
- 空目录导出：关闭。
- 导出格式：纯文本。
- 大文件阈值：`0`，表示禁用。
- 导出拆分阈值：`0`，表示禁用。
- 最近项目数量上限：5 个。

## 过滤规则

过滤会在处理阶段和重新构建导出时生效。同一套规则会作用于可见文件树、文件内容、空目录处理和导出上下文。

- 包含模式和忽略模式使用英文逗号分隔，例如 `src/**/*.ts,docs/**`。
- 每个模式会自动裁剪前后空白；空条目会被忽略。
- 模式会同时匹配规范化完整路径，以及去掉顶层项目文件夹后的路径。因此无论导入路径中是否带项目根目录，`src/**/*.ts` 这类模式都可以工作。
- 包含模式是收窄规则：只要存在至少一个包含模式，文件就必须匹配其中一个。
- 忽略模式是扣除规则：文件只要匹配忽略模式，即使也匹配包含模式，也会被排除。
- 应用会从导入项目中的 `.gitignore`、`.ignore`、`.repomixignore` 读取忽略规则。
- 默认忽略目录包括 `.git`、`node_modules`、`__pycache__`、`.vscode`、`.idea`、`dist`、`build`、`out`、`target`。
- 图片、字体、压缩包、可执行文件、Office 文档、媒体文件、编译产物等二进制或打包资产会保留在文件树中，但跳过文本提取。
- 独立导入的 `.zip` 会在浏览器中展开。已经位于导入文件夹内部的 `.zip` 会被当作普通文件处理，不会递归展开。

## 搜索与导航

- 项目加载后，可使用 `Ctrl/⌘ + F` 打开项目搜索。
- 搜索支持大小写敏感、整词匹配和正则表达式。
- 正则查询超过 256 个字符时会被拒绝。
- 能匹配空字符串的正则会被忽略，避免无限结果循环。
- 部分嵌套量词正则会被拒绝，以降低灾难性回溯风险。
- 搜索结果包含文件路径、匹配文本、行号和文件内匹配序号。
- 文件树使用虚拟化渲染，大型项目不需要一次性挂载所有可见行。

键盘快捷键：

| 快捷键       | 操作                           |
| ------------ | ------------------------------ |
| `Ctrl/⌘ + O` | 打开项目                       |
| `Ctrl/⌘ + F` | 打开或关闭搜索                 |
| `Ctrl/⌘ + S` | 保存导出                       |
| `Ctrl/⌘ + /` | 打开或关闭快捷键帮助           |
| `Ctrl/⌘ + W` | 关闭当前标签页                 |
| `Escape`     | 关闭弹窗；没有弹窗时可取消加载 |

## 导出格式

| 格式     | 适合场景                                          |
| -------- | ------------------------------------------------- |
| 纯文本   | 通用 AI 提示词，以及需要 Repomix 风格文本包的工具 |
| Markdown | 人工审阅、文档整理和聊天式工作流                  |
| XML      | 偏好用结构化标签包裹文件和元数据的工具            |
| JSON     | 程序化流水线或自定义后处理                        |

token 统计用于规划和对比，不保证与具体模型的精确 token 计数完全一致。

## 隐私与安全

- 文件处理设计为在浏览器本地完成。
- 应用不会主动上传已加载的仓库内容。
- 最近项目重新打开功能依赖浏览器存储和本地文件句柄能力。
- 敏感信息扫描是启发式检测，可能漏报，也可能误报。
- 请像对待原始源代码一样谨慎处理生成的导出文件。

## 浏览器支持

Structure Insight 面向现代浏览器构建。

- Chromium 内核浏览器提供最佳的文件夹选择器和 File System Access API 支持。
- 其他现代浏览器可在支持时使用文件输入和拖放流程。
- PWA 安装和离线行为取决于浏览器的 Service Worker 支持。
- 超大型仓库会受到浏览器内存、存储和文件访问能力限制。

## 处理细节

- 文本提取使用浏览器文件 API，并通过适合 Worker 的处理路径组织。
- 处理较大导入时会周期性把执行权还给浏览器，以保持界面响应。
- 文件内容会按路径排序后再导出。
- 当导入内容只有一个顶层目录时，显示根名会从该目录推断。
- 应用内手动编辑会合并进重新构建的导出中，尽量保留用户调整。
- 删除的文件会记录为 removed paths，后续生成导出时仍会排除。
- 被排除的文件仍保留在应用状态中，但不会进入导出正文。
- 只有在开启空目录设置、且目录通过当前过滤规则时，空目录才会进入导出。
- 安全扫描会作用于提取后和导出转换后的内容，因此 Base64 截断、移除空行等选项可能影响最终提示列表。

## 开发

常用脚本：

```bash
npm run dev           # 启动本地开发服务器
npm run build         # 构建生产版本到 dist/
npm run preview       # 本地预览生产构建
npm run lint          # 运行 ESLint
npm run typecheck     # 运行 TypeScript 类型检查，不输出文件
npm test -- --run     # 单次运行 Vitest 测试
npm run test:watch    # 以 watch 模式运行 Vitest
npm run format        # 使用 Prettier 格式化文件
npm run format:check  # 检查 Prettier 格式
npm run check         # 依次运行 lint、typecheck、测试和 build
```

推送变更前请运行 `npm run check`。这是本仓库主要的验证命令。

## 项目结构

```text
src/
  components/          React UI 组件和组件测试
  components/settings/ 设置弹窗的分区组件和辅助逻辑
  hooks/               应用状态、交互和流程 Hook
  services/            文件处理、导出、扫描、存储和 Worker
  types/               按领域拆分的 TypeScript 类型
tests/                 根级集成测试和资源检查
public/                PWA manifest、Service Worker、图标和本地高亮主题
dist/                  生产构建输出目录
```

关键实现说明：

- Vite 在构建时将 package 版本注入应用。
- 文件处理和搜索逻辑使用适合 Worker 的 service 模块组织。
- 文件树、代码视图等较重 UI 区域会拆分为独立 chunk。
- 核心 UI 资源使用本地资产，而不是运行时 CDN 依赖。

## 部署

在 Cloudflare Pages 或类似静态托管平台中：

- 项目根目录：仓库根目录
- 构建命令：`npm run build`
- 输出目录：`dist`
- Vite base path：`./`

相对 base path 同时支持部署在域名根路径和子目录路径下。

## 故障排查

### 无法使用文件夹选择器

建议使用 Chromium 内核浏览器，以获得最佳 File System Access API 支持。也可以在浏览器支持时使用拖放或文件输入作为替代流程。

### 最近项目无法重新打开

浏览器可能撤销了已保存的文件句柄权限，或底层文件夹位置已经变化。重新打开该文件夹即可刷新最近项目记录。

### 导出内容过大

可以使用包含规则、忽略规则、手动排除或拆分导出设置。若只需要快速查看目录结构，也可以关闭内容提取。

### 导出内容中出现安全提示

分享导出前请逐条复核。扫描器会偏保守提示，但不能替代完整的密钥扫描流程。

### 文件夹里的 `.zip` 没有展开

这是有意设计。只有独立导入的 `.zip` 会被展开。位于导入文件夹内部的压缩包会保留为文件，避免意外展开依赖缓存或打包产物。

### 过滤模式没有按预期匹配

请使用英文逗号分隔 glob 模式，不要使用换行分隔。可以优先尝试不带顶层文件夹名的写法，例如使用 `src/**`，而不是 `my-project/src/**`。

## 路线图说明

当前产品是 Web 应用，还没有内置 CLI、MCP Server 或 Claude Code Skill。

后续如果要做面向 agent 的集成，更合理的分层可能是：

1. 先抽出 headless core，负责项目读取、过滤、目录树生成、token 估算、安全扫描和导出生成。
2. 在 core 上封装 CLI，支持本地自动化。
3. 暴露稳定的 MCP 工具，例如 `analyze_project`、`export_context`、`scan_secrets`。
4. 再增加 Claude Code Skill，用来编排 CLI/MCP 之上的工作流。

保持浏览器 UI 和 headless core 分离，会让自动化更容易测试，也更容易长期演进。

## 贡献

1. 创建一个聚焦的分支。
2. 保持改动小而清晰，并遵循现有 React、TypeScript 和 service 模块组织方式。
3. 行为发生变化时，补充或更新测试。
4. 运行 `npm run check`。
5. 提交 Pull Request，并附上简短摘要和验证说明。

## 技术栈

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Vitest
- ESLint
- Prettier
- JSZip
- Highlight.js
- Marked 和 DOMPurify
- React Virtuoso

---

## 友链

- [Linux.do](https://linux.do/)：也称 L 站，是一个活跃的中文技术社区，围绕 AI、软件开发、资源分享与前沿资讯展开讨论；社区愿景是“新的理想型社区”，社区文化是“真诚、友善、团结、专业，共建你我引以为荣之社区”。

## 许可证

Structure Insight 基于 [MIT License](./LICENSE) 发布。
