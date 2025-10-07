<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <!-- Logo -->
        <div class="logo-section">
          <h1 class="logo-title">Servifflix</h1>
          <div class="logo-underline"></div>
        </div>

        <!-- Header -->
        <div class="header-section">
          <h2 class="main-title">Entre na sua conta</h2>
          <p class="main-subtitle">Acesse sua conta para continuar</p>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="login-form">
          <!-- Email -->
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

          <!-- Password -->
          <div class="form-group">
            <label for="password" class="form-label">Senha</label>
            <div class="password-input-container">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                placeholder="Digite sua senha"
                required
              >
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="password-toggle"
              >
                <svg v-if="showPassword" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="submit-btn"
            :disabled="loading || !form.email || !form.password"
          >
            {{ loading ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>

        <!-- Links -->
        <div class="links-section">
          <NuxtLink to="/cadastrar" class="signup-link">
            Não tem conta? Cadastre-se
          </NuxtLink>
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
  title: 'Login - Servifflix',
  meta: [
    { name: 'description', content: 'Entre na sua conta do Servifflix' }
  ]
})

// Estados
const loading = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')

// Dados do formulário
const form = reactive({
  email: '',
  password: ''
})

// Methods
const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''
  
  try {
    const { login } = useAuth()
    
    const result = await login(form.email, form.password)
    
    if (!result.success) {
      errorMessage.value = result.error
      return
    }

    // Verificar se email foi confirmado
    if (!result.user.email_confirmed_at) {
      await navigateTo('/auth/verify-email')
      return
    }

    // Redirecionar para dashboard
    await navigateTo('/dashboard')
    
  } catch (error) {
    console.error('Erro no login:', error)
    errorMessage.value = 'Erro inesperado. Tente novamente.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: calc(100vh - 70px);
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 420px;
}

.login-card {
  background: white;
  border-radius: 12px;
  padding: 40px 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* Logo */
.logo-section {
  text-align: center;
  margin-bottom: 32px;
}

.logo-title {
  font-size: 32px;
  font-weight: 800;
  color: #1e40af;
  margin: 0;
}

.logo-underline {
  width: 60px;
  height: 4px;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  margin: 8px auto 0;
  border-radius: 2px;
}

/* Header */
.header-section {
  text-align: center;
  margin-bottom: 32px;
}

.main-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.main-subtitle {
  color: #6b7280;
  font-size: 16px;
  margin: 0;
}

/* Form */
.login-form {
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.password-input-container {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
}

.password-toggle svg {
  width: 20px;
  height: 20px;
}

.error-message {
  color: #ef4444;
  font-size: 14px;
  margin-bottom: 16px;
  padding: 12px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
}

.submit-btn {
  width: 100%;
  padding: 14px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-btn:hover:not(:disabled) {
  background: #2563eb;
}

.submit-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

/* Links */
.links-section {
  text-align: center;
}

.signup-link {
  color: #3b82f6;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
}

.signup-link:hover {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 768px) {
  .login-card {
    padding: 30px 20px;
  }
  
  .main-title {
    font-size: 20px;
  }
  
  .logo-title {
    font-size: 28px;
  }
}
</style>