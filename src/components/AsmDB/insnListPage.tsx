import { Checkbox, Switch } from 'antd'
import { useState } from 'react'

import BoolFlag from '@site/src/components/BoolFlag'
import { InsnBitsRepr } from './bits'
import { getInsnMnemonic } from './insn'
import type { AsmDBData, Insn, SubsetFlags } from './types'

function Subsets({ ss }: { ss: SubsetFlags }): JSX.Element {
  if (ss.provisional) return <p>非正式指令</p>

  return (
    <p>
      见于：
      <BoolFlag val={ss.primary} />
      LA32 Primary，
      <BoolFlag val={ss.la32} />
      LA32，
      <BoolFlag val={ss.la64} />
      LA64，
      <BoolFlag val={ss.lsx} />
      LSX，
      <BoolFlag val={ss.lasx} />
      LASX，
      <BoolFlag val={ss.lbt} />
      LBT，
      <BoolFlag val={ss.lvz} />
      LVZ
    </p>
  )
}

function AsmDBInsn({
  insn,
  useManualSyntax,
}: {
  insn: Insn
  useManualSyntax: boolean
}): JSX.Element {
  return (
    <section>
      <h3>{getInsnMnemonic(insn, useManualSyntax)}</h3>
      <InsnBitsRepr insn={insn} useManualSyntax={useManualSyntax} />
      <Subsets ss={insn.subsets} />
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
  if (x.primary) y |= 0b1
  if (x.la32) y |= 0b10
  if (x.la64) y |= 0b100
  if (x.lsx) y |= 0b1000
  if (x.lasx) y |= 0b10000
  if (x.lbt) y |= 0b100000
  if (x.lvz) y |= 0b1000000
  if (x.provisional) y |= 0b10000000
  return y
}

function InsnList({
  data,
  useManualSyntax,
  showSubset,
}: AsmDBOptions): JSX.Element {
  const insnAndKeys = data.insns.map((x, i) => {
    return { insn: x, key: i }
  })
  const showSubsetMask = subsetFlagsToBitmask(showSubset)
  const shownInsns = insnAndKeys.filter(
    (x) => (subsetFlagsToBitmask(x.insn.subsets) & showSubsetMask) != 0,
  )

  return (
    <ul>
      {shownInsns.map((x) => (
        <li key={x.key}>
          <AsmDBInsn insn={x.insn} useManualSyntax={useManualSyntax} />
        </li>
      ))}
    </ul>
  )
}

export default function InsnListPage({
  data,
}: {
  data: AsmDBData
}): JSX.Element {
  const [useManualSyntax, setUseManualSyntax] = useState(false)
  const [ss, setSelectedSubset] = useState<SubsetFlags>({
    primary: false,
    la32: false,
    la64: true,
    lsx: false,
    lasx: false,
    lbt: false,
    lvz: false,
    provisional: false,
  })
  const alterSS = (modifier: (origSS: SubsetFlags, x: boolean) => void) => {
    return (x: boolean) => {
      let newSS: SubsetFlags = {
        primary: ss.primary,
        la32: ss.la32,
        la64: ss.la64,
        lsx: ss.lsx,
        lasx: ss.lasx,
        lbt: ss.lbt,
        lvz: ss.lvz,
        provisional: ss.provisional,
      }
      modifier(newSS, x)
      setSelectedSubset(newSS)
    }
  }

  const subsetsConfig = [
    {
      name: 'LA32 Primary',
      get: () => ss.primary,
      action: alterSS((ss, x) => {
        ss.primary = x
      }),
    },
    {
      name: 'LA32',
      get: () => ss.la32,
      action: alterSS((ss, x) => {
        ss.la32 = x
      }),
    },
    {
      name: 'LA64',
      get: () => ss.la64,
      action: alterSS((ss, x) => {
        ss.la64 = x
      }),
    },
    {
      name: 'LSX',
      get: () => ss.lsx,
      action: alterSS((ss, x) => {
        ss.lsx = x
      }),
    },
    {
      name: 'LASX',
      get: () => ss.lasx,
      action: alterSS((ss, x) => {
        ss.lasx = x
      }),
    },
    {
      name: 'LBT',
      get: () => ss.lbt,
      action: alterSS((ss, x) => {
        ss.lbt = x
      }),
    },
    {
      name: 'LVZ',
      get: () => ss.lvz,
      action: alterSS((ss, x) => {
        ss.lvz = x
      }),
    },
    {
      name: '非正式指令',
      get: () => ss.provisional,
      action: alterSS((ss, x) => {
        ss.provisional = x
      }),
    },
  ]

  return (
    <>
      <Switch onChange={setUseManualSyntax} />
      以龙芯官方指定的指令助记符、汇编语法展示下列内容
      <br />
      要看哪些指令？
      {subsetsConfig.map((cfg, i) => (
        <Checkbox
          key={i}
          checked={cfg.get()}
          onChange={(e) => cfg.action(e.target.checked)}
        >
          {cfg.name}
        </Checkbox>
      ))}
      <InsnList data={data} useManualSyntax={useManualSyntax} showSubset={ss} />
    </>
  )
}
