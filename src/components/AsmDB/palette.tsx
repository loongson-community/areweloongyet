import { CSSProperties } from 'react'

export enum BitPalette {
  Opcode,
  P1,
  P2,
  P3,
  P4,
  P5,
  P6,
}

function colorVarFromBitPalette(kind: 'bg' | 'fg', x: BitPalette): string {
  return `var(--bit-${kind}-p${x})`
}

export type AlphaStep = {
  step: number
  totalSteps: number
}

export function styleFromBitPalette(
  p: BitPalette,
  alpha?: AlphaStep,
  undecided?: boolean,
): CSSProperties {
  if (undecided)
    return {
      color: 'var(--bit-fg-undecided)',
      backgroundColor: 'var(--bit-bg-undecided)',
    }

  const color = colorVarFromBitPalette('fg', p)
  let backgroundColor = colorVarFromBitPalette('bg', p)
  if (alpha) {
    const renderAlpha = (alpha.step / alpha.totalSteps) * 0.75 + 0.25
    const alphaPercent = (renderAlpha * 100).toFixed(0)
    backgroundColor = `color-mix(in srgb, ${backgroundColor} ${alphaPercent}%, transparent)`
  }

  return { color, backgroundColor }
}
