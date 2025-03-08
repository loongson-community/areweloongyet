import Translate from '@docusaurus/Translate'
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
}): React.JSX.Element {
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
}): React.JSX.Element {
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

export default function CopyrightWrapper(
  props: typeof Props,
): React.JSX.Element {
  return (
    <>
      <p>
        <Translate>第一个“形如此”之前的内容（对汉语而言为空）</Translate>
        <a className="link--overseas">
          <Translate>形如此</Translate>
        </a>
        <Translate>
          第一个与第二个“形如此”之间的内容（对汉语而言为“的链接，或部分”）
        </Translate>
        <a>
          <Translate>形如此</Translate>
          <IconExternalLink />
        </a>
        <Translate>
          第二个“形如此”之后的内容（对汉语而言为“的链接，其目标主机可能位于中国大陆境外。”）
        </Translate>
        <Translate>如需跟进阅读却无法访问，请自行寻找解决方案。</Translate>
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
