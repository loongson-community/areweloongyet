import clsx from 'clsx'

import Translate, { translate } from '@docusaurus/Translate'
import Layout from '@theme/Layout'
import HomepageFeatures from '@site/src/components/HomepageFeatures'

import styles from './index.module.css'

function HomepageHeader() {
  const slogan = translate({
    id: 'awly.homepage.slogan',
    message: '行则将至！',
    description: 'Slogan of the homepage',
  })

  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{slogan}</h1>
        <p className="hero__subtitle">
          <Translate>
            Linux 开源生态的多数基础组件，其最新版本都已包含 LoongArch 支持了。
          </Translate>
          <br />
          <Translate>
            尽管龙芯公司仍未公开 LoongArch 手册的其余部分，但大量公开信息如
            QEMU、内核适配已将相关指令编码与具体行为尽数披露，手册的缺失已不再能阻碍优化的脚步。
          </Translate>
          <br />
          <Translate>
            我们预计将在 2023~2024 看到 LoongArch
            新世界生态的突飞猛进，有您的参与会更快些。
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
