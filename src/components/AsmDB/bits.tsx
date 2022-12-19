import React from 'react'
import clsx from 'clsx'

import styles from './bits.module.css'

type BitsOptions = {
  value: number
  opcodeMask?: number
}

type BitOptions = {
  value: 0|1
  isOpcode: boolean
}

function bitsFromU32(x: number): (0|1)[] {
  const y = new Array<0|1>(32)
  for (let i = 0; i < 32; i++) {
    y[i] = (x & (1 << i)) ? 1 : 0
  }
  return y.reverse()
}

function Bit(props: BitOptions): JSX.Element {
  return (
    <td className={clsx(styles.bit, props.isOpcode ? styles.opcodeBit: '')}>{props.value}</td>
  )
}

export default function AsmDBBits(props: BitsOptions): JSX.Element {
  const bits = bitsFromU32(props.value)
  const maskBits = bitsFromU32(props.opcodeMask)

  return (
    <div className={styles.widget}>
      <span className={styles.hex}>0x{props.value.toString(16).padStart(8, '0')}</span>
      <table className={styles.bitsContainer}>
        <tr>
        {bitsFromU32(props.value).map((b, i) => (<Bit value={b} isOpcode={maskBits[i] != 0} />))}
        </tr>
      </table>
    </div>
  );
}
