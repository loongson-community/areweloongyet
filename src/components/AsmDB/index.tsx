import BoolFlag from '@site/src/components/BoolFlag'
import AsmDBBits from './bits'
import { getInsnMnemonic } from './insn'

function Subsets({ss}: {ss: SubsetFlags}): JSX.Element {
  return (
    <p>
      见于：
      <BoolFlag val={ss.primary} />LA32 Primary，
      <BoolFlag val={ss.la32} />LA32，
      <BoolFlag val={ss.la64} />LA64，
      <BoolFlag val={ss.lsx} />LSX，
      <BoolFlag val={ss.lasx} />LASX，
      <BoolFlag val={ss.lbt} />LBT，
      <BoolFlag val={ss.lvz} />LVZ
    </p>
  )
}

function AsmDBInsn({insn, useManualSyntax}: {insn: Insn, useManualSyntax: boolean}): JSX.Element {
  return (
    <section>
      <h3>{getInsnMnemonic(insn, useManualSyntax)}</h3>
      <AsmDBBits insn={insn} useManualSyntax={useManualSyntax} />
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
  if (x.lbt)
    y |= 0b100000
  if (x.lvz)
    y |= 0b1000000
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
