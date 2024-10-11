module github.com/loongson-community/areweloongyet/scripts/asmdb

go 1.22

toolchain go1.23.1

require (
	github.com/loongson-community/loongarch-opcodes/scripts/go v0.0.0-20240527223218-7f353fb69bd9
	github.com/samber/lo v1.47.0
)

require golang.org/x/text v0.19.0 // indirect

replace github.com/loongson-community/loongarch-opcodes/scripts/go => ../../3rdparty/loongarch-opcodes/scripts/go
