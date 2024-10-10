import { Card, Checkbox, Col, Radio, RadioChangeEvent, Row, Space } from 'antd'
import { Dispatch, SetStateAction, useState } from 'react'
import _ from "lodash"

import { InputImm, SImmAndUImm } from './inputImm'
import { toCHexLiteral } from './insn'
import { VecElemType, Vlen, makeVectorTypeForC } from "./simd"
import {
  VldiFunction,
  VldiMinifloatFormat,
  demonstrateVldiEffectInC,
  elemTypesByVldiFunction,
  makeVldiSImm,
} from './vldi'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import { InputMinifloat, MinifloatValueEvent } from './inputMinifloat'

type VlenSelectProps = {
  vlen: Vlen

  onVlenChange?: (newVal: Vlen) => void
}

const VlenSelect: React.FC<VlenSelectProps & React.HTMLAttributes<HTMLDivElement>> = (props) => {
  const [vlen, setVlen] = useState(props.vlen)

  const onChange = (e: RadioChangeEvent) => {
    const v = e.target.value
    setVlen(v)
    props.onVlenChange?.(v)
  }

  return <Radio.Group onChange={onChange} defaultValue={vlen} buttonStyle="solid">
    <Radio.Button value={128}>128 位 (LSX)</Radio.Button>
    <Radio.Button value={256}>256 位 (LASX)</Radio.Button>
  </Radio.Group>
}


type ElementTypeSelectProps = {
  elemTy: VecElemType

  onElementTypeChange?: (newVal: VecElemType) => void
}

const ElementTypeSelect: React.FC<ElementTypeSelectProps & React.HTMLAttributes<HTMLDivElement>> = (props) => {
  const [elemTy, setElemTy] = useState(props.elemTy)

  const onChange = (e: RadioChangeEvent) => {
    const v = e.target.value
    setElemTy(v)
    props.onElementTypeChange?.(v)
  }

  return <Radio.Group onChange={onChange} value={elemTy} buttonStyle="solid">
    <Radio.Button value={VecElemType.I8}>I8 (char)</Radio.Button>
    <Radio.Button value={VecElemType.I16}>I16 (short)</Radio.Button>
    <Radio.Button value={VecElemType.I32}>I32 (int)</Radio.Button>
    <Radio.Button value={VecElemType.I64}>I64 (long)</Radio.Button>
    <Radio.Button value={VecElemType.F32}>F32 (float)</Radio.Button>
    <Radio.Button value={VecElemType.F64}>F64 (double)</Radio.Button>
  </Radio.Group>
}


const availableVldiFunctionsByElemTy = [
  {
    elemTy: VecElemType.I8,
    avail: [
      { f: VldiFunction.BroadcastU8To8, desc: "取 8 位整数，广播（形式一）" },
      { f: VldiFunction.BroadcastU8To8Alternate, desc: "取 8 位整数，广播（形式二，等价于形式一）" },
    ],
  },
  {
    elemTy: VecElemType.I16,
    avail: [
      { f: VldiFunction.BroadcastS10To16, desc: "符号扩展 10 位整数到 16 位，广播" },
      { f: VldiFunction.BroadcastU8To16, desc: "零扩展 8 位整数到 16 位，广播" },
      { f: VldiFunction.BroadcastU8Shl8To16, desc: "零扩展 8 位整数到 16 位，左移 8 位，广播" },
    ],
  },
  {
    elemTy: VecElemType.I32,
    avail: [
      { f: VldiFunction.BroadcastS10To32, desc: "符号扩展 10 位整数到 32 位，广播" },
      { f: VldiFunction.BroadcastU8To32, desc: "零扩展 8 位整数到 32 位，广播" },
      { f: VldiFunction.BroadcastU8Shl8To32, desc: "零扩展 8 位整数到 32 位，左移 8 位，广播" },
      { f: VldiFunction.BroadcastU8Shl16To32, desc: "零扩展 8 位整数到 32 位，左移 16 位，广播" },
      { f: VldiFunction.BroadcastU8Shl24To32, desc: "零扩展 8 位整数到 32 位，左移 24 位，广播" },
      { f: VldiFunction.BroadcastU8FFTo32, desc: "零扩展 8 位整数到 32 位，左移 8 位，低位以全 1 填充，广播" },
      { f: VldiFunction.BroadcastU8FFFFTo32, desc: "零扩展 8 位整数到 32 位，左移 16 位，低位以全 1 填充，广播" },
    ],
  },
  {
    elemTy: VecElemType.I64,
    avail: [
      { f: VldiFunction.BroadcastS10To64, desc: "符号扩展 10 位整数到 64 位，广播" },
      { f: VldiFunction.BroadcastBitExpandedU8To64, desc: "取 8 位整数，将每位重复 8 次，广播" },
    ],
  },
  {
    elemTy: VecElemType.F32,
    avail: [
      { f: VldiFunction.BroadcastVldiMinifloatToF32, desc: "转换迷你浮点数为 float，广播" },
      { f: VldiFunction.BroadcastVldiMinifloatToEvenF32, desc: "转换迷你浮点数为 float，广播到偶数编号元素，置零奇数编号元素" },
    ],
  },
  {
    elemTy: VecElemType.F64,
    avail: [
      { f: VldiFunction.BroadcastVldiMinifloatToF64, desc: "转换迷你浮点数为 double，广播" },
    ],
  },
]

