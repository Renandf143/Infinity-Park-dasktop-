<template>
  <div class="category-page">
    <div class="container">
      <!-- Category Header -->
      <div class="category-header">
        <nav class="breadcrumb">
          <NuxtLink to="/">Início</NuxtLink>
          <span>/</span>
          <span>{{ category?.name || 'Categoria' }}</span>
        </nav>
        
        <div v-if="category" class="category-info">
          <div class="category-icon" :style="{ background: category.color }">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path :d="category.iconPath"/>
            </svg>
          </div>
          <div class="category-text">
            <h1>{{ category.name }}</h1>
            <p v-if="category.description">{{ category.description }}</p>
            <div class="category-stats">
              <span>{{ services.length }} serviços disponíveis</span>
            </div>
          </div>
        </div>
        
        <div v-else-if="loading" class="category-loading">
          <div class="loading-icon"></div>
          <div class="loading-text">
            <div class="loading-title"></div>
            <div class="loading-description"></div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters-section">
        <div class="filters-header">
          <h3>Filtrar Resultados</h3>
          <button @click="clearFilters" class="clear-filters">Limpar filtros</button>
        </div>
        
        <div class="filters-grid">
          <!-- Subcategoria -->
          <div class="filter-group" v-if="subcategories.length > 0">
            <label>Subcategoria</label>
            <select v-model="filters.subcategory_id" @change="applyFilters">
              <option value="">Todas as subcategorias</option>
              <option v-for="subcategory in subcategories" :key="subcategory.id" :value="subcategory.id">
                {{ subcategory.name }}
              </option>
            </select>
          </div>
          
          <!-- Tipo de Local -->
          <div class="filter-group">
            <label>Tipo de Atendimento</label>
            <select v-model="filters.location_type" @change="applyFilters">
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
              @input="applyFilters"
            >
          </div>
          
          <div class="filter-group">
            <label>Preço Máximo</label>
            <input 
              v-model="filters.price_max" 
              type="number" 
              placeholder="R$ 1000"
              @input="applyFilters"
            >
          </div>
          
          <!-- Ordenação -->
          <div class="filter-group">
            <label>Ordenar por</label>
            <select v-model="filters.orderBy" @change="applyFilters">
              <option value="rating">Melhor avaliados</option>
              <option value="price_value">Menor preço</option>
              <option value="created_at">Mais recentes</option>
              <option value="total_reviews">Mais avaliados</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Services Grid -->
      <div class="services-section">
        <!-- Loading -->
        <div v-if="loading" class="services-loading">
          <div class="service-loading-card" v-for="i in 9" :key="i">
            <div class="loading-image"></div>
            <div class="loading-content">
              <div class="loading-title"></div>
              <div class="loading-description"></div>
              <div class="loading-price"></div>
            </div>
          </div>
        </div>

        <!-- Services -->
        <div v-else-if="services.length > 0" class="services-grid">
          <div class="service-card" v-for="service in services" :key="service.id">
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

        <!-- No Services -->
        <div v-else class="no-services">
          <div class="no-services-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9 9h6v6H9z"/>
            </svg>
          </div>
          <h3>Nenhum serviço encontrado</h3>
          <p>Não há serviços disponíveis nesta categoria no momento.</p>
          <NuxtLink to="/" class="back-home-btn">Explorar outras categorias</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const { fetchServices, formattedServices } = useServices()
const { getCategoryByName, fetchSubcategories } = useCategories()

// Estados
const category = ref(null)
const subcategories = ref([])
const services = ref([])
const loading = ref(true)

// Filtros
const filters = ref({
  subcategory_id: '',
  location_type: '',
  price_min: '',
  price_max: '',
  orderBy: 'rating'
})

