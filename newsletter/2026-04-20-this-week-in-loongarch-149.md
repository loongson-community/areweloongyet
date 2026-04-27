---
slug: this-week-in-loongarch-149
title: 每周一龙：第 149 期
authors: [jokerm13]
date: 2026-04-27T02:00:00+08:00
tags: [每周一龙]
draft: true
---

每周（尽量）为大家报道 LoongArch 社区最前线的第一手新鲜资讯！
上周的进展主要有 Linux内核、工具链、Box64、EDK II等方面。
详情点进来看！

{/* truncate */}

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

## 先「马」再看 {/* #marked-projects */}

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch 领域的重要或长期项目（坑）。

### Linux {/* #linux */}

#### BPF 子系统

Tiezhu Yang 为龙架构 BPF 跳板机制（BPF trampoline，作为内核函数与 BPF 程序及其他 BPF 程序之间的桥梁）[增加了](https://lore.kernel.org/loongarch/CAAhV-H7PXGyTotvTnw6PKYUdVYzeWVHf5CxP_WxvC5cAdtqBFw@mail.gmail.com/T/#t)小结构体参数（≤16 字节）及最多 12 个函数参数的支持，此前龙架构 BPF trampoline 存在两个主要限制：不支持将结构体作为函数参数进行传递；最多只支持 8 个函数参数，而内核中有超过 200 个函数的参数在 9 到 12 个之间，导致这些函数无法被 BPF 程序追踪。

Hengqi Chen [提交了](https://lore.kernel.org/loongarch/20260422232407.3862942-1-chenhengqi@outlook.com/T/#t) v2 补丁，为龙架构 BPF trampoline 实现了 `BPF_TRACE_FSESSION` 支持，该功能用于 BPF 程序中追踪函数的进入和退出。新增 `emit_store_stack_imm64()` 辅助函数并在 trampoline 栈中为函数元数据和 cookie 分配空间。

Tiezhu Yang 为龙架构 BPF 即时编译器（JIT）[增加了](https://lore.kernel.org/loongarch/de013523-6647-6e43-9093-bd0e31d19126@loongson.cn/T/#t) 8/16 位原子读-改-写指令以及 `load-acquire` 和 `store-release` 内存屏障指令的支持，并通过了 BPF 的自测用例。

#### 其他内核功能

Tiezhu Yang 为龙架构[实现了](https://lore.kernel.org/loongarch/20260420102907.4617-1-yangtiezhu@loongson.cn/T/#u) `CONFIG_THREAD_INFO_IN_TASK`，将 `thread_info` 移入 `task_struct`,引入 `__entry_task` 每个 CPU 变量解耦 `$tp` 恢复与栈指针的依赖，增强系统安全性。

Thomas Weißschuh [删除了](https://lore.kernel.org/loongarch/20260422-vdso-loongarch-cleanup-v1-1-1fef08f07614@linutronix.de/T/#u)龙架构 vDSO 中自定义的 `__arch_vdso_hres_capable()` 函数，使用内核的通用函数实现；该函数功能是检查高精度时钟（hres）是否可用。

2025 年 11 月，Huacai Chen、Jiaxun Yang、Yawei Li 为 Linux 内核[添加了](https://lore.kernel.org/loongarch/20251127154832.137925-1-chenhuacai@loongson.cn/T/#t) LoongArch32 支持，对原子操作、内存管理、系统调用及构建系统等模块进行了适配，该系列补丁已合入 `-next` 分支；但  2026 年 4 月 23 日，Nathan Chancellor 指出 Clang 编译 32 位内核时出现编译错误。

> 最新进展（2026 年 4 月 25 日）：`scripts/Makefile.clang` 无条件地将 LoongArch 的目标设置为  `loongarch64-linux-gnusf`（64 位），但 Clang 将 32 位和 64 位 LoongArch 视为两个独立的目标，Nathan Chancellor 建议使用  `-m32`  标志来解决这个问题，目前 Clang 编译问题得到了解决。

WANG Rui 将龙架构的 KASLR 逻辑从内核移至 EFI stub，[解决了](https://lore.kernel.org/loongarch/20260426120231.532644-1-r@hev.cc/T/#t)内核随机化后可能与 initrd 内存重叠的问题。

龙架构待办：Patrick Roy 和 Nikita Kalyazin 通过一系列补丁[移除了](https://lore.kernel.org/loongarch/aeennZlV60k81OBf@google.com/T/#t)客户机内存从主机内核的直接映射，为 `guest_memfd` 引入 `GUEST_MEMFD_FLAG_NO_DIRECT_MAP` 标志，通过 MM 层新增 `AS_NO_DIRECT_MAP` 标志和 `folio_*_direct_map` 助手，使 `guest_memfd` 能够将其内存从主机内核直接映射中移除，从而有效缓解 Spectre 等瞬态执行漏洞，为特定类型的非机密虚拟机提供更强的安全保障。**但是，由于龙架构尚未实现 `kvm_arch_gmem_supports_no_direct_map()` 函数，这一系列补丁对龙架构没有实际作用，如有社区好友感兴趣，可以考虑推进此项工作。**

### 工具链 {/* #toolchain */}

#### LLVM {/* #llvm */}

> 上周提到的 [wangleiat](https://github.com/wangleiat) 修复了使用 `--emit-relocs` 选项时，LLD 链接器会错误丢弃重定向的问题，已被需求方确认该修复不再需要。

[heiher](https://github.com/heiher) 为龙架构的 LSX 和 LASX 指令集[增加了](https://github.com/llvm/llvm-project/pull/192920)向量右移并舍入（`shift-right-and-round`）指令组合优化测试，并将其[编译为](https://github.com/llvm/llvm-project/pull/192921 "编译为")龙架构下的 `VSRLR`/`VSrAR` 单条硬件指令。

[heiher](https://github.com/heiher) 为龙架构的 LSX 和 LASX 指令集[增加了](https://github.com/llvm/llvm-project/pull/193718)针对三条为操作指令（`VBITCLRI`、`VBITSETI`、`VBITREVI`）的测试，[扩展了](https://github.com/llvm/llvm-project/pull/193719) `vsplat_uimm_{pow2,inv_pow2}` 匹配以允许指定显式的元素位宽，从而能够识别逻辑元素大小不同于向量本机元素类型的 splat 模式。这让编译器能将 `AND/OR/XOR` 运算优化为一条单条硬件位操作指令（`VBITCLRI`、`VBITSETI`、`VBITREVI`）。

[lrzlin](https://github.com/lrzlin) 为 LASX 指令集[引入了](https://github.com/llvm/llvm-project/pull/193727)对向量符号扩展（SIGN*EXTEND）和零扩展（ZERO_EXTEND）操作的专用指令模式，将向量长度扩展操作编译为单条 `VEXT2XV*\*` 系列硬件指令。

[heiher](https://github.com/heiher) 为龙架构的 LSX 和 LASX 指令集[增加了](https://github.com/llvm/llvm-project/pull/193753)识别并优化向量按位选择经典模式的指令选择模式，使编译器能够将 `(a & b) | (~a & c)` 模式识别并优化为单条 `VBITSEL` / `XVBITSEL` 系列指令。

[heiher](https://github.com/heiher) 为龙架构的 LSX 和 LASX 指令集[增加了](https://github.com/llvm/llvm-project/pull/193752)针对向量按位选择操作的测试。

###  Box64 {/* #box64 */}

### 动态重编译器 {/* #DYNAREC */}

[ksco](https://github.com/ksco) [修复了](https://github.com/ptitSeb/box64/pull/3786) LoongArch 64 位动态重编译器（LA64_DYNAREC）中 `LOCK XADD` 指令在计算操作结果标志位时使用了错误寄存器的问题，[修正了](https://github.com/ptitSeb/box64/pull/3787) `PCMPESTRI` 这个 SSE4.2 字符串处理指令时存在的错误 ，[修复了](https://github.com/ptitSeb/box64/pull/3788) `BSF` 和 `BSR` 指令在模拟时对奇偶标志位（PF）的计算错误，[修复了](https://github.com/ptitSeb/box64/pull/3793)在模拟 x86 的 `LOCK` 前缀指令时，对龙架构硬件原子指令 `amadd_db.b` 的使用错误。

[ksco](https://github.com/ksco) [修复了](https://github.com/ptitSeb/box64/pull/3790) DYNAREC 在同时启用 `callret=2` 和 `always_test=1` 时发生越界读取 `callret` 数组导致程序崩溃的问题。

[ksco](https://github.com/ksco) [修复了](https://github.com/ptitSeb/box64/pull/3792)在非 LBT （LoongArch Binary Translation，在龙架构中用于加速二进制翻译的硬件特性）路径下，模拟 32 位 `DEC` 指令时对符号标志位（SF）的计算错误。

[ksco](https://github.com/ksco) [修复了](https://github.com/ptitSeb/box64/pull/3795)在模拟 x86 的 `IMUL`（有符号乘法）指令时，对操作码 `0x69` 形式的立即数加载错误。

[ksco](https://github.com/ksco) 通过使用 4 位查找表[改进了](https://github.com/ptitSeb/box64/pull/3797) DYNAREC 中用于模拟 PCLMUL 指令的 `native_pclmul` 系列函数的软件实现速度。

### Wrapper 子系统 {/* #wrapper */}

[ksco](https://github.com/ksco) [修复了](https://github.com/ptitSeb/box64/pull/3799) Wrapper 子系统（负责将 x86 库的函数调用转译到原生架构的系统库调用）的多个不同的问题，该补丁提交后作者又针对此修复的[跟进修复](https://github.com/ptitSeb/box64/pull/3802)。为 WRAPPERHELPER 工具[新增了](https://github.com/ptitSeb/box64/pull/3803) `--check-only` 选项，可能用于仅执行检查操作。

[ksco](https://github.com/ksco) 在 libc 中[添加了](https://github.com/ptitSeb/box64/pull/3806) libm（数学库）的包装器，确保无论 x86 程序是在链接 libm 还是 libc，Box64 可以正确将其转移到原生库的对应函数。

[ksco](https://github.com/ksco) [修复了](https://github.com/ptitSeb/box64/pull/3809) Wrapper 子系统在包装 GTK 库的自定义函数时遇到的问题，该补丁提交后作者又针对此修复的[跟进修复](https://github.com/ptitSeb/box64/pull/3810)。

### 其他 {/* #other-news */}

[ksco](https://github.com/ksco) [改进了](https://github.com/ptitSeb/box64/pull/3789) Box64 测试脚本的参数解析功能，并增加了按编号运行单个测试组合的功能。

[ksco](https://github.com/ksco) [优化了](https://github.com/ptitSeb/box64/pull/3807) ELF 加载器在找不到符号时输出的错误信息，便于问题诊断。

## 杂闻播报 {/* #assorted-news */}

### EDK II {/* #edk2 */}

[MarsDoge](https://github.com/MarsDoge) 为 EDK II [引入了](https://github.com/tianocore/edk2/pull/12499)龙架构 IOVT（I/O Virtualization Table，是 ACPI 6.6 规范中引入的新表，用于描述龙架构下的 IOMMU 实例以及每个 IOMMU 所管理的设备）的结构定义。

### 其他 {/* #other-assorted-news */}

三周前，[bcoles](https://github.com/bcoles) 为开源渗透测试框架（Metasploit Framework）[增加了](https://github.com/rapid7/metasploit-framework/pull/21239) Linux LoongArch64 平台命令执行 `payload`，通过 `execve` 系统调用执行用户指定的任意命令，本周上游人工审核指出，代码注释中包含 RISC-V 的 URL，作者回复该 `shellcode` 是从 RISC-V 版本移植而来，因此注明了来源。

[Plucky923](https://github.com/Plucky923) 为 Robustone 项目[增加了](https://github.com/hust-open-atom-club/Robustone/pull/55)多架构支持（包括龙架构），该项目是反汇编引擎 Capstone 的 Rust 重写。

[wojiushixiaobai](https://github.com/wojiushixiaobai) [报告了](https://github.com/microsoft/onnxruntime/issues/28157)在龙架构上编译 ONNX Runtime 失败，失败原因是函数签名不匹配，在 `sqnbitgemm_kernel_lasx.cpp` 中的 `QNBitGemmPackQuantBDataSize_Lasx` 模板函数的实现与调用它的结构 `MLAS_QNBIT_GEMM_DISPATCH` 接受参数不一致导致编译器报错 `error: no matches converting function` 。

## 张贴栏 {/* #bulletin */}

本栏目可供张贴公益性质的各种信息。

* 您可在 GitHub [浏览](https://github.com/loongson-community/discussions/labels/%E8%8B%B1%E9%9B%84%E5%B8%96)目前所有开放的英雄帖。
* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16