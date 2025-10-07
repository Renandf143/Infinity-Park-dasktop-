<template>
  <div class="category-page">
    <div class="container-custom">
      <nav class="breadcrumb">
        <NuxtLink to="/">Início</NuxtLink>
        <span>/</span>
        <NuxtLink to="/categorias">Categorias</NuxtLink>
        <span>/</span>
        <span>Limpeza</span>
      </nav>

      <div class="category-header">
        <div class="category-info">
          <div class="category-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.36,2.72L20.78,4.14L15.06,9.85C16.13,11.39 16.28,13.24 15.38,14.44L9.06,8.12C10.26,7.22 12.11,7.37 13.65,8.44L19.36,2.72M5.93,17.57C3.92,15.56 2.69,13.16 2.35,10.92L7.23,8.83L14.67,16.27L12.58,21.15C10.34,20.81 7.94,19.58 5.93,17.57Z"/>
            </svg>
          </div>
          <div class="category-details">
            <h1>Limpeza</h1>
            <p>Serviços de limpeza residencial e comercial</p>
            <div class="category-stats">
              <span>2.100 profissionais</span>
              <span>⭐ 4.9 (15.2k avaliações)</span>
            </div>
          </div>

        </div>
      </div>

      <div class="services-section">
        <h2>Serviços de Limpeza</h2>
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
                  <span class="price">R$ {{ service.price }}/hora</span>
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
  title: 'Limpeza - ServiFlix',
  meta: [{ name: 'description', content: 'Serviços de limpeza profissional' }]
})

const services = ref([
  { 
    id: 1, 
    slug: 'limpeza-residencial', 
    name: 'Limpeza Residencial', 
    description: 'Limpeza completa da sua casa com produtos de qualidade', 
    price: 60,
    rating: 4.9,
    reviews: '3.2k',
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop',
    tags: ['Residencial', 'Completa', 'Produtos Eco']
  },
  { 
    id: 2, 
    slug: 'limpeza-comercial', 
    name: 'Limpeza Comercial', 
    description: 'Limpeza de escritórios e estabelecimentos comerciais', 
    price: 80,
    rating: 4.8,
    reviews: '2.1k',
    image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=300&h=200&fit=crop',
    tags: ['Comercial', 'Escritórios', 'Profissional']
  },
  { 
    id: 3, 
    slug: 'limpeza-pos-obra', 
    name: 'Limpeza Pós-Obra', 
    description: 'Limpeza especializada após reformas e construções', 
    price: 120,
    rating: 4.7,
    reviews: '1.8k',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&h=200&fit=crop',
    tags: ['Pós-obra', 'Especializada', 'Detritos']
  },
  { 
    id: 4, 
    slug: 'limpeza-tapetes', 
    name: 'Limpeza de Tapetes', 
    description: 'Lavagem e higienização de tapetes e carpetes', 
    price: 40,
    rating: 4.6,
    reviews: '890',
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop',
    tags: ['Tapetes', 'Carpetes', 'Higienização']
  },
  { 
    id: 5, 
    slug: 'limpeza-vidros', 
    name: 'Limpeza de Vidros', 
    description: 'Limpeza profissional de vidros e janelas', 
    price: 35,
    rating: 4.5,
    reviews: '670',
    image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=300&h=200&fit=crop',
    tags: ['Vidros', 'Janelas', 'Cristalino']
  },
  { 
    id: 6, 
    slug: 'limpeza-estofados', 
    name: 'Limpeza de Estofados', 
    description: 'Higienização de sofás, poltronas e colchões', 
    price: 50,
    rating: 4.8,
    reviews: '1.2k',
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop',
    tags: ['Estofados', 'Sofás', 'Colchões']
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
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); 
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