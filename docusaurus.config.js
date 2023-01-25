// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '咱龙了吗？',
  tagline: '一站式了解 LoongArch 的上游生态建设。',
  url: 'https://areweloongyet.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

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
      {
        genAsmdbDataPath: './scripts/asmdb/gen-asmdb-data',
        loongarchOpcodesPath: './3rdparty/loongarch-opcodes',
      },
    ],
    [
      './src/plugins/awly-data-plugin',
      {
        sourcePath: './src/data',
      },
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
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/loongson-community/areweloongyet',
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
      },
    }),
};

module.exports = config;
