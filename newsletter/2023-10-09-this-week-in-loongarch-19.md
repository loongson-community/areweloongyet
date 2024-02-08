---
slug: this-week-in-loongarch-19
title: 每周一龙：第 19 期
authors: [xen0n]
date: 2023-10-09T17:58:10+08:00
tags: [每周一龙]
---

每周一都为大家报道 LoongArch 社区最前线的第一手新鲜资讯！

<!-- truncate -->

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

## 先「马」再看

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch 领域的重要或长期项目（坑）。

### Linux

10 月 8 日，AOSC 开发者 Icenowy Zheng 在排查 AMD 显卡稳定性问题过程中，
发现以前为点亮 RDNA2 而对 3A+7A 系统的写合并问题规避不完全，
故亲自[完善了](https://lore.kernel.org/loongarch/20231009042841.635366-1-uwu@icenowy.me/)这部分逻辑。
实测打上此补丁后，相关的纹理损坏问题（部分花屏，戏称「字节跳动」）以及 AMD Oland 微架构 GPU
在 `amdgpu` 内核模块驱动下的 ring timeout 问题都解决了，稳定性也有部分改善。
让我们欢迎 :ta: 的首个 LoongArch 内核补丁！

同一天，Bibo Mao 把他的 vDSO & 栈内存布局优化补丁[迭代到了](https://lore.kernel.org/loongarch/20231008012036.1415883-1-maobibo@loongson.cn/)第 3 版。
他学 x86 让 vDSO 和栈共享同一条 PMD，而得以从每个线程省出一页；还做了其他小优化。

10 月 7 日，Tianrui Zhao [修复了](https://lore.kernel.org/loongarch/9f7931dd-3c0e-4bc2-988e-1fb3549e440e@infradead.org/T/#t)上期提到的
KVM 代码在特定内核配置下编译失败的问题，Randy 测了能用。

10 月 6 日，上游开发者 Deepak R Varma 在做实时内核改造，[来问](https://lore.kernel.org/loongarch/ZSFWa44FTi48hDyE@runicha.com/T/#t)一个函数有没有在用，
里头的内存映射操作能不能换成新加的、对实时调度更友好的种类；
被问到的函数 `copy_user_highpage` 只对 32 位内核有用，
因此如果没打算支持纯 32 位系统那么其实最好把它删掉。Huacai Chen 回复说「近期」就会加入 LA32 支持，
然后顺手把 Deepak 的建议写成补丁[贴出来了](https://lore.kernel.org/loongarch/20231007095229.235551-1-chenhuacai@loongson.cn/)。Deepak 对此表示感谢，
并且 :ta: 仍然打算准备一个 LoongArch 编译环境来帮忙测试。
我们也感谢 :ta: 的帮忙！

10 月 5 日，Huacai Chen 向 KVM 子系统维护者[发送了](https://lore.kernel.org/kvm/20231005091825.3207300-1-chenhuacai@loongson.cn/)增加龙架构 KVM 支持的 <ruby>PR<rt>拉取请求</rt></ruby>。
距离主线一步之遥！

### 工具链

#### gcc

10 月 4 日，来自德国 [Ostwestfalen-Lippe](https://en.wikipedia.org/wiki/Ostwestfalen-Lippe)
Linux 用户组的社区同学 Jan-Benedict Glaw
[报告了](https://gcc.gnu.org/pipermail/gcc-patches/2023-October/631933.html)龙架构
gcc 构建错误的问题。
经过一些讨论研究，10 月 7 日 Yang Yujie
[贴出了](https://gcc.gnu.org/pipermail/gcc-patches/2023-October/632210.html)一种修复方法，[看上去行](https://gcc.gnu.org/pipermail/gcc-patches/2023-October/632256.html)。

10 月 3 日 Xi Ruoyao 跟进了一项上游重构：
将符号拷贝操作的表示方式从原先的自定义 <ruby>RTL<rt>寄存器传输语言</rt></ruby> 指令[改为了](https://gcc.gnu.org/pipermail/gcc-patches/2023-October/631822.html)新增的通用写法。

#### binutils

10 月 5 日，Xi Ruoyao 在折腾过程中（详见上期）发现 binutils 当前的龙架构
linker relaxation 工序不会 relax 任何共享库的代码。
现代 Linux 发行版中，大多数被执行到的代码都位于共享库，因此目前的行为肯定让
linker relaxation 的作用打上了相当大的问号；

非但如此，当前的实现方式还有正确性问题：如 Icenowy Zheng 在同一天折腾 libglvnd
时[所发现的](https://sourceware.org/bugzilla/show_bug.cgi?id=30944)，
目前 LoongArch 汇编中的对齐指示已经改为借用 relaxation 基础设施的方式实现了
（以 `R_LARCH_ALIGN` 的形式向 relaxation 工序传递信息）；
而如果不 relax（例如，因为是共享库）则这些不管 re- 不 relax
都应该遵守的对齐指示就会被错误无视，使得生成代码的布局错误，
最终导致运行时崩溃之类难以排查的不好结果。
算上一两个月前同样被坑到但十分抱歉未能及时一句话报出 bug 的笔者，
至少已经有 3 人共计几个甚至十几小时的宝贵业余时间交待在这了。

由于报告问题时正值假期，目前暂未有反馈，但我们预期龙芯工具链的同学将很快得知并着手配合修复此事。

## 杂闻播报

周报第 17 期报道过的 D 语言运行时适配工作已经在 10 月 5 日[合并了](https://github.com/dlang/dmd/pull/15628)。
恭喜 :tada:！


## 社区整活:儿:

本栏目接受任何网友的投稿，只要内容与 LoongArch 有关，并可以为读者带来价值，
无论严肃贡献（整的大活:儿:）或是博君一笑都一概欢迎！

10 月 4 日，jiegec [又发现了](https://github.com/loongson-community/loongarch-opcodes/issues/1#issuecomment-1746975991) 21 条未见于龙架构手册的神奇指令！
其中有一些疑似是执行更快但精度更低的浮点求倒数操作，如果做更多实验比对相应有文档记载指令的输出，则有望知晓更多细节。

整个国庆假期，AOSC 社区都在折腾 AMD 显卡在龙架构机器上的稳定性问题，
龙芯工程师们也积极配合，「为人民做龙芯」。
中国的同学过着美西时区，美西的同学过着中国时区；
在如此的社区协作下，相信此问题终将得到解决（或凝固为 [Errata 文档](/docs/errata)的首批记载之一 :smiling_imp:）！

## 张贴栏

本栏目可供张贴公益性质的各种信息。

* 友情扩散：[安同开源社区（AOSC）](https://aosc.io)的龙架构移植主线化工作「合龙」仍在如火如荼进行中，
  此工作完成后龙架构将升格为 AOSC OS 的 Tier 1 架构。
  欢迎同学们试用、反馈，也欢迎有志之士一同加入。
  推荐阅读[《安记冰室・九月下》](https://github.com/AOSC-Dev/newsroom/blob/bfa12c12b1f819adab0fa568e906e682e0fbc244/coffee-break/20230922/zh_CN.md)。(An
  English version [is also available](https://github.com/AOSC-Dev/newsroom/blob/bfa12c12b1f819adab0fa568e906e682e0fbc244/coffee-break/20230922/en.md).)
* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16
