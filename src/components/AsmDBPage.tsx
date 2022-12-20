import React from 'react'
import { Switch } from 'antd'
import { action, makeObservable, observable } from 'mobx'
import { Observer, observer } from 'mobx-react-lite'

import { usePluginData } from '@docusaurus/useGlobalData'
import Layout from '@theme/Layout'
import ThemeAwareAntdContainer from '@site/src/components/ThemeAwareAntdContainer'
import AsmDB from '@site/src/components/AsmDB'

class AsmDBPageUIState {
  useManualSyntax: boolean

  constructor() {
    this.useManualSyntax = false

    // XXX We have to init members here, because Docusaurus doesn't use our
    // tsconfig which has the required useDefineForClassFields flag set, for
    // makeAutoObservable without explicit initialization to work.
    // makeAutoObservable(this)
    makeObservable(this, {
      useManualSyntax: observable,
      setUseManualSyntax: action,
    })
  }

  setUseManualSyntax(newVal: boolean) {
    this.useManualSyntax = newVal
  }
}

export default function AsmDBPage({data}: {data: AsmDBData}): JSX.Element {
  let state = new AsmDBPageUIState()

  return (
    <Layout title={'LoongArch 汇编指令速查'}>
      <Observer>{() => {
        return <>
          <ThemeAwareAntdContainer>
            <Switch onChange={(x) => state.setUseManualSyntax(x)} />以龙芯官方指定的指令助记符、汇编语法展示下列内容
          </ThemeAwareAntdContainer>

          <AsmDB
            data={data}
            useManualSyntax={state.useManualSyntax}
          />
        </>
      }}
      </Observer>
    </Layout>
  )
}
