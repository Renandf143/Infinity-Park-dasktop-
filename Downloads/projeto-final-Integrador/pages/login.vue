<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-form-section">
        <div class="login-form">
          <h1 class="login-title">{{ showForgotPassword ? 'Recuperar Senha' : 'Entrar' }}</h1>

          <!-- Mensagens de Erro e Sucesso -->
          <div v-if="errorMessage" class="alert alert-error">
            {{ errorMessage }}
          </div>

          <div v-if="successMessage" class="alert alert-success">
            {{ successMessage }}
          </div>

          <!-- Formulário de Login -->
          <form v-if="!showForgotPassword" @submit.prevent="handleLogin">
            <div class="form-group">
              <label for="email">Endereço de Email</label>
              <input
                type="email"
                id="email"
                v-model="email"
                placeholder="Digite seu email"
                class="form-input"
                required
              >
            </div>

            <div class="form-group">
              <label for="password">Senha</label>
              <div class="password-input-wrapper">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  v-model="password"
                  placeholder="Digite sua senha"
                  class="form-input"
                  required
                >
                <button
                  type="button"
                  @click="togglePassword"
                  class="password-toggle"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2" fill="none"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/>
                  </svg>
                </button>
              </div>
              <p class="password-hint">Deve conter no mínimo 8 caracteres, incluindo letras, números e símbolos</p>
            </div>

            <div class="form-options">
              <label class="checkbox-wrapper">
                <input type="checkbox" v-model="rememberMe">
                <span class="checkmark"></span>
                Lembrar de mim
              </label>
              <button type="button" @click="toggleForgotPassword" class="forgot-password">
                Esqueceu a senha?
              </button>
            </div>

            <button type="submit" class="btn-primary-large login-btn" :disabled="loading">
              <span v-if="!loading">Entrar</span>
              <span v-else>Entrando...</span>
            </button>

            <div class="social-login">
              <button
                type="button"
                @click="handleGoogleLogin"
                class="btn-secondary-large google-btn"
                :disabled="loading"
              >
                <svg class="social-icon" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Entrar com Google
              </button>
            </div>

            <!-- Botão para reenviar verificação -->
            <div v-if="showResendVerification" class="verification-section">
              <p class="verification-text">
                Não recebeu o email de verificação?
              </p>
              <button
                type="button"
                @click="handleResendVerification"
                class="btn-resend"
                :disabled="loading"
              >
                Reenviar Email
              </button>
            </div>

            <p class="signup-link">
              Ainda não tem conta? <NuxtLink to="/cadastro">Cadastre-se</NuxtLink>
            </p>
          </form>

          <!-- Formulário de Recuperação de Senha -->
          <form v-else @submit.prevent="handleForgotPassword">
            <div class="form-group">
              <label for="resetEmail">Email para Recuperação</label>
              <input
                type="email"
                id="resetEmail"
                v-model="resetEmail"
                placeholder="Digite seu email"
                class="form-input"
                required
              >
            </div>

            <button type="submit" class="btn-primary-large" :disabled="loading">
              <span v-if="!loading">Enviar Email de Recuperação</span>
              <span v-else>Enviando...</span>
            </button>

            <button
              type="button"
              @click="toggleForgotPassword"
              class="btn-back"
            >
              ← Voltar ao Login
            </button>
          </form>
        </div>
      </div>

      <div class="login-visual">
        <div class="visual-content">
          <img src="/assets/images/imagem-fundo-login.png" alt="Serviflix - Plataforma de Serviços" class="login-bg-image">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const {
  signInWithEmail,
  signInWithGoogle,
  resetPassword,
  resendVerificationEmail,
  loading
} = useFirebaseAuth()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const showForgotPassword = ref(false)
const resetEmail = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const showResendVerification = ref(false)

definePageMeta({
  layout: false
})

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const clearMessages = () => {
  errorMessage.value = ''
  successMessage.value = ''
  showResendVerification.value = false
}

const handleLogin = async () => {
  clearMessages()

  if (!email.value || !password.value) {
    errorMessage.value = 'Por favor, preencha todos os campos'
    return
  }

  const result = await signInWithEmail(email.value, password.value)

  if (result.success) {
    successMessage.value = 'Login realizado com sucesso!'
    setTimeout(() => {
      navigateTo('/')
    }, 1000)
  } else {
    errorMessage.value = result.error

    // Mostrar opção de reenviar verificação se necessário
    if (result.needsVerification) {
      showResendVerification.value = true
    }
  }
}

const handleGoogleLogin = async () => {
  clearMessages()

  const result = await signInWithGoogle()

  if (result.success) {
    successMessage.value = 'Login realizado com sucesso!'
    setTimeout(() => {
      navigateTo('/')
    }, 1000)
  } else {
    errorMessage.value = result.error
  }
}

