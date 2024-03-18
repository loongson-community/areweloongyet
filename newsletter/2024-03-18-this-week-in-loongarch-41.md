---
slug: this-week-in-loongarch-41
title: 每周一龙：第 41 期
authors: [xen0n]
date: 2024-03-18T19:40:00+08:00
tags: [每周一龙]
---

每周一都为大家报道 LoongArch 社区最前线的第一手新鲜资讯！
上周的进展主要有工具链。
详情点进来看！

<!-- truncate -->

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

## 先「马」再看 {#marked-projects}

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch 领域的重要或长期项目（坑）。

### Linux {#linux}

社区维护的 Vivante GPU 驱动 `etnaviv` 维护者先前[发起的](https://patchwork.freedesktop.org/patch/msgid/72a783cd98d60f6ebb43b90a6b453eea87224409.camel@pengutronix.de)
Linux 6.9 变更 PR 已[进入主线](https://github.com/torvalds/linux/commit/b0b6739cb9155c4ec6b4c50889313184175e687d)，内含
Sui Jingfeng 先前为支持 PCI 形态 Vivante GPU 而做的一些初步重构与清理工作。
感谢 [xry111] 提供新闻线索！

### 工具链 {#toolchain}

#### binutils {#binutils}

mengqinggang 3 月 8 日为 `call36` 伪指令，即 `R_LARCH_CALL36`
重定位类型，[增加了](https://sourceware.org/pipermail/binutils/2024-March/132891.html)
relaxation 支持。实际位于 `b`、`bl` 跳转范围内的 `tail36`、`call36`
可以被重写为相应的等价单条指令了。
感谢 [xry111] 提供新闻线索！

#### GCC {#gcc}

[Xi Ruoyao][xry111] [修复了](https://gcc.gnu.org/pipermail/gcc-patches/2024-March/647928.html)近期 GCC 上游[被发现的](https://gcc.gnu.org/PR114175)
C23 可变入参且巨大返回值的函数的编译错误。

[Xi Ruoyao][xry111]
还[移除了](https://gcc.gnu.org/pipermail/gcc-patches/2024-March/647684.html)一条未被使用且存在错误的代码生成规则。

Chenghui Pan 与 LLVM 一侧的相关变更同步，为 GCC
[移除了](https://gcc.gnu.org/pipermail/gcc-patches/2024-March/647580.html)
`__lasx_xvpermi_q` intrinsic 对其第三操作数的掩码处理。
LLVM 一侧的变更已于第 40 期周报[报道](./2024-03-13-this-week-in-loongarch-40.md#llvm)。

感谢 [xry111] 提供本节的新闻线索！

[xry111]: https://github.com/xry111

#### LLVM {#llvm}

按照 LLVM 官网信息，LLVM 18.1.2 将于 3 月 19 日前后发布。预计该版本将包含先前报道的所有重要
backports，请打包人们关注并及时升级：很快将可以减少下游打的补丁数量了。

#### Rust {#rust}

[heiher] [推进](https://github.com/rust-lang/rust/issues/122592) Rust
LoongArch64 musl target 工作，继先前将此 target 加入 Tier 3 支持 targets
列表后，又为配置脚本 `configure.py`
[增加了](https://github.com/rust-lang/rust/pull/122323)后续所需的配置参数。

[heiher]: https://github.com/heiher

## 张贴栏 {#bulletin}

本栏目可供张贴公益性质的各种信息。

* 您可在 GitHub [浏览](https://github.com/loongson-community/discussions/labels/%E8%8B%B1%E9%9B%84%E5%B8%96)目前所有开放的英雄帖。
* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16
