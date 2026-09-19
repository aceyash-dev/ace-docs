import { defineConfig } from 'vitepress'

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

  sitemap: {
    hostname: 'https://docs.ace-base.cc'
  },

  transformHead({ page, pageData, title, description }) {
    if (page === '404.md') return []

    const path = page.replace(/\.md$/, '').replace(/\/index$/, '/')
    const canonical = `https://docs.ace-base.cc/${path === 'index' ? '' : path.replace(/^\\//, '')}`
    const modified = pageData.lastUpdated
      ? new Date(pageData.lastUpdated).toISOString()
      : undefined

    const organization = {
      '@type': 'Organization',
      '@id': 'https://docs.ace-base.cc/#organization',
      name: 'The Ace Base',
      url: 'https://ace-base.cc/',
      logo: 'https://docs.ace-base.cc/icon.png',
      sameAs: ['https://github.com/tab-gl']
    }

    const graph = [
      organization,
      {
        '@type': 'WebSite',
        '@id': 'https://docs.ace-base.cc/#website',
        name: 'The Ace Base Documentation',
        url: 'https://docs.ace-base.cc/',
        publisher: { '@id': 'https://docs.ace-base.cc/#organization' },
        inLanguage: 'en'
      },
      {
        '@type': 'WebPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: title,
        description,
        isPartOf: { '@id': 'https://docs.ace-base.cc/#website' },
        publisher: { '@id': 'https://docs.ace-base.cc/#organization' },
        inLanguage: 'en',
        ...(modified ? { dateModified: modified } : {})
      }
    ]

    const projectSchemas = {
      'projects/ace-id.md': {
        '@type': 'SoftwareApplication',
        '@id': 'https://docs.ace-base.cc/projects/ace-id#software',
        name: 'AceID',
        applicationCategory: 'DeveloperApplication',
        applicationSubCategory: 'Identity and authentication',
        operatingSystem: 'Any',
        url: 'https://identity.ace-base.cc/',
        documentation: canonical,
        provider: { '@id': 'https://docs.ace-base.cc/#organization' }
      },
      'projects/typace.md': {
        '@type': 'SoftwareApplication',
        '@id': 'https://docs.ace-base.cc/projects/typace#software',
        name: 'Typace',
        applicationCategory: 'DeveloperApplication',
        applicationSubCategory: 'Font distribution service',
        operatingSystem: 'Any',
        url: 'https://typace.ace-base.cc/',
        documentation: canonical,
        provider: { '@id': 'https://docs.ace-base.cc/#organization' }
      }
    }

    if (projectSchemas[page]) graph.push(projectSchemas[page])

    if (page !== 'index.md' && page !== '404.md') {
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
        publisher: { '@id': 'https://docs.ace-base.cc/#organization' },
        mainEntityOfPage: { '@id': `${canonical}#webpage` },
        inLanguage: 'en',
        ...(modified ? { dateModified: modified, datePublished: modified } : {})
      })
    }

    const segments = canonical.replace('https://docs.ace-base.cc/', '').split('/').filter(Boolean)
    const breadcrumbItems = [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://docs.ace-base.cc/'
      }
    ]

    if (segments.length) {
      let url = 'https://docs.ace-base.cc'
      segments.forEach((segment, index) => {
        url += `/${segment}`
        breadcrumbItems.push({
          '@type': 'ListItem',
          position: index + 2,
          name: segment
            .replace(/-/g, ' ')
            .replace(/\b\w/g, char => char.toUpperCase()),
          item: url
        })
      })
    }

    if (page === 'about.md') {
      graph.push({
        '@type': 'FAQPage',
        '@id': `${canonical}#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is The Ace Base?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The Ace Base is an independent technology organization focused on building software, tools, interfaces, and experimental technology.'
            }
          },
          {
            '@type': 'Question',
            name: 'What projects does The Ace Base maintain?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The documentation currently covers AceID, an identity and authentication service, and Typace, a font distribution service.'
            }
          },
          {
            '@type': 'Question',
            name: 'Where is The Ace Base documentation maintained?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The Ace Base documentation is maintained as a VitePress site and published at https://docs.ace-base.cc/.'
            }
          },
          {
            '@type': 'Question',
            name: 'Who works on The Ace Base?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The organization currently has two members, Ace Yash and Yash Gupta.'
            }
          }
        ]
      })
    }

    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${canonical}#breadcrumb`,
      itemListElement: breadcrumbItems
    })

    return [
      ['link', { rel: 'canonical', href: canonical }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:url', content: canonical }],
      ['meta', { property: 'og:type', content: 'website' }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: description }],
      ['meta', { name: 'robots', content: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1' }],
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