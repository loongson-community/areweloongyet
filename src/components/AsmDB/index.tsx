import { Layout as AntdLayout, Menu } from 'antd'
import type { MenuProps } from 'antd'
import { useState } from 'react'

import Layout from '@theme/Layout'
import ThemeAwareAntdContainer from '@site/src/components/ThemeAwareAntdContainer'
import EncodingSpaceOverviewPage from './encodingSpageOverviewPage'
import InsnExplainerPage from './insnExplainerPage'
import InsnListPage from './insnListPage'

export default function AsmDBPage({ data }: { data: AsmDBData }): JSX.Element {
  const panes = [
    <InsnListPage data={data} />,
    <EncodingSpaceOverviewPage data={data} />,
    <InsnExplainerPage data={data} />,
  ]
  const [paneIdx, setPaneIdx] = useState(0)

  const sideNavItems: MenuProps['items'] = [
    { key: 'insnList', label: '指令列表', onClick: () => setPaneIdx(0) },
    { key: 'encodingSpaceOverview', label: '编码空间总览', onClick: () => setPaneIdx(1) },
    { key: 'insnExplainer', label: '解读指令字', onClick: () => setPaneIdx(2) },
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
          <AntdLayout.Content style={{ padding: '1rem' }}>
            {panes[paneIdx]}
          </AntdLayout.Content>
        </AntdLayout>
      </ThemeAwareAntdContainer>
    </Layout>
  )
}
