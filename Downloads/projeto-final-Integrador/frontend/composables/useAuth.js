// Composable para autenticação e registro - VERSÃO LIMPA
export const useAuth = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  // Registrar usuário cliente
  const registerClient = async (userData) => {
    try {
      console.log('🔄 Iniciando registro de cliente...')
      
      // 1. Criar conta no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify-email`
        }
      })

      if (authError) {
        console.error('❌ Erro no Auth:', authError)
        throw authError
      }

      console.log('✅ Usuário criado no Auth:', authData.user.id)

      // 2. Criar perfil diretamente
      if (authData.user && authData.user.id) {
        console.log('🔄 Criando perfil do cliente...')
        
        const profileData = {
          id: authData.user.id,
          name: userData.name,
          email: userData.email,
          cpf: userData.cpf,
          phone: userData.phone,
          user_type: 'cliente',
          status: 'pending_verification'
        }

        console.log('📝 Dados do perfil:', profileData)

        const { error: profileError } = await supabase
          .from('profiles')
          .insert(profileData)

        if (profileError) {
          console.error('❌ Erro ao criar perfil:', profileError)
          throw new Error(`Erro ao criar perfil: ${profileError.message}`)
        }

        console.log('✅ Perfil do cliente criado com sucesso!')
      }

      return {
        success: true,
        user: authData.user,
        needsVerification: !authData.user?.email_confirmed_at
      }

    } catch (error) {
      console.error('❌ Erro no registro do cliente:', error)
      return {
        success: false,
        error: error.message || 'Erro desconhecido'
      }
    }
  }

  // Registrar usuário profissional
  const registerProfessional = async (userData) => {
    try {
      console.log('🔄 Iniciando registro de profissional...')
      
      // 1. Criar conta no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify-email`
        }
      })

      if (authError) {
        console.error('❌ Erro no Auth:', authError)
        throw authError
      }

      console.log('✅ Usuário criado no Auth:', authData.user.id)

      // 2. Criar perfil completo
      if (authData.user && authData.user.id) {
        console.log('🔄 Criando perfil do profissional...')
        
        const profileData = {
          id: authData.user.id,
          name: userData.name,
          email: userData.email,
          cpf: userData.cpf,
          phone: userData.phone,
          user_type: 'profissional',
          status: 'pending_verification',
          // Endereço
          logradouro: userData.logradouro,
          numero: userData.numero,
          bairro: userData.bairro,
          cidade: userData.cidade,
          cep: userData.cep,
          pais: userData.pais || 'Brasil',
          complemento: userData.complemento,
          // Profissional
          profissao: userData.profissao,
          experiencia: userData.experiencia,
          descricao: userData.descricao,
          preco_hora: userData.preco_hora,
          disponibilidade: userData.disponibilidade
        }

        console.log('📝 Dados do perfil profissional:', profileData)

        const { error: profileError } = await supabase
          .from('profiles')
          .insert(profileData)

        if (profileError) {
          console.error('❌ Erro ao criar perfil:', profileError)
          throw new Error(`Erro ao criar perfil: ${profileError.message}`)
        }

        console.log('✅ Perfil do profissional criado com sucesso!')
      }

      return {
        success: true,
        user: authData.user,
        needsVerification: !authData.user?.email_confirmed_at
      }

    } catch (error) {
      console.error('❌ Erro no registro do profissional:', error)
      return {
        success: false,
        error: error.message || 'Erro desconhecido'
      }
    }
  }

  // Login
  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        throw error
      }

      return {
        success: true,
        user: data.user
      }

    } catch (error) {
      console.error('Erro no login:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Logout
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        throw error
      }

      await navigateTo('/entrar')
      return { success: true }

    } catch (error) {
      console.error('Erro no logout:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Reenviar email de verificação
  const resendVerificationEmail = async (email) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify-email`
        }
      })

      if (error) {
        throw error
      }

      return { success: true }

    } catch (error) {
      console.error('Erro ao reenviar email:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  return {
    user: readonly(user),
    registerClient,
    registerProfessional,
    login,
    logout,
    resendVerificationEmail
  }
}