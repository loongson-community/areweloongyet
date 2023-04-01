import React from 'react'

import Layout from '@theme/Layout'

import { IPortingEffort, IProject } from '@site/src/types'
import SupportStatusIcon from '../SupportStatusIcon'
import CodeQualityIcon from '../CodeQualityIcon'
import styles from './styles.module.css'

function PortingEffort({data}: {data: IPortingEffort}): JSX.Element {
  return (
    <section>
      <dl className={styles.infoTable}>
        {data.desc ?
          <>
            <dt>说明</dt>
            <dd>{data.desc}</dd>
          </>
          : ''}
        <dt>链接</dt>
        <dd>{data.link ? <a href={data.link}>{data.link}</a> : '无'}</dd>
        <dt>参与者</dt>
        <dd>
          <ul className={styles.authors}>
            {data.authors.map((x, i) => (<li key={i}>{x}</li>))}
          </ul>
        </dd>
        <dt>适配工作质量</dt>
        <dd><CodeQualityIcon val={data.quality} showDesc={true} /></dd>
        <dt>支持状态</dt>
        <dd><SupportStatusIcon val={data.supportStatus} showDesc={true} /></dd>
        <dt>何时开始支持</dt>
        <dd>{data.releasedSinceVersion}</dd>
        <dt>何时支持完善</dt>
        <dd>{data.goodSinceVersion}</dd>
      </dl>
    </section>
  )
}

export default function ProjectPage({data}: {data: IProject}): JSX.Element {
  return (
    <Layout title={`${data.name} | 项目详情`}>
      <main className="container">
        <h2>{data.name}</h2>

        <section>
          <h3>项目概况</h3>
          <dl className={styles.infoTable}>
            <dt>首页</dt>
            <dd>{data.homepageURL ? <a href={data.homepageURL}>{data.homepageURL}</a> : '暂缺'}</dd>
            <dt>储存库</dt>
            <dd>{data.repoURL ? <a href={data.repoURL}>{data.repoURL}</a> : '暂缺'}</dd>
          </dl>
        </section>

        <section>
          <h3>适配工作</h3>
          {data.portingEfforts.map((x, i) => (<PortingEffort key={i} data={x} />))}
        </section>
      </main>
    </Layout>
  );
}
