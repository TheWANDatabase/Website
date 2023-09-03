// https://nuxt.com/docs/api/configuration/nuxt-config

if (!process.env.DOMAIN) { process.env.DOMAIN = process.env.VERCEL_URL }
if (!process.env.DOMAIN) { process.env.DOMAIN = process.env.VERCEL_BRANCH_URL }

export default defineNuxtConfig({
  // ssr: false,
  modules: [
    '@nuxtjs/supabase',
    '@nuxtjs/color-mode',
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
        '/',
        '/sitemap*',
        '/videos/*',
        '/openapi-spec.json',
        '/privacy',
        '/cast',
        '/contributors'
      ]
    }
  },
  runtimeConfig: {
    public: {
      domain: process.env.DOMAIN,
      stream_cid: process.env.STREAM_ID,
      api_base: 'http' + (!process.env.DOMAIN.startsWith('localhost') ? 's' : '') + '://' + process.env.DOMAIN + '/api/v1'
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

  }
})
