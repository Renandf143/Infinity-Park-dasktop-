<template>
  <div class="category-page">
    <div class="container-custom">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <NuxtLink to="/">Início</NuxtLink>
        <span>/</span>
        <NuxtLink to="/categorias">Categorias</NuxtLink>
        <span>/</span>
        <span>Casa e Jardim</span>
      </nav>

      <!-- Header -->
      <div class="page-header">
        <div class="category-info">
          <div class="category-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/>
            </svg>
          </div>
          <div class="category-details">
            <h1>Casa e Jardim</h1>
            <p>Profissionais especializados em serviços para sua casa e área externa</p>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-number">1.250</div>
                <div class="stat-label">Profissionais</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">4.8</div>
                <div class="stat-label">⭐ Avaliação</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">12.5k</div>
                <div class="stat-label">Avaliações</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters-section">
        <LocationSelector 
          v-model="filters.location"
          label="Localização:"
          placeholder="Todas as regiões"
          select-class="filter-select"
        />
        
        <div class="filter-group">
          <label>Preço:</label>
          <select v-model="filters.price" class="filter-select">
            <option value="">Qualquer preço</option>
            <option value="low">Até R$ 100</option>
            <option value="medium">R$ 100 - R$ 300</option>
            <option value="high">Acima de R$ 300</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>Avaliação:</label>
          <select v-model="filters.rating" class="filter-select">
            <option value="">Qualquer avaliação</option>
            <option value="5">⭐⭐⭐⭐⭐ (5.0)</option>
            <option value="4">⭐⭐⭐⭐ (4.0+)</option>
            <option value="3">⭐⭐⭐ (3.0+)</option>
          </select>
        </div>
      </div>

      <!-- Services Grid -->
      <div class="section section-primary">
        <h2 class="section-title">Serviços Disponíveis</h2>
        <div class="grid-3">
          <div v-for="service in filteredServices" :key="service.id" class="card service-card">
            <div class="service-image">
              <img :src="service.image" :alt="service.name" />
              <div v-if="service.featured" class="tag tag-success service-badge">Destaque</div>
            </div>
            <div class="card-body">
              <h3>{{ service.name }}</h3>
              <p>{{ service.description }}</p>
              <div class="service-details">
                <div class="service-rating">
                  <span class="stars">{{ '⭐'.repeat(Math.floor(service.rating)) }}</span>
                  <span class="rating-text">{{ service.rating }} ({{ service.reviews }})</span>
                </div>
                <div class="service-price">
                  <span class="price-from">A partir de</span>
                  <span class="price">R$ {{ service.price }}</span>
                </div>
              </div>
              <div class="service-tags">
                <span v-for="tag in service.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </div>
            <div class="card-footer">
              <NuxtLink :to="`/servicos/${service.slug}`" class="btn btn-primary">
                Ver Profissionais
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Popular Professionals -->
      <div class="section section-secondary">
        <h2 class="section-title">Profissionais em Destaque</h2>
        <div class="grid-3">
          <div v-for="professional in featuredProfessionals" :key="professional.id" class="card professional-card">
            <div class="card-body">
              <div class="professional-header">
                <div class="professional-avatar">
                  <img :src="professional.avatar" :alt="professional.name" class="avatar avatar-lg" />
                  <div class="online-status" v-if="professional.online"></div>
                </div>
                <div class="professional-info">
                  <h4>{{ professional.name }}</h4>
                  <p>{{ professional.specialty }}</p>
                  <div class="professional-rating">
                    <span class="stars">{{ '⭐'.repeat(Math.floor(professional.rating)) }}</span>
                    <span class="rating-text">{{ professional.rating }} ({{ professional.reviews }})</span>
                  </div>
                  <div class="professional-price">
                    A partir de <strong>R$ {{ professional.price }}/hora</strong>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-footer">
              <NuxtLink :to="`/profissionais/${professional.slug}`" class="btn btn-primary">
                Contatar
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Meta tags
useHead({
  title: 'Casa e Jardim - ServiFlix',
  meta: [
    { name: 'description', content: 'Encontre os melhores profissionais para serviços de casa e jardim' }
  ]
})

const filters = ref({
  location: '',
  price: '',
  rating: ''
})

