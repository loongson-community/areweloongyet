---
slug: this-week-in-loongarch-49
title: 每周一龙：第 49 期
authors: [xen0n]
date: 2024-05-20T18:00:00+08:00
tags: [每周一龙]
draft: true  # TODO
---

每周一都为大家报道 LoongArch 社区最前线的第一手新鲜资讯！
上周的进展主要有 TODO。
详情点进来看！

<!-- truncate -->

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

## 先「马」再看 {#marked-projects}

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch 领域的重要或长期项目（坑）。

### Linux {#linux}

TODO

### 工具链 {#toolchain}

#### binutils {#binutils}

mengqinggang 在邮件列表上[询问了](https://sourceware.org/pipermail/binutils/2024-May/134123.html)关于性能侧写（profiling）工具
`gprofng` 移植的技术细节。这表明龙芯已经将此工具的移植提上议事日程了。

#### LLVM {#llvm}

[heiher] 用上了 32 位除法、取余指令，[消除了]((https://github.com/llvm/llvm-project/pull/92205)这些
32 位操作的编译产物中，对结果进行的多余符号扩展。

[heiher] 还为 LoongArch 上的循环优化[开启了](https://github.com/llvm/llvm-project/pull/92629/files)交织向量化（interleaved vectorization）工序（pass），初期使用默认的交织系数 2。

[wangleiat] [允许了](https://github.com/llvm/llvm-project/pull/92222)在编译中使用尚未冻结的
ABI：ILP32S、ILP32F 与 LP64F，把致命错误降级为了警告。
随后，又[引入了](https://github.com/llvm/llvm-project/pull/92223)「目标特性隐含 ABI」（feature-implied ABI）的概念，
以修复编译时使用的目标特性与显式指定的 ABI（如果有的话）、「目标隐含 ABI」（target-implied ABI）都不兼容的情况下，编译产物的
ABI 属性设置错误的问题。例如：如果使用 `loongarch64` 作为目标元组，并明确制定

[wangleiat] 还[再次提议引入](https://github.com/llvm/llvm-project/pull/92483)模拟 TLS（emulated TLS）支持。根据提交说明，此特性应该是开源鸿蒙（OHOS）所需要的；先前人们基于此特性已经过时而不希望 LoongArch 作为一个新架构而仍然支持，目前看来可能要重新评估这一决定。

[heiher]: https://github.com/heiher
[wangleiat]: https://github.com/wangleiat

## 杂闻播报 {#assorted-news}

[lrzlin] 向 PCRE2 正则表达式库所用的 JIT 基础库 sljit
[增加了](https://github.com/zherczeg/sljit/pull/247) LSX 与 LASX 支持。

龙芯做的 Mono 龙架构移植[已进入上游](https://github.com/mono/mono/pull/21769)（链接目标为五个 PRs 中的最后一个）。Mono
是在微软的官方 .NET 运行时开源之前，由社区开发的 .NET 运行时；目前最著名的
Mono 使用者是游戏引擎 Unity。此次 Mono 主线加入 LoongArch 支持，有助于降低那些需要将其
Unity 项目向 LoongArch 部署的开发者的魔改工作量。

[lrzlin]: https://github.com/lrzlin

## 张贴栏 {#bulletin}

本栏目可供张贴公益性质的各种信息。

* 您可在 GitHub [浏览](https://github.com/loongson-community/discussions/labels/%E8%8B%B1%E9%9B%84%E5%B8%96)目前所有开放的英雄帖。
* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16
