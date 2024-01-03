---
slug: this-week-in-loongarch-31
title: 每周一龙：第 31 期
authors: [xen0n]
date: 2024-01-02T23:25:00+08:00
tags: [每周一龙]
---

每周一都为大家报道 LoongArch&reg; 社区最前线的第一手新鲜资讯！
上周的进展主要有 Linux 和工具链。
详情点进来看！

<!-- truncate -->

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

本期周报的实际发稿时间是周二晚间，因为周一是元旦假期。新年快乐 :tada:！

## 先「马」再看 {#marked-projects}

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch&reg; 领域的重要或长期项目（坑）。

### Linux {#linux}

[Xi Ruoyao][xry111] [查明并修复了](https://lore.kernel.org/loongarch/20240102123706.6099-2-xry111@xry111.site/)龙架构上
Linux 一直以来的[偶现问题](https://github.com/loongson-community/discussions/issues/7)：
创建新进程时，新进程可能继承到不干净的 FCSR（浮点控制状态寄存器）内容，导致后续做浮点操作时迟早发生非预期行为甚至崩溃。
此 bug 是从 MIPS 内核带来的遗产。由于 MIPS 的 FCSR 初始化需要考虑程序的执行域（personality），Xi Ruoyao 不知道怎么修，
所以只能[报告了](https://lore.kernel.org/linux-mips/7a6aa1bbdbbe2e63ae96ff163fab0349f58f1b9e.camel@xry111.site/)该问题，
等待 MIPS 相关维护者处理。

[xen0n] [修复了](https://lore.kernel.org/loongarch/20231227070317.1936234-1-kernel@xen0n.name/)使用最新
binutils、gcc 构建内核时 `modpost` 会崩溃的问题。

[xry111]: https://github.com/xry111
[xen0n]: https://github.com/xen0n

### 工具链 {#toolchain}

#### binutils {#binutils}

由常佳琛同学操刀的，周报第 27 期[提到的](./2023-12-05-this-week-in-loongarch-27/index.md#abi) LoongArch
TLS LE relaxation 特性的 binutils 部分，成功进入主线了。
让我们祝贺 :ta: 加入上游贡献者的行列 :tada:！

#### GCC {#gcc}

[Xi Ruoyao][xry111] [修复了](https://gcc.gnu.org/pipermail/gcc-patches/2023-December/641443.html)
xen0n [报告的][PR113148] bug:
XWayland 等软件中存在个别内含大量浮点比较操作的函数，编译这些函数时 gcc 会崩溃。

[PR113148]: https://gcc.gnu.org/PR113148

Xi Ruoyao 还[允许了](https://gcc.gnu.org/pipermail/gcc-patches/2023-December/641609.html)利用
`{,x}vf{min,max}` 四种指令来向量化循环中的取最大/最小值操作。LoongArch 的这四种指令设计上就符合 IEEE 754-2008 语义，
因而可用。

周报第 30 期[提到的](./2023-12-26-this-week-in-loongarch-30/index.md#gcc)
Xi Ruoyao 当时「正在调整」的补丁，现已完成改进工作，[进入主线了](https://gcc.gnu.org/r14-6863)。

由 Lulu Cheng 开发的，上一节中提到的 TLS LE relaxation 特性的 gcc 部分，
也[进入主线了](https://gcc.gnu.org/r14-6879)。

#### LLVM {#llvm}

[yjijd] 按照 LoongArch psABI v2.30，[修复了](https://github.com/llvm/llvm-project/pull/74990)先前会用向量寄存器传递向量参数的问题。

[wangleiat] 修复了一系列 SIMD 代码生成上的错误：

* [`{,x}vbitseli.b` 的误用](https://github.com/llvm/llvm-project/commit/da5378e87e11689d05a58198d6e15e9551916794)，
* [`xvrepl128vei` 的误用](https://github.com/llvm/llvm-project/commit/c7367f985e0d27aeb8bc993406d1b9f4ca307399)，以及
* [`vector_extract` 在 LASX 上的错误编译结果](https://github.com/llvm/llvm-project/commit/47c88bcd5de91522241cca1aaa1b7762ceb01394)。

Go 团队的 [abner-chenc] 和 Xiaolin Zhao 来 LLVM 上游串门了：:ta: 们给 TSan
[增加了](https://github.com/llvm/llvm-project/pull/72819) Go `loong64` 支持。

[yjijd]: https://github.com/yjijd
[wangleiat]: https://github.com/wangleiat
[abner-chenc]: https://github.com/abner-chenc

## 杂闻播报 {#assorted-news}

Slackwareloong 维护者 [shipujin] 说：Slackware 中文社区在 Slackwareloong LTS 1.0 系统下，
成功验证了构建、运行 KDE Plasma 6 Beta 2 版本桌面环境。
后面会把构建好的相关软件包发布到 Slackwareloong 下的 KDE6 testing 仓库。
感谢 shipujin 提供新闻线索！

[shipujin]: https://github.com/shipujin

## 社区整活:儿: {#grins}

本栏目接受任何网友的投稿，只要内容与 LoongArch&reg; 有关，并可以为读者带来价值，
无论严肃贡献（整的大活:儿:）或是博君一笑都一概欢迎！

LoongArch 非官方开源社区（LA UOSC）版主[杜比][dbhrscom][发起了](https://bbs.loongarch.org/d/351-lauosc-freebsd-ports)
FreeBSD 移植项目，工作进度[放在了](https://gitee.com/lauosc/freebsd) Gitee 上。
无尘（yu shan wei）同学也单独[维护了](https://gitee.com/yushanwei/freebsd4loongarch)补丁集合。
感谢 [Haowu Ge][haowuge] 在群聊中投递新闻线索！

[dbhrscom]: https://bbs.loongarch.org/u/4
[haowuge]: https://github.com/haowuge

## 张贴栏 {#bulletin}

本栏目可供张贴公益性质的各种信息。

* 友情扩散：[安同开源社区（AOSC）][aosc]的龙架构移植主线化工作「合龙」仍在如火如荼进行中，
  此工作完成后龙架构将升格为 AOSC OS 的 Tier 1 架构。
  欢迎同学们试用、反馈，也欢迎有志之士一同加入（沟通渠道详见 AOSC 网站相关栏目）。
* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[aosc]: https://aosc.io
[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16
