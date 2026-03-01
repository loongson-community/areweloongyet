---
sidebar_position: 3
---

# Old World and New World

:::warning Under Construction!
This page is still under construction, and the content may be expanded or modified over time. Feel free to check back often!
:::

:::tip Important Note on Terminology
While the terms "old world" and "new world" are convenient to use, they are often too vague and can lead to people conflating different aspects of the problem. Loongson's "ABI1.0" / "ABI2.0" terms are no better choice because the semantics are equivalent to the former, and arguably the mention of "ABI" is worse, because "object file ABI" is already a thing when it comes to ABI differences.

Therefore, we should adopt a new approach where we clearly distinguish the different aspects of LoongArch ABI differences:

| Aspect | New term in favor of "new world" | New term in favor of "old world" |
|----|----|----|
| Boot protocol | UEFI | BPI |
| Linux UAPI | (the) 5.19 UAPI | (the) "4.19" UAPI[^4.19-uapi] |
| Object file ABI | preferably unqualified, "object file ABI v1", or `EF_LARCH_OBJABI_V1` if necessary | "object file ABI v0"[^objabi-v0] |
| Relocation style | preferably unqualified, "direct-style relocs" if necessary | stack-machine-based relocs |

[^4.19-uapi]: Quote the "4.19" part whenever possible, because the upstream 4.19.x versions of Linux actually do NOT support LoongArch.

[^objabi-v0]: There is no `EF_LARCH_OBJABI_V0`.

Newly written material should prioritize the more precise new terminology. This page, as a historical document, retains the "old world" and "new world" terminology for understanding.
:::

:::info Do I need to care about this?
In short, if you don't compile and install software yourself, you probably don't need to worry about it.
Of course, casually browsing through this article might help you understand these terms in the future, or you can guide others who encounter issues.

* If you are currently using Loongnix, Kylin, or UOS on a LoongArch computer, there will definitely be a full system upgrade in a few months or a year or two.
    * If you don't upgrade, then external changes won't affect you.
    * If you do upgrade, you shouldn't notice any difference in usage, which essentially means "migrating to the new world."
* If you are currently using Arch, Gentoo, etc., on a LoongArch computer, you are already a resident of the new world, and this doesn't concern you.

The only situations where you might encounter issues are:

* You are using Loongnix, Kylin, or UOS but have compiled some software yourself.
  After the future full system upgrade, your self-compiled software may no longer work and will need to be recompiled or installed from the system package manager.
* You are a developer adapting or developing software for LoongArch.
  If you have come to this page, you are likely already encountering issues, so read on!
:::

As of early 2024, there are two incompatible software ecosystems for LoongArch, commonly referred to as the "old world" and the "new world." Loongson's materials also mention "ABI1.0" and "ABI2.0" (currently, all references do not include a space between "ABI" and the number).

**The old world** refers to the initial LoongArch software ecosystem adapted internally by Loongson Technology and released alongside the public unveiling of LoongArch.
**The new world** refers to the completely open-source LoongArch software ecosystem developed collaboratively by Loongson Technology and community colleagues, following typical open-source community collaboration models.

The emergence of the two worlds is a consequence of Loongson Technology's commercial strategy of secretly developing and suddenly launching the entire LoongArch ecosystem. This approach led to some unavoidable incompatible changes, resulting in challenges for both customers and the company itself. According to current trends and some public information, the old world will gradually phase out. Starting with the Loongson 3A6000 generation, the accompanying firmware of related products has been compatible with both the old and new worlds. However, as of early February 2024, it may take longer for distributions (such as Loongnix and other commercial distributions) to complete the migration, and thus they have not yet caught up with the official release of the 3A6000.

When discussing Loongson topics, the terms "old world" and "new world" are used solely to distinguish between the two incompatible LoongArch ecosystems. Loongson's MIPS models are neither part of the old world nor the new world. They are generally referred to as "the MIPS-era Loongson."

The terms "旧世界" and "新世界" are translated into English as "the old world" and "the new world," respectively. When used as adjectives, they are generally hyphenated as "old-world" and "new-world." If used frequently in a passage, the abbreviations "OW" and "NW" may also be used.

## Which World Am I In?

If any of the following conditions apply, you are using the **old world**:

* The system is one of Kylin, Loongnix, or UOS.
* The kernel version starts with 4.19.
* You use WPS but have not installed `libLoL` or other old-world compatibility solutions.

If none of these conditions apply, you are using the **new world**.

This method of determination is based on known information as of February 2024. It may become inaccurate if not updated in time.

## Which World Does This Software Belong To?

You can use the `file` tool to easily check which world a binary program belongs to. Suppose you want to check the file `someprogram`, execute `file someprogram`. If the output line contains these words:

