import clsx from 'clsx'

import styles from './bits.module.css'
import { styleFromBitPalette } from './palette'

type InsnFormatNameOptions = {
  fmt?: InsnFormat
  overrideStr?: string
  className?: string
}

export default function InsnFormatName(props: InsnFormatNameOptions): JSX.Element {
  return (
    <span className={clsx(styles.insnFormatTag, props.className)}>
      {props.overrideStr !== undefined ? props.overrideStr : props.fmt.args.map((x, argIdx) => (
        <span key={argIdx} style={styleFromBitPalette(argIdx + 1)}>{x.repr}</span>
      ))}
    </span>
  )
}
