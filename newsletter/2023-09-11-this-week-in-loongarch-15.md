---
slug: this-week-in-loongarch-15
title: 每周一龙：第 15 期
authors: [xen0n]
date: 2023-09-11T17:10:28+08:00
tags: [每周一龙]
---

每周一都为大家报道 LoongArch&reg; 社区最前线的第一手新鲜资讯！

<!-- truncate -->

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

## 先「马」再看

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch&reg; 领域的重要或长期项目（坑）。

### Linux

北京时间 9 月 11 日清晨，Linus [tagged](https://lore.kernel.org/lkml/CAHk-=wgfL1rwyvELk2VwJTtiLNpwxTFeFtStLeAQ-2rTRd34eQ@mail.gmail.com/T/#u)
Linux 6.6-rc1。
值得一提的是：Linus 在拉取、审查、合并本次的[龙架构 PR](https://lore.kernel.org/loongarch/169420324840.9132.7799052693511343279.pr-tracker-bot@kernel.org/T/#eb6a9a4343868f07c867cdbae4231a8f1f86ebed0) 时，
对其中的 KASAN 技术细节亲自给出了指导：
指出了其中沿用的一种老式代码写法之不妥，当代一般如何写；
以及两处内联声明的背后原因（这原因在龙架构上无论是否确实存在，都意味着要改代码）。
截至发稿时，Huacai Chen 已经把重构提交[贴出来](https://lore.kernel.org/loongarch/fc0f52e0-99a7-bde7-6674-9c1c579c6bc7@xen0n.name/T/#e78ae5e0fb57c26860c7c173dcc2464ba5e70a99a)了。

在此之外，Bibo Mao 在继续着他对龙架构内存管理代码的优化：
[补丁一](https://lore.kernel.org/loongarch/20230908012907.2994001-1-maobibo@loongson.cn/)、[补丁二](https://lore.kernel.org/loongarch/20230907020936.2692542-1-maobibo@loongson.cn/)。

### 工具链

#### gcc

9 月 8 日，GCC 14 最新开发版本[被发现](https://gcc.gnu.org/bugzilla/show_bug.cgi?id=111334)在编译 Mesa 时崩溃。
问题原因已找到，补丁[贴出来了](https://gcc.gnu.org/pipermail/gcc-patches/2023-September/629749.html)，等待合并。

:::info 所以问题在哪<small>儿</small>？
LoongArch&reg; v1.00 手册提到了 LA64 的 32 位除法、取模操作有坑（中文版卷一 2.2.1.13 节；英文版中没有注明该坑）：

「在 LoongArch64 位兼容的机器上，执行 `DIV.W[U]` 和 `MOD.W[U]` 指令时，
如果通用寄存器 rj 和 rk 中的数值超过了 32 位有符号数的数值范围，
则指令执行结果可以为无意义的任意值。」

这是一处 LA464 的实现细节暴露，因为其他 32 位操作都简单无视寄存器的高 32 位部分。
鉴于此，所有产生龙架构机器语言的编译器都必须做相应的特殊适配，以确保这些指令的源操作数都符合约束；
不巧 gcc 里这个变换写错了。

此外，评论区中 Lulu Cheng 透露，此乘除法操作的语义大坑已在 LA664 解决了。
笔者也在手上的 3A6000 机器证实了此事。
待多年之后，采用旧语义的处理器型号都淡出市场，就可以叫大家都停止生成这些多余的符号扩展操作了。
:::

同一天，guojie 为龙架构上 `-O1` 及更高的优化级别都[默认开启了](https://gcc.gnu.org/pipermail/gcc-patches/2023-September/629647.html)
`-fsched-pressure` 优化工序。

9 月 7 日，Xi Ruoyao 使用向量访存指令[优化了](https://gcc.gnu.org/pipermail/gcc-patches/2023-September/629618.html)开启向量支持条件下的内联内存搬运操作。

9 月 6 日，Xi Ruoyao 用伟大的 `bstrins` 指令[优化了](https://gcc.gnu.org/pipermail/gcc-patches/2023-September/629446.html)位域清空、位域替换操作。
这解决了上游 bug [PR111252](https://gcc.gnu.org/bugzilla/show_bug.cgi?id=111252)：比如
`__builtin_copysignf128`（近期添加的 128 位浮点类型支持的相关基本操作之一）编译结果十分恶劣的问题。

9 月 4 日，Yang Yujie 向 GCC 的 Ada 语言实现[添加了](https://gcc.gnu.org/pipermail/gcc-patches/2023-September/629184.html) 初步的 Linux/LoongArch 适配。

#### LLVM

9 月 8 日，Nathan Chancellor 在日常的 ClangBuiltLinux 测试中，发现 Clang
在龙架构上使用的 mcount 符号名称有误，顺手[帮忙修复了](https://github.com/llvm/llvm-project/pull/65657)。
（这似乎也是 LLVM 代码审查工作[整体转向 GitHub](https://discourse.llvm.org/t/update-on-github-pull-requests/71540)
之后的第一个龙架构相关 PR。）

#### Rust

9 月 7 日，将 LA64 裸机编译目标们提升至 Tier 2 支持级别的 MCP [进入了公示期](https://github.com/rust-lang/compiler-team/issues/664#issuecomment-1710266066)，公示期 10 天。
（这个提案是 8 月 15 号发出来的，这么久都没有反对意见，大概率之后也不会有了。9 月 17 号应该会自动通过。）

## 社区整活<small>儿</small>

本栏目接受任何网友的投稿，只要内容与 LoongArch&reg; 有关，并可以为读者带来价值，
无论严肃贡献（整的大活<small>儿</small>）或是博君一笑都一概欢迎！

（补充报道）9 月 3 日，Jiajie Chen 在 fuzz 他手头的龙架构 CPU 时，[找出了](https://github.com/loongson-community/loongarch-opcodes/issues/1)未见于公开文档的几条指令：

* 操作 8 位和 16 位的 `amswap` 与 `amadd` 补充（文档中所有的原子操作扩展指令，最小数据单位都是 32 位），以及
* 类似 `ldx` 但无视 `rk` 槽位的载入操作，这使得 `rk` 槽位的内容像是给内存子系统的什么提示。

目前暂未检查这些指令是 LA464 还是 LA664 的，但它们显然已经成为了重点关注对象 :smirk_cat:。

## 张贴栏

本栏目可供张贴公益性质的各种信息。

* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16
