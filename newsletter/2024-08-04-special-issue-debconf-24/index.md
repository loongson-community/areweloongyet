---
slug: special-issue-debconf-24
title: 每两月一龙・号外：DebConf 24 特刊
authors: [xen0n]
date: 2024-08-04T18:30:00+09:00
tags: [每周一龙, 特刊]
---

号外：2024 年 7 月 27 日至 8 月 3 日，Debian 社区的年度盛会
DebConf 24 在韩国釜山国立釜庆大学大渊校区成功举办了。本期特刊将带您回顾
DebConf 24 期间发生的与 LoongArch 生态相关的新闻动态。

<!-- truncate -->

如无特别说明，文中提及的日期、时间都为 DebConf 24 举办地釜山的当地时间（UTC+9）。

## 概况

[![DebConf24 与会者合照](./debconf24_group@1200px.webp)](./debconf24_group.jpg)

按照 DebConf 24 闭幕式幻灯片的统计数字，共有 339 位与会者实际参会，其中
19 位来自中国大陆。您可在
[DebConf 官网的统计数字页面][debconf-stats]查阅更多详细信息。

[debconf-stats]: https://debconf24.debconf.org/register/statistics/

LoongArch 的相关人士中，笔者以 Gentoo 开发者、LoongArch 生态的第三方利益无关贡献者、Debian
loong64 port 的协助者身份参加了 DebConf 正式议程。任职于龙芯公司系统研发部，负责
Debian loong64 port 上游工作的张丹丹同学也以公司身份参会。

在 DebConf 会场我们总共展示了 2 台 LoongArch 设备：

* 3A5000M + 7A2000 笔记本：此设备直接来自龙芯北京的研发部门。
* 2K2000 盒子：此机器是在 2023 年 11 月 28 日的 3A6000 发布会上亮相的新设备之一。

目前它们都已平安回到相应管理者的手中。

## 议程

7 月 30 日 10:30，张丹丹在釜庆大学未来馆 2 楼 Somin 大堂[分享了](https://debconf24.debconf.org/talks/159-expression-of-thanks-and-brief-introduction-the-status-of-loong64-port/)
Debian `loong64` 移植的现状，并向社区力量表达了感谢。现场有各国观众十数人。这场分享也是张丹丹同学在国际技术会议讲台的首秀。

8 月 1 日 17:00，xen0n 在釜庆大学未来馆 2 楼 CEO 教室[主持了](https://salsa.debian.org/debconf-team/public/data/dc24/-/blob/main/etherpad/txt/161-loong64-port-bof.txt)关于
`loong64` 移植的[专题讨论](https://debconf24.debconf.org/talks/161-loong64-port-bof/)（Birds-of-a-Feather，BoF）。现场也有各国观众十数人。

两场活动均没有官方直播或录像，我们也并未收集与会者的详细信息。这是有意为之：考虑到龙芯中科自
2023 年 3 月以来便[处于](https://www.federalregister.gov/d/2023-04558/p-15)美国商务部《出口管理条例》实体清单（EAR
Entity List）中这一事实，能被确认参与了龙芯相关议程的友善个体将可能面临外部风险。不留存相关信息，即是保护这部分与会者。

## 笔者评论

Debian 是 Linux 发行版生态中，最为重要的社区力量之一。由于其 ABI 相对稳定、部署简便、熟练用户与打包者众，Debian
与其衍生发行版 Ubuntu 于是成为了国内外大量软件企业为 Linux 开发时所采用的事实运行环境标准与版本基线。而
LoongArch 作为基础软件领域的后来者，生态参与者们对稳定基线的需求，则使得人们与 Debian 一拍即合。


