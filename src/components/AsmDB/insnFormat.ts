import _ from 'lodash'

import { ArgKind, type ArgSlot, type InsnArg, type InsnFormat } from './types'

export function isImmArg(a: InsnArg): boolean {
  return a.kind == ArgKind.SignedImm || a.kind == ArgKind.UnsignedImm
}

export function parseInsnFormat(s: string): InsnFormat {
  if (s == 'EMPTY') return { repr: s, args: [] }

  const origInput = s
  const args: InsnArg[] = []
  while (s) {
    const { remaining, arg } = parseInsnArg(s)
    if (!arg || s == remaining)
      // malformed input
      return null

    args.push(arg)
    s = remaining
  }

  return {
    repr: origInput,
    args: args,
  }
}

function parseInsnArg(s: string): { remaining: string; arg: InsnArg } {
  const fail = { remaining: s, arg: null }
  if (s.length == 0)
    // malformed input
    return fail

  const prefix = s[0]
  if (!prefixKindMap.hasOwnProperty(prefix))
    // malformed input
    return fail

  const kind = prefixKindMap[prefix]
  switch (kind) {
    case ArgKind.IntReg: {
      const lsb = lsbMap[prefix.toLowerCase()]
      return {
        remaining: s.slice(1),
        arg: {
          kind,
          repr: s[0],
          slots: [{ repr: `${prefix.toLowerCase()}5`, offset: lsb, width: 5 }],
        },
      }
    }

    case ArgKind.SignedImm:
    case ArgKind.UnsignedImm: {
      const { remaining, slots } = parseArgSlots(s.slice(1))
      return {
        remaining,
        arg: {
          kind,
          repr: s.slice(0, s.length - remaining.length),
          slots,
        },
      }
    }

    default: {
      const idx = s[1]
      const lsb = lsbMap[idx]
      const width = regWidthMap[prefix]
      return {
        remaining: s.slice(2),
        arg: {
          kind,
          repr: s.slice(0, 2),
          slots: [{ repr: `${idx}${width}`, offset: lsb, width: width }],
        },
      }
    }
  }
}

const prefixKindMap = {
  D: ArgKind.IntReg,
  J: ArgKind.IntReg,
  K: ArgKind.IntReg,
  A: ArgKind.IntReg,
  C: ArgKind.FCCReg,
  F: ArgKind.FPReg,
  T: ArgKind.ScratchReg,
  V: ArgKind.VReg,
  X: ArgKind.XReg,
  S: ArgKind.SignedImm,
  U: ArgKind.UnsignedImm,
}

const regWidthMap = {
  C: 3,
  F: 5,
  T: 2,
  V: 5,
  X: 5,
}

const lsbMap = {
  d: 0,
  j: 5,
  k: 10,
  a: 15,
  m: 16,
  n: 18,
}

function parseArgSlots(s: string): { remaining: string; slots: ArgSlot[] } {
  const fail = { remaining: s, slots: null }
  if (s.length == 0)
    // malformed input
    return fail

  const slots: ArgSlot[] = []
  while (s) {
    const { remaining, finish, slot } = parseArgSlot(s)
    if (finish) break
    if (!slot) return fail
    slots.push(slot)
    s = remaining
  }

  return {
    remaining: s,
    slots,
  }
}

function parseArgSlot(s: string): {
  remaining: string
  finish: boolean
  slot?: ArgSlot
} {
  const fail = { remaining: s, finish: false, slot: null }
  if (s.length == 0)
    // malformed input
    return fail

  const lsbChar = s[0]
  if (!lsbMap.hasOwnProperty(lsbChar)) {
    if (prefixKindMap.hasOwnProperty(lsbChar))
      // we've finished
      return { remaining: s, finish: true, slot: null }

    if (lsbChar == 'p')
      // TODO
      return fail

    // malformed input
    return fail
  }
  const lsb = lsbMap[lsbChar]

  const widthMatch = /^\d+/.exec(s.slice(1))
  if (!widthMatch)
    // malformed input
    return fail
  const width = parseInt(widthMatch[0], 10)
  const totalConsumed = 1 + widthMatch[0].length

  return {
    remaining: s.slice(totalConsumed),
    finish: false,
    slot: {
      repr: s.slice(0, totalConsumed),
      offset: lsb,
      width,
    },
  }
}
