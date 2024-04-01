---
slug: this-week-in-loongarch-43
title: 每周一龙：第 43 期
authors: [xen0n]
date: 2024-04-01T23:30:00+08:00
tags: [每周一龙]
---

每周一都为大家报道 LoongArch 社区最前线的第一手新鲜资讯！
上周的进展主要有 Linux、工具链与各种打包工作。
详情点进来看！

<!-- truncate -->

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

## 先「马」再看 {#marked-projects}

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch 领域的重要或长期项目（坑）。

### Linux {#linux}

Baoquan He 帮忙[清理了](https://lore.kernel.org/loongarch/20240329132825.1102459-2-bhe@redhat.com/)与内核崩溃转储（`CRASH_CORE`）功能相关的重构遗留：先前的重构人忘记改 LoongArch 了。

Binbin Zhou 为 2K0500 与 2K2000 [增加了](https://lore.kernel.org/loongarch/cover.1711504700.git.zhoubinbin@loongson.cn/)时钟源驱动，目前迭代到了第 2 版。

Guenter Roeck 在测试中[发现了](https://lore.kernel.org/loongarch/c352829b-ed75-4ffd-af6e-0ea754e1bf3d@roeck-us.net/)同时开启
`CONFIG_KFENCE` 与 `CONFIG_DEBUG_SG` 时会触发 `BUG` 条件。这与从 2023 年末就一直困扰社区同学们的[神秘崩溃](https://github.com/loongson-community/discussions/issues/34)有相似之处：都涉及了
KFENCE 机制；Guenter 与 Huacai 都做了修复尝试，但问题在 xen0n 和 heiher 的电脑上依旧存在。目前龙芯与社区同学都在研究该问题了；本周报也将持续追踪报道，直至问题解决。

Xi Ruoyao 发现了两个符号应当被选择却没有，帮忙补上了：

* [`ARCH_SUPPORTS_INT128`](https://lore.kernel.org/loongarch/20240327171737.27622-1-xry111@xry111.site/)：大大提高 128 位整数操作性能；
* [`ARCH_HAS_FAST_MULTIPLIER`](https://lore.kernel.org/loongarch/20240327171807.27741-1-xry111@xry111.site/)：LoongArch 的乘法操作没那么慢，可以用上，提高性能。

### 工具链 {#toolchain}

#### binutils {#binutils}

mengqinggang [修复了](https://sourceware.org/pipermail/binutils/2024-March/133239.html)
gas，使其无视位于一节（section）起始位置的 `.align` 指示，如果节的对齐程度等于或高于该指示的要求。

Lulu Cai [修复了](https://sourceware.org/pipermail/binutils/2024-March/133223.html)
TLS GD、IE 访问操作可能会产生不必要的动态重定位记录的问题。

#### GCC {#gcc}

Yang Yujie [重构了](https://gcc.gnu.org/pipermail/gcc-patches/2024-March/648580.html)
LoongArch 编译选项的处理，将大函数拆小，并挪了个位置。

Lulu Cheng [补充了](https://gcc.gnu.org/pipermail/gcc-patches/2024-March/648578.html)
`-mfrecipe` `-mdiv32` `-mlam-bh` `-mlamcas` 与 `-mld-seq-sa` 编译选项的文档。

上游 bug [PR113233](https://gcc.gnu.org/PR113233)：链接 LTO
目标代码时不尊重原编译单元所用的编译参数，在 GCC 12、13、14 三个分支都已被修复。
其中，Yang Yujie [修复了](https://gcc.gnu.org/g:ea2a9c76a1dcffbbec6e53655bef9236d3a8e691)主线，而
Lulu Cheng 做了往回移植（backport）：[GCC 13](https://gcc.gnu.org/g:4736b317047ae6b04f7609843f21cb68fef6a0c1)、[GCC 12](https://gcc.gnu.org/g:bf0b32d7929f8b4b15b21658d572b89ded03d8f8)。

## 杂闻播报 {#assorted-news}

xen0n 将 Gentoo `gentoo-zh` overlay 的 libLoL
[升级到了](https://github.com/microcai/gentoo-zh/pull/4457)上游最新测试版本 `0.1.5_pre6`。
您可[移步](https://liblol.aosc.io) libLoL 项目页面，阅读安装使用说明。

## 社区整活:儿: {#grins}

本栏目接受任何网友的投稿，只要内容与 LoongArch 有关，并可以为读者带来价值，
无论严肃贡献（整的大活:儿:）或是博君一笑都一概欢迎！

[北京大学 Linux 俱乐部](https://github.com/lcpu-club)（LCPU）为 LoongArch
新世界生态[搭建了](https://loongcr.lcpu.dev)容器镜像站，目前提供干净的基础镜像：

* Debian (`lcpu/debian`)
* Arch Linux (`lcpu/archlinux`)

欢迎大家分享各种应用的容器镜像，并在[这个仓库](https://github.com/lcpu-club/loong64-dockerfiles)分享构建脚本。

感谢 [leavelet] 的投稿！

[leavelet]: https://github.com/leavelet

## 张贴栏 {#bulletin}

本栏目可供张贴公益性质的各种信息。

* xry111 [张贴了](https://github.com/loongson-community/discussions/issues/51)新的英雄帖：向 Linux `objtool` 增加跳表（jump tables）与松弛（relaxation）支持，以便开启 ORC unwinder 不用以禁用此两项优化为代价。
* 您可在 GitHub [浏览](https://github.com/loongson-community/discussions/labels/%E8%8B%B1%E9%9B%84%E5%B8%96)目前所有开放的英雄帖。
* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16