// Carregar dados da categoria
const loadCategory = async () => {
  try {
    const slug = route.params.slug
    
    // Buscar categoria pelo slug (nome)
    const categoryName = slug.replace(/-/g, ' ')
    const foundCategory = getCategoryByName(categoryName)
    
    if (foundCategory) {
      category.value = foundCategory
      
      // Carregar subcategorias
      const subcategoriesResult = await fetchSubcategories(foundCategory.id)
      if (subcategoriesResult.success) {
        subcategories.value = subcategoriesResult.data
      }
      
      // Carregar serviços da categoria
      await loadServices()
    } else {
      // Categoria não encontrada
      category.value = null
    }
  } catch (error) {
    console.error('Erro ao carregar categoria:', error)
  }
}

// Carregar serviços
const loadServices = async () => {
  if (!category.value) return
  
  try {
    loading.value = true
    
    const filterParams = {
      category_id: filters.value.subcategory_id || category.value.id,
      location_type: filters.value.location_type || undefined,
      price_min: filters.value.price_min ? parseFloat(filters.value.price_min) : undefined,
      price_max: filters.value.price_max ? parseFloat(filters.value.price_max) : undefined,
      orderBy: filters.value.orderBy,
      orderDirection: filters.value.orderBy === 'price_value' ? 'asc' : 'desc'
    }
    
    const result = await fetchServices(filterParams)
    
    if (result.success) {
      services.value = formattedServices.value
    }
  } catch (error) {
    console.error('Erro ao carregar serviços:', error)
  } finally {
    loading.value = false
  }
}

// Aplicar filtros
const applyFilters = () => {
  loadServices()
}

// Limpar filtros
const clearFilters = () => {
  filters.value = {
    subcategory_id: '',
    location_type: '',
    price_min: '',
    price_max: '',
    orderBy: 'rating'
  }
  loadServices()
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

// Carregar dados quando o componente for montado
onMounted(() => {
  loadCategory()
})

// Observar mudanças na rota
watch(() => route.params.slug, () => {
  loadCategory()
})

// Meta tags dinâmicas
useHead(() => ({
  title: category.value ? `${category.value.name} | ServiFlix` : 'Categoria | ServiFlix',
  meta: [
    { 
      name: 'description', 
      content: category.value 
        ? `Encontre os melhores profissionais de ${category.value.name} em Ceilândia`
        : 'Serviços profissionais em Ceilândia'
    }
  ]
}))
</script>

<style scoped>
.category-page {
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

/* Category Header */
.category-header {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 32px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
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

.category-info {
  display: flex;
  align-items: center;
  gap: 24px;
}

.category-icon {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.category-text h1 {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
}

.category-text p {
  color: #6b7280;
  margin-bottom: 12px;
  line-height: 1.5;
}

.category-stats span {
  font-size: 14px;
  color: #3b82f6;
  font-weight: 500;
}

.category-loading {
  display: flex;
  align-items: center;
  gap: 24px;
  animation: pulse 2s infinite;
}

.loading-icon {
  width: 80px;
  height: 80px;
  background: #f3f4f6;
  border-radius: 20px;
}

.loading-text {
  flex: 1;
}

.loading-title {
  height: 32px;
  background: #f3f4f6;
  border-radius: 8px;
  margin-bottom: 12px;
  width: 60%;
}

.loading-description {
  height: 20px;
  background: #f3f4f6;
  border-radius: 4px;
  width: 80%;
}

/* Filters */
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
  grid-template-columns: repeat(5, 1fr);
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

/* Services Section */
.services-section {
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.services-loading {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.service-loading-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  animation: pulse 2s infinite;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.service-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  background: white;
}

.service-card:hover {
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

/* No Services */
.no-services {
  text-align: center;
  padding: 80px 20px;
}

.no-services-icon {
  color: #9ca3af;
  margin-bottom: 24px;
}

.no-services h3 {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
}

.no-services p {
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
    grid-template-columns: repeat(3, 1fr);
  }
  
  .services-grid,
  .services-loading {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .category-page {
    padding-top: 100px;
  }
  
  .category-header,
  .filters-section,
  .services-section {
    padding: 24px;
  }
  
  .category-info {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  
  .category-text h1 {
    font-size: 24px;
  }
  
  .filters-grid {
    grid-template-columns: 1fr;
  }
  
  .services-grid,
  .services-loading {
    grid-template-columns: 1fr;
  }
  
  .service-details {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>