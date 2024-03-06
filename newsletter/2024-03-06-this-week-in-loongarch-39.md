---
slug: this-week-in-loongarch-39
title: 每周一龙：第 39 期
authors: [xen0n]
date: 2024-03-06T19:20:00+08:00
tags: [每周一龙]
---

每周一都为大家报道 LoongArch 社区最前线的第一手新鲜资讯！
上周的进展主要有 Linux、工具链与发行版适配。
详情点进来看！

<!-- truncate -->

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

本期周报的实际发稿时间是周三晚间，因为前两天都在忙别的——以为这周信息量不高。

## 先「马」再看 {#marked-projects}

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch 领域的重要或长期项目（坑）。

### Linux {#linux}

社区[仍在讨论](https://lore.kernel.org/loongarch/20240302082532.1415200-1-maobibo@loongson.cn/T/#m6a08c8474fdcf83d7345f388793209164cb65725)
Linux KVM 在 LoongArch 上的 hypercall 接口定义细节。

Huacai Chen 拟在架构代码中[代替驱动保证](https://lore.kernel.org/loongarch/20240305143958.1752241-1-chenhuacai@loongson.cn/)
IO 操作的顺序语义，具体来说是将 `__io_aw()` 定义为 `mmiowb()`，并废除先前为
qspinlock 自定义的行为。但由于涉及精妙、艰深的锁操作，预计仍需一些讨论才能确定此变更是否合理。

Bibo Mao [细化了](https://lore.kernel.org/loongarch/20240305113343.1667480-1-maobibo@loongson.cn/)
KVM `CPUCFG` 配置字的受支持位域信息。

WANG Rui 跟进上游重构，将 LoongArch Linux 所用的 Rust target
[切换为了](https://lore.kernel.org/loongarch/20240304141426.163517-1-wangrui@loongson.cn/)
Rust 内建的 `loongarch64-unknown-none-softfloat`。这降低了一些复杂度与维护工作量。

### 工具链 {#toolchain}

#### binutils {#binutils}

近期来自龙芯的维护者 Lulu Cai 生产力爆棚：

* [允许了](https://sourceware.org/pipermail/binutils/2024-March/132839.html)
  gas 在解析到非法操作数之后继续处理余下输入，而非直接退出。这有助于一次性看清输入中存在的所有错误。
* [继续迭代](https://sourceware.org/pipermail/binutils/2024-March/132767.html)
  TLS transition 与 relaxation 功能。
* 为 binutils 汇编器、反汇编器[补充了](https://sourceware.org/pipermail/binutils/2024-February/132734.html)所有
  LoongArch 汇编语法的测试用例。
* 为 LVZ 指令集扩展的 `gcsrxchg` 指令[补充了](https://sourceware.org/pipermail/binutils/2024-February/132733.html)比照其基础指令集等价物
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

chenxiaolong [修复了](https://gcc.gnu.org/pipermail/gcc-patches/2024-March/647255.html)一些向量测试用例的错误。

Yang Yujie 为 musl libc [更换了](https://gcc.gnu.org/pipermail/gcc-patches/2024-March/647240.html)库查找路径：
从 `/lib64` 换回了 `/lib`，禁用了 multilib 处理。

[Xi Ruoyao][xry111] [重构了](https://gcc.gnu.org/pipermail/gcc-patches/2024-March/647197.html)向量浮点比较操作的测试用例，
通过避免使用固定寄存器号的方式，使相关循环能被向量化，进而让这些测试得以正常通过了。

[Xi Ruoyao][xry111] 为 gcc 也[增加了](https://gcc.gnu.org/pipermail/gcc-patches/2024-March/647193.html)将
`fp` 称作 `s9` 的支持。

#### LLVM {#llvm}

LLVM 18.1.0 已于中国时间 3 月 6 日下午[正式发布](https://github.com/llvm/llvm-project/releases/tag/llvmorg-18.1.0)。请打包人们在处理此版本时注意：

* 需要为 LLD 打上 [ULEB128 支持补丁](https://github.com/llvm/llvm-project/pull/83983)。
* 需要为 LLVM 打上 [CAS 操作符号扩展补丁](https://github.com/llvm/llvm-project/pull/83750)。

这些 backports 未能赶上 18.1.0，但后续的补丁版本应该会包含了，因此预计只需为
18.1.0 这个版本做特殊处理。

以下变更都对应当前开发中的分支，即 LLVM 19。

[MQ-mengqing] 一个月前为 LLD [增加了](https://github.com/llvm/llvm-project/pull/81133)
ULEB128 重定位操作的支持，这对 DWARF v5 调试信息的处理至关重要。此 PR 终于在 3 月 5 日合并了。

[wangleiat] 跟进先前在第 36 期周报[报道过的](./2024-02-12-this-week-in-loongarch-36.md#gcc)
GCC [同款修复](https://gcc.gnu.org/pipermail/gcc-patches/2024-February/645016.html)，为
Clang 也[修复了](https://github.com/llvm/llvm-project/pull/84100)
`__iocsrrd_h` 的返回值类型。

[wangleiat] 还为 LoongArch 代码生成后端[启用了](https://github.com/llvm/llvm-project/pull/83759)
Machine Scheduler。

[SixWeining] 为解决 Firefox JavaScript 原子操作的[行为错误](https://bugzilla.mozilla.org/show_bug.cgi?id=1882301)，仿照先前
RISC-V 的[类似修复](https://github.com/llvm/llvm-project/commit/616289ed29225c0ddfe5699c7fdf42a0fcbe0ab4)，
为 LoongArch CAS 操作的输入[做了符号扩展](https://github.com/llvm/llvm-project/pull/83656)。
此额外处理对拥有原生 CAS 支持的 LA664 微架构是不必要的；龙芯方面暂时没搞，[xen0n] 准备近期做掉。

[leecheechen] [避免了](https://github.com/llvm/llvm-project/pull/82984)
`llvm.loongarch.lasx.xvpermi.q` intrinsic 可能的未定义行为。

[leecheechen]: https://github.com/leecheechen
[MQ-mengqing]: https://github.com/MQ-mengqing
[SixWeining]: https://github.com/SixWeining
[wangleiat]: https://github.com/wangleiat

#### Rust {#rust}

[heiher] 与 [xiangzhai] 向 Rust `stdarch` SIMD intrinsics 库[贡献了](https://github.com/rust-lang/stdarch/pull/1535)
LSX 与 LASX 的包装。这将极大便利 Rust 生态内的 LoongArch SIMD 优化工作。
虽然代码目前已经合并了，也请关心这方面基础建设的同学们抽空测试、审查这些新增功能，以便尽早发现仍可能存在的设计、易用性问题等等。
感谢 [heiher] 提供新闻线索！

由于 Rust 官方使用的 LoongArch 工具链版本较低，在之前第 35 期周报[报道的](./2024-02-05-this-week-in-loongarch-35.md#rust)
`medium` 代码模型工作合并之后，[出现了](https://github.com/rust-lang/rust/issues/121289)死循环的问题，
[heiher] 只好将其[暂时回滚](https://github.com/rust-lang/rust/pull/121291)。
由于 GCC 13 与 binutils 2.42 无法互操作是[已知问题](https://github.com/loongson-community/discussions/issues/41)，
后续预计要等 crosstools-NG 项目[合并](https://github.com/crosstool-ng/crosstool-ng/pull/2095)
binutils 2.42 支持之后才方便恢复了。

[heiher]: https://github.com/heiher
[xiangzhai]: https://github.com/xiangzhai

## 杂闻播报 {#assorted-news}

[杰哥][jiegec]为 Debian GRUB [增加的](https://salsa.debian.org/grub-team/grub/-/merge_requests/42)
LoongArch EFI 平台支持终于冲过了终点线，很快将被集成了。
不过发稿前可能等不到了：`i386` 架构的构建居然[失败了](https://salsa.debian.org/grub-team/grub/-/jobs/5410444)，可能导致自动合并被阻止。
感谢[杰哥][jiegec]提供新闻线索。

[Xinmudotmoe] [测试了](https://github.com/loongson-community/discussions/issues/47)采用
64KiB 页的 Linux，发现无法完成引导。目前的调查显示这很可能是因为 BFD 链接器默认使用的页大小是 16KiB。
以前 xen0n 在做 LLD 移植的时候对此参数采用了 64KiB；后续 binutils 方面可能要跟进此处理。

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

[jiegec]: https://github.com/jiegec
[shankerwangmiao]: https://github.com/shankerwangmiao
[Xinmudotmoe]: https://github.com/Xinmudotmoe
[xry111]: https://github.com/xry111
[zhangn1985]: https://github.com/zhangn1985

## 张贴栏 {#bulletin}

本栏目可供张贴公益性质的各种信息。

* AOSC OS 维护者[白铭骢][MingcongBai]注意到 Intel 独立显卡的驱动支持已进入
  Linux 6.8，遂[发布了](https://github.com/loongson-community/discussions/issues/46)英雄帖，
  召唤勇者为其添加非 4KiB 页架构（如:dragon:）支持。
* 您可在 GitHub [浏览](https://github.com/loongson-community/discussions/labels/%E8%8B%B1%E9%9B%84%E5%B8%96)目前所有开放的英雄帖。
* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[MingcongBai]: https://github.com/MingcongBai
[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16
