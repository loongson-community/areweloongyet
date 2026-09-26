---
slug: this-week-in-loongarch-156
title: 每周一龙：第 156 期
authors: [jokerm13]
date: 2026-06-15T02:00:00+08:00  # TODO: change to actual time in the finishing commit
tags: [每周一龙]
draft: true  # TODO: remove in the finishing commit
---

每周（尽量）为大家报道 LoongArch 社区最前线的第一手新鲜资讯！
上周的进展主要有 Linux 内核、工具链、Box64、EDK II 及发行版等方面的技术进展。
详情点进来看！

{/* truncate */}

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

## 先「马」再看 {/* #marked-projects */}

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch 领域的重要或长期项目（坑）。

### Linux {/* #linux */}

Hongliang Wang [提交了](https://lore.kernel.org/loongarch/20260608024533.32419-1-wanghongliang@loongson.cn/)为龙芯 2 号 I<sup>2</sup>C (i2c-ls2x) 驱动添加 clock 属性系列补丁的第 6 版，根据上游审阅者的建议移除了 cc stable。

Hongliang Wang 为龙芯 2K0500、2K1000 和 2K2000 的 I<sup>2</sup>C 控制器节点[添加了](https://lore.kernel.org/loongarch/20260609090543.1462-1-wanghongliang@loongson.cn/) `clocks` 和 `clock-frequency` 属性，其中龙芯 2K0500/2K1000 使用 APB 时钟源（`LOONGSON2_APB_CLK`），2K2000 使用 MISC 时钟源（`LOONGSON2_MISC_CLK`）。该补丁已由审阅者 Huacai Chen [合并](https://lore.kernel.org/loongarch/CAAhV-H5UHa+AZG_NQ_Y6Q69TNRYnM8dYKfnz8m7VPEOB_1mSKw@mail.gmail.com/)。

George Guo [提交了](https://lore.kernel.org/loongarch/20260608100852.325413-1-dongtai.guo@linux.dev/)为龙架构添加 `klp-build livepatch`（内核热补丁创建工具）工具支持的第 2 版补丁，修正了 Clang 下可写特殊节 (`__bug_table`、`__jump_table`) 的标记问题，同时移除了冗余的 `asm-offsets.h`；阐明了必须使用 `-fPIC` 而非 `-fPIE` 以保留 GOT 间接引用的根本原因；修复了第 1 版补丁在 `CFLAGS` 变量在 `clean_kernel()` 中定义却在 `build_kernel()` 中使用的问题并确定可使用 Clang 编译通过；修改了 `kpl_build` 使用限制，确保其他架构和配置不受到影响；并重新组织了编译标志替换逻辑，确保补丁系列可构建和可二分。

Binbin Zhou [提交了](https://lore.kernel.org/loongarch/cover.1780908445.git.zhoubinbin@loongson.cn/) CAN-FD (CAN with Flexible Data-Rate) 控制器驱动支持系列的第 2 版补丁：将所有宏定义合并为一个文件；添加了 `COMPILE_TEST Kconfig` 选项并重写了 Kconfig 描述；使用 `regmap_test_bits()` 简化位字段检查并做了代码优化；使用 `guard(spinlock_irqsave)` / `scoped_guard(spinlock_irqsave)`；使用 CAN TDC 框架来获取 SSP 值。审阅者 Vincent Mailhol 就该版补丁[指出](https://lore.kernel.org/loongarch/c9598f85-5b17-4d38-855e-c3840a01452f@kernel.org/)了多个问题。

Tiezhu Yang 为龙架构[实现了](https://lore.kernel.org/loongarch/20260608103516.20643-1-yangtiezhu@loongson.cn/) `THREAD_INFO_IN_TASK` 配置选项：将 `thread_info` 移入 `task_struct`，引入每 CPU 变量 `cpu_tasks` 存储当前任务指针，用于解耦异常入口中 `$tp` 恢复与栈指针的依赖；并内联 BPF helper `bpf_get_current_task()` 和 `bpf_get_smp_processor_id()`，经 3 小时 `stress-ng` 压力测试和 UnixBench 验证通过。但 Bot [反馈](https://lore.kernel.org/loongarch/9f3df2278bfa3db163dc38d388bb060c9459f1c5eab5f42ffd67969d23e5b99f@mail.kernel.org/) 32 位平台 `$tp` 指针存在偏置问题（需在 `__switch_to` 中解偏置）以及 `show_backtrace()` 需添加栈保护。Huacai Chen 针对此系列补丁[指出了](https://lore.kernel.org/loongarch/CAAhV-H5Jub5ddrbLvrve1fU2AFmCokTUCDhkHrDWTupPLb9fkw@mail.gmail.com/)问题并提出了相关修改意见。作者[提交了](https://lore.kernel.org/loongarch/20260611015327.12108-1-yangtiezhu@loongson.cn/) 第 2 版补丁，修复了第 1 版的问题，ashiko-bot [指出](https://lore.kernel.org/loongarch/b88f6055e63f7f4084159c428dc427047d4074517c929f0ce4d6e7bb2b0d57f9@mail.kernel.org/) 32 位 `$tp` 偏置问题未修复；随后作者[提交了](https://lore.kernel.org/loongarch/20260612011616.27771-1-yangtiezhu@loongson.cn/) 第 3 版，修复了该问题。

Bibo Mao [提交了](https://lore.kernel.org/loongarch/20260526125256.2511876-1-maobibo@loongson.cn/)优化龙架构 KVM 的中断注入机制系列补丁的第 6 版：在 `kvm_vcpu_ioctl_interrupt()` 中移除 `INT_SWI0` 中断注入。在补丁 3 中将重命名宏。审阅者 Huacai Chen 针对补丁 5 [提出了](https://lore.kernel.org/loongarch/CAAhV-H7vMq+-nm8f8aL2CvmNYivaHgWj1cTuyv0BTfPQRKpSJA@mail.gmail.com/)简化建议，作者[说明了](https://lore.kernel.org/loongarch/00f28be5-3805-90d1-d2a5-69734b3d0a03@loongson.cn/)其原写法的必要性，讨论还在继续。

Bibo Mao [提交了](https://lore.kernel.org/loongarch/20260609072715.1005923-1-maobibo@loongson.cn/)为龙架构添加 FPU 测试用例的第 2 版补丁。修复了硬编码 EUEN 值、在 `kvm_fpureg` 变量上添加了 `__aligned(64)` 属性、添加了寄存器声明及结构体对齐、UCALL 处理、并在测试用例中移除了 `sync_global_from_guest()` 。审阅者 Huacai Chen [建议](https://lore.kernel.org/loongarch/CAAhV-H64=C8iBRHrE=0rohnGxK1WeWUoG9zWrH9MB1kaw6usww@mail.gmail.com/)简化特性检测代码。

Bibo Mao [提交了](https://lore.kernel.org/loongarch/20260608013222.375257-1-maobibo@loongson.cn/)为龙架构 KVM 设置支持的最大 FPU 类型的第 4 版补丁，修复了第 3 版中 `kvm_lose_fpu()` 过早地检查 KVM_LARCH_FPU 标志，导致跳过了 LBT 禁用，因为 API `kvm_lose_fpu()` 隐含了 `kvm_lose_lbt()` 的问题。目前该补丁已被审阅者 Huacai Chen [合并](https://lore.kernel.org/loongarch/CAAhV-H5mZMciE5YY8MA-OW5+CTzjp+qsPDkHHuEdwO+3xFiWJw@mail.gmail.com/)。

George Guo 为龙架构 BPF JIT [添加了](https://lore.kernel.org/loongarch/20260609041407.122384-1-dongtai.guo@linux.dev/)两个功能，每个功能都通过相应的 `bpf_jit_supports_*()` 钩子通知验证器：

- 实现了仅内部每 CPU (pre-CPU) 使用的地址解析 `BPF_MOV` 指令，通过 `$r21` 寄存器（`__my_cpu_offset`）将每 CPU (pre-CPU) 偏移量转换为绝对地址，用于 `bpf_get_smp_processor_id()` 内联优化和每 CPU 映射 (per-CPU map) 查找;
- 实现了 `arch_bpf_timed_may_goto()` 方法，因此验证器可以将 `may_goto` 降低为定时、基于 `wall-clock-bounded` 的变体，而不是固定迭代计数器。

Tiezhu Yang [修复了](https://lore.kernel.org/loongarch/20260611070009.26257-1-yangtiezhu@loongson.cn/)当 JIT 被禁用或编译失败时回退到解释器导致的非对齐 panic 问题。审阅者 Leon Hwang [认为](https://lore.kernel.org/loongarch/aaca5c93-3b03-4fa2-9653-87c396e5ec7e@linux.dev/)应该将修复调用移到 `(!fp->jited && jit_needed)` 之后。随后作者[提交了](https://lore.kernel.org/loongarch/20260611101216.30153-1-yangtiezhu@loongson.cn/) 第 2 版补丁，审阅者 Leon Hwang 跟进审阅并[建议](https://lore.kernel.org/loongarch/aede5a4b-7325-47fc-8947-1c8307f10665@linux.dev/)可以使用 `bpf_helper_call()` 宏来提高可读性。作者[提交了](https://lore.kernel.org/loongarch/20260612011016.25701-1-yangtiezhu@loongson.cn/) 第 3 版补丁。

Zeng Chi 根据 Binbo Mao [提出](https://lore.kernel.org/loongarch/75a7525a-28d9-fdcb-a696-e56942530e7c@loongson.cn/)的修改意见[提交了](https://lore.kernel.org/loongarch/20260605083108.2534481-1-zeng_chi911@163.com/) 第 3 版补丁，仅做了部分代码调整及主题前缀修改，无代码更改。

haoran.jiang 为龙架构[启用了](https://lore.kernel.org/loongarch/20260606132126.562034-1-haoran.jiang@linux.dev/) `STRICT_MODULE_RWX`（更严格的模块内存权限）安全特性，并将 fixmap（固定映射）的页表移动到 BSS 段，Huacai Chen [指出](https://lore.kernel.org/loongarch/CAAhV-H69RhiGRHO_eBzkU-aWdV92r6LnnbV1pptph85qboArgQ@mail.gmail.com/)不需要更改 fixmap，只需要使用 `set_memory()` API 即可。随后作者[提交了](https://lore.kernel.org/loongarch/20260608063025.281047-1-haoran.jiang@linux.dev/) 第 2 版补丁，将修改页面表权限的方法从 `patch_map` 更改为 `set_memory_xx`。同日[提交了](https://lore.kernel.org/loongarch/20260608063857.291340-1-haoran.jiang@linux.dev/) 第 3 版，修改了提交描述，审阅者 Huacai Chen 希望作者[删除](https://lore.kernel.org/loongarch/CAAhV-H762twrT91Bxq64hLcbG9s78EO+cOdLhWQ3FbW+he36pg@mail.gmail.com/) `patch_lock`，使用 `text_mutex`，将权限修改移出关中断区域。

Xie Zhibang [修正了](https://lore.kernel.org/loongarch/tencent_8BFBEB8F69A01BED468F9275F99FDC335A06@qq.com/)龙架构 kexec 头文件中 `struct kimage` 声明的位置。

### 工具链 {/* #toolchain */}

#### GCC {/* #gcc */}

上周，Xi Ruoyao 发现 GCC 主分支在龙架构上构建因编译器内部错误而失败，并[报告了](https://gcc.gnu.org/PR125609)这一问题。来自高通的 Andrew Pinski 发现这一问题同样影响 AArch64（尽管表象不同），并[修复了](https://gcc.gnu.org/r17-1365)它。最后[将](https://gcc.gnu.org/git/?p=gcc.git;a=commit;h=20c529f47542e94e921556684f8ce27495135926)临时 `SET` 表达式作为 `EXECUTE_IF_SET_IN_HARD_REG_SET` 宏参数的行为，从原本可能引发运行时错误的状态，改为编译时错误 (build-time error)。通过静态检查禁止这种不安全的使用模式，防止未来再次引入同类问题，归因为架构无关问题。

Xi Ruoyao 将对于 stack canary 生存期过长问题导致容易绕过 stack protector 的修复[回合到了](https://gcc.gnu.org/cgit/gcc/commit/?id=4d7d4d282de299ab3f09134b880f9595f60db30a) GCC 13.5。将 `stack_protect_combined_set/test` 扩展器添加到扩展例程，使其作为不可分割的指令序列，不在寄存器中留下任何敏感数据（包括 canary 值、canary 地址以及所有用于实现地址的中间值），防止攻击者通过寄存器探测或覆盖 spill 到栈上的地址绕过 SSP。

上周，Xinmudotmoe [提出了](https://github.com/loongson-community/discussions/issues/123)龙架构应实现 `preserve_none` 调用惯例，[Xuerui Wang (xen0n)](https://github.com/xen0n) [表示](https://github.com/loongson-community/discussions/issues/123#issuecomment-4655384833)支持，认为实现简单、性能提升明显且无兼容性影响。[heiher](https://github.com/heiher) [指出](https://github.com/loongson-community/discussions/issues/123#issuecomment-4655795819) LLVM 已实现 `preserve_none` 调用约定。

#### LLVM {/* #llvm */}

[heiher](https://github.com/heiher) 为龙架构[添加了](https://github.com/llvm/llvm-project/pull/202602) DAG combine 以识别向量扩展左移操作，使其降级为 LSX/LASX 原生 `VSLLWIL` 指令，同时[添加了](https://github.com/llvm/llvm-project/pull/202601)向量左移操作的测试用例。

[heiher](https://github.com/heiher) 为龙架构 CRC 字节和半字节指令[实现了](https://github.com/llvm/llvm-project/pull/203201) `SimplifyDemandedBitsForTargetNode()` 传播，使 DAG 组合器能移除冗余掩码操作，同时[添加了](https://github.com/llvm/llvm-project/pull/203200)相关的测试用例。

[Runze Lin (lrzlin)](https://github.com/lrzlin) 使用 DAG Combine 为龙架构 LSX/LASX 向量扩展[优化了](https://github.com/llvm/llvm-project/pull/202496) `sitofp`/`uitofp` 转换。

[Runze Lin (lrzlin)](https://github.com/lrzlin) 在 TableGen 中使用 `XVPICKEV` 指令组合[添加了](https://github.com/llvm/llvm-project/pull/202485) 256 位 truncate（截断）操作支持，取代了之前使用 DAGCombiner 的方案，作者解释方案的更改旨在降低复杂度和提高可维护性。

#### Rust {/* #rust */}

[heiher](https://github.com/heiher) [修复了](https://github.com/rust-lang/miri/pull/5102) [Miri](https://github.com/rust-lang/miri)（Rust 的中级中间表示解释器）在龙架构上模拟 CRC 内部函数时的语义不匹配的问题。龙架构硬件 CRC 指令仅消耗输入操作数的低 8/16/32 位而忽略高位，但 Miri 将完整输入直接传递给 `compute_crc32`（该函数期望指定宽度以上的所有位为零），导致符号扩展的输入触发 panic；修复通过在调用 `compute_crc32` 之前对输入值进行掩码（如 `input & 0xFF`）以屏蔽高位，使 Miri 行为与硬件一致。

[heiher](https://github.com/heiher) 将 `vmuh`（向量乘法取高半部分）指令的实现[迁移到了](https://github.com/rust-lang/stdarch/pull/2158) stdarch 库的 `intrinsics::simd` 内联函数。

[heiher](https://github.com/heiher) [移除了](https://github.com/rust-lang/stdarch/pull/2159)龙架构 `CRC[C].W.{B,H}.W` 指令的显式零扩展操作。

## 杂闻播报 {/* #assorted-news */}

### Box64 {/* #box64 */}

[Yang Liu (ksco)](https://github.com/ksco) 本周在 [Box64](https://github.com/ptitSeb/box64) 上有多个修复：

- 尝试[修复了](https://github.com/ptitSeb/box64/pull/3927)龙架构 DynaRec 中的未定义行为，但随后作者认为此修复并不正确，因此将代码[回滚了](https://github.com/ptitSeb/box64/pull/3934)。
- [修复了](https://github.com/ptitSeb/box64/pull/3928) `MOVSXD`（用于将 32 位符号扩展为 64 位并移动）指令的模拟实现。
- [修复了](https://github.com/ptitSeb/box64/pull/3933)解释器中部分指令高位没有清零的问题。
- [修复了](https://github.com/ptitSeb/box64/pull/3935)龙架构 DynaRec 中对带有 `0x67` 地址大小前缀的字符串操作相关指令，实现地址高位没有清零的问题。
- 为 D-Bus 库[包装了](https://github.com/ptitSeb/box64/pull/3936)一个新的符号。
- [重构了](https://github.com/ptitSeb/box64/pull/3937)龙架构 DynaRec 中延迟 flags 的相关代码。
- 在 ctest（CMake 的测试驱动程序）中[禁用了](https://github.com/ptitSeb/box64/pull/3938)文件缓存。
- [优化了](https://github.com/ptitSeb/box64/pull/3939) DynaCache 读取缓存时的文件完整性校验。
- [优化了](https://github.com/ptitSeb/box64/pull/3941) DynaRec 中一个用于代码发现的函数 `add_jump()` 的性能，该函数在 Wine 11.10 的冷启动过程中为热点函数。
- 将 DynaCache 中文件缓存相关的选项[标记为](https://github.com/ptitSeb/box64/pull/3942)稳定选项，并调整了最小缓存的大小限制。

### EDK II {/* #edk2 */}

[Dongyan Qian (MarsDoge)](https://github.com/MarsDoge) [修复了](https://github.com/tianocore/edk2/pull/12661)龙架构 UEFI 固件中 `EFI_MEMORY_RP`（只读保护）内存属性的实现：保持映射有效，仅依靠架构的 `PAGE_NO_READ` 位实现有效但不可读的映射，而不是通过移除 `PAGE_VALID` 的保守降级逻辑，使 NULL 页访问从 `#PIL`（页无效异常）变为的 `#PNR`（页不可读异常）；该修复关联 QEMU 提交 [2d877bc02a3b](https://github.com/qemu/qemu/commit/2d877bc02a3b94998cbdd784d194c173d308a98a)。

[Dongyan Qian (MarsDoge)](https://github.com/MarsDoge) 为龙架构[启用了](https://github.com/tianocore/edk2/pull/12655) NULL 指针检测功能。在龙架构 DXE 阶段，当 NULL 指针检测 PCD 使能时，对虚拟地址 0 页应用 `EFI_MEMORY_RP`（禁止读）属性，使其页表项变为无效，从而触发页面无效加载异常；同时修复了启用 NULL 指针检测功能后，引发的 `ResetSystemAcpiLib` 中遍历 RSDT/XSDT 表时可能引用空地址的问题。

[Dongyan Qian (MarsDoge)](https://github.com/MarsDoge) 为 EDK II 的 DynamicTablesPkg [启用了](https://github.com/tianocore/edk2/pull/12668)龙架构通用表生成支持，引入了 LoongArch64 DynamicTableManager，并启用了 5 个通用 ACPI 生成器和 4 个 SMBIOS 生成器，使龙架构能够利用动态表生成框架减少原始表维护工作。

[Dongyan Qian (MarsDoge)](https://github.com/MarsDoge) [修复了](https://github.com/tianocore/edk2/pull/12664) EDK II GenFw 工具在龙架构上 ELF 到 PE/COFF 转换过程中处理 `R_LARCH_64` 重定位地址的问题；该问题会导致跳转表 (switch jump tables) 生成 `R_LARCH_64` 条目保留旧 ELF 地址，进而引发指令未定义异常；修复后在 `WriteSections64()` 中增加了对该重定位类型的转换处理，并在 QEMU 环境中验证了固件成功启动到 UEFI Shell。

[Dongyan Qian (MarsDoge)](https://github.com/MarsDoge) 为 [ModernSetupPkg](https://github.com/MarsDoge/ModernSetupPkg) [提交了](https://github.com/MarsDoge/ModernSetupPkg/pull/42)对 UEFI 设置前端的优化更新，包含 16 个累计提交：将 LVGL 设为构建验证目标 LoongArch/OVMF 的默认后端、增加真实 SMBIOS 数据，新增系统信息详情页、增加图形引擎鲁棒性并实现了平台自适应的仪表盘快速卡片布局。

[Dongyan Qian (MarsDoge)](https://github.com/MarsDoge) 为 [ModernSetupPkg](https://github.com/MarsDoge/ModernSetupPkg) [提交了](https://github.com/MarsDoge/ModernSetupPkg/pull/43)对 UEFI 设置前端的优化更新，包含 8 个累计提交：启用 Secure Boot 进行实时平台 VFR 验证、修复了 LVGL 后端 CJK 字体显示问题、完成了 LVGL 产品化 Gate 4 分辨率矩阵验证，并添加了鼠标支持（光标渲染、点击导航、无闪烁 save-under 合成）及指针输入丢失修复。

### QEMU {/* #qemu */}

[Stefan Hajnoczi](https://gitlab.com/stefanha) [合并了](https://gitlab.com/qemu-project/qemu/-/commit/de5d8bfd6105d3dd3ae668df9762df244a6d1506) [Song Gao (gaosong715)](https://github.com/gaosong715) 的拉取请求 (PR)：该 PR 通过引入 `CPUSysState` 结构体将龙架构目标的系统控制寄存器状态从 `CPULoongArchState` 中分离出来，统一修改所有 CSR 访问路径以使用 `sys_state` 指针。

### 其他 {/* #other-assorted-news */}

本周 rCoreOS（唐图）的 [tgoskits](https://github.com/rcore-os/tgoskits)（面向操作系统与虚拟化开发的集成仓库）项目中收到了多笔龙架构相关的提交：

- [bullhh](https://github.com/bullhh) [报告并总结了](https://github.com/rcore-os/tgoskits/issues/1145)龙架构 QEMU 环境下使用 AxVisor 启动 Linux guest 的实现结果。
- [bullhh](https://github.com/bullhh) 为 AxVisor 在龙架构 QEMU+LVZ 环境下[添加了](https://github.com/rcore-os/tgoskits/pull/1207) Linux guest 启动支持。
- [Feng Lin (Godones)](https://github.com/Godones) 为 eBPF ringbuf [添加了](https://github.com/rcore-os/tgoskits/pull/1208) mmap 支持并修复了龙架构 DMW（直接映射窗口）的问题。
- [Feng Lin (Godones)](https://github.com/Godones) 为 StarryOS [添加了](https://github.com/rcore-os/tgoskits/pull/1232) axbuild 内核支持，同时将龙架构 std 目标代码模型设置为 small，并将 rootfs 缓存移至 `tmp/axbuild/rootfs`。
- [Ke He (Lfan-ke)](https://github.com/Lfan-ke) 为龙架构静态 QEMU 平台[添加了](https://github.com/rcore-os/tgoskits/pull/1214)从设备树动态探测物理内存大小的功能；同时新增了回归测试验证。
- [MF-B](https://github.com/MF-B) [报告了](https://github.com/rcore-os/tgoskits/issues/1104)将 StarryOS 在 LS2K1000 开发板上的适配计划。
- [Rui Zhou (ZR233)](https://github.com/ZR233) 为龙架构的 ArceOS/StarryOS [添加了](https://github.com/rcore-os/tgoskits/pull/1216)动态 UEFI 平台引导支持，同时保留 AxVisor 的静态平台引导路径，使两种路径共存。
- [Rui Zhou (ZR233)](https://github.com/ZR233) 为龙架构[添加了](https://github.com/rcore-os/tgoskits/pull/1190) UEFI 动态平台支持。
- [Rui Zhou (ZR233)](https://github.com/ZR233) [报告了](https://github.com/rcore-os/tgoskits/issues/1229)龙架构 QEMU SMP1 测试系统中，`test-msgrcv` 子测试会导致 QEMU 运行超时（> 1800 秒）。
- [Utopia-V](https://github.com/Utopia-V) [新增了](https://github.com/rcore-os/tgoskits/pull/1178) `git-https` 压力测试，`openssl-loongarch` 回归测试。同时修复了龙架构上 LASX 状态未正确保存/恢复的问题，使 OpenSSL 等使用向量指令的用户程序正常运行。龙架构仅启用了 FP/LSX，未启用 LASX，也没有在任务切换和信号保存路径中保留完整的 LASX 状态，导致在 StarryOS 上为龙架构配置 `git-https` 压力测试时，触发了 OpenSSL/Python ssl 路径上的用户态非法指令异常。

[Suquster](https://github.com/Suquster) [解决了](https://github.com/Suquster/RustMicroOS/pull/113) [RustMicroOS](https://github.com/Suquster/RustMicroOS)（Rust 编写的教学/研究用微内核操作系统）上龙架构特有的两个问题：`SIGCHLD` 的 `SA_RESTART` 语义缺失导致 `busybox sh` 命令替换返回空（505 个 TCONF 错误）的问题，以及 `busybox` 将 `sh` applet 从 `hush` 回退到 `ash` 以消除局部变量作用域问题。

[xcy963](https://github.com/xcy963) [报告了](https://github.com/HITOSTeam/OS_Workspace/issues/29) [OS_Workspace](https://github.com/HITOSTeam/OS_Workspace)（HITOSTeam 中的一个操作系统内核库，推测是一个用于医疗机构的研究项目）中没有利用龙架构双页表寄存器（`CSR_PGDL` 和 `CSR_PGDH`）的特性，而是在进入内核时，将 `PGDL` 和 `PGDH` 都设置为同一个内核页表的问题。

[xcy963](https://github.com/xcy963) [报告了](https://github.com/HITOSTeam/OS_Workspace/issues/27) [OS_Workspace](https://github.com/HITOSTeam/OS_Workspace) 中龙架构内核上电加载地址配置错误导致崩溃的问题。链接脚本 `OS_Workspace/os/src/linker_loongarch.ld` 中 `BASE_ADDRESS` 被错误设置为 `0x9000_0000`（RISC-V 版本为 `0x8000_0000`），导致内核 BSS 段结束地址超出 1 GB 物理内存上限（`0xb025_d048 > 0xb000_0000`），执行 `clear_bss()` 时 PC 跳转到 0 而崩溃；同时内存管理配置仅覆盖了低 512 MB（`0x8000_0000 ~ 0xA000_0000`），高 512 MB 未被纳入帧分配器管理。

[Yang Liu (ksco)](https://git.eden-emu.dev/ksco) 为 Eden（任天堂 Switch 模拟器）的 DynaRmic（用于模拟 ARM 架构指令集）[添加了](https://git.eden-emu.dev/eden-emu/eden/pulls/4054)最小化的 toy 实现，使龙架构可以正确执行 `LSLS` 指令，同时实现了基础寄存器分配、代码块管理和指令发射框架，并通过了相关的单元测试。

[Xuerui Wang (xen0n)](https://github.com/xen0n) 为 [loongfans](https://github.com/loongson-community/loongfans) 双周会页面[添加了](https://github.com/loongson-community/loongfans/pull/131)国际化（英文和俄文）支持。

[XMMOE](https://github.com/XMMOE) [提交了](https://github.com/PaddlePaddle/community/pull/1389)第十届 Hackathon 参赛项目提案 ——为 LoongArch 架构开发基于 OpenClaw 与 AI 算力驱动的软件包自动化移植应用。

[Xiaowei Xu (xuxiaowei-com-cn)](https://github.com/xuxiaowei-com-cn) [发布了](https://github.com/nacos-group/nacos-docker/issues/510) issues 讨论为 [nacos-docker](https://github.com/nacos-group/nacos-docker) 构建龙架构 Docker 镜像的方案。

上周，[Xiaowei Xu (xuxiaowei-com-cn)](https://github.com/xuxiaowei-com-cn) [请求](https://github.com/kubernetes/sig-release/issues/3040)为 Kubernetes SIG-Release 添加龙架构支持，本周[补充信息](https://github.com/kubernetes/sig-release/issues/3040#issuecomment-4657418380)：Kubernetes 依赖的 CoreDNS 容器镜像从 v1.14.4 起已支持龙架构。

### 发行版们 {/* #distros */}

#### 安同 OS {/* #aosc-os */}

[MingcongBai](https://github.com/MingcongBai) [报告了](https://github.com/nodejs/node/issues/63762)在 `Linux 7.0.10-aosc-main-16k` 内核下使用 GCC 15 编译 Node.js 24.26.0 时因 `simdjson` 依赖中的 `memcpy` 内联失败而导致在龙架构上构建失败的问题。定位后发现是 GCC 15 方面的[问题](https://gcc.gnu.org/bugzilla/show_bug.cgi?id=121875)，将在 GCC 15.3 中修复；随后，[Ruoyao Xi (xry111)](https://github.com/xry111) 将 GCC 15 [回合](https://github.com/AOSC-Dev/aosc-os-abbs/pull/16222)补丁修复了 AOSC 上构建 Node.js 24.26.0 失败的问题。

## 张贴栏 {/* #bulletin */}

本栏目可供张贴公益性质的各种信息。

* 您可在 GitHub [浏览](https://github.com/loongson-community/discussions/labels/%E8%8B%B1%E9%9B%84%E5%B8%96)目前所有开放的英雄帖。
* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16
