// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const inspectUrls = require('@jsdevtools/rehype-url-inspector').default;

const annotateOverseasLinks = require('./src/plugins/awly-rehype-annotate-overseas-links').default;

const commonRehypePlugins = [
  [
    inspectUrls,
    /** @type {import('@jsdevtools/rehype-url-inspector').Options} */
    ({
      inspectEach(m) {
        annotateOverseasLinks(m)
      },
      selectors: ['a[href]'],
    }),
  ],
];

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '咱龙了吗？',
  tagline: '一站式了解 LoongArch 的上游生态建设。',
  url: 'https://areweloongyet.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  trailingSlash: true, // to reduce number of 301's with GitHub Pages

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
      './src/plugins/awly-asmdb-plugin',
      /** @type {import('./src/plugins/awly-asmdb-plugin').PluginOptions} */
      ({
        genAsmdbDataPath: './scripts/asmdb/gen-asmdb-data',
        loongarchOpcodesPath: './3rdparty/loongarch-opcodes',
      }),
    ],
    [
      './src/plugins/awly-data-plugin',
      /** @type {import('./src/plugins/awly-data-plugin').PluginOptions} */
      ({
        sourcePath: './src/data',
      }),
    ],
    [
      '@docusaurus/plugin-client-redirects',
      /** @type {import('@docusaurus/plugin-client-redirects').Options} */
      ({
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
      }),
    ],
    [
      '@docusaurus/plugin-content-blog',
      /** @type {import('@docusaurus/plugin-content-blog').Options} */
      ({
        id: 'blog-newsletter',
        routeBasePath: 'newsletter',
        path: './newsletter',
        blogTitle: '每周一龙',
        blogDescription: '龙架构®新世界生态建设周报《每周一龙》（This Week in LoongArch）。每周一都为大家报道 LoongArch® 社区最前线的第一手新鲜资讯！',
        editUrl: 'https://github.com/loongson-community/areweloongyet',
        rehypePlugins: commonRehypePlugins,
      }),
    ],
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/loongson-community/areweloongyet',
          rehypePlugins: commonRehypePlugins,
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/loongson-community/areweloongyet',
          rehypePlugins: commonRehypePlugins,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
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
          {to: '/newsletter', label: '每周一龙', position: 'left'},
          {to: '/blog', label: '本站动态', position: 'left'},
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
        additionalLanguages: ['bash', 'shell-session'],
      },
    }),
};

module.exports = config;
