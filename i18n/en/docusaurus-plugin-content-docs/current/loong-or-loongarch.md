---
sidebar_position: 2
---

# How to Refer to 龙架构?

## A Guiding Principle

In natural language:

* In Chinese: Prefer "龙架构", optional "龙芯架构"
* In English: LoongArch (short for "Loong(son) Architecture")

When mentioning bitness:

* In Chinese: "32/64 位龙架构"
* In English: "32/64-bit LoongArch" or "LoongArch32/64"

For identifiers in software not directly visible to end users:

* If a short name is necessary or preferable: `loong`
* If the project calls `x86_64` as `amd64` and/or `aarch64` as `arm64`: `loong`
* If aligning with GNU target tuple / Debian multiarch tuple is prioritized: `loongarch`
* Otherwise: try `loongarch` to see if it looks and sounds good. If not, then `loong`

You can add `32` `64` etc. as needed if bitness distinction is required in specific usage.

## About Usage in Natural Language

Initially, there was no name "龙架构". LoongArch was first associated with the Chinese name on April 30, 2021, when the "LoongArch Reference Manual" was first released: until then, LoongArch was paralleled with the term "龙芯架构", but the occasions of using "龙芯架构" were still rare. However, since Loongson's WeChat public account first used the term "龙架构" on April 13, 2022, people have generally referred to LoongArch as "龙架构" in Chinese contexts up to now (early 2023).

Loongson has registered the trademarks "LoongArch", "龙芯架构", and "龙架构" in China, so please pay attention when using them.

## About `loong` and `loongarch` (Short and Long Name Dispute)

Since the registered trademarks are `LoongArch` and `LoongArch64`, in the earliest batch of adaptation contributions Loongson made to community projects, the architecture was named `loongarch`, `LOONGARCH`, or this name with the suffix `64`. However, the full name `loongarch64` seems a bit long compared to common other architectures like `x86_64`, `aarch64`, `riscv64`, and in cases like `ARCH=loongarch`, it appears even more redundant (which is different from the sense of redundancy in the Chinese language: "架构是龙架构" six characters, in the view of many people interviewed by the author of this entry, does not seem particularly redundant). Therefore, some communities chose to adopt the shorter names `loong` or `loong64` after discussion. This is similar to how many communities call `aarch64` as `arm64`.

:::info Why not call it `la64`?

Because there was once an architecture called `ia64`, although it has declined, it still exists in many people's memories. People generally avoid using names that differ only by one `i/l/1`, `O/0` when using Latin letters to avoid confusion, even though contemporary programming fonts have fully considered this to make these characters look distinguishable. (Not all times have programming fonts available.) Therefore, for occasions where the "architecture name" might be used in lowercase, `LA64/la64` is not suitable.

"First come, first served" does not involve discrimination here. Because if LoongArch came first and Itanium architecture came later, people would reject the name `ia64` for the same reason, and people in that world line would probably call Itanium architecture `intel64` or `itanium`.

:::

:::info Why not call it `larch`?

Besides LoongArch, Loongson actually registered the Chinese trademark LArch earlier. (Suspected to imitate `AArch`?) In the porting of the "three major pieces" of the GNU toolchain, the related team also used the term `LARCH` extensively to refer to LoongArch. But this usage has never been seen in other occasions or even in the work of other teams of Loongson[^1].

Given that since 2022, the terms `loongarch` and `loong` have been adopted by most projects, there is no chance to revive the name `larch` without increasing the user's memory burden.

:::

[^1]: The earliest LoongArch Go port actually used `GOARCH=larch64`, but it was replaced with `GOARCH=loongarch64` before it was first open-sourced. Later, it was changed to `GOARCH=loong64` based on upstream suggestions and community opinions.

Unfortunately, some parts of these public discussions were misunderstood by some onlookers as "the 'community' picking on Loongson". These people do not consider `loongarch` to be lengthy[^2], and objectively, the long name has already been used in places like GNU target triples (the initial `config.guess` `config.sub` 龙架构 adaptation was submitted by Loongson's employees, using the long name), so they believe that allowing the use of `loong` actually increases the memory burden. Loongson has never stated in officially maintained documentation that `loong` is an optional name, which to some extent exacerbated the community's misunderstanding.

[^2]: Even if, for example, the existing architecture identifiers in the project do not exceed 6 letters, in this mode of thinking, `loongarch` is considered the only feasible name. Why should others adapt to Loongson's practice?

Although in practice, using or not using trademarks in software source code and developer communication does not affect the marketing promotion of the architecture, considering these subjective and objective factors, the author of this article still tried to balance "maintaining the integrity of Loongson's registered trademarks" and respecting the existing practices of various projects in the guiding principles at the beginning.

## Names of LoongArch in Some Community Projects

Linux distributions generally use a shorter architecture identifier, so they mostly call LoongArch `loong` or with a bitness suffix.

|Distribution|Architecture Identifier|
|------------|------------------------|
|AOSC OS|`loongarch64`|
|Debian|<ul><li>Old World: `loongarch64`</li><li>New World: `loong64`</li></ul>|
|Gentoo|`loong`|
|Loong Arch Linux|`loong64`|
|RPM-based|`loongarch64`|
|Slackware|`loong64`|

:::info Why does AOSC OS, a New World distribution, also use the term `loongarch64`?
According to the maintainer's own explanation, there are two main reasons:

* The maintainer intentionally followed the official naming of Loogson;
* When AOSC OS started LoongArch work, there were already two architecture names `loongson2f` and `loongson3`, fearing that `loong64` would confuse users.
:::

:::info Why do RPM-based distributions also use the term `loongarch64`?
[RPM's LoongArch support][rpm-loongarch64] was submitted upstream in early 2022. At that time, Loongson's employees were unaware of the community's discussion on this topic, and community contributors were also unaware of Loongson's activities; and RPM also calls AArch64 as `aarch64`, so the term `loongarch64` is self-consistent within the RPM scope, and RPM upstream quickly merged it. Therefore, to this day, RPM-based distributions retain this name, which now seems like an Old World term.
:::

[rpm-loongarch64]: https://github.com/rpm-software-management/rpm/commit/7a014dae736f9c7a7c75f63deaa4dbbb9ae0249c

The above information also applies to related derivative projects of each distribution if the corresponding projects have also followed up with LoongArch adaptation.

The name of LoongArch in other software sometimes requires some memory.

|Project|Name|
|-------|----|
|C#|[`LoongArch64`](https://learn.microsoft.com/en-us/dotnet/api/system.runtime.interopservices.architecture?view=net-8.0)|
|Go|`GOARCH=loong64`|
|Rust|`loongarch64-unknown-linux-gnu`|

This table does not and cannot exhaust all software projects. If you have any additions, you can find the "Edit this page" link at the bottom of the page (pointing to the source file of this page in the upstream repository).
