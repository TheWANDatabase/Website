// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['nuxt-icon', 'nuxt-cloudflare-analytics', '@nuxtjs/turnstile'],
  devtools: { enabled: true },
  cloudflareAnalytics: {
    token: "7e6457ad832d47edbb1ed8eead1b30da"
  },
  turnstile: {
    siteKey: '0x4AAAAAAANjpEX-etQ1y5D9'
  },
})
