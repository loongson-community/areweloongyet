---
slug: this-week-in-loongarch-21
title: 每周一龙：第 21 期
authors: [xen0n]
tags: [每周一龙]
draft: true
---

每周一都为大家报道 LoongArch&reg; 社区最前线的第一手新鲜资讯！

<!-- truncate -->

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

## 先「马」再看

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch&reg; 领域的重要或长期项目（坑）。

### Linux

10 月 19 日，Huacai Chen [发出了](https://lore.kernel.org/loongarch/169774057661.20290.11492595041951746156.pr-tracker-bot@kernel.org/T/#m9facb0821a19108af3693a87dc0f603d6d9fa26f)
v6.6 开发周期的第三组 LoongArch 架构相关修复，
Linus 很快将其拉入了主线。
这些内容已在美西时间周日下午的 v6.6-rc7 tag 发布了。
内容有：

* 周报第 19 期报道的 Icenowy Zheng 的 LoongArch 写合并问题规避方式[修复](https://git.kernel.org/torvalds/c/278be83601dd1725d4732241f066d528e160a39d)，
  实测解决了 AMD GPU 系统的许多纹理损坏问题。
* 同样在第 19 期报道的上游开发者 Deepak 发现的实时内核相关重构需求，
  由 Huacai Chen [实现](https://git.kernel.org/torvalds/c/477a0ebec101359f49d92796e3b609857d564b52)。
* Tiezhu Yang [重构的](https://git.kernel.org/torvalds/c/00c2ca84c680f64b79b5e10a482ca435fd7d98ce)一些汇编代码中对符号性质的标注。
* Huacai Chen [实现的](https://git.kernel.org/torvalds/c/449c2756c2323c9e32b2a2fa9c8b59ce91b5819d)第
  18 期周报中发现的构建错误修复。


### 工具链

#### LLVM

10 月 17 日，wangleiat [教会了](https://github.com/llvm/llvm-project/pull/69300)
LLVM 在 LoongArch 浮点条件码寄存器间搬运数据。
在此之后，寄存器分配工序就可以放开手脚随意使用这部分寄存器了。

TODO

## 杂闻播报

TODO

## 社区整活<small>儿</small>

本栏目接受任何网友的投稿，只要内容与 LoongArch&reg; 有关，并可以为读者带来价值，
无论严肃贡献（整的大活<small>儿</small>）或是博君一笑都一概欢迎！

TODO

## 张贴栏

本栏目可供张贴公益性质的各种信息。

* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16
