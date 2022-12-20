import React from 'react'
import clsx from 'clsx'

import styles from './bits.module.css'
import { styleFromBitPalette } from './palette'

export default function InsnFormatName({fmt, className}: {fmt: InsnFormat, className?: string}): JSX.Element {
  return (
    <span className={clsx(styles.insnFormatTag, className)}>
      {fmt.args.map((x, argIdx) => (
        <span style={styleFromBitPalette(argIdx + 1)}>{x.repr}</span>
      ))}
    </span>
  )
}
