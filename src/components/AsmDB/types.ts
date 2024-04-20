export type AsmDBData = {
  insns: Insn[]
  decodetree: DecodeTreeNode
}

export type Insn = {
  word: number
  mask: number
  mnemonic: string
  manual_mnemonic?: string
  format: InsnFormat
  manual_format?: InsnFormat
  since_rev?: string
  subsets: SubsetFlags
}

export type SubsetFlags = {
  la32?: boolean
  primary?: boolean
  la64?: boolean
  lsx?: boolean
  lasx?: boolean
  lbt?: boolean
  lvz?: boolean
  provisional?: boolean
}

export type InsnFormat = {
  repr: string
  args: InsnArg[]
}

export type InsnArg = {
  kind: ArgKind
  repr: string
  slots: ArgSlot[]
  shift_amt?: number
  add_amt?: number
}

export enum ArgKind {
  Unknown = 0,
  IntReg = 1,
  FPReg = 2,
  FCCReg = 3,
  ScratchReg = 4,
  VReg = 5,
  XReg = 6,
  SignedImm = 7,
  UnsignedImm = 8,
}

export type ArgSlot = {
  repr: string
  offset: number
  width: number
}

export type DecodeTreeNode = {
  look_at: Bitfield[]
  matches: DecodeTreeMatch[]
}

export type Bitfield = {
  lsb: number
  len: number
}

export type DecodeTreeMatch = {
  match: number
  fmt?: string
  matched?: string
  next?: DecodeTreeNode
}