```
interpreter /lib64/ld.so.1, for GNU/Linux 4.15.0
```

it indicates that this is an old-world program.

Conversely, if the output line contains these words:

```
interpreter /lib64/ld-linux-loongarch-lp64d.so.1, for GNU/Linux 5.19.0
```

it indicates that this is a new-world program.

The above judgments apply to dynamically linked programs with glibc as the system libc. If the program is statically linked, there will be no interpreter information; if the program is written in Go or uses musl as the C library, there will be no `for GNU/Linux` marker in the file. In such cases, try running it—programs from the "other world" are unlikely to start normally.

Of course, if your output looks like one of the following lines:

```
someprogram: Python script, Unicode text, UTF-8 text executable
someprogram: Bourne-Again shell script, ASCII text executable, with escape sequences
```

this indicates that the program you are checking is a script. Generally, script language programs do not care about the old or new world, but they may still rely on some binary components to work correctly. Therefore, the most reliable method is to try running it!

## Why Call It "The Old World" and "The New World"?

In other fields within the Chinese-speaking community, there are terms like "old-world/new-world monkeys" and "old-world/new-world wines," where "world" means "continent." The new world of LoongArch emerged later than the old world, and there are differences in how they operate, though they do interact.

In technology, the terms "the old world" and "the new world" have appeared before. For example, the retro-computing community distinguishes "old-world" Macintosh models containing a ROM chip for the Macintosh Toolbox firmware from "new-world" Macintosh models that do not include this chip. Thus, old-world/new-world Macs entered the lexicon.

On the other hand, users of Linux source-based distributions (such as Gentoo) often use expressions like “rebuild world.” Here, “world” refers to all packages in the system, analogous to userland. For Gentoo users, it also happens to represent the “@world” set. Meanwhile, the distinction between the old-world (OW) and the new-world (NW) LoongArch largely stems from small differences in the kernel-level system call interface, which cause incompatibilities among user-space programs.

## Where Do the Two Worlds Differ?

**Open-source availability.** The new world is fully open source. Parts of the old-world core remain closed for IP reasons, though some were later released. For example, old-world binutils and gcc sources came out months after initial release, Linux sources appeared in 2023, but the GSGPU shader compiler is still closed. Those that were released typically lack detailed Git histories, making upstream work difficult.

**Available distributions.** Old-world distributions are only produced by a few commercial companies because the full source code is not publicly available. All community distributions belong to the new world.

Known old-world (ports) distributions (alphabetical):
* 麒麟 (Kylin)
* Loongnix
* UOS

