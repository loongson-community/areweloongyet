---
slug: this-week-in-loongarch-36
title: 每周一龙：第 36 期
authors: [xen0n]
date: 2024-02-12T00:00:00+08:00
tags: [每周一龙]
draft: true  # TODO
---

每周一都为大家报道 LoongArch 社区最前线的第一手新鲜资讯！
上周的进展主要有 AOSC OS 成功「合龙」、TODO，以及——农历甲辰龙年新年快乐:dragon:！
详情点进来看！

<!-- truncate -->

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

## 要闻速递 {#breaking-news}

### AOSC OS 合龙工程圆满收官！ {#aosc-os-loongarch64-port-completed}

[安同开源社区（AOSC）][aosc]在龙年初一，完成了历时逾半年的「合龙」工作，LoongArch 已成为
AOSC OS 的一级（Tier 1）架构，享受顶级维护与支持。AOSC 开发者[白铭骢][MingcongBai]说：

经过多名社区同事超过半年的努力，AOSC OS 已成功「合龙」——所有龙架构软件包均已进入稳定 (stable) 源。
考虑到用户和维护者之间关注度和设备持有率较高，龙架构也正式升格为 AOSC OS 的一级架构，
享受最完整特性集和最及时的更新。

目前该移植正在进行「合龙」后的最后修缮，并在不同设备配置上测试和验证使用体验。
正式版系统发行（安装盘和系统包等）将于近期在其社区主页和龙芯开源社区的论坛发布。

在这里，我希望着重感谢几位维护者的贡献：

- [陈嘉杰][jiegec]：实现自动化框架，大大提高移植维护效率；整理和维护 Chromium
  补丁集，为用户们提供了又一理想的浏览器选择；在最后冲刺中贡献突出，让龙年第一天完成“合龙”成为现实；
- [刘子兴][liushuyu]：实现了 Firefox WebRTC 支持，让使用龙架构参加在线视频会议和使用
  Discord 等语音聊天软件成为可能；提交了 GCC D 编译器和 LDC 的龙架构支持；
- [王江津][RedL0tus]：为当前 AOSC OS 锁定的 GCC 13 和 Glibc 2.37 维护了矢量补丁；修复了
  Firefox 的硬解支持；
- [王邈][shankerwangmiao]：实现和维护 libLoL 新旧世界兼容层的内核和用户空间组件；
- [SignKirigami][prcups]：整理和维护 QtWebEngine 补丁集，不仅为 Chromium
  补丁集提供了工作基础，还为全功能 KDE 6 奠定了基础。

此外，我们还应感谢龙芯中科各位工程师们的辛勤劳作和积极协作，龙架构的上游软件生态日益壮大和成熟离不开他们的努力。
希望在未来能够继续与他们一同合作，为龙架构的桌面生产力添砖加瓦！

最后，感谢过去一年中各位同事的辛勤劳作，祝各位社区好友龙年吉祥，万事如意！

— 白铭骢

[aosc]: https://aosc.io
[jiegec]: https://github.com/jiegec
[liushuyu]: https://github.com/liushuyu
[MingcongBai]: https://github.com/MingcongBai
[prcups]: https://github.com/prcups
[RedL0tus]: https://github.com/RedL0tus
[shankerwangmiao]: https://github.com/shankerwangmiao

## 先「马」再看 {#marked-projects}

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch 领域的重要或长期项目（坑）。

### 工具链 {#toolchain}

#### ABI {#abi}

为搭配上期周报[提到的](./2024-02-05-this-week-in-loongarch-35.md#rust) Rust
LoongArch targets 默认代码模型变更，以在无需用户手动干预的前提下，允许链接 Chromium
等大型应用的同时，不影响较小应用的性能，[xen0n]
[发起了](https://github.com/loongson-community/discussions/issues/43)讨论。
有两种可行的做法，可以只做其中一种，也可以都做：

* 允许 relax `R_LARCH_CALL36` 即 `medium` 代码模型下的过程调用指令序列。
* 实现范围扩展片段（range extension thunks），以在 `R_LARCH_B26` 即单条 `bl`
  指令「够不着」跳转目标的情况下，生成小段的「蹦床」片段，帮助跳转到目标。

前者能确保那些实际只需一条指令即可表达的跳转，在最终代码中都如此短，有利于发挥性能；
后者则能为存量的代码提供兼容，方便开发者与用户的迁移。

[xen0n]: https://github.com/xen0n

#### binutils {#binutils}

上周除了 Binutils 2.42 正式版本发布之外，还有些瞄准 2.43 版本的功能开发，因此延至本期报道了。

mengqinggang [使得](https://sourceware.org/pipermail/binutils/2024-February/132306.html)单纯的
`.align N` 形态所生成的 `R_LARCH_ALIGN` 记录不再关联到符号。

mengqinggang 还[修复了](https://sourceware.org/pipermail/binutils/2024-February/132301.html)
`R_LARCH_ALIGN` 与[丢弃输出节（output section discarding）功能](https://sourceware.org/binutils/docs/ld/Output-Section-Discarding.html)相互作用导致的错误。

Lulu Cai [去除了](https://sourceware.org/pipermail/binutils/2024-February/132299.html)不必要的
TLS IE 模型的动态重定位记录。

#### GCC {#gcc}

Lulu Cheng [修复了](https://gcc.gnu.org/pipermail/gcc-patches/2024-February/645016.html)
`__iocsrrd_h` 的错误返回类型，
又从 `larchintrin.h`
[移除了](https://gcc.gnu.org/pipermail/gcc-patches/2024-February/645017.html)一批冗余的类型转换。

#### LLVM {#llvm}

TODO

## 杂闻播报 {#assorted-news}

2 月 6 日，Sui Jingfeng 向社区逆向工程并维护的 Vivante 驱动 `etnaviv`
[提交了](https://lore.kernel.org/dri-devel/20240206172759.421737-1-sui.jingfeng@linux.dev/)第
13 版的 PCIe 形态的 Vivante 设备支持。
我们早就知道 LS7A1000 桥片、2K1000 SoC 内置的 GPU 是 Vivante GC1000，
但是这次提交为我们更新了一个新的知识：
景嘉微 JM9100、JD9230P 以及凌久 GP102 也都是 Vivante。
感谢 [zhangn1985] 提供新闻线索！

2 月 2 日，deepin（深度）社区[发布了](https://bbs.deepin.org/post/267828)
deepin v23 Beta 3，
首度[包含了](https://ci.deepin.com/repo/obs/deepin-ports-images/test-20240205-loong64/)
LoongArch 移植。
但请注意：此 LoongArch 测试镜像非 ISO 格式，而是磁盘镜像。请阅读随附的 README 文档以了解如何使用。
感谢 [RevySR] 提供新闻线索~~正好错过上期周报的发布~~！

[RevySR]: https://github.com/RevySR
[zhangn1985]: https://github.com/zhangn1985

## 社区整活:儿: {#grins}

本栏目接受任何网友的投稿，只要内容与 LoongArch 有关，并可以为读者带来价值，
无论严肃贡献（整的大活:儿:）或是博君一笑都一概欢迎！

TODO

## 张贴栏 {#bulletin}

本栏目可供张贴公益性质的各种信息。

* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16
