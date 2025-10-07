<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 12l2 2 4-4"/>
              <circle cx="12" cy="12" r="9"/>
            </svg>
            <span v-if="platformStats.professionals">
              Mais de {{ platformStats.professionals.raw || platformStats.professionals.value }} profissionais selecionados
            </span>
            <span v-else>Profissionais qualificados e verificados</span>
          </div>
          
          <h1 class="hero-title">
            Encontre o <span class="highlight">profissional</span><br>
            <span class="highlight">perfeito</span> para qualquer<br>
            serviço
          </h1>
          
          <p class="hero-description">
            Conectamos você aos melhores especialistas de sua região.<br>
            Rápido, seguro e com garantia de qualidade.
          </p>
          
          <div class="hero-search">
            <div class="search-container">
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="Que serviço você precisa?" 
                class="search-input"
                @keypress.enter="handleSearch"
              >
              <button class="search-btn" @click="handleSearch">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
                Buscar
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categorias Populares -->
    <section class="categories">
      <div class="container">
        <div class="section-header">
          <h2>Categorias Populares</h2>
        </div>
        
        <!-- Loading state -->
        <div v-if="loading" class="loading-grid">
          <div class="loading-item" v-for="i in 6" :key="i">
            <div class="loading-icon"></div>
            <div class="loading-text"></div>
          </div>
        </div>
        
        <!-- Categories grid -->
        <div v-else class="categories-grid">
          <div class="category-item" v-for="category in categories" :key="category.id" @click="navigateToCategory(category.slug)">
            <div class="category-icon" :style="{ background: category.color }">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path :d="category.iconPath"/>
              </svg>
            </div>
            <h3>{{ category.name }}</h3>
          </div>
        </div>
      </div>
    </section>

    <!-- Principais Serviços Pedidos -->
    <section class="featured-services">
      <div class="container">
        <div class="section-header">
          <h2>Principais serviços pedidos</h2>
          <p>Veja os profissionais mais bem avaliados em cada categoria</p>
        </div>
        
        <!-- Loading state -->
        <div v-if="loading" class="services-loading">
          <div class="service-loading-card" v-for="i in 3" :key="i">
            <div class="loading-image"></div>
            <div class="loading-content">
              <div class="loading-title"></div>
              <div class="loading-description"></div>
              <div class="loading-price"></div>
            </div>
          </div>
        </div>
        
        <!-- Services grid -->
        <div v-else class="services-grid">
          <div class="service-card" v-for="service in featuredServices" :key="service.id">
            <div class="service-image">
              <img :src="service.image" :alt="service.title" />
              <div class="service-badge" v-if="service.rating">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                </svg>
                {{ service.rating }}
              </div>
            </div>
            <div class="service-content">
              <h3>{{ service.title }}</h3>
              <p>{{ service.description }}</p>
              <div class="service-price" v-if="service.price">
                A partir de <span>R$ {{ service.price }}</span>
              </div>
              <button class="service-btn" @click="navigateTo(`/servico/${service.id}`)">Ver detalhes</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Como Funciona -->
    <section class="how-it-works">
      <div class="container">
        <div class="section-header">
          <h2>Como funciona</h2>
        </div>
        
        <div class="steps-grid">
          <div class="step-item" v-for="step in steps" :key="step.number">
            <div class="step-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path :d="step.iconPath"/>
              </svg>
            </div>
            <div class="step-number">{{ step.number }}</div>
            <h3>{{ step.title }}</h3>
            <p>{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Depoimentos -->
    <section class="testimonials">
      <div class="container">
        <div class="section-header">
          <h2>O que nossos clientes dizem</h2>
        </div>
        
        <div class="testimonials-grid">
          <div class="testimonial-card" v-for="testimonial in testimonials" :key="testimonial.id">
            <div class="testimonial-rating">
              <svg v-for="star in 5" :key="star" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
              </svg>
            </div>
            <p>"{{ testimonial.text }}"</p>
            <div class="testimonial-author">
              <div class="author-avatar">
                <img :src="testimonial.avatar" :alt="testimonial.name" />
              </div>
              <div class="author-info">
                <h4>{{ testimonial.name }}</h4>
                <span>{{ testimonial.location }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Por que escolher o ServiFlix -->
    <section class="why-choose">
      <div class="container">
        <div class="section-header">
          <h2>Por que escolher o ServiFlix</h2>
        </div>
        
        <div class="features-grid">
          <div class="feature-item" v-for="feature in features" :key="feature.id">
            <div class="feature-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path :d="feature.iconPath"/>
              </svg>
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Para Profissionais -->
    <section class="for-professionals">
      <div class="container">
        <div class="section-header">
          <h2>Faça parte da nossa rede</h2>
          <p>Cadastre-se como profissional e encontre novos clientes</p>
        </div>
        
        <div class="professional-cta">
          <div class="professional-content">
            <div class="professional-stats">
              <div class="stat-item" v-if="platformStats.professionals">
                <div class="stat-number">{{ platformStats.professionals.value }}</div>
                <div class="stat-label">{{ platformStats.professionals.label }}</div>
              </div>
              <div class="stat-item" v-if="platformStats.services">
                <div class="stat-number">{{ platformStats.services.value }}</div>
                <div class="stat-label">{{ platformStats.services.label }}</div>
              </div>
              <div class="stat-item" v-if="platformStats.rating">
                <div class="stat-number">{{ platformStats.rating.value }}</div>
                <div class="stat-label">{{ platformStats.rating.label }}</div>
              </div>
            </div>
            <button class="professional-btn">Cadastrar como profissional</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter -->
    <section class="newsletter">
      <div class="container">
        <div class="newsletter-content">
          <h2>Fique por dentro das novidades</h2>
          <p>Receba dicas, promoções e novidades do ServiFlix</p>
          <div class="newsletter-form">
            <input 
              v-model="emailNewsletter"
              type="email" 
              placeholder="Seu melhor e-mail"
              class="newsletter-input"
            >
            <button class="newsletter-btn" @click="subscribeNewsletter">
              Inscrever-se
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Composables para dados reais
const { formattedCategories, fetchCategories } = useCategories()
const { formattedFeaturedServices, fetchFeaturedServices } = useServices()
const { fetchTestimonials, formatTestimonials } = useReviews()
const { fetchPlatformStats, getFormattedStats } = useStats()

// Estados locais
const searchQuery = ref('')
const emailNewsletter = ref('')
const loading = ref(true)

// Dados reativos
const categories = ref([])
const featuredServices = ref([])
const testimonials = ref([])
const platformStats = ref({})

// Funções de navegação
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    navigateTo(`/buscar?q=${encodeURIComponent(searchQuery.value)}`)
  }
}

