---
sidebar_position: 7
---

# Linux 上游硬件支持状态

本页面跟踪 Linux 上游对龙芯平台相关硬件的支持情况。在以下表格中，约定：

- 版本号：从该版本 Linux 起支持
- OK：使用标准接口，不需要额外支持
- WIP：有尚未合并到主线的补丁
- TODO：有该功能但没有补丁
- N/A：硬件不支持该功能

## CPU 支持情况

| 功能     | 3A5000         | 3A6000         |
|----------|----------------|----------------|
| SMT      | N/A            | [6.5][smt]     |
| LSX/LASX | [6.5][lsx]     | [6.5][lsx]     |
| LBT      | [6.6][lbt]     | [6.6][lbt]     |
| HWMon    | [WIP][hwmon]   | [WIP][hwmon]   |
| CPUFreq  | [WIP][cpufreq] | [WIP][cpufreq] |

[smt]: https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=f6f0c9a74a48448583c3cb0f3f067bc3fe0f13c6
[lsx]: https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=616500232e632dba8b03981eeccadacf2fbf1c30
[lbt]: https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=bd3c5798484aa9a08302a844d7a75a2ee3b53d05
[hwmon]: https://github.com/loongarchlinux/linux/commit/fbc7e8f1e72f9efee68cfe7b70cc397adc325818
[cpufreq]: https://github.com/loongarchlinux/linux/commit/9eed420e12431d09cbd87eb76ab3d1f77f9fafcd

## 桥片支持情况

| 功能           | 7A1000                  | 7A2000              |
|----------------|-------------------------|---------------------|
| RTC（UEFI）[^注一]| OK                      | OK                  |
| RTC（原生）[^注一]| [6.5][rtc-loongson]     | [6.5][rtc-loongson] |
| GPIO           | [6.4][gpio]             | [6.4][gpio]         |
| I2C            | [6.3][i2c]              | [6.3][i2c]          |
| 以太网         | [5.14][dwmac-2k-7a1000] | [WIP][dwmac-7a2000] |
| OHCI USB1.1    | OK                      | OK                  |
| EHCI USB2.0    | OK                      | OK                  |
| XHCI USB3.0    | N/A                     | OK                  |
| GPU 图形处理器 | TODO                    | TODO                |
| DC 显示控制器  | [6.6][dc]               | [6.6][dc]           |
| HDA 音频       | [6.5][hda]              | [6.5][hda]          |
| AC97           | TODO                    | N/A                 |
| I2S            | N/A                     | [6.5][i2s]          |
| SATA           | OK                      | OK                  |
| PCIE           | OK                      | OK                  |
| SPI            | [6.6][spi]              | [6.6][spi]          |
| LPC            | TODO                    | TODO                |
| IOMMU          | N/A                     | [WIP][iommu]        |

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

[^注一]: 在遵循 UEFI 规范的龙芯系统中，可以通过 UEFI 的标准接口操作 RTC，也可以绕过固件服务直接读写相关寄存器，但硬件资源实际只有一个。原生 RTC 驱动更多是用于非 EFI 的龙芯系统，如以 DT 方式启动的嵌入式设备等。
