---
slug: this-week-in-loongarch-46
title: 每周一龙：第 46 期
authors: [xen0n]
date: 2024-04-29T19:00:00+08:00
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

#### ABI {#abi}

TODO

#### binutils {#binutils}

TODO

#### GCC {#gcc}

TODO

#### LLVM {#llvm}

TODO

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
