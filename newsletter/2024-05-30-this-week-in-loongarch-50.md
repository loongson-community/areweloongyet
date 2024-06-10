---
slug: this-week-in-loongarch-50
title: 每周一龙：第 50 期
authors: [xen0n]
date: 2024-05-30T22:20:00+08:00
tags: [每周一龙]
---

每周一都为大家报道 LoongArch 社区最前线的第一手新鲜资讯！
上周的进展主要有 Linux、工具链、发行版生态和 AI 生态。
详情点进来看！

<!-- truncate -->

本期周报的实际发稿时间是周四晚间，因为 xen0n 周三才把家里网修好。

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

## 先「马」再看 {#marked-projects}

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch 领域的重要或长期项目（坑）。

### Linux {#linux}

龙芯社区的老朋友 [FlyGoat] 回归了 LoongArch 开发：[移植了](https://lists.denx.de/pipermail/u-boot/2024-May/554168.html)
U-Boot 到 LoongArch，还顺带修复了 Linux 与 QEMU 的 FDT 引导流程问题。

* QEMU 构造 FDT 时，[没传递](https://patchwork.ozlabs.org/project/qemu-devel/patch/20240520-loongarch-fdt-memnode-v1-1-5ea9be93911e@flygoat.com/)内存映射记录的高 32 位；
* Linux 一侧也有[一坨低级失误](https://lore.kernel.org/loongarch/20240522-loongarch-booting-fixes-v3-0-25e77a8fc86e@flygoat.com/)。

:::warning 更正声明
我们发现下文的「小编评论」基于的部分论据缺乏考证。新一期周报对此[进行了](./2024-06-03-this-week-in-loongarch-51.md#linux)更正，并对名誉可能受到影响的原厂开发者表达了歉意。
:::

:::info 小编评论
出问题的代码，显然没测过就提交了；当初审查代码的开发者显然信任了补丁作者会自测，因此也放松了神经。今后连原厂的内部质量保障都不能信任了吗……

而如果放下情绪，我们也能意识到，这像是龙芯近年来「不曾开源其 U-Boot 或 PMON 移植成果」的后续必然发展。

不开源或公开提供 FDT 固件，在商业策略上或许无可厚非，因为连 UEFI 都承载不起的系统一定是嵌入式小系统，背后的需求方也一定是企业。在
FlyGoat 制作此 U-Boot 移植之前，所有能从公开渠道获取的 LoongArch 固件都是 UEFI 的，即便需求方有能力自行适配，也无法支持这些系统。
这样一来，想驱动板子只能选用 FDT 固件，想用 FDT 固件只能给钱：反正您是企业，总不至于掏不起吧！

然而，这也自然会导致各路第三方人员、自动化设施无从测试 FDT 场景，进而让相关代码年久失修。维护者们面对这种代码，也只能绷紧业已衰弱的神经：无条件信任补丁作者的后果已经体现了，**即便补丁出自原厂业务部门**。

好在，这一切很快就要结束了。
:::

ClangBuiltLinux 维护者 Nathan Chancellor
[修复了](https://lore.kernel.org/loongarch/20240522-efi-zboot-lds-add-discard-sections-to-discard-v1-1-6b415efa0f85@kernel.org/)使用
LLVM 构建 `CONFIG_UNWINDER_ORC=y` 这一内核配置时，该被丢弃的 ELF 节（section）没被丢弃，而导致的链接失败。

[FlyGoat]: https://github.com/FlyGoat

### 工具链 {#toolchain}

#### binutils {#binutils}

Alan Modra 帮忙[清理了](https://sourceware.org/pipermail/binutils/2024-May/134286.html)
GAS 的一条 LoongArch 测试用例中多余的断言内容：被断言的内容实质上是数据，因此没有必要检查反汇编输出中它们对应的「指令」。

mengqinggang [修复了](https://sourceware.org/pipermail/binutils/2024-May/134285.html)
BFD 链接器在 `-z separate-code` 的情况下，可能发生的 relaxation 溢出问题。

#### GCC {#gcc}

[Xi Ruoyao][xry111] [修复了](https://gcc.gnu.org/pipermail/gcc-patches/2024-May/652419.html)
Gentoo 社区贡献者 [matoro] [发现的](https://gcc.gnu.org/PR115169)编译器内部错误。

[matoro]: https://github.com/matoro
[xry111]: https://github.com/xry111

#### glibc {#glibc}

[Xi Ruoyao][xry111] [修复了](https://sourceware.org/git/?p=glibc.git;a=commitdiff;h=0c1d2c277a59f08fd3232b33d18644ea890190ea)用到
`_FPU_{G,S}ETCW` 的用户代码不能被 Clang 编译的问题：曾经的 LoongArch 汇编语法要求将
FCSR 当作 GPR 称呼，例如用 `$r0` 称呼 `$fcsr0`；该用法值得商榷，从 binutils 2.41
开始即被修复：支持了 `$fcsrX` 这一正确表达方式，LLVM 则自始不支持该用法。
考虑到当前 glibc 所要求的最低 binutils 版本已经来到了 2.41，直接修复 glibc 中的老旧写法最为方便、优雅。

5 月 15 日，caiyinyu [合并了](https://sourceware.org/git/?p=glibc.git;a=commit;h=1dbf2bef7934cee9829d875f11968d6ff1fee77f)
mengqinggang 等人完成的 LoongArch TLS 描述符（TLSDESC）支持。这意味着 8 月 1 日
glibc 2.40 正式发布后，打包人们可以开始集成 TLSDESC 特性了，这对 LoongArch 的
TLS 访问性能是长远利好。

#### LLVM {#llvm}

近日，许多仍在使用 LLVM/Clang 17 的用户，前来报告崩溃，例如[此 LLVM issue](https://github.com/llvm/llvm-project/issues/93372)与[此 Gentoo bug](https://bugs.gentoo.org/929197)。
这是由于使用了会默认启用 SIMD 代码生成的 `march` 选项，如 `la464` 或 `native`，而
LLVM 17 的 LoongArch SIMD 代码生成支持并不完善，而导致的。

大致有以下几种解决方案：

* 升级到 LLVM 18 或更高的版本；
* 如暂时不方便升级，可以：
    * 换一个要求更低的 `march`，如 `loongarch64` 或 `generic`；或者
    * 设法在初始化 LLVM 代码生成器时，在目标属性（target attributes）中传递 `-lsx,-lasx` 的要素。

:::info 请注意
向 Clang 传递 `-mno-lsx -mno-lasx` 的「解法」并不成立，因为此选项从 Clang 18
才[开始得到支持](https://github.com/llvm/llvm-project/commit/8d4e35600f3ba90997a59fdb9baeb196e723eec9)，而一旦升级到
Clang 18，您就不需要禁用 SIMD 了。
:::

[Jinyang He][MQ-mengqing] 继续跟进 LoongArch ELF psABI v2.30 工作，[更新了](https://github.com/llvm/llvm-project/pull/93775)
LLD 与 LLVM MC 对 `R_LARCH_ALIGN` 的处理方式：只要能使用绝对数值（此版本 psABI
所新增支持的 `.align` 表达式的第三参数）作为某 `R_LARCH_ALIGN` 的目标，就不使用符号。

关于上期周报[报道的](./2024-05-20-this-week-in-loongarch-49.md#llvm)开源鸿蒙（OHOS）想用模拟
TLS（emulated TLS）的情况，[SixWeining] [分享了](https://github.com/llvm/llvm-project/pull/92483#issuecomment-2128303438)最新进展：部分
OHOS 服务用到了协程（coroutines），而**据说** OHOS 目前的协程实现依赖了模拟 TLS，而非各架构原生的 ELF TLS。此外，**据说**
OHOS 未来也将摈弃模拟 TLS，而切换到 ELF TLS。熟悉 OHOS、有意帮忙推进该事项的读者朋友们：可以开始外交工作了。

[SixWeining]: https://github.com/SixWeining

#### Rust {#rust}

[heiher] [正式提议](https://github.com/rust-lang/compiler-team/issues/753)将
LoongArch64 Linux musl target &mdash; `loongarch64-unknown-linux-musl` 升格为
<ruby>Tier 2 with Host Tools<rt>带宿主工具的二级架构</rt></ruby>。目前该 MCP
已经进入为期 10 天的公示期。一切顺利的话，该 MCP 将于 6 月 7 日通过。

[heiher]: https://github.com/heiher

## 杂闻播报 {#assorted-news}

[heiher] 为一款高性能、面向机器学习场景优化的列存储数据格式 Lance
[增加了](https://github.com/lancedb/lance/pull/2406) LoongArch 支持与 SIMD 优化。

### 多种发行版的 LoongArch 工作进展顺利 {#multiple-distros-loongarch-ports-enjoy-nice-progress}

据网友 [LinuxResearcher] 报道：龙蜥操作系统（Anolis OS）23.1 [正式发布了](https://gitee.com/anolis/rnotes/blob/master/anolis/rnotes/anolis-23.1-ga.md)，这是其首个适配
LoongArch 新世界的版本。您可于[龙蜥官方镜像源](https://mirrors.openanolis.cn/anolis/23/isos/GA/loongarch64/)获取适合您的安装介质或虚拟机磁盘镜像。

:::info 怎么记得之前就支持了？
实际上，Anolis OS 8.8 与 8.9 也有 LoongArch 支持，不过是旧世界。

Anolis OS 23.1 **未提供**旧世界兼容性：标志性的 `/lib64/ld.so.1` 入口点——详见[本站阅读材料](/docs/world-compat-details/#程序解释器)，任何旧世界兼容方案都必然会提供，而我们至少在
Anolis OS 23.1 的安装介质上没有观测到。考虑到出于种种原因而永远无法迁移到新世界的商业软件可能已经存在，我们预计
Anolis OS 仍将在未来以某种方式提供旧世界兼容性——至少是可选安装的。
:::

继第 47 期周报[报道的](./2024-05-07-this-week-in-loongarch-47/index.md#openwrt-loongarch64-port-mainlined)
OpenWrt「合龙」工作完成之后，网友 [YanBin][plum930] 注意到：OpenWrt
上游开始为 LoongArch 自动化构建软件包了，一些包的成品在 OpenWrt
官方源[已经可见](https://downloads.openwrt.org/snapshots/targets/loongarch64/generic/)。

[xen0n] 终于花了足够多的时间，重新构建出了 Gentoo 安装介质；此工作将很快合入上游。

[LinuxResearcher]: https://github.com/LinuxResearcher
[plum930]: https://github.com/plum930
[xen0n]: https://github.com/xen0n

## 社区整活:儿: {#grins}

本栏目接受任何网友的投稿，只要内容与 LoongArch 有关，并可以为读者带来价值，
无论严肃贡献（整的大活:儿:）或是博君一笑都一概欢迎！

### 且听「龙」吟：Ollama 在龙架构首度可用！ {#llm-meets-loong-ollama-now-works-on-loongarch}

近日，在多名社区贡献者的努力下，知名的开源大语言模型本地驱动器 Ollama 在
LoongArch 上运行的全链路被打通了。大语言模型的输出首度由「龙」之口吟唱：

* 三名龙芯员工 [zhaojunchao](https://github.com/junchao-loongson)、[lixing](https://github.com/lixing-star)
  与 [Jinyang He][MQ-mengqing] 为实际执行推理运算的 llama.cpp
  项目[增加了](https://github.com/ggerganov/llama.cpp/pull/6454)使用
  LSX 与 LASX 的加速代码。
* [猴哥][HougeLangley] 将 Ollama 在 LoongArch 上[构建起来了](https://github.com/HougeLangley/ollama-loongarch64)，并[知会了](https://github.com/ollama/ollama/issues/4552)上游。

猴哥[录制了](https://www.bilibili.com/video/BV1wf421R7Zx/)
Ollama 在 LoongArch 上成功运行的演示视频。

我们相信，随着时间推移，更多的科学计算、深度学习基础组件将在 LoongArch 可用、好用；在不久的将来，
也将涌现更高互联性能的 LoongArch 硬件平台。在 LoongArch 生态中，无论是作为希望蹭到
AIGC 热度而得以圈钱的企业参与者，还是作为日益接近甚至依赖 AI 的开发者或最终用户，相信所有人都乐见这样的未来。

[HougeLangley]: https://github.com/HougeLangley
[MQ-mengqing]: https://github.com/MQ-mengqing

## 张贴栏 {#bulletin}

本栏目可供张贴公益性质的各种信息。

* 您可在 GitHub [浏览](https://github.com/loongson-community/discussions/labels/%E8%8B%B1%E9%9B%84%E5%B8%96)目前所有开放的英雄帖。
* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16
