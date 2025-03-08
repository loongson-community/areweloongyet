import clsx from 'clsx'

import styles from './bits.module.css'
import { styleFromBitPalette } from './palette'
import type { InsnFormat } from './types'

type InsnFormatNameOptions = {
  fmt?: InsnFormat
  overrideStr?: string
  className?: string
}

export default function InsnFormatName(
  props: InsnFormatNameOptions,
): React.JSX.Element {
  return (
    <span className={clsx(styles.insnFormatTag, props.className)}>
      {props.overrideStr !== undefined
        ? props.overrideStr
        : props.fmt.args.map((x, argIdx) => (
            <span key={argIdx} style={styleFromBitPalette(argIdx + 1)}>
              {x.repr}
            </span>
          ))}
    </span>
  )
}
