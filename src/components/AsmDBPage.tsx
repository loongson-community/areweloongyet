import { Checkbox, Switch } from 'antd'
import { action, computed, makeObservable, observable } from 'mobx'
import { Observer } from 'mobx-react-lite'

import Layout from '@theme/Layout'
import ThemeAwareAntdContainer from '@site/src/components/ThemeAwareAntdContainer'
import AsmDB from '@site/src/components/AsmDB'

class AsmDBPageUIState {
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

export default function AsmDBPage({data}: {data: AsmDBData}): JSX.Element {
  let state = new AsmDBPageUIState()

  const subsetsConfig = [
    {name: 'LA32 Primary', get: () => state.subsetLA32Primary, action: (x: boolean) => state.setSubsetLA32Primary(x)},
    {name: 'LA32', get: () => state.subsetLA32, action: (x: boolean) => state.setSubsetLA32(x)},
    {name: 'LA64', get: () => state.subsetLA64, action: (x: boolean) => state.setSubsetLA64(x)},
    {name: 'LSX', get: () => state.subsetLSX, action: (x: boolean) => state.setSubsetLSX(x)},
    {name: 'LASX', get: () => state.subsetLASX, action: (x: boolean) => state.setSubsetLASX(x)},
    {name: 'LBT', get: () => state.subsetLBT, action: (x: boolean) => state.setSubsetLBT(x)},
    {name: 'LVZ', get: () => state.subsetLVZ, action: (x: boolean) => state.setSubsetLVZ(x)},
    {name: '非正式指令', get: () => state.subsetProvisional, action: (x: boolean) => state.setSubsetProvisional(x)},
  ]

  return (
    <Layout title={'LoongArch 汇编指令速查'}>
      <Observer>{() => {
        return <>
          <ThemeAwareAntdContainer>
            <Switch onChange={(x) => state.setUseManualSyntax(x)} />以龙芯官方指定的指令助记符、汇编语法展示下列内容<br />

            要看哪些指令？
            {subsetsConfig.map((cfg, i) => <Checkbox
              key={i}
              checked={cfg.get()}
              onChange={(e) => cfg.action(e.target.checked)}>{cfg.name}</Checkbox>)}
          </ThemeAwareAntdContainer>

          <AsmDB
            data={data}
            useManualSyntax={state.useManualSyntax}
            showSubset={state.selectedSubset}
          />
        </>
      }}
      </Observer>
    </Layout>
  )
}
