<template>
  <div class="category-page">
    <!-- Hero da Categoria -->
    <section class="category-hero">
      <div class="hero-background"></div>
      <div class="container-custom">
        <nav class="breadcrumb" aria-label="Navegação estrutural">
          <NuxtLink to="/" class="breadcrumb-link">
            <svg class="breadcrumb-icon" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
            </svg>
            Início
          </NuxtLink>
          <svg class="breadcrumb-separator" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
          </svg>
          <span class="breadcrumb-current">{{ categoryData.name }}</span>
        </nav>
        
        <div class="hero-content">
          <div class="category-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/>
            </svg>
          </div>
          <div class="hero-text">
            <h1 class="category-title">{{ categoryData.name }}</h1>
            <p class="category-description">{{ categoryData.description }}</p>
            <div class="category-stats">
              <div class="stat-item">
                <span class="stat-number">{{ categoryData.totalServices }}</span>
                <span class="stat-label">Serviços</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ categoryData.totalProviders }}</span>
                <span class="stat-label">Profissionais</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ categoryData.avgRating }}</span>
                <span class="stat-label">⭐ Avaliação</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Filtros e Busca -->
    <section class="filters-section" role="search" aria-label="Filtros de busca">
      <div class="container-custom">
        <div class="filters-container">
          <div class="search-box">
            <div class="search-input-wrapper">
              <svg class="search-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
              </svg>
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="Buscar serviços..."
                class="search-input"
                aria-label="Buscar serviços"
              >
              <button 
                v-if="searchQuery" 
                @click="searchQuery = ''"
                class="clear-search"
                aria-label="Limpar busca"
              >
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="filters-group">
            <div class="filter-item">
              <label for="price-filter" class="filter-label">Preço:</label>
              <select v-model="priceFilter" id="price-filter" class="filter-select">
                <option value="">Todos os preços</option>
                <option value="0-50">Até R$ 50</option>
                <option value="50-100">R$ 50 - R$ 100</option>
                <option value="100-200">R$ 100 - R$ 200</option>
                <option value="200+">Acima de R$ 200</option>
              </select>
            </div>

            <div class="filter-item">
              <label for="rating-filter" class="filter-label">Avaliação:</label>
              <select v-model="ratingFilter" id="rating-filter" class="filter-select">
                <option value="">Todas as avaliações</option>
                <option value="5">⭐ 5 estrelas</option>
                <option value="4">⭐ 4+ estrelas</option>
                <option value="3">⭐ 3+ estrelas</option>
              </select>
            </div>

            <div class="filter-item">
              <label for="sort-filter" class="filter-label">Ordenar:</label>
              <select v-model="sortBy" id="sort-filter" class="filter-select">
                <option value="relevance">Mais relevantes</option>
                <option value="price-asc">Menor preço</option>
                <option value="price-desc">Maior preço</option>
                <option value="rating">Melhor avaliados</option>
              </select>
            </div>

            <button 
              @click="clearAllFilters"
              class="clear-filters-btn"
              :disabled="!hasActiveFilters"
            >
              Limpar filtros
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Lista de Serviços -->
    <section class="services-list-section">
      <div class="container-custom">
        <div class="results-header">
          <div class="results-info">
            <h2 class="results-title">
              {{ filteredServices.length }} 
              {{ filteredServices.length === 1 ? 'serviço encontrado' : 'serviços encontrados' }}
            </h2>
            <p class="results-subtitle" v-if="hasActiveFilters">
              Filtros aplicados: {{ getActiveFiltersText() }}
            </p>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredServices.length === 0" class="empty-state">
          <div class="empty-icon">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
            </svg>
          </div>
          <h3>Nenhum serviço encontrado</h3>
          <p>Tente ajustar os filtros ou buscar por outros termos</p>
          <button @click="clearAllFilters" class="btn-clear-filters">
            Limpar todos os filtros
          </button>
        </div>

        <!-- Services Grid -->
        <div v-else class="services-container">
          <article 
            v-for="service in paginatedServices" 
            :key="service.id"
            class="service-card"
            :class="{ 'featured': service.featured }"
          >
            <div class="service-image-wrapper">
              <img 
                :src="service.image" 
                :alt="service.title" 
                class="service-img"
                loading="lazy"
              >
              <div class="service-badges">
                <span v-if="service.featured" class="badge badge-featured">Destaque</span>
                <span class="badge badge-price-type">{{ service.priceType }}</span>
              </div>
            </div>
            
            <div class="service-content">
              <header class="service-header">
                <h3 class="service-title">{{ service.title }}</h3>
                <p class="service-description">{{ service.description }}</p>
              </header>
              
              <div class="provider-info">
                <img 
                  :src="service.provider.avatar" 
                  :alt="service.provider.name" 
                  class="provider-avatar"
                  loading="lazy"
                >
                <div class="provider-details">
                  <p class="provider-name">{{ service.provider.name }}</p>
                  <div class="provider-rating">
                    <div class="stars" :aria-label="`${service.rating} estrelas`">
                      {{ getStars(service.rating) }}
                    </div>
                    <span class="rating-value">{{ service.rating }} ({{ service.reviews }} avaliações)</span>
                  </div>
                  <div class="provider-badges">
                    <span v-if="service.provider.verified" class="badge badge-verified">
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                      </svg>
                      Verificado
                    </span>
                    <span v-if="service.provider.online" class="badge badge-online">Online</span>
                  </div>
                </div>
              </div>

              <footer class="service-footer">
                <div class="service-price">
                  <span class="price-label">A partir de</span>
                  <span class="price-value">R$ {{ formatPrice(service.price) }}</span>
                </div>
                <div class="service-actions">
                  <button class="btn-secondary" @click="contactProvider(service.provider.id)">
                    Contatar
                  </button>
                  <NuxtLink :to="`/servicos/${service.id}`" class="btn-primary">
                    Ver detalhes
                  </NuxtLink>
                </div>
              </footer>
            </div>
          </article>
        </div>

        <!-- Paginação -->
        <nav class="pagination" aria-label="Navegação de páginas" v-if="totalPages > 1">
          <button 
            class="pagination-btn"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
            aria-label="Página anterior"
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            Anterior
          </button>
          
          <div class="pagination-numbers">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="goToPage(page)"
              :class="['pagination-number', { active: page === currentPage }]"
              :aria-label="`Página ${page}`"
              :aria-current="page === currentPage ? 'page' : undefined"
            >
              {{ page }}
            </button>
          </div>
          
          <button 
            class="pagination-btn"
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
            aria-label="Próxima página"
          >
            Próxima
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
            </svg>
          </button>
        </nav>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container-custom">
        <div class="cta-content">
          <div class="cta-icon">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
            </svg>
          </div>
          <h2>Não encontrou o que procura?</h2>
          <p>Publique sua necessidade e receba propostas personalizadas de profissionais qualificados da sua região</p>
          <div class="cta-actions">
            <button class="btn-cta-primary" @click="openRequestModal">
              Solicitar orçamento gratuito
            </button>
            <NuxtLink to="/como-funciona" class="btn-cta-secondary">
              Como funciona
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const route = useRoute()
const slug = route.params.slug

