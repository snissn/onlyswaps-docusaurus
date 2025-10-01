// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';
import {createRequire} from 'module';
const require = createRequire(import.meta.url);
const noMdxEsm = require('./plugins/remark/noMdxEsm.js');

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'OnlySwaps',
  tagline: 'Developer documentation',
  favicon: 'img/randamu_logo.svg',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'fil-builders', // Usually your GitHub org/user name.
  projectName: 'randamu', // Usually your repo name.

  onBrokenLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  plugins: [],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'OnlySwaps',
        logo: {
          alt: 'OnlySwaps Logo',
          src: 'img/randamu_logo.svg',
        },
        items: [
          { type: 'doc', docId: 'index', position: 'left', label: 'Docs' },
          {
            label: 'Guides',
            position: 'left',
            items: [
              { to: '/guides/quickstart-ui', label: 'Quickstart UI' },
              { to: '/guides/programmatic-swaps', label: 'Programmatic Swaps' },
              { to: '/guides/contract-upgrades', label: 'Contract Upgrades' },
            ],
          },
          {
            label: 'Concepts',
            position: 'left',
            items: [
              { to: '/concepts/overview', label: 'Overview' },
              { to: '/concepts/architecture', label: 'Architecture' },
              { to: '/concepts/terminology', label: 'Terminology' },
            ],
          },
          {
            label: 'Reference',
            position: 'left',
            items: [
              { to: '/reference/solidity/router', label: 'Solidity' },
              { to: '/reference/js-sdk/overview', label: 'JS SDK' },
              { to: '/reference/ui-library/overview', label: 'UI Library' },
            ],
          },
          { href: 'https://github.com/fil-builders', label: 'GitHub', position: 'right' },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              { label: 'Quickstart', to: '/guides/quickstart-ui' },
              { label: 'Concepts', to: '/concepts/overview' },
              { label: 'JS SDK', to: '/reference/js-sdk/overview' },
              { label: 'Solidity', to: '/reference/solidity/router' },
              { label: 'UI Library', to: '/reference/ui-library/overview' },
            ],
          },
          {
            title: 'More',
            items: [
              { label: 'GitHub', href: 'https://github.com/fil-builders' },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} OnlySwaps. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
