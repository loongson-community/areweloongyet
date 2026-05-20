---
slug: this-week-in-loongarch-152
title: 每周一龙：第 152 期
authors: [jokerm13]
date: 2026-05-18T02:00:00+08:00  # TODO: change to actual time in the finishing commit
tags: [每周一龙]
draft: true  # TODO: remove in the finishing commit
---

每周（尽量）为大家报道 LoongArch 社区最前线的第一手新鲜资讯！
上周的进展主要有 Linux 内核、工具链及 Box64 等方面的进展。
详情点进来看！

{/* truncate */}

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。


## 先「马」再看 {/* #marked-projects */}

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch 领域的重要或长期项目（坑）。

### Linux {/* #linux */}

Bibo Mao [移除了](https://lore.kernel.org/loongarch/20260509040159.338866-1-maobibo@loongson.cn/T/#u)龙架构 KVM 软件定时器 (swtimer) 过期时的定时器中断注入。KVM 使用 swtimer 来模拟硬件定时器中断，当 swtimer 到期时会调用 `kvm_swtimer_wakeup()` 函数，该函数同时执行了 `kvm_queue_irq(vcpu, INT_TI)`（注入定时器中断）和 `rcuwait_wake_up(&vcpu->wait)`（唤醒可能处于空闲状态的 vCPU），因为该定时器中断会在 vCPU 唤醒后的 `kvm_restore_timer` 路径中正确注入，此处调用 `kvm_queue_irq` 是冗余的。在 5 月 13 日，Bibo Mao [提交了](https://lore.kernel.org/loongarch/20260509040159.338866-1-maobibo@loongson.cn/T/#u)此系列的 v2 补丁，使用了通用 KVM API `kvm_vcpu_wake_up(vcpu)` 替换 `rcuwait_wake_up(&vcpu->wait)`。

Bibo Mao [优化了](https://lore.kernel.org/loongarch/96f15a3c-5401-d654-6a4a-0a5d41a1bafa@loongson.cn/T/#t) KVM 中断注入。通过将 msgint 特性检查移出热路径、使用现有宏定义 (`CSR_GINTC`、`CSR_GSTAT`\) 中断位掩码替换硬编码常量、使用位掩码批量处理中断清除/注入、以及新增 `kvm_vcpu_sync_intr()` 简化状态同步，提升了龙架构 KVM 中断处理性能，简化了 VM 迁移时的中断状态获取逻辑。2026 年 5 月 14 日，Bibo Mao 提交了此系列的 v2 补丁，[新增了](https://lore.kernel.org/loongarch/20260514062824.1378373-1-maobibo@loongson.cn/T/#t)中断号和 CSR 写入的有效性检查，并将中断清除与注入的批量化处理合并为一个补丁。

> 此系列的前情提要：WANG Rui [解决了](https://lore.kernel.org/loongarch/20260426120231.532644-1-r@hev.cc/T/#t)启用 KASLR 时内核映像与 initrd 之间的重叠问题；随后，WANG Rui [提交了](https://lore.kernel.org/loongarch/20260428040159.1065822-1-r@hev.cc/T/#me0cd42adeb0d4830b0d990d07c6b5e63b446b801) v2 版本（基于 RFC v1），删除了 `rdtime_h/1` 补丁，改用 `random_get_entropy()`；增加了对齐、最小偏移等安全性改进。2026 年 4 月 29 日，WANG Rui [提交了](https://lore.kernel.org/loongarch/7efff830-06c6-44d8-a613-f230253c014e@app.fastmail.com/)此系列的 v3 补丁，新增了 initrd 重叠检查，恢复了 Kconfig range 的原有范围，并根据 v2 反馈优化了函数命名和类型；同日，WANG Rui [提交了](https://lore.kernel.org/loongarch/20260429120300.1786210-1-r@hev.cc/T/#t)此系列的 v4 补丁，根据 Huacai Chen 的反馈重命名函数并修正变量类型。

WANG Rui 针对内核启用 KASLR 时与 initrd 内存重叠问题的补丁系列，本周迎来了第五版：[新增了](https://lore.kernel.org/loongarch/20260511104555.196270-1-r@hev.cc/T/#t)休眠场景的处理（检测 `resume=` 参数时禁用 KASLR），并添加了注释说明 KASLR 定义。

Jinjie Ruan 在为 arm64/riscv 架构添加 crashkernel CMA 预留添加支持的补丁中，[添加了](https://lore.kernel.org/loongarch/20260511030454.1730881-1-ruanjinjie@huawei.com/T/#t)龙架构中的 buffer overflow 边界检查防止越界访问，并通过使用公共 helper 简化了代码实现。

Tianyang Zhang 基于 2026 年 2 月 3 日[提交](https://lore.kernel.org/loongarch/20260203124522.2288900-1-zhangtianyang@loongson.cn/)的此系列 v11 补丁，[提交了](https://lore.kernel.org/loongarch/CAAhV-H6qd-frORWPV=AQ7xWNk7mSrgSaNZdtyFYwaE8bw8gCqg@mail.gmail.com/T/#mbcac1293be7621f17628e77c550dc4f0990f008a)关于中断重定向支持的 v12 补丁，添加了高级扩展 IRQ 模型的描述、通过 REDIRECT 控制器将 MSI 中断动态映射到 CPU/中断向量，已获得 Huacai Chen 的 `Acked-by`。

Tiezhu Yang [修复了](https://lore.kernel.org/loongarch/20260512082029.2131-1-yangtiezhu@loongson.cn/T/#t)龙架构在高负载追踪下 ftrace 和 kprobes 的四个问题：修复任务迁移后过时的 pre-CPU kprobe 状态未被清除，导致 CPU 永久处于忙碌状态，在 `kprobe_ftrace_handler()` 中添加了自我重置机制；在 SMP 系统上，kprobe 处理程序偶尔在某些 CPU 核心上失败，使用 `larch_insn_text_copy()` 替代直接内存写入；原始代码直接使用原始内存存储将指令分配给缓冲区，缺少指令屏障同步，使用 `larch_insn_patch_text()` 替代直接赋值，修复了单步执行槽准备；修复 `KPROBE_HIT_SS` 和 `KPROBE_REENTER` 两种致命不可恢复递归的处理。作者于 2026 年 5 月 15 日[说明](https://lore.kernel.org/loongarch/CAAhV-H7aR3NBpTk8Nbg0bphuXoDXa+xjo=bMLbrApm-SwvJYOw@mail.gmail.com/T/#t)，放弃补丁 #1，保留补丁 ＃2 和 #4，同时将修改补丁 #3，移除关于“原子性”的介绍。

Hongliang Wang 基于其 v2 补丁（为 ls2x I2C 驱动[添加了](https://lore.kernel.org/loongarch/84c37ac1-3a9c-b0d2-f86a-90712b45b806@loongson.cn/T/#t) `clock` 属性），[发送了](https://lore.kernel.org/loongarch/20260509082837.28778-1-wanghongliang@loongson.cn/T/#u) v3 补丁，根据 Huacai Chen 的审阅意见简化了 I2C 驱动中时钟解析的实现，移除了冗余的 `chip_data` 结构体，将 `factor` 改名为 `div`，优化了条件判断逻辑。

Huacai Chen [修复了](https://lore.kernel.org/loongarch/20260517092432.1025008-1-chenhuacai@loongson.cn/T/#u)龙架构内存热移除代码中因上游接口变更（上游内核提交：`feee6b2989165631b` ("mm/memory\_hotplug: shrink zones when offlining memory") 修改了 `__remove_pages()` 函数的接口，移除了 `zone` 参数）产生的未使用变量的编译警告。

于 2026 年 4 月 12 日 Xi Ruoyao 提交的关于龙芯 3C6000 系列早期步进 PCIe 桥接器的 LinkCap2 报告错误的 v8 补丁，目前已由 Manivannan Sadhasivam 合并。此系列补丁耗时 9 个月时间，终于迎来了[合并](https://lore.kernel.org/loongarch/177858581215.17835.9314837252988039944.b4-ty@b4/T/#t)，3C6000 平台的 PCIe 链路速度控制恢复正常，不是通过寄存器上报的“支持速率”只有 2.5 GT/s (PCIe 1.0)，而是支持 16 GT/s (PCIe 4.0)。

### 工具链 {/* #toolchain */}

#### GCC {/* #gcc */}

Lulu Cheng [报告了](https://gcc.gnu.org/bugzilla/show_bug.cgi?id=125305)龙架构 GCC 编译性能问题：

- 现象：在编译 `gavl` 项目的 `hq/rgb_rgb_hq.c` 文件时，使用 `-mtune=la664` 编译时间耗时约为使用 `-mtune=la464` 编译时间耗时的 17 倍。
- 原因：这是因为 `TARGET_SCHED_FIRST_CYCLE_MULTIPASS_DFA_LOOKAHEAD` 的值在两种调优下不同，`la464` 和 `la664` 的值分别为 4 和 6，该值控制指令调度器在每一周期尝试重新排列的指令数量，这导致值从 4 变为 6 之后，排列数增长，导致调度器耗时增加。
- 社区讨论：Lulu Cheng 认为将 `loongarch_cpu_multipass_dfa_lookahead` 数组中对所有 LA64 调优的值设为 0；Xi Ruoyao 和 Mingcong Bai 认为不应该完全禁用指令调度，Xi Ruoyao 说明应效仿 AArch64，仅禁用 `-O2` 及以下的早期调度，`-O3` 时保留；或允许用户通过 `-fschedule-insns` 手动开启；Drea Pinski 指出耗时主要在 `sched2`（第二次调度）而非早期调度，目前社区正在讨论解决方案。

2026 年 5 月 2 日，Xi Ruoyao [提交了](https://gcc.gnu.org/pipermail/gcc-patches/2026-May/715495.html)将 `a ^ b ^ (a | c)` 改写为 `(~a & c) ^ b` 的补丁，以利用龙架构的 andn 指令。Lulu Cheng 和 Andrew Waterman   指出补丁提交消息存在错误，需要修改。本周，Xi Ruoyao [提交了](https://patchwork.sourceware.org/project/gcc/patch/20260514014105.94105-1-xry111@xry111.site/)此系列的 v2 补丁。

2026 年 5 月 2 日，Xi Ruoyao [提交了](https://gcc.gnu.org/pipermail/gcc-patches/2026-May/715496.html)将形如 `(a == b) ? 0 : (a < b) ? -1 : 1` 的 spaceship 操作展开为两条 `slt[u]` 指令和一条减法指令的补丁，Lulu Cheng 指出其中一处寄存器符号/零扩展状态标记疑似有误，需解释或修改。本周，Xi Ruoyao [提交了](https://patchwork.sourceware.org/project/gcc/patch/20260515033236.64564-1-xry111@xry111.site/)此系列的 v2 补丁。

#### LLVM {/* #llvm */}

[Enna1](https://github.com/Enna1) [优化了](https://github.com/llvm/llvm-project/pull/196473) LLVM 的 `SmallMapVector` 容器，为 `MapVector` 添加一个纯向量 (vector-only) 模式：当元素数量不超过小阈值时，仅使用向量存储，避免预分配 map 索引，减少了内存开销；当超过阈值时，动态构建 map 索引，并切换到常规的 `MapVector` 路径。这次优化为通用架构优化，龙架构包含在内。

[CSharperMantle](https://github.com/CSharperMantle) [修复了](https://github.com/llvm/llvm-project/pull/196940) LLVM 在处理 `SymA == nullptr` 且 `SymB != nullptr` 时，因空指针解引用而崩溃的问题，通过增加回退到 `Fallback()` 路径，避免生成无效重定位。

[MaskRay](https://github.com/MaskRay) [修复了](https://github.com/llvm/llvm-project/pull/198147) LLD 在处理 RISC-V 和龙架构的 `-r` 可重定向输出时，因弱对齐重定位而错误抑制对齐合成的问题。`-r` 生成可重定位目标文件 (.o) 时，此时 LLD 会检查输入节 (section) 起始处是否有 `R_RISCV_ALIGN` 或 `R_LARCH_ALIGN` 重定位。如果存在，LLD 会跳过为该节起始位置合成对齐填充。旧版汇编器（如 GNU as 或旧版 LLVM MC）可能会在节起始处生成一个**较弱的**对齐重定位（例如对齐到 4 字节），但节的实际对齐要求可能更高（例如 16 字节，由 `.balign 16` 等指令产生，但不产生重定位）。这导致 LLD 错误地认为节起始已有对齐重定位，从而跳过合成实际需要的高对齐填充，最终输出错误。

#### Zig {/* #zig */}

[cataggar](https://github.com/cataggar) [完成了](https://github.com/ctaggart/zig/pull/481)龙架构 64 位软浮点 (loongarch64-sf) 和 s390x 架构的浮点环境控制 (fenv) 实现从 C 语言 (musl libc) 迁移到纯 Zig，完成了 Issue #359。

[cataggar](https://github.com/cataggar) 将 `sigaction` 信号处理实现从 musl C [迁移到](https://github.com/ctaggart/zig/pull/552) Zig。

[cataggar](https://github.com/cataggar) [报告了](https://github.com/ctaggart/zig/issues/495)使用 Zig 交叉编译到龙架构等多个目标时在 LLVM 代码生成阶段出现段错误的问题，原因是 LLVM 后端在同一编译单元中定义并导出 `__stack_chk_fail` 会导致崩溃；已通过内联汇编 + 别名的方式绕过。

#### Rust {/* #rust */}

heiher 优化了 stdarch 项目中的 SIMD 函数，将龙架构下的 vpickve2gr.d / vpickve2gr.w 等 SIMD 指令的底层实现，从原有的手写汇编或内联函数，迁移到使用 instrinsics::simd 统一接口。

## 杂闻播报 {/* #assorted-news */}

### Box64 {/* #box64 */}

本周 Box64 模拟器在龙架构_DYNAREC 后端迎来大量改进：[ksco](https://github.com/ksco) [优化了](https://github.com/ptitSeb/box64/pull/3839)  MOVNT（Non-Temporal，非临时移动）指令的 modreg 非法操作码处理，[修复了](https://github.com/ptitSeb/box64/pull/3840)龙架构上仅适用 LSX 时路径的逻辑问题，SIMD 指令在无 LASX 扩展时向 LSX 的正确降级路径，并[新增了](https://github.com/ptitSeb/box64/pull/3842)对 `fastround=2` 舍入模式的支持，使浮点运算在需要舍入行为时能够正确翻译和执行，[添加了](https://github.com/ptitSeb/box64/pull/3854) `66 14` (ADC) 和 `66 EB` (CALL) 两个 16 位操作码支持以提升对 16 位 x86 代码的模拟能力。

x87 FPU 指令集模拟得到显著增强，包括 `FBLD/FBSTP` 的 BCD 加载/存储三项[修复](https://github.com/ptitSeb/box64/pull/3850)（加载时忽略符号字节的低半字节、存储时根据 x87 控制字进行舍入、保留负零符号）、[修复了](https://github.com/ptitSeb/box64/pull/3851) `FNSAVE/FRSTOR` 操作码的错误实现，确保 FPU 状态保存或恢复，[修复了](https://github.com/ptitSeb/box64/pull/3853) JIT 中 `XLAT`、[修复了](https://github.com/ptitSeb/box64/pull/3849) `XSAVE`/`XRSTOR` 等指令的错误实现。

此外还为龙架构后端。动态缓存方面[优化了](https://github.com/ptitSeb/box64/pull/3858)文本缓存版本生成、[修复了](https://github.com/ptitSeb/box64/pull/3859) CPU 扩展参数检测问题并[添加了](https://github.com/ptitSeb/box64/pull/3860)缓存大小限制选项。其他改进包括[降低了](https://github.com/ptitSeb/box64/pull/3846) `endBox64` 日志冗余、为 libGL（OpenGL 库）的包装层 (wrapper) [添加了](https://github.com/ptitSeb/box64/pull/3847) 1 个图形扩展支持、[支持](https://github.com/ptitSeb/box64/pull/3848) Rust 风格十六进制数字分隔符解析，使其支持 Rust 风格的用下划线分隔数字字面量、[添加了](https://github.com/ptitSeb/box64/pull/3855)简单的运行测试，去除 fork 等调用以方便调试，以及[增加了](https://github.com/ptitSeb/box64/pull/3844)一个假的 Python 解释器来规避平台检测导致的不兼容问题。

### EDK II {/* #edk2 */}

[MarsDoge](https://github.com/MarsDoge) 为龙架构虚拟化固件 OvmfPkg [添加了](https://github.com/tianocore/edk2/pull/12586)早期串口基址缓存优化，以显著减少 DEBUG 构建的启动时间。`EarlyFdtSerialPortLib16550` 库在每次调用 `GetSerialRegisterBase()` 时都会从设备树重新解析 UART 基址，在 DEBUG 构建过程中，会因频繁的 FDT 查找而引入明显的启动时间开销，通过复用龙架构 CSR 寄存器 `KS1` 缓存 UART 基址，将 DEBUG 固件中反复解析设备树的耗时优化为单次查找，使 QEMU 启动到 BDS 的时间缩短约 0.85s。

### 其他 {/* #other-assorted-news */}

[Lfan-ke](https://github.com/Lfan-ke) [提议](https://github.com/gevico/machina/issues/152)为 machina 模拟器添加与 `riscv-tests` 并行的 LoongArch64 CI 测试工作流，通过复用 QEMU 的龙架构 TCG 测试用例或自建裸机固件，对每条指令进行模拟验证，确保 PR #109 引入的龙架构客户机支持的质量和长期可维护性。

[Lfan-ke](https://github.com/Lfan-ke) [提议](https://github.com/gevico/machina/issues/151)为 machina 模拟器添加龙架构龙芯虚拟化扩展 (LVZ，Loongson Virtualization Extension) 的模拟。

[zhaixiaojuan](https://github.com/zhaixiaojuan) [报告了](https://github.com/ollama/ollama/issues/16057)在龙架构上构建 `ollama` 时失败的问题，原因是 CMake 配置引用了不存在的源文件 `ggml-cpu/arch/loongarch/quants.c`；这或许是 `ggml` 库尚未为龙架构提供基于 LSX/LASX 的 SIMD 量化实现。

[xujiegb](https://github.com/xujiegb) [报告了](https://github.com/mono/SkiaSharp/issues/3972)在龙架构上运行基于 Avalonia 或 .NET 的应用程序（如：v2rayN）时，`libSkiaSharp.o` 无法加载，后续 SkiaSharp 官方说明在龙架构上构建未能正确导出 `libpng` 的LSX 优化函数 `png_init_filter_functions_lsx`，导致依赖它的图形应用无法启动，目前该问题已被 Skia 上游修复。

[Alireza29675](https://github.com/Alireza29675) [报告了](https://github.com/Alireza29675/teamctl/issues/253) teamctl 在龙架构上使用 `go build` 编译，但因 `syscall.TIOCGETD` 未定义而编译失败的问题，需要为龙架构添加该常量的定义或重构相关代码。

[CSharperMantle](https://github.com/CSharperMantle) [报告了](https://github.com/rui314/mold/issues/1584) mold 链接器在龙架构上执行指令 relaxation 后，未能正确清理或更新重定位表，导致过时的重定位残留并错位到其他指令上。

[miiyakumo](https://github.com/miiyakumo) 计划[重构](https://github.com/comix-kernel/comix/issues/249) Comix 内核的启动流程，将 RISC-V 和龙架构共用的初始化逻辑抽离到通用模块中。

---

[zevorn](https://github.com/zevorn) 为 machina 模拟器[添加了](https://github.com/gevico/machina/pull/154)龙架构 LVZ 扩展的关键模拟功能，使其能够启动 Linux guest 并成功通过 KVM 烟雾测试 (`KVM_SMOKE_RESULT=PASS`)，修复了包括存储条件指令语义、FDT 内存映射在内的多个问题。

[wojiushixiaobai](https://github.com/wojiushixiaobai) 为 napi-rs（一个使用 Rust 构建预编译 Node.js 原生扩展框架）[添加了](https://github.com/napi-rs/napi-rs/pull/3287)龙架构（GNU 和 musl）支持，包括目标构建、CI 构建任务和交叉编译 Docker 镜像；审阅指出 Alpine 和 Debain 镜像的构建需要改进。

[trufae](https://github.com/trufae) 为 r2ghidra（radare2 的 Ghidra 反编译插件）[添加了](https://github.com/radareorg/r2ghidra/pull/238)龙架构的反编译支持，同时增加了 m8c、m16c、68xx、h6309、m680x 等其他架构。

[BoneInscri](https://github.com/BoneInscri) 为 hvisor [添加了](https://github.com/syswonder/hvisor/pull/304) 3A6000 平台的 SMP 支持，包括多核启动、IPI 扩展、EIOINTC 中断控制器软件模型、per-CPU 定时器、ACPI/EFI 引导以及调试改进，同时为 hvisor-tool（hvisor 轻量级虚拟机监控器的配置工具集）的[添加了](https://github.com/syswonder/hvisor-tool/pull/90) ACPI 引导下的 virtio IRQ 支持和动态物理内存分配功能；并在 3A6000 平台上提供了多 zone (Linux、seL4、rt-thread、NPU) 的配置示例。

[Panxuefeng-loongson](https://github.com/Panxuefeng-loongson) 将 LoongArch64 [移植合并](https://github.com/Tencent/TencentKona-21/pull/20)到腾讯 JDK 发行版 TencentKona-21 中，可能是 TencentKona-21 的 Loongson 分支历史被破坏了，因此重新整合到了一个新分支。

[heiher](https://github.com/heiher) 为 edit 项目[优化了](https://github.com/microsoft/edit/pull/858)龙架构 SIMD 代码，通过使用立即数比较和简化累加器设置，使 `simd/lines_fwd` 在 8 字节和 134 MB 测试场景下吞吐量提升约 25%。

[basilisk-dev](https://github.com/basilisk-dev) 在 Eclipse 社区项目 eUXP 中，为集成库 zlib-ng [添加了](https://github.com/Eclipse-Community/eUXP/pull/2)对龙架构的 SIMD 指令支持。

[futzhj](https://github.com/futzhj) 为 ChocoLightEngine [添加了](https://github.com/futzhj/ChocoLightEngine/pull/27)基于 SDL3 的硬件检测模块 `Light.CPUInfo`，提供了 18 个函数 + 1个常量（其中包括龙架构 `HasLSX` 和 `HasLASX` 函数），用于硬件特性检测。

[doruche](https://github.com/doruche) 为 anemone（一个用 Rust 编写的操作系统内核）内核[添加了](https://github.com/anemone-os/anemone/pull/82) POSIX/Linux 风格信号处理实现，包括龙架构的的信号架构层 (`signal.rs`)、`rt_sigreturn` 蹦床 (trampoline)、用户态 `#[signal_handler]` proc-macro 和信号测试程序，但 `rt_sigreturn` 蹦床汇编可能需要验证。

[mturac](https://github.com/mturac) 为 Ollama 的 GGML [添加了](https://github.com/ollama/ollama/pull/16172)龙架构量化源文件，从而修复龙架构上的 CMake 构建问题。

[EDGW](https://github.com/EDGW) 为 Anemone OS（一个用 Rust 编写的操作系统）的 RISC-V64 和 LoongArch64 [添加了](https://github.com/anemone-os/anemone/pull/89)完整的 FPU 支持，包括内核上下文切换、用户态浮点异常处理以及一个浮点功能测试程序。

Memtest86plus [发布了](https://github.com/memtest86plus/memtest86plus/pull/589) v8.10，其中有针对龙架构的优化和问题修复：

- [ziyao233](https://github.com/ziyao233) [优化了](https://github.com/memtest86plus/memtest86plus/pull/578)内存速度测试循环，修正了缓存带宽读数。在龙芯3A5000平台上，龙架构上简单逐 8字节复制的循环无法充分利用处理器流水线，而 x86_64 的  rep movsl/movsq 指令则能被优化为高效的微操作。作者将内存复制循环从每次8字节展开 (Unroll) 为每次 64 字节（一个缓存行大小），以填充处理器的加载/存储单元。
- [MarsDoge](https://github.com/MarsDoge) [修复了](https://github.com/memtest86plus/memtest86plus/pull/589)龙芯 2K3000/3B6000M 平台的显示问题。在龙架构上，位于 4  GiB 以上地址空间的 PCIe MMIO 区域（例如 framebuffer 显存）必须被映射为“非缓存 (Uncached)”属性。作者调整了 PCIe 内存窗口的布局，确保为帧缓冲设备正确设置了内存区域属性。
- [MarsDoge](https://github.com/MarsDoge) [修改了](https://github.com/memtest86plus/memtest86plus/pull/593)CPU 温度读数溢出与显示格式问题。

### 发行版们 {/* #distros */}

#### 安同 OS {/* #aosc-os */}

[MingcongBai](https://github.com/MingcongBai) 为安同 OS 发行版的 `linux-kernel-6.18.27` [修复了](https://github.com/AOSC-Dev/aosc-os-abbs/pull/15893) CVE-2026-43500 漏洞。

#### deepin {/* #deepin */}

[Zeno-sole](https://github.com/Zeno-sole) 为 deepin 社区的 libvirt 软件包[添加了](https://github.com/deepin-community/libvirt/pull/23)龙架构支持。

[opsiff](https://github.com/opsiff) 为 deepin 内核的龙架构分支[启用了](https://github.com/deepin-community/kernel/pull/1709) `THP_SWAP` 内核配置选项（已在 x86、ARM64 和 RISCV 上测试可以显著提高交换吞吐量），仅在 `HAVE_ARCH_TRANSPRENT_HUGEPAGE` 被选中时启用，测试显示启用后在 3A5000 上交换带宽提升约 46.75%。

[opsiff](https://github.com/opsiff) 为 deepin 6.12 内核[添加了](https://github.com/deepin-community/kernel/pull/1718)龙架构 PWM 控制器驱动，但目前仍存在需要修复的问题。

[opsiff](https://github.com/opsiff) [临时解决](https://github.com/deepin-community/kernel/pull/1741) CVE-2026-46300（网络分片处理漏洞），在 deepin [6.18.y 内核](https://github.com/deepin-community/kernel/pull/1741)和 [6.12.y 内核](https://github.com/deepin-community/kernel/pull/1740)的龙架构和 ARM64 桌面配置中临时禁用 ESP-in-TCP 相关选项。

[opsiff](https://github.com/opsiff) 分别在 [6.12.y 内核](https://github.com/deepin-community/kernel/pull/1738)和 [6.18.y 内核](https://github.com/deepin-community/kernel/pull/1739)中修复了内核代码 `net/core/skbuff.c` 中多个分片处理函数未能正确传递 `SKBFL_SHARED_FRAG` 的漏洞 (CVE-2026-46300)，该漏洞可被利用进行权限提升。

## 张贴栏 {/* #bulletin */}

本栏目可供张贴公益性质的各种信息。

* 您可在 GitHub [浏览](https://github.com/loongson-community/discussions/labels/%E8%8B%B1%E9%9B%84%E5%B8%96)目前所有开放的英雄帖。
* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16
