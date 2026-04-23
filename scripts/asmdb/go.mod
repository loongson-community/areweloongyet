module github.com/loongson-community/areweloongyet/scripts/asmdb

go 1.25.0

require (
	github.com/loongson-community/loongarch-opcodes/scripts/go v0.0.0-20260306061037-878c9a2366d1
	github.com/samber/lo v1.53.0
)

require golang.org/x/text v0.36.0 // indirect

replace github.com/loongson-community/loongarch-opcodes/scripts/go => ../../3rdparty/loongarch-opcodes/scripts/go
