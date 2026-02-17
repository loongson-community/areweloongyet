---
sidebar_position: 11
---

<!-- SPDX-License-Identifier: CC-BY-NC-SA-4.0 -->

# AI 智能体贡献指南

:::info 目标读者
本文档的主要读者是 **AI 智能体**（基于大语言模型的编码助手）。人类贡献者也会从中受益——项目概况、提交规范和验证清单等内容对所有人都有参考价值。
:::

本文档是面向 AI 智能体的维护者首选贡献指南的中文版本。英文版请参阅
[agent-contributing-guide.en.md](agent-contributing-guide.en.md)。

## 核心要求

- 保持变更最小化、范围明确。
- 每个提交只做一件事（不在同一提交中混入无关修改）。
- 避免重新格式化无关文件。
- 提交前审查 diff，排除无关变更。
- 在架构变更时同步更新 `AGENTS.md`。

## AIGC 政策

本项目执行严格的人工智能生成内容（AIGC）政策。**所有 AI 智能体在贡献之前必须阅读并遵守完整政策。**

- English: [aigc-policy.en.md](aigc-policy.en.md)
- 中文: [aigc-policy.zh.md](aigc-policy.zh.md)

要点（以完整政策为准）：

- **提交拆分**：每个提交的内容要么完全由人类撰写，要么完全由 AI 撰写，不得混合。
- **身份披露**：AI 智能体必须在每个 AIGC 提交中添加 `AI-assisted-by` trailer（如
  `AI-assisted-by: Claude Opus 4.6 (GitHub Copilot)`）。
- **原始提示词**：在提交说明正文中（trailer 之前）记录用户的原始提示词。
- **人类复核**：所有提交必须经人类复核，由人类添加 `Signed-off-by`（DCO）。AI
  智能体**禁止**代替用户添加此标签。
- **禁止敏感信息**：提交中不得包含密钥、凭据或个人隐私数据。

## 项目概况

