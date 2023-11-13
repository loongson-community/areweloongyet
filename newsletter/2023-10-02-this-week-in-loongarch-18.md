---
slug: this-week-in-loongarch-18
title: 每周一龙：第 18 期
authors: [xen0n]
date: 2023-10-02T18:40:39+08:00
tags: [每周一龙]
---

每周一都为大家报道 LoongArch&reg; 社区最前线的第一手新鲜资讯！

<!-- truncate -->

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

## 先「马」再看

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch&reg; 领域的重要或长期项目（坑）。

### Linux

Linux v6.6-rc4 已经[正式 tagged](https://lore.kernel.org/lkml/CAHk-=wia2-4DRvD-aXz70AV64yrt+Vr50MxHiDunZ71dHATv-Q@mail.gmail.com/)，
包含了两处龙架构修复，请各下游发行版的打包同学们注意并尽量 backport：

* 修复模块加载器不认识 binutils 2.41 汇编出的新重定位类型的问题（Tiezhu Yang），
* 修复 NUMA 系统上物理内存天花板的计算问题（Huacai Chen）。

此外，龙架构 KVM 支持目前已进入 linux-next，
可搭配暂未完全上游的[龙芯 QEMU 分支](https://github.com/loongson/qemu/tree/kvm-loongarch)
供同学们试用了。
（目前已经在上游的随机自动化测试中[被发现了](https://lore.kernel.org/loongarch/d5ba4268-eef0-46be-8314-fccad55f41e2@infradead.org/)一处编码不周，
不过预计假期结束之后就会修掉。）

### 工具链

#### gcc

持续有一段时间的 [PR110939](https://gcc.gnu.org/bugzilla/show_bug.cgi?id=110939)
上周终于得到了解决。
龙架构的自举，以及 ARM、RISC-V 上的相关测试失败都修复了。

xry111 [在努力](https://github.com/xry111/gcc/commits/xry111/explicit-relocs-auto)从默认开启
linker relaxation 所导致的指令调度机会减少中，抠回一些性能：
在一些「明摆着不能依靠链接器 relax 的情况下」（本人语），仍然如先前一样生成
explicit relocs。
他准备在假期结束之后将此工作发向邮件列表（否则发了也没人看）。
（感谢作者自我投稿！）

#### LLVM

LLVM 的协作流程已全面转向 GitHub PR，Phabricator 不日将转为只读模式，请开发者们注意。
详情请见[迁移时间表](https://discourse.llvm.org/t/update-on-github-pull-requests/71540)。

Ami-zhang 给 LLVM 中端的 `Transforms/IPO/LowerTypeTests` <ruby>工序<rt>pass</rt></ruby>[适配了](https://github.com/llvm/llvm-project/pull/67312)龙架构。

周报第 14 期报道过的 hev 的[原子操作优化](https://reviews.llvm.org/D159252)上周也进入了主线。

#### Rust

发稿几小时前，Rust 生态中最重要密码学基础库之一 `ring`
[合并了](https://github.com/briansmith/ring/pull/1632)龙架构支持。
时隔两年之久，`ring 0.17.0` 终于正式发布，可以期待未来的数月间更多 Rust
项目能够随着依赖版本升级，而获得龙架构支持了。

9 月 30 日 hev 将龙架构裸机的构建目标[提升到了](https://github.com/rust-lang/rust/pull/115368)
Tier 2。
不巧的是，这个提交的合并似乎恰好错过了 Rust 1.74.0 的班车：
目前看因为就几行代码和 CI 改动，塞进去也不是不可以，不过不急的话估计等等更好。
龙架构的目前用户群体里，应该极少有既跟踪上游社区版本，又做裸机开发的，因此笔者认为问题不大。
（感谢作者自我投稿！）

同一天，xry111 给 Rust 读写目标代码文件格式的著名基础库 `object`
[添加了](https://github.com/gimli-rs/object/pull/578) LoongArch ELF psABI
20230519 版本新增的重定位类型定义。
（感谢作者自我投稿！）

## 限时返场专栏：QEMU

最近 QEMU 上游的龙架构文件夹又热闹起来了。
后续看情况只要一周间的 QEMU 动态足够多，这个专栏就会出现并收纳它们，否则还是塞《杂闻播报》。

日前（9 月 21 日），QEMU 的龙架构模拟[获得了](https://gitlab.com/qemu-project/qemu/-/commit/55394dcbec8f0c29c30e792c102a0edd50a52bf4)
LASX 支持（不过很快[被发现有坑](https://gitlab.com/qemu-project/qemu/-/issues/1907)）。
（感谢 [@jiegec](https://github.com/jiegec) 的提醒！）

10 月 1 日，Jiajie Chen 给龙架构的 linux-user 模拟[开启了](https://patchwork.kernel.org/project/qemu-devel/patch/20231001085315.1692667-1-c@jia.je/)
LSX、LASX 的 ELF HWCAP 标志位。
（这样被模拟的程序们就不会看着没 HWCAP，
便按照[《龙架构软件开发与构建约定》有关条款](https://github.com/loongson/la-softdev-convention/blob/2975b325e1d31c8b52d75f9948d627343c5a454c/la-softdev-convention.adoc#91-kernel-development)，
主动规避向量指令了。）

同一天，笔者测试了 Richard Henderson 9 月 16 号[给龙架构做的 128 位访存优化](https://patchwork.kernel.org/project/qemu-devel/list/?series=784972)没问题，
回了封邮件，并且十分惭愧近期在 QEMU 水的补丁不够多：
准备今年看着把 LBT 扩展指令多利用起来。

9 月 30 日，Richard Henderson 在他给 linux-user [增加](https://patchwork.kernel.org/project/qemu-devel/list/?series=788954)
vDSO 模拟的同时，
顺手[适配了](https://patchwork.kernel.org/project/qemu-devel/patch/20230930021529.987950-16-richard.henderson@linaro.org/)龙架构。

同一天，Jiajie Chen [修复了](https://patchwork.kernel.org/project/qemu-devel/patch/20230930112837.1871691-1-c@jia.je/)
前面提到的 LASX 支持代码中一处标志位写错，导致 guest 内核或进程崩溃，啥都干不了的巨坑。

9 月 26 日，Song Gao [修了](https://patchwork.kernel.org/project/qemu-devel/patch/20230926075819.3602537-1-gaosong@loongson.cn/)龙架构
TCG 的一处构建错误，又[解决了](https://patchwork.kernel.org/project/qemu-devel/patch/20230926071253.3601021-1-gaosong@loongson.cn/)一处警告。

同一天，Xianglai Li 给龙架构[加了](https://patchwork.kernel.org/project/qemu-devel/list/?series=787587)热插拔虚拟 CPU 的能力。

## 杂闻播报

9 月 29 日，Shi Pujin 在 Slackware CN 用户社区[发布了](http://slackwarecn.github.io/2023/09/29/Slackwareloong1.0%E5%8F%91%E5%B8%83%EF%BC%81/)
Slackwareloong 1.0 LTS 版本。
（感谢作者自我投稿！）


## 社区整活:儿:

本栏目接受任何网友的投稿，只要内容与 LoongArch&reg; 有关，并可以为读者带来价值，
无论严肃贡献（整的大活:儿:）或是博君一笑都一概欢迎！

LA UOSC 网友 autistic-chad（GitHub [@cl91](https://github.com/cl91)）[在憋大招](https://bbs.loongarch.org/d/303-gsgpu)：
将 GSGPU 的内核驱动从 Loongnix 4.19 内核移植到主线版本（6.6+）！

:::info RESPECT
这需要跨越 5 年的时间，26 个正式版本，数万条图形子系统提交，几十甚至上百次合并冲突或接口变更；
还没算上 GSGPU 和 Apple M1 GPU 情况类似，都处于 0 公开文档状态。
向这位勇士致敬！

也欢迎有意向的同学在 LA UOSC 论坛上述的贴子参与互动：
有一份热，发一份光，
以使上游内核的使用者们能早日用上龙芯集显的 3D 加速<sup>~~蚊子再小也是肉~~</sup>。
:::

## 张贴栏

本栏目可供张贴公益性质的各种信息。

* 友情扩散：[安同开源社区（AOSC）](https://aosc.io)的龙架构移植主线化工作「合龙」仍在如火如荼进行中，
  此工作完成后龙架构将升格为 AOSC OS 的 Tier 1 架构。
  欢迎同学们试用、反馈，也欢迎有志之士一同加入。
  推荐阅读[《安记冰室・九月下》](https://github.com/AOSC-Dev/newsroom/blob/bfa12c12b1f819adab0fa568e906e682e0fbc244/coffee-break/20230922/zh_CN.md)。(An
  English version [is also available](https://github.com/AOSC-Dev/newsroom/blob/bfa12c12b1f819adab0fa568e906e682e0fbc244/coffee-break/20230922/en.md).)
* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16
