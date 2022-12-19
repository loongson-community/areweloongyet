import React from 'react'

export default function InsnFormatName({fmt}: {fmt: InsnFormat}): JSX.Element {
  return (
    <span>
      {fmt.args.map((x) => (
        <span>{x.repr}</span>
      ))}
    </span>
  )
}
