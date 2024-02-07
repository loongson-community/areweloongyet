---
sidebar_position: 8
---

# 龙芯硬件 Errata 整理

本页面由非官方维护，持续更新收集龙芯平台相关硬件的已知缺陷（errata），作为相应官方材料的补充。

:::info 本文将随时更新！
本文是活的文档（living document），内容会随着现状变化而不时更新。不妨多来看看！
:::

## AMDGPU 失去响应

如果在内核日志中发现类似的log，和/或桌面环境卡死。

```
[ 9037.053812] radeon 0000:07:00.0: ring 0 stalled for more than 5657104msec
[ 9037.060557] radeon 0000:07:00.0: GPU lockup (current fence id 0x00000000000001b4 last fence id 0x00000000000001ca on ring 0)
```

可以在内核命令行上加上 `amdgpu.dpm=0` 禁用AMDGPU动态调频来缓解此问题。此问题已确认是7A桥片的硬件缺陷导致的。

确认平台：3A5000, 3A6000, 7A1000, 7A2000
