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

TODO: [xry111]'s `DT_RELR` work

TODO: bad static reloc check & broken stack-based relocs [xry111]

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
