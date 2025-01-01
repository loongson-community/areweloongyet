---
sidebar_position: 4
---

# The Old World and the New World (Low-Level Details)

This documentation is primarily intended for developers working on LoongArch kernel development, distribution integration and other low-level tasks, providing technical details about the OW/NW compatibility issues and known compatibility solutions.

Known compatibility approaches include:

* [`libLoL`](https://liblol.aosc.io)

## Introduction

While programs from the old world (OW) and the new world (NW) are almost incompatible, this does not imply fundamental differences between them. On the contrary, they share many common characteristics that make compatibility technically feasible. In fact, any feature not explicitly listed as a difference between the worlds can be considered a commonality. To better understand both the differences and similarities between the old and new worlds, this document will highlight some of their key shared characteristics.

This document examines the differences and commonalities between OW and NW from both kernel and user mode perspectives, primarily focusing on their externally visible characteristics rather than internal implementation details. Build system differences are not covered, as developers typically use a complete toolchain from the same world. Non-technical differences such as business strategies and community collaboration are also outside the scope of this document.

Given that the Loongson ecosystem currently relies on the Linux kernel and glibc C runtime, and all "old-world" systems use this combination, for simplicity, when we refer to "kernel" or "user mode"/"libc", we mean Linux or glibc respectively.

## Kernel

The kernel's external interfaces can be divided into two aspects: the boot protocol, which can be viewed as an upstream interface, and system calls, which can be considered as downstream interfaces.

### Boot Protocol

At first glance, the kernel image files provided by OW distributions are in ELF format and require an OW-ported GRUB2 bootloader to boot. In contrast, NW kernel images are PE-format EFI applications (EFI Stub) that can be booted directly by UEFI firmware or through a NW-ported GRUB2 bootloader.

Looking at the specific details of parameter passing from firmware to kernel, the Linux kernels of both worlds expect different data structures from their previous boot stage. See the following diagram for illustration.

:::info Legend
* Rectangular nodes represent EFI applications (PE format images)
* Rounded nodes represent ELF format images
* Directed edges show control flow transitions, with labels indicating passed data structures
:::

```mermaid
flowchart BT
    subgraph linux [Linux]
        OWLinuxELF(["Old-World Linux (ELF)"])
        NWLinuxStub["New-World Linux (EFI stub)"]
    end
    subgraph bootloader [Bootloader]
        OWGrub2[Old-World GRUB2]
        OWGrub2N[Old-World GRUB2]
        NWGrub2[New-World GRUB2]
    end
    subgraph firmware [Firmware]
        OWUEFI[[Old-World UEFI]]
        NWUEFI[[New-World UEFI]]
    end

    OWUEFI -->|"UEFI System Table (with BPI)"| OWGrub2 -->|BPI| OWLinuxELF
    NWUEFI -->|"UEFI System Table"| OWGrub2N -->|UEFI System Table| OWLinuxELF
    NWUEFI -->|"UEFI System Table"| NWGrub2 -->|UEFI System Table| NWLinuxStub
    NWUEFI -->|"UEFI System Table"| NWLinuxStub
```

The old-world UEFI firmware comes in two versions, distinguished by their BPI structure signatures: `BPI01000` and `BPI01001`. While the UEFI firmware implementations like EDK2 share most behaviors between OW and NW, there are several notable differences:

* Different MMU states when booting the OS
    * Old World: The Direct Mapping Configuration Window (DMW) is already enabled when booting the OS, mapping virtual addresses like `0x9xxx_xxxx_xxxx_xxxx` to their corresponding physical memory space `0x0xxx_xxxx_xxxx_xxxx`. The PC register points to such virtual addresses.

      This "coincidentally" matches one of the fixed 1:1 mapping windows that Loongson Linux was required to use in the MIPS era due to architectural constraints.
      Fast forward to the LoongArch era, this "coincidentally" remains the "coherent cached" DMW configuration shared between old-world kernels and new-world kernels that haven't fully switched to TLB.

      "Coherent Cached" (CC) is a term defined in Section 2.1.7 "Storage Access Types" of the LoongArch Reference Manual Volume 1.

      Ironically, although the firmware has already configured the same DMW before the kernel gains control, the old-world kernel entry point still repeats the configuration...
      This obviously means one of these configurations is redundant!

    * New World: The DMW is not enabled when booting the OS, and the PC register points to physical addresses.

    The firmware should not, and indeed does not, make assumptions about the OS's memory management choices, let alone semi-forcing the OS to adopt a specific DMW configuration.

* Different states of non-boot CPU cores when booting the OS

    In both OW and NW, when control is transferred to the OS, non-boot CPU cores are in an idle state - blocked executing the `idle 0` instruction while waiting for interrupts. When the system needs to wake up a specific CPU core, it writes the target jump address to that core's IPI (Inter-processor interrupt) mailbox register and triggers an IPI for that core. This wakes up the core, exits the `idle 0` instruction, and continues execution. The subsequent code reads the mailbox register and jumps to the stored address.

    In NW, since DMW is not enabled on any cores during system boot, physical addresses must be written to the mailbox registers. However, in OW, since DMW is already enabled on all cores at boot, virtual addresses starting with 0x9 must be written to the mailbox registers.

    For OW firmware version `BPI01001`, it appears the firmware was additionally adapted to handle physical addresses passed through the mailbox, so cores can boot successfully whether given virtual or physical addresses.

* Pointers in UEFI tables
    * Old World: Virtual addresses in the form of `0x9xxx_xxxx_xxxx_xxxx` are used for all pointers except ACPI table addresses.
    * New World: All pointers are physical addresses.

* Memory layout information passing
    * Old World: The memory available for OS use is passed through the BPI data structure, while memory regions used or reserved by UEFI firmware are passed through the UEFI system table. The OS must combine both sources to obtain complete memory availability information.
    * New World: Complete memory availability information is passed solely through the UEFI system table.

* ACPI Data Structures:
    * Old World: Some tables in firmware version `BPI01000` followed early Loongson standards that pre-dated ACPI 6.5.

      - MADT table used `ACPI_MADT_TYPE_LOCAL_APIC` to describe CPU core interrupt controller info, and `ACPI_MADT_TYPE_IO_APIC` for CPU socket interrupt controller info.
      - In DSDT table, PCI root controller's IO resource descriptor lacked LIO controller MMIO offset information. Additionally, its IO port range didn't cover `0x0` to `0x4000`, expecting OS to unconditionally set address mapping for this range. Consequently, devices under LIO controller using IO ports in this range didn't declare dependencies on PCI root controller.
      - Missing MCFG table for describing PCI root controller information.

      These structures were incompatible with ACPI 6.5. For example, when NW kernel encounters OW `BPI01000` firmware's MADT, it interprets the system as having 0 CPUs, leading to boot failure.

      OW firmware version `BPI01001` used the same ACPI tables as NW, conforming to ACPI 6.5 or later.

    * New World: Compliant with ACPI 6.5 or later versions.

The old-world and new-world firmware also differ in how they pass essential boot information to the operating system. The new-world firmware directly passes the UEFI system table to the OS. The old-world firmware, following its MIPS-based Loongson predecessors, additionally passes a Loongson-specific "BPI" structure (`struct bootparamsinterface`, known as `struct boot_params` in Loongnix Linux source code, essentially the same thing): During boot, OW GRUB first checks for the presence of a BPI data structure in the UEFI system table. If found, indicating OW firmware, it passes the BPI structure to the OW kernel; if not found, indicating NW firmware, it passes the UEFI system table to the OW kernel instead.

再具体一些，控制权从固件交出之后，早期引导流程的差异见以下示意图。

:::info 图例
实线的边表示过程调用。有文字注解的虚线边表示数据流动，无文字注解的虚线边则表示有所简化的过程调用。
:::

```mermaid
flowchart TB
    subgraph owgrub [Old-World GRUB]
      OWGrub[Old-World GRUB]
      OWGrubCheckBPI{{ Does UEFI System Table contain BPI? }}
      OWGrub -->|Load ELF kernel into memory<br />ExitBootService<br />SetupDMW| OWGrubCheckBPI
    end
    subgraph nwgrub [New-World GRUB]
        NWGrub[New-World GRUB]
    end
    subgraph ow [Old-World Linux]
        OWKernelEntry[kernel_entry]
        OWStartKernel[start_kernel]
        OWFwInitEnv[fw_init_env]

        OWKernelEntry -.->|*fw_arg0 = a0<br />*fw_arg1 = a1<br />*fw_arg2 = a2| OWFwInitEnv
        OWKernelEntry --> OWStartKernel -.-> OWFwInitEnv

        OWCheckArg0{{fw_arg0 > 1}}
        OWCheckArg2{{fw_arg2 == 0}}
        OWBPI([BPI Flow])
        OWUEFI([NW UEFI Flow])
        OWFDT([OW FDT Flow])

        OWFwInitEnv --> OWCheckArg0
        OWCheckArg0 -->|Yes| OWBPI
        OWCheckArg0 -->|No| OWCheckArg2
        OWCheckArg2 -->|Yes| OWFDT
        OWCheckArg2 -->|No| OWUEFI
    end
    subgraph nw [New-World Linux]
        NWKernelEntry[kernel_entry]
        NWEfiEntry[efi_entry]
        NWStartKernel[start_kernel]
        NWInitEnviron[init_environ]
        NWUEFI([Subsequent Flow])

        NWKernelEntry -.->|*fw_arg0 = a0<br />*fw_arg1 = a1<br />*fw_arg2 = a2| NWInitEnviron
        NWKernelEntry --> NWStartKernel -.-> NWInitEnviron -.-> NWUEFI
        NWEfiEntry -->|ExitBootService<br />SetupDMW<br />a0 = 1<br />a1 = cmdline_ptr<br />a2 = efi_system_table| NWKernelEntry
    end

    subgraph protocol [Firmware]
        BPI[[OW Boot]]
        UEFI[[NW Boot]]
    end

    OWGrubCheckBPI -->|Yes<br />Merge system table memory info into BPI<br />a0 = argc<br />a1 = argv<br />a2 = &boot_params| OWKernelEntry
    OWGrubCheckBPI -->|No<br />a0 = 1<br />a1 = cmdline_ptr<br />a2 = efi_system_table| OWKernelEntry
    BPI --> |BPI data provided in UEFI System Table| OWGrub
    UEFI -->|No BPI data in UEFI System Table| OWGrub
    UEFI --> NWGrub -->|Direct call| NWEfiEntry
```

The diagram doesn't include detailed depiction of the new-world FDT flow as its actual logic is quite complex. You may refer to the source code for details.
However, in brief: the new world passes the FDT root pointer through a record in the UEFI system table with type `DEVICE_TREE_GUID` (`b1b621d5-f19c-41a5-830b-d9152c69aae0`) and value being the physical address of this pointer.
Therefore, whether booting with ACPI or FDT, new-world Linux follows the UEFI convention for parameter passing - achieving a remarkable unification!
In contrast, the old world lacks this unified nature.

Under different firmware boot protocols, old-world Linux interprets the three firmware parameters differently:

|Firmware Parameter|Old-World Boot Protocol Interpretation|New-World Boot Protocol Interpretation|
|-----|--------|--------|
|`fw_arg0`|`int argc`<br />Number of kernel command line arguments|`int efi_boot`<br />EFI boot flag, 0 means EFI runtime services unavailable, non-zero means available|
|`fw_arg1`|`const char *argv[]`<br />Virtual address of kernel command line argument list, used like C `main` function in user mode|`const char *argv`<br />Physical address of kernel command line as a single string|
|`fw_arg2`|`struct boot_params *efi_bp`<br />Virtual address of BPI table|`u64 efi_system_table`<br />Physical address of UEFI system table|

Loongson's compatibility support for the new-world boot protocol in their old-world Linux fork was completed shortly before the 3A6000's release. This has been pushed to downstream commercial distributions like UOS and Kylin.

As shown in the diagram, the code paths in the kernel are now essentially identical to the new world's: based on a flexible interpretation of the `fw_arg0` parameter - assuming that all "normal" kernel boots have more than one kernel command line parameter - the two boot protocols can be unambiguously distinguished in practice.

In addition, Loongson also developed old-world boot protocol compatibility support for new-world Linux in 2023, and pushed it to community distributions with commercial backgrounds that needed to support machines without new-world firmware, such as openAnolis - see openAnolis's [related commit](https://gitee.com/anolis/cloud-kernel/commit/97a912cb723611c9ab706592621249354c9615a4).
(Note: This functionality has not yet been verified by third-party community members.)
This combination of boot protocols has not been reflected in the above description.

### System Calls

The ABI framework for system calls is consistent between OW and NW kernels. This includes:
- The method of making system calls (via the `syscall 0` instruction)
- System call numbers
- Register allocation for parameters and return values 

Most system call numbers are identical between the worlds, and the definitions of structures accepted by most system calls are also the same. This section covers the differences that cause NW incompatibility with OW system calls.

#### Deprecated System Calls in the New World

As LoongArch is the most recently introduced architecture in the Linux kernel, a decision was made to no longer provide certain older system calls that exist in OW. These system calls include:

System Call Name | Number
------------|-----
`newfstatat` | 79
`fstat`      | 80
`getrlimit`  | 163
`setrlimit`  | 164

These compatibility issues can be resolved by directly implementing the deprecated system calls in the new-world kernel.

#### Signal Number

The `NSIG` macro (indicating the maximum allowed number of signals) is defined as 64 in the new world, while it's defined as 128 in the old world. This difference directly affects the size of `sigset_t` structures, which in turn impacts the size of `sigaction` structures.

Additionally, several signal-related system calls require a `sigsetsize` parameter (indicating the length of the `sigset_t` structure) and expect this value to match the kernel's definition. Consequently, the following NW system calls cannot properly handle OW user mode calls:

System Call Name | Number
------------|-----
`rt_sigsuspend`  | 133
`rt_sigaction` | 134
`rt_sigprocmask` | 135
`rt_sigpending` | 136
`rt_sigtimedwait` | 137
`pselect6`  | 72
`ppoll`  | 73
`signalfd4`  | 74
`epoll_pwait`  | 22
`epoll_pwait2`  | 441

Among these system calls, `rt_sigprocmask`, `rt_sigpending`, and `rt_sigaction` involve writing to user mode `sigset_t` structures, while the others only read from them.

To implement compatibility for these system calls, a straightforward approach would be to first override their definitions to accept 16 as the `sigsetsize` parameter. Additionally, since NW supports fewer signals than OW, system calls that read from user mode `sigset_t` structures can simply truncate the data to handle only the first 64 signals. For system calls that write to user mode `sigset_t` structures, if the user-provided `sigsetsize` parameter is 16, we clear the bits corresponding to the latter 64 signals in the sigset. Finally, for system calls that directly handle signal numbers, such as `sigaction` and `kill`, we can simply reject signal numbers greater than 64 from user mode.

This approach means that when OW programs make system calls according to the OW ABI, their actual behavior will differ slightly from the original OW system calls. For example, if using `rt_sigprocmask` to first set a signal mask and then read it back, if the set value has any bits set for the latter 64 signals, the read value will differ from what was set. Furthermore, attempts to install signal handlers for the latter 64 signals or send these signals to processes will return errors. However, since OW programs rarely rely on these additional 64 custom signals, this simplified approach can successfully handle the vast majority of OW programs.

#### User Mode Process Context

When a process receives a signal, the kernel saves the process context to the user mode stack and passes it as the third parameter to the signal handler (regardless of whether the user requested context information when registering the signal handler). The kernel also sets the return address of the signal handler to a function that will call the `rt_sigreturn` system call (see the [`setup_rt_frame` function](https://elixir.bootlin.com/linux/v6.6/source/arch/loongarch/kernel/signal.c#L959)).

When the signal handler returns, the program calls the `rt_sigreturn` system call. At this point, the kernel restores the previously saved context from the user mode stack to the process context (see the [`sys_rt_sigreturn` function](https://elixir.bootlin.com/linux/v6.6/source/arch/loongarch/kernel/signal.c#L926)). 

This mechanism allows user mode programs to modify the context within their signal handlers. When the signal handler returns, execution will continue from the location and context specified by these modifications, rather than returning to where the signal occurred.

The OW and NW `ucontext` structures are significantly different, with member offsets that vary considerably. This makes it impossible to achieve compatibility through specially arranged data structures in-place.

The memory layout of the `ucontext` structure in the old-world kernel is as follows:

Offset | Member | Length | Notes
-------|------|-----|-----
0 | `uc_flags` | 8
8 | `uc_link` | 8
16 | `uc_stack` | 24
40 | (padding) | 24
64 | `uc_mcontext.sc_pc` | 8
72 | `uc_mcontext.sc_regs[32]` | 32 × 8 | 32 general purpose registers
328 | `uc_mcontext.sc_flags` | 4
332 | `uc_mcontext.sc_fcsr` | 4
336 | `uc_mcontext.sc_none` | 4
340 | (padding) | 4
344 | `uc_mcontext.sc_fcc` | 8
352 | `uc_mcontext.sc_scr[4]` | 4 × 8 | 4 LBT registers
384 | `uc_mcontext.sc_fpregs[32]` | 32 × 32 | 32 FP registers, 32-byte aligned
1408 | `uc_mcontext.sc_reserved[4]` | 4 | 16-byte aligned, first 4 bytes store LBT's `eflags`
1412 | `uc_mcontext.sc_reserved[4092]` | 4092
5504 | `uc_sigmask` | 16
5520 | `__unused` | 112
5632
The old world's `ucontext` structure is fixed-length at 5632 bytes and stores the process context at interruption. This includes fields for LBT extension registers and floating-point extension registers, regardless of whether the process uses these instructions. When floating-point instructions are used, depending on the instruction set (FPU, LSX, LASX), the floating-point registers are stored aligned to the lower bits in `uc_mcontext.sc_fpregs`. However, this structure cannot indicate whether the process uses floating-point extensions and/or LBT extensions, nor which floating-point instruction set is in use. When restoring context, the kernel decides which floating-point extension registers to restore based on the process's current state.

The new world's `ucontext` structure data is more complex, divided into basic data and extension data. The basic data is stored in the `ucontext` structure with the following memory layout:

Offset | Member | Length | Notes
-------|------|-----|-----
0 | `uc_flags` | 8
8 | `uc_link` | 8
16 | `uc_stack` | 24
40 | `uc_sigmask` | 8
48 | `unused` | 120
168 | (padding) | 8
176 | `uc_mcontext.sc_pc` | 8
184 | `uc_mcontext.sc_regs[32]` | 32 × 8 | 32 general purpose registers
440 | `uc_mcontext.sc_flags` | 4
444 | (padding) | 4
448 | `uc_mcontext.sc_extcontext` |  | 16-byte aligned

The `uc_mcontext.sc_extcontext` field has a length of 0, being a [flexible array member](https://en.wikipedia.org/wiki/Flexible_array_member). Following the `ucontext` structure is a series of TLV (Type-Length-Value) extension data blocks that store context for extension instructions. The common header for extension data has the following memory layout:

Offset | Member | Length | Notes
Offset | Member | Length | Notes
-------|------|-----|-----
0 | `magic` | 4 | Identifies the extension data type
4 | `size` | 4
8 | `padding` | 8
16 | | | 16-byte aligned

Starting from an extension data header address, adding the length indicated by `size` gives the address of the next extension data block. The last extension data block has both `magic` and `size` fields set to 0, indicating the end of extension data.

Currently, there are 4 defined extension data types, corresponding to context data for FPU, LSX, LASX, and LBT extension instruction sets. The NW kernel generates extension data blocks based on the process's current state. Among these, FPU, LSX, and LASX context data blocks are mutually exclusive - at most one can be present.

For ordering, LBT extension context data (if present) is placed first, followed by either FPU, LSX, or LASX extension context data (if present), and finally the termination marker.

The memory layout for each extension type is as follows:

FPU extension instruction set, `magic` = `0x46505501`

Offset | Member | Length | Notes
-------|------|-----|-----
0 | `regs[32]` | 32 × 8 | 32 FP registers
256 | `fcc` | 8
264 | `fcsr` | 4
268 | (padding) | 4
272

LSX 扩展指令集，`magic` = `0x53580001`

Offset | Member | Length | Notes
-------|------|-----|-----
0 | `regs[2*32]` | 32 × 16 | 32 FP registers
512 | `fcc` | 8
520 | `fcsr` | 4
524 | (padding) | 4
528

LASX extension instruction set, `magic` = `0x41535801`

Offset | Member | Length | Notes
-------|------|-----|-----
0 | `regs[4*32]` | 32 × 32 | 32 FP registers
1024 | `fcc` | 8
1032 | `fcsr` | 4
1036 | (padding) | 4
1040

LBT 扩展指令集，`magic` = `0x42540001`

Offset | Member | Length | Notes
-------|------|-----|-----
0 | `regs[4]` | 4 × 8 | 4 个 LBT 寄存器
32 | `eflags` | 4
36 | `ftop` | 4
40

Comparing the `ucontext` data between OW and NW, we find that the layout of `uc_flags`, `uc_link`, and `uc_stack` fields is consistent, and both worlds pad `uc_sigmask` to 1024 bits (128 bytes). However, the order of `uc_mcontext` and `uc_sigmask` fields is reversed between OW and NW, and their `uc_mcontext` structures differ significantly.

The NW implementation uses variable-length TLV (Type-Length-Value) extension data to store context for extended instruction sets, leaving room for future extensions. In contrast, the OW uses fixed-length structures, with 4096 reserved bytes for future extension contexts. Additionally, in the OW implementation, the LBT extension's `ftop` register isn't stored, and the `eflags` register occupies the first 4 bytes of the aforementioned reserved space.

Kernel-level compatibility for `ucontext` data between OW and NW is infeasible because the kernel cannot determine which format the userspace program expects. Even if the kernel were modified to identify and mark processes based on their executable format, it still couldn't handle cases where a program dynamically links both OW and NW libraries, as it wouldn't know which format each signal handler expects. Therefore, compatibility must be implemented in user mode.

Based on incomplete testing, Chromium and Electron-based applications' sandbox mechanism [verifies](https://chromium.googlesource.com/chromium/src/+/refs/tags/98.0.4758.141/sandbox/linux/seccomp-bpf/trap.cc#192) that the interrupt address recorded in the `ucontext` structure received by the `SIGSYS` signal handler matches the address in the `siginfo` structure, and actively uses the `ucontext` data. Consequently, old-world Electron-based applications require sandbox disabled to run properly when using only kernel-level compatibility with a complete old-world user mode directory tree.

## User Mode

As observed up to now (February 2024), the glibc version packaged in old-world systems is 2.28, while upstream glibc support for LoongArch started with version 2.36. At the time of writing, the latest glibc version is 2.39, though most new-world systems currently package glibc 2.37 or 2.38. Given glibc's excellent backward compatibility - programs running on older glibc versions generally work on newer versions without issues - this document focuses on comparing glibc 2.38 with the old-world ported glibc 2.28. Future new-world glibc versions will be compatible with version 2.38, so the conclusions in this document should remain applicable for newer glibc versions in new-world systems.

### ELF File Format

The ELF file format is identical between the old world and the new world, including the architecture field `e_machine` in the ELF header, which is set to 258 in both worlds. Most other structures are also consistent. The only difference lies in `bit[7:6]` of the `e_flags` field. OW binaries have these bits set to `0`, while NW binaries have them set to `1`[^b1]. When examining an ELF file's header information using `readelf --headers`, the presence of `OBJ-v1` in the `Flags:` section under `ELF Header:` indicates the file was compiled for the new world; conversely, `OBJ-v0` indicates compilation for the old world.

This flag provides the most direct and reliable[^b2] method to determine whether an ELF file was compiled for OW or NW. However, as of mid-February 2024, neither world's runtime components (including the kernel's ELF loader and glibc's dynamic linker) reject loading ELF files based on this flag, nor do they behave differently because of it.

[^b1]: In fact, this flag's true purpose is to indicate to the linker which version of relocation instruction semantics the object file (`.o`) contains. 
    These version-specific relocation instructions are not used in dynamic linking and thus don't appear in final linking products (`.so` and executables).
    Therefore, while the flag's original meaning is irrelevant for shared libraries and executables,
    it conveniently serves to distinguish between OW and NW programs and dynamic libraries.

[^b2]: This flag was introduced in binutils 2.40 [via this commit](https://github.com/bminor/binutils-gdb/commit/c4a7e6b56218e1d5a858682186b542e2eae01a4a).
    Consequently, NW programs and dynamic libraries generated by earlier binutils versions might lack the `OBJ-v1` flag.
    Since binutils 2.40 was released in early 2023, when the NW LoongArch ecosystem hadn't yet developed a viable toolchain environment,
    the number of such programs and libraries should be minimal.

### Program Interpreter

The Program Interpreter is a field in dynamically linked ELF executables that specifies the path to the required dynamic linker. When loading a dynamically linked ELF executable, the kernel loads the dynamic linker according to this field. The OW and NW have different program interpreter paths:

* NW path: `/lib64/ld-linux-loongarch-lp64d.so.1`
* OW path: `/lib64/ld.so.1`

This path is hardcoded into all dynamically linked executables. The difference in paths directly prevents old-world programs from running in the new world and vice versa. When attempting to execute a program from the other world, the error `No such file or directory` occurs because the corresponding program interpreter cannot be found.

### Calling Convention

The calling conventions between the old world and new world are identical in terms of parameter passing and return value handling. Generally, both worlds prioritize using registers for parameter passing, with additional parameters passed on the stack, and return values passed through registers. Furthermore, both worlds use the same register numbers for parameter and return value passing.

Additionally, both worlds share identical sets of caller-saved and callee-saved registers.

### User Mode Compatibility Overview

The distinct ELF header markers and different program interpreter paths between the old world (OW) and new world (NW) make it possible to run OW programs in NW systems without requiring `chroot`.

There are two technical approaches to achieve this: isolation-based and hybrid. In the isolation-based approach, OW executables call the OW `ld.so`, which modifies its search path to avoid NW dynamic library paths and only loads OW dynamic libraries. Meanwhile, NW executables use the original NW `ld.so` and naturally won't load OW libraries since they're stored in separate paths. This approach maintains a clear separation between OW and NW environments.

For compatibility, the isolation-based approach must include a complete set of dynamic libraries required by OW programs. Framework-type libraries that search for plugin libraries in specific paths need recompilation to adjust their search locations. Other simple dynamic libraries can be ported directly from the OW. This may lead to significant storage overhead. Additionally, if a user's NW system has plugins installed but the OW compatibility layer doesn't provide OW versions of these plugins, certain functionality may be missing. The isolation approach has clear boundaries and doesn't require extensive glibc modifications. In fact, it only needs to implement context parameter (`ucontext`) translation in signal handlers, leaving other compatibility issues to the kernel. Furthermore, its correctness is easier to verify because the clear OW/NW separation ensures the OW glibc can correctly interpret data structures as OW versions without misinterpretation risks.

The hybrid approach, conversely, leverages the identical calling conventions between OW and NW by providing a modified glibc. This glibc provides multiple symbol versions, allowing both OW programs and NW dynamic libraries to link with it simultaneously. This approach mixes OW and NW environments and doesn't require a complete set of OW dynamic libraries, instead utilizing NW libraries directly. This saves storage space and avoids completeness concerns regarding included libraries. However, the hybrid approach requires complex glibc modifications. Additionally, it may face challenges in correctly identifying whether data structures are NW or OW versions, potentially leading to misinterpretation issues.

### glibc 符号版本

众所周知，glibc 具有相当良好的兼容性。这是通过符号版本（Symbol Versioning）来实现的。
具体而言 glibc 中所有的符号都相应地被分配了一个符号引入时的版本号。如果一个符号的 ABI 发生了变化，
那么则会引入同名符号的新版本，而旧版本的符号则会被保留（实现可能会被替换为兼容的实现）。这个版本号是一个字符串，
在动态链接的过程中，只有版本号相同的符号才会被链接。这样，即使 glibc 的 ABI 发生了变化，
由于和旧版本 glibc 编译链接产生的可执行程序中的符号版本号是旧版本的，所以这个可执行程序在新版本 glibc 上运行时，
也会使用旧版本的符号，从而保证了兼容性。glibc 的符号名称和关联的版本定义，位于其各目录的 `Versions` 文件中。
例如 [`io/Versions`](https://elixir.bootlin.com/glibc/glibc-2.38/source/io/Versions)。在下文中，
我们称在 `Versions` 文件中定义的符号版本号为“源码版本号”。从这个定义可知，一个符号的源码版本号是与架构无关的。
与源码版本号相区别，在编译生成的二进制 glibc 库文件中定义的符号版本号，我们称之为“二进制版本号”。
这个版本号会在编译链接其它可执行程序时被写入到可执行程序的符号表中，同时也是动态链接器在加载可执行程序时用来检查符号版本的版本号。
在类似 i386 这样的架构上，一个符号的源码版本号和二进制版本号是一致的。但是，这并非对所有架构都成立。

我们可以注意到，很多符号都是在最早的 2.0 版本中就定义了的，但是并非所有架构都是从 2.0 版本开始支持的。
例如 riscv64 即是在 2.27 版本中才开始支持的。那么对于 riscv64 架构，
是不可能存在与 2.26 或更早版本的 glibc 编译链接的程序的。这意味着，如果有符号在 2.0 至 2.26 版本之间改变了 ABI，
那么这个符号的旧版本就没有存在的必要了。glibc 对该问题的处理方式是，定义了每一个架构的“纪元版本号”，
即该架构引入时所在的 glibc 版本号。对于所有的符号，如果其源码版本号小于该架构的纪元版本号，
那么在该架构上编译出来的 glibc 中，二进制版本号将会被设置为纪元版本号；如果有多个小于纪元版本号的源码版本号，
则仅编译最新的那一个，并将其二进制版本号设置为纪元版本号。

例如：`setrlimit` 有两个源码版本，分别是 `GLIBC_2.0` 和 `GLIBC_2.2`，而 riscv64 的纪元版本号是 2.27，
那么在 riscv64 上编译出来的 glibc 中，`setrlimit` 的二进制版本号将会被设置为 `GLIBC_2.27`，
其实际内容是 `GLIBC_2.2` 版本的符号。假若未来 glibc 2.50 引入了一个新的 `setrlimit` 的源码版本 `GLIBC_2.50`，
那么在 riscv64 上编译出来的 glibc 中，`setrlimit` 将会存在两个二进制版本号，分别是 `GLIBC_2.27` 和 `GLIBC_2.50`。

新旧世界在符号版本方面存在差异的来源是，旧世界的龙架构的纪元版本号是 2.27[^a1]，而新世界的是 2.36。
由于 glibc 中的大多数符号的源码版本号都是从 2.0 开始的，因此在旧世界中，
glibc 大多数符号的二进制版本号就是 `GLIBC_2.27`；而新世界中，相应地，大多数符号的二进制版本号是 `GLIBC_2.36`：
这样，即使通过修改二进制可执行程序，将其程序解释器强行修改为另一个世界的，也无法正常运行，
因为它期待要加载的 glibc 的符号版本在异世界中不存在。类似地，如果一个新世界的可执行程序试图加载（例如通过 `dlopen`）旧世界的（非 glibc 的）动态链接库，
也是无法正确加载的，因为该旧世界动态链接库依赖的 glibc 的符号版本在新世界中不存在。

[^a1]: 巧合的是，riscv64 的[纪元版本号](https://elixir.bootlin.com/glibc/glibc-2.38/source/sysdeps/unix/sysv/linux/riscv/shlib-versions#L2)也是 2.27

更为复杂的情况出现在 `libpthread` 中。旧世界的龙架构中，唯独 `libpthread` 的纪元版本号是 2.0，
即旧世界中 `libpthread` 和 `libc` 的纪元版本号不一致。glibc 中已知的全部 Linux 支持的架构中，
只有旧世界的龙架构存在这样的现象。这样做法的原因不得而知[^a2]，但是导致的后果是明确的。在 glibc 2.34
之前，`libpthread` 和 `libc` 是分立的两个库。有部分符号，例如 `open`、`write` 等，
在两个库中都有定义，但是其包括的代码可能不同（通过宏定义在编译期产生区别）。
一个多线程程序在执行时，其调用的 `open`、`write` 等符号，由 `libpthread` 覆盖了 `libc` 中的定义。
在 glibc 2.34 以及此后的版本，`libpthread` 合并进了 `libc`，
于是 `libc` 中 `open`、`write` 等符号始终是多线程的版本。
旧世界中 `libpthread` 和 `libc` 的纪元版本号不一致，造成了这样的 `open`、`write`
等符号在旧世界存在两个二进制版本号，分别是 `libpthread` 中的 `GLIBC_2.0` 和 `libc` 中的 `GLIBC_2.27`。

[^a2]: 但是可以注意到 MIPS 架构的[纪元版本号](https://elixir.bootlin.com/glibc/glibc-2.38/source/sysdeps/unix/sysv/linux/mips/shlib-versions#L25)是 2.0，并跳过了 2.1。事实上，旧世界的 `libpthread` 的纪元版本号也是 2.0，并同样跳过了 2.1。


### glibc 库列表

动态链接的 ELF 文件（包括库和可执行程序）对于需要引入的带有版本号的符号，都会描述该符号所属的动态链接库的名称。
但是 glibc 在执行动态链接时，会忽略实际提供对应版本符号的库的名称，这一行为在 glibc 2.30 被[引入](https://github.com/bminor/glibc/commit/f0b2132b35248c1f4a80f62a2c38cddcc802aa8c)。这为 glibc 后续将符号从其它库向 `libc`
中集中提供了便利。以 `libpthread` 中的 `pthread_join` 为例。在 glibc 2.34 以及之后的版本中，
该符号实际由 `libc` 提供，而 `libpthread` 变成了一个空白占位。对于和 glibc 2.34 以前版本链接的程序或其它库，
显然需要的是 `libpthread` 中的 `pthread_join`。在动态链接时，glibc 会正常查找到 `libc`
和 `libpthread` 库文件，从而满足了该程序和该库对所依赖的库的需求。当具体要查找 `pthread_join` 时，
glibc 的动态链接器则不考虑所要求的 `pthread_join` 的提供者，只要载入的所有库中定义有 `pthread_join` 的对应版本，
即可完成动态链接。

在此之后，且在新世界的纪元版本 2.36 前，又有一些库的符号被移动到了 `libc` 中，这些库文件在新世界就彻底不存在了。
然而，对于旧世界的程序而言，这些库文件仍然是需要的，应该提供占位库文件。下表是新旧世界中，
所有对外供动态链接的库的列表。

库名 | 旧世界 | 新世界 | 备注
-----|------|------|----
`libBrokenLocale.so.1` | 存在 | 存在
`libanl.so.1` | 存在 | 不存在 | 需要补充占位库
`libc.so.6` | 存在 | 存在
`libc_malloc_debug.so.0` | 不存在 | 存在 | 该库在 2.34 引入
`libcrypt.so.1`| 存在 | 不存在 | 该库在新世界默认禁用
`libdl.so.2` | 存在 | 存在（占位）
`libm.so.6` | 存在 | 存在
`libnsl.so.1` | 存在 | 不存在 | 该库在新世界默认禁用
`libpthread.so.0` | 存在 | 存在（占位）
`libresolv.so.2` | 存在 | 存在
`librt.so.1` | 存在 | 存在（占位）
`libthread_db.so.1` | 存在 | 存在
`libutil.so.1` | 存在 | 不存在 | 需要补充占位库

### 具体函数的行为区别

新旧世界 glibc 提供的函数的行为存在一些区别。这些区别是内核提供的用户态接口的不同导致的。
本节将会讨论这些函数的行为区别。这里的“行为”主要指的是 glibc 对函数调用者呈现的行为。但是，
在特定的讨论中，我们也会涉及到其向内核发出系统调用的行为。

#### 信号相关

我们知道，新世界内核中，最大的信号编号是 64；而旧世界内核中，最大的信号编号是 128。
这导致了内核接受的 `sigset_t` 数据的大小不同。然而，glibc 中定义的 `sigset_t` 结构体的大小是相同的，
总是能[容纳](https://elixir.bootlin.com/glibc/glibc-2.38/source/sysdeps/unix/sysv/linux/bits/types/__sigset_t.h) 1024 个信号。
这意味着，新世界的 glibc 中的 `sigset_t` 数据的大小是 128 字节。因此，所有接受 `sigset_t` 结构体的 glibc 函数的
 ABI 是兼容的，不至于出现数据溢出的情况。所有读取 `sigset_t` 结构体的新世界函数，完全可以读取旧世界程序提供的 `sigset_t` 结构体，并正常工作。
所有写入 `sigset_t` 结构体的新世界函数，也可以写入旧世界程序提供的 `sigset_t` 结构体。由于旧世界的程序会使用其中的前 128 个比特位（即 128 个信号），
而写入 `sigset_t` 结构体的新世界函数仅会写入前 64 个比特位，所以需要补充清零随后的 64 个比特位，以保证旧世界的程序不会接收到未初始化的数据。
此外，glibc 还提供了一些函数，用于修改 `sigset_t` 结构体或对其进行逻辑运算，这些函数仅会操作对应世界中可用的信号编号所对应的比特位，
因此对外呈现的行为有所不同。

下列函数属于 `sigset_t` 编辑修改类函数，其所能操作的信号编号的范围不同：

- `sigorset`
- `sigandset`
- `sigisemptyset`
- `sigismember`
- `sigaddset`
- `sigfillset`
- `sigemptyset`
- `sigdelset`

下列函数属于只读 `sigset_t` 的函数，新世界的该函数可以正常读取旧世界程序提供的 `sigset_t`：

- `epoll_pwait2`
- `epoll_pwait`
- `ppoll`
- `__ppoll_chk`
- `pselect`
- `signalfd`
- `sigwaitinfo`
- `sigwait`
- `sigtimedwait`
- `__sigsuspend`
- `sigsuspend`

下列函数要写入 `sigset_t`，如果新世界的该函数要写入旧世界提供的 `sigset_t`，还需要补充清零随后的 64 个比特位：

- `sigpending`
- `pthread_sigmask`
- `sigprocmask`

下列函数虽然读写了 `sigset_t`，但是完整拷贝了 `sigset_t` 结构体，故其行为与最大的信号编号无关：

- `posix_spawnattr_getsigmask`
- `posix_spawnattr_getsigdefault`
- `posix_spawnattr_setsigmask`
- `posix_spawnattr_setsigdefault`

#### `ucontext` 相关

`ucontext_t` 结构体出现在两种地方：一是在信号处理函数的第三个参数中[^1]；二是在 `getcontext`、`setcontext`、`makecontext`、`swapcontext` 函数中[^2]。
对 glibc 的用户而言，在这两种地方的 `ucontext_t` 结构体应当能互操作[^3]。例如，一个信号处理函数在接受到信号时，
将此前用 `getcontext` 函数保存的 `ucontext_t` 结构体复制到其第三个参数所指位置，那么在该信号处理函数结束后，
程序流将会转向 `getcontext` 函数保存的那个上下文；如果这个信号处理函数又将收到的原始 `ucontext_t` 保存到其它位置，
然后在此后的某个时刻，对保存的 `ucontext_t` 调用 `setcontext` 函数，即可将程序流转回到发生信号中断的上下文。
同时注意到，信号处理函数接受的 `ucontext_t` 结构体直接来自于内核，而 `*context` 函数是由 glibc 提供的，
所以就 `ucontext_t` 而言，glibc 提供的版本和内核提供的版本必须完全二进制兼容。这一点与其它的结构体不同，
其它的结构体，glibc 可以提供与内核不同的版本，只要 glibc 函数能正确将二者转换即可。例如，`sigaction` 结构体，
glibc 提供的版本和内核提供的版本是不一致的[^4]，需要 glibc 函数将二者转换。

[^1]: [`sigaction(2)`](https://man7.org/linux/man-pages/man2/sigaction.2.html) “The siginfo_t argument to a SA_SIGINFO handler” 一节
[^2]: [`getcontext(3)`](https://man7.org/linux/man-pages/man3/getcontext.3.html)
[^3]: [`getcontext(3)`](https://man7.org/linux/man-pages/man3/getcontext.3.html) “The function setcontext() restores the user context” which “should have
       been … received as the third argument to a signal handler”
[^4]: 对比 [`sigaction`](https://elixir.bootlin.com/glibc/glibc-2.38/source/sysdeps/unix/sysv/linux/bits/sigaction.h#L27) 和
       [`kernel_sigaction`](https://elixir.bootlin.com/glibc/glibc-2.38/source/sysdeps/unix/sysv/linux/kernel_sigaction.h#L9)

截至 glibc 2.38 版本，新世界的 `*context` 函数仅能处理 `ucontext_t` 结构体中的通用（整数）寄存器部分，而不能处理浮点、向量扩展和 LBT 扩展部分。
旧世界的 `*context` 函数能处理 `ucontext_t` 结构体中通用（整数）寄存器和浮点寄存器，但不能处理向量扩展和 LBT 扩展部分。
此外，旧世界 glibc 提供的 `ucontext_t` 定义[^5]与旧世界内核[^6]的定义对比，可以发现前者缺少用于存放 LBT 扩展寄存器的 `uc_mcontext.sc_scr[4]` 字段，
致使后续用于存放浮点寄存器的 `uc_mcontext.sc_fpregs[32]` 字段的偏移量发生了变化。这意味着，
旧世界的 `*context` 函数在处理旧世界内核提供给信号处理函数的 `ucontext_t` 结构体时，无法正确处理浮点寄存器。
综上所述，旧世界 glibc 也仅能正确处理 `ucontext_t` 结构体的通用（整数）寄存器部分。这样，在功能上，
恰好新旧世界达成了一致——都只能正确处理通用寄存器部分。

[^5]: 可以在 Loongnix 发行版的 `/usr/include/loongarch64-linux-gnu/sys/ucontext.h` 找到
[^6]: 可以在 Loongnix 发行版的 `/usr/include/loongarch64-linux-gnu/bits/sigcontext.h` 找到

glibc 提供了两个函数，可以被用于注册信号处理函数，这两个函数分别是 `sigaction` 和 `signal`。
其中，`signal` 函数是对 `sigaction` 函数的封装。这样，无论是如何注册的信号处理函数，
都会在第三个参数中接受到一个 `ucontext_t` 结构体指针。但是根据 glibc [文档](https://man7.org/linux/man-pages/man2/signal.2.html)，
`signal` 函数注册的信号处理函数只应该接受第一个参数。这意味着，如果 `signal` 函数注册的信号处理函数
遵循了文档的要求，只接受第一个参数，那么它会忽略第三个参数，即 `ucontext_t` 结构体指针会被忽略。
这意味着，`signal` 函数注册的信号处理函数，是新旧世界无关的，不需要针对这样的信号处理函数做任何兼容性处理。
而 `sigaction` 函数注册的信号处理函数，是新旧世界相关的，需要额外的兼容性处理。一种可能的兼容性处理是，
当用户调用 `sigaction` 函数注册一个接受旧世界的 `ucontext_t` 结构体信号处理函数时，实际不注册这个函数，
而是注册一个包裹函数，这个包裹函数接受新世界的 `ucontext_t` 结构体，并在栈上相应构造一个旧世界的 `ucontext_t` 结构体，
然后调用用户提供的信号处理函数；在用户提供的信号处理函数返回后，将旧世界的 `ucontext_t` 结构体的内容拷贝回新世界的 `ucontext_t` 结构体中。
需要注意的是，信号处理函数无法接受自定义的参数，这意味着原始用户提供的信号处理函数的地址必须以某种方式保存下来，
以便包裹函数调用它。而在实现这一点时要十分小心地处理锁和信号屏蔽，因为整个这个注册信号处理函数的过程不再是原子的。

无论如何处理，都不会改变新旧世界 `ucontext_t` 结构体完全不兼容的事实，也无法扭转旧世界 glibc
和旧世界内核 `ucontext_t` 结构体存在差异的现状，因此如果出现了新旧世界可执行程序和动态链接库的混合链接，
并且存在将 `ucontext_t` 结构体在新旧世界间传递的情况，始终无法保证正确识别 `ucontext_t` 结构体是新世界的还是旧世界的。
不过幸运的是，这样的情况十分罕见。

下列函数涉及 `ucontext_t` 结构体，因此新旧世界的函数完全不二进制兼容：

- `getcontext`
- `setcontext`
- `makecontext`
- `swapcontext`

下列函数涉及注册能接收 `ucontext_t` 结构体的信号处理函数，因此需要额外的兼容性处理：

- `sigaction`

下列函数注册的信号处理函数会忽略 `ucontext_t` 结构体指针，因此无需特殊处理：

- `signal`

#### longjmp 相关

`setjmp`、`sigsetjmp`、`longjmp`、`siglongjmp` 函数是用于实现非局部跳转的函数。
其中 `set*jmp` 函数会将当前的程序状态（可选地，包括当前的信号掩码，即 sigmask）保存到一个 `jmp_buf` 结构体中，
而 `*longjmp` 函数则将上述状态恢复。这些函数的行为与 `*context` 函数类似。在新旧世界中，
`jmp_buf` 结构体的定义完全一致，因此这些 `*jmp` 函数是完全二进制兼容的。

下列函数涉及 `jmp_buf` 结构体，在新旧世界间完全兼容：

- `setjmp`
- `sigsetjmp`
- `longjmp`
- `siglongjmp`

#### `fstat` 相关

新世界的内核中，缺少 `fstat` 和 `newfstatat` 系统调用。这两个系统调用可以被用于获取文件的元数据。
其中，`fstat` 可以获取一个打开的文件描述符（file descriptor, fd）所对应的文件的元数据；
而 `newfstatat` 则既可以获取一个打开的文件描述符所对应的文件的元数据，也可以获取一个路径所对应的文件的元数据。
在操作对象上，`statx` 与 `newfstatat` 是一致的，但是可以按需返回更多的信息。因此，在功能上，
`statx` 是 `fstat` 和 `newfstatat` 的超集，并取代了这两个系统调用。

在 2.38 的 glibc 中，所有 `*stat*` 函数会在编译期通过宏指令检查内核是否提供了 `fstat` 或 `newfstatat` 的定义，
如果没有，那么这些函数会调用 `statx`[^7] 并负责转换数据结构。这意味着，与旧世界相比，这些 `*stat*` 函数对外呈现的行为是不变的，
新旧世界的函数是二进制兼容的。本节会着重讨论其向内核发出系统调用的行为区别。

[^7]: 这些函数最终会调用 [__fstatat64_time64](https://elixir.bootlin.com/glibc/glibc-2.38/source/sysdeps/unix/sysv/linux/fstatat64.c#L157)

对于旧世界上基于 Chromium 的浏览器和基于 Electron 的应用程序而言，Chromium 基于 seccomp 的沙箱机制会针对 `statx`
[返回](https://chromium.googlesource.com/chromium/src/sandbox/+/7462a4fd179376882292be2381a22df6819041c7%5E%21)
`ENOSYS` 错误，期待沙箱内的进程自行回落至 `fstat` 或 `newfstatat`。
这是因为，seccomp [无法审查](https://lwn.net/Articles/799557/)系统调用的指针参数背后的内容。
而 Chromium 的一种沙箱规则则要求程序只能操作已经打开的 fd，而不能访问任何系统路径，
因此只能放行（在新世界龙架构内核中不存在的）`fstat` ，并通过 `SIGSYS` 的钩子[检查](https://chromium.googlesource.com/chromium/src/sandbox/+/b3267c8b40b6133b2db5475caed8f6722837a95e%5E%21/#F2) `newfstatat` 并将其重写为 `fstat`。

为了能让这部分程序正常运行，需要调整上述函数的行为，当 `statx` 返回 `ENOSYS` 时，
改为使用 `fstat` 或 `newfstatat`；同时，需要在新世界的内核中补充 `fstat` 和 `newfstatat` 的实现。

glibc 中下列导出函数涉及 `fstat` 和 `newfstatat`，为兼容目前尚未适配 `statx` 的 Chromium 的沙箱机制，需要额外的兼容性处理：

- `stat`
- `fstat`
- `lstat`
- `fstatat`

被上述函数引用，实际进行系统调用的 glibc 内部函数有：

- `__fstatat64_time64`

此外，还有为 2.33 之前版本的 glibc 提供的兼容符号所指向的函数也涉及该问题：

- `___fxstat64`
- `__fxstatat64`
- `___lxstat64`
- `___xstat64`

#### 杂项

新世界系统中同时提供 `clone3` 和 `clone`，而旧世界系统中仅提供 `clone`。
新世界的 glibc 会在编译期检查内核是否提供了 `clone3`，如果提供了，
那么 `fork` 和 `pthread_create` 等函数会调用 `clone3`。
在运行时，如果 `clone3` 返回 `ENOSYS`，
则[回落](https://elixir.bootlin.com/glibc/glibc-2.38/source/sysdeps/unix/sysv/linux/clone-internal.c#L109)到 `clone`。
该行为不会影响新旧世界函数的二进制兼容性。但是，`clone3` 的参数都通过内存中的结构体传递；因此出于上一节提到的原因，Chromium 的 seccomp 沙箱机制也无法审查 `clone3` 的参数，
因此对 `clone3` 一律[返回](https://chromium.googlesource.com/chromium/src/sandbox/+/482404adee4fc0487452c7ae5ac9c192b0f4fd30%5E%21) `ENOSYS` 错误，
期待 glibc 回落使用 `clone` 系统调用。
该机制使得在 `clone3` 方面，新世界的 glibc 库函数可以兼容旧世界的 Chromium 沙箱。
然而，个别基于 Electron 的旧世界应用，由于打包的 Chromium 版本较旧，其沙箱机制不支持针对
`clone3` 返回 `ENOSYS`，而是返回其它的错误，致使 glibc 无法回落使用 `clone`，造成程序无法运行。

为了避免这一问题，如果要实现新旧世界混合链接，需要禁用 `clone3` 的支持，直接调用 `clone`。

此外，旧世界的 glibc 对外导出了 `___brk_addr` 符号，而新世界没有导出。
