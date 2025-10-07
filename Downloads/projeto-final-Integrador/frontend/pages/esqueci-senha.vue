<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <!-- Header -->
        <div class="auth-header">
          <NuxtLink to="/" class="auth-logo">
            <img src="/logo.svg" alt="ServiFlix" class="logo">
            <span class="brand-name">ServiFlix</span>
          </NuxtLink>
          <h1 class="auth-title">Esqueci minha senha</h1>
          <p class="auth-subtitle">Digite seu e-mail para receber instruções de recuperação</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleResetPassword" class="auth-form">
          <div class="form-group">
            <label for="email" class="form-label">E-mail</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="form-input"
              placeholder="seu@email.com"
              required
            >
          </div>

          <button type="submit" class="btn-submit" :disabled="loading">
            <span v-if="!loading">Enviar instruções</span>
            <div v-else class="loading-spinner">
              <div class="spinner"></div>
              <span>Enviando...</span>
            </div>
          </button>

          <div v-if="success" class="success-message">
            {{ success }}
          </div>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>
        </form>

        <!-- Footer -->
        <div class="auth-footer">
          <p>
            Lembrou da senha? 
            <NuxtLink to="/entrar" class="auth-link">Fazer login</NuxtLink>
          </p>
          <p>
            Não tem uma conta? 
            <NuxtLink to="/cadastrar" class="auth-link">Cadastre-se</NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Meta tags
useHead({
  title: 'Esqueci minha senha - ServiFlix',
  meta: [
    { name: 'description', content: 'Recupere sua senha do ServiFlix' }
  ]
})

// Estado do formulário
const form = reactive({
  email: ''
})

const loading = ref(false)
const error = ref('')
const success = ref('')

// Função de recuperação de senha
const handleResetPassword = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  
  try {
    // Validação básica
    if (!form.email) {
      error.value = 'Por favor, digite seu e-mail'
      return
    }
    
    // Simular envio de e-mail (substituir por API real)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    success.value = 'Instruções de recuperação enviadas para seu e-mail!'
    
    // Limpar formulário
    form.email = ''
    
  } catch (err) {
    error.value = 'Erro ao enviar instruções. Tente novamente.'
    console.error('Erro na recuperação:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: linear-gradient(135deg, 
    var(--primary-50) 0%, 
    var(--bg-primary) 30%, 
    var(--primary-50) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-xl);
  position: relative;
}

.auth-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.auth-container {
  width: 100%;
  max-width: 440px;
  position: relative;
  z-index: 1;
}

.auth-card {
  background: var(--bg-primary);
  border-radius: var(--radius-2xl);
  padding: var(--space-3xl);
  box-shadow: var(--shadow-2xl);
  border: 1px solid var(--border-primary);
  backdrop-filter: blur(20px);
}

.auth-header {
  text-align: center;
  margin-bottom: var(--space-3xl);
}

.auth-logo {
  display: inline-flex;
  align-items: center;
  gap: var(--space-md);
  text-decoration: none;
  margin-bottom: var(--space-xl);
}

.auth-logo .logo {
  width: 40px;
  height: 40px;
}

.auth-logo .brand-name {
  font-size: 24px;
  font-weight: 800;
  color: var(--color-primary);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.auth-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
  letter-spacing: -0.02em;
}

.auth-subtitle {
  color: var(--text-secondary);
  font-size: 16px;
  line-height: 1.6;
}

.auth-form {
  margin-bottom: var(--space-2xl);
}

.form-group {
  margin-bottom: var(--space-xl);
}

.form-label {
  display: block;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
  font-size: 14px;
}

.form-input {
  width: 100%;
  padding: var(--space-lg);
  border: 2px solid var(--border-primary);
  border-radius: var(--radius-lg);
  font-size: 16px;
  color: var(--text-primary);
  background: var(--bg-primary);
  transition: all var(--transition-base);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input::placeholder {
  color: var(--text-tertiary);
}

.btn-submit {
  width: 100%;
  background: var(--gradient-primary);
  color: var(--text-inverse);
  border: none;
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
  min-height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-lg);
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-primary-lg);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.success-message {
  background: var(--success-500);
  color: white;
  padding: var(--space-md);
  border-radius: var(--radius-md);
  text-align: center;
  font-size: 14px;
  margin-bottom: var(--space-lg);
}

.error-message {
  background: var(--error-500);
  color: white;
  padding: var(--space-md);
  border-radius: var(--radius-md);
  text-align: center;
  font-size: 14px;
  margin-bottom: var(--space-lg);
}

.auth-footer {
  text-align: center;
}

.auth-footer p {
  color: var(--text-secondary);
  font-size: 14px;
  margin-bottom: var(--space-sm);
}

.auth-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 600;
  transition: all var(--transition-base);
}

.auth-link:hover {
  color: var(--color-primary-hover);
  text-decoration: underline;
}

/* Responsividade */
@media (max-width: 480px) {
  .auth-page {
    padding: var(--space-md);
  }
  
  .auth-card {
    padding: var(--space-2xl);
  }
  
  .auth-title {
    font-size: 24px;
  }
}
</style>