---
slug: this-week-in-loongarch-42
title: 每周一龙：第 42 期
authors: [xen0n]
date: 2024-03-25T23:50:00+08:00
tags: [每周一龙]
---

每周一都为大家报道 LoongArch 社区最前线的第一手新鲜资讯！
上周的进展主要有 Linux 以及工具链。
详情点进来看！

<!-- truncate -->

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

## 先「马」再看 {#marked-projects}

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch 领域的重要或长期项目（坑）。

### Linux {#linux}

Linux 6.9-rc1 已于北京时间周一清晨[发布](https://lore.kernel.org/lkml/CAHk-=wgOw_13JuuX4khpn4K+n09cRG3EBQWufAPBWoa0GLLQ0A@mail.gmail.com/)。
先前 3 月 22 日 Huacai Chen [发出了](https://lore.kernel.org/loongarch/20240322135619.1423490-1-chenhuacai@loongson.cn/)本开发周期的
LoongArch 架构相关变更，也顺利进入了主线。主要的变更有：

* 增加了 ORC stack unwinder 支持（Tiezhu Yang）；
* 增加了运行时补丁（livepatching）支持（Jinyang He）；
* [修复了](https://lore.kernel.org/linux-kernel/20240315024526.394772-1-chenhuacai@loongson.cn/T/)
  `__my_cpu_offset` 被错误优化而可能导致的锁语义错误（龙芯与 AOSC）；
* 修复了两处 Kconfig 配置（Huacai Chen）。

### 工具链 {#toolchain}

#### binutils {#binutils}

Tiezhu Yang 为 GDB [增加了](https://sourceware.org/git/?p=binutils-gdb.git;a=commitdiff;h=53ff349e553fa9fc446a8711e37fd252282b088b)
LoongArch 系统调用的调试支持。

#### GCC {#gcc}

Jiahao Xu [计划移除](https://gcc.gnu.org/pipermail/gcc-patches/2024-March/648211.html)
32 位 LoongArch 上 SIMD 扩展的编译器支持。这似乎意味着不会出现此类的 LoongArch
硬件，或者说此类「跨界」的功能组合不被允许了。
在同一补丁中，Jiahao Xu 还为 `vpickve2gr.d[u]` 指令的模板增加了符合指令实际行为的符号或零扩展动作。

#### LLVM {#llvm}

第 38 期周报[报道的](./2024-02-27-this-week-in-loongarch-38/index.md#llvm)
`addrspacecast` 补丁，现已[往回移植到了](https://github.com/llvm/llvm-project/pull/86372)
LLVM 18 分支，将于 4 月 16 日前后的 LLVM 18.1.3 正式发布。

## 杂闻播报 {#assorted-news}

[yetist] [响应了](https://github.com/loongson-community/discussions/issues/5#issuecomment-2014708472)先前挂出的英雄帖——移植内存测试工具
memtest86+ 到 LoongArch：「已经开始研究了」。

[ksco] [已在着手](https://github.com/ptitSeb/box64/commits/main/src/dynarec/la64)将 Box64 移植到 LoongArch64。

[ksco]: https://github.com/ksco
[yetist]: https://github.com/yetist

## 张贴栏 {#bulletin}

本栏目可供张贴公益性质的各种信息。

* 您可在 GitHub [浏览](https://github.com/loongson-community/discussions/labels/%E8%8B%B1%E9%9B%84%E5%B8%96)目前所有开放的英雄帖。
* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16
