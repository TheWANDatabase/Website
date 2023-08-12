// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/supabase', 
    '@nuxtjs/color-mode',
    'nuxt-icon'
  ],
  devtools: { enabled: true },
  supabase: {
    redirect: false
  }
})
