import Copyright, { type Props } from '@theme-original/Footer/Copyright'
import IconExternalLink from '@theme-original/Icon/ExternalLink'

import styles from './styles.module.css'

function ICPBeianLink({
  province,
  recordNumber,
  subRecordNumber,
}: {
  province: string
  recordNumber: number
  subRecordNumber: number
}): JSX.Element {
  return (
    <a href="https://beian.miit.gov.cn" target="_blank">
      {province}ICP备{recordNumber}号-{subRecordNumber}
    </a>
  )
}

function _MPSBeianLink({
  province,
  recordNumber,
}: {
  province: string
  recordNumber: number
}): JSX.Element {
  const queryLinkURL = `http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=${recordNumber}`
  return (
    <>
      <img
        src="/img/mps-beian-logo.webp"
        height="28"
        className={styles.mpsLogo}
      />
      <a href={queryLinkURL} target="_blank">
        {province}公网安备{recordNumber}号
      </a>
    </>
  )
}

export default function CopyrightWrapper(props: typeof Props): JSX.Element {
  return (
    <>
      <p>
        <a className="link--overseas">形如此</a>的链接，或部分
        <a>
          形如此
          <IconExternalLink />
        </a>
        的链接，其目标主机可能位于中国大陆境外。如需跟进阅读却无法访问，请自行寻找解决方案。
      </p>
      <Copyright {...props} />
      <ul className={styles.footer__beian}>
        <li>
          <ICPBeianLink
            province="苏"
            recordNumber={17027553}
            subRecordNumber={2}
          />
        </li>
        {/* <li><MPSBeianLink province="沪" recordNumber={11223344001122} /></li> */}
      </ul>
    </>
  )
}
