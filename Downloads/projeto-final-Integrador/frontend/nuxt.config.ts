export default defineNuxtConfig({
  compatibilityDate: '2025-10-06',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/google-fonts',
    '@vueuse/nuxt',
    '@nuxtjs/supabase'
  ],
  googleFonts: {
    families: {
      Inter: [300, 400, 500, 600, 700, 800, 900]
    }
  },
  css: [
    '~/assets/css/variables.css',
    '~/assets/css/main.css',
    '~/assets/css/improvements.css',
    '~/assets/css/responsive-fixes.css',
    '~/assets/css/utilities.css'
  ],
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY
    }
  },
  app: {
    head: {
      title: 'ServiFlix - Plataforma de Serviços',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Conectando você aos melhores profissionais de Ceilândia' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  }
})