const availableFunctionRadiosByElemTy = {}
availableVldiFunctionsByElemTy.forEach((cfg) => {
  const myElemTy = cfg.elemTy
  availableFunctionRadiosByElemTy[myElemTy] = cfg.avail.map((entry) => {
    const key = `vldi-function-select-radio-${entry.f}`
    return <Radio key={key} value={entry.f}>{entry.desc}</Radio>
  })
})

const defaultVldiFunctionsByElemTy: { [key in VecElemType]: VldiFunction } = {
  [VecElemType.I8]: VldiFunction.BroadcastU8To8,
  [VecElemType.I16]: VldiFunction.BroadcastS10To16,
  [VecElemType.I32]: VldiFunction.BroadcastS10To32,
  [VecElemType.I64]: VldiFunction.BroadcastS10To64,
  [VecElemType.F32]: VldiFunction.BroadcastVldiMinifloatToF32,
  [VecElemType.F64]: VldiFunction.BroadcastVldiMinifloatToF64,
}

type VldiDataInputUX = {
  isMinifloat?: boolean
  isSigned?: boolean
  width?: number
}

const dataInputUXByVldiFunction: { [key in VldiFunction]: VldiDataInputUX } = {
  [VldiFunction.BroadcastU8To8]: { isSigned: false, width: 8 },
  [VldiFunction.BroadcastS10To16]: { isSigned: true, width: 10 },
  [VldiFunction.BroadcastS10To32]: { isSigned: true, width: 10 },
  [VldiFunction.BroadcastS10To64]: { isSigned: true, width: 10 },
  [VldiFunction.BroadcastU8To32]: { isSigned: false, width: 8 },
  [VldiFunction.BroadcastU8Shl8To32]: { isSigned: false, width: 8 },
  [VldiFunction.BroadcastU8Shl16To32]: { isSigned: false, width: 8 },
  [VldiFunction.BroadcastU8Shl24To32]: { isSigned: false, width: 8 },
  [VldiFunction.BroadcastU8To16]: { isSigned: false, width: 8 },
  [VldiFunction.BroadcastU8Shl8To16]: { isSigned: false, width: 8 },
  [VldiFunction.BroadcastU8FFTo32]: { isSigned: false, width: 8 },
  [VldiFunction.BroadcastU8FFFFTo32]: { isSigned: false, width: 8 },
  [VldiFunction.BroadcastU8To8Alternate]: { isSigned: false, width: 8 },
  [VldiFunction.BroadcastBitExpandedU8To64]: { isSigned: false, width: 8 },
  [VldiFunction.BroadcastVldiMinifloatToF32]: { isMinifloat: true },
  [VldiFunction.BroadcastVldiMinifloatToEvenF32]: { isMinifloat: true },
  [VldiFunction.BroadcastVldiMinifloatToF64]: { isMinifloat: true },
}

type VldiFunctionSelectProps = {
  elemTy: VecElemType
  vldiFunction: VldiFunction

  onElementTypeChange?: (newVal: VecElemType) => void
  onVldiFunctionChange?: (newVal: VldiFunction) => void
}

type VldiFunctionSelectState = {
  elemTy: VecElemType
  selectedFuncByElemTy: { [key in VecElemType]: VldiFunction }
}

const VldiFunctionSelect: React.FC<VldiFunctionSelectProps & React.HTMLAttributes<HTMLDivElement>> = (props) => {
  const [state, setState]: [VldiFunctionSelectState, Dispatch<SetStateAction<VldiFunctionSelectState>>] = useState({
    elemTy: elemTypesByVldiFunction[props.vldiFunction],
    selectedFuncByElemTy: _.clone(defaultVldiFunctionsByElemTy),
  })

  const onElemTyChange = (newVal: VecElemType) => {
    setState((prev) => {
      return {
        elemTy: newVal,
        selectedFuncByElemTy: _.clone(prev.selectedFuncByElemTy),
      }
    })

    props.onElementTypeChange?.(newVal)
    props.onVldiFunctionChange?.(state.selectedFuncByElemTy[newVal])
  }

  const onVldiFunctionChange = (e: RadioChangeEvent) => {
    const v = e.target.value

    setState((prev) => {
      const newSelectedFuncByElemTy = _.clone(prev.selectedFuncByElemTy)
      newSelectedFuncByElemTy[prev.elemTy] = v
      return {
        elemTy: prev.elemTy,
        selectedFuncByElemTy: newSelectedFuncByElemTy,
      }
    })

    props.onVldiFunctionChange?.(v)
  }

  const marginTop = {
    style: {
      marginTop: 16,
    }
  }

  return <Card bordered={false}>
    <Row>
      <Col span={24}>
        元素类型：<ElementTypeSelect elemTy={state.elemTy} onElementTypeChange={onElemTyChange} />
      </Col>
    </Row>
    <Row {...marginTop}>
      <Col span={24}>
        装载操作：<Radio.Group onChange={onVldiFunctionChange} value={state.selectedFuncByElemTy[state.elemTy]}>
          <Space direction="vertical">
            {availableFunctionRadiosByElemTy[state.elemTy]}
          </Space>
        </Radio.Group>
      </Col>
    </Row>
  </Card>
}

