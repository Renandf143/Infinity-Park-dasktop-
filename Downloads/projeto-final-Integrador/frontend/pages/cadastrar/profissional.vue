<template>
  <div class="professional-signup">
    <div class="container">
      <div class="signup-header">
        <h1>Torne-se um Profissional</h1>
        <p>Complete seu cadastro para oferecer seus serviços na plataforma</p>
      </div>

      <div class="signup-steps">
        <div class="step" :class="{ active: currentStep === 1, completed: currentStep > 1 }">
          <div class="step-number">1</div>
          <span>Dados Pessoais</span>
        </div>
        <div class="step" :class="{ active: currentStep === 2, completed: currentStep > 2 }">
          <div class="step-number">2</div>
          <span>Especialidades</span>
        </div>
        <div class="step" :class="{ active: currentStep === 3, completed: currentStep > 3 }">
          <div class="step-number">3</div>
          <span>Portfólio</span>
        </div>
        <div class="step" :class="{ active: currentStep === 4 }">
          <div class="step-number">4</div>
          <span>Revisão</span>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="signup-form">
        <!-- Etapa 1: Dados Pessoais -->
        <div v-if="currentStep === 1" class="step-content">
          <h2>Dados Pessoais</h2>
          
          <div class="form-group">
            <label for="fullName">Nome Completo *</label>
            <input
              id="fullName"
              v-model="formData.fullName"
              type="text"
              required
              placeholder="Seu nome completo"
            />
          </div>

          <div class="form-group">
            <label for="phone">Telefone *</label>
            <input
              id="phone"
              v-model="formData.phone"
              type="tel"
              required
              placeholder="(11) 99999-9999"
            />
          </div>

          <div class="form-group">
            <label for="bio">Sobre você</label>
            <textarea
              id="bio"
              v-model="formData.bio"
              rows="4"
              placeholder="Conte um pouco sobre sua experiência e especialidades..."
            ></textarea>
          </div>

          <div class="form-group">
            <label for="experience">Anos de Experiência</label>
            <select id="experience" v-model="formData.experience">
              <option value="">Selecione</option>
              <option value="0-1">Menos de 1 ano</option>
              <option value="1-3">1 a 3 anos</option>
              <option value="3-5">3 a 5 anos</option>
              <option value="5-10">5 a 10 anos</option>
              <option value="10+">Mais de 10 anos</option>
            </select>
          </div>
        </div>

        <!-- Etapa 2: Especialidades -->
        <div v-if="currentStep === 2" class="step-content">
          <h2>Suas Especialidades</h2>
          <p>Selecione as áreas em que você atua</p>

          <div class="categories-grid">
            <div
              v-for="category in categories"
              :key="category.id"
              class="category-card"
              :class="{ selected: formData.categories.includes(category.id) }"
              @click="toggleCategory(category.id)"
            >
              <div class="category-icon">{{ category.icon }}</div>
              <h3>{{ category.name }}</h3>
              <p>{{ category.description }}</p>
            </div>
          </div>
        </div>

        <!-- Etapa 3: Portfólio -->
        <div v-if="currentStep === 3" class="step-content">
          <h2>Portfólio</h2>
          <p>Adicione exemplos do seu trabalho (opcional)</p>

          <div class="portfolio-upload">
            <div class="upload-area" @click="$refs.fileInput.click()">
              <div class="upload-icon">📁</div>
              <p>Clique para adicionar imagens</p>
              <small>PNG, JPG até 5MB cada</small>
            </div>
            <input
              ref="fileInput"
              type="file"
              multiple
              accept="image/*"
              @change="handleFileUpload"
              style="display: none"
            />
          </div>

          <div v-if="formData.portfolioImages.length > 0" class="portfolio-preview">
            <div
              v-for="(image, index) in formData.portfolioImages"
              :key="index"
              class="image-preview"
            >
              <img :src="image.preview" :alt="`Portfolio ${index + 1}`" />
              <button type="button" @click="removeImage(index)" class="remove-btn">×</button>
            </div>
          </div>
        </div>

        <!-- Etapa 4: Revisão -->
        <div v-if="currentStep === 4" class="step-content">
          <h2>Revisão dos Dados</h2>
          
          <div class="review-section">
            <h3>Dados Pessoais</h3>
            <p><strong>Nome:</strong> {{ formData.fullName }}</p>
            <p><strong>Telefone:</strong> {{ formData.phone }}</p>
            <p><strong>Experiência:</strong> {{ formData.experience }}</p>
          </div>

          <div class="review-section">
            <h3>Especialidades</h3>
            <div class="selected-categories">
              <span
                v-for="categoryId in formData.categories"
                :key="categoryId"
                class="category-tag"
              >
                {{ getCategoryName(categoryId) }}
              </span>
            </div>
          </div>

          <div class="review-section">
            <h3>Portfólio</h3>
            <p>{{ formData.portfolioImages.length }} imagem(ns) adicionada(s)</p>
          </div>

          <div class="terms-section">
            <label class="checkbox-label">
              <input
                v-model="formData.acceptTerms"
                type="checkbox"
                required
              />
              <span class="checkmark"></span>
              Aceito os <a href="/termos" target="_blank">termos de uso</a> e 
              <a href="/privacidade" target="_blank">política de privacidade</a>
            </label>
          </div>
        </div>

        <!-- Botões de navegação -->
        <div class="form-actions">
          <button
            v-if="currentStep > 1"
            type="button"
            @click="previousStep"
            class="btn-secondary"
          >
            Voltar
          </button>
          
          <button
            v-if="currentStep < 4"
            type="button"
            @click="nextStep"
            class="btn-primary"
            :disabled="!canProceed"
          >
            Próximo
          </button>
          
          <button
            v-if="currentStep === 4"
            type="submit"
            class="btn-primary"
            :disabled="loading || !formData.acceptTerms"
          >
            {{ loading ? 'Enviando...' : 'Finalizar Cadastro' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
const { requestProfessionalUpgrade } = useUserType()
const { user } = useAuth()

// Verificar se usuário está logado
if (!user.value) {
  await navigateTo('/entrar')
}

const currentStep = ref(1)
const loading = ref(false)

const formData = ref({
  fullName: user.value?.displayName || '',
  phone: '',
  bio: '',
  experience: '',
  categories: [],
  portfolioImages: [],
  acceptTerms: false
})

const categories = ref([
  {
    id: 'construcao',
    name: 'Construção',
    description: 'Pedreiro, eletricista, encanador',
    icon: '🔨'
  },
  {
    id: 'tecnologia',
    name: 'Tecnologia',
    description: 'Desenvolvimento, design, suporte',
    icon: '💻'
  },
  {
    id: 'saude',
    name: 'Saúde',
    description: 'Fisioterapia, enfermagem, cuidados',
    icon: '🏥'
  },
  {
    id: 'educacao',
    name: 'Educação',
    description: 'Aulas particulares, cursos',
    icon: '📚'
  },
  {
    id: 'beleza',
    name: 'Beleza',
    description: 'Cabelo, maquiagem, estética',
    icon: '💄'
  },
  {
    id: 'limpeza',
    name: 'Limpeza',
    description: 'Doméstica, comercial, pós-obra',
    icon: '🧹'
  }
])

const canProceed = computed(() => {
  switch (currentStep.value) {
    case 1:
      return formData.value.fullName && formData.value.phone
    case 2:
      return formData.value.categories.length > 0
    case 3:
      return true // Portfólio é opcional
    case 4:
      return formData.value.acceptTerms
    default:
      return false
  }
})

const nextStep = () => {
  if (canProceed.value && currentStep.value < 4) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const toggleCategory = (categoryId) => {
  const index = formData.value.categories.indexOf(categoryId)
  if (index > -1) {
    formData.value.categories.splice(index, 1)
  } else {
    formData.value.categories.push(categoryId)
  }
}

const handleFileUpload = (event) => {
  const files = Array.from(event.target.files)
  
  files.forEach(file => {
    if (file.size > 5 * 1024 * 1024) {
      alert('Arquivo muito grande. Máximo 5MB por imagem.')
      return
    }
    
    const reader = new FileReader()
    reader.onload = (e) => {
      formData.value.portfolioImages.push({
        file,
        preview: e.target.result
      })
    }
    reader.readAsDataURL(file)
  })
}

const removeImage = (index) => {
  formData.value.portfolioImages.splice(index, 1)
}

const getCategoryName = (categoryId) => {
  const category = categories.value.find(c => c.id === categoryId)
  return category ? category.name : categoryId
}

const handleSubmit = async () => {
  loading.value = true
  
  try {
    const result = await requestProfessionalUpgrade({
      fullName: formData.value.fullName,
      phone: formData.value.phone,
      bio: formData.value.bio,
      experience: formData.value.experience,
      categories: formData.value.categories,
      portfolioImages: formData.value.portfolioImages
    })
    
    if (result.success) {
      await navigateTo('/dashboard?message=professional_request_sent')
    } else {
      alert(result.error || 'Erro ao enviar solicitação')
    }
  } catch (error) {
    console.error('Erro no cadastro:', error)
    alert('Erro interno. Tente novamente.')
  } finally {
    loading.value = false
  }
}

// Definir layout
definePageMeta({
  layout: 'auth'
})

// Meta tags
useHead({
  title: 'Cadastro Profissional - ServiFlix',
  meta: [
    { name: 'description', content: 'Torne-se um profissional na ServiFlix e ofereça seus serviços' }
  ]
})
</script>

<style scoped>
.professional-signup {
  min-height: calc(100vh - 70px);
  background: transparent;
  padding: var(--space-xl) 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 var(--space-lg);
}

.signup-header {
  text-align: center;
  margin-bottom: var(--space-2xl);
}

.signup-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-md);
}

.signup-header p {
  font-size: 18px;
  color: var(--text-secondary);
}

.signup-steps {
  display: flex;
  justify-content: center;
  margin-bottom: var(--space-2xl);
  gap: var(--space-lg);
}

.step {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md);
  border-radius: var(--radius-lg);
  background: var(--bg-secondary);
  transition: all 0.3s ease;
}

