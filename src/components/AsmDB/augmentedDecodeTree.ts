import _ from 'lodash'

import {
  bitfieldWidth,
  bitfieldsToMask,
  mergeBitfields,
  restoreIntoBitfields,
} from './bitfield'
import type { Bitfield, DecodeTreeMatch, DecodeTreeNode } from './types'

const wellKnownMatchPatterns = {
  '000000xxxxxxxxxxxxxxxxxxxxxxxxxx': '运算',
  '00000000000000000xxxxxxxxxxxxxxx': '双寄存器',
  '00000000000100xxxxxxxxxxxxxxxxxx': '三寄存器・甲',
  '00000000000101xxxxxxxxxxxxxxxxxx': '三寄存器・乙',
  '00000000000110xxxxxxxxxxxxxxxxxx': '三寄存器・丙',
  '00000000000111xxxxxxxxxxxxxxxxxx': '三寄存器・乘',
  '00000000001000xxxxxxxxxxxxxxxxxx': '三寄存器・除',
  '00000000001001xxxxxxxxxxxxxxxxxx': '三寄存器・CRC',
  '0000000100xxxxxxxxxxxxxxxxxxxxxx': 'FP',
  '000001xxxxxxxxxxxxxxxxxxxxxxxxxx': '特权',
  '00000110010010000xxxxxxxxxxxxxxx': 'IOCSR TLB',
  '000010xxxxxxxxxxxxxxxxxxxxxxxxxx': '四寄存器',
  '000011xxxxxxxxxxxxxxxxxxxxxxxxxx': '比较选择',
  '000101xxxxxxxxxxxxxxxxxxxxxxxxxx': '大立即数・甲',
  '000110xxxxxxxxxxxxxxxxxxxxxxxxxx': '大立即数・乙',
  '000111xxxxxxxxxxxxxxxxxxxxxxxxxx': '大立即数・丙',
  '001000xxxxxxxxxxxxxxxxxxxxxxxxxx': '访存・LLSC',
  '001001xxxxxxxxxxxxxxxxxxxxxxxxxx': '访存・大立即数',
  '001010xxxxxxxxxxxxxxxxxxxxxxxxxx': '访存・基本',
  '001011xxxxxxxxxxxxxxxxxxxxxxxxxx': '访存・扩展・甲',
  '001100xxxxxxxxxxxxxxxxxxxxxxxxxx': '访存・扩展・乙',
  '001110xxxxxxxxxxxxxxxxxxxxxxxxxx': '访存・复杂',
  '010010xxxxxxxxxxxxxxxxxxxxxxxxxx': '分支・扩展',
  '011100xxxxxxxxxxxxxxxxxxxxxxxxxx': 'LSX',
  '011101xxxxxxxxxxxxxxxxxxxxxxxxxx': 'LASX',
}

function getWellKnownAlias(pat: string): string {
  if (wellKnownMatchPatterns.hasOwnProperty(pat))
    return wellKnownMatchPatterns[pat]
  return ''
}

function makeMatchPatternKey(match: number, bfs: Bitfield[]): string {
  const s = match.toString(2).padStart(32, '0').split('')
  s.reverse()
  const y = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.split('')
  for (const bf of bfs)
    for (let i = bf.lsb; i < bf.lsb + bf.len; i++) y[i] = s[i]
  y.reverse()
  return y.join('')
}

export type AugmentedDecodeTreeMatch = DecodeTreeMatch & {
  key: string
  wellKnownAlias: string
  rawMatch: number
  mask: number
  parentNode: AugmentedDecodeTreeNode
  next?: AugmentedDecodeTreeNode
  numUsedInsnWords: number
  possibleFmts: string[]
}

export type AugmentedDecodeTreeNode = DecodeTreeNode & {
  key: string
  wellKnownAlias: string
  rawMatch: number
  mask: number
  parentMatch?: AugmentedDecodeTreeMatch
  parentLookAt?: Bitfield[]
  matches: AugmentedDecodeTreeMatch[]
  numTotalInsnWords: number
  numUsedInsnWords: number
  possibleFmts: string[]
}

