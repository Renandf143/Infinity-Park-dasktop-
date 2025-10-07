<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <!-- Header -->
        <div class="auth-header">
          <div class="progress-indicator">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: `${(currentStep / totalSteps) * 100}%` }"></div>
            </div>
            <span class="progress-text">Passo {{ currentStep }} de {{ totalSteps }}</span>
          </div>
          <h1 class="auth-title">{{ stepTitles[currentStep - 1] }}</h1>
          <p class="auth-subtitle">{{ stepSubtitles[currentStep - 1] }}</p>
        </div>

        <!-- Form Steps -->
        <form @submit.prevent="handleSubmit" class="auth-form">
          <!-- Step 1: Informações Básicas -->
          <div v-if="currentStep === 1" class="form-step">
            <div class="form-grid">
              <div class="form-group">
                <label for="firstName" class="form-label">Nome *</label>
                <input
                  id="firstName"
                  v-model="form.firstName"
                  type="text"
                  class="form-input"
                  :class="{ 'error': errors.firstName }"
                  placeholder="Seu primeiro nome"
                  required
                  autocomplete="given-name"
                >
                <span v-if="errors.firstName" class="error-message">{{ errors.firstName }}</span>
              </div>

              <div class="form-group">
                <label for="lastName" class="form-label">Sobrenome *</label>
                <input
                  id="lastName"
                  v-model="form.lastName"
                  type="text"
                  class="form-input"
                  :class="{ 'error': errors.lastName }"
                  placeholder="Seu sobrenome"
                  required
                  autocomplete="family-name"
                >
                <span v-if="errors.lastName" class="error-message">{{ errors.lastName }}</span>
              </div>
            </div>

            <div class="form-group">
              <label for="email" class="form-label">E-mail *</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                class="form-input"
                :class="{ 'error': errors.email }"
                placeholder="seu@email.com"
                required
                autocomplete="email"
              >
              <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
            </div>

            <div class="form-group">
              <label for="phone" class="form-label">Telefone *</label>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                class="form-input"
                :class="{ 'error': errors.phone }"
                placeholder="(11) 99999-9999"
                required
                autocomplete="tel"
                @input="formatPhone"
              >
              <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
            </div>
          </div>

          <!-- Step 2: Localização -->
          <div v-if="currentStep === 2" class="form-step">
            <div class="form-group">
              <label for="cep" class="form-label">CEP *</label>
              <div class="input-with-button">
                <input
                  id="cep"
                  v-model="form.cep"
                  type="text"
                  class="form-input"
                  :class="{ 'error': errors.cep }"
                  placeholder="00000-000"
                  required
                  @input="formatCEP"
                  @blur="searchCEP"
                >
                <button type="button" @click="searchCEP" class="btn-search-cep" :disabled="isSearchingCEP">
                  <svg v-if="!isSearchingCEP" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
                  </svg>
                  <div v-else class="spinner"></div>
                </button>
              </div>
              <span v-if="errors.cep" class="error-message">{{ errors.cep }}</span>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label for="street" class="form-label">Rua *</label>
                <input
                  id="street"
                  v-model="form.street"
                  type="text"
                  class="form-input"
                  :class="{ 'error': errors.street }"
                  placeholder="Nome da rua"
                  required
                  autocomplete="street-address"
                >
                <span v-if="errors.street" class="error-message">{{ errors.street }}</span>
              </div>

              <div class="form-group">
                <label for="number" class="form-label">Número *</label>
                <input
                  id="number"
                  v-model="form.number"
                  type="text"
                  class="form-input"
                  :class="{ 'error': errors.number }"
                  placeholder="123"
                  required
                >
                <span v-if="errors.number" class="error-message">{{ errors.number }}</span>
              </div>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label for="neighborhood" class="form-label">Bairro *</label>
                <input
                  id="neighborhood"
                  v-model="form.neighborhood"
                  type="text"
                  class="form-input"
                  :class="{ 'error': errors.neighborhood }"
                  placeholder="Nome do bairro"
                  required
                >
                <span v-if="errors.neighborhood" class="error-message">{{ errors.neighborhood }}</span>
              </div>

              <div class="form-group">
                <label for="complement" class="form-label">Complemento</label>
                <input
                  id="complement"
                  v-model="form.complement"
                  type="text"
                  class="form-input"
                  placeholder="Apto, casa, etc."
                >
              </div>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label for="city" class="form-label">Cidade *</label>
                <input
                  id="city"
                  v-model="form.city"
                  type="text"
                  class="form-input"
                  :class="{ 'error': errors.city }"
                  placeholder="Nome da cidade"
                  required
                  autocomplete="address-level2"
                >
                <span v-if="errors.city" class="error-message">{{ errors.city }}</span>
              </div>

              <div class="form-group">
                <label for="state" class="form-label">Estado *</label>
                <select
                  id="state"
                  v-model="form.state"
                  class="form-select"
                  :class="{ 'error': errors.state }"
                  required
                >
                  <option value="">Selecione</option>
                  <option v-for="state in brazilianStates" :key="state.value" :value="state.value">
                    {{ state.label }}
                  </option>
                </select>
                <span v-if="errors.state" class="error-message">{{ errors.state }}</span>
              </div>
            </div>
          </div>

          <!-- Step 3: Segurança -->
          <div v-if="currentStep === 3" class="form-step">
            <div class="form-group">
              <label for="password" class="form-label">Senha *</label>
              <div class="password-input">
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-input"
                  :class="{ 'error': errors.password }"
                  placeholder="Crie uma senha segura"
                  required
                  autocomplete="new-password"
                >
                <button type="button" @click="showPassword = !showPassword" class="password-toggle">
                  <svg v-if="showPassword" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd"/>
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/>
                  </svg>
                  <svg v-else viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                  </svg>
                </button>
              </div>
              <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
              
              <!-- Password Strength Indicator -->
              <div class="password-strength">
                <div class="strength-bar">
                  <div class="strength-fill" :class="passwordStrength.class" :style="{ width: passwordStrength.width }"></div>
                </div>
                <span class="strength-text">{{ passwordStrength.text }}</span>
              </div>
            </div>

            <div class="form-group">
              <label for="confirmPassword" class="form-label">Confirmar Senha *</label>
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                type="password"
                class="form-input"
                :class="{ 'error': errors.confirmPassword }"
                placeholder="Digite a senha novamente"
                required
                autocomplete="new-password"
              >
              <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input
                  v-model="form.acceptTerms"
                  type="checkbox"
                  class="checkbox-input"
                  required
                >
                <span class="checkbox-custom"></span>
                <span class="checkbox-text">
                  Aceito os <a href="/termos" target="_blank" class="link">Termos de Uso</a> 
                  e <a href="/privacidade" target="_blank" class="link">Política de Privacidade</a>
                </span>
              </label>
              <span v-if="errors.acceptTerms" class="error-message">{{ errors.acceptTerms }}</span>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input
                  v-model="form.acceptMarketing"
                  type="checkbox"
                  class="checkbox-input"
                >
                <span class="checkbox-custom"></span>
                <span class="checkbox-text">
                  Quero receber ofertas e novidades por e-mail
                </span>
              </label>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="form-navigation">
            <button
              v-if="currentStep > 1"
              type="button"
              @click="previousStep"
              class="btn-secondary"
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              Voltar
            </button>

            <button
              v-if="currentStep < totalSteps"
              type="button"
              @click="nextStep"
              class="btn-primary"
              :disabled="!canProceed"
            >
              Continuar
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
              </svg>
            </button>

            <button
              v-if="currentStep === totalSteps"
              type="submit"
              class="btn-primary"
              :disabled="isSubmitting || !canProceed"
            >
              <div v-if="isSubmitting" class="spinner"></div>
              <span v-else>Criar Conta</span>
            </button>
          </div>
        </form>

        <!-- Footer -->
        <div class="auth-footer">
          <p>Já tem uma conta? <NuxtLink to="/entrar" class="auth-link">Faça login</NuxtLink></p>
          <p class="help-text">
            Precisa de ajuda? <a href="/contato" class="auth-link">Entre em contato</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Definir layout
