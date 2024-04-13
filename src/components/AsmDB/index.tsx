import { Checkbox, Layout as AntdLayout, Menu, Switch } from 'antd'
import type { MenuProps } from 'antd'
import { action, computed, makeObservable, observable } from 'mobx'
import { Observer } from 'mobx-react-lite'
import { useState } from 'react'

import Layout from '@theme/Layout'
import BoolFlag from '@site/src/components/BoolFlag'
import ThemeAwareAntdContainer from '@site/src/components/ThemeAwareAntdContainer'
import AsmDBBits from './bits'
import { getInsnMnemonic } from './insn'

function Subsets({ ss }: { ss: SubsetFlags }): JSX.Element {
  if (ss.provisional)
    return (
      <p>非正式指令</p>
    )

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

function AsmDBInsn({ insn, useManualSyntax }: { insn: Insn, useManualSyntax: boolean }): JSX.Element {
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
  if (x.provisional)
    y |= 0b10000000
  return y
}

class AsmDBListPageUIState {
  useManualSyntax: boolean
  selectedSubset: SubsetFlags

  constructor() {
    this.useManualSyntax = false
    this.selectedSubset = {
      primary: false,
      la32: false,
      la64: true,
      lsx: false,
      lasx: false,
      lbt: false,
      lvz: false,
      provisional: false,
    }

    // XXX We have to init members here, because Docusaurus doesn't use our
    // tsconfig which has the required useDefineForClassFields flag set, for
    // makeAutoObservable without explicit initialization to work.
    // makeAutoObservable(this)
    makeObservable(this, {
      useManualSyntax: observable,
      selectedSubset: observable,
      setUseManualSyntax: action,
      subsetLA32: computed,
      subsetLA32Primary: computed,
      subsetLA64: computed,
      subsetLSX: computed,
      subsetLASX: computed,
      subsetLBT: computed,
      subsetLVZ: computed,
      subsetProvisional: computed,
      setSubsetLA32: action,
      setSubsetLA32Primary: action,
      setSubsetLA64: action,
      setSubsetLSX: action,
      setSubsetLASX: action,
      setSubsetLBT: action,
      setSubsetLVZ: action,
      setSubsetProvisional: action,
    })
  }

  setUseManualSyntax(newVal: boolean) {
    this.useManualSyntax = newVal
  }

  get subsetLA32() { return this.selectedSubset.la32 }
  get subsetLA32Primary() { return this.selectedSubset.primary }
  get subsetLA64() { return this.selectedSubset.la64 }
  get subsetLSX() { return this.selectedSubset.lsx }
  get subsetLASX() { return this.selectedSubset.lasx }
  get subsetLBT() { return this.selectedSubset.lbt }
  get subsetLVZ() { return this.selectedSubset.lvz }
  get subsetProvisional() { return this.selectedSubset.provisional }

  setSubsetLA32(x: boolean) { this.selectedSubset.la32 = x }
  setSubsetLA32Primary(x: boolean) { this.selectedSubset.primary = x }
  setSubsetLA64(x: boolean) { this.selectedSubset.la64 = x }
  setSubsetLSX(x: boolean) { this.selectedSubset.lsx = x }
  setSubsetLASX(x: boolean) { this.selectedSubset.lasx = x }
  setSubsetLBT(x: boolean) { this.selectedSubset.lbt = x }
  setSubsetLVZ(x: boolean) { this.selectedSubset.lvz = x }
  setSubsetProvisional(x: boolean) { this.selectedSubset.provisional = x }
}

function InsnList({ data, useManualSyntax, showSubset }: AsmDBOptions): JSX.Element {
  const insnAndKeys = data.insns.map((x, i) => { return { insn: x, key: i } })
  const showSubsetMask = subsetFlagsToBitmask(showSubset)
  const shownInsns = insnAndKeys.filter((x) => (subsetFlagsToBitmask(x.insn.subsets) & showSubsetMask) != 0)

  return (
    <ul>
      {shownInsns.map((x) => <li key={x.key}><AsmDBInsn insn={x.insn} useManualSyntax={useManualSyntax} /></li>)}
    </ul>
  )
}

function InsnListPage({ data }: { data: AsmDBData }): JSX.Element {
  let state = new AsmDBListPageUIState()

  const subsetsConfig = [
    { name: 'LA32 Primary', get: () => state.subsetLA32Primary, action: (x: boolean) => state.setSubsetLA32Primary(x) },
    { name: 'LA32', get: () => state.subsetLA32, action: (x: boolean) => state.setSubsetLA32(x) },
    { name: 'LA64', get: () => state.subsetLA64, action: (x: boolean) => state.setSubsetLA64(x) },
    { name: 'LSX', get: () => state.subsetLSX, action: (x: boolean) => state.setSubsetLSX(x) },
    { name: 'LASX', get: () => state.subsetLASX, action: (x: boolean) => state.setSubsetLASX(x) },
    { name: 'LBT', get: () => state.subsetLBT, action: (x: boolean) => state.setSubsetLBT(x) },
    { name: 'LVZ', get: () => state.subsetLVZ, action: (x: boolean) => state.setSubsetLVZ(x) },
    { name: '非正式指令', get: () => state.subsetProvisional, action: (x: boolean) => state.setSubsetProvisional(x) },
  ]

  return <Observer>{() => <>
    <Switch onChange={(x) => state.setUseManualSyntax(x)} />以龙芯官方指定的指令助记符、汇编语法展示下列内容<br />

    要看哪些指令？
    {subsetsConfig.map((cfg, i) => <Checkbox
      key={i}
      checked={cfg.get()}
      onChange={(e) => cfg.action(e.target.checked)}>{cfg.name}</Checkbox>)}

    <InsnList
      data={data}
      useManualSyntax={state.useManualSyntax}
      showSubset={state.selectedSubset}
    />
  </>}</Observer>
}

function InsnExplainerPage({ data }: { data: AsmDBData }): JSX.Element {
  return <p>TODO</p>
}

export default function AsmDBPage({ data }: { data: AsmDBData }): JSX.Element {
  const panes = [
    <InsnListPage data={data} />,
    <InsnExplainerPage data={data} />,
  ]
  const [paneIdx, setPaneIdx] = useState(0)

  const sideNavItems: MenuProps['items'] = [
    { key: 'insnList', label: '指令列表', onClick: () => setPaneIdx(0)},
    { key: 'insnExplainer', label: '解读指令字', onClick: () => setPaneIdx(1)},
  ]

  return (
    <Layout title={'LoongArch 汇编指令速查'}>
      <ThemeAwareAntdContainer>
        <AntdLayout>
          {/* TODO: fixed sidebar */}
          <AntdLayout.Sider>
            <Menu
              mode="inline"
              defaultSelectedKeys={['insnList']}
              style={{ height: '100%' }}
              items={sideNavItems}
            />
          </AntdLayout.Sider>
          <AntdLayout.Content style={{padding: '1rem'}}>
            {panes[paneIdx]}
          </AntdLayout.Content>
        </AntdLayout>
      </ThemeAwareAntdContainer>
    </Layout>
  )
}