export function augmentDecodeTree(
  node: DecodeTreeNode,
): AugmentedDecodeTreeNode {
  const x = _.cloneDeep(node) as AugmentedDecodeTreeNode
  augmentDecodeTreeInplace(x, null, 0, [])
  return x
}

function augmentDecodeTreeInplace(
  node: AugmentedDecodeTreeNode,
  nodeMatch: AugmentedDecodeTreeMatch,
  matchSoFar: number,
  matchBitfieldsSoFar: Bitfield[],
) {
  const myMatchBitfields = mergeBitfields(matchBitfieldsSoFar, node.look_at)
  const myChildMatchWidth = bitfieldWidth(myMatchBitfields)
  if (matchBitfieldsSoFar.length == 0)
    // 1 << 32 = 1...
    node.numTotalInsnWords = 0x100000000
  else node.numTotalInsnWords = 1 << (32 - bitfieldWidth(matchBitfieldsSoFar))

  node.numUsedInsnWords = 0

  node.key = makeMatchPatternKey(matchSoFar, matchBitfieldsSoFar)
  node.wellKnownAlias = getWellKnownAlias(node.key)
  node.rawMatch = matchSoFar
  node.mask = bitfieldsToMask(matchBitfieldsSoFar)
  node.parentMatch = nodeMatch
  node.parentLookAt = nodeMatch ? nodeMatch.parentNode.look_at : []
  for (const m of node.matches) {
    const myMatch = matchSoFar | restoreIntoBitfields(m.match, node.look_at)
    m.key = makeMatchPatternKey(myMatch, myMatchBitfields)
    m.wellKnownAlias = getWellKnownAlias(m.key)
    m.rawMatch = myMatch
    m.mask = bitfieldsToMask(myMatchBitfields)
    m.parentNode = node

    if (m.next) {
      augmentDecodeTreeInplace(m.next, m, myMatch, myMatchBitfields)
      node.numUsedInsnWords += m.next.numUsedInsnWords
      m.possibleFmts = m.next.possibleFmts
    } else {
      m.numUsedInsnWords = 1 << (32 - myChildMatchWidth)
      m.possibleFmts = [m.fmt]
      node.numUsedInsnWords += m.numUsedInsnWords
    }
  }

  node.possibleFmts = _.uniq(_.flatten(_.map(node.matches, 'possibleFmts')))
  node.possibleFmts.sort()

  return node
}

export type FlattenedAugmentedNode = {
  key: string
  node?: AugmentedDecodeTreeNode
  match?: AugmentedDecodeTreeMatch
}

export type AugmentedNodeMap = { [key: string]: FlattenedAugmentedNode }

function makeFlattenedAugmentedNode(
  node?: AugmentedDecodeTreeNode,
  match?: AugmentedDecodeTreeMatch,
): FlattenedAugmentedNode {
  const key = node ? node.key : match.key
  return {
    key: key,
    node: node,
    match: match,
  }
}

function flattenAugmentedDecodeTreeInto(
  node: AugmentedDecodeTreeNode,
  result: FlattenedAugmentedNode[],
): void {
  result.push(makeFlattenedAugmentedNode(node, null))
  result.push(
    ..._.map(node.matches, (x) => makeFlattenedAugmentedNode(null, x)),
  )
  for (const m of node.matches)
    if (m.next) flattenAugmentedDecodeTreeInto(m.next, result)
}

function flattenAugmentedDecodeTree(
  node: AugmentedDecodeTreeNode,
): FlattenedAugmentedNode[] {
  const result = []
  flattenAugmentedDecodeTreeInto(node, result)
  return result
}

export function mapifyAugmentedDecodeTree(
  node: AugmentedDecodeTreeNode,
): AugmentedNodeMap {
  return _.keyBy(flattenAugmentedDecodeTree(node), 'key')
}
