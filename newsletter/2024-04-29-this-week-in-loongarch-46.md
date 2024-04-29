---
slug: this-week-in-loongarch-46
title: 每周一龙：第 46 期
authors: [xen0n]
date: 2024-04-29T21:20:00+08:00
tags: [每周一龙]
---

每周一都为大家报道 LoongArch 社区最前线的第一手新鲜资讯！
上周的进展主要有 Linux、工具链和社区同学搞的软件适配。
详情点进来看！

<!-- truncate -->

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

## 先「马」再看 {#marked-projects}

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch 领域的重要或长期项目（坑）。

### Linux {#linux}

Huacai Chen 为 v6.9-rc6 [提交了](https://lore.kernel.org/loongarch/20240426145606.981607-1-chenhuacai@loongson.cn/)一批修复，包含了上期周报[提到的](./2024-04-23-this-week-in-loongarch-45.md#linux)修复，以及一些其他修复。
此 tag 已经在主线可用，请打包同学与自行维护内核的用户查收。

Tiezhu Yang [修复了](https://lore.kernel.org/loongarch/20240428030530.24399-1-yangtiezhu@loongson.cn/T/#m227d1a834b2635b42226d8cc042e6f6ba692db54)
Linux vDSO 自我测试在 LoongArch 上的构建时与运行时错误。

Bibo Mao [移动了](https://lore.kernel.org/loongarch/20240425121443.1009824-1-maobibo@loongson.cn/)性能监测单元（PMU）的初始化动作到所有
CPU 上线之后。此补丁也在 `v6.9-rc6` tag 包含了。

Huacai Chen [修复了](https://lore.kernel.org/loongarch/20240423074322.2480319-1-chenhuacai@loongson.cn/)
`perf` 工具在 LoongArch 上无法正确追踪内核跟踪点事件（tracepoint events）的调用链的问题。
具体来讲，是补充了每个架构需要各自实现的获取当前程序计数器、栈指针、帧指针的操作。此补丁也在 `v6.9-rc6` tag 包含了。
值得一提的是：此问题与解决方法都是先前在龙芯任职的 Youling Tang 同学报告的，显然
Youling 仍然在关心 LoongArch 的前沿动态。

### 工具链 {#toolchain}

#### Binutils {#binutils}

MaskRay 对 mengqinggang 先前[提交的](https://sourceware.org/pipermail/binutils/2024-March/133132.html) `R_LARCH_ALIGN`
变更[提出了](https://sourceware.org/pipermail/binutils/2024-April/133725.html)异议：
在与其他维护者讨论并等到回复、取得共识之前，补丁作者便动手重构了架构无关部分。
从[最新讨论](https://sourceware.org/pipermail/binutils/2024-April/133751.html)可以看到：当初似乎是为了处理一些
GNU as 的奇怪行为，而引入了更多的奇怪行为，但实际上很可能不需要这么做。

#### GCC {#gcc}

Lulu Cheng 将去年 12 月进入主线的[一条修复](https://github.com/gcc-mirror/gcc/commit/4b421728289e6f1caa0dfaa953a11698ab95d37d)往回移植到了
[GCC 12](https://gcc.gnu.org/pipermail/gcc-patches/2024-April/650165.html)
与 [GCC 13](https://gcc.gnu.org/pipermail/gcc-patches/2024-April/650166.html)
分支。

[Xi Ruoyao][xry111] 在以 `-Os` 优化选项编译 Linux 时[遇到了](https://gcc.gnu.org/PR114861)一些编译器内部错误，遂为
`bstrins` 的模式匹配规则[补充了](https://gcc.gnu.org/pipermail/gcc-patches/2024-April/650077.html)缺失的约束，解决了该问题。

[xry111]: https://github.com/xry111

#### LLVM {#llvm}

[wangleiat] 为 LLVM 增加了 TLS 描述符（TLSDESC）的代码生成支持：

* [新增](https://github.com/llvm/llvm-project/pull/90158) `la.tls.desc` 伪指令的解析与相关基础定义；
* 为 LLVM 后端与 Clang [增加支持](https://github.com/llvm/llvm-project/pull/90159)。

[wangleiat]: https://github.com/wangleiat

## 社区整活:儿: {#grins}

本栏目接受任何网友的投稿，只要内容与 LoongArch 有关，并可以为读者带来价值，
无论严肃贡献（整的大活:儿:）或是博君一笑都一概欢迎！

### ROCm 5.7 & 6.0 现已在 LoongArch 可用！ {#rocm-5.7-6.0-now-available-on-loongarch}

日前 [Xinmudotmoe] 在 LoongArch 上调通了 ROCm 5.7 与 6.0。Xinmu 说：

ROCm 5.7 与 6.0 的移植脚本[已经完成](https://github.com/loongarch-moe/rocm-loongarch)：在
3A6000 + RX6800 硬件环境、16K 页大小下，可以运行 Stable Diffusion 了（[演示视频](https://www.bilibili.com/video/BV1az421y75z)）。
移植脚本的开源许可证为 CC0。

:::info 注意
在中国大陆法域，根据《中华人民共和国著作权法》第十条，署名权不可被转让或放弃。因此，CC0
此时等价于 CC-BY；理论上，受中国《著作权法》管辖的使用者仍需尊重原作者的署名权。

（但：周报编者不是律师，此讨论不构成法律建议。）
:::

移植过程中，发现 ROCm 子工程 ROCT-Thunk-Interface 需要适配 &gt;4K 的页，[补丁](https://github.com/ROCm/ROCT-Thunk-Interface/pull/100)
将在 ROCm 6.2 合并。LoongArch 与其他可选非 4K 页的架构同等从中受益。

移植脚本中各项必要补丁，需要英雄们维护、迁移到最新版本，并争取主线化；若补丁修改自移植脚本，无需署名[我][Xinmudotmoe]。

:::info 原作者注
仅新世界，脚本基于 Loong Arch Linux，测试环境为 Gentoo，但原则上不限制发行版。
:::

[Xinmudotmoe]: https://github.com/Xinmudotmoe

### Sagemath 也在适配中了 {#sagemath-being-ported-to-loongarch}

日前网友 [lwzhenglittle] [发布了](https://github.com/loongson-community/discussions/issues/53)请求适配知名开源数学工具包
Sagemath 的英雄帖。令人倍感意外的是：此帖马上就被发布者本人揭下了！
感兴趣的同学可以去英雄帖下围观工作进度。

[lwzhenglittle]: https://github.com/lwzhenglittle

## 张贴栏 {#bulletin}

本栏目可供张贴公益性质的各种信息。

* 您可在 GitHub [浏览](https://github.com/loongson-community/discussions/labels/%E8%8B%B1%E9%9B%84%E5%B8%96)目前所有开放的英雄帖。
* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16
