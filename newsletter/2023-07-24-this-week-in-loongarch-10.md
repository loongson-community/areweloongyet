---
slug: this-week-in-loongarch-10
title: 每周一龙：第 10 期
authors: [xen0n]
date: 2023-07-24T13:56:50+08:00
tags: [每周一龙]
---

每周一都为大家报道 LoongArch&reg; 社区最前线的第一手新鲜资讯！

<!-- truncate -->

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

## 先「马」再看

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch&reg; 领域的重要或长期项目（坑）。

### Linux

* 7 月 24 日，Huacai Chen [发出了](https://lore.kernel.org/loongarch/20230722072201.2677516-1-chenhuacai@loongson.cn/)一版测试补丁，
  以允许内核自身使用 LSX/LASX 为特定操作加速。xen0n 将很快基于此补丁优化龙架构上的 RAID5/6 计算性能。
* 7 月 19 日，来自麒麟的 Enze Li [贴出了](https://lore.kernel.org/loongarch/20230719082732.2189747-1-lienze@kylinos.cn/)龙架构的
  [KFENCE](https://www.kernel.org/doc/html/latest/dev-tools/kfence.html) 适配。KFENCE（Kernel Electric-Fence，「内核电子围栏」）
  是基于采样的低开销内存安全检查工具，可以帮助检查堆越界访问、<ruby>释放后使用<rt>use-after-free</rt></ruby>、非法释放内存等常见的内存安全 bug。
* 7 月 18 日，上游开发者 Dan Carpenter 为龙芯集显显控驱动[增加了](https://lore.kernel.org/dri-devel/0da6859b-40cc-4b3e-b8b6-fed157517083@moroto.mountain/T/#u)一处错误处理。
  由于龙芯的代码维护者似乎一开始并不想接受该补丁，加之使用了错误的英语表达，差点吵起来，还好后边和平解决了。
  （笔者并未参与调解，但疑似是有国人朋友看懂了中式英语，私聊告知了 Dan 龙芯维护者实际想表达的含义。）

### 工具链

#### LLVM

预计在中国时间 7 月 25~26 日期间，LLVM 17 将从主线切出，如无重大事件则预计在 6 周后正式发布。
该版本如同 binutils 2.41，也将包含完整的 LA64 v1.00 指令汇编、反汇编支持。LLD 的龙架构移植预计不会在本周内完成（尽管进行到了最后的微调工作），
但经上游维护者 MaskRay 证实，一旦其代码通过审查，也将能够进入 LLVM 17 发布分支。

7 月 21 日，wangleiat [提交了](https://reviews.llvm.org/D155917)龙架构虚拟化扩展（LVZ）
与二进制翻译扩展（LBT）的指令汇编、反汇编支持，已于 7 月 24 日进入主线，
赶上了 LLVM 17 的发布节奏。

7 月 20 日，wangleiat 为 Clang 增加了 [LSX](https://reviews.llvm.org/D155829)
与 [LASX](https://reviews.llvm.org/D155830) 的 intrinsics 支持，
第二天 leecheechen 为它们分别[补上](https://reviews.llvm.org/D155834)了[测试](https://reviews.llvm.org/D155835)。

7 月 20 日，SixWeining 也为 Clang [增加了](https://reviews.llvm.org/D155824)
`-march=native` 与 `-mtune=` 命令行选项的支持。

## 杂闻播报

<a name="openssl-asm-breakage"></a>

7 月 21 日，xry111 向 OpenSSL 项目提交了[运行时动态检测龙架构向量扩展支持](https://github.com/openssl/openssl/pull/21509)与[构建时正确检测龙架构](https://github.com/openssl/openssl/pull/21510)的补丁。这能修复 OpenSSL 3.1.x 的龙架构配置不能搭配没有向量支持的工具链使用的问题。（先前龙芯贡献的代码未考虑这一点，那些工程师大概率未在社区发行版的环境下进行测试。）

7 月 20 日，Gentoo 的龙架构移植从 <ruby>WD40<rt>no rust</rt></ruby> 状态[毕业了](https://github.com/gentoo/gentoo/pull/31957)。
待 LLD 支持上游后，预计 GNOME3 的 keywording 工作将能够很快推进了。

7 月 17 日，龙芯在其 GitHub 组织下[创建了](https://github.com/loongson/la-softdev-convention)名为
`la-softdev-convention`「龙架构软件开发约定」的仓库，
内容也是先前被归档的《龙架构工具链约定》等文档的微调。
如同[先前的 `la-abi-specs` 仓库](https://github.com/loongson/la-abi-specs)，[向该库贡献](https://github.com/loongson/la-softdev-convention/blob/master/CONTRIBUTING.md)也需要签署龙芯 CLA。
目前仍未有龙芯 CLA 方面的公开进度，但观察到 [@loongson-admin](https://github.com/loongson-admin)
账号下出现了[一个 Canonical CLA 自动化流程的 GitHub Action 定义的 fork](https://github.com/loongson-admin/has-signed-canonical-cla)。

## 张贴栏

本栏目可供张贴公益性质的各种信息。

* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16
