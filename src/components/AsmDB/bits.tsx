import clsx from 'clsx'

import styles from './bits.module.css'
import InsnFormatName from './insnFormatName'
import { getManualInsnFormatName } from './manualFormatNames'
import { BitPalette, styleFromBitPalette } from './palette'
import type { Insn, InsnFormat } from './types'

type BitsOptions = {
  insn: Insn
  useManualSyntax?: boolean
}

type BitProps = {
  placeholder: boolean
  showAsUndecided?: boolean
  value: 0 | 1
  palette: BitPalette
}

function littleEndianBitsFromU32(x: number): (0 | 1)[] {
  const y = new Array<0 | 1>(32)
  for (let i = 0; i < 32; i++) {
    y[i] = (x & (1 << i)) ? 1 : 0
  }
  return y
}

const Bit: React.FC<BitProps & React.HTMLAttributes<HTMLDivElement>> = (props) => {
  const placeholderRepr = props.showAsUndecided ? 'x' : ''
  return <span
    className={clsx(styles.bit, props.className)}
    style={styleFromBitPalette(props.palette, props.showAsUndecided)}
  >{
      props.placeholder ? placeholderRepr : props.value
    }</span>
}

function cookBits(word: number, mask: number, fmt: InsnFormat): BitProps[] {
  const hasFmt = !!fmt?.repr
  const bits = littleEndianBitsFromU32(word)
  const maskBits = littleEndianBitsFromU32(mask)
  const result = bits.map((b, i) => {
    return {
      placeholder: maskBits[i] == 0,
      value: b,
      // this will get refined later if we have insn fmt
      palette: maskBits[i] != 0 ? BitPalette.Opcode : BitPalette.P1,
      showAsUndecided: !hasFmt && maskBits[i] == 0,
    }
  })

  if (!hasFmt) {
    // fmt isn't given, cannot proceed any further
    return result.reverse()
  }

  // assign color to bits according to insn format
  fmt.args.forEach((arg, argIdx) => {
    for (const slot of arg.slots) {
      for (let i = 0; i < slot.width; i++) {
        const bitIdx = slot.offset + i
        result[bitIdx].palette = (argIdx + 1) as BitPalette
      }
    }
  })

  return result.reverse()
}

export type BitsReprProps = {
  word: number
  mask: number
  fmt?: InsnFormat
}

export const BitsRepr: React.FC<BitsReprProps & React.HTMLAttributes<HTMLDivElement>> = (props) => {
  const cookedBits = cookBits(props.word, props.mask, props.fmt)
  return <div className={clsx(styles.bitsContainer, props.className)}>
    {cookedBits.map((b, i) => (<Bit key={i} {...b} />))}
  </div>
}

export function InsnBitsRepr(props: BitsOptions): JSX.Element {
  let insnFormatDesc: JSX.Element
  if (props.useManualSyntax) {
    const mfn = getManualInsnFormatName(props.insn)
    if (mfn == '') {
      insnFormatDesc = <InsnFormatName className={styles.showFormatPrefix} overrideStr='非典型' />
    } else {
      insnFormatDesc = <InsnFormatName className={styles.showFormatPrefix} overrideStr={mfn} />
    }
  } else {
    let mfnDesc = <></>
    if (props.insn.manual_format && props.insn.manual_format.repr != '') {
      mfnDesc = <InsnFormatName fmt={props.insn.manual_format} className={styles.showManualFormatPrefix} />
    }

    insnFormatDesc = <>
      <InsnFormatName fmt={props.insn.format} className={styles.showFormatPrefix} />
      {mfnDesc}
    </>
  }

  return (
    <div className={styles.widget}>
      <BitsRepr word={props.insn.word} mask={props.insn.mask} fmt={props.insn.format} />
      {insnFormatDesc}
      <div className={styles.hex}>
        = 0x{props.insn.word.toString(16).padStart(8, '0')}
      </div>
    </div>
  );
}
