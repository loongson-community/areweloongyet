---
sidebar_position: 7
---

# Linux Upstream Hardware Support Status

This page tracks the support status of Loongson platform-related hardware in the upstream Linux kernel. In the following tables, the conventions are:

- Version: Supported from this Linux version
- OK: Uses standard interfaces, no additional support needed
- WIP: Patches exist but not yet merged upstream
- TODO: Functionality exists but no patches available
- N/A: Hardware does not support this feature
- ?: Lack of data (no information submitted yet, contributions welcome!)

## CPU Support Status

| Feature                | 3A5000           | 3A6000           | 3C6000           |
| ---------------------- | ---------------- | ---------------- | ---------------- |
| SMT                    | N/A              | [6.5][smt]       | [6.5][smt]       |
| [AVEC][avec-docs]      | N/A              | N/A              | [6.12][avec]     |
| LCL (CPU PCIe)         | N/A              | N/A              | OK               |
| LSX                    | [6.5][lsx]       | [6.5][lsx]       | [6.5][lsx]       |
| LASX                   | OK (same as LSX) | OK (same as LSX) | OK (same as LSX) |
| LBT                    | [6.6][lbt]       | [6.6][lbt]       | [6.6][lbt]       |
| LVZ (KVM)              | [6.7][kvm]       | [6.7][kvm]       | [6.7][kvm]       |
| HWMon                  | [WIP][hwmon]     | [WIP][hwmon]     | [WIP][hwmon]     |
| CPUFreq[^cpufreq-abis] | [6.11][cpufreq]  | [6.11][cpufreq]  | [6.11][cpufreq]  |

| Feature                | 2K1000LA   | 2K1500 | 2K2000     | 2K0300 | 2K0500 | 2K3000/3B6000M[^wip] |
| ---------------------- | ---------- | ------ | ---------- | ------ | ------ | -------------------- |
| SMT                    | N/A        | N/A    | N/A        | N/A    | N/A    | ?                    |
| [AVEC][avec-docs]      | N/A        | N/A    | N/A        | N/A    | N/A    | ?                    |
| LCL (CPU PCIe)         | N/A        | N/A    | N/A        | N/A    | N/A    | ?                    |
| LSX                    | [6.5][lsx] | ?      | [6.5][lsx] | ?      | ?      | [6.5][lsx]           |
| LASX                   | N/A        | N/A    | N/A        | N/A    | N/A    | OK (same as LSX)     |
| LBT                    | N/A        | N/A    | N/A        | N/A    | N/A    | ?                    |
| LVZ (KVM)              | N/A        | N/A    | N/A        | N/A    | N/A    | ?                    |
| HWMon                  | ?          | ?      | ?          | ?      | ?      | ?                    |
| CPUFreq[^cpufreq-abis] | ?          | ?      | ?          | ?      | ?      | ?                    |

[smt]: https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=f6f0c9a74a48448583c3cb0f3f067bc3fe0f13c6
[avec]: https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=ae16f05c928a1336d5d9d19fd805d7bf29c3f0c8
[avec-docs]: https://www.kernel.org/doc/html/v6.12/arch/loongarch/irq-chip-model.html#advanced-extended-irq-model
[kvm]: https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=c1fc48aad14dbe7654f5986afb906332b528d54b
[lsx]: https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=616500232e632dba8b03981eeccadacf2fbf1c30
[lbt]: https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=bd3c5798484aa9a08302a844d7a75a2ee3b53d05
[hwmon]: https://github.com/loongarchlinux/linux/commit/fbc7e8f1e72f9efee68cfe7b70cc397adc325818
[cpufreq]: https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=ccf51454145bffd98e31cdbe54a4262473c609e2

[^wip]: This model has not been officially released or even fully developed, so all related content is based on reasonable speculation from currently available public information. "Are We Loong Yet?" is not responsible for the accuracy of this information.
[^cpufreq-abis]: The cpufreq operations on the Loongson platform largely rely on the management core (usually a small LA132 core) to assist in execution. The system program on the main core communicates with the RTOS on the management core to indirectly achieve control, so the management core firmware communication protocol is an ABI boundary that needs to consider compatibility. Similar to the [Old and New World issues](./old-and-new-worlds.md) in the Loongson Linux ecosystem, the CPUFreq driver also has two versions, and the mainstream off-the-shelf hardware generally carries a management core firmware communication protocol that is incompatible with the Linux upstream driver implementation. Some domestic Linux distributions' Linux forks integrate the old protocol, such as [deepin](https://github.com/deepin-community/kernel/pull/143), openEuler [甲](https://gitee.com/openeuler/kernel/issues/I6BWFP) [乙](https://gitee.com/openeuler/kernel/commit/6b4ebaa38760203e2e53878b8fa59bf2be84e760), and [openAnolis](https://gitee.com/anolis/cloud-kernel/blob/devel-6.6/drivers/cpufreq/loongson3-acpi-cpufreq.c) (with a submission history similar to openEuler), for reference.

## Bridge Chip Support Status

| Feature                    | 7A1000                  | 7A2000              |
| -------------------------- | ----------------------- | ------------------- |
| RTC (UEFI)[^rtc-drivers]   | OK                      | OK                  |
| RTC (Native)[^rtc-drivers] | [6.5][rtc-loongson]     | [6.5][rtc-loongson] |
| GPIO                       | [6.4][gpio]             | [6.4][gpio]         |
| I2C                        | [6.3][i2c]              | [6.3][i2c]          |
| Ethernet                   | [5.14][dwmac-2k-7a1000] | [WIP][dwmac-7a2000] |
| OHCI USB1.1                | OK                      | OK                  |
| EHCI USB2.0                | OK                      | OK                  |
| XHCI USB3.0                | N/A                     | OK                  |
| GPU                        | TODO                    | TODO                |
| DC                         | [6.6][dc]               | [6.6][dc]           |
| HDA                        | [6.5][hda]              | [6.5][hda]          |
| AC97                       | TODO                    | N/A                 |
| I2S                        | N/A                     | [6.5][i2s]          |
| SATA                       | OK                      | OK                  |
| PCIE                       | OK                      | OK                  |
| SPI                        | [6.6][spi]              | [6.6][spi]          |
| LPC                        | TODO                    | TODO                |
| IOMMU                      | N/A                     | [WIP][iommu]        |

[rtc-loongson]: https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=1b733a9ebc3d8011ca66ec6ff17f55a440358794
[gpio]: https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=7944d3b7fe86067509751473aa917fdfd662d92c
[i2c]: https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=015e61f0bffd46600496e50d3b2298f51f6b11a8
[dwmac-2k-7a1000]: https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=30bba69d7db40e732d6c0aa6d4890c60d717e314
[dwmac-7a2000]: https://github.com/loongarchlinux/linux/commit/2a948c4b7bc5cc2689e2d0edfe83b4980b81b9ad
[dc]: https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=f39db26c54281da6a785259498ca74b5e470476f
[hda]: https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=28bd137a3c8e105587ba8c55b68ef43b519b270f
[i2s]: https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=d84881e06836dc1655777a592b4279be76ad7324
[spi]: https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=6c7a864007b66e60a3f64858a9555efed408b048
[iommu]: https://github.com/loongarchlinux/linux/commit/1d26eae35f9a6f9d318112c33a177b3612179b26

[^rtc-drivers]: In Loongson systems following the UEFI specification, the RTC can be operated through UEFI standard interfaces or by directly reading and writing related registers, but there is only one hardware resource. The native RTC driver is more for non-EFI Loongson systems, such as embedded devices booting with DT.
