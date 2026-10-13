---
slug: this-week-in-loongarch-151
title: 每周一龙：第 151 期
authors: [jokerm13]
date: 2026-05-11T02:00:00+08:00  # TODO: change to actual time in the finishing commit
tags: [每周一龙]
draft: true  # TODO: remove in the finishing commit
---

每周（尽量）为大家报道 LoongArch 社区最前线的第一手新鲜资讯！
上周的进展主要有 Linux 内核、工具链、Box64 等方向。
详情点进来看！

{/* truncate */}

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

## 先「马」再看 {/* #marked-projects */}

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch 领域的重要或长期项目（坑）。

### Linux {/* #linux */}

Rong Bao [修复了](https://lore.kernel.org/loongarch/20260501200000.item004-6.18@kernel.org/T/#m900f2b1988353c3d6551c46d3df197b78cfd563e)龙架构的 `perf annotate` 工具在释放跳转指令内存时，因结构体内存共用导致释放错误的内存区域的问题。`loongarch_jump_ops`（龙架构跳转指令集）在初始化时，缺少了关键清理函数指针 `.free`，导致 `disasm_line__free()` 在处理龙架构跳转指令时会直接使用通用的清理函数 `ins_ops__delete()`，然而这个通用函数假设释放的内存区域与跳转指令使用两个不同的堆缓冲区，但龙架构与其他架构不同，实际使用的是同一堆缓冲区，导致了未定义行为，此修复为 `loongarch_jump_ops` 增加了一个专属的清理函数 `jump_delete`，并分别合入了 v6.18.y、[v6.12.y](https://lore.kernel.org/loongarch/20260501200000.item004-6.12@kernel.org/T/#t)、[v7.0.y](https://lore.kernel.org/loongarch/20260504135146.275021893@linuxfoundation.org/T/#u) 分支。

Barry Song 和 Oven Liyang [引入了](https://lore.kernel.org/loongarch/CAGsJ_4w4jyQTzvPSzGtv1r5G35kARHrf4WgDvEiOAw8k5AAABg@mail.gmail.com/T/#m46e6b5bd0389d1941a62fb1dde42cbc7d2178b16) `VM_FAULT_RETRY_VMA` 标志并优化 per-VMA 锁的管理策略，使进程在等待 I/O 完成并重试缺页异常时能够继续使用细粒度的 per-VMA 锁，而非退化为全局的 `mmap_lock`。这降低了锁竞争，并解决了因锁持有等待 I/O 而导致的高优先级任务阻塞问题。此补丁为多架构修复补丁，龙架构包含在内。

James Houghton [提交了](https://lore.kernel.org/loongarch/CADrL8HWLMEwwQgD954GOWo4n87Y_G0G700qx8mJisMD0SGr4gQ@mail.gmail.com/T/#mdd66b7ca1f498e4aa373063831d43950e4b13441) KVM 竞态条件修复系列，解决 `kvm_arch_flush_shadow_all()` 可能被并发调用导致的 double-free 问题；其中包含龙架构的修复是在 `kvm_flush_range()` 调用时获取 MMU 锁，但 Bibo Mao 已提出质疑，认为在异常 VM 销毁路径上可能需要更完整的处理。

Hongliang Wang 为 ls2x I2C 驱动[添加了](https://lore.kernel.org/loongarch/84c37ac1-3a9c-b0d2-f86a-90712b45b806@loongson.cn/T/#t) `clocks` 属性解析，使 I2C 总线速度能够根据实际 APB 时钟动态计算；Conor Dooley 回复了 `dt_binding_check` 失败的问题，`clocks` 属性不存在，Hongliang Wang 说明此补丁基于 i2c-host-next 分支，该分支中 `clocks` 已存在。

Bibo Mao [修复了](https://lore.kernel.org/loongarch/20260508013001.4107737-1-maobibo@loongson.cn/T/#u)在 `CONFIG_SMP=n` 配置下编译时因变量未声明而产生的警告。主要原因是三个与 paravirt 特性相关的变量（`virt_preempt`、`virt_spin_lock_key`、`steal_time`）的 `DECLARE` 宏放在 `asm/qspinlock.h` 中，而 `asm/qspinlock.h` 仅在 `CONFIG_SMP=y` 时被包含，所以会出现编译警告。

Hongliang Wang 基于其 v2 补丁（为 ls2x I2C 驱动[添加了](https://lore.kernel.org/loongarch/84c37ac1-3a9c-b0d2-f86a-90712b45b806@loongson.cn/T/#t) `clock` 属性），[发送了](https://lore.kernel.org/loongarch/20260509082837.28778-1-wanghongliang@loongson.cn/T/#u) v3 补丁，根据 Huacai Chen 的审阅意见简化了 I2C 驱动中时钟解析的实现，移除了冗余的 `chip_data` 结构体，将 `factor` 改名为 `div`，优化了条件判断逻辑。

Bibo Mao [移除了](https://lore.kernel.org/loongarch/20260509040159.338866-1-maobibo@loongson.cn/T/#u)龙架构 KVM 软件定时器 (swtimer) 过期时的定时器中断注入。KVM 使用 swtimer 来模拟硬件定时器中断，当 swtimer 到期时会调用 `kvm_swtimer_wakeup()` 函数，该函数同时执行了 `kvm_queue_irq(vcpu, INT_TI)`（注入定时器中断）和 `rcuwait_wake_up(&vcpu->wait)`（唤醒可能处于空闲状态的 vCPU），因为该定时器中断会在 vCPU 唤醒后的 `kvm_restore_timer` 路径中正确注入，此处调用 `kvm_queue_irq` 是冗余的。

### 工具链 {/* #toolchain */}

#### GCC {/* #gcc */}

Lulu Cheng [修复了](https://gcc.gnu.org/git/?p=gcc.git;a=commit;h=1bb9817fa87644db91d713808a78d571086d0d78) GCC Bug #125057，完善 `loongarch_spilt_vector_move` 的拆分条件，以避免差分 GCC 16 开发周期新引入的 `__lasx_cast_128` 操作展开成的从 LSX 寄存器到 LASX 寄存器的移动操作。此种操作不应拆分，但此前被错误地当作从整数寄存器到LASX 寄存器的移动操作拆分，产生不合法的 RTL 代码，导致编译器崩溃。

Lulu Cheng 为龙架构 `ORDERED` [添加了](https://gcc.gnu.org/git/?p=gcc.git;a=commit;h=8332ce8b0b30b03268570e42be65261676836385) `rtx_cost` 支持，将其成本设为与 `UUNORDERED` 相同，修复了 GCC 优化 `VCOND_MASK` 反转导致的 `lasx_vcond-2.c` 和 `lsx-vcond-2.c` 测试失败的问题。

Xi Ruoyao [修复了](https://gcc.gnu.org/r17-404)为 64 位龙架构处理器生成计算 32 位整数末尾零位个数 (count trailing zero) 的代码时，在 `ctz.w` 指令后出现一条多余的符号扩展指令的问题。

Xi Ruoyao [修复了](https://gcc.gnu.org/r17-405)龙架构栈保护 (stack protector) 实现中哨兵标志的真值和地址生存期过长，导致攻击者可通过读取寄存器中遗留的真值，或覆盖被溢出 (spill) 到栈上的哨兵标志地址绕过保护机制的问题。后续计划将此修复回合到 GCC 13.5、14.4、15.3 版本。

Xi Ruoyao [允许了](https://gcc.gnu.org/r17-406)龙架构内嵌汇编使用 `%c` 占位符输出符号名，以修复 4 项 GCC 测试集失败。

Xi Ruoyao [提交了](https://gcc.gnu.org/pipermail/gcc-patches/2026-May/715495.html)将 `a ^ b ^ (a | c)` 改写为 `(~a & c) ^ b` 的补丁，以利用龙架构的 andn 指令。Lulu Cheng 和 Andrew Waterman指出补丁提交消息存在错误，需要修改。

Xi Ruoyao [提交了](https://gcc.gnu.org/pipermail/gcc-patches/2026-May/715496.html)将形如 `(a == b) ? 0 : (a < b) ? -1 : 1` 的 spaceship 操作展开为两条 `slt[u]` 指令和一条减法指令的补丁，Lulu Cheng 指出其中一处寄存器符号/零扩展状态标记疑似有误，需解释或修改。

Deng Jianbo [报告了](https://sourceware.org/pipermail/libc-alpha/2026-May/177204.html) glibc 中以内嵌汇编实现的 barrier 代码被编译成毫无意义地将 FPR 内容搬运到 GPR 再搬运回来的指令的问题，Andreas Schwab 和 Xi Ruoyao 怀疑 GCC 存在寄存器分配策略问题，待调查。

#### LLVM {/* #llvm */}

[CSharperMantle](https://github.com/CSharperMantle) 为龙架构 LLVM 后端和 Clang 驱动[添加了](https://github.com/llvm/llvm-project/pull/195595) `-fstack-clash-protection` 栈冲突保护 (stack clash protection) 支持，实现方式参考了 RISC-V 后端：对于固定大小栈分配使用循环展开策略进行探测，对于动态栈分配生成探测循环。该功能通过 `clang -fstack-clash-protection` 启用。

[lrzlin](https://github.com/lrzlin) 为龙架构的 LSX 和 LASX 向量扩展 `sitofp`、`uitofp` [添加了](https://github.com/llvm/llvm-project/pull/196465)测试用例，覆盖了多种位宽和向量长度；CI 自动检查发现测试中使用了已弃用的 `undef`，需要修正。

#### Zig {/* #zig */}

[cataggar](https://github.com/cataggar) [提出了](https://github.com/ctaggart/zig/issues/359)将龙架构 64 位软浮点 (loongarch64-sf) 和 s390x 架构的浮点环境控制 (fenv) 实现，并将 fenv 实现从 C 语言 (musl libc) 迁移到纯 Zig。

### Box64 {/* #box64 */}

[ksco](https://github.com/ksco) [修复了](https://github.com/ptitSeb/box64/pull/3821)加载 DynaCache 时，因 `x64_readaddr` 未随 `x64_addr` 一起进行 `delta_map` 偏移调整导致的地址重定位错误问题。此前该问题导致无论是否使用 DynaCache，Windows 游戏《Replaced》的启动时间均保持在大约 18 秒，修复后启动时间从约 18 秒降至 12 秒。

[ksco](https://github.com/ksco) [修复了](https://github.com/ptitSeb/box64/pull/3822)在同时启用 DynaCache 和信号仿真处理(SEP)机制时导致 Linux Steam 客户端出现 SIGBUS 崩溃的问题，通过恢复被隐藏的 SEP 条目动态代码块 (dynablock) 引用，确保在启用 DynaCache 时，SEP 相关的 dynablock 头信息能够被正确关联和访问。

[ksco](https://github.com/ksco) [修复了](https://github.com/ptitSeb/box64/pull/3823) Box64 在从磁盘重新加载 dynablock 时未检查 CPU 扩展特性 (cpuext) 的问题，通过增加 `cpuext` 匹配检查，确保仅在当前环境与缓存生成环境完全一致时才使用缓存，避免了因 CPU 指令集不匹配导致的非法指令错误或崩溃。

[ksco](https://github.com/ksco) [修复了](https://github.com/ptitSeb/box64/pull/3826) section 优先级处理逻辑，确保高优先级的配置能够正确地覆盖低优先级的配置。

[ksco](https://github.com/ksco) 为龙架构_DYNAREC [添加了](https://github.com/ptitSeb/box64/pull/3827)对部分 x86_64 F2 和 F3 伪前缀操作码的处理。

[ksco](https://github.com/ksco) 为 rcfile 配置文件[添加了](https://github.com/ptitSeb/box64/pull/3828)全局共享 entry 支持，允许配置项跨 section 共享，减少重复定义。

## 杂闻播报 {/* #assorted-news */}

[bh1xaq](https://github.com/bh1xaq) [提出了](https://github.com/bambulab/BambuStudio/issues/10566)为开源网络插件 BambuStudio（主要用于3D打印设计）添加龙架构支持。目前主程序已经在龙芯平台 (Loongson-3B6000x1-7A2000x1-EVB) 上成功构建，但网络插件因缺少 loongarch64 的预编译包而无法使用，希望官方将其加入发布列表，同时指出社区维护的开源替代插件可作为备选。

[MarsDoge](https://github.com/MarsDoge) 和 [yetist](https://github.com/ncroxon/gnu-efi/commits?author=yetist) [修复了](https://github.com/ncroxon/gnu-efi/pull/99)龙架构上 `gnu-efi` 库可能被工具链默认向量化优化编入 LSX/LASX 指令的问题，通过在编译显式添加 `-mno-lsx -mno-lasx` 标志，确保 `gnu-efi` 不包含 SIMD 指令，从而避免 UEFI 环境下因使用向量指令导致崩溃。

[phprus](https://github.com/phprus) 为 zlib-ng（zlib 压缩库的下一代分支）的 `/delta` CI 工作流[添加了](https://github.com/zlib-ng/zlib-ng/pull/2278)龙架构支持。目前该提交已被合并。

[zevorn](https://github.com/zevorn) 为 machina（一个用 Rust 编写的虚拟化/模拟器项目）[添加了](https://github.com/gevico/machina/pull/109)龙架构支持，包括指令解码/翻译、MMU/中断、设备模型及 Linux 引导能力，新增 `loongarch64-ref` 参考机器，并通过了测试验证。

## 张贴栏 {/* #bulletin */}

本栏目可供张贴公益性质的各种信息。

* 您可在 GitHub [浏览](https://github.com/loongson-community/discussions/labels/%E8%8B%B1%E9%9B%84%E5%B8%96)目前所有开放的英雄帖。
* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16