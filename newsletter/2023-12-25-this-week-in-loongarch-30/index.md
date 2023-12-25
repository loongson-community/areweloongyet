---
slug: this-week-in-loongarch-30
title: 每周一龙：第 30 期
authors: [xen0n]
date: 2023-12-25T20:30:00+08:00
tags: [每周一龙]
---

每周一都为大家报道 LoongArch&reg; 社区最前线的第一手新鲜资讯！
上周的进展主要有 TODO。
详情点进来看！

<!-- truncate -->

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

## 先「马」再看 {#marked-projects}

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch&reg; 领域的重要或长期项目（坑）。

### Linux {#linux}

TODO

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

本栏目接受任何网友的投稿，只要内容与 LoongArch&reg; 有关，并可以为读者带来价值，
无论严肃贡献（整的大活:儿:）或是博君一笑都一概欢迎！

## `libLoL`: AOSC 为您在新旧世界之间架起桥梁！ {#liblol}

众所周知，LoongArch 的[新旧世界生态割裂问题](/docs/old-and-new-worlds/)已经困扰了社区发行版用户许久：
虽然许多国内闭源软件都陆续支持了 LoongArch，但都是在采用旧世界 ABI 的商业发行版上，
从而与基于新世界 ABI 的社区发行版和用户群体「绝缘」。
虽然在早先[上证路演的投资者互动环节][sse-roadshow]、11 月 28 日的产品发布会上，
龙芯公司表态将开发新旧世界应用的兼容方案，
但截至目前，同学们仍未在公开渠道得到此方案技术细节的正面回应。
考虑到性能喜人的 3A6000 板卡已经陆续上市，不难作出合理推测：
总有群众等不及两年后（或者甚至更久）这些软件的官方新世界版本，而现在就要用！

[sse-roadshow]: https://roadshow.sseinfo.com/roadshowIndex.do?id=16536#cd-placeholder-hdjl

[安同开源社区（AOSC）][aosc]作为「牢记服务用户需求这一宗旨」的一群人，此刻便站了出来。:ta: 们给出的答案是：`libLoL`——LoongArch on LoongArch。

AOSC 开发者[王邈][shankerwangmiao]与[刘子兴][liushuyu]，在主线内核上实现了可通过外挂模块方式动态载入的旧世界系统调用支持。
王邈也设计、实现了位于用户态的运行时部分：打包了旧世界参考发行版 Loongnix 的核心运行时库，
使旧世界应用能够有「回家的感觉」从而正常启动。
在本期周报发稿当天，AOSC OS 已经成功支持了 WPS Office 与龙芯浏览器等标志性的旧世界应用，
如图所示（点击即看高清大图）：

[![启用了 liblol 的 AOSC 系统上成功运行旧世界 WPS 与龙芯浏览器的截图](./liblol-showcase@0.5x.webp)](./liblol-showcase.webp)

[shankerwangmiao]: https://github.com/shankerwangmiao
[liushuyu]: https://github.com/liushuyu

12 月 23 日发布的 AOSC 双周报《安记冰室・十二月下》[记载了](https://github.com/AOSC-Dev/newsroom/blob/2c5443a792291702438cbf6059d8d4039ca5dc85/coffee-break/20231223/zh_CN.md#%E5%B1%95%E6%9C%9B-liblol%E9%BE%99%E6%9E%B6%E6%9E%84%E6%97%A7%E4%B8%96%E7%95%8C%E5%BA%94%E7%94%A8%E7%A8%8B%E5%BA%8F%E5%85%BC%E5%AE%B9%E8%BF%90%E8%A1%8C%E6%97%B6)这项工作的更多信息，推荐阅读。

## 张贴栏 {#bulletin}

本栏目可供张贴公益性质的各种信息。

* 友情扩散：[安同开源社区（AOSC）][aosc]的龙架构移植主线化工作「合龙」仍在如火如荼进行中，
  此工作完成后龙架构将升格为 AOSC OS 的 Tier 1 架构。
  欢迎同学们试用、反馈，也欢迎有志之士一同加入（沟通渠道详见 AOSC 网站相关栏目）。
* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[aosc]: https://aosc.io
[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16
