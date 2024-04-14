import { Col, Row, Statistic, Tree } from 'antd'
import _ from 'lodash'

import styles from './index.module.css'
import transformDecodeTreeForAntd from './antdDecodeTreeAdapter'

function decodeTreeDepth(node: DecodeTreeNode): number {
  if (!node)
    return 0

  return 1 + _.max(_.map(node.matches, (x) => decodeTreeDepth(x.next)))
}

type DecodeTreeViewProps = {
  node: DecodeTreeNode
}

const DecodeTreeView: React.FC<DecodeTreeViewProps & React.HTMLAttributes<HTMLDivElement>> = (props) => {
  const antdNode = transformDecodeTreeForAntd(props.node)

  return <Tree
    showLine={{ showLeafIcon: false }}
    showIcon={true}
    defaultExpandedKeys={['xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx']}
    treeData={[antdNode]}
    className={props.className}
    style={props.style}
  />
}

export default function EncodingSpaceOverviewPage({ data }: { data: AsmDBData }): JSX.Element {
  const numInsns = data.insns.length
  const depth = decodeTreeDepth(data.decodetree)
  const numInsnFormats = _.uniq(_.map(data.insns, (x) => x.format.repr)).length

  return <>
    <Row gutter={16}>
      <Col span={3}>
        <Statistic title="已知指令数" value={numInsns} />
        <Statistic title="指令格式数" value={numInsnFormats} style={{ marginTop: 16 }} />
        <Statistic title="译码决策树深度" value={depth} style={{ marginTop: 16 }} />
        <Statistic title="已分配主操作码" value={data.decodetree.matches.length} suffix="/ 64" style={{ marginTop: 16 }} />
      </Col>
      <Col span={18}>
        <DecodeTreeView node={data.decodetree} className={styles.decodeTreeView} />
      </Col>
      <Col span={3}>
        TODO
      </Col>
    </Row>
  </>
}
