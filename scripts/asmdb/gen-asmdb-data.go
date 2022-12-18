package main

import (
	"encoding/json"
	"os"
	"sort"

	"github.com/loongson-community/loongarch-opcodes/scripts/go/common"
	"github.com/samber/lo"
)

func main() {
	inputs := os.Args[1:]

	descs, err := common.ReadInsnDescs(inputs)
	if err != nil {
		panic(err)
	}

	sort.Slice(descs, func(i int, j int) bool {
		return descs[i].Word < descs[j].Word
	})

	insns := lo.Map(descs, func(x *common.InsnDescription, _ int) asmdbInsn {
		_, isLA32 := x.Attribs["la32"]
		_, isPrimary := x.Attribs["primary"]

		return asmdbInsn{
			Word:           x.Word,
			Mask:           x.Format.MatchBitmask(),
			Mnemonic:       x.Mnemonic,
			ManualMnemonic: x.Attribs["orig_name"],
			Format:         convertInsnFormat(x.Format),
			ManualFormat:   convertInsnFormat(x.OrigFormat),
			Subsets: subsetFlags{
				LA32:    isLA32,
				Primary: isPrimary,
			},
		}
	})

	result, err := json.Marshal(asmdbData{Insns: insns})
	if err != nil {
		panic(err)
	}

	_, err = os.Stdout.Write(result)
	if err != nil {
		panic(err)
	}
}

type asmdbData struct {
	Insns []asmdbInsn `json:"insns"`
}

type asmdbInsn struct {
	Word           uint32      `json:"word"`
	Mask           uint32      `json:"mask"`
	Mnemonic       string      `json:"mnemonic"`
	ManualMnemonic string      `json:"manual_mnemonic,omitempty"`
	Format         insnFormat  `json:"format"`
	ManualFormat   insnFormat  `json:"manual_format,omitempty"`
	Subsets        subsetFlags `json:"subsets"`
}

type subsetFlags struct {
	LA32    bool `json:"la32,omitempty"`
	Primary bool `json:"primary,omitempty"`
}

type insnFormat struct {
	Repr string     `json:"repr"`
	Args []insnArgs `json:"args"`
}

type insnArgs struct {
	Kind     common.ArgKind `json:"kind"`
	Repr     string         `json:"repr"`
	Slots    []argSlot      `json:"slots"`
	ShiftAmt int            `json:"shift_amt,omitempty"`
	AddAmt   int            `json:"add_amt,omitempty"`
}

type argSlot struct {
	Repr   string `json:"repr"`
	Offset uint   `json:"offset"`
	Width  uint   `json:"width"`
}

func convertInsnFormat(x *common.InsnFormat) insnFormat {
	if x == nil {
		return insnFormat{}
	}

	return insnFormat{
		Repr: x.CanonicalRepr(),
		Args: lo.Map(x.Args, func(a *common.Arg, _ int) insnArgs {
			shiftAmt := 0
			addAmt := 0
			switch a.Post.Kind {
			case common.PostprocessOpKindAdd:
				addAmt = a.Post.Amount
			case common.PostprocessOpKindShl:
				shiftAmt = a.Post.Amount
			}

			return insnArgs{
				Repr: a.CanonicalRepr(),
				Kind: a.Kind,
				Slots: lo.Map(a.Slots, func(s *common.Slot, _ int) argSlot {
					return argSlot{
						Repr:   s.CanonicalRepr(),
						Offset: s.Offset,
						Width:  s.Width,
					}
				}),
				ShiftAmt: shiftAmt,
				AddAmt:   addAmt,
			}
		}),
	}
}
