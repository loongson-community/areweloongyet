---
sidebar_position: 11
---

# TWiL Writing Style Guide

{/* SPDX-License-Identifier: CC-BY-NC-SA-4.0 */}

This document codifies the writing style of the *This Week in LoongArch* (TWiL)
newsletter, based on quantitative and qualitative analysis of all 54 issues
(~1,836 news items) through early 2025. Style evolves over time; this document
reflects the established patterns as observed.

All discussion and decisions in this document that touch on natural-language
phenomena, such as sentence patterns, wording, and pragmatics, apply only to
writing and reviewing content in Simplified Chinese (the `zh-Hans` locale),
because as of 2026 TWiL exists only in Simplified Chinese. Should TWiL gain
translations or original content in other languages in the future, discussion
and decisions about sentence patterns, wording, and pragmatics for those
languages will be supplemented then, in a separate effort, into the Natural
Language Style Guide applicable to them, as well as into this document.

All other normative content in this document, such as reporting principles
and science-communication depth, is unrelated to any natural language and
therefore applies to all present and future language editions of TWiL.

:::info[Intended audience]

This document is for both **human editors** and **AI agent collaborators**
(e.g., the editor's coding assistant) of the TWiL newsletter.

- Human editors use it to maintain stylistic consistency.
- AI agents use it to understand the expected output patterns when drafting items.

:::

## Analysis tooling {/* #analysis-tooling */}

This style guide is derived from metrics produced by `scripts/analyze-newsletter.py`
in this project's repository.
The script parses all newsletter issues and outputs per-item word/sentence counts,
verb-on-link ratios, editorial-tone detection, and science-communication depth.
See the script's module docstring for reproduction commands.

## Brevity {/* #brevity */}

### Item length {/* #item-length */}

| Statistic | Value |
|---|---|
| Mean characters / item | 51 |
| Median characters / item | ~35 |
| Mean sentences / item | 1.5 |
| Exactly 1 sentence | 66.1% |
| 1-2 sentences | 87.6% |

The vast majority of items consist of one or two sentences. If an item exceeds
3 sentences, consider splitting (if readability permits) or verify that it
truly forms an indivisible reporting unit.

### Rules of thumb for brevity {/* #rules-of-thumb-for-brevity */}

- Routine news items: target **1-2 sentences**, **20-80 characters**.
- We trust our readers to have basic development skills and to be able to look
  up unfamiliar concepts on their own, so do not append science-communication
  style explanations to every concept. When an explanation is optional, we
  prefer to omit it. Add information only in the following cases:
  - When readers can no longer be expected to reach the conclusion on their
    own: complex technical or non-technical details; non-confidential inside
    information that may be disclosed; complicated chains of reasoning; etc.
  - When the event has had, or may have, a major impact: explain the
    background, reasons, and effects.
- If an explanation is truly necessary, append 1-2 more sentences, but keep
  the total under 5 sentences.
- Items in Markdown lists tend to be shorter (30-40 characters), better suited
  to list-style browsing.
- Regular weekly issues average 25-50 items; omnibus issues can contain
  60-190 items.

Regarding the "complex details" mentioned above, the test is: if we expect
the target reader to need to consult 3 or more sources of information
(including but not limited to the number of documents, functions etc. in a
program, and contacts) to independently verify a detail, then that detail
counts as a "complex detail".

Regarding the "complicated chains of reasoning" mentioned above, the test
is: a chain of reasoning counts as "complicated" if it meets any of the
following conditions:

- The conclusion is counter-intuitive to the target reader;
- The conclusion has 3 or more logical branches;
- Reaching the conclusion takes 3 or more reasoning steps;
- Reaching the conclusion requires drawing on cross-disciplinary knowledge,
  or on knowledge from different subfields within a single discipline.
  - Example of cross-disciplinary knowledge: needing to know some algorithm
    from bioinformatics or computational chemistry to prove that a compiler
    or library optimization actually benefits the scenario claimed by its
    author.
  - Example of knowledge across subfields within a single discipline:
    needing to know some detail of programming for high-reliability scenarios
    or of game programming to conclude that a compiler or kernel change is
    justified.

## Sentence construction {/* #sentence-construction */}

### Dominant template {/* #dominant-template */}

News-reporting items almost universally follow this pattern:

```markdown
X 月 X 日，谁[动词了](链接)什么……。

谁以/用/通过/……什么，[动词了](链接)什么……。

谁[动词了](链接)什么。这解决了/代表着/意味着/……什么……。
```

Examples:

```markdown
Huacai Chen [发出了](https://lore.kernel.org/...) 适用于龙芯 3 号处理器的自动调频驱动。
Xi Ruoyao [修复了](https://gcc.gnu.org/...) LoongArch 硬件断点的几个实现问题。
Bibo Mao [实现了](https://lore.kernel.org/...) KVM 半虚拟化快速自旋锁。
```

### Link placement {/* #link-placement */}

- **55.3% of links are attached directly to the central verb of the
  sentence** — this is the defining stylistic signature.
- Only attach links to noun phrases when the link is inappropriate for the
  central verb, or when there are multiple secondary links. For example:
  - `X [提出了](url1)……，见[上游的跟踪 issue](url2)`；
  - `X [解决了](url1)先前 Y [提交的](url2) Z 的 XXX 问题`；
  - `X 做了一系列重构：[甲]、[乙]、[丙]`。
- When composing each sentence, always prefer attaching the hyperlink to the
  sentence's central verb. Layout the sentence to specifically facilitate this
  if readability hurts otherwise.

### Frequently linked central verbs {/* #frequently-linked-central-verbs */}

The 10 central verbs that most frequently carry attached links in published
content are as follows, for your reference:

`修复了`(96)、`增加了`(47)、`贴出了`(29)、`提交了`(24)、`优化了`(19)、
`发布了`(18)、`实现了`(18)、`发出了`(14)、`合并了`(12)、`允许了`(12)

### Prefer concrete verbs {/* #prefer-concrete-verbs */}

`增加`、`添加`、`新增`、`优化` are all highly abstract descriptions of actions
that convey little about what the contributor actually did. When you encounter
these verbs, **first consider whether a more fitting specific verb exists**.
Keep using them only when there is no better choice.

Specifically, when you see `添加`, it should almost always be replaced with
`增加`, in order to fit the writing style of existing text.

Recommended replacement directions:

| Actual action | Preferred verb |
|---|---|
| Implemented support for some hardware / driver / subsystem | `实现了`, `引入了` |
| Implemented some feature | `实现了`, `提供了` |
| Enabled / opened up some config option or capability | `启用了`, `打开了` |
| Wrote new tests or documentation | `编写了` |
| Ported / adapted support for some architecture | `移植了`, `引入了` |
| Extended / generalized an existing feature | `扩展了`, `泛化了` |
| Cannot be classified into any of the above | Keep as-is |

:::info[About the verb 提交 (submit)]

`提交了` only describes the action of "sending out a patch", and generally
cannot be used to state or imply that "the code has been merged" — unless
worded as "submitted **to the central repository**…", which is wordier than a
dedicated verb such as "merged".

Therefore, when the intent is to convey that "the patch has been merged into
mainline", prefer wording such as `合并了`.

:::

### Verb aspect and temporal adverbials {/* #verb-aspect-and-temporal-adverbials */}

- The vast majority of reported events have already concluded, so the most
  natural choice is the **perfective aspect** (verb + `了`).
- For events with a definite timestamp, write out the time adverbial
  explicitly, preferably at the start of the sentence:
  `X 月 X 日，XXX 修复了 XXX 的 XXX……`
- For events still ongoing at the time of writing, provide a current-time
  reference: `截至目前（X 月 X 日 XX:XX），……` or
  `截至发稿时（X 月 X 日 XX:XX），……`.
- Items in Markdown lists sometimes omit the sentence-final period, but they
  still retain the perfective marker `了`.

## Editorial commentary {/* #editorial-commentary */}

### When to comment {/* #when-to-comment */}

Roughly 10% of items carry explicit editorial commentary (excluding standalone
`:::info` blocks). Commentary appears in the following situations:

| Situation | Typical phrasing (Chinese) |
|---|---|
| Thanking contributors | `辛苦了！`, `欢迎欢迎！`, `让我们感谢…`, `（感谢 … 的线索投递）` |
| Corrections / apologies | `更正声明`, `有失偏颇`, `在此谨向…道歉` |
| Explaining significance | `这意味着…`, `鉴于此…`, `因此…` |
| Providing historical context | `从前…`, `先前…`, `在…的年代` |
| Speculation / analysis | `大概率…`, `笔者猜测…`, `笔者认为…` |
| Code-quality judgments | `不可接受`, `遑论`, `优雅不能当饭吃` |
| Editor-in-chief commentary | Dedicated remarks on ABI decisions, toolchain changes |

### `:::info` block usage {/* #info-block-usage */}

- **Technical deep dives**: explain *how* a mechanism works (e.g., linker
  relaxation internals)
- **Historical context**: the backstory behind an event (e.g., why a PR was
  delayed)
- **Corrections / clarifications**: amend or supplement prior coverage
- **Editor-in-chief commentary**: opinions on significant design decisions
- **Citation notices**: e.g., fair-use declarations
- `:::tip` blocks are used for lighthearted trivia or tips

### Rules of thumb for editorial commentaries {/* #rules-of-thumb-for-editorial-commentaries */}

- Editorial voice should feel **natural and restrained**. Do not comment on
  every item.
- `:::info` blocks should carry a clear title (using the `:::info[Title]`
  syntax), and their content should be relatively self-contained.
- When correcting prior coverage, use the `:::info[更正声明]` (Corrigendum)
  format, in a formal, accountable tone and wording.
- Gratitude should be sincere and concise; avoid hyperbole.

## Science communication {/* #science-communication */}

### Current distribution {/* #current-distribution */}

Based on automated classification of 1,836 items:

| Depth | Count | % |
|---|---|---|
| None (pure reporting) | 1,226 | 66.8% |
| Slight (1 explanatory cue) | 337 | 18.3% |
| Moderate (2-3 cues) | 201 | 10.9% |
| Detailed (≥ 4 cues) | 72 | 3.9% |

The explanation rate shows an upward trend: 28.0% (2023) → 38.7% (2024) →
40.3% (2025, early data).

### Topics that warrant explanation {/* #topics-that-warrant-explanation */}

The following topics are usually accompanied by in-depth explanation:

| Topic | Examples |
|---|---|
| **Linux internals** | Why LoongArch uses `statx` instead of `fstat`; the security properties of vDSO `getrandom`; how paravirtualization achieves the 566% performance improvement |
| **Design decisions** | Why `R_LARCH_CALL36` keeps its encoding; the semantic difference between "PC-relative" and "PC-aligned"; why `pcalau18i` was never added |
| **Compiler optimization principles** | Why `bstrins` beats shift+mask; how linker relaxation interacts with `-mexplicit-relocs`; the four independent root causes of the GCC CoreMark performance-regression incident |
| **ISA design** | Instruction-bitfield analysis of the FP16/FP128 encoding gaps; LA464's undefined 32-bit division behavior and how LA664 fixed it |
| **Detail or non-technical background knowledge** | What BOLT is; why the state of the LoongArch documentation repository blocked binutils changes |

The following topics are typically reported **without** explanation:

- Routine bug fixes (verb-only, no rationale)
- Simple feature additions
- Distribution news (`X released an ISO`)
- Most individual patches, whether to LLVM or other projects
- Less serious content: `社区整活:儿:` (community fun), game testing, etc.

### Recommended explanation structure {/* #recommended-explanation-structure */}

When explanation is warranted, follow a **three-part structure**:

1. **Fact** (1 sentence, perfective aspect): X \[did\](link) Y.
2. **Why it matters / how it works** (1-3 sentences; the wording below is
   only one viable framework — please do not follow it mechanically): This
   was necessary because Z. This means…
3. **Impact / takeaway** (0-1 sentence): Therefore, users should… / This enables…

### Quantifying explanation depth {/* #quantifying-explanation-depth */}

The analysis script estimates explanation depth by counting the number of
characteristic marker words detected. There are seven categories of markers:

| Category | Example markers (Chinese) |
|---|---|
| **Cause** | 因为、由于、这是因为、原因是、具体来说 |
| **Consequence** | 这意味着、这会导致、其作用、其目的是 |
| **Purpose** | 用于、以实现、来达到、从而、以便 |
| **Contrast** | 相比之下、与…不同、而非、而不是 |
| **Temporal** | 先前、此前、过去、原本、现在、随后 |
| **Definition** | 是一种、指的是、对应、等同于、相当于 |
| **Modality** | 需要、要求、必须、应该、可以 |

| Count | Rating |
|---|---|
| ≥ 4 | Detailed |
| 2-3 | Moderate |
| 1 | Slight |
| 0 | Pure reporting |

## Examples {/* #examples */}

### Pure reporting {/* #pure-reporting */}

```markdown
Tiezhu Yang [fixed](https://lore.kernel.org/...) some details in the handling
of the TIF_LOAD_WATCH thread flag for userspace watchpoints.
```

### Slight explanation {/* #slight-explanation */}

```markdown
Hui Li [fixed](https://lore.kernel.org/...) several issues in the LoongArch
hardware breakpoint implementation.
```

### Moderate explanation {/* #moderate-explanation */}

```markdown
On July 5, Sui Jingfeng [merged](https://cgit.freedesktop.org/...) the
Loongson display controller DRM driver. He had [obtained](https://gitlab.freedesktop.org/...)
commit access to the drm-misc repository the day before. This means integrated
graphics users should be able to light up a display with upstream kernels going
forward; 2D/3D acceleration is separate work.
```

### Detailed explanation + editorial commentary {/* #detailed-explanation-editorial-commentary */}

See the `:::info` blocks throughout the newsletter archives for extended
discussions of linker relaxation, ABI design decisions, ISA encoding analysis,
and similar deep topics. These are typically placed in standalone callout
blocks rather than inline in reporting items.

## Reporting principles {/* #reporting-principles */}

### Provenance links {/* #provenance-links */}

**Every TWiL news item must carry at least one source link.** This allows
readers to verify and explore items independently, and supports future
traceability. Transitional paragraphs, section introductions, and other
boilerplate content are exempt.

This rule applies to all sections, including `社区整活:儿:` (community fun).
If something has no public link to cite, then the editor cannot have known
about it, and it could never have been written up. If, however, content is
genuinely worth reporting but exists only in non-public channels (e.g.,
WeChat group chat records; WeChat does not support exporting group chat
history as a public URL):

- The editor **must** first obtain permission from the original author to
  reproduce the content.
- After obtaining permission, the editor should move the content to a
  publicly visible location (screenshots or other suitable forms) and cite
  that location in the report.
- The editor **must not** guess or fabricate a URL. If no compliant source
  link can be provided, the news item must be removed.

:::info[Additional requirements for AI agents]

When an AI agent is handling a news item without source links:

- If the agent can help the user find an equivalent public source (including
  but not limited to lore.kernel.org and GitHub PRs), it must clearly inform
  the user that it found the link, and **ask the user for a second
  confirmation**, to guard against hallucination.
- If no equivalent public source can be found, the agent must report this to
  the user and ask the user to provide a link; it must not bypass this step
  and publish directly.
- Record in the commit message how the source link was obtained
  (self-located and provided / user-provided / not obtainable and removed).

:::

### Patchset reporting granularity {/* #patchset-reporting-granularity */}

Patchsets are the primary source of Linux kernel and toolchain news. To
ensure that readers can scan the content efficiently, please:

- **Only report revisions where the latest version carries a major change.**
  A "major change" means:
  - a design overhaul;
  - a rewrite of the implementation under a similar design;
  - a takeover of upstream work from elsewhere (change of author);
  - any other change that cannot be dismissed as a minor fix-up.
- Routine review follow-ups and minor corrections (typo fixes, comment
  additions, cc stable additions/removals, etc.) **do not constitute a news
  item**.
- If a patchset was already covered in earlier issues and the new revision
  this week has no major change: **delete the item entirely**.
- In other words, only content of the following nature counts as "news".
  Routine follow-up work does not.
  - The first public appearance of substantive work, or a major change to it;
  - Formal announcements of substantive work: merged into mainline; a new
    version containing it has been tagged; a distribution shipped the feature
    ahead of schedule; …

This rule means that most "v1→review→v2→review→v3" chains — whether coming
from other newsletters or from raw reporting material — will either be
collapsed to **at most one sentence** (if the latest revision is a major
change) or **removed entirely** (if the latest change is yet another trivial
revision).

#### Special handling for backport patchsets {/* #special-handling-for-backport-patchsets */}

Backport patchsets are an exception to the rule above. Although their patches
are related in content to previously reported ones, they are **standalone
patchsets** and carry practical value for downstream distribution
maintainers:

- The **first submission** of a backport patchset and its **final merge
  notification** count as "news" and should be retained.
- Routine revisions within a backport patchset (typo fixes, cc stable
  adjustments, etc.) still follow the regular reporting-significance rules
  and do not constitute a news item.

:::info[Note on terminology]

Within AWLY/TWiL, "backport" should be uniformly translated as
「向后移植（backport）」 rather than 「回合」. The more common meaning of
「回合」 is 「轮次」 (n. turn, round), which becomes ambiguous in the context
of "backport". Please use 「向后移植」 consistently within AWLY/TWiL, and
spell out the English term on first mention. Examples:

- Verb usage: `将其向后移植（backport）到了`;
- Noun usage: `向后移植（backported）补丁`.

See the natural language style guide at `natlang-style-guide.md`.

:::

## Adapting contributions from other newsletters {/* #adapting-contributions-from-other-newsletters */}

Contributors (including new editors) sometimes also write for other
LoongArch newsletters. Those newsletters serve different audiences, so the
style of the raw copy may systematically diverge from TWiL's:

- **Newsletters targeting non-technical readers** often carry plenty of term
  explanations, even for terms that would be familiar to developers who have
  been doing LoongArch bring-up for more than three months;
- **Suspected KPI-driven content** sometimes goes so far as to track every
  round of code review and every piece of routine development follow-up;
- **TWiL, by contrast, targets a technical audience** that is expected to
  follow links or look up background knowledge on its own. Each item should
  be relatively self-contained and scannable.

### Common divergences and how to handle them {/* #common-divergences-and-how-to-handle-them */}

| Divergence | Other newsletter style | TWiL treatment |
|---|---|---|
| **Review cycles** | Track full v1→review→v2→review→v3 arcs | Apply [patchset reporting granularity](#patchset-reporting-granularity): keep only the latest revision with significant changes; drop entirely if no significant change |
| **Term explanations** | `PR_SET_SYSCALL_USER_DISPATCH (a Linux prctl operation that…)` | Delete the parenthetical or standalone-sentence explanation. If a concept genuinely needs to be explained for TWiL's target readers, write a dedicated `:::info` block instead |
| **Coverage** | Exhaustive lists (e.g., every one of Box64's 11 PRs within a single cycle) | Pick 2-3 of the most important highlights; omit the rest or summarise them in one sentence |
| **Verb choice** | `添加了` (added) | Replace with a more specific verb first (`实现了`, `启用了`, `引入了`, etc.); use `增加了` only when no suitable replacement exists. See [prefer concrete verbs](#prefer-concrete-verbs) |
| **Editorial voice** | Neutral, cold, no commentary | If something merits commentary, add a `:::info` block or a brief *this means…* sentence; otherwise do not force it |

### Style adaptation checklist {/* #style-adaptation-checklist */}

When receiving raw copy written for (or influenced by the style of) another
newsletter, apply the following steps:

1. **Apply patchset granularity rules**: Split or delete items that cover
   multiple patch revisions or review rounds. Keep only the latest revision
   containing a [major change](#patchset-reporting-granularity) (design
   overhaul, implementation rewrite, change of author, etc.); routine
   follow-up work (typo fixes, cc stable additions/removals, review
   back-and-forth) should be deleted wholesale.
2. **Check provenance**: Ensure every news item has at least 1 source link.
   For items without links: locate a link yourself and ask the user for a
   second confirmation, or ask the user to provide one. Items for which no
   link can be provided should be deleted. Comply with all the traceability
   constraints of the [provenance link](#provenance-links) rule (including
   the public traceability requirement for the `社区整活:儿:` section).
3. **Trim inline explanations**: In general, remove the parenthetical
   explanations (`（是…，用于…）`) from reporting sentences. If a concept
   truly must be explained for the TWiL audience, expand it into a standalone
   `:::info` block instead.
4. **Trim lengthy lists**: Reduce overlong item lists (e.g., where every
   commit of a project is listed separately) to 2-3 highlights. Where
   possible, drop the Markdown list format altogether and rewrite the content
   as natural paragraphs.
5. **Normalize terminology**: Check and replace wording that deviates from the
   style guide. In particular, replace the abstract `添加`/`增加` with more
   specific verbs (e.g., `实现了`, `启用了`, `引入了`); keep `增加` only when no
   suitable replacement exists. See [prefer concrete verbs](#prefer-concrete-verbs).
6. **Verify section coverage**: Confirm that all mandatory sections
   (`先「马」再看`, `杂闻播报`, `张贴栏`) are present. The
   `社区整活:儿:` (community fun) section is not mandatory: if there is no
   sufficiently interesting community content this week, don't force it — it
   may be omitted.
7. **Supplement editorial commentary as needed**: If the issue contains
   technical topics worth a deeper dive, write 1-2 additional `:::info`
   blocks. If contributors worth thanking or code-quality topics worth
   commenting on arise naturally, thank or comment on them using the
   established editorial tone. Do not force it — for issues where it does not
   fit, prefer keeping the issue's substance-first character over pushing an
   editorial personality.
8. **Fix metadata**: Verify that `slug`, `date`, `draft` status, and other
   frontmatter fields are correct.
