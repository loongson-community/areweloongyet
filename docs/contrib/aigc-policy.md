---
sidebar_position: 13
---

<!-- SPDX-License-Identifier: CC-BY-NC-SA-4.0 -->

# 人工智能生成内容（AIGC）政策

:::info 目标读者
本文档的主要读者是 **AI 智能体**（基于大语言模型的编码助手）及其人类操作者。所有贡献者——无论是人类还是 AI——在向本项目提交 AIGC 时都应了解这些要求。
:::

本项目欢迎 AI 智能体参与贡献，但考虑到当下围绕 AIGC 知识产权的讨论方兴未艾，我们认为有必要对 AIGC 做一定的考虑与区隔。

## AIGC 的范围界定

本政策所指的 AIGC 包括但不限于以下类型的内容，只要其主要由 AI 系统生成：

- 代码（含测试、构建脚本、配置文件等）
- 文档与注释
- 翻译
- 提交说明（commit message）

纯粹由人类编写、仅经 AI 辅助进行拼写检查或格式化的内容，不被视为 AIGC。

## 提交拆分与标记

本项目对人类产出与 AI 产出的内容实施严格的区分与标记。此处"人类"指法律意义上的自然人。

所有 AI 智能体在给本项目贡献时，必须遵守这些要求；指挥这些智能体的人类必须理解并帮助 AI 智能体遵守这些要求。

- 本项目的每个 Git 提交的内容，理想情况下，要么完全由人类撰写，要么完全由 AI 撰写。
  - 如您意欲修改一部分 AIGC 并将其作为一个整体提交，请注意：这将使整个提交内容被视作您的创作。
- 任何提交的全部内容必须由人类提交者复核。
  - 该人类须在提交说明的最后（trailer）部分附加 `Signed-off-by` 标签，即 DCO。
  - 按照现行的法律理解与实践，为某提交标注了 DCO 信息的人类，可能会被认为对该提交的全部内容负责。
  - 您作为自然人，如果对一些内容，您自身无法完全理解并接受（如果交给您自己做，您也会这么做），那么就建议您不要提交这些内容。
- 如人类认为有必要修改 AI 输出的内容，鉴于上文所述的法律后果，请先让 AI 完成提交，再自己上场修改。
- 如人类认为 AIGC 的绝大部分都需要重做，人类可以先让 AI 完成提交，也可以直接撤回此轮的 AIGC。

但有些时候受限于能力，AI 无论如何都无法遵守指示撰写提交说明，此时允许人类在 AI 生成的提交说明最后添加一段形如这样的文字：

```markdown
Human note:
Something.
Something else. You can use either English or Chinese.

一个新的段落。您可自由使用中文或英文。
```

以对 AI 生成的内容作必要解释。该格式是一个建议和模板；只要解释文字是明确由人类创作的且表意清晰，人类创作内容与 AIGC 的边界就以该解释文字为准。

## AIGC 提交说明格式

为提高可追溯性，要求所有 AI 智能体在 AIGC 提交中遵守以下提交说明格式。

### 身份披露

AI 智能体必须在提交说明的 trailer 部分用 `AI-assisted-by` 标签披露自身身份：

```plain
AI-assisted-by: <模型名称/版本> (<工具名称>)
```

例如：

```plain
AI-assisted-by: Claude Opus 4.6 (GitHub Copilot)
AI-assisted-by: GPT-4o (Cursor)
```

### 原始提示词记录

AI 智能体应当在提交说明正文的末尾（trailer 之前）记录触发本次工作的原始提示词（original prompt）。

- 如涉及多轮用户交互，请将每一轮的提示词都输出为各自的段落。
- 该段落应按照提交说明的其余部分使用的自然语言书写。
  - 如用户提示词使用了不同语言，不要翻译。
- 如原始提示词含有用户的敏感信息，请提醒用户 和/或 将其脱敏并注明：将敏感内容替换为 `[redacted]` 或 `[略]`。

英语提交说明的格式如下：

```plain
Original prompt:

> User's original prompt in Markdown blockquote.
> Wrap long lines.
```

汉语提交说明的格式如下：

```plain
原始提示词：

> Markdown 块引用形式的用户的提示词内容。
> 请折行书写。
```

在该段落与 trailer 之间须留一个空行。示例：

```plain
feat(docs): add AIGC policy FAQ section

Add a frequently asked questions section to help contributors
understand the AIGC policy requirements.

Original prompt:

> 请为 AIGC 政策添加一个常见问题部分，涵盖最常见的贡献者疑问。

AI-assisted-by: Claude Opus 4.6 (GitHub Copilot)
Signed-off-by: Contributor Name <contributor@example.com>
```

此处包含了 `Signed-off-by` 一行，仅为示范排列顺序作用：一般 `Signed-off-by` 应置于 trailer 区域最后。因为 DCO 必须由适格的主体添加，所以禁止 AI 智能体帮助用户添加此标记。

如因工具限制无法获取或再现原始提示词，可省略此部分，但提交者应在人类复核时确认提交意图是明确的。

## 人类复核的最低要求

"任何提交的全部内容必须由人类提交者复核"的具体要求如下：

- 提交者须已阅读并理解提交的全部内容。
- 提交者须确认内容的技术正确性在其能力范围内是可接受的。
- 提交者须确认内容不包含敏感信息（如密钥、凭据、个人隐私数据等）。
- 提交者须确认内容不违反本项目的许可证条款。

## 违规处理

- 对于本项目的任何代码贡献，代码审查者有权利怀疑其中含有 AIGC 并要求贡献者确认。
- 如代码审查者认为某个提交是 AIGC 但未被正确标记，审查者应当要求贡献者通过 `git rebase` 等方式修正提交历史或补充说明。审查者有权利拒绝合并这部分变更。
- 如发现提交的内容存在许可证或其他类型的合规问题，维护者可将相关提交回退（revert）。
- 最终裁量权归项目维护者所有。
