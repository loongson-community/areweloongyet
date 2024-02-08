---
slug: this-week-in-loongarch-4
title: 每周一龙：第 4 期
authors: [xen0n]
date: 2023-06-05T14:10:50+08:00
tags: [每周一龙]
---

每周一都为大家报道 LoongArch 社区最前线的第一手新鲜资讯！

<!-- truncate -->

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

## 要闻速递

龙芯的 binutils 维护者 mengqinggang 将先前报道过的 LoongArch linker relaxation
优化[推入了上游](https://sourceware.org/git/?p=binutils-gdb.git;a=commitdiff;h=57a930e3bfe4b2c7fd6463ed39311e1938513138)。
但由于 [LoongArch-Documentation 库](https://github.com/loongson/LoongArch-Documentation)的特殊情况仍未解除，
与此改动配套的 ELF psABI 规范文档更新也仍然没有发生。
对于这些新 relocs 的用法，目前只能以代码的具体行为为准。

binutils 的其他上游维护者随后帮忙修复了 LoongArch 代码的一些[风格问题](https://sourceware.org/git/?p=binutils-gdb.git;a=commitdiff;h=a15891aaea006d06066573449efbda353dd2863e)与
通过fuzzing 发现的[缓冲区溢出问题](https://sourceware.org/git/?p=binutils-gdb.git;a=commitdiff;h=74a965d8e09217f3d8f8295c9126b77cdd62b798)、[段错误问题](https://sourceware.org/git/?p=binutils-gdb.git;a=commitdiff;h=89c70cd358b8fa46b84cd100efc95495ff0160ae)。

建议关心龙架构基础设施建设、质量的同学也可以关注 binutils 等上游的沟通渠道，一起参与龙架构相关代码、功能、质量的完善。

## 先「马」再看

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch 领域的重要或长期项目（坑）。

### 发行版们

* Gentoo 上游已将 [`kdeutils-meta`][kdeutils]、[`kdegames-meta`][kdegames] 两个 meta-packages keyworded，有需要的同学可直接 `emerge` 了。
* Gentoo 正在为 Rust 1.71.0 的龙架构支持[做好准备](https://github.com/gentoo/gentoo/pull/31241)。顺带也将修复老龙芯系统的 Rust 支持。

[kdeutils]: https://packages.gentoo.org/packages/kde-apps/kdeutils-meta
[kdegames]: https://packages.gentoo.org/packages/kde-apps/kdegames-meta

### ClangBuiltLinux

[上游的跟踪 issue](https://github.com/ClangBuiltLinux/linux/issues/1787)
也会及时反映最新动态。

本周没有这方面的新动向。

### Linux

6 月 1 日，知名科技媒体 Phoronix [报道了](https://www.phoronix.com/news/Loongson-Etnaviv-PCI-Driver)
Sui Jingfeng 为龙芯 2K1000 和 LS7A1000 内置的 Vivante GC1000 GPU IP
做的[内核适配](https://lore.kernel.org/lkml/20230530160126.2344425-1-suijingfeng@loongson.cn/)和
[Mesa 适配](https://gitlab.freedesktop.org/mesa/mesa/-/merge_requests/14606)。

5 月 31 日，Binbin Zhou [贴出了](https://lore.kernel.org/loongarch/cover.1685448898.git.zhoubinbin@loongson.cn/)龙芯 2 号系列的 APB DMA 引擎支持。

5 月 31 日，Yanteng Si [贴出了](https://lore.kernel.org/loongarch/cover.1685501806.git.siyanteng@loongson.cn/) LS7A 桥片的高解析度音频（HD Audio）支持。

### LLVM

上周合并了以下的功能改进等：

* Ami-zhang [修复了][D151794] LLVM 静态分析组件对 LoongArch 的 `i32` 类型参数、返回值的处理。

出现了以下的新动向：

* xen0n 根据先前的 Linux 内核补丁，为 LLVM [添加了][D151655] 3A6000/LA664 的细粒度内存栅障支持。

[D151655]: https://reviews.llvm.org/D151655
[D151794]: https://reviews.llvm.org/D151794

## 社区整活:儿:

本栏目接受任何网友的投稿，只要内容与 LoongArch 有关，并可以为读者带来价值，
无论严肃贡献（整的大活:儿:）或是博君一笑都一概欢迎！

[KatyushaScarlet](https://github.com/KatyushaScarlet)
[向大家介绍](https://katyusha.net/536.html) :ta: 基于 DOSBox-X 整合的游戏模拟器。
不过似乎在 QEMU 模拟条件下可能无法启动。
感兴趣的同学可以加入 :ta: 的行列一起折腾！

## 张贴栏

本栏目目前可供张贴公益性质的各种信息。

* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[lauosc-debian]: https://bbs.loongarch.org/d/167-lauosc-debian-12-ports
[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16