const handleForgotPassword = async () => {
  clearMessages()

  if (!resetEmail.value) {
    errorMessage.value = 'Por favor, digite seu email'
    return
  }

  const result = await resetPassword(resetEmail.value)

  if (result.success) {
    successMessage.value = result.message
    showForgotPassword.value = false
    resetEmail.value = ''
  } else {
    errorMessage.value = result.error
  }
}

const handleResendVerification = async () => {
  clearMessages()

  const result = await resendVerificationEmail()

  if (result.success) {
    successMessage.value = result.message
    showResendVerification.value = false
  } else {
    errorMessage.value = result.error
  }
}

const toggleForgotPassword = () => {
  showForgotPassword.value = !showForgotPassword.value
  clearMessages()
  resetEmail.value = email.value
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr;
  background: linear-gradient(135deg, var(--cor-gelo) 0%, var(--cor-branco) 100%);
}

.login-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
}

.login-form-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: var(--cor-branco);
}

.login-form {
  width: 100%;
  max-width: 400px;
}

.login-title {
  font-family: var(--bold);
  font-size: var(--f6);
  color: var(--cor-preto);
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-family: var(--regular);
  font-size: var(--f1);
  font-weight: 500;
  color: var(--cor-cinza-escuro);
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--cor-cinza-3);
  border-radius: 8px;
  font-family: var(--regular);
  font-size: var(--f2);
  color: var(--cor-preto);
  background: var(--cor-branco);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input::placeholder {
  color: var(--cor-cinza);
}

.form-input:focus {
  outline: none;
  border-color: var(--cor-azul-principal);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.password-input-wrapper {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--cor-cinza);
  cursor: pointer;
  padding: 0.25rem;
}

.password-hint {
  font-family: var(--regular);
  font-size: var(--f0);
  color: var(--cor-cinza);
  margin-top: 0.25rem;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  font-family: var(--regular);
  font-size: var(--f1);
  color: var(--cor-cinza-escuro);
  cursor: pointer;
}

.checkbox-wrapper input {
  margin-right: 0.5rem;
}

.forgot-password {
  font-family: var(--regular);
  font-size: var(--f1);
  color: var(--cor-azul-principal);
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: none;
  padding: 0;
}

.forgot-password:hover {
  text-decoration: underline;
}

.btn-primary-large {
  width: 100%;
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
  margin-bottom: 1.5rem;
}

.btn-primary-large:hover:not(:disabled) {
  background: var(--cor-azul-royal);
  transform: translateY(-2px);
}

.btn-primary-large:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary-large {
  width: 100%;
  background: transparent;
  color: var(--cor-cinza-escuro);
  border: 2px solid var(--cor-cinza-2);
  padding: 1rem 2rem;
  border-radius: 8px;
  font-family: var(--regular);
  font-size: var(--f2);
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.btn-secondary-large:hover:not(:disabled) {
  background: var(--cor-gelo);
  border-color: var(--cor-azul-principal);
}

.btn-secondary-large:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.social-icon {
  width: 20px;
  height: 20px;
}

.signup-link {
  text-align: center;
  font-family: var(--regular);
  font-size: var(--f1);
  color: var(--cor-cinza);
}

.signup-link a {
  color: var(--cor-azul-principal);
  text-decoration: none;
}

.signup-link a:hover {
  text-decoration: underline;
}

.login-visual {
  background: var(--cor-gelo);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.visual-content {
  width: 100%;
  max-width: 500px;
  text-align: center;
}

.login-bg-image {
  width: 100%;
  height: auto;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(37, 99, 235, 0.15);
}

/* Alertas */
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

/* Seção de Verificação */
.verification-section {
  text-align: center;
  margin: 1rem 0;
  padding: 1rem;
  background: #fef3c7;
  border: 1px solid #fbbf24;
  border-radius: 8px;
}

.verification-text {
  font-family: var(--regular);
  font-size: var(--f1);
  color: #92400e;
  margin: 0 0 0.75rem 0;
}

.btn-resend {
  background: #f59e0b;
  color: var(--cor-branco);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-family: var(--regular);
  font-size: var(--f1);
  cursor: pointer;
  transition: all 0.3s;
}

.btn-resend:hover:not(:disabled) {
  background: #d97706;
}

.btn-resend:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Botão Voltar */
.btn-back {
  width: 100%;
  background: transparent;
  color: var(--cor-cinza-escuro);
  border: 1px solid var(--cor-cinza-2);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-family: var(--regular);
  font-size: var(--f2);
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 1rem;
}

.btn-back:hover {
  background: var(--cor-gelo);
  border-color: var(--cor-azul-principal);
}

/* Responsivo */
@media screen and (max-width: 768px) {
  .login-container {
    grid-template-columns: 1fr;
  }

  .login-visual {
    display: none;
  }

  .login-form-section {
    padding: 1rem;
  }
}
</style>
