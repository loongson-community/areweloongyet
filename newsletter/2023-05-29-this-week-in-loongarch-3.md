---
slug: this-week-in-loongarch-3
title: 每周一龙：第 3 期
authors: [xen0n]
tags: [每周一龙]
---

每周一都为大家报道 LoongArch&reg; 社区最前线的第一手新鲜资讯！

<!-- truncate -->

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

## 要闻速递

5 月 24 日下午，Rust 语言的 `loongarch64-unknown-linux-gnu` 目标[成功晋升][rust-loong-tier2]到
[Tier 2 with Host Tools]（带宿主工具的二级架构[^注一]）。
该支持已从 5 月 25 日开始出现于 Rust 1.71.0 Nightly 版本，并将在 7 月 13 日稳定。

5 月 26 日，mengqinggang 在 binutils 邮件列表贴出了 [LoongArch linker relaxation 优化][binutils-loong-relax]的补丁。

:::info 这啥玩意<small>儿</small>，这么放松？

Linker relaxation 暂无广泛采用的中文翻译，拙译「链接器弛豫」或「链接器松弛」：
简单地说，该优化是链接器根据编译器、汇编器生成代码时提供的额外信息，将可缩短的较长序列缩短，
以达到减少指令数，且不用关心 code model 等代码生成细节的好处；
这类似材料科学中的「应力弛豫/松弛」现象，工程上乃至在家揉面时，「释放应力」也是必须的操作步骤。
在 Linker relaxation 中，被释放的「应力」就是为了实现一定语义，所可能用到的最长指令序列啦。

更多信息可参考 MaskRay 的专题文章：[*The dark side of RISC-V linker relaxation*](http://maskray.me/blog/2021-03-14-the-dark-side-of-riscv-linker-relaxation)
与 [*RISC-V linker relaxation in lld*](http://maskray.me/blog/2022-07-10-riscv-linker-relaxation-in-lld)。
（从第一篇文章的标题可见，这个优化对基础组件开发者来说，不见得完全是好事:smirk_cat:。）

该优化能带来性能好处，但也将较为深刻地影响 LoongArch 目标代码的重定位记录用法、编译器代码生成，乃至编译器命令行使用方式[^注二]等多个方面；
因此建议开发者同学们密切关注。

:::

[binutils-loong-relax]: https://sourceware.org/pipermail/binutils/2023-May/127630.html
[rust-loong-tier2]: https://github.com/rust-lang/rust/pull/110936
[Tier 2 with Host Tools]: https://doc.rust-lang.org/rustc/target-tier-policy.html#tier-2-with-host-tools

[^注一]: 只有 x86、AMD64 和 AArch64 这种广泛流行架构才能跻身 Tier 1。作为参考，`riscv64gc-unknown-linux-gnu` 也和 LA64 Linux 一样位于 Tier 2 with host tools 级别。
[^注二]: 由于 linker relaxation 可以删除指令，因此只要有了 linker relaxation 那么编译程序时就将不再需要有时手工指定 code model 以容许更大的跳转范围等情况发生了。因此这种情况下，绝大部分场景就不再需要关心或指定 `-mcmodel` 这个选项了。

## 先「马」再看

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch&reg; 领域的重要或长期项目（坑）。

### 发行版们

（上期没有注意到）5 月 20 日，Debian 上游新建了 `pool-loong64` 文件夹。

### ClangBuiltLinux

[上游的跟踪 issue](https://github.com/ClangBuiltLinux/linux/issues/1787)
也会及时反映最新动态。

上周暂无进展（推进该项目的同学都在忙别的）。

### Linux

5 月 22 日，Yinbo Zhu [贴出了](https://lore.kernel.org/loongarch/20230522093156.7108-1-zhuyinbo@loongson.cn/)龙芯 2 号系列的电源管理支持补丁。

5 月 23 日，Tiezhu Yang [尝试重构](https://lore.kernel.org/loongarch/1684837327-18203-1-git-send-email-yangtiezhu@loongson.cn/) `perf` 工具的系统调用表。

5 月 25 日，Binbin Zhou [贴出了](https://lore.kernel.org/loongarch/cover.1684983279.git.zhoubinbin@loongson.cn/)龙芯 RTC 控制器驱动的第 4 版补丁。

5 月 29 日，Jianmin Lv [贴出了](https://lore.kernel.org/loongarch/20230529010954.2678-1-lvjianmin@loongson.cn/)龙芯中断控制器驱动的一些行为修复的第 2 版补丁。

### LLVM

本周合并了以下的功能改进等：

* tangyouling、Ami-zhang 为 compiler-rt fuzzer 组件[适配了][D140607]非 4KiB 页的系统。当然，也包括龙架构。

出现了以下的新动向：

* xen0n 终于找到了足够时间[调试并修复了][D138135] lld/ELF LoongArch port 的 TLS 处理逻辑。该补丁终于称得上「完成」了。

[D138135]: https://reviews.llvm.org/D138135
[D140607]: https://reviews.llvm.org/D140607

### Rust

[添加龙架构裸机 targets 的 MCP][loong-baremetal-mcp] 正在公示期内。目前没有反对意见，预计本周将获得通过。

龙架构 Rust 维护者们也在着手为 rustup 添加支持了：

* [升级依赖版本][rustup-pr-1]、
* [修复编译][rustup-pr-2]、
* [添加 CI 支持][rustup-pr-3]。

[loong-baremetal-mcp]: https://github.com/rust-lang/compiler-team/issues/628
[rustup-pr-1]: https://github.com/rust-lang/rustup/pull/3365
[rustup-pr-2]: https://github.com/rust-lang/rustup/pull/3364
[rustup-pr-3]: https://github.com/rust-lang/rustup/pull/3363

截至发稿时，这些 PRs 都已被合并。
预计到 Rust 1.71.0 正式发布时，龙架构 Rust 开发者将得以享受不逊其他架构的同等开发体验。

## 社区整活<small>儿</small>

本栏目接受任何网友的投稿，只要内容与 LoongArch&reg; 有关，并可以为读者带来价值，
无论严肃贡献（整的大活<small>儿</small>）或是博君一笑都一概欢迎！

本周没有投稿。

## 张贴栏

本栏目目前可供张贴公益性质的各种信息。

* 杜比欢迎同学们去 [LA UOSC 的 Debian port 页面][lauosc-debian]看看。
* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[lauosc-debian]: https://bbs.loongarch.org/d/167-lauosc-debian-12-ports
[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16
