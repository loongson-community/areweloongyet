import { Layout as AntdLayout, Menu } from 'antd'
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom'
import { Redirect } from '@docusaurus/router'

import Layout from '@theme/Layout'
import ThemeAwareAntdContainer from '@site/src/components/ThemeAwareAntdContainer'
import EncodingSpaceOverviewPage from './encodingSpaceOverviewPage'
import InsnExplainerPage from './insnExplainerPage'
import InsnListPage from './insnListPage'
import type { AsmDBData } from './types'
import VldiHelperPage from './vldiHelperPage'

export default function AsmDBPage({ data }: { data: AsmDBData }): JSX.Element {
  let { path, url } = useRouteMatch()

  return (
    <Layout title={'LoongArch 汇编指令速查'}>
      <ThemeAwareAntdContainer>
        <AntdLayout>
          {/* TODO: fixed sidebar */}
          <AntdLayout.Sider breakpoint='lg' collapsedWidth={0}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['encodingSpaceOverview']}
              style={{ height: '100%' }}
            >
              <Menu.Item key="encodingSpaceOverview">
                <Link to={`${url}/encodingSpaceOverview`}>编码空间总览</Link>
              </Menu.Item>
              <Menu.Item key="insnList" disabled>
                指令列表（开发中）
              </Menu.Item>
              <Menu.Item key="insnExplainer" disabled>
                解读指令字（开发中）
              </Menu.Item>
              <Menu.Item key="vldiHelper">
                <Link to={`${url}/vldiHelper`}>VLDI 辅助</Link>
              </Menu.Item>
            </Menu>
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
