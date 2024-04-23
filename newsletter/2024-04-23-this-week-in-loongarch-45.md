---
slug: this-week-in-loongarch-45
title: 每周一龙：第 45 期
authors: [xen0n]
date: 2024-04-23T04:10:00+08:00
tags: [每周一龙]
---

每周一都为大家报道 LoongArch 社区最前线的第一手新鲜资讯！
上周的进展主要有工具链和官方文档上新。
详情点进来看！

<!-- truncate -->

本期周报的实际发稿时间是周二凌晨，因为笔者的工作站周末坏掉了，搭建临时环境、处理工作等事务费了很多时间。
网页上显示的发稿时间仍然是 4 月 22 日：
这是 Docusaurus 早期为了修复一个时区 bug 而[导致的](https://github.com/facebook/docusaurus/issues/4881)又一个时区 bug。

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

## 先「马」再看 {#marked-projects}

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch 领域的重要或长期项目（坑）。

### Linux {#linux}

4 月 16 日 Miguel Ojeda [发现](https://lore.kernel.org/loongarch/CANiq72mQh3O9S4umbvrKBgMMorty48UMwS01U22FR0mRyd3cyQ@mail.gmail.com/)
linux-next 的 `LLVM=1` 构建任务失败了，原因又是做重构的人忘了改 LoongArch。David Hildenbrand
[修复了](https://lore.kernel.org/loongarch/20240416144926.599101-1-david@redhat.com/)问题。

### 工具链 {#toolchain}

#### binutils {#binutils}

Jinyang He [避免了](https://sourceware.org/pipermail/binutils/2024-April/133775.html)
gas 在非代码段中产生不必要的 `ADD`/`SUB` 重定位记录对。

Lulu Cai 对链接共享目标代码（`-shared`）时使用绝对地址类重定位的错误[给出了](https://sourceware.org/pipermail/binutils/2024-April/133743.html)详细报错。

Lulu Cai 还[修复了](https://sourceware.org/pipermail/binutils/2024-April/133742.html)
BFD 链接器处理 TLS 符号时可能崩溃的问题。

#### GCC {#gcc}

Yang Yujie [实现了](https://gcc.gnu.org/pipermail/gcc-patches/2024-April/649815.html)新《工具链约定》所描述的指令集版本写法
`-march=la64v1.0`、`-march=la64v1.1`。

## 杂闻播报 {#assorted-news}

龙芯官方[发布了](https://github.com/loongson/la-asm-manual/releases/tag/release-1.0)
*Assembly Language Programming Guide for the LoongArch™ Architecture*（《LoongArch&trade;
架构汇编语言编程指南》）一书的首个正式版本 1.0。感谢 Revy（在群聊）与 jiegec（在投稿信箱）投递新闻线索！

:::info 小编评论
本书不是 2023 年由人民邮电出版社在中国大陆出版的《汇编语言编程基础 基于 LoongArch》一书的英文版。
在 xen0n 看来，《基础》一书与本书虽然在内容上有相似之处——毕竟硬件是定死的，谁来介绍指令用法都只能这么介绍——但整体叙述上更偏科普。
《基础》一书对读者的要求是「具有计算机的使用经验，具有计算机基础知识，具有一门高级语言（C、Java、Python
等）的基本编程基础知识」；相比之下，本书则「assumes that you are an
experienced assembly language developer and that you are familiar with the
`LoongArch` architecture」——「假定您是有经验的汇编语言开发者，并且熟悉 `LoongArch` 架构」。

根据 xen0n 的简单浏览，本书的英语表达仍有改进空间。虽不至影响非汉语母语者的阅读，一些简单失误（例如词性用错）也总有些扎眼。
考虑到优先以英语编撰此资料的目的显然是向国际社区播撒 LoongArch 而非中式英语的知识，
建议行有余力的同学考虑去 GitHub 帮官方做做校对。
:::

龙芯官方也[发布了](https://github.com/loongson/la-toolchain-conventions)
*Toolchain Conventions of the LoongArch™ Architecture*（《LoongArch&trade; 架构工具链约定》）的
1.1 版本。相比很久之前的 1.0 版本，主要的变化是终于新增了不与具体硬件型号相关，而仅反映架构版本的通用
`-march` 写法 `-march=la64v1.0`、`-march=la64v1.1`。

:::info 小编评论
某种程度上，这是 xen0n 在 2021 年[提出的](https://github.com/loongson/LoongArch-Documentation/pull/23#discussion_r737074800)建议终于被实现了……

此外，尽管《龙芯架构参考手册》的封面写着「V1.10」，从龙芯官网下载的此文档文件名也有个 `r1p10` 的后缀，
但从这一版规范所采用的 `-march` 写法上看，显然龙芯团队更倾向于将「1.10」理解为与[「语义化版本」](https://semver.org/lang/zh-CN/)
`1.1.0` 等效——`10` 居然是两个数。

目前开发者群体对《语义化版本》实践的接受程度普遍不错，我们自然也欢迎龙芯拥抱此最佳实践；不过如果能找个机会统一一下《手册》等等材料的封面、文件名等处的写法，那就更好了。
:::

多次见报的老面孔，来自龙芯的工具链维护者 mengqinggang
[响应了](https://github.com/loongson-community/discussions/issues/45#issuecomment-2067605329)二月份
xen0n 发布的英雄帖：为 BLAKE3 哈希算法库增加 LoongArch 向量优化。
按照 BLAKE3 仓库中的介绍，这意味着不久后包括但不限于 Bazel、IPFS、LLVM、OpenZFS、Wasmer 等知名项目都可以在
LoongArch 上将这部分计算跑得更快了。

## 张贴栏 {#bulletin}

本栏目可供张贴公益性质的各种信息。

* 您可在 GitHub [浏览](https://github.com/loongson-community/discussions/labels/%E8%8B%B1%E9%9B%84%E5%B8%96)目前所有开放的英雄帖。
* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16
