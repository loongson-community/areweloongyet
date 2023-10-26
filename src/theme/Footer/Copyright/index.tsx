import React from 'react'
import Copyright from '@theme-original/Footer/Copyright'

import styles from './styles.module.css'

function ICPBeianLink(
  {
    province,
    recordNumber,
    subRecordNumber,
  }: {
    province: string,
    recordNumber: number,
    subRecordNumber: number,
  },
): JSX.Element {
  return (
    <a href="https://beian.miit.gov.cn" target="_blank">{province}ICP备{recordNumber}号-{subRecordNumber}</a>
  )
}

function MPSBeianLink(
  {
    province,
    recordNumber,
  }: {
    province: string,
    recordNumber: number,
  },
): JSX.Element {
  const queryLinkURL = `http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=${recordNumber}`
  return (
    <>
      <img src="/img/mps-beian-logo.webp" height="28" className={styles.mpsLogo} />
      <a href={queryLinkURL} target="_blank">{province}公网安备{recordNumber}号</a>
    </>
  )
}

export default function CopyrightWrapper(props: any): JSX.Element {
  return (
    <>
      <Copyright {...props} />
      <ul className={styles.footer__beian}>
        <li><ICPBeianLink province="苏" recordNumber={17027553} subRecordNumber={2} /></li>
        {/* <li><MPSBeianLink province="沪" recordNumber={11223344001122} /></li> */}
      </ul>
    </>
  )
}
