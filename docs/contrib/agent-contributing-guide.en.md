---
sidebar_position: 10
---

<!-- SPDX-License-Identifier: CC-BY-NC-SA-4.0 -->

# Contributing Guide for AI Agents

:::info Intended audience
This document is primarily written for **AI agents** (LLM-based coding
assistants). Human contributors will also find the project overview, commit
conventions, and validation checklist useful — feel free to read along.
:::

This document is the English version of the maintainer-preferred guide
for AI agents working on this repository. For the Chinese version, see
[agent-contributing-guide.zh.md](agent-contributing-guide.zh.md).

## Key expectations

- Keep changes minimal and scoped.
- One logical change per commit (no unrelated edits in the same commit).
- Avoid reformatting unrelated files.
- Review diffs for unrelated changes before finalizing.
- Update `AGENTS.md` when architectural changes occur.

## AIGC policy

This project enforces a strict AI-Generated Content (AIGC) policy. **All AI
agents must read and comply with the full policy before contributing.**

- English: [aigc-policy.en.md](aigc-policy.en.md)
- 中文: [aigc-policy.zh.md](aigc-policy.zh.md)

Key points (the full policy is authoritative):

- **Commit separation**: Each commit should be either entirely human-written or
  entirely AI-written. Do not mix.
- **Identity disclosure**: AI agents must add an `AI-assisted-by` trailer to
  every AIGC commit (e.g., `AI-assisted-by: Claude Opus 4.6 (GitHub Copilot)`).
- **Original prompt**: Record the original user prompt in the commit message body
  before the trailers.
- **Human review**: All commits must be reviewed by a human, who appends
  `Signed-off-by` (DCO). AI agents must **not** add this tag on behalf of the
  user.
- **No sensitive information**: Never include keys, credentials, or personal data
  in commits.

## Project overview

- **Purpose**: *AREWELOONGYET?* (《咱龙了吗？》) — a one-stop portal for
  following LoongArch upstream ecosystem work. Covers toolchains, programming
  languages, kernels, firmware, emulators, JIT runtimes, distributions, and more.
