---
slug: this-week-in-loongarch-158
title: 每周一龙：第 158 期
authors: [jokerm13]
date: 2026-6-30T02:00:00+08:00  # TODO: change to actual time in the finishing commit
tags: [每周一龙]
draft: true  # TODO: remove in the finishing commit
---

每周（尽量）为大家报道 LoongArch 社区最前线的第一手新鲜资讯！
上周的进展主要有 Linux 内核、工具链、EDK II、Box64、QEMU 及发行版操作系统等方面的技术进展。
详情点进来看！

{/* truncate */}

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

## 先「马」再看 {/* #marked-projects */}

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch 领域的重要或长期项目（坑）。

### Linux {/* #linux */}

针对社区用户之间经常烦扰的部分昆仑固件板卡无法启动主线内核，“只能启动 Loongnix”的问题，Huacai Chen 为龙架构[添加了](https://lore.kernel.org/loongarch/20260622065843.3961572-1-chenhuacai@loongson.cn/) `acpi_add_early_pio()` 函数，用于添加早期访问的 ISA/LPC PIO（可编程输入输出）设备；以及 `acpi_remove_early_pio()` 用于在 PCI 根桥注册之前移除 PIO 设备。经 Yuanzhen Gan [测试](https://lore.kernel.org/loongarch/a4c057ae-cba3-453d-8bd0-54c94dbfe491@simplelinux.cn.eu.org/)，该补丁的确可以解决了由早期 ISA/LPC PIO 访问引起的引导失败问题。

Binbin Zhou [提交了](https://lore.kernel.org/loongarch/20260624085550.1508771-1-zhoubinbin@loongson.cn/)修复龙芯 2K0500 BMC 多功能设备 (MFD) 驱动中视频模式解析中的 `iomem` 指针的不正确处理的第 2 版补丁。添加了第 1 版中缺失的 `memcpy_fromio()` 数据拷贝，并删除了不必要的 `buf` 变量。已获得审阅者 Huacai Chen 的[审阅通过](https://lore.kernel.org/loongarch/CAAhV-H5kVdDa-3R2qt+QQNxBKMBKCTKemTm78rYiTe4+aE0HWA@mail.gmail.com/)。

Binbin Zhou [提交了](https://lore.kernel.org/loongarch/cover.1782439646.git.zhoubinbin@loongson.cn/)为 2K0300 SoC 添加 I<sup>2</sup>S 控制和声卡支持的第 3 版补丁，修复了第 2 版中由 AI Sashiko 报告的 ACPI 属性解析错误处理，将平台配置结构体标记为 `const`、修正 GPIO 命名并新增了 DAPM 路由支持。

Bibo Mao [提交了](https://lore.kernel.org/loongarch/20260622030508.2731279-1-maobibo@loongson.cn/)修复 KVM 在内核态使用了用户态的 API 的问题的第 2 版补丁，在 `eiointc_set_sw_coreisr()` 和 `eiointc_update_irq()` 中添加边界检查与 ipnum；将 IPI 注入和清除操作移入 `spin_lock` 保护区域内，避免竞争条件；添加了用户态注入检查。

Chenguang Zhao 为龙架构[实现了](https://lore.kernel.org/loongarch/20260602021515.214560-1-zhaochenguang@kylinos.cn/) BPF JIT  kptr xchg 内联优化，当 JIT 通过 `bpf_jit_supports_ptr_xchg()` 声明支持时，BPF 验证器可以将 `bpf_kptr_xchg()` 辅助函数调用降级为单条原子指令，性能测试显示吞吐量提升 21%。但审阅机器人 [反馈](https://lore.kernel.org/loongarch/20260603100438.2177817-1-zhaochenguang@kylinos.cn/T/#mf5be624bf295a61d051fe795bd22705da50613e3)补丁 1 近修复了 `BPF_XCHG` 的屏障问题，需确认其他带返回值的原子 RMW 指令是否要确保一致性。

Chenguang Zhao [提交了](https://lore.kernel.org/loongarch/20260622071234.1410830-1-zhaochenguang@kylinos.cn/)为龙架构实现 BPF JIT  kptr xchg 内联优化的第 3 版补丁，将 JIT 修复排序扩展到所有带返回值的原子操作 (`BPF_FETCH`、`BPF_XCHG`、`BPF_CMPXCHG`)，并添加了 `__bpf_root()` 解决 libbpf 的 kfunc 链接器问题。

George Guo [修复了](https://lore.kernel.org/loongarch/20260625083212.277417-1-dongtai.guo@linux.dev/)龙架构 BPF JIT 中尾部调用计数 (TCC) 的两个问题：

- 修复了内存损坏的问题，arena  程序因额外的 `REG_ARENA` 寄存器槽位导致的尾调用计数指针偏移错误。
- 修复了空槽位增加尾部调用计数的问题，因 `emit_bpf_tail_call()` 在检查 `prog_array` 槽位是否为空之前，就先递增了尾调用计数，并将新值写回。即使跳转到空槽位（控制流未转移），计数也被消耗。

Huacai Chen [移植了](https://lore.kernel.org/loongarch/20260622065910.3961592-1-chenhuacai@loongson.cn/) MIPS 中的一个提交补丁，为龙架构的 `stop_this_cpu()` 函数添加了 `rcutree_report_cpu_dead()` 调用，以在系统关机/重启时向 RCU 报告，避免因 RCU 长期等待而导致的系统挂起问题。这应该只会影响理论上可能存在的不支持 IPI IOCSR 的硬件，目前不存在此种硬件。另外，Hongchen Zhang [修复了](https://lore.kernel.org/loongarch/20260625024043.2960754-1-zhanghongchen@loongson.cn/)龙架构在启用硬件页表遍历 (HW PTW) 时，因硬件仅设置 `_PAGE_DIRTY` 而未设置软件位 `_PAGE_MODIFIED`，导致 fork CoW 后脏页信息丢失、可能引发数据损坏的问题。

Sang-Heon Jeon [移除了](https://lore.kernel.org/loongarch/20260621145919.1453-1-ekffu200098@gmail.com/)龙架构 `kasan_init()` 函数中因 `for_each_mem_range()` 不返回无效范围而不必要的 `start >= end` 检查。已获得审阅者 Andrey Ryabinin 的[审阅通过](https://lore.kernel.org/loongarch/CAPAsAGz3hqtqVwtSquau+qgXWJzjrg8qaRFhcqaHk1En01Jh9g@mail.gmail.com/)以及审阅者 Mike Rapoport 的[确认](https://lore.kernel.org/loongarch/178237721125.146960.11801589845266315987.b4-review@b4/) (Acked-by)。

Pengpeng Hou 将龙架构 defconfig 中过时的 `CONFIG_I2C_DESIGNWARE_SLAVE` 配置项[更新为](https://lore.kernel.org/loongarch/20260624081618.93699-1-pengpeng@iscas.ac.cn/)当前通用的 `CONFIG_I2C_SLAVE`，以修复因上游 Kconfig 变更导致的 I<sup>2</sup>C 从设备支持在默认内核中未正确启用的问题。

Hongchen Zhang [修复了](https://lore.kernel.org/loongarch/20260625024043.2960754-1-zhanghongchen@loongson.cn/)龙架构在启用硬件页表遍历 (HW PTW) 时，因硬件仅设置 `_PAGE_DIRTY` 而未设置软件位 `_PAGE_MODIFIED`，导致 fork COW 后脏页信息丢失、可能引发数据损坏的问题。

### 工具链 {/* #toolchain */}

#### ABI {/* #abi */}

[xtexx](https://github.com/xtexx) [报告了](https://github.com/loongson/la-abi-specs/issues/23)在 GOT 和 TLS 重定位公式中加入 `addend`，[Xuerui Wang (xen0n)](https://github.com/xen0n) [指出](https://github.com/loongson/la-abi-specs/issues/23#issuecomment-4781214233)一些指令需要预偏移量，按照作者的修复会出现问题，[cloudspurs](https://github.com/cloudspurs) [指出](https://github.com/loongson/la-abi-specs/issues/23#issuecomment-4785634924) GOT 重定位用于寻址符号 (S) 的 GOT 条目，而非 (S+A) 的 GOT 条目，同时应区分 TLS 重定位。随后作者将此 Issues 关闭。

#### LLVM {/* #llvm */}

Zhaoxin Yang (ylzsx) [报告了](https://github.com/llvm/llvm-project/issues/205039)龙架构在指令选择阶段无法处理 `llvm.set.rounding` 内联函数，导致包含该调用的 IR 编译失败。随后，tangyuan0821 为龙架构[添加了](https://github.com/llvm/llvm-project/pull/205051) `llvm.set.rounding` 支持，将 `ISD::SET_ROUNDING` 节点合法化并映射到 `MOVGR2FCSR` 指令，并添加了测试用例，但审阅者 Zhaoxin Yang (ylzsx) 和 Lei Wang (wangleiat) 指出测试用例仍有问题。

#### Rust {/* #rust */}

heiher 为 Rust 官方参考手册[补充了](https://github.com/rust-lang/reference/pull/2296)龙架构 LSX (`vreg`) 和 LASX (`xreg`) 内联汇编文档。

heiher 为 [compiler-builtins](https://github.com/rust-lang/compiler-builtins) 库[添加了](https://github.com/rust-lang/compiler-builtins/pull/1223)龙架构上 CLZ 指令可用性的检测，并[重命名了](https://github.com/rust-lang/compiler-builtins/pull/1222)一个导零算法 `leading_zeros_riscv`，使同样支持条件置位指令的龙架构也可以使用。

heiher 为 [portable-simd](https://github.com/rust-lang/portable-simd)（Rust 标准库的便携式 SIMD API）库中的 `swizzle_dyn` 操作在龙架构上[添加了](https://github.com/rust-lang/portable-simd/pull/533)针对 16 字节（LSX）和 32 字节（LASX）向量的优化实现，使用 `vshuf.b` / `xvshuf.b` 指令替代通用代码，并通过了所有相关测试。

## 杂闻播报 {/* #assorted-news */}

### Box64 {/* #box64 */}

Yang Liu (ksco) 本周在 [Box64](https://github.com/ptitSeb/box64) 上有多个修复，主要包括针对 `ROL`/`ROR` 系列指令的功能修复、包装器方面的优化、Box64 配置方面的更新以及模拟指令实现：

- 针对 `ROL`/`ROR` 系列指令的 FLAGS 模拟修复：
  - 分别修复了 [8 位](https://github.com/ptitSeb/box64/pull/3967)和 [16 位](https://github.com/ptitSeb/box64/pull/3966) `ROL`/`ROR` 指令的 OF 标志计算和保留逻辑。
  - [修复了](https://github.com/ptitSeb/box64/pull/3968)龙架构 DynaRec 中 8 位和 16位 `ROL`/`ROR` 指令的 OF 标志模拟错误。
  - [禁用了](https://github.com/ptitSeb/box64/pull/3969)龙架构 DynaRec 中所有 CL 操作码的移位/旋转操作的标志融合，以确保这些指令的标志位正确模拟。
  - [修复了](https://github.com/ptitSeb/box64/pull/3970)龙架构 DynaRec 中延迟标志的回归问题。
  - [改进了](https://github.com/ptitSeb/box64/pull/3974)解释器中 `ROL`/`ROR` 指令的 OF 模拟。
  - [改进了](https://github.com/ptitSeb/box64/pull/3975)龙架构 DynaRec 中 `ROL`/`ROR` 指令的 OF 模拟，并移除了不完整的 `cputype` 处理逻辑。
- 针对包装器 (wrapper) 方面的修复：
  - [修复了](https://github.com/ptitSeb/box64/pull/3977)对于 GLib 库函数 `g_option_group_add_entries` 的包装错误。
  - [修复了](https://github.com/ptitSeb/box64/pull/3978)自动生成库包装的工具 wrapperhelper 中的一个拼写错误。
  - 为 liblz4（LZ4 压缩库）[添加了](https://github.com/ptitSeb/box64/pull/3979)包装器。
  - [实现了](https://github.com/ptitSeb/box64/pull/3980) 2 个额外的 Wayland（显示服务器通信协议）监听器并添加包装器，以支持 Wine-Wayland 在 GE-Proton10-34 中的运行。
  - [增加并修复了](https://github.com/ptitSeb/box64/pull/3983) wayland-client 监听器，作者指出 Terraria Linux 在 Wayland 环境下正常运行。
  - [移除了](https://github.com/ptitSeb/box64/pull/3982)对于 pipwire 的包装。
- Box64 模拟指令实现方面：
  - [修复了](https://github.com/ptitSeb/box64/pull/3963)此前[更改了](https://github.com/ksco/box64/commit/f05bdb1f938c16e75799b5528a002597574e4ce2) AVX 选项导致了对 CPUID 模拟的回归问题。
  - [修复了](https://github.com/ptitSeb/box64/pull/3964)特定条件下 DynaRec 中的 32 位 `RCL`/`RCR` 指令未清零的问题。
  - 为龙架构 DynaRec [实现了](https://github.com/ptitSeb/box64/pull/3965) `AAM` 和 `AAD` 操作码，并修复了 `AAD16` 帮助函数的 FLAGS 模拟。
  - 为龙架构 DynaRec [实现了](https://github.com/ptitSeb/box64/pull/3988) `PCMPESTRM` 和 `PCMPISTRM` 字符串比较指令。
- 其他功能实现：
  - [重构了](https://github.com/ptitSeb/box64/pull/3981) ctest 相关的 CMake 脚本。
  - [修复了](https://github.com/ptitSeb/box64/pull/3989)环境变量打印功能中的问题。
  - [修复了](https://github.com/ptitSeb/box64/pull/3990) DynaRec 在通过配置文件启用时因跳转表未初始化导致 DynaRec 无法正常启用的问题。

本周，Yang Liu (ksco) 还针对 Box64 Configurator [添加了](https://github.com/ptitSeb/box64/pull/3984)常用设置组和 `BOX64_PROFILE` 环境变量支持，并[添加了](https://github.com/ptitSeb/box64/pull/3985) KDE 文件项操作集成，此插件同时[支持](https://github.com/ptitSeb/box64/pull/3987) KDE 5 桌面环境。

### EDK II {/* #edk2 */}

Qihang Gao (EricGao2015) 为 SecurityPkg 中的 PE 镜像解析函数 `LoadPeiImage()` [添加了](https://github.com/tianocore/edk2/pull/12709)龙架构支持，如果 PE/COFF 图像的机器类型是 `LOONGARCH64` 则返回 `EFI_SUCCESS` ，同时删除了未使用的变量。

Dongyan Qian (MarsDoge) 为 [ModernSetupPkg](https://github.com/MarsDoge/ModernSetupPkg/)（UEFI 交互式前端）[实现了](https://github.com/MarsDoge/ModernSetupPkg/pull/44)多个功能：新增了 SMBIOS 系统侧栏、基于 HII 表单的“面包屑”（分段路径）导航、“快速设置”页面，并添加了俄语界面支持。

龙芯 UEFI 固件 EDK II 本周发布了新的稳定版本，stable202605，其中 Dongyan Qian (MarsDoge) [更新了](https://github.com/loongson/Firmware/pull/160) PC 平台固件，Zixuan Lu [补充发布了](https://github.com/loongson/Firmware/pull/161) 香橙派 Nova 及 XB612B0_V1.1 主板的固件。本版固件主要引入固件备份恢复、ACPI FPDT 启动性能测量表及 ACPI I/O 虚拟化表 (IOVT) 等新功能，并实验性地加入了对主线内核的 CPU 动态调频调压 (cpufreq) 驱动的支持。

### QEMU {/* #qemu */}

Bibo Mao 为龙架构[添加了](https://gitlab.com/qemu-project/qemu/-/commit/94a75309f9281e614e9b390dc59c52e987f473da)虚拟机迁移测试（migration-test）支持。已由审阅者 Stefan Hajnoczi [合并](https://gitlab.com/qemu-project/qemu/-/commit/9d526ed81de270a43342d644363a75e90a3e00f5)。

### U-boot {/* #uboot */}

> 近期，社区开发者再次启动了龙架构 U-Boot 上游化工作。基于此前对 U-Boot 上的工作，社区开发者 Yao Zi (ziyao233) 正主导基础平台支持代码的修缮。

Yao Zi (ziyao233) [修复了](https://github.com/ziyao233/u-boot/commit/0b828227faabc4864a64d4a3082e40abd229b910)此前[重构](https://github.com/ziyao233/u-boot/commit/946b97d33dd60033b146678a718df7d055fe8670)设备树内存解析函数 `fdtdec_setup_memory_banksize` 和 `fdtdec_setup_mem_size_base_lowest` 的补丁，将开放编码排序替换为 qsort，并[修复了](https://github.com/ziyao233/u-boot/commit/e9d9bd9bdce8d16a362283a73b5ad1ab3439bb1d)由 `CONFIG_VAL(NR_DRAM_BANKS)` 引起的 SPL 编译错误。

Yao Zi (ziyao233) [修复了](https://github.com/ziyao233/u-boot/commit/cbe9669c949cdf3221f2d36c86219b1716eda2ec)此前[重构](https://github.com/ziyao233/u-boot/commit/bad22617989093b458e963d14e8a814c01c93e65)代码库，允许 `setup_booti` 提供入口点的补丁，修复了 sandbox 中的 `booti_setup()`。

此前在龙架构上[实现了](https://github.com/ziyao233/u-boot/commit/10ecfe8de4982696900b377255feb05d1d8ad3e5)完整的框架支持，Yao Zi (ziyao233) 又重新[添加了](https://github.com/ziyao233/u-boot/commit/dc2c2a41079471ff725a069bcf0ecb33ecf0859f) `HOST_ARCH` 定义。

Yao Zi (ziyao233) 正确[实现了](https://github.com/ziyao233/u-boot/commit/8dc90acd09983cab3bc119e3c3cc3ec8d8b56b6c) dcache 操作。

Yao Zi (ziyao233) 在 CPU 汇编例程中，在跨 C 函数边界时将 t6 [替换为](https://github.com/ziyao233/u-boot/commit/71dbf1b74e260016224b4a404814e1feb9bad273) s5 以保存重定位偏移量。

Yao Zi (ziyao233) [移除了](https://github.com/ziyao233/u-boot/commit/78ef96e294f85295e8217fc0420bc34fb822b15c)龙架构 Linux 内核镜像的加载与引导[功能](https://github.com/ziyao233/u-boot/commit/4455c7e8896fb051e99b83f88543232235b98554)中未使用的 `arch_lmb_reserve()`。

Yao Zi (ziyao233) [移除了](https://github.com/ziyao233/u-boot/commit/e1c1c4250a7e3f488928e75d2d34723be526d728) `qemu-loongarch` 板级支持中对已废弃 API 的调用。

Yao Zi (ziyao233) 在 `efi_helper.c` 中[添加了](https://github.com/ziyao233/u-boot/commit/4b8fc99a226705795c329d1cdb72d55c32fa310b) `HOST_BOOTEFI_NAME` 和 `HOST_PXE_ARCH` 定义。

### 其他 {/* #other-assorted-news */}

MF-B 在 [tgoskits](https://github.com/rcore-os/tgoskits)（面向操作系统与虚拟化开发的集成仓库）项目中 [增加了](https://github.com/rcore-os/tgoskits/pull/1368)对 LS2K1000 板卡的支持，使 ArceOS/StarryOS 能在 `loongarch64-ls2k1000` 上完成启动、挂载 rootfs、进入 Starry shell，并使用板载 AHCI/GMAC 等基础设备。

Suquster [修复了](https://github.com/Suquster/RustMicroOS/pull/132) [RustMicroOS](https://github.com/Suquster/RustMicroOS) 中龙架构高地址内存不足的问题，将可用物理内存从 ～155 MB 提升至 ～992 MB；同时调整了测试顺序为 musl 优先。

a6d9a6m 在 [comix](https://github.com/comix-kernel/comix) 上[实现了](https://github.com/comix-kernel/comix/pull/266)稳定启动并跑通 OSComp musl 冒烟测试。

Charles Harris (charris) 在 [NumPy](https://github.com/numpy/numpy) 中为 `uv` 的 pip 安装命令[添加了](https://github.com/numpy/numpy/pull/31697) `--only-binary` 参数，使其使用预编译的二进制包，而不是源码编译。

dabao1955 为 [ffi](https://github.com/JupiterRider/ffi)（Libffi 绑定的 purego，可以使用 purego 调用 C 而不使用 cgo） [添加了](https://github.com/JupiterRider/ffi/pull/18)龙架构支持。

doruche 为 [anemone](https://github.com/anemone-os/anemone) [添加了](https://github.com/anemone-os/anemone/pull/124)龙架构支持，确保 `mke2fs` 能在龙架构上正确编译和运行，并修复了嵌套 shebang 处理中的问题。

Ke He (Lfan-ke) 在 [Machina](https://github.com/gevico/machina)（一个用 Rust 编写的模块化全系统仿真器）中为龙架构 `GCSRXCHG` 指令[编写了](https://github.com/gevico/machina/pull/159)两个测试用例，验证非零掩码的按位更新测试和零掩码的只读测试。作者还[新增了](https://github.com/gevico/machina/pull/160)一个龙架构测试终止器 (test-finisher) MMIO 设备，使裸机测试程序能像模拟器报告成功/失败状态，并建立了基于退出码的 CI 测试流程。

lawn123 为 .NET Runtime [实现了](https://github.com/dotnet/runtime/pull/129683)龙架构的原子指令，以支持在 ISA1.0 和 ISA1.1 上实现原子指令。

2026 年 5 月 23日，Haoxuan Pi (pihaoxuan) [报告了](https://github.com/anthropics/claude-code/issues/61680)为 Claude Code 添加龙架构支持，但目前 PR 并没有官方回复而被 bot 关闭。

phorcys 为 [unofficial-loongarch-intrinsics-guide](https://github.com/jiegec/unofficial-loongarch-intrinsics-guide) [添加了](https://github.com/jiegec/unofficial-loongarch-intrinsics-guide/pull/34) [LBT](https://jia.je/unofficial-loongarch-intrinsics-guide/lbt_basics/) 指令的详细文档，作者确定下周会处理所有的文档。

sunhaiyong1978 为 [libilbc](https://github.com/timothygu/libilbc)（iLBC 音频编解码器库）[添加了](https://github.com/TimothyGu/libilbc/pull/47)龙架构预处理程序支持。

sunhaiyong1978 为 [nspr](https://github.com/mozilla/nspr) (Netscape Portable Runtime) 库[实现了](https://github.com/mozilla/nspr/pull/4)对龙架构的自动识别与构建支持。

shankerwangmiao 在 Nginx 的配置文件中为龙架构[设置了](https://github.com/nginx/nginx/pull/1489)缓存行大小，由原本的未知架构默认值 32 字节改为 64 字节，以匹配龙架构的硬件特性。

theflysong 为 [SUSTcore](https://github.com/sustcore-team/sustcore)（南方科技大学使用的内核）[添加了](https://github.com/sustcore-team/sustcore/pull/63)龙架构的 virtio-block 块设备支持。

wszqkzqk 为 [highway](https://github.com/google/highway)（一个提供可移植 SIMD/向量内建的 C++ 库）[修复了](https://github.com/google/highway/pull/3153)龙架构 LSX `LoadInterleaved3` 函数在处理 64 位 `uint16_t` 向量时因索引错误导致通道 0 和 2 数据交换的问题。

wszqkzqk 为 [Pillow](https://github.com/python-pillow/Pillow) 上的龙架构[提高了](https://github.com/python-pillow/Pillow/pull/9714) AVIF（以 AV1 影片编码器为基础的图片格式）测试的 epsilon 值，以容纳龙架构上 libavif 编解码器带来的微小浮点精度差异。

xcy963 [报告了](https://github.com/HITOSTeam/OS_Workspace/issues/34)在 HITOSTeam 的 [OS_Workspace](https://github.com/HITOSTeam/OS_Workspace)（HITOS 医疗团队使用的内核） 中龙架构上 musl libc 的部分官方镜像有很多空函数（例如：`sched_getparam`、`sched_getscheduler`、`sched_setparam` 及 `sched_setscheduler`），导致 cyclictest 程序无法正常运行；作者自己实现了这些函数。

Xiaobai Wu (xuxiaowei-com-cn) [请求](https://github.com/containerd/containerd/issues/13641)为 [containerd](https://github.com/containerd/containerd)（容器运行时）添加龙架构支持，维护者 [samuelkarp](https://github.com/samuelkarp) [提出](https://github.com/containerd/containerd/issues/13641#issuecomment-4772077688)首先需要为龙架构添加编译测试。作者[提交了](https://github.com/containerd/containerd/pull/13642)对龙架构支持的 PR。

Xiaowei Xu (xuxiaowei-com-cn) 在 CI Runner 支持进度的 Issues 中[提交了](https://github.com/loongson-community/discussions/issues/103#issuecomment-4770575493)为龙架构构建 GitLab Runner Docker 执行器所需的 Helper 镜像的解决方案。

yzewei [修复了](https://github.com/python/cpython/pull/152241) [CPython](https://github.com/python/cpython)（Python 3.16.0 alpha 0 版本）中在龙架构上 `test_c_stack_unwind` 测试失败的问题。

### 发行版们 {/* #distros */}

#### Anolis OS {/* #anolis-os */}

gaosong [修复了](https://gitee.com/anolis/cloud-kernel/pulls/8347)龙架构 KVM 中软件中断时硬件定时器中断丢失的问题，优化了定时器清除路径中的延迟逻辑并增加了 ESTAT 二次检查

#### 安同 OS {/* #aosc-os */}

Mingcong Bai [后向移植](https://github.com/AOSC-Dev/aosc-os-abbs/pull/16494)了 Linux 内核中针对龙芯 2K0500 BMC 多功能设备驱动中语义错误的修复。

## 张贴栏 {/* #bulletin */}

本栏目可供张贴公益性质的各种信息。

* 您可在 GitHub [浏览](https://github.com/loongson-community/discussions/labels/%E8%8B%B1%E9%9B%84%E5%B8%96)目前所有开放的英雄帖。
* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16