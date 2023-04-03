import React from 'react'
import clsx from 'clsx'

import Layout from '@theme/Layout'
import HomepageFeatures from '@site/src/components/HomepageFeatures'

import styles from './index.module.css'

function HomepageHeader() {
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">还在路上！</h1>
        <p className="hero__subtitle">
          新世界已经相当可用，但还缺乏个别重要基础设施（如 Rust 的正式版本支持）。<br />
          龙芯公司始终未公开 LoongArch 手册的其余部分，也使新世界暂时无法利用硬件全部性能。<br />
          本站由社区建设维护，<a href="https://github.com/loongson-community/areweloongyet">欢迎来坐坐</a>！
        </p>
      </div>
    </header>
  )
}

export default function Home(): JSX.Element {
  return (
    <Layout
      title={"首页"}
      description="一站式了解 LoongArch 的上游生态建设">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  )
}
