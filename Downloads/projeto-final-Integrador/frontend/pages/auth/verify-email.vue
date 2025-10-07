<template>
  <div class="verify-email-page">
    <div class="verify-container">
      <div class="verify-card">
        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner">
            <div class="spinner"></div>
          </div>
          <h2>Verificando seu email...</h2>
          <p>Aguarde enquanto confirmamos sua conta.</p>
        </div>

        <!-- Success State -->
        <div v-else-if="verificationStatus === 'success'" class="success-state">
          <div class="success-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L18 8l-8 8z"/>
            </svg>
          </div>
          <h2>Email verificado com sucesso!</h2>
          <p>Sua conta foi confirmada. Você será redirecionado em alguns segundos.</p>
          <button @click="redirectToDashboard" class="continue-btn">
            Continuar para o Dashboard
          </button>
        </div>

        <!-- Error State -->
        <div v-else-if="verificationStatus === 'error'" class="error-state">
          <div class="error-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          </div>
          <h2>Erro na verificação</h2>
          <p>{{ errorMessage }}</p>
          <div class="error-actions">
            <button @click="resendEmail" class="resend-btn" :disabled="resendLoading">
              {{ resendLoading ? 'Enviando...' : 'Reenviar email' }}
            </button>
            <NuxtLink to="/entrar" class="login-link">
              Ir para login
            </NuxtLink>
          </div>
        </div>

        <!-- Pending State (no token) -->
        <div v-else class="pending-state">
          <div class="email-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </div>
          <h2>Verifique seu email</h2>
          <p>Enviamos um link de verificação para <strong>{{ userEmail }}</strong></p>
          <p>Clique no link do email para confirmar sua conta.</p>
          
          <div class="pending-actions">
            <button @click="resendEmail" class="resend-btn" :disabled="resendLoading">
              {{ resendLoading ? 'Enviando...' : 'Reenviar email' }}
            </button>
            <button @click="checkVerification" class="check-btn">
              Já verifiquei
            </button>
          </div>
          
          <div class="help-text">
            <p>Não recebeu o email?</p>
            <ul>
              <li>Verifique sua caixa de spam</li>
              <li>Aguarde alguns minutos</li>
              <li>Verifique se o email está correto</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'auth'
})

useHead({
  title: 'Verificar Email - Servifflix',
  meta: [
    { name: 'description', content: 'Verifique seu email para ativar sua conta' }
  ]
})

const supabase = useSupabaseClient()
const route = useRoute()
const router = useRouter()

// Estados
const loading = ref(true)
const verificationStatus = ref('pending')
const errorMessage = ref('')
const userEmail = ref('')
const resendLoading = ref(false)

// Verificar token na URL
onMounted(async () => {
  const token = route.query.token
  const type = route.query.type || 'signup'
  
  // Se há token na URL, verificar automaticamente
  if (token) {
    // Se for token simulado, processar diferente
    if (token === 'simulated_token') {
      await verifySimulatedToken()
    } else {
      await verifyToken(token, type)
    }
  } else {
    // Se não há token, mostrar tela de aguardo
    await loadUserEmail()
    loading.value = false
  }
})

// Carregar email do usuário atual
const loadUserEmail = async () => {
  try {
    // Primeiro tenta pegar da URL
    const emailFromUrl = route.query.email
    if (emailFromUrl) {
      userEmail.value = emailFromUrl
      return
    }

    // Se não tem na URL, tenta pegar do usuário logado
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      userEmail.value = user.email
    }
  } catch (error) {
    console.error('Erro ao carregar email do usuário:', error)
  }
}

// Verificar token simulado
const verifySimulatedToken = async () => {
  try {
    loading.value = true
    
    const { simulateTokenVerification } = useEmailSimulation()
    const result = simulateTokenVerification(route.query.token)
    
    if (result.success) {
      // Simular confirmação do email no Supabase
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Atualizar status do usuário no banco
        await updateUserStatus(user.id)
        
        // Marcar email como confirmado (simulação)
        console.log('✅ Email confirmado com sucesso (simulado)')
        
        verificationStatus.value = 'success'
        
        // Redirecionar após 3 segundos
        setTimeout(() => {
          redirectToDashboard()
        }, 3000)
      } else {
        throw new Error('Usuário não encontrado')
      }
    } else {
      throw new Error('Token inválido')
    }

  } catch (error) {
    console.error('Erro na verificação simulada:', error)
    verificationStatus.value = 'error'
    errorMessage.value = getErrorMessage(error.message)
  } finally {
    loading.value = false
  }
}

// Verificar token de email real
const verifyToken = async (token, type) => {
  try {
    loading.value = true
    
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: type
    })

    if (error) {
      throw error
    }

    // Atualizar status do usuário no banco
    if (data.user) {
      await updateUserStatus(data.user.id)
      verificationStatus.value = 'success'
      
      // Redirecionar após 3 segundos
      setTimeout(() => {
        redirectToDashboard()
      }, 3000)
    }

  } catch (error) {
    console.error('Erro na verificação:', error)
    verificationStatus.value = 'error'
    errorMessage.value = getErrorMessage(error.message)
  } finally {
    loading.value = false
  }
}

