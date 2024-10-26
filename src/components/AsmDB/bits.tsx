import clsx from 'clsx'
import { EyeOutlined } from '@ant-design/icons'
import _ from 'lodash'

import styles from './bits.module.css'
import { isImmArg } from './insnFormat'
import InsnFormatName from './insnFormatName'
import { getManualInsnFormatName } from './manualFormatNames'
import { BitPalette, type AlphaStep, styleFromBitPalette } from './palette'
import { ArgKind, type Insn, type InsnFormat } from './types'

type BitsOptions = {
  insn: Insn
  useManualSyntax?: boolean
}

type BitProps = {
  isFixed: boolean
  isUndecided: boolean
  placeholder?: string | JSX.Element
  value: 0 | 1
  palette: BitPalette
  alpha?: AlphaStep
  isEmphasized: boolean
}

function littleEndianBitsFromU32(x: number): (0 | 1)[] {
  const y = new Array<0 | 1>(32)
  for (let i = 0; i < 32; i++) {
    y[i] = x & (1 << i) ? 1 : 0
  }
  return y
}

const Bit: React.FC<BitProps & React.HTMLAttributes<HTMLSpanElement>> = (
  props,
) => {
  const classNames = [props.className, styles.bit]
  if (props.isEmphasized) classNames.push(styles.bitEmph)
  return (
    <span
      className={clsx(...classNames)}
      style={styleFromBitPalette(props.palette, props.alpha, props.isUndecided)}
    >
      {props.isFixed ? props.value : props.placeholder}
    </span>
  )
}

function placeholderForBit(
  hasFmt: boolean,
  isFixed: boolean,
  isBeingChecked: boolean,
): string | JSX.Element {
  if (isFixed) return null
  if (hasFmt) return ''
  return isBeingChecked ? <EyeOutlined /> : 'x'
}

function getOperandPrefixForDisplay(k: ArgKind): string {
  switch (k) {
    case ArgKind.IntReg:
    default:
      return ''
    case ArgKind.FPReg:
      return 'F'
    case ArgKind.FCCReg:
      return 'C'
    case ArgKind.ScratchReg:
      return 'T'
    case ArgKind.VReg:
      return 'V'
    case ArgKind.XReg:
      return 'X'
    case ArgKind.SignedImm:
      return '±'
    case ArgKind.UnsignedImm:
      return 'U'
  }
}

function cookBits(
  word: number,
  mask: number,
  maskToCheck: number,
  maskToEmph: number,
  fmt: InsnFormat,
): BitProps[] {
  const hasFmt = !!fmt?.repr
  const bits = littleEndianBitsFromU32(word)
  const maskBits = littleEndianBitsFromU32(mask)
  const maskToCheckBits = littleEndianBitsFromU32(maskToCheck)
  const maskToEmphBits = littleEndianBitsFromU32(maskToEmph)
  const result: BitProps[] = bits.map((b, i) => {
    const isFixed = maskBits[i] != 0
    const isUndecided = !isFixed && !hasFmt
    const isBeingChecked = maskToCheckBits[i] != 0
    const isEmphasized = maskToEmphBits[i] != 0
    const placeholder = placeholderForBit(hasFmt, isFixed, isBeingChecked)
    return {
      isFixed,
      isUndecided,
      placeholder,
      value: b,
      // this will get refined later if we have insn fmt
      palette: maskBits[i] != 0 ? BitPalette.Opcode : BitPalette.P1,
      isEmphasized,
    }
  })

  if (!hasFmt) {
    // fmt isn't given, cannot proceed any further
    return result.reverse()
  }

  // assign color to bits according to insn format
  fmt.args.forEach((arg, argIdx) => {
    const totalArgWidth = _.sum(_.map(arg.slots, 'width'))
    const shouldApplyImmGradient = isImmArg(arg) && totalArgWidth >= 8
    const argMSB = totalArgWidth - 1
    let argBitIdx = argMSB
    for (const slot of arg.slots) {
      for (let i = slot.width - 1; i >= 0; i--) {
        const bitIdx = slot.offset + i
        result[bitIdx].palette = (argIdx + 1) as BitPalette

        if (argBitIdx == argMSB)
          result[bitIdx].placeholder = getOperandPrefixForDisplay(arg.kind)

        if (shouldApplyImmGradient) {
          result[bitIdx].alpha = {
            step: argBitIdx,
            totalSteps: totalArgWidth - 1,
          }
        }
        argBitIdx--
      }
    }
  })

  return result.reverse()
}

export type BitsReprProps = {
  word: number
  mask: number
  maskToCheck?: number
  maskToEmph?: number
  fmt?: InsnFormat
}

export const BitsRepr: React.FC<
  BitsReprProps & React.HTMLAttributes<HTMLDivElement>
> = (props) => {
  const cookedBits = cookBits(
    props.word,
    props.mask,
    props.maskToCheck || 0,
    props.maskToEmph || 0,
    props.fmt,
  )
  return (
    <div className={clsx(styles.bitsContainer, props.className)}>
      {cookedBits.map((b, i) => (
        <Bit key={i} {...b} />
      ))}
    </div>
  )
}

export function InsnBitsRepr(props: BitsOptions): JSX.Element {
  let insnFormatDesc: JSX.Element
  if (props.useManualSyntax) {
    const mfn = getManualInsnFormatName(props.insn)
    if (mfn == '') {
      insnFormatDesc = (
        <InsnFormatName
          className={styles.showFormatPrefix}
          overrideStr="非典型"
        />
      )
    } else {
      insnFormatDesc = (
        <InsnFormatName className={styles.showFormatPrefix} overrideStr={mfn} />
      )
    }
  } else {
    let mfnDesc = <></>
    if (props.insn.manual_format && props.insn.manual_format.repr != '') {
      mfnDesc = (
        <InsnFormatName
          fmt={props.insn.manual_format}
          className={styles.showManualFormatPrefix}
        />
      )
    }

    insnFormatDesc = (
      <>
        <InsnFormatName
          fmt={props.insn.format}
          className={styles.showFormatPrefix}
        />
        {mfnDesc}
      </>
    )
  }

  return (
    <div className={styles.widget}>
      <BitsRepr
        word={props.insn.word}
        mask={props.insn.mask}
        fmt={props.insn.format}
      />
      {insnFormatDesc}
      <div className={styles.hex}>
        = 0x{props.insn.word.toString(16).padStart(8, '0')}
      </div>
    </div>
  )
}
