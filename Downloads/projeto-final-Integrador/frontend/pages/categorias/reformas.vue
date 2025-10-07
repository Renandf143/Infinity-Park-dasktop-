<template>
  <div class="category-page">
    <div class="container-custom">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <NuxtLink to="/">Início</NuxtLink>
        <span>/</span>
        <NuxtLink to="/categorias">Categorias</NuxtLink>
        <span>/</span>
        <span>Reformas</span>
      </nav>

      <!-- Header -->
      <div class="category-header">
        <div class="category-info">
          <div class="category-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.7,19L13.6,9.9C14.5,7.6 14,4.9 12.1,3C10.1,1 7.1,0.6 4.7,1.7L9,6L6,9L1.6,4.7C0.4,7.1 0.9,10.1 2.9,12.1C4.8,14 7.5,14.5 9.8,13.6L18.9,22.7C19.3,23.1 19.9,23.1 20.3,22.7L22.6,20.4C23.1,20 23.1,19.3 22.7,19Z"/>
            </svg>
          </div>
          <div class="category-details">
            <h1>Reformas</h1>
            <p>Profissionais especializados em reformas e construção civil</p>
            <div class="category-stats">
              <span>890 profissionais</span>
              <span>⭐ 4.7 (8.9k avaliações)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Services Grid -->
      <div class="services-section">
        <h2>Serviços de Reforma</h2>
        <div class="services-grid">
          <div v-for="service in services" :key="service.id" class="service-card">
            <div class="service-image">
              <img :src="service.image" :alt="service.name" />
            </div>
            <div class="service-content">
              <h3>{{ service.name }}</h3>
              <p>{{ service.description }}</p>
              <div class="service-rating">
                <span class="stars">⭐⭐⭐⭐⭐</span>
                <span class="rating-text">{{ service.rating }} ({{ service.reviews }})</span>
              </div>
              <div class="service-tags">
                <span v-for="tag in service.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
              <div class="service-footer">
                <div class="service-price">
                  <span class="price-from">A partir de</span>
                  <span class="price">R$ {{ service.price }}/dia</span>
                </div>
                <NuxtLink :to="`/servicos/${service.slug}`" class="btn-service">
                  Ver Profissionais
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Reformas - ServiFlix',
  meta: [
    { name: 'description', content: 'Encontre os melhores profissionais para reformas' }
  ]
})

const services = ref([
  {
    id: 1,
    slug: 'pedreiro',
    name: 'Pedreiro',
    description: 'Construção, alvenaria e acabamentos em geral',
    price: 120,
    rating: 4.7,
    reviews: '2.1k',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&h=200&fit=crop',
    tags: ['Alvenaria', 'Acabamento', 'Construção']
  },
  {
    id: 2,
    slug: 'pintor',
    name: 'Pintor',
    description: 'Pintura residencial e comercial com qualidade',
    price: 80,
    rating: 4.6,
    reviews: '1.8k',
    image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=300&h=200&fit=crop',
    tags: ['Pintura', 'Textura', 'Acabamento']
  },
  {
    id: 3,
    slug: 'eletricista',
    name: 'Eletricista',
    description: 'Instalações e reparos elétricos seguros',
    price: 100,
    rating: 4.8,
    reviews: '1.5k',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&h=200&fit=crop',
    tags: ['Instalação', 'Reparo', 'Manutenção']
  },
  {
    id: 4,
    slug: 'encanador',
    name: 'Encanador',
    description: 'Instalações hidráulicas e desentupimentos',
    price: 90,
    rating: 4.5,
    reviews: '1.3k',
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop',
    tags: ['Hidráulica', 'Desentupimento', 'Vazamentos']
  },
  {
    id: 5,
    slug: 'azulejista',
    name: 'Azulejista',
    description: 'Instalação de azulejos e revestimentos',
    price: 110,
    rating: 4.7,
    reviews: '890',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=300&h=200&fit=crop',
    tags: ['Azulejo', 'Revestimento', 'Cerâmica']
  },
  {
    id: 6,
    slug: 'gesseiro',
    name: 'Gesseiro',
    description: 'Instalação de gesso e drywall',
    price: 95,
    rating: 4.6,
    reviews: '670',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&h=200&fit=crop',
    tags: ['Gesso', 'Drywall', 'Acabamento']
  },
  {
    id: 7,
    slug: 'marceneiro',
    name: 'Marceneiro',
    description: 'Móveis sob medida e carpintaria',
    price: 130,
    rating: 4.8,
    reviews: '540',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=300&h=200&fit=crop',
    tags: ['Móveis', 'Madeira', 'Sob medida']
  },
  {
    id: 8,
    slug: 'soldador',
    name: 'Soldador',
    description: 'Soldas e estruturas metálicas',
    price: 140,
    rating: 4.5,
    reviews: '320',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&h=200&fit=crop',
    tags: ['Solda', 'Metal', 'Estruturas']
  }
])
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
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
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
  height: 200px;
  overflow: hidden;
}

.service-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

.service-rating {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-lg);
}

.stars {
  color: var(--warning-500);
}

.rating-text {
  color: var(--text-tertiary);
  font-size: 0.9rem;
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

.service-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.service-price {
  display: flex;
  flex-direction: column;
}

.price-from {
  font-size: 0.8rem;
  color: var(--text-tertiary);
}

.price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.btn-service {
  background: var(--gradient-primary);
  color: white;
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-md);
  text-decoration: none;
  font-weight: 600;
  transition: all var(--transition-base);
}

.btn-service:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-primary);
}

@media (max-width: 768px) {
  .category-info {
    flex-direction: column;
    text-align: center;
    gap: var(--space-lg);
  }
  
  .services-grid {
    grid-template-columns: 1fr;
  }
}
</style>