---
slug: this-week-in-loongarch-51
title: 每周一龙：第 51 期
authors: [xen0n]
date: 2024-06-03T20:00:00+08:00
tags: [每周一龙]
draft: true  # TODO
---

每周一都为大家报道 LoongArch 社区最前线的第一手新鲜资讯！
上周的进展主要有 TODO。
详情点进来看！

<!-- truncate -->

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

## 先「马」再看 {#marked-projects}

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch 领域的重要或长期项目（坑）。

### Linux {#linux}

TODO

### 工具链 {#toolchain}

#### ABI {#abi}

TODO

#### binutils {#binutils}

Lulu Cai 为 LoongArch 汇编语言[增加了](https://sourceware.org/pipermail/binutils/2024-May/134440.html)
`.option` 指示（directive）支持，用于对局部某段代码单独调整个别汇编器配置，以实现特殊效果。初期支持的是
linker relaxation 的开关。

:::info 对比记忆
在 RISC-V 汇编中，也用 `.option` 做此类临时调整；而在 MIPS 汇编中，则用 `.set`。
:::

为方便学习，特在此附上补丁中的示例代码片段，已对其中的 `.option` 用法作出注释。

<details>
<summary>示例代码片段</summary>

```asmloong
    .text
1:
    // 将当前的汇编器配置入栈
    .option push

    // 现在 linker relaxation 一定处于禁用状态
    // s 是被指向的符号
    .option norelax
    lu12i.w $t0, %le_hi20(s)       // R_LARCH_TLS_LE_HI20
    addi.d  $t0, $t0, %le_lo12(s)  // R_LARCH_TLS_LE_LO12

    // 现在 linker relaxation 一定处于启用状态
    .option relax
    lu12i.w $t0, %le_hi20(s)       // R_LARCH_TLS_LE_HI20_R
    addi.d  $t0, $t0, %le_lo12(s)  // R_LARCH_TLS_LE_LO12_R

    // 恢复先前的汇编器配置
    // 现在 linker relaxation 的开关状态重新取决于 as 的命令行参数
    .option pop
```

</details>

#### GCC {#gcc}

TODO

#### LLVM {#llvm}

[wangleiat] 为 LLD [实现了](https://github.com/llvm/llvm-project/pull/94451)基本的
TLS 描述符（TLSDESC）支持。

[xen0n] 在浏览 LLVM LoongArch 工单（以便撰写本期周报）时，发现 Rust 和 Zig 都开始利用 16
位浮点数了，而 LoongArch 后端面对此数据类型[会崩溃](https://github.com/llvm/llvm-project/issues/93894)；顺手将其[修复了](https://github.com/llvm/llvm-project/pull/94456)。

[heiher] [允许了](https://github.com/llvm/llvm-project/pull/93814) LoongArch
后端将 32 位整型 `i32` 也视作原生支持的合法类型。这将使 LLVM 能够更充分地利用 LoongArch 的
`*.w` 系列的 32 位操作：而这正是
heiher 在另一组变更中[所做的](https://github.com/llvm/llvm-project/pull/93811)。

[heiher] 还为 LoongArch 后端[实现了](https://github.com/llvm/llvm-project/pull/93813)
LLVM `TargetLowering` 的公共钩子 `signExtendConstant`，使 LLVM IR phi 节点的 `i32`
常量操作数也能先变为符号扩展形式再被实例化（materialize）——否则默认是零扩展的，从而让生成的指令序列更短。

[heiher]: https://github.com/heiher
[wangleiat]: https://github.com/wangleiat
[xen0n]: https://github.com/xen0n

## 杂闻播报 {#assorted-news}

TODO

## 社区整活:儿: {#grins}

本栏目接受任何网友的投稿，只要内容与 LoongArch 有关，并可以为读者带来价值，
无论严肃贡献（整的大活:儿:）或是博君一笑都一概欢迎！

TODO

## 张贴栏 {#bulletin}

本栏目可供张贴公益性质的各种信息。

* 您可在 GitHub [浏览](https://github.com/loongson-community/discussions/labels/%E8%8B%B1%E9%9B%84%E5%B8%96)目前所有开放的英雄帖。
* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16
