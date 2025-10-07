// Composable para gerenciar verificação de email
export const useEmailVerification = () => {
  const supabase = useSupabaseClient()

  // Enviar email de verificação
  const sendVerificationEmail = async (email) => {
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
      console.error('Erro ao enviar email de verificação:', error)
      return { success: false, error: error.message }
    }
  }

  // Verificar token de email
  const verifyEmailToken = async (token, type = 'signup') => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: type
      })

      if (error) {
        throw error
      }

      return { success: true, data }
    } catch (error) {
      console.error('Erro ao verificar token:', error)
      return { success: false, error: error.message }
    }
  }

  // Verificar se email foi confirmado
  const checkEmailVerification = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error) {
        throw error
      }

      return {
        success: true,
        isVerified: user?.email_confirmed_at !== null,
        user
      }
    } catch (error) {
      console.error('Erro ao verificar status do email:', error)
      return { success: false, error: error.message }
    }
  }

  // Atualizar status do usuário após verificação
  const updateUserStatusAfterVerification = async (userId) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) {
        throw error
      }

      return { success: true }
    } catch (error) {
      console.error('Erro ao atualizar status do usuário:', error)
      return { success: false, error: error.message }
    }
  }

  return {
    sendVerificationEmail,
    verifyEmailToken,
    checkEmailVerification,
    updateUserStatusAfterVerification
  }
}