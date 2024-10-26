import { ReactNode } from 'react'

import styles from './styles.module.css'

type Props = {
  columns: number
  children?: ReactNode | undefined
}

export default function ColumnedList(props: Props): JSX.Element {
  return (
    <div className={styles.columnedList} style={{ columns: props.columns }}>
      {props.children}
    </div>
  )
}
