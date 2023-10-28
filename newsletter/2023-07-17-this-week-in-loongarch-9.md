---
slug: this-week-in-loongarch-9
title: 每周一龙：第 9 期
authors: [xen0n]
date: 2023-07-17T14:28:39+08:00
tags: [每周一龙]
---

每周一都为大家报道 LoongArch&reg; 社区最前线的第一手新鲜资讯！

<!-- truncate -->

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

## 先「马」再看

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch&reg; 领域的重要或长期项目（坑）。

### Linux

7 月 13 日，hev [修复了](https://lore.kernel.org/loongarch/20230713030453.7404-1-wangrui@loongson.cn/)
`copy_user_fast` 和 `clear_user_fast` 各自异常处理路径中的一处下溢。

7 月 13 日，FreeFlyingSheep [贴出了](https://lore.kernel.org/loongarch/cover.1689215889.git.chenfeiyang@loongson.cn/)
LS7A 集成网卡的驱动补丁草稿，请社区给点<small>儿</small>意见。

7 月 11 日，xen0n 将龙架构 CPU 空闲时执行的函数名字[加入了](https://lore.kernel.org/loongarch/20230711102202.1206488-1-kernel@xen0n.name/)
`perf` 工具的相关列表，以去除 `perf` 输出中的这部分噪声。

7 月 10 日，[@specialpointcentral](https://github.com/specialpointcentral)
[贴出了](https://lore.kernel.org/loongarch/20230710124048.153562-1-huqi@loongson.cn/)龙芯二进制翻译扩展（LBT）的内核适配。
截至发稿时该补丁[已迭代到](https://lore.kernel.org/loongarch/20230714132121.107045-1-huqi@loongson.cn/)第三版。

7 月 9 日，[@donmor](https://github.com/donmor) [尝试修复](https://lore.kernel.org/loongarch/MEYP282MB2597CD6E861D659E3218148DD933A@MEYP282MB2597.AUSP282.PROD.OUTLOOK.COM/)龙架构内核的命令行处理，
使其能正确支持以内建命令行来扩展或代替引导器所传的命令行。
截至发稿时该补丁[已迭代到](https://lore.kernel.org/loongarch/MEYP282MB2597514C7A4697A72F829B78D93BA@MEYP282MB2597.AUSP282.PROD.OUTLOOK.COM/)第四版。


### 工具链

#### LLVM

上周 7 月 11 日开始 hev 陆续交了一串<small>儿</small>代码生成优化：[补丁一](https://reviews.llvm.org/D154762)、[补丁二](https://reviews.llvm.org/D154811)、[补丁三](https://reviews.llvm.org/D154819)、[补丁四](https://reviews.llvm.org/D154919)，主要都是告诉 LLVM 优化器更多相关信息以辅助其决策。

同样在 7 月 11 日，leecheechen 为 Clang [增加了](https://reviews.llvm.org/D154931) LSX/LASX 的内联汇编支持。

xen0n 也在这一天[整理了](https://reviews.llvm.org/D154916)龙架构指令定义文件让它清爽一点<small>儿</small>，也为接下来的重构作准备。

#### Rust

中国时间 7 月 13 日晚间，Rust 1.71.0 [正式发布](https://blog.rust-lang.org/2023/07/13/Rust-1.71.0.html)。
龙架构在该版本首次作为 <ruby>Tier 2 with host tools<rt>带宿主工具的二级架构</rt></ruby> 获得支持。
已经可以通过 rustup 装上标准库，用来交叉编译了（当然，目前仍需自行准备 C/C++ 交叉工具链）。

```sh-session
$ rustup target list | grep loong
loongarch64-unknown-linux-gnu (installed)
```

在此之后，为了龙架构电脑<small>儿</small>用户也能方便使用官方安装渠道
[rustup.rs](https://rustup.rs/)，hev [提交了](https://github.com/rust-lang/rustup/pull/3405)为其稳定分支
开启龙架构二进制构建的变更并请求发布新版，xen0n [整了个活<small>儿</small>](https://github.com/rust-lang/rustup/pull/3404)让安装脚本可以识别新旧世界，为旧世界用户报个友好的错<small>儿</small>。

### 杂项

睽违两年，GNU GRUB 的 2.12-rc1 版本在 7 月 10 日[正式被 tagged](https://lists.gnu.org/archive/html/grub-devel/2023-07/msg00029.html)。
2.12 正式版预计将在一个月内发布，届时所有发行版都可以丢掉一坨补丁了。

## 社区整活<small>儿</small>

本栏目接受任何网友的投稿，只要内容与 LoongArch&reg; 有关，并可以为读者带来价值，
无论严肃贡献（整的大活<small>儿</small>）或是博君一笑都一概欢迎！

日前 Deepin 社区技术委员会（TC）在例会上[讨论了](https://www.freelists.org/post/deepin-devel/-230628)合并龙架构支持的一些潜在问题等。
会议也讨论了 RISC-V 移植的类似问题。（感谢 Revy 的线索投递。）

xen0n [整了](https://gist.github.com/xen0n/5ee04aaa6cecc5c7794b9a0c3b65fc7f)个
156 字节的新旧世界内核 ABI 检测工具
（看源码需要梯子，不过总共也没几行，复杂度主要在于 ELF 头<small>儿</small>需要手工构造）。

Try it yourself!

```sh-session
# highlight-next-line
$ base64 -d > check-new-world <<EOF
f0VMRgIBAQAAAAAAAAAAAAIAAgEBAAAAeAAgAAAAAABAAAAAAAAAAAAAAAAA
AAAAQQAAAEAAOAABAAAAAAAAAAEAAAAFAAAAAAAAAAAAAAAAACAAAAAAAAAA
IAAAAAAAJAAAAAAAAAAkAAAAAAAAAAAAAQAAAAAABCiAAwUAFQAGABUAByCA
AwsYggMAACsAC3iBAwAAKwAxen0n
EOF
# highlight-next-line
$ chmod a+x check-new-world
# highlight-next-line
$ ls -l check-new-world
-rwxr-xr-x 1 xenon xenon 156 Jul 17 14:30 check-new-world.tiny
# highlight-next-line
$ ./check-new-world && echo "new world" || echo "old world"
new world
```

## 张贴栏

本栏目可供张贴公益性质的各种信息。

* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16
