<template>
  <div class="cadastro-page">
    <div class="cadastro-container">
      <div class="cadastro-content">
        <div class="cadastro-header">
          <h1 class="cadastro-title">Cadastro de Profissional</h1>
          <p class="cadastro-subtitle">Crie sua conta para oferecer serviços</p>
        </div>

        <!-- Mensagens -->
        <div v-if="errorMessage" class="alert alert-error">
          {{ errorMessage }}
        </div>

        <div v-if="successMessage" class="alert alert-success">
          {{ successMessage }}
        </div>

        <form @submit.prevent="handleSignUp" class="cadastro-form">
          <div class="form-row">
            <div class="form-group">
              <label for="name">Nome Completo</label>
              <input
                type="text"
                id="name"
                v-model="formData.name"
                placeholder="Digite seu nome completo"
                class="form-input"
                required
              >
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input
                type="email"
                id="email"
                v-model="formData.email"
                placeholder="Digite seu email"
                class="form-input"
                required
              >
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="phone">Telefone</label>
              <input
                type="tel"
                id="phone"
                v-model="formData.phone"
                placeholder="(11) 99999-9999"
                class="form-input"
                required
              >
            </div>

            <div class="form-group">
              <label for="cpf">CPF</label>
              <input
                type="text"
                id="cpf"
                v-model="formData.cpf"
                placeholder="000.000.000-00"
                class="form-input"
                required
              >
            </div>
          </div>

          <div class="form-group">
            <label for="profession">Profissão Principal</label>
            <select
              id="profession"
              v-model="formData.profession"
              class="form-input"
              required
            >
              <option value="">Selecione sua profissão</option>
              <option value="eletricista">Eletricista</option>
              <option value="encanador">Encanador</option>
              <option value="pintor">Pintor</option>
              <option value="marceneiro">Marceneiro</option>
              <option value="pedreiro">Pedreiro</option>
              <option value="jardineiro">Jardineiro</option>
              <option value="diarista">Diarista</option>
              <option value="tecnico-informatica">Técnico em Informática</option>
              <option value="mecanico">Mecânico</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          <div v-if="formData.profession === 'outro'" class="form-group">
            <label for="customProfession">Especifique sua profissão</label>
            <input
              type="text"
              id="customProfession"
              v-model="formData.customProfession"
              placeholder="Digite sua profissão"
              class="form-input"
              required
            >
          </div>

          <div class="form-group">
            <label for="experience">Experiência</label>
            <select
              id="experience"
              v-model="formData.experience"
              class="form-input"
              required
            >
              <option value="">Selecione sua experiência</option>
              <option value="iniciante">Iniciante (até 1 ano)</option>
              <option value="intermediario">Intermediário (1-3 anos)</option>
              <option value="avancado">Avançado (3-5 anos)</option>
              <option value="especialista">Especialista (5+ anos)</option>
            </select>
          </div>

          <div class="form-group">
            <label for="description">Descrição dos Serviços</label>
            <textarea
              id="description"
              v-model="formData.description"
              placeholder="Descreva brevemente os serviços que você oferece..."
              class="form-textarea"
              rows="4"
              required
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="password">Senha</label>
              <div class="password-input-wrapper">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  v-model="formData.password"
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
            </div>

            <div class="form-group">
              <label for="confirmPassword">Confirmar Senha</label>
              <input
                type="password"
                id="confirmPassword"
                v-model="formData.confirmPassword"
                placeholder="Confirme sua senha"
                class="form-input"
                required
              >
            </div>
          </div>

          <p class="password-hint">Mínimo 8 caracteres, incluindo maiúscula, minúscula e número</p>

          <div class="form-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" v-model="formData.acceptTerms" required>
              <span class="checkmark"></span>
              Aceito os <a href="/termos" target="_blank">Termos de Uso</a> e
              <a href="/privacidade" target="_blank">Política de Privacidade</a>
            </label>
          </div>

          <button type="submit" class="btn-primary-large" :disabled="loading">
            <span v-if="!loading">Criar Conta Profissional</span>
            <span v-else>Criando Conta...</span>
          </button>

          <div class="divider">
            <span>ou</span>
          </div>

          <button
            type="button"
            @click="handleGoogleSignUp"
            class="btn-secondary-large google-btn"
            :disabled="loading"
          >
            <svg class="social-icon" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Cadastrar com Google
          </button>

          <p class="login-link">
            Já tem uma conta? <NuxtLink to="/login">Faça login</NuxtLink>
          </p>
        </form>
      </div>

      <div class="cadastro-visual">
        <div class="visual-content">
          <img src="/assets/images/imagem-fundo-cadastro.png" alt="Serviflix - Cadastro Profissional" class="visual-image">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { signUpWithEmail, signInWithGoogle, loading } = useFirebaseAuth()

