import React from 'react'

import BoolFlag from '@site/src/components/BoolFlag'
import AsmDBBits from './bits'
import InsnFormatName from './insnFormat'
import { getInsnMnemonic } from './insn'
import { getManualInsnFormatName } from './manualFormatNames'

function InsnFormatDesc({insn, showCanonicalFmt}: {insn: Insn, showCanonicalFmt: boolean}): JSX.Element {
  if (showCanonicalFmt)
    return (
      <section>
        <h5>指令格式</h5>
        <ul>
          <li>规范格式名：<InsnFormatName fmt={insn.format} /></li>
          <li>手册汇编语法格式名：{
            insn.manual_format.repr != ''
            ? <InsnFormatName fmt={insn.manual_format} />
            : '同上'
          }</li>
        </ul>
      </section>
    )

  const manualIFN = getManualInsnFormatName(insn)
  return (
    <section>
      <h5>指令格式</h5>
      <ul>
        <li>手册格式名：{manualIFN != '' ? manualIFN : '无（非 9 种典型格式）'}</li>
        {
          manualIFN == ''
          ? <li>手册汇编语法格式名：<InsnFormatName fmt={insn.manual_format.repr != '' ? insn.manual_format : insn.format} /></li>
          : ''
        }
      </ul>
    </section>
  )
}

function Subsets({ss}: {ss: SubsetFlags}): JSX.Element {
  return (
    <p>
      见于：
      <BoolFlag val={ss.primary} />LA32 Primary，
      <BoolFlag val={ss.la32} />LA32，
      <BoolFlag val={ss.la64} />LA64，
      <BoolFlag val={ss.lsx} />LSX，
      <BoolFlag val={ss.lasx} />LASX
    </p>
  )
}

function getInsnFormatForDisplay(insn: Insn, useManualSyntax: boolean): InsnFormat {
  if (!useManualSyntax) {
    return insn.format
  }
  return insn.manual_format.repr != '' ? insn.manual_format : insn.format
}

function AsmDBInsn({insn, useManualSyntax}: {insn: Insn, useManualSyntax: boolean}): JSX.Element {
  return (
    <section>
      <h3>{getInsnMnemonic(insn, useManualSyntax)}</h3>
      <AsmDBBits
        value={insn.word}
        opcodeMask={insn.mask}
        fmt={getInsnFormatForDisplay(insn, useManualSyntax)}
      />
      <Subsets ss={insn.subsets} />
      <InsnFormatDesc insn={insn} showCanonicalFmt={!useManualSyntax} />
    </section>
  )
}

type AsmDBOptions = {
  data: AsmDBData
  useManualSyntax: boolean
  showSubset: SubsetFlags
}

function subsetFlagsToBitmask(x: SubsetFlags): number {
  let y = 0
  if (x.primary)
    y |= 0b1
  if (x.la32)
    y |= 0b10
  if (x.la64)
    y |= 0b100
  if (x.lsx)
    y |= 0b1000
  if (x.lasx)
    y |= 0b10000
  return y
}

export default function AsmDB({data, useManualSyntax, showSubset}: AsmDBOptions): JSX.Element {
  const insnAndKeys = data.insns.map((x, i) => { return {insn: x, key: i} })
  const showSubsetMask = subsetFlagsToBitmask(showSubset)
  const shownInsns = insnAndKeys.filter((x) => (subsetFlagsToBitmask(x.insn.subsets) & showSubsetMask) != 0)

  return (
    <ul>
      {shownInsns.map((x) => <li key={x.key}><AsmDBInsn insn={x.insn} useManualSyntax={useManualSyntax}/></li>)}
    </ul>
  )
}
