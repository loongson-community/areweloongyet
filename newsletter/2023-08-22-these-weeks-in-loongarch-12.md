---
slug: these-weeks-in-loongarch-12
title: 每周三龙：第 12 期
authors: [xen0n]
date: 2023-08-22T01:07:50+08:00
tags: [每周一龙]
---

每周一都为大家报道 LoongArch&reg; 社区最前线的第一手新鲜资讯！

<!-- truncate -->

因为笔者的现实生活出现变故，本期改为周二更新前三周的内容，预计下期恢复周一更新。

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

## 先「马」再看

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch&reg; 领域的重要或长期项目（坑）。

### Linux

xen0n 使用龙架构向量扩展做的 RAID5、RAID6 计算优化已[被 linux-raid 维护者接受](https://lore.kernel.org/linux-raid/CAPhsuW5J_wUGmU+1tvzTqmpJSRrJicXoNmp+-ftDuHuhBcbkqA@mail.gmail.com/T/#t)，已在最新 linux-next 可用。
相比通用的标量算法，向量加速可使这些操作的性能提升 1~3 倍。

### 工具链

#### gcc

8 月 15 日，Chenghui Pan 与 Lulu Cheng 等人的龙架构向量扩展上游补丁已经[翻新到了第 4 版](https://gcc.gnu.org/pipermail/gcc-patches/2023-August/627413.html)。
不过仍然没有将补丁拆得更细，也仍然有一些小细节需要打磨。
好事多磨！

8 月 6 日，Jiajie Chen [提交了](https://gcc.gnu.org/pipermail/gcc-patches/2023-August/626413.html)
32 位龙架构（LA32）的 GCC 支持补丁。
该同学是近一段时间以来的新鲜面孔，且并非龙芯员工，欢迎欢迎！
（感谢 xry111 的线索投递；他还有句吐槽：建议大家别在脑子里总把 32 位 ISA 跟 32 位 ABI「强绑定」一起。）

#### LLVM

8 月 21 日，wangleiat 将龙架构的栈重对齐操作实现方式从两条移位（RISC-V 做法）[优化到了](https://reviews.llvm.org/D158384)一次 `bstrins`。

8 月 19 日，wangleiat 合并了他自己做的 Clang 龙架构向量操作 intrinsics
支持补丁（[LSX](https://reviews.llvm.org/D155829)、[LASX](https://reviews.llvm.org/D155830)）
与 leecheechen 补的相关测试用例（[LSX](https://reviews.llvm.org/D155834)、[LASX](https://reviews.llvm.org/D155835)）。

8 月 9 日，wangleiat 合并了他自己 2 号做的一组 Clang 龙架构 intrinsics 相关的[代码重构](https://reviews.llvm.org/D156866)。

同一天，SixWeining 合并了他自己 1 号为 LLD 新增的 [`R_LARCH_PCREL20_S2` 重定位记录类型支持](https://reviews.llvm.org/D156772)；
还把先前被发现有问题的 `-march=`、`-mtune=` 选项支持补丁[最终修好了](https://reviews.llvm.org/D155824)。

8 月 8 日，SixWeining [修复了](https://reviews.llvm.org/D156116)龙架构 Clang 与 GCC 所实现的 C++ ABI 的一处不一致。

## 杂闻播报

8 月 17 日，caiyinyu 合并了 8 月 4 日 dengjianbo 在 glibc 邮件列表[贴出的](https://sourceware.org/pipermail/libc-alpha/2023-August/150671.html)使用龙架构向量指令优化的字符串操作实现。
从邮箱地址看，这位 Deng 姓同学是龙芯员工，这应该是 :ta: 在上游的首秀。欢迎欢迎！
这也意味着能够构建龙架构 glibc 2.39 的最低 binutils 版本上升到了 2.41。xry111 对此指出：
与一些其他项目不同，glibc 的维护者们不喜欢检测汇编器能力并以此决定打开或是关闭某些功能。
（感谢 xry111 的线索投递。）

8 月 16 日，Debian Ports 项目[正式将龙架构加入](https://lists.debian.org/debian-devel-announce/2023/08/msg00000.html)其自动化构建梯队。
这天也恰巧是 Debian 项目创立 30 周年的纪念日。
此事也得到了知名 Linux 媒体 [Phoronix 的报道](https://www.phoronix.com/news/Debian-Ports-LoongArch)。

LLD 原作者 Rui Ueyama 单飞后创立的 mold 项目，已在其 8 月 13 日正式发布的 2.1
版本中[包含了](https://github.com/rui314/mold/pull/1081) Jinyang He 基于 LLD
LoongArch port 写作的龙架构支持补丁。
Phoronix 也[报道了](https://www.phoronix.com/news/Mold-2.1-Adds-LoongArch)此事。
（感谢 zhangn1985 的线索投递。）

## 社区整活:儿:

本栏目接受任何网友的投稿，只要内容与 LoongArch&reg; 有关，并可以为读者带来价值，
无论严肃贡献（整的大活:儿:）或是博君一笑都一概欢迎！

这几周没有网友整大活的印象，可能是笔者没关注，也可能确实风平浪静。
不过笔者和其他很多同学都陆续拿到/买到了 3A6000 板子，预计有很多折腾成果将不日公布 :wink:。

## 张贴栏

本栏目可供张贴公益性质的各种信息。

* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16
