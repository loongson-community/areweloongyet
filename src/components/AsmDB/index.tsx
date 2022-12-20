import React from 'react'

import BoolFlag from '@site/src/components/BoolFlag'
import AsmDBBits from './bits'
import InsnFormatName from './insnFormat'
import { getInsnMnemonic } from './insn'
import { getManualInsnFormatName } from './manualFormatNames'

function InsnFormatDesc({insn, showCanonicalFmt}: {insn: Insn, showCanonicalFmt: boolean}): JSX.Element {
  const manualIFN = getManualInsnFormatName(insn)
  if (showCanonicalFmt)
    return (
      <section>
        <h5>指令格式</h5>
        <ul>
          <li>手册格式名：{manualIFN != '' ? manualIFN : '无（非 9 种典型格式）'}</li>
          <li>规范格式名：<InsnFormatName fmt={insn.format} /></li>
          <li>手册汇编语法格式名：{
            insn.manual_format.repr != ''
            ? <InsnFormatName fmt={insn.manual_format} />
            : '同上'
          }</li>
        </ul>
      </section>
    )

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

export default function AsmDB({data}: {data: any}): JSX.Element {
  const typedData = data as AsmDBData
  const useManualSyntax = true  // TODO
  return (
    <ul>
      {typedData.insns.map((x) => <li><AsmDBInsn insn={x} useManualSyntax={useManualSyntax}/></li>)}
    </ul>
  );
}
