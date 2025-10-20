<template>
  <div class="cadastro-page">
    <div class="cadastro-container">
      <div class="cadastro-content">
        <div class="cadastro-header">
          <h1 class="cadastro-title">Cadastro de Empresa</h1>
          <p class="cadastro-subtitle">Crie sua conta para divulgar serviços</p>
        </div>

        <!-- Mensagens -->
        <div v-if="errorMessage" class="alert alert-error">
          {{ errorMessage }}
        </div>

        <div v-if="successMessage" class="alert alert-success">
          {{ successMessage }}
        </div>

        <form @submit.prevent="handleSignUp" class="cadastro-form">
          <div class="form-section">
            <h3 class="section-title">Dados da Empresa</h3>

            <div class="form-row">
              <div class="form-group">
                <label for="companyName">Razão Social</label>
                <input
                  type="text"
                  id="companyName"
                  v-model="formData.companyName"
                  placeholder="Nome da empresa"
                  class="form-input"
                  required
                >
              </div>

              <div class="form-group">
                <label for="tradeName">Nome Fantasia</label>
                <input
                  type="text"
                  id="tradeName"
                  v-model="formData.tradeName"
                  placeholder="Nome comercial"
                  class="form-input"
                >
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="cnpj">CNPJ</label>
                <input
                  type="text"
                  id="cnpj"
                  v-model="formData.cnpj"
                  placeholder="00.000.000/0000-00"
                  class="form-input"
                  required
                >
              </div>

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
            </div>

            <div class="form-group">
              <label for="email">Email Corporativo</label>
              <input
                type="email"
                id="email"
                v-model="formData.email"
                placeholder="contato@empresa.com"
                class="form-input"
                required
              >
            </div>

            <div class="form-group">
              <label for="website">Website (opcional)</label>
              <input
                type="url"
                id="website"
                v-model="formData.website"
                placeholder="https://www.empresa.com"
                class="form-input"
              >
            </div>
          </div>

          <div class="form-section">
            <h3 class="section-title">Endereço</h3>

            <div class="form-row">
              <div class="form-group">
                <label for="cep">CEP</label>
                <input
                  type="text"
                  id="cep"
                  v-model="formData.cep"
                  placeholder="00000-000"
                  class="form-input"
                  required
                >
              </div>

              <div class="form-group">
                <label for="city">Cidade</label>
                <input
                  type="text"
                  id="city"
                  v-model="formData.city"
                  placeholder="Cidade"
                  class="form-input"
                  required
                >
              </div>
            </div>

            <div class="form-group">
              <label for="address">Endereço</label>
              <input
                type="text"
                id="address"
                v-model="formData.address"
                placeholder="Rua, número, bairro"
                class="form-input"
                required
              >
            </div>
          </div>

          <div class="form-section">
            <h3 class="section-title">Responsável</h3>

            <div class="form-row">
              <div class="form-group">
                <label for="responsibleName">Nome do Responsável</label>
                <input
                  type="text"
                  id="responsibleName"
                  v-model="formData.responsibleName"
                  placeholder="Nome completo"
                  class="form-input"
                  required
                >
              </div>

              <div class="form-group">
                <label for="responsibleCpf">CPF do Responsável</label>
                <input
                  type="text"
                  id="responsibleCpf"
                  v-model="formData.responsibleCpf"
                  placeholder="000.000.000-00"
                  class="form-input"
                  required
                >
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3 class="section-title">Serviços</h3>

            <div class="form-group">
              <label for="serviceCategory">Categoria Principal</label>
              <select
                id="serviceCategory"
                v-model="formData.serviceCategory"
                class="form-input"
                required
              >
                <option value="">Selecione a categoria</option>
                <option value="construcao">Construção e Reformas</option>
                <option value="limpeza">Limpeza e Conservação</option>
                <option value="tecnologia">Tecnologia</option>
                <option value="beleza">Beleza e Estética</option>
                <option value="saude">Saúde e Bem-estar</option>
                <option value="educacao">Educação</option>
                <option value="eventos">Eventos</option>
                <option value="transporte">Transporte</option>
                <option value="consultoria">Consultoria</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <div class="form-group">
              <label for="description">Descrição dos Serviços</label>
              <textarea
                id="description"
                v-model="formData.description"
                placeholder="Descreva os serviços que sua empresa oferece..."
                class="form-textarea"
                rows="4"
                required
              ></textarea>
            </div>
          </div>

          <div class="form-section">
            <h3 class="section-title">Acesso</h3>

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
          </div>

          <div class="form-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" v-model="formData.acceptTerms" required>
              <span class="checkmark"></span>
              Aceito os <a href="/termos" target="_blank">Termos de Uso</a> e
              <a href="/privacidade" target="_blank">Política de Privacidade</a>
            </label>
          </div>

          <button type="submit" class="btn-primary-large" :disabled="loading">
            <span v-if="!loading">Criar Conta Empresarial</span>
            <span v-else>Criando Conta...</span>
          </button>

          <p class="login-link">
            Já tem uma conta? <NuxtLink to="/login">Faça login</NuxtLink>
          </p>
        </form>
      </div>

      <div class="cadastro-visual">
        <div class="visual-content">
          <img src="/assets/images/imagem-fundo-cadastro.png" alt="Serviflix - Cadastro Empresa" class="visual-image">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { signUpWithEmail, loading } = useFirebaseAuth()

const showPassword = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const formData = reactive({
  companyName: '',
  tradeName: '',
  cnpj: '',
  phone: '',
  email: '',
  website: '',
  cep: '',
  city: '',
  address: '',
  responsibleName: '',
  responsibleCpf: '',
  serviceCategory: '',
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
  const requiredFields = [
    'companyName', 'cnpj', 'phone', 'email', 'cep', 'city', 'address',
    'responsibleName', 'responsibleCpf', 'serviceCategory', 'description'
  ]

  for (const field of requiredFields) {
    if (!formData[field]?.trim()) {
      throw new Error(`${getFieldLabel(field)} é obrigatório`)
    }
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
    companyName: 'Razão Social',
    cnpj: 'CNPJ',
    phone: 'Telefone',
    email: 'Email',
    cep: 'CEP',
    city: 'Cidade',
    address: 'Endereço',
    responsibleName: 'Nome do Responsável',
    responsibleCpf: 'CPF do Responsável',
    serviceCategory: 'Categoria de Serviço',
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
      formData.companyName
    )

    if (result.success) {
      successMessage.value = result.message + ' Sua empresa será analisada e aprovada em breve.'

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
        navigateTo('/login?message=company-account-created')
      }, 3000)
    } else {
      errorMessage.value = result.error
    }
  } catch (error) {
    errorMessage.value = error.message
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
  justify-content: flex-start;
  padding: 2rem;
  background: var(--cor-branco);
  overflow-y: auto;
  max-height: 100vh;
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
  max-width: 700px;
}

.form-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  border: 1px solid var(--cor-cinza-3);
  border-radius: 12px;
  background: #fafafa;
}

.section-title {
  font-family: var(--bold);
  font-size: var(--f3);
  color: var(--cor-preto);
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--cor-azul-principal);
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

  .form-section {
    padding: 1rem;
  }
}
</style>
