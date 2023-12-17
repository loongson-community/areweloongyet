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

const config: Config = {
  title: '咱龙了吗？',
  tagline: '一站式了解 LoongArch 的上游生态建设。',
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
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
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
        ],
      } satisfies PluginClientRedirectsOptions,
    ],
    [
      '@docusaurus/plugin-content-blog',
      {
        id: 'blog-newsletter',
        routeBasePath: 'newsletter',
        path: './newsletter',
        blogTitle: '每周一龙',
        blogDescription: '龙架构®新世界生态建设周报《每周一龙》（This Week in LoongArch）。每周一都为大家报道 LoongArch® 社区最前线的第一手新鲜资讯！',
        editUrl: 'https://github.com/loongson-community/areweloongyet',
        beforeDefaultRemarkPlugins: commonBeforeDefaultRemarkPlugins,
        rehypePlugins: commonRehypePlugins,
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
          editUrl:
            'https://github.com/loongson-community/areweloongyet',
          beforeDefaultRemarkPlugins: commonBeforeDefaultRemarkPlugins,
          rehypePlugins: commonRehypePlugins,
        },
        blog: {
          blogTitle: '本站动态',
          blogDescription: '《咱龙了吗？》网站本身的开发、运营动态。',
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/loongson-community/areweloongyet',
          beforeDefaultRemarkPlugins: commonBeforeDefaultRemarkPlugins,
          rehypePlugins: commonRehypePlugins,
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
        hashed: "filename",
        language: ['en', 'zh'],
        blogDir: ['blog', 'newsletter'],
        blogRouteBasePath: ['/blog', '/newsletter'],
      } satisfies DocusaurusSearchLocalOptions,
    ],
  ],

  themeConfig: {
    navbar: {
      title: '',
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'intro',
          position: 'left',
          label: '阅读材料',
        },
        // {to: '/asmdb', label: '汇编指令速查', position: 'left'},
        { to: '/newsletter', label: '每周一龙', position: 'left' },
        { to: '/blog', label: '本站动态', position: 'left' },
        {
          href: 'https://github.com/loongson-community/areweloongyet',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '站内导航',
          items: [
            {
              label: '每周一龙',
              to: '/newsletter',
            },
            {
              label: '本站动态',
              to: '/blog',
            },
          ],
        },
        {
          title: '社区资源',
          items: [
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
          ],
        },
        {
          title: '企业资源',
          items: [
            {
              label: '龙芯公司官网',
              href: 'https://loongson.cn',
            },
            {
              label: '龙芯公司官方 GitHub',
              href: 'https://github.com/loongson',
            },
          ],
        },
      ],
      copyright: `© 2022-${new Date().getFullYear()} 本项目的贡献者们。本项目与龙芯公司利益无关。<br />龙芯®、龙芯中科®、龙芯架构®、龙架构®、Loongson®、LoongArch®等是龙芯中科技术股份有限公司（688047.SH）的注册商标。`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
      // ideally there would be an assembly highlighter (TWiL 28 has some x86
      // asm in GAS AT&T syntax), but currently there isn't one
      //
      // see https://github.com/PrismJS/prism/issues/482
      additionalLanguages: ['bash', 'shell-session'],
    },
  } satisfies PresetClassicThemeConfig,
}

export default config
