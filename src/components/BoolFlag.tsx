import React from 'react'

type Options = {
  val: boolean
  trueContent?: string
  falseContent?: string
}

export default function BoolFlag({val, trueContent, falseContent}: Options): JSX.Element {
  const t = trueContent ? trueContent : '✅'
  const f = falseContent ? falseContent : '❌'

  return (
    <span>{val ? t : f}</span>
  )
}
