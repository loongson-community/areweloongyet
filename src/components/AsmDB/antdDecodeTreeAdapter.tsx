import type { TreeDataNode } from "antd"
import { CheckOutlined, EyeOutlined } from '@ant-design/icons'
import _ from 'lodash'

import styles from './index.module.css'
import { type AugmentedDecodeTreeMatch, type AugmentedDecodeTreeNode } from "./augmentedDecodeTree"
import { bitfieldWidth, representBitfields } from "./bitfield"

function representMatchValue(val: number, bfs: Bitfield[]): string {
  const sortedBFs = _.sortBy(_.clone(bfs), 'lsb')
  const reprs = []
  for (const bf of sortedBFs) {
    reprs.push((val & ((1 << bf.len) - 1)).toString(2).padStart(bf.len, '0'))
    val >>= bf.len
  }
  reprs.reverse()

  return `0b${reprs.join("'")}`
}

type NodeTitleProps = {
  match?: AugmentedDecodeTreeMatch
  node?: AugmentedDecodeTreeNode
}


function NodeTitle({ match, node }: NodeTitleProps): JSX.Element {
  if (!match)
    match = node.parentMatch

  const matchNumber = match ? match.match : 0
  const matchPattern = node ? node.key : match.key
  const alias = match?.wellKnownAlias || node?.wellKnownAlias
  const insn = match ? match.matched : ''
  const lookAt = node ? node.look_at : match.parentNode.look_at
  const parentLookAt = node ? node.parentLookAt : null

  const preAttribs: JSX.Element[] = []
  const postAttribs: JSX.Element[] = []
  if (match?.fmt)
    if (node)
      postAttribs.push(<span className={styles.contentAttrib} key={`${matchPattern}-fmt`}>并确定格式为 {match.fmt}</span>)
    else
      postAttribs.push(<span className={styles.attrib} key={`${matchPattern}-fmt`}>格式 {match.fmt}</span>)
  if (alias)
    preAttribs.push(<span className={styles.attrib} key={`${matchPattern}-alias`}>{alias}</span>)

  if (insn) {
    return <>
      <span>{representMatchValue(matchNumber, lookAt)}{preAttribs}: {insn}</span>
      {postAttribs}
    </>
  }

  const root = matchPattern == 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  if (root)
    postAttribs.push(<span className={styles.attrib} key={`${matchPattern}-major`}>主操作码</span>)
  if (node) {
    const numAllocatedPrefixes = node.matches.length
    const numTotalPrefixes = 1 << bitfieldWidth(node.look_at)
    if (numAllocatedPrefixes == numTotalPrefixes && node.numUsedInsnWords == node.numTotalInsnWords) {
      postAttribs.push(<span className={styles.attrib} key={`${matchPattern}-subspace`}>子空间已满</span>)
    } else {
      if (numAllocatedPrefixes == numTotalPrefixes)
        postAttribs.push(<span className={styles.attrib} key={`${matchPattern}-fanout`}>子前缀空间已满</span>)
      else
        postAttribs.push(<span className={styles.attrib} key={`${matchPattern}-fanout`}>子前缀空间 {numAllocatedPrefixes}/{numTotalPrefixes}</span>)

      if (node.numUsedInsnWords == node.numTotalInsnWords)
        postAttribs.push(<span className={styles.attrib} key={`${matchPattern}-subspace`}>子编码空间已满</span>)
      else
        postAttribs.push(<span className={styles.attrib} key={`${matchPattern}-subspace`}>子编码空间占用 {(node.numUsedInsnWords / node.numTotalInsnWords * 100).toFixed(2)}%</span>)
    }
  }

  if (root)
    return <>
      <span>检查 [{representBitfields(lookAt)}] 位</span>
      {postAttribs}
    </>

  return <>
    <span>{representMatchValue(matchNumber, parentLookAt)}{preAttribs}: 检查 [{representBitfields(lookAt)}] 位</span>
    {postAttribs}
  </>
}

function makeMatchNode(
  m: AugmentedDecodeTreeMatch,
): TreeDataNode {
  if (m.next)
    return transformDecodeTreeForAntd(m.next)

  return {
    title: <NodeTitle match={m} />,
    key: m.key,
    icon: <CheckOutlined />,
  }
}

export function transformDecodeTreeForAntd(
  node: AugmentedDecodeTreeNode,
): TreeDataNode {
  return {
    title: <NodeTitle node={node} />,
    key: node.key,
    icon: <EyeOutlined />,
    children: _.map(node.matches, makeMatchNode),
  }
}
