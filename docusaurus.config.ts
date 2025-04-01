import type { Config } from '@docusaurus/types'
import type { Options as PluginClientRedirectsOptions } from '@docusaurus/plugin-client-redirects'
import type { Options as BlogOptions } from '@docusaurus/plugin-content-blog'
import type { Options as PresetClassicOptions } from '@docusaurus/preset-classic'
import type { ThemeConfig as PresetClassicThemeConfig } from '@docusaurus/preset-classic'

import { themes } from 'prism-react-renderer'
const lightCodeTheme = themes.github
const darkCodeTheme = themes.dracula

import inspectUrls from '@jsdevtools/rehype-url-inspector'
import type { Options as RehypeURLInspectorOptions } from '@jsdevtools/rehype-url-inspector'

import type { PluginOptions as DocusaurusSearchLocalOptions } from '@easyops-cn/docusaurus-search-local'

import annotateOverseasLinks from './src/plugins/awly-rehype-annotate-overseas-links'
import type { PluginOptions as AWLYAsmDBPluginOptions } from './src/plugins/awly-asmdb-plugin'
import type { PluginOptions as AWLYDataPluginOptions } from './src/plugins/awly-data-plugin'

import awlyAsmDBPlugin from './src/plugins/awly-asmdb-plugin'
import awlyDataPlugin from './src/plugins/awly-data-plugin'
import awlyRemarkNatlangUsage from './src/plugins/awly-remark-natlang-usage'

const commonBeforeDefaultRemarkPlugins = [awlyRemarkNatlangUsage]

const commonRehypePlugins = [
  [
    inspectUrls,
    {
      inspectEach(m) {
        annotateOverseasLinks(m)
      },
      selectors: ['a[href]'],
    } satisfies RehypeURLInspectorOptions,
  ],
]

// i18n workarounds
// see https://github.com/facebook/docusaurus/issues/4542
// and https://github.com/facebook/docusaurus/pull/8677
const defaultLocale = 'zh-Hans'
process.env.DOCUSAURUS_CURRENT_LOCALE ??= defaultLocale
if (process.env.DOCUSAURUS_CURRENT_LOCALE == 'undefined') {
  // this is also happening for some reason...
  process.env.DOCUSAURUS_CURRENT_LOCALE = defaultLocale
}

const configStringsTranslations = {
  en: {
    title: 'AREWESNAKEYET?',
    tagline: 'Your one-stop portal for following LoongArch upstream work.',
    logoPath: 'img/logo-en.svg',
    twilTitle: 'This Week in LoongArch',
    twilDescription:
      'This Week in LoongArch (TWiL) is a weekly newsletter covering the latest developments in the LoongArch community, publishing every Monday.',
    siteNewsTitle: 'Site news',
    siteNewsDescription:
      'News on the development and operations of the AREWESNAKEYET? site.',
  },
  'zh-Hans': {
    title: '咱蛇了吗？',
    tagline: '一站式了解 LoongArch 的上游生态建设。',
    logoPath: 'img/logo.svg',
    twilTitle: '每日一小龙',
    twilDescription:
      '龙架构新世界生态建设周报《每周一龙》（This Week in LoongArch）。每周一都为大家报道 LoongArch 社区最前线的第一手新鲜资讯！',
    siteNewsTitle: '本站动态',
    siteNewsDescription: '《咱蛇了吗？》网站本身的开发、运营动态。',
  },
}

const localizeConfigString = (key: string) => {
  const locale = process.env.DOCUSAURUS_CURRENT_LOCALE ?? defaultLocale
  return configStringsTranslations[locale][key]
}

