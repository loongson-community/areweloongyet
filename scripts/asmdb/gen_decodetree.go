package main

import (
	"fmt"
	"sort"
	"strconv"
	"strings"

	"github.com/samber/lo"
)

type bitfield struct {
	LSB int `json:"lsb"`
	Len int `json:"len"`
}

func (x bitfield) String() string {
	if x.Len == 1 {
		return strconv.Itoa(x.LSB)
	}
	return fmt.Sprintf("%d:%d", x.LSB+x.Len-1, x.LSB)
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

func (x bitfields) String() string {
	var sb strings.Builder
	for i, bf := range x {
		if i != 0 {
			sb.WriteRune(',')
		}
		sb.WriteString(bf.String())
	}
	return sb.String()
}

func (x bitfields) totalWidth() int {
	w := 0
	for _, bf := range x {
		w += bf.Len
	}
	return w
}

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

	// contains the determined insn format if all descendant nodes share this
	// format
	Fmt string `json:"fmt,omitempty"`
	// if action is finish, contains the matched insn's mnemonic
	Matched string `json:"matched,omitempty"`
	// if action is continue, points to the next decodetree node
	Next *decodetreeNode `json:"next,omitempty"`
}

type decodetreeNode struct {
	LookAt  bitfields          `json:"look_at"`
	Matches []*decodetreeMatch `json:"matches"`

	fmt string
}

func (n *decodetreeNode) depth() int {
	if n == nil {
		return 0
	}
	var result int
	for _, m := range n.Matches {
		result = max(result, m.Next.depth())
	}
	return result + 1
}

func (n *decodetreeNode) dump() string {
	var sb strings.Builder
	n.dumpInner(&sb, 0, 0, 0, "")
	return sb.String()
}

func (n *decodetreeNode) dumpInner(
	sb *strings.Builder,
	indentLevel int,
	matchBits uint32,
	matchLen int,
	matchFmt string,
) {
	indent := strings.Repeat("  ", indentLevel)
	myWidth := n.LookAt.totalWidth()

	fanout := len(n.Matches)
	numLeaves := 0
	for _, m := range n.Matches {
		if m.Next == nil {
			numLeaves++
		}
	}

	sb.WriteString(indent)
	sb.WriteString("- ")
	if indentLevel > 0 {
		// fixed-length strconv.FormatInt(x, 2)
		for i := matchLen - 1; i >= 0; i-- {
			bit := (matchBits & (1 << i)) != 0
			if bit {
				sb.WriteRune('1')
			} else {
				sb.WriteRune('0')
			}
		}
		sb.WriteString(": ")

		if len(matchFmt) > 0 {
			sb.WriteString(" [")
			sb.WriteString(matchFmt)
			sb.WriteString("] ")
		}
	}

	sb.WriteString(n.LookAt.String())
	fmt.Fprintf(sb, " (fanout = %d, decided = %d)", fanout, numLeaves)
	if numLeaves > 0 {
		sb.WriteString("  #")
		for _, m := range n.Matches {
			if m.Next != nil {
				continue
			}
			sb.WriteRune(' ')
			sb.WriteString(m.Matched)
		}
	}
	sb.WriteRune('\n')

	for _, m := range n.Matches {
		if m.Next == nil {
			continue
		}
		m.Next.dumpInner(sb, indentLevel+1, m.Match, myWidth, m.Fmt)
	}
}

type insnForDecodeTree struct {
	mnemonic string
	match    uint32
	mask     uint32
	fmt      string
}

func (x *insnForDecodeTree) isBitFixed(bit int) bool {
	return x.mask&(1<<bit) != 0
}

type decodetreeBuilder struct {
	insns []*insnForDecodeTree
}

func (x *decodetreeBuilder) addInsn(mnemonic string, match uint32, mask uint32, fmt string) {
	x.insns = append(x.insns, &insnForDecodeTree{
		mnemonic: mnemonic,
		match:    match,
		mask:     mask,
		fmt:      fmt,
	})
}

func (x *decodetreeBuilder) build() *decodetreeNode {
	n := buildDecodetreeSubset(x.insns, nil)
	propagateFormats(n)
	return n
}

func getCommonFixedBitfieldsForSubset(
	subset []*insnForDecodeTree,
	excludeBitfields bitfields,
) bitfields {
	var commonFixedBitsSet map[int]struct{}
	for _, insn := range subset {
		fb := make(map[int]struct{})
		for i := 0; i < 32; i++ {
			if !insn.isBitFixed(i) || excludeBitfields.isBitCovered(i) {
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
		return fb.extractFrom(x.match)
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
		fmt:     "",
	}
	for k, l := range furtherSubsets {
		if len(l) == 1 {
			// fully decided
			n.Matches = append(n.Matches, &decodetreeMatch{
				Match:   k,
				Action:  decodetreeActionFinish,
				Fmt:     l[0].fmt,
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
			Fmt:     "",
			Matched: "",
			Next:    subsetNode,
		})
	}

	sort.Slice(n.Matches, func(i int, j int) bool {
		return n.Matches[i].Match < n.Matches[j].Match
	})

	return n
}

func propagateFormats(n *decodetreeNode) {
	if len(n.Matches) == 0 {
		return
	}

	// traverse the decodetree post-order
	for _, m := range n.Matches {
		if m.Next != nil {
			propagateFormats(m.Next)
			m.Fmt = m.Next.fmt
		}
	}

	// if all children of a node share the same format, mark the node with
	// that format as well
	sharedFmt := n.Matches[0].Fmt
	for _, m := range n.Matches {
		if m.Fmt != sharedFmt {
			// format cannot be determined at this level yet
			sharedFmt = ""
			break
		}
	}
	n.fmt = sharedFmt
}