const navigateToCategory = (slug) => {
  navigateTo(`/categoria/${slug}`)
}

const subscribeNewsletter = () => {
  if (emailNewsletter.value.trim()) {
    // Implementar lógica de newsletter
    console.log('Newsletter:', emailNewsletter.value)
    emailNewsletter.value = ''
  }
}

// Carregar dados reais do banco
const loadData = async () => {
  try {
    loading.value = true

    // Carregar dados em paralelo
    const [categoriesResult, servicesResult, testimonialsResult, statsResult] = await Promise.all([
      fetchCategories(),
      fetchFeaturedServices(3), // Apenas 3 serviços em destaque
      fetchTestimonials(3), // Apenas 3 depoimentos
      fetchPlatformStats()
    ])

    // Atualizar categorias
    if (categoriesResult.success) {
      categories.value = formattedCategories.value
    }

    // Atualizar serviços em destaque
    if (servicesResult.success) {
      featuredServices.value = formattedFeaturedServices.value
    }

    // Atualizar depoimentos
    if (testimonialsResult.success) {
      testimonials.value = formatTestimonials(testimonialsResult.data)
    }

    // Atualizar estatísticas
    if (statsResult.success) {
      platformStats.value = getFormattedStats()
    }

  } catch (error) {
    console.error('Erro ao carregar dados:', error)
    
    // Fallback para dados estáticos em caso de erro
    categories.value = [
      { 
        id: 1, 
        name: 'Tecnologia', 
        slug: 'tecnologia',
        color: '#3b82f6',
        iconPath: 'M2 3h20v18H2V3zm2 2v14h16V5H4zm2 2h12v2H6V7zm0 4h8v2H6v-2z'
      },
      { 
        id: 2, 
        name: 'Design', 
        slug: 'design',
        color: '#8b5cf6',
        iconPath: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'
      },
      { 
        id: 3, 
        name: 'Marketing', 
        slug: 'marketing',
        color: '#10b981',
        iconPath: 'M7 4V2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2h4a1 1 0 0 1 0 2h-1v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6H3a1 1 0 0 1 0-2h4z'
      }
    ]

    featuredServices.value = [
      {
        id: 1,
        title: 'Desenvolvimento Web',
        description: 'Criação de sites e aplicações web modernas',
        price: 500,
        rating: 4.9,
        image: '/images/service-placeholder.jpg'
      }
    ]

    testimonials.value = [
      {
        id: 1,
        name: 'Cliente Satisfeito',
        location: 'Ceilândia',
        text: 'Excelente plataforma para encontrar profissionais qualificados!',
        avatar: '/images/avatar-placeholder.jpg'
      }
    ]

    platformStats.value = {
      professionals: { value: '50+', label: 'Profissionais' },
      services: { value: '200+', label: 'Serviços realizados' },
      rating: { value: '4.8', label: 'Avaliação média' }
    }
  } finally {
    loading.value = false
  }
}

