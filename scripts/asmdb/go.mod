module github.com/loongson-community/areweloongyet/scripts/asmdb

go 1.19

require (
	github.com/loongson-community/loongarch-opcodes/scripts/go v0.0.0-00000000000000-000000000000
	github.com/samber/lo v1.37.0
)

require golang.org/x/exp v0.0.0-20220303212507-bbda1eaf7a17 // indirect

replace github.com/loongson-community/loongarch-opcodes/scripts/go => ../../3rdparty/loongarch-opcodes/scripts/go
