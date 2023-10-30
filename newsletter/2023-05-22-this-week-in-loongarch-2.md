---
slug: this-week-in-loongarch-2
title: 每周一龙：第 2 期
authors: [xen0n]
date: 2023-05-22T12:05:38+08:00
tags: [每周一龙]
---

每周一都为大家报道 LoongArch&reg; 社区最前线的第一手新鲜资讯！

<!-- truncate -->

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

## 要闻速递

本栏目并非每期都有。如果你看到了，一定是上周发生了重大事件！

5 月 17 日晚间，GNU GRUB2 的 LoongArch 移植[进入上游][grub-msg]，
将于近期的 2.12 版本正式发布。
从[国内 LoongArch 社区最早的代码提交与内部审查][la64-grub-first-pr]以来，
已将近两年时间；从[向上游正式提交的第一版][grub-first-submission]开始，
也快一年半了。

[grub-msg]: https://lists.gnu.org/archive/html/grub-devel/2023-05/msg00089.html
[la64-grub-first-pr]: https://github.com/loongarch64/grub/pull/1
[grub-first-submission]: https://lists.gnu.org/archive/html/grub-devel/2022-01/msg00036.html

这期间，以下同学以各种形式参与了代码的开发、审查、测试等工作：（以 ID 为序）

* [@cnmushiba](https://github.com/cnmushiba)
* [@hudsonzuo](https://github.com/hudsonzuo)
* [@kilaterlee](https://github.com/kilaterlee)
* [@sdlaqz](https://github.com/sdlaqz)
* [@sunhaiyong1978](https://github.com/sunhaiyong1978)
* [@xen0n](https://github.com/xen0n)
* [@xry111](https://github.com/xry111)
* `yangqiming <yangqiming@loongson.cn>`
* [@yetist](https://github.com/yetist)
* [@zhangwenlong8911](https://github.com/zhangwenlong8911)
* [@zhuyaliang](https://github.com/zhuyaliang)
* [@zwaizwai](https://github.com/zwaizwai)

当然，除了这些名字之外，还有其他没有出现在讨论串、提交历史的无名英雄。
让我们感谢 tā 们的付出！

## 先「马」再看

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch&reg; 领域的重要或长期项目（坑）。

### 发行版们

上周没有发行版方面的新动向。

### ClangBuiltLinux

[上游的跟踪 issue](https://github.com/ClangBuiltLinux/linux/issues/1787)
也会及时反映最新动态。

龙芯 LLVM 团队与 xen0n 正在对 LLVM 进行必要的修改，以使其足以构建 Linux 内核。
上一轮迭代基本完成，发现了更多的待跟进项，包括但不限于以下的坑：

* 拼接指令字使用的 `parse_r` 辅助例程目前不能在 LLVM 处理形如 `$a0` 的寄存器名。
* `<asm/asm-extable.h>` 用到了不能被正确处理的写法。
* `la_abs` 宏所使用到的重定位写法涉及了不同段（section）间的偏移计算，不被 LLVM 支持，需要改写。
* `addrspace`（在 C 一侧：`address_space(X)` 属性）不能被用以绕过对 `model` 属性的正经支持，`model` 仍然需要被实现。

### Linux

5 月 16 日，Huacai Chen 在 Linux/LoongArch 邮件列表贴出了两个针对龙芯 3A6000
（LA664 微架构）的性能优化补丁。这也是 LA664 微架构的新鲜特性首次见诸报端。
它们分别是：[更细粒度的内存栅障操作][la664-dbar]与[页表遍历的硬件加速支持][la664-ptw]。

5 月 15 日，Tianrui Zhao 贴出了 [LoongArch KVM 的第 10 版补丁][kvm-r10]。然而虚拟化指令集扩展的手册仍然没有公开。

5 月 14 日，Immad Mir [修复了][fix-debugfs-init]非对齐访存模拟功能的 debugfs 初始化过程的返回值处理。该补丁已被接受。

[la664-dbar]: https://lore.kernel.org/loongarch/20230516124536.535343-1-chenhuacai@loongson.cn/
[la664-ptw]: https://lore.kernel.org/loongarch/20230516124610.535360-1-chenhuacai@loongson.cn/
[kvm-r10]: https://lore.kernel.org/loongarch/20230515021522.2445551-1-zhaotianrui@loongson.cn/
[fix-debugfs-init]: https://lore.kernel.org/loongarch/CY5PR12MB64558068B314942BA1B2ED2BC67B9@CY5PR12MB6455.namprd12.prod.outlook.com/

### LLVM

一周间合并了以下的功能改进等：

* SixWeining 为 LoongArch [添加了 LP64S（64 位软浮点）ABI 支持][D150417]。
  这是支持 ClangBuiltLinux 项目所必须的能力之一。
* SixWeining 使 Clang 在编译汇编语言的源码时[能够正确向汇编器传递 ABI 相关选项][D150537]。
  这也是支持 ClangBuiltLinux 项目所必须的能力之一。

上周没有新的 LoongArch 相关动向。

[D150417]: https://reviews.llvm.org/D150417
[D150537]: https://reviews.llvm.org/D150537

## 社区整活<small>儿</small>

本栏目接受任何网友的投稿，只要内容与 LoongArch&reg; 有关，并可以为读者带来价值，
无论严肃贡献（整的大活<small>儿</small>）或是博君一笑都一概欢迎！

上周没有投稿。

## 张贴栏

本栏目目前可供张贴公益性质的各种信息。

* 杜比欢迎同学们去 [LA UOSC 的 Debian port 页面][lauosc-debian]看看。
* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[lauosc-debian]: https://bbs.loongarch.org/d/167-lauosc-debian-12-ports
[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16
