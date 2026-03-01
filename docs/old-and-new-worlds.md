---
sidebar_position: 3
---

# 旧世界与新世界

:::warning 施工现场！
本页面还在施工中，内容可能在未来一段时间仍会有扩充、修改。不妨多来看看！
:::

:::tip 关于术语的重要说明
虽然「旧世界」和「新世界」这两个术语使用起来很方便，但它们往往过于笼统，可能导致人们混淆问题的不同方面。龙芯的「ABI1.0」/「ABI2.0」术语也不是更好的选择，因为语义上与前者等价，而且提到「ABI」反而更糟糕，因为「目标文件 ABI」（object file ABI）本身就是 ABI 差异中的一个概念。

因此，我们应该采用新的方法，明确区分 LoongArch ABI 差异的不同方面：

| 方面 | 新术语（原「新世界」） | 新术语（原「旧世界」） |
|----|----|----|
| 引导协议 | UEFI | BPI |
| Linux UAPI | 5.19 UAPI | "4.19" UAPI[^4.19-uapi] |
| 目标文件 ABI | 不加限定词，或必要时使用「object file ABI v1」或 `EF_LARCH_OBJABI_V1` | "object file ABI v0"[^objabi-v0] |
| 重定位风格 | 不加限定词，或必要时使用「direct-style relocs」 | stack-machine-based relocs |

[^4.19-uapi]: 尽可能给「4.19」加引号，因为上游的 Linux 4.19.x 版本实际上并不支持 LoongArch。

[^objabi-v0]: 不存在 `EF_LARCH_OBJABI_V0`。

新编写的内容应优先使用更精确的新术语。本页面作为历史文档，仍保留「旧世界」和「新世界」的术语以便理解。
:::

:::info 我需要关心这问题吗？
简单来讲，如果您不自行编译安装软件，或许就不必关心。
当然，随意浏览下这篇文章，以后见到这俩说法不至于一头雾水，或者其他同学遇到问题您可以给 :ta: 们指路，也是不错的。

* 如果您目前在龙架构电脑上使用 Loongnix、麒麟或者 UOS 这些系统，几个月或一两年之后，一定会有一次全系统升级。
    * 如果您不升级，那么本身外界如何变化也与您无关。
    * 如果您升级，那么升级之后您应该也感受不到使用上的差别，这其实就是「移民新世界」了。
* 如果您目前在龙架构电脑上使用 Arch、Gentoo 等等这些系统，那么您已经是新世界住民了，这一切也与您无关。

会被坑到的情况目前来看只有：

* 您使用 Loongnix、麒麟或者 UOS 这些系统，但自行编译了一些要用的软件。
  在未来那次全系统升级之后，您自行编译的软件应该不再能工作，需要重新编译或从系统包管理器安装。
* 您是为龙架构适配或开发软件的开发者用户。
  会来到这个页面，基本是已经被坑到了，那就往下读吧！
:::

截至目前（2024 年初），LoongArch 有两套不兼容的软件体系，习惯上大家把它们叫作「旧世界」和「新世界」。
龙芯中科的材料中也有「ABI1.0」、「ABI2.0」的提法（目前所见的表述均未在 ABI 与数字之间加空格）。

**旧世界**是指最早在龙芯中科内部适配的、随着 LoongArch 公开一并发布的那个 LoongArch 软件生态。
**新世界**是指龙芯中科与社区同仁一道，以典型开源社区协作模式打造的，完全开源的 LoongArch 软件生态。

两个世界的产生是龙芯中科对 LoongArch 采取了秘密开发、突然全盘推出的商业策略，
由于未能预见到这一版工作有些地方不得不做不兼容修改，而使客户和自身不得不面对的无奈后果。
按照目前的趋势和一些公开消息，未来旧世界将逐渐消亡。
从龙芯 3A6000 一代产品起，相关产品的出厂配套固件都已达到兼容新、旧世界的状态，
但就 2024 年 2 月初的现状而言，可能发行版方面（Loongnix 及其他商业发行版）仍需更长时间才能完成迁移，
因此未能赶上 3A6000 的正式发布。

在讨论龙芯话题时，新旧世界的说法仅仅被用来区分两个不兼容的 LoongArch 生态。
MIPS 型号的龙芯既不是新世界也不是旧世界。
一般只会说「MIPS 时代的龙芯」（the MIPS-era Loongson）怎么怎么样。

「旧世界」、「新世界」的名词形式英译即为「the old world」、「the new world」。
作形容词时一般以连字符连接前后部分即「old-world」、「new-world」。
如果在一段话中频繁使用，有时也会用「OW」、「NW」的缩写形式。

