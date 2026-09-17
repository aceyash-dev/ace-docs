import { defineConfig } from 'vitepress'
import { SitemapStream, streamToPromise } from 'sitemap'

export default defineConfig({
  title: 'ACE-DOCS',
  description: 'Software, technology, and digital infrastructure by The Ace Base.',

  head: [
    ["link", { rel: "icon", href: "/icon.png" }],
    ["meta", { property: "og:image", content: "https://docs.ace-base.cc/icon.png" }],
    ["meta", { name: "twitter:card", content: "summary" }],
    ["meta", { name: "twitter:image", content: "https://docs.ace-base.cc/icon.png" }],
    ['link', { rel: 'icon', href: '/icon.png' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', {
      href: 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap',
      rel: 'stylesheet'
    }],
    ['link', {
      href: 'https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap',
      rel: 'stylesheet'
    }]
  ],

  cleanUrls: true,

  async buildEnd(siteConfig) {
    const hostname = 'https://docs.ace-base.cc'

    const sitemap = new SitemapStream({
      hostname
    })

    const urls = [
      '/',
      '/about',
      '/projects',
      '/projects/ace-id',
      '/projects/typace'
    ]

    for (const url of urls) {
      sitemap.write({ url })
    }

    sitemap.end()

    const xml = await streamToPromise(sitemap)

    await siteConfig.outDir.resolve('sitemap.xml').writeFile(xml)
  },

  themeConfig: {
    logo: '/icon.png',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'About', link: '/about' },
      { text: 'Projects', link: '/projects' }
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'About The Ace Base', link: '/about' },
          { text: 'Projects Overview', link: '/projects' }
        ]
      },
      {
        text: 'Projects',
        items: [
          { text: 'AceID', link: '/projects/ace-id' },
          { text: 'Typace', link: '/projects/typace' }
        ]
      }
    ],

    search: {
      provider: 'local'
    },

    outline: {
      level: [2, 3],
      label: 'On this page'
    },

    lastUpdated: {
      text: 'Last updated',
      formatOptions: {
        dateStyle: 'medium',
        timeStyle: 'short'
      }
    },

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/tab-gl'
      }
    ],

    footer: {
      message: 'Released under the appropriate distribution model.',
      copyright: 'Copyright © 2025-present The Ace Base'
    }
  }
})