const config: Config = {
  title: localizeConfigString('title'),
  tagline: localizeConfigString('tagline'),
  url: 'https://areweloongyet.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  // currently breaks TWiL 28's original pic links
  // trailingSlash: true, // to reduce number of 301's with GitHub Pages

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'loongson-community', // Usually your GitHub org/user name.
  projectName: 'areweloongyet', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: defaultLocale,
    locales: [defaultLocale, 'en'],
  },

  future: {
    experimental_faster: true,
  },

  markdown: {
    mermaid: true,
  },

  plugins: [
    [
      awlyAsmDBPlugin,
      {
        genAsmdbDataPath: './scripts/asmdb/gen-asmdb-data',
        loongarchOpcodesPath: './3rdparty/loongarch-opcodes',
      } satisfies AWLYAsmDBPluginOptions,
    ],
    [
      awlyDataPlugin,
      {
        sourcePath: './src/data',
      } satisfies AWLYDataPluginOptions,
    ],
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          {
            to: '/newsletter/this-week-in-loongarch-1',
            from: '/blog/this-week-in-loongarch-1',
          },
          {
            to: '/newsletter/this-week-in-loongarch-2',
            from: '/blog/this-week-in-loongarch-2',
          },
          {
            to: '/newsletter/this-week-in-loongarch-3',
            from: '/blog/this-week-in-loongarch-3',
          },
          {
            to: '/newsletter/this-week-in-loongarch-4',
            from: '/blog/this-week-in-loongarch-4',
          },
          {
            to: '/newsletter/this-week-in-loongarch-5',
            from: '/blog/this-week-in-loongarch-5',
          },
          {
            to: '/newsletter/these-weeks-in-loongarch-6',
            from: '/blog/these-weeks-in-loongarch-6',
          },
          {
            to: '/newsletter/this-week-in-loongarch-7',
            from: '/blog/this-week-in-loongarch-7',
          },
          {
            to: '/newsletter/this-week-in-loongarch-8',
            from: '/blog/this-week-in-loongarch-8',
          },
          {
            to: '/newsletter/this-week-in-loongarch-9',
            from: '/blog/this-week-in-loongarch-9',
          },
          {
            to: 'https://liblol.aosc.io/docs/dev/design/',
            from: '/docs/world-compat-details/liblol',
          },

          // allow iterating over all TWiL articles with the singular title
          // form, i.e. "this-week-..."
          {
            to: '/newsletter/these-weeks-in-loongarch-6',
            from: '/newsletter/this-week-in-loongarch-6',
          },
          {
            to: '/newsletter/these-weeks-in-loongarch-12',
            from: '/newsletter/this-week-in-loongarch-12',
          },
          {
            to: '/newsletter/these-weeks-in-loongarch-33',
            from: '/newsletter/this-week-in-loongarch-33',
          },
          {
            to: '/newsletter/these-weeks-in-loongarch-44',
            from: '/newsletter/this-week-in-loongarch-44',
          },
          {
            to: '/newsletter/these-weeks-in-loongarch-51',
            from: '/newsletter/this-week-in-loongarch-51',
          },

          // these months in loongarch 52 is split into multiple volumes
          {
            to: '/newsletter/these-months-in-loongarch-52',
            from: '/newsletter/these-months-in-loongarch-52-vol-1',
          },
          // these months in loongarch 52 is TWiL 52~83
          {
            to: '/newsletter/these-months-in-loongarch-52',
            from: '/newsletter/this-week-in-loongarch-52',
          },
          {
            to: '/newsletter/these-months-in-loongarch-52',
            from: '/newsletter/this-week-in-loongarch-53',
          },
          {
            to: '/newsletter/these-months-in-loongarch-52',
            from: '/newsletter/this-week-in-loongarch-54',
          },
          {
            to: '/newsletter/these-months-in-loongarch-52',
            from: '/newsletter/this-week-in-loongarch-55',
          },
          {
            to: '/newsletter/these-months-in-loongarch-52',
            from: '/newsletter/this-week-in-loongarch-56',
          },
          {
            to: '/newsletter/these-months-in-loongarch-52',
            from: '/newsletter/this-week-in-loongarch-57',
          },
          {
            to: '/newsletter/these-months-in-loongarch-52',
            from: '/newsletter/this-week-in-loongarch-58',
          },
          {
            to: '/newsletter/these-months-in-loongarch-52',
            from: '/newsletter/this-week-in-loongarch-59',
          },
          {
            to: '/newsletter/these-months-in-loongarch-52',
            from: '/newsletter/this-week-in-loongarch-60',
          },
          {
            to: '/newsletter/these-months-in-loongarch-52',
            from: '/newsletter/this-week-in-loongarch-61',
          },
          {
            to: '/newsletter/these-months-in-loongarch-52',
            from: '/newsletter/this-week-in-loongarch-62',
          },
          {
            to: '/newsletter/these-months-in-loongarch-52',
            from: '/newsletter/this-week-in-loongarch-63',
          },
          {
            to: '/newsletter/these-months-in-loongarch-52',
            from: '/newsletter/this-week-in-loongarch-64',
          },
          {
            to: '/newsletter/these-months-in-loongarch-52',
            from: '/newsletter/this-week-in-loongarch-65',
          },
          {
            to: '/newsletter/these-months-in-loongarch-52',
            from: '/newsletter/this-week-in-loongarch-66',
          },
          {
            to: '/newsletter/these-months-in-loongarch-52',
            from: '/newsletter/this-week-in-loongarch-67',
          },
          {
            to: '/newsletter/these-months-in-loongarch-52',
            from: '/newsletter/this-week-in-loongarch-68',
          },
          {
            to: '/newsletter/these-months-in-loongarch-52',
            from: '/newsletter/this-week-in-loongarch-69',
          },
          {
            to: '/newsletter/these-months-in-loongarch-52',
            from: '/newsletter/this-week-in-loongarch-70',
          },
          {
            to: '/newsletter/these-months-in-loongarch-52',
            from: '/newsletter/this-week-in-loongarch-71',
          },
          {
            to: '/newsletter/these-months-in-loongarch-52',
            from: '/newsletter/this-week-in-loongarch-72',
          },
          {
            to: '/newsletter/these-months-in-loongarch-52',
            from: '/newsletter/this-week-in-loongarch-73',
          },
          {
            to: '/newsletter/these-months-in-loongarch-52',
            from: '/newsletter/this-week-in-loongarch-74',
          },
          {
            to: '/newsletter/these-months-in-loongarch-52',
            from: '/newsletter/this-week-in-loongarch-75',
          },
          {
            to: '/newsletter/these-months-in-loongarch-52',
            from: '/newsletter/this-week-in-loongarch-76',
          },
          {
            to: '/newsletter/these-months-in-loongarch-52',
            from: '/newsletter/this-week-in-loongarch-77',
          },
          {
            to: '/newsletter/these-months-in-loongarch-52',
            from: '/newsletter/this-week-in-loongarch-78',
          },
          {
            to: '/newsletter/these-months-in-loongarch-52',
            from: '/newsletter/this-week-in-loongarch-79',
          },
          {
            to: '/newsletter/these-months-in-loongarch-52',
            from: '/newsletter/this-week-in-loongarch-80',
          },
          {
            to: '/newsletter/these-months-in-loongarch-52',
            from: '/newsletter/this-week-in-loongarch-81',
          },
          {
            to: '/newsletter/these-months-in-loongarch-52',
            from: '/newsletter/this-week-in-loongarch-82',
          },
          {
            to: '/newsletter/these-months-in-loongarch-52',
            from: '/newsletter/this-week-in-loongarch-83',
          },
          {
            to: '/newsletter/these-months-in-loongarch-52',
            from: '/newsletter/this-week-in-loongarch-84',
          },
        ],
      } satisfies PluginClientRedirectsOptions,
    ],
    [
      '@docusaurus/plugin-content-blog',
      {
        id: 'blog-newsletter',
        routeBasePath: 'newsletter',
        path: './newsletter',
        blogTitle: localizeConfigString('twilTitle'),
        blogDescription: localizeConfigString('twilDescription'),
        editUrl:
          'https://github.com/loongson-community/areweloongyet/edit/main',
        beforeDefaultRemarkPlugins: commonBeforeDefaultRemarkPlugins,
        rehypePlugins: commonRehypePlugins,
        onUntruncatedBlogPosts: 'throw',
      } satisfies BlogOptions,
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/loongson-community/areweloongyet',
          beforeDefaultRemarkPlugins: commonBeforeDefaultRemarkPlugins,
          rehypePlugins: commonRehypePlugins,
        },
        blog: {
          blogTitle: localizeConfigString('siteNewsTitle'),
          blogDescription: localizeConfigString('siteNewsDescription'),
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/loongson-community/areweloongyet',
          beforeDefaultRemarkPlugins: commonBeforeDefaultRemarkPlugins,
          rehypePlugins: commonRehypePlugins,
          onUntruncatedBlogPosts: 'throw',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      } as PresetClassicOptions,
    ],
  ],

  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: 'filename',
        language: ['en', 'zh'],
        blogDir: ['blog', 'newsletter'],
        blogRouteBasePath: ['/blog', '/newsletter'],
      } satisfies DocusaurusSearchLocalOptions,
    ],
    '@docusaurus/theme-mermaid',
  ],

  themeConfig: {
    colorMode: {
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    announcementBar: {
      id: 'branding-update',
      content:
        '农历乙巳蛇年之际，本站品牌形象焕新升级，<strong>咱蛇了！</strong><a href="/newsletter/announcing-a-lesser-loong-a-day/">详情请戳👉🐍</a>',
      backgroundColor: 'var(--ifm-color-primary)',
      textColor: 'var(--ifm-font-color-base-inverse)',
      isCloseable: true,
    },
    navbar: {
      title: '',
      logo: {
        alt: 'My Site Logo',
        src: localizeConfigString('logoPath'),
      },
      items: [
        {
          type: 'doc',
          docId: 'intro',
          position: 'left',
          label: '阅读材料',
        },
        { to: '/newsletter', label: '每日一小龙', position: 'left' },
        { to: '/asmdb', label: '汇编速查', position: 'left' },
        { to: '/blog', label: '本站动态', position: 'left' },
        {
          href: 'https://github.com/loongson-community/areweloongyet',
          position: 'right',
          // use the GitHub icon instead of text for the link (for desktop
          // displays), to conserve horizontal space
          // https://github.com/facebook/docusaurus/issues/2634
          className: 'header--github-link',
          'aria-label': 'GitHub repository of the website',
        },
        { type: 'localeDropdown', position: 'right' },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '站内导航',
          items: [
            {
              label: '阅读材料',
              to: '/docs/intro',
            },
            {
              label: '每日一小龙',
              to: '/newsletter',
            },
            {
              label: '汇编速查',
              to: '/asmdb',
            },
            {
              label: '本站动态',
              to: '/blog',
            },
          ],
        },
        {
          title: '第三方维护资源',
          items: [
            {
              label: '跨社区协同 issue 页',
              href: 'https://github.com/loongson-community/discussions/issues',
            },
            {
              label: '龙芯社区 GitHub',
              href: 'https://github.com/loongson-community',
            },
            {
              label: 'LoongArch 非官方论坛',
              href: 'https://bbs.loongarch.org',
            },
            {
              label: 'Telegram Loongson Group',
              href: 'https://t.me/loongson_users',
            },
            {
              label: '龙芯用户闲聊 Matrix 群',
              href: 'https://matrix.to/#/%23loongson-users-ot:matrix.org',
            },
            {
              label: '百度贴吧龙芯吧',
              href: 'https://tieba.baidu.com/f?kw=%E9%BE%99%E8%8A%AF&ie=utf-8',
            },
            {
              label: '龙友会（筹备中）',
              href: 'https://github.com/loongson-community/meetups',
            },
          ],
        },
        {
          title: '官方维护资源',
          items: [
            {
              label: '龙芯公司官网',
              href: 'https://loongson.cn',
            },
            {
              label: '龙芯公司官方 GitHub',
              href: 'https://github.com/loongson',
            },
            {
              label: '龙芯爱好者社区',
              href: 'https://www.loongbbs.cn',
            },
          ],
        },
      ],
      copyright: `© 2022-${new Date().getFullYear()} 本项目的贡献者们。本项目与任何营利性实体均利益无关。<br />本站内容中提及的商标均为相应拥有者的财产。`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
      // ideally there would be an assembly highlighter (TWiL 28 has some x86
      // asm in GAS AT&T syntax), but currently there isn't one
      //
      // see https://github.com/PrismJS/prism/issues/482
      //
      // this is now resolved for the LoongArch asm with custom plugin housed
      // right in the repo, and swizzled prism-include-languages component,
      // as per Docusaurus docs, so the "loongasm" language is not being
      // represented here
      additionalLanguages: ['bash', 'shell-session'],
    },
  } satisfies PresetClassicThemeConfig,
}

export default config
