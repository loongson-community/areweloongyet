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

function makeMatchNode(m: DecodeTreeMatch, node: DecodeTreeNode, keyPrefix: string): TreeDataNode {
  const key = `${keyPrefix}-m${m.match}`

  if (m.next)
    return transformDecodeTreeForAntd(m.next, key, m.match, node.look_at)

  return {
    title: `${representMatchValue(m.match, node.look_at)}: ${m.matched}`,
    key: key,
    icon: <CheckOutlined />,
  }
}

function transformDecodeTreeForAntd(node: DecodeTreeNode, key: string, myMatch: number, parentLookAt: Bitfield[]): TreeDataNode {
  const lookAtBitfield = `检查 [${representBitfields(node.look_at)}] 位`

  return {
    title: key == '0' ? lookAtBitfield : `${representMatchValue(myMatch, parentLookAt)}: ${lookAtBitfield}`,
    key: key,
    icon: <EyeOutlined />,
    children: _.map(node.matches, (x) => makeMatchNode(x, node, key)),
  }
}

export default function (node: DecodeTreeNode): TreeDataNode {
  return transformDecodeTreeForAntd(node, '0', 0, [])
}
