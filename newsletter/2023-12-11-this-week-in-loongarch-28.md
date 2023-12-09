---
slug: this-week-in-loongarch-28
title: 每周一龙：第 28 期
authors: [xen0n]
date: 2023-12-11T00:00:00+08:00
tags: [每周一龙]
draft: true
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

#### binutils

Xi Ruoyao 为共享库[启用了](https://sourceware.org/pipermail/binutils/2023-December/130991.html)
`la.got` 到 `la.pcrel` 的 relaxation 优化。

mengqinggang [意图](https://sourceware.org/pipermail/binutils/2023-December/130993.html)为
LoongArch 汇编语言增加双引号括起来的符号名和寄存器名支持，但未一并给出意欲支持的需求场景。
Fangrui Song 随后指出了寄存器名还加引号有点奇怪，应该是不用支持。

## 杂闻播报 {#assorted-news}

AOSC 贡献者 [eatradish](https://github.com/eatradish) 为 Rust 的 Lua 绑定库
mlua [新增了](https://github.com/khvzak/mlua/pull/339) LoongArch 支持。
感谢 [MingcongBai](https://github.com/MingcongBai) 投递新闻线索！

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