definePageMeta({
  layout: 'auth'
})

// Meta tags
useHead({
  title: 'Cadastro Cliente - ServiFlix',
  meta: [
    { name: 'description', content: 'Cadastre-se como cliente no ServiFlix e encontre os melhores profissionais.' }
  ]
})

// Estados
const currentStep = ref(1)
const totalSteps = 3
const isSubmitting = ref(false)
const isSearchingCEP = ref(false)
const showPassword = ref(false)

const stepTitles = [
  'Informações Básicas',
  'Onde você está?',
  'Segurança da Conta'
]

const stepSubtitles = [
  'Vamos começar com suas informações pessoais',
  'Precisamos saber sua localização para conectar você com profissionais da sua região',
  'Crie uma senha segura para proteger sua conta'
]

// Form data
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  cep: '',
  street: '',
  number: '',
  neighborhood: '',
  complement: '',
  city: '',
  state: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
  acceptMarketing: false
})

// Errors
const errors = reactive({})

// Estados brasileiros
const brazilianStates = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' }
]

// Computed
const passwordStrength = computed(() => {
  const password = form.password
  if (!password) return { width: '0%', class: '', text: '' }
  
  let score = 0
  if (password.length >= 8) score++
  if (/[a-z]/.test(password)) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  
  const strength = {
    0: { width: '20%', class: 'very-weak', text: 'Muito fraca' },
    1: { width: '20%', class: 'very-weak', text: 'Muito fraca' },
    2: { width: '40%', class: 'weak', text: 'Fraca' },
    3: { width: '60%', class: 'medium', text: 'Média' },
    4: { width: '80%', class: 'strong', text: 'Forte' },
    5: { width: '100%', class: 'very-strong', text: 'Muito forte' }
  }
  
  return strength[score] || strength[0]
})