- **定位**：《咱龙了吗？》（*AREWELOONGYET?*）—— 一站式了解 LoongArch 上游生态建设的门户站点。涵盖工具链、编程语言、内核、固件、模拟器、JIT 运行时、发行版等。
- **站点地址**：<https://areweloongyet.com>
- **站点框架**：[Docusaurus 3](https://docusaurus.io/)（React）。
- **编程语言**：TypeScript（ESM），内容以 MDX/Markdown 编写。
- **许可证**：全部内容以 [CC-BY-NC-SA-4.0](../../LICENSE) 授权。

### 仓库结构

```
AGENTS.md                 ← 智能体入口文档（指向本文件）
docusaurus.config.ts      ← 站点主配置（i18n、插件、主题）
sidebars.ts               ← 文档侧边栏结构
package.json              ← 依赖与脚本（Yarn）
tsconfig.json             ← TypeScript 配置（仅编辑器用，不参与编译）
eslint.config.mjs         ← ESLint flat config

blog/                     ← 本站动态 / 博客文章（Markdown）
newsletter/               ← 《每周一龙》周报（Markdown/MDX）
docs/                     ← 文档页面（由 Docusaurus 渲染）
  contrib/                ← 贡献指南（作为站点文档呈现）
    agent-contributing-guide.en.md  ← 英文版
    agent-contributing-guide.zh.md  ← 本文件
    aigc-policy.en.md     ← AIGC 政策（英文）
    aigc-policy.zh.md     ← AIGC 政策（中文）
    natlang-style-guide.md ← 自然语言风格指南（中英文）
    basics.md             ← 基本参与方法
i18n/en/                  ← 英文翻译（UI 字符串与内容）

src/
  components/             ← React 组件（AsmDB、ProjectPage 等）
  css/                    ← 样式表
  data/                   ← 上游支持追踪数据（YAML）
    01-toolchain/         ← 工具链支持数据
    02-programming-languages/
    03-kernel/
    04-fw-and-emulators/
    06-jit-runtimes/
    07-distros/
    porters.yml           ← 移植者/贡献者数据
  pages/                  ← 自定义页面（React）
  plugins/                ← 自定义 Docusaurus 插件
    awly-asmdb-plugin.ts  ← 汇编指令数据库插件
    awly-data-plugin.ts   ← 上游支持数据插件
    awly-rehype-annotate-overseas-links.ts
    awly-remark-natlang-usage.ts
  theme/                  ← 主题定制（swizzled 组件）
  types/                  ← 共享 TypeScript 类型定义

scripts/
  asmdb/                  ← Go 辅助工具，用于生成汇编指令数据库数据

3rdparty/
  loongarch-opcodes/      ← 引入的 LoongArch 操作码定义

static/                   ← 静态资源（图片、字体等）
art/                      ← 品牌与美术素材源文件
```

### 数据驱动内容

上游支持追踪数据位于 `src/data/`，以 YAML 文件按类别组织。避免编辑生成的产物；请更新 YAML 数据源，由数据插件（`awly-data-plugin.ts`）完成处理。

### 周报

《每周一龙》（This Week in LoongArch，TWiL）是一份周刊/双周刊，报道 LoongArch 社区最新动态。各期位于 `newsletter/` 目录下，以 Markdown 或 MDX 文件形式存在。

## 常用命令（Yarn）

- 安装依赖：`yarn`
- 开发服务器：`yarn start`
- 构建：`yarn build`
- 类型检查：`yarn typecheck`
- 构建 Go 辅助工具：`yarn build-helpers`（在变更 `scripts/asmdb` 后执行）

请根据变更范围执行最小的必要检查（如 TS 变更执行类型检查，深层重构或数据管线变更执行完整构建）。

## 内容与数据工作流

### 上游支持数据

- 唯一数据来源是 `src/data/` 中的 YAML 文件。
- 各分类目录包含描述项目及其 LoongArch 支持状态的 YAML 文件。
- 避免编辑生成产物；请更新 YAML 数据源。

### 周报文章

- 新的 TWiL 期刊放入 `newsletter/`，遵循现有命名规范：`YYYY-MM-DD-this-week-in-loongarch-N.md`（需要 JSX 时使用 `.mdx`）。
- 作者元数据在 `newsletter/authors.yml` 中维护。

### 文档

- 文档页面位于 `docs/`。
- 面向人类的贡献指南位于 `docs/contrib/`，并作为站点文档的一部分进行渲染。
- 自然语言风格指南（`docs/contrib/natlang-style-guide.md`）对写作风格具有规范性——须遵守。

### 国际化（i18n）

- 默认语言为 `zh-Hans`（简体中文）。
- 英文翻译位于 `i18n/en/`。
- 配置字符串翻译在 `docusaurus.config.ts` 中内联定义。
- 代码标识符和提交说明须以英文书写。

## 代码风格与规范

- 保持类型安全；除非不可避免，否则避免使用 `any`。
- 遵循 `src/` 中的现有模式。
- 全项目使用 TypeScript ESM。
- ESLint flat config 位于 `eslint.config.mjs`；可使用 Prettier 进行格式化。
- 为 Markdown 文件使用 ATX 风格标题（`#`、`##` 等）。
- 在标题后、代码块前使用空行。
- 行宽应保持在合理长度（建议在 80–100 字符左右折行）。

### 中文写作风格

撰写中文内容时，须遵循 `docs/contrib/natlang-style-guide.md` 中的自然语言风格指南。要点：

- 保持中立、客观的语气。
- 在中日韩文字与西文之间加空格（但西文与中日韩全角标点相邻则不加空格）。
- 避免非必要的情感表达或主观臆断。
- 应避免使用**主题—评述（topic-comment）句式**，改用**主谓结构**并搭配适当的介词或助词，以便不同背景的读者更容易理解。

具体要求：

- **避免将主题直接充当主语而省略介词**，应使用"对于""为""在"等介词明确语义关系。
- **无生命主语不要省略被动标记**（"被""由"等），或者改写为显式的主动句并补全隐含的宾语。

示例：

| ❌ 主题—评述（避免） | ✅ 主谓结构（推荐） |
|---|---|
| 新世界移植工作不要加载此文档 | 对于新世界移植工作，不要加载此文档 |
| Markdown 文件使用 ATX 风格标题 | 为 Markdown 文件使用 ATX 风格标题 |
| 所有文件均须提供双语言版本 | 必须为所有文件提供双语言版本 |

## 提交说明风格

遵循 Conventional Commits 规范：

```plain
<type>(<scope>): <summary>
```

准则：

- 使用祈使语气、现在时态的简要描述（末尾不加句号）。
- 将简要描述控制在约 50–72 个字符。
- 每个提交只做一件事——不要合并无关变更。
- 必要时在正文中说明动机或关键变更。
- 在正文与简要描述之间用空行分隔；正文的每行应在约 72 字符处折行。

类型（type）：

- `feat`：新功能或内容新增
- `fix`：Bug 修复或内容纠正
- `docs`：文档变更（贡献指南、AGENTS.md 等）
- `refactor`：不改变行为的重构
- `build`：构建系统或依赖变更
- `ci`：CI/CD 配置变更
- `data`：`src/data/` 中上游支持追踪数据的变更

**不要**使用 `chore`——请根据情况使用 `build` 或 `ci`。

范围（scope，取所涉及的主要区域）：

- `newsletter`：TWiL 周报文章
- `blog`：本站动态/博客文章
- `docs`：文档页面
- `data`：上游支持数据
- `asmdb`：汇编指令数据库
- `i18n`：国际化
- `plugins`：自定义 Docusaurus 插件
- `components`：React 组件
- `meta`：仓库元数据（README、AGENTS.md、许可证）
- `policy`：AIGC 政策

### AIGC 提交要求

根据 [AIGC 政策](aigc-policy.zh.md)，AI 智能体必须：

1. 使用 `AI-assisted-by` trailer 披露身份。
2. 在提交说明正文中记录原始提示词。
3. **禁止**代替用户添加 `Signed-off-by`。

示例：

```plain
feat(newsletter): draft TWiL issue 100

Draft the 100th issue of This Week in LoongArch covering
GCC 15 LoongArch backend improvements and LLVM 20 release.

Original prompt:

> Draft TWiL 100 based on the following notes: ...

AI-assisted-by: Claude Opus 4.6 (GitHub Copilot)
Signed-off-by: Contributor Name <contributor@example.com>
```

## 验证清单

提交前请检查：

- ✅ TypeScript/React 变更通过 `yarn typecheck`。
- ✅ 代码变更通过 ESLint（`npx eslint`）。
- ✅ Markdown 文件格式正确（无断链、标题层级合理）。
- ✅ 提交说明符合 Conventional Commits 规范及 AIGC 政策要求。
- ✅ 不包含敏感信息。
- ✅ 变更范围限于单一逻辑单元。
- ✅ 深层重构或数据管线变更时 `yarn build` 通过。

## 开发服务器注意事项

Docusaurus HMR 默认启用，但某些变更（如 `docusaurus.config.ts`、插件修改、新增数据文件等）可能需要重启开发服务器。