export default function VldiHelperPage(): JSX.Element {
  const [elemTy, setElemTy] = useState(VecElemType.I8)
  const [vlen, setVlen]: [Vlen, Dispatch<React.SetStateAction<Vlen>>] = useState(128)
  const [vldiFunction, setVldiFunction] = useState(VldiFunction.BroadcastU8To8)
  const [immState, setImmState] = useState({input: 0, uimm: 0})
  const [useSignedElems, setUseSignedElems] = useState(false)
  const [minifloatVal, setMinifloatVal] = useState({value: 0.0, bitRepr: 0})

  const intrinsicHeader = vlen == 128 ? "lsxintrin.h" : "lasxintrin.h"
  const intrinsicName = vlen == 128 ? "__lsx_vldi" : "__lasx_xvldi"
  const vldiSImm = makeVldiSImm(vldiFunction, immState.uimm, minifloatVal.bitRepr)
  const vldiSImmHex = toCHexLiteral(vldiSImm)
  const resultCType = makeVectorTypeForC(vlen, elemTy, useSignedElems)
  const resultDemoCodeLines = demonstrateVldiEffectInC(vlen, vldiSImm, useSignedElems)

  const onImmChange = (newVal: number, interp: SImmAndUImm) => {
    setImmState({input: newVal, uimm: interp.uimm})
  }

  const onUseSignedElemsChange = (e: CheckboxChangeEvent) => {
    setUseSignedElems(!useSignedElems)
  }

  const makeInputPane = (ux: VldiDataInputUX) => {
    if (ux.isMinifloat) {
      return <InputMinifloat
        fmt={VldiMinifloatFormat}
        onMinifloatValueChange={setMinifloatVal}
      />
    }

    return <InputImm
      signed={ux.isSigned}
      bitWidth={ux.width}
      imm={immState.input}
      onImmChange={onImmChange}
    />
  }

  const dataInputPanes: {[key in VldiFunction]?: JSX.Element} = {}
  _.forEach(dataInputUXByVldiFunction, (ux, key) => {
    dataInputPanes[key] = makeInputPane(ux)
  })

  const isMinifloat = dataInputUXByVldiFunction[vldiFunction].isMinifloat

  const marginTop = {
    style: {
      marginTop: 16,
    }
  }

  return <>
    <p>
      基于
      <a href="https://github.com/jiegec">@jiegec</a>
      的
      <a href="https://jia.je/unofficial-loongarch-intrinsics-guide"><i>Unofficial LoongArch Intrinsics Guide</i></a>
      制作。
    </p>

    <Row gutter={16}>
      <Col span={24}>
        <VldiFunctionSelect
          elemTy={elemTy}
          vldiFunction={vldiFunction}
          onElementTypeChange={setElemTy}
          onVldiFunctionChange={setVldiFunction}
        />
      </Col>
    </Row>

    <Row gutter={16} {...marginTop}>
      <Col span={24}>
        <Card bordered={false}>
          装载参数：{dataInputPanes[vldiFunction]}
        </Card>
      </Col>
    </Row>

    <Row gutter={16} {...marginTop}>
      <Col span={24}>
        <Card bordered={false}>
          <Row>
            <Col span={24}>
              向量宽度：<VlenSelect
                vlen={vlen}
                onVlenChange={setVlen}
              />
              <Checkbox
                checked={useSignedElems}
                onChange={onUseSignedElemsChange}
                disabled={isMinifloat}
                style={{marginLeft: 16}}
              >
                视结果元素为有符号整数
              </Checkbox>
            </Col>
          </Row>

          <Row {...marginTop}>
            <Col span={24}>
              <pre>
                #include &lt;{intrinsicHeader}&gt;<br />
                <br />
                {resultCType} val = ({resultCType}){intrinsicName}({vldiSImmHex});<br />
                {resultDemoCodeLines.map((line) => <>{line}<br /></>)}
              </pre>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  </>
}
