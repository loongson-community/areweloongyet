import { toSImm, toUImm } from "./insn"

export type MinifloatComponents = {
  neg: boolean,
  isZero: boolean,
  biasedExp: number,
  unbiasedExp: number,
  apparentExp: number,
  mantissa: number,
  apparentMantissa: number,
}

export class MinifloatFormat {
  readonly expWidth: number
  readonly expBias: number
  readonly mantissaWidth: number
  readonly supportsZero: boolean

  constructor(
    expWidth: number,
    expBias: number,
    mantissaWidth: number,
    supportsZero?: boolean,
  ) {
    this.expWidth = expWidth
    this.expBias = expBias
    this.mantissaWidth = mantissaWidth
    this.supportsZero = supportsZero ?? true
  }

  get maxMantissa(): number {
    return (1 << this.mantissaWidth) - 1
  }

  get minBiasedExp(): number {
    return -(1 << (this.expWidth - 1)) + this.expBias
  }

  get maxBiasedExp(): number {
    return (1 << (this.expWidth - 1)) - 1 + this.expBias
  }

  // mantissaWidth = 4, denominator = 32
  // `(mantissa / 32) * 2 ** exp` is arguably less obvious than `mantissa * 2 ** exp`
  // where "exp" is biased a second time with the denominator folded in
  get apparentExpBiasDelta() {
    return -(this.mantissaWidth + 1)
  }

  get minApparentExp(): number {
    return this.minBiasedExp + this.apparentExpBiasDelta
  }

  get maxApparentExp(): number {
    return this.maxBiasedExp + this.apparentExpBiasDelta
  }

  get implicitMantissaOffset(): number {
    return 1 << this.mantissaWidth
  }

  biasExp(unbiasedSImm: number): number {
    return unbiasedSImm + this.expBias
  }

  unbiasExp(biasedSImm: number): number {
    return biasedSImm - this.expBias
  }

  asNumber(bitRepr: number): number {
    const {mantissa, biasedExp, unbiasedExp, neg} = this.decompose(bitRepr)
    if (this.supportsZero && unbiasedExp == 0 && mantissa == 0) {
      return neg ? -0.0 : 0.0
    }

    const n = (this.implicitMantissaOffset | mantissa) * (2 ** (biasedExp + this.apparentExpBiasDelta))
    return neg ? -n : n
  }

  composeBiased(neg: boolean, exp: number, mantissa: number): number {
    const unbiasedExp = Number(toUImm(this.unbiasExp(exp), this.expWidth))
    return this.composeUnbiased(neg, unbiasedExp, mantissa)
  }

  composeUnbiased(neg: boolean, unbiasedExp: number, mantissa: number): number {
    let x = mantissa & ((1 << this.mantissaWidth) - 1)
    x |= Number(toUImm(unbiasedExp, this.expWidth)) << this.mantissaWidth
    if (neg)
      x |= 1 << (this.mantissaWidth + this.expWidth)
    return x
  }

  decompose(bitExpr: number): MinifloatComponents {
    const neg = (bitExpr & (1 << (this.mantissaWidth + this.expWidth))) != 0
    const mantissa = bitExpr & ((1 << this.mantissaWidth) - 1)
    const unbiasedExpUImm = (bitExpr >> this.mantissaWidth) & ((1 << this.expWidth) - 1)
    const isZero = this.supportsZero && mantissa == 0 && unbiasedExpUImm == 0
    const unbiasedExp = toSImm(unbiasedExpUImm, this.expWidth)
    const biasedExp = this.biasExp(unbiasedExp)
    const apparentExp = biasedExp + this.apparentExpBiasDelta
    const apparentMantissa = this.implicitMantissaOffset | mantissa
    return {neg, isZero, biasedExp, unbiasedExp, apparentExp, mantissa, apparentMantissa}
  }
}
