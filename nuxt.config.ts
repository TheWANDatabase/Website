// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: process.env.SSR !== undefined || true,
  modules: [
    '@nuxtjs/supabase',
    '@nuxtjs/color-mode',
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
        '/privacy'
      ]
    }
  },
  runtimeConfig: {
    public: {
      domain: process.env.DOMAIN
    }
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
