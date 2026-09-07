---
slug: this-week-in-loongarch-154
title: 每周一龙：第 154 期
authors: [jokerm13]
date: 2026-06-08T02:00:00+08:00  # TODO: change to actual time in the finishing commit
tags: [每周一龙]
---

每周（尽量）为大家报道 LoongArch 社区最前线的第一手新鲜资讯！
上周的进展主要有 Linux 内核、工具链、Box 64 及 EDK II 等方面的技术进展。
详情点进来看！

{/* truncate */}

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

## 先「马」再看 {/* #marked-projects */}

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch 领域的重要或长期项目（坑）。

### Linux {/* #linux */}

上周 Eric Biggers 为龙芯 RNG 驱动 (`CRYPPTO_DEV_LOONGSON_RNG`) 的 Kconfig  `select CRYPTO_RNG` 依赖标记，以解决构建失败的问题。本周在对这个驱动的作用和去留问题进行[讨论](https://lore.kernel.org/loongarch/20260525145939.GC2018@quark/T/#mc3c4127d89c3ec9d0d35809a8bbf36c710adf251)之余，Herbert Xu 已将该补丁[合并](https://lore.kernel.org/loongarch/ahktWQCfZYel_0hZ@gondor.apana.org.au/T/#m284e91b26b5f1b55e398cd327216b0101e1fcd25)。

George Guo 为龙架构[添加了](https://lore.kernel.org/loongarch/177970825876.4071219.16831083000796070841.b4-reply@b4/T/#m21913dbd9fc4696bda393297ffada4a7bd41bf8a) KHO (Kexec HandOver) 支持及自测试框架，同时多位审阅者提出了意见：Pratyush Yadav [反对](https://lore.kernel.org/loongarch/177970825876.4071219.16831083000796070841.b4-reply@b4/T/#m9bcb3ea4abf4488cfc5c0e15619c826e383238f1)通过命令行传递敏感地址并建议使用设备树 (FDT) 传递数据；Mike Rapoport [建议](https://lore.kernel.org/loongarch/177970825876.4071219.16831083000796070841.b4-reply@b4/T/#m5c999cf98f90c4377e304f6ecaa461eac0e85efa)重组补丁并单独发送 KFENCE 修复；Huacai Chen [质疑](https://lore.kernel.org/loongarch/177970825876.4071219.16831083000796070841.b4-reply@b4/T/#m387790aee65edaed6f0afa162b01d8bc508fa875) i8042 禁用补丁的必要性。

Hongliang Wang [提交了](https://lore.kernel.org/loongarch/20260526031021.32662-1-wanghongliang@loongson.cn/T/#m6dd131bcfcd829badecdcdfe8e770a7233dfd619)为龙芯 2 号 I<sup>2</sup>C (i2c-ls2x) 驱动添加 `clock` 属性系列补丁的第 4 版，驱动实现了从设备树或 ACPI 获取参考时钟并根据硬件分频系数计算 I<sup>2</sup>C 总线速度，Huacai Chen 和 Krzysztof Kozlowski 提出了部分修改意见，作者确定将会提交 v5 补丁。

Binbin Zhou [重构了](https://lore.kernel.org/loongarch/cover.1779796354.git.zhoubinbin@loongson.cn/T/#m05ebe0d23dc9b9c665a264c015e142b92961246c)龙架构 I<sup>2</sup>S ASoC 驱动，在 MAINTAINERS 中添加了条目以跟踪龙芯音频驱动；区分内部 DMA (iDMA) 和外部 DMA (eDMA) 实现；并修复了 ES8323 编解码器驱动中的数个问题，审阅者 Mark Brown [指出](https://lore.kernel.org/loongarch/cover.1779796354.git.zhoubinbin@loongson.cn/T/#mc9b2ce52edb6cd2b54e538075e4b2448d726a184) `LS_I2S_CTRL` 需标记为 volatile 且 ES8323 补丁不应预设音量寄存器的问题。

Tao Cui 为龙架构[添加了](https://lore.kernel.org/loongarch/20260526111837.2090768-1-cuitao@kylinos.cn/T/#m94884cdbd359daf6b0478150cc2bb5be81ed385b) KVM  PV TLB (Translation Lookaside Buffer) flush（半虚拟化 TLB 刷新）支持，通过复用 `steal-time` 共享内存页的标志位优化多 vCPU 场景下的 TLB 刷新性能，实测延迟降低 68.6%；但 Bibo Mao [指出](https://lore.kernel.org/loongarch/20260526111837.2090768-1-cuitao@kylinos.cn/T/#m912d54bd6010fec7e1f669086abc5b6bd2fc4ffd) Host/Guest 侧存在内存竞争和字节级 cmpxchg 性能问题；作者发布了 v2 补丁[修复了](https://lore.kernel.org/loongarch/20260528133558.2196416-1-cuitao@kylinos.cn/T/#m6ad9ce0b7638c8c9a8bed462160675c1c195921a)内存竞争问题，Host 侧改用 `amswap_db.w` 原子交换指令，Guest 侧合并为单次 `READ_ONCE` 并使用 32 位 `try_cmpxchg`，延迟降低 68.6%（吞吐量提升约为 3.2 倍）。

George Guo [提交了](https://lore.kernel.org/loongarch/dbcb280c-9929-b084-0f2b-4f712a85d17b@loongson.cn/T/#m6d83ff77a88bc3ac19817bc97a63adfc1f1e4858)补丁，让 kexec 避免将内核代码放置在 QEMU 用于存放虚拟机 FDT 的 0x100000 处；先前该问题导致 kexec 后内核无控制台输出。Huacai Chen [建议](https://lore.kernel.org/loongarch/dbcb280c-9929-b084-0f2b-4f712a85d17b@loongson.cn/T/#mfaa55a9ff7f53f7f090a0753abd7ce943273de4e)移动 QEMU FDT 而非内核地址，但 Bibo Mao [指出](https://lore.kernel.org/loongarch/dbcb280c-9929-b084-0f2b-4f712a85d17b@loongson.cn/T/#ma46f54a98740a17dc8046713702e790eeecc77b2)移动 QEMU FDT 会导致与现有虚拟机 UEFI 固件不兼容，因为现行固件从这一固定地址载入和解析 FDT。

Qiang Ma 为龙架构 KVM 的 `kvm_loongarch_cpucfg_get_attr()` 函数[添加了](https://lore.kernel.org/loongarch/20260526074202.789799-1-maqianga@uniontech.com/T/#mdaa2454747f54e1c18687cdd91bd7185822c6b3c) `put_user()` 返回值检查，当用户空间地址无效时返回 `-EFAULT` 而非没有错误提示，`put_user()` 用于将 CPU 配置寄存器值返回到用户空间。

Bibo Mao [提交了](https://lore.kernel.org/loongarch/20260522064945.614486-1-maobibo@loongson.cn/T/#ma374704c059e9f497f8d658883e0051560b4e93e)优化龙架构 KVM 的中断注入机制系列补丁的第 4 版：

- 修改了 vector 变量的类型为 `unsigned int`，以处理负数输入，并使用 `abs()` 宏；
- 移除了 v3 系列补丁中的第 6 个补丁，因为 `kvm_vcpu_sync_intr()` 函数无法正确同步缓存的 AVEC 中断到 `SW CSR_ISR` 状态；
- 将 `kvm_set_sw_gcsr()` 替换为 `kvm_write_sw_gcsr()`，因为 `kvm_set_sw_gcsr()` 会对缓存的 ESTAT 中断位进行 OR 操作，而 `kvm_write_sw_gcsr()` 是覆盖整个 SW ESTAT 寄存器，语义更正确；
- 修正了标题和日志信息的拼写错误。

Bibo Mao [提交了](https://lore.kernel.org/loongarch/20260526125256.2511876-1-maobibo@loongson.cn/T/#ma87505edcd8f9b59b5887a5788d2136f1af296ea)优化龙架构 KVM 的中断注入机制系列补丁的第 5 版：

- 在 `kvm_vcpu_ioctl_interrupt()` 中添加了 `irq` 有效性检查；
- 将 msgint 功能检查移到中断后处理；
- 使用寄存器 `CSR_GINTC` 和 `CSR_ESTAT` 的中断位宏代替硬编码常量值；
- 使用位掩码批量注入中断；
- 增加了 ESTAT CSR 的有效位掩码过滤；
- 将终端投递移到设置 `IN_GUEST_MODE` 之后，优化 IPI 发送逻辑。

Yanfei Xu 为龙架构和 PowerPC 架构的 KVM [增加了](https://lore.kernel.org/loongarch/76f82194-9afb-4dfe-ad96-ae338c7db61d@linux.ibm.com/T/#mb6d4758b37e3d194305c6b2a5b7bce34c18ef9b8) `irqchip` 索引验证，避免因越界访问路由表的 `chip` 数组，而引发内存损坏或系统崩溃，并获得了 Bibo Mao 的 Reviewed-by。

Zeng Chi 根据上周 Bibo Mao 的反馈的锁保护缺失的问题，[提交了](https://lore.kernel.org/loongarch/af3e9ecc-cb30-6d7d-5f2d-19ddf42755a0@loongson.cn/T/#mea2f851a5a68c1d351b537eaec96ba5cb96b3952) v2 补丁，修复了 `ipi.c`、`pch_pic.c` 和 `eiointc.c` 文件中的锁保护缺失的问题，并获得了 Bibo Mao 的 Reviewed-by。

Tiezhu Yang 为 libbpf [添加了](https://lore.kernel.org/loongarch/20260526063936.16769-1-yangtiezhu@loongson.cn/T/)龙架构的 `__NR_bpf` 系统调用号定义（值为 280），避免编译失败的问题，其他开源项目也提到了此补丁修复。

Tiezhu Yang [提交了](https://lore.kernel.org/loongarch/20260526070316.28228-1-yangtiezhu@loongson.cn/T/#m541c335ae9dfcb7393da253af5a189c2979c6ce7)龙架构 BPF JIT 的尾部调用问题系列补丁的第 2 版，移除了序言对齐的补丁，保留了注释/宏定义重构和 off-by-one 计数器错误修复。


### 工具链 {/* #toolchain */}

#### GCC {/* #gcc */}

[Chen (jiegec)](https://github.com/jiegec) [报告了](https://github.com/loongson-community/discussions/issues/119)在龙架构上使用 LASX 时，Clang 和 GCC 都会为  `706.stockfish_r`  (SPEC CPU 2026 INT Rate) 中的 NNUE 混合符号 int8 点积生成次优代码的问题（Clang 仅用 LSX，GCC 不知道 LASX 有混合符号加宽乘法指令），手写 LASX 汇编相较于 Clang LSX 快约 7.2 倍，比 GCC 16 LASX 快约 39%，[Xi Ruoyao (xry111)](https://github.com/xry111) 已提交 GCC 补丁[添加了](https://gcc.gnu.org/pipermail/gcc-patches/2026-May/718594.html) `usdot_prod` 模式来识别和优化该模式，补丁待审阅。

#### LLVM {/* #llvm */}

[heiher](https://github.com/heiher) [修复了](https://github.com/llvm/llvm-project/pull/199326)龙架构线程局部存储 (TLS，Thread Local Storage) 调试信息的重定位问题。

[Simon Pilgrim (RKSimon)](https://github.com/RKSimon) [改进了](https://github.com/llvm/llvm-project/pull/200209) SelectionDAG 层的 `isAllOnesOrAllOnesSplat` 函数，使其能识别隐式截断的常量（如 `i8 1` 被视为 `<8 x i1>` 的全一掩码），从而优化龙架构 LSX 向量比较指令的代码生成，减少指令数量并优化了测试用例 `vmskcond.ll`。

#### Rust {/* #rust */}

本周，Rust 发布 v1.96.0，该版本正式为龙架构[启用了](https://github.com/rust-lang/rust/pull/153427) linker relaxation 功能，可在一定程度上降低二进制大小并提高性能。

[Aelin (Gelbpunkt)](https://github.com/Gelbpunkt) [修复了](https://github.com/rust-lang/stdarch/pull/2136) stdarch 库中龙架构 CRC 内嵌函数的问题，第一次提交使 CRC 内嵌函数只支持 64 位龙架构，第二次提交将 8 位和 16 位宽数据的 CRC 内嵌函数参数类型与 Clang 和 GCC 对齐。

[heiher](https://github.com/heiher) 根据 [folkerdev](https://github.com/folkertdev) 提议和 zlib-rs 的下游兴趣，[提议](https://github.com/rust-lang/stdarch/pull/2137)稳定龙架构 CRC 内嵌函数，参数类型与 Clang 的 `larchintrin.h` 保持一致，使用有符号整型。

[heiher](https://github.com/heiher) [修复了](https://github.com/rust-lang/stdarch/pull/2140) stdarch 库中龙架构 LSX/LASX 内嵌函数的可见性问题和旧式常量泛型索引问题。

#### Zig {/* #zig */}

[Tiburón café (xphost008)](https://github.com/xphost008) [报告了](https://github.com/natecraddock/ziglua/issues/214) Ziglua 在龙架构上编译失败的问题，作者使用 `zig build` 构建时，`zig translate-c` 阶段因未知原因失败，[robbielyman](https://github.com/robbielyman) 推测问题可能在 Zig 工具链或用户系统 libc 处理层面有关。

## 杂闻播报 {/* #assorted-news */}

### Box64 {/* #box64 */}

[Yang Liu (ksco)](https://github.com/ksco) 本周向 Box64 提交了多笔针对龙架构的贡献，其中包括启用 AVX 指令集仿真及针对Wine 新版本 (&gt; 11.5) 和一些游戏的兼容性修复：

- 为龙架构默认[启用了](https://github.com/ptitSeb/box64/pull/3907) AVX 指令集仿真，提升运行 AVX 密集型 x86 应用的性能。
- 使用哈希表[优化了](https://github.com/ptitSeb/box64/pull/3890) DynaRec 中构建大代码块时的代码发现性能，大幅缩短新版本 Wine 冷启动用时（从 21 秒缩短到 16 秒）。
- 暂时[忽略了](https://github.com/ptitSeb/box64/pull/3895) Wine 11.5 开始使用的 `PR_SET_SYSCALL_USER_DISPATCH`（是一个 Linux prctl 操作，用于将系统调用的控制权从内核态转移到用户态，允许应用程序选择性拦截和模拟某些系统调用）prctl 操作，该操作在龙架构上不支持，因此忽略了此处调用。随后，作者[实现了](https://github.com/ptitSeb/box64/pull/3897) `PR_SET_SYSCALL_USER_DISPATCH` 模拟，修复了 Wine 11.5+ 对于该 API 的依赖导致的崩溃。
- [添加了](https://github.com/ptitSeb/box64/pull/3892) deferred signals 机制并应用于代码保护模块，进一步提升新版本 Wine 冷启动用时；[修复了](https://github.com/ptitSeb/box64/pull/3896)添加 deferred signals 机制后出现的问题。
- [修复了](https://github.com/ptitSeb/box64/pull/3894) brick stubs 可执行权限被意外降级的问题，并修复了新版本 Wine 运行某些程序时的崩溃问题。
- [增加了](https://github.com/ptitSeb/box64/pull/3891)《使命召唤 4》的单应用配置。
- [修复了](https://github.com/ptitSeb/box64/pull/3906)龙架构上 `readFreq()` 函数对 CPU 频率的读取问题，使其返回与 `RDTSC` 操作码模拟使用的 `rdtime.d` 计时器相匹配的频率值，而非 `sysinfo` 返回的 CPU 实际频率。
- [修复了](https://github.com/ptitSeb/box64/pull/3904) Box32 的完整路径解析功能中，运行 Proton 时遇到的空指针解引用问题。
- [重构了](https://github.com/ptitSeb/box64/pull/3898) DynaRec 上对失效代码块管理，简化逻辑，提升运行时安全。
- [修复了](https://github.com/ptitSeb/box64/pull/3905)龙架构_DynaRec 中 `RDTSC` 操作码的模拟实现错误。
- [修复了](https://github.com/ptitSeb/box64/pull/3900)龙架构_DynaRec 中 AVX 的缓存管理问题，并[优化了](https://github.com/ptitSeb/box64/pull/3902) AVX2 配置项的实现方式。
- [优化了](https://github.com/ptitSeb/box64/pull/3903)龙架构_DynaRec 对 x86 `IRET` 操作码的处理，确保中断返回指令在龙架构上被正确仿真。

### EDK II {/* #edk2 */}

[Bo Zhu (90geek)](https://github.com/90geek) 为龙架构[添加了](https://github.com/tianocore/edk2/pull/12623) `__ashlti3`（GCC 及基于 LLVM 的编译器针对体积优化代码时会使用该函数进行 128 位左移操作）函数实现，解决 OpenSSL Curve448 代码因使用 `unsigned __int128` 而产生的 libgcc 的依赖问题，使龙架构固件能正常链接 OpensslLibFull。

### 其他 {/* #other-assorted-news */}

[Yimin Sun (emmansun)](https://github.com/emmansun) [记录了](https://github.com/emmansun/gmsm/issues/505)为 Go 语言商用密码软件 gmsm 库中的 SM4 国密分组密码算法实现或扩展龙架构 LASX 优化的需求和工作计划，涵盖 8 路并行 ECB/CTR/CBC-decrypt 解密加密，使用 `XVSHUF.B` 进行基于寄存器的 S-box 查找，`XVROTRI.W` 进行 L 转换、round 函数展开以及密钥调度设置。

[Haoxuan Pi (pihaoxuan)](https://github.com/pihaoxuan) [报告了](https://github.com/anthropics/claude-code/issues/61680)在龙架构上通过 npm 安装 Claude Code 时，postinstall 脚本会报错的问题。

[Shyliuli](https://github.com/Shyliuli) [提交了](https://github.com/Hmbown/CodeWhale/issues/1945)为 CodeWhale（一款专为 DeepSeek 模型设计的 AI 终端编程助手）添加龙架构支持的请求；这一问题其实是 CodeWhale 的依赖 deepseek-tui 在龙架构上无法构建导致的，而究其根因则是 deepseek-tui 间接依赖的 `nix 0.25.1` 未在 ioctl 常量表中包含龙架构的定义。Shyliuli 通过本地修补 nix 依赖成功构建并运行了 CodeWhale。至截稿时，项目维护者 [Hunter Bown (Hmbown)](https://github.com/Hmbown) 已通过 PR [#1992](https://github.com/Hmbown/CodeWhale/pull/1992) 升级 `portable-pty` 修复了该问题，该修复将纳入 v0.8.45。

[Xiaowei Xu (xuxiaowei-com-cn)](https://github.com/xuxiaowei-com-cn) [提交了](https://github.com/kubernetes/kubernetes/issues/139319)希望为 Kubernetes（一个开源的容器编排平台，专门用于自动化部署、管理和扩展容器化应用程序）添加龙架构支持及为 Kubernetes 发布工程工具[添加](https://github.com/kubernetes/release/issues/4415)龙架构支持的请求，但 [Sascha Grunert (saschagrunert)](https://github.com/saschagrunert) 指出由于 Go 将 `linux/loong64` 视为二级支持架构，目前只能以社区支持 (Tier 3) 级别加入。

[Timothy Herchen (anematode)](https://github.com/anematode) 为 Stockfish 国际象棋引擎进一步[提升了](https://github.com/official-stockfish/Stockfish/pull/6862)龙架构上的性能优化，STC 测试显示 Elo 提升约 +2.93。

[darkyzhou](https://github.com/darkyzhou) 为 Redis [添加了](https://github.com/redis/redis/pull/15247)龙架构崩溃回溯支持，因为在 `getAndSetMcontextEip` (`src/debug.c`)中缺少龙架构分支，会进入 `NOT_SUPPORTED`，并返回 NULL 从而跳过寄存器转储。

[Aelin (Gelbpunkt)](https://github.com/Gelbpunkt) 上周为 zlib-rs（一个用 Rust 编写的 zlib 库）[提交了](https://github.com/trifectatechfoundation/zlib-rs/pull/511)龙架构的 CRC32 硬件加速实现后，[Folkert de Vries (folkertdev)](https://github.com/folkertdev) 建议在 Miri（Rust 的模拟执行器）中也实现这些内嵌函数，因此为龙架构 CRC 内嵌函数[添加了](https://github.com/rust-lang/miri/pull/5062) shim 支持。

[huhu715-nc](https://github.com/huhu715-nc) 为 agent-browser（AI 智能体驱动的浏览器自动化工具）[添加了](https://github.com/vercel-labs/agent-browser/pull/1390)龙架构支持。

[Henrik Rydgård (hrydgard)](https://github.com/hrydgard) 为 PPSSPP（跨平台的 PSP 游戏模拟器）[添加了](https://github.com/hrydgard/ppsspp/pull/21733)龙架构的交叉编译设置和 CI 持续构建。

[Yang Liu (ksco)](https://git.eden-emu.dev/ksco) 为 Eden（任天堂Switch模拟器）[添加了](https://git.eden-emu.dev/eden-emu/eden/pulls/4015)龙架构支持。

[Na Zhang (loongson-zn)](https://github.com/loongson-zn) 为 bpfilter [添加了](https://github.com/facebook/bpfilter/pull/549)龙架构支持，编译过程中缺少 `__NR_bpf` 系统调用号的定义导致构建失败；作者完成了 CLA 签署，并通过了 XDP 规则 ACCEPT/DROP 的功能测试。

[miiyakumo](https://github.com/miiyakumo) [重构了](https://github.com/comix-kernel/comix/pull/257) comix 内核的 CPU 和时钟频率管理，为龙架构陷阱处理添加了 SpinLock 保护；[引入了](https://github.com/comix-kernel/comix/pull/255)硬件陷阱帧抽象 (`HwTrapFrame`) 为龙架构提供实现，更新了控制台输出和中断处理接口。

[Jinyang He (MQ-mengqing)](https://github.com/MQ-mengqing) 为 llama.cpp（LLM 推理框架）为 `q8_0`、`q6_K`、`iq4_xs` 量化类型和 `fp16` 加载和存储[添加了](https://github.com/ggml-org/llama.cpp/pull/23798) LSX 支持。

[Hui Ni (nihui)](https://github.com/nihui) [优化了](https://github.com/Tencent/ncnn/pull/6749) ncnn 项目中的龙架构的 GEMM 代码和转置打包实现，并新增了 INT8 GEMM NT 测试；[重构了](https://github.com/Tencent/ncnn/pull/6745)龙架构的打包代码风格。

[Trung Lê (runlevel5)](https://github.com/runlevel5) 为 ejson-rs（用 Rust 编写的密钥管理工具）[添加了](https://github.com/runlevel5/ejson-rs/pull/38)龙架构发布构建支持（GNU 和 musl 目标），通过 `cross-rs` 实现交叉编译。

[Xiaotian Wu (yetist)](https://github.com/yetist) 为 blink.lib（是 Neovim 流行代码补全插件 blink.cmp 的一个底层共享函数库）[添加了](https://github.com/saghen/blink.lib/pull/22)龙架构支持，并为 blink.cmp [添加了](https://github.com/saghen/blink.cmp/pull/2549)龙架构 CI 构建支持。

本周 tgoskits（面向操作系统与虚拟化开发的集成仓库）上有部分功能修复：

- [Rui Zhou (ZR233)](https://github.com/ZR233) [修复了](https://github.com/rcore-os/tgoskits/pull/959) Starry LoongArch CI 中 apk-curl 测试偶发卡死的问题，为 apk 操作添加独立超时、增加 CERNET 和 Alpine upstream 镜像 fallback、添加 `APK_CURL_*` 阶段 marker 将总超时从 1200s 降低到 420s，并修复了 `axfs-ng-vfs` 中的若干锁顺序问题，避免 lockdep 误判和死锁风险。
- [Kelei Cheng (Lfan-ke)](https://github.com/Lfan-ke) [修复了](https://github.com/rcore-os/tgoskits/pull/922)龙架构上因页分配器选取空闲区域有问题，导致系统有空闲内存但仍然内存溢出，用户态分配被锁死在 248 MB 空间的问题，通过选择最大空闲区初始化页分配器，解决该问题；还[修复了](https://github.com/rcore-os/tgoskits/pull/917)龙架构上用户态 LSX 可用性的问题，包括龙架构上 FP/向量密集的用户程序，如 gradle/kotlin 在信号/抢占下崩溃或挂起、numpy 拒绝 import。

## 张贴栏 {/* #bulletin */}

本栏目可供张贴公益性质的各种信息。

* 您可在 GitHub [浏览](https://github.com/loongson-community/discussions/labels/%E8%8B%B1%E9%9B%84%E5%B8%96)目前所有开放的英雄帖。
* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16