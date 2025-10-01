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
        // Disable default single-docs instance; we'll run two docs plugins (v1, v2)
        docs: false,
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'v1',
        path: 'docs/v1/docs',
        routeBasePath: 'v1',
        sidebarPath: require.resolve('./sidebars.v1.js'),
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'v2',
        path: 'docs/v2',
        routeBasePath: 'v2',
        sidebarPath: require.resolve('./sidebars.v2.js'),
      },
    ],
  ],

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
          {
            label: 'Docs',
            position: 'left',
            items: [
              { to: '/v1', label: 'Version 1' },
              { to: '/v2', label: 'Version 2' },
            ],
          },
          {
            label: 'Guides',
            position: 'left',
            items: [
              { to: '/v2/getting-started/for-end-users', label: 'For End Users (v2)' },
              { to: '/v2/getting-started/for-developers/frontend-quickstart', label: 'Frontend Quickstart (v2)' },
              { to: '/v2/getting-started/for-developers/backend-integration', label: 'Programmatic Swaps (v2)' },
              { to: '/v1/getting-started/for-end-users', label: 'For End Users (v1)' },
              { to: '/v1/getting-started/for-developers/frontend-quickstart', label: 'Frontend Quickstart (v1)' },
              { to: '/v1/getting-started/for-developers/backend-integration', label: 'Programmatic Swaps (v1)' },
            ],
          },
          {
            label: 'Concepts',
            position: 'left',
            items: [
              { to: '/v2/introduction/overview', label: 'Overview (v2)' },
              { to: '/v2/introduction/architecture', label: 'Architecture (v2)' },
              { to: '/v1/introduction/overview', label: 'Overview (v1)' },
              { to: '/v1/introduction/architecture', label: 'Architecture (v1)' },
            ],
          },
          {
            label: 'Reference',
            position: 'left',
            items: [
              { to: '/v2/reference/api', label: 'API / SDK (v2)' },
              { to: '/v2/reference/fees', label: 'Fees (v2)' },
              { to: '/v2/reference/chains-and-tokens', label: 'Chains & Tokens (v2)' },
              { to: '/v2/reference/faq', label: 'FAQ (v2)' },
              { to: '/v1/reference/api', label: 'API / SDK (v1)' },
              { to: '/v1/reference/fees', label: 'Fees (v1)' },
              { to: '/v1/reference/chains-and-tokens', label: 'Chains & Tokens (v1)' },
              { to: '/v1/reference/faq', label: 'FAQ (v1)' },
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
              { label: 'Docs v2', to: '/v2' },
              { label: 'Docs v1', to: '/v1' },
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
