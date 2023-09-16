---
sidebar_position: 5
---

# Linux 上游硬件支持状态

本页面跟踪 Linux 上游对龙芯平台相关硬件的支持情况。在以下表格中，约定：

- 版本号：从该版本 Linux 起支持
- OK：使用标准接口，不需要额外支持
- WIP：有尚未合并到主线的补丁
- TODO：有该功能但没有补丁
- N/A：硬件不支持该功能

CPU 支持情况：

| 功能     | 3A5000                                                                                                                        | 3A6000                                                                                                                        |
|----------|-------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------|
| SMT      | N/A                                                                                                                           | [6.5](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=f6f0c9a74a48448583c3cb0f3f067bc3fe0f13c6) |
| LSX/LASX | [6.5](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=616500232e632dba8b03981eeccadacf2fbf1c30) | [6.5](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=616500232e632dba8b03981eeccadacf2fbf1c30) |
| LBT      | [6.6](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=bd3c5798484aa9a08302a844d7a75a2ee3b53d05) | [6.6](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=bd3c5798484aa9a08302a844d7a75a2ee3b53d05) |
| HWMon    | [WIP](https://github.com/loongarchlinux/linux/commit/fbc7e8f1e72f9efee68cfe7b70cc397adc325818)                                | [WIP](https://github.com/loongarchlinux/linux/commit/fbc7e8f1e72f9efee68cfe7b70cc397adc325818)                                |
| CPUFreq  | [WIP](https://github.com/loongarchlinux/linux/commit/9eed420e12431d09cbd87eb76ab3d1f77f9fafcd)                                | [WIP](https://github.com/loongarchlinux/linux/commit/9eed420e12431d09cbd87eb76ab3d1f77f9fafcd)                                |

桥片支持情况：

| 功能           | 7A1000                                                                                                                                    | 7A2000                                                                                                                                    |
|----------------|-------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| RTC            | OK(Also in [6.5](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=1b733a9ebc3d8011ca66ec6ff17f55a440358794)) | OK(Also in [6.5](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=1b733a9ebc3d8011ca66ec6ff17f55a440358794)) |
| GPIO           | [6.4](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=7944d3b7fe86067509751473aa917fdfd662d92c)             | [6.4](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=7944d3b7fe86067509751473aa917fdfd662d92c)             |
| I2C            | [6.3](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=015e61f0bffd46600496e50d3b2298f51f6b11a8)             | [6.3](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=015e61f0bffd46600496e50d3b2298f51f6b11a8)             |
| 以太网         | [5.14](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=30bba69d7db40e732d6c0aa6d4890c60d717e314)            | [WIP](https://github.com/loongarchlinux/linux/commit/2a948c4b7bc5cc2689e2d0edfe83b4980b81b9ad)                                            |
| OHCI USB1.1    | OK                                                                                                                                        | OK                                                                                                                                        |
| EHCI USB2.0    | OK                                                                                                                                        | OK                                                                                                                                        |
| XHCI USB3.0    | N/A                                                                                                                                       | OK                                                                                                                                        |
| GPU 图形处理器 | TODO                                                                                                                                      | TODO                                                                                                                                      |
| DC 显示控制器  | [6.6](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=f39db26c54281da6a785259498ca74b5e470476f)             | [6.6](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=f39db26c54281da6a785259498ca74b5e470476f)             |
| HDA 音频       | [6.5](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=28bd137a3c8e105587ba8c55b68ef43b519b270f)             | [6.5](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=28bd137a3c8e105587ba8c55b68ef43b519b270f)             |
| AC97           | TODO                                                                                                                                      | N/A                                                                                                                                       |
| I2S            | N/A                                                                                                                                       | [6.5](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=d84881e06836dc1655777a592b4279be76ad7324)             |
| SATA           | OK                                                                                                                                        | OK                                                                                                                                        |
| PCIE           | OK                                                                                                                                        | OK                                                                                                                                        |
| SPI            | [6.6](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=6c7a864007b66e60a3f64858a9555efed408b048)             | [6.6](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=6c7a864007b66e60a3f64858a9555efed408b048)             |
| LPC            | TODO                                                                                                                                      | TODO                                                                                                                                      |
| IOMMU          | N/A                                                                                                                                       | [WIP](https://github.com/loongarchlinux/linux/commit/1d26eae35f9a6f9d318112c33a177b3612179b26)                                            |
