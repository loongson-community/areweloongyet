import React from 'react'
import { SupportStatus } from '../../types'

function emojiForSupportStatus(ss: SupportStatus): string {
  switch (ss) {
  case SupportStatus.Unknown: return '❔'
  case SupportStatus.Rejected: return '⛔'
  case SupportStatus.CommercialOnly: return '💴'
  case SupportStatus.Stalled: return '💤'
  case SupportStatus.UpForGrabs: return '🈳'
  case SupportStatus.WIP: return '🔧'
  case SupportStatus.UnderReview: return '🔍'
  case SupportStatus.WaitingRelease: return '⌛'
  case SupportStatus.Released: return '✅'
  }
}

export default function SupportStatusIcon({val}: {val: SupportStatus}): JSX.Element {
  return (
    <span>{emojiForSupportStatus(val)}</span>
  );
}
