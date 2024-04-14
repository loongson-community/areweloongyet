import type { TreeDataNode } from "antd"
import { CheckOutlined, EyeOutlined } from '@ant-design/icons'
import _ from 'lodash'

import styles from './index.module.css'

function representBitfield(bf: Bitfield): string {
  return bf.len == 1 ? bf.lsb.toString(10) : `${bf.lsb + bf.len - 1}:${bf.lsb}`
}

function representBitfields(bfs: Bitfield[]): string {
  if (bfs.length == 1)
    return representBitfield(bfs[0])
  return _.map(_.reverse(_.cloneDeep(bfs)), representBitfield).join(',')
}

function bitfieldWidth(bfs: Bitfield[]): number {
  return _.sum(_.map(bfs, (x) => x.len))
}

function mergeBitfields(a: Bitfield[], b: Bitfield[]): Bitfield[] {
  const tmp = _.sortBy(_.concat(_.cloneDeep(a), ..._.cloneDeep(b)), 'lsb')
  if (tmp.length < 2)
    return tmp

  for (let i = 1; i < tmp.length; i++) {
    if (tmp[i].lsb == tmp[i - 1].lsb + tmp[i - 1].len) {
      // merge tmp[i] into tmp[i-1]
      tmp[i - 1].len += tmp[i].len
      tmp.splice(i, 1)
      i--
    }
  }

  return tmp
}

function restoreIntoBitfields(num: number, bfs: Bitfield[]): number {
  let y = 0
  for (const bf of bfs) {
    y |= (num & ((1 << bf.len) - 1)) << bf.lsb
    num >>= bf.len
  }
  return y
}

function representMatchValue(val: number, bfs: Bitfield[]): string {
  const width = bitfieldWidth(bfs)
  return `0b${val.toString(2).padStart(width, '0')}`
}

type NodeTitleProps = {
  match?: DecodeTreeMatch
  matchNumber?: number
  matchPattern?: string
  lookAt: Bitfield[]
  parentLookAt?: Bitfield[]
  insn?: string
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

function NodeTitle({ match, matchNumber, matchPattern, lookAt, parentLookAt, insn }: NodeTitleProps): JSX.Element {
  if (match)
    matchNumber = match.match

  let preAttribs: JSX.Element[] = []
  let postAttribs: JSX.Element[] = []
  if (match?.fmt)
    postAttribs.push(<span className={styles.attrib} key={`${matchPattern}-fmt`}>格式 {match.fmt}</span>)
  if (wellKnownMatchPatterns.hasOwnProperty(matchPattern))
    preAttribs.push(<span className={styles.attrib} key={`${matchPattern}-alias`}>{wellKnownMatchPatterns[matchPattern]}</span>)

  if (insn)
    return <>
      <span>{representMatchValue(matchNumber, lookAt)}{preAttribs}: {insn}</span>
      {postAttribs}
    </>

  const root = matchPattern == 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
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
  m: DecodeTreeMatch,
  node: DecodeTreeNode,
  matchSoFar: number,
  myMatchBitfields: Bitfield[],
): TreeDataNode {
  const myMatch = matchSoFar | restoreIntoBitfields(m.match, node.look_at)
  const key = `m${makeMatchPatternKey(myMatch, myMatchBitfields)}`

  if (m.next)
    return transformDecodeTreeForAntd(m.next, m.match, node.look_at, myMatch, myMatchBitfields)

  return {
    title: <NodeTitle match={m} lookAt={node.look_at} insn={m.matched} />,
    key: key,
    icon: <CheckOutlined />,
  }
}

function makeMatchPatternKey(match: number, bfs: Bitfield[]): string {
  let s = match.toString(2).padStart(32, '0').split('')
  s.reverse()
  let y = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.split('')
  for (const bf of bfs)
    for (let i = bf.lsb; i < bf.lsb + bf.len; i++)
      y[i] = s[i]
  y.reverse()
  return y.join('')
}

function transformDecodeTreeForAntd(
  node: DecodeTreeNode,
  myMatch: number,
  parentLookAt: Bitfield[],
  matchSoFar: number,
  matchBitfieldsSoFar: Bitfield[],
): TreeDataNode {
  // figure out the actual match pattern so far, for showing helpful opcode aliases
  const myMatchBitfields = mergeBitfields(matchBitfieldsSoFar, node.look_at)
  const matchPattern = makeMatchPatternKey(matchSoFar, matchBitfieldsSoFar)

  return {
    title: <NodeTitle
      matchNumber={myMatch}
      matchPattern={matchPattern}
      lookAt={node.look_at}
      parentLookAt={parentLookAt}
    />,
    key: matchPattern,
    icon: <EyeOutlined />,
    children: _.map(node.matches, (x) => makeMatchNode(x, node, matchSoFar, myMatchBitfields)),
  }
}

export default function (node: DecodeTreeNode): TreeDataNode {
  return transformDecodeTreeForAntd(node, 0, [], 0, [])
}
