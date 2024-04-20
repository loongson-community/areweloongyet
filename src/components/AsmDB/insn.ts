import type { Insn } from './types'

export function getInsnMnemonic(insn: Insn, useManualSyntax: boolean): string {
  if (useManualSyntax)
    return insn.manual_mnemonic ? insn.manual_mnemonic : insn.mnemonic
  return insn.mnemonic
}
