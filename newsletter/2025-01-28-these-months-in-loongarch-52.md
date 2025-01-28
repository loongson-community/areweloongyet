---
slug: these-months-in-loongarch-52
title: 每半年卅三龙：合订本（第 52~84 期）
authors: [xen0n]
date: 2025-01-28T23:00:00+08:00
tags: [每周一龙]
---

每周（尽量）为大家报道 LoongArch 社区最前线的第一手新鲜资讯！
近半年的进展实在太多啦。
详情点进来看！

<!-- truncate -->

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

## 先「马」再看 {#marked-projects}

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch 领域的重要或长期项目（坑）。

### Linux {#linux}

#### 第 52 期 (2024-06-11 ~ 2024-06-17) {#linux-52}

<!--
TODO: amdgpu & LS7A drama [Icenowy]

[Icenowy]: https://github.com/Icenowy
-->

针对第 38 期周报提到的 LoongArch 不存在 `fstat` 和 `newfstatat` 系统调用，而是使用 `statx` 实现它们，从而导致性能损失和某些软件的 seccomp 沙箱无法正常工作的问题，在 [xry111] [抛砖引玉](https://lore.kernel.org/loongarch/20240622105621.7922-1-xry111@xry111.site/) (并被 Linus [批判一番](https://lore.kernel.org/loongarch/CAHk-=wgj6h97Ro6oQcOq5YTG0JcKRLN0CtXgYCW_Ci6OSzL5NA@mail.gmail.com/)) 后，Mateusz Guzik 和 Christian Brauner [允许了](https://git.kernel.org/torvalds/c/0ef625bba6fb)在使用 `AT_EMPTY_PATH` 时以空指针代替指向空串的指针，并在系统调用入口点特判了传入指向空串指针的情况。这样：

- 即使不修改用户态，也已经做到几乎完全解决性能问题；如果修改用户态，使用空指针代替指向空串的指针，则可以完全解决性能问题。
- 对于沙箱问题，沙箱可以在 `SIGSYS` 处理函数中将使用空串的 `statx` 调用重写为使用空指针，然后在 seccomp BPF 程序中放行使用空指针的 `statx` 调用。

上述修改已合入 6.11 内核，至此可以认为该问题已被完全解决。然而，Huacai Chen 仍然[坚持](https://lore.kernel.org/loongarch/CAAhV-H7iKyQBvV+J9T1ekxh9OF8h=F9zp_QMyuhFBrFXGHHmTg@mail.gmail.com/)[重新引入](https://lore.kernel.org/loongarch/20240511100157.2334539-1-chenhuacai@loongson.cn/) `fstat` 和 `newfstatat` 系统调用。[xry111]，Arnd Bergmann，以及 Christian Brauner [反对](https://lore.kernel.org/loongarch/20240703-bergwacht-sitzung-ef4f2e63cd70@brauner/)这一提议，[但是 Linus 的决定权也是很重要的](https://lore.kernel.org/loongarch/CAHk-=wi0ejJ=PCZfCmMKvsFmzvVzAYYt1K9vtwke4=arfHiAdg@mail.gmail.com/)，因此 6.11 版本内核已经为 LoongArch [重新引入](https://git.kernel.org/torvalds/c/7697a0fe0154)这两个系统调用。我们将需要在下一个 Glibc 开发周期解决这一变化将导致的[兼容性问题](https://lore.kernel.org/loongarch/3fea167cad483484616e9bbf5ec6374475c4bcc4.camel@xry111.site/)，并[修订](https://github.com/loongson-community/areweloongyet/pull/195)本站的相关文档。

为了提高 `getrandom` 的效率 (这样应用程序就可以直接使用它，而不再需要自行维护一个伪随机数生成器)，Jason A. Donenfeld 为 Linux 内核[增加了](https://lwn.net/Articles/983186/)在 vDSO 中实现 `getrandom` 的功能。为了保证安全性，vDSO `getrandom` 实现使用的 ChaCha20 子程序不能将敏感信息保存到栈上，显然必须使用汇编语言实现才能确保子程序满足这一条件。Jason 本人只为 x86-64 用 SSE2 汇编实现了 ChaCha20 子程序，因此目前只有 x86-64 的 vDSO 提供了 `getrandom` 实现。[xry111] 用 LoongArch 汇编[编写了](https://lore.kernel.org/all/20240816110717.10249-1-xry111@xry111.site/)满足条件的 ChaCha20 子程序，正在接受评审。

[xry111]: https://github.com/xry111

Huacai Chen [发出了](https://lore.kernel.org/loongarch/20240612064205.2041548-1-chenhuacai@loongson.cn/)适用于采用 LoongArch 架构的龙芯 3 号处理器的自动调频（cpufreq）驱动。

:::info 先别急
因为龙芯 CPU 的调频调压操作是由片上管理小核运行的特定固件配合完成的，所以如同引导协议、内核 ABI
会存在兼容性问题一般，主板的调频调压支持也有 ABI 兼容性问题。Linux 主线的 cpufreq 驱动，无法配合绝大部分市售板卡使用。
:::

#### 第 53 期 (2024-06-18 ~ 2024-06-24) {#linux-53}

Hui Li [翻新了](https://lore.kernel.org/loongarch/20240618074303.17869-1-lihui@loongson.cn/)修复硬件断点功能的补丁到第 3 版。

maobibo [避免了](https://lore.kernel.org/loongarch/20240620033552.2739845-1-maobibo@loongson.cn/T/#u) KVM 虚拟机在宿主间迁移时由于未将 `CSR.ESTAT` 同步，而让 vCPU 丢中断的问题。

Huacai Chen 在用户有休眠的需求时，[自动禁用了](https://lore.kernel.org/loongarch/20240625061631.3461764-1-chenhuacai@loongson.cn/) KASLR 以确保睡醒的内核把自己加载到睡前的同一位置。具体来说，是在内核命令行不含 `nohibernate` 也不含 `noresume`，且含有 `resume=` 的时候，认为用户有休眠需求。

#### 第 54 期 (2024-06-25 ~ 2024-07-01) {#linux-54}

Oleg Nesterov [重构了](https://lore.kernel.org/loongarch/20240629150313.GB4504@redhat.com/)
LoongArch uprobe 实现中的两个宏，使它们成为常量。这修复了 `uretprobe` 系统调用的实现工作中，由于要求
`arch_uprobe_trampoline()` 在常量上下文可用，而导致的构建错误。

#### 第 55 期 (2024-07-02 ~ 2024-07-08) {#linux-55}

Huacai Chen [采纳了](https://lore.kernel.org/loongarch/20240702151415.1160566-1-chenhuacai@loongson.cn/) Jiaxun Yang 的建议：在重定位内核（`relocate_kernel()`）时，使用
`early_memremap_ro` 而非适用于 I/O 内存区域的 `early_ioremap` 映射内核命令行，并在用完之后释放映射。

Huacai Chen 还[标记了](https://lore.kernel.org/loongarch/20240702151446.1161159-1-chenhuacai@loongson.cn/)先前遗漏的 `ARCH_HAS_DEBUG_VM_PGTABLE` 配置项，使得相应的虚拟内存调试功能在 LoongArch 上可用了。

Huacai Chen 还[适配了](https://lore.kernel.org/loongarch/20240702151431.1160915-1-chenhuacai@loongson.cn/)设备内存（device-backed memory; `ZONE_DEVICE`）所需的基础设施，标记了 `ARCH_HAS_PTE_DEVMAP`。

WANG Rui 为 LoongArch 的 Rust for Linux [增加了](https://lore.kernel.org/loongarch/20240703110624.1301830-1-wangrui@loongson.cn/) rustc `-Zdirect-access-external-data`
选项的支持。这是 GCC/Clang `-fdirect-access-external-data` 的 Rust 等价物，从 Rust 1.78 开始受到支持。

Arnd Bergmann 将所有架构的系统调用声明都[切换到了](https://lore.kernel.org/loongarch/20240704143611.2979589-1-arnd@kernel.org/) `syscall.tbl` 格式，其中也包括 LoongArch。此修改在
Linux 6.11 正式发布。

Xianglai Li 给 LoongArch KVM [增加了](https://lore.kernel.org/loongarch/20240705023854.1005258-1-lixianglai@loongson.cn/)模拟中断控制器的能力。

Jiaxun Yang 为 LoongArch 系统引导过程[启用了](https://lore.kernel.org/loongarch/20240705-loongarch-hotplug-v1-0-67d9c4709aa9@flygoat.com/) CPU 的并行初始化。如果该补丁系列得到合并，那么
LoongArch 便会成为首个启用此功能的非 x86 架构，然而实际上暴露了一些别的问题，因此截至 2025 年
1 月，该补丁系列仍未被合并。

Xi Ruoyao 为 LoongArch Linux [增加了](https://lore.kernel.org/loongarch/20240706073858.161035-2-xry111@xry111.site/)
`DT_RELR` 重定位格式的支持，使得默认配置（`defconfig`）的 Linux 内核本体未压缩状态（`vmlinux.efi`）减重
6%（2.1 MiB）；压缩状态（`vmlinuz.efi`）减重 2.8%（384 KiB）。

#### 第 56 期 (2024-07-09 ~ 2024-07-15) {#linux-56}

Tiezhu Yang [修复了](https://lore.kernel.org/loongarch/20240709061731.11025-1-yangtiezhu@loongson.cn/)用户态断点（userspace watchpoint）对线程标志 `TIF_LOAD_WATCH`
处理的一些细节。

Tiezhu Yang 还[发出了](https://lore.kernel.org/loongarch/20240712091506.28140-1-yangtiezhu@loongson.cn/)为 objtool 增加 LoongArch 跳表（jump table）支持的草稿供讨论（RFC）。该工作基于了
Xi Ruoyao 为 GCC [增加的](https://lore.kernel.org/loongarch/20240712091506.28140-1-yangtiezhu@loongson.cn/)相应支持，Tiezhu 在提交说明中向 Xi Ruoyao 特意致谢。

tangbin [重构了](https://lore.kernel.org/loongarch/20240713155937.45261-1-tangbin@cmss.chinamobile.com/) LoongArch KVM 代码中的 `kvm_map_page_fast` 函数的控制流，简化掉了一个
`ret` 变量，但被龙芯维护者 maobibo [拒绝了](https://lore.kernel.org/loongarch/286be0a6-dac3-b2cd-e88a-e6feb5a240de@loongson.cn/)。如果该补丁被接受，则将成为
Linux LoongArch 子系统接受的第一笔来自中国移动员工的贡献。

#### 第 57 期 (2024-07-16 ~ 2024-07-22) {#linux-57}

Bibo Mao [实现了](https://lore.kernel.org/loongarch/20240716125831.1621975-1-maobibo@loongson.cn/)
`kvm_arch_para_features` 函数，以便从虚拟机监管程序（hypervisors）获取虚拟化特性的支持信息等。

Conor Dooley 从 2K1000 参考板的设备树[移除了](https://lore.kernel.org/loongarch/20240717-preacher-sandal-2aeffa322b9f@spud/)一个不存在的芯片——不光板子上没有，实际上原文提到的芯片型号就不存在！毕竟再怎么说，「声明一个不存在的设备来实现绑定某个驱动的效果」这件事情本身就不可接受。

来自华为的 Jinjie Ruan 为龙架构的系统调用路径[增加了](https://lore.kernel.org/loongarch/20240718124739.3834489-1-ruanjinjie@huawei.com/)随机的栈偏移量，增强了安全。

#### 第 58 期 (2024-07-23 ~ 2024-07-29) {#linux-58}

Huacai Chen [修复了](https://lore.kernel.org/loongarch/20240723064508.35560-1-chenhuacai@loongson.cn/)
Miao Wang 报告的 `lpic_gsi_to_irq` 在 `acpi_register_gsi` 失败时，错误地返回了非 0 值的问题。

Bibo Mao 为 LoongArch KVM 半虚拟化（paravirtualization）[实现了](https://lore.kernel.org/loongarch/20240723073825.1811600-1-maobibo@loongson.cn/)快速自旋锁（qspinlock）。在双路共计 32
核的 3C5000 宿主机器上，启动两个虚拟机并在其中均进行 `kcbench` 测量编译内核所需时间，取得了性能上 566% 的提升。

Dandan Zhang（来自统信软件，非龙芯 Debian 团队的拼音同名人物）[移除了](https://lore.kernel.org/loongarch/6D5128458C9E19E4+20240725134820.55817-1-zhangdandan@uniontech.com/)
LoongArch KVM Hypercall 文档中对尚未用到的 `$a6` 寄存器的描述。

Miao Wang 将龙架构的 EFI 关机行为[切换到了](https://lore.kernel.org/loongarch/4113cec4-4b4a-11ef-9897-937fbcdc8b5d@innull.com/)与 arm 和 x86 架构类似：通过
EFI 运行时服务实现关机，而非专门的一个指针。

#### 第 59 期 (2024-07-30 ~ 2024-08-05) {#linux-59}

Tiezhu Yang [处理了](https://lore.kernel.org/loongarch/20240730061901.21485-1-yangtiezhu@loongson.cn/) objtool 就 LoongArch `do_syscall` 发出的警告。

WangYuli 与 Bibo Mao、Xianglai Li 合作，[提交了](https://lore.kernel.org/loongarch/04DAF94279B88A3F+20240731055755.84082-1-wangyuli@uniontech.com/)解释作为
LoongArch KVM guest 身份时，如何利用半虚拟化特性的文档。

第 58 期 Bibo Mao 为半虚拟化环境增加了 qspinlock 支持，但随即又放弃了这一思路。相反，Bibo
[换用了](https://lore.kernel.org/loongarch/20240805070421.574500-1-maobibo@loongson.cn/)与
x86 相同的策略：如检测到虚拟化环境，则回退到简单的锁实现。神奇的是：这一版的性能测试结果与上一版完全相同。

Arnd Bergmann [修复了](https://lore.kernel.org/loongarch/20240801123305.2392874-1-arnd@kernel.org/)先前做 `syscall.tbl` 重构时不慎影响到的 `__NR_newfstat{,at}` 符号名。此外，还将
`newstat` ABI 关键字移除了——现在龙架构也有这两个系统调用了，使它们再度对所有架构达成完全覆盖。

Haowei Zheng [贴出了](https://lore.kernel.org/loongarch/20240804063610.69873-1-zhenghaowei@loongson.cn/)适用龙芯 3 号、龙芯 2K 系列以及 LS7A 桥片的串口（UART）驱动。从提交说明看，「特定的硬件设计挑战」（certain hardware design challenges）使得 :ta: 们不得不专门写一个
UART 驱动来探测硬件。

#### 第 60 期 (2024-08-06 ~ 2024-08-12) {#linux-60}

Huacai Chen [确保了](https://lore.kernel.org/loongarch/20240806070706.128005-1-chenhuacai@loongson.cn/)所有对页表项的存取操作都通过 getter/setter
间接进行——实质上是确保受到 `{READ,WRITE}_ONCE` 这对宏的保护。这是由于 LoongArch 与
AArch64 类似，硬件页表遍历设施都有可能在遍历时同时修改页表项，因此需要确保对页表项的访问不被编译器重排。

Huacai Chen 还[实现了](https://lore.kernel.org/loongarch/20240806070724.128023-1-chenhuacai@loongson.cn/)
`set_memory_{ro,rw,x,nx}` 钩子，用来改变内存页的属性，并标记了 `ARCH_HAS_SET_MEMORY`。

Huacai Chen 还[实现了](https://lore.kernel.org/loongarch/20240806070742.128064-1-chenhuacai@loongson.cn/)
`set_direct_map_*` 钩子，修复了休眠过程中的 KFENCE 警告，并标记了 `ARCH_HAS_SET_DIRECT_MAP`。

Bibo Mao 为 LoongArch KVM [新增了](https://lore.kernel.org/loongarch/20240808083638.205659-1-maobibo@loongson.cn/)
haltpoll 功能，意为允许 vCPU 在停机之前进行一段时间的轮询，有一定的性能好处。

Miao Wang [移除了](https://lore.kernel.org/loongarch/20240812-clean-dma-direct-v1-1-cbe19c2b73f5@gmail.com/)目前已经没有作用的
`asm/dma-direct.h` 头文件。

#### 第 61 期 (2024-08-13 ~ 2024-08-19) {#linux-61}

Bibo Mao [修复了](https://lore.kernel.org/loongarch/20240815071545.925867-1-maobibo@loongson.cn/)
KVM 虚拟机有时会重启失败的问题。修复之后可以连续重启 2000 次均成功了。

Xi Ruoyao 将 Jason Donenfeld 的 vDSO `getrandom` 工作[移植到了](https://lore.kernel.org/loongarch/20240816110717.10249-1-xry111@xry111.site/) LoongArch，在该系统调用上取得了一个数量级的性能提升。

#### 第 62 期 (2024-08-20 ~ 2024-08-26) {#linux-62}

Miao Wang 对 Greg Kroah-Hartman 把先前恢复 `fstat` `newfstatat` 系统调用的提交向后移植（backport）到了稳定分支的做法[表示了](https://lore.kernel.org/loongarch/DF762B6F-360A-4C0C-8C85-55686417209B@gmail.com/)疑问。讨论中：不同人站在不同立场，对一个变更到底属不属于「修复」会有不同看法；只要有人认为缺少这两个系统调用是「缺陷」，那么恢复它们的行为就是「修复」，就可以进入稳定分支。在讨论中，Willy Tarreau 更是[抛出了](https://lore.kernel.org/loongarch/ZsTgxUndhb04snd6@1wt.eu/)十分值得推敲的金句：

> As a rule of thumb, just keep in mind that anything that needs to get
> fix will eventually be fixed.
>
> 一条黄金法则：任何需要修复的东西最终都会被修复，只要记住这个就好了。

Zhao Qunqin [贴出了](https://lore.kernel.org/loongarch/20240821064728.8642-1-zhaoqunqin@loongson.cn/)龙芯内存控制器的 EDAC 功能驱动。龙架构的（新世界）服务器系统终于能感知到内存 ECC 错误了……

Jiaxun Yang [尝试重构了](https://lore.kernel.org/loongarch/20240821-loongarch_archnuma-v1-0-f47b191beee8@flygoat.com/)
LoongArch 的 NUMA 支持代码，将其改写为基于公共基础设施的实现，但由于缺乏真机测试而被
Huacai Chen [婉拒了](https://lore.kernel.org/loongarch/CAAhV-H68HR+GGyez330=b-AiUgbHhfjrEwY0aezq+-NraJvBGw@mail.gmail.com/)。

#### 第 63 期 (2024-08-27 ~ 2024-09-02) {#linux-63}

Xi Ruoyao 在调试其他问题的过程中，发现并[移除了](https://lore.kernel.org/loongarch/20240828031421.147944-2-xry111@xry111.site/)
`sigcontext.h` 中一处可追溯至 2005 年的无用 MIPS 遗产。

Huacai Chen [修复了](https://lore.kernel.org/loongarch/20240828062459.1853837-1-chenhuacai@loongson.cn/)
Xi Ruoyao 报告的 `loongson3` cpufreq 驱动对 SMP 处理器号的使用方式错误。

Wentao Guan [堵上了](https://lore.kernel.org/loongarch/20240831052157.13532-1-guanwentao@uniontech.com/)
LoongArch PCI 代码的一处内存泄漏。

#### 第 64 期 (2024-09-03 ~ 2024-09-09) {#linux-64}

Uros Bizjak [简化了](https://lore.kernel.org/loongarch/20240905065438.802898-1-ubizjak@gmail.com/) percpu 操作实现。

Binbin Zhou [打磨了](https://lore.kernel.org/loongarch/cover.1725518229.git.zhoubinbin@loongson.cn/)一些龙芯 I2S 集成声卡方案的细节。

Binbin Zhou 还[单纯重构了](https://lore.kernel.org/loongarch/cover.1725844530.git.zhoubinbin@loongson.cn/)一些代码使其更可读。

Huacai Chen [改进了](https://lore.kernel.org/loongarch/20240905151528.3029082-1-chenhuacai@loongson.cn/)硬件页表遍历的实现。

Julian Vetter [简化了](https://lore.kernel.org/loongarch/20240910134341.2537407-1-jvetter@kalrayinc.com/) I/O 内存的 `memcpy` 操作实现，并将 arm64、csky
与龙架构切换至了通用实现。

Bibo Mao 为龙架构[启用了](https://lore.kernel.org/loongarch/20240909015514.597253-1-maobibo@loongson.cn/)
ACPI BGRT（开机画面）的支持。这有助于龙架构系统开机时从第一屏画面平滑过渡到图形界面。

#### 第 65 期 (2024-09-10 ~ 2024-09-16) {#linux-65}

Nathan Chancellor [修复了](https://lore.kernel.org/loongarch/20240916-loongarch-kvm-eiointc-fix-sometimes-uninitialized-v1-1-85142dcb2274@kernel.org/)一处使用未初始化变量的错误。

#### 第 66 期 (2024-09-17 ~ 2024-09-23) {#linux-66}

Xi Ruoyao [微调了](https://lore.kernel.org/loongarch/20240919091359.7023-1-xry111@xry111.site/)
vDSO `getrandom` 的 ChaCha 算法实现，在 LA664 微架构上取得了 5% 的性能提升。

Miguel Ojeda [报告了](https://lore.kernel.org/loongarch/CANiq72mNeCuPkCDrG2db3w=AX+O-zYrfprisDPmRac_qh65Dmg@mail.gmail.com/) Rust for Linux 在龙架构默认配置（defconfig）出现了
objtool 警告。

#### 第 67 期 (2024-09-24 ~ 2024-09-30) {#linux-67}

Binbin Zhou 将龙芯 2 号 APB 驱动的前缀 `ls2x` [改为了](https://lore.kernel.org/loongarch/20240924064241.2414629-1-zhoubinbin@loongson.cn/) `loongson2`。

Tiezhu Yang 为跳表所在的节（section）[指定了](https://lore.kernel.org/loongarch/20240924062710.1243-1-yangtiezhu@loongson.cn/)正确的节属性。

Tiezhu Yang 还为龙架构[启用了](https://lore.kernel.org/loongarch/20240924062001.31029-1-yangtiezhu@loongson.cn/)架构无关的 CPU 安全漏洞报告机制，并将目前所有已知漏洞（基本是
x86 平台的，其中有少量在 ARM 平台也能复现）都标记为了「不受影响」。

Huacai Chen [修复了](https://lore.kernel.org/loongarch/20240930045452.3946322-1-chenhuacai@loongson.cn/)
vDSO 代码映射大小的计算方式。解决了 vDSO `getrandom` 支持被合并之后，由于撑大了 vDSO
体积，从而炸掉了 4KiB 页内核配置的问题：先前写死了只有一个页，现在放不下了。

#### 第 69 期 (2024-10-08 ~ 2024-10-14) {#linux-69}

Huacai Chen [修复了](https://lore.kernel.org/loongarch/20241013090136.1254036-1-chenhuacai@loongson.cn/)实时（`PREEMPT_RT`）内核配置下的一处调度 bug。

Bibo Mao [修复了](https://lore.kernel.org/loongarch/20241014035855.1119220-1-maobibo@loongson.cn/) `vmalloc` 测试套件所暴露的问题。

Bibo Mao 还[修复了](https://lore.kernel.org/loongarch/20241014063328.1216497-1-maobibo@loongson.cn/)
CPU 热插拔的一些问题，但在具体的技术细节上与 Huacai Chen 起了争执，看上去有一些内部讨论未能解决的分歧被带到了公开场合。目前 Huacai Chen 在征求合作者 Jianmin Lv 的想法。

Thomas Weißschuh 为龙架构[适配了](https://lore.kernel.org/loongarch/20241014-kunit-loongarch-v1-0-1699b2ad6099@linutronix.de/)内核单元测试框架 KUnit。

#### 第 70 期 (2024-10-15 ~ 2024-10-21) {#linux-70}

Huacai Chen [修复了](https://lore.kernel.org/loongarch/20241018035920.1059661-1-chenhuacai@loongson.cn/)内核对龙芯引导参数的初始化方式：一个「核」应该指的是逻辑核。

Huacai Chen 还[确保了](https://lore.kernel.org/loongarch/20241018035958.1060381-1-chenhuacai@loongson.cn/)在处理非对齐访存例外时，如果先前中断处于开启状态，处理时也要开中断。

Kanglong Wang 与 Huacai Chen [修复了](https://lore.kernel.org/loongarch/20241018040024.1060903-1-chenhuacai@loongson.cn/)虚拟地址宽度不足 48 位时 KASAN 不能工作的问题。

Yanteng Si [改写了](https://lore.kernel.org/loongarch/20241021105139.50087-1-siyanteng@cqsoftware.com.cn/)一处比它注释的代码信息量还少的注释内容。

#### 第 71 期 (2024-10-22 ~ 2024-10-28) {#linux-71}

Binbin Zhou [修复了](https://lore.kernel.org/loongarch/20241028093413.1145820-1-zhoubinbin@loongson.cn/)
`loongson2-apb` 驱动中使用 `GENMASK`（`unsigned long` 类型）操作高 32 位，导致在 32 位系统上出现未定义行为的问题。


#### 第 72 期 (2024-10-29 ~ 2024-11-04) {#linux-72}

Huacai Chen 为 LoongArch 上的 KASAN
[适配了](https://lore.kernel.org/loongarch/20241030081043.3430381-1-chenhuacai@loongson.cn/)
5 级页表。

Huacai Chen 还为虚拟地址宽度太窄的 CPU [禁用了](https://lore.kernel.org/loongarch/20241030081110.3431220-1-chenhuacai@loongson.cn/) KASAN：否则会启动失败。

Huacai Chen 还[修复了](https://lore.kernel.org/loongarch/20241102033616.3517188-1-chenhuacai@loongson.cn/)
6.1.x 稳定分支的一起由 backport 导致的构建错误。

Andy Shevchenko [处理了](https://lore.kernel.org/loongarch/20241031134719.2508841-1-andriy.shevchenko@linux.intel.com/) `loongson3_cpufreq` 驱动中一处先前未处理的错误。

WangYuli 给龙架构[补充了](https://lore.kernel.org/loongarch/1BC681DB785E0181+20241102054042.74847-1-wangyuli@uniontech.com/) `VM_DATA_DEFAULT_FLAGS` 的默认值定义。

#### 第 73 期 (2024-11-05 ~ 2024-11-11) {#linux-73}

Kanglong Wang [补充了](https://lore.kernel.org/loongarch/20241105122945.21886-1-wangkanglong@loongson.cn/)龙架构 DMW2 的各项属性定义，修复了
`CONFIG_ARCH_IOREMAP`、`CONFIG_ARCH_WRITECOMBINE` 与 KASAN 同时被启用时，系统无法引导的问题。

Qunqin Zhao [修复了](https://lore.kernel.org/loongarch/20241107032859.18276-1-zhaoqunqin@loongson.cn/)进入
ACPI S3 睡眠状态时的一处警告。

Huacai Chen 为龙架构[启用了](https://lore.kernel.org/loongarch/20241119065230.19157-1-yangtiezhu@loongson.cn/)实时内核（`PREEMPT_RT`）支持！配合一些额外的系统参数调整，可以获得相对不错的实时调度效果。这有望降低已有的实时 Linux 工业应用向龙架构迁移的难度。

#### 第 74 期 (2024-11-12 ~ 2024-11-18) {#linux-74}

在 10 月底[一通激烈辩论](https://lore.kernel.org/loongarch/202410220508.9OO5jJgk-lkp@intel.com/T/#ea8b507fe8af9ee6324dc06cd65e43fa09fb9f9cf)之后，Huacai Chen
[发出了](https://lore.kernel.org/loongarch/20241112063540.1135079-1-chenhuacai@loongson.cn/)第
69 期周报提到的 CPU 热插拔功能修复的最终版解决方案。

Bibo Mao [贴出了](https://lore.kernel.org/loongarch/20241113031727.2815628-1-maobibo@loongson.cn/)
给 LoongArch KVM 增加 VMID 与 VPID 取值不同能力的补丁草稿，公开征求意见（RFC）。提交说明中讲到这个硬件能力从
3A6000 开始才具备。

Qunqin Zhao 居然公开[贴出了](https://lore.kernel.org/loongarch/20241116085729.12651-1-zhaoqunqin@loongson.cn/)龙芯安全模块（Loongson Security Module，即所谓的「SE」）驱动！
尽管此模块需要搭配特定的主板设计与固件才能正常工作，但在相关公开资料全部缺失——软件部分的技术细节被从公开版本的芯片手册中全部抹除的情况下，却公开了驱动，一些看不懂。

#### 第 75 期 (2024-11-19 ~ 2024-11-25) {#linux-75}

Tiezhu Yang [符号扩展了](https://lore.kernel.org/loongarch/20241119065230.19157-1-yangtiezhu@loongson.cn/)
LoongArch BPF JIT 的 32 位返回值，解决了因为 GCC 14 及更高版本产生的 BPF 目标代码所含的冗余符号扩展操作较少，所以反而导致计算结果错误的「问题」。

Tiezhu Yang 还[指定了](https://lore.kernel.org/loongarch/20241119065051.18449-1-yangtiezhu@loongson.cn/)
LoongArch Linux 的编译应该采用 GNU C11 标准，修复了 GCC 15 下的构建失败——GCC 15 默认采用
GNU C23 标准了。

Huacai Chen [提前指定了](https://lore.kernel.org/loongarch/20241120151026.1683941-1-chenhuacai@loongson.cn/)内核所用的代码模型为
`normal`（LLVM/Rust 称之为 `small`），防止受到后续
LoongArch 工具链可能扩大默认代码模型为
`medium` 所带来的影响。`medium` 代码模型的好处主要是允许代码段（text section）超过
256MiB，而内核不需要这么大的代码段，况且目前内核的模块加载器也未适配一些 `medium`
代码模型会用到的重定位类型。

Xi Ruoyao [适配了](https://lore.kernel.org/loongarch/20241121034127.8325-2-xry111@xry111.site/)
`PREEMPT_LAZY` 抢占模型，结果 Huacai Chen [也弄了](https://lore.kernel.org/loongarch/CAAhV-H61P1Qnocn1eEOszufcj=BzC_8cPZVfTw-ui8M+nmxZdw@mail.gmail.com/)。（最后的主线提交同时包含了二人的署名。）

#### 第 76 期 (2024-11-26 ~ 2024-12-02) {#linux-76}

Bibo Mao 为龙架构[实现了](https://lore.kernel.org/loongarch/20241128083043.1208664-1-maobibo@loongson.cn/)架构相关的
`huge_pte_clear` 钩子，修复了内存子系统自我测试（mm selftest）的一条报错。

Tiezhu Yang [适配了](https://lore.kernel.org/loongarch/20241128061110.5204-1-yangtiezhu@loongson.cn/)
LoongArch 官方汇编语法的一处不对称特点，使 BPF JIT 的相关代码更符合汇编书写习惯。具体来说，虽然
`jirl` 与其他条件分支指令看上去都属于同一种官方把它叫作 2RI16 的格式，但在汇编书写上
`jirl` 的操作数遵循 `rd, rj, imm` 的正常顺序，而分支指令都被记作 `rj, rd, imm` 的相反顺序；先前在
BPF JIT 的代码中，需要按照相反的顺序书写产生 `jirl` 的函数调用。

#### 第 77 期 (2024-12-03 ~ 2024-12-09) {#linux-77}

Namhyung Kim [修复了](https://lore.kernel.org/loongarch/20241203065010.4164506-1-chenhuacai@loongson.cn/)近期
3 个 LoongArch KVM 变更忘记同步修改 `tools/` 下的头文件的小问题。

Xuefeng Zhao、Jianmin Lv、Tianyang Zhang 和 Huacai Chen 一道[适配了](https://lore.kernel.org/loongarch/20241203065010.4164506-1-chenhuacai@loongson.cn/)把显示缓冲区放在超过
4GiB（32 位）的高地址区域的固件。

Huacai Chen 向 6.1.x、6.6.x 稳定分支[移植了](https://lore.kernel.org/loongarch/20241206085810.112341-1-chenhuacai@loongson.cn/)避免使用未定义弱符号（undefined weak
a.k.a. "undef weak" symbols）的补丁，避免这些内核版本在包含[此 11 月 11 日提交](https://github.com/bminor/binutils-gdb/commit/599df6e2db17d1c4)的新版本
binutils 下无法成功链接的问题。

Huacai Chen 与 Bibo Mao [修复了](https://lore.kernel.org/loongarch/d9a79372-24bd-23bb-8030-4b903db814b5@loongson.cn/T/#e552e155b08890d2042242e83a1907b7e3dcd8048)由
lockdep 调试特性发现的两处 LoongArch KVM 锁操作使用错误。

Tianyang Zhang 为 LoongArch 高级扩展中断模型（AVEC）[增加了](https://lore.kernel.org/loongarch/20241207033146.20938-1-zhangtianyang@loongson.cn/)多节点拓扑支持。

#### 第 79 期 (2024-12-17 ~ 2024-12-23) {#linux-79}

Huacai Chen 为龙架构[默认启用了](https://lore.kernel.org/loongarch/20241217073704.3339587-1-chenhuacai@loongson.cn/)
ACPI EC 支持。特别地，龙架构笔记本的平台驱动必须依赖此支持才能工作。

Huacai Chen 还[修复了](https://lore.kernel.org/loongarch/20241217073854.3346051-1-chenhuacai@loongson.cn/)
SMT 处理器的缓存信息报告。

Huacai Chen 还[适配了](https://lore.kernel.org/loongarch/20241217073908.3347287-1-chenhuacai@loongson.cn/)公共的 `vmap` 保护措施，确保这条代码路径不会把现有的页重新映射为可执行。

Tiezhu Yang [修改了](https://lore.kernel.org/loongarch/20241219111506.20643-1-yangtiezhu@loongson.cn/)
BPF 自我测试（selftest）中的一处 `o` 汇编操作数约束为 `m`，因为 LoongArch LLVM 不支持
`o` 约束。

Masahiro Yamada 将 LoongArch 的内置 DTB 构建系统配置[迁移到了](https://lore.kernel.org/loongarch/20241222001230.2579074-1-masahiroy@kernel.org/)通用设施。

Bibo Mao 为 LoongArch KVM [增加了](https://lore.kernel.org/loongarch/20241223084212.34822-1-maobibo@loongson.cn/)用户态 hypercall 的能力。

#### 第 80 期 (2024-12-24 ~ 2024-12-30) {#linux-80}

Binbin Zhou [修正了](https://lore.kernel.org/loongarch/20241225060600.3094154-1-zhoubinbin@loongson.cn/)龙芯 2 号时钟源驱动的编号处理错误。

Binbin Zhou 还[贴出了](https://lore.kernel.org/loongarch/cover.1735550269.git.zhoubinbin@loongson.cn/)龙芯
2K0500 BMC 的主线支持补丁，包含 IPMI、帧缓冲（BMC 显示）以及重启支持。

#### 第 81 期 (2024-12-31 ~ 2025-01-06) {#linux-81}

新年快乐！

在过去的一年里，我们看到许多高校同学以及产业界伙伴都开始基于 LA32R 或 LA32S 这两种 32 位的
LoongArch 开展工作，但略显遗憾的是，龙芯方面一直未主动推进其 32 位架构支持的主线化；这使得有需要的朋友只能向龙芯单独获取相关资料，而这经常意味着签订 NDA 或支付额外费用。鉴于此，Jiaxun Yang
动手[搓出了](https://lore.kernel.org/loongarch/20250102-la32-uapi-v1-0-db32aa769b88@flygoat.com/)一版
LA32 Linux 系统调用接口草稿，以便开展验证工作。（xen0n 先前发起英雄帖的时候，认为实现裸机支持足矣，毕竟以很多
LA32 硬件的能力跑起 Linux 并不舒服；看起来这个观点在 LoongArch 社区常客并不吃香。）

目前，已经可以使用 Clang 工具链编出试验性的 LA32 Linux 内核与 musl libc 及相应的最小系统，在
QEMU 环境跑起测试用例了。

LA32 支持是一项[社区英雄帖][la32-call-for-hero]工作。

Huacai Chen [重构了](https://lore.kernel.org/loongarch/20241231075353.1458674-1-chenhuacai@loongson.cn/)
`bug_handler` 的实现。

Tiezhu Yang [处理了](https://lore.kernel.org/loongarch/20241231072806.4936-1-yangtiezhu@loongson.cn/)
AMD GPU 显示引擎驱动中的 objtool 警告。这是由于 Clang 现在如果看到除法或取余操作触发未定义行为（UB），则[会认为](https://github.com/llvm/llvm-project/commit/37932643abab)整个代码路径都不可达（unreachable）——毕竟「未定义行为」代表「怎么处理都正确」。

#### 第 82 期 (2025-01-07 ~ 2025-01-13) {#linux-82}

Huacai Chen [修正了](https://lore.kernel.org/loongarch/20250107062236.940829-1-chenhuacai@loongson.cn/)汇编源码注释中的 `__switch_to` 等效 C 函数签名，使其与
`switch_to.h` 中的声明一致。

Binbin Zhou [修正了](https://lore.kernel.org/loongarch/20250107103856.1037222-1-zhoubinbin@loongson.cn/)龙芯
2K2000 在 ACPI 固件下的 GPIO 寄存器偏移量。

Huacai Chen 还[贴出了](https://lore.kernel.org/loongarch/20250109063056.2438304-1-chenhuacai@loongson.cn/)一个神秘补丁：为了「调试内存管理与 KVM 虚拟化子系统」，需要开关微架构的
SFB[^sfb] 和 TSO 内存序。等等——龙芯也有 Apple Silicon 那种加速 x86 访存操作模拟的硬件 TSO 开关？

不过该补丁也有个小问题：它是全局开关，但这么做似乎不太安全——至少 TSO 因为会影响程序语义，所以应该是每个线程的单独配置，毕竟全局开着它会让本来可以更自由重排的访存操作变得序列化，从而影响原生代码的性能，而且也可能掩盖掉本应在默认的弱一致性内存模型下暴露的并发问题。并且，它位于 debugfs，所以需要 root 权限才能访问；而如果有什么二进制翻译器想要「利用」这个功能，它大概率不是运行在 root 身份的，所以也用不上。

[^sfb]: Store Fill Buffer，龙芯的独门绝技之一：合并写请求，从 3A2000 以来一直在提升访存性能，也一直在制造原子性、缓存管理等等相关问题。

#### 第 83 期 (2025-01-14 ~ 2025-01-20) {#linux-83}

Tiezhu Yang [迭代了](https://lore.kernel.org/loongarch/20250114132856.19463-1-yangtiezhu@loongson.cn/)
AMD GPU 显示引擎驱动的除数可能为零问题修复补丁到第 4 版。

Qunqin Zhao 继续[贴出了](https://lore.kernel.org/loongarch/20250114095527.23722-1-zhaoqunqin@loongson.cn/)神秘的龙芯安全模块驱动……这次包含了硬件随机数生成器和加解密引擎的接口。

#### 第 84 期 (2025-01-21 ~ 2025-01-27) {#linux-84}

Huacai Chen [重构了](https://lore.kernel.org/loongarch/20250121114354.2727748-1-chenhuacai@loongson.cn/)
ACPI 睡眠的汇编实现，使两种现场：通用寄存器与栈指针的保存恢复变得分门别类（先前混在了一起）。

Huacai Chen 还[修正了](https://lore.kernel.org/loongarch/20250121093703.2660482-1-chenhuacai@loongson.cn/)龙芯集成网卡的发送/接收队列容量配置。

Tiezhu Yang 意图把内核 ptrace 接口最大支持的硬件断点数量从 8
[提升到](https://lore.kernel.org/loongarch/20250121070617.3214-1-yangtiezhu@loongson.cn/)目前 LoongArch 架构上规定的最大值
14，但在第二个补丁的提交说明里写了「可能破坏用户 API 所以直接加入一个新结构体」和「据我所知，这结构体唯一的用户态消费者是 GDB 和 LLDB，所以根据分析不会有软件兼容性问题」这么一些可疑的文字——「分析」在哪呢？

在 [xen0n] 与 [Xi Ruoyao][xry111] 对此提出疑问之后，Tiezhu Yang 发了第二版，尤其[包含了](https://lore.kernel.org/loongarch/20250122032310.26729-3-yangtiezhu@loongson.cn/)先前省略掉的详细「分析」——原来兼容性是在 ptrace 的架构无关部分保证的。这么一来补丁质量与信任度就大幅提升，不过可能还是一开始就附上这些内容会比较好 :smiling_imp:。

### 工具链 {#toolchain}

#### ABI {#abi}

##### 第 78 期 (2024-12-10 ~ 2024-12-16) {#abi-78}

[杰哥][jiegec]翻新了其先前向《LoongArch 软件开发与构建约定》[提交的][la-softdev-la32-pr]
LA32 支持，但被维护者 [zhuchen1911] 告知「相关内容仍在内部评估中，将在未来合适时机加入」——2023
年 8 月 9 号，也是这么说的（「我们仍在讨论 LoongArch32 的规范」）。

LA32 支持是一项[社区英雄帖][la32-call-for-hero]工作。

[jiegec]: https://github.com/jiegec
[zhuchen1911]: https://github.com/zhuchen1911
[la-softdev-la32-pr]: https://github.com/loongson/la-softdev-convention/pull/1
[la32-call-for-hero]: https://github.com/loongson-community/discussions/issues/65

##### 第 79 期 (2024-12-17 ~ 2024-12-23) {#abi-79}

LA32 上游化工作遭受龙芯公司官方拒绝：我不推，你们也不能推！

[xen0n] 考虑到龙芯方面可能是出于对过早作出承诺的担心，而再三推迟 LA32 的主线化——推出 LA32
确实会造成它的 ABI 立即冻结，导致后续迭代困难——于是提议将 LA32 支持放在一个命令行开关背后。比方说，使用
`-mloongarch-unstable-feature=20241217` 表示「明确要求 20241217 时间点的不稳定功能」；这样一来就同时实现了：

* 有需求的用户明确知道自己在使用开发中的特性；
* 无需求的用户不受任何影响，且不可能不慎依赖这些特性；
* 基础设施开发者仍然保有随时迭代这些特性，甚至引入不兼容变更的自由；
* 即使开发中的特性发生了不兼容变更，旧的代码仍然能够按照先前的行为正常构建，因为当初肯定传入了带有正确时间戳的命令行标志。

随后，Huacai Chen 在 PR 上做了「同意」的评论（但他没有这个仓库的写权限，所以打的勾是灰的）。

但维护者 zhuchen1911 反手就关闭了 PR 并说「对此文档的修改需要部门与公司级别审查，我没有权限同意合并」！

xen0n 提醒道：那可以留着 PR 在打开状态？因为按照 GitHub 等协作平台的使用习惯，「关闭 PR」这个动作一般表示「我们拒绝合并」。但既然「我没有权限同意合并」，那么也应该没有权限拒绝才对……

FlyGoat 也冒泡表示赞同尽快跟进此项规范更新，因为社区已经在基于 LLVM 对 ILP32 ABI 的实验性支持，推进
LA32 工作有一阵子了。如果龙芯公司可以尽快将这些规范批准（ratify）下来，这将非常有利于后续的工作协调。

于是管理员（不一定是 zhuchen1911）出手把 PR 锁了，你们都别说话！

目前相关社区同学正与龙芯方面协调，争取消除误会——社区同学当然无意做龙芯的对立面，否则从一开始就用不着跟龙芯协调了。

在此之外，在 ELF psABI 方面，[xry111] [贴出了](https://github.com/loongson/la-abi-specs/pull/14)一版为了支持
LA32 所需新增的重定位类型草稿供讨论。不得不这么做：

* LA32 没有 `pcaddu18i`，因此无法使用 `R_LARCH_CALL36`，必须提供一个较小的 `R_LARCH_CALL32`
  以支持 `medium` 代码模型。
* LA32 不一定有 `pcalau12i`，而大部分现有的重定位操作都需要搭配它使用，所以都不能用。必须为几种基本的地址计算操作分别提供新的重定位类型，搭配 `pcaddu12i` 使用：
    * `la.pcrel` - `R_LARCH_32R_PCREL`
    * `la.got` - `R_LARCH_32R_GOT_PCREL`
    * `la.tls.ie` - `R_LARCH_32R_TLS_IE_PCREL`
    * `la.tls.desc` - `R_LARCH_32R_TLS_DESC_PCREL`

但 FlyGoat [指出](https://github.com/loongson/la-abi-specs/pull/14#issuecomment-2559776375)：目前例如
`call36` 的写法有一些理解门槛，因为一条重定位操作会修改两条指令，并且后一条指令在书写上需要假装它有一个取
0 的立即数。所以在设计新 ABI 的时候，让两条指令上都带重定位操作可能是更好的选择。xry111 采纳了该建议，将提交一版新的规范变更。

LA32 支持是一项[社区英雄帖][la32-call-for-hero]工作。

##### 第 80 期 (2024-12-24 ~ 2024-12-30) {#abi-80}

经过社区同学的外交工作，上期的风波一天之后即告解除：zhuchen1911 先前未告知清楚 :ta:
所维护的《LoongArch 软件开发与构建约定》其实是 LoongArch ABI 文档与《LoongArch 工具链约定》两篇规范文档的下位规范，因此 :ta: 看到上位规范尚未得到更新，就准备把下位规范的更新拒绝了。在与社区同学与龙芯内部其他一些相关团队沟通之后，得知
LA32 工作其实有原则上的同意，zhuchen1911 便重新开启了该 PR，并重新开放了评论区。

沟通万岁！

在 LA32 ELF psABI 设计方面，[xry111] 按照上一期 FlyGoat 的建议，[提交了](https://github.com/loongson/la-abi-specs/pull/16)新一版的设计，取代了先前的方案。新的方案采用 RISC-V 的做法，让后一条重定位操作指向同一次地址计算的前一条重定位操作，因此允许了把同一个地址计算操作涉及的两条指令放置在不相邻的位置，也能使汇编器检查所用指令是否正确。

LA32 支持是一项[社区英雄帖][la32-call-for-hero]工作。

##### 第 81 期 (2024-12-31 ~ 2025-01-06) {#abi-81}

新年快乐！

在 LA32 ELF psABI 设计方面，xry111 的新版设计受到了 FlyGoat、jiegec 与 chenhuacai 的欢迎；来自龙芯工具链团队的 cloudspurs 也表示将基于此设计推进 binutils 的适配工作。jiegec 由于个人事务繁忙，也允许了
cloudspurs 接手他的那部分工作。

LA32 支持是一项[社区英雄帖][la32-call-for-hero]工作。

#### binutils {#binutils}

##### 第 52 期 (2024-06-10 ~ 2024-06-17) {#binutils-52}

[xry111] 参考 [AArch64 实现](https://sourceware.org/pipermail/binutils/2024-May/134367.html)，为 Binutils 的 BFD 链接器[增加了](https://sourceware.org/pipermail/binutils/2024-June/135261.html)在 LoongArch ELF 中使用 RELR 格式编码相对重定位 (relative relocation) 记录的功能。随后 Alan Modra [修复了](https://sourceware.org/pipermail/binutils/2024-July/135464.html) [xry111] 写错的一处测试。使用 RELR 格式编码相对重定位能有效缩减一些位置无关可执行文件 (PIE) 和动态链接库的大小，详见 [Maskray 的文章](https://maskray.me/blog/2021-10-31-relative-relocations-and-relr)。

该功能已随 Binutils-2.43 发布，发行版维护者和其他打包者在构建软件包时可以在 LDFLAGS 中加入 `-Wl,-z,pack-relative-relocs` 以启用它。但是 [xry111] 后续发现并[修复了](https://sourceware.org/pipermail/binutils/2024-August/136147.html)其中的两处 bug，它们可能导致一些软件包在启用 RELR 时构建失败，而这两处修复并未赶上 Binutils-2.43 的发布。所幸，上游为处理一些更严重的 bug 发布了 Binutils-2.43.1，也顺便包含了这两处修复。

在编写和测试 RELR 支持的过程中，[xry111] 注意到了 BFD 链接器存在的一些问题：

- 链接器将可重定位目标文件中无法在链接时解决的 `R_LARCH_32` 转化为 `R_LARCH_RELATIVE`，而动态链接器在 64 位环境下处理后者时一定会直接写入 8 字节 (即 64 位) 值，会发生越界。在实际的 64 位代码中几乎不可能存在此类 `R_LARCH_32` 重定位，因此该问题在之前并未被注意到。[xry111] [加强了](https://sourceware.org/pipermail/binutils/2024-June/135260.html)链接器的检查，使其在链接 64 位代码时如发现无法在链接时解决的 `R_LARCH_32` 就直接报错 (这和 64 位 x86 和 RISC-V 对 `R_X86_64_32` 和 `R_RISCV_32` 的处理方法相同)。
- 如共享库定义并调用了多个 GNU indirect function (IFUNC)，且它们的可见性 (visbility) 不完全相同，则链接器在链接该共享库时会搞乱 PLT 表项和 PLT 重定位记录的对应关系，导致丢失重定位记录。由于实际的动态链接库中这种情况较为少见，且即使出现这种情况，丢失的往往恰好是一条对于 `__dso_handle` 的相对重定位记录，通常不会造成严重后果。然而，在引入 RELR 后，这条相对重定位记录被以 RELR 格式压缩编码，这时该 bug 会导致其他重定位丢失，触发 Glibc 测试失败。[xry111] [调整了](https://sourceware.org/pipermail/binutils/2024-June/135263.html)分配 PLT 表项的顺序，使之和分配重定位记录的顺序一致，解决了该问题。
- 一些旧版编译器会试图在主程序中不经过 GOT 寻址共享库中的函数，链接器为了在此情况下保证函数指针比较操作的结果正确，不得不将共享库中具有 protected 可见性的函数视为可抢占 (preemptible) 的。然而 LoongArch 根本没有这样的旧版编译器 (即使“旧世界”编译器也不会这样做)，且由于复制重定位 (copy relocation) 已被废弃，未来也不会有人试图让编译器这样做。因此完全可以将共享库中的 protected 函数视为不可抢占，以略微提高共享库的性能。[xry111] 据此[修改了](https://sourceware.org/pipermail/binutils/2024-June/135262.html)链接器，使之不再将共享库中的 protected 函数视为可抢占。
- 链接器为 initial-exec 的线程本地存储 (TLS) 重定位多分配了一条重定位记录的空间，导致 `libc.so.6` 等共享库中出现空操作重定位 (`R_LARCH_NONE`)。[xry111] [修复了](https://sourceware.org/pipermail/binutils/2024-June/134902.html)该问题。
- 链接器[无法链接](https://sourceware.org/pipermail/binutils/2024-June/134876.html)使用旧的基于栈的重定位类型的可重定位目标文件。[xry111] 建议取消对这些重定位类型的支持，但 mengqinggang [认为](https://sourceware.org/pipermail/binutils/2024-June/134909.html)在特定情况下这些重定位类型仍然可能有用，故 Lulu Cai [修复了](https://sourceware.org/pipermail/binutils/2024-June/134897.html)该问题。但由于 [xry111] 不想处理这些旧的重定位类型，在启用 RELR 时链接器将拒绝接受它们。
- 测试套件中存在无用的 MIPS 遗产，[xry111] [删除了](https://sourceware.org/pipermail/binutils/2024-June/135022.html)它们。
- 链接器松弛 (relaxation) 过程使用的算法渐进复杂度[有改进空间](https://github.com/loongson-community/discussions/issues/56)，尚未解决。[xry111] 猜测该问题可能是导致链接 Python 非常缓慢的原因。
- 链接器松弛过程[不必要地保留了 GOT 表项](https://github.com/loongson-community/discussions/issues/58)，尚未解决。

##### 第 53 期 (2024-06-18 ~ 2024-06-24) {#binutils-53}

##### 第 54 期 (2024-06-25 ~ 2024-07-01) {#binutils-54}

##### 第 55 期 (2024-07-02 ~ 2024-07-08) {#binutils-55}

##### 第 56 期 (2024-07-09 ~ 2024-07-15) {#binutils-56}

##### 第 57 期 (2024-07-16 ~ 2024-07-22) {#binutils-57}

##### 第 58 期 (2024-07-23 ~ 2024-07-29) {#binutils-58}

##### 第 59 期 (2024-07-30 ~ 2024-08-05) {#binutils-59}

##### 第 60 期 (2024-08-06 ~ 2024-08-12) {#binutils-60}

##### 第 61 期 (2024-08-13 ~ 2024-08-19) {#binutils-61}

##### 第 62 期 (2024-08-20 ~ 2024-08-26) {#binutils-62}

##### 第 63 期 (2024-08-27 ~ 2024-09-02) {#binutils-63}

##### 第 64 期 (2024-09-03 ~ 2024-09-09) {#binutils-64}

##### 第 65 期 (2024-09-10 ~ 2024-09-16) {#binutils-65}

##### 第 66 期 (2024-09-17 ~ 2024-09-23) {#binutils-66}

##### 第 67 期 (2024-09-24 ~ 2024-09-30) {#binutils-67}

##### 第 68 期 (2024-10-01 ~ 2024-10-07) {#binutils-68}

##### 第 69 期 (2024-10-08 ~ 2024-10-14) {#binutils-69}

##### 第 70 期 (2024-10-15 ~ 2024-10-21) {#binutils-70}

##### 第 71 期 (2024-10-22 ~ 2024-10-28) {#binutils-71}

##### 第 72 期 (2024-10-29 ~ 2024-11-04) {#binutils-72}

##### 第 73 期 (2024-11-05 ~ 2024-11-11) {#binutils-73}

##### 第 74 期 (2024-11-12 ~ 2024-11-18) {#binutils-74}

##### 第 75 期 (2024-11-19 ~ 2024-11-25) {#binutils-75}

##### 第 76 期 (2024-11-26 ~ 2024-12-02) {#binutils-76}

##### 第 77 期 (2024-12-03 ~ 2024-12-09) {#binutils-77}

##### 第 78 期 (2024-12-10 ~ 2024-12-16) {#binutils-78}

##### 第 79 期 (2024-12-17 ~ 2024-12-23) {#binutils-79}

##### 第 80 期 (2024-12-24 ~ 2024-12-30) {#binutils-80}

##### 第 81 期 (2024-12-31 ~ 2025-01-06) {#binutils-81}

##### 第 82 期 (2025-01-07 ~ 2025-01-13) {#binutils-82}

##### 第 83 期 (2025-01-14 ~ 2025-01-20) {#binutils-83}

##### 第 84 期 (2025-01-21 ~ 2025-01-27) {#binutils-84}

#### GCC {#gcc}

##### 第 52 期 (2024-06-10 ~ 2024-06-17) {#gcc-52}

[xry111] [使得](https://gcc.gnu.org/r15-1674) GCC 估算 RTL 表达式成本时考虑使用 `bstrins.[wd]` 指令的情况，以在更多情况下使用 `bstrins.[wd]` 指令。

##### 第 53 期 (2024-06-18 ~ 2024-06-24) {#gcc-53}

##### 第 54 期 (2024-06-25 ~ 2024-07-01) {#gcc-54}

##### 第 55 期 (2024-07-02 ~ 2024-07-08) {#gcc-55}

##### 第 56 期 (2024-07-09 ~ 2024-07-15) {#gcc-56}

[xry111] 参考 [RISC-V 实现](https://gcc.gnu.org/pipermail/gcc-patches/2024-July/656055.html)，使用 `fclass.[sd]` 指令[实现了](https://gcc.gnu.org/pipermail/gcc-patches/2024-July/656972.html) `__builtin_isinf`，`__builtin_isnormal`，以及 `__builtin_isfinite` 操作。和平台无关的默认实现相比，使用 `fclass.[sd]` 指令需要的指令数更少，且不需要从内存加载常量，还能够规避[在处理 signaling NaN 时触发 IEEE-754 标准不允许的浮点异常](https://gcc.gnu.org/PR66462)。该实现依赖于 [value range 支持](https://gcc.gnu.org/pipermail/gcc-patches/2024-July/657883.html) (否则会在一些情况下劣化代码并引发测试失败)。目前该实现已在 value range 支持[合并](https://gcc.gnu.org/r15-2924)后被[合并](https://gcc.gnu.org/r15-2931)。

##### 第 57 期 (2024-07-16 ~ 2024-07-22) {#gcc-57}

在测试上述 `fclass.[sd]` 支持时，[xry111] 注意到在一些情况下 GCC 生成的 LoongArch 代码中有冗余的符号扩展操作，而其生成的 RISC-V 代码却没有这一问题。经排查，这是由于 GCC 会将符号扩展操作提到按位操作之外：这通常能将 3 次操作降为 2 次，但对于 LoongArch 或 RISC-V 这样的架构来说，却会阻碍后续优化工序将加法 (或类似运算) 和符号扩展 (或类似操作) 组合为一条 `add.w` 指令。于是 [xry111] [抄了](https://gcc.gnu.org/r15-2426) RISC-V 对该问题的解法。

在 Tiezhu Yang 的建议下，为使得 objtool 能够在启用跳转表优化时正常工作，[xry111] [增加了](https://gcc.gnu.org/pipermail/gcc-patches/2024-July/657641.html)将跳转表 (jump table) 和跳转指令的对应关系写入一个专用的 ELF section 的功能。但是内核开发者对该技术路线有[不同意见](https://lore.kernel.org/loongarch/307bcd3e-f4fe-8cc0-c557-4069c97c6072@loongson.cn/)，尚不确定最终是否会采用该方案。

##### 第 58 期 (2024-07-23 ~ 2024-07-29) {#gcc-58}

[xry111] [优化了](https://gcc.gnu.org/r15-2433) GCC 对 `__builtin_bswap32` 和 `__builtin_bswap64` 的代码生成，使之使用一条 `revb.2w` 或 `revb.d` 指令，而非毫无必要地组合使用 `revb.2h` + `rotri.w` 或 `revb.4h` + `revh.d`。

##### 第 59 期 (2024-07-30 ~ 2024-08-05) {#gcc-59}

##### 第 60 期 (2024-08-06 ~ 2024-08-12) {#gcc-60}

##### 第 61 期 (2024-08-13 ~ 2024-08-19) {#gcc-61}

##### 第 62 期 (2024-08-20 ~ 2024-08-26) {#gcc-62}

##### 第 63 期 (2024-08-27 ~ 2024-09-02) {#gcc-63}

##### 第 64 期 (2024-09-03 ~ 2024-09-09) {#gcc-64}

##### 第 65 期 (2024-09-10 ~ 2024-09-16) {#gcc-65}

##### 第 66 期 (2024-09-17 ~ 2024-09-23) {#gcc-66}

##### 第 67 期 (2024-09-24 ~ 2024-09-30) {#gcc-67}

##### 第 68 期 (2024-10-01 ~ 2024-10-07) {#gcc-68}

##### 第 69 期 (2024-10-08 ~ 2024-10-14) {#gcc-69}

##### 第 70 期 (2024-10-15 ~ 2024-10-21) {#gcc-70}

##### 第 71 期 (2024-10-22 ~ 2024-10-28) {#gcc-71}

##### 第 72 期 (2024-10-29 ~ 2024-11-04) {#gcc-72}

##### 第 73 期 (2024-11-05 ~ 2024-11-11) {#gcc-73}

##### 第 74 期 (2024-11-12 ~ 2024-11-18) {#gcc-74}

##### 第 75 期 (2024-11-19 ~ 2024-11-25) {#gcc-75}

##### 第 76 期 (2024-11-26 ~ 2024-12-02) {#gcc-76}

##### 第 77 期 (2024-12-03 ~ 2024-12-09) {#gcc-77}

##### 第 78 期 (2024-12-10 ~ 2024-12-16) {#gcc-78}

##### 第 79 期 (2024-12-17 ~ 2024-12-23) {#gcc-79}

##### 第 80 期 (2024-12-24 ~ 2024-12-30) {#gcc-80}

##### 第 81 期 (2024-12-31 ~ 2025-01-06) {#gcc-81}

##### 第 82 期 (2025-01-07 ~ 2025-01-13) {#gcc-82}

##### 第 83 期 (2025-01-14 ~ 2025-01-20) {#gcc-83}

##### 第 84 期 (2025-01-21 ~ 2025-01-27) {#gcc-84}

#### LLVM {#llvm}

##### 第 52 期 (2024-06-10 ~ 2024-06-17) {#llvm-52}

TODO: register pressure scheduler https://github.com/llvm/llvm-project/pull/95741 [heiher]

TODO: lld TLSDESC https://github.com/llvm/llvm-project/pull/94451 [wangleiat]

[heiher]: https://github.com/heiher
[wangleiat]: https://github.com/wangleiat

##### 第 53 期 (2024-06-18 ~ 2024-06-24) {#llvm-53}

##### 第 54 期 (2024-06-25 ~ 2024-07-01) {#llvm-54}

##### 第 55 期 (2024-07-02 ~ 2024-07-08) {#llvm-55}

##### 第 56 期 (2024-07-09 ~ 2024-07-15) {#llvm-56}

##### 第 57 期 (2024-07-16 ~ 2024-07-22) {#llvm-57}

##### 第 58 期 (2024-07-23 ~ 2024-07-29) {#llvm-58}

##### 第 59 期 (2024-07-30 ~ 2024-08-05) {#llvm-59}

##### 第 60 期 (2024-08-06 ~ 2024-08-12) {#llvm-60}

##### 第 61 期 (2024-08-13 ~ 2024-08-19) {#llvm-61}

##### 第 62 期 (2024-08-20 ~ 2024-08-26) {#llvm-62}

##### 第 63 期 (2024-08-27 ~ 2024-09-02) {#llvm-63}

##### 第 64 期 (2024-09-03 ~ 2024-09-09) {#llvm-64}

##### 第 65 期 (2024-09-10 ~ 2024-09-16) {#llvm-65}

##### 第 66 期 (2024-09-17 ~ 2024-09-23) {#llvm-66}

##### 第 67 期 (2024-09-24 ~ 2024-09-30) {#llvm-67}

##### 第 68 期 (2024-10-01 ~ 2024-10-07) {#llvm-68}

##### 第 69 期 (2024-10-08 ~ 2024-10-14) {#llvm-69}

##### 第 70 期 (2024-10-15 ~ 2024-10-21) {#llvm-70}

##### 第 71 期 (2024-10-22 ~ 2024-10-28) {#llvm-71}

##### 第 72 期 (2024-10-29 ~ 2024-11-04) {#llvm-72}

##### 第 73 期 (2024-11-05 ~ 2024-11-11) {#llvm-73}

##### 第 74 期 (2024-11-12 ~ 2024-11-18) {#llvm-74}

##### 第 75 期 (2024-11-19 ~ 2024-11-25) {#llvm-75}

##### 第 76 期 (2024-11-26 ~ 2024-12-02) {#llvm-76}

##### 第 77 期 (2024-12-03 ~ 2024-12-09) {#llvm-77}

##### 第 78 期 (2024-12-10 ~ 2024-12-16) {#llvm-78}

##### 第 79 期 (2024-12-17 ~ 2024-12-23) {#llvm-79}

##### 第 80 期 (2024-12-24 ~ 2024-12-30) {#llvm-80}

##### 第 81 期 (2024-12-31 ~ 2025-01-06) {#llvm-81}

##### 第 82 期 (2025-01-07 ~ 2025-01-13) {#llvm-82}

##### 第 83 期 (2025-01-14 ~ 2025-01-20) {#llvm-83}

##### 第 84 期 (2025-01-21 ~ 2025-01-27) {#llvm-84}


#### Rust {#rust}

##### 第 52 期 (2024-06-10 ~ 2024-06-17)

第 50 期周报[提到的](./2024-05-30-this-week-in-loongarch-50.md#rust) LoongArch64
musl target 工作已经完成：继提案于 6 月 12 日无异议[通过](https://github.com/rust-lang/compiler-team/issues/753#issuecomment-2162011200)之后，[heiher] 便将
`loongarch64-unknown-linux-musl` target [提升到了](https://github.com/rust-lang/rust/pull/126298)
Tier 2 with Host Tools 支持层级。自 2024-06-25 开始的 Nightly Rust 都已经包含此
target 了。此功能将于 Rust 1.81 正式发布。

[xen0n] [更新了](https://github.com/rust-lang/rust/pull/127053) Rust LoongArch
targets 的文档内容：由于生态建设迅速，先前的许多信息已经与现实脱节了。

[xen0n] 还为 Rust 官方构建的 LoongArch Linux 二进制包[启用了](https://github.com/rust-lang/rust/pull/127078)一系列功能：

* 全套 LLVM 工具，含 LLD：与 x86、AArch64 等主流平台对齐。
* Rust 的性能侧写机制（profiler）：已知至少 Chromium 必须启用此功能才能构建。

[xen0n] 还[修复了](https://github.com/rust-lang/rust/pull/127150) Rust LoongArch
裸机 targets 标准库中含有 x86 构建产物的[问题](https://github.com/rust-lang/rust/issues/125908)。

此套变更不出意外也将在两三天内出现在 Nightly Rust，并于 Rust 1.81 正式发布。

[xen0n]: https://github.com/xen0n


## 杂闻播报 {#assorted-news}

TODO: memtest86+ [kilaterlee] [MarsDoge]

TODO: edk2 [MarsDoge]

TODO: zig [yxd-ym]

TODO: grub2 case-sensitivity [MingcongBai]

[kilaterlee]: https://github.com/kilaterlee
[MarsDoge]: https://github.com/MarsDoge
[MingcongBai]: https://github.com/MingcongBai
[yxd-ym]: https://github.com/yxd-ym



## 社区整活:儿: {#grins}

本栏目接受任何网友的投稿，只要内容与 LoongArch 有关，并可以为读者带来价值，
无论严肃贡献（整的大活:儿:）或是博君一笑都一概欢迎！

TODO: stable amdgpu on xa61200 with better cooling [LiarOnce]

[xry111] [使用](https://gist.github.com/xry111/88fa001fa0ac0a2e78f2cbf3b9f0839a) LBT 指令实现 GCC 的 `__builtin_add_overflow`、`__builtin_addc` 等操作。实测表明这样做生成的代码虽然指令数相比默认实现少，但跑得反而更慢。尽管理论上仍可将其用于 `-Os`，但 [xry111] 认为这样做意义不大，放弃了该实现。

[LiarOnce]: https://github.com/LiarOnce

## 张贴栏 {#bulletin}

本栏目可供张贴公益性质的各种信息。

* 您可在 GitHub [浏览](https://github.com/loongson-community/discussions/labels/%E8%8B%B1%E9%9B%84%E5%B8%96)目前所有开放的英雄帖。
* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16