// Estados
const searchQuery = ref('')
const priceFilter = ref('')
const ratingFilter = ref('')
const sortBy = ref('relevance')
const currentPage = ref(1)
const itemsPerPage = ref(12)

// Dados da categoria
const categoryData = ref({
  name: getCategoryName(slug),
  description: getCategoryDescription(slug),
  totalServices: 1250,
  totalProviders: 340,
  avgRating: 4.8
})

// Serviços
const services = ref([
  {
    id: 1,
    title: 'Jardinagem e Paisagismo Completo',
    description: 'Cuidado completo do seu jardim com poda, plantio e design paisagístico profissional',
    price: 120,
    priceType: 'Por hora',
    rating: 4.9,
    reviews: 234,
    featured: true,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop',
    provider: {
      id: 1,
      name: 'João Silva',
      avatar: 'https://via.placeholder.com/60x60?text=JS',
      verified: true,
      online: true
    }
  },
  {
    id: 2,
    title: 'Limpeza de Piscina Profissional',
    description: 'Manutenção completa de piscinas com tratamento químico e limpeza especializada',
    price: 150,
    priceType: 'Preço fixo',
    rating: 4.8,
    reviews: 189,
    featured: false,
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=250&fit=crop',
    provider: {
      id: 2,
      name: 'Maria Santos',
      avatar: 'https://via.placeholder.com/60x60?text=MS',
      verified: true,
      online: false
    }
  },
  {
    id: 3,
    title: 'Instalação de Deck e Pergolado',
    description: 'Instalação profissional de decks de madeira e pergolados para área externa',
    price: 350,
    priceType: 'Por projeto',
    rating: 4.7,
    reviews: 156,
    featured: true,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=250&fit=crop',
    provider: {
      id: 3,
      name: 'Carlos Oliveira',
      avatar: 'https://via.placeholder.com/60x60?text=CO',
      verified: false,
      online: true
    }
  }
])

