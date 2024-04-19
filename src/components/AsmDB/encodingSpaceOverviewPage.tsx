import { Col, Grid, Row, Statistic, Tree, TreeDataNode } from 'antd'
import _ from 'lodash'
import { useState } from 'react'

import styles from './index.module.css'
import { transformDecodeTreeForAntd } from './antdDecodeTreeAdapter'
import { augmentDecodeTree, type AugmentedDecodeTreeNode, mapifyAugmentedDecodeTree, type AugmentedNodeMap } from './augmentedDecodeTree'

const { useBreakpoint } = Grid

function decodeTreeDepth(node: DecodeTreeNode): number {
  if (!node)
    return 0

  return 1 + _.max(_.map(node.matches, (x) => decodeTreeDepth(x.next)))
}

type DecodeTreeViewProps = {
  treeData: TreeDataNode
  onMatchKeyChange?: (newVal: string) => void
}

const DecodeTreeView: React.FC<DecodeTreeViewProps & React.HTMLAttributes<HTMLDivElement>> = (props) => {
  let onSelect = null
  if (props.onMatchKeyChange)
    onSelect = (sk: string[]) => props.onMatchKeyChange(sk[0])

  return <Tree
    showLine={{ showLeafIcon: false }}
    showIcon={true}
    defaultExpandedKeys={['xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx']}
    treeData={[props.treeData]}
    className={props.className}
    height={600}
    style={props.style}
    onSelect={onSelect}
  />
}

type DecodeTreeNodeDetailProps = {
  data: AugmentedNodeMap
  selectedKey: string
}

const DecodeTreeNodeDetail: React.FC<DecodeTreeNodeDetailProps & React.HTMLAttributes<HTMLDivElement>> = (props) => {
  if (!props.data.hasOwnProperty(props.selectedKey))
    return <></>

  const selectedNode = props.data[props.selectedKey]
  return <span>{selectedNode.key}</span>
}

export default function EncodingSpaceOverviewPage({ data }: { data: AsmDBData }): JSX.Element {
  const numInsns = data.insns.length
  const augmentedDecodeTree = augmentDecodeTree(data.decodetree)
  const augmentedDataMap = mapifyAugmentedDecodeTree(augmentedDecodeTree)
  const antdNode = transformDecodeTreeForAntd(augmentedDecodeTree)
  const depth = decodeTreeDepth(data.decodetree)
  const numAllocatedOpcodes = data.decodetree.matches.length
  const numFirstPartyOpcodes = _.filter(data.decodetree.matches, (x) => x.match <= 0b011111).length
  const numUnifiedExtOpcodes = _.filter(data.decodetree.matches, (x) => x.match >= 0b100000 && x.match <= 0b101111).length
  const numInsnFormats = _.uniq(_.map(data.insns, (x) => x.format.repr)).length
  const allocationRatio = augmentedDecodeTree.numUsedInsnWords / augmentedDecodeTree.numTotalInsnWords * 100
  // HACK: we know all insns are 1st-party so far, so no need to really filter anything
  const firstPartyAllocationRatio = augmentedDecodeTree.numUsedInsnWords / 0x80000000 * 100

  const screens = useBreakpoint()
  const [selectedMatchKey, setSelectedMatchKey] = useState('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')

  return <>
    <Row gutter={16}>
      <Col xs={24} xl={3}>
        <Row>
          <Col xs={12} xl={24}><Statistic title="已知指令数" value={numInsns} /></Col>
          <Col xs={12} xl={24}><Statistic title="指令格式数" value={numInsnFormats} style={{ marginTop: screens.xl ? 16 : 0 }} /></Col>
        </Row>
        <Row>
          <Col xs={12} xl={24}><Statistic title="译码决策树深度" value={depth} style={{ marginTop: 16 }} /></Col>
          <Col xs={12} xl={24}><Statistic title="已分配主操作码" value={numAllocatedOpcodes} suffix="/ 64" style={{ marginTop: 16 }} /></Col>
        </Row>
        <Row>
          <Col xs={12} xl={24}><Statistic title="已分配第一方主操作码" value={numFirstPartyOpcodes} suffix="/ 32" style={{ marginTop: 16 }} /></Col>
          <Col xs={12} xl={24}><Statistic title="已分配第三方统一扩展主操作码" value={numUnifiedExtOpcodes} suffix="/ 16" style={{ marginTop: 16 }} /></Col>
        </Row>
        <Row>
          <Col xs={12} xl={24}><Statistic title="已分配编码空间" value={allocationRatio.toFixed(2)} suffix="%" style={{ marginTop: 16 }} /></Col>
          <Col xs={12} xl={24}><Statistic title="已分配第一方编码空间" value={firstPartyAllocationRatio.toFixed(2)} suffix="%" style={{ marginTop: 16 }} /></Col>
        </Row>
      </Col>
      <Col xs={24} xl={12} style={{ marginTop: screens.xl ? 0 : 16 }}>
        <DecodeTreeView
          treeData={antdNode}
          className={styles.decodeTreeView}
          onMatchKeyChange={setSelectedMatchKey}
        />
      </Col>
      <Col xs={24} xl={9} style={{ marginTop: screens.xl ? 0 : 16 }}>
        <DecodeTreeNodeDetail data={augmentedDataMap} selectedKey={selectedMatchKey} />
      </Col>
    </Row>
  </>
}
