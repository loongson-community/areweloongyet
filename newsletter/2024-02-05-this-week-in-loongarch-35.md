---
slug: this-week-in-loongarch-35
title: 每周一龙：第 35 期
authors: [xen0n]
date: 2024-02-05T17:00:00+08:00
tags: [每周一龙]
draft: true  # TODO
---

每周一都为大家报道 LoongArch&reg; 社区最前线的第一手新鲜资讯！
上周的进展主要有 TODO。
详情点进来看！

<!-- truncate -->

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

## 先「马」再看 {#marked-projects}

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch&reg; 领域的重要或长期项目（坑）。

### Linux {#linux}

Linux 构建系统维护者 Masahiro Yamada 帮忙跟进了两处 Kconfig 相关改动：

* [切换至](https://lore.kernel.org/loongarch/20240204134946.62509-1-masahiroy@kernel.org/)公共的
  seccomp 选单：[先前的重构](https://github.com/torvalds/linux/commit/282a181b1a0d)完成时，LoongArch
  还尚未进入主线，因此错过了。
* [修复了](https://lore.kernel.org/loongarch/20240204134813.61884-1-masahiroy@kernel.org/)
  `ARCH_ENABLE_THP_MIGRATION` 选项的控制方式。

Huacai Chen [修复了](https://lore.kernel.org/loongarch/20240131072151.1023985-1-chenhuacai@loongson.cn/)
Linux 6.7 以来，大型（NUMA 节点数量超过 8）LoongArch 机器启动时无法引导从核的问题。
此修复也会进入 v6.1、v6.6 两个稳定分支。

同为 Linux 维护者的信息安全研究者 Kees Cook
帮忙[修复了](https://lore.kernel.org/loongarch/20240130233140.work.887-kees@kernel.org/)开启
UBSAN 时无法构建 LoongArch vDSO 的问题。

Bibo Mao [减少了](https://lore.kernel.org/loongarch/20240130072238.2829831-1-maobibo@loongson.cn/)
KVM 会启动软件模拟定时器的场合。

### 工具链 {#toolchain}

#### binutils {#binutils}

GNU Binutils 2.42 已于北京时间 1 月 29 日 23:57 [正式发布](https://sourceware.org/pipermail/binutils/2024-January/132213.html)。
好消息是：该版本包含了上期周报[提到的](./2024-01-29-this-week-in-loongarch-34/index.md#binutils)最后关头的 TLS relaxation 修复；
坏消息是，没有人在正式发布前拿 GCC 14 做过测试，
因此很快[被发现了](https://sourceware.org/pipermail/binutils/2024-February/132266.html)一些问题。
当时 xen0n 报告的无法开启 LTO 构建 Firefox、Thunderbird 等软件的问题也未被修复。

不过，[Xi Ruoyao][xry111] 很快便将此问题[定位并修复了](https://sourceware.org/pipermail/binutils/2024-February/132290.html)：
在先前的 TLS relaxation 工作中，忘记将那些通过 `%le_{hi20,lo12,add}_r`
三种方式被引用的符号类型也标记为 TLS 了。
请打包人们按需集成。

感谢 Xi Ruoyao 提供本节的新闻线索！

[xry111]: https://github.com/xry111

#### GCC {#gcc}

TODO

#### LLVM {#llvm}

TODO

## 杂闻播报 {#assorted-news}

TODO

## 社区整活:儿: {#grins}

本栏目接受任何网友的投稿，只要内容与 LoongArch&reg; 有关，并可以为读者带来价值，
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
