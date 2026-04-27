---
slug: this-week-in-loongarch-148
title: 每周一龙：第 148 期
authors: [jokerm13]
date: 2026-04-10T02:00:00+08:00
tags: [每周一龙]
draft: true
---

每周（尽量）为大家报道 LoongArch 社区最前线的第一手新鲜资讯！
上周的进展主要有 Linux、工具链、Box64 等方面的技术进展。
详情点进来看！

{/* truncate */}

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

## 先「马」再看 {/* #marked-projects */}

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch 领域的重要或长期项目（坑）。

### Linux {/* #linux */}

#### KVM {/* #kvm */}

Song Gao 为龙架构 KVM [添加了](https://lore.kernel.org/loongarch/45b93b94-fceb-c41e-9b3a-c2b3187eecae@loongson.cn/T/#t)直接消息信号中断控制器（DMSINTC）支持，主要目的是使 irqfd 机制能够将消息信号中断（MSI）直接注入到指定的目标 vCPU。使用 `netperf` 进行 `UDP_RR` 测试显示，启用 DMSINTC 后网络吞吐性能提升约 6.3% 。

Huacai Chen 向 KVM 维护者 Paolo Bonzini [发送了](https://lore.kernel.org/loongarch/20260410102245.2749691-1-chenhuacai@loongson.cn/T/#u)龙架构 KVM v7.1 拉取请求。包含 Bibo Mao、Song Gao、Tao Cui 3 位贡献者的 10 个补丁，涵盖了代码修复、性能优化、DMSINTC 中断控制器和 KVM PMU 自测试。

Tao Cui [修复了](https://lore.kernel.org/loongarch/9c1462c5-85ff-4de3-bee4-d394ffdfb63f@loongson.cn/T/#t)龙架构KVM 中 `kvm_emu_mmio_read()` 的处理 `ldptr` 的 `default` 分支遗漏设置 `EMULATE_FAIL` 的问题。

Bibo Mao [修复了](https://lore.kernel.org/loongarch/20260414072313.3801110-1-maobibo@loongson.cn/T/#t)龙架构 KVM 中硬件计时器中断可能丢失软件注入 SIP0/IPI 中断的问题，优化 AVEC 中断处理逻辑和计时器清除延迟，解决 LTP 压力测试下的 RCU 超时问题。

Xianglai Li  通过将 `switch.S` 直接编译进内核并使用 `UNWIND_HINT_END_OF_STACK` 简化 ORC unwinder 处理，[修复了](https://lore.kernel.org/loongarch/20260414113111.2997864-1-lixianglai@loongson.cn/T/#t) KVM 场景下 livepatch 加载时的“unreliable stack”问题，目前正在等待 v4 补丁合并。

#### 平台支持 {/* #platform-support */}

Hongliang Wang [提出了](https://lore.kernel.org/loongarch/20260325011852.19079-1-wanghongliang@loongson.cn/T/#t)为 I2C 驱动增加自定义时钟属性以适配多个平台，经 Krzysztof Kozlowski 和 Yao Zi 反馈后，作者目前接受建议：将分频系数与 compatible 属性绑定，正等待进一步的修订。

Binbin Zhou 为 Loongson-2K0300 SoC [添加了](https://lore.kernel.org/loongarch/ad6_-5NQv_Q6vxAE@zenone.zhora.eu/T/#t)新的 I2C 控制器驱动（`i2c-ls2x-v2`），支持标准与快速模式、主模式传输和中断驱动。

#### 其他内核功能 {/* #other-news */}

Youling Tang 为龙架构[添加了](https://lore.kernel.org/loongarch/20260405021227.532599-1-youling.tang@linux.dev/T/#t) `flush_icache_all()` 函数并实现 jump_label 批量化更新，将多个指令补丁的 ibar（补丁描述为 I-cache 并不准确）操作合并为一次。

Luo Qiu [修改了](https://lore.kernel.org/loongarch/CAAhV-H5SfXa3b--PMK8qfPkLxCbxNP_pkanwQrn6V-bqy8=o5Q@mail.gmail.com/T/#t)龙架构的栈保护器（stack protector）初始化栈哨兵标志（stack canary）从自定义难以实现函数改为统一实现的 `get_random_canary()` 函数。

> 关于此处 canary（金丝雀）的命名借自煤矿中用作毒气预警的金丝雀：stack canary在计算机安全领域译为“栈哨兵标志”，它是在函数栈帧中放置的一个随机值，在函数返回前检查该值是否被修改，如果值发生变化，说明了发生了栈溢出攻击，程序会立即停止，防止恶意代码执行。此次修正使龙架构能够统一实现初始化”栈哨兵标志”。

Greg Kroah-Hartman 提交的补丁，为龙架构内核调用新增 Spectre V1 边界检查；Huacai Chen 和芯片设计人员确认现有龙架构处理器的确存在 Spectre V1 漏洞，同时会更新内核其他相应部分；Xi Ruoyao 建议同时更新 cpuinfo 的漏洞报告信息。为此，Huacai Chen [实现了](https://lore.kernel.org/loongarch/20260409122348.2438400-1-chenhuacai@loongson.cn/T/#u) `cpu_show_spectre_v1()` 函数，目的是为了解决用户无法通过 `/sys/devices/system/cpu/vulnerabilities/spectre_v1` 查看漏洞状态和缓解措施，但 kernel test robot 报告中[存在](https://lore.kernel.org/loongarch/202604110810.YFUm5KE1-lkp@intel.com/T/#t "存在")编译警告，目前[已提交](https://lore.kernel.org/loongarch/20260411020522.2779250-1-chenhuacai@loongson.cn/T/#u) v2 补丁，等待合并，后由 Huacai Chen [修复](https://lore.kernel.org/loongarch/CA+=oZ7J+_WL6r5eovirkugAGqQULDsJU7pfuxgk1z7xvqT_fcA@mail.gmail.com/T/#t)并重新应用。

Huacai Chen [修复了](https://lore.kernel.org/loongarch/20260414063450.102805-1-chenhuacai@loongson.cn/T/#u) Loongson-2K0300/2K0500 在特定 RCU 变更后无法启动的问题，通过增加 `cpu_opt(LOONGARCH_CPU_CSRIPI)` 条件，使 `arch_irq_work_has_interrupt()` 仅在 IPI 硬件存在时返回 true。commit `7c405fb3279b3924`（"rcu: Use an intermediate irq_work to start process_srcu()"）之后，Loongson-2K0300 和 2K0500 无法启动，原因是 IRQ_WORK 需要 IPI 支持，但 Loongson-2K0300/2K0500 没有 IPI 硬件。

Xi Ruoyao [提交了](https://lore.kernel.org/loongarch/20260412101731.107059-1-xry111@xry111.site/T/#u) v8 版本，由 Ziyao Li、Lain Fearyncess Yang、Ayden Meng、Mingcong Bai 共同测试修复龙芯 3C6000 系列早期步进 PCIe 桥接器的 LinkCap2 错误报告仅支持 2.5 GT/s 的问题，通过 quirk 根据上游总线实际速率正确设置 `supported_speeds`，防止 bwctrl 和 amdgpu 等驱动受影响。

Lisa Robinson [将](https://lore.kernel.org/loongarch/CAAhV-H6Ur5RFRkhX8PGp2gfJuFBptnr9V_UuLGueqF1Uzj-GTA@mail.gmail.com/T/#t) `struct loongarch_fpu` 中的 `fpr` 数组移至结构体开头以确保 32 字节对齐，提升 LASX 上下文切换性能，已由 Huacai Chen [更新](https://lore.kernel.org/loongarch/CAAhV-H6Ur5RFRkhX8PGp2gfJuFBptnr9V_UuLGueqF1Uzj-GTA@mail.gmail.com/T/#m9b27db5b6d80f294c85bfaac19dbc6e9462c7772)，原因是破坏了 `arch_dup_task_struct()` 中的部分复制优化，。

Rong Bao [修复了](https://lore.kernel.org/loongarch/177618672057.1519819.8241448088490152027.b4-ty@kernel.org/T/#t)龙架构 perf annotate 中跳转指令释放时因缺少 `jump_detele` 导致的内存错误；[修正了](https://lore.kernel.org/loongarch/CAHirt9g7BncuBWsbBT-DpOVyueCb-ut_xyTCKdw_7sMNVznQ6Q@mail.gmail.com/T/#t) v1 中的 由 Huacai Chen 指出 Fixes 标签错误问题。

Yuqian Yang [提交了](https://lore.kernel.org/loongarch/80CA78395583F396+20260413031236.2512416-1-yangyuqian@uniontech.com/T/#u)关于禁用 KASLR 时日志输出问题的 v2 补丁，修复了 v1 中 `pr_info` 格式字符串使用变量导致的编译错误（改用宏定义），将 KASLR 禁用检测分散在多个位置，这导致日志打印位置与检测逻辑分离，且无法区分 KASLR 被禁用的具体原因，因此 KASLR 禁用日志从 `nokaslr` 函数移至实际检测点 `kaslr_disabled()` 并增加详细原因说明。

WANG Rui [删除了](https://lore.kernel.org/loongarch/177618672129.1519819.17210029301631805375.b4-ty@kernel.org/T/#t) `arch/loongarch/util/Build` 中对 `unwind-libdw.o` 的引用，修复龙架构在启用 `CONFIG_LIBDW_DWARF_UNWIND` 时的 perf 构建失败。

Haiyong Sun 和 WANG Rui 为 perf 构建[添加了](https://lore.kernel.org/loongarch/CAAhV-H4q-LUUVLQEXtpm2dARfqZGfKk6Tz=f1_2Uo_ixAjebOg@mail.gmail.com/T/#t)龙架构的 Clang 和 Rust 目标标志，支持 Clang 编译和 Rust 交叉编译。

Haiyong Sun 和 WANG Rui [修复了](https://lore.kernel.org/loongarch/CAAhV-H7J=q=U7sb=d3BMGHUSW=UBm5uEH4BRen3DxUx_OF92yw@mail.gmail.com/T/#t) perf 龙架构中 `_get_field()` 函数因 const 限定符不匹配产生的编译警告。

#### BPF {/* #bpf */}

Tiezhu Yang [提交了](https://lore.kernel.org/loongarch/20260413040506.26640-1-yangtiezhu@loongson.cn/T/#t)关于支持龙架构 BPF 支持更多原子指令的 v3 补丁，为龙架构 BPF 即时编译器（JIT） 增加 8/16 位  RMW 原子指令和 `load-acquire`/`store-release` 指令支持，[采纳了](https://lore.kernel.org/loongarch/20260407062306.8915-1-yangtiezhu@loongson.cn/T/#t) WANG Rui 建议使用 `ldbu/ldhu` 简化零扩展，Hengqi Chen 提出了`ldd` 使用检查和提交说明修改建议。

### 工具链 {/* #toolchain */}

#### GCC {/* #gcc */}

Lulu Cheng [修复了](https://gcc.gnu.org/pipermail/gcc-patches/2026-April/712935.html)因成本计算不完整而导致的错误指令序列生成问题，这是由于一个上游提交 （commit `16-8400-g48c2ea1750efe4`）改变了 `VCOND_MASK` 的生成逻辑，会尝试根据成本选择更优的实现，但由于龙架构后端没有为 `ORDERED RTX`（RTL 表达式）定义成本，导致成本计算时，`UNORDERED` 的成本被评估为大于 `ORDERED`，触发了编译器的“反转”优化，试图将 `UNORDERED` 操作转换为 `ORDERED`，这种转换会使测试用例 `lasx-vcond-2.c` 和 `lsx-vcond-2.c` 失败，因此补丁通过为 `ORDERED` 操作与 `UNORDERED` 操作定义一致的成本，来修复这个问题。

#### LLVM {/* #llvm */}

heiher [优化了](https://github.com/llvm/llvm-project/pull/191966)龙架构向量运算中当加数/减数为负数常量时的代码生成，这次优化让编译器能识别出这种模式，并将其直接转换为一条 `VSUBI` （向量减法立即数）指令。

wangleiat [修复了](https://github.com/llvm/llvm-project/pull/192033)在使用 `--emit-relocs` (输出重定位信息)选项时，LLD 会错误地丢弃 `R_LARCH_MARK_LA` 这个重定位项的问题。 `R_LARCH_MARK_LA` 是一种特殊的标记重定位，本身不参与计算，但用于在二进制文件中标记一个 `la.abs` 指令序列。此次修复主要服务于 EDK II 的使用场景，EDK II 构建会先用 Clang + LLD 生成 ELF 文件，再通过一个转换工具将其转为 PE 格式。

### Box64 {/* #box64 */}

**[ksco](https://github.com/ksco)** [改进了](https://github.com/ptitSeb/box64/pull/3780) Box64 的测试系统，使其在没有启用 Box32 功能的情况下，也能正确处理 32 位测试的运行，并[优化了](https://github.com/ptitSeb/box64/pull/3781) Box64 测试矩阵的配置组合数量，减少不必要的测试组合。

## 杂闻播报 {/* #assorted-news */}

nihui [优化了](https://github.com/Tencent/ncnn/pull/6662)腾讯神经网络推理框架（ncnn）的MIPS 和龙架构代码，其中龙架构优化引入了 LASX 和 LSX 指令集优化，并优化了矩阵运算（卷积核心）、新增了 BF16 数据类型支持并重构特定算子等，可大幅提升推理速度。

## 张贴栏 {/* #bulletin */}

本栏目可供张贴公益性质的各种信息。

* 您可在 GitHub [浏览](https://github.com/loongson-community/discussions/labels/%E8%8B%B1%E9%9B%84%E5%B8%96)目前所有开放的英雄帖。
* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16