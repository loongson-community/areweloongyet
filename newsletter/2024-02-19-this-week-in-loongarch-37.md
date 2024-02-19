---
slug: this-week-in-loongarch-37
title: 每周一龙：第 37 期
authors: [xen0n]
date: 2024-02-19T00:00:00+08:00
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

Bibo Mao 为 LoongArch KVM
[新增了](https://lore.kernel.org/loongarch/20240218063302.218019-1-maobibo@loongson.cn/)软件断点支持。

xen0n [完善了](https://lore.kernel.org/loongarch/20240216085822.3032984-1-kernel@xen0n.name/)
LoongArch KVM 在设置 CPUCFG 数据时对 CPUCFG ID 的处理。

来自高通创新中心（QuIC）的 Oreoluwa Babatunde 意图确保内核在
FDT 引导流程下不会不小心用到本应被保留的内存区域，
为此给 LoongArch、OpenRISC 和 SuperH 三个架构[调整了](https://lore.kernel.org/loongarch/1707524971-146908-1-git-send-email-quic_obabatun@quicinc.com/)初始化函数的执行顺序。Huacai Chen
[说](https://lore.kernel.org/loongarch/CAAhV-H5f5e-cCaX7Gr20oG8F-aywJcosLn4ajxx2SQWoB8JtSA@mail.gmail.com/)
LoongArch 上不能简单这么改；Oreoluwa [解释道](https://lore.kernel.org/loongarch/03c2c48d-d05f-4906-b63b-711c94133489@quicinc.com/)关键在于
`early_init_fdt_scan_reserved_mem` 应该尽早发生。于是
Huacai [了解了](https://lore.kernel.org/loongarch/CAAhV-H7LjadN99OAdpX4OxU-bcjVC45iUwrzTfQz28UMc0K0JQ@mail.gmail.com/)，
并[给出了](https://lore.kernel.org/loongarch/20240218151403.2206980-1-chenhuacai@loongson.cn/)一种推荐的改法。

### 工具链 {#toolchain}

#### binutils {#binutils}

补充上周未注意到的变更：Hui Li 为 GDB
[新增了](https://sourceware.org/git?p=binutils-gdb.git;a=commitdiff;h=1e9569f383a3d5a88ee07d0c2401bd95613c222e)向量扩展支持；Feiyang Chen、Binbin Zhou
与 Hui Li 则为 GDB [新增了](https://sourceware.org/git/?p=binutils-gdb.git;a=commitdiff;h=e4d74c01e77365f1327e4e567e7579cdd3bf74f6)
LBT 扩展支持。

此外，Tiezhu Yang 也为 LoongArch 的 GDB [补充了](https://sourceware.org/git/?p=binutils-gdb.git;a=commitdiff;h=be908bd6e7fdcf0b91b949b152a063b5791856b5)
`catch syscall` 操作的支持。

## 杂闻播报 {#assorted-news}

TODO

## 社区整活:儿: {#grins}

本栏目接受任何网友的投稿，只要内容与 LoongArch 有关，并可以为读者带来价值，
无论严肃贡献（整的大活:儿:）或是博君一笑都一概欢迎！

TODO

## 张贴栏 {#bulletin}

本栏目可供张贴公益性质的各种信息。

* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16
