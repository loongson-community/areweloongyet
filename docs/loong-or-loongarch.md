---
sidebar_position: 2
---

# 如何称呼龙架构？

## 一种指导原则

在自然语言中：

* 中文名：首选「龙架构」，可选「龙芯架构」
* In English: LoongArch (short of “Loong(son) Architecture”)

需要提及位数时：

* 中文：「32/64 位龙架构」
* In English: “32/64-bit LoongArch” or “LoongArch32/64”

对于软件中不直接对最终用户可见的标识符：

* 如果必须或者最好是个短名字：`loong`
* 如果项目将 `x86_64` 叫作 `amd64` 和/或 将 `aarch64` 叫作 `arm64`: `loong`
* 如果优先考虑对齐 GNU target tuple / Debian multiarch tuple: `loongarch`
* 否则：试一试 `loongarch` 好不好看、好不好听。不行再 `loong`

以上都可按需添加 `32` `64` 等字样，如果具体使用时有需要区分位数的话。

## 关于自然语言中的使用

最早并没有「龙架构」这个名字。LoongArch 最早被与中文名称相关联，是在 2021 年
4 月 30 日《龙芯架构参考手册》首次发布时：直到此时 LoongArch 才与「龙芯架构」一词并列，
但使用「龙芯架构」的场合仍然很少。
不过从龙芯中科微信公众号 2022 年 4 月 13 日首次使用「龙架构」一词开始，至今（2023 年初）
人们在中文语境下基本都将 LoongArch 称作「龙架构」了。

龙芯中科将「LoongArch」、「龙芯架构」、「龙架构」三种写法在中国注册了商标，
使用时可加注意。

## 关于 `loong` 与 `loongarch` 两种叫法（长短名的争端）

由于注册了商标的写法是 `LoongArch` 与 `LoongArch64`，在龙芯中科对社区项目做的最早一批适配贡献中，
这个架构的名字都叫 `loongarch`、`LOONGARCH` 或这个名字再加上后缀 `64`。
但 `loongarch64` 的全称与常见的其他架构如 `x86_64`、`aarch64`、`riscv64` 相比
显得有些长了，加之在 `ARCH=loongarch` 等情况下会显得更加冗余
（这与中文母语者的语感不太相同：「架构是龙架构」六个字，在本条目作者采访到的许多人看来并不显得特别冗余），
因此一些社区选择在讨论之后采用较短的名字 `loong` 或 `loong64` 称呼龙架构。
这与许多社区将 `aarch64` 叫作 `arm64` 有异曲同工之妙。

:::info 为何不叫 `la64`？

因为曾经有个架构叫 `ia64`，虽然它已式微，但仍然存在于许多人的记忆。
人们在使用拉丁字母时一般会避免出现两个名字只有一处 `i/l/1`、`O/0` 不同
从而容易混淆的情况，即便当代的编程字体已经充分考虑了这一点使这些字符看上去有区分度。
（并非所有时候都有得编程字体用。）
因此对于「架构名」这种可能会被以小写形式使用的场合，`LA64/la64` 就不合适了。

「先来后到」在此处并不牵扯歧视。
因为如果龙架构在先、安腾架构在后，大家也会以同样理由拒绝 `ia64` 这个名字，
这条世界线的人们大概就会称呼安腾架构 `intel64` 或者 `itanium` 了。

:::

:::info 为何不叫 `larch`？

除 LoongArch 外，龙芯中科实际在更早之前还注册了 LArch 这一中国商标。
（疑似仿照 `AArch`？）
在 GNU 工具链「三大件」的移植中，相关团队也大量使用 `LARCH` 字样称呼龙架构。
但该用法一直未见于其他场合甚至龙芯中科其他团队的工作中[^1]。

鉴于 2022 年以来 `loongarch` 与 `loong` 的称呼已经被多数项目采用，目前已经没有机会复活
`larch` 这个名字而不增加用户记忆负担了。

:::

[^1]: 最早的 LoongArch Go 移植其实使用了 `GOARCH=larch64`，
但在它首次被开源前便被替换为 `GOARCH=loongarch64` 了。
后来再根据上游建议与社区意见改为 `GOARCH=loong64` 都是后话了。

不巧的是，这些公开讨论的部分内容被个别围观群众理解为了「‘社区’向龙芯中科找茬」。
这些人不认为 `loongarch` 冗长[^2]，并且客观上 GNU target triples 等处也已经使用了长名称
（最初的 `config.guess` `config.sub` 龙架构适配是由龙芯员工提交，使用了长名称），
因此 ta 们认为允许 `loong` 的写法反而是增加了记忆负担。
龙芯中科从未在官方维护的文档资料中说明 `loong` 是可选的称呼之一，某种程度上也加重了社区误解。

[^2]: 即便比方说项目中已有的架构标识符都不超过 6 个字母，但在此种思维模式下，
会认为 `loongarch` 是唯一可行的名称。凭什么不是别人来习惯龙芯做法？

尽管实际上在软件源码和开发者交流中使用商标与否都不会影响该架构的营销推广，
但考虑到这些主客观因素，在开头的指导原则中，本文作者仍在「维持龙芯中科注册商标完整」
与尊重各项目现有实践之间尝试做了平衡。

## 龙架构在一些社区项目中的名称

Linux 发行版一般都使用一个较短的架构标识符，因此基本都将龙架构叫作 `loong`
或者带位数后缀。

|发行版|架构标识符|
|------|----------|
|Alpine Linux|`loongarch64`|
|AOSC OS|`loongarch64`|
|Debian|<ul><li>旧世界：`loongarch64`</li><li>新世界：`loong64`</li></ul>|
|Deepin|`loongarch64`|
|Gentoo|`loong`|
|Loong Arch Linux|`loong64`|
|OpenWrt|`loongarch64`|
|RPM 系|`loongarch64`|
|Slackware|`loong64`|

:::info AOSC OS 是新世界发行版，为何也沿用 `loongarch64` 的称呼？
根据维护者自行说明，主要有两方面原因：

* 维护者有意遵循了龙芯公司官方叫法；
* AOSC OS 开始 LoongArch 工作时，已有 `loongson2f` 与 `loongson3` 两个架构名了，怕 `loong64` 使用户觉得不明所以。
:::

:::info 为何 RPM 系发行版也沿用 `loongarch64` 的称呼？
[RPM 的 LoongArch 支持][rpm-loongarch64]在 2022 年初即被提交上游了。
彼时龙芯员工不了解社区已有此话题的讨论，社区贡献者也未感知到龙芯的活动；
并且 RPM 内也将 AArch64 称作 `aarch64`，因此 `loongarch64` 的称呼在 RPM 范畴内自洽，
RPM 上游遂迅速合并了。
因此时至今日 RPM 系的发行版都保留了这个目前看来像是旧世界的叫法。
:::

[rpm-loongarch64]: https://github.com/rpm-software-management/rpm/commit/7a014dae736f9c7a7c75f63deaa4dbbb9ae0249c

以上信息也适用各发行版的相关衍生项目，如果相应项目也跟进了龙架构适配的话。

其他软件中龙架构的名字有时需要一些记忆。

|项目|称呼|
|----|----|
|C#|[`LoongArch64`](https://learn.microsoft.com/zh-cn/dotnet/api/system.runtime.interopservices.architecture?view=net-8.0)|
|Go|`GOARCH=loong64`|
|Rust|`loongarch64-unknown-linux-gnu`|
|Zig|`loongarch64-linux`|

该表格没有也不能穷尽所有软件项目。
如果您有补充，您可在页面底部找到「编辑此页」的链接（指向上游仓库中本页的源文件）。
