import React from 'react'

import styles from './bits.module.css'
import InsnFormatName from './insnFormat'
import { getManualInsnFormatName } from './manualFormatNames'
import { styleFromBitPalette } from './palette'

type BitsOptions = {
  insn: Insn
  useManualSyntax?: boolean
}

type BitOptions = {
  placeholder: boolean
  value: 0|1
  palette: BitPalette
}

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

function littleEndianBitsFromU32(x: number): (0|1)[] {
  const y = new Array<0|1>(32)
  for (let i = 0; i < 32; i++) {
    y[i] = (x & (1 << i)) ? 1 : 0
  }
  return y
}

function Bit(props: BitOptions): JSX.Element {
  return (
    <span className={styles.bit} style={styleFromBitPalette(props.palette)}>{props.placeholder ? '' : props.value}</span>
  )
}

function cookBits(x: Insn): BitOptions[] {
  const bits = littleEndianBitsFromU32(x.word)
  const maskBits = littleEndianBitsFromU32(x.mask)
  const result = bits.map((b, i) => {
    return {
      placeholder: maskBits[i] == 0,
      value: b,
      // this will get refined later if we have insn fmt
      palette: maskBits[i] != 0 ? BitPalette.Opcode : BitPalette.P1,
    }
  })

  if (x.format.repr == '') {
    // fmt isn't given, cannot proceed any further
    return result.reverse()
  }

  // assign color to bits according to insn format
  x.format.args.forEach((arg, argIdx) => {
    for (const slot of arg.slots) {
      for (let i = 0; i < slot.width; i++) {
        const bitIdx = slot.offset + i
        result[bitIdx].palette = (argIdx + 1) as BitPalette
      }
    }
  })

  return result.reverse()
}

export default function AsmDBBits(props: BitsOptions): JSX.Element {
  const cookedBits = cookBits(props.insn)

  let insnFormatDesc
  if (props.useManualSyntax) {
    const mfn = getManualInsnFormatName(props.insn)
    if (mfn == '') {
      insnFormatDesc = <InsnFormatName className={styles.showFormatPrefix} overrideStr='非典型' />
    } else {
      insnFormatDesc = <InsnFormatName className={styles.showFormatPrefix} overrideStr={mfn} />
    }
  } else {
    insnFormatDesc = <>
      <InsnFormatName fmt={props.insn.format} className={styles.showFormatPrefix} />
      {props.insn.manual_format.repr != '' ? <InsnFormatName fmt={props.insn.manual_format} className={styles.showManualFormatPrefix} />: ''}
    </>
  }

  return (
    <div className={styles.widget}>
      <div className={styles.bitsContainer}>
        {cookedBits.map((b, i) => (<Bit key={i} {...b} />))}
      </div>
      {insnFormatDesc}
      <div className={styles.hex}>
        = 0x{props.insn.word.toString(16).padStart(8, '0')}
      </div>
    </div>
  );
}
