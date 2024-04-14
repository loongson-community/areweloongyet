type AsmDBData = {
  insns: Insn[]
  decodetree: DecodeTreeNode
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

type DecodeTreeNode = {
  look_at: Bitfield[]
  matches: DecodeTreeMatch[]
}

type Bitfield = {
  lsb: number
  len: number
}

enum DecodeTreeAction {
  Unknown = 0,
  Finish = 1,
  Continue = 2,
}

type DecodeTreeMatch = {
  match: number
  action: DecodeTreeAction
  fmt?: string
  matched?: string
  next?: DecodeTreeNode
}
