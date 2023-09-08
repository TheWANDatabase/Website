// https://nuxt.com/docs/api/configuration/nuxt-config

if (!process.env.DOMAIN) { process.env.DOMAIN = process.env.VERCEL_URL }
if (!process.env.DOMAIN) { process.env.DOMAIN = process.env.VERCEL_BRANCH_URL }

export default defineNuxtConfig({
  ssr: false,
  modules: [
    'nuxt-vuefire',
    '@nuxtjs/supabase',
    '@nuxthq/ui',
    'nuxt-icon',
    'nuxt-simple-sitemap'
  ],
  devtools: { enabled: true },
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: [
        '/*'//,
        // '/sitemap*',
        // '/videos/*',
        // '/openapi-spec.json',
        // '/privacy',
        // '/cast',
        // '/contributors'
      ]
    }
  },
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
    // hostname: 'https://thewandb.com',
    // gzip: true,
    // cacheTime: 1000 * 60 * 15,
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