const showPassword = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const formData = reactive({
  name: '',
  email: '',
  phone: '',
  cpf: '',
  profession: '',
  customProfession: '',
  experience: '',
  description: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

definePageMeta({
  layout: false
})

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const clearMessages = () => {
  errorMessage.value = ''
  successMessage.value = ''
}

const validateForm = () => {
  const requiredFields = ['name', 'email', 'phone', 'cpf', 'profession', 'experience', 'description']

  for (const field of requiredFields) {
    if (!formData[field]?.trim()) {
      throw new Error(`${getFieldLabel(field)} é obrigatório`)
    }
  }

  if (formData.profession === 'outro' && !formData.customProfession?.trim()) {
    throw new Error('Especifique sua profissão')
  }

  if (formData.password !== formData.confirmPassword) {
    throw new Error('As senhas não coincidem')
  }

  if (!formData.acceptTerms) {
    throw new Error('Você deve aceitar os termos de uso')
  }
}

const getFieldLabel = (field) => {
  const labels = {
    name: 'Nome',
    email: 'Email',
    phone: 'Telefone',
    cpf: 'CPF',
    profession: 'Profissão',
    experience: 'Experiência',
    description: 'Descrição dos serviços'
  }
  return labels[field] || field
}

const handleSignUp = async () => {
  clearMessages()

  try {
    validateForm()

    const result = await signUpWithEmail(
      formData.email,
      formData.password,
      formData.name
    )

    if (result.success) {
      successMessage.value = result.message + ' Seu perfil profissional será analisado em breve.'

      // Limpar formulário
      Object.keys(formData).forEach(key => {
        if (typeof formData[key] === 'string') {
          formData[key] = ''
        } else if (typeof formData[key] === 'boolean') {
          formData[key] = false
        }
      })

      // Redirecionar após 3 segundos
      setTimeout(() => {
        navigateTo('/login?message=professional-account-created')
      }, 3000)
    } else {
      errorMessage.value = result.error
    }
  } catch (error) {
    errorMessage.value = error.message
  }
}

const handleGoogleSignUp = async () => {
  clearMessages()

  const result = await signInWithGoogle()

  if (result.success) {
    successMessage.value = 'Conta criada com sucesso!'
    setTimeout(() => {
      navigateTo('/profissional/completar-perfil')
    }, 1000)
  } else {
    errorMessage.value = result.error
  }
}
</script>

<style scoped>
.cadastro-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--cor-gelo) 0%, var(--cor-branco) 100%);
}

.cadastro-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
}

.cadastro-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: var(--cor-branco);
  overflow-y: auto;
}

.cadastro-header {
  text-align: center;
  margin-bottom: 2rem;
  max-width: 600px;
}

.cadastro-title {
  font-family: var(--bold);
  font-size: var(--f5);
  color: var(--cor-preto);
  margin-bottom: 0.5rem;
}

.cadastro-subtitle {
  font-family: var(--regular);
  font-size: var(--f2);
  color: var(--cor-cinza);
  margin: 0;
}

.cadastro-form {
  width: 100%;
  max-width: 600px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
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

.form-input,
.form-textarea {
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

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: var(--cor-cinza);
}

.form-input:focus,
.form-textarea:focus {
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
  margin-bottom: 1rem;
  text-align: center;
}

.checkbox-wrapper {
  display: flex;
  align-items: flex-start;
  font-family: var(--regular);
  font-size: var(--f1);
  color: var(--cor-cinza-escuro);
  cursor: pointer;
  line-height: 1.4;
}

.checkbox-wrapper input {
  margin-right: 0.5rem;
  margin-top: 0.1rem;
}

.checkbox-wrapper a {
  color: var(--cor-azul-principal);
  text-decoration: none;
}

.checkbox-wrapper a:hover {
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

.divider {
  text-align: center;
  margin: 1rem 0;
  position: relative;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--cor-cinza-3);
}

.divider span {
  background: var(--cor-branco);
  padding: 0 1rem;
  color: var(--cor-cinza);
  font-family: var(--regular);
  font-size: var(--f1);
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

.login-link {
  text-align: center;
  font-family: var(--regular);
  font-size: var(--f1);
  color: var(--cor-cinza);
  margin: 0;
}

.login-link a {
  color: var(--cor-azul-principal);
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
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

.cadastro-visual {
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

.visual-image {
  width: 100%;
  height: auto;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(37, 99, 235, 0.15);
}

@media screen and (max-width: 768px) {
  .cadastro-container {
    grid-template-columns: 1fr;
  }

  .cadastro-visual {
    display: none;
  }

  .cadastro-content {
    padding: 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
}
</style>
