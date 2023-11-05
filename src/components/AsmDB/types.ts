type AsmDBData = {
  insns: Insn[]
}

type Insn = {
  word: number
  mask: number
  mnemonic: string
  manual_mnemonic?: string
  format: InsnFormat
  manual_format?: InsnFormat
  since_rev?: string
  subsets: SubsetFlags
}

type SubsetFlags = {
  la32?: boolean
  primary?: boolean
  la64?: boolean
  lsx?: boolean
  lasx?: boolean
  lbt?: boolean
  lvz?: boolean
  provisional?: boolean
}

type InsnFormat = {
  repr: string
  args: InsnArg[]
}

type InsnArg = {
  kind: ArgKind
  repr: string
  slots: ArgSlot[]
  shift_amt?: number
  add_amt?: number
}

enum ArgKind {
  Unknown = 0,
}

type ArgSlot = {
  repr: string
  offset: number
  width: number
}
