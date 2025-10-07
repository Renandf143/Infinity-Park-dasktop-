<template>
  <div class="search-page">
    <div class="container">
      <!-- Header de Busca -->
      <div class="search-header">
        <h1>Resultados da Busca</h1>
        <div class="search-form">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Buscar serviços..." 
            class="search-input"
            @keypress.enter="performSearch"
          >
          <button class="search-btn" @click="performSearch">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            Buscar
          </button>
        </div>
        
        <div class="search-info" v-if="searchQuery">
          <p>Resultados para: <strong>"{{ searchQuery }}"</strong></p>
          <p v-if="!loading">{{ searchResults.length }} serviços encontrados</p>
        </div>
      </div>

      <!-- Filtros -->
      <div class="filters-section">
        <div class="filters-header">
          <h3>Filtros</h3>
          <button @click="clearFilters" class="clear-filters">Limpar filtros</button>
        </div>
        
        <div class="filters-grid">
          <!-- Categoria -->
          <div class="filter-group">
            <label>Categoria</label>
            <select v-model="filters.category_id" @change="performSearch">
              <option value="">Todas as categorias</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>
          
          <!-- Tipo de Local -->
          <div class="filter-group">
            <label>Tipo de Atendimento</label>
            <select v-model="filters.location_type" @change="performSearch">
              <option value="">Todos</option>
              <option value="presencial">Presencial</option>
              <option value="remoto">Remoto</option>
              <option value="ambos">Ambos</option>
            </select>
          </div>
          
          <!-- Faixa de Preço -->
          <div class="filter-group">
            <label>Preço Mínimo</label>
            <input 
              v-model="filters.price_min" 
              type="number" 
              placeholder="R$ 0"
              @input="performSearch"
            >
          </div>
          
          <div class="filter-group">
            <label>Preço Máximo</label>
            <input 
              v-model="filters.price_max" 
              type="number" 
              placeholder="R$ 1000"
              @input="performSearch"
            >
          </div>
        </div>
      </div>

      <!-- Resultados -->
      <div class="results-section">
        <!-- Loading -->
        <div v-if="loading" class="loading-results">
          <div class="result-loading-card" v-for="i in 6" :key="i">
            <div class="loading-image"></div>
            <div class="loading-content">
              <div class="loading-title"></div>
              <div class="loading-description"></div>
              <div class="loading-price"></div>
            </div>
          </div>
        </div>

        <!-- Resultados -->
        <div v-else-if="searchResults.length > 0" class="results-grid">
          <div class="service-result-card" v-for="service in searchResults" :key="service.id">
            <div class="service-image">
              <img :src="service.image" :alt="service.title" />
              <div class="service-badge" v-if="service.rating > 0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                </svg>
                {{ service.rating }}
              </div>
            </div>
            
            <div class="service-content">
              <div class="service-category" v-if="service.category">
                <span :style="{ color: service.category.color }">{{ service.category.name }}</span>
              </div>
              
              <h3>{{ service.title }}</h3>
              <p>{{ service.description }}</p>
              
              <div class="service-provider" v-if="service.provider">
                <img :src="service.provider.avatar || '/images/avatar-placeholder.jpg'" :alt="service.provider.name" />
                <span>{{ service.provider.name }}</span>
              </div>
              
              <div class="service-details">
                <div class="service-price" v-if="service.price">
                  <span class="price-label">A partir de</span>
                  <span class="price-value">R$ {{ service.price }}</span>
                </div>
                
                <div class="service-location">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span>{{ getLocationText(service.locationType) }}</span>
                </div>
              </div>
              
              <button class="service-btn" @click="navigateTo(`/servico/${service.id}`)">
                Ver detalhes
              </button>
            </div>
          </div>
        </div>

        <!-- Nenhum resultado -->
        <div v-else class="no-results">
          <div class="no-results-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
          <h3>Nenhum serviço encontrado</h3>
          <p>Tente ajustar os filtros ou usar termos diferentes na busca.</p>
          <button @click="clearSearch" class="clear-search-btn">Nova busca</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const { searchServices } = useServices()
const { formattedCategories, fetchCategories } = useCategories()

// Estados
const searchQuery = ref(route.query.q || '')
const searchResults = ref([])
const categories = ref([])
const loading = ref(false)

// Filtros
const filters = ref({
  category_id: '',
  location_type: '',
  price_min: '',
  price_max: ''
})

// Buscar serviços
const performSearch = async () => {
  if (!searchQuery.value.trim()) return
  
  try {
    loading.value = true
    
    const result = await searchServices(searchQuery.value, {
      category_id: filters.value.category_id || undefined,
      location_type: filters.value.location_type || undefined,
      price_min: filters.value.price_min ? parseFloat(filters.value.price_min) : undefined,
      price_max: filters.value.price_max ? parseFloat(filters.value.price_max) : undefined
    })
    
    if (result.success) {
      searchResults.value = result.data.map(service => ({
        id: service.id,
        title: service.title,
        description: service.description,
        price: service.price_value,
        rating: service.rating || 0,
        image: service.images?.[0] || '/images/service-placeholder.jpg',
        provider: {
          name: service.provider?.full_name,
          avatar: service.provider?.avatar_url
        },
        category: {
          name: service.category?.name,
          color: service.category?.color
        },
        locationType: service.location_type
      }))
    }
  } catch (error) {
    console.error('Erro na busca:', error)
  } finally {
    loading.value = false
  }
}

