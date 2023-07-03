---
slug: this-week-in-loongarch-7
title: 每周一龙：第 7 期
authors: [xen0n]
tags: [每周一龙]
---

每周一都为大家报道 LoongArch&reg; 社区最前线的第一手新鲜资讯！

<!-- truncate -->

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

## 要闻速递

本周 binutils 2.41 代码将冻结并从主分支切出，预计 7 月 23 日前后正式发布。
可能一部分出于此原因，龙芯在上周集中向各个上游社区推送了 LSX、LASX、LVZ、LBT
的支持代码，这意味着 2023Q2 很有可能见证 LA64 v1.00 首次在上游/新世界获得完整支持
（尽管相应的指令集手册分卷仍未正式公布）。

关于这些指令集扩展的支持工作细节请见下文。

## 先「马」再看

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch&reg; 领域的重要或长期项目（坑）。

### Linux

北京时间 7 月 1 日凌晨 01:24，龙架构的 <ruby>pull request<rt>拉取请求</rt></ruby> 已[被 Linus 合并][linux-loongarch-6.5]。
当天下午 Xi Ruoyao [提议][jump-label]将 `CONFIG_JUMP_LABEL` 性能优化选项默认开启。

6 月 29 日，Tianrui Zhao [贴出了][loongarch-kvm-v16]第 16 版的龙架构 <ruby>KVM<rt>内核虚拟机</rt></ruby> 补丁。
欢迎同学们都来看看。（感谢 [@Luo-Chang](https://github.com/Luo-Chang) 的线索投递。）

6 月 28 日，ClangBuiltLinux 维护者 Nathan Chancellor 为该项目的<ruby>CI<rt>持续集成</rt></ruby>基础设施[提交了][cbl-boot-utils-loong]龙架构的引导测试支持。
十分感谢国际友人的密切配合（常常在补丁发布、合并不到一小时后就行动起来了）！

[linux-loongarch-6.5]: https://lore.kernel.org/loongarch/168814584495.9404.13332741026535742055.pr-tracker-bot@kernel.org/T/#t
[jump-label]: https://lore.kernel.org/loongarch/20230701083247.177482-1-xry111@xry111.site/
[loongarch-kvm-v16]: https://lore.kernel.org/loongarch/20230629075538.4063701-1-zhaotianrui@loongson.cn/
[cbl-boot-utils-loong]: https://github.com/ClangBuiltLinux/boot-utils/pull/109

### 工具链

#### binutils

以下内容均已进入主线，静待 binutils 2.41 发布：

* FreeFlyingSheep [添加了](https://sourceware.org/pipermail/binutils/2023-June/127873.html)以 `$fcsrX` 称呼 <ruby>FCSR<rt>浮点控制状态寄存器</rt></ruby> 的支持。
  :::info 以前咋回事<small>儿</small>
  以前要用 `$rX` 称呼 FCSR，也就是说：当成整数寄存器！这显然不对，而且跟 LLVM 也不兼容。现在两种写法都支持了，旧写法先留一阵子不删，方便下游迁移。
  :::
* mengqinggang 添加了 [LSX、LASX]、[LVZ、LBT] 的指令定义。
* xen0n [改进了](https://sourceware.org/pipermail/binutils/2023-June/128082.html)龙架构汇编器、反汇编器的一系列行为：
    - 支持以彩色（语法高亮）显示反汇编输出了。参见 `--disassembler-color` 选项的帮助文本。
    - 在不影响语义的前提下，会显示一些伪指令了。
    - 有符号立即数后边<small>儿</small>不会打印对应的十六进制位域表示了。
    - 未知指令字将会以 `.word` 为助记符的形式展示了。
    - 遵循规范文档，弃用了 `$v[01]`、`$fv[01]`、`$x` 几个远古时期遗留的寄存器别名，现在使用它们将被警告。
      :::info shenmegui
      |弃用名称|现行名称|
      |--------|--------|
      |`$v0`、`$v1`|`$a0`、`$a1`|
      |`$fv0`、`$fv1`|`$fa0`、`$fa1`|
      |`$x`|`$r21`|
      显然，除了不见于[正式版本的寄存器约定][lapcs-regs]之外，这些叫法更会与向量寄存器的正式名称 `$vrX`、`$xrX` 形成严重混淆。
      :::

[LSX、LASX]: https://sourceware.org/pipermail/binutils/2023-June/127990.html
[LVZ、LBT]: https://sourceware.org/pipermail/binutils/2023-June/128156.html
[lapcs-regs]: https://github.com/loongson/la-abi-specs/blob/release/lapcs.adoc#the-registers

#### GCC

6 月 30 日，Chenghui Pan 代 Lulu Cheng [提交了](https://gcc.gnu.org/pipermail/gcc-patches/2023-June/623262.html)
LSX、LASX 的代码生成支持。补丁比较大，不便仔细审查，目前大概在拆了。
无论如何，明年 GCC 14.1 正式发布时，这些支持大概率都会搞定。

#### LLVM

一周间合并了以下的功能改进等：

* xen0n [修复了](https://reviews.llvm.org/D153865) CSR/IOCSR 操作的副作用标记。
* SixWeining [支持了](https://reviews.llvm.org/D153872) `R_LARCH_64_PCREL` 的产生。
  该支持是 ClangBuiltLinux `CONFIG_JUMP_LABEL` 的前置需求。
* Ami-zhang 完成了 MSan 到 LoongArch 的移植（[补丁一](https://reviews.llvm.org/D140528)、[补丁二](https://reviews.llvm.org/D152692)）。

出现了以下的新动向：

* wangleiat 提交了 [LSX](https://reviews.llvm.org/D154183)、[LASX](https://reviews.llvm.org/D154195) 的指令定义，leecheechen [跟进提交了](https://reviews.llvm.org/D154197)测试用例。
* hev [显式标记了](https://reviews.llvm.org/D154192)所有指令的属性，相比于让 LLVM 猜，可以获得更高质量的生成代码。

#### Rust

7 月 1 日，上游合并了 hev 的 LoongArch ELF flags 修复。该修复使得软浮点的 Rust
构建产物终于获得了正确的 ELF `e_flags` 字段取值。
该修复将于 Rust 1.72.0 正式发布。

### QEMU

6 月 30 日，Song Gao [提交了](https://patchwork.ozlabs.org/project/qemu-devel/list/?series=361811)
LASX 的指令模拟支持，内含所有 LASX 指令的语义建模。

## 社区整活<small>儿</small>

本栏目接受任何网友的投稿，只要内容与 LoongArch&reg; 有关，并可以为读者带来价值，
无论严肃贡献（整的大活<small>儿</small>）或是博君一笑都一概欢迎！

6 月 29 日，yetist 的 IPXE 龙架构移植[被上游合并](https://github.com/ipxe/ipxe/pull/820)。
这对龙架构机器的无人值守运维是一大利好。（感谢 yetist 的线索投递。）

## 张贴栏

本栏目目前可供张贴公益性质的各种信息。

* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16

### AOSCC 2023：7 月 15 至 16 日，上科大见！

距离今年 AOSCC 还有不到一个月，本次聚会的日程繁多，不仅有社区项目相关的展示、讨论和投票，还有许多来自开源业界的代表门将会到场分享经验，回答问题。

详见：活动日程 (https://wiki.aosc.io/zh/community/aoscc/2023/) 。

#### “龙芯与你：你问我答”问题征集

近年来，由 LoongArch 架构驱动的龙芯 5000 系列处理器展现出了相当可观的性能提升，亦在开源社区中收获了不少人气；与此同时，企业与社区的“新旧世界”交替与在上游的碰撞与交流也成为了最近几年 LoongArch 生态参与者们时刻关注的事情。本次 AOSCC 我们有幸邀请到了来自 LoongArch 社区的上游贡献者和龙芯中科的工程师们来一同介绍和解答各位的问题和疑惑。

考虑到日程安排较为紧凑，我们决定提前收集社区提问，请[使用本问卷](https://forms.gle/QgdzPmcXqjwitmQm7)提交您希望得到解答的问题。

#### 与会者登记

由于本次 AOSCC 线下活动在上海科技大学举行，校方安保要求来访者登记个人信息，有意参加线下活动的，请于 7 月 13 日前[填写登记问卷](https://forms.gle/vc8sd3yah7eMNmoP7)。

* 本表格仅由社区代表（白铭骢）和 GeekPie 对接代表（秦斐然）查阅，并交由校方录入。
