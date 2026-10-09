import { defineConfig } from 'vitepress'

const SITE = 'https://docs.ace-base.cc'
const ORG = 'https://ace-base.cc/'
const BLUESKY = 'https://bsky.app/profile/ace-base.cc'

export default defineConfig({
  title: 'ACE-DOCS',
  description: 'Technical documentation for The Ace Base, including AceID, AIDC, Typace, and SYT.',
  lang: 'en-US',
  cleanUrls: true,

  head: [
    ['link', { rel: 'icon', href: '/icon.png' }],
    ['meta', { name: 'robots', content: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1' }],
    ['meta', { property: 'og:site_name', content: 'The Ace Base Documentation' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:image', content: SITE + '/icon.png' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    ['meta', { name: 'twitter:image', content: SITE + '/icon.png' }]
  ],

  transformHead({ page, title, description }) {
    if (page === '404.md') return []

    const cleanPage = page === 'index.md' ? '' : page.replace(/\.md$/, '').replace(/\/index$/, '')
    const canonical = cleanPage ? `${SITE}/${cleanPage}` : `${SITE}/`
    const project =
      page === 'projects/ace-id.md'
        ? 'AceID'
        : page === 'projects/aidc.md'
          ? 'AIDC'
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
        sameAs: [BLUESKY]
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
        url:
          project === 'Typace'
            ? 'https://typace.ace-base.cc/'
            : project === 'AIDC'
              ? 'https://aidc.ace-base.cc/'
              : project === 'SYT'
                ? 'https://syt.ace-base.cc/'
                : 'https://identity.ace-base.cc/',
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
          name: 'Ace Yash'
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
          {
            text: 'Typace',
            collapsed: true,
            items: [
              { text: 'Overview', link: '/projects/typace' },
              { text: 'API', link: '/projects/typace-api' }
            ]
          },
          {
            text: 'Ace ID',
            collapsed: true,
            items: [
              { text: 'Overview', link: '/projects/ace-id' },
              { text: 'API', link: '/projects/ace-id-api' },
              { text: 'Security', link: '/projects/ace-id-security' },
              { text: 'SDK', link: '/projects/ace-id-sdk' },
              { text: 'Android SDK', link: '/projects/ace-id-sdk-android' },
              { text: 'iOS SDK', link: '/projects/ace-id-sdk-ios' },
              { text: 'Framework and SSR', link: '/projects/ace-id-sdk-framework-adapters' },
            ]
          },
          {
            text: 'AIDC',
            collapsed: true,
            items: [
              { text: 'Overview', link: '/projects/aidc' }
            ]
          }
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
      {
        icon: {
          svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="currentColor" d="M5.202 2.857C7.954 4.922 10.913 9.11 12 11.358c1.087-2.247 4.046-6.436 6.798-8.501C20.783 1.366 24 .213 24 3.883c0 .732-.42 6.156-.667 7.037-.856 3.061-3.978 3.842-6.755 3.37 4.854.826 6.089 3.562 3.422 6.299-5.065 5.196-7.28-1.304-7.847-2.97-.104-.305-.152-.448-.153-.327 0-.121-.05.022-.153.327-.568 1.666-2.782 8.166-7.847 2.97-2.667-2.737-1.432-5.473 3.422-6.3-2.777.473-5.899-.308-6.755-3.369C.42 10.04 0 4.615 0 3.883c0-3.67 3.217-2.517 5.202-1.026"/></svg>'
        },
        link: BLUESKY,
        ariaLabel: 'Bluesky: @ace-base.cc'
      }
    ],

    footer: {
      message: 'Technical documentation by The Ace Base.',
      copyright: 'Copyright © 2025-present The Ace Base'
    }
  }
})
