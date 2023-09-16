// https://nuxt.com/docs/api/configuration/nuxt-config

if (!process.env.DOMAIN) { process.env.DOMAIN = process.env.VERCEL_URL }
if (!process.env.DOMAIN) { process.env.DOMAIN = process.env.VERCEL_BRANCH_URL }

export default defineNuxtConfig({
  ssr: false,
  modules: [
    'nuxt-vuefire',
    '@nuxthq/ui',
    'nuxt-icon',
    'nuxt-simple-sitemap'
  ],
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      domain: process.env.DOMAIN,
      stream_cid: process.env.STREAM_ID,
      api_base: (process.env.DOMAIN === 'localhost:3000' ? 'http://localhost:3333' : 'https://api.thewandb.com') + '/v' + process.env.API_VERSION
    }
  },
  colorMode: {
    preference: 'dark'
  },
  sitemap: {
    siteUrl: 'https://thewandb.com',
    urls: ['https://thewandb.com'],
    exclude: [
      '/privacy',
      '/cookies',
      '/tos'
    ],
    trailingSlash: true

  },
  vuefire: {
    auth: {
      enabled: true
    },
    config: JSON.parse(process.env.FB_CONFIG)
  }
})