## 我在哪个世界？

如果符合以下任一条件，你就在用**旧世界**：

* 系统是麒麟、Loongnix、UOS 其中之一
* 内核版本以 4.19 开头
* 有 WPS 用但没有安装过 `libLoL` 等旧世界兼容方案

如果一条都没中，你就在用**新世界**。

这个判断方法是基于 2024 年 2 月的已知信息设计的。
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
这种时候试着运行一下就可以了，「异世界」的程序几乎没有可能正常启动。

当然，如果你得到的输出类似下边几行之一：

```
someprogram: Python script, Unicode text, UTF-8 text executable
someprogram: Bourne-Again shell script, ASCII text executable, with escape sequences
```

这种情况代表你检查的程序是个脚本。
一般脚本语言的程序都无所谓新旧世界的，但它仍然有可能依赖一些二进制组件才能正常工作：
因此最靠谱的方法还是试着跑一下！

## 为啥叫「新旧世界」？

在汉语圈其他领域已有「新旧世界」的说法了，例如「旧/新世界猴」、「旧/新世界葡萄酒」：
这里的「世界」其实就是「大陆」。
LoongArch 的新世界也比旧世界出现得晚，并且也存在做事方式上的不兼容，相互之间也有一定的沟通交流，
因此这样的类比在一定程度上还比较贴切。

在技术领域，「新旧世界」的说法也有先例。怀旧计算（retro-computing）群体对
Macintosh 电脑的不同型号就使用 Old World、New World 来区分。
他们的「旧世界」是指系统硬件包含一块 ROM 芯片，其中搭载了 Macintosh Toolbox 这个老固件。
「新世界」硬件则没有这块芯片。
使用 Old/New World ROM 的 Macintosh 型号就被叫作 Old/New World Macs。

另一方面，使用 Linux 源码发行版如 Gentoo 的用户群体，
口语上也有「重做世界」（rebuild world）之类的表达。
此处的「世界」是系统上所有包的统称，
这层意义上 world 的含义类似 userland：统称在用户态运行的所有程序。
对 Gentoo 用户而言，还恰好表示 `@world` 集合。
而 LoongArch 的新旧世界区分，很大程度上正是由于内核态提供的系统调用界面有细微差别，
导致了用户态的程序相互间不兼容。

## 俩世界区别在哪？

**源码开放程度不一样**。
新世界都是开源代码，而旧世界的部分底层代码由于知识产权等原因始终没有开放，尽管其中也有一部分后来放出了。
比方说旧世界的 binutils、gcc 在最初发布之后过了几个月有了完整源码，Linux 源码直到 2023 年才有，
但 GSGPU 的 shader 编译器源码就始终没有。
放出的源码基本也比较少有完整的 Git 提交历史，因此不便基于它二次修改或者将其移植到上游新版本。

**可用的发行版不一样**。
由于外界拿不到旧世界的完整源码，旧世界发行版只有几个商业公司能做。
社区制作的发行版都属于新世界。

目前已知的旧世界发行版（移植）有：（按英文名字母顺序排序）

* 麒麟 (Kylin)
* Loongnix
* UOS

目前已知的新世界发行版（移植）有：（按英文名字母顺序排序）

