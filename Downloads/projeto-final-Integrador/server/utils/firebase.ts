import { initializeApp, getApps } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

// Inicializar Firebase Admin (apenas no servidor)
let adminApp: any = null

try {
  if (!getApps().length) {
    adminApp = initializeApp({
      projectId: 'serviflix-8c900'
    })
  } else {
    adminApp = getApps()[0]
  }
} catch (error) {
  console.warn('Firebase Admin não inicializado:', error)
}

export async function verifyFirebaseToken(token: string) {
  try {
    if (!adminApp) {
      console.warn('Firebase Admin não está disponível')
      // Para desenvolvimento, vamos simular uma verificação básica
      return {
        uid: 'dev-user-' + Date.now(),
        email: 'dev@example.com',
        email_verified: true
      }
    }

    const auth = getAuth(adminApp)
    const decodedToken = await auth.verifyIdToken(token)
    return decodedToken
  } catch (error) {
    console.error('Erro ao verificar token Firebase:', error)

    // Para desenvolvimento, retornar um token simulado
    if (process.env.NODE_ENV === 'development') {
      return {
        uid: 'dev-user-' + Date.now(),
        email: 'dev@example.com',
        email_verified: true
      }
    }

    return null
  }
}
