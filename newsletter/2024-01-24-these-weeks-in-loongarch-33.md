---
slug: these-weeks-in-loongarch-33
title: 每周两龙：第 33 期
authors: [xen0n]
date: 2024-01-24T03:20:00+08:00
tags: [每周一龙, 每周两龙]
---

每周一都为大家报道 LoongArch&reg; 社区最前线的第一手新鲜资讯！
上两周的进展主要有各大工具链项目，以及 `libLoL`。
详情点进来看！

<!-- truncate -->

因为笔者上周现实生活繁忙，本期改为周二更新前两周的内容，预计下期恢复周一更新。
本期周报的实际发稿时间是周三凌晨，因为这个点才写完——白天都在忙别的。
网页上显示的发稿时间仍然是 1 月 23 日：
这是 Docusaurus 早期为了修复一个时区 bug 而[导致的](https://github.com/facebook/docusaurus/issues/4881)又一个时区 bug。

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

## 先「马」再看 {#marked-projects}

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch&reg; 领域的重要或长期项目（坑）。

### Linux {#linux}

Linux 6.8 的合并窗口已关闭，v6.8-rc1 已经发布。根据 Huacai Chen 的
[KVM PR](https://lore.kernel.org/loongarch/20231223120642.1067728-1-chenhuacai@loongson.cn/)
与[架构 PR](https://lore.kernel.org/loongarch/20240119110700.335741-1-chenhuacai@loongson.cn/)，
本周期的 LoongArch 变更主要有：

* 抬升了 LLVM/Clang 的最低支持版本到 18，并支持 Rust 语言（WANG Rui）。
* 内置了龙芯 2K 系列 SoC 的设备树（Binbin Zhou）。
* BPF JIT 优化与修复（Hengqi Chen）。
* 支持处理 UEFI ESRT 表格，为系统内的固件升级方案如 fwupd 做准备（Huacai Chen）。
* 使用公共设施实现了 `crashkernel` 内核参数（Youling Tang）。
* 修复了 `execve` 后的 FCSR 初始化问题（Xi Ruoyao）。
* 完善了 KVM 内存管理与定时器模拟（Bibo Mao）。
* 支持在 KVM 虚拟机中使用 LSX、LASX 了（Tianrui Zhao）。

不巧的是，合并 LoongArch KVM 相关修改时[漏掉了](https://lore.kernel.org/loongarch/20240120114412.2208a8c1@canb.auug.org.au/)一个修复构建错误的补丁。
这是针对 KVM 分支的代码重构的跟进，但由于双方分支基础不同，因而需要 Linus 在合并时手工操作；没有人提醒自然就不会操作。
目前如果要编译主线内核，需要打上该补丁，或者禁用 KVM 功能。
不过在目前的仓库状态下，该补丁已经可以直接打上了；因此此问题预计将很快在主线修复。

### 工具链 {#toolchain}

#### ABI {#abi}

1 月 10 日，龙芯编译器团队[贴出了](https://github.com/loongson/gcc/issues/114)一份调用约定扩展的草稿，该扩展允许通过向量寄存器传递向量参数。
这样做可以减少内存访问，进而提升性能；但也有兼容性、以及与遵循现有调用约定的存量代码的互操作性等方面的担忧。

工单[随附了](https://github.com/loongson/gcc/pull/113)龙芯团队做的原型实现：
请在意技术细节的同学们关注，以求将大概率会存在的问题尽早暴露、修复。
众人拾柴火焰高！

#### binutils {#binutils}

GNU Binutils 2.42 分支已于 1 月 15 日[切出](https://sourceware.org/pipermail/binutils/2024-January/131859.html)，
理想状况下，将于分支管理员时区的 1 月 29 日发布。

[Xi Ruoyao][xry111] 赶在正式发布前做了些工作：

* 按照 LoongArch ABI v2.30 [调整了](https://sourceware.org/pipermail/binutils/2024-January/131871.html )若干重定位操作类型的语义，
* [修了](https://sourceware.org/pipermail/binutils/2024-January/131975.html)测试，
* [整理了](https://sourceware.org/pipermail/binutils/2024-January/132050.html) 2.42 版本的 LoongArch 变更内容文档。

[xry111]: https://github.com/xry111

#### GCC {#gcc}

Lulu Cheng 让 GCC 在使用 `extreme` 代码模型时，[使用](https://gcc.gnu.org/pipermail/gcc-patches/2024-January/641865.html)宏指令生成符号地址，
但 [Xi Ruoyao] [认为](https://gcc.gnu.org/pipermail/gcc-patches/2024-January/641919.html)应该换一种做法。

Lulu Cheng 还将 GOT（全局偏移表）记录[标记为了](https://gcc.gnu.org/pipermail/gcc-patches/2024-January/642896.html)只读。
这可能会允许更多优化。

Xi Ruoyao [发现了](https://gcc.gnu.org/PR113418) GCC 向量测试套件本身的一些问题。

Xi Ruoyao 还[适配了](https://gcc.gnu.org/pipermail/gcc-patches/2024-January/643644.html) TLS LD/GD relaxation。

#### LLVM {#llvm}

LLVM 18 的代码将于中国时间 1 月 24 日冻结。

[wangleiat] [新增了](https://github.com/llvm/llvm-project/pull/78943)目标特性（target feature）`auto-vec`，
用以控制是否进行自动向量化。
目前此特性默认关闭，因为仍需一些工作量才能确保实际提升性能。

[yjijd] [实现了](https://github.com/llvm/llvm-project/pull/78924)向量类型的整数转浮点数操作：
即 LLVM IR 的 `sitofp` 与 `uitofp` 操作。

[Ami-zhang] [增加了](https://github.com/llvm/llvm-project/pull/78238) LoongArch
v1.10 的新增指令支持。

[Ami-zhang] 还[新增了](https://github.com/llvm/llvm-project/pull/78962)目标特性 `frecipe`，
以及相应的 Clang intrinsics，以便开发者控制 LoongArch v1.10 的浮点近似取倒数等操作的使用与否。

[MQ-mengqing] [完善了](https://github.com/llvm/llvm-project/pull/77728)开启
linker relaxation 情况下的 DWARF 调试信息处理。

[MQ-mengqing] 还根据最新 LoongArch ELF psABI
[处理了](https://github.com/llvm/llvm-project/pull/72962)汇编器对齐指示。
截至发稿，此 PR 仍然没有合并；不过已经通过代码审查，因此赶上 LLVM 18 应该问题不大。

[Ami-zhang]: https://github.com/Ami-zhang
[MQ-mengqing]: https://github.com/MQ-mengqing
[wangleiat]: https://github.com/wangleiat
[yjijd]: https://github.com/yjijd

## 杂闻播报 {#assorted-news}

### `libLoL` 架构升级，兼容性持续提升 {#liblol}

1 月 19 日，以 0.1.0 版本的发布为标志，`libLoL` 已转向共享 sysroot 的，仅在 libc
层面处理符号版本问题的方案，而不再需要从旧世界发行版（如 Loongnix）取用系统库。
这样既让兼容层的体积得到大幅缩减：安装包现已不足 1MiB，
也避免了先前由于使用商业发行版二进制文件，而可能为社区发行版提供者、用户带来的法律风险。
更多技术细节请见 `libLoL` 的 [README 文档](https://github.com/AOSC-Dev/liblol/blob/master/README.zh.md)。
（本站不久也将上架相关阅读材料。）

截至发稿时，`libLoL` 已迭代至 0.1.3 版本：又修复了旧世界 .NET 8、WPS PDF、钉钉等应用或组件的兼容性问题。
如果您依赖的旧世界应用仍然不能完美运行，请将问题报告到 `libLoL` 上游[工单系统](https://github.com/AOSC-Dev/liblol/issues)，
以便开发者们帮忙。

### 需要修订《手册》以明确 `ftint` 的边界情况行为 {#ftint-edge-cases}

在测试正则表达式库 PCRE2 新版的 LoongArch JIT 支持时，[xen0n](https://github.com/xen0n)
[发现](https://github.com/loongson-community/discussions/issues/36)代码中缺失了关于浮点数转整数操作在
LoongArch 上的边界情况行为的记载。
虽然 lrzlin 马上[做了实验并修复了](https://github.com/zherczeg/sljit/pull/226)此问题，
但 [xry111] 随即[指出][ftint-issue]《龙芯架构参考手册》对此未加详细说明，因而理论上仍可能存在行为与当下实验结果不符的芯片。
社区已将此问题提醒到龙芯官方：我们没权限改《手册》，只能你们来了！

[ftint-issue]: https://github.com/loongson-community/discussions/issues/38

### 社区维护的 LoongArch Chromium 补丁集现已可用 {#chromium-patchset}

Chromium 浏览器，及基于其内核的一众衍生项目如 QtWebEngine、Electron 等等，已成为当代桌面、移动端不可或缺的基础设施。
但由于其代码规模庞大，且演进极为迅速、激进，一直以来，如何持续维护可用的 Chromium 分支这件事，对那些非 x86 或 ARM 架构的系统集成工作者而言，都是一块心病。
即便「多金」如 IBM PowerPC，「网红」如 RISC-V，也只能紧赶慢赶，而暂未能进入 Chromium 主线，从日常
`git rebase` 解冲突的苦海「上岸」。

截至目前，LoongArch 也并未在 Chromium 主线得到完整支持，因此为 LoongArch 打包的同学们也要自行维护分支。
龙芯公司先前即出于业务需求，适配了龙芯浏览器、Electron 等项目；
但由于跟进新版本不及时、无统一的补丁分发渠道等因素，这些工作并未能惠及新世界发行版的工作人员。
龙芯开源社区于 2023 年 10 月即[关注了](https://github.com/loongson-community/discussions/issues/2)此事，
呼吁维护一套公共的 Chromium 补丁集；但限于人力，当时未有回应。

好在新的一年，勇士们终究站了出来：
基于 [SignKirigami](https://github.com/prcups)
[制作的](https://github.com/prcups/qt6-webengine-loongarchlinux)
Qt6 WebEngine 补丁集，[杰哥](https://github.com/jiegec)完成了完整
Chromium 的构建与测试工作，成果已在安同开源社区（AOSC）组织下[公开了](https://github.com/AOSC-Dev/chromium-loongarch64)。

### OpenSSL {#openssl}

[xry111] [修复了](https://github.com/openssl/openssl/pull/23301)自己之前重构代码时的一处不小心，
此 bug 有可能导致 ChaCha20 算法的 SIMD 优化版本永远跑不到 :clown_face:。

## 社区整活:儿: {#grins}

本栏目接受任何网友的投稿，只要内容与 LoongArch&reg; 有关，并可以为读者带来价值，
无论严肃贡献（整的大活:儿:）或是博君一笑都一概欢迎！

[Xinmudotmoe] 在龙芯固件团队未提供相应支持的情况下，自己动手丰衣足食，[手工移除了](https://github.com/loongson/Firmware/issues/80#issuecomment-1903111698)
3C5000 工作站主板固件中所有与显示相关的模块，终于能在 3C5000 工作站上使用近年的 AMD 显卡了。
但 :ta: [警告说](https://github.com/loongson-community/areweloongyet/issues/16#issuecomment-1903435237)这样做要付出很大代价（原文经过了些许编辑）：

:::warning 警告
这种方式有一些已知问题。

* 不同于 3A6000 固件中官方提供的关闭 x86emu 功能，此方式同时使固件失去点亮屏幕的能力（3A6000 固件下关闭 x86emu 后，仍可通过板载显卡看到固件配置选项）。
  但修改后仍可通过串口配置固件。
* 不能在插入 BMC 的情况下启动，否则蜂鸣器会长鸣，无法启动。
* 不能通过 BMC 刷入修改后的固件，但可以通过 BMC 恢复为原版固件。

鉴于此，较「献祭流」而言，本方案风险可能大于收益。
:::

同时，经过 :ta: 的测试，3C5000 超频后可以稳定在全核 2.5GHz，并[跑了](https://openbenchmarking.org/result/2401037-NE-COREMARK311)
CoreMark。
超频后的多核分数大约是 3A5000 的 4 倍，3A6000 的 2 倍。

[Kiri2002] [正在推进](https://bbs.loongarch.org/d/357)将 Arch Linux 中文社区（archlinuxcn）
维护的软件包在 Loong Arch Linux 上打包的工作。

[Kiri2002]: https://github.com/Kiri2002
[Xinmudotmoe]: https://github.com/Xinmudotmoe

## 张贴栏 {#bulletin}

本栏目可供张贴公益性质的各种信息。

* 友情扩散：[安同开源社区（AOSC）][aosc]的龙架构移植主线化工作「合龙」仍在如火如荼进行中，
  此工作完成后龙架构将升格为 AOSC OS 的 Tier 1 架构。
  欢迎同学们试用、反馈，也欢迎有志之士一同加入（沟通渠道详见 AOSC 网站相关栏目）。
* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[aosc]: https://aosc.io
[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16