* [ALT Linux](https://www.altlinux.org/Ports/loongarch64)
* [AOSC OS](https://aosc.io/zh-cn)
* [CLFS 手册与成品](https://github.com/sunhaiyong1978/CLFS-for-LoongArch)
* [Debian](https://wiki.debian.org/Ports/loong64)
* [Fedora LoongArch Remix](https://github.com/fedora-remix-loongarch/releases-info)
* [Gentoo](https://wiki.gentoo.org/wiki/Project:LoongArch)
* [Loong Arch Linux](https://github.com/loongarchlinux)
* [Slackware](https://github.com/shipujin/slackware-loongarch64)
* [Yongbao](https://github.com/sunhaiyong1978/Yongbao)

:::warning

有些新世界发行版是由龙芯员工制作，因此相比其他纯社区工作，
可能会额外集成一些：

* 尚未正式合入上游的代码（如内核的二进制翻译支持）
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
|gcc|8.3|&ge; 12.1，常见 &ge; 13.1|
|glibc|2.28|&ge; 2.36|
|LLVM|8|&ge; 16|
|Node.js|14.16.1|&ge; 18|
|Go|1.15、1.18、1.19|&ge; 1.19|
|Rust|1.41、1.58|&ge; 1.71|

## 怎么兼容两个世界？

鉴于新旧世界的差异可谓不大不小，想要实现完美的兼容性十分困难：一个方案无法同时具备以下的全部优势，而必须作出取舍。

* 所需磁盘空间尽可能少，
* 性能开销尽可能低，
* 对宿主系统的侵入式修改尽可能少，
* （尤指极端场景下）尽量保证正确性：不使原世界本应成功的操作在兼容下失败，也不使原世界本应失败的操作在兼容下成功。

目前，源自 AOSC 社区的 [`libLoL`](https://liblol.aosc.io) 是完成度最高的解决方案，已为许多新世界发行版所集成。
龙芯方面也表态过会开发兼容方案，但截至 2024 年 1 月，未有任何此方面的公开消息。

## 常见的坑

### 执行一个程序，报「没有那个文件或目录」，咋回事？

如果您执行一个程序却被告知这个程序不存在，类似这样：

```sh-session
$ ./foo
zsh: no such file or directory: ./foo

$ ./foo
zsh: 没有那个文件或目录: ./foo
```

如果这个文件确实存在，那么大概率是您在尝试执行异世界的程序。
不存在的文件并非程序本身，而是所谓「ELF 解释器」，
即上文教你判断一个程序是新世界还是旧世界那里提到的 ELF interpreter。
请换对应您系统的程序版本，或要求软件提供者增加适配。

### 我给龙架构交叉编译的 Go 程序，运行报段错误，咋回事？

可能是由于未使用正确的 Go 工具链，导致不经意间构建了与您预期 ABI 相异的二进制。

* 为旧世界发行版构建，必须搭配使用龙芯提供的 Go 工具链与 goproxy 源（所谓「龙芯源」；见下）。
* 为新世界发行版构建，必须搭配使用上游版本的 Go 工具链，不可使用「龙芯源」。

具体而言，Go 程序在异世界运行时，初始化过程中必须的一次 `rt_sigprocmask`
系统调用会由于它使用的 `NSIG` 常量定义与当前运行内核不同而失败，
此时 Go 会故意访问一个非法地址直接崩溃：
此时从程序视角看，必然成功的系统调用居然失败，这说明内核服务已经不再可靠，继续下去没有意义。

### 龙芯提供了很多镜像源（「龙芯源」），我能用吗？

龙芯确实提供了很多「龙芯源」。**旧世界开发者必须使用（系统可能已默认加载了相应的配置修改），新世界开发者不可使用。**

出于 SEO 以及行侠仗义（天下开发者是一家）的精神，此处破例提供相应的旧世界文档。

|种类|典型地址|备注|
|:--:|--------|----|
|Go|`http://goproxy.loongnix.cn:3000`|[文档](https://docs.loongnix.cn/golang/goproxy.html)|
|PyPI|`https://pypi.loongnix.cn/loongson/pypi`|[文档](https://docs.loongnix.cn/python/python.html)|
|npm|`https://registry.loongnix.cn:4873`|[文档](http://docs.loongnix.cn/nodejs/doc/list/03.%E9%BE%99%E8%8A%AFnpm%E7%9A%84%E5%AE%89%E8%A3%85%E5%92%8C%E4%BB%93%E5%BA%93%E9%85%8D%E7%BD%AE%E4%BD%BF%E7%94%A8.html)|
|NuGet|`https://nuget.loongnix.cn`|[文档](https://docs.loongnix.cn/dotnet/support/list/01.%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98-FAQ.html)|
|Rust<br />(crates.io)|`https://crates.loongnix.cn`|[文档](https://docs.loongnix.cn/rust/)|
|Harbor<br />(容器镜像)|`https://cr.loongnix.cn`|[文档][loongson-cloud-community]|

[loongson-cloud-community]: https://loongson-cloud-community.github.io/Loongson-Cloud-Community

由于旧世界 ABI、API 并未上游，也不会被上游，那些需要关心系统底层 ABI、API 细节的包，
其正式版本——也就是从上游或常规镜像站下到的版本——在旧世界不可能正常工作：要么没适配过龙架构，要么适配的是新世界。
因此为了方便为旧世界适配软件，龙芯搭建了这些源：那些会受影响的包和相应版本，在这些源里被针对旧世界改过了。

这就是为何新世界开发者不可贪图方便使用它们：从这些软件源中下载的有些包，对新世界而言反而是坏的，更何况完整性校验不会通过——龙芯提供魔改代码的行为与「中间人攻击」没有外观上的差别。
换个角度看，这也是旧世界开发者必须开启它们，并且关闭相应的完整性校验的原因。
