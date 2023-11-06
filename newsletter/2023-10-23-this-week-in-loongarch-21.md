---
slug: this-week-in-loongarch-21
title: 每周一龙：第 21 期
authors: [xen0n]
#date: 2023-10-22T22:16:13+08:00
date: 2023-10-23T08:00:00+08:00  # 前一天晚上提前写好的，因此 commit time 偏早
tags: [每周一龙]
---

每周一都为大家报道 LoongArch&reg; 社区最前线的第一手新鲜资讯！

<!-- truncate -->

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

## 先「马」再看

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch&reg; 领域的重要或长期项目（坑）。

### Linux

10 月 19 日，Huacai Chen [发出了](https://lore.kernel.org/loongarch/169774057661.20290.11492595041951746156.pr-tracker-bot@kernel.org/T/#m9facb0821a19108af3693a87dc0f603d6d9fa26f)
v6.6 开发周期的第三组 LoongArch 架构相关修复，
Linus 很快将其拉入了主线。
这些内容已在美西时间周日下午的 v6.6-rc7 tag 发布了。
内容有：

* 周报第 19 期报道的 Icenowy Zheng 的 LoongArch 写合并问题规避方式[修复](https://git.kernel.org/torvalds/c/278be83601dd1725d4732241f066d528e160a39d)，
  实测解决了 AMD GPU 系统的许多纹理损坏问题。
* 同样在第 19 期报道的上游开发者 Deepak 发现的实时内核相关重构需求，
  由 Huacai Chen [实现](https://git.kernel.org/torvalds/c/477a0ebec101359f49d92796e3b609857d564b52)。
* Tiezhu Yang [重构的](https://git.kernel.org/torvalds/c/00c2ca84c680f64b79b5e10a482ca435fd7d98ce)一些汇编代码中对符号性质的标注。
* Huacai Chen [实现的](https://git.kernel.org/torvalds/c/449c2756c2323c9e32b2a2fa9c8b59ce91b5819d)第
  18 期周报中发现的构建错误修复。

### 工具链

#### gcc

10 月 19 日，Xi Ruoyao 完成了国庆以来一直在做的指令调度与 linker relaxation
的平衡取舍工作，向邮件列表[发出了](https://gcc.gnu.org/pipermail/gcc-patches/2023-October/633583.html)第一稿。
（对于先前发现的 binutils BFD 链接器 不会 relax 任何共享库的问题，mengqinggang
[写了](https://sourceware.org/pipermail/binutils/2023-October/129941.html)一版修复。）

#### LLVM

10 月 17 日，yjijd [提交了](https://github.com/llvm/llvm-project/pull/69313)
:ta: 和 leecheechen 合作开发的，为 Clang 添加 LSX/LASX builtins 支持的补丁。
有这部分支持之后 Clang 就可以编译向量优化的 C 代码，而不用依赖手写汇编了。

同一天，wangleiat [教会了](https://github.com/llvm/llvm-project/pull/69300)
LLVM 在 LoongArch 浮点条件码寄存器间搬运数据。
在此之后，寄存器分配工序就可以放开手脚随意使用这部分寄存器了。
（值得一提的是，在代码审查过程中，偶然发现此变更清零 FCC 的方式比 GCC 先前使用的方式要[快许多](https://github.com/llvm/llvm-project/pull/69300#discussion_r1361832152)。
当天 Xi Ruoyao 便将此优化[移植到了](https://gcc.gnu.org/pipermail/gcc-patches/2023-October/633317.html) GCC，
第二天即合并了。）

## 杂闻播报

近日，龙芯开发者 zhaojunchao 向微软公司维护的跨平台、高性能机器学习推理、训练加速方案
ONNX 运行时[提交了](https://github.com/microsoft/onnxruntime/pull/17937)
LoongArch 向量优化。
（感谢 mengqinggang 投递新闻线索！）

前一段时间，Debian 邮件列表管理员[完成了](https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=1023585#87)
Debian LoongArch port 邮件列表的创建操作。
后续可以在[这里](https://lists.debian.org/debian-loongarch/)订阅、看邮件归档了。
（感谢 [SnowNF](https://github.com/SnowNF) 投递新闻线索！）

## 张贴栏

本栏目可供张贴公益性质的各种信息。

* 友情扩散：[安同开源社区（AOSC）][aosc]的龙架构移植主线化工作「合龙」仍在如火如荼进行中，
  此工作完成后龙架构将升格为 AOSC OS 的 Tier 1 架构。
  欢迎同学们试用、反馈，也欢迎有志之士一同加入（沟通渠道详见 AOSC 网站相关栏目）。
* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[aosc]: https://aosc.io
[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16
