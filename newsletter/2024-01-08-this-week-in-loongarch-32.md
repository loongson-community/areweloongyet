---
slug: this-week-in-loongarch-32
title: 每周一龙：第 32 期
authors: [xen0n]
date: 2024-01-08T00:00:00+08:00
tags: [每周一龙]
draft: true  # TODO
---

每周一都为大家报道 LoongArch&reg; 社区最前线的第一手新鲜资讯！
上周的进展主要有 TODO。
详情点进来看！

<!-- truncate -->

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

## 先「马」再看 {#marked-projects}

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch&reg; 领域的重要或长期项目（坑）。

### Linux {#linux}

[heiher] [完成了](https://github.com/ClangBuiltLinux/linux/issues/1884#issuecomment-1879564435)
ClangBuiltLinux 的模块（`CONFIG_MODULES`）支持。
至此 LLVM/Clang 工具链已经可以用来构建全功能的 LoongArch Linux 了。

heiher 还为 Linux 的 Rust 基础设施[提交了](https://lore.kernel.org/rust-for-linux/20240106065941.180796-1-wangrui@loongson.cn/)
LoongArch 支持。
很快就可用 Rust 这一新兴编程语言，为 LoongArch 这一新兴架构做内核、驱动开发了！

Bibo Mao [继续优化](https://lore.kernel.org/loongarch/20240108064056.232546-1-maobibo@loongson.cn/)
LoongArch KVM 性能：
以协助虚拟化（para-virtualization）方式，通过 `hvcl` 指令，
加速虚拟机的处理器间中断（inter-processor interrupts，IPI）处理。
改过之后，16 核的虚拟机中 UnixBench 多核跑分达到了物理机情形的 98.8%（但作者未给出改过之前的性能开销情况）。

<details>
<summary>`hvcl` 是啥意思？</summary>

从用法上看，`hvcl` 是 `HyperVisor CaLl` 的缩写，「监管调用」的意思：向虚拟机管理器（VM hypervisor）请求些什么。

这样一来，可能有的读者会琢磨了：为啥不像 `syscall` 一样，叫一个长一点但更完整的名字呢？
作为一个能够对最常用指令之一却取到 `pcaddu12i` 这样长的名字保持容忍的架构，
显然 `hypcall` 这种名字更达意，并且与常用指令 `syscall` 风格一致。
实则不然：在 `dbcl`（`DeBugger CaLl`，调试器调用；用来将下位机 CPU 放入调试模式）与 `hvcl` 之间，
`syscall` 反倒成了「异类」！

为了降低学习者的记忆负担，笔者以为命名上如果能做到一致，可能更加友好：
要么将 `dbcl` 与 `hvcl` 改成更达意的 `dbgcall` 与 `hypcall`，
要么将 `syscall` 改成更简练的 `sycl` 或 `sscl` 之类。
考虑到 `syscall` 是个常见单词了，不用背，那么前一种改法可能更受欢迎。
汇编代码的兼容性不会受影响，因为先前的名称一时半会:儿:不会被移除支持。

</details>

[heiher]: https://github.com/heiher

### 工具链 {#toolchain}

#### ABI {#abi}

TODO

#### binutils {#binutils}

TODO

#### GCC {#gcc}

TODO

#### LLVM {#llvm}

TODO

## 杂闻播报 {#assorted-news}

[xen0n] 向 gentoo-zh overlay [推入了](https://github.com/microcai/gentoo-zh/pull/4109)
AOSC OS 的 liblol 新旧世界兼容解决方案打包。
此 overlay 包含华语用户圈子常用的许多软件；
后续 Gentoo 用户们也能用相同姿势安装 WPS Office 等旧世界闭源软件了。
例如：只要 `emerge wps-office` 即可自动拉入 liblol 及其内核模块。

:::info 注意事项
目前 liblol 提供的依赖库主要都来自 Loongnix&reg;，
因此在我们完成审计这些来自 Loongnix 的文件的开源许可、并确认其中不含闭源或专有内容之前，
您都需要明确接受《基础版 Loongnix 操作系统最终用户许可协议》，才能安装 liblol：

```
# e.g. /etc/portage/package.license/liblol
app-emulation/liblol Loongnix-Base-EULA
```

此外，首次安装 `la_ow_syscall` 内核模块之后，该模块不会被自动载入——在 Gentoo
我们一般不帮用户做这种事，而代之以 `emerge` 结束后的温馨提醒。
在安装完 liblol 后、使用旧世界软件前，
您可以简单重启系统，或者以 `root` 身份 `modprobe la_ow_syscall`：
只需执行这一次即可，后续每次系统启动时都会自动加载了。
:::

<details>
<summary>致打包人们</summary>

对旧世界软件包的标记方式是 `RDEPEND` 中的 `loong? ( virtual/loong-ow-compat )`
表达式。

需要注意：旧世界程序的动态链接依赖都是基于 liblol sysroot（`/opt/lol`）解析的，
而与宿主系统 libdir 无关。
这与 Gentoo 当下的 multilib 方案不同，反倒与几年前的 `emul-linux-x86-*` 大包神似；
因此大部分情况下，意在满足动态链接依赖的 `RDEPEND` 项，都不应当对 `loong` 适用。

打包人们可参考 [WPS Office 的打包做法](https://github.com/microcai/gentoo-zh/pull/4112)，
为其他旧世界软件打包。
提交前，记得简单测下软件功能：
如果 liblol sysroot 里缺依赖，可以[去 liblol 上游报告](https://github.com/shankerwangmiao/liblol/issues)。

后续，此打包工作（尤其是起到标记作用的 virtual 包）将进一步上游至 Gentoo 主源；
这将在 liblol 的 license 审计工作完成之后进行。

</details>

[xen0n]: https://github.com/xen0n

## 社区整活:儿: {#grins}

本栏目接受任何网友的投稿，只要内容与 LoongArch&reg; 有关，并可以为读者带来价值，
无论严肃贡献（整的大活:儿:）或是博君一笑都一概欢迎！

TODO

## 张贴栏 {#bulletin}

本栏目可供张贴公益性质的各种信息。

* 友情扩散：[安同开源社区（AOSC）][aosc]的龙架构移植主线化工作「合龙」仍在如火如荼进行中，
  此工作完成后龙架构将升格为 AOSC OS 的 Tier 1 架构。
  欢迎同学们试用、反馈，也欢迎有志之士一同加入（沟通渠道详见 AOSC 网站相关栏目）。
* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[aosc]: https://aosc.io
[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16
