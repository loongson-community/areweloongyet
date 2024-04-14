import type { TreeDataNode } from "antd"
import { CheckOutlined, EyeOutlined } from '@ant-design/icons'
import _ from 'lodash'

function representBitfield(bf: Bitfield): string {
  return bf.len == 1 ? bf.lsb.toString(10) : `${bf.lsb + bf.len - 1}:${bf.lsb}`
}

function representBitfields(bfs: Bitfield[]): string {
  if (bfs.length == 1)
    return representBitfield(bfs[0])
  return _.map(_.reverse(bfs), representBitfield).join(',')
}

function bitfieldWidth(bfs: Bitfield[]): number {
  return _.sum(_.map(bfs, (x) => x.len))
}

function representMatchValue(val: number, bfs: Bitfield[]): string {
  const width = bitfieldWidth(bfs)
  return `0b${val.toString(2).padStart(width, '0')}`
}

type NodeTitleProps = {
  match: number
  lookAt: Bitfield[]
  parentLookAt?: Bitfield[]
  insn?: string
  root?: boolean
}

function NodeTitle({ match, lookAt, parentLookAt, insn, root }: NodeTitleProps): JSX.Element {
  if (insn)
    return <span>{representMatchValue(match, lookAt)}: {insn}</span>

  if (root)
    return <span>检查 [{representBitfields(lookAt)}] 位</span>

  return <span>{representMatchValue(match, parentLookAt)}: 检查 [{representBitfields(lookAt)}] 位</span>
}

function makeMatchNode(m: DecodeTreeMatch, node: DecodeTreeNode, keyPrefix: string): TreeDataNode {
  const key = `${keyPrefix}-m${m.match}`

  if (m.next)
    return transformDecodeTreeForAntd(m.next, key, m.match, node.look_at)

  return {
    title: <NodeTitle match={m.match} lookAt={node.look_at} insn={m.matched} />,
    key: key,
    icon: <CheckOutlined />,
  }
}

function transformDecodeTreeForAntd(node: DecodeTreeNode, key: string, myMatch: number, parentLookAt: Bitfield[]): TreeDataNode {
  return {
    title: <NodeTitle
      match={myMatch}
      lookAt={node.look_at}
      parentLookAt={parentLookAt}
      root={key == '0'}
    />,
    key: key,
    icon: <EyeOutlined />,
    children: _.map(node.matches, (x) => makeMatchNode(x, node, key)),
  }
}

export default function (node: DecodeTreeNode): TreeDataNode {
  return transformDecodeTreeForAntd(node, '0', 0, [])
}
