export function getManualInsnFormatName(insn: Insn): string {
  const a = getManualInsnFormatNameFromRepr(insn.format.repr)
  if (a != '')
    return a

  // if the manual format matches, it also counts
  // in particular, a few insns (FCSR ops) need this
  if (insn.manual_format)
    return getManualInsnFormatNameFromRepr(insn.manual_format.repr)

  return ''
}

function getManualInsnFormatNameFromRepr(fmtRepr: string): string {
  switch (fmtRepr) {
  case 'CdFj':
  case 'CdJ':
  case 'CdVj':
  case 'DCj':
  case 'DJ':
  case 'DFj':
  case 'DVj':
  case 'FdCj':
  case 'FdFj':
  case 'FdJ':
  case 'VdVj':
  case 'VdJ':
    return '2R'

  case 'CdFjFk':
  case 'DJK':
  case 'FdFjFk':
  case 'FdJK':
  case 'VdJK':
  case 'VdVjVk':
    return '3R'

  case 'FdFjFkCa':
  case 'FdFjFkFa':
  case 'VdVjVkCa':
  case 'VdVjVkVa':
    return '4R'

  case 'DJUk8':
  case 'VdVjUk8':
    return '2RI8'

  case 'DJSk12':
  case 'DJUk12':
  case 'FdJSk12':
  case 'VdJSk12':
  case 'XdJSk12':
    return '2RI12'

  case 'DJSk14':
  case 'DJUk14':
  case 'FdJSk14':
    return '2RI14'

  case 'DJSk16':
    return '2RI16'

  case 'JSd5k16':
  case 'CjSd5k16':
    return '1RI21'

  case 'Sd10k16':
    return 'I26'

  default:
    return ''
  }
}
