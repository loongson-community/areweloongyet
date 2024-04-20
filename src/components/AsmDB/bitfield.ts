import _ from 'lodash'

import type { Bitfield } from './types'

function representBitfield(bf: Bitfield): string {
  return bf.len == 1 ? bf.lsb.toString(10) : `${bf.lsb + bf.len - 1}:${bf.lsb}`
}

export function representBitfields(bfs: Bitfield[]): string {
  if (bfs.length == 1)
    return representBitfield(bfs[0])
  return _.map(_.reverse(_.cloneDeep(bfs)), representBitfield).join(',')
}

export function bitfieldWidth(bfs: Bitfield[]): number {
  return _.sum(_.map(bfs, (x) => x.len))
}

export function mergeBitfields(a: Bitfield[], b: Bitfield[]): Bitfield[] {
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

export function restoreIntoBitfields(num: number, bfs: Bitfield[]): number {
  let y = 0
  for (const bf of bfs) {
    y |= (num & ((1 << bf.len) - 1)) << bf.lsb
    num >>= bf.len
  }
  return y
}

export function bitfieldsToMask(bfs: Bitfield[]): number {
  let mask = 0
  for (const bf of bfs)
    mask |= (bf.len == 32 ? 0xffffffff : ((1 << bf.len) - 1)) << bf.lsb
  return mask
}
