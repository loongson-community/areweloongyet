---
slug: this-week-in-loongarch-24
title: 每周一龙：第 24 期
authors: [xen0n]
date: 2023-11-13T23:50:00+08:00
tags: [每周一龙]
---

每周一都为大家报道 LoongArch&reg; 社区最前线的第一手新鲜资讯！
上周的进展主要有 Linux、工具链，以及 GSGPU 驱动向主线内核版本的移植成果。
详情点进来看！

<!-- truncate -->

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

## 先「马」再看

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch&reg; 领域的重要或长期项目（坑）。

### Linux

截至发稿时，Linux v6.7-rc1 [已经发布](https://lore.kernel.org/lkml/CAHk-=whuO0zmuxp_yorYFWdcrALpqjRPhWkmEy+7wcCnnDcPNA@mail.gmail.com/)。
龙架构的 PR 是在最后一天[发出的](https://lore.kernel.org/loongarch/20231112051248.272444-1-chenhuacai@loongson.cn/)。

:::info 为啥这次 PR 这么晚？
原因据说是先前龙芯喜欢最后时刻更新分支，导致新代码在 linux-next 躺得不够久；
于是在本周期的 PR 发出之前，那些代码就老老实实躺了 4 天。

对那些瞄准主线的代码，确实应该在 linux-next 多呆几天：
这样这些代码才有机会触及更多的测试人员和自动化设施，
有助于发现跨子系统或架构产生不良影响的那些写法。

从前，在主线之外维护龙芯内核的年代，由于外界不感知龙芯变更，龙芯公司也不测其他架构，
因而龙芯公司之外的社区集成者（例如笔者）多次遭遇了龙芯相关变更炸掉其他架构的情况。
这种情况在龙芯也渐渐转向社区协作模式之后，便渐渐消失了——龙芯影响了别人龙芯会修；相应地，别人影响了龙芯别人也会修，
而每一方都只需跑自己环境的测试即可。
:::

本开发周期中，较为引人注目的大块:儿:变更有：

* 合并了 bcachefs 的支持；
* 移除了 IA-64 架构的支持；
* 开源的 NVIDIA&reg; 显卡驱动 `nouveau` 获得了 GSP 支持。

<details>
<summary>啥叫 GSP？</summary>

GSP 是 GPU system processor 的缩写：GPU 系统处理器。

自从 2018 年面世的 Turing 微架构以来，新型号的 NVIDIA&reg; 显卡都新增了一块
RISC-V 微控制器，接管了从前由操作系统驱动控制的许多硬件资源控制职责。
这使得 NVIDIA 得以开源其内核驱动：这个驱动只剩一个 C/S 架构的客户端空壳子了。
</details>

龙架构相关的主要变更有：

* 新增了 KVM 支持（Tianrui Zhao、Bibo Mao、Huacai Chen）；
* [支持了](https://git.kernel.org/torvalds/c/80c7889de7a8246e44a9632a2b7d15b41ab3fe41)动态抢占（`PREEMPT_DYNAMIC`）（Huacai Chen）；
* 在保证正确的前提下，[适当放松了](https://git.kernel.org/torvalds/c/affef66b65889a0ea0060e13e5f7fe569897d787)原子操作的约束，
  使得 3A6000 的 8 线程 Unixbench 测试最终得分提升了 0.47%（WANG Rui）；
* 跟进了 [BPF 虚拟机指令集的 v4 新增](https://lore.kernel.org/bpf/4bfe98be-5333-1c7e-2f6d-42486c8ec039@meta.com/)，
  为龙架构[增加了](https://lore.kernel.org/loongarch/20231026184337.563801-1-hengqi.chen@gmail.com/)相应支持（Hengqi Chen）。

Phoronix 也[报道了](https://www.phoronix.com/news/Linux-6.7-rc1)此新版本，
感兴趣的读者可拓展阅读。

### 工具链

#### gcc

11 月 11 日，Xi Ruoyao [发现](https://gcc.gnu.org/bugzilla/show_bug.cgi?id=112483)一些浮点数值计算的测试用例突然开始失败了，
排查下来是架构无关的优化错误，于是第二天[发出了](https://gcc.gnu.org/pipermail/gcc-patches/2023-November/636200.html)修复补丁。
过程中，顺带还发现了原「优化」在龙架构上其实是负优化；正在与上游一同想办法解决。

:::info 花絮
在折腾这个问题过程中，Xi Ruoyao 又被[另一个新鲜问题](https://gcc.gnu.org/bugzilla/show_bug.cgi?id=112497)坑到：
是阿里的编译器工程师同行改架构无关流水线优化代码改坏了。
好在第二天 GCC 维护者发现了问题，将问题补丁 revert 掉了，
保护了很多相关人士的睡眠时间（和发量）。
:::

11 月 10 日，笔者在日常测试 Firefox 119 过程中，编译器崩溃了。
搞了一晚上，将触发问题的近 3MiB 源码[精炼成了](https://gcc.gnu.org/bugzilla/show_bug.cgi?id=112476)上游 bug PR112476。
两天后 Xi Ruoyao 将其[修复了](https://gcc.gnu.org/pipermail/gcc-patches/2023-November/636156.html)，
已[进入主线](https://gcc.gnu.org/g:b88500e0bc1e9e3a396ba764f9b701d22a76818f)。

11 月 7 日，chenxiaolong 给 GCC 补充了 LSX/LASX 的使用说明文档：

* [intrinsics](https://gcc.gnu.org/pipermail/gcc-patches/2023-November/635431.html)，
* [内联汇编的操作数修饰符](https://gcc.gnu.org/pipermail/gcc-patches/2023-November/635435.html)。

11 月 6 日（刚好错过上期），Xi Ruoyao 搞了三个补丁：

* [完善了](https://gcc.gnu.org/pipermail/gcc-patches/2023-November/635277.html)
  GCC 构建时对 linker relaxation 支持的判断：
  简单来说，如果发现搭配的汇编器不支持 relax 条件分支指令，
  那么就使即将被构建的 GCC 默认禁用 relaxation。
  这有助于规避编译大型软件时有概率遇到的烦人的「重定位溢出」错误。
  这修复了上游 bug [PR112330](https://gcc.gnu.org/bugzilla/show_bug.cgi?id=112330)。
* [优化了](https://gcc.gnu.org/pipermail/gcc-patches/2023-November/635278.html)
  `-mexplicit-relocs=auto` 配置下，仅单次使用的地址与 `fld` `fst` 搭配时的生成代码。
* [移植了](https://gcc.gnu.org/pipermail/gcc-patches/2023-November/635304.html)
  LLVM 的两组龙架构 LL/SC 代码片段优化：[第 20 期报道过的](./2023-10-16-this-week-in-loongarch-20.md#llvm)
  heiher [做的优化](https://github.com/llvm/llvm-project/pull/6739)，以及
  SixWeining 随后[做的进一步完善](https://github.com/llvm/llvm-project/pull/69339)。

Xi Ruoyao 准备赶在 GCC 14 stage 1 截止（笔者注：11 月 19 号）前加入一批 LA664 支持，
但是据卖家说 :ta: 的板子还在老化间里。
让我们期待他能早日拿到板子（当然社区同学包括笔者在内应该也会出手相助）！

本期的很大一部分 GCC 新闻都是 Xi Ruoyao 提供的，感谢 :ta: 从现场发回的报道。

#### LLVM

在[周报第 8 期](./2023-07-10-this-week-in-loongarch-8.md#llvm)笔者打算做掉
`model` 属性支持，在上游讨论确定了技术方案。
但此后现实生活因素与各种工作优先级变化叠加，使得笔者不得不弃掉此坑。
一周前 heiher [出手相助](https://github.com/loongson-community/discussions/issues/10)，
将此工作冲过了终点线。
截至发稿时，相应的 LLVM PRs 已经新鲜建立：

* [#72077](https://github.com/llvm/llvm-project/pull/72077)：扩展 LLVM IR，新增 `code_model` 全局量属性，
* [#72078](https://github.com/llvm/llvm-project/pull/72078)：为 Clang 新增 `model` 属性，
* [#72079](https://github.com/llvm/llvm-project/pull/72079)：在 LoongArch 后端利用此信息。

非常感谢！

11 月 10 日，SixWeining 报告有用户碰巧遇上了 LLD 计算 page 偏移量的一处溢出
（只有当需求的偏移量恰好是 `-4096` 才会触发），
顺手[修复了](https://github.com/llvm/llvm-project/pull/71907)。

11 月 8 日，xry111 [发现](https://github.com/llvm/llvm-project/issues/71645)
Clang 对于非位置无关的可执行文件（`-fno-pie`）所用的默认配置
`-fdirect-access-external-data` 在 LoongArch 上不能用，并且不该能用，
建议将其在 LoongArch 关掉；11 月 10 日
heiher [尝试这么做了](https://github.com/llvm/llvm-project/pull/71887)。

#### Go

10 月 16 日前后，Meidan Li [提交了](https://go.dev/cl/533716) Go 内部链接器的 `loong64` 支持；
11 月 8 日 :ta: 整体更了一版，应该达到可以测试、评审的状态了。

## 杂闻播报

北京时间 11 月 13 日清晨，由 Robin Lee 推动、实现，历时 9 个月，FreeDesktop SDK 的
`loongarch64` 最小化虚拟机的构建支持[合入上游](https://gitlab.com/freedesktop-sdk/freedesktop-sdk/-/merge_requests/11510)：
可以通过 `vm/minimal/efi.bst` 构建虚拟机系统镜像文件了。
继[周报第 20 期](./2023-10-16-this-week-in-loongarch-20.md#freedesktop-sdk-initial-support-merged)之后，
这是将 Flatpak 生态带入 LoongArch 的道路上的又一重要进展。
感谢 :ta: 自己投递的新闻线索！

11 月 6 日 systemd [发布了](https://github.com/systemd/systemd/releases/tag/v255-rc1)
v255-rc1，新增了 LoongArch64 的 seccomp 支持。
seccomp 是实现沙箱（sandbox）功能的关键基础库。
Phoronix 也[报道了](https://www.phoronix.com/news/systemd-255-rc1)此事。

## 社区整活:儿:

本栏目接受任何网友的投稿，只要内容与 LoongArch&reg; 有关，并可以为读者带来价值，
无论严肃贡献（整的大活:儿:）或是博君一笑都一概欢迎！

社区开发者 cl91 从[周报第 18 期](./2023-10-02-this-week-in-loongarch-18.md#gsgpu-for-mainline)开始憋的大招:儿:，
搞定了！
龙芯 7A2000 中的独显[^what-does-discrete-mean]模块的内核驱动 GSGPU 已经移植到了最新的 Linux v6.6。

[^what-does-discrete-mean]: 按照「集成在主板上的显卡就是集显」这个直观浅显的判断标准，当前的 GSGPU 当然不算「独显」。龙芯官方文献将 7A2000 GPU 称作「独显」的变更是某天突然发生的，且至今未明确该术语的全称；笔者个人认为这是宣传上压人一头的文字游戏，其实际含义为「独立显存」。毕竟虽然 GSGPU 仍然受限于核心面积、供电等因素而不如真正的「独立显卡」，但由于独立显存方案能够避免共享系统内存的集显方案对常规内存访问的影响，从而使得 GSGPU 确实有潜力超过这种集显的性能。（至于两种方案的真实对比，由于龙芯大概率不会做出共享显存的 GSGPU 以便控制变量，也就无从实地验证了。）

:::info cl91 的话
GSGPU 来源于龙芯公司维护的 v4.19 下游内核。
与上游内核 DRM 子系统中的 `loongson` 驱动相比，
GSGPU 内核模块增加了完整的 3D 硬件相关的控制代码，
并向用户态暴露了实现 3D 渲染必需的 GPU 缓冲区对象（buffer object）接口，
以及向 GPU 提交渲染任务的相关接口。
GSGPU 同时还实现了笔记本背光相关的控制接口，与上游 `loongson` DRM 驱动相比，
可以支持搭载 7A2000 桥片的笔记本的背光调节。

当然要实现龙芯独显的 3D 硬件加速，光内核驱动还不够，还需要用户空间的 mesa 3D 驱动。
这目前还不存在开源的实现，所以还需要社区的共同努力。
目前使用上游的用户空间驱动，配合 2D 软件渲染可以正常使用 X11 和 Wayland（当然仅限于2D）。
有兴趣的朋友，特别是在 7A2000 笔记本上使用新世界内核的朋友们可以在[这个论坛贴子](https://bbs.loongarch.org/d/303-gsgpu)找到更多详情。
:::

## 张贴栏

本栏目可供张贴公益性质的各种信息。

* 友情扩散：[安同开源社区（AOSC）][aosc]的龙架构移植主线化工作「合龙」仍在如火如荼进行中，
  此工作完成后龙架构将升格为 AOSC OS 的 Tier 1 架构。
  欢迎同学们试用、反馈，也欢迎有志之士一同加入（沟通渠道详见 AOSC 网站相关栏目）。
* 11 月 11 日，AOSC 的新一期双周报《安记冰室・十一月上》[发布了](https://github.com/AOSC-Dev/newsroom/blob/b747c8e383b40695dce1fb9d7efbb19d64991d68/coffee-break/20231111/zh_CN.md)，
  欢迎同学们阅读。An English version [is also available](https://github.com/AOSC-Dev/newsroom/blob/b747c8e383b40695dce1fb9d7efbb19d64991d68/coffee-break/20231111/en.md).
* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[aosc]: https://aosc.io
[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16
