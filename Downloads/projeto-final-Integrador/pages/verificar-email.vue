<template>
  <div class="verification-page">
    <div class="verification-container">
      <div class="verification-content">
        <div class="verification-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </div>

        <h1 class="verification-title">Verifique seu Email</h1>

        <p class="verification-description">
          Enviamos um email de verificação para <strong>{{ user?.email }}</strong>
        </p>

        <p class="verification-instructions">
          Clique no link do email para ativar sua conta. Após a verificação, você poderá acessar todos os recursos da plataforma.
        </p>

        <!-- Mensagens -->
        <div v-if="errorMessage" class="alert alert-error">
          {{ errorMessage }}
        </div>

        <div v-if="successMessage" class="alert alert-success">
          {{ successMessage }}
        </div>

        <div class="verification-actions">
          <button
            @click="handleResendEmail"
            class="btn-primary"
            :disabled="loading || cooldown > 0"
          >
            <span v-if="loading">Enviando...</span>
            <span v-else-if="cooldown > 0">Reenviar em {{ cooldown }}s</span>
            <span v-else>Reenviar Email</span>
          </button>

          <button @click="checkVerification" class="btn-secondary">
            Já Verifiquei
          </button>

          <button @click="handleLogout" class="btn-text">
            Sair da Conta
          </button>
        </div>

        <div class="help-section">
          <h3>Não recebeu o email?</h3>
          <ul>
            <li>Verifique sua caixa de spam ou lixo eletrônico</li>
            <li>Certifique-se de que o email está correto</li>
            <li>Aguarde alguns minutos, pode haver atraso na entrega</li>
            <li>Tente reenviar o email usando o botão acima</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { user, resendVerificationEmail, signOut, loading } = useFirebaseAuth()

const errorMessage = ref('')
const successMessage = ref('')
const cooldown = ref(0)
let cooldownInterval = null

definePageMeta({
  layout: false,
  middleware: 'auth'
})

const clearMessages = () => {
  errorMessage.value = ''
  successMessage.value = ''
}

const startCooldown = () => {
  cooldown.value = 60
  cooldownInterval = setInterval(() => {
    cooldown.value--
    if (cooldown.value <= 0) {
      clearInterval(cooldownInterval)
    }
  }, 1000)
}

const handleResendEmail = async () => {
  clearMessages()

  const result = await resendVerificationEmail()

  if (result.success) {
    successMessage.value = result.message
    startCooldown()
  } else {
    errorMessage.value = result.error
  }
}

const checkVerification = async () => {
  clearMessages()

  try {
    // Recarregar o usuário para verificar o status
    await user.value?.reload()

    if (user.value?.emailVerified) {
      successMessage.value = 'Email verificado com sucesso!'
      setTimeout(() => {
        navigateTo('/')
      }, 1500)
    } else {
      errorMessage.value = 'Email ainda não foi verificado. Verifique sua caixa de entrada.'
    }
  } catch (error) {
    errorMessage.value = 'Erro ao verificar status. Tente novamente.'
  }
}

const handleLogout = async () => {
  await signOut()
}

// Verificar automaticamente a cada 5 segundos
let autoCheckInterval = null

onMounted(() => {
  autoCheckInterval = setInterval(async () => {
    if (user.value) {
      await user.value.reload()
      if (user.value.emailVerified) {
        clearInterval(autoCheckInterval)
        navigateTo('/')
      }
    }
  }, 5000)
})

onUnmounted(() => {
  if (cooldownInterval) {
    clearInterval(cooldownInterval)
  }
  if (autoCheckInterval) {
    clearInterval(autoCheckInterval)
  }
})
</script>

<style scoped>
.verification-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--cor-gelo) 0%, var(--cor-branco) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.verification-container {
  background: var(--cor-branco);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  max-width: 500px;
  width: 100%;
  text-align: center;
}

.verification-icon {
  color: var(--cor-azul-principal);
  margin-bottom: 2rem;
}

.verification-title {
  font-family: var(--bold);
  font-size: var(--f5);
  color: var(--cor-preto);
  margin-bottom: 1rem;
}

.verification-description {
  font-family: var(--regular);
  font-size: var(--f2);
  color: var(--cor-cinza-escuro);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.verification-instructions {
  font-family: var(--regular);
  font-size: var(--f1);
  color: var(--cor-cinza);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.alert {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-family: var(--regular);
  font-size: var(--f2);
}

.alert-error {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.alert-success {
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}

.verification-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.btn-primary {
  background: var(--cor-azul-principal);
  color: var(--cor-branco);
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-family: var(--regular);
  font-size: var(--f2);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover:not(:disabled) {
  background: var(--cor-azul-royal);
  transform: translateY(-2px);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: transparent;
  color: var(--cor-azul-principal);
  border: 2px solid var(--cor-azul-principal);
  padding: 1rem 2rem;
  border-radius: 8px;
  font-family: var(--regular);
  font-size: var(--f2);
  cursor: pointer;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background: var(--cor-azul-principal);
  color: var(--cor-branco);
}

.btn-text {
  background: none;
  color: var(--cor-cinza);
  border: none;
  padding: 0.5rem;
  font-family: var(--regular);
  font-size: var(--f1);
  cursor: pointer;
  text-decoration: underline;
}

.btn-text:hover {
  color: var(--cor-cinza-escuro);
}

.help-section {
  text-align: left;
  background: var(--cor-gelo);
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid var(--cor-azul-principal);
}

.help-section h3 {
  font-family: var(--bold);
  font-size: var(--f2);
  color: var(--cor-preto);
  margin: 0 0 1rem 0;
}

.help-section ul {
  margin: 0;
  padding-left: 1.5rem;
}

.help-section li {
  font-family: var(--regular);
  font-size: var(--f1);
  color: var(--cor-cinza-escuro);
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

@media screen and (max-width: 768px) {
  .verification-page {
    padding: 1rem;
  }

  .verification-container {
    padding: 2rem;
  }

  .verification-actions {
    gap: 0.75rem;
  }
}
</style>