- **Site URL**: <https://areweloongyet.com>
- **Site framework**: [Docusaurus 3](https://docusaurus.io/) (React).
- **Language**: TypeScript (ESM), MDX/Markdown for content.
- **License**: [CC-BY-NC-SA-4.0](../../LICENSE) for all content.

### High-level layout

```
AGENTS.md                 ← Agent entry point (points here)
docusaurus.config.ts      ← Main site configuration (i18n, plugins, theme)
sidebars.ts               ← Documentation sidebar structure
package.json              ← Dependencies and scripts (Yarn)
tsconfig.json             ← TypeScript config (editor only, not for compilation)
eslint.config.mjs         ← ESLint flat config

blog/                     ← Site news / blog posts (Markdown)
newsletter/               ← "This Week in LoongArch" (TWiL) weekly newsletter (Markdown/MDX)
docs/                     ← Documentation pages (rendered by Docusaurus)
  contrib/                ← Contributing guides (rendered as site docs)
    agent-contributing-guide.en.md  ← This file
    agent-contributing-guide.zh.md  ← Chinese version
    aigc-policy.en.md     ← AIGC policy (English)
    aigc-policy.zh.md     ← AIGC policy (Chinese)
    natlang-style-guide.md ← Natural language style guide (Chinese/English)
    basics.md             ← Basic contribution instructions
i18n/en/                  ← English translations of UI strings and content

src/
  components/             ← React components (AsmDB, ProjectPage, etc.)
  css/                    ← Stylesheets
  data/                   ← YAML data sources for upstream support tracking
    01-toolchain/         ← Toolchain support data
    02-programming-languages/
    03-kernel/
    04-fw-and-emulators/
    06-jit-runtimes/
    07-distros/
    porters.yml           ← Porter/contributor data
  pages/                  ← Custom pages (React)
  plugins/                ← Custom Docusaurus plugins
    awly-asmdb-plugin.ts  ← Assembly database plugin
    awly-data-plugin.ts   ← Data plugin for upstream support tracking
    awly-rehype-annotate-overseas-links.ts
    awly-remark-natlang-usage.ts
  theme/                  ← Theme customizations (swizzled components)
  types/                  ← Shared TypeScript type definitions

scripts/
  asmdb/                  ← Go helper for generating assembly DB data

3rdparty/
  loongarch-opcodes/      ← Vendored LoongArch opcode definitions

static/                   ← Static assets (images, fonts, etc.)
art/                      ← Branding and artwork sources
```

### Data-driven content

The upstream support tracking data lives in `src/data/` as YAML files organized
by category. Avoid editing generated artifacts; update the YAML sources and let
the data plugin (`awly-data-plugin.ts`) handle the rest.

### Newsletter

The *This Week in LoongArch* (TWiL, 《每周一龙》) newsletter is a weekly/
bi-weekly publication covering the latest LoongArch community developments.
Issues live in `newsletter/` as Markdown or MDX files.

## Common commands (Yarn)

- Install dependencies: `yarn`
- Dev server: `yarn start`
- Build: `yarn build`
- Typecheck: `yarn typecheck`
- Build Go helpers: `yarn build-helpers` (if `scripts/asmdb` is touched)

Run the minimal set needed for the touched area (e.g., typecheck for TS changes,
build for deeper refactors or data pipeline changes).

## Content and data workflows

### Upstream support data

- Source of truth is YAML in `src/data/`.
- Each category directory contains YAML files describing projects and their
  LoongArch support status.
- Avoid editing generated artifacts; update the YAML and let the data plugin
  regenerate.

### Newsletter articles

- New TWiL issues go in `newsletter/` following the existing naming convention:
  `YYYY-MM-DD-this-week-in-loongarch-N.md` (or `.mdx` if JSX is needed).
- Author metadata is in `newsletter/authors.yml`.

### Documentation

- Documentation pages live in `docs/`.
- Contributing guides for humans are in `docs/contrib/` and are rendered as part
  of the site.
- The natural language style guide (`docs/contrib/natlang-style-guide.md`) is
  authoritative for writing style — follow it.

### Internationalization (i18n)

- The default locale is `zh-Hans` (Simplified Chinese).
- English translations are in `i18n/en/`.
- Configuration string translations are defined inline in
  `docusaurus.config.ts`.
- Code identifiers and commit messages remain in English.

## Code style and conventions

- Keep type safety intact; avoid `any` unless unavoidable.
- Follow the existing patterns in `src/`.
- TypeScript ESM is used throughout.
- ESLint flat config is in `eslint.config.mjs`; Prettier is available for
  formatting.
- Markdown files should use ATX-style headings (`#`, `##`, etc.).
- Use blank lines after headings and before code blocks.
- Keep lines at a reasonable length (wrap around 80–100 characters where
  practical).

### Chinese writing style

When writing Chinese content, follow the natural language style guide at
`docs/contrib/natlang-style-guide.md`. Key points:

- Maintain a neutral, objective tone.
- Add spaces between CJK characters and Western text (but not between Western
  text and CJK full-width punctuation).
- Avoid unnecessary emotional expression or subjective conjecture.
- Avoid **topic-comment sentence structures**. Use **subject-predicate
  constructions** with appropriate prepositions or particles instead, so that
  readers of all backgrounds can understand the text more easily.

Specific rules:

- **Do not let a bare topic serve as the grammatical subject while omitting the
  preposition.** Use prepositions such as "对于", "为", or "在" to make the
  semantic relationship explicit.
- **Do not omit the passive-voice marker for inanimate subjects** ("被", "由",
  etc.), or rewrite as an explicit active-voice sentence with the otherwise
  implied object spelled out.

Examples:

| ❌ Topic-comment (avoid) | ✅ Subject-predicate (preferred) |
|---|---|
| 新世界移植工作不要加载此文档 | 对于新世界移植工作，不要加载此文档 |
| Markdown 文件使用 ATX 风格标题 | 为 Markdown 文件使用 ATX 风格标题 |
| 所有文件均须提供双语言版本 | 必须为所有文件提供双语言版本 |

## Commit message style

Follow Conventional Commits:

```plain
<type>(<scope>): <summary>
```

Guidelines:

- Imperative, present-tense summary (no trailing period).
- ~50–72 characters for summary.
- One logical change per commit — do not combine unrelated changes.
- Include a body when needed to explain motivation or key changes.
- Separate body from summary with a blank line; wrap body lines around 72
  characters.

Types:

- `feat`: New feature or content addition
- `fix`: Bug fix or content correction
- `docs`: Documentation changes (contributing guides, AGENTS.md, etc.)
- `refactor`: Restructuring without behavior change
- `build`: Build system or dependency changes
- `ci`: CI/CD configuration changes
- `data`: Changes to upstream support tracking data in `src/data/`

Do **not** use `chore` — use `build` or `ci` as appropriate instead.

Scopes (use the primary area touched):

- `newsletter`: TWiL newsletter articles
- `blog`: Site news / blog posts
- `docs`: Documentation pages
- `data`: Upstream support data
- `asmdb`: Assembly database
- `i18n`: Internationalization
- `plugins`: Custom Docusaurus plugins
- `components`: React components
- `meta`: Repository metadata (README, AGENTS.md, licenses)
- `policy`: AIGC policy

### AIGC commit requirements

Per the [AIGC policy](aigc-policy.en.md), AI agents must:

1. Disclose identity with an `AI-assisted-by` trailer.
2. Record the original prompt in the commit body.
3. **Not** add `Signed-off-by` on behalf of the user.

Example:

```plain
feat(newsletter): draft TWiL issue 100

Draft the 100th issue of This Week in LoongArch covering
GCC 15 LoongArch backend improvements and LLVM 20 release.

Original prompt:

> Draft TWiL 100 based on the following notes: ...

AI-assisted-by: Claude Opus 4.6 (GitHub Copilot)
Signed-off-by: Contributor Name <contributor@example.com>
```

## Validation checklist

Before finalizing a commit, verify:

- ✅ TypeScript/React changes pass `yarn typecheck`.
- ✅ Code changes pass ESLint (`npx eslint`).
- ✅ Markdown files are well-formed (no broken links, proper heading hierarchy).
- ✅ Commit message follows Conventional Commits and AIGC policy requirements.
- ✅ No sensitive information is included.
- ✅ Changes are scoped to a single logical unit.
- ✅ `yarn build` succeeds for deeper refactors or data pipeline changes.

## Notes on dev server behavior

Docusaurus HMR is enabled, but some changes (e.g., `docusaurus.config.ts`,
plugin modifications, new data files) may require restarting the dev server.
