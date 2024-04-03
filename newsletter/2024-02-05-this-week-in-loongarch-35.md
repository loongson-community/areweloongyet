---
slug: this-week-in-loongarch-35
title: 每周一龙：第 35 期
authors: [xen0n]
date: 2024-02-05T19:40:00+08:00
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

此外，先前[发现的](https://github.com/loongson-community/discussions/issues/40)
BFD 链接器（即 GNU ld）有时不能正确处理 `--gc-sections` 的问题，虽然当初报告的问题在
binutils 2.42 证实了并不存在，但在搭配 GCC 14 开发版本使用时，仍有少数测试失败，待解决；
龙芯维护者在评论区说可能要到年后。

感谢 Xi Ruoyao 协助提供本节的新闻线索！

[xry111]: https://github.com/xry111

#### GCC {#gcc}

Lulu Cheng 与 Xi Ruoyao 合作，为 `extreme`
代码模型[适配了](https://gcc.gnu.org/pipermail/gcc-patches/2024-January/644159.html)
LoongArch ABI v2.30（LoongArch ELF psABI v20231219）：Lulu Cheng 完成了
`-mexplicit-relocs=none` 的情形，Xi Ruoyao 则搞定了
`-mexplicit-relocs={always,auto}` 两种情形。

Guoqi Chen [允许开启了](https://gcc.gnu.org/pipermail/gcc-patches/2024-January/644274.html)
TSan、LSan 两种检查机制（sanitizers）。

Lulu Cheng 使用 `alsl` 指令[优化了](https://gcc.gnu.org/pipermail/gcc-patches/2024-January/644288.html)
相对帧指针的寻址。

Xi Ruoyao 一如既往地呵护着主线工具链：

* [修复了](https://gcc.gnu.org/pipermail/gcc-patches/2024-February/644749.html)
  GCC LoongArch 代码中的 C++ ODR 规则违反一例。
* [修复了](https://gcc.gnu.org/pipermail/gcc-patches/2024-February/644797.html)一处
  LSX 代码生成逻辑中，由 MIPS 遗产导致的越界访问；
  有意思的是，[相应的 MIPS 问题](https://gcc.gnu.org/PR98491)也是 Xi Ruoyao
  三年前[解决的](https://gcc.gnu.org/g:06505e701dcfdb1b9855601d6cf0aa1caea62975)。
* [修复了](https://gcc.gnu.org/pipermail/gcc-patches/2024-February/644889.html)
  LSX 浮点取相反数操作的实现错误：未能正确处理浮点零值的符号位。
  这[也是 MIPS 遗产](https://gcc.gnu.org/pipermail/gcc-patches/2024-February/644928.html)。

感谢 Xi Ruoyao 提供（以及制造）本节的新闻线索！

#### glibc {#glibc}

2 月 4 日，Xi Ruoyao [允许了](https://sourceware.org/pipermail/libc-alpha/2024-February/154419.html)
glibc 以编译器提供的 `__builtin_ffs` 实现 `ffs` 系列的库函数。
由于非教学版（即所谓 LA32 Primary）的 LoongArch 总能保证 `ctz` 指令可用，这么做即有助于这些函数的性能。

北京时间 2 月 1 日清晨，glibc 2.39 [正式发布了](https://sourceware.org/pipermail/libc-alpha/2024-January/154363.html)。
打包同仁们请注意：有一些重大变化可能需要在下游相应调整；为方便参考，现将一部分总结如下，其余请自行参考邮件或代码。

* 彻底移除了废弃多年的 crypt 支持。请尽快迁移至 [libxcrypt](https://github.com/besser82/libxcrypt)。

  特别地：由于 glibc crypt 的弃用发生在 LoongArch 进入主线之前，但当时的 LoongArch 移植工作者未为
  LoongArch 完全禁用 `libcrypt.so.1` 的构建；为在尽可能早的时机降低今后所有 LoongArch
  发行版的依赖复杂度，强烈建议 LoongArch 发行版都使用 `--enable-obsolete-api=no`
  以确保系统中仅存在 `libcrypt.so.2` 这一 soname。
  （据称，龙芯对第三方厂商就 LoongArch 旧世界的适配，也提出了相同要求。）

  如果一切顺利，数年后我们即可援引此一事实，证明所谓「兼容性」之确实不必要，从而在 libxcrypt
  上游成功去除此非预期的历史包袱。
* 对 LoongArch 而言：由于引入了 LSX/LASX 等因素，可用于构建 glibc 2.39 的最低 binutils
  版本现已提升至 2.41。

在 glibc 2.39 发布前的准备流程中，发现测试套件在 GCC 编译农场的 LoongArch 节点 `cfarm401`
上大量失败；Xi Ruoyao
[指出](https://sourceware.org/pipermail/libc-alpha/2024-January/154302.html)这是由
Debian multiarch 目录布局，以及 Linux 头文件版本老旧所导致的。
后续或将需要与此机器的维护者协调，以彻底解决此问题。

感谢 Xi Ruoyao 提供本节的新闻线索！

#### Rust {#rust}

[xen0n] 将 Rust LoongArch targets 默认采用的代码模型从默认的 `normal`（LLVM 称之为 `small`）
[扩大到了](https://github.com/rust-lang/rust/pull/120661) `medium`，
预计将于五月份正式发布的 Rust 1.78 可用（时运不济，刚好错过 1.77 的班车）。
届时，含 Rust 组件的超大型软件如 Chromium 的构建将更加便捷了：打包者们不再需要为此特制 Rust——以确保
Rust 标准库是带着 `-Ccode-model=medium` 编译的了。

暌违近一年，Rust 官方的工具链管理工具 `rustup`
[即将发布](https://github.com/rust-lang/rustup/pull/3653)其 1.27.0 版本。[heiher]
突然发现它在 LoongArch 下无法编译了，
遂迅速[修复了](https://github.com/rust-lang/libc/pull/3570)根因，
并[更新了](https://github.com/rust-lang/rustup/pull/3655) `rustup`。
很快 LoongArch 用户也可像 x86、ARM 等常见架构用户一样，便捷管理 Rust 工具链了。

[heiher]: https://github.com/heiher
[xen0n]: https://github.com/xen0n

## 杂闻播报 {#assorted-news}

带有 [LSX 优化](https://github.com/pnggroup/libpng/commit/6b0d1bd75b6c51bb5da12f35327508cc31b92da4)的
libpng 版本现已可用：请用 1.6.42 或更高版本（1.6.41 版本有 bug，不能用）。
此优化工作来自龙芯员工 Jin Bo（编者注：姓在前）。

近日 libffi 在龙架构上的构建被发现有两处问题：[杨屿杰][scylaac][修复了](https://github.com/libffi/libffi/pull/817)
LoongArch 软浮点系统上的构建，[Xi Ruoyao][xry111]
则[修复了](https://github.com/libffi/libffi/pull/825)使用 GCC 14 的构建。

感谢 Xi Ruoyao 提供本节的新闻线索！

[scylaac]: https://github.com/scylaac

## 社区整活:儿: {#grins}

本栏目接受任何网友的投稿，只要内容与 LoongArch 有关，并可以为读者带来价值，
无论严肃贡献（整的大活:儿:）或是博君一笑都一概欢迎！

[xen0n] 与安同开源社区（AOSC）开发者、`libLoL` 维护者[王邈][shankerwangmiao]一同为
`libLoL` 撰写了技术文档，已加入~~本站阅读材料全家桶~~ `libLoL` 项目网站：[欢迎阅读](https://liblol.aosc.io/docs/dev/design/)！

:::info 修订说明
原先 `libLoL` 项目没有官网，因此本周报最初发布时，该文档位于本站。自
2024-04-03 起，该文档已经被转移到 `libLoL` 项目下了。
:::

2023 年 11 月 23 日，[Liu Yan][moontide] 为 `rtl8852au`
项目[提交了](https://github.com/lwfinger/rtl8852au/pull/68)增加 LoongArch 支持的小补丁，
使该驱动程序可以在 LoongArch CPU 下编译。`rtl8852au`
是社区开发者 [lwfinger] 基于瑞昱半导体（Realtek）的官方 USB WiFi 驱动程序代码修改而来的项目，
适配了新版本的 Linux 内核，也额外包含了一些优化。

[lwfinger]: https://github.com/lwfinger
[moontide]: https://github.com/moontide
[shankerwangmiao]: https://github.com/shankerwangmiao

## 张贴栏 {#bulletin}

本栏目可供张贴公益性质的各种信息。

* 友情扩散：[安同开源社区（AOSC）][aosc]的龙架构移植主线化工作「合龙」已接近尾声，
  此工作完成后龙架构将升格为 AOSC OS 的 Tier 1 架构。
  欢迎同学们试用、反馈，也欢迎有志之士一同加入（沟通渠道详见 AOSC 网站相关栏目）。
* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[aosc]: https://aosc.io
[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16
