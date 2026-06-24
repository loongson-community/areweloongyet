import clsx from 'clsx'

import Translate, { translate } from '@docusaurus/Translate'
import Layout from '@theme/Layout'
import HomepageFeatures from '@site/src/components/HomepageFeatures'

import styles from './index.module.css'

function HomepageHeader() {
  const slogan = translate({
    id: 'awly.homepage.slogan',
    message: '夕惕若厉！',
    description: 'Slogan of the homepage',
  })

  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{slogan}</h1>
        <p className="hero__subtitle">
          <Translate>
            不出意外地，2023-2024
            是龙架构基础生态建设风生水起的两年。在多数的基础设施项目，龙架构支持都已成功并入主线、受到持续维护。
          </Translate>
          <br />
          <Translate>
            然而，外部形势波诡云谲，我们的事业面对着，并且仍将面对更多技术的、非技术的挑战乃至风险：更广阔的使用场景、更多元的用户人群，我们的工作量与困难前无古人。
          </Translate>
          <br />
          <Translate>
            我们认为 2025-2026
            对龙架构生态而言是关键的转折点。世界瞬息万变，唯有终日乾乾、夕惕若厉；动心忍性，枕戈待旦。与君共勉！
          </Translate>
          <br />
          <Translate>本站由社区建设维护，</Translate>
          <a href="https://github.com/loongson-community/areweloongyet">
            <Translate>欢迎来坐坐</Translate>
          </a>
          <Translate>！</Translate>
        </p>
      </div>
    </header>
  )
}

export default function Home(): React.JSX.Element {
  const homepageTitle = translate({
    id: 'awly.homepage.title',
    message: '首页',
    description: 'Title of the homepage',
  })

  const homepageDescription = translate({
    id: 'awly.homepage.description',
    message: '一站式了解 LoongArch 的上游生态建设',
    description: 'Description of the homepage',
  })

  return (
    <Layout title={homepageTitle} description={homepageDescription}>
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  )
}
