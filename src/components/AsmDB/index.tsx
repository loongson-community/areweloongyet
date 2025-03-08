import { Layout as AntdLayout, Menu, MenuProps } from 'antd'
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom'
import { Redirect } from '@docusaurus/router'

import Layout from '@theme/Layout'
import ThemeAwareAntdContainer from '@site/src/components/ThemeAwareAntdContainer'
import EncodingSpaceOverviewPage from './encodingSpaceOverviewPage'
import InsnExplainerPage from './insnExplainerPage'
import InsnListPage from './insnListPage'
import type { AsmDBData } from './types'
import VldiHelperPage from './vldiHelperPage'

export default function AsmDBPage({
  data,
}: {
  data: AsmDBData
}): React.JSX.Element {
  const { path, url } = useRouteMatch()
  const sideNavItems: MenuProps['items'] = [
    {
      key: 'encodingSpaceOverview',
      label: <Link to={`${url}/encodingSpaceOverview`}>编码空间总览</Link>,
    },
    {
      key: 'insnList',
      disabled: true,
      label: '指令列表（开发中）',
    },
    {
      key: 'insnExplainer',
      disabled: true,
      label: '解读指令字（开发中）',
    },
    {
      key: 'vldiHelper',
      label: <Link to={`${url}/vldiHelper`}>VLDI 辅助</Link>,
    },
  ]

  return (
    <Layout title={'LoongArch 汇编指令速查'}>
      <ThemeAwareAntdContainer>
        <AntdLayout>
          {/* TODO: fixed sidebar */}
          <AntdLayout.Sider breakpoint="lg" collapsedWidth={0}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['encodingSpaceOverview']}
              style={{ height: '100%' }}
              items={sideNavItems}
            />
          </AntdLayout.Sider>
          <AntdLayout.Content style={{ padding: '1rem' }}>
            <Switch>
              <Route exact path={`${path}/encodingSpaceOverview`}>
                <EncodingSpaceOverviewPage data={data} />
              </Route>
              <Route exact path={`${path}/insnList`}>
                <InsnListPage data={data} />
              </Route>
              <Route exact path={`${path}/insnExplainer`}>
                <InsnExplainerPage data={data} />
              </Route>
              <Route exact path={`${path}/vldiHelper`}>
                <VldiHelperPage />
              </Route>
              <Route>
                <Redirect to={`${url}/encodingSpaceOverview`} />
              </Route>
            </Switch>
          </AntdLayout.Content>
        </AntdLayout>
      </ThemeAwareAntdContainer>
    </Layout>
  )
}
