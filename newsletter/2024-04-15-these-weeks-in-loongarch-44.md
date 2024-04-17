---
slug: these-weeks-in-loongarch-44
title: 每周两龙：第 44 期
authors: [xen0n]
date: 2024-04-15T23:30:00+08:00
tags: [每周一龙]
draft: true  # TODO
---

每周一都为大家报道 LoongArch 社区最前线的第一手新鲜资讯！
上周的进展主要有 TODO。
详情点进来看！

<!-- truncate -->

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

因为笔者上周现实生活繁忙，本期改为更新前两周的内容，预计下期恢复周一更新。

## 先「马」再看 {#marked-projects}

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch 领域的重要或长期项目（坑）。

### Linux {#linux}

上期周报[提到的](./2024-04-01-this-week-in-loongarch-43.md#linux) KFENCE
导致系统崩溃的问题，根因已被找到；Huacai Chen
[提交了](https://lore.kernel.org/loongarch/20240404133642.971583-1-chenhuacai@loongson.cn/)修复，
并已成功进入 `v6.9-rc4` tag，请同学们自取。

<details>
<summary>所以原因是啥？</summary>

KFENCE 能够跟踪内存块分配、使用、释放，并对错误使用予以告警。这要求相应的虚拟地址必须由页表管理、经由 TLB
翻译——这样 KFENCE 才能将其内存池中的某些页标记为「不存在」，进而在其他地方有问题的逻辑试图访问这些页时，
使其触发缺页异常（对应 LoongArch 手册中列举的三种「页无效例外」），从而由 KFENCE 取得「事故现场」的控制权。

但是，Linux 在 LoongArch 上所采用的内核态虚拟地址，并非全部经由 TLB 翻译。实际上，为了性能——「不与用户态争
TLB」，目前 LoongArch Linux 所用的虚拟地址都是落在几个 LoongArch 直接映射窗口（DMW）之一的 1:1 映射地址。
DMW 的大小涵盖了整个物理内存范围，这使得
KFENCE 内存池中的每个页都有两种合法的地址表示：DMW 地址和 TLB 映射地址。
可以想见，如果对同一页混用两种表示方式，大概会产生一些不好的后果；而这就是近几个月来所发生的。

在 Linux 的有些驱动框架中，由于业务上关心的内容主要与页的属性相关，因此对涉及到的页，这些框架的数据结构中会记录
`struct page` 的指针，而非页本身的虚拟地址：这样可以省得每次访问页属性之前，都要拿着页地址去查询
`struct page`。

Linux 块设备层的基本类型之一 `struct bio_vec`「块 I/O 向量」就是这样一种数据结构：名字看似唬人，实际就表示「一段连续的物理内存」。
在「块设备多队列调度器」blk-mq 的「请求」`struct request` 中存放了一个 `struct bio_vec`
的指针 `special_vec`；而「NVMe 核心」`nvme_core` 又有许多围绕 `struct request`
展开的逻辑，其中又恰好有一处用到了 `special_vec`——discard 操作。相信爱护 SSD 的朋友们对
discard，或者它的另一个名字 TRIM 并不陌生：它对 SSD 寿命至关重要。

以上这些因素合起来，便意味着：

1. `nvme_setup_discard` 只要能成功分配内存，便用分配到的页存放 discard 参数，并将此页的
   `struct page` 指针存入 `special_vec`，并设置请求标志 `RQF_SPECIAL_PAYLOAD`「特殊载荷」；
2. 在请求结束时，NVMe 中断处理函数 `nvme_irq` 辗转调用到 `nvme_complete_batch_req`，从而来到
   `nvme_cleanup_cmd`；
3. `nvme_cleanup_cmd` 看到请求带有标志 `RQF_SPECIAL_PAYLOAD` 且 `special_vec` 是动态分配的页，便会
   `kfree` 之；
4. `kfree` 需要虚拟地址而非 `struct page` 指针，因而只能用辅助函数 `bvec_virt` 做翻译；
5. `bvec_virt` 用内存管理子系统（`mm`）的辅助函数 `page_address` 计算结果；
6. 在引入 KFENCE 之前，LoongArch Linux 只使用 DMW 形式的内核虚拟地址。因此截至问题被修复之前，在
   LoongArch 上 `page_address` 计算结果都等于传入 `struct page` 对应的 DMW 地址；
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
1:1 映射到「高 4 位取某值」的虚拟地址范围——如在 48 位物理地址的硬件上，任一形如
`0xAAAA_AAAA_AAAA` 的物理地址，可被 1:1 映射到形如 `0xB000_AAAA_AAAA_AAAA` 的虚拟地址，仅此而已。

这跟 LoongArch 被发明、GS464V 摇身一变成为 LA464 之前，GS464V 所实现的*那个架构*比起来，是有进步——*那个架构*的
`SegCtl` 寄存器不能自定义上述虚拟地址 `B` 位置的内容——可惜进步没有大到解决我们当下问题的程度……

那么退而求其次，解决第二方面问题如何呢？只要想办法保证所有 `kfree` 的入参一定直接或间接来自未修改过的
`kmalloc` 返回值，也能系统性避免此类问题了。

当然，您可能也大概意识到了：这甚至不比「叫龙芯的人改硬件」简单。内核，作为一个注定要与许多硬件底层细节打交道的组件，
总有些「副作用」是难以在高级语言层面表达的。忽略副作用的后果，要么是「假阴性」：实际有问题的代码没有被检查到，于是问题仍然会出现；
要么是「假阳性」：实际没有问题的代码却被报错，使得程序员们抓狂并禁用检查，进而削弱了检查的实用性。
甚至，我们还没有考虑非技术层面：横跨整个内核所有驱动的修改，必然涉及大量分散的个人与团队，而这些维护者出于各自的立场，不见得认同此种改动。
而对于未接受重构的那些驱动，只要哪个倒霉用户在用相应的硬件，这用户的系统便仍然不稳定。

于是我们既不能缩小 DMW，也不能在 DMW 里打洞，更不能改驱动：只好老老实实给所有涉及
`struct page`、物理、虚拟地址转换的辅助函数都提供适配了。它们有：

* 虚拟地址 &rlarr; 物理地址：`virt_to_phys` & `phys_to_virt`
* 虚拟地址 &rlarr; `struct page`：`virt_to_page` & `page_to_virt`
* 虚拟地址 &rlarr; 页号：`virt_to_pfn` & `pfn_to_virt`
* 物理地址 &rlarr; 页号：`phys_to_pfn` & `pfn_to_phys`
* 虚拟地址是否合法：`__virt_addr_valid`

具体来说，对于「正规虚拟地址」不是 DMW 形式的那些页，需要有地方记录它们的「正规虚拟地址」，而
Linux 恰好提供了这么一种机制：如果在架构的 `include/asm/page.h`（或能被它引用到的其他位置）定义
`WANT_PAGE_VIRTUAL`，那么 `struct page` 将获得一个新字段 `void *virtual`。
此功能原先是为那些无法将所有物理内存都映射进地址空间的系统配置设计的，因此很少有地方在用：在开启了
KFENCE 的 LoongArch 加入这一行列之前，只有 ARC、M68k 和 SPARC64 启用了它。LoongArch
的情况当然与这些架构不同，但毕竟也没有更适合的地方存放此信息了。

因为系统的每个物理内存页面都会有一条 `struct page` 记录，所以一直以来 Linux 开发者们都在穷尽各种手段，
尽量避免增加 `struct page` 的大小：内核省出的每一部分内存，都是用户态程序可以利用的额外内存。
在一些超大型系统上，`struct page` 的内存占用十分可观：例如假设有一台 1TiB 内存的 x86
大型主机，由于 x86 要用 4KiB 的页，那么按照默认的内核配置，`sizeof(struct page)` 为
64，在此机器上仅仅 `struct page` 数组就将占用 16GiB 内存——安装内存量的 1.5625%。
随着 `struct page` 被增加了一个 8 字节的成员，`sizeof(struct page)` 从 64 增大到了 72，
页表所占的内存空间势必会随着增大 12.5%。LoongArch 的 `struct page` 在改动之前也是 64 字节大，如果启用
KFENCE 就要承受 12.5% 的页表体积膨胀，我们不见得能接受，毕竟 KFENCE 可以帮助在生产环境实际负载下发现内核 bug，关掉怪可惜的。

然而，x86 经验不见得总是适合平移到龙架构上：一方面，LoongArch 的默认页大小是 16KiB，因此在相同情况下，LoongArch
页表的大小会是 x86 的 1/4，仅占安装内存量的 3&permil; 左右了。另一方面，目前已知也不存在如此大内存的
LoongArch 单体系统，因此在所有现存的 LoongArch 系统上，页表大小的任何变化都可忽略了。

总之，在复杂的软硬件现状下，经过权衡，为 LoongArch 启用 `WANT_PAGE_VIRTUAL` 这一「隐藏机制」并精心维护各种映射关系，
便是当下最优的选择了。尽管这给 LoongArch 内存管理增添了相当复杂度，但比起开机 1 小时就崩溃，总归是进步了。

</details>

Randy Dunlap 给 `asm/addrspace.h` [增加了](https://lore.kernel.org/loongarch/20240404045701.27284-1-rdunlap@infradead.org/)
`linux/sizes.h` 的引用，以修复近期以来的构建错误。

Binbin Zhou [贴出了](https://lore.kernel.org/loongarch/cover.1712732719.git.zhoubinbin@loongson.cn/)适用龙芯 2K 全系列、7A 全系列的 PWM 驱动。

Binbin Zhou 还为现有的龙芯 2 号温度传感器驱动[增加了](https://lore.kernel.org/loongarch/cover.1713147645.git.zhoubinbin@loongson.cn/)
2K0500 与 2K2000 型号的支持，也对龙芯 2 号时钟源驱动[做了](https://lore.kernel.org/loongarch/cover.1712731524.git.zhoubinbin@loongson.cn/)同样的事。

Huacai Chen [修复了](https://lore.kernel.org/loongarch/20240410131804.2165848-1-chenhuacai@loongson.cn/)内核自带龙芯 2K
设备树的一些错误，涉及 LPC 总线、PCI MSI 特性与 GMAC、GNET 网口。

Huacai Chen 还[使得](https://lore.kernel.org/loongarch/20240410131256.2165746-1-chenhuacai@loongson.cn/)
LoongArch 使用透明巨页（THP）处理内存交换，录得 46.75% 的换出（swap-out）操作带宽提升。

Tiezhu Yang [意图](https://lore.kernel.org/loongarch/20240411010510.22135-1-yangtiezhu@loongson.cn/)使
LoongArch Linux 支持单线程配置，或者用 Kconfig 术语，`!CONFIG_SMP` 配置。这种配置的内核在多线程
CPU 上也只能利用单线程，因此唯一的好处是可以搭配已知必然单核的硬件，获得少量性能提升；根据
Tiezhu Yang 在第一版补丁中的[描述](https://lore.kernel.org/loongarch/20240326062101.9822-1-yangtiezhu@loongson.cn/)，能提升
UnixBench `-c 1` 的跑分约 9%。

<details>
<summary>这不很鸡肋吗？</summary>

对于一定的内核配置，允许的排列组合越多，得不到充分测试的组合就越多，这种配置在用户手上坏掉的可能性就更大。LoongArch
的用户、开发者本就没有其他流行架构多，但三年发展下来，软硬件组合一点不少，因此质量保障的压力只会更大：这意味着我们在维护
LoongArch 相关的软件时，都必须更加关注维护成本问题。

`CONFIG_SMP` 恰好是比较麻烦的配置选项之一：它的打开与否会影响内核的许多根本特性（例如在 `!CONFIG_SMP`
情况下，只要关中断便可保证所有原子操作的原子性了），所以支持开关 `CONFIG_SMP` 就意味着不小的维护成本。
并且，借助 alternatives 机制，SMP 内核也能在检测到单线程硬件后动态修改自身代码，
以去除现已不必要的原子操作（例如在 x86 上，这就是打补丁干掉 `lock` 前缀，显然有助于提升性能），因此明确支持
`!CONFIG_SMP` 的必要性更低了。

然而，上游维护者 Arnd Bergmann [介绍了](https://lore.kernel.org/loongarch/b752273b-0e94-4325-9cf8-6f16a204818b@app.fastmail.com/)最新情况，提到 LoongArch 作为 RISC 架构，大概应该与 ARM 或 RISC-V 处于相同境地：
ARM64 Linux 从未支持过非 SMP 内核配置，但有许多流行的 system-in-package 产品在从 32 位转向 64 位，
而它们只有单核与不到 128MiB 的内存；如果能构建 64 位的单处理器内核，那么就能省下好几 MiB，因此未来是有可能给
ARM64 Linux 增加 `!CONFIG_SMP` 支持的。而 RISC-V 目前已经支持 `!CONFIG_SMP` 配置了。
那么，从现在开始统一对待这三个架构，让它们都支持 `!CONFIG_SMP`，就说得过去了。

尽管如此，Arnd 仍然觉得去除 SMP 支持之后，得到的性能提升不应该这么高：这意味着 SMP 内核在单核硬件上对自身的优化低于预期。
如果有条件的话，仍应深入研究、优化 SMP 内核在单核硬件上的表现：这样 SMP 内核便可适用更多的资源受限场景，从而免得下游用户费心在
SMP 与否这个点上抉择，也减轻内核开发者们的维护负担。

</details>

Song Gao 给 LoongArch Linux KVM [增加了](https://lore.kernel.org/loongarch/20240410095812.2943706-1-gaosong@loongson.cn/)性能监测计数器的支持。

Bibo Mao 也给 KVM [增加了](https://lore.kernel.org/loongarch/20240409094900.1118699-1-maobibo@loongson.cn/)内存映射 I/O 跟踪事件（MMIO trace events）的支持。

### 工具链 {#toolchain}

#### binutils {#binutils}

mengqinggang 为 gas [增加了](https://sourceware.org/pipermail/binutils/2024-April/133561.html)
`-mignore-start-align` 选项。这是因为上期周报[报道的](./2024-04-01-this-week-in-loongarch-43.md#binutils)无视节头
`.align` 指示的变更，会在部分链接（partial linking）时导致对齐行为错误。

mengqinggang 将 GOT：`.got` 与 `.got.plt` 两节（section）[挪到了](https://sourceware.org/pipermail/binutils/2024-April/133472.html)
`.data` 之前，以便将 GOT 置于 RELRO 保护之下，提升系统整体安全性。感谢 [xry111] 投递新闻线索！

Lulu Cai [让](https://sourceware.org/pipermail/binutils/2024-April/133271.html)
GNU ld 碰到不认识的重定位操作时要报错。

#### GCC {#gcc}

Lulu Cheng 为几个命令行选项[补充了](https://gcc.gnu.org/pipermail/gcc-patches/2024-April/649038.html)文档链接信息。
在支持的终端下，如果 gcc 的报错或警告信息提及了这些命令行选项，便可以点击选项名，自动跳转到官方文档了。

Yang Yujie 在先前重构的基础上，[完成了](https://gcc.gnu.org/pipermail/gcc-patches/2024-April/648918.html)上游问题报告
[PR113233](https://gcc.gnu.org/PR113233) 的修复。感谢 [xry111] 投递新闻线索！

:::info 勘误
[xry111] 发现上一期周报[所采纳的](./2024-04-01-this-week-in-loongarch-43.md#gcc)新闻线索措辞不准确：当时
Lulu Cheng 做的变更其实是为真正的修复铺路，而非实际解决了。特此更正。
:::

Jiahao Xu [移除了](https://gcc.gnu.org/pipermail/gcc-patches/2024-April/648641.html)非 64 位
LoongArch 的 LSX 支持，简化了一些地方的实现。注意到 Jiahao 的邮箱地址表明了其龙芯员工身份，我们可以推定今后大概率不会有支持
SIMD 扩展的 LA32 型号或软核出现了。

Lulu Cheng 做完了 LA664 微架构的对齐参数实验，[更新了](https://gcc.gnu.org/pipermail/gcc-patches/2024-April/648639.html)为
LA664 优化时对应的默认对齐参数。以此补丁结合上 gcc 其他部分的近期修改，第 28 期周报[提到的](./2023-12-11-this-week-in-loongarch-28/index.md#gcc)
CoreMark 性能劣化问题也随之消失了。

Lulu Cheng 还[合并了](https://gcc.gnu.org/pipermail/gcc-patches/2024-April/648635.html)
3 月中 mengqinggang 提交的 TLS 描述符（TLSDESC）的 gcc 一侧实现工作。这意味着不久之后的 gcc 14.1
正式版将支持 LoongArch TLSDESC 特性了，有助于此特性带来的性能优化在接下来的一两年内快速铺开。

#### LLVM {#llvm}

[heiher] [发现了](https://github.com/llvm/llvm-project/issues/88109)当函数的栈帧很大时，函数的序（prologue）会塞满了栈指针的调节指令，
并将其[修复了](https://github.com/llvm/llvm-project/pull/88110)：先前不得不这么做的原因是
`RegScavenger` 存在其他问题，因此需要做如此规避，但隔壁的 RISCV 同仁先前已将 `RegScavenger`
的问题[解决了](https://github.com/llvm/llvm-project/commit/18c5f3c35d18ca069f02b78e62468d7494ed6c7c)。

[wangleiat] [修复了](https://github.com/llvm/llvm-project/pull/88372) LoongArch
后端的目标变换信息（`TargetTransformInfo`）对 LoongArch 各类寄存器数量的错误认知：先前回落到了默认实现，会认为每种寄存器都只有 8 个。
从提交说明看，此问题显然是在优化 LLVM 的 LoongArch 自动向量化（auto-vectorization）背景下发现的。

[wangleiat] 还修复了日前 ClangBuiltLinux 维护者 Nathan 在自动化测试中[发现的](https://github.com/ClangBuiltLinux/linux/issues/2014)个别情况下函数栈帧大小莫名暴涨的问题。具体修复是围绕着取数组元素 `getelementptr`（GEP）这一 LLVM IR 操作的处理展开的：

* [修复了](https://github.com/llvm/llvm-project/pull/88694)关于寻址模式是否合法的判断，
* [允许了](https://github.com/llvm/llvm-project/pull/88371)拆分 GEP 偏移量的变换。

[wangleiat]: https://github.com/wangleiat

#### Rust {#rust}

[heiher] 为 Rust 界常用的交叉编译、测试工具 cross [增加了](https://github.com/cross-rs/cross/pull/1465)
LoongArch 标准镜像，又[增加了](https://github.com/cross-rs/cross/pull/1466) QEMU 模拟支持。
此支持将随着 cross 的下一个正式版本发布。感谢 [heiher] 自己制造并投递新闻线索！

[heiher]: https://github.com/heiher

## 杂闻播报 {#assorted-news}

[xry111] 提醒说：三个月前在测试 pixman 的 LSX、LASX 优化补丁时，踩到的 GCC LTO 坑已被修复（就是前文提到的 PR113233），
因此打包的同学们可以继续测试了。（编者注：测试前记得确认您用的 GCC 包含了修复补丁！）

[xiangzhai] 为 WebKit 在 Linux LoongArch 上[实现了](https://github.com/WebKit/WebKit/pull/23282)取当前栈指针的操作。
感谢 [xry111] 投递新闻线索！

[xiangzhai]: https://github.com/xiangzhai
[xry111]: https://github.com/xry111

## 张贴栏 {#bulletin}

本栏目可供张贴公益性质的各种信息。

* 您可在 GitHub [浏览](https://github.com/loongson-community/discussions/labels/%E8%8B%B1%E9%9B%84%E5%B8%96)目前所有开放的英雄帖。
* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16
