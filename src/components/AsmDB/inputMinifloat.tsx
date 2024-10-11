import { InputNumber, Select, Tooltip } from "antd"
import { useState } from "react"

import { reprFloatDetailingZeroStatus } from "./insn"
import { MinifloatFormat } from "./minifloat"

export type MinifloatValueEvent = {
  value: number
  bitRepr: number
}

type InputMinifloatProps = {
  fmt: MinifloatFormat
  bitRepr?: number

  onMinifloatValueChange?: (newVal: MinifloatValueEvent) => void
}

export const InputMinifloat: React.FC<InputMinifloatProps & React.HTMLAttributes<HTMLDivElement>> = (props) => {
  const [bitRepr, setBitRepr] = useState(props.bitRepr ?? 0)
  const {
    neg,
    isZero,
    apparentExp,
    unbiasedExp,
    mantissa,
    apparentMantissa,
  } = props.fmt.decompose(bitRepr)

  const signalChangeEvent = (bitRepr: number) => {
    props.onMinifloatValueChange?.({value: props.fmt.asNumber(bitRepr), bitRepr})
  }

  const minApparentMantissa = props.fmt.implicitMantissaOffset
  const maxApparentMantissa = props.fmt.maxMantissa + props.fmt.implicitMantissaOffset

  const fromApparentMantissa = (apparent: number): number => {
    return apparent - props.fmt.implicitMantissaOffset
  }

  const toApparentMantissa = (inputState: number): number => {
    return inputState + props.fmt.implicitMantissaOffset
  }

  const inputStateMantissaFormatter = (inputState: number | string): string => {
    inputState = typeof inputState == "string" ? parseInt(inputState, 10) : inputState
    return toApparentMantissa(inputState).toString(10)
  }

  const inputStateMantissaParser = (apparent: string): number => {
    return fromApparentMantissa(parseInt(apparent ?? "0", 10))
  }

  const inputStateMantissa = fromApparentMantissa(apparentMantissa)

  const mantissaTooltip = `${minApparentMantissa}~${maxApparentMantissa}`
  const expTooltip = `${props.fmt.minApparentExp}~${props.fmt.maxApparentExp}`

  const onToggleSign = (val: boolean) => {
    const newBitRepr = props.fmt.composeUnbiased(val, unbiasedExp, mantissa)
    setBitRepr(newBitRepr)
    signalChangeEvent(newBitRepr)
  }

  const signSelect = <Select value={neg} onChange={onToggleSign}>
    <Select.Option value={false}>+</Select.Option>
    <Select.Option value={true}>-</Select.Option>
  </Select>

  const onInputStateMantissaChange = (val: number | null) => {
    val = val ?? 0
    const newMantissa = toApparentMantissa(val) - props.fmt.implicitMantissaOffset
    const newBitRepr = props.fmt.composeUnbiased(neg, unbiasedExp, newMantissa)
    setBitRepr(newBitRepr)
    signalChangeEvent(newBitRepr)
  }

  const onApparentExpChange = (newApparentExp: number | null) => {
    newApparentExp = newApparentExp ?? -3
    const newBiasedExp = newApparentExp - props.fmt.apparentExpBiasDelta
    const newBitRepr = props.fmt.composeBiased(neg, newBiasedExp, mantissa)
    setBitRepr(newBitRepr)
    signalChangeEvent(newBitRepr)
  }

  const mantissaInput = <Tooltip title={mantissaTooltip}>
    <span>
      <InputNumber
        addonBefore={signSelect}
        value={inputStateMantissa}
        formatter={inputStateMantissaFormatter}
        parser={inputStateMantissaParser}
        min={0}
        max={props.fmt.maxMantissa}
        onChange={onInputStateMantissaChange}
      />
    </span>
  </Tooltip>

  const expInput = <Tooltip title={expTooltip}>
    <span>
      <InputNumber
        value={apparentExp}
        min={props.fmt.minApparentExp}
        max={props.fmt.maxApparentExp}
        onChange={onApparentExpChange}
      />
    </span>
  </Tooltip>

  const equalOrRepresentsSign = isZero ? "表示" : "="
  const numRepr = reprFloatDetailingZeroStatus(props.fmt.asNumber(bitRepr))
  const zeroNotes = props.fmt.supportsZero ? <>
    <br />
    注意：如此处显示的有效数字为 {props.fmt.implicitMantissaOffset} 且指数为 {props.fmt.expBias + props.fmt.apparentExpBiasDelta}，则表示 &plusmn;0。
  </> : <></>

  return <>
    {mantissaInput} &times; pow(2, {expInput}) {equalOrRepresentsSign} {numRepr}
    <br />迷你浮点数格式：符号 1 位 + 指数 {props.fmt.expWidth} 位 (偏置 {props.fmt.expBias}) + 尾数 {props.fmt.mantissaWidth} 位。{props.fmt.supportsZero ? "支持" : "不支持"}表示零值。
    {zeroNotes}
  </>
}
