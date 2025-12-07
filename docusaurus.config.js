// @ts-check
import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Physical AI & Humanoid Robotics',
  tagline: 'A comprehensive guide to embodied intelligence and AI systems operating in the physical world',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://your-username.github.io',
  // Set the /<base>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>'
  baseUrl: '/AI-humanoid-robotics/',

  // GitHub pages deployment config.
  organizationName: 'your-username', // Usually your GitHub org/user name.
  projectName: 'AI-humanoid-robotics', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

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
          editUrl: 'https://github.com/your-username/your-project/edit/main/',
        },
        blog: false, // Disable blog for this project
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'Physical AI & Humanoid Robotics',
        logo: {
          alt: 'Robotics Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Book',
          },
          {
            href: 'https://github.com/your-username/your-project',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Book',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Author Information',
            items: [
              {
                label: 'Muhammad Soman Amir Khan',
                href: 'https://www.linkedin.com/in/muhammad-soman-amir-khan',
              },
              {
                label: 'Email: soman43@gmail.com',
                href: 'mailto:soman43@gmail.com',
              },
              {
                label: 'Phone: +3196991873',
                href: 'tel:+3196991873',
              },
              {
                label: 'Address: Karachi , Pakistan',
                href: '#',
              },
            ],
          },
          {
            title: 'Connect',
            items: [
              {
                label: 'LinkedIn Profile',
                href: 'https://www.linkedin.com/in/muhammad-soman-amir-khan',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/SOMANcode786',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Physical AI & Humanoid Robotics Book. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;