const canProceed = computed(() => {
  if (currentStep.value === 1) {
    return form.firstName && form.lastName && form.email && form.phone
  }
  if (currentStep.value === 2) {
    return form.cep && form.street && form.number && form.neighborhood && form.city && form.state
  }
  if (currentStep.value === 3) {
    return form.password && form.confirmPassword && form.acceptTerms && 
           form.password === form.confirmPassword
  }
  return false
})

// Methods
function formatPhone(event) {
  let value = event.target.value.replace(/\D/g, '')
  if (value.length <= 11) {
    value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    form.phone = value
  }
}

function formatCEP(event) {
  let value = event.target.value.replace(/\D/g, '')
  if (value.length <= 8) {
    value = value.replace(/(\d{5})(\d{3})/, '$1-$2')
    form.cep = value
  }
}

async function searchCEP() {
  const cep = form.cep.replace(/\D/g, '')
  if (cep.length !== 8) return
  
  isSearchingCEP.value = true
  
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
    const data = await response.json()
    
    if (!data.erro) {
      form.street = data.logradouro
      form.neighborhood = data.bairro
      form.city = data.localidade
      form.state = data.uf
    }
  } catch (error) {
    console.error('Erro ao buscar CEP:', error)
  } finally {
    isSearchingCEP.value = false
  }
}

function validateStep() {
  const newErrors = {}
  
  if (currentStep.value === 1) {
    if (!form.firstName) newErrors.firstName = 'Nome é obrigatório'
    if (!form.lastName) newErrors.lastName = 'Sobrenome é obrigatório'
    if (!form.email) newErrors.email = 'E-mail é obrigatório'
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'E-mail inválido'
    if (!form.phone) newErrors.phone = 'Telefone é obrigatório'
  }
  
  if (currentStep.value === 2) {
    if (!form.cep) newErrors.cep = 'CEP é obrigatório'
    if (!form.street) newErrors.street = 'Rua é obrigatória'
    if (!form.number) newErrors.number = 'Número é obrigatório'
    if (!form.neighborhood) newErrors.neighborhood = 'Bairro é obrigatório'
    if (!form.city) newErrors.city = 'Cidade é obrigatória'
    if (!form.state) newErrors.state = 'Estado é obrigatório'
  }
  
  if (currentStep.value === 3) {
    if (!form.password) newErrors.password = 'Senha é obrigatória'
    else if (form.password.length < 8) newErrors.password = 'Senha deve ter pelo menos 8 caracteres'
    if (!form.confirmPassword) newErrors.confirmPassword = 'Confirmação de senha é obrigatória'
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Senhas não coincidem'
    if (!form.acceptTerms) newErrors.acceptTerms = 'Você deve aceitar os termos'
  }
  
  Object.assign(errors, newErrors)
  return Object.keys(newErrors).length === 0
}

function nextStep() {
  if (validateStep()) {
    currentStep.value++
  }
}

function previousStep() {
  currentStep.value--
  // Limpar erros do passo anterior
  Object.keys(errors).forEach(key => delete errors[key])
}

async function handleSubmit() {
  if (!validateStep()) return
  
  isSubmitting.value = true
  
  try {
    // Simular chamada da API
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Redirecionar para página de sucesso ou dashboard
    await navigateTo('/dashboard')
  } catch (error) {
    console.error('Erro ao criar conta:', error)
    // Mostrar erro para o usuário
  } finally {
    isSubmitting.value = false
  }
}
</script><style sc
oped>
.auth-page {
  min-height: calc(100vh - 70px);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-xl);
  position: relative;
}



