---
slug: this-week-in-loongarch-36
title: 每周一龙：第 36 期
authors: [xen0n]
date: 2024-02-12T00:00:00+08:00
tags: [每周一龙]
draft: true  # TODO
---

每周一都为大家报道 LoongArch 社区最前线的第一手新鲜资讯！
上周的进展主要有 TODO，以及——农历甲辰龙年新年快乐:dragon:！
详情点进来看！

<!-- truncate -->

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

## 先「马」再看 {#marked-projects}

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch 领域的重要或长期项目（坑）。

### Linux {#linux}

TODO

### 工具链 {#toolchain}

#### ABI {#abi}

为搭配上期周报[提到的](./2024-02-05-this-week-in-loongarch-35.md#rust) Rust
LoongArch targets 默认代码模型变更，以在无需用户手动干预的前提下，允许链接 Chromium
等大型应用的同时，不影响较小应用的性能，[xen0n]
[发起了](https://github.com/loongson-community/discussions/issues/43)讨论。
有两种可行的做法，可以只做其中一种，也可以都做：

* 允许 relax `R_LARCH_CALL36` 即 `medium` 代码模型下的过程调用指令序列。
* 实现范围扩展片段（range extension thunks），以在 `R_LARCH_B26` 即单条 `bl`
  指令「够不着」跳转目标的情况下，生成小段的「蹦床」片段，帮助跳转到目标。

前者能确保那些实际只需一条指令即可表达的跳转，在最终代码中都如此短，有利于发挥性能；
后者则能为存量的代码提供兼容，方便开发者与用户的迁移。

[xen0n]: https://github.com/xen0n

#### binutils {#binutils}

TODO

#### GCC {#gcc}

TODO

#### LLVM {#llvm}

TODO

## 杂闻播报 {#assorted-news}

TODO

## 社区整活:儿: {#grins}

本栏目接受任何网友的投稿，只要内容与 LoongArch 有关，并可以为读者带来价值，
无论严肃贡献（整的大活:儿:）或是博君一笑都一概欢迎！

TODO

## 张贴栏 {#bulletin}

本栏目可供张贴公益性质的各种信息。

* 友情扩散：[安同开源社区（AOSC）][aosc]的龙架构移植主线化工作「合龙」已接近尾声，
  此工作完成后龙架构将升格为 AOSC OS 的 Tier 1 架构。
  欢迎同学们试用、反馈，也欢迎有志之士一同加入（沟通渠道详见 AOSC 网站相关栏目）。
* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[aosc]: https://aosc.io
[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16