// Dados dos serviços
const services = ref([
  {
    id: 1,
    slug: 'jardinagem',
    name: 'Jardinagem',
    description: 'Cuidado completo do seu jardim, poda, plantio e manutenção',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=200&fit=crop',
    rating: 4.8,
    reviews: '1.2k',
    price: 80,
    tags: ['Poda', 'Plantio', 'Irrigação'],
    featured: true,
    location: 'ceilandia-sul',
    priceRange: 'low'
  },
  {
    id: 2,
    slug: 'limpeza-piscina',
    name: 'Limpeza de Piscina',
    description: 'Manutenção completa de piscinas, limpeza e tratamento químico',
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=300&h=200&fit=crop',
    rating: 4.9,
    reviews: '890',
    price: 150,
    tags: ['Limpeza', 'Químicos', 'Manutenção'],
    featured: false,
    location: 'ceilandia-norte',
    priceRange: 'medium'
  },
  {
    id: 3,
    slug: 'paisagismo',
    name: 'Paisagismo',
    description: 'Projeto e execução de paisagismo para áreas externas',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
    rating: 4.7,
    reviews: '650',
    price: 200,
    tags: ['Projeto', 'Design', 'Execução'],
    featured: true,
    location: 'setor-o',
    priceRange: 'medium'
  },
  {
    id: 4,
    slug: 'limpeza-calhas',
    name: 'Limpeza de Calhas',
    description: 'Limpeza e desentupimento de calhas e rufos',
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop',
    rating: 4.6,
    reviews: '420',
    price: 120,
    tags: ['Limpeza', 'Desentupimento', 'Manutenção'],
    featured: false,
    location: 'ceilandia-centro',
    priceRange: 'medium'
  },
  {
    id: 5,
    slug: 'instalacao-deck',
    name: 'Instalação de Deck',
    description: 'Instalação de decks de madeira e materiais sintéticos',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&h=200&fit=crop',
    rating: 4.8,
    reviews: '780',
    price: 350,
    tags: ['Instalação', 'Madeira', 'Sintético'],
    featured: false,
    location: 'setor-p',
    priceRange: 'high'
  },
  {
    id: 6,
    slug: 'irrigacao',
    name: 'Sistema de Irrigação',
    description: 'Instalação e manutenção de sistemas de irrigação automática',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=200&fit=crop',
    rating: 4.7,
    reviews: '340',
    price: 250,
    tags: ['Automação', 'Instalação', 'Manutenção'],
    featured: true,
    location: 'guariroba',
    priceRange: 'medium'
  },
  {
    id: 7,
    slug: 'podas-arvores',
    name: 'Poda de Árvores',
    description: 'Poda técnica e remoção segura de árvores',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop',
    rating: 4.5,
    reviews: '280',
    price: 180,
    tags: ['Poda', 'Remoção', 'Segurança'],
    featured: false,
    location: 'setor-q',
    priceRange: 'medium'
  },
  {
    id: 8,
    slug: 'grama-sintetica',
    name: 'Instalação de Grama Sintética',
    description: 'Instalação profissional de grama sintética',
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop',
    rating: 4.6,
    reviews: '190',
    price: 45,
    tags: ['Instalação', 'Sintética', 'Manutenção'],
    featured: false,
    location: 'setor-r',
    priceRange: 'low'
  }
])

// Profissionais em destaque
const featuredProfessionals = ref([
  {
    id: 1,
    slug: 'joao-jardineiro',
    name: 'João Silva',
    specialty: 'Jardineiro Especialista',
    avatar: 'https://via.placeholder.com/80x80?text=JS',
    rating: 4.9,
    reviews: '156',
    price: 85,
    online: true
  },
  {
    id: 2,
    slug: 'maria-paisagista',
    name: 'Maria Santos',
    specialty: 'Paisagista',
    avatar: 'https://via.placeholder.com/80x80?text=MS',
    rating: 4.8,
    reviews: '203',
    price: 120,
    online: false
  },
  {
    id: 3,
    slug: 'carlos-piscina',
    name: 'Carlos Oliveira',
    specialty: 'Especialista em Piscinas',
    avatar: 'https://via.placeholder.com/80x80?text=CO',
    rating: 4.9,
    reviews: '89',
    price: 150,
    online: true
  }
])

const filteredServices = computed(() => {
  let filtered = services.value

  if (filters.value.location) {
    filtered = filtered.filter(service => service.location === filters.value.location)
  }

  if (filters.value.price) {
    filtered = filtered.filter(service => service.priceRange === filters.value.price)
  }

  if (filters.value.rating) {
    const minRating = parseInt(filters.value.rating)
    filtered = filtered.filter(service => Math.floor(service.rating) >= minRating)
  }

  return filtered
})
</script>