// Computed
const filteredServices = computed(() => {
  let result = services.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(s => 
      s.title.toLowerCase().includes(query) ||
      s.description.toLowerCase().includes(query) ||
      s.provider.name.toLowerCase().includes(query)
    )
  }

  if (priceFilter.value) {
    const [min, max] = priceFilter.value.split('-')
    result = result.filter(s => {
      if (max === '+') return s.price >= parseInt(min)
      return s.price >= parseInt(min) && s.price <= parseInt(max)
    })
  }

  if (ratingFilter.value) {
    result = result.filter(s => s.rating >= parseInt(ratingFilter.value))
  }

  if (sortBy.value === 'price-asc') {
    result.sort((a, b) => a.price - b.price)
  } else if (sortBy.value === 'price-desc') {
    result.sort((a, b) => b.price - a.price)
  } else if (sortBy.value === 'rating') {
    result.sort((a, b) => b.rating - a.rating)
  } else {
    result.sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return b.rating - a.rating
    })
  }

  return result
})

const totalPages = computed(() => Math.ceil(filteredServices.value.length / itemsPerPage.value))

const paginatedServices = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredServices.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
})

const hasActiveFilters = computed(() => {
  return searchQuery.value || priceFilter.value || ratingFilter.value || sortBy.value !== 'relevance'
})

// Funções
function getCategoryName(slug) {
  const categories = {
    'casa-jardim': 'Casa e Jardim',
    'reformas': 'Reformas',
    'limpeza': 'Limpeza',
    'assistencia-tecnica': 'Assistência Técnica',
    'design-tecnologia': 'Design e Tecnologia',
    'aulas': 'Aulas',
    'automoveis': 'Automóveis',
    'beleza-bem-estar': 'Beleza e Bem-estar',
    'eventos': 'Eventos',
    'saude': 'Saúde',
    'transporte': 'Transporte'
  }
  return categories[slug] || 'Categoria'
}

function getCategoryDescription(slug) {
  const descriptions = {
    'casa-jardim': 'Profissionais especializados em serviços para sua casa e área externa',
    'reformas': 'Especialistas em reformas, construção e melhorias residenciais',
    'limpeza': 'Serviços de limpeza residencial e comercial com qualidade garantida',
    'assistencia-tecnica': 'Técnicos qualificados para reparos e manutenção especializada',
    'design-tecnologia': 'Designers e desenvolvedores para projetos digitais e criativos',
    'aulas': 'Professores particulares e instrutores especializados',
    'automoveis': 'Serviços automotivos e manutenção veicular',
    'beleza-bem-estar': 'Profissionais de beleza e bem-estar',
    'eventos': 'Organização e serviços para eventos especiais',
    'saude': 'Profissionais de saúde e cuidados pessoais',
    'transporte': 'Serviços de transporte e logística'
  }
  return descriptions[slug] || 'Encontre os melhores profissionais'
}

function getStars(rating) {
  return '⭐'.repeat(Math.floor(rating))
}

function formatPrice(price) {
  return new Intl.NumberFormat('pt-BR').format(price)
}

function clearAllFilters() {
  searchQuery.value = ''
  priceFilter.value = ''
  ratingFilter.value = ''
  sortBy.value = 'relevance'
  currentPage.value = 1
}