// Limpar filtros
const clearFilters = () => {
  filters.value = {
    category_id: '',
    location_type: '',
    price_min: '',
    price_max: ''
  }
  performSearch()
}

// Limpar busca
const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
  clearFilters()
}

// Função para texto de localização
const getLocationText = (locationType) => {
  const locationMap = {
    'presencial': 'Presencial',
    'remoto': 'Remoto',
    'ambos': 'Presencial ou Remoto'
  }
  return locationMap[locationType] || 'Não especificado'
}

// Carregar dados iniciais
onMounted(async () => {
  // Carregar categorias
  await fetchCategories()
  categories.value = formattedCategories.value
  
  // Fazer busca inicial se houver query
  if (searchQuery.value) {
    await performSearch()
  }
})

// Observar mudanças na query da URL
watch(() => route.query.q, (newQuery) => {
  if (newQuery && newQuery !== searchQuery.value) {
    searchQuery.value = newQuery
    performSearch()
  }
})

useHead({
  title: `Buscar Serviços${searchQuery.value ? ` - ${searchQuery.value}` : ''} | ServiFlix`,
  meta: [
    { name: 'description', content: 'Encontre os melhores profissionais e serviços em Ceilândia' }
  ]
})
</script>

<style scoped>
.search-page {
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

/* Header de Busca */
.search-header {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 32px;
}

.search-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 24px;
}

.search-form {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.search-input {
  flex: 1;
  padding: 16px 20px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 16px;
  background: white;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #3b82f6;
  color: white;
  border: none;
  padding: 16px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-btn:hover {
  background: #2563eb;
}

.search-info {
  color: #6b7280;
}

.search-info strong {
  color: #1f2937;
}

/* Filtros */
.filters-section {
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 32px;
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.filters-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.clear-filters {
  background: none;
  border: 1px solid #e5e7eb;
  color: #6b7280;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-filters:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-group label {
  font-weight: 500;
  color: #374151;
  font-size: 14px;
}

.filter-group select,
.filter-group input {
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
}

.filter-group select:focus,
.filter-group input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Resultados */
.results-section {
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.loading-results {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.result-loading-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  animation: pulse 2s infinite;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.service-result-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  background: white;
}

.service-result-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.service-image {
  position: relative;
  height: 180px;
  background: #f3f4f6;
}

.service-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.service-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(59, 130, 246, 0.9);
  color: white;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

.service-content {
  padding: 20px;
}

.service-category {
  margin-bottom: 8px;
}

.service-category span {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.service-content h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.service-content p {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 16px;
  line-height: 1.5;
}

.service-provider {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.service-provider img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.service-provider span {
  font-size: 14px;
  color: #6b7280;
}

.service-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.service-price {
  display: flex;
  flex-direction: column;
}

.price-label {
  font-size: 12px;
  color: #6b7280;
}

.price-value {
  font-size: 16px;
  font-weight: 600;
  color: #3b82f6;
}

.service-location {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #6b7280;
  font-size: 12px;
}

.service-btn {
  width: 100%;
  background: #3b82f6;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.service-btn:hover {
  background: #2563eb;
}

/* Nenhum resultado */
.no-results {
  text-align: center;
  padding: 80px 20px;
}

.no-results-icon {
  color: #9ca3af;
  margin-bottom: 24px;
}

.no-results h3 {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
}

.no-results p {
  color: #6b7280;
  margin-bottom: 32px;
}

.clear-search-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-search-btn:hover {
  background: #2563eb;
}

/* Loading animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.loading-image {
  height: 180px;
  background: #f3f4f6;
}

.loading-content {
  padding: 20px;
}

.loading-title {
  height: 20px;
  background: #f3f4f6;
  border-radius: 4px;
  margin-bottom: 12px;
}

.loading-description {
  height: 16px;
  background: #f3f4f6;
  border-radius: 4px;
  margin-bottom: 16px;
  width: 80%;
}

.loading-price {
  height: 16px;
  background: #f3f4f6;
  border-radius: 4px;
  width: 60%;
}

/* Responsive */
@media (max-width: 1024px) {
  .filters-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .results-grid,
  .loading-results {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .search-page {
    padding-top: 100px;
  }
  
  .search-header,
  .filters-section,
  .results-section {
    padding: 24px;
  }
  
  .search-form {
    flex-direction: column;
  }
  
  .filters-grid {
    grid-template-columns: 1fr;
  }
  
  .results-grid,
  .loading-results {
    grid-template-columns: 1fr;
  }
  
  .service-details {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>