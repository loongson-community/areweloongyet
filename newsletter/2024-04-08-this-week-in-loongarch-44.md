---
slug: this-week-in-loongarch-44
title: 每周一龙：第 44 期
authors: [xen0n]
date: 2024-04-08T00:00:00+08:00
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

上期周报[提到的](./2024-04-08-this-week-in-loongarch-44.md#linux) KFENCE
导致系统崩溃的问题，根因已被找到；Huacai Chen
[提交了](https://lore.kernel.org/loongarch/20240404133642.971583-1-chenhuacai@loongson.cn/)修复。

<details>
<summary>所以原因是啥？</summary>

KFENCE 能够跟踪内存块分配、使用、释放，并对错误使用予以告警。这要求相应的虚拟地址必须由页表管理、经由 TLB
翻译——这样 KFENCE 才能将其内存池中的某些页标记为「不存在」，进而在其他地方有问题的逻辑试图访问这些页时，
使其触发缺页异常（对应 LoongArch 手册中列举的三种「页无效例外」），从而由 KFENCE 取得「事故现场」的控制权。

但是，Linux 在 LoongArch 上所采用的内核态「虚拟」地址，并非全部经由 TLB 翻译。实际上，为了性能——「不与用户态争
TLB」，目前 LoongArch Linux 所用的大部分虚拟地址都是落在几个 LoongArch 直接映射窗口（DMW）之一的 1:1 映射地址。
DMW 的大小涵盖了整个物理内存范围，这使得
KFENCE 内存池中的每个页都有两种合法的地址表示：DMW 地址和 TLB 映射地址。
可以想见，如果对同一页混用两种表示方式，大概会产生一些不好的后果；而这就是近几个月来所发生的。

在 Linux 的有些驱动框架中，由于业务上关心的内容主要与页的属性相关，因此对涉及到的页，这些框架的数据结构中会记录
`struct page` 的指针，而非页本身的虚拟地址：这样可以省得每次访问页属性之前，都要拿着页地址去查询
`struct page`。

Linux 块设备层的基本类型之一 `struct bio_vec`（块 I/O 向量）就是这样一种数据结构：名字看似唬人，实际就表示「一段连续的物理内存」。
在块设备多队列调度器 blk-mq 的请求数据结构 `struct request` 中存放了一个 `struct bio_vec`
的指针 `special_vec`；而 NVMe 核心 `nvme_core` 又有许多围绕 `struct request`
展开的逻辑，其中又恰好有一处用到了 `special_vec`——discard 操作。

以上这些因素合起来，便意味着：

1. `nvme_setup_discard` 只要能成功分配内存，便用分配到的页存放 discard 参数，并将此页的 `struct page` 指针存入 `special_vec`，并设置请求标志 `RQF_SPECIAL_PAYLOAD`（特殊载荷）；
2. 在请求结束时，NVMe 中断处理函数 `nvme_irq` 辗转调用到 `nvme_complete_batch_req`，从而来到
   `nvme_cleanup_cmd`；
3. `nvme_cleanup_cmd` 看到请求带有标志 `RQF_SPECIAL_PAYLOAD` 且 `special_vec` 是动态分配的页，便会
   `kfree` 之；
4. `kfree` 需要虚拟地址而非 `struct page` 指针，因而只能用辅助函数 `bvec_virt` 做翻译；
5. `bvec_virt` 用内存管理子系统（`mm`）的辅助函数 `page_address` 计算结果；
6. 在引入 KFENCE 之前，LoongArch 只使用 DMW 地址。因此截至问题被修复之前，在 LoongArch 上
   `page_address` 都等效于返回传入 `struct page` 对应的 DMW 地址；
7. `kfree` 收到的地址与当初 `kmalloc` 给出的地址不一致，各种问题随即出现。

本质上，该问题是三方面原因共同造成的：

* 首先，由于 LoongArch DMW 作用范围过于宽泛，导致总不能从理论上完全避免某个页具备多个合法虚拟地址；
* 其次，有些驱动代码未能保证传给 `kfree` 的指针一定与当初 `kmalloc` 的返回值相同；
* 最后，最初提交的 KFENCE 补丁未能考虑到有些页的「正规虚拟地址」会出现与其 DMW 地址相异的情况。

要解决问题，也应该至少从这三方面之一入手。

读到这里，可能读者会想：那么最佳做法当然是解决第一方面问题：在 KFENCE 初始化其内存池时，同步缩减
DMW 覆盖范围，或者在 DMW 中挖洞？这样一来，便能在被问到某个 `struct page` 的虚拟地址时，
精确得知此页是应该被按照 DMW 方式，还是 TLB 方式翻译了。

能做到就好了……问题是做不到。

字面上看，「直接映射窗口」既然是窗口，那么软件当然可以自由配置它的起始位置与长度；xen0n 当初阅读
LoongArch 手册不认真，始终以为是这样。然而不幸的是，此「窗口」其实只能将整个物理地址范围
1:1 映射到「高 4 位取某值」的虚拟地址范围——如在 48 位物理地址的硬件上，任一物理地址如
`0xAAAA_AAAA_AAAA`，可被 1:1 映射到形如 `0xB000_AAAA_AAAA_AAAA` 的地址，仅此而已。

这跟 LoongArch 被发明之前，GS464V 实现的*那个架构*比起来，是有进步——*那个架构*不能自定义上述虚拟地址
`B` 位置的内容——可惜进步没有大到解决我们当下问题的程度……

那么退而求其次，解决第二方面问题如何呢？只要想办法保证所有 `kfree` 的入参一定直接或间接来自未修改过的
`kmalloc` 返回值，也能系统性避免此类问题了。

当然，您可能也大概意识到了：这甚至不比「叫龙芯的人改硬件」简单。内核，作为一个注定要与许多硬件底层细节打交道的组件，
总有些「副作用」是难以在高级语言层面表达的。忽略副作用的后果，要么是「假阴性」：实际有问题的代码没有被检查到，于是问题仍然会出现；
要么是「假阳性」：实际没有问题的代码却被报错，使得程序员们抓狂并禁用检查，进而削弱了检查的实用性。

于是我们既不能缩小 DMW，也不能在 DMW 里打洞，更不能改驱动：只好老老实实给所有涉及
`struct page` 与页虚拟地址转换的辅助函数都提供适配了。

</details>

TODO: add `linux/sizes.h`

TODO: Loongson-2K PWM driver submitted

### 工具链 {#toolchain}

#### ABI {#abi}

TODO

#### binutils {#binutils}

TODO: move GOT before data for RELRO

TODO: error on unknown reloc

#### GCC {#gcc}

TODO: kill LSX on LA32

TODO: Alignment params for LA664

TODO: TLSDESC

#### LLVM {#llvm}

TODO

## 杂闻播报 {#assorted-news}

TODO

## 社区整活:儿: {#grins}

本栏目接受任何网友的投稿，只要内容与 LoongArch 有关，并可以为读者带来价值，
无论严肃贡献（整的大活:儿:）或是博君一笑都一概欢迎！

TODO

## 张贴栏 {#bulletin}

本栏目可供张贴公益性质的各种信息。

* 您可在 GitHub [浏览](https://github.com/loongson-community/discussions/labels/%E8%8B%B1%E9%9B%84%E5%B8%96)目前所有开放的英雄帖。
* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16