function getActiveFiltersText() {
  const filters = []
  if (searchQuery.value) filters.push(`"${searchQuery.value}"`)
  if (priceFilter.value) filters.push('preço')
  if (ratingFilter.value) filters.push('avaliação')
  if (sortBy.value !== 'relevance') filters.push('ordenação')
  return filters.join(', ')
}

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function contactProvider(providerId) {
  console.log('Contatar provedor:', providerId)
}

function openRequestModal() {
  console.log('Abrir modal de solicitação')
}

// Watch para resetar página quando filtros mudarem
watch([searchQuery, priceFilter, ratingFilter, sortBy], () => {
  currentPage.value = 1
})

// SEO
useHead({
  title: `${categoryData.value.name} - ServiFlix`,
  meta: [
    { name: 'description', content: categoryData.value.description }
  ]
})
</script>
<style 
scoped>
.category-page {
  min-height: 100vh;
  background: var(--bg-secondary);
}

/* Hero Section */
.category-hero {
  position: relative;
  background: var(--gradient-primary);
  color: var(--text-inverse);
  padding: var(--space-6xl) 0 var(--space-5xl);
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-2xl);
  font-size: var(--text-sm);
  position: relative;
  z-index: 2;
}

.breadcrumb-link {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color var(--transition-base);
}

.breadcrumb-link:hover {
  color: var(--text-inverse);
}

.breadcrumb-icon {
  width: 16px;
  height: 16px;
}

.breadcrumb-separator {
  width: 16px;
  height: 16px;
  color: rgba(255, 255, 255, 0.6);
}

.breadcrumb-current {
  color: var(--text-inverse);
  font-weight: 600;
}

.hero-content {
  display: flex;
  align-items: center;
  gap: var(--space-3xl);
  position: relative;
  z-index: 2;
}

.category-icon {
  width: 120px;
  height: 120px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border-radius: var(--radius-2xl);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-inverse);
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.category-icon svg {
  width: 48px;
  height: 48px;
}

.hero-text {
  flex: 1;
}

.category-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  margin-bottom: var(--space-lg);
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.category-description {
  font-size: var(--text-xl);
  margin-bottom: var(--space-2xl);
  opacity: 0.95;
  line-height: 1.6;
}

.category-stats {
  display: flex;
  gap: var(--space-3xl);
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: var(--text-3xl);
  font-weight: 900;
  margin-bottom: var(--space-xs);
  background: linear-gradient(45deg, #ffffff, #e0e7ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: var(--text-sm);
  opacity: 0.9;
  font-weight: 500;
}

/* Filters Section */
.filters-section {
  background: var(--bg-primary);
  padding: var(--space-2xl) 0;
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 80px;
  z-index: var(--z-sticky);
  border-bottom: 1px solid var(--border-primary);
}

.filters-container {
  display: flex;
  gap: var(--space-xl);
  align-items: flex-end;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 300px;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: var(--space-lg);
  width: 20px;
  height: 20px;
  color: var(--text-tertiary);
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: var(--space-lg) var(--space-lg) var(--space-lg) var(--space-5xl);
  border: 2px solid var(--border-primary);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: all var(--transition-base);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.clear-search {
  position: absolute;
  right: var(--space-lg);
  width: 20px;
  height: 20px;
  background: none;
  border: none;
  color: var(--text-tertiary);
  cursor: pointer;
  transition: color var(--transition-base);
}

.clear-search:hover {
  color: var(--text-primary);
}

.filters-group {
  display: flex;
  gap: var(--space-lg);
  align-items: flex-end;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.filter-label {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-primary);
}

.filter-select {
  padding: var(--space-lg) var(--space-xl);
  border: 2px solid var(--border-primary);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  background: var(--bg-primary);
  color: var(--text-primary);
  cursor: pointer;
  transition: all var(--transition-base);
  min-width: 160px;
}

.filter-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.clear-filters-btn {
  padding: var(--space-lg) var(--space-xl);
  background: transparent;
  color: var(--text-tertiary);
  border: 2px solid var(--border-secondary);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
}

.clear-filters-btn:hover:not(:disabled) {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border-color: var(--border-primary);
}

.clear-filters-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Services List Section */
.services-list-section {
  padding: var(--space-5xl) 0;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3xl);
  flex-wrap: wrap;
  gap: var(--space-lg);
}

.results-info {
  flex: 1;
}

.results-title {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
}

.results-subtitle {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-6xl) 0;
  text-align: center;
}

