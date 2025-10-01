// @ts-check

/**
 * OnlySwaps v2-alt docs sidebar
 * @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const sidebars = {
  onlyswapsSidebar: [
    'index',
    {
      type: 'category',
      label: 'Concepts',
      items: [
        'concepts/overview',
        'concepts/core-concepts',
        'concepts/architecture',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/quickstart-ui',
        'guides/programmatic-js',
        'guides/contract-integration-upgrades',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      items: [
        'reference/onlyswaps-ui',
        'reference/onlyswaps-js',
        'reference/solidity',
      ],
    },
  ],
};

export default sidebars;

