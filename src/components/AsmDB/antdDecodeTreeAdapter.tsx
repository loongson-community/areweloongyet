import type { TreeDataNode } from "antd"
import { CheckOutlined, EyeOutlined } from '@ant-design/icons'
import _ from 'lodash'

import styles from './index.module.css'
import { type AugmentedDecodeTreeMatch, type AugmentedDecodeTreeNode } from "./augmentedDecodeTree"
import { bitfieldWidth, representBitfields } from "./bitfield"

function representMatchValue(val: number, bfs: Bitfield[]): string {
  const width = bitfieldWidth(bfs)
  return `0b${val.toString(2).padStart(width, '0')}`
}

type NodeTitleProps = {
  match?: AugmentedDecodeTreeMatch
  node?: AugmentedDecodeTreeNode
}

const wellKnownMatchPatterns = {
  '000000xxxxxxxxxxxxxxxxxxxxxxxxxx': '运算',
  '00000000000000000xxxxxxxxxxxxxxx': '双寄存器',
  '00000000000100xxxxxxxxxxxxxxxxxx': '三寄存器-甲',
  '00000000000101xxxxxxxxxxxxxxxxxx': '三寄存器-乙',
  '00000000000110xxxxxxxxxxxxxxxxxx': '三寄存器-丙',
  '00000000000111xxxxxxxxxxxxxxxxxx': '乘',
  '00000000001000xxxxxxxxxxxxxxxxxx': '除',
  '00000000001001xxxxxxxxxxxxxxxxxx': 'CRC',
  '00000000010xxxxxxxxxxxxxxxxxxxxx': '移位',
  '0000000100xxxxxxxxxxxxxxxxxxxxxx': 'FP 三寄存器',
  '000001xxxxxxxxxxxxxxxxxxxxxxxxxx': '特权',
  '00000110010010000xxxxxxxxxxxxxxx': 'IOCSR-TLB',
  '000010xxxxxxxxxxxxxxxxxxxxxxxxxx': '四寄存器',
  '000011xxxxxxxxxxxxxxxxxxxxxxxxxx': '比较选择',
  '000011000001xxxxxxxxxxxxxxxxxxxx': '比较选择-FP FP32',
  '000011000010xxxxxxxxxxxxxxxxxxxx': '比较选择-FP FP64',
  '000011000101xxxxxxxxxxxxxxxxxxxx': '比较选择-LSX FP32',
  '000011000110xxxxxxxxxxxxxxxxxxxx': '比较选择-LSX FP64',
  '000011001001xxxxxxxxxxxxxxxxxxxx': '比较选择-LASX FP32',
  '000011001010xxxxxxxxxxxxxxxxxxxx': '比较选择-LASX FP64',
  '000101xxxxxxxxxxxxxxxxxxxxxxxxxx': '大立即数-甲',
  '000110xxxxxxxxxxxxxxxxxxxxxxxxxx': '大立即数-乙',
  '000111xxxxxxxxxxxxxxxxxxxxxxxxxx': '大立即数-丙',
  '001000xxxxxxxxxxxxxxxxxxxxxxxxxx': '访存-LLSC',
  '001001xxxxxxxxxxxxxxxxxxxxxxxxxx': '访存-大立即数',
  '001010xxxxxxxxxxxxxxxxxxxxxxxxxx': '访存-整数与 FP',
  '001011xxxxxxxxxxxxxxxxxxxxxxxxxx': '访存-SIMD 与 LBT',
  '001100xxxxxxxxxxxxxxxxxxxxxxxxxx': '访存-SIMD 元素',
  '001110xxxxxxxxxxxxxxxxxxxxxxxxxx': '访存-原子与复合',
  '010010xxxxxxxxxxxxxxxxxxxxxxxxxx': '跳转-FP 与 LBT',
  '011100xxxxxxxxxxxxxxxxxxxxxxxxxx': '运算-LSX',
  '011101xxxxxxxxxxxxxxxxxxxxxxxxxx': '运算-LASX',
}

function NodeTitle({ match, node }: NodeTitleProps): JSX.Element {
  if (!match)
    match = node.parentMatch

  const matchNumber = match ? match.match : 0
  const matchPattern = node ? node.key : match.key
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
  if (wellKnownMatchPatterns.hasOwnProperty(matchPattern))
    preAttribs.push(<span className={styles.attrib} key={`${matchPattern}-alias`}>{wellKnownMatchPatterns[matchPattern]}</span>)

  if (insn) {
    postAttribs.push(<span className={styles.attrib} key={`${matchPattern}-subspace`}>空间占用 {match.numUsedInsnWords}</span>)
    return <>
      <span>{representMatchValue(matchNumber, lookAt)}{preAttribs}: {insn}</span>
      {postAttribs}
    </>
  }

  const root = matchPattern == 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  if (root)
    postAttribs.push(<span className={styles.attrib} key={`${matchPattern}-major`}>主操作码</span>)
  if (node)
    postAttribs.push(<span className={styles.attrib} key={`${matchPattern}-fanout`}>扇出 {node.matches.length}</span>)

  if (node.numUsedInsnWords == node.numTotalInsnWords)
    postAttribs.push(<span className={styles.attrib} key={`${matchPattern}-subspace`}>子空间共 {node.numTotalInsnWords} 已满</span>)
  else
    postAttribs.push(<span className={styles.attrib} key={`${matchPattern}-subspace`}>子空间共 {node.numTotalInsnWords} 已分配 {node.numUsedInsnWords} ({(node.numUsedInsnWords / node.numTotalInsnWords * 100).toFixed(2)}%)</span>)

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
