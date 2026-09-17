import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "ACE-DOCS",
  description: "Software, technology, and digital infrastructure by The Ace Base.",
  
  // 1. Added Head configuration to load your custom fonts
  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    // Load Instrument Serif (for headings)
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap', rel: 'stylesheet' }],
    // Load Satoshi (for body text) - Assuming you are using Fontshare or similar CDN
    ['link', { href: 'https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap', rel: 'stylesheet' }]
  ],

  themeConfig: {
    // NOTE: Make sure icon.png is placed in docs/public/icon.png
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

    // 2. Added Local Search (Very useful for docs)
    search: {
      provider: 'local'
    },

    // 3. Added Outline configuration for the right-side Table of Contents
    outline: {
      level: [2, 3],
      label: 'On this page'
    },

    // 4. Added Last Updated timestamp
    lastUpdated: {
      text: 'Last updated',
      formatOptions: {
        dateStyle: 'medium',
        timeStyle: 'short'
      }
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/tab-gl' }
    ],
    
    footer: {
      message: 'Released under the appropriate distribution model.',
      copyright: 'Copyright © 2025-present The Ace Base'
    },

    // 5. Added Edit Link (Optional, but good for open source docs)
    editLink: {
      pattern: 'https://github.com/tab-gl/ace-docs/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    }
  }
})