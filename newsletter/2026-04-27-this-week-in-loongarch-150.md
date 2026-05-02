---
slug: this-week-in-loongarch-150
title: 每周一龙：第 150 期
authors: [jokerm13]
date: 2026-5-1T02:00:00+08:00  # TODO: change to actual time in the finishing commit
tags: [每周一龙]
draft: true  # TODO: remove in the finishing commit
---

每周（尽量）为大家报道 LoongArch 社区最前线的第一手新鲜资讯！
上周的进展主要有 Linux、EDK II、工具链、发行版生态。
详情点进来看！

{/* truncate */}

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

## 先「马」再看 {/* #marked-projects */}

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch 领域的重要或长期项目（坑）。

### Linux {/* #linux */}

#### BPF {/* #bpf */}

Tiezhu Yang 为龙架构[添加了](https://lore.kernel.org/loongarch/20260428080051.20938-1-yangtiezhu@loongson.cn/T/#t) `__arch_loongarch` 架构限定宏，并为 `bpf_get_current_task()` 和 `bpf_get_smp_processor_id()` 添加即时编译器(JIT)内联指令的预期输出测试，用于验证龙架构 BPF JIT 的内联支持。

#### KVM {/* #kvm */}

于 2026 年 4 月 14 日，Xianglai Li  [修复了](https://lore.kernel.org/loongarch/20260414113111.2997864-1-lixianglai@loongson.cn/T/#m912678c4ec317f61fb8f6b81f9437e5e956c8742)龙架构 KVM 的“unreliable stack” v4 补丁，Huacai Chen [报告了](https://lore.kernel.org/loongarch/20260414113111.2997864-1-lixianglai@loongson.cn/T/#m55fe44ed286ca6e69de9162418fddc525ddcad8d)一个 objtool 编译警告，并确定了修复方向。

Qiang Ma [提交了](https://lore.kernel.org/loongarch/7CFC18ABD138F62B+086624ea-7d8d-411e-bd5d-4c79899c58db@uniontech.com/T/#t)关于龙架构 KVM 的补丁，将龙架构 KVM 的 `KVM_CAP_NR_VCPUS`（用于返回推荐的最大 vCPU 数量） 返回值用 `KVM_MAX_VCPUS` (用于返回架构允许的绝对最大 vCPU 数量) 进行上限限制，避免推荐 vCPU 数量超过架构硬限制，并接受了 Bibo Mao 的建议，[移除了](https://lore.kernel.org/loongarch/0b8db33a-6c26-d9f5-b78f-d9249dd02c1c@loongson.cn/T/#t) Fixes 标签。

Tao Cui [提交了](https://lore.kernel.org/loongarch/20260428130031.409066-1-cuitao@kylinos.cn/T/#u)关于龙架构 KVM 的补丁，将龙架构 KVM 中 `kvm_flush_pte()` 函数的直接赋值改为使用 `kvm_set_pte()` 包装函数，以保持代码一致性。

Huacai Chen [调整了](https://lore.kernel.org/loongarch/CAAhV-H5+mR5gnd6x6yUEFK7ZnWyYQVTiE6C=enk7bHxe2Mo2Sg@mail.gmail.com/T/#md547f049797b4802a21936398bcfc937493cea53)基于 2026 年 4 月 14 日 Tao Cui [修复](https://lore.kernel.org/loongarch/9c1462c5-85ff-4de3-bee4-d394ffdfb63f@loongson.cn/T/#t)的第一个补丁。

> 原修复补丁：Tao Cui [修复了](https://lore.kernel.org/loongarch/9c1462c5-85ff-4de3-bee4-d394ffdfb63f@loongson.cn/T/#t "修复了")龙架构 KVM 中 `kvm_emu_mmio_read()` 函数在 ldptr 操作码解码 default 分支缺失 `EMULATE_FAIL` 设置的问题。

#### 平台支持 {/* #platform-support-news */}

Binbin Zhou [添加了](https://lore.kernel.org/loongarch/cover.1777273055.git.zhoubinbin@loongson.cn/T/#m853d593e2fbca36822edeaaf3b8c52c808d17067) CAN-FD (CAN with Flexible Data-Rate)控制器驱动支持，实现了 CAN 与 CAN FD 协议，并为 RXDMA 添加了基于龙芯 APB CMC DMA（Advanced Peripheral Bus Configuration and Memory Control Direct Memory Access，是龙芯上专用的数据搬运模块） 引擎的可选 DMA 支持，以优化高负载下的 CPU 使用率。

Huacai Chen 为龙架构 PCI 根桥[添加了](https://lore.kernel.org/loongarch/20260429080704.2425187-1-chenhuacai@loongson.cn/T/#u) `PCIH` ACPI 标志检测，当固件已通过 ACPI 提供的完整的 64 位内存资源窗口时，跳过内核的无条件 `mem resource fixup`，避免覆盖固件配置；该补丁使行为变为 `per-root-bridge` 可配置，修复了 BAR 分配失败的问题。

Wentao Guan [修复了](https://lore.kernel.org/loongarch/20260428084204.731000-1-guanwentao@uniontech.com/T/#u) `loongson_gnu_fixup_dma_hang()` 中的潜在地址错误异常（ADE），当插入非 DC2/DC3 GPU（如 LG100）设备时因使用未初始化指针导致的 ADE 地址错误异常及内核崩溃问题，随后[提交了](https://lore.kernel.org/loongarch/20260428110155.754875-1-guanwentao@uniontech.com/T/#u) v4 补丁，说明了版本演变过程，并回退到 v2 版本（重构 commit msg，增加完整 dmesg 链接）。

Qunqin Zhao 为 loongson-se 驱动[添加了](https://lore.kernel.org/loongarch/197d8afc8c6afe165e60c219b0a08ce6b6698ff9.camel@xry111.site/T/#t)多节点中断转发支持，将 node 0 作为中断代理处理其它节点的 SE 中断，但随后 Huacai Chen 说明：“node” 在 NUMA 中与“package”不完全等同，需要考虑 Loongson-3C5000L 的情况，应明确 SE 是 per-node 还是 per-package 设备，Qunqin Zhao 表明，该驱动不兼容 5000 系列；在 3C6000 上 node 与 package 相同，随后 Xi Ruoyao 指出 3C6000/D 中一个 package 有两个节点，说明 node 不等于 package。

#### 其他内核功能 {/* #other-news */}

WANG Rui [解决了](https://lore.kernel.org/loongarch/20260426120231.532644-1-r@hev.cc/T/#t)启用 KASLR 时内核映像与 initrd 之间的重叠问题，通过将 KASLR 逻辑从内核移至 EFI 引导存根中，这样内核映像和 initrd 的最终放置位置均由 EFI 内存分配器决定。随后，WANG Rui [提交了](https://lore.kernel.org/loongarch/20260428040159.1065822-1-r@hev.cc/T/#me0cd42adeb0d4830b0d990d07c6b5e63b446b801) v2 版本（基于 RFC v1），删除了 `rdtime_h/1` 补丁，改用 `random_get_entropy()`；增加了对齐、最小偏移等安全性改进。2026 年 4 月 29 日，WANG Rui [提交了](https://lore.kernel.org/loongarch/7efff830-06c6-44d8-a613-f230253c014e@app.fastmail.com/)此系列的 v3 补丁，新增了 initrd 重叠检查，恢复了 Kconfig range 的原有范围，并根据 v2 反馈优化了函数命名和类型；同日，WANG Rui [提交了](https://lore.kernel.org/loongarch/20260429120300.1786210-1-r@hev.cc/T/#t)此系列的 v4 补丁，根据 Huacai Chen 的反馈重命名函数并修正变量类型。

WANG Rui 为龙架构[新增了](https://lore.kernel.org/loongarch/20260427034451.717817-1-r@hev.cc/T/#t) `efi_cache_sync_image()` 实现，使用 `ibar` 指令在镜像被 `memcpy` 复制后强制执行指令缓存同步，从而解决了在 EFI stub 引导过程中，内核镜像会通过 `memcpy` 被重定位到一个新的内存地址时只更新了内存中的数据和指令，导致 CPU 的指令缓存（I-Cache）与数据缓存（D-Cache）不一致的错误。随后，WANG Rui [接受了](https://lore.kernel.org/loongarch/20260427083930.36324-1-r@hev.cc/T/#t) Huacai Chen 的审阅意见，将 `efi_cache_sync_image()` 实现移至 `check_platform_features()`，使代码风格与 ARM64 保持一致。2026 年 4 月 27 日，WANG Rui [提交了](https://lore.kernel.org/loongarch/e631d1e5-3f05-42ab-885d-4bd660612d63@app.fastmail.com/T/#m8aaa8d414556a98a6eb8419c839842f8c6230889) v2 补丁，为 EFI stub 内核重定向路径添加指令缓存同步调用，并提供龙架构的 `ibar 0` 实现；该系列已被 Ard Biesheuvel 接受并入 `efi/urgent`，但因破坏 ARM 构建而需先将 `efi_relocate_kernel()` 移入龙架构专用代码。2026 年 4 月 29 日，Huacai Chen 建议[添加](https://lore.kernel.org/loongarch/CAAhV-H5w=UmtZt_JCR=BvZt-+F9usnmjh2dMBLHzeiE-7xBddQ@mail.gmail.com/T/#md7ab49b48e4572101744d4cd8f8cc524d8a18b0f) `cc:stable` 向后移植。

Huacai Chen [修改了](https://lore.kernel.org/loongarch/20260428070627.1740598-1-chenhuacai@loongson.cn/T/#u)龙架构 Kconfig 默认选项为 `CONFIG_64BIT`，因 LoongArch32 的支持，开发人员在 kernel v7.1-rc1 中修改 Kconfig 配置文件，增加了 `CONFIG_32BIT` 支持，因为未指定默认选项，导致此选项成为默认选项。

Tiezhu Yang 基于 Linux Kernel v7.1-rc1 为龙架构[实现了](https://lore.kernel.org/loongarch/20260428072021.7289-1-yangtiezhu@loongson.cn/T/#t) `CONFIG_THREAD_INFO_IN_TASK` ，将 `thread_info` 从栈移入 `task_struct` ，并设置 `$tp`(thread pointer)寄存器指向当前 `task_struct` 的指针。龙架构中将 `thread_info` 放置在内核栈底，这种做法存在安全隐患；同时利用 `$tp` 寄存器始终指向当前 `task_struct`，将 `bpf_get_current_task()` 和 `bpf_get_smp_processor_id()` 等 BPF 辅助函数内联为单条指令。

> 这个补丁基于 2026 年 4 月 20 日 Tiezhu Yang [提交](https://lore.kernel.org/loongarch/20260420102907.4617-1-yangtiezhu@loongson.cn/T/#u)的补丁，增加了 BPF 辅助函数的优化。

Huacai Chen 为龙架构的 32 和 64 位内核分别[添加了](https://lore.kernel.org/loongarch/CAHirt9gdabrd=PY6aWJQmhueeea7NeeZijP_rP_egnQ+-LKnoQ@mail.gmail.com/T/#m6e3908fa3d9beea63dd7813fc7bb68febb3dd7a6) `-m32`和 `-m64` 编译选项（通过 `cc-option` 兼容 GCC），解决了 Clang/LLVM 编译 32 位内核时的 triple 切换问题，WANG Rui 在 Clang 18 和 Clang 22 均编译通过。

Qiang Ma [移除了](https://lore.kernel.org/loongarch/20260428075050.2280852-1-maqianga@uniontech.com/T/#u)龙架构未使用的 `cpu_has_perf` 宏定义，这个宏被错误的关联到了 `LOONGARCH_CPU_PMP` 特性位。

Xi Ruoyao 重新 Ping 了于 2026 年 4 月 9 日[提交](https://lore.kernel.org/loongarch/afEAzG-k3MwazO8W@pie/T/#t)的龙架构检测并禁用异常 `sc.q` 指令的补丁，在部分 Loongson 2K3000/3B6000M 系统上，使用旧版本固件时，`sc.q` 指令存在硬件缺陷，当写入 128 位数据的低 64 位为 0 时，高 64 位可能被错误写入，增加了 `sc.q` 指令异常检测，Huacai Chen 建议保持为 out-of-tree 补丁，认为正确的方式是升级固件，Xi Ruoyao 解释了用户场景和厂商问题，Huacai Chen 表示 distro 内核通常会携带 out-of-tree 补丁。

Huacai Chen [修复了](https://lore.kernel.org/loongarch/20260429080644.2425166-1-chenhuacai@loongson.cn/T/#u)龙架构 32Bit 下 `SYM_SIGFUNC_START` 宏中 `.cfi_offset` 偏移量计算错误——将可变长度 `SZREG` 改为固定值 8，以匹配 sigcontext 中 GPR 的实际长度（8 字节）；该问题由 Xi Ruoyao 发现并建议修复，需要向后移植至稳定内核。

龙架构待办：Chen Wandun [引入了](https://lore.kernel.org/loongarch/20260429065831.1510858-1-chenwandun@lixiang.com/T/#m5a7bd45a18a02ffa1ebaed6b86be295964e47b15) `linux,no-dump` 设备树属性和自动排除 `/memreserve/` 固件区域，通过 `linux,no-dump` 减少 vmcore 大小和捕获时间，龙架构需要在 `prepare_elf_headers()` 中调用新的公共 helper 来过滤这些区域。

### 工具链 {/* #toolchain */}

#### LLVM {/* #llvm */}

[lrzlin](https://github.com/lrzlin) 为龙架构 LSX 向量符号扩展[实现了](https://github.com/llvm/llvm-project/pull/194325)自定义 Lowering，通过组合 `vslti` 和 `vilvl`/`vilvh` 指令，生成更高效的指令序列。

[heiher](https://github.com/heiher) 为龙架构 vNi128 类型[添加了](https://github.com/llvm/llvm-project/pull/193912)向量加/减支持，LLVM 目前对 `v1i128`（128-bit 向量中包含一个 128-bit 整数）和 `v2i128`（256-bit 向量中包含两个 128-bit 整数）类型的向量 `ADD`/`SUB` 操作，会将其完全展开为标量运算，为了将此行为合法化，扩展了 LSX/LASX 的指令选择模式，使其能够生成龙架构原生的 Q 元素大小的向量 `ADD`/`SUB` 指令：`VADD.Q`、`VSUB.Q`(LSX)和 `XVADD.Q`、`XSUB.Q`(LASX)，并[添加了](https://github.com/llvm/llvm-project/pull/193911)测试文件。

#### Binutils {/* #binutils */}

zhaozhou [修复了](https://sourceware.org/git/?p=binutils-gdb.git;a=commit;h=2e5f3d9f0596e60031d7c56cf943cf00e81fe53d)龙架构汇编器（gas）在无显式对齐指令时不对齐的问题，强制机器指令 4 字节对齐，避免链接后指令读取错误；同时 mengqingang 增加测试用例 `insn_align_4.s` 验证对齐行为。

#### GCC {/* #gcc */}

Jingyao Zhang [报告了](https://gcc.gnu.org/bugzilla/show_bug.cgi?id=125049)龙架构在实现栈保护(SSP)时，缺少了 `stack_project_set` 和 `stack_protect_test` 指令模式而退回到通用处理（`emit_move_insn` 和 `emit_cmp_and_jump_insns`），导致在函数结束时，保存栈哨兵标志(Stack Canary)  `__stack_chk_guard` 的寄存器 `$r12` 没有被清零，而直接返回了 `jr $r1`，该问题指派给 Xi Ruoyao。

nihui [报告了](https://gcc.gnu.org/bugzilla/show_bug.cgi?id=125057)龙架构在 GCC 16 中的一个内部编译器错误(ICE,Internal Compiler Error)，当组合使用 LASX 的转换内置函数(`__lasx_cast_128(__lsx_vldd(...))`)和向量扩展内置函数(`__lasx_vext2xv_*`)时，GCC 16 会在 RTL 优化阶段发生段错误导致 ICE。

#### Rust {/* #rust */}

[heiher](https://github.com/heiher) [重构了](https://github.com/rust-lang/stdarch/pull/2094) Rust 标准库的 SIMD 架构支持模块 `stdarch` 中龙架构部分的可移植 SIMD 的辅助代码的命名和内部路径，将 `SimdL` 重命名为 `SimdExt`，相关宏和辅助函数也做了对应调整，并使用 `is::`（内部 intrinsics）、`cs::`（核心架构 SIMD 模块）、`ls::`（龙架构本地 SIMD 辅助函数） 等别名显式限定了不同来源的路径。

[heiher](https://github.com/heiher) [重构了](https://github.com/rust-lang/stdarch/pull/2093)龙架构在 `stdarch` 库中实现 `vbitclr`、`vbitrev`、`vbitset` 等 SIMD 位操作的方式，改为统一使用 `crate::intrinsics::simd` 路径。

## 杂闻播报 {/* #assorted-news */}

### EDK II {/* #edk2 */}

**[kilaterlee](https://github.com/kilaterlee)** [修复并优化了](https://github.com/tianocore/edk2/pull/12515) PC 相对寻址的重定位逻辑，原有的重定位处理方法无法正确处理高位(HI)与低位(LO)不相邻以及一个 HI 对应多个 LO 的复杂场景；同时增加了 `CLANGDWARF` (LLVM)工具链的支持，可以选择使用 LLVM 22.1.0+ 来构建龙架构的 UEFI 固件。

### 其他 {/* #other-assorted-news */}

[wojiushixiaobai](https://github.com/wojiushixiaobai) [报告了](https://github.com/astral-sh/python-build-standalone/issues/1106)在 LoongArch 64 位上运行预编译的 Python 二进制文件时，因 ELF 段的对齐方式（基于 4KB 页面）与目标系统内核实际使用的页面大小（16KB 或 64KB）不匹配，导致加载时发生段错误。

[MutsukiC](https://github.com/MutsukiC) [修复了](https://github.com/microsoft/edit/pull/837)微软 Edit（Edit 是一个具有文本用户界面 (TUI) 的无模式编辑器） 项目中 `stdext` 模块的 crate 属性在龙架构上使用了 `stdarch_loongarch` 的不稳定特性，但该 crate 模块没有通过 `#![feature(stdarch_loongarch)]` 属性显式声明启用此特性而导致的编译失败。

[martin-frbg](https://github.com/martin-frbg) [修复了](https://github.com/OpenMathLib/OpenBLAS/pull/5784) OpenBLAS 在龙架构上配置时，无法将 LSX 和 LASX 的启用状态正确打印到配置文件中的问题。

[lrzlin](https://github.com/lrzlin) [修复了](https://github.com/hrydgard/ppsspp/pull/21595) PPSSPP 模拟器龙架构版本中 `Jit_WeightsU16Skin` 函数的代码错误，解决了在运行《初音未来 - 歌姬计划 扩展版》等游戏时角色模型被错误拉伸的图形渲染问题。

[Ponsanthini](https://github.com/Ponsanthini) 为 x265 视频编码器[添加了](https://github.com/Multicorewareinc/x265/pull/879) 龙架构 SIMD 优化支持，通过利用 LSX/LASX 向量扩展指令集，对 DCT、量化、帧内预测、运动补偿、环路滤波等核心模块进行了汇编级优化，预计会显著提升龙芯平台上的视频编码性能。。

### 发行版们 {/* #distros */}

#### Anollis OS {/* #anllis-os */}

[gaojuxin](https://gitee.com/gaojuxin09) 通过在龙架构内核配置中启用 `CONFIG_PCI_HOST_GENERIC` 驱动，[修复了](https://gitee.com/anolis/cloud-kernel/pulls/6822)在仅使用 `-kernel` 参数启动 QEMU 虚拟机时的启动崩溃问题（因缺少 Flattened Device Tree 形式的 PCI 主机控制器支持导致 i8042 初始化异常）。

[gaojuxin](https://gitee.com/gaojuxin09) 基于上游 KVM 补丁移植到 Anollis Cloud Kernel 6.6 分支，[移除了](https://gitee.com/anolis/cloud-kernel/pulls/6824) KVM 上下文切换时冗余的 Page Global Directory(PGD)保存/恢复操作；[移除了](https://gitee.com/anolis/cloud-kernel/pulls/6826) KVM 中 `kvm_eiointc_create()` 里一个名为 `device1` 的冗余局部变量；[禁止了](https://gitee.com/anolis/cloud-kernel/pulls/6838)在 KVM 设备运行时对 `eiointc` 控制器的 `num_cpu` 和 `feature` 这两个只读属性进行写操作。

#### 安同 OS {/* #aosc-os */}

[miwu04](https://github.com/miwu04) 为 `niri` 窗口管理器[增加了](https://github.com/AOSC-Dev/aosc-os-abbs/pull/15707) `loongarch64_nosimd`（无 SIMD 指令集的龙架构）构建支持。

#### deepin {/* #deepin */}

[opsiff](https://github.com/opsiff) [修复了](https://github.com/deepin-community/kernel/pull/1655) deepin 龙架构发行版上，特定硬件环境下启动时发生的内核 ADE 崩溃问题。通过在 `loongson_gnu_fixup_dma_hang()` 中为未知 GPU 设备 ID 添加 `default` 分支，避免使用未初始化的指针访问内存。

[opsiff](https://github.com/opsiff) 将上游 Linux 内核的一个补丁移植到 deepin 6.6 内核中，[修复了](https://github.com/deepin-community/kernel/pull/1649)使用 LLVM 编译内核并开启 `CONFIG_RUST` 选项时，`objtool` 工具会报告警告。

（临时方案）[opsiff](https://github.com/opsiff) [修复了](https://github.com/deepin-community/kernel/pull/1646)用户在 LL300 笔记本上遇到的驱动加载或数序问题导致的工作异常，将 deepin 龙架构发行版内核配置中的 `PWM_LOONGSON` 驱动从模块(`m`)改为内置(`y`)。

## 张贴栏 {/* #bulletin */}

本栏目可供张贴公益性质的各种信息。

* 您可在 GitHub [浏览](https://github.com/loongson-community/discussions/labels/%E8%8B%B1%E9%9B%84%E5%B8%96)目前所有开放的英雄帖。
* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16