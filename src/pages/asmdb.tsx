import React from 'react'

import { Switch } from 'antd'

import { usePluginData } from '@docusaurus/useGlobalData'
import Layout from '@theme/Layout'
import ThemeAwareAntdContainer from '@site/src/components/ThemeAwareAntdContainer'
import AsmDB from '@site/src/components/AsmDB'

export default function AsmDBPage(): JSX.Element {
  let useManualSyntax = false // TODO: mobx

  return (
    <Layout title={"LoongArch 汇编指令速查"}>
      <ThemeAwareAntdContainer>
        <Switch onChange={(x) => {useManualSyntax = x}} />以龙芯官方指定的指令助记符、汇编语法展示下列内容
      </ThemeAwareAntdContainer>

      <AsmDB
        data={usePluginData('awly-asmdb-plugin')}
        useManualSyntax={useManualSyntax}
      />
    </Layout>
  )
}