Known new-world (ports) distributions (alphabetical):
* [ALT Linux](https://www.altlinux.org/Ports/loongarch64)
* [AOSC OS](https://aosc.io/zh-cn)
* [CLFS Manual & Builds](https://github.com/sunhaiyong1978/CLFS-for-LoongArch)
* [Debian](https://wiki.debian.org/Ports/loong64)
* [Fedora LoongArch Remix](https://github.com/fedora-remix-loongarch/releases-info)
* [Gentoo](https://wiki.gentoo.org/wiki/Project:LoongArch)
* [Loong Arch Linux](https://github.com/loongarchlinux)
* [Slackware](https://github.com/shipujin/slackware-loongarch64)
* [Yongbao](https://github.com/sunhaiyong1978/Yongbao)

:::warning

Some new-world distributions are built by Loongson staff. Compared to purely community-driven releases, they may include:

* Code that has not yet been officially merged upstream (for example, kernel-level binary translation support).
* Content with unclear licensing (for example, LATX has no license agreement, defaults to all rights reserved, cannot be integrated, distributed, etc. by subjects other than Loongson)
* Non-open-source components (for example, packages like libffi, LibreOffice, and Chromium appeared early in CLFS and Loong Arch Linux, even before the earliest open-source patches made it upstream. Some are still not fully upstreamed. In the most extreme scenario, around early 2021, the LoongArch toolchain, kernel source, and QEMU changes were not yet open-sourced, hardware was barely available, and CLFS had already been released.)

However, as time passes and more content moves upstream or matures, this situation will become less and less common until it disappears.

:::

**Software Versions Differ**. The base system of the old world generally follows the major Debian or RHEL version that was originally used for its porting. Because commercial companies may not prioritize (or have the capability) to track newer releases, old-world base system versions rarely receive major updates. Depending on your user scenarios and development or deployment habits, this can sometimes be beneficial and sometimes frustrating.

Below is a comparison of some commonly used software and development tools in the two worlds:

|Software|Old-world Version|New-world Version|
|----|----------|----------|
|Linux|4.19|&ge; 5.19, commonly &ge; 6.1|
|binutils|2.31|&ge; 2.38, commonly &ge; 2.40|
|gcc|8.3|&ge; 12.1, commonly &ge; 13.1|
|glibc|2.28|&ge; 2.36|
|LLVM|8|&ge; 16|
|Node.js|14.16.1|&ge; 18|
|Go|1.15、1.18、1.19|&ge; 1.19|
|Rust|1.41、1.58|&ge; 1.71|

## How to Achieve Compatibility Between the Two Worlds?

Because the differences between the old world and the new world (OW/NW) are not trivial, achieving perfect compatibility is quite difficult. One single solution cannot fulfill all of the following goals at once; trade-offs are inevitable:

* Keep disk usage as small as possible.
* Minimize performance overhead.
* Minimize intrusive changes to the host system.
* Especially in extreme cases, maintain correctness: do not break operations that would succeed in the original world, nor force operations to succeed that should fail.

Currently, the AOSC community’s [`libLoL`](https://liblol.aosc.io) is the most mature solution, already integrated by many new-world distributions. Loongson has also mentioned plans for a compatibility solution but has provided no public updates as of January 2024.

## Common Pitfalls

### Running a program returns “No such file or directory.” What’s going on?

If you run a program and are told it doesn’t exist, for example:

```sh-session
$ ./foo
zsh: no such file or directory: ./foo

$ ./foo
zsh: 没有那个文件或目录: ./foo
```

If this file truly exists, you are most likely trying to run a program from the alien world world. The missing file is not the program itself but the so-called "ELF interpreter", as mentioned above when determining whether a program belongs to the old world or the new world. Please use a version of the program suited to your system, or ask the software provider for an adapted version.

### I cross-compiled a Go program for LoongArch and got a segmentation fault. What happened?

It might be caused by using the wrong Go toolchain, which inadvertently built a binary for a different ABI than intended.

* For an old-world distribution, Loongson’s Go toolchain and the goproxy source (the "Loongson sources"; see below) must be used.  
* For a new-world distribution, an upstream Go toolchain must be used; never use the "Loongson sources".

In detail, when a Go program runs in the other world, a crucial initialization step makes an `rt_sigprocmask` system call. This call fails because the `NSIG` constant in the Go toolchain differs from what the kernel expects, causing Go to deliberately access an illegal address and crash right away. From the program’s perspective, a supposedly guaranteed system call has failed, indicating that kernel services are no longer reliable.

### Loongson provides many mirrors (“Loongson sources”). Can I use them?

Loongson indeed offers many “Loongson sources.” Old-world developers must use them (the system may already have the associated configuration changes), but new-world developers must not.

As a rare exception for SEO and the spirit of helping each other (all developers are family), here are the relevant old-world documents.

|Type|Typical Address|Notes|
|:--:|--------|----|
|Go|`http://goproxy.loongnix.cn:3000`|[Documentation](https://docs.loongnix.cn/golang/goproxy.html)|
|PyPI|`https://pypi.loongnix.cn/loongson/pypi`|[Documentation](https://docs.loongnix.cn/python/python.html)|
|npm|`https://registry.loongnix.cn:4873`|[Documentation](http://docs.loongnix.cn/nodejs/doc/list/03.%E9%BE%99%E8%8A%AFnpm%E7%9A%84%E5%AE%89%E8%A3%85%E5%92%8C%E4%BB%93%E5%BA%93%E9%85%8D%E7%BD%AE%E4%BD%BF%E7%94%A8.html)|
|NuGet|`https://nuget.loongnix.cn`|[Documentation](https://docs.loongnix.cn/dotnet/support/list/01.%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98-FAQ.html)|
|Rust<br />(crates.io)|`https://crates.loongnix.cn`|[Documentation](https://docs.loongnix.cn/rust/)|
|Harbor<br />(Container Images)|`https://cr.loongnix.cn`|[Documentation][loongson-cloud-community]|

[loongson-cloud-community]: https://loongson-cloud-community.github.io/Loongson-Cloud-Community

Since the old world ABI and API are not upstream and will not be upstream, packages that need to care about system-level ABI and API details cannot work properly in the old world with their official versions—those downloaded from upstream or regular mirrors. They either have not been adapted for LoongArch or have been adapted for the new world. Therefore, to facilitate software adaptation for the old world, Loongson has set up these sources: packages and their respective versions that would be affected have been modified for the old world in these sources.

This is why new world developers should not use them for convenience: some packages downloaded from these sources are actually harmful to the new world, and integrity checks will fail—Loongson's behavior of providing modified code is indistinguishable from a "man-in-the-middle attack." Conversely, this is also why old world developers must enable them and disable the corresponding integrity checks.
