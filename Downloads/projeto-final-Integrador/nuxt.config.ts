export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  components: true,
  css: ['~/assets/css/index.css'],
  modules: ['@pinia/nuxt'],

  runtimeConfig: {
    // Private keys (only available on server-side)
    firebaseClientSecret: process.env.FIREBASE_CLIENT_SECRET,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    jwtSecret: process.env.JWT_SECRET,

    // Public keys (exposed to client-side)
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseDatabaseUrl: process.env.FIREBASE_DATABASE_URL,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      firebaseMeasurementId: process.env.FIREBASE_MEASUREMENT_ID,
      appName: 'Serviflix',
      supportEmail: 'suporte@serviflix.com.br'
    }
  }
})
