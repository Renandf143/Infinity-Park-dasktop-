<template>
  <div class="service-detail-page">
    <div class="container">
      <!-- Loading -->
      <div v-if="loading" class="loading-container">
        <div class="loading-header">
          <div class="loading-title"></div>
          <div class="loading-subtitle"></div>
        </div>
        <div class="loading-content">
          <div class="loading-image"></div>
          <div class="loading-info"></div>
        </div>
      </div>

      <!-- Service Details -->
      <div v-else-if="service" class="service-detail">
        <!-- Breadcrumb -->
        <nav class="breadcrumb">
          <NuxtLink to="/">Início</NuxtLink>
          <span>/</span>
          <NuxtLink v-if="service.category" :to="`/categoria/${service.category.slug}`">
            {{ service.category.name }}
          </NuxtLink>
          <span v-if="service.category">/</span>
          <span>{{ service.title }}</span>
        </nav>

        <!-- Service Header -->
        <div class="service-header">
          <div class="service-info">
            <div class="service-category" v-if="service.category">
              <span :style="{ color: service.category.color }">{{ service.category.name }}</span>
            </div>
            <h1>{{ service.title }}</h1>
            <div class="service-rating" v-if="service.rating > 0">
              <div class="stars">
                <svg v-for="star in 5" :key="star" width="16" height="16" viewBox="0 0 24 24" 
                     :fill="star <= service.rating ? '#fbbf24' : 'none'" 
                     :stroke="star <= service.rating ? '#fbbf24' : '#e5e7eb'" stroke-width="2">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                </svg>
              </div>
              <span class="rating-text">{{ service.rating }} ({{ service.totalReviews }} avaliações)</span>
            </div>
          </div>
          
          <div class="service-price" v-if="service.price">
            <div class="price-label">A partir de</div>
            <div class="price-value">R$ {{ service.price }}</div>
            <div class="price-type" v-if="service.priceType">
              {{ getPriceTypeText(service.priceType) }}
            </div>
          </div>
        </div>

        <!-- Service Content -->
        <div class="service-content">
          <!-- Images -->
          <div class="service-images" v-if="service.images && service.images.length > 0">
            <div class="main-image">
              <img :src="currentImage" :alt="service.title" />
            </div>
            <div class="image-thumbnails" v-if="service.images.length > 1">
              <img 
                v-for="(image, index) in service.images" 
                :key="index"
                :src="image" 
                :alt="`${service.title} - Imagem ${index + 1}`"
                :class="{ active: currentImage === image }"
                @click="currentImage = image"
              />
            </div>
          </div>

          <!-- Description -->
          <div class="service-description">
            <h2>Descrição do Serviço</h2>
            <p>{{ service.description }}</p>
            
            <!-- Tags -->
            <div class="service-tags" v-if="service.tags && service.tags.length > 0">
              <h3>Tags</h3>
              <div class="tags-list">
                <span v-for="tag in service.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </div>

            <!-- Service Details -->
            <div class="service-details">
              <h3>Detalhes do Serviço</h3>
              <div class="details-grid">
                <div class="detail-item" v-if="service.locationType">
                  <strong>Tipo de Atendimento:</strong>
                  <span>{{ getLocationText(service.locationType) }}</span>
                </div>
                <div class="detail-item" v-if="service.duration">
                  <strong>Duração Estimada:</strong>
                  <span>{{ getDurationText(service.duration) }}</span>
                </div>
                <div class="detail-item" v-if="service.serviceArea && service.serviceArea.length > 0">
                  <strong>Área de Atendimento:</strong>
                  <span>{{ service.serviceArea.join(', ') }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Provider Info -->
        <div class="provider-section" v-if="service.provider">
          <h2>Sobre o Profissional</h2>
          <div class="provider-card">
            <div class="provider-avatar">
              <img :src="service.provider.avatar || '/images/avatar-placeholder.jpg'" :alt="service.provider.name" />
            </div>
            <div class="provider-info">
              <h3>{{ service.provider.name }}</h3>
              <p>Profissional verificado</p>
              <div class="provider-stats">
                <div class="stat">
                  <strong>{{ service.totalReviews }}</strong>
                  <span>Avaliações</span>
                </div>
                <div class="stat" v-if="service.rating > 0">
                  <strong>{{ service.rating }}</strong>
                  <span>Nota Média</span>
                </div>
              </div>
            </div>
            <div class="provider-actions">
              <button class="contact-btn" @click="contactProvider">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                Entrar em Contato
              </button>
              <button class="hire-btn" @click="hireService">
                Contratar Serviço
              </button>
            </div>
          </div>
        </div>

        <!-- Reviews Section -->
        <div class="reviews-section">
          <h2>Avaliações</h2>
          
          <div v-if="reviews.length > 0" class="reviews-list">
            <div v-for="review in reviews" :key="review.id" class="review-card">
              <div class="review-header">
                <div class="reviewer-info">
                  <img :src="review.reviewer.avatar" :alt="review.reviewer.name" />
                  <div>
                    <h4>{{ review.reviewer.name }}</h4>
                    <div class="review-rating">
                      <svg v-for="star in 5" :key="star" width="14" height="14" viewBox="0 0 24 24" 
                           :fill="star <= review.rating ? '#fbbf24' : 'none'" 
                           :stroke="star <= review.rating ? '#fbbf24' : '#e5e7eb'" stroke-width="2">
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div class="review-date">
                  {{ formatDate(review.createdAt) }}
                </div>
              </div>
              <div class="review-content">
                <h5 v-if="review.title">{{ review.title }}</h5>
                <p>{{ review.comment }}</p>
              </div>
            </div>
          </div>
          
          <div v-else class="no-reviews">
            <p>Este serviço ainda não possui avaliações.</p>
          </div>
        </div>
      </div>

      <!-- Service Not Found -->
      <div v-else class="service-not-found">
        <div class="not-found-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9 9h6v6H9z"/>
          </svg>
        </div>
        <h2>Serviço não encontrado</h2>
        <p>O serviço que você está procurando não existe ou foi removido.</p>
        <NuxtLink to="/" class="back-home-btn">Voltar ao Início</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const { fetchServiceById } = useServices()
const { fetchReviews, formattedReviews } = useReviews()
const { user, isAuthenticated } = useAuth()

// Estados
const service = ref(null)
const reviews = ref([])
const loading = ref(true)
const currentImage = ref('')

// Carregar dados do serviço
const loadService = async () => {
  try {
    loading.value = true
    
    const serviceId = route.params.id
    const result = await fetchServiceById(serviceId)
    
    if (result.success) {
      service.value = {
        id: result.data.id,
        title: result.data.title,
        description: result.data.description,
        price: result.data.price_value,
        priceType: result.data.price_type,
        rating: result.data.rating || 0,
        totalReviews: result.data.total_reviews || 0,
        images: result.data.images || [],
        tags: result.data.tags || [],
        locationType: result.data.location_type,
        serviceArea: result.data.service_area || [],
        duration: result.data.duration_estimate,
        provider: {
          id: result.data.provider?.id,
          name: result.data.provider?.full_name,
          avatar: result.data.provider?.avatar_url,
          phone: result.data.provider?.phone
        },
        category: {
          id: result.data.category?.id,
          name: result.data.category?.name,
          color: result.data.category?.color,
          slug: result.data.category?.name?.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
        }
      }
      
      // Definir imagem atual
      if (service.value.images.length > 0) {
        currentImage.value = service.value.images[0]
      }
      
      // Carregar avaliações
      await loadReviews(serviceId)
    }
  } catch (error) {
    console.error('Erro ao carregar serviço:', error)
  } finally {
    loading.value = false
  }
}

// Carregar avaliações
const loadReviews = async (serviceId) => {
  try {
    const result = await fetchReviews({ service_id: serviceId, limit: 10 })
    if (result.success) {
      reviews.value = formattedReviews.value
    }
  } catch (error) {
    console.error('Erro ao carregar avaliações:', error)
  }
}

// Funções utilitárias
const getPriceTypeText = (priceType) => {
  const typeMap = {
    'fixo': 'Preço fixo',
    'por_hora': 'Por hora',
    'negociavel': 'Negociável'
  }
  return typeMap[priceType] || ''
}

const getLocationText = (locationType) => {
  const locationMap = {
    'presencial': 'Presencial',
    'remoto': 'Remoto',
    'ambos': 'Presencial ou Remoto'
  }
  return locationMap[locationType] || 'Não especificado'
}

const getDurationText = (minutes) => {
  if (minutes < 60) {
    return `${minutes} minutos`
  } else {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    if (remainingMinutes === 0) {
      return `${hours} ${hours === 1 ? 'hora' : 'horas'}`
    } else {
      return `${hours}h ${remainingMinutes}min`
    }
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Ações
const contactProvider = () => {
  if (!isAuthenticated.value) {
    navigateTo('/entrar')
    return
  }
  
  // Implementar lógica de contato
  console.log('Contatar profissional:', service.value.provider)
}

const hireService = () => {
  if (!isAuthenticated.value) {
    navigateTo('/entrar')
    return
  }
  
  // Implementar lógica de contratação
  console.log('Contratar serviço:', service.value)
}

// Carregar dados quando o componente for montado
onMounted(() => {
  loadService()
})

// Meta tags dinâmicas
useHead(() => ({
  title: service.value ? `${service.value.title} | ServiFlix` : 'Carregando... | ServiFlix',
  meta: [
    { 
      name: 'description', 
      content: service.value ? service.value.description : 'Detalhes do serviço' 
    }
  ]
}))
</script>

<style scoped>
.service-detail-page {
  min-height: 100vh;
  background: #f8fafc;
  padding-top: 120px;
  padding-bottom: 80px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Loading */
.loading-container {
  animation: pulse 2s infinite;
}

.loading-header {
  margin-bottom: 32px;
}

.loading-title {
  height: 40px;
  background: #f3f4f6;
  border-radius: 8px;
  margin-bottom: 16px;
  width: 60%;
}

.loading-subtitle {
  height: 20px;
  background: #f3f4f6;
  border-radius: 4px;
  width: 40%;
}

.loading-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.loading-image {
  height: 400px;
  background: #f3f4f6;
  border-radius: 12px;
}

.loading-info {
  height: 400px;
  background: #f3f4f6;
  border-radius: 12px;
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 32px;
  font-size: 14px;
  color: #6b7280;
}

.breadcrumb a {
  color: #3b82f6;
  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

/* Service Header */
.service-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 32px;
}

.service-category span {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.service-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin: 8px 0 16px 0;
}

.service-rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stars {
  display: flex;
  gap: 2px;
}

.rating-text {
  font-size: 14px;
  color: #6b7280;
}

.service-price {
  text-align: right;
}

.price-label {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 4px;
}

.price-value {
  font-size: 32px;
  font-weight: 700;
  color: #3b82f6;
}

.price-type {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}

/* Service Content */
.service-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 32px;
}

.service-images {
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.main-image {
  margin-bottom: 16px;
}

.main-image img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 12px;
}

.image-thumbnails {
  display: flex;
  gap: 8px;
  overflow-x: auto;
}

.image-thumbnails img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.3s ease;
}

.image-thumbnails img.active,
.image-thumbnails img:hover {
  opacity: 1;
  border: 2px solid #3b82f6;
}

.service-description {
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.service-description h2 {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
}

.service-description p {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 24px;
}

.service-tags h3,
.service-details h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.tag {
  background: #f3f4f6;
  color: #6b7280;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.details-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-item strong {
  color: #374151;
}

.detail-item span {
  color: #6b7280;
}

/* Provider Section */
.provider-section {
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 32px;
}

.provider-section h2 {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 24px;
}

.provider-card {
  display: flex;
  align-items: center;
  gap: 24px;
}

.provider-avatar img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.provider-info {
  flex: 1;
}

.provider-info h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.provider-info p {
  color: #6b7280;
  margin-bottom: 12px;
}

.provider-stats {
  display: flex;
  gap: 24px;
}

.stat {
  text-align: center;
}

.stat strong {
  display: block;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.stat span {
  font-size: 12px;
  color: #6b7280;
}

.provider-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contact-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: white;
  border: 1px solid #3b82f6;
  color: #3b82f6;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.contact-btn:hover {
  background: #3b82f6;
  color: white;
}

.hire-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.hire-btn:hover {
  background: #2563eb;
}

/* Reviews Section */
.reviews-section {
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.reviews-section h2 {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 24px;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.review-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.reviewer-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.reviewer-info img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.reviewer-info h4 {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.review-rating {
  display: flex;
  gap: 2px;
}

.review-date {
  font-size: 12px;
  color: #6b7280;
}

.review-content h5 {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.review-content p {
  color: #6b7280;
  line-height: 1.5;
}

.no-reviews {
  text-align: center;
  padding: 40px;
  color: #6b7280;
}

/* Service Not Found */
.service-not-found {
  text-align: center;
  padding: 80px 20px;
}

.not-found-icon {
  color: #9ca3af;
  margin-bottom: 24px;
}

.service-not-found h2 {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
}

.service-not-found p {
  color: #6b7280;
  margin-bottom: 32px;
}

.back-home-btn {
  display: inline-block;
  background: #3b82f6;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.back-home-btn:hover {
  background: #2563eb;
}

/* Animations */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .service-header {
    flex-direction: column;
    gap: 24px;
  }
  
  .service-price {
    text-align: left;
  }
  
  .service-content {
    grid-template-columns: 1fr;
  }
  
  .provider-card {
    flex-direction: column;
    text-align: center;
  }
  
  .provider-actions {
    flex-direction: row;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .service-detail-page {
    padding-top: 100px;
  }
  
  .service-header,
  .service-images,
  .service-description,
  .provider-section,
  .reviews-section {
    padding: 24px;
  }
  
  .service-header h1 {
    font-size: 24px;
  }
  
  .price-value {
    font-size: 24px;
  }
  
  .provider-actions {
    flex-direction: column;
    width: 100%;
  }
}
</style>