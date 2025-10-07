<template>
  <div class="signup-page">
    <div class="signup-container">
      <div class="signup-card">
        <!-- Header -->
        <div class="signup-header">
          <h1>Crie sua conta no ServiFlix</h1>
          <p>Encontre os melhores profissionais ou ofereça seus serviços</p>
        </div>

        <!-- Progress Indicator -->
        <div class="progress-indicator">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: `${(currentStep / totalSteps) * 100}%` }"></div>
          </div>
          <span class="progress-text">Etapa {{ currentStep }} de {{ totalSteps }}</span>
        </div>

        <!-- Form Steps -->
        <form @submit.prevent="handleSubmit" class="signup-form">
          <!-- Etapa 1: Dados Pessoais -->
          <div v-if="currentStep === 1" class="form-step">
            <h2 class="step-title">Dados Pessoais</h2>
            
            <div class="form-grid">
              <div class="form-group">
                <label for="firstName">Nome *</label>
                <input
                  id="firstName"
                  v-model="form.firstName"
                  type="text"
                  class="form-input"
                  :class="{ 'error': errors.firstName }"
                  placeholder="Seu primeiro nome"
                  required
                >
                <span v-if="errors.firstName" class="error-message">{{ errors.firstName }}</span>
              </div>

              <div class="form-group">
                <label for="lastName">Sobrenome *</label>
                <input
                  id="lastName"
                  v-model="form.lastName"
                  type="text"
                  class="form-input"
                  :class="{ 'error': errors.lastName }"
                  placeholder="Seu sobrenome"
                  required
                >
                <span v-if="errors.lastName" class="error-message">{{ errors.lastName }}</span>
              </div>
            </div>

            <div class="form-group">
              <label for="email">E-mail *</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                class="form-input"
                :class="{ 'error': errors.email }"
                placeholder="seu@email.com"
                required
              >
              <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
            </div>

            <div class="form-group">
              <label for="phone">Telefone (WhatsApp) *</label>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                class="form-input"
                :class="{ 'error': errors.phone }"
                placeholder="(11) 99999-9999"
                required
                @input="formatPhone"
              >
              <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
            </div>

            <div class="form-group">
              <label for="birthDate">Data de Nascimento *</label>
              <input
                id="birthDate"
                v-model="form.birthDate"
                type="date"
                class="form-input"
                :class="{ 'error': errors.birthDate }"
                required
              >
              <span v-if="errors.birthDate" class="error-message">{{ errors.birthDate }}</span>
            </div>
          </div>

          <!-- Etapa 2: Endereço -->
          <div v-if="currentStep === 2" class="form-step">
            <h2 class="step-title">Endereço</h2>
            
            <div class="form-group">
              <label for="cep">CEP *</label>
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
                  <div v-else class="spinner-small"></div>
                </button>
              </div>
              <span v-if="errors.cep" class="error-message">{{ errors.cep }}</span>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label for="street">Rua *</label>
                <input
                  id="street"
                  v-model="form.street"
                  type="text"
                  class="form-input"
                  :class="{ 'error': errors.street }"
                  placeholder="Nome da rua"
                  required
                >
                <span v-if="errors.street" class="error-message">{{ errors.street }}</span>
              </div>

              <div class="form-group">
                <label for="number">Número *</label>
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
                <label for="neighborhood">Bairro *</label>
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
                <label for="complement">Complemento</label>
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
                <label for="city">Cidade *</label>
                <input
                  id="city"
                  v-model="form.city"
                  type="text"
                  class="form-input"
                  :class="{ 'error': errors.city }"
                  placeholder="Nome da cidade"
                  required
                >
                <span v-if="errors.city" class="error-message">{{ errors.city }}</span>
              </div>

              <div class="form-group">
                <label for="state">Estado *</label>
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

          <!-- Etapa 3: Segurança -->
          <div v-if="currentStep === 3" class="form-step">
            <h2 class="step-title">Segurança da Conta</h2>
            
            <div class="form-group">
              <label for="password">Senha *</label>
              <div class="password-input">
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-input"
                  :class="{ 'error': errors.password }"
                  placeholder="Crie uma senha segura"
                  required
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
              <label for="confirmPassword">Confirmar Senha *</label>
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                type="password"
                class="form-input"
                :class="{ 'error': errors.confirmPassword }"
                placeholder="Digite a senha novamente"
                required
              >
              <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
            </div>

            <div class="form-group checkbox-group">
              <label class="checkbox-label">
                <input
                  v-model="form.acceptTerms"
                  type="checkbox"
                  class="checkbox-input"
                  required
                >
                <span class="checkbox-custom"></span>
                <span class="checkbox-text">
                  Aceito os <a href="/termos" target="_blank">Termos de Uso</a> 
                  e <a href="/privacidade" target="_blank">Política de Privacidade</a>
                </span>
              </label>
              <span v-if="errors.acceptTerms" class="error-message">{{ errors.acceptTerms }}</span>
            </div>

            <div class="form-group checkbox-group">
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
              :disabled="loading || !canProceed"
            >
              <div v-if="loading" class="spinner"></div>
              <span v-else>Criar Conta</span>
            </button>
          </div>
        </form>

        <!-- Footer -->
        <div class="signup-footer">
          <p>Já tem uma conta? <NuxtLink to="/entrar">Faça login</NuxtLink></p>
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
  title: 'Cadastro - ServiFlix',
  meta: [
    { name: 'description', content: 'Cadastre-se no ServiFlix e encontre os melhores profissionais ou ofereça seus serviços' }
  ]
})

// Estados
const loading = ref(false)

// Dados do formulário
const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  acceptTerms: false
})

// Função de submit
const handleSubmit = async () => {
  if (form.password !== form.confirmPassword) {
    alert('As senhas não coincidem!')
    return
  }
  
  if (!form.acceptTerms) {
    alert('Você deve aceitar os termos de uso!')
    return
  }
  
  loading.value = true
  
  try {
    // Simular criação de conta
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    alert('Conta criada com sucesso!')
    // Redirecionar para dashboard ou página de sucesso
    await navigateTo('/dashboard')
  } catch (error) {
    console.error('Erro ao criar conta:', error)
    alert('Erro ao criar conta. Tente novamente.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.client-signup-page {
  min-height: calc(100vh - 70px);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.container {
  width: 100%;
  max-width: 500px;
}

.signup-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.signup-card h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 10px;
  text-align: center;
}

.signup-card p {
  color: #6b7280;
  text-align: center;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  background: white;
  color: #1f2937;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.checkbox-group {
  margin: 25px 0;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
  line-height: 1.5;
  font-size: 14px;
  color: #4b5563;
}

.checkbox-label input[type="checkbox"] {
  margin: 0;
  width: auto;
}

.checkbox-label a {
  color: #8b5cf6;
  text-decoration: none;
  font-weight: 600;
}

.checkbox-label a:hover {
  text-decoration: underline;
}

.btn-primary {
  width: 100%;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
  font-size: 16px;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -3px rgba(139, 92, 246, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.divider {
  text-align: center;
  margin: 20px 0;
  position: relative;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e5e7eb;
}

.divider span {
  background: white;
  padding: 0 15px;
  color: #9ca3af;
  font-size: 14px;
}

.footer {
  text-align: center;
}

.footer a {
  color: #8b5cf6;
  text-decoration: none;
  font-weight: 600;
}

.footer a:hover {
  text-decoration: underline;
}

/* Responsividade */
@media (max-width: 480px) {
  .signup-card {
    padding: 30px 20px;
  }
  
  .signup-card h1 {
    font-size: 24px;
  }
}
</style>