package main

import (
	"encoding/json"
	"fmt"
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
		_, isLBT := x.Attribs["lbt"]
		_, isLVZ := x.Attribs["lvz"]
		_, isProvisional := x.Attribs["provisional"]
		sinceRev := x.Attribs["rev"]

		// LA32 Primary insns are automatically LA32 insns
		if isPrimary {
			isLA32 = true
		}

		isLSX := involvesRegKind(x.Format.Args, common.ArgKindVReg)
		isLASX := involvesRegKind(x.Format.Args, common.ArgKindXReg)
		isExt := isLSX || isLASX || isLBT || isLVZ

		// LA64 is fallback for now
		isLA64 := !isExt && !isProvisional

		return asmdbInsn{
			Word:           x.Word,
			Mask:           x.Format.MatchBitmask(),
			Mnemonic:       x.Mnemonic,
			ManualMnemonic: x.Attribs["orig_name"],
			Format:         convertInsnFormat(x.Format),
			ManualFormat:   convertInsnFormat(x.OrigFormat),
			SinceRev:       sinceRev,
			Subsets: subsetFlags{
				LA32:        isLA32,
				Primary:     isPrimary,
				LA64:        isLA64,
				LSX:         isLSX,
				LASX:        isLASX,
				LBT:         isLBT,
				LVZ:         isLVZ,
				Provisional: isProvisional,
			},
		}
	})

	// also build a decode tree for frontend disassembly
	var db decodetreeBuilder
	for _, insn := range descs {
		db.addInsn(insn.Mnemonic, insn.Word, insn.Format.MatchBitmask(), insn.Format.CanonicalRepr())
	}
	decodetreeRoot := db.build()

	if len(os.Getenv("GEN_ASMDB_DATA_DEBUG")) != 0 {
		fmt.Fprintf(
			os.Stderr,
			"decode tree dump: depth %d\n\n%s\n",
			decodetreeRoot.depth(),
			decodetreeRoot.dump(),
		)
	}

	result, err := json.Marshal(asmdbData{Insns: insns, DecodeTree: decodetreeRoot})
	if err != nil {
		panic(err)
	}

	_, err = os.Stdout.Write(result)
	if err != nil {
		panic(err)
	}
}

type asmdbData struct {
	Insns      []asmdbInsn     `json:"insns"`
	DecodeTree *decodetreeNode `json:"decodetree"`
}

type asmdbInsn struct {
	Word           uint32      `json:"word"`
	Mask           uint32      `json:"mask"`
	Mnemonic       string      `json:"mnemonic"`
	ManualMnemonic string      `json:"manual_mnemonic,omitempty"`
	Format         *insnFormat `json:"format"`
	ManualFormat   *insnFormat `json:"manual_format,omitempty"`
	SinceRev       string      `json:"since_rev,omitempty"`
	Subsets        subsetFlags `json:"subsets"`
}

type subsetFlags struct {
	LA32    bool `json:"la32,omitempty"`
	Primary bool `json:"primary,omitempty"`
	LA64    bool `json:"la64,omitempty"`
	LSX     bool `json:"lsx,omitempty"`
	LASX    bool `json:"lasx,omitempty"`
	LBT     bool `json:"lbt,omitempty"`
	LVZ     bool `json:"lvz,omitempty"`

	Provisional bool `json:"provisional,omitempty"`
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

func convertInsnFormat(x *common.InsnFormat) *insnFormat {
	if x == nil {
		return nil
	}

	return &insnFormat{
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

func involvesRegKind(args []*common.Arg, k common.ArgKind) bool {
	for _, a := range args {
		if a.Kind == k {
			return true
		}
	}
	return false
}
