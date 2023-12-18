---
slug: this-week-in-loongarch-16
title: 每周一龙：第 16 期
authors: [xen0n]
date: 2023-09-18T13:37:25+08:00
tags: [每周一龙]
---

每周一都为大家报道 LoongArch&reg; 社区最前线的第一手新鲜资讯！

<!-- truncate -->

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

## 先「马」再看

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch&reg; 领域的重要或长期项目（坑）。

### Linux

LoongArch <ruby>KVM<rt>内核虚拟机</rt></ruby> 的代码仍然在改，目前改到
[v21](https://lore.kernel.org/loongarch/20230915014949.1222777-1-zhaotianrui@loongson.cn/)
了。

### 工具链

#### gcc

上周提到的除法、取余处理修复
（bug [PR111334](https://gcc.gnu.org/bugzilla/show_bug.cgi?id=111334)）
已经[推入主线了](https://gcc.gnu.org/pipermail/gcc-patches/2023-September/630223.html)。
一同推入的还有
[LSX](https://gcc.gnu.org/pipermail/gcc-patches/2023-September/630221.html)、[LASX](https://gcc.gnu.org/pipermail/gcc-patches/2023-September/630222.html)
的测试用例。

此外 Lulu Cheng 还：

* 将默认的分支跳转成本从 2 [提升到了](https://gcc.gnu.org/pipermail/gcc-patches/2023-September/630285.html) 6，
* [优化了](https://gcc.gnu.org/pipermail/gcc-patches/2023-September/630481.html)浮点条件搬运操作，
* [移除了](https://gcc.gnu.org/pipermail/gcc-patches/2023-September/630486.html)多余的对齐动作（会导致最终生成的代码反而不满足对齐要求）。

隔壁 binutils 组的 mengqinggang 也来[调整了](https://gcc.gnu.org/pipermail/gcc-patches/2023-September/630653.html)优化器成本模型一处：
据说有利于寄存器压力较大情况下的循环优化，但没测试用例（应该在补了）。

#### LLVM

关注到 7 月底 Rust 社区的同学[来报](https://github.com/llvm/llvm-project/issues/64208)
`llvm.maximum.*` 和 `llvm.minimum.*` 两种 intrinsics 没有实现的问题，至今未能排上议事日程；
有兴趣水一两个补丁的同学可以去看看。

:::info
实现起来应该比较简单：x86 或者 RISC-V 的实现均可借鉴。

LoongArch 的 `fmax` `fmin` 指令，在真机上观察其语义，似乎与要的一致（请务必自己也做实验尝试：笔者只检查了正负零的大小比较）。
但请十分注意：龙架构手册上对此两条指令的描述是「遵循 IEEE 754-2008」，
而两条 LLVM intrinsics 的语义是遵循「IEEE 754-2008 的**草稿版本**」。
笔者检查了正式版的 IEEE 754-2008（使用搜索引擎应能很方便免费获取）：
其 Section 5.3.1 确实不再提及 LLVM intrinsics 要求的正负零语义。
因此你在实现的时候大概率也要参考 x86、RISC-V 后端的做法，确保规范外语义得到正确处理之后，才能调用这俩指令。
:::

## 杂闻播报

上周似乎是创刊以来最安静的一周，各个社区都没有什么大新闻。
当然，这也可能仅仅是笔者未能关注到：这便是为何[群众投稿][call-for-submissions]如此必要了。

## 张贴栏

本栏目可供张贴公益性质的各种信息。

* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16
