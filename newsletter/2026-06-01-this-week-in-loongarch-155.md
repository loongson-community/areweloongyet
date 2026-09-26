---
slug: this-week-in-loongarch-155
title: 每周一龙：第 155 期
authors: [jokerm13]
date: 2026-06-08T02:00:00+08:00  # TODO: change to actual time in the finishing commit
tags: [每周一龙]
---

每周（尽量）为大家报道 LoongArch 社区最前线的第一手新鲜资讯！
上周的进展主要有 Linux 内核、工具链及 Box64 等方面的技术进展。
详情点进来看！

{/* truncate */}

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

## 先「马」再看 {/* #marked-projects */}

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch 领域的重要或长期项目（坑）。

### Linux {/* #linux */}

Eric Biggers [提交了](https://lore.kernel.org/loongarch/20260529233208.8703-1-ebiggers@kernel.org/)删除龙芯平台随机数生成器驱动的补丁。作者认为该驱动使用的 `rng_alg` 框架存在多个安全漏洞，且未提供前向安全性；同时，该框架没有其他内核功能接入（因此没有实际作用）。Eric Biggers 建议实现一个标准的 hwrng 驱动。

Huacai Chen 为龙架构[添加了](https://lore.kernel.org/loongarch/CAAhV-H5G-JAkjoTJCK8iHDWxFpFhfNgvr=R9WmoKP2QRoS6GSA@mail.gmail.com/T/#m7eff94af5db1d3195c88159810fa1feca868b75b) QEMU `fw_cfg` 的支持，以便客户机读取主机配置。Peter Maydell [建议](https://lore.kernel.org/loongarch/CAAhV-H5G-JAkjoTJCK8iHDWxFpFhfNgvr=R9WmoKP2QRoS6GSA@mail.gmail.com/T/#md8159be4c8c39756a0764df355a03874e1e2ed3c)在 QEMU 规范层面统一标准，使用标准的 8 字节间隔布局，并在 QEMU 一侧相关清理和规范化修改。

George Guo [提交了](https://lore.kernel.org/loongarch/20260529143238.169169-1-dongtai.guo@linux.dev/T/#m136d8acccfd280e377467709958419af138b3f16)为龙架构添加 KHO (Kexec Hand-Over) 支持的 v2 补丁，对基于 FDT 的系统和仅支持 ACPI 的系统添加了 KHO 支持，扩展了 KHO 自测框架以支持龙架构，并解决了龙架构上 kexec 执行后 QEMU 无法退出的问题。Mike Rapoport [指出](https://lore.kernel.org/loongarch/20260529143238.169169-1-dongtai.guo@linux.dev/T/#m0831f65f9bee778f8f1a228d1ac8522e7376db41)邮件格式有问题，并建议使用通用的 `timeout` 命令来处理 QEMU 不退出的问题。

Binbin Zhou [提交了](https://lore.kernel.org/loongarch/178041371415.93058.4794135670349989571.b4-ty@b4/T/#m0a3b9afd1b9d20f612ede15c3b5b130d84c6fc05)重构龙芯 I<sup>2</sup>S ASoC 驱动的 v3 补丁，删除了 ES8323 补丁，将 `I2S_CTRL` 标记为易失性寄存器，使得读取控制寄存器时可以获得实时硬件状态，而不是使用读取缓存造成数据过时问题。

Binbin Zhou [提交了](https://lore.kernel.org/loongarch/178041371415.93058.4794135670349989571.b4-ty@b4/T/#m0a3b9afd1b9d20f612ede15c3b5b130d84c6fc05)为 2K0300 SoC 添加 I<sup>2</sup>S 控制和声卡支持的 v2 补丁，将 v1 的前四个补丁（和代码清理相关）作为单独系列[提交](Https://lore.kernel.org/all/178041371415.93058.4794135670349989571.b4-ty@b4/)，见上一个补丁，引用了通用的声卡属性(`sound-card-common.yaml`)，并移除了自定义的 `model` 属性；适配了不同 DAI 格式的 2K2000 开发板、中科云久久派、正点原子 ATK-DL2K030/ATK-DL2K0300B 开发板的支持，实现了耳机插孔检测、耳机静音、扬声器使能以及 DAPM 路由功能。

Hongliang Wang [提交了](https://lore.kernel.org/loongarch/20260604015848.18643-1-wanghongliang@loongson.cn/T/#m852923a3c647d60b6eb3b6732766d99fae668af9)为龙芯 2 号 I<sup>2</sup>C (`i2c-ls2x`) 驱动添加 `clock` 属性系列补丁的第 5 版，添加了 CC stable 并区分了两种固件接口：在 DTS 中，通过传递 clocks 属性获取 I<sup>2</sup>C 总线参考时钟，并根据设备数据定义参考时钟的分频比。在 ACPI 中，通过传递 `clocks` 属性来描述 I<sup>2</sup>C 总线参考时钟，并通过 `clock-div` 属性来描述参考时钟的分频比，同时提供了计算精度的公式。

Yanfei Xu [提交了](https://lore.kernel.org/loongarch/20260531135326.2238555-1-yanfei.xu@bytedance.com/)为龙架构 KVM 添加 `irqchip` 索引验证的 v2 补丁，在 `kvm_set_routing_entry()` 中增加 `irqchip >= KVM_NR_IRQCHIPS` 校验，防止用户态传递越界索引导致数组越界访问。

Tao Cui [提交了](https://lore.kernel.org/loongarch/20260602021819.2373404-1-cui.tao@linux.dev/)为龙架构添加 KVM PV TLB (Translation Lookaside Buffer) flush（半虚拟化 TLB 刷新）支持的 v3 补丁，在 `kvm_arch` 结构体中添加一个 `pv_auto_features` 字段，用于保存在 `kvm_vm_init_features()` 函数中设置的内核默认 PV 特性；原子操作指令从 `amswap_db.w` 改为 `amand_db.w` ，修复了 v2 中 Host 侧使用 `amswap_db.w` 操作会破坏保留字段的问题；添加了 Guest 侧的 PV TLB 实现；并添加了多线程基准测试，用于测量龙架构 KVM 内部的 PV TLB 刷新性能。

Bibo Mao [提交了](https://lore.kernel.org/loongarch/20260602074316.1647373-1-maobibo@loongson.cn/)为龙架构 KVM 设置支持的最大 FPU 类型的 v3 补丁，做了补丁合并，并精简了 FPU 状态处理逻辑。随后作者[指出](https://lore.kernel.org/loongarch/20260602074316.1647373-5-maobibo@loongson.cn/T/#u)上游 Sashiko AI 对第 4 个补丁的存在问题：`kvm_lose_fpu()` 新增的提前返回会跳过原本隐含调用的 `kvm_lose_lbt()`，因此直接返回是不正确的。

Bibo Mao [修复了](https://lore.kernel.org/loongarch/20260603023430.1748197-1-maobibo@loongson.cn/)龙架构 KVM 的 FPU 寄存器用户态访问接口在引入 LSX/LASX 支持后产生的 FPU 数据宽度不足的问题，最初仅支持 64 位 FPU，但引入矢量指令集扩展后，需要 256 位 FPU 数据。作者还[添加了](https://lore.kernel.org/loongarch/20260604085752.2820331-1-maobibo@loongson.cn/T/#m520c3e922a94e99f902314098ab5f50084deaf4c) FPU 测试用例，并通过 `KVM_GET_FPU`/`KVM_SET_FPU` API 验证不同宽度下寄存器数据的完整性和一致性。

George Guo [提交了](https://lore.kernel.org/loongarch/dbcb280c-9929-b084-0f2b-4f712a85d17b@loongson.cn/T/#m6d83ff77a88bc3ac19817bc97a63adfc1f1e4858)补丁，让 kexec 避免将内核代码放置在 QEMU 用于存放虚拟机 FDT 的 `0x100000` 处；先前该问题导致 kexec 后内核无控制台输出。Huacai Chen [建议](https://lore.kernel.org/loongarch/dbcb280c-9929-b084-0f2b-4f712a85d17b@loongson.cn/T/#mfaa55a9ff7f53f7f090a0753abd7ce943273de4e)移动 QEMU FDT 而非内核地址，但 Bibo Mao [指出](https://lore.kernel.org/loongarch/dbcb280c-9929-b084-0f2b-4f712a85d17b@loongson.cn/T/#ma46f54a98740a17dc8046713702e790eeecc77b2)移动 QEMU FDT 会导致与现有虚拟机 UEFI 固件不兼容，因为现行固件从这一固定地址载入和解析 FDT。

George Guo [提交了](https://lore.kernel.org/loongarch/20260604114106.391502-1-dongtai.guo@linux.dev/T/#m82b30621b74b9238ef464f3cf804003d7d64f149) v3 补丁，移除了硬编码的 `KEXEC_CONTROL_CODE`，改用 kexec 核心分配的 `control_code_page` 存放 trampoline（与 arm64/riscv 实现对齐）保证不会被 kexec 复制到新内核的内存中；command line 存放在固定地址 `0x108000`（位于内核保留的前 2MB 区域内），确保新内核启动早期能正确读取。此修复解决了 QEMU 环境下 kexec 后新内核无控制台输出的静默启动问题。

Qiang Ma [修复了](https://lore.kernel.org/loongarch/20260604123433.3182173-1-maqianga@uniontech.com/)龙架构 KVM 中 `kvm_emu_xchg_csr()` 函数对 `CSRXCHG` 指令的模拟错误。

Chenguang Zhao 为龙架构[实现了](https://lore.kernel.org/loongarch/20260602021515.214560-1-zhaochenguang@kylinos.cn/) BPF JIT kptr xchg 内联优化，当 JIT 通过 `bpf_jit_supports_ptr_xchg()` 声明支持时，BPF 验证器可以将 `bpf_kptr_xchg()` 辅助函数调用降级为单条原子指令，性能测试显示吞吐量提升 21%。但 Bot [反馈](https://lore.kernel.org/loongarch/20260603100438.2177817-1-zhaochenguang@kylinos.cn/T/#mf5be624bf295a61d051fe795bd22705da50613e3)补丁 1 近修复了 `BPF_XCHG` 的屏障问题，需确认其他带返回值的原子 RMW 指令是否要确保一致性。

Xi Ruoyao [提交了](https://lore.kernel.org/stable/20260603153920.249671-1-xry111@xry111.site/)将 AMDGPU 内核态硬件浮点代码的重构回合到 7.0.y 分支的补丁，以解决 RX 9070XT 等显卡在龙架构无法正常工作的问题。但是 Sasha Levin 指出补丁中错误地包含了 7.0.y 分支不支持的 DCN42 代码，因此该补丁集需要修订。

George Guo [修复了](https://lore.kernel.org/loongarch/20260604091913.306603-1-dongtai.guo@linux.dev/)龙架构在启用 `CONFIG_KFENCE` 时内核热更新 (Live Update) 子系统 `luo_session.c` 因缺少头文件导致的编译错误。

George Guo 为龙架构[添加了](https://lore.kernel.org/loongarch/20260604065317.219777-1-dongtai.guo@linux.dev/) `klp-build livepatch`（内核热补丁创建工具）工具支持，可在龙架构上使用 objtool 自动生成热补丁模块。

Markus Elfring [优化了](https://lore.kernel.org/loongarch/c36cab4c-0a91-4802-8693-a6ae3cee65b1@web.de/)龙架构的 `show_cpuinfo()` 函数，简化了数据输出、删除了不必要的括号以及合并了两个 `seq_puts()` 调用。

Xuewen Wang [修复了](https://lore.kernel.org/loongarch/20260604090151.3254805-1-wangxuewen@kylinos.cn/)龙架构 `set_direct_map_valid_noflush()` 函数中的参数传递错误的问题。

### 工具链 {/* #toolchain */}

#### binutils {/* #binutils */}

zhaozhou [移除了](https://sourceware.org/git/?p=binutils-gdb.git;a=commit;h=48997323b0f929d3255a4845f8a3800c6c00a53a)本地隐藏符号 `ldh` 测试用例。

Xi Ruoyao [启用了](https://sourceware.org/git/?p=binutils-gdb.git;a=commit;h=f8b82c843a960020c493111385b8c5728c20eac9) elf32loongarch 作为 elf64loongarch 的额外目标，反之亦然，允许用户在 Binutils 配置中没有使用 `--enable-targets=all` 参数的情况下，也能构建多库 GCC。

Meng Qinggang [提交了](https://sourceware.org/pipermail/binutils/2026-June/149527.html)修复使用 `ld -r` 混合链接带有 relaxation 信息的输入文件和不带 relaxation 信息的输入文件导致后者的对齐要求被破坏的问题的补丁。

#### GCC {/* #gcc */}

Xi Ruoyao 将对于 stack canary 生存期过长问题导致容易绕过 stack protector的修复[回合到了](https://gcc.gnu.org/r14-12637) GCC 14.4，13.5 待办。另发现之前对于该问题的修复会引起编译器为 LA32 生成代码时错误输出 64 位访存指令，需要为 16.2 和 17 进行进一步修复。

Jeff Law [修复了](https://gcc.gnu.org/git/?p=gcc.git;a=commit;h=232f2ca5dd7f15a7ea4320b483803b028d9c5d5f) ext-dce 更改后龙架构测试用例 `mul-const-reduction.c` 的 `scan-asm` 失败的问题。

[jiegcc](https://github.com/jiegec) [报告了](https://github.com/loongson-community/discussions/issues/120)在 SPEC CPU2026 基准测试的 `astcenc_r` 负载中，Clang 和 GCC 均无法为龙架构生成 `vfmax.s` 指令优化代码的问题。Xi Ruoyao 指出 `vfmax.s` 指令的语义在存在 NaN 时不符合 C 代码的要求，但可以使用`vfcmp.slt.s` + `vbitsel.v` 指令序列实现的向量化最大值，测试发现相比 Clang 编译器生成的代码，吞吐量从 68 M vfmax/s 升至 198 M vfmax/s，相比 GCC 15 编译器生成的代码，吞吐量从 37 M vfmax/s 升至 198 M vfmax/s。初步分析认为 GCC 未能自动进行上述向量化的原因是 threadfull 优化工序将多个 PHI 节点合成了一个无法向量化的巨大 PHI 节点，待进一步调查。

Xinmudotmoe [提出了](https://github.com/loongson-community/discussions/issues/123)龙架构应实现 `preserve_none` 调用惯例，尚无人跟进。

Xi Ruoyao 发现 GCC 主分支在龙架构上构建因编译器内部错误而失败，并[报告了](https://gcc.gnu.org/PR125609)这一问题。来自高通的 Andrew Pinski 发现这一问题同样影响 AArch64（尽管表象不同），并[修复了](https://gcc.gnu.org/r17-1365)它。

#### LLVM {/* #llvm */}

[Runze Lin (lrzlin)](https://github.com/lrzlin) 为龙架构 LSX/LASX [添加了](https://github.com/llvm/llvm-project/pull/201548)使用 `[X]VPICKEV` 自定义向量截断（`TRUNCATE`）优化，并[添加了](https://github.com/llvm/llvm-project/pull/201569) DAG（有向无环图）合并优化，将 double 转换为有符号 32 位整型与 `[X]VFTINTRZ_W_D` 指令结合使用，避免使用 LASX 将 double 转换为 `uint32`。

[Runze Lin (lrzlin)](https://github.com/lrzlin) 为龙架构 LASX [进行了](https://github.com/llvm/llvm-project/pull/201099)优化，将 `ANY_EXTEND` 降低到 `ZERO_EXTEND` 以避免标量化。

[Runze Lin (lrzlin)](https://github.com/lrzlin) 为龙架构 LSX [添加了](https://github.com/llvm/llvm-project/pull/200901)标量无符号整数与浮点数转换的向量指令优化。使用 `vftintrz.lu.d` 将标量 `double`/`float` 值转换为无符号 64 位整数，反之亦然，使用 `vffint.d.lu` 进行反向转换。

[heiher](https://github.com/heiher) 为龙架构 LSX/LASX [添加了](https://github.com/llvm/llvm-project/pull/201488) DAG 组合以进行水平加宽 `ADD`/`SUB` 指令优化，将水平加宽 `ADD`/`SUB` 模式匹配并降级为 `[X]VHADDW` / `[X]VHSUBW` 系列指令，同时[添加了](https://github.com/llvm/llvm-project/pull/201487)关于此次优化的测试。

[Lei Wang (wangleiat)](https://github.com/wangleiat) [修复了](https://github.com/llvm/llvm-project/pull/201260)龙架构因对 `v2f32` 向量结果执行了自定义操作 `FP_EXTEND` 可能会达到 `ReplaceNodeResults` 的值而未处理导致的编译器崩溃的问题（Issue [#198339](https://github.com/llvm/llvm-project/issues/198339)）。通过添加一个空的 `ISD::FP_EXTEND` 分支，让该操作回退到默认的类型合法化逻辑，并新增了测试用例验证从 `<2 x half>` 扩展到 `<2 x float>` 的正确编译。

#### Rust {/* #rust */}

[heiher](https://github.com/heiher) 将 stdarch 库中的向量加载（`vld`/`xvld`）和向量存储（`vst`/`xvst`）指令的实现，从使用内联汇编实现[迁移到了](https://github.com/rust-lang/stdarch/pull/2146) Rust 编译器的 `intrinsics::simd` 接口。

## 杂闻播报 {/* #assorted-news */}

### Box64 {/* box64 */}

[Yang Liu (ksco)](https://github.com/ksco) 为 pipewire 库[包装了](https://github.com/ptitSeb/box64/pull/3925)两个函数，修复了 Steam 使用 pipwire 时的报错问题，并为龙架构 DynaRec [添加了](https://github.com/ptitSeb/box64/pull/3926)一个专用的 `vzero` 寄存器，用于快速生成零向量。

### 其他 {/* #other-assorted-news */}

[Alessandro Gatti (agatti)](https://github.com/agatti) 为 [MicroPython](https://github.com/micropython/micropython)（为微控制器设计的精简 Python 解释器）的 Unix 端口[添加了](https://github.com/micropython/micropython/pull/19292)龙架构支持。

[a6d9a6m](https://github.com/a6d9a6m) 为 Comix 内核[添加了](https://github.com/comix-kernel/comix/pull/261) [OSCOMP](https://github.com/oscomp)（全国大学生操作系统比赛）评测自动运行支持并修复了龙架构大内存启动崩溃的问题。

[ErnstPeng](https://github.com/ErnstPeng) 基于最新上有代码[重新提交了](https://github.com/Multicorewareinc/x265/pull/900)为 [x265](https://github.com/Multicorewareinc/x265)（开源 H.265/HEVC 视频编码器）[添加了](https://github.com/Multicorewareinc/x265/pull/900)龙架构 SIMD 向量优化补丁，目前上游审阅已初步通过。

[Henrik Rydgård (hrydgard)](https://github.com/hrydgard) [修复了](https://github.com/hrydgard/ppsspp/pull/21781) [PPSSPP](https://github.com/hrydgard/ppsspp) 在 issues [#21780](https://github.com/hrydgard/ppsspp/issues/21780) 报告的《极品飞车：卡本峡谷》的渲染问题，本轮修复同时修复了龙架构上的一些问题。

[Hanlu Li (LaurenIsACoder)](https://github.com/LaurenIsACoder) [修复了](https://github.com/lat-opensource/lat/pull/304) [LAT](https://github.com/lat-opensource/lat)（龙芯 x86 架构转译器）在16K 页大小的龙架构主机上运行 4K 页 x86_64 客户程序时出现的 ELF 加载 `PT_LOAD` 段重叠问题，同时[清理了](https://github.com/lat-opensource/lat/pull/302) LATX 树，删除与龙架构无关的目标代码。

[Dongyan Qian (MarsDoge)](https://github.com/MarsDoge) 为 [LVGL](https://github.com/lvgl/lvgl)（开源嵌入式图形库）的 UEFI 后端[添加了](https://github.com/lvgl/lvgl/pull/10221)龙架构支持，添加了架构检测代码中的条件编译分支。

[Anjia Wang (ouankou)](https://github.com/ouankou) [修复了](https://github.com/ouankou/rex/pull/824) [rex](https://github.com/ouankou/rex)（用于构建大规模Fortran源代码到源代码程序转换和分析工具的编译器基础设施） 龙架构上链接器选择和构建问题。rex 项目在构建龙架构的 Docker 镜像时，构建过程没有选择正确的链接器，而是使用了默认的 `ld.bfd`，导致在链接 `librose.so` 时极慢（耗时 702.4 秒），修复后链接时间缩短至 10.7 秒。

[Solarpasserby](https://github.com/Solarpasserby) [完成了](https://github.com/Solarpasserby/RespOS/pull/14) [RespOS](https://github.com/Solarpasserby/RespOS)（基于 rCore-v3 编写的内核程序）的龙架构移植，新增了龙架构专用链接脚本`linker_loongarch.ld`，修复了 `.eh_frame_hdr` 节导致的入口点偏移问题。

[tannevaled](https://github.com/tannevaled) 为 [tamago-go](https://github.com/usbarmory/tamago-go)（Go 实现的裸机运行时环境，用于安全/嵌入式场景）工具链[添加了](https://github.com/usbarmory/tamago-go/pull/17) `GOOS=tamago GOARCH=loong64` 支持，在 QEMU loongarch64 上完整通过 Go 兼容性测试套件；并遵照 [Issue #70](https://github.com/usbarmory/tamago/issues/70) 中维护者的分步推进要求，不包含任何 PIE 或外部二进制修改。

[tsuibin](https://github.com/tsuibin) [报告了](https://github.com/loongson-community/discussions/issues/122)先前 Phoronix 报道的在 Debian 上龙芯 3B6000 处理器运行 PHP 的性能表现不如树莓派 5（500+）的问题。

[Xiaowei Xu (xuxiaowei-com-cn)](https://github.com/xuxiaowei-com-cn) 本周在开源社区中有多个功能修复：

- [请求](https://github.com/etcd-io/etcd/issues/21877)为 [etcd](https://github.com/etcd-io/etcd)（一个分布式键值存储系统）添加龙架构支持，并说明了具体修改内容，但项目维护者 [Josh Berkus (jberkus)](https://github.com/jberkus) 说明 etcd 的所有测试都依赖 Kubernetes 的 CI 基础设施 (Prow)，此基础设施尚未支持龙架构。作者随后为 coredns（Kubernetes 的核心域名解析组件）[添加了](https://github.com/coredns/coredns/pull/8137)龙架构支持。

- [请求](https://github.com/containernetworking/plugins/issues/1263)为 [CNI](https://github.com/containernetworking/plugins)（容器网络接口）核心插件添加龙架构支持，同时 [请求](https://github.com/kubernetes/sig-release/issues/3040)为 Kubernetes SIG-Release 添加龙架构支持。

- 为 CNI（容器网络接口）核心插件的 CI 测试和发布流程[添加了](https://github.com/containernetworking/plugins/pull/1262)龙架构支持。

## 张贴栏 {/* #bulletin */}

本栏目可供张贴公益性质的各种信息。

* 您可在 GitHub [浏览](https://github.com/loongson-community/discussions/labels/%E8%8B%B1%E9%9B%84%E5%B8%96)目前所有开放的英雄帖。
* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16

