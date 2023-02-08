---
sidebar_position: 3
---

# 旧世界与新世界

:::caution 施工现场！
本页面还在施工中，内容可能在未来一段时间仍会有扩充、修改。不妨多来看看！
:::

截至目前（2023 年初），LoongArch 有两套不兼容的软件体系，习惯上大家把它们叫作“旧世界”和“新世界”。

**旧世界**是指龙芯中科内部适配的、最初以二进制形式随着 LoongArch 公开而发布的、
源代码始终未完全开放的那个 LoongArch 软件生态。
**新世界**是指随着 LoongArch 适配补丁在上游被讨论、修改、合并，而逐渐成型的，
完全开源的 LoongArch 软件生态。

两个世界的产生是龙芯中科对 LoongArch 采取了秘密开发、突然全盘推出的商业策略，而使客户和自身不得不面对的无奈后果。
按照目前的趋势和一些公开消息，未来旧世界将逐渐消亡。
从龙芯 3A6000 的配套固件、系统开始，新推出的商业产品都会基于新世界开发。

在讨论龙芯话题时，新旧世界的说法仅仅被用来区分两个不兼容的 LoongArch 生态。
MIPS 型号的龙芯既不是新世界也不是旧世界。
一般只会说“MIPS 时代的龙芯”（the MIPS-era Loongson）怎么怎么样。

“旧世界”、“新世界”的名词形式英译即为“the old world”、“the new world”。
作形容词时一般以连字符连接前后部分即“old-world”、“new-world”。
如果在一段话中频繁使用，有时也会用“OW”、“NW”的缩写形式。

## 我在哪个世界？

如果符合以下任一条件，你就在用**旧世界**：

* 系统是麒麟、Loongnix、UOS 其中之一
* 内核版本以 4.19 开头
* 有 WPS 用

如果一条都没中，你就在用**新世界**。

这个判断方法是基于 2023 年 2 月的已知信息设计的。
后续如果没及时更新，可能会不准。

## 手头这软件是哪个世界的？

可以使用 `file` 工具方便地检查一个二进制程序属于哪个世界。
假设你想检查 `someprogram` 这个文件，就执行 `file someprogram`，如果输出的行含有这些字样：

```
interpreter /lib64/ld.so.1, for GNU/Linux 4.15.0
```

就表明这是一个旧世界程序。

相应地，如果输出的行含有这些字样：

```
interpreter /lib64/ld-linux-loongarch-lp64d.so.1, for GNU/Linux 5.19.0
```

就表明这是一个新世界程序。

以上的判断都适用于系统 libc 为 glibc 且动态链接的程序。如果程序是静态链接的，便没有 interpreter 信息；
如果程序是 Go 语言的或者使用了 musl 作为 C 库，那么文件里就没有对应到 `for GNU/Linux` 这部分信息的标记。
这种时候试着运行一下就可以了，“异世界”的程序几乎没有可能正常启动。

当然，如果你得到的输出类似下边几行之一：

```
someprogram: Python script, Unicode text, UTF-8 text executable
someprogram: Bourne-Again shell script, ASCII text executable, with escape sequences
```

这种情况代表你检查的程序是个脚本。
一般脚本语言的程序都无所谓新旧世界的，但它仍然有可能依赖一些二进制组件才能正常工作：
因此最靠谱的方法还是试着跑一下！

## 为啥叫“新旧世界”？

在汉语圈其他领域已有“新旧世界”的说法了，例如“旧/新世界猴”、“旧/新世界葡萄酒”：
这里的“世界”其实就是“大陆”。
LoongArch 的新世界也比旧世界出现得晚，并且也存在做事方式上的不兼容，相互之间也有一定的沟通交流，
因此这样的类比在一定程度上还比较贴切。

