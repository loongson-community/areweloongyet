---
slug: this-week-in-loongarch-25
title: 每周一龙：第 25 期
authors: [xen0n]
date: 2023-11-20T18:50:00+08:00
tags: [每周一龙]
---

每周一都为大家报道 LoongArch&reg; 社区最前线的第一手新鲜资讯！
上周的进展主要有 Linux 和工具链（有很多成果）。
详情点进来看！

<!-- truncate -->

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

## 先「马」再看

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch&reg; 领域的重要或长期项目（坑）。

### Linux

11 月 19 日，内核构建系统维护者 Masahiro Yamada [帮忙添加了](https://lore.kernel.org/loongarch/20231119053448.2367725-1-masahiroy@kernel.org/)龙架构
`vmlinuz.efi` 与 `vmlinux.efi` 之间遗漏的依赖关系。
这使得并行构建更可靠：之前有低概率会在这个阶段失败。

11 月 18 日，社区用户 Haowu Ge 在编译 OpenZFS 时，[发现](https://github.com/chenhuacai/linux/issues/3)多出了对俩 GPL-only 符号的依赖。
因为这俩符号是用来实现 `virt_to_page` 这一预处理器宏的，而原先对此宏的使用并不涉及 GPL，
所以将 GPL 需求去除大概也合情合理；Huacai Chen 第二天便[这么做了](https://lore.kernel.org/loongarch/20231119023317.3359647-1-chenhuacai@loongson.cn/)。

WANG Rui 在持续推进 ClangBuiltLinux 工作：11 月 15 日预防性地[增加了](https://lore.kernel.org/loongarch/20231115132137.178523-1-wangrui@loongson.cn/)编译选项，16
日又[改变了](https://lore.kernel.org/loongarch/20231116130331.241395-1-wangrui@loongson.cn/)绝对重定位的记录方式以允许用
LLVM/Clang 编译可重定位内核。

11 月 15 日，Huacai Chen 参照 RISC-V 做法[改变了](https://lore.kernel.org/loongarch/20231115141530.2534778-1-chenhuacai@loongson.cn/)内核参数
`nokaslr` 的处理方式，使其不会被透传至 init 进程的命令行参数。

同一天，Huacai Chen 还[修复了](https://lore.kernel.org/loongarch/20231115090735.2404866-1-chenhuacai@loongson.cn/)
Randy Dunlap 前一天[自动化发现的](https://lore.kernel.org/loongarch/960bef74-ed09-4b6f-8ae8-b3effef6914f@infradead.org/)
LoongArch KVM 构建失败。
这是一处未跟进的 API 变更；估计是原作者[重构](https://lore.kernel.org/all/20231105163040.14904-4-pbonzini@redhat.com/)时，
由于 LoongArch KVM 代码当时尚未主线化，因而没看到、改到。

11 月 14 日，Xi Ruoyao 在日常的工具链维护中，发现升级到 Linux v6.7-rc1 之后，几条 glibc
多线程同步的测试用例开始超时了，而 x86 居然也存在该问题！
遂果断[报告了](https://lore.kernel.org/all/d69d50445284a5e0d98a64862877c1e6ec22a9a8.camel@xry111.site/T/#u)。
因为引起问题的提交是个常规重构，只是改变了几个标志位的具体取值，所以作者 Peter Zijlstra 也百思不得其解。
直到 Florian Weimer 指出 `kernel/futex/core.c` 有几处传参直接写了 `1` 而非 `FLAGS_SHARED`，
才恍然大悟；
于是此问题在 v6.7-rc2 已[得到修复](https://github.com/torvalds/linux/commit/c9bd1568d5462f4108417518ce1af7b924acfb6f)。
感谢 Xi Ruoyao 的新闻线索以及 :ta: 本次为 Linux 稳定性作出的贡献！


### 工具链

#### binutils

11 月 14 日，Xi Ruoyao 想给 binutils 在龙架构上增加 `DT_RELR` 支持，这样可以有效缩小一些大软件的体积；
但 binutils 的源码很不直观，不好改，于是
:ta: [建立了](https://github.com/loongson-community/discussions/issues/12)协调工单。
随后 MaskRay 看到了，友情指了条路。

#### GCC

11 月 19 日，Xi Ruoyao [修复了](https://gcc.gnu.org/pipermail/gcc-patches/2023-November/637239.html)
LSX 浮点向量 shuffle 最终生成代码其差无比的问题。

11 月 17 日，在排查一个[有概率发生的问题](https://github.com/loongson-community/discussions/issues/7)时，Xi Ruoyao
[发现](https://gcc.gnu.org/PR112578) GCC 在向量化 LoongArch 浮点舍入操作时，对浮点异常的处理有误。
截至发稿时，[迭代到了](https://gcc.gnu.org/pipermail/gcc-patches/2023-November/637316.html)第三版修复。
这个代码生成问题跟原先要排查的问题无关；还得接着查！

同一天凌晨，Kevin Lee 在 RISC-V 上[发现了](https://gcc.gnu.org/PR107723)类似的浮点异常处理问题：
即便加了 `-fno-fp-int-builtin-inexact` 选项，`lround`、`ceil` 与 `floor` 等操作还是会产生可能抛异常的指令。
随后人们发现 x86_64、AArch64 和 LoongArch 上都存在该问题，因为架构无关部分已经把代码「优化」成了错误形状。
这[提醒了](https://gcc.gnu.org/PR107723) Andrew Pinski 要完善下这部分文档。

11 月 16 日，Xi Ruoyao [完成了](https://gcc.gnu.org/pipermail/gcc-patches/2023-November/636795.html)一版
LA664 新增特性的 GCC 适配，可以用 `-march=la664` 了，
也给 `-march=native` 加了相应处理。
不巧龙芯也做了同样的事，撞车了；Lulu Cheng
第二天[发了出来](https://gcc.gnu.org/pipermail/gcc-patches/2023-November/636946.html)。
龙芯的这版代码只做了原子操作的一部分优化，而未放宽 32 位除法、取余操作的入参要求，
也未去除那些在 LA664 上不再必要的 `DBAR 0x700` 指令；
因此 Xi Ruoyao 以这一版龙芯代码为基础，又[改了](https://gcc.gnu.org/pipermail/gcc-patches/2023-November/637090.html)一版。

<a name="CLZ_DEFINED_VALUE_AT_ZERO"></a>

同一天，Jiahao Xu [修了](https://gcc.gnu.org/pipermail/gcc-patches/2023-November/636792.html)一些
LSX、LASX 测试；Li Wei
也向 GCC [明确了](https://gcc.gnu.org/pipermail/gcc-patches/2023-November/636789.html)
LoongArch 的 `clz` `ctz` 指令可以正确处理输入为零的情况。

这一天 Jiahao Xu 还根据 SPEC2017 跑分结果，把向量访存操作的成本从 1
[微调到了](https://gcc.gnu.org/pipermail/gcc-patches/2023-November/637316.html)
2，让它们和非对齐访存相同；
结果[影响到了](https://gcc.gnu.org/pipermail/gcc-patches/2023-November/637155.html)测试，
待修复。

11 月 14 日，Lulu Cheng 让 GCC 在中等代码模型（`-mcmodel=medium`）下，[换作](https://gcc.gnu.org/pipermail/gcc-patches/2023-November/636443.html)以
`%call36` 形式进行过程调用。`call36` 是第 23 期[报道过的](./2023-11-06-this-week-in-loongarch-23.mdx#abi)新 ABI。
这个变更欠考虑了搭配旧汇编器使用的情况；Xi Ruoyao 11 月 18 日[帮忙修复了](https://gcc.gnu.org/pipermail/gcc-patches/2023-November/637153.html)。

同一天，上游开发者 Andrew Pinski [修复了](https://gcc.gnu.org/pipermail/gcc-patches/2023-November/636445.html)[^author-info-for-the-uninitiated]上期周报[提到的](./2023-11-13-this-week-in-loongarch-24.md#gcc)一处实际上是劣化的「优化」。
（这修复把 PowerPC 的测试炸了，但上游的结论是应该改 PowerPC 相关代码。）

[^author-info-for-the-uninitiated]: 该修复方案是 Andrew Pinski 提出的，只是 Xi Ruoyao 帮 :ta: 把邮件发了。因为邮件正文带了 `From:` 字段，因此 Git 提交中的作者信息仍然是正确的。

同一天凌晨，Xi Ruoyao 还[发现](https://gcc.gnu.org/PR112520)有个 GCC 插件测试用例在龙架构上应该就没运行成功过；该问题仍待排查。

11 月 13 日，Xi Ruoyao [抄了](https://gcc.gnu.org/pipermail/gcc-patches/2023-November/636379.html)个
AArch64 的优化，能为形如 `copysign(x, -1)` 的操作产生高效的向量化代码；
又[移植了](https://gcc.gnu.org/r14-5432) LLVM 的 `DBAR` 优化
（周报第 20 期[有报道](./2023-10-16-this-week-in-loongarch-20.md#LLVM)）。

以上新增的大块内容都赶上了 GCC 14 stage 1，在明年的 GCC 14.1 正式版就能用上了。
等不及的同学也可以下载 GCC 14 快照自行编译，或使用 Gentoo（直接 unmask 相应版本即可）等滚动发行版，
马上体验。

本期的大多数 GCC 新闻都是 Xi Ruoyao 帮忙整理（以及自己制造）的，让我们感谢 :ta: 的奉献！

#### LLVM

人们已经在紧锣密鼓实现 LoongArch ELF psABI v2.20 的新内容了。

11 月 14 日，MaskRay 亲自[帮忙修复了](https://github.com/llvm/llvm-project/pull/72221)上期周报[提到的](./2023-11-13-this-week-in-loongarch-24.md#llvm)
LLVM [issue #71645](https://github.com/llvm/llvm-project/issues/71645)。

同一天，MQ-mengqing 为 LLD [增加了](https://github.com/llvm/llvm-project/pull/72190)
`R_LARCH_{ADD,SUB}6` 两种重定位记录的支持，
又为 LoongArch MC [增加了](https://github.com/llvm/llvm-project/pull/72191) relaxation 支持。

11 月 13 日，MQ-mengqing [试图](https://github.com/llvm/llvm-project/pull/72095)为
LoongArch MC 增加类似 [GAS 的条件跳转范围扩展](https://sourceware.org/git/gitweb.cgi?p=binutils-gdb.git;a=commitdiff;h=1fb3cdd87ec61715a5684925fb6d6a6cf53bb97c)的一道工序，
但 MaskRay 及时指出当年 RISC-V 做相同事情[被发现的](https://reviews.llvm.org/D108961)坑：
如果龙架构能避免踩到这些坑，那么便能「比 RISC-V 做得更好」。MQ-mengqing 显然受益匪浅，应该在改代码了。

#### Rust

11 月 17 日，heiher 为了让 rustup 1.27.0 发布时能包含龙架构二进制，
临时给龙架构的 rustup [关掉了](https://github.com/rust-lang/rustup/pull/3536) OpenSSL。
这还是第 10 期[讲过的](./2023-07-24-this-week-in-loongarch-10.md#openssl-asm-breakage)龙芯挖的坑的后续……

11 月 14 日，heiher 为 Rust 的 LoongArch musl 支持（`loongarch64-unknown-linux-musl` 构建目标）
提前[建立了](https://github.com/loongson-community/discussions/issues/13)协调工单。

<details>
<summary>musl 移植的上游化进度</summary>

目前龙芯推进的 musl LoongArch 支持补丁已经[翻新到了](https://www.openwall.com/lists/musl/2023/11/16/2)第 9 版，
但似乎每次更新都塞了一些代码审查评论之外的修改。
这使上游维护者[困惑](https://www.openwall.com/lists/musl/2023/11/17/3)：
本来上一版已经没问题了，结果又塞了新东西。

截至发稿时，看上去龙芯维护者[已经恢复了](https://www.openwall.com/lists/musl/2023/11/20/1)补丁第 8 版发出的现状——这回应该能合并了！
</details>

## 杂闻播报

11 月 18 日，shipujin [发布了](http://www.slackwarecn.cn/2023/11/18/Slackwareloong1.0live%E5%8F%91%E5%B8%83%EF%BC%81/)
Slackwareloong64 LTS 1.0 的 Live 镜像。欢迎感兴趣的 Slackware 用户、爱好者们下载体验。
感谢 :ta: 的新闻线索以及维护工作！

11 月 17 日，龙芯将《手册》英文版翻译的仓库短暂解除了只读状态；
文档维护者 Yanteng Si 遂[推入了](https://github.com/loongson/LoongArch-Documentation/commit/3f3989f658965404ee37633f1a430836124e9343)《手册》v1.10 的部分更新，
并相应地[更新了](https://lore.kernel.org/loongarch/CAAhV-H7-9JL1hf8_Hs3dirJ8aqgK4BGU1PANsXDDVkSHP_fe9A@mail.gmail.com/T/#t)
Linux 龙架构文档的链接。

本次翻译更新是不完整的：只包含了新增指令的描述，
而没有覆盖第 1.5 节关于指令集演进的说明、
第 2.2.10.5 节的新 `CPUCFG` 字段描述，或者特权架构部分的更新。
结合龙芯维护者在 binutils 邮件列表上，对上个月 LoongArch v1.10 指令支持工作
（[第 22 期](./2023-10-30-this-week-in-loongarch-22.md#binutils)有报道）
的[一封回复](https://sourceware.org/pipermail/binutils/2023-November/130594.html)，
本次更新应该是实用主义的：可能仅仅为了能够快速推进新指令的上游化，临时叫人更新一下，
而并非专门排期来做这件事——如果是后一种情况，那么应该不会只做完一部分就提交了。

## 张贴栏

本栏目可供张贴公益性质的各种信息。

* 友情扩散：[安同开源社区（AOSC）][aosc]的龙架构移植主线化工作「合龙」仍在如火如荼进行中，
  此工作完成后龙架构将升格为 AOSC OS 的 Tier 1 架构。
  欢迎同学们试用、反馈，也欢迎有志之士一同加入（沟通渠道详见 AOSC 网站相关栏目）。
* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[aosc]: https://aosc.io
[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16
