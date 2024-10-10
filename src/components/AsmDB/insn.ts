import type { Insn } from './types'

export function getInsnMnemonic(insn: Insn, useManualSyntax: boolean): string {
  if (useManualSyntax)
    return insn.manual_mnemonic ? insn.manual_mnemonic : insn.mnemonic
  return insn.mnemonic
}

export function toSImm(uimm: number, width: number): number
export function toSImm(uimm: bigint, width: number): bigint
export function toSImm(uimm: number | bigint, width: number): number | bigint {
  if (typeof uimm == "bigint")
    return BigInt.asIntN(width, uimm)
  return Number(BigInt.asIntN(width, BigInt(uimm)))
}

export function toUImm(simm: number, width: number): bigint
export function toUImm(simm: bigint, width: number): bigint
export function toUImm(simm: number | bigint, width: number): bigint {
  return BigInt.asUintN(width, typeof simm == "bigint" ? simm : BigInt(simm))
}

export function toCHexLiteral(x: number | bigint): string {
  return x >= 0 ? `0x${x.toString(16)}` : `-0x${(-x).toString(16)}`
}
