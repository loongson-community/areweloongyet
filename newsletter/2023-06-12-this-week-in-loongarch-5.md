---
slug: this-week-in-loongarch-5
title: 每周一龙：第 5 期
authors: [xen0n]
date: 2023-06-12T14:42:22+08:00
tags: [每周一龙]
---

每周一都为大家报道 LoongArch&reg; 社区最前线的第一手新鲜资讯！

<!-- truncate -->

如无特别说明，文中提及的日期、时间都为北京时间（UTC+8）。

## 要闻速递

6 月 5 日，GitHub loongson 组织下出现了新的可协作的文档库：[la-abi-specs](https://github.com/loongson/la-abi-specs)。
这可被视为龙芯公司在 [LoongArch-Documentation 库](https://github.com/loongson/LoongArch-Documentation)被归档之后给出的解决方案。

注意：此文档库的许可证仍然为 CC-BY-NC-ND 4.0，并且添加了必须签署贡献者许可协议（CLA）才能参与贡献的提示。
目前 CLA 相关事宜仍然只能通过询问相关人员了解；笔者了解到的情况是：

* CLA 已经定稿，不日将于龙芯官网或其他渠道公开。
* 后续会提供网页等自动化的签署、校验方式。
* 该 CLA 与 Google CLA 类似，但添加了更多限制性条款，请贡献者们注意。

:::warning
笔者不是律师，以下的分析不是法律建议。请待龙芯 CLA 文本正式公布之后自行阅读、判断。
:::

与 Google CLA 相比，具体的不同之处包括但不限于：

* 新增了**其他知识产权权利授予条款**。

  在 Google CLA 第 3 条与第 4 条之间，添加了关于「其他知识产权权利」如商标权、技术秘密、专有技术等的权利许可授予条款。

* 新增了**溯及既往条款**。

  只要签署该 CLA，权利许可将自「您」首次向龙芯中科提交贡献之日起生效，并非从签署时刻起。

  :::info
  FSF copyright assignment 等有类似安排的协议一般也会提供不溯及既往的协议文本版本。
  :::

* 新增了**约定管辖条款**。

  约定使用中华人民共和国法律。
  但进一步约定了「任何由本协议产生的法律诉讼或程序均应排他性地提交至龙芯中科所在地的法院进行审理」。

  :::info
  如不约定管辖，一场民事纠纷默认应由被告所在地法院管辖。
  这是为了提高原告诉讼成本，以使其不滥用诉权（否则，一个未作准备的被告要么将不得不奔波至原告所在地应诉，要么承担不应诉的不利后果；等于存在起诉者「折腾」他者的可能性）。
  按照当前措辞，此上层设计失效。
  :::

* 新增了**多语言版本条款**。

  该 CLA 提供了中英文两种版本，并约定了如有意思冲突，则以中文版为准。

* 与 Google CLA 第 4 条相比，关于当「您」是法人时的承诺措辞有调整。

## 先「马」再看

本栏目的内容具有一定延续性，将持续追踪报道 LoongArch&reg; 领域的重要或长期项目（坑）。

### ClangBuiltLinux

[上游的跟踪 issue](https://github.com/ClangBuiltLinux/linux/issues/1787)
也会及时反映最新动态。

heiher 加入了折腾的行列，目前已经在一定的配置下糊出了一版能够工作的内核。
众人拾柴火焰高！他在折腾过程中发现：

* LLVM 不应该把那些没有数据依赖的 CSR、IOCSR 操作优化掉。

### Linux

6 月 7 日，上游声音子系统维护者 Takashi Iwai [合并了](https://lore.kernel.org/loongarch/87mt1b1rif.wl-tiwai@suse.de/) Yanteng Si 前一阵贴出的 LS7A 集成声卡支持补丁。

6 月 5 日，Yingkun Meng [贴出了](https://lore.kernel.org/loongarch/20230605120934.2306548-1-mengyingkun@loongson.cn/)龙芯 2K 系列、LS7A 的 I2S 控制器支持。这也是一种「集成声卡」硬件。

### 工具链

#### GCC

chenglulu 在优化 perlbench 跑分过程中，发现了 [PR 110136](https://gcc.gnu.org/bugzilla/show_bug.cgi?id=110136)
这样一个严重影响性能的情况，
遂[提交了](https://gcc.gnu.org/pipermail/gcc-patches/2023-June/621006.html)相应的修复补丁。

:::info
所有 `jr $ra` 都被视为过程调用返回。
因此如果一般的间接跳转不幸使用了`$ra` 存放目标地址，
那么过程调用返回和间接跳转的分支预测都会被破坏。
:::

#### LLVM

一周间合并了以下的功能改进等：

* [默认可生成非对齐访存](https://reviews.llvm.org/D149946)。这是由于 2K1000LA 等不支持硬件非对齐访存的型号几乎不见于通用场景，且后续会越来越少（2K2000、2K3000 这种预期会大批量出货的 LA364 型号已被证实支持）。有需要适配 LA264、LA132 等型号的开发者，需自行调整编译参数以禁用此行为。
* [添加 LAELF v20230519 的新重定位类型定义](https://reviews.llvm.org/D152184)。

出现了以下的新动向：

* [LLD LoongArch port](https://reviews.llvm.org/D138135) 的代码审查有了进展，正在改代码。
* xen0n 为 `RelocationResolver` [适配](https://reviews.llvm.org/D152344) LAELF v20230519 的新重定位类型。

#### Rust

自[添加裸机 LoongArch 支持](https://github.com/rust-lang/compiler-team/issues/628)的<ruby>重大变更提案<rt>Major Change Proposal</rt></ruby>于 6 月 6 日最终通过后，
heiher 旋即[推进了](https://github.com/rust-lang/rust/pull/112310)实现。

以下 `no_std` targets 自 6 月 8 日的 nightly 起，已经可以使用，将出现于 1.72.0 版本：

* `loongarch64-unknown-none`，LA64 LP64D（双精度硬浮点）裸机
* `loongarch64-unknown-none-softfloat`，LA64 LP64S（软浮点）裸机

## 社区整活<small>儿</small>

本栏目接受任何网友的投稿，只要内容与 LoongArch&reg; 有关，并可以为读者带来价值，
无论严肃贡献（整的大活<small>儿</small>）或是博君一笑都一概欢迎！

YANG Xudong [优化了](https://www.postgresql.org/message-id/flat/b522a0c5-e3b2-99cc-6387-58134fb88cbe%40ymatrix.cn)
PostgreSQL 在 LoongArch 上的 CRC 计算，
并将补丁[提交到了](https://commitfest.postgresql.org/43/4353/)
PostgreSQL Commitfest 2023-07。
目前向社区和周刊读者们寻求 review。

## 张贴栏

本栏目目前可供张贴公益性质的各种信息。

* 本周报[持续接受网友投稿][call-for-submissions]。欢迎来上游坐坐！

[lauosc-debian]: https://bbs.loongarch.org/d/167-lauosc-debian-12-ports
[call-for-submissions]: https://github.com/loongson-community/areweloongyet/issues/16