.step.active {
  background: #8b5cf6;
  color: white;
}

.step.completed {
  background: #10b981;
  color: white;
}

.step-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.signup-form {
  background: var(--bg-primary);
  border-radius: var(--radius-2xl);
  padding: var(--space-2xl);
  box-shadow: var(--shadow-2xl);
  border: 1px solid var(--border-primary);
}

.step-content h2 {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-lg);
}

.form-group {
  margin-bottom: var(--space-lg);
}

.form-group label {
  display: block;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: var(--space-md);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #8b5cf6;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-lg);
  margin-top: var(--space-lg);
}

.category-card {
  padding: var(--space-lg);
  border: 2px solid var(--border-primary);
  border-radius: var(--radius-lg);
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-card:hover {
  border-color: #8b5cf6;
  transform: translateY(-2px);
}

.category-card.selected {
  border-color: #8b5cf6;
  background: rgba(139, 92, 246, 0.1);
}

.category-icon {
  font-size: 32px;
  margin-bottom: var(--space-md);
}

.category-card h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
}

.category-card p {
  color: var(--text-secondary);
  font-size: 14px;
}

.upload-area {
  border: 2px dashed var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-2xl);
  text-align: center;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.upload-area:hover {
  border-color: #8b5cf6;
}

.upload-icon {
  font-size: 48px;
  margin-bottom: var(--space-md);
}

.portfolio-preview {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: var(--space-md);
  margin-top: var(--space-lg);
}

.image-preview {
  position: relative;
  aspect-ratio: 1;
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.review-section {
  margin-bottom: var(--space-xl);
  padding-bottom: var(--space-lg);
  border-bottom: 1px solid var(--border-primary);
}

.review-section:last-child {
  border-bottom: none;
}

.review-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-md);
}

.selected-categories {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.category-tag {
  padding: var(--space-sm) var(--space-md);
  background: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
  border-radius: var(--radius-full);
  font-size: 14px;
  font-weight: 500;
}

.terms-section {
  margin-top: var(--space-xl);
  padding-top: var(--space-lg);
  border-top: 1px solid var(--border-primary);
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  cursor: pointer;
  line-height: 1.5;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  margin: 0;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: var(--space-2xl);
  gap: var(--space-md);
}

.btn-primary,
.btn-secondary {
  padding: var(--space-md) var(--space-xl);
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-primary {
  background: #8b5cf6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #7c3aed;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
}

.btn-secondary:hover {
  background: var(--bg-tertiary);
}

@media (max-width: 768px) {
  .signup-steps {
    flex-direction: column;
    gap: var(--space-md);
  }
  
  .categories-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>