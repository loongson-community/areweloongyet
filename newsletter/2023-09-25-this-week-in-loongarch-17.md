---
slug: this-week-in-loongarch-17
title: 每周一龙：第 17 期
authors: [xen0n]
date: 2023-09-25T15:17:26+08:00
tags: [每周一龙]
---

每周一都为大家报道 LoongArch&reg; 社区最前线的第一手新鲜资讯！

<!-- truncate -->

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

## 先「马」再看

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch&reg; 领域的重要或长期项目（坑）。

### Linux

9 月 23 日，Huacai Chen 向[中国时间 9 月 25 日凌晨 tagged 的](https://lore.kernel.org/lkml/CAHk-=wjrZgxjHZuXwrGeFnng_whUmtToCWE5GQ+HORhGSeiX8g@mail.gmail.com/)
Linux v6.6-rc3 [推送了](https://lore.kernel.org/loongarch/20230923091031.1075337-1-chenhuacai@loongson.cn/)一组问题修复与代码清理。
由于此 rc 包含重要的修复工作（见下），建议所有紧跟主线的同学们尽快升级或跟进最新的
linux-next（&ge; `next-20230925`）。

* [修复了](https://lore.kernel.org/loongarch/CAAhV-H7r2iNVUstHuYHj8Ve=sY9c5JoMvZNX_pDaUVhL7oGWXw@mail.gmail.com/T/#m74d1c148796ffb824ced5986e3160d055778899c)龙架构上一旦使能
  `CONFIG_DEFERRED_STRUCT_PAGE_INIT` 则系统无法正常启动的问题。
  （对于插了很多内存的机器，此优化可少许提升启动速度。
  因此内存插满又喜欢微操的社区开发者们被第一时间坑到了：
  龙芯团队极少改动、测试这些不直接与龙芯芯片、软件、出货系统相关的内核配置，
  所以未在[引发问题的提交](https://github.com/torvalds/linux/commit/61167ad5fecdea)所在的
  v6.5 开发周期发现问题。）
* （此变更与龙架构无关但十分重要）[回滚了](https://www.phoronix.com/news/Linux-Revert-MG-Timestamps)多粒度时间戳（Multi-grained Timestamps）工作。
  此优化本意是想降低 NFS（网络文件系统）的性能开销，但实际在其他文件系统上引起了相关的细微 bugs，
  因此补丁作者决定推翻此方案从头再来。

9 月 20 日，KVM 维护者 Paolo [在回信中表示](https://lore.kernel.org/loongarch/CAAhV-H6YormmC7DC4Ar9Rwu16OHKP0G8+=7eShxkWjjQ7kq5mA@mail.gmail.com/T/#m3a0928eccdaf047b8d1365512b563a571047f6c6)：
既然你们已经在准备第 22 版补丁了，到时候可以作为 Pull Request 顺带提了。Huacai Chen
[回复说](https://lore.kernel.org/loongarch/CAAhV-H6YormmC7DC4Ar9Rwu16OHKP0G8+=7eShxkWjjQ7kq5mA@mail.gmail.com/)：
如果 v22 没什么更多审查意见的话，等一两周就发。
看上去龙架构 KVM 支持进入 Linux 6.7 指日可待了：
硬件虚拟化，说是服务器、数据中心，甚至家庭多合一 NAS 场景的最基础能力也不为过。
Linux 6.7 是个值得期待的更新。

### 工具链

#### gcc

为启用 linker relaxation（链接器松弛）优化，chenglulu [使得](https://gcc.gnu.org/pipermail/gcc-patches/2023-September/630954.html)
gcc 在构建时如果发现配套的汇编器有 `-mrelax` 支持，则让成品 gcc 默认关闭
`-mexplicit-relocs` 选项。
这样做的优化效果可能十分取决于被编译的具体代码，故特别提及，请各位同学升级 gcc
时多多留心并观察一些自己关心的软件、函数的性能与汇编形状是否仍然符合预期。

:::info
由于涉及删除一些指令，linker relaxation 能工作的前提是相关指令都聚在一起：
这项工作只能在链接阶段完成，不做此保证会让链接器的复杂度爆炸，
例如需要跟踪每个寄存器的使用情况以防止删除指令导致程序语义变化。
这要求编译器在生成代码时，只用伪指令来表达产生、使用符号地址的动作，**不能**有控制背后具体指令的自由度。
这就与 `-mexplicit-relocs` 天然不对付：
打开这个选项就是要让编译器**能**感知、控制这些具体指令，
进而得以利用更多优化机会，也更有助于指令调度。

因为 linker relaxation 与相关指令的更佳调度在现有条件下无法两全，所以才说不见得是无条件优化，需要十分留心。
:::

liwei [调整了](https://gcc.gnu.org/pipermail/gcc-patches/2023-September/630749.html)一些向量优化成本数值。

guojie [优化了](https://gcc.gnu.org/pipermail/gcc-patches/2023-September/631062.html)几种向量值的构造。

Chenghui Pan [在修测试](https://gcc.gnu.org/pipermail/gcc-patches/2023-September/630953.html)。

#### D

AOSC 社区的刘子兴（[@liushuyu](https://github.com/liushuyu)）为 D 语言的
[GCC 前端](https://gcc.gnu.org/pipermail/gcc-patches/2023-September/631259.html)与[运行时](https://github.com/dlang/dmd/pull/15628)添加了龙架构支持。
欢迎！

#### LLVM

当地时间 9 月 19 日，LLVM 17 正式发布。此版本新增了不少龙架构优化，更有完整的
LA64 v1.00 指令汇编、反汇编支持（先前已有报道），建议开发者们只要可行都升级。

最近发现 Clang 17 在带着 `-march=la464` 编译的时候，可能会想做自动向量化然后不知道怎么生成代码（因为当时还没做；现在似乎也没），导致崩溃。
由于笔者精力有限，欢迎有志之士自告奋勇：笔者会教你怎么查 &amp; 修。

## 杂闻播报

近日，著名工具链维护者之一、LLVM LLD 的原作者 Rui Ueyama さん[发布了](https://github.com/rui314/mold/releases/tag/v2.2.0)
mold 2.2。
mold 是他基于多年的链接器开发经验重新设计的现代化、高性能链接器，
从 2.1 版本起支持龙架构。
为提升 `--build-id` 计算速度，mold 2.2 换用了
[BLAKE3](https://github.com/BLAKE3-team/BLAKE3) 哈希算法；
这个库[有汇编优化空间](https://github.com/BLAKE3-team/BLAKE3/blob/master/c/README.md)！
欢迎有志之士为其添加 LSX/LASX 优化。

9 月 20 日，笔者从一封抄送到自己邮箱的通知邮件关注到：openEuler 社区[已在着手](https://gitee.com/openeuler/kernel/issues/I82GAS)为其
23.09 系统的内核添加更多龙架构支持。
看邮箱地址，推进此工作的 Hongchen Zhang 是龙芯员工。[openEuler 23.09 的内核](https://gitee.com/openeuler/kernel/tree/openEuler-23.09/)版本是 6.4，
这意味着上述工单中提到的工作会涉及许多向后移植（backport），在此祝 tā 们少被冲突坑到 :smiling_imp:

## 张贴栏

本栏目可供张贴公益性质的各种信息。

* 友情扩散：[安同开源社区（AOSC）](https://aosc.io)正在推进其龙架构移植的主线化工作「合龙」，
  此工作完成后龙架构将升格为 AOSC OS 的 Tier 1 架构。
  欢迎同学们试用、反馈，也欢迎有志之士一同加入。
  推荐阅读[《安记冰室・九月下》](https://github.com/AOSC-Dev/newsroom/blob/bfa12c12b1f819adab0fa568e906e682e0fbc244/coffee-break/20230922/zh_CN.md)。(An
  English version [is also available](https://github.com/AOSC-Dev/newsroom/blob/bfa12c12b1f819adab0fa568e906e682e0fbc244/coffee-break/20230922/en.md).)
* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16
