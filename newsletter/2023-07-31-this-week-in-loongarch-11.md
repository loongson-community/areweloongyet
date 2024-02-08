---
slug: this-week-in-loongarch-11
title: 每周一龙：第 11 期
authors: [xen0n]
date: 2023-07-31T20:21:17+08:00
tags: [每周一龙]
---

每周一都为大家报道 LoongArch 社区最前线的第一手新鲜资讯！

<!-- truncate -->

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

## 先「马」再看

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch 领域的重要或长期项目（坑）。

### Linux

7 月 31 日，xen0n 在做 RAID6 龙架构向量优化的过程中，
顺带[修复了](https://lore.kernel.org/linux-raid/20230731104911.411964-1-kernel@xen0n.name/)年久失修的 `raid6test` 调试工具。

中国时间 7 月 31 日凌晨，Linus [tagged](https://lore.kernel.org/lkml/CAHk-=wik9NO9Un-OU0rVeo1+dp=6vj=s=K0T=uBVEa+Aqkj66w@mail.gmail.com/) Linux v6.5-rc4。
其中的龙架构变更包含了[针对 binutils 2.41 的构建修复补丁](https://github.com/torvalds/linux/commit/03c53eb90c0c61885b2175adf8675fb56df7f8db)，
有需要的同学可自行取用。

### 工具链

7 月 30 日晚间，binutils 2.41 [正式发布](https://sourceware.org/pipermail/binutils/2023-July/128719.html)。
相关变更内容已在[周报第 7 期](./2023-07-03-this-week-in-loongarch-7.md)报道。

7 月 29 日，LLVM 17.0.0-rc1 [发布](https://discourse.llvm.org/t/llvm-17-0-0-rc1-tagged/72404)。
除了已在[周报第 10 期](./2023-07-24-this-week-in-loongarch-10.md)报道的变更之外，其中重要的龙架构相关变更还有：

* LLD 现已支持龙架构（by xen0n）。
  在 LLVM、QEMU、Linux 等大型项目上测试可用，也测试过可以自举 Gentoo LLVM stage。
* Clang 在龙架构上支持了 `-march=` `-mtune=` 选项，
  以及相应的内建预处理器符号 `__loongarch_arch`、`__loongarch_tune`（by SixWeining）。

## 杂闻播报

GNOME3 已在 Gentoo/LoongArch 上证实可用并 keyworded。
相应地，GNOME 与 Plasma 的 desktop profiles 也在本周添加了。
有需要的同学可以利用它们来给自己 `make.conf` 等等配置瘦身了。

## 社区整活:儿:

本栏目接受任何网友的投稿，只要内容与 LoongArch 有关，并可以为读者带来价值，
无论严肃贡献（整的大活:儿:）或是博君一笑都一概欢迎！

7 月 31 日，xen0n 完成了 Linux RAID 5/6 计算的 LSX、LASX 移植（性能不错），预计在本周内提交上游、见诸下期周报。

7 月 26 日晚间，xry111 [注意到](https://github.com/openssl/openssl/pull/21530)龙芯员工在修复
OpenSSL 的龙架构 AES 汇编加速的正确性，该员工援引「最新修订的 LoongArch64 向量指令手册」：
「对于 `vshuf.b` 的控制寄存器中的每个字节，其未定义的最高 3 位不应被使用，
否则指令执行结果不确定。」xry111 据此指出：

> 根据 LA464 的实现“猜”的向量指令行为未必可靠。

（编者注：很遗憾，这意味着根据 QEMU 实现反推的指令行为也未必 100% 匹配真实或未来硬件行为，
因此不基于官方手册二次创作（这目前被禁止）的指令说明文档总不免要经受些后知后觉的修订。
但有这么一份著作权不受限的文档的好处总比坏处多。）

## 张贴栏

本栏目可供张贴公益性质的各种信息。

* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16
