---
slug: this-week-in-loongarch-51
title: 每周一龙：第 51 期
authors: [xen0n]
date: 2024-06-03T20:00:00+08:00
tags: [每周一龙]
draft: true  # TODO
---

每周（尽量）为大家报道 LoongArch 社区最前线的第一手新鲜资讯！
上周的进展主要有 Linux 与工具链。
详情点进来看！

<!-- truncate -->

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

## 先「马」再看 {#marked-projects}

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch 领域的重要或长期项目（坑）。

### Linux {#linux}

:::info 更正声明
关于上期周报[提到的](./2024-05-30-this-week-in-loongarch-50.md#linux) LoongArch
引导流程问题，xen0n 做了更深入的调查，认为先前对原厂做派的吐槽有失偏颇：

* FlyGoat 补丁系列中的第一条补丁，实际是修复 2 月份[另一组](https://lore.kernel.org/all/20240217010557.2381548-1-sboyd@kernel.org/)非源自
  LoongArch 社区人员的变更，未考虑 LoongArch 所导致的问题；
* 其余的补丁，所修复的场景不属于「典型」或「碰巧在这么用」的嵌入式场景：
    - 第二条补丁，修复的问题是以 FDT 流程引导启用了 NUMA 的内核。而一般都不会给嵌入式产品的内核编入
      NUMA 支持，因为常规理解的「嵌入式产品」几乎不可能涉及多路互联。
    - 第三条、第四条补丁，修复的问题都是「假定了固件已经以内核所期待的方式配好了
      DMW」。该假设在所有已知公开的、出自龙芯的固件都成立，并且在 FlyGoat 的 U-Boot 移植问世之前，没有第三方主体开发过 LoongArch 固件。这意味着虽然问题本身真实存在，但在 FlyGoat 行动之前，该问题都只停留在理论层面，且不存在能暴露该「问题」的测试环境。

因此，简单吐槽「原厂没测过就交代码」其实不妥：作为内在动机为商业性的、规模不如业内老牌大厂的参与主体，龙芯原厂只在自身传统测试环境或客户实际场景测过，就提交代码，某种程度上无可厚非。至少在提交「当下」，搭配「典型」配置，我们仍然有立场相信这些代码至少经受了基本审查。或者说，先前吐槽的重点或希望促成的改变，其实在于「原厂对变更所做的测试覆盖面应当更广」。

xen0n 在此谨向名誉可能受到影响的开发人员表达歉意。放眼未来，希望类似这样的小插曲也能成为原厂或第三方参与者使其自动化测试工作更上一层楼的契机。
:::

近期在一些第三方自动化测试项目那里，LoongArch Linux [开始](https://lore.kernel.org/loongarch/Zl5m1ZlVmGKitAof@yujie-X299/)[爆炸](https://lore.kernel.org/loongarch/ZlY1gDDPi_mNrwJ1@slm.duckdns.org/)，最后查到是先前为了支持
ORC stack unwinder 所做的 `objtool` 适配，不能处理旧版 binutils 为 `a - .`
即「与当前位置求差值」一类操作生成的重定位记录：先加再减，而非单条 `R_LARCH_{32,64}_PCREL`。此计算会被内核的
static key 机制用到。[Xi Ruoyao][xry111]
遂[增加了](https://lore.kernel.org/loongarch/20240604150741.30252-1-xry111@xry111.site/)对汇编器是否支持
`-mthin-add-sub` 选项的检查：只有汇编器支持此选项，才能避免产生 `objtool`
不支持的用法，也只有满足该前提才适合开启 ORC stack unwinder。

Hui Li [修复了](https://lore.kernel.org/loongarch/20240529013019.15235-1-lihui@loongson.cn/)
LoongArch 硬件断点的几个实现问题。

Bibo Mao 使 LoongArch KVM 对只读内存区域[跳过了](https://lore.kernel.org/loongarch/20240604121502.1985410-1-maobibo@loongson.cn/)脏页跟踪：页不会被写，就不会变脏。

Bibo Mao 还[增加了](https://lore.kernel.org/loongarch/20240604121502.1985410-1-maobibo@loongson.cn/)使得用户态虚拟机管理程序（VMM）能够将自身特性告知
KVM 的机制。从提交说明看，初期是为了让 KVM 能知道有的 VMM 的中断控制器能支持 256 个虚拟
CPU，而不像真机只能支持 4 个。

### 工具链 {#toolchain}

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

[Xi Ruoyao][xry111] 用输入为常数 0 的 `bstrins`
[优化了](https://gcc.gnu.org/pipermail/gcc-patches/2024-June/653993.html)清除低位的操作，即形如
`值 & (-1U << 常数)` 的操作。这是基于当前的龙架构 CPU 将值「复制到目标寄存器再向其插入一段
0」的成本与「构造立即数掩码再按位与」相同，且比「先右移再左移」快一倍。并且，如果源操作数与目标操作数可共享一个寄存器，那么搬运的动作也可以省略了。

[xry111]: https://github.com/xry111

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

[heiher] 还[标记了](https://github.com/llvm/llvm-project/pull/94552)一些简单指令为允许重复计算，以降低寄存器压力。有些操作的成本很低，以至于在寄存器数量有限的情况下，在需要的时候重复这些操作会比找个地方暂存它们的结果更便宜。后续，还进一步将其[标记为了](https://github.com/llvm/llvm-project/pull/94733)「跟寄存器搬运一样便宜」（`isAsCheapAsAMove`）。

[heiher] 还[增加了](https://github.com/llvm/llvm-project/pull/94590)一道优化工序（pass），将结果未被使用的指令的目标操作数重写为 0 号寄存器。这不会改变程序语义——LoongArch 明确规定了向
0 号寄存器的写入为空操作，且对复杂度低的硬件实现更加友好：考虑那些不支持寄存器重命名或者乱序执行的
LoongArch 实现，它们真的会把这些无用计算执行掉，或者傻乎乎等着这些计算完成。

[heiher] 还[允许了](https://github.com/llvm/llvm-project/pull/94723)构造地址用的伪指令可以被提取（hoist）到循环外。

[heiher]: https://github.com/heiher
[wangleiat]: https://github.com/wangleiat
[xen0n]: https://github.com/xen0n

## 杂闻播报 {#assorted-news}

由于编撰周报的工作量随着 LoongArch 生态的发展而有所增加，xen0n 不再能确保今后绝大部分，具体来说是超过
90% 的周报都落在「每周一」这个时间点发布。因此我们将把本期及今后周报的导语段落中的「每周一都」调整为「每周（尽量）」。

## 张贴栏 {#bulletin}

本栏目可供张贴公益性质的各种信息。

* 您可在 GitHub [浏览](https://github.com/loongson-community/discussions/labels/%E8%8B%B1%E9%9B%84%E5%B8%96)目前所有开放的英雄帖。
* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16
