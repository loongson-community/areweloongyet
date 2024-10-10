import { InputNumber, Tooltip } from "antd"
import { useState } from "react"

export type SImmAndUImm = {
  simm: number
  uimm: number
}

function makeSImmAndUImm(signed: boolean, width: number, imm: number): SImmAndUImm {
  if (signed)
    return {simm: imm, uimm: imm < 0 ? (1 << width) + imm : imm}
  return {simm: imm >= (1 << (width - 1)) ? imm - (1 << width) : imm, uimm: imm}
}

type InputImmProps = {
  bitWidth: number
  signed: boolean
  imm: number

  onImmChange?: (newVal: number, interpretations: SImmAndUImm) => void
}

function deriveValueDomain(signed: boolean, width: number): [number, number] {
  if (signed)
    return [-(1 << (width - 1)), (1 << (width - 1)) - 1]
  return [0, (1 << width) - 1]
}

export const InputImm: React.FC<InputImmProps & React.HTMLAttributes<HTMLDivElement>> = (props) => {
  const [min, max] = deriveValueDomain(props.signed, props.bitWidth)
  const prompt = `${min} - ${max}`

  const [imm, setImm] = useState(props.imm)

  const onChange = (newVal: number | null) => {
    setImm(newVal)

    // null can happen if input is empty or incomplete, don't leak to downstream
    // for a nicer non-null experience
    newVal = newVal ?? 0
    props.onImmChange?.(newVal, makeSImmAndUImm(props.signed, props.bitWidth, newVal))
  }

  return <Tooltip placement="right" title={prompt}>
    {/* the span seems required, Tooltip will crash otherwise */}
    <span>
      <InputNumber min={min} max={max} value={imm} onChange={onChange} />
    </span>
  </Tooltip>
}
