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
      api_base: (process.env.API_DOMAIN || 'https://api.thewandb.com') + '/v' + process.env.API_VERSION,
      ws: {
        user: process.env.WS_USER,
        password: process.env.WS_PASSWORD
      },
      debug: process.env.DOMAIN === 'localhost:3000'
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
    config: {
      apiKey: 'AIzaSyDfGDJHyFTLnJnDCnUkeQGmOuWELQcudv4',
      authDomain: 'the-wan-db-37a19.firebaseapp.com',
      databaseURL: 'https://the-wan-db-37a19-default-rtdb.europe-west1.firebasedatabase.app',
      projectId: 'the-wan-db-37a19',
      storageBucket: 'the-wan-db-37a19.appspot.com',
      messagingSenderId: '1041584087918',
      appId: '1:1041584087918:web:f30c9816105e75d545177f',
      measurementId: 'G-TEJJNTFDRT'
    }
  }
})
