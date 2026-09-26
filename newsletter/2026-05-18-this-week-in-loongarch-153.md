---
slug: this-week-in-loongarch-xx
title: 每周一龙：第 XX 期
authors: [xen0n]
date: 2026-05-25T02:00:00+08:00  # TODO: change to actual time in the finishing commit
tags: [每周一龙]
draft: true  # TODO: remove in the finishing commit
---

每周（尽量）为大家报道 LoongArch 社区最前线的第一手新鲜资讯！
上周的进展主要有 Linux 内核、工具链、Box64、发行版等方面的进展。
详情点进来看！

{/* truncate */}

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

## 先「马」再看 {/* #marked-projects */}

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch 领域的重要或长期项目（坑）。

### Linux {/* #linux */}

Zeng Chi [修复了](https://lore.kernel.org/loongarch/20260518094521.138692-1-zeng_chi911@163.com/)龙架构 KVM 中 EIOINTC 设备注册时的并发安全问题。在 `kvm_einintc_create` 函数中，对 `kvm_io_bus_register_dev()` 的第二次调用缺少了 `kvm->slots_lock` 互斥锁保护，这可能导致在多线程或并发环境下访问 KVM IO 总线时出现竞态条件。Bibo Mao [指出](https://lore.kernel.org/loongarch/af3e9ecc-cb30-6d7d-5f2d-19ddf42755a0@loongson.cn/)，在 `pch_pic.c`、`ipi.c` 和 `eiointc.c` 文件中，对 `kvm_io_bus_unregister_dev()` 函数的调用也存在类似的锁保护缺失问题。

Bibo Mao [提交了](https://lore.kernel.org/loongarch/20260519094308.3983046-1-maobibo@loongson.cn/T/#mb68c99c204d19d2665a3037957b9bda0f67afdc6)优化龙架构 KVM 的中断注入机制系列补丁的第 3 版，本版补丁将针对 `kvm_vcpu_ioctl_interrupt()` 函数的 IRQ 有效性检查拆分成了独立补丁，以便回合到更老的内核版本上。

George Guo [修复了](https://lore.kernel.org/loongarch/20260521062631.51517-1-dongtai.guo@linux.dev/T/#u)龙架构在开启 KFENCE 内存安全加固功能后，因缺失 `asm/io.h` 中缺失 `linux/mm.h` 头文件引用导致编译失败的问题。

Tiezhu Yang [修复了](https://lore.kernel.org/loongarch/20260521070128.28086-1-yangtiezhu@loongson.cn/)龙架构 BPF JIT 中尾部调用的序言对齐、偏移量硬编码及计数器 off-by-one 问题。

Tiezhu Yang [添加了](https://lore.kernel.org/loongarch/20260521125636.26744-1-yangtiezhu@loongson.cn/T/#mb0703e01f3510196be50b5350a057f615de14763) BPF 的自测试支持，实现了 `get_preempt_count()` 抢占计数读取，并增加 `__arch_loongarch` 宏以支持按架构过滤测试用例。

Eric Biggers 为龙芯 RNG 驱动 (`CRYPPTO_DEV_LOONGSON_RNG`) 的 Kconfig [添加了](https://lore.kernel.org/loongarch/20260522025722.GD5937@quark/T/#m03ed645b948dc7dc1a022348a68e70eff880a56c) `select CRYPTO_RNG` 依赖标记，以解决构建失败的问题。

### 工具链 {/* #toolchain */}

#### GCC {/* #gcc */}

Xi Ruoyao 本周持续修复 GCC 方面的内容：

-  [修复了](https://gcc.gnu.org/r15-11185) GCC 生成代码中 stack canary 泄露导致攻击者可绕过 stack protector 机制的问题；已将修复回合到 GCC 16.2，GCC 13.5/14.4/15.3 因代码修改量较大，需逐分支测试，目前已完成 15.3 的回合，其他分支有待继续移植。

-  使 GCC 将形如 `(a == b) ? 0 : (a < b) ? -1 : 1` 的 spaceship 操作[展开成](https://gcc.gnu.org/r17-528) `slt[u]-slt[u]-sub` 序列，避免代码分支以提高性能，该补丁已合入主支。

-  使 GCC 将 `a ^ b ^ (a | c)` 改写为 `(c & ~a) ^ b`，以利用 andn 指令[提高了](https://gcc.gnu.org/r17-513)二进制性能，该补丁已合入主支

-  使 GCC 将新增的 `__builtin_bitreverse{8,16,32,64}` [展开为](https://gcc.gnu.org/r17-635)龙架构上对应的 `bitrev.*` 指令，避免不必要的位操作展开，该补丁已合入主支。

Qiankang Zhou [修复了](https://gcc.gnu.org/r17-615)因未安装内部头文件 `cpu-features.h` 导致 GCC 插件无法编译的问题。

#### LLVM {/* #llvm */}

[heiher](https://github.com/heiher) 将主分支的 [301e89f](https://github.com/llvm/llvm-project/commit/301e89fa4456a983d9b0c100e8b211a6551ad81a) 提交[回合](https://github.com/llvm/llvm-project/pull/198704)到 LLVM 22.x 发布分支，该提交撤回了之前添加的用于生成向量平均值指令，但未考虑向量元素的和的实际值可能超过向量元素类型表示范围，导致计算结果错误的模式匹配规则。

[heiher](https://github.com/heiher) [修复了](https://github.com/llvm/llvm-project/pull/198965)龙架构在必须尾调用 (musttail) 场景下，传递间接参数时，通常会分配一个栈上临时对象，并将指向该临时对象的指针传递给被调用者，尾调用会释放调用者的栈帧，导致指针指向的内存失效的问题。

[heiher](https://github.com/heiher) 为龙架构 LSX/LASX 向量平均指令对应的 LLVM IR (`avgfloor` / `avgceil`) [增加了](https://github.com/llvm/llvm-project/pull/198459)进位保持 (CSA,Carry-Save) 和独立减半 (SHO,Independently Halved) 两种形式的测试用例，覆盖有符号/无符号及各数据类型。

[hazohelet](https://github.com/hazohelet) [报告了](https://github.com/llvm/llvm-project/issues/198339)龙架构在启用 LSX 向量扩展时，无法正确处理向量半精度浮点扩展 (`fpext <N x half>`) 操作，导致触发编译器崩溃的问题。

## 杂闻播报 {/* #assorted-news */}

### Box64 {/* #box64 */}

[ksco](https://github.com/ksco) 本周持续修复 Box64 方面的内容：

- 为 Box32 [增加了](https://github.com/ptitSeb/box64/pull/3870) SDL1 库函数（如：`SDL_UpperBilt`、`SDL_SoftStretch`、`SDL_SetClipper` 等函数）的包装器，32 位 Linux 游戏 Psychonauts 得以运行。

- [增加了](https://github.com/ptitSeb/box64/pull/3872) Box64 的动态缓存 (DynaRec Cache) 机制对失效块的处理，在重新加载缓存时会主动跳过失效的代码块。

- [修复了](https://github.com/ptitSeb/box64/pull/3873) Box64 解释器中 `0x66` 前缀的解码问题，使其正确处理与 `REX.w` 前缀的交互，与 DynaRec 的行为保持一致；同时[移除了](https://github.com/ptitSeb/box64/pull/3875) Box64 解释器中处理 `0x66` 前缀时不再需要的代码。

- 在社区好友 [phorcys](https://github.com/phorcys) 的帮助下为龙架构_DYNAREC [引入了](https://github.com/ptitSeb/box64/pull/3874) AES 指令的优化实现，使用 vpaes（向量化 AES）算法来加速 AES 加密/解密操作，在带加密的 7z 自解压程序测试中，解压性能提升 5 倍左右。

### 其他 {/* #other-assorted-news */}

[elysia-best](https://github.com/elysia-best) [报告了](https://github.com/electerm/electerm/issues/4344) electerm 的龙架构 deb 包因各发行版架构标识不统一而无法在 Debian 13 上安装的问题：猜测是先前使用了安同 OS 打包导致的，因为安同 OS 使用的 dpkg 架构为 loongarch64，而非 Debian 使用的 loong64；上游开发者表示将发布两种架构标识的安装包。

[bitm-cn](https://github.com/bitm-cn) [报告了](https://github.com/eclipse-equinox/equinox/issues/1295)在为 Eclipse Equinox 添加龙架构支持时，Tycho 打包插件无法找到手动安装到本地仓库的 LoongArch64 launcher fragment，导致构建失败，并询问添加新架构的正确机制。

[emmansun](https://github.com/emmansun) 为 Go 语言商用密码软件 [gmsm](https://github.com/emmansun/gmsm) 的 [ML-DSA](https://github.com/emmansun/gmsm/issues/501) 和 [ML-KEM](https://github.com/emmansun/gmsm/issues/500) 算法实现 LASX/LSX SIMD 优化，涵盖 NTT、多项式运算、编码等核心模块，并明确需要新增汇编函数和调度代码。

[nihui](https://github.com/nihui) 为 ncnn 框架中的大量算子[增加了](https://github.com/Tencent/ncnn/pull/6737) 4D 张量 (tensor) 支持，龙架构方面利用 LSX/LASX 向量扩展实现算子的 4D 张量处理。

[Gelbpunkt](https://github.com/Gelbpunkt) 为 zlib-rs（一个用 Rust 编写的 zlib 库）[添加了](https://github.com/trifectatechfoundation/zlib-rs/pull/511)龙架构的 CRC32 硬件加速实现，利用架构内置的 CRC 校验指令，因内建函数尚不稳定而暂时使用内联汇编，并计划后续推动 stdarch 改进；[修复了](https://github.com/rust-lang/libz-sys/pull/269) `libz-sys` 构建 zlib-ng 时因缺少龙架构目录而导致的 CMake 编译失败问题。

[doruche](https://github.com/doruche) 为 Anemone 内核[新增了](https://github.com/anemone-os/anemone/pull/92) futex、interval timer、大量 I/O 和凭证系统调用，并重构了内部锁机制以提高中断上下文安全性，龙架构也同步更新了系统调用表。

[numpy1314](https://github.com/numpy1314) [修复了](https://github.com/Hengyu-Yu/QEMU-LVZ/pull/2) QEMU-LVZ（一个支持龙架构虚拟化的 QEMU 分支）版本中 lddir/ldpte 辅助函数因标志位错误参与物理地址计算而导致的页表遍历错误，并在 rcore-os 中也[提交了](https://github.com/rcore-os/tgoskits/pull/852)这个补丁修复。

[numpy1314](https://github.com/numpy1314) 为 AxVisor (Type-1 虚拟机监控程序) [添加了](https://github.com/rcore-os/tgoskits/pull/768)龙架构下运行 ArceOS 访客机的最小启动支持，修复了页表标志位、MMIO 处理、CI 配置等问题，并最终更新 QEMU-LVZ 依赖以确保正确性。

[JounQin](https://github.com/JounQin) 为 unrs-resolver [增加了](https://github.com/unrs/unrs-resolver/pull/209)条件编译逻辑，在 loongarch64-musl 目标平台上自动禁用 `statx` 的 `STATX_DONT_SYNC` 标志，解决了 rustix 在该平台上未导出该标志的编译问题。

[KongQBin](https://github.com/KongQBin) [修复了](https://github.com/libarchive/libarchive/pull/3049) libarchive 的 CMake 构建脚本中加密库检测时的全局状态泄漏问题，通过 `CMAKE_PUSH/POP_CHECK_STATE` 隔离检测状态，确保在包括龙架构 (ABI1.0/ABI2.0) 在内的多种交叉编译环境下系统特性检测正确。

[anematode](https://github.com/anematode) 为 Stockfish 国际象棋引擎[增加了](https://github.com/official-stockfish/Stockfish/pull/6832)龙架构的性能优化。主要利用内联汇编实现 `hyperbola quintessence` 算法所需的位反转操作，优化了位棋盘 (bitboard) 算法和 NNUE (神经网络评估) 的 SIMD 类型处理。

[arrowd](https://github.com/arrowd) 为 snappy-java（Java 版的 Snappy 压缩库）项目[添加了](https://github.com/xerial/snappy-java/pull/725)龙架构的构建支持，利用 dockcross 工具链进行交叉编译，使项目能够为龙架构生成 native 库，但 AI 审阅发现辅助脚本中存在重复函数定义和过时注释的问题，待修复。

[yetist](https://github.com/yetist) 为 iPXE（网络引导固件）的龙架构[禁用了](https://github.com/ipxe/ipxe/pull/1712) LSX/LASX SIMD 指令，并用纯汇编重写了 TCP/IP 校验和函数，性能提升约 39 倍；同时经过维护者审阅，已支持 Secure Boot 构建，但审阅者表示希望龙芯未来能明确 UEFI Secure Boot 的处理方案。

[zhaixiaojuan](https://github.com/zhaixiaojuan) 为 rules_go (Bazel 的 Go 语言规则集) [添加了](https://github.com/bazel-contrib/rules_go/pull/4610)龙架构支持。

[leno23](https://github.com/leno23) 为 simdjson 的龙架构[添加了](https://github.com/simdjson/simdjson/pull/2727) LSX SIMD 优化的 `fast_needs_escaping` 函数，用于加速 JSON 序列化时的转义字符检测。

[ksco](https://github.com/ksco) 为矢量网络数据包处理库 Vector Packet Processing [增加了](https://github.com/ksco/vpp/commits/loong64/)龙架构支持，目前已完成初稿，准备提交上游。

### 发行版们 {/* #distros */}

#### Anolis OS {/* #anolis-os */}

[Ming Wang](https://gitee.com/robinorg) 为 Anolis OS 的龙架构内核 RPM 打包[增加了](https://gitee.com/anolis/cloud-kernel/pulls/7086)带签名的 PE/COFF 格式的 EFI 内核镜像 (`vmlinuz-*-efi`)，以支持 UEFI Secure Boot 和 EFI zboot 启动，同时保持现有 ELF 格式镜像作为默认启动项不变，已通过测试并合并到 `devel-6.6` 分支。

#### 安同 OS {/* #aosc-os */}

[xry111](https://github.com/xry111)  [推送了](https://github.com/AOSC-Dev/aosc-os-abbs/pull/15982) Core 13.2.0 核心包更新，针对龙架构回合了 glibc 先前合入的将大型 load segment 对齐到大页边界的修改，可提高编译等应用场景的性能，并加强了 GCC 栈溢出保护以阻止简单的绕过手段。本次更新还修复了 glibc 中 CVE-2026-4046、CVE-2026-5450 和 CVE-2026-5928 共 3 个安全漏洞。

[MingcongBai](https://github.com/MingcongBai) 将 AOSC OS 的 Linux 内核更新至 7.0.9，并为龙架构[启用了](https://github.com/AOSC-Dev/aosc-os-abbs/pull/16012) 2K0300/2K3000 多通道 DMA 控制器支持，测待测试。

#### deepin {/* #deepin */}

[Avenger-285714](https://github.com/Avenger-285714) 为 deepin 6.18.y 内核的 Rust 支持[添加了](https://github.com/deepin-community/kernel/pull/1754)不受信任数据的安全抽象 API，并更新了包括龙架构在内的多个架构 defconfig 以启用 Rust 构建，增强内核处理用户态数据的安全性。

[xionglinlin](https://github.com/xionglinlin) 为 deepin 的 `dde-daemon` [增加了](https://github.com/linuxdeepin/dde-daemon/pull/1111)龙架构的短空闲 (short idle) 状态管理和 TLP 电源管理模式支持，通过内核文件 (`/sys/devices/system/loongarch/relax_state`) 写入状态，实现 CPU 快速空闲/唤醒；第三方应用检测，以防止短空闲误触发；新增 DSG 配置实现智能节能，但代码中存在并发安全、路径安全、性能等多处问题。

## 张贴栏 {/* #bulletin */}

本栏目可供张贴公益性质的各种信息。

* 您可在 GitHub [浏览](https://github.com/loongson-community/discussions/labels/%E8%8B%B1%E9%9B%84%E5%B8%96)目前所有开放的英雄帖。
* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16