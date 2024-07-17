import { defineConfig } from 'vitepress'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import Unocss from 'unocss/vite'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Array-Query',
  description: 'Documentation of Array-Query library',
  sitemap: {
    hostname: 'https://typed-xlsx.vercel.app',
  },
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },

    codeTransformers: [
      transformerTwoslash(),
    ],
  },
  lastUpdated: true,
  ignoreDeadLinks: true,
  cleanUrls: true,
  router: {
    prefetchLinks: true,
  },
  titleTemplate: 'Array-Query | :title',
  themeConfig: {
    logo: '/images/logo.svg',
    editLink: {
      pattern: 'https://github.com/ChronicStone/array-ql/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },
    search: { provider: 'local' },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Documentation', link: '/getting-started/introduction' },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/ChronicStone/array-ql' },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present Cyprien THAO',
    },
    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Introduction', link: '/getting-started/introduction' },
          { text: 'Installation', link: '/getting-started/installation' },
        ],
      },
      {
        text: 'Features',
        items: [
          { text: 'Pagination', link: '/features/pagination' },
          { text: 'Sorting', link: '/features/sorting' },
          { text: 'Searching', link: '/features/searching' },
          { text: 'Filtering', link: '/features/filtering' },
        ],
      },
      {
        text: 'Filter Match Modes',
        items: [
          { text: 'contains', link: '/filter-match-modes/contains' },
          { text: 'between', link: '/filter-match-modes/between' },
          { text: 'equals', link: '/filter-match-modes/equals' },
          { text: 'notEquals', link: '/filter-match-modes/not-equals' },
          { text: 'greaterThan', link: '/filter-match-modes/greater-than' },
          { text: 'greaterThanOrEqual', link: '/filter-match-modes/greater-than-or-equal' },
          { text: 'lessThan', link: '/filter-match-modes/less-than' },
          { text: 'lessThanOrEqual', link: '/filter-match-modes/less-than-or-equal' },
          { text: 'exists', link: '/filter-match-modes/exists' },
          { text: 'objectStringMap', link: '/filter-match-modes/object-string-map' },
          { text: 'arrayLength', link: '/filter-match-modes/array-length' },
          { text: 'objectMatch', link: '/filter-match-modes/object-match' },
        ],
      },
      {
        text: 'API Reference',
        items: [
          { text: 'Query Function', link: '/api-reference/query-function' },
          { text: 'QueryParams', link: '/api-reference/query-params' },
          { text: 'QueryFilter', link: '/api-reference/query-filter' },
          { text: 'FilterMatchMode', link: '/api-reference/filter-match-mode' },
        ],
      },
    ],

  },
  vite: {
    plugins: [
      Unocss({}),
    ],
  },
})
