/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'dormant.ninja',
  tagline: 'datfinesoul / Phil Hadviger\'s Blog and Docs',
  url: 'https://dormant.ninja',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'datfinesoul', // Usually your GitHub org/user name.
  projectName: 'dormant-ninja-site', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Blog',
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo.webp',
      },
      items: [
        {
          to: 'blog-archive',
          label: 'Blog Archive',
          position: 'left'
        },
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        //{
        //  href: 'https://github.com/facebook/docusaurus',
        //  label: 'GitHub',
        //  position: 'right',
        //},
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          items: [
            {
              label: 'jq guide',
              to: 'docs/',
            },
          ],
        },
        {
          items: [
            {
              label: 'bash guide',
              to: 'docs/bash/index',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} dormant.ninja`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          //editUrl:
          //  'https://github.com/facebook/docusaurus/edit/master/website/',
        },
        blog: {
          showReadingTime: true,
          blogTitle: 'dormant.ninja blog',
          blogDescription: 'thoughts of the sleeping ninja',
          routeBasePath: '/',
          path: './blog'
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  plugins: [
    [
      '@docusaurus/plugin-content-blog',
      {
        /**
         * Required for any multi-instance plugin
         */
        id: 'draft-blog',
        /**
         * URL route for the blog section of your site.
         * *DO NOT* include a trailing slash.
         */
        routeBasePath: 'drafts',
        /**
         * Path to data on filesystem relative to site dir.
         */
        path: './drafts',
      },
    ],
  ],
};