// Dados estáticos que não mudam
const steps = [
  {
    number: 1,
    title: 'Solicite um serviço',
    description: 'Descreva o que você precisa e receba propostas de profissionais qualificados',
    iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  {
    number: 2,
    title: 'Compare profissionais',
    description: 'Veja perfis, avaliações e escolha o melhor profissional para seu projeto',
    iconPath: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
  },
  {
    number: 3,
    title: 'Serviços realizados',
    description: 'Acompanhe o progresso e avalie o profissional após a conclusão',
    iconPath: 'M5 13l4 4L19 7'
  }
]

const features = [
  {
    id: 1,
    title: 'Profissionais Verificados',
    description: 'Todos os profissionais passam por verificação de documentos e qualificações',
    iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  {
    id: 2,
    title: 'Preços Justos',
    description: 'Compare orçamentos e escolha a melhor proposta para seu bolso',
    iconPath: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
  },
  {
    id: 3,
    title: 'Atendimento 24/7',
    description: 'Nossa equipe está sempre disponível para ajudar você',
    iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  {
    id: 4,
    title: 'Garantia de Qualidade',
    description: 'Todos os serviços contam com garantia de satisfação',
    iconPath: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
  }
]

// Carregar dados quando o componente for montado
onMounted(() => {
  loadData()
})

useHead({
  title: 'ServiFlix - Encontre Profissionais Qualificados',
  meta: [
    { name: 'description', content: 'Conecte-se aos melhores profissionais de Ceilândia' }
  ]
})
</script>

<style scoped>
.home-page {
  overflow-x: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Background global */
.home-page::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    linear-gradient(135deg, rgba(30, 64, 175, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%),
    url('/assets/imagem-fundo.webp');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  z-index: -1;
}

/* Hero Section */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: transparent;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.hero-content {
  text-align: center;
  color: white;
  max-width: 700px;
  margin: 0 auto;
  z-index: 2;
  position: relative;
  padding: 120px 40px 48px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(59, 130, 246, 0.2);
  backdrop-filter: blur(15px);
  padding: 12px 24px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 32px;
  border: 1px solid rgba(59, 130, 246, 0.3);
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.2);
}

.hero-title {
  font-size: 56px;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 24px;
  letter-spacing: -0.02em;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  color: white;
}

.highlight {
  background: linear-gradient(45deg, #fbbf24, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-description {
  font-size: 20px;
  line-height: 1.6;
  margin-bottom: 48px;
  opacity: 1;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  text-shadow: 0 3px 12px rgba(0, 0, 0, 0.6), 0 1px 3px rgba(0, 0, 0, 0.8);
  font-weight: 500;
  color: rgba(255, 255, 255, 0.98);
}

.hero-search {
  margin-bottom: 48px;
}

.search-container {
  display: flex;
  max-width: 600px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 8px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.search-input {
  flex: 1;
  border: none;
  padding: 16px 20px;
  font-size: 16px;
  background: transparent;
  color: #333;
  border-radius: 12px;
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-input:focus {
  outline: none;
}

.search-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  padding: 16px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
  backdrop-filter: blur(10px);
}

.search-btn:hover {
  background: linear-gradient(135deg, #2563eb, #1e40af);
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(59, 130, 246, 0.4);
}

/* Seções */
.categories,
.featured-services,
.how-it-works,
.testimonials,
.why-choose,
.for-professionals,
.newsletter {
  padding: 80px 0;
}

.categories {
  background: #f8fafc;
}

.featured-services {
  background: white;
}

.how-it-works {
  background: #f8fafc;
}

.testimonials {
  background: white;
}

.why-choose {
  background: #f8fafc;
}

.for-professionals {
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  color: white;
}

.newsletter {
  background: #1f2937;
  color: white;
}

.section-header {
  text-align: center;
  margin-bottom: 64px;
}

.section-header h2 {
  font-size: 36px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 16px;
}

.for-professionals .section-header h2,
.newsletter .section-header h2 {
  color: white;
}

.section-header p {
  font-size: 18px;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
}

.for-professionals .section-header p,
.newsletter .section-header p {
  color: rgba(255, 255, 255, 0.8);
}

/* Categorias */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 24px;
}

.category-item {
  background: white;
  padding: 32px 24px;
  border-radius: 16px;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
  cursor: pointer;
}

.category-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.category-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.category-item h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

/* Serviços em Destaque */
.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.service-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
}

.service-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
}

.service-image {
  position: relative;
  height: 200px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
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
  padding: 24px;
}

.service-content h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.service-content p {
  color: #6b7280;
  margin-bottom: 16px;
  font-size: 14px;
}

.service-price {
  color: #6b7280;
  margin-bottom: 16px;
  font-size: 14px;
}

.service-price span {
  color: #3b82f6;
  font-weight: 600;
  font-size: 16px;
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

/* Como Funciona */
.steps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 48px;
}

.step-item {
  text-align: center;
  position: relative;
}

.step-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #3b82f6, #9333ea);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.step-number {
  position: absolute;
  top: -8px;
  right: calc(50% - 40px);
  width: 24px;
  height: 24px;
  background: #fbbf24;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
}

.step-item h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
}

.step-item p {
  color: #6b7280;
  line-height: 1.6;
}

/* Depoimentos */
.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.testimonial-card {
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
}

.testimonial-rating {
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
  color: #fbbf24;
}

.testimonial-card p {
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 24px;
  font-style: italic;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  background: #f3f4f6;
}

.author-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-info h4 {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.author-info span {
  color: #6b7280;
  font-size: 14px;
}

/* Por que escolher */
.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
}

.feature-item {
  text-align: center;
}

.feature-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #3b82f6, #9333ea);
  color: white;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
}

