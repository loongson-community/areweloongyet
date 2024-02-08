---
slug: this-week-in-loongarch-26
title: 每周一龙：第 26 期
authors: [xen0n]
date: 2023-11-27T23:20:00+08:00
tags: [每周一龙]
---

每周一都为大家报道 LoongArch 社区最前线的第一手新鲜资讯！
上周的进展主要有 ELF psABI 问题的深入探讨、Linux，以及工具链。
详情点进来看！

<!-- truncate -->

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

## 先「马」再看 {#marked-projects}

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch 领域的重要或长期项目（坑）。

### Linux {#linux}

WANG Rui 本周状态神勇，不仅打磨了 `kexec` 功能：

* [跳过了](https://lore.kernel.org/kexec/20231124085410.107080-1-wangrui@loongson.cn)一处应该被跳过的检查；
* [修复了](https://lore.kernel.org/kexec/20231125065232.116319-1-wangrui@loongson.cn)新内核的加载地址；
* [抬高了](https://lore.kernel.org/kexec/20231125072643.116681-1-wangrui@loongson.cn) LZMA 解压缩器的内存限制。

`kexec` 是一种内核功能：加载一个新内核以替换当前运行的内核，相当于跳过硬件、固件初始化过程的重启操作。
由于这样操作下来的硬件状态与正常重启的复位状态不一定相同，因而不是所有硬件配置都能在 `kexec` 之后仍然正常工作；
但对那些能够通过考验的硬件，`kexec` 便能极大缩短系统重启所导致的下线时间了。

而且还[修复了](https://lore.kernel.org/loongarch/20231124035534.70432-1-wangrui@loongson.cn/)
LLD 链接的 PIE 压缩内核不能引导的问题，[更新了](https://github.com/ClangBuiltLinux/linux/issues/1884)
ClangBuiltLinux 的模块支持工作进度，
并为 LoongArch Linux 的 Rust 支持[建立了](https://github.com/loongson-community/discussions/issues/15)跟踪工单。

感谢 :ta: 自己创造并提供新闻线索！

Xi Ruoyao [清理了](https://lore.kernel.org/loongarch/20231126121727.47303-2-xry111@xry111.site/)
`rdtime.d` 包装函数的一处多余寄存器使用。

Hengqi Chen [改变了](https://lore.kernel.org/loongarch/20231121070209.210934-1-hengqi.chen@gmail.com/)系统调用号的存储方式，
将其塞入 `struct thread_info`，据说可解决一些调试工具打了跟踪点却不触发的问题。
还[修复了](https://lore.kernel.org/loongarch/20231124014822.7894-1-hengqi.chen@gmail.com/)打印有些栈上过程调用记录会死循环的问题。

Binbin Zhou [修复了](https://lore.kernel.org/loongarch/cover.1700817227.git.zhoubinbin@loongson.cn/)龙芯 2 号温度子系统驱动 `loongson2_thermal` 的两处小问题。

### 工具链 {#toolchain}

#### ABI {#abi}

近日来，社区同学们被 LoongArch ELF psABI v2.00 引入的 64 位 `PCALA` 重定位计算方式[搞得焦头烂额](https://github.com/loongson-community/discussions/issues/17)。

这要从[一个看似平常的客户反馈问题修复](https://github.com/llvm/llvm-project/pull/71907)说起。
开始都以为只是平常容易忽视的溢出问题，修掉就好了，殊不知背后隐藏的是当前处理方式的根本缺陷：
由于龙架构上拼接一个 64 位 PC-相对地址的四条指令不需要连续，对应的四条重定位记录之间也没有任何关联，
因此当它们跨了 4KiB（对应 12 位立即数）边界时，将导致错误的重定位效果。

这是由于，只有一条指令负责贡献「PC-相对」中的「PC」部分，那么负责贡献「相对」部分的另外三条指令，
都应该「相对」于**那条贡献了 PC 的指令**——这在当前版本的 LoongArch ELF psABI 中，无法做到！
每条指令附属的重定位记录，都指向那个目标符号，而相互之间不存在关联。
因此只要四条指令不属于同一段 4KiB 空间，实际会被执行的「相对」部分就会偏差：
目前只能使用每条指令自己的 PC 来计算重定位。

目前讨论似乎安静了下来：大概率要给 LoongArch ELF psABI 再打一次补丁，
以类似 RISC-V 的做法为问题重定位记录补充关键信息。
当然，这有很多具体实现方式，各有利弊；研究也将继续，有兴趣的同学可以去上游围观、参与。

感谢 Xi Ruoyao 提供新闻线索！

#### GCC {#gcc}

由于 GCC 14 的新功能特性开发阶段已经结束，Xi Ruoyao [发起了](https://github.com/loongson-community/discussions/issues/16)在 GCC 15 实现 LoongArch 16 字节宽度原子操作的讨论。

Xi Ruoyao [修复了](https://gcc.gnu.org/r14-5634)龙架构 stage1 交叉编译器的构建失败问题：
在目标 libc 可用之前，没有办法使用 `<stdint.h>`，因此在非目标架构的库代码里也应该避免使用。

Xi Ruoyao 还[修了](https://gcc.gnu.org/pipermail/gcc-patches/2023-November/638067.html)与
LoongArch 不太直接相关的一处浮点优化错误。

笔者上周[排查出了](https://github.com/loongson-community/discussions/issues/19)
GCC 14 构建 `systemd-boot` UKI stub 不能正常引导内核的问题原因：
是在编译时带了 `-march=la464` 或其他表示有 SIMD 扩展用的编译参数时，GCC 便在 UEFI 代码里使用了 SIMD 指令，
而这时 SIMD 单元未为更早阶段运行的固件代码所启用，导致死掉。
在尝试解决问题过程中，发现加了 `-mabi=lp64s` 会导致构建失败，因为想引用软浮点配置的 glibc 头而不能；
此时 Xi Ruoyao 发现 GCC 的 `<limits.h>` 总是会引用 libc 的同名头，而在 `-ffreestanding`
情形下这是可以避免的，因而[发起了](https://gcc.gnu.org/PR112699)该提议。

本期的大多数 GCC 新闻都是 Xi Ruoyao 帮忙整理（以及自己制造）的，让我们感谢 :ta: 的奉献！

#### Go {#golang}

截至 11 月 22 日，Go 1.22 开发周期已进入功能冻结阶段。Go 1.22 的龙架构相关变更有：

* 寄存器传参 ABI（regabi）支持；
* 插件构建模式（`buildmode=plugin`）支持。

这个版本的 LoongArch regabi 支持处于实验性状态，不会默认开启，但实际上该功能已稳定运行一段时间了。
待 Go 1.22 正式发布时，读者可参考官方的发布说明文档以了解具体该怎么用，帮忙测试。

Meidan Li 等人近日也[提交了](https://go.dev/cl/535616) cgo 的内部链接支持，
链接含有 cgo 的 Go 程序时就不再需要本地存在一套 C 交叉工具链了。
这对不写 C/C++ 但会向 LoongArch 交叉编译的人士会更友好。

## 杂闻播报 {#assorted-news}

Xi Ruoyao 修了一堆 OpenSSL bugs：

* [修复了](https://github.com/openssl/openssl/pull/22812) `linux64-loongarch64` 平台被自动探测时，开启 LTO 构建会失败的问题。

  此修复不会被移植回 OpenSSL 3.2.x 版本，因此如果您要开着 LTO 构建这些版本的 OpenSSL，请手工指定平台为 `linux64-loongarch64`。

* [尝试解决了](https://github.com/openssl/openssl/pull/22816)上个问题的根因：别名分析（aliasing analysis）不开心了。
* [修复了](https://github.com/openssl/openssl/pull/22817) LoongArch64 汇编优化包中的 ChaCha20 算法未遵守 ABI（该保存的浮点寄存器没保存）的问题。
* 用 `rdtimel.w` 指令[真正实现了](https://github.com/openssl/openssl/pull/22823) `rdtsc` 指令的模拟（先前直接返回 0 了）。

感谢 :ta: 自己创造并提供新闻线索！

## 张贴栏 {#bulletin}

本栏目可供张贴公益性质的各种信息。

* 友情扩散：[安同开源社区（AOSC）][aosc]的龙架构移植主线化工作「合龙」仍在如火如荼进行中，
  此工作完成后龙架构将升格为 AOSC OS 的 Tier 1 架构。
  欢迎同学们试用、反馈，也欢迎有志之士一同加入（沟通渠道详见 AOSC 网站相关栏目）。
* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[aosc]: https://aosc.io
[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16
