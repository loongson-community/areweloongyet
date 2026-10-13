---
slug: this-week-in-loongarch-157
title: 每周一龙：第 157 期
authors: [jokerm13]
date: 2026-06-22T02:00:00+08:00  # TODO: change to actual time in the finishing commit
tags: [每周一龙]
draft: true  # TODO: remove in the finishing commit
---

每周（尽量）为大家报道 LoongArch 社区最前线的第一手新鲜资讯！
上周的进展主要有 Linux 内核、工具链、EDK II 及发行版/操作系统等方面的技术进展。
详情点进来看！

{/* truncate */}

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

## 先「马」再看 {/* #marked-projects */}

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch 领域的重要或长期项目（坑）。

### Linux {/* #linux */}

Binbin Zhou [修复了](https://lore.kernel.org/loongarch/20260616115530.4012675-1-zhoubinbin@loongson.cn/) 龙芯 2K0500 BMC 多功能设备 (MFD) 驱动中视频模式解析中的 `iomem` 指针的不正确处理。

Bibo Mao 为龙架构[添加了](https://lore.kernel.org/loongarch/20260617074829.2396638-1-maobibo@loongson.cn/) ACPI IOVT (I/O Virtualization Table) 表的解析支持，包括 ACPI 框架扩展、PCIe 访问控制服务 (ACS) 自动启用、IOMMU 设备扫描及设备匹配逻辑等功能。

Qunqin Zhao [提交了](https://lore.kernel.org/loongarch/20260610151354.32617-1-zhaoqunqin@loongson.cn/)为龙芯安全引擎 (Security Engine) 驱动添加了多节点中断转发支持的第 3 版补丁，使用共享中断 `IRQF_SHARED` 而不是手动遍历所有设备以检查中断。

Tao Cui [提交了](https://lore.kernel.org/loongarch/20260615082154.42144-1-cui.tao@linux.dev/)为龙架构添加 KVM PV TLB (Translation Lookaside Buffer) flush（半虚拟化 TLB 刷新）支持的第 4 版补丁，移除了第 3 版中的补丁 1；审阅者 Bibo Mao [指出了](https://lore.kernel.org/loongarch/7bb86447-c5d3-7a81-5578-b1ac2419fa32@loongson.cn/)错误路径处理和替代 `hypercall` 方案等问题。

Bibo Mao [提交了](https://lore.kernel.org/loongarch/20260616022615.2141072-1-maobibo@loongson.cn/)为 FPU 添加测试用例的第 3 版补丁，修正了第 2 版中提出的问题：在补丁 2 中检查 LSX/LASX 功能时，直接使用 `__kvm_has_device_attr()`，而不是使用 `__vm_has_feature()`。

Bibo Mao [修复了](https://lore.kernel.org/loongarch/20260616084538.2274484-1-maobibo@loongson.cn/) KVM 在内核态使用了用户态的 API 的问题，将内核态的中断递送从用户态 API（`kvm_vcpu_ioctl_interrupt`）切换到内部 API（`kvm_queue_irq` 和 `kvm_dequeue_irq`）并移除注入不支持的中断号 0 时的不必要 `printk` 警告。

George Guo 为龙架构 BPF JIT [添加了](https://lore.kernel.org/loongarch/20260618033809.98253-1-dongtai.guo@linux.dev/) arena 指令门控功能、私有栈支持及异常处理支持。

Tiezhu Yang [提交了](https://lore.kernel.org/loongarch/20260615025316.24429-1-yangtiezhu@loongson.cn/)当 JIT 被禁用或编译失败时回退到解释器导致的非对齐 panic 问题的第 4 版补丁：将静态函数重命名为 `bpf_fixup_fallback_helpers()`，删除冗余的辅助 ID 范围检查并优化了代码结构。

Tiezhu Yang [提交了](https://lore.kernel.org/loongarch/20260615100506.19558-1-yangtiezhu@loongson.cn/) BPF 自测试补丁的第 2 版补丁：添加了 `get_preempt_count()` 支持、架构限制宏 `__arch_loongarch`，以及针对 `bpf_get_current_task()` 和 `bpf_get_smp_processor_id()` 的 JIT 内联的测试用例，作者指出此提交依赖于龙架构[核心系列](https://lore.kernel.org/loongarch/20260612011616.27771-1-yangtiezhu@loongson.cn/)（将 thread_info 移动到 task_struct 中）。

Haoran Jiang [提交了](https://lore.kernel.org/loongarch/20260613084147.449502-1-haoran.jiang@linux.dev/)为龙架构启用了 `STRICT_MODULE_RWX`（更严格的模块内存权限）安全特性的第 4 版补丁：在 `larch_insn_write` 调用路径中添加了 `text_mutex` 锁，并默认启用 `CONFIG_STRICT_MODULE_RWX` 选项；审阅者 Huacai Chen [认为](https://lore.kernel.org/loongarch/771c9cbf977e0f724055b2880739afdfb3e7d8a4@linux.dev/)作者的相关测试并不完整，且作者并没有采纳第 3 版中对于 kprobes 的最佳修改方案。随后作者[回应了](https://lore.kernel.org/loongarch/771c9cbf977e0f724055b2880739afdfb3e7d8a4@linux.dev/)部分意见，此补丁仍在讨论中。

Bastian Blank 为龙架构的 vDSO [添加了](https://lore.kernel.org/loongarch/ajQY2-ssx-ZHj3qe@steamhammer.waldi.eu.org/)构建“盐”（Build Salt，即特殊标记），使其构建时生成唯一的 build ID。

### 工具链 {/* #toolchain */}

#### GCC {/* #gcc */}

Ruoyao Xi [提交了](https://gcc.gnu.org/pipermail/gcc-patches/2026-June/720731.html)针对龙架构 SSP 例程在 ILP32 ABI 下生成错误 64 位访存指令问题的修复的第 2 版补丁。和第 1 版相比，该版补丁显式禁用了 ILP32 下不支持的 `ldptr.d`/`stptr.d` 指令。

Ruoyao Xi [提交了](https://gcc.gnu.org/pipermail/gcc-patches/2026-June/720730.html) [Chen (jiegec)](https://github.com/jiegec) [报告](https://github.com/loongson-community/discussions/issues/119)的混合了符号扩展和零扩展的向量点成操作为直接使用龙架构对应指令的问题的第 2 版补丁。和第 1 版相比，该版补丁使用 C 重写了测试用例，这样可以重用 gcc.`target/loongarch/vector/lasx` 中仅在支持 LASX 的处理器上运行编译产物的机制，而不用自行编写该逻辑。

### LLVM

[Runze Lin (lrzlin)](https://github.com/lrzlin) 为龙架构 LSX/LASX [添加了](https://github.com/llvm/llvm-project/pull/203851) `PARTIAL_REDUCE_MLA` 和 `getPartialReductionCost` 操作的支持。对 `PARTIAL_REDUCE_MLA` 操作码使用 `vmulwev.h.b[u]` + `vmulwod.h.b[u]` + `2 x vhaddw.w.h` + `2 x vadd.w` 进行行内操作，并实现了 `getPartialReductionCost()` 函数为向量化器提供成本模型；该优化在 SPEC CPU2026 的 `706.stockfish_r` 测试中（使用 3C5000L 测试）可实现约 57% 的性能提升。

#### LLVM {/* #llvm */}

[Runze Lin (lrzlin)](https://github.com/lrzlin) 为龙架构 LSX/LASX [添加了](https://github.com/llvm/llvm-project/pull/203851) `PARTIAL_REDUCE_MLA` 和 `getPartialReductionCost` 操作的支持。对 `PARTIAL_REDUCE_MLA` 操作码使用 `vmulwev.h.b[u]` + `vmulwod.h.b[u]` + `2 x vhaddw.w.h` + `2 x vadd.w` 进行行内操作，并实现了 `getPartialReductionCost()` 函数为向量化器提供成本模型；该优化在 SPEC CPU2026 的 `706.stockfish_r` 测试中（使用 3C5000L 测试）可实现约 57% 的性能提升。

## 杂闻播报 {/* #assorted-news */}

### Box64 {/* #box64 */}

[Yang Liu (ksco)](https://github.com/ksco) 本周在 [Box64](https://github.com/ptitSeb/box64) 上有多个修复：

- [包装了](https://github.com/ptitSeb/box64/pull/3949) `process_vm_writev` 函数，增加基于 ptrace 的 fallback，以支持 Syringe.exe（Windows 进程注入工具）的跨进程内存访问。
- [修复了](https://github.com/ptitSeb/box64/pull/3951)信号处理函数返回时对于调试模式的处理，支持 `Syringe.exe` 的调试进程恢复。通过在信号恢复路径中，如果检测到 TF 被设置，则设置 `no_tf` 标志以跳过第一个 `SIGTRAP`，使 `Syringe.exe` 在 Wine 下正常工作。
- 将 `IRET` 指令中关于陷阱标志 (TF) 处理的修复[移植到](https://github.com/ptitSeb/box64/pull/3950)龙架构 DynaRec，并[完善了](https://github.com/ptitSeb/box64/pull/3955) `IRET` 指令对于调试模式和异常情况的处理。
- [优化了](https://github.com/ptitSeb/box64/pull/3953) DynaRec 中的文件缓存调试日志，并重构了文件缓存代码，去除冗余的宏定义；优化文件缓存列表命令的输出格式。
- 为 DynaRec [添加了](https://github.com/ptitSeb/box64/pull/3954)两个环境变量，修复了文件缓存中某些选项没有被追踪的问题。
- [修复了](https://github.com/ptitSeb/box64/pull/3959) DynaRec 在 `pass0` 阶段提前退出的 dynablock 退出时未正确保存 EFLAGS 寄存器的问题。
- [修复了](https://github.com/ptitSeb/box64/pull/3961)龙架构 DynaRec 中一些标志模拟的几个边缘情况。
- 为 `explorer.exe` 在 Wine 下运行[添加了](https://github.com/ptitSeb/box64/pull/3952)配置文件，禁用 bigblock 以提高其冷启动速度。
- [增加了](https://github.com/ptitSeb/box64/pull/3956) Box64 配置器（GUI 工具），用于快捷的单应用配置。
- 对 `SHOWSEGV` 信号处理功能[添加了](https://github.com/ptitSeb/box64/pull/3960)安全性功能处理。

### EDK II {/* #edk2 */}

[Chao Li (kilaterlee)](https://github.com/kilaterlee) [添加了](https://github.com/tianocore/edk2/pull/12677) EDK II 动态栈 Cookies 入口点库支持，以便启用栈保护功能，并[更新了](https://github.com/tianocore/edk2/pull/12685) EDK II 的龙架构维护者目录。

2026 年 5 月 13 日，[Dongyan Qian (MarsDoge)](https://github.com/MarsDoge) 为 EDK2 的 `PciBusDxe` 驱动[添加了](https://github.com/tianocore/edk2/pull/12572) `PcdPciScanFuncIfFunc0Absent` 选项，以控制是否在功能 0 不存在时继续扫描收集 1-7 号功能的信息（该选项默认值为 `FALSE`），这一选项可方便支持某些虚拟化拓扑中的非标准设备暴露场景；本周，该补丁收到了核心维护者 [lgao4](https://github.com/lgao4) 的[认可](https://github.com/tianocore/edk2/pull/12572#issuecomment-4736854637)。

### 其他 {/* #other-assorted-news */}

本周 rCoreOS（唐图）的 [tgoskits](https://github.com/rcore-os/tgoskits)（面向操作系统与虚拟化开发的集成仓库）项目中收到了多笔龙架构相关的提交：

- [Kevin Choo (Promin3)](https://github.com/Promin3) [改进了](https://github.com/rcore-os/tgoskits/pull/1292) StarryOS 的 GDB/ptrace 龙架构支持。
- [Feng Lin (Godones)](https://github.com/Godones) 为 Starry OS 的龙架构内核模块[添加了](https://github.com/rcore-os/tgoskits/pull/1279)直接映射窗口 (DMW) 后端支持。
- [Qingya Zhang (dweeqhd)](https://github.com/dweeqhd) 为 AxVisor 中断框架[添加了](https://github.com/dweeqhd/tgoskits/pull/6)龙架构 VM 后端路由中断功能。
- [Rui Zhou (ZR233)](https://github.com/ZR233) 按新的串口 IRQ/队列模型[重构了](https://github.com/rcore-os/tgoskits/pull/1265)串口驱动，其中修复了龙架构 DMW 早期执行地址被误判为已 relocated 的问题。
- [Rui Zhou (ZR233)](https://github.com/ZR233) 为龙架构 UEFI [优化了](https://github.com/rcore-os/tgoskits/pull/1294)系统时间初始化路径，优先使用 UEFI 固件提供的的 Runtime Service `GetTime` 初始化系统 wall clock，只有当固件 RTC 不可用时，才会回落到 `ax-driver` 的 RTC 驱动探测。

[dcsid](https://github.com/dcsid) [报告了](https://github.com/google/highway/issues/3112) [highway](https://github.com/google/highway)（一个提供可移植 SIMD/向量内建的 C++ 库）上的 `sort_test` 在无原生 `float16` 的工具链上构建失败的问题。该问题使用 iota/-klnf 修复后，龙架构上的遇到一个隐藏问题：在 `loongarch_lsx-inl.h:272` 的 `GetLane` 函数中，对 2 字节通道（`float16_t`）执行了 `static_cast<T>(__lsx_vpickve2gr_h(...))`，该操作对于仿真的 `float16_t` 同样不合法（无法从 `int` 构造）。

[Emil Lerch (elerch)](https://github.com/elerch) 为 [mise](https://github.com/jdx/mise)（开发环境管理工具）[添加了](https://github.com/jdx/mise/pull/10506)对龙架构支持。

[Denys Fedoryshchenko (nuclearcat)](https://github.com/nuclearcat) 为 [KernelCI](https://github.com/kernelci/)（自动化内核持续集成测试框架）的 [kernelci-pipeline](https://github.com/kernelci/kernelci-pipeline) 组件[添加了](https://github.com/kernelci/kernelci-pipeline/pull/1510)龙架构构建支持，并为 [kernelci-core](https://github.com/kernelci/kernelci-core) 组件[添加了](https://github.com/kernelci/kernelci-core/pull/3117)龙架构构建支持。

[futz12](https://github.com/futz12) 为 [ncnn](https://github.com/Tencent/ncnn)（神经网络推理框架）[修复了](https://github.com/Tencent/ncnn/pull/6777)龙架构上 int8 量化卷积在遇到扁平化 1D 输入和 1x1 卷积核时的计算错误和形状错误问题。

[Gaojuxin09](https://github.com/Gaojuxin09) [修复了](https://github.com/linux-test-project/ltp/pull/1327)龙架构 LTP 上的两个资源枯竭 (starvation) 运行时测试的问题：一是使 `-t` 运行时参数有效，避免被自动校准覆盖；二是根据客观硬件制约，跳过了对 `CONFIG_PREEMPT_VOLUNTARY=y` 内核的测试。

[heiher](https://github.com/heiher) 为 Wasmtime（WebAssembly 运行时）[添加了](https://github.com/bytecodealliance/wasmtime/pull/13675)龙架构纤程 (Fiber) 调度支持。

[theflysong](https://github.com/theflysong) 为 [sustcore](https://github.com/sustcore-team/sustcore)（南方科技大学 sustcore 团队内核）[添加了](https://github.com/sustcore-team/sustcore/pull/58)龙架构的初始支持。

[victorbash400](https://github.com/victorbash400) [导入了](https://github.com/fastfetch-cli/fastfetch/pull/1231)先前被 fastfetch 上游拒绝的龙架构 ABI 模块支持，为其 fastfetch 分支 [所用](https://github.com/Organisation-Without-A-Cool-Acronymn/fastfetch/pull/63)。

[wszqkzqk](https://github.com/wszqkzqk) 为 Google 的 [go-tpm-tools](https://github.com/google/go-tpm-tools)（可信平台模块工具集）[添加了](https://github.com/google/go-tpm-tools/pull/839)龙架构支持。

[wszqkzqk](https://github.com/wszqkzqk) 为微软的 [TPM 2.0 参考实现](https://github.com/microsoft/ms-tpm-20-ref) [添加了](https://github.com/microsoft/ms-tpm-20-ref/pull/126)龙架构支持。

[Kaiyang Wu (OriginCode)](https://github.com/OriginCode) [发布了](https://github.com/loongson-community/discussions/issues/124)关于 C++20 多线程处理库 [TooManyCooks](https://github.com/tzcnt/TooManyCooks) 龙架构支持的英雄帖（该库是聊天软件 Telegram 6.9.3 添加的新运行时依赖）；随后 [Ruoyao Xi (xry111)](https://github.com/xry111) 为该库[添加了](https://github.com/tzcnt/TooManyCooks/pull/250) 64 位龙架构支持；[tzcnt](https://github.com/tzcnt) 随后为 [tdesktop](https://github.com/telegramdesktop/tdesktop)（Telegram 桌面客户端）[更新了](https://github.com/telegramdesktop/tdesktop/pull/30841) TooManyCooks 版本，最新版已可直接在龙架构上顺利构建。

[xcy963](https://github.com/xcy963) 在 [OS_Workspace](https://github.com/HITOSTeam/OS_Workspace)（用于医疗的操作系统）上[报告了](https://github.com/HITOSTeam/OS_Workspace/issues/30)龙架构的内存不连续的问题：龙架构 QEMU 设备树提供了两个不连续的内存节点（`0x0` 处的 256MiB 和 `0x80000000` 处的 768 MiB），导致现在龙架构部分始终少 256 MiB；作者认为需要修改 `init_phys_mem_from_dtb` 函数以支持扫描并添加所有内存节点。

### 发行版们 {/* #distros */}

#### Anolis OS {/* #anolis-os */}

[wangkanglong](https://gitee.com/wangkanglong) 为 Anolis OS（龙蜥）6.6 内核[禁用了](https://gitee.com/anolis/cloud-kernel/pulls/8309)龙架构上支持不完善的 `CONFIG_STRICT_MODULE_RWX` 并修复了编译错误。

#### 安同 OS {/* #aosc-os */}

[Xinmudotmoe](https://github.com/Xinmudotmoe) [禁用了](https://github.com/AOSC-Dev/aosc-os-abbs/pull/16408) Linux 内核的 `CONFIG_HSA_AMD_P2P` 选项，解决了龙架构 3B6000/3C6000 CPU 在 AMD GPU (Radeon RX 9070 XT) 下由于疑似龙芯平台 PCIe P2P 功能存在功能问题，导致 llama.cpp 运行时输出杂乱数据的问题。

[Ruoyao Xi (xry111)](https://github.com/xry111) [修复了](https://github.com/AOSC-Dev/aosc-os-abbs/pull/16380) `loonggpu-kernel-dkms` 包中 KCD 补丁的一个低级错误。

[Ruoyao Xi (xry111)](https://github.com/xry111) 为 `loonggpu-kernel-dkms` 社区分支[添加了](https://github.com/AOSC-Dev/aosc-os-abbs/pull/16368) Linux 7.1 支持，并修复了一些遗留问题：修复了 `CONFIG_DEBUG_FS=n` 时的构建问题、将帧缓冲设备的睡眠唤醒逻辑切换至 DRM 客户端、修复了 Linux &ge; 6.19 上的潜在双重释放问题，并适配了 Linux 7.1 内核中 `drm_buddy` 到 `gpu_buddy` 的 API 重构。

[Ruoyao Xi (xry111)](https://github.com/xry111) [修复了](https://github.com/AOSC-Dev/aosc-os-abbs/pull/16337)使用 Linux 7.0 内核时 LG110 设备和部分 AMD 显卡在从睡眠唤醒后直接导致整个内核崩溃的问题。

#### deepin {/* #deepin */}

[heysion](https://github.com/heysion) 为 [CUPS](https://github.com/deepin-community/cups) 调度器[增加了](https://github.com/deepin-community/cups/pull/20) ELF 头解析功能，以检测龙架构旧世界 `obj-v0` 二进制文件。该功能使用 `deepin-compatible-ctl` 自动包装，用以替代编译时全部跳过策略，实现细粒度兼容控制。但审阅机器人[报告](https://github.com/deepin-community/cups/pull/20#issuecomment-4716150322)目前 CUPS 软件版本号[受控](https://github.com/deepin-community/infra-settings/issues/134)，不得更新。

## 张贴栏 {/* #bulletin */}

本栏目可供张贴公益性质的各种信息。

* 您可在 GitHub [浏览](https://github.com/loongson-community/discussions/labels/%E8%8B%B1%E9%9B%84%E5%B8%96)目前所有开放的英雄帖。
* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16