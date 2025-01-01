---
sidebar_position: 8
---

# Loongson Hardware Errata Summary

This page is unofficially maintained and continuously updated to collect known hardware flaws (errata) on Loongson platforms, complementing the relevant official materials.

:::info Frequently Updated!
This is a living document, and its content will change as conditions evolve. Check back often!
:::

## Possible LS7A Bridge Hardware Flaw Causing AMDGPU Driver Crashes

If you see similar logs in the kernel messages or experience desktop freezes:
```
[ 9037.053812] radeon 0000:07:00.0: ring 0 stalled for more than 5657104msec
[ 9037.060557] radeon 0000:07:00.0: GPU lockup (current fence id 0x00000000000001b4 last fence id 0x00000000000001ca on ring 0)
```
Try adding `amdgpu.dpm=0` to the kernel command line to disable AMDGPU dynamic frequency scaling as a workaround. This is confirmed to be caused by a hardware flaw in the LS7A bridge chip.

Affected platforms: 3A5000, 3A6000, 3C5000 (both 7A1000 and 7A2000 bridge-based boards).
