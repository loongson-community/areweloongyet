import React from 'react'
import clsx from 'clsx'

import Layout from '@theme/Layout'
import HomepageFeatures from '@site/src/components/HomepageFeatures'

import styles from './index.module.css'

function HomepageHeader() {
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">行则将至！</h1>
        <p className="hero__subtitle">
          Linux 开源生态的多数基础组件，其最新版本都已包含 LoongArch 支持了。<br />
          尽管龙芯公司仍未公开 LoongArch 手册的其余部分，但大量公开信息如 QEMU、内核适配已将相关指令编码与具体行为尽数披露，手册的缺失已不再能阻碍优化的脚步。<br />
          我们预计将在 2023~2024 看到 LoongArch 新世界生态的突飞猛进，有您的参与会更快些。<br />
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
