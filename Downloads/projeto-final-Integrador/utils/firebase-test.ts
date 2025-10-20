// Utilitário para testar a configuração do Firebase
export const testFirebaseConfig = () => {
  const config = useRuntimeConfig()

  const requiredKeys = [
    'firebaseApiKey',
    'firebaseAuthDomain',
    'firebaseProjectId',
    'firebaseStorageBucket',
    'firebaseMessagingSenderId',
    'firebaseAppId'
  ]

  const missingKeys = requiredKeys.filter(key => !config.public[key])

  if (missingKeys.length > 0) {
    console.error('❌ Configurações Firebase faltando:', missingKeys)
    return false
  }

  console.log('✅ Configuração Firebase válida!')
  console.log('📧 Auth Domain:', config.public.firebaseAuthDomain)
  console.log('🔑 Project ID:', config.public.firebaseProjectId)

  return true
}

export const getFirebaseConfig = () => {
  const config = useRuntimeConfig()

  return {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    databaseURL: config.public.firebaseDatabaseUrl,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId,
    measurementId: config.public.firebaseMeasurementId
  }
}
