import React from 'react'
import { CodeQuality } from '../../types'

function emojiForCodeQuality(x: CodeQuality): string {
  switch (x) {
  case CodeQuality.NoCode: return '❔'
  case CodeQuality.OnPar: return '🆗'
  case CodeQuality.NeedsCleanup: return '🧹'
  case CodeQuality.NeedsRework: return '⛔'
  }
}

function descForCodeQuality(ss: CodeQuality): string {
  switch (ss) {
  case CodeQuality.NoCode: return '不涉及代码，或代码不可见'
  case CodeQuality.OnPar: return '符合规范'
  case CodeQuality.NeedsCleanup: return '需要整理'
  case CodeQuality.NeedsRework: return '需要重做'
  }
}


type Options = {
  val: CodeQuality
  showDesc?: boolean
}

export default function CodeQualityIcon({val, showDesc}: Options): JSX.Element {
  return (
    <>
      <span>{emojiForCodeQuality(val)}</span>
      {showDesc ? <span>{descForCodeQuality(val)}</span> : ''}
    </>
  );
}
