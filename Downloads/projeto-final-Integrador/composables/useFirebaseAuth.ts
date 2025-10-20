import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User as FirebaseUser,
  AuthErrorCodes
} from 'firebase/auth'

export const useFirebaseAuth = () => {
  const user = useState<FirebaseUser | null>('firebase.user', () => null)
  const loading = useState('firebase.loading', () => false) // Iniciar como false

  // Função para obter as instâncias do Firebase
  const getFirebaseInstances = () => {
    try {
      const { $firebaseAuth, $googleProvider } = useNuxtApp()
      return { $firebaseAuth, $googleProvider }
    } catch (error) {
      return { $firebaseAuth: null, $googleProvider: null }
    }
  }

  // Login com Email e Senha
  const signInWithEmail = async (email: string, password: string) => {
    try {
      loading.value = true
      const { $firebaseAuth } = getFirebaseInstances()

      if (!$firebaseAuth) {
        throw new Error('Firebase não está configurado')
      }

      // Validações básicas
      if (!email || !password) {
        throw new Error('Email e senha são obrigatórios')
      }

      if (password.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres')
      }

      const result = await signInWithEmailAndPassword($firebaseAuth, email, password)

      // Verificar se o email foi verificado
      if (!result.user.emailVerified) {
        return {
          success: false,
          error: 'Por favor, verifique seu email antes de fazer login',
          needsVerification: true,
          user: result.user
        }
      }

      // Sincronizar com backend
      try {
        await syncUserWithBackend(result.user)
      } catch (syncError) {
        console.warn('Erro na sincronização (não crítico):', syncError)
      }

      return { success: true, user: result.user }
    } catch (error: any) {
      console.error('Erro no login:', error)
      return {
        success: false,
        error: getAuthErrorMessage(error.code) || error.message
      }
    } finally {
      loading.value = false
    }
  }

  // Cadastro com Email e Senha
  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    try {
      loading.value = true
      const { $firebaseAuth } = getFirebaseInstances()

      if (!$firebaseAuth) {
        throw new Error('Firebase não está configurado')
      }

      // Validações
      if (!email || !password || !displayName) {
        throw new Error('Todos os campos são obrigatórios')
      }

      if (password.length < 8) {
        throw new Error('A senha deve ter pelo menos 8 caracteres')
      }

      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        throw new Error('A senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número')
      }

      // Criar usuário
      const result = await createUserWithEmailAndPassword($firebaseAuth, email, password)

      // Atualizar perfil com nome
      await updateProfile(result.user, {
        displayName: displayName
      })

      // Enviar email de verificação
      await sendEmailVerification(result.user, {
        url: `${window.location.origin}/login?verified=true`,
        handleCodeInApp: false
      })

      // Sincronizar com backend
      try {
        await syncUserWithBackend(result.user)
      } catch (syncError) {
        console.warn('Erro na sincronização (não crítico):', syncError)
      }

      return {
        success: true,
        user: result.user,
        message: 'Conta criada com sucesso! Verifique seu email para ativar a conta.'
      }
    } catch (error: any) {
      console.error('Erro no cadastro:', error)
      return {
        success: false,
        error: getAuthErrorMessage(error.code) || error.message
      }
    } finally {
      loading.value = false
    }
  }

  // Login com Google
  const signInWithGoogle = async () => {
    try {
      loading.value = true
      const { $firebaseAuth, $googleProvider } = getFirebaseInstances()

      if (!$firebaseAuth || !$googleProvider) {
        throw new Error('Firebase não está configurado')
      }

      const result = await signInWithPopup($firebaseAuth, $googleProvider)

      // Sincronizar com backend
      try {
        await syncUserWithBackend(result.user)
      } catch (syncError) {
        console.warn('Erro na sincronização (não crítico):', syncError)
      }

      return { success: true, user: result.user }
    } catch (error: any) {
      console.error('Erro no login:', error)
      return {
        success: false,
        error: getAuthErrorMessage(error.code) || error.message
      }
    } finally {
      loading.value = false
    }
  }

  // Recuperação de Senha
  const resetPassword = async (email: string) => {
    try {
      loading.value = true
      const { $firebaseAuth } = getFirebaseInstances()

      if (!$firebaseAuth) {
        throw new Error('Firebase não está configurado')
      }

      if (!email) {
        throw new Error('Email é obrigatório')
      }

      await sendPasswordResetEmail($firebaseAuth, email, {
        url: `${window.location.origin}/login`,
        handleCodeInApp: false
      })

      return {
        success: true,
        message: 'Email de recuperação enviado! Verifique sua caixa de entrada.'
      }
    } catch (error: any) {
      console.error('Erro na recuperação:', error)
      return {
        success: false,
        error: getAuthErrorMessage(error.code) || error.message
      }
    } finally {
      loading.value = false
    }
  }

  // Reenviar Email de Verificação
  const resendVerificationEmail = async () => {
    try {
      loading.value = true
      const { $firebaseAuth } = getFirebaseInstances()

      if (!$firebaseAuth?.currentUser) {
        throw new Error('Usuário não encontrado')
      }

      await sendEmailVerification($firebaseAuth.currentUser, {
        url: `${window.location.origin}/login?verified=true`,
        handleCodeInApp: false
      })

      return {
        success: true,
        message: 'Email de verificação reenviado!'
      }
    } catch (error: any) {
      console.error('Erro ao reenviar email:', error)
      return {
        success: false,
        error: getAuthErrorMessage(error.code) || error.message
      }
    } finally {
      loading.value = false
    }
  }

  // Logout
  const signOut = async () => {
    try {
      const { $firebaseAuth } = getFirebaseInstances()
      await firebaseSignOut($firebaseAuth)
      user.value = null
      await navigateTo('/')
      return { success: true }
    } catch (error: any) {
      console.error('Erro no logout:', error)
      return { success: false, error: error.message }
    }
  }

  // Sincronizar usuário com backend
  const syncUserWithBackend = async (firebaseUser: FirebaseUser) => {
    try {
      const token = await firebaseUser.getIdToken()

      const response = await $fetch('/api/auth/sync', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: {
          firebaseUid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          avatar: firebaseUser.photoURL
        }
      })

      return response
    } catch (error) {
      console.error('Erro ao sincronizar usuário:', error)
      throw error
    }
  }

  // Obter token do usuário atual
  const getCurrentUserToken = async () => {
    if (!user.value) return null
    try {
      return await user.value.getIdToken()
    } catch (error) {
      console.error('Erro ao obter token:', error)
      return null
    }
  }

  // Inicializar listener de autenticação
  const initAuth = () => {
    return new Promise<void>((resolve) => {
      // Definir loading como false imediatamente para mostrar os botões
      loading.value = false

      try {
        const { $firebaseAuth } = getFirebaseInstances()

        if (!$firebaseAuth) {
          console.warn('Firebase Auth não está disponível')
          resolve()
          return
        }

        const unsubscribe = onAuthStateChanged($firebaseAuth, (firebaseUser) => {
          user.value = firebaseUser
          resolve()
        })

        // Cleanup no unmount
        if (import.meta.client) {
          window.addEventListener('beforeunload', unsubscribe)
        }
      } catch (error) {
        console.error('Erro ao inicializar auth:', error)
        resolve()
      }
    })
  }

  // Função para traduzir erros do Firebase
  const getAuthErrorMessage = (errorCode: string): string => {
    const errorMessages: Record<string, string> = {
      [AuthErrorCodes.EMAIL_EXISTS]: 'Este email já está em uso',
      [AuthErrorCodes.INVALID_EMAIL]: 'Email inválido',
      [AuthErrorCodes.WEAK_PASSWORD]: 'Senha muito fraca',
      [AuthErrorCodes.USER_DELETED]: 'Usuário não encontrado',
      [AuthErrorCodes.INVALID_PASSWORD]: 'Senha incorreta',
      [AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER]: 'Muitas tentativas. Tente novamente mais tarde',
      [AuthErrorCodes.NETWORK_REQUEST_FAILED]: 'Erro de conexão. Verifique sua internet',
      [AuthErrorCodes.POPUP_CLOSED_BY_USER]: 'Login cancelado pelo usuário',
      [AuthErrorCodes.POPUP_BLOCKED]: 'Popup bloqueado pelo navegador',
      'auth/user-not-found': 'Email não encontrado',
      'auth/wrong-password': 'Senha incorreta',
      'auth/invalid-credential': 'Credenciais inválidas'
    }

    return errorMessages[errorCode] || 'Erro desconhecido'
  }

  return {
    user: readonly(user),
    loading: readonly(loading),
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    resetPassword,
    resendVerificationEmail,
    signOut,
    getCurrentUserToken,
    initAuth,
    isAuthenticated: computed(() => !!user.value),
    isEmailVerified: computed(() => user.value?.emailVerified || false)
  }
}
