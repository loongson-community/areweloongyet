---
slug: this-week-in-loongarch-8
title: 每周一龙：第 8 期
authors: [xen0n]
tags: [每周一龙]
---

每周一都为大家报道 LoongArch&reg; 社区最前线的第一手新鲜资讯！

<!-- truncate -->

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

## 先「马」再看

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch&reg; 领域的重要或长期项目（坑）。

### Linux

一如既往，美西时间周日下午（北京时间 7 月 10 日凌晨）Linus [发布了](https://lwn.net/Articles/937731/)
Linux v6.5-rc1。

:::info 您的测试很重要！
龙架构内核开发者们欢迎您来体验最新内核。
如在使用过程中发现任何问题，请及时反馈：
龙架构的开发者人数不多，无法测到所有软硬件组合。
问题只有反馈了才会得到解决。

可用中文或英语在您加入的龙芯用户群反馈（开发者总会直接或间接看到），
也可用英语在[上游邮件列表](mailto:loongarch@lists.linux.dev)反馈，
或在[内核 Bugzilla](https://bugzilla.kernel.org) 创建 bug。
:::

7 月 5 日，Sui Jingfeng [合并了](https://cgit.freedesktop.org/drm/drm-misc/commit/?id=f39db26c54281da6a785259498ca74b5e470476f)龙芯显示控制器 DRM[^注一] 驱动。
他在前一天[拿到了](https://gitlab.freedesktop.org/freedesktop/freedesktop/-/issues/673)
drm-misc 仓库的合并权限。
（感谢 [zhangn1985](https://github.com/zhangn1985) 的线索投递。）
这意味着集显用户应该能用未来的上游内核亮屏了；2D/3D 渲染加速是另外的工作。

[^注一]: 此 DRM（Linux 的 Direct Rendering Manager 子系统，直接渲染管理器）非彼 DRM（Digital Restriction/Rights Management，数字限制/版权管理）。

7 月 4 日，[FreeFlyingSheep](https://github.com/freeflyingsheep)
[提交了](https://lore.kernel.org/loongarch/cover.1688369658.git.chenfeiyang@loongson.cn/)龙架构内核的覆盖率收集（KCov）适配。

### 工具链

#### LLVM

Ami-zhang 7 月 3 日[合并了](https://reviews.llvm.org/D140690) DFSan 的龙架构适配，
又在 7 月 6 日[合并了](https://reviews.llvm.org/D154405) tā 4 号提交的一行 Profile 适配。

xen0n 7 月 5 日在社区[征询了](https://discourse.llvm.org/t/how-to-best-implement-code-model-overriding-for-certain-values/71816)龙架构 `model` 属性的最佳实现方案，
得到了社区前辈的帮助。
由于此支持大概率将涉及 LLVM IR 级别的变更，影响较为深远，预计将在 LLVM 18 开发周期实现。

## 社区整活<small>儿</small>

本栏目接受任何网友的投稿，只要内容与 LoongArch&reg; 有关，并可以为读者带来价值，
无论严肃贡献（整的大活<small>儿</small>）或是博君一笑都一概欢迎！

* xry111 爆料说 OpenJPEG 上游[出现了 LASX 优化补丁](https://github.com/uclouvain/openjpeg/pull/1458)。
  （该优化 2 月 24 日即被提交，显然太早了：社区群众直到两周前才有可能明白指令含义从而有效审查代码。作者 jinbo 是龙芯员工。）
* xry111 宣布了他维护的[龙架构版 LFS 手册分支](https://www.linuxfromscratch.org/~xry111/lfs/)。

## 张贴栏

本栏目可供张贴公益性质的各种信息。

* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16

### AOSCC 2023：7 月 15 至 16 日，上科大见！

距离今年 AOSCC 还有不到一周，本次聚会的日程繁多，不仅有社区项目相关的展示、讨论和投票，还有许多来自开源业界的代表门将会到场分享经验，回答问题。

详见：活动日程 (https://wiki.aosc.io/zh/community/aoscc/2023/) 。

#### “龙芯与你：你问我答”问题征集

近年来，由 LoongArch 架构驱动的龙芯 5000 系列处理器展现出了相当可观的性能提升，亦在开源社区中收获了不少人气；与此同时，企业与社区的“新旧世界”交替与在上游的碰撞与交流也成为了最近几年 LoongArch 生态参与者们时刻关注的事情。本次 AOSCC 我们有幸邀请到了来自 LoongArch 社区的上游贡献者和龙芯中科的工程师们来一同介绍和解答各位的问题和疑惑。

考虑到日程安排较为紧凑，我们决定提前收集社区提问，请[使用本问卷](https://forms.gle/QgdzPmcXqjwitmQm7)提交您希望得到解答的问题。

#### 与会者登记

由于本次 AOSCC 线下活动在上海科技大学举行，校方安保要求来访者登记个人信息，有意参加线下活动的，请于 7 月 13 日前[填写登记问卷](https://forms.gle/vc8sd3yah7eMNmoP7)。

* 本表格仅由社区代表（白铭骢）和 GeekPie 对接代表（秦斐然）查阅，并交由校方录入。
