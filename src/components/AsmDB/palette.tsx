import React, { CSSProperties } from 'react'

enum BitPalette {
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

export function styleFromBitPalette(p: BitPalette): CSSProperties {
  return {
    color: colorVarFromBitPalette('fg', p),
    backgroundColor: colorVarFromBitPalette('bg', p),
  }
}
