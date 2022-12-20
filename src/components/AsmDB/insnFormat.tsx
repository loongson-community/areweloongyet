import React from 'react'

import styles from './bits.module.css'
import { styleFromBitPalette } from './palette'

export default function InsnFormatName({fmt}: {fmt: InsnFormat}): JSX.Element {
  return (
    <span className={styles.insnFormatTag}>
      {fmt.args.map((x, argIdx) => (
        <span style={styleFromBitPalette(argIdx + 1)}>{x.repr}</span>
      ))}
    </span>
  )
}
