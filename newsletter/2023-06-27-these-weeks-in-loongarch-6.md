---
slug: these-weeks-in-loongarch-6
title: 每周两龙：第 6 期
authors: [xen0n]
date: 2023-06-27T13:57:42+08:00
tags: [每周一龙, 每周两龙]
---

每周一都为大家报道 LoongArch&reg; 社区最前线的第一手新鲜资讯！

<!-- truncate -->

因为笔者上周:sheep:了，本期改为周二更新前两周的内容，预计下期恢复周一更新。

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

## 先「马」再看

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch&reg; 领域的重要或长期项目（坑）。

### ClangBuiltLinux

[上游的跟踪 issue](https://github.com/ClangBuiltLinux/linux/issues/1787)
也会及时反映最新动态。
鉴于该倡议的龙架构部分主体工作已经完成，后续相关工作将在 Linux 一节合并报道。

感谢 [@heiher](https://github.com/heiher) 的参与，目前打过补丁的 LLVM/Clang
已经可以构建基本的 LoongArch Linux 镜像了。
截至发稿时[相关内核补丁](https://lore.kernel.org/loongarch/20230625095644.3156349-1-kernel@xen0n.name/)已被接受，
将进入 v6.5-rc1；
LLVM 的变更情况见 LLVM 一节。
上游社区[火速跟进了](https://github.com/ClangBuiltLinux/boot-utils/issues/108)相关的自动化引导测试支持，
发现的小坑将在本周快速填平，后续的 LLVM/Clang 兼容性将由该设施自动化保证。

目前还缺模块和可重定位（`CONFIG_RELOCATABLE`）支持，这部分预计在后续的开发周期也会慢慢解决掉。

### Linux

目前 Linux v6.5 的合并窗口已经开启。本周期的龙架构相关重大变更有：

* [向量扩展支持](https://lore.kernel.org/loongarch/20230613151918.2039498-1-chenhuacai@loongson.cn/)。
  需要编译器、汇编器支持向量指令，才能打开相应 Kconfig 配置项。
  过一阵子应该都能用上了。
* 3A6000/LA664 的[细粒度内存栅障支持](https://lore.kernel.org/loongarch/20230516124536.535343-1-chenhuacai@loongson.cn/)。
* 3A6000/LA664 的[同时多线程（SMT，“超线程”）支持](https://lore.kernel.org/loongarch/20230614093755.88881-1-wangliupu@loongson.cn/)。
  补丁透露该支持需要固件配合，以最初用于 AArch64 的 ACPI PPTT 表结构传递处理器核的拓扑信息。
* 3A6000/LA664 的[硬件页表遍历单元支持](https://lore.kernel.org/loongarch/20230516124610.535360-1-chenhuacai@loongson.cn/)。
* 初步的 ClangBuiltLinux 适配。

详情请[移步龙架构的上游集成分支](https://git.kernel.org/chenhuacai/linux-loongson/l/loongarch-next)。

6 月 20 日，Youling Tang 基于 :ta: [4 月份的 libelf 工作](https://sourceware.org/pipermail/elfutils-devel/2023q2/006107.html)，
开始将 [ORC unwinder](https://www.kernel.org/doc/html/latest/arch/x86/orc-unwinder.html)
移植到龙架构：[发出了](https://lore.kernel.org/loongarch/1687247209-31676-1-git-send-email-tangyouling@loongson.cn/)一版初稿补丁。
（感谢 [@xry111](https://github.com/xry111) 的新闻线索。）

### 工具链

#### binutils

6 月 25 日，mengqinggang 向 GNU binutils 邮件列表[提交了](https://sourceware.org/pipermail/binutils/2023-June/127990.html) LSX/LASX 支持，
又[添加了](https://sourceware.org/pipermail/binutils/2023-June/127993.html) `R_LARCH_64_PCREL` 支持。

#### LLVM

两周间合并了以下的功能改进等：

* SixWeining [允许了](https://reviews.llvm.org/D150196)在任何场景下使用浮点、向量等扩展指令，以便裸机软件、内核等具备足够控制力的程序在本身不使用这些指令的前提下，仍然能够自行管理相应硬件资源。
  :::info 这是为啥
  龙架构下，管理扩展资源需要用到扩展指令，但先前如果告知 LLVM 不使用这些指令，那么只要尝试使用都会报错。
  即便程序员知道自己在做什么、哪些地方的手写汇编用到扩展指令也是安全的，也没法搞。
  :::
* xen0n 为 `llvm-objcopy` [添加了](https://reviews.llvm.org/D153609)龙架构支持。
* xen0n 使 Clang 处理 `-m*-float` 参数时[也不忘检查](https://reviews.llvm.org/D153707) `-mabi`、`-mfpu` 选项。

出现了以下的新动向：

* Ami-zhang 接近完成了 MSan 的龙架构移植：[D140528](https://reviews.llvm.org/D140528)、[D152692](https://reviews.llvm.org/D152692)，不日将合并。

## 社区整活:儿:

本栏目接受任何网友的投稿，只要内容与 LoongArch&reg; 有关，并可以为读者带来价值，
无论严肃贡献（整的大活:儿:）或是博君一笑都一概欢迎！

[loongarch-opcodes 项目](https://github.com/loongson-community/loongarch-opcodes)整理完成了所有
LSX、LASX 指令编码信息。有需要的同学可以参考起来了。
在龙芯公布《龙芯架构参考手册》卷二之前，社区同学也可以根据 QEMU 源码，推进指令文档的编撰了。

近日 Gentoo 社区一位国际友人拿到了 7A2000 板子，龙架构的朋友逐渐增多 :sunglasses:

## 张贴栏

本栏目目前可供张贴公益性质的各种信息。

* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[lauosc-debian]: https://bbs.loongarch.org/d/167-lauosc-debian-12-ports
[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16
