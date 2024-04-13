package main

import (
	"sort"

	"github.com/samber/lo"
)

type insnBit uint8

const (
	insnBitIsOne   insnBit = 0b1
	insnBitIsFixed insnBit = 0b10
)

func (x insnBit) isFixed() bool {
	return x&insnBitIsFixed != 0
}

func (x insnBit) bit() uint32 {
	return uint32(x & insnBitIsOne)
}

func explodeInsnMatchMaskToBits(match uint32, mask uint32) [32]insnBit {
	var result [32]insnBit
	for i := 0; i < 32; i++ {
		var x insnBit
		if (match & 1) != 0 {
			x |= insnBitIsOne
		}
		if (mask & 1) != 0 {
			x |= insnBitIsFixed
		}
		result[i] = x

		match >>= 1
		mask >>= 1
	}
	return result
}

type bitfield struct {
	LSB int `json:"lsb"`
	Len int `json:"len"`
}

func (x bitfield) isBitCovered(bitIndex int) bool {
	return bitIndex >= x.LSB && bitIndex < (x.LSB+x.Len)
}

func (x bitfield) extractFrom(n uint32) uint32 {
	return (n >> uint32(x.LSB)) & ((1 << x.Len) - 1)
}

func (x bitfield) toSet() map[int]struct{} {
	s := map[int]struct{}{}
	for i := x.LSB; i < x.LSB+x.Len; i++ {
		s[i] = struct{}{}
	}
	return s
}

type bitfields []bitfield

func (x bitfields) toSet() map[int]struct{} {
	s := map[int]struct{}{}
	for _, bf := range x {
		for i := range bf.toSet() {
			s[i] = struct{}{}
		}
	}
	return s
}

func (x bitfields) union(y bitfields) bitfields {
	zSet := x.toSet()
	for i := range y.toSet() {
		zSet[i] = struct{}{}
	}
	return bitfieldsFromSet(zSet)
}

func (x bitfields) isBitCovered(bitIndex int) bool {
	for _, bf := range x {
		if bf.isBitCovered(bitIndex) {
			return true
		}
	}
	return false
}

func (x bitfields) extractFrom(n uint32) uint32 {
	if len(x) == 0 {
		return 0
	}
	if len(x) == 1 {
		return x[0].extractFrom(n)
	}

	sort.Slice(x, func(i int, j int) bool {
		return x[i].LSB < x[j].LSB
	})
	y := uint32(0)
	shift := 0
	for _, bf := range x {
		y |= bf.extractFrom(n) << shift
		shift += bf.Len
	}
	return y
}

func bitfieldsFromSet(s map[int]struct{}) bitfields {
	min := 32
	max := 0
	for b := range s {
		if b < min {
			min = b
		}
		if b > max {
			max = b
		}
	}

	var r bitfields
	inSpan, spanLSB := true, min
	for b := min; b < max; b++ {
		if _, ok := s[b]; ok {
			if !inSpan {
				inSpan, spanLSB = true, b
			}
			continue
		}

		if inSpan {
			// we've just stepped outside of a span
			// b is spanMSB+1
			inSpan = false
			r = append(r, bitfield{LSB: spanLSB, Len: b - spanLSB})
		}
	}
	if inSpan {
		r = append(r, bitfield{LSB: spanLSB, Len: max + 1 - spanLSB})
	}

	return r
}

type decodetreeAction int

const (
	decodetreeActionUnknown  decodetreeAction = 0
	decodetreeActionFinish   decodetreeAction = 1
	decodetreeActionContinue decodetreeAction = 2
)

type decodetreeMatch struct {
	Match  uint32           `json:"match"`
	Action decodetreeAction `json:"action"`

	// if action is finish, contains the matched insn's mnemonic
	Matched string `json:"matched"`
	// if action is continue, points to the next decodetree node
	Next *decodetreeNode `json:"next"`
}

type decodetreeNode struct {
	LookAt  bitfields          `json:"look_at"`
	Matches []*decodetreeMatch `json:"matches"`
}

type insnForDecodeTree struct {
	mnemonic string
	rawWord  uint32
	bits     [32]insnBit
}

type decodetreeBuilder struct {
	insns []*insnForDecodeTree
}

func (x *decodetreeBuilder) addInsn(mnemonic string, match uint32, mask uint32) {
	x.insns = append(x.insns, &insnForDecodeTree{
		mnemonic: mnemonic,
		rawWord:  match,
		bits:     explodeInsnMatchMaskToBits(match, mask),
	})
}

func (x *decodetreeBuilder) build() *decodetreeNode {
	return buildDecodetreeSubset(x.insns, nil)
}

func getCommonFixedBitfieldsForSubset(
	subset []*insnForDecodeTree,
	excludeBitfields bitfields,
) bitfields {
	var commonFixedBitsSet map[int]struct{}
	for _, insn := range subset {
		fb := make(map[int]struct{})
		for i, ib := range insn.bits {
			if !ib.isFixed() || excludeBitfields.isBitCovered(i) {
				continue
			}
			fb[i] = struct{}{}
		}

		if len(fb) == 0 {
			// this insn has no fixed bit that's left unexamined, thus leaving
			// the subset without any guaranteed fixed bit
			return nil
		}

		if commonFixedBitsSet == nil {
			commonFixedBitsSet = fb
			continue
		}

		// kill any common bits not found in fb
		var bitsToDelete []int
		for b := range commonFixedBitsSet {
			if _, ok := fb[b]; !ok {
				// avoid deleting keys while iterating
				bitsToDelete = append(bitsToDelete, b)
			}
		}

		for _, b := range bitsToDelete {
			delete(commonFixedBitsSet, b)
		}

		if len(commonFixedBitsSet) == 0 {
			// we already don't have any common fixed bits left
			return nil
		}
	}

	return bitfieldsFromSet(commonFixedBitsSet)
}

func categorizeInsnsByFixedBitfields(
	insns []*insnForDecodeTree,
	fb bitfields,
) map[uint32][]*insnForDecodeTree {
	return lo.GroupBy(insns, func(x *insnForDecodeTree) uint32 {
		return fb.extractFrom(x.rawWord)
	})
}

func buildDecodetreeSubset(
	subset []*insnForDecodeTree,
	consumedFixedBitfields bitfields,
) *decodetreeNode {
	commonFixedBits := getCommonFixedBitfieldsForSubset(subset, consumedFixedBitfields)
	furtherSubsets := categorizeInsnsByFixedBitfields(subset, commonFixedBits)

	n := &decodetreeNode{
		LookAt:  commonFixedBits,
		Matches: nil,
	}
	for k, l := range furtherSubsets {
		if len(l) == 1 {
			// fully decided
			n.Matches = append(n.Matches, &decodetreeMatch{
				Match:   k,
				Action:  decodetreeActionFinish,
				Matched: l[0].mnemonic,
				Next:    nil,
			})
			continue
		}

		// recurse
		nextConsumedFixedBitfields := consumedFixedBitfields.union(commonFixedBits)
		subsetNode := buildDecodetreeSubset(l, nextConsumedFixedBitfields)

		n.Matches = append(n.Matches, &decodetreeMatch{
			Match:   k,
			Action:  decodetreeActionContinue,
			Matched: "",
			Next:    subsetNode,
		})
	}

	sort.Slice(n.Matches, func(i int, j int) bool {
		return n.Matches[i].Match < n.Matches[j].Match
	})

	return n
}