// Atualizar status do usuário após verificação
const updateUserStatus = async (userId) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        status: 'active',
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (error) {
      console.error('Erro ao atualizar status:', error)
    }
  } catch (error) {
    console.error('Erro ao atualizar status do usuário:', error)
  }
}

// Reenviar email de verificação
const resendEmail = async () => {
  try {
    resendLoading.value = true
    
    if (!userEmail.value) {
      await loadUserEmail()
    }

    // Simular reenvio de email
    const { simulateVerificationEmail } = useEmailSimulation()
    const userType = route.query.type || 'cliente'
    simulateVerificationEmail(userEmail.value, userType)

    alert('Email de verificação reenviado com sucesso! Verifique o console.')
    
  } catch (error) {
    console.error('Erro ao reenviar email:', error)
    alert('Erro ao reenviar email. Tente novamente.')
  } finally {
    resendLoading.value = false
  }
}

// Verificar se email já foi confirmado (simulação)
const checkVerification = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
      throw error
    }

    if (user) {
      // Na simulação, sempre considerar como verificado se o usuário clicar
      await updateUserStatus(user.id)
      verificationStatus.value = 'success'
      console.log('✅ Email marcado como verificado (simulação)')
      setTimeout(() => {
        redirectToDashboard()
      }, 1000)
    } else {
      alert('Usuário não encontrado.')
    }
  } catch (error) {
    console.error('Erro ao verificar status:', error)
    alert('Erro ao verificar status. Tente novamente.')
  }
}

// Redirecionar para dashboard
const redirectToDashboard = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      // Buscar tipo de usuário
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', user.id)
        .single()

      if (profile?.user_type === 'profissional') {
        await navigateTo('/dashboard?welcome=professional&verified=true')
      } else {
        await navigateTo('/dashboard?welcome=client&verified=true')
      }
    } else {
      await navigateTo('/entrar')
    }
  } catch (error) {
    console.error('Erro ao redirecionar:', error)
    await navigateTo('/dashboard')
  }
}

// Traduzir mensagens de erro
const getErrorMessage = (error) => {
  const errorMessages = {
    'Invalid token': 'Token inválido ou expirado',
    'Token expired': 'Token expirado. Solicite um novo email de verificação',
    'User not found': 'Usuário não encontrado',
    'Email already confirmed': 'Email já foi confirmado anteriormente'
  }
  
  return errorMessages[error] || 'Erro na verificação do email'
}
</script>

<style scoped>
.verify-email-page {
  min-height: calc(100vh - 70px);
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.verify-container {
  width: 100%;
  max-width: 480px;
}

.verify-card {
  background: white;
  border-radius: 12px;
  padding: 40px 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
}

/* Loading State */
.loading-state {
  padding: 20px 0;
}

.loading-spinner {
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Success State */
.success-state {
  padding: 20px 0;
}

.success-icon {
  width: 80px;
  height: 80px;
  background: #10b981;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  color: white;
}

.success-icon svg {
  width: 40px;
  height: 40px;
}

/* Error State */
.error-state {
  padding: 20px 0;
}

.error-icon {
  width: 80px;
  height: 80px;
  background: #ef4444;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  color: white;
}

.error-icon svg {
  width: 40px;
  height: 40px;
}

.error-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
}

/* Pending State */
.pending-state {
  padding: 20px 0;
}

.email-icon {
  width: 80px;
  height: 80px;
  background: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  color: white;
}

.email-icon svg {
  width: 40px;
  height: 40px;
}

.pending-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 24px 0;
}

.help-text {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
  text-align: left;
}

.help-text p {
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.help-text ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.help-text li {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 4px;
  padding-left: 16px;
  position: relative;
}

.help-text li::before {
  content: '•';
  color: #3b82f6;
  position: absolute;
  left: 0;
}

/* Typography */
h2 {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 12px 0;
}

p {
  color: #6b7280;
  font-size: 16px;
  line-height: 1.5;
  margin: 0 0 12px 0;
}

/* Buttons */
.continue-btn, .resend-btn, .check-btn {
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.continue-btn {
  background: #10b981;
  color: white;
}

.continue-btn:hover {
  background: #059669;
}

.resend-btn {
  background: #3b82f6;
  color: white;
}

.resend-btn:hover:not(:disabled) {
  background: #2563eb;
}

.resend-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.check-btn {
  background: white;
  color: #3b82f6;
  border: 2px solid #3b82f6;
}

.check-btn:hover {
  background: #3b82f6;
  color: white;
}

.login-link {
  display: inline-block;
  width: 100%;
  padding: 12px 16px;
  background: white;
  color: #6b7280;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.login-link:hover {
  border-color: #d1d5db;
  background: #f9fafb;
}

/* Responsive */
@media (max-width: 768px) {
  .verify-card {
    padding: 30px 20px;
  }
  
  h2 {
    font-size: 20px;
  }
  
  .success-icon, .error-icon, .email-icon {
    width: 60px;
    height: 60px;
  }
  
  .success-icon svg, .error-icon svg, .email-icon svg {
    width: 30px;
    height: 30px;
  }
}
</style>