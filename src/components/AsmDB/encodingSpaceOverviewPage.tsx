import { Col, Grid, Row, Statistic, Tag, Tree, TreeDataNode } from 'antd'
import _ from 'lodash'
import { useState } from 'react'

import styles from './index.module.css'
import { transformDecodeTreeForAntd } from './antdDecodeTreeAdapter'
import { augmentDecodeTree, mapifyAugmentedDecodeTree, type AugmentedNodeMap } from './augmentedDecodeTree'
import { bitfieldWidth, bitfieldsToMask } from './bitfield'
import { BitsRepr } from './bits'
import { parseInsnFormat } from './insnFormat'
import type { AsmDBData, DecodeTreeNode } from './types'

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
    return <>
      <h2>编码空间明细</h2>
      <p>在译码决策树中选择一个节点，以查看其详细信息。</p>
    </>

  const vertMargin = { marginTop: 16 }

  const selectedNode = props.data[props.selectedKey]
  if (!selectedNode.node) {
    // insn
    const m = selectedNode.match
    const fmt = parseInsnFormat(m.fmt)
    const subspaceUsageRatio = m.numUsedInsnWords / m.parentNode.numTotalInsnWords * 100
    const universeUsageRatio = m.numUsedInsnWords / 0x100000000 * 1000
    const universeUsageRatioText = universeUsageRatio < 0.001 ? '< 0.001' : universeUsageRatio.toFixed(3).toString()

    return <>
      <h2>{m.matched}</h2>
      <BitsRepr word={m.rawMatch} mask={m.mask} maskToEmph={bitfieldsToMask(m.parentNode.look_at)} fmt={fmt} />
      <Row gutter={16}>
        <Col span={8}><Statistic title="指令格式" value={m.fmt} style={vertMargin} /></Col>
        <Col span={8}><Statistic title="编码空间占用" value={m.numUsedInsnWords} style={vertMargin} /></Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}><Statistic title="本级空间占比" value={subspaceUsageRatio.toFixed(2)} suffix="%" style={vertMargin} /></Col>
        <Col span={8}><Statistic title="根空间占比" value={universeUsageRatioText} suffix="‰" style={vertMargin} /></Col>
      </Row>
    </>
  }

  // (sub)space
  const n = selectedNode.node
  const root = props.selectedKey == 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  const title = root ? '根编码空间' : '子编码空间'
  const allocationRatio = n.numUsedInsnWords / n.numTotalInsnWords * 100
  const subspaceUsageRatio = root ? 1 : n.numTotalInsnWords / n.parentMatch.parentNode.numTotalInsnWords * 100
  const universeUsageRatio = root ? 1 : n.numTotalInsnWords / 0x100000000 * 1000
  const universeUsageRatioText = universeUsageRatio < 0.001 ? '< 0.001' : universeUsageRatio.toFixed(3).toString()
  const numAllocatedPrefixes = n.matches.length
  const numTotalPrefixes = 1 << bitfieldWidth(n.look_at)

  let spaceUsageRatios = <></>
  if (!root)
    spaceUsageRatios = <Row gutter={16}>
      <Col span={8}><Statistic title="本级空间占比" value={subspaceUsageRatio.toFixed(2)} suffix="%" style={vertMargin} /></Col>
      <Col span={8}><Statistic title="根空间占比" value={universeUsageRatioText} suffix="‰" style={vertMargin} /></Col>
    </Row>

  let insnFmtDisplay
  if (n.possibleFmts.length == 1)
    insnFmtDisplay = n.possibleFmts[0]
  else if (n.possibleFmts.length < 50)
    insnFmtDisplay = <>
      {_.map(n.possibleFmts, (x) => <Tag className={styles.insnFmtTag}>{x}</Tag>)}
    </>
  else
    insnFmtDisplay = `${n.possibleFmts.length} 种`

  return <>
    <h2>{title}</h2>
    <BitsRepr
      word={n.rawMatch}
      mask={n.mask}
      maskToCheck={bitfieldsToMask(n.look_at)}
      maskToEmph={bitfieldsToMask(n.parentLookAt || [])}
    />
    <Row gutter={16}>
      <Col span={8}><Statistic title="子前缀空间大小" value={numTotalPrefixes} style={vertMargin} /></Col>
      <Col span={8}><Statistic title="子前缀空间已分配" value={numAllocatedPrefixes} style={vertMargin} /></Col>
    </Row>
    {spaceUsageRatios}
    <Row gutter={16}>
      <Col span={8}><Statistic title="子编码空间大小" value={n.numTotalInsnWords} style={vertMargin} /></Col>
      <Col span={8}><Statistic title="子编码空间已分配" value={n.numUsedInsnWords} style={vertMargin} /></Col>
      <Col span={8}><Statistic title="已分配比例" value={allocationRatio.toFixed(2)} suffix="%" style={vertMargin} /></Col>
    </Row>
    {/* https://github.com/ant-design/ant-design/issues/43830 */}
    <Statistic title="指令格式" formatter={() => insnFmtDisplay} style={vertMargin} />
  </>
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
