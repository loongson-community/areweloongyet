---
slug: this-week-in-loongarch-39
title: 每周一龙：第 39 期
authors: [xen0n]
date: 2024-03-05T21:00:00+08:00
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

#### ABI {#abi}

TODO

#### binutils {#binutils}

Lulu Cai 为 binutils 汇编器、反汇编器[补充了](https://sourceware.org/pipermail/binutils/2024-February/132734.html)所有
LoongArch 汇编语法的测试用例。

Lulu Cai 还为 LVZ 指令集扩展的 `gcsrxchg` 指令[补充了](https://sourceware.org/pipermail/binutils/2024-February/132733.html)比照其基础指令集等价物
`csrxchg` 的 `rj` 操作数约束检查，意在防止指令编码的实际含义变成 `gcsrrd` 或 `gcsrwr`。

:::info 为啥要特殊处理 CSR 指令的 `rj` 呢？
CSR、Guest CSR 系列指令各有 3 条，但同一组的 3 条指令都共享操作码，靠 `rj` 取值来区分语义。`rj`
是 `csrxchg` 指令的写掩码操作数，因此全零的 `rj` 就表示什么都不写入，这种情况下
`csrxchg` 便等效于 `csrrd` 了，而 `$r0` 正好就是保证为 0 的寄存器。但
LoongArch 设计师觉得这还不过瘾：按照 LoongArch 过程调用约定，`$r1` 固定表示返回地址，
因此设计师认为不可能有程序将 `csrxchg` 写掩码放入 `$r1`，于是将 `rj = 1` 的
`csrxchg` 定义为了特例，此时 `rj` 操作数指向的 `$r1` 并不表示写掩码，也不会被读取，
而是等价于将整个 `rd` 都写入指定的 CSR——像是 `$r1` 存放了全 1 的值一样。
这样做了之后，仅分配一个操作码便表示了三种具体操作，从而达到了「节省编码空间」的既定目的。

从个人理解和软件实现的角度，可以将 `csrrd`、`csrwr` 与 `csrxchg` 理解为操作码部分重合，但操作数格式不同的三条指令；
也可以将其理解为同一条广义 `csrxchg` 的语法糖，此指令在 `rj = 1` 时的行为是不读 `$r1` 而以全 1 的值作为写掩码。
在后一种理解下，通用的反汇编算法不再需要专门为这种指令实现两阶段处理，而将这部分工作留给更下游的应用——
大部分应用不那么底层，不需要关心特权架构，也就接触不到这部分复杂度；
而如果都到了要处理特权架构的程度了，这部分额外工作量不过是毛毛雨。
但从龙芯官方手册描述和代码实现来看，则可以看出这些工作人员都在采用前一种理解。
:::

1 月 26 日，mengqinggang [增加了](https://sourceware.org/git/?p=binutils-gdb.git;a=commitdiff;h=969f5c0e12c18595cbd16f2df73c4630d0635dfe)
`$s9` 为 `$fp` 寄存器的别名。早在 2021 年，LoongArch ABI 规范文档中就[已载明](https://github.com/loongson/LoongArch-Documentation/commit/de73529fa9f78e9796d97219af23c4f67b2b3de9)此别名，
但由于最早的一批 LoongArch 上游提交内容都基于更早期的旧世界代码，而远古年代并不存在
`$s9` 的提法——可考的最早提议是 [xen0n] 在此规范的首次公开亮相第二天[作出的](https://github.com/loongson/LoongArch-Documentation/pull/3#discussion_r684653367)，
因此此支持长期以来都为众人所忽视了。

[xen0n]: https://github.com/xen0n

#### GCC {#gcc}

[Xi Ruoyao][xry111] 为 gcc 也[增加了](https://gcc.gnu.org/pipermail/gcc-patches/2024-March/647193.html)将
`fp` 称作 `s9` 的支持。

#### LLVM {#llvm}

TODO

## 杂闻播报 {#assorted-news}

来自[安同开源社区][aosc]（AOSC）的新旧世界兼容层 `libLoL`
[发布了](https://liblol.aosc.io/docs/dev/changelog/#014) 0.1.4 版本，
同时[提供](https://github.com/AOSC-Dev/liblol/releases/tag/debian%2Fv0.1.4-1)适配
Debian 的安装包。
另外，社区[整理了](https://liblol.aosc.io/docs/apps/)旧世界应用的兼容性。
感谢[王邈][shankerwangmiao]提供新闻线索！

[aosc]: https://aosc.io

Linux From Scratch 12.1 的 LoongArch 版本——`loongarch-12.1` 现已发布，您可在以下网址阅读：

* [官网英文版，systemd 服务管理方式](https://www.linuxfromscratch.org/~xry111/lfs/view/loongarch-12.1-systemd/)
* [官网英文版，传统服务管理方式](https://www.linuxfromscratch.org/~xry111/lfs/view/loongarch-12.1/)
* [xry111 中文版，systemd 服务管理方式](https://lfs.xry111.site/zh_CN/loongarch-12.1-systemd/)
* [xry111 中文版，传统服务管理方式](https://lfs.xry111.site/zh_CN/loongarch-12.1/)

感谢 [xry111] 提供新闻线索！

Debian 的 Linux 内核团队[合并了](https://salsa.debian.org/kernel-team/linux/-/merge_requests/879)
Weihao Li 的架构支持补丁。随着 Debian 不稳定版的 Linux 版本上升到 `6.7.7-1`，Debian
内核终于支持了 LoongArch。
感谢 [zhangn1985] 提供新闻线索！

[shankerwangmiao]: https://github.com/shankerwangmiao
[xry111]: https://github.com/xry111
[zhangn1985]: https://github.com/zhangn1985

## 张贴栏 {#bulletin}

本栏目可供张贴公益性质的各种信息。

* 您可在 GitHub [浏览](https://github.com/loongson-community/discussions/labels/%E8%8B%B1%E9%9B%84%E5%B8%96)目前所有开放的英雄帖。
* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16
