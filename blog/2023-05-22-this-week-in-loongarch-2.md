---
slug: this-week-in-loongarch-2
title: 每周一龙：第 2 期
authors: [xen0n]
tags: [每周一龙]
draft: true
---

每周一都为大家带来社区贡献者们从最前线传来的第一手新鲜资讯！

<!-- truncate -->

## 先「马」再看

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch&reg; 领域的重要或长期项目（坑）。

### 发行版们

TODO

### ClangBuiltLinux

[上游的跟踪 issue](https://github.com/ClangBuiltLinux/linux/issues/1787)
也会及时反映最新动态。

龙芯 LLVM 团队与 xen0n 正在对 LLVM 进行必要的修改，以使其足以构建 Linux 内核。
上一轮迭代基本完成，发现了更多的待跟进项。

### Linux

北京时间 5 月 16 日，Huacai Chen 在 Linux/LoongArch 邮件列表贴出了两个针对龙芯
3A6000（LA664 微架构）的性能优化补丁。这也是 LA664 微架构的新鲜特性首次见诸报端。
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

出现了以下的新动向：

* TODO

[D150417]: https://reviews.llvm.org/D150417
[D150537]: https://reviews.llvm.org/D150537

## 社区整活<small>儿</small>

本栏目接受任何网友的投稿，只要内容与 LoongArch&reg; 有关，并可以为读者带来价值，
无论严肃贡献（整的大活<small>儿</small>）或是博君一笑都一概欢迎！

TODO

## 张贴栏

本栏目目前可供张贴公益性质的各种信息。

* 杜比欢迎同学们去 [LA UOSC 的 Debian port 页面][lauosc-debian]看看。
* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[lauosc-debian]: https://bbs.loongarch.org/d/167-lauosc-debian-12-ports
[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16
