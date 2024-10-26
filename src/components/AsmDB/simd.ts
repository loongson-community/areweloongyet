export type Vlen = 128 | 256

export enum VecElemType {
  I8,
  I16,
  I32,
  I64,
  F32,
  F64,
}

export const vecElemWidthBits: { [key in VecElemType]: number } = {
  [VecElemType.I8]: 8,
  [VecElemType.I16]: 16,
  [VecElemType.I32]: 32,
  [VecElemType.I64]: 64,
  [VecElemType.F32]: 32,
  [VecElemType.F64]: 64,
}

export function isFloatElemTy(x: VecElemType): boolean {
  return x == VecElemType.F32 || x == VecElemType.F64
}

export function makeVectorTypeForC(
  vlen: Vlen,
  elemTy: VecElemType,
  signed: boolean,
): string {
  // "vXiXX", "vXuXX" or "vXfXX"
  const elemWidthBits = vecElemWidthBits[elemTy]
  const numElems = vlen / elemWidthBits
  const kind = isFloatElemTy(elemTy) ? 'f' : signed ? 'i' : 'u'
  return `v${numElems}${kind}${elemWidthBits}`
}