.feature-item h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
}

.feature-item p {
  color: #6b7280;
  line-height: 1.6;
}

/* Para Profissionais */
.professional-cta {
  text-align: center;
}

.professional-stats {
  display: flex;
  justify-content: center;
  gap: 64px;
  margin-bottom: 48px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 48px;
  font-weight: 800;
  color: white;
  margin-bottom: 8px;
}

.stat-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
}

.professional-btn {
  background: rgba(255, 255, 255, 0.9);
  color: #3b82f6;
  border: none;
  padding: 16px 32px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.professional-btn:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.2);
}

/* Newsletter */
.newsletter-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.newsletter-content h2 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 16px;
}

.newsletter-content p {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 32px;
}

.newsletter-form {
  display: flex;
  max-width: 400px;
  margin: 0 auto;
  gap: 12px;
}

.newsletter-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 16px;
}

.newsletter-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.newsletter-input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.4);
}

.newsletter-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.newsletter-btn:hover {
  background: #2563eb;
}

/* Loading States */
.loading-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 24px;
}

.loading-item {
  background: white;
  padding: 32px 24px;
  border-radius: 16px;
  text-align: center;
  border: 1px solid #e5e7eb;
  animation: pulse 2s infinite;
}

.loading-icon {
  width: 64px;
  height: 64px;
  background: #f3f4f6;
  border-radius: 16px;
  margin: 0 auto 16px;
}

.loading-text {
  height: 20px;
  background: #f3f4f6;
  border-radius: 4px;
  margin-bottom: 8px;
}

.services-loading {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.service-loading-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
  animation: pulse 2s infinite;
}

.loading-image {
  height: 200px;
  background: #f3f4f6;
}

.loading-content {
  padding: 24px;
}

.loading-title {
  height: 24px;
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
  height: 20px;
  background: #f3f4f6;
  border-radius: 4px;
  width: 60%;
}

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
  .categories-grid,
  .loading-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .services-loading {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 36px;
  }
  
  .categories-grid,
  .services-grid,
  .steps-grid,
  .testimonials-grid {
    grid-template-columns: 1fr;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .professional-stats {
    flex-direction: column;
    gap: 32px;
  }
  
  .newsletter-form {
    flex-direction: column;
  }
}
</style>