<template>
  <div class="service-detail-page">
    <!-- Breadcrumb -->
    <section class="breadcrumb-section">
      <div class="container-custom">
        <nav class="breadcrumb">
          <NuxtLink to="/" class="breadcrumb-link">Início</NuxtLink>
          <span class="breadcrumb-separator">/</span>
          <NuxtLink :to="`/categorias/${service.category.slug}`" class="breadcrumb-link">{{ service.category.name }}</NuxtLink>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-current">{{ service.title }}</span>
        </nav>
      </div>
    </section>

    <!-- Conteúdo Principal -->
    <section class="service-content">
      <div class="container-custom">
        <div class="service-layout">
          <!-- Coluna Principal -->
          <div class="main-column">
            <!-- Galeria de Imagens -->
            <div class="image-gallery card">
              <div class="card-body">
                <div class="main-image">
                  <img :src="service.images[selectedImage]" :alt="service.title" class="main-image-img">
                </div>
                <div class="thumbnail-list">
                  <button 
                    v-for="(image, index) in service.images" 
                    :key="index"
                    class="thumbnail"
                    :class="{ active: selectedImage === index }"
                    @click="selectedImage = index"
                  >
                    <img :src="image" :alt="`${service.title} ${index + 1}`">
                  </button>
                </div>
              </div>
            </div>

            <!-- Informações do Serviço -->
            <div class="service-details card">
              <div class="card-body">
                <h1 class="service-title">{{ service.title }}</h1>
                
                <div class="service-meta">
                  <div class="rating">
                    <span class="rating-stars">{{ getStars(service.rating) }}</span>
                    <span class="rating-text">{{ service.rating }} ({{ service.reviews }} avaliações)</span>
                  </div>
                  <div class="service-category">
                    <span class="badge badge-primary">{{ service.category.name }}</span>
                  </div>
                </div>

                <div class="service-description">
                  <h2 class="section-title">Sobre o serviço</h2>
                  <p class="service-description-text">{{ service.description }}</p>
                </div>

                <div class="divider"></div>

                <div class="service-features">
                  <h2 class="section-title">O que está incluído</h2>
                  <ul class="features-list">
                    <li v-for="feature in service.features" :key="feature" class="feature-item">
                      <svg class="feature-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>
                      </svg>
                      <span>{{ feature }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Informações do Prestador -->
            <div class="provider-section card">
              <div class="card-body">
                <h2 class="section-title">Sobre o profissional</h2>
                <div class="provider-card">
                  <div class="provider-avatar">
                    <img :src="service.provider.avatar" :alt="service.provider.name" class="avatar avatar-xl">
                    <div class="provider-status">
                      <span class="status-indicator online"></span>
                      <span class="status-text">Online</span>
                    </div>
                  </div>
                  <div class="provider-info">
                    <h3 class="provider-name">{{ service.provider.name }}</h3>
                    <div class="provider-stats">
                      <div class="stat-item">
                        <span class="stat-value">{{ service.provider.completedJobs }}</span>
                        <span class="stat-label">Trabalhos concluídos</span>
                      </div>
                      <div class="stat-item">
                        <span class="stat-value">{{ service.provider.rating }}</span>
                        <span class="stat-label">Avaliação média</span>
                      </div>
                      <div class="stat-item">
                        <span class="stat-value">{{ service.provider.responseTime }}</span>
                        <span class="stat-label">Tempo de resposta</span>
                      </div>
                    </div>
                    <p class="provider-bio">{{ service.provider.bio }}</p>
                    <button class="btn btn-outline">Ver perfil completo</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Avaliações -->
            <div class="reviews-section">
              <h2>Avaliações ({{ service.reviews }})</h2>
              
              <div class="reviews-summary">
                <div class="rating-overview">
                  <div class="rating-number">{{ service.rating }}</div>
                  <div class="rating-stars">{{ getStars(service.rating) }}</div>
                  <div class="rating-count">{{ service.reviews }} avaliações</div>
                </div>
                
                <div class="rating-bars">
                  <div v-for="star in [5,4,3,2,1]" :key="star" class="rating-bar">
                    <span class="star-label">{{ star }} ⭐</span>
                    <div class="bar-container">
                      <div class="bar-fill" :style="{ width: getRatingPercentage(star) + '%' }"></div>
                    </div>
                    <span class="bar-count">{{ getRatingCount(star) }}</span>
                  </div>
                </div>
              </div>

              <div class="reviews-list">
                <div v-for="review in service.reviewsList" :key="review.id" class="review-item">
                  <div class="review-header">
                    <img :src="review.user.avatar" :alt="review.user.name" class="review-avatar">
                    <div class="review-info">
                      <h4>{{ review.user.name }}</h4>
                      <div class="review-meta">
                        <span class="review-stars">{{ getStars(review.rating) }}</span>
                        <span class="review-date">{{ review.date }}</span>
                      </div>
                    </div>
                  </div>
                  <p class="review-text">{{ review.comment }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar de Contratação -->
          <div class="sidebar">
            <div class="booking-card card">
              <div class="card-body">
                <div class="price-section">
                  <span class="price-label">A partir de</span>
                  <div class="price-value">R$ {{ service.price }}</div>
                  <span class="price-type">{{ service.priceType }}</span>
                </div>

                <div class="divider"></div>

                <form class="booking-form" @submit.prevent="handleBooking">
                  <div class="form-group">
                    <label class="form-label">Data desejada</label>
                    <input type="date" v-model="bookingData.date" class="form-input" required>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Horário</label>
                    <select v-model="bookingData.time" class="form-input form-select" required>
                      <option value="">Selecione um horário</option>
                      <option value="morning">Manhã (8h - 12h)</option>
                      <option value="afternoon">Tarde (13h - 17h)</option>
                      <option value="evening">Noite (18h - 21h)</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Detalhes adicionais</label>
                    <textarea 
                      v-model="bookingData.details" 
                      class="form-input form-textarea"
                      placeholder="Descreva o que você precisa..."
                      rows="4"
                    ></textarea>
                  </div>

                  <button type="submit" class="btn btn-primary btn-lg booking-btn" :disabled="!isFormValid">
                    <svg v-if="isBooking" class="animate-spin" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"/>
                    </svg>
                    {{ isBooking ? 'Enviando...' : 'Solicitar orçamento' }}
                  </button>

                  <button type="button" class="btn btn-outline btn-lg contact-btn">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M6,9H18V11H6M14,14H6V12H14M18,8H6V6H18"/>
                    </svg>
                    Enviar mensagem
                  </button>
                </form>

                <div class="divider"></div>

                <div class="booking-guarantees">
                  <div class="guarantee-item">
                    <svg class="guarantee-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1Z"/>
                    </svg>
                    <span>Pagamento seguro</span>
                  </div>
                  <div class="guarantee-item">
                    <svg class="guarantee-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/>
                    </svg>
                    <span>Garantia de qualidade</span>
                  </div>
                  <div class="guarantee-item">
                    <svg class="guarantee-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z"/>
                    </svg>
                    <span>Resposta rápida</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Serviços Relacionados -->
            <div class="related-services">
              <h3>Serviços similares</h3>
              <div class="related-list">
                <div v-for="related in relatedServices" :key="related.id" class="related-item">
                  <img :src="related.image" :alt="related.title">
                  <div class="related-info">
                    <h4>{{ related.title }}</h4>
                    <div class="related-price">R$ {{ related.price }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>


  </div>
</template>

<script setup>
const route = useRoute()
const serviceId = route.params.id

// Estados
const selectedImage = ref(0)
const isBooking = ref(false)

const bookingData = ref({
  date: '',
  time: '',
  details: ''
})

// Computed
const isFormValid = computed(() => {
  return bookingData.value.date && bookingData.value.time
})

// Dados do serviço (em produção, viriam da API)
const service = ref({
  id: serviceId,
  title: 'Limpeza Residencial Completa',
  description: 'Serviço completo de limpeza residencial incluindo todos os cômodos, com produtos de alta qualidade e profissionais treinados. Garantimos um ambiente limpo e higienizado.',
  price: 120,
  priceType: 'Por visita',
  rating: 4.9,
  reviews: 234,
  images: [
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop&crop=center'
  ],
  category: {
    name: 'Limpeza',
    slug: 'limpeza'
  },
  features: [
    'Limpeza de todos os cômodos',
    'Produtos de limpeza inclusos',
    'Profissionais treinados',
    'Equipamentos profissionais',
    'Garantia de satisfação'
  ],
  provider: {
    name: 'Maria Limpeza Profissional',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
    rating: 4.9,
    completedJobs: 156,
    responseTime: '2 horas',
    bio: 'Profissional com mais de 10 anos de experiência em limpeza residencial e comercial. Comprometida com a qualidade e satisfação dos clientes.'
  },
  reviewsList: [
    {
      id: 1,
      user: { name: 'Ana Silva', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
      rating: 5,
      date: '15/09/2024',
      comment: 'Excelente serviço! Muito profissional e atenciosa.'
    }
  ]
})

const relatedServices = ref([
  { id: 2, title: 'Limpeza Pós-Obra', price: 180, image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400&h=300&fit=crop' },
  { id: 3, title: 'Limpeza de Estofados', price: 90, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop' }
])

// Funções
function getStars(rating) {
  return '⭐'.repeat(Math.floor(rating))
}

function getRatingPercentage(star) {
  return Math.random() * 100
}

function getRatingCount(star) {
  return Math.floor(Math.random() * 50)
}

async function handleBooking() {
  if (!isFormValid.value) return
  
  isBooking.value = true
  
  try {
    // Simular chamada da API
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mostrar sucesso
    alert('✅ Solicitação enviada com sucesso! O profissional entrará em contato em breve.')
    
    // Limpar formulário
    bookingData.value = {
      date: '',
      time: '',
      details: ''
    }
  } catch (error) {
    alert('❌ Erro ao enviar solicitação. Tente novamente.')
  } finally {
    isBooking.value = false
  }
}



// SEO
useHead({
  title: `${service.value.title} - ServiFlix`,
  meta: [
    { name: 'description', content: service.value.description }
  ]
})
</script>

<style scoped>
.service-detail-page {
  background: var(--bg-secondary);
  min-height: 100vh;
}

.breadcrumb-section {
  background: var(--bg-primary);
  padding: var(--space-xl) 0;
  border-bottom: 1px solid var(--border-primary);
}

.breadcrumb-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  transition: color var(--transition-fast);
}

.breadcrumb-link:hover {
  color: var(--color-primary-hover);
  text-decoration: underline;
}

.breadcrumb-separator {
  color: var(--text-quaternary);
  margin: 0 var(--space-sm);
}

.breadcrumb-current {
  color: var(--text-primary);
  font-weight: 600;
}

.service-content {
  padding: var(--space-4xl) 0;
}

.service-layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: var(--space-4xl);
  align-items: start;
}

.main-column {
  display: flex;
  flex-direction: column;
  gap: var(--space-3xl);
}

.main-image {
  width: 100%;
  height: 400px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: var(--space-lg);
}

.main-image-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-list {
  display: flex;
  gap: var(--space-md);
  overflow-x: auto;
  padding-bottom: var(--space-sm);
}

.thumbnail {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color var(--transition-base);
  background: none;
  padding: 0;
}

.thumbnail:hover {
  border-color: var(--color-primary-light);
}

.thumbnail.active {
  border-color: var(--color-primary);
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.service-title {
  font-size: var(--text-4xl);
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: var(--space-lg);
  line-height: 1.2;
}

.service-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-2xl);
}

.section-title {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-lg);
}

.service-description-text {
  color: var(--text-secondary);
  line-height: 1.8;
  font-size: var(--text-lg);
}

.features-list {
  list-style: none;
  padding: 0;
  display: grid;
  gap: var(--space-md);
}

.feature-item {
  display: flex;
  gap: var(--space-md);
  align-items: center;
  padding: var(--space-md);
  background: var(--bg-accent);
  border-radius: var(--radius-lg);
  color: var(--text-secondary);
  transition: all var(--transition-base);
}

.feature-item:hover {
  background: var(--color-primary-light);
  transform: translateX(4px);
}

.feature-icon {
  width: 20px;
  height: 20px;
  color: var(--success-500);
  flex-shrink: 0;
}

.provider-card {
  display: flex;
  gap: var(--space-2xl);
  align-items: start;
}

.provider-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
}

.provider-status {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--text-sm);
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  background: var(--gray-400);
}