<style scoped>
.category-page {
  min-height: 80vh;
  padding: var(--space-4xl) 0;
  background: var(--bg-secondary);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-2xl);
  font-size: 0.9rem;
}

.breadcrumb a {
  color: var(--color-primary);
  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.breadcrumb span {
  color: var(--text-tertiary);
}

.category-header {
  background: var(--bg-primary);
  padding: var(--space-3xl);
  border-radius: var(--radius-xl);
  margin-bottom: var(--space-3xl);
  box-shadow: var(--shadow-sm);
}

.category-info {
  display: flex;
  align-items: center;
  gap: var(--space-2xl);
}

.category-icon {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  flex-shrink: 0;
}

.category-icon svg {
  width: 48px;
  height: 48px;
}

.category-details h1 {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
}

.category-details p {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-bottom: var(--space-lg);
  line-height: 1.6;
}

.category-stats {
  display: flex;
  gap: var(--space-2xl);
  font-size: 0.9rem;
  color: var(--text-tertiary);
}

.filters-section {
  display: flex;
  gap: var(--space-2xl);
  margin-bottom: var(--space-3xl);
  background: var(--bg-primary);
  padding: var(--space-xl);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.filter-group label {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.filter-select {
  padding: var(--space-md);
  border: 2px solid var(--border-primary);
  border-radius: var(--radius-md);
  background: var(--bg-primary);
  min-width: 180px;
}

.services-section {
  margin-bottom: var(--space-4xl);
}

.services-section h2 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-2xl);
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--space-2xl);
}

.service-card {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  overflow: hidden;
  border: 1px solid var(--border-primary);
  transition: all var(--transition-base);
}

.service-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
}

.service-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.service-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.service-badge {
  position: absolute;
  top: var(--space-lg);
  right: var(--space-lg);
  background: var(--gradient-primary);
  color: white;
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  font-weight: 600;
}

.service-content {
  padding: var(--space-2xl);
}

.service-content h3 {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
}

.service-content p {
  color: var(--text-secondary);
  margin-bottom: var(--space-lg);
  line-height: 1.6;
}

.service-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
}

.service-rating {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.stars {
  color: var(--warning-500);
}

.rating-text {
  color: var(--text-tertiary);
  font-size: 0.9rem;
}

.service-price {
  text-align: right;
}

.price-from {
  display: block;
  color: var(--text-tertiary);
  font-size: 0.8rem;
}

.price {
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 700;
}

.service-tags {
  display: flex;
  gap: var(--space-sm);
  margin-bottom: var(--space-xl);
  flex-wrap: wrap;
}

.tag {
  background: var(--bg-secondary);
  color: var(--text-secondary);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  font-weight: 500;
}

.btn-service {
  width: 100%;
  background: var(--gradient-primary);
  color: white;
  padding: var(--space-lg);
  border-radius: var(--radius-md);
  text-decoration: none;
  font-weight: 600;
  text-align: center;
  display: block;
  transition: all var(--transition-base);
}

.btn-service:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-primary);
}

.professionals-section h2 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-2xl);
}

.professionals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-xl);
}

.professional-card {
  background: var(--bg-primary);
  padding: var(--space-xl);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-primary);
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  transition: all var(--transition-base);
}

.professional-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.professional-avatar {
  position: relative;
  flex-shrink: 0;
}

.professional-avatar img {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-full);
  object-fit: cover;
}

.online-status {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 16px;
  height: 16px;
  background: var(--success-500);
  border: 2px solid white;
  border-radius: 50%;
}

.professional-info {
  flex: 1;
}

.professional-info h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-xs);
}

.professional-info p {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: var(--space-sm);
}

.professional-rating {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-sm);
}

.professional-price {
  color: var(--text-tertiary);
  font-size: 0.9rem;
}

.btn-contact {
  background: var(--color-primary);
  color: white;
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-md);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all var(--transition-base);
  flex-shrink: 0;
}

.btn-contact:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .category-info {
    flex-direction: column;
    text-align: center;
    gap: var(--space-lg);
  }
  
  .filters-section {
    flex-direction: column;
    gap: var(--space-lg);
  }
  
  .filter-select {
    min-width: auto;
  }
  
  .services-grid {
    grid-template-columns: 1fr;
  }
  
  .professional-card {
    flex-direction: column;
    text-align: center;
  }
}
</style>