---
slug: this-week-in-loongarch-1
title: 每周一龙：第 1 期
authors: [xen0n]
date: 2023-05-15T21:49:14+08:00
tags: [每周一龙]
---

由志愿者们自发编撰的 LoongArch&reg; 社区生态周报《每周一龙》与大家见面了！
每个周一都为大家带来社区贡献者们从最前线传来的第一手新鲜资讯。

<!-- truncate -->

## 先「马」再看

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch&reg; 领域的重要或长期项目（坑）。

### 发行版们

* Loong Arch Linux: yetist 发布了 2023.05.08 版本的 ISO 镜像。
* Debian: 5 月 15 日间，zhangdandan 呼吁感兴趣的同学去[申请创建 debian-loongarch 邮件列表的 bug][debian-loongarch] 下回复表示支持。
* Deepin: 中国时间 5 月 6 日凌晨 03:59，Revy 在 Deepin 社区[提交了增加龙架构支持的 PR][deepin-loong]。辛苦了！

[loongarchlinux-isos]: https://mirrors.wsyu.edu.cn/loongarch/archlinux/iso/
[debian-loongarch]: https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=1023585
[deepin-loong]: https://github.com/deepin-community/rfcs/pull/2

### ClangBuiltLinux

[上游的跟踪 issue](https://github.com/ClangBuiltLinux/linux/issues/1787)
也会及时反映最新动态。

龙芯 LLVM 团队与 xen0n 正在对 LLVM 进行必要的修改，以使其足以构建 Linux 内核。

### Linux

* 北京时间 5 月 11 日，`drm-next` 分支[接受了为 DCN 架构 AMD 显卡添加龙架构适配的补丁][dc-fp-loong]。
  该补丁已进入 linux-next，可方便试用了。

[dc-fp-loong]: https://gitlab.freedesktop.org/agd5f/linux/-/commit/d3295311e589a14a7496f0e14b5be6c3b5d9e134

### LLVM

一周间合并了以下的功能改进等：

* SixWeining 为 LoongArch Clang 的内联汇编（inline asm）[添加了][D136436]不带 `$` 前缀的通用寄存器支持。
  这是支持 ClangBuiltLinux 项目所必须的能力之一。
* SixWeining 为 LoongArch Clang 的内联汇编[添加了][D150089]对浮点条件码寄存器 `$fccX` 的 clobber 支持。

出现了以下的新动向：

* xen0n 尝试为 LoongArch 后端[添加对 large 代码模型的支持][D150522]（GCC 叫这个模型 `extreme`）。
  这是支持 ClangBuiltLinux 项目所必须的能力之一。

[D136436]: https://reviews.llvm.org/D136436
[D150089]: https://reviews.llvm.org/D150089
[D150522]: https://reviews.llvm.org/D150522

## 社区整活:儿:

本栏目接受任何网友的投稿，只要内容与 LoongArch&reg; 有关，并可以为读者带来价值，
无论严肃贡献（整的大活:儿:）或是博君一笑都一概欢迎！

donmor 同学使用 QEMU 模拟的龙架构验证了很多软件和游戏：

* [TheXTech SMBX](https://github.com/Wohlstand/TheXTech)，同人马里奥引擎。
  使用 `-sw` 参数软解可在 QEMU 运行~~一帧电竞~~，据群友说独显实机可玩
* [EasyRPG Player](https://easyrpg.org/player)，RPG2000/2003 虚拟机，在 QEMU 可流畅运行
* [LTFS](https://github.com/LinearTapeFileSystem/ltfs)，磁带机的驱动。可能需要稍微改一些代码
* [FRP](https://gofrp.org/)，内网穿透工具，懂的都懂（
* [SpaceCadetPinball](https://github.com/k4zmu2a/SpaceCadetPinball)，Windows XP 三维弹球的移植版。
  需要自行获取原版文件放入 `~/.local/share/SpaceCadetPinball`。
  QEMU 帧数感人\_(:з」∠)\_
* [Seafile](https://www.seafile.com/)，大名鼎鼎的网盘，在论坛也被提起好多次。
  此次编译的是社区版 9.0.10，不排除专业版可以 LATX 运行（
  除网页端 Office 集成和客户端 OAuth（没试过，据说因为缺少 qt5-webengine）外，大部分功能已基本可用，seadrive 需指定使用 qt5-webkit（已进入 Arch 源）
* [np2kai](http://domisan.sakura.ne.jp/article/np2kai/np2kai.html)，大名鼎鼎的 PC98 模拟器 nekoproject2 的跨平台改版，已经进入 libretro。
  QEMU 可启动，能运行东方旧作，然而帧数不到 1fps（悲）
* [Onscripter-Yuri](https://github.com/YuriSizuku/OnscripterYuri)，NScripter虚拟机。
  QEMU 可启动，也比较卡，不过这也是个不会让人有空关心帧数的玩意（
  据说可以启动 FSN，月球人狂喜

## 张贴栏

本栏目目前可供张贴公益性质的各种信息。

* 杜比欢迎同学们去 [LA UOSC 的 Debian port 页面][lauosc-debian]看看。
* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[lauosc-debian]: https://bbs.loongarch.org/d/167-lauosc-debian-12-ports
[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16
