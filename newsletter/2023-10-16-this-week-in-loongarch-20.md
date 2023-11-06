---
slug: this-week-in-loongarch-20
title: 每周一龙：第 20 期
authors: [xen0n]
date: 2023-10-16T18:27:58+08:00
tags: [每周一龙]
---

每周一都为大家报道 LoongArch&reg; 社区最前线的第一手新鲜资讯！

<!-- truncate -->

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

## 要闻速递

社区伙伴 jiegec 完成了龙芯二进制翻译（<abbr title="Loongson Binary Translation">LBT</abbr>）
扩展的解析工作，[整理了一份:儿:参考文档](https://github.com/jiegec/la-inst/blob/master/LBT.md)！
用到的实验代码就附在文档旁边:儿:。
这意味着 QEMU 等相关项目不久就能用上 LBT 特色指令，
不用苦哈哈等《龙芯架构参考手册》卷三公布了。

几周以来，[安同开源社区][aosc]（<abbr title="Anthon Open Source Community">AOSC</abbr>）
的朋友们陆续拿到了 LoongArch 硬件，做了许多测试验证工作，
十分辛苦。
本期的 AOSC 社刊[《安记冰室・十月上》](https://github.com/AOSC-Dev/newsroom/blob/76c6dc1571cba2af74673b51df70f5f3d43ed1a0/coffee-break/20231014/zh_CN.md)记录了
:ta: 们的工作成果，推荐阅读。(An English version [is also available](https://github.com/AOSC-Dev/newsroom/blob/76c6dc1571cba2af74673b51df70f5f3d43ed1a0/coffee-break/20231014/en.md).)

此外，《咱龙了吗？》后续也将与 AOSC 等社区朋友们一道，
扩充阅读材料、优化信息架构，以期更好服务读者群体。
敬请期待（也[期待您的参与](https://github.com/loongson-community/areweloongyet)）！

## 先「马」再看

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch&reg; 领域的重要或长期项目（坑）。

### Linux

在解析 LBT 扩展的过程中，jiegec [发现了](https://bugzilla.kernel.org/show_bug.cgi?id=218012)主线内核对
LBT x87 浮点栈顶指针寄存器 `FTOP` 的保存恢复有误。
由于直到本周为止 LBT 都处于缺乏文档的状态，且目前已知唯一会利用 LBT 的应用程序 <abbr title="Loongson Architecture Translator for x86">LATX</abbr> 并未受其影响，该问题不会影响日常使用，但预计也会在月中得到排查、修复。

### 工具链

#### gcc

10 月 16 日，Jiahao Xu [贴出了](https://gcc.gnu.org/pipermail/gcc-patches/2023-October/633086.html)两组向量操作的龙架构支持，
以及一版新的向量化成本模型。
这位同学在上游似乎是新面孔，欢迎！

10 月 12 日，Lulu Cheng [修改了](https://gcc.gnu.org/pipermail/gcc-patches/2023-October/632748.html)
gcc 对齐汇编指令的方式。
该变更需要配合 binutils 的[此提交](https://sourceware.org/git/gitweb.cgi?p=binutils-gdb.git;a=commitdiff;h=1fb3cdd87ec61715a5684925fb6d6a6cf53bb97c)才能工作。

10 月 11 日，Chenghui Pan [修复了](https://gcc.gnu.org/pipermail/gcc-patches/2023-October/632607.html)一例向量化造成的崩溃
（学名 <abbr title="internal compiler error">ICE</abbr>：内部编译器错误）。

#### LLVM

10 月 12 日，社区的 Xinmudotmoe 同学在折腾 LoongArch 上 ROCm 的过程中，
给 LoongArch LLVM [添加了](https://github.com/llvm/llvm-project/pull/68851)
16 位（半精度）及 128 位（四精度）浮点操作的模拟支持。
按照公开信息，龙架构没有 16 位或 128 位浮点操作的原生支持；
为了能跑更多程序，即便模拟操作性能肯定不如真实硬件支持，对生态整体而言也值了。

:::info 笔者猜测
大概率 LoongArch 曾经至少支持过这两种浮点格式之一，但在公开前被扒掉了。

可以从浮点指令的编码上看出端倪：表示浮点格式的那部分操作码，
单精度是 `01` 双精度是 `10`，因此这个位域肯定宽 2 位；
但相应位取 `00` 或 `11` 的指令尽付阙如。
如果需求上只要支持 2 种格式即可（即最常见的单精度、双精度浮点），多的格式以后也不要，
那么表示这个信息只要 1 位就够了。

因此在「拉清单」决定指令集大方向的阶段，设计师必然考虑了其他浮点格式且为其预留了编码空间，
而是出于其他原因才未将其包含进 LoongArch v1.00。
这原因可能是 FP16、FP128 目前很少用到，且机器学习场景往往都用 FP16
的变体 BF16，因此如果第一时间宣称支持，将限制后续的迭代空间；
如果加入了支持却几年都捞不着用，更是得不偿失。
相反，目前是将两种格式编码暂时保留：如果有朝一日需要重新加入它们（或者别的格式），指令编码便能维持「好看」。
「好看」不光是看起来舒服，译码器的实现也能简单点:儿:；
这方面做个「颜控」大概没毛病！
:::

同一天，heiher 帮笔者把先前做了一大半却没精力跟进的 3A6000 `DBAR`
优化补丁完善了，[合并进了](https://github.com/llvm/llvm-project/pull/68787)主线。

10 月 11 日，heiher [优化了](https://github.com/llvm/llvm-project/pull/67391)原子操作的代码生成。
具体来说是去掉了 `LL` 之前以及 `LL/SC` 之间不必要的内存栅障，
还修复了 acquire 语义。

### 发行版

Debian 上游工作也有所进展：`binutils` 包的改动[获合并](https://tracker.debian.org/news/1470074/accepted-binutils-2415020231010-1-source-amd64-all-into-experimental/)，`glibc`
包的[改动](https://salsa.debian.org/glibc-team/glibc/-/commit/859b3e39e09a57f0735f04514d2b574f80c3926c)也[待上传](https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=1053717)。
这意味着需要 LoongArch 方面单独维护、手工处理的包进一步减少了。
（感谢 Revy 投递新闻线索。）

## 杂闻播报

10 月 10 日，社区同学 Robin Lee 做的 FreeDesktop SDK 龙架构初步适配[获合并](https://gitlab.com/freedesktop-sdk/freedesktop-sdk/-/merge_requests/12203)。
FreeDesktop SDK 是 Flatpak 打包方案的基础运行时。

AOSC 社区的 LoongArch 同好 Tianhao Chai 近日给 Mellanox 网卡[^注一]的固件工具 `mstflint`
[提交了](https://github.com/Mellanox/mstflint/pull/836) LoongArch 适配。
这些硬件目前看来在 LoongArch 系统上都能良好工作。

[^注一]: <ruby>Mellanox<rt>迈络思</rt></ruby>，是 InfiniBand 网卡的主要供应商之一，
几年前已为 <ruby>NVIDIA<rt>英伟达</rt></ruby>所收购。
在家庭高性能计算、<abbr title="network-attached storage">NAS</abbr> 等领域，有不少用户选择购买二手 Mellanox 硬件。

Slackware 中文社区同学、Slackware 龙架构移植维护者 Shi Pujin 提醒：Slackware
中文社区的官网地址[变更了](http://www.slackwarecn.cn)，见链接目标。
（从托管域名变为独立域名了，但仍然托管在 GitHub Pages。）


## 张贴栏

本栏目可供张贴公益性质的各种信息。

* 友情扩散：[安同开源社区（AOSC）][aosc]的龙架构移植主线化工作「合龙」仍在如火如荼进行中，
  此工作完成后龙架构将升格为 AOSC OS 的 Tier 1 架构。
  欢迎同学们试用、反馈，也欢迎有志之士一同加入。
* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[aosc]: https://aosc.io
[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16