.auth-container {
  width: 100%;
  max-width: 600px;
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



.progress-indicator {
  margin-bottom: var(--space-xl);
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: var(--space-sm);
}

.progress-fill {
  height: 100%;
  background: var(--gradient-primary);
  border-radius: var(--radius-full);
  transition: width var(--transition-slow);
}

.progress-text {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
  font-weight: 600;
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
  margin-bottom: var(--space-3xl);
}

.form-step {
  min-height: 400px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);
}

.form-group {
  margin-bottom: var(--space-xl);
}

.form-label {
  display: block;
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
}

.form-input,
.form-select {
  width: 100%;
  padding: var(--space-lg);
  border: 2px solid var(--border-primary);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: all var(--transition-base);
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.form-input.error,
.form-select.error {
  border-color: var(--error-500);
}

.form-input::placeholder {
  color: var(--text-quaternary);
}

.input-with-button {
  display: flex;
  gap: var(--space-sm);
}

.input-with-button .form-input {
  flex: 1;
}

.btn-search-cep {
  padding: var(--space-lg);
  background: var(--color-primary);
  color: var(--text-inverse);
  border: none;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-base);
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 50px;
}

.btn-search-cep:hover:not(:disabled) {
  background: var(--color-primary-hover);
}

.btn-search-cep:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-search-cep svg {
  width: 20px;
  height: 20px;
}

.password-input {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: var(--space-lg);
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-tertiary);
  cursor: pointer;
  padding: var(--space-xs);
  transition: color var(--transition-base);
}

.password-toggle:hover {
  color: var(--text-primary);
}

.password-toggle svg {
  width: 20px;
  height: 20px;
}

.password-strength {
  margin-top: var(--space-sm);
}

.strength-bar {
  width: 100%;
  height: 4px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: var(--space-xs);
}

.strength-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: all var(--transition-base);
}

.strength-fill.very-weak {
  background: var(--error-500);
}

.strength-fill.weak {
  background: var(--warning-500);
}

.strength-fill.medium {
  background: var(--warning-400);
}

.strength-fill.strong {
  background: var(--success-500);
}

.strength-fill.very-strong {
  background: var(--success-600);
}

.strength-text {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--text-tertiary);
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
  cursor: pointer;
  line-height: 1.5;
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-primary);
  border-radius: var(--radius-sm);
  background: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-base);
  flex-shrink: 0;
  margin-top: 2px;
}

.checkbox-input:checked + .checkbox-custom {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '✓';
  color: var(--text-inverse);
  font-size: 12px;
  font-weight: bold;
}

.checkbox-text {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 600;
}

.link:hover {
  text-decoration: underline;
}

.error-message {
  display: block;
  color: var(--error-500);
  font-size: var(--text-xs);
  margin-top: var(--space-xs);
  font-weight: 600;
}

.form-navigation {
  display: flex;
  justify-content: space-between;
  gap: var(--space-lg);
  margin-top: var(--space-2xl);
}

.btn-secondary {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-lg) var(--space-2xl);
  background: transparent;
  color: var(--text-secondary);
  border: 2px solid var(--border-primary);
  border-radius: var(--radius-lg);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-secondary:hover {
  background: var(--bg-tertiary);
  border-color: var(--border-secondary);
  color: var(--text-primary);
}

.btn-secondary svg {
  width: 16px;
  height: 16px;
}

.btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: var(--space-lg) var(--space-2xl);
  background: var(--gradient-primary);
  color: var(--text-inverse);
  border: none;
  border-radius: var(--radius-lg);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
  min-width: 140px;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-primary-lg);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-primary svg {
  width: 16px;
  height: 16px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.auth-footer {
  text-align: center;
}

.auth-footer p {
  color: var(--text-secondary);
  font-size: 14px;
  margin-bottom: var(--space-sm);
}

.help-text {
  margin-bottom: 0;
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
@media (max-width: 768px) {
  .auth-page {
    padding: var(--space-lg);
  }
  
  .auth-card {
    padding: var(--space-2xl);
  }
  
  .form-grid {
    grid-template-columns: 1fr;
    gap: var(--space-md);
  }
  
  .form-navigation {
    flex-direction: column;
  }
  
  .btn-secondary,
  .btn-primary {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .auth-title {
    font-size: 24px;
  }
  
  .form-step {
    min-height: 300px;
  }
  
  .input-with-button {
    flex-direction: column;
  }
  
  .btn-search-cep {
    width: 100%;
  }
}
</style>