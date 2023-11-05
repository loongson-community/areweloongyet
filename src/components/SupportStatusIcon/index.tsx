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

function descForSupportStatus(ss: SupportStatus): string {
  switch (ss) {
  case SupportStatus.Unknown: return '未知'
  case SupportStatus.Rejected: return '被拒绝'
  case SupportStatus.CommercialOnly: return '仅有付费商业支持'
  case SupportStatus.Stalled: return '进度受阻'
  case SupportStatus.UpForGrabs: return '目前无人认领，先到先得'
  case SupportStatus.WIP: return '施工中'
  case SupportStatus.UnderReview: return '正在接受代码审查'
  case SupportStatus.WaitingRelease: return '万事俱备，就差上游发版'
  case SupportStatus.Released: return '已在正式上游版本发布'
  }
}


type Options = {
  val: SupportStatus
  showDesc?: boolean
}

export default function SupportStatusIcon({val, showDesc}: Options): JSX.Element {
  return (
    <>
      <span>{emojiForSupportStatus(val)}</span>
      {showDesc ? <span> {descForSupportStatus(val)}</span> : ''}
    </>
  );
}
