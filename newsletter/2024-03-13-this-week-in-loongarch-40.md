---
slug: this-week-in-loongarch-40
title: 每周一龙：第 40 期
authors: [xen0n]
date: 2024-03-13T17:50:00+08:00
tags: [每周一龙]
---

每周一都为大家报道 LoongArch 社区最前线的第一手新鲜资讯！
上周的进展主要有工具链以及各种集成、测试工作。
详情点进来看！

<!-- truncate -->

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

本期周报的实际发稿时间是周三晚间，因为前两天都在忙别的。

## 先「马」再看 {#marked-projects}

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch 领域的重要或长期项目（坑）。

### Linux {#linux}

Huacai Chen [移除了](https://lore.kernel.org/loongarch/20240312073131.2278318-1-chenhuacai@loongson.cn/)在
LoongArch 上多余的 `flush_dcache_page` 定义。

Huacai Chen 3 月 7 日[发出了](https://lore.kernel.org/loongarch/20240307144930.3919566-1-chenhuacai@loongson.cn/)
Linux 6.9 开发周期的 KVM 变更，3 月 11 日已[被接受](https://lore.kernel.org/loongarch/208e03b7-374b-4062-bed2-dda595fcad77@redhat.com/)。

### 工具链 {#toolchain}

#### GCC {#gcc}

[Xi Ruoyao][xry111] [允许了](https://gcc.gnu.org/cgi-bin/gcc-gitref.cgi?r=r14-9411)非
`extreme` 代码模型下 IE 模型的 TLS 操作被 relax 到 LE 模型。
（编者注：MaskRay 的 [*All about thread-local storage*](https://maskray.me/blog/2021-02-14-all-about-thread-local-storage) 是 TLS 话题相当不错的入门材料。）

Chenghui Pan [清理了](https://gcc.gnu.org/pipermail/gcc-patches/2024-March/647536.html)一些多余代码。

Lulu Cheng [修复了](https://gcc.gnu.org/pipermail/gcc-patches/2024-March/647308.html)
使用 LL/SC 方式实现原子比较交换（atomic CAS）操作时，由于可能遗漏符号扩展动作，而导致潜在的原子语义错误的问题。
这与上期周报[报道的](./2024-03-06-this-week-in-loongarch-39.md#llvm)相关 LLVM 变更修复的是同一问题。

Lulu Cheng 还[修复了](https://gcc.gnu.org/pipermail/gcc-patches/2024-March/647311.html)寄存器名称
`s9` 测试用例的调用方式。

#### LLVM {#llvm}

[MQ-mengqing] [使得](https://github.com/llvm/llvm-project/pull/84741)
`R_LARCH_ALIGN` 可以相对于 section 工作。

在上期周报[报道了](./2024-03-06-this-week-in-loongarch-39.md#llvm)
`llvm.loongarch.lasx.xvpermi.q` 行为的变更之后，[xry111]
[注意到了](https://github.com/loongson-community/areweloongyet/pull/164#discussion_r1514376491)该变更可能不妥；遂在向 LLVM 18.x 分支集成原变更的 PR 中[建议了](https://github.com/llvm/llvm-project/pull/83540#issuecomment-1981697199)不光不要往回移植，并且最好回滚该变更；[xen0n]
看到之后[表示](https://github.com/llvm/llvm-project/pull/83540#issuecomment-1985088472)认同。
龙芯维护者 [SixWeining] 在内部讨论后，接受了建议，[回滚了](https://github.com/llvm/llvm-project/pull/84708)原变更。

[wangleiat] [修复了](https://github.com/llvm/llvm-project/pull/84454)为 LoongArch32
生成代码时，遇到 MSB 操作数大于 31 的 `bstrins` 会崩溃的问题。该修复也已[往回移植到了](https://github.com/llvm/llvm-project/pull/84716)
LLVM 18.x 分支。

上期周报提到的修复了 Clang `__iocsrrd_h` intrinsic 返回类型的[变更](https://github.com/llvm/llvm-project/pull/84100)，
也[往回移植到了](https://github.com/llvm/llvm-project/pull/84715)
LLVM 18.x 分支。

[MQ-mengqing]: https://github.com/MQ-mengqing
[SixWeining]: https://github.com/SixWeining
[wangleiat]: https://github.com/wangleiat

#### Rust {#rust}

暌违近一年，rustup 项目终于[迎来了](https://blog.rust-lang.org/2024/03/11/Rustup-1.27.0.html)
1.27.0 版本的正式发布。
在 LoongArch 新世界发行版进行 Rust 开发的同学们可以方便地安装、使用 `rustup` 工具了。除
target tuple 取值不同之外，其余体验都与 x86 或 ARM 平台完全相同。
感谢 [syhily] 提供新闻线索！

[heiher] [允许了](https://github.com/rust-lang/rust/pull/122022)从 Rust 层面控制底层
LLVM 所新增的 LoongArch 目标特性 `frecipe` 与 `relax`。

[heiher]: https://github.com/heiher
[syhily]: https://github.com/syhily

## 杂闻播报 {#assorted-news}

[安同开源社区][aosc]（AOSC）开发者[王邈][shankerwangmiao]在维护 libLoL
时，发现龙芯团队当初移植 glibc 数学库时写了一处笔误。
沟通后，龙芯维护者 caiyinyu [修复了](https://sourceware.org/git/?p=glibc.git;a=commit;h=aeee41f1cf9bf58d3d316af36bb7f5a8699ab129)该笔误。
该笔误在正常编译 glibc 时不会被触发，因为从
[`libm_alias_finite` 的定义](https://sourceware.org/git/?p=glibc.git;a=blob;f=sysdeps/ieee754/libm-alias-finite.h;h=c56b43e4df534f2444da4c057b9734cac224ad30;hb=ef321e23c20eebc6d6fb4044425c00e6df27b05f#l27)可见，
该宏定义对龙架构是无效的：龙架构的纪元版本高于 2.31，因此龙架构上的该宏是空操作。
而在编译 libLoL 时，因为 libLoL 有意将 glibc 的纪元版本向过去推了，所以带有笔误的该语句生效，进而暴露了缺少符号的问题。
感谢[王邈][shankerwangmiao]提供新闻线索！
（编者注：您可查阅本站的[相关文档](/docs/world-compat-details#glibc-symbol-versioning)了解此处涉及的技术细节。）

[aosc]: https://aosc.io

[donmor] 在测试 DOSBox 的衍生项目 DOSBox-X 时，[发现](https://github.com/loongson-community/discussions/issues/48)它无法正常进行一些浮点运算。
在 [xry111] 与 [xen0n] 的协助下，发现原因是该项目对浮点控制状态寄存器（FCSR）的处理不具备跨平台性；
在 [donmor] 与 [xry111] [一][dosbox-x-4887][系列][dosbox-x-4888]的[修复][dosbox-x-4890]与[重构][dosbox-x-4891]之后，问题已被修复。
感谢 [donmor] 提供新闻线索！

[dosbox-x-4887]: https://github.com/joncampbell123/dosbox-x/pull/4887
[dosbox-x-4888]: https://github.com/joncampbell123/dosbox-x/pull/4888
[dosbox-x-4890]: https://github.com/joncampbell123/dosbox-x/pull/4890
[dosbox-x-4891]: https://github.com/joncampbell123/dosbox-x/pull/4891

上期周报[提到的](./2024-03-06-this-week-in-loongarch-39.md#assorted-news) Debian
GRUB 的 loong64 改动已被顺利集成，静待 Debian 包版本的下次正式更新。
感谢 [jiegec] 提供新闻线索！

[donmor]: https://github.com/donmor
[jiegec]: https://github.com/jiegec
[shankerwangmiao]: https://github.com/shankerwangmiao
[xen0n]: https://github.com/xen0n
[xry111]: https://github.com/xry111

## 张贴栏 {#bulletin}

本栏目可供张贴公益性质的各种信息。

* 您可在 GitHub [浏览](https://github.com/loongson-community/discussions/labels/%E8%8B%B1%E9%9B%84%E5%B8%96)目前所有开放的英雄帖。
* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16
