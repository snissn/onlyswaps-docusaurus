// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'OnlySwaps',
  tagline: 'Developer documentation',
  favicon: 'img/favicon.ico',

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

  onBrokenLinks: 'throw',

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
          src: 'img/logo.svg',
        },
        items: [
          { type: 'doc', docId: 'index', position: 'left', label: 'Docs' },
          { to: '/getting-started', label: 'Getting Started', position: 'left' },
          {
            label: 'Reference',
            position: 'left',
            items: [
              { to: '/reference/solidity', label: 'Solidity' },
              { to: '/reference/rust-solver', label: 'Rust Solver' },
              { to: '/reference/js', label: 'JS SDK' },
            ],
          },
          { to: '/operations', label: 'Operations', position: 'left' },
          { to: '/recipes', label: 'Recipes', position: 'left' },
          { to: '/glossary', label: 'Glossary', position: 'left' },
          { href: 'https://github.com/fil-builders', label: 'GitHub', position: 'right' },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              { label: 'Getting Started', to: '/getting-started' },
              { label: 'Core Concepts', to: '/core-concepts' },
              { label: 'Reference', to: '/reference' },
              { label: 'Operations', to: '/operations' },
              { label: 'Glossary', to: '/glossary' },
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
