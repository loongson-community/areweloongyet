---
slug: this-week-in-loongarch-34
title: 每周一龙：第 34 期
authors: [xen0n]
date: 2024-01-29T19:10:00+08:00
tags: [每周一龙]
---

每周一都为大家报道 LoongArch&reg; 社区最前线的第一手新鲜资讯！
上周的进展主要有工具链。
详情点进来看！

<!-- truncate -->

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

## 先「马」再看 {#marked-projects}

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch&reg; 领域的重要或长期项目（坑）。

### Linux {#linux}

上期[提到的](../2024-01-24-these-weeks-in-loongarch-33.md#linux) LoongArch KVM
构建错误修复，已[进入主线](https://github.com/torvalds/linux/commit/614f362918c782d1cfa4ee50f96072a95eac264e)，在 Linux v6.8-rc2 可用。
请打包人们按需集成。

### 工具链 {#toolchain}

#### binutils {#binutils}

GNU Binutils 2.42 将于今明两天（北京时间 1 月 29 或 30 日）正式发布。
不巧的是，在最后关头仍然发现了 LoongArch 的 TLS type transition / relaxation
实现有误：xen0n 1 月 28 日实测，在开启 LTO 情况下，无法成功链接 Firefox 与 Thunderbird
了。Lulu Cai
[紧急提供了](https://sourceware.org/pipermail/binutils/2024-January/132168.html)修复补丁，
但一方面不确定这是否确实解决了问题，另一方面在发布分支持续折腾可能反而更不合适；[Xi Ruoyao][xry111]
[建议](https://sourceware.org/pipermail/binutils/2024-January/132179.html)把问题修复与原补丁同时包含的多余指令删除这一优化动作分开，
以降低往发布分支中继续引入潜在问题的风险，Lulu 便[这么做了](https://sourceware.org/pipermail/binutils/2024-January/132194.html)。
但该补丁截至目前仍未被合并。

由于各大发行版都免不了要在所选用的工具链版本上持续维护补丁，从上游维护者的立场看，
在正式版即将发布的最后关头，不合并更多代码可能是最佳选择：相比「可能解决一部分问题但也可能引入更多问题」，
「不会解决一部分问题但确定不会引入更多问题」当然更低风险。
请 LoongArch 社区发行版的打包人们注意：做好跟进、集成这些修复的准备。

感谢 [Xi Ruoyao][xry111] 的代码贡献与新闻线索。

[xry111]: https://github.com/xry111

#### GCC {#gcc}

[Xi Ruoyao][xry111] [发现并报告了](https://gcc.gnu.org/PR113622)与 LoongArch
向量优化相关的编译器内部错误，目前正在与上游合作跟进中。

#### Go {#go}

预计 Go 1.22.0 将于 2 月正式发布。在此之前，Mauri de Souza Meneguzzo 为 `loong64`
[贡献了](https://github.com/golang/go/pull/63923)崩溃用栈的支持。
所谓「崩溃用栈」（crash stack）是一片备用的栈空间，具体技术细节在 Cherry 最初的实现中[有描述](https://go.dev/cl/419435)。

## 杂闻播报 {#assorted-news}

### 新一期 AOSC 社区期刊发布 {#aosc-coffee-break}

[安同开源社区（AOSC）][aosc]近日[发布了][coffee-break-20240127]社区期刊《安记冰室・一月下》，
欢迎同学们跟随链接或从 AOSC 提供的其它官方渠道前往阅读。

[coffee-break-20240127]: https://github.com/AOSC-Dev/newsroom/blob/d87000f671ff27f960beaf4e3093bac8179d4c09/coffee-break/20240127/zh_CN.md

### 「风华」系列显卡新世界适配箭在弦上 {#innogpu-to-support-new-world}

[![「风华二号」显卡](./fenghua-2@500px.webp)](./fenghua-2.jpg)

据《安记冰室・一月下》报道，近日，「风华」系列显卡的开发厂商——芯动科技（Innosilicon）
向龙芯公司以及主要的 LoongArch 社区发行版：AOSC OS、Debian、Gentoo 及 Loong Arch Linux
的维护者们发起了接触，
表达了希望为 LoongArch 新世界系统提供其显卡产品的官方驱动适配的意愿。
参与者们广泛交流了需求场景与技术细节等。
目前适配工作预计在 2024 春节假期后开始，敬请期待。

:::info 主编评论
显卡是适配起来最麻烦的硬件之一。
当今桌面生态繁荣、需求爆炸，因而适配工作也艰巨：X11、Wayland、着色器（shader）指令集与编译器、OpenGL、OpenCL、Vulkan、硬件编解码加速（VA-API、VDPAU、OpenMAX）、HDR……
更不消说浩如烟海的行业应用、游戏等具体场景的问题排查了。
我们在 Mesa、Proton、DXVK 等关键项目的工单系统可以看到，显卡行业的几大巨头，在存在社区帮助的条件下，
尚且无法解决所有用户的所有问题；
那么体量更小的厂商，如果还不重视与外部社区的沟通合作，自然更不可能让用户们满意了。

因此，任何主动释放善意、对沟通与合作持开放态度的厂商，都值得社区参与者们给予对等的善意与尊重；
相应地，这类新闻也适合在社区周报有一席之地。
:::

## 张贴栏 {#bulletin}

本栏目可供张贴公益性质的各种信息。

* 友情扩散：[安同开源社区（AOSC）][aosc]的龙架构移植主线化工作「合龙」已接近尾声，
  此工作完成后龙架构将升格为 AOSC OS 的 Tier 1 架构。
  欢迎同学们试用、反馈，也欢迎有志之士一同加入（沟通渠道详见 AOSC 网站相关栏目）。
* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[aosc]: https://aosc.io
[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16