.status-indicator.online {
  background: var(--success-500);
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

.status-text {
  color: var(--text-tertiary);
  font-weight: 500;
}

.provider-name {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-lg);
}

.provider-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-xl);
  margin-bottom: var(--space-lg);
  padding: var(--space-lg);
  background: var(--bg-accent);
  border-radius: var(--radius-lg);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-value {
  font-size: var(--text-2xl);
  font-weight: 800;
  color: var(--color-primary);
  margin-bottom: var(--space-xs);
}

.stat-label {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.provider-bio {
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: var(--space-xl);
  font-size: var(--text-base);
}

.reviews-summary {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 40px;
  margin-bottom: 32px;
  padding-bottom: 32px;
  border-bottom: 1px solid #f0f0f0;
}

.rating-overview {
  text-align: center;
}

.rating-number {
  font-size: 48px;
  font-weight: 700;
  color: #333;
}

.rating-stars {
  font-size: 24px;
  margin: 8px 0;
}

.rating-count {
  font-size: 14px;
  color: #999;
}

.rating-bar {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 8px;
}

.star-label {
  width: 60px;
  font-size: 14px;
}

.bar-container {
  flex: 1;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: #ffc107;
}

.bar-count {
  width: 40px;
  text-align: right;
  font-size: 14px;
  color: #999;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.review-item {
  padding-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;
}

.review-item:last-child {
  border-bottom: none;
}

.review-header {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.review-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.review-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.review-meta {
  display: flex;
  gap: 12px;
  font-size: 14px;
}

.review-stars {
  color: #ffc107;
}

.review-date {
  color: #999;
}

.review-text {
  color: #666;
  line-height: 1.6;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: var(--space-2xl);
}

.booking-card {
  position: sticky;
  top: var(--space-xl);
}

.price-section {
  text-align: center;
  margin-bottom: var(--space-xl);
}

.price-label {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.price-value {
  font-size: var(--text-5xl);
  font-weight: 800;
  color: var(--color-primary);
  margin: var(--space-sm) 0;
  line-height: 1;
}

.price-type {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  font-weight: 500;
}

.form-group {
  margin-bottom: var(--space-lg);
}

.booking-btn,
.contact-btn {
  width: 100%;
  margin-bottom: var(--space-md);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
}

.booking-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.contact-btn svg {
  width: 20px;
  height: 20px;
}

.booking-guarantees {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.guarantee-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  font-size: var(--text-sm);
  color: var(--text-secondary);
  font-weight: 500;
}

.guarantee-icon {
  width: 20px;
  height: 20px;
  color: var(--success-500);
  flex-shrink: 0;
}

/* Animação de loading */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
  width: 16px;
  height: 16px;
}

.related-services h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
}

.related-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.related-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.related-item:hover {
  background: #f5f5f5;
}

.related-item img {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
}

.related-info h4 {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.related-price {
  font-size: 16px;
  font-weight: 700;
  color: #667eea;
}

/* Responsividade profissional */
@media (max-width: 1024px) {
  .service-layout {
    grid-template-columns: 1fr;
    gap: var(--space-2xl);
  }

  .sidebar {
    order: -1;
  }
  
  .booking-card {
    position: static;
  }
  
  .provider-card {
    flex-direction: column;
    text-align: center;
    gap: var(--space-lg);
  }
  
  .provider-stats {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .service-content {
    padding: var(--space-2xl) 0;
  }
  
  .main-column {
    gap: var(--space-2xl);
  }
  
  .service-title {
    font-size: var(--text-3xl);
  }
  
  .service-meta {
    flex-direction: column;
    gap: var(--space-lg);
    align-items: start;
  }
  
  .main-image {
    height: 250px;
  }
  
  .provider-stats {
    grid-template-columns: 1fr;
    gap: var(--space-lg);
  }
  
  .price-value {
    font-size: var(--text-4xl);
  }
  
  .thumbnail-list {
    padding: 0 var(--space-md) var(--space-md);
  }
}

@media (max-width: 480px) {
  .breadcrumb-section {
    padding: var(--space-lg) 0;
  }
  
  .breadcrumb {
    font-size: var(--text-xs);
  }
  
  .service-title {
    font-size: var(--text-2xl);
  }
  
  .main-image {
    height: 200px;
  }
  
  .thumbnail {
    width: 60px;
    height: 60px;
  }
}


</style>
