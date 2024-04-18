import _ from 'lodash'

import { bitfieldWidth, mergeBitfields, restoreIntoBitfields } from './bitfield'

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

export type AugmentedDecodeTreeMatch = DecodeTreeMatch & {
  key: string
  rawMatch: number
  parentNode: AugmentedDecodeTreeNode
  next?: AugmentedDecodeTreeNode
  numUsedInsnWords: number
}

export type AugmentedDecodeTreeNode = DecodeTreeNode & {
  key: string
  rawMatch: number
  parentMatch?: AugmentedDecodeTreeMatch
  parentLookAt?: Bitfield[]
  matches: AugmentedDecodeTreeMatch[]
  numTotalInsnWords: number
  numUsedInsnWords: number
}

export function augmentDecodeTree(node: DecodeTreeNode): AugmentedDecodeTreeNode {
  let x = _.cloneDeep(node) as AugmentedDecodeTreeNode
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
  else
    node.numTotalInsnWords = 1 << (32 - bitfieldWidth(matchBitfieldsSoFar))

  node.numUsedInsnWords = 0

  node.key = makeMatchPatternKey(matchSoFar, matchBitfieldsSoFar)
  node.rawMatch = matchSoFar
  node.parentMatch = nodeMatch
  node.parentLookAt = nodeMatch ? nodeMatch.parentNode.look_at : []
  for (const m of node.matches) {
    const myMatch = matchSoFar | restoreIntoBitfields(m.match, node.look_at)
    m.key = makeMatchPatternKey(myMatch, myMatchBitfields)
    m.rawMatch = myMatch
    m.parentNode = node

    if (m.next) {
      augmentDecodeTreeInplace(m.next, m, myMatch, myMatchBitfields)
      node.numUsedInsnWords += m.next.numUsedInsnWords
    } else {
      m.numUsedInsnWords = 1 << (32 - myChildMatchWidth)
      node.numUsedInsnWords += m.numUsedInsnWords
    }
  }

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

function flattenAugmentedDecodeTreeInto(node: AugmentedDecodeTreeNode, result: FlattenedAugmentedNode[]): void {
  result.push(makeFlattenedAugmentedNode(node, null))
  result.push(...(_.map(node.matches, (x) => makeFlattenedAugmentedNode(null, x))))
  for (const m of node.matches)
    if (m.next)
      flattenAugmentedDecodeTreeInto(m.next, result)
}

function flattenAugmentedDecodeTree(node: AugmentedDecodeTreeNode): FlattenedAugmentedNode[] {
  const result = []
  flattenAugmentedDecodeTreeInto(node, result)
  return result
}

export function mapifyAugmentedDecodeTree(node: AugmentedDecodeTreeNode): AugmentedNodeMap {
  return _.keyBy(flattenAugmentedDecodeTree(node), 'key')
}
