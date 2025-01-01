---
sidebar_position: 5
---

# Baseline Reference of Infra Component Versions

:::info Frequently Updated!
This is a living document, and its content will change as conditions evolve. Check back often!
:::

As LoongArch gains wider upstream support in various open-source projects and sees regular releases, the sheer variety of fundamental software versions inevitably multiplies. To reduce the integration burden and avoid repeated pitfalls, here are our recommended baseline combinations. Some are time-tested for stability; others represent the cutting edge of feature development and will soon become the next wave of stable baselines.

We currently name each baseline in a “year + quarter” format because it helps developers associate version numbers with the relevant context (and sometimes painful memories).

This document was last updated on May 12, 2024. The recommended stable baseline is 2023Q1, and the testing baseline is 2024Q2. The current leading-edge baseline is expected to stabilize by late 2024 and be designated as 2024Q4 or 2025Q1. If you plan to adopt the 2024Q2 baseline, we strongly suggest also including the leading-edge baseline in your evaluation.

## Bleeding Edge {#bleeding-edge}

|Binutils|GCC|Linux|glibc|LLVM|Rust|Go |
|:------:|:-:|:---:|:---:|:--:|:--:|:-:|
|2.43 :wrench:|15.x :wrench:|6.12 LTS|2.4x :wrench:|19 :wrench:|1.8x.x|1.23.x :wrench:|

:wrench: This symbol indicates that the related content is still under development.

This baseline reflects real-time progress; some software versions are still unreleased, so their numbers may change. Many new features are under refinement, which may lead to unexpected compilation or linking errors and runtime behaviors. Developers and capable users are encouraged to test, practice, and report any issues in the [community discussion channel](https://github.com/loongson-community/discussions/issues).

:::warning Proactive issue reporting is crucial!
Only when you raise problems will others see them and work on fixes.
Though the circle is still small, LoongArch’s application scope is already broader than any single individual can imagine.
Don’t expect a few developers to coincidentally face your issue and solve it without direct communication.
:::

The main features of this period/baseline include:

* :wrench: Continuing the implementation of LoongArch ELF psABI v20231219 (overall version v2.30).
    - v20230519: :wrench: Further improvements to linker relaxation.
    - v20231219: :wrench: Expected full TLS descriptor (TLSDESC) support.
* KVM virtualization is supported on Linux.
* :wrench: Extended support for new instructions and semantic changes in LoongArch v1.10.
    - 16-byte atomic operations are planned: :wrench: [tracking issue](https://github.com/loongson-community/discussions/issues/16).
* Full TLSDESC support?
* BFD linker support for `DT_RELR`?
* TBD

## 2024Q2 {#2024q2}

|Binutils|GCC|Linux|glibc|LLVM|Rust|Go |
|:------:|:-:|:---:|:---:|:--:|:--:|:-:|
|2.42|14.x|6.6 LTS|2.39|18|1.76.x|1.22.x|

This is the second baseline in the rapid development of the LoongArch's new world, showcasing significant iterations achieved through large-scale collaborative research and numerous minor improvements.

The support for LoongArch v1.00 features is nearly complete in this baseline. Additionally, broader community participation, closer collaboration, and more timely iterations mean that more modern features are gradually being introduced starting from this baseline.

Key features of this period/baseline include:

* Partial implementation of LoongArch ELF psABI v20231219 (overall version v2.30).
    - v20230519: Basic linker relaxation support: GNU toolchain has comprehensive support, while LLVM toolchain only implements compatibility requirements. Some issues may remain.
    - v20231102: For `medium` code model procedure calls, implemented the correct approach using adjacent `pcaddu18i + jirl` with `R_LARCH_CALL36`. Legacy approach remains supported only for binary compatibility but is not recommended for new code.
    - v20231219: Added TLS descriptor (TLSDESC) support, mainlined everywhere except glibc and musl.
    - v20231219: Requires adjacent placement of four address-composing instructions in `extreme` code model. Legacy object code with non-adjacent instructions crossing 4KiB boundaries will link incorrectly without remedy. Package maintainers should closely monitor software using `extreme` code model (typically large projects or low-level components).
* First complete support for LoongArch v1.00 instruction set, enabling assembly, disassembly, and free use in programs.
* Support for LoongArch v1.10 new instructions in assembly and disassembly, with partial code generation support. For example, gcc added command-line options to control 32-bit division erratum and `frecipe` usage.
* Initial auto-vectorization capability in compilers.
* First-time Rust language support for Linux glibc and bare metal environments.
* For Linux: KVM virtualization support missed the Linux 6.6 LTS release in late 2023.

## 2023Q1 {#2023q1}

|Binutils|GCC|Linux|glibc|LLVM|Rust|Go |
|:------:|:-:|:---:|:---:|:--:|:--:|:-:|
|2.40|13.x|6.1 LTS|2.37|16|N/A|1.20.x|

This is the first bootable baseline for LoongArch's new world.

Key features of this period/baseline include:

* Partial implementation of LoongArch ELF psABI v20230519 (overall version v2.10).
    - Introduced and defaulted to simplified relocations that do not rely on stack operation semantics.
    - For `medium` code model procedure calls, adopted a workaround using `jirl` with `R_LARCH_PCALA_LO12`.
    - No support for linker relaxation and related relocations.
* Compliance with ACPI 6.5 and UEFI 2.10.
  These specifications were officially released in August 2022, missing Linux 5.19's merge window in early July.
  Combined with the time needed for code updates, this baseline marks their first implementation.
* First-time LLVM/Clang support.
* Still no support for SIMD, hardware virtualization, or binary translation extensions.

## 2022Q3 {#2022q3}

|Binutils|GCC|Linux|glibc|LLVM|Rust|Go |
|:------:|:-:|:---:|:---:|:--:|:--:|:-:|
|2.38|12.x|5.19|2.36|N/A|N/A|1.19.x|

This is the first upstream baseline for LoongArch's new world.
At this point, while LoongArch support in toolchains and kernel was first upstreamed completely and could work together to build a complete sysroot, the timing mismatch with ACPI and UEFI specification updates meant systems built with this baseline couldn't boot.

Key features of this period/baseline include:

* Only supports relocations using stack operation semantics (`R_LARCH_SOP_*`).
* Only supports basic integer and floating-point instructions from LoongArch v1.00 Volume 1. SIMD, hardware virtualization, and binary translation extensions are completely unavailable.
