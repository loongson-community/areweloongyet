---
sidebar_position: 5
---

# 典型龙架构配置数据收集

:::info 本文将随时更新！
本文是活的文档（living document），内容会随着现状变化而不时更新。不妨多来看看！
:::

本页面开放编辑！欢迎通过 GitHub 提交您的龙架构硬件配置，内容格式可参照附带的[模板章节](#template)。

## 3A6000 评估板（同 XA61200） {#3a6000-evb-xa61200}

`uname -srvmpio`: `Linux 6.6.0-rc3-next-20230928-gbcdaf018db45 #3 SMP PREEMPT Sun Jun 25 12:04:01 AM CST 2023 loongarch64 unknown unknown GNU/Linux`

<details>
<summary>`CPUCFG`</summary>

```
CPUCFG.0x0  = 0x0014d000
CPUCFG.0x1  = 0x07f2f2fe
CPUCFG.0x2  = 0x7e7cccc7
CPUCFG.0x3  = 0x00cefcff
CPUCFG.0x4  = 0x05f5e100
CPUCFG.0x5  = 0x00010001
CPUCFG.0x6  = 0x00007f33
CPUCFG.0x10 = 0x00002c3d
CPUCFG.0x11 = 0x06080003
CPUCFG.0x12 = 0x06080003
CPUCFG.0x13 = 0x0608000f
CPUCFG.0x14 = 0x060e000f
```

</details>

<details>
<summary>`/proc/cpuinfo`</summary>

```
system type		: generic-loongson-machine

processor		: 0
package			: 0
core			: 0
global_id		: 0
CPU Family		: Loongson-64bit
Model Name		: Loongson-3A6000-HV
CPU Revision		: 0x00
FPU Revision		: 0x00
CPU MHz			: 2500.00
BogoMIPS		: 5000.00
TLB Entries		: 2112
Address Sizes		: 48 bits physical, 48 bits virtual
ISA			: loongarch32 loongarch64
Features		: cpucfg lam ual fpu lsx lasx crc32 lvz lbt_x86 lbt_arm lbt_mips
Hardware Watchpoint	: yes, iwatch count: 8, dwatch count: 4

processor		: 1
package			: 0
core			: 0
global_id		: 1
CPU Family		: Loongson-64bit
Model Name		: Loongson-3A6000-HV
CPU Revision		: 0x00
FPU Revision		: 0x00
CPU MHz			: 2500.00
BogoMIPS		: 5000.00
TLB Entries		: 2112
Address Sizes		: 48 bits physical, 48 bits virtual
ISA			: loongarch32 loongarch64
Features		: cpucfg lam ual fpu lsx lasx crc32 lvz lbt_x86 lbt_arm lbt_mips
Hardware Watchpoint	: yes, iwatch count: 8, dwatch count: 4

processor		: 2
package			: 0
core			: 1
global_id		: 2
CPU Family		: Loongson-64bit
Model Name		: Loongson-3A6000-HV
CPU Revision		: 0x00
FPU Revision		: 0x00
CPU MHz			: 2500.00
BogoMIPS		: 5000.00
TLB Entries		: 2112
Address Sizes		: 48 bits physical, 48 bits virtual
ISA			: loongarch32 loongarch64
Features		: cpucfg lam ual fpu lsx lasx crc32 lvz lbt_x86 lbt_arm lbt_mips
Hardware Watchpoint	: yes, iwatch count: 8, dwatch count: 4

processor		: 3
package			: 0
core			: 1
global_id		: 3
CPU Family		: Loongson-64bit
Model Name		: Loongson-3A6000-HV
CPU Revision		: 0x00
FPU Revision		: 0x00
CPU MHz			: 2500.00
BogoMIPS		: 5000.00
TLB Entries		: 2112
Address Sizes		: 48 bits physical, 48 bits virtual
ISA			: loongarch32 loongarch64
Features		: cpucfg lam ual fpu lsx lasx crc32 lvz lbt_x86 lbt_arm lbt_mips
Hardware Watchpoint	: yes, iwatch count: 8, dwatch count: 4

processor		: 4
package			: 0
core			: 2
global_id		: 4
CPU Family		: Loongson-64bit
Model Name		: Loongson-3A6000-HV
CPU Revision		: 0x00
FPU Revision		: 0x00
CPU MHz			: 2500.00
BogoMIPS		: 5000.00
TLB Entries		: 2112
Address Sizes		: 48 bits physical, 48 bits virtual
ISA			: loongarch32 loongarch64
Features		: cpucfg lam ual fpu lsx lasx crc32 lvz lbt_x86 lbt_arm lbt_mips
Hardware Watchpoint	: yes, iwatch count: 8, dwatch count: 4

processor		: 5
package			: 0
core			: 2
global_id		: 5
CPU Family		: Loongson-64bit
Model Name		: Loongson-3A6000-HV
CPU Revision		: 0x00
FPU Revision		: 0x00
CPU MHz			: 2500.00
BogoMIPS		: 5000.00
TLB Entries		: 2112
Address Sizes		: 48 bits physical, 48 bits virtual
ISA			: loongarch32 loongarch64
Features		: cpucfg lam ual fpu lsx lasx crc32 lvz lbt_x86 lbt_arm lbt_mips
Hardware Watchpoint	: yes, iwatch count: 8, dwatch count: 4

processor		: 6
package			: 0
core			: 3
global_id		: 6
CPU Family		: Loongson-64bit
Model Name		: Loongson-3A6000-HV
CPU Revision		: 0x00
FPU Revision		: 0x00
CPU MHz			: 2500.00
BogoMIPS		: 5000.00
TLB Entries		: 2112
Address Sizes		: 48 bits physical, 48 bits virtual
ISA			: loongarch32 loongarch64
Features		: cpucfg lam ual fpu lsx lasx crc32 lvz lbt_x86 lbt_arm lbt_mips
Hardware Watchpoint	: yes, iwatch count: 8, dwatch count: 4

processor		: 7
package			: 0
core			: 3
global_id		: 7
CPU Family		: Loongson-64bit
Model Name		: Loongson-3A6000-HV
CPU Revision		: 0x00
FPU Revision		: 0x00
CPU MHz			: 2500.00
BogoMIPS		: 5000.00
TLB Entries		: 2112
Address Sizes		: 48 bits physical, 48 bits virtual
ISA			: loongarch32 loongarch64
Features		: cpucfg lam ual fpu lsx lasx crc32 lvz lbt_x86 lbt_arm lbt_mips
Hardware Watchpoint	: yes, iwatch count: 8, dwatch count: 4

```

</details>

<details>
<summary>`sudo dmidecode -t 0,1,2,4,7`</summary>

```
# dmidecode 3.5
Getting SMBIOS data from sysfs.
SMBIOS 3.2.0 present.

Handle 0x0000, DMI type 0, 26 bytes
BIOS Information
	Vendor: Loongson
	Version: Loongson-UDK2018-V4.0.05634-stable202308
	Release Date: 11/29/23 18:07:37
	ROM Size: 4 MB
	Characteristics:
		PCI is supported
		BIOS is upgradeable
		Boot from CD is supported
		Selectable boot is supported
		BIOS ROM is socketed
		Serial services are supported (int 14h)
		USB legacy is supported
		UEFI is supported

Handle 0x0001, DMI type 1, 27 bytes
System Information
	Manufacturer: Loongson
	Product Name: Loongson-3A6000-HV-7A2000-1w-V0.1-EVB
	Version: To Be Filled By O.E.M
	Serial Number: To Be Filled By O.E.M
	UUID: Not Present
	Wake-up Type: Power Switch
	SKU Number: To Be Filled By O.E.M
	Family: To Be Filled By O.E.M

Handle 0x0002, DMI type 2, 17 bytes
Base Board Information
	Manufacturer: Loongson
	Product Name: Loongson-3A6000-HV-7A2000-1w-EVB-V1.21
	Version: To Be Filled By O.E.M
	Serial Number: To Be Filled By O.E.M
	Asset Tag: To Be Filled By O.E.M
	Features:
		Board is a hosting board
		Board is replaceable
	Location In Chassis: Not Specified
	Chassis Handle: 0x0000
	Type: Motherboard
	Contained Object Handles: 0

Handle 0x0004, DMI type 7, 27 bytes
Cache Information
	Socket Designation: Not Specified
	Configuration: Enabled, Not Socketed, Level 1
	Operational Mode: Write Back
	Location: Internal
	Installed Size: 64 kB
	Maximum Size: 64 kB
	Supported SRAM Types:
		Burst
		Pipeline Burst
		Synchronous
	Installed SRAM Type: Burst Pipeline Burst Synchronous
	Speed: Unknown
	Error Correction Type: Single-bit ECC
	System Type: Data
	Associativity: 4-way Set-associative

Handle 0x0005, DMI type 7, 27 bytes
Cache Information
	Socket Designation: Not Specified
	Configuration: Enabled, Not Socketed, Level 2
	Operational Mode: Write Back
	Location: Internal
	Installed Size: 256 kB
	Maximum Size: 256 kB
	Supported SRAM Types:
		Burst
		Pipeline Burst
		Synchronous
	Installed SRAM Type: Burst Pipeline Burst Synchronous
	Speed: Unknown
	Error Correction Type: Single-bit ECC
	System Type: Data
	Associativity: 16-way Set-associative

Handle 0x0006, DMI type 7, 27 bytes
Cache Information
	Socket Designation: Not Specified
	Configuration: Enabled, Not Socketed, Level 3
	Operational Mode: Write Back
	Location: Internal
	Installed Size: 16 MB
	Maximum Size: 16 MB
	Supported SRAM Types:
		Burst
		Pipeline Burst
		Synchronous
	Installed SRAM Type: Burst Pipeline Burst Synchronous
	Speed: Unknown
	Error Correction Type: Single-bit ECC
	System Type: Data
	Associativity: 16-way Set-associative

Handle 0x0007, DMI type 4, 48 bytes
Processor Information
	Socket Designation: CPU0
	Type: Central Processor
	Family: <OUT OF SPEC>
	Manufacturer: Loongson
	ID: 33 41 36 30 30 30 2D 48
	Version: Loongson-3A6000-HV
	Voltage: 1.2 V
	External Clock: 25 MHz
	Max Speed: 2500 MHz
	Current Speed: 2500 MHz
	Status: Populated, Enabled
	Upgrade: <OUT OF SPEC>
	L1 Cache Handle: 0x0004
	L2 Cache Handle: 0x0005
	L3 Cache Handle: 0x0006
	Serial Number: Not Specified
	Asset Tag: Not Specified
	Part Number: Not Specified
	Core Count: 8
	Core Enabled: 8
	Thread Count: 8
	Characteristics:
		64-bit capable
		Multi-Core
		Hardware Thread

```

</details>

## 3C5000 单路服务器

`uname -srvmpio`: `Linux 6.5.3-aosc-main #1 SMP PREEMPT Fri Sep 22 00:30:38 UTC 2023 loongarch64 unknown unknown GNU/Linux`

<details>
<summary>`CPUCFG`</summary>

```
CPUCFG.0x0  = 0x0014c011
CPUCFG.0x1  = 0x03f2f2fe
CPUCFG.0x2  = 0x007ccfc7
CPUCFG.0x3  = 0x0000fcff
CPUCFG.0x4  = 0x05f5e100
CPUCFG.0x5  = 0x00010001
CPUCFG.0x6  = 0x00007f33
CPUCFG.0x10 = 0x00002c3d
CPUCFG.0x11 = 0x06080003
CPUCFG.0x12 = 0x06080003
CPUCFG.0x13 = 0x0608000f
CPUCFG.0x14 = 0x060e000f
CPUCFG.0x30 = 0x0000000e
```

</details>

<details>
<summary>`/proc/cpuinfo`</summary>

```
system type		: generic-loongson-machine

processor		: 0
package			: 0
core			: 0
global_id		: 0
CPU Family		: Loongson-64bit
Model Name		: Loongson-3C5000
CPU Revision		: 0x11
FPU Revision		: 0x00
CPU MHz			: 2200.00
BogoMIPS		: 4400.00
TLB Entries		: 2112
Address Sizes		: 48 bits physical, 48 bits virtual
ISA			: loongarch32 loongarch64
Features		: cpucfg lam ual fpu lsx lasx crc32 complex crypto lvz lbt_x86 lbt_arm lbt_mips
Hardware Watchpoint	: yes, iwatch count: 8, dwatch count: 8

processor		: 1
package			: 0
core			: 1
global_id		: 1
CPU Family		: Loongson-64bit
Model Name		: Loongson-3C5000
CPU Revision		: 0x11
FPU Revision		: 0x00
CPU MHz			: 2200.00
BogoMIPS		: 4400.00
TLB Entries		: 2112
Address Sizes		: 48 bits physical, 48 bits virtual
ISA			: loongarch32 loongarch64
Features		: cpucfg lam ual fpu lsx lasx crc32 complex crypto lvz lbt_x86 lbt_arm lbt_mips
Hardware Watchpoint	: yes, iwatch count: 8, dwatch count: 8

processor		: 2
package			: 0
core			: 2
global_id		: 2
CPU Family		: Loongson-64bit
Model Name		: Loongson-3C5000
CPU Revision		: 0x11
FPU Revision		: 0x00
CPU MHz			: 2200.00
BogoMIPS		: 4400.00
TLB Entries		: 2112
Address Sizes		: 48 bits physical, 48 bits virtual
ISA			: loongarch32 loongarch64
Features		: cpucfg lam ual fpu lsx lasx crc32 complex crypto lvz lbt_x86 lbt_arm lbt_mips
Hardware Watchpoint	: yes, iwatch count: 8, dwatch count: 8

processor		: 3
package			: 0
core			: 3
global_id		: 3
CPU Family		: Loongson-64bit
Model Name		: Loongson-3C5000
CPU Revision		: 0x11
FPU Revision		: 0x00
CPU MHz			: 2200.00
BogoMIPS		: 4400.00
TLB Entries		: 2112
Address Sizes		: 48 bits physical, 48 bits virtual
ISA			: loongarch32 loongarch64
Features		: cpucfg lam ual fpu lsx lasx crc32 complex crypto lvz lbt_x86 lbt_arm lbt_mips
Hardware Watchpoint	: yes, iwatch count: 8, dwatch count: 8

processor		: 4
package			: 0
core			: 4
global_id		: 4
CPU Family		: Loongson-64bit
Model Name		: Loongson-3C5000
CPU Revision		: 0x11
FPU Revision		: 0x00
CPU MHz			: 2200.00
BogoMIPS		: 4400.00
TLB Entries		: 2112
Address Sizes		: 48 bits physical, 48 bits virtual
ISA			: loongarch32 loongarch64
Features		: cpucfg lam ual fpu lsx lasx crc32 complex crypto lvz lbt_x86 lbt_arm lbt_mips
Hardware Watchpoint	: yes, iwatch count: 8, dwatch count: 8

processor		: 5
package			: 0
core			: 5
global_id		: 5
CPU Family		: Loongson-64bit
Model Name		: Loongson-3C5000
CPU Revision		: 0x11
FPU Revision		: 0x00
CPU MHz			: 2200.00
BogoMIPS		: 4400.00
TLB Entries		: 2112
Address Sizes		: 48 bits physical, 48 bits virtual
ISA			: loongarch32 loongarch64
Features		: cpucfg lam ual fpu lsx lasx crc32 complex crypto lvz lbt_x86 lbt_arm lbt_mips
Hardware Watchpoint	: yes, iwatch count: 8, dwatch count: 8

processor		: 6
package			: 0
core			: 6
global_id		: 6
CPU Family		: Loongson-64bit
Model Name		: Loongson-3C5000
CPU Revision		: 0x11
FPU Revision		: 0x00
CPU MHz			: 2200.00
BogoMIPS		: 4400.00
TLB Entries		: 2112
Address Sizes		: 48 bits physical, 48 bits virtual
ISA			: loongarch32 loongarch64
Features		: cpucfg lam ual fpu lsx lasx crc32 complex crypto lvz lbt_x86 lbt_arm lbt_mips
Hardware Watchpoint	: yes, iwatch count: 8, dwatch count: 8

processor		: 7
package			: 0
core			: 7
global_id		: 7
CPU Family		: Loongson-64bit
Model Name		: Loongson-3C5000
CPU Revision		: 0x11
FPU Revision		: 0x00
CPU MHz			: 2200.00
BogoMIPS		: 4400.00
TLB Entries		: 2112
Address Sizes		: 48 bits physical, 48 bits virtual
ISA			: loongarch32 loongarch64
Features		: cpucfg lam ual fpu lsx lasx crc32 complex crypto lvz lbt_x86 lbt_arm lbt_mips
Hardware Watchpoint	: yes, iwatch count: 8, dwatch count: 8

processor		: 8
package			: 0
core			: 8
global_id		: 8
CPU Family		: Loongson-64bit
Model Name		: Loongson-3C5000
CPU Revision		: 0x11
FPU Revision		: 0x00
CPU MHz			: 2200.00
BogoMIPS		: 4400.00
TLB Entries		: 2112
Address Sizes		: 48 bits physical, 48 bits virtual
ISA			: loongarch32 loongarch64
Features		: cpucfg lam ual fpu lsx lasx crc32 complex crypto lvz lbt_x86 lbt_arm lbt_mips
Hardware Watchpoint	: yes, iwatch count: 8, dwatch count: 8

processor		: 9
package			: 0
core			: 9
global_id		: 9
CPU Family		: Loongson-64bit
Model Name		: Loongson-3C5000
CPU Revision		: 0x11
FPU Revision		: 0x00
CPU MHz			: 2200.00
BogoMIPS		: 4400.00
TLB Entries		: 2112
Address Sizes		: 48 bits physical, 48 bits virtual
ISA			: loongarch32 loongarch64
Features		: cpucfg lam ual fpu lsx lasx crc32 complex crypto lvz lbt_x86 lbt_arm lbt_mips
Hardware Watchpoint	: yes, iwatch count: 8, dwatch count: 8

processor		: 10
package			: 0
core			: 10
global_id		: 10
CPU Family		: Loongson-64bit
Model Name		: Loongson-3C5000
CPU Revision		: 0x11
FPU Revision		: 0x00
CPU MHz			: 2200.00
BogoMIPS		: 4400.00
TLB Entries		: 2112
Address Sizes		: 48 bits physical, 48 bits virtual
ISA			: loongarch32 loongarch64
Features		: cpucfg lam ual fpu lsx lasx crc32 complex crypto lvz lbt_x86 lbt_arm lbt_mips
Hardware Watchpoint	: yes, iwatch count: 8, dwatch count: 8

processor		: 11
package			: 0
core			: 11
global_id		: 11
CPU Family		: Loongson-64bit
Model Name		: Loongson-3C5000
CPU Revision		: 0x11
FPU Revision		: 0x00
CPU MHz			: 2200.00
BogoMIPS		: 4400.00
TLB Entries		: 2112
Address Sizes		: 48 bits physical, 48 bits virtual
ISA			: loongarch32 loongarch64
Features		: cpucfg lam ual fpu lsx lasx crc32 complex crypto lvz lbt_x86 lbt_arm lbt_mips
Hardware Watchpoint	: yes, iwatch count: 8, dwatch count: 8

processor		: 12
package			: 0
core			: 12
global_id		: 12
CPU Family		: Loongson-64bit
Model Name		: Loongson-3C5000
CPU Revision		: 0x11
FPU Revision		: 0x00
CPU MHz			: 2200.00
BogoMIPS		: 4400.00
TLB Entries		: 2112
Address Sizes		: 48 bits physical, 48 bits virtual
ISA			: loongarch32 loongarch64
Features		: cpucfg lam ual fpu lsx lasx crc32 complex crypto lvz lbt_x86 lbt_arm lbt_mips
Hardware Watchpoint	: yes, iwatch count: 8, dwatch count: 8

processor		: 13
package			: 0
core			: 13
global_id		: 13
CPU Family		: Loongson-64bit
Model Name		: Loongson-3C5000
CPU Revision		: 0x11
FPU Revision		: 0x00
CPU MHz			: 2200.00
BogoMIPS		: 4400.00
TLB Entries		: 2112
Address Sizes		: 48 bits physical, 48 bits virtual
ISA			: loongarch32 loongarch64
Features		: cpucfg lam ual fpu lsx lasx crc32 complex crypto lvz lbt_x86 lbt_arm lbt_mips
Hardware Watchpoint	: yes, iwatch count: 8, dwatch count: 8

processor		: 14
package			: 0
core			: 14
global_id		: 14
CPU Family		: Loongson-64bit
Model Name		: Loongson-3C5000
CPU Revision		: 0x11
FPU Revision		: 0x00
CPU MHz			: 2200.00
BogoMIPS		: 4400.00
TLB Entries		: 2112
Address Sizes		: 48 bits physical, 48 bits virtual
ISA			: loongarch32 loongarch64
Features		: cpucfg lam ual fpu lsx lasx crc32 complex crypto lvz lbt_x86 lbt_arm lbt_mips
Hardware Watchpoint	: yes, iwatch count: 8, dwatch count: 8

processor		: 15
package			: 0
core			: 15
global_id		: 15
CPU Family		: Loongson-64bit
Model Name		: Loongson-3C5000
CPU Revision		: 0x11
FPU Revision		: 0x00
CPU MHz			: 2200.00
BogoMIPS		: 4400.00
TLB Entries		: 2112
Address Sizes		: 48 bits physical, 48 bits virtual
ISA			: loongarch32 loongarch64
Features		: cpucfg lam ual fpu lsx lasx crc32 complex crypto lvz lbt_x86 lbt_arm lbt_mips
Hardware Watchpoint	: yes, iwatch count: 8, dwatch count: 8

```

</details>

<details>
<summary>`sudo dmidecode -t 0,1,2,4,7`</summary>

```
# dmidecode 3.2
Getting SMBIOS data from sysfs.
SMBIOS 3.2.0 present.

Handle 0x0000, DMI type 0, 26 bytes
BIOS Information
	Vendor: Loongson
	Version: Loongson-UDK2018-V4.0.05420-stable202302
	Release Date: 05/27/23 17:52:43
	ROM Size: 4096 kB
	Characteristics:
		PCI is supported
		BIOS is upgradeable
		Boot from CD is supported
		Selectable boot is supported
		BIOS ROM is socketed
		Serial services are supported (int 14h)
		USB legacy is supported
		UEFI is supported
	BIOS Revision: 4.0

Handle 0x0001, DMI type 1, 27 bytes
System Information
	Manufacturer: To be filled by O.E.M.To be fill
	Product Name: To be filled by O.E.M.To be fill
	Version: To be filled by O.E.M.To be fill
	Serial Number: To be filled by O.E.M.To be fill
	UUID: Not Present
	Wake-up Type: Power Switch
	SKU Number: Not Specified
	Family: Not Specified

Handle 0x0002, DMI type 2, 17 bytes
Base Board Information
	Manufacturer: To be filled by O.E.M.To be fill
	Product Name: To be filled by O.E.M.To be fill
	Version: To be filled by O.E.M.To be fill
	Serial Number: To be filled by O.E.M.To be fill
	Asset Tag: To be filled by O.E.M.To be fill
	Features:
		Board is a hosting board
		Board is replaceable
	Location In Chassis: Not Specified
	Chassis Handle: 0x0000
	Type: Motherboard
	Contained Object Handles: 0

Handle 0x0004, DMI type 4, 48 bytes
Processor Information
	Socket Designation: CPU0
	Type: Central Processor
	Family: <OUT OF SPEC>
	Manufacturer: Loongson
	ID: 33 43 35 30 30 30 00 00
	Version: Loongson-3C5000
	Voltage: 1.2 V
	External Clock: 25 MHz
	Max Speed: 2000 MHz
	Current Speed: 2200 MHz
	Status: Populated, Enabled
	Upgrade: <OUT OF SPEC>
	L1 Cache Handle: Not Provided
	L2 Cache Handle: Not Provided
	L3 Cache Handle: Not Provided
	Serial Number: Not Specified
	Asset Tag: Not Specified
	Part Number: Not Specified
	Core Count: 16
	Core Enabled: 16
	Thread Count: 16
	Characteristics:
		64-bit capable
		Multi-Core
		Hardware Thread

Handle 0x0005, DMI type 7, 27 bytes
Cache Information
	Socket Designation: Not Specified
	Configuration: Enabled, Not Socketed, Level 1
	Operational Mode: Write Back
	Location: Internal
	Installed Size: 64 kB
	Maximum Size: 64 kB
	Supported SRAM Types:
		Burst
		Pipeline Burst
		Synchronous
	Installed SRAM Type: Burst Pipeline Burst Synchronous
	Speed: Unknown
	Error Correction Type: Single-bit ECC
	System Type: Data
	Associativity: 4-way Set-associative

Handle 0x0006, DMI type 7, 27 bytes
Cache Information
	Socket Designation: Not Specified
	Configuration: Enabled, Not Socketed, Level 2
	Operational Mode: Write Back
	Location: Internal
	Installed Size: 256 kB
	Maximum Size: 256 kB
	Supported SRAM Types:
		Burst
		Pipeline Burst
		Synchronous
	Installed SRAM Type: Burst Pipeline Burst Synchronous
	Speed: Unknown
	Error Correction Type: Single-bit ECC
	System Type: Data
	Associativity: 16-way Set-associative

Handle 0x0007, DMI type 7, 27 bytes
Cache Information
	Socket Designation: Not Specified
	Configuration: Enabled, Not Socketed, Level 3
	Operational Mode: Write Back
	Location: Internal
	Installed Size: 32768 kB
	Maximum Size: 32768 kB
	Supported SRAM Types:
		Burst
		Pipeline Burst
		Synchronous
	Installed SRAM Type: Burst Pipeline Burst Synchronous
	Speed: Unknown
	Error Correction Type: Single-bit ECC
	System Type: Data
	Associativity: 16-way Set-associative

```

</details>

## 3A5000M 笔记本

`uname -srvmpio`: `Linux 6.7.0-aosc-main #1 SMP PREEMPT_DYNAMIC Fri Dec  8 03:17:48 UTC 2023 loongarch64 unknown unknown GNU/Linux`

<details>
<summary>`CPUCFG`</summary>

```
CPUCFG.0x0  = 0x0014c011
CPUCFG.0x1  = 0x03f2f2fe
CPUCFG.0x2  = 0x007ccfc7
CPUCFG.0x3  = 0x0000fcff
CPUCFG.0x4  = 0x05f5e100
CPUCFG.0x5  = 0x00010001
CPUCFG.0x6  = 0x00007f33
CPUCFG.0x10 = 0x00002c3d
CPUCFG.0x11 = 0x06080003
CPUCFG.0x12 = 0x06080003
CPUCFG.0x13 = 0x0608000f
CPUCFG.0x14 = 0x060e000f
CPUCFG.0x30 = 0x0000000e
```

</details>

<details>
<summary>`/proc/cpuinfo`</summary>

```
system type		: generic-loongson-machine

processor		: 0
package			: 0
core			: 0
global_id		: 0
CPU Family		: Loongson-64bit
Model Name		: Loongson-3A5000M
CPU Revision		: 0x11
FPU Revision		: 0x00
CPU MHz			: 2000.00
BogoMIPS		: 4000.00
TLB Entries		: 2112
Address Sizes		: 48 bits physical, 48 bits virtual
ISA			: loongarch32 loongarch64
Features		: cpucfg lam ual fpu lsx lasx crc32 complex crypto lvz lbt_x86 lbt_arm lbt_mips
Hardware Watchpoint	: yes, iwatch count: 8, dwatch count: 8

processor		: 1
package			: 0
core			: 1
global_id		: 1
CPU Family		: Loongson-64bit
Model Name		: Loongson-3A5000M
CPU Revision		: 0x11
FPU Revision		: 0x00
CPU MHz			: 2000.00
BogoMIPS		: 4000.00
TLB Entries		: 2112
Address Sizes		: 48 bits physical, 48 bits virtual
ISA			: loongarch32 loongarch64
Features		: cpucfg lam ual fpu lsx lasx crc32 complex crypto lvz lbt_x86 lbt_arm lbt_mips
Hardware Watchpoint	: yes, iwatch count: 8, dwatch count: 8

processor		: 2
package			: 0
core			: 2
global_id		: 2
CPU Family		: Loongson-64bit
Model Name		: Loongson-3A5000M
CPU Revision		: 0x11
FPU Revision		: 0x00
CPU MHz			: 2000.00
BogoMIPS		: 4000.00
TLB Entries		: 2112
Address Sizes		: 48 bits physical, 48 bits virtual
ISA			: loongarch32 loongarch64
Features		: cpucfg lam ual fpu lsx lasx crc32 complex crypto lvz lbt_x86 lbt_arm lbt_mips
Hardware Watchpoint	: yes, iwatch count: 8, dwatch count: 8

processor		: 3
package			: 0
core			: 3
global_id		: 3
CPU Family		: Loongson-64bit
Model Name		: Loongson-3A5000M
CPU Revision		: 0x11
FPU Revision		: 0x00
CPU MHz			: 2000.00
BogoMIPS		: 4000.00
TLB Entries		: 2112
Address Sizes		: 48 bits physical, 48 bits virtual
ISA			: loongarch32 loongarch64
Features		: cpucfg lam ual fpu lsx lasx crc32 complex crypto lvz lbt_x86 lbt_arm lbt_mips
Hardware Watchpoint	: yes, iwatch count: 8, dwatch count: 8
```

</details>

<details>
<summary>`sudo dmidecode -t 0,1,2,4,7`</summary>

```
# dmidecode 3.2
Getting SMBIOS data from sysfs.
SMBIOS 3.2.0 present.

Handle 0x0000, DMI type 0, 26 bytes
BIOS Information
	Vendor: Loongson
	Version: Loongson-UDK2018-V4.0.05132-beta10
	Release Date: 07/26/2023
	ROM Size: 4096 kB
	Characteristics:
		PCI is supported
		BIOS is upgradeable
		Boot from CD is supported
		Selectable boot is supported
		BIOS ROM is socketed
		Serial services are supported (int 14h)
		USB legacy is supported
		UEFI is supported
	BIOS Revision: 4.0

Handle 0x0001, DMI type 1, 27 bytes
System Information
	Manufacturer: Loongson
	Product Name: Loongson-3A5000M-7A1000-Laptop-Eascs-L71
	Version: Not Specified
	Serial Number: Not Specified
	UUID: Not Present
	Wake-up Type: Power Switch
	SKU Number: Not Specified
	Family: Not Specified

Handle 0x0002, DMI type 2, 17 bytes
Base Board Information
	Manufacturer: Loongson
	Product Name: Loongson-LS3A5000-7A1000-Laptop-Eascs-L71
	Version: Not Specified
	Serial Number: Not Specified
	Asset Tag: Not Specified
	Features:
		Board is a hosting board
		Board is replaceable
	Location In Chassis: Not Specified
	Chassis Handle: 0x0000
	Type: Motherboard
	Contained Object Handles: 0

Handle 0x0004, DMI type 7, 27 bytes
Cache Information
	Socket Designation: Not Specified
	Configuration: Enabled, Not Socketed, Level 1
	Operational Mode: Write Back
	Location: Internal
	Installed Size: 64 kB
	Maximum Size: 64 kB
	Supported SRAM Types:
		Burst
		Pipeline Burst
		Synchronous
	Installed SRAM Type: Burst Pipeline Burst Synchronous
	Speed: Unknown
	Error Correction Type: Single-bit ECC
	System Type: Data
	Associativity: 4-way Set-associative

Handle 0x0005, DMI type 7, 27 bytes
Cache Information
	Socket Designation: Not Specified
	Configuration: Enabled, Not Socketed, Level 2
	Operational Mode: Write Back
	Location: Internal
	Installed Size: 256 kB
	Maximum Size: 256 kB
	Supported SRAM Types:
		Burst
		Pipeline Burst
		Synchronous
	Installed SRAM Type: Burst Pipeline Burst Synchronous
	Speed: Unknown
	Error Correction Type: Single-bit ECC
	System Type: Data
	Associativity: 16-way Set-associative

Handle 0x0006, DMI type 7, 27 bytes
Cache Information
	Socket Designation: Not Specified
	Configuration: Enabled, Not Socketed, Level 3
	Operational Mode: Write Back
	Location: Internal
	Installed Size: 16384 kB
	Maximum Size: 16384 kB
	Supported SRAM Types:
		Burst
		Pipeline Burst
		Synchronous
	Installed SRAM Type: Burst Pipeline Burst Synchronous
	Speed: Unknown
	Error Correction Type: Single-bit ECC
	System Type: Data
	Associativity: 16-way Set-associative

Handle 0x0007, DMI type 4, 48 bytes
Processor Information
	Socket Designation: CPU1
	Type: Central Processor
	Family: <OUT OF SPEC>
	Manufacturer: Loongson
	ID: 33 41 35 30 30 30 4D 00
	Version: Loongson-3A5000M
	Voltage: 1.2 V
	External Clock: 25 MHz
	Max Speed: 2000 MHz
	Current Speed: 2000 MHz
	Status: Populated, Enabled
	Upgrade: <OUT OF SPEC>
	L1 Cache Handle: 0x0004
	L2 Cache Handle: 0x0005
	L3 Cache Handle: 0x0006
	Serial Number: Not Specified
	Asset Tag: Not Specified
	Part Number: Not Specified
	Core Count: 4
	Core Enabled: 4
	Thread Count: 4
	Characteristics:
		64-bit capable
		Multi-Core
		Hardware Thread
```

</details>

## 贡献者用：新增软硬件平台时可用的模板 {#template}

`uname -srvmpio`: `TODO`

<details>
<summary>`CPUCFG`</summary>

```c
// 编译并运行以下的 C 程序，将运行结果贴在此处，替换掉代码，并去掉此 fenced code block 的语言标记“c”
#include <stdio.h>
#include <larchintrin.h>

int main(void)
{
    int i;
    for (i = 0; i < 128; i++) {
        unsigned int data = __cpucfg(i);
        if (!data)
            continue;
        printf("CPUCFG.0x%-2x = 0x%08x\n", i, data);
    }
    return 0;
}
```

</details>

<details>
<summary>`/proc/cpuinfo`</summary>

```
TODO
```

</details>

<details>
<summary>`sudo dmidecode -t 0,1,2,4,7`</summary>

```
TODO
```

</details>