.empty-icon {
  width: 80px;
  height: 80px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-2xl);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
  margin-bottom: var(--space-xl);
}

.empty-icon svg {
  width: 32px;
  height: 32px;
}

.empty-state h3 {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
}

.empty-state p {
  color: var(--text-secondary);
  margin-bottom: var(--space-xl);
}

.btn-clear-filters {
  padding: var(--space-lg) var(--space-2xl);
  background: var(--color-primary);
  color: var(--text-inverse);
  border: none;
  border-radius: var(--radius-lg);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-clear-filters:hover {
  background: var(--color-primary-hover);
  transform: translateY(-2px);
}

/* Services Container */
.services-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: var(--space-2xl);
}

/* Service Cards */
.service-card {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  overflow: hidden;
  border: 1px solid var(--border-primary);
  transition: all var(--transition-base);
  position: relative;
}

.service-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-2xl);
  border-color: var(--color-primary-light);
}

.service-card.featured {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-primary);
}

.service-image-wrapper {
  position: relative;
  height: 200px;
  overflow: hidden;
  background: var(--bg-tertiary);
}

.service-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-base);
}

.service-card:hover .service-img {
  transform: scale(1.05);
}

.service-badges {
  position: absolute;
  top: var(--space-lg);
  left: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.badge {
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.badge-featured {
  background: rgba(16, 185, 129, 0.9);
  color: var(--text-inverse);
}

.badge-price-type {
  background: rgba(255, 255, 255, 0.9);
  color: var(--text-primary);
}

.badge-verified {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  background: rgba(59, 130, 246, 0.1);
  color: var(--color-primary);
}

.badge-verified svg {
  width: 12px;
  height: 12px;
}

.badge-online {
  background: rgba(16, 185, 129, 0.1);
  color: var(--success-600);
}

.service-content {
  padding: var(--space-2xl);
}

.service-header {
  margin-bottom: var(--space-xl);
}

.service-title {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
  line-height: 1.3;
}

.service-description {
  color: var(--text-secondary);
  line-height: 1.6;
  font-size: var(--text-base);
}

.provider-info {
  display: flex;
  gap: var(--space-lg);
  align-items: flex-start;
  margin-bottom: var(--space-xl);
  padding-bottom: var(--space-xl);
  border-bottom: 1px solid var(--border-primary);
}

.provider-avatar {
  width: 50px;
  height: 50px;
  border-radius: var(--radius-full);
  object-fit: cover;
  border: 2px solid var(--border-primary);
}

.provider-details {
  flex: 1;
}

.provider-name {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-xs);
}

.provider-rating {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-sm);
}

.stars {
  color: var(--warning-500);
  font-size: var(--text-base);
}

.rating-value {
  color: var(--text-tertiary);
  font-size: var(--text-sm);
}

.provider-badges {
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.service-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-lg);
}

.service-price {
  display: flex;
  flex-direction: column;
}