在技术领域，“新旧世界”的说法也有先例。怀旧计算（retro-computing）群体对
Macintosh 电脑的不同型号就使用 Old World、New World 来区分。
他们的“旧世界”是指包含 Macintosh Toolbox 这个老固件的一块 ROM。
使用 Old/New World ROM 的 Macintosh 型号就被叫作 Old/New World Macs。

另一方面，使用 Linux 源码发行版如 Gentoo 的用户群体，
口语上也有“重做世界”（rebuild world）之类的表达。
此处的“世界”是系统上所有包的统称，
这层意义上 world 的含义类似 userland：统称在用户态运行的所有程序。
对 Gentoo 用户而言，还恰好表示 `@world` 集合。
而 LoongArch 的新旧世界区分，很大程度上正是由于内核态提供的系统调用界面有细微差别。

## 俩世界区别在哪？

**源码开放程度不一样**。
新世界都是开源代码，而旧世界的部分底层代码由于知识产权等原因始终没有开放，尽管其中也有一部分后来放出了。
比方说旧世界的 binutils、gcc 在最初发布之后过了几个月有了完整源码，
但 Linux 内核、GSGPU 驱动就始终没有。
放出的源码基本也比较少有完整的 Git 提交历史，因此不便基于它二次修改或者将其移植到上游新版本。

**可用的发行版不一样**。
由于外界拿不到旧世界的完整源码，旧世界发行版只有几个商业公司能做。
社区制作的发行版都属于新世界。

目前已知的旧世界发行版（移植）有：（按英文名字母顺序排序）

* 麒麟 (Kylin)
* Loongnix
* UOS

目前已知的新世界发行版（移植）有：（按英文名字母顺序排序）

* [CLFS 手册与成品](https://github.com/sunhaiyong1978/CLFS-for-LoongArch)
* [Debian](https://wiki.debian.org/Ports/loong64)
* [Fedora LoongArch Remix](https://github.com/fedora-remix-loongarch/releases-info)
* [Gentoo](https://wiki.gentoo.org/wiki/Project:LoongArch)
* [Loong Arch Linux](https://github.com/loongarchlinux)
* [Slackware](https://github.com/shipujin/slackware-loongarch64)

:::caution

有些新世界发行版是由龙芯员工制作，因此相比其他纯社区工作，
可能会额外集成一些：

* 尚未正式合入上游的代码（如 LSX/LASX 支持）
* 授权不清晰的内容（如 LATX 没有许可协议，默认为所有权利保留，无法被龙芯中科以外的主体集成、分发等）
* 尚未开源的内容（如 libffi、LibreOffice、Chromium 等软件，在 CLFS、Loong Arch Linux 很早就有包了，比相应的开源补丁最早一版还早。它们的移植都更晚甚至仍未完全进入上游。最极端的例子是 2021 年初 LoongArch 工具链、内核源码、QEMU 移植都还没开源，硬件也很难买到，CLFS 就已经出来了。）

不过随着时间推移，更多内容会进入上游或变成熟，
这种情况以后也会越来越少直至消失。

:::

**软件版本不一样**。
旧世界的基础组件版本主要跟随当初移植时基于的 Debian 或 RHEL 大版本。
因为商业公司不一定有优先级（或者能力）去关心跟进新版本的事情，
所以旧世界的基础组件版本几乎不会有大的更新。
视具体用户场景和开发、部署习惯而定，有时候这是个好事，有时候很糟心。

以下是一些常见软件、开发工具在两个世界的版本对比：

|软件|旧世界版本|新世界版本|
|----|----------|----------|
|Linux|4.19|&ge; 5.19，常见 &ge; 6.1|
|binutils|2.31|&ge; 2.38，常见 &ge; 2.40|
|gcc|8.3|&ge; 12.1，常见 &ge; 13.0|
|glibc|2.28|&ge; 2.36|
|LLVM|8|&ge; 16|
|Node.js|14.16.1|&ge; 18|
|Go|1.15、1.18、1.19|&ge; 1.19|
|Rust|1.41、1.58|&ge; 1.69|
