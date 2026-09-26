import { defineConfig } from 'vitepress'

const SITE = 'https://docs.ace-base.cc'
const ORG = 'https://ace-base.cc/'
const GITHUB = 'https://github.com/tab-gl'

export default defineConfig({
  title: 'ACE-DOCS',
  description: 'Technical documentation for The Ace Base, including AceID and Typace.',
  lang: 'en-US',
  cleanUrls: true,

  sitemap: {
    hostname: SITE
  },

  head: [
    ['link', { rel: 'icon', href: '/icon.png' }],
    ['link', { rel: 'canonical', href: SITE + '/' }],
    ['meta', { name: 'robots', content: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1' }],
    ['meta', { property: 'og:site_name', content: 'The Ace Base Documentation' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:image', content: SITE + '/icon.png' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    ['meta', { name: 'twitter:image', content: SITE + '/icon.png' }]
  ],

  transformHead({ page, title, description }) {
    if (page === '404.md') return []

    const cleanPage = page.replace(/\.md$/, '').replace(/\/index$/, '')
    const canonical = cleanPage ? `${SITE}/${cleanPage}` : `${SITE}/`
    const project =
      page === 'projects/ace-id.md'
        ? 'AceID'
        : page === 'projects/typace.md' || page === 'projects/typace-api.md'
          ? 'Typace'
          : null

    const graph = [
      {
        '@type': 'Organization',
        '@id': `${SITE}/#organization`,
        name: 'The Ace Base',
        url: ORG,
        logo: `${SITE}/icon.png`,
        sameAs: [GITHUB]
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE}/#website`,
        name: 'The Ace Base Documentation',
        url: SITE + '/',
        publisher: { '@id': `${SITE}/#organization` },
        inLanguage: 'en-US'
      },
      {
        '@type': 'WebPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: title,
        description,
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        inLanguage: 'en-US'
      }
    ]

    if (project) {
      graph.push({
        '@type': 'SoftwareApplication',
        '@id': `${canonical}#software`,
        name: project,
        applicationCategory: 'DeveloperApplication',
        url: project === 'Typace' ? 'https://typace.ace-base.cc/' : 'https://identity.ace-base.cc/',
        documentation: canonical,
        provider: { '@id': `${SITE}/#organization` }
      })
    }

    if (page !== 'index.md') {
      graph.push({
        '@type': 'TechArticle',
        '@id': `${canonical}#article`,
        headline: title,
        description,
        url: canonical,
        author: {
          '@type': 'Person',
          name: 'Ace Yash',
          url: 'https://github.com/aceyash-dev'
        },
        publisher: { '@id': `${SITE}/#organization` },
        mainEntityOfPage: { '@id': `${canonical}#webpage` },
        inLanguage: 'en-US'
      })
    }

    const breadcrumbs = [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE + '/' }]
    if (cleanPage) {
      cleanPage.split('/').forEach((part, index) => {
        breadcrumbs.push({
          '@type': 'ListItem',
          position: index + 2,
          name: part.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          item: `${SITE}/${cleanPage.split('/').slice(0, index + 1).join('/')}`
        })
      })
    }
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${canonical}#breadcrumb`,
      itemListElement: breadcrumbs
    })

    return [
      ['link', { rel: 'canonical', href: canonical }],
      ['meta', { name: 'robots', content: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1' }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:url', content: canonical }],
      ['meta', { property: 'og:type', content: 'article' }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: description }],
      ['script', { type: 'application/ld+json' }, JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': graph
      })]
    ]
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
          { text: 'AceID API Reference', link: '/projects/ace-id-api' },
          { text: 'AceID Security', link: '/projects/ace-id-security' },
          { text: 'AceID SDK Guide', link: '/projects/ace-id-sdk' },
          { text: 'Typace', link: '/projects/typace' },
          { text: 'Typace API Reference', link: '/projects/typace-api' }
        ]
      }
    ],

    search: { provider: 'local' },

    outline: { level: [2, 3], label: 'On this page' },

    lastUpdated: {
      text: 'Last updated',
      formatOptions: {
        dateStyle: 'medium',
        timeStyle: 'short'
      }
    },

    socialLinks: [
      { icon: 'github', link: GITHUB }
    ],

    footer: {
      message: 'Technical documentation by The Ace Base.',
      copyright: 'Copyright © 2025-present The Ace Base'
    }
  }
})
