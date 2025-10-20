import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getAnalytics } from 'firebase/analytics'

export default defineNuxtPlugin(() => {
  try {
    const config = useRuntimeConfig()

    // Validar configurações essenciais
    const requiredKeys = ['firebaseApiKey', 'firebaseAuthDomain', 'firebaseProjectId']
    const missingKeys = requiredKeys.filter(key => !config.public[key])

    if (missingKeys.length > 0) {
      console.error('❌ Configurações Firebase faltando:', missingKeys)
      throw new Error(`Configurações Firebase faltando: ${missingKeys.join(', ')}`)
    }

    // Firebase configuration usando variáveis de ambiente
    const firebaseConfig = {
      apiKey: config.public.firebaseApiKey,
      authDomain: config.public.firebaseAuthDomain,
      databaseURL: config.public.firebaseDatabaseUrl,
      projectId: config.public.firebaseProjectId,
      storageBucket: config.public.firebaseStorageBucket,
      messagingSenderId: config.public.firebaseMessagingSenderId,
      appId: config.public.firebaseAppId,
      measurementId: config.public.firebaseMeasurementId
    }

    console.log('🔥 Inicializando Firebase...')
    console.log('📧 Auth Domain:', firebaseConfig.authDomain)
    console.log('🔑 Project ID:', firebaseConfig.projectId)

    // Initialize Firebase
    const app = initializeApp(firebaseConfig)

    // Initialize Firebase Authentication
    const auth = getAuth(app)

    // Configurar idioma para português
    auth.languageCode = 'pt-BR'

    // Configure Google Auth Provider
    const googleProvider = new GoogleAuthProvider()
    googleProvider.addScope('email')
    googleProvider.addScope('profile')
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    })

    // Initialize Analytics (only in browser)
    let analytics: any = null
    if (import.meta.client && firebaseConfig.measurementId) {
      try {
        analytics = getAnalytics(app)
        console.log('📊 Firebase Analytics inicializado')
      } catch (analyticsError) {
        console.warn('⚠️ Erro ao inicializar Analytics:', analyticsError)
      }
    }

    console.log('✅ Firebase inicializado com sucesso!')

    return {
      provide: {
        firebaseApp: app,
        firebaseAuth: auth,
        googleProvider,
        analytics
      }
    }
  } catch (error) {
    console.error('❌ Erro ao inicializar Firebase:', error)

    // Retornar providers vazios para evitar quebrar a aplicação
    return {
      provide: {
        firebaseApp: null,
        firebaseAuth: null,
        googleProvider: null,
        analytics: null
      }
    }
  }
})