.price-label {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.price-value {
  font-size: var(--text-2xl);
  font-weight: 900;
  color: var(--color-primary);
  letter-spacing: -0.02em;
}

.service-actions {
  display: flex;
  gap: var(--space-sm);
}

.btn-secondary {
  padding: var(--space-md) var(--space-lg);
  background: transparent;
  color: var(--text-secondary);
  border: 2px solid var(--border-primary);
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all var(--transition-base);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-secondary:hover {
  background: var(--bg-tertiary);
  border-color: var(--border-secondary);
  color: var(--text-primary);
}

.btn-primary {
  padding: var(--space-md) var(--space-lg);
  background: var(--color-primary);
  color: var(--text-inverse);
  border: none;
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all var(--transition-base);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary:hover {
  background: var(--color-primary-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-primary);
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-lg);
  margin-top: var(--space-5xl);
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-lg);
  background: var(--bg-primary);
  border: 2px solid var(--border-primary);
  border-radius: var(--radius-lg);
  cursor: pointer;
  font-weight: 600;
  color: var(--text-primary);
  transition: all var(--transition-base);
}

.pagination-btn:hover:not(:disabled) {
  background: var(--color-primary);
  color: var(--text-inverse);
  border-color: var(--color-primary);
  transform: translateY(-2px);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn svg {
  width: 16px;
  height: 16px;
}

.pagination-numbers {
  display: flex;
  gap: var(--space-sm);
}

.pagination-number {
  width: 40px;
  height: 40px;
  background: var(--bg-primary);
  border: 2px solid var(--border-primary);
  border-radius: var(--radius-lg);
  cursor: pointer;
  font-weight: 600;
  color: var(--text-primary);
  transition: all var(--transition-base);
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-number:hover {
  background: var(--bg-tertiary);
  border-color: var(--border-secondary);
}

.pagination-number.active {
  background: var(--color-primary);
  color: var(--text-inverse);
  border-color: var(--color-primary);
}

/* CTA Section */
.cta-section {
  background: var(--gradient-primary);
  padding: var(--space-6xl) 0;
  margin-top: var(--space-5xl);
  position: relative;
  overflow: hidden;
}

.cta-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.cta-content {
  text-align: center;
  color: var(--text-inverse);
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
}

.cta-icon {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-2xl);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-xl);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.cta-icon svg {
  width: 32px;
  height: 32px;
}

.cta-content h2 {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 900;
  margin-bottom: var(--space-lg);
  letter-spacing: -0.02em;
}

.cta-content p {
  font-size: var(--text-xl);
  margin-bottom: var(--space-3xl);
  opacity: 0.95;
  line-height: 1.6;
}

.cta-actions {
  display: flex;
  gap: var(--space-lg);
  justify-content: center;
  flex-wrap: wrap;
}

.btn-cta-primary {
  padding: var(--space-lg) var(--space-3xl);
  background: var(--text-inverse);
  color: var(--color-primary);
  border: none;
  border-radius: var(--radius-xl);
  font-size: var(--text-lg);
  font-weight: 700;
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-lg);
}

.btn-cta-primary:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-2xl);
  background: var(--gray-50);
}

.btn-cta-secondary {
  padding: var(--space-lg) var(--space-3xl);
  background: transparent;
  color: var(--text-inverse);
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: var(--radius-xl);
  font-size: var(--text-lg);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-cta-secondary:hover {
  background: var(--text-inverse);
  color: var(--color-primary);
  transform: translateY(-4px);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .hero-content {
    flex-direction: column;
    text-align: center;
    gap: var(--space-2xl);
  }
  
  .category-stats {
    justify-content: center;
  }
  
  .services-container {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }
}

@media (max-width: 768px) {
  .category-hero {
    padding: var(--space-4xl) 0 var(--space-3xl);
  }
  
  .filters-container {
    flex-direction: column;
    gap: var(--space-lg);
  }
  
  .search-box {
    min-width: 100%;
  }
  
  .filters-group {
    flex-direction: column;
    width: 100%;
  }
  
  .filter-item {
    width: 100%;
  }
  
  .filter-select {
    min-width: 100%;
  }
  
  .results-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .services-container {
    grid-template-columns: 1fr;
  }
  
  .category-stats {
    flex-direction: column;
    gap: var(--space-lg);
  }
  
  .stat-item {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }
  
  .cta-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .btn-cta-primary,
  .btn-cta-secondary {
    width: 100%;
    max-width: 300px;
  }
  
  .pagination {
    flex-wrap: wrap;
    gap: var(--space-sm);
  }
  
  .pagination-numbers {
    order: -1;
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .service-footer {
    flex-direction: column;
    gap: var(--space-lg);
    align-items: stretch;
  }
  
  .service-actions {
    width: 100%;
  }
  
  .btn-secondary,
  .btn-primary {
    flex: 1;
  }
}
</style>