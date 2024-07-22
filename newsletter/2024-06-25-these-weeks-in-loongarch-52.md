---
slug: these-weeks-in-loongarch-52
title: 每周两龙：第 52 期
authors: [xen0n]
date: 2024-06-25T23:00:00+08:00
tags: [每周一龙]
draft: true  # TODO
---

每周（尽量）为大家报道 LoongArch 社区最前线的第一手新鲜资讯！
上周的进展主要有 TODO。
详情点进来看！

<!-- truncate -->

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

## 先「马」再看 {#marked-projects}

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch 领域的重要或长期项目（坑）。

### Linux {#linux}

TODO: amdgpu & LS7A drama [Icenowy]

TODO: [xry111]'s fstat work

[Icenowy]: https://github.com/Icenowy
[xry111]: https://github.com/xry111

### 工具链 {#toolchain}

#### binutils {#binutils}

[xry111] 参考 [AArch64 实现](https://sourceware.org/pipermail/binutils/2024-May/134367.html)，为 Binutils 的 BFD 链接器[增加了](https://sourceware.org/pipermail/binutils/2024-June/135261.html)在 LoongArch ELF 中使用 RELR 格式编码相对重定位 (relative relocation) 记录的功能。随后 Alan Modra [修复了](https://sourceware.org/pipermail/binutils/2024-July/135464.html) [xry111] 写错的一处测试。使用 RELR 格式编码相对重定位能有效缩减一些位置无关可执行文件 (PIE) 和动态链接库的大小，详见 [Maskray 的文章](https://maskray.me/blog/2021-10-31-relative-relocations-and-relr)。该功能将随 Binutils-2.43 发布，届时发行版维护者和其他打包者在构建软件包时可以在 LDFLAGS 中加入 `-Wl,-z,pack-relative-relocs` 以启用它。

在编写和测试 RELR 支持的过程中，[xry111] 注意到了 BFD 链接器存在的一些问题：

- 链接器将可重定位目标文件中无法在链接时解决的 `R_LARCH_32` 转化为 `R_LARCH_RELATIVE`，而动态链接器在 64 位环境下处理后者时一定会直接写入 8 字节 (即 64 位) 值，会发生越界。在实际的 64 位代码中几乎不可能存在此类 `R_LARCH_32` 重定位，因此该问题在之前并未被注意到。[xry111] [加强了](https://sourceware.org/pipermail/binutils/2024-June/135260.html)链接器的检查，使其在链接 64 位代码时如发现无法在链接时解决的 `R_LARCH_32` 就直接报错 (这和 64 位 x86 和 RISC-V 对 `R_X86_64_32` 和 `R_RISCV_32` 的处理方法相同)。
- 如共享库定义并调用了多个 GNU indirect function (IFUNC)，且它们的可见性 (visbility) 不完全相同，则链接器在链接该共享库时会搞乱 PLT 表项和 PLT 重定位记录的对应关系，导致丢失重定位记录。由于实际的动态链接库中这种情况较为少见，且即使出现这种情况，丢失的往往恰好是一条对于 `__dso_handle` 的相对重定位记录，通常不会造成严重后果。然而，在引入 RELR 后，这条相对重定位记录被以 RELR 格式压缩编码，这时该 bug 会导致其他重定位丢失，触发 Glibc 测试失败。[xry111] [调整了](https://sourceware.org/pipermail/binutils/2024-June/135263.html)分配 PLT 表项的顺序，使之和分配重定位记录的顺序一致，解决了该问题。
- 一些旧版编译器会试图在主程序中不经过 GOT 寻址共享库中的函数，链接器为了在此情况下保证函数指针比较操作的结果正确，不得不将共享库中具有 protected 可见性的函数视为可抢占 (preemptible) 的。然而 LoongArch 根本没有这样的旧版编译器 (即使“旧世界”编译器也不会这样做)，且由于复制重定位 (copy relocation) 已被废弃，未来也不会有人试图让编译器这样做。因此完全可以将共享库中的 protected 函数视为不可抢占，以略微提高共享库的性能。[xry111] 据此[修改了](https://sourceware.org/pipermail/binutils/2024-June/135262.html)链接器，使之不再将共享库中的 protected 函数视为可抢占。
- 链接器为 initial-exec 的线程本地存储 (TLS) 重定位多分配了一条重定位记录的空间，导致 `libc.so.6` 等共享库中出现空操作重定位 (`R_LARCH_NONE`)。[xry111] [修复了](https://sourceware.org/pipermail/binutils/2024-June/134902.html)该问题。
- 链接器[无法链接](https://sourceware.org/pipermail/binutils/2024-June/134876.html)使用旧的基于栈的重定位类型的可重定位目标文件。[xry111] 建议取消对这些重定位类型的支持，但 mengqinggang [认为](https://sourceware.org/pipermail/binutils/2024-June/134909.html)在特定情况下这些重定位类型仍然可能有用，故 Lulu Cai [修复了](https://sourceware.org/pipermail/binutils/2024-June/134897.html)该问题。但由于 [xry111] 不想处理这些旧的重定位类型，在启用 RELR 时链接器将拒绝接受它们。
- 测试套件中存在无用的 MIPS 遗产，[xry111] [删除了](https://sourceware.org/pipermail/binutils/2024-June/135022.html)它们。
- 链接器松弛 (relaxation) 过程使用的算法渐进复杂度[有改进空间](https://github.com/loongson-community/discussions/issues/56)，尚未解决。[xry111] 猜测该问题可能是导致链接 Python 非常缓慢的原因。
- 链接器松弛过程[不必要地保留了 GOT 表项](https://github.com/loongson-community/discussions/issues/58)，尚未解决。

#### GCC {#gcc}

TODO: assorted [xry111] work

#### LLVM {#llvm}

TODO: register pressure scheduler https://github.com/llvm/llvm-project/pull/95741 [heiher]

TODO: lld TLSDESC https://github.com/llvm/llvm-project/pull/94451 [wangleiat]

[heiher]: https://github.com/heiher
[wangleiat]: https://github.com/wangleiat

#### Rust {#rust}


第 50 期周报[提到的](./2024-05-30-this-week-in-loongarch-50.md#rust) LoongArch64
musl target 工作已经完成：继提案于 6 月 12 日无异议[通过](https://github.com/rust-lang/compiler-team/issues/753#issuecomment-2162011200)之后，[heiher] 便将
`loongarch64-unknown-linux-musl` target [提升到了](https://github.com/rust-lang/rust/pull/126298)
Tier 2 with Host Tools 支持层级。自 2024-06-25 开始的 Nightly Rust 都已经包含此
target 了。此功能将于 Rust 1.81 正式发布。

[xen0n] [更新了](https://github.com/rust-lang/rust/pull/127053) Rust LoongArch
targets 的文档内容：由于生态建设迅速，先前的许多信息已经与现实脱节了。

[xen0n] 还为 Rust 官方构建的 LoongArch Linux 二进制包[启用了](https://github.com/rust-lang/rust/pull/127078)一系列功能：

* 全套 LLVM 工具，含 LLD：与 x86、AArch64 等主流平台对齐。
* Rust 的性能侧写机制（profiler）：已知至少 Chromium 必须启用此功能才能构建。

[xen0n] 还[修复了](https://github.com/rust-lang/rust/pull/127150) Rust LoongArch
裸机 targets 标准库中含有 x86 构建产物的[问题](https://github.com/rust-lang/rust/issues/125908)。

此套变更不出意外也将在两三天内出现在 Nightly Rust，并于 Rust 1.81 正式发布。

[xen0n]: https://github.com/xen0n

## 杂闻播报 {#assorted-news}

TODO: memtest86+ [kilaterlee] [MarsDoge]

TODO: edk2 [MarsDoge]

TODO: zig [yxd-ym]

TODO: grub2 case-sensitivity [MingcongBai]

[kilaterlee]: https://github.com/kilaterlee
[MarsDoge]: https://github.com/MarsDoge
[MingcongBai]: https://github.com/MingcongBai
[yxd-ym]: https://github.com/yxd-ym

## 社区整活:儿: {#grins}

本栏目接受任何网友的投稿，只要内容与 LoongArch 有关，并可以为读者带来价值，
无论严肃贡献（整的大活:儿:）或是博君一笑都一概欢迎！

TODO: stable amdgpu on xa61200 with better cooling [LiarOnce]

TODO: [xry111]'s abandoned LBT work

[LiarOnce]: https://github.com/LiarOnce

## 张贴栏 {#bulletin}

本栏目可供张贴公益性质的各种信息。

* 您可在 GitHub [浏览](https://github.com/loongson-community/discussions/labels/%E8%8B%B1%E9%9B%84%E5%B8%96)目前所有开放的英雄帖。
* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16
