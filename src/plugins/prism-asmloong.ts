Prism.languages.asmloong = {
  comment: {
    pattern: /\/\/.*/,
    greedy: true,
  },
  string: {
    pattern: /(["'`])(?:\\.|(?!\1)[^\\\r\n])*\1/,
    greedy: true,
  },
  directive: {
    pattern: /\.(?:text|option)\b/,
    alias: 'property',
  },
  register: {
    pattern: /\$(?:zero|ra|tp|sp|a[0-7]|t[0-8]|fp|s[0-9]|r\d|r[12]\d|r3[01])\b/,
    alias: 'variable',
  },
  opcode: {
    pattern: /\b(?:lu12i\.w|addi\.d)\b/,
    alias: 'keyword',
  },
  reloc: {
    pattern: /\%(?:le_hi20|le_lo12)\b/,
    alias: 'function',
  },
  punctuation: /[(),:]/,
}
