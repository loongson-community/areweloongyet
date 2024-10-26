import {
  reprFloatDetailingZeroStatus,
  toCHexLiteral,
  toSImm,
  toUImm,
} from './insn'
import { MinifloatFormat } from './minifloat'
import { isFloatElemTy, VecElemType, vecElemWidthBits, Vlen } from './simd'

export const VldiMinifloatFormat = new MinifloatFormat(3, 2, 4, false)

export enum VldiFunction {
  BroadcastU8To8 = 0b000_00,
  BroadcastS10To16 = 0b001_00,
  BroadcastS10To32 = 0b010_00,
  BroadcastS10To64 = 0b011_00,
  BroadcastU8To32 = 0b10000,
  BroadcastU8Shl8To32 = 0b10001,
  BroadcastU8Shl16To32 = 0b10010,
  BroadcastU8Shl24To32 = 0b10011,
  BroadcastU8To16 = 0b10100,
  BroadcastU8Shl8To16 = 0b10101,
  BroadcastU8FFTo32 = 0b10110,
  BroadcastU8FFFFTo32 = 0b10111,
  BroadcastU8To8Alternate = 0b11000,
  BroadcastBitExpandedU8To64 = 0b11001,
  BroadcastVldiMinifloatToF32 = 0b11010,
  BroadcastVldiMinifloatToEvenF32 = 0b11011,
  BroadcastVldiMinifloatToF64 = 0b11100,
}

function isOutputElemsSigned(f: VldiFunction): boolean {
  switch (f) {
    case VldiFunction.BroadcastS10To16:
    case VldiFunction.BroadcastS10To32:
    case VldiFunction.BroadcastS10To64:
      return true
    default:
      return false
  }
}

export const elemTypesByVldiFunction: { [key in VldiFunction]: VecElemType } = {
  [VldiFunction.BroadcastU8To8]: VecElemType.I8,
  [VldiFunction.BroadcastS10To16]: VecElemType.I16,
  [VldiFunction.BroadcastS10To32]: VecElemType.I32,
  [VldiFunction.BroadcastS10To64]: VecElemType.I64,
  [VldiFunction.BroadcastU8To32]: VecElemType.I32,
  [VldiFunction.BroadcastU8Shl8To32]: VecElemType.I32,
  [VldiFunction.BroadcastU8Shl16To32]: VecElemType.I32,
  [VldiFunction.BroadcastU8Shl24To32]: VecElemType.I32,
  [VldiFunction.BroadcastU8To16]: VecElemType.I16,
  [VldiFunction.BroadcastU8Shl8To16]: VecElemType.I16,
  [VldiFunction.BroadcastU8FFTo32]: VecElemType.I32,
  [VldiFunction.BroadcastU8FFFFTo32]: VecElemType.I32,
  [VldiFunction.BroadcastU8To8Alternate]: VecElemType.I8,
  [VldiFunction.BroadcastBitExpandedU8To64]: VecElemType.I64,
  [VldiFunction.BroadcastVldiMinifloatToF32]: VecElemType.F32,
  [VldiFunction.BroadcastVldiMinifloatToEvenF32]: VecElemType.F32,
  [VldiFunction.BroadcastVldiMinifloatToF64]: VecElemType.F64,
}

const vldiImmWidth = 13 // {v,xv}ldi imm is Sj13

export function makeVldiSImm(
  f: VldiFunction,
  dataUImm: number,
  minifloatBitRepr: number,
): number {
  if (isFloatElemTy(elemTypesByVldiFunction[f])) dataUImm = minifloatBitRepr

  const uimm = (f << 8) | dataUImm
  return toSImm(uimm, vldiImmWidth)
}

export function decomposeVldiSimm(simm: number): [VldiFunction, number] {
  const uimm = Number(toUImm(simm, vldiImmWidth))

  const imm12_10 = (uimm >> 10) & 0b111
  if (imm12_10 == 0b000) return [VldiFunction.BroadcastU8To8, uimm & 0xff]
  else if (imm12_10 == 0b001 || imm12_10 == 0b010 || imm12_10 == 0b011)
    return [imm12_10 << 2, toSImm(uimm & 0x3ff, 10)]

  const imm12_8 = (uimm >> 8) & 0b11111
  if (isFloatElemTy(elemTypesByVldiFunction[imm12_8]))
    return [imm12_8, VldiMinifloatFormat.asNumber(uimm & 0xff)]

  return [imm12_8, uimm & 0xff]
}

function expandU8BitsToU64(uimm: number): bigint {
  let result = 0n
  for (let i = 0n; i < 8; i++) {
    if (uimm & 1) result |= 0xffn << (i * 8n)
    uimm >>= 1
  }
  return result
}

function performVldi(
  vlen: Vlen,
  f: VldiFunction,
  param: number,
): number[] | bigint[] {
  const elemTy = elemTypesByVldiFunction[f]
  const numElems = vlen / vecElemWidthBits[elemTy]

  switch (f) {
    case VldiFunction.BroadcastU8To8:
    case VldiFunction.BroadcastS10To16:
    case VldiFunction.BroadcastS10To32:
    case VldiFunction.BroadcastS10To64:
    case VldiFunction.BroadcastU8To32:
    case VldiFunction.BroadcastU8To16:
    case VldiFunction.BroadcastU8To8Alternate:
    case VldiFunction.BroadcastVldiMinifloatToF32:
    case VldiFunction.BroadcastVldiMinifloatToF64:
      return Array(numElems).fill(param)

    case VldiFunction.BroadcastU8Shl8To32:
    case VldiFunction.BroadcastU8Shl8To16:
      return Array(numElems).fill(param << 8)

    case VldiFunction.BroadcastU8Shl16To32:
      return Array(numElems).fill(param << 16)

    case VldiFunction.BroadcastU8Shl24To32:
      return Array(numElems).fill(BigInt(param) << 24n)

    case VldiFunction.BroadcastU8FFTo32:
      return Array(numElems).fill((param << 8) | 0xff)

    case VldiFunction.BroadcastU8FFFFTo32:
      return Array(numElems).fill((param << 16) | 0xffff)

    case VldiFunction.BroadcastBitExpandedU8To64:
      return Array(numElems).fill(expandU8BitsToU64(param))

    case VldiFunction.BroadcastVldiMinifloatToEvenF32:
      const result = Array(numElems).fill(0.0)
      for (let i = 0; i < numElems; i += 2) result[i] = param
      return result
  }
}

export function demonstrateVldiEffectInC(
  vlen: Vlen,
  simm: number,
  treatElemsAsSigned: boolean,
): string[] {
  const [f, param] = decomposeVldiSimm(simm)
  const elemTy = elemTypesByVldiFunction[f]
  let elems = performVldi(vlen, f, param)

  const isElemsSigned = isOutputElemsSigned(f)
  const shouldConvertElemsToSImm =
    !isFloatElemTy(elemTy) && !isElemsSigned && treatElemsAsSigned
  const shouldConvertElemsToUImm =
    !isFloatElemTy(elemTy) && isElemsSigned && !treatElemsAsSigned
  if (shouldConvertElemsToSImm)
    elems = elems.map((x) => toSImm(x, vecElemWidthBits[elemTy]))
  else if (shouldConvertElemsToUImm)
    elems = elems.map((x) => toUImm(x, vecElemWidthBits[elemTy]))

  const repr = (x: number | bigint): string => {
    if (isFloatElemTy(elemTy)) return reprFloatDetailingZeroStatus(x as number)
    return toCHexLiteral(x)
  }

  return elems.map((x: number | bigint, idx: number) => {
    return `// val[${idx}] = ${repr(x)}`
  })
}
