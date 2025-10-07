<template>
  <div class="services-page">
    <div class="container-custom">
      <!-- Header -->
      <div class="page-header">
        <h1>Todos os Serviços</h1>
        <p>Encontre o profissional perfeito para suas necessidades</p>
      </div>

      <!-- Search and Filters -->
      <div class="search-filters">
        <div class="search-box">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Buscar serviços..."
            class="search-input"
          >
          <svg class="search-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
          </svg>
        </div>
        
        <div class="filters">
          <select v-model="categoryFilter" class="filter-select">
            <option value="">Todas as categorias</option>
            <option value="casa-jardim">Casa e Jardim</option>
            <option value="reformas">Reformas</option>
            <option value="limpeza">Limpeza</option>
            <option value="assistencia-tecnica">Assistência Técnica</option>
            <option value="design-tecnologia">Design e Tecnologia</option>
            <option value="aulas">Aulas</option>
          </select>
        </div>
      </div>

      <!-- Services Grid -->
      <div class="services-grid">
        <div v-for="service in filteredServices" :key="service.id" class="service-card">
          <div class="service-header">
            <div class="service-category">{{ service.categoryName }}</div>
            <div class="service-rating">
              <span class="stars">⭐⭐⭐⭐⭐</span>
              <span class="rating-text">{{ service.rating }}</span>
            </div>
          </div>
          <h3>{{ service.name }}</h3>
          <p>{{ service.description }}</p>
          <div class="service-footer">
            <div class="service-price">
              <span class="price-label">A partir de</span>
              <span class="price">R$ {{ service.price }}</span>
            </div>
            <NuxtLink :to="`/servicos/${service.slug}`" class="btn-service">
              Ver Profissionais
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Todos os Serviços - ServiFlix',
  meta: [{ name: 'description', content: 'Explore todos os serviços disponíveis' }]
})

const searchQuery = ref('')
const categoryFilter = ref('')

const services = ref([
  { id: 1, slug: 'jardinagem', name: 'Jardinagem', description: 'Cuidado do jardim', price: 80, rating: 4.8, category: 'casa-jardim', categoryName: 'Casa e Jardim' },
  { id: 2, slug: 'pedreiro', name: 'Pedreiro', description: 'Construção e alvenaria', price: 120, rating: 4.7, category: 'reformas', categoryName: 'Reformas' },
  { id: 3, slug: 'limpeza-residencial', name: 'Limpeza Residencial', description: 'Limpeza completa', price: 60, rating: 4.9, category: 'limpeza', categoryName: 'Limpeza' },
  { id: 4, slug: 'reparo-celular', name: 'Reparo de Celular', description: 'Conserto de smartphones', price: 80, rating: 4.6, category: 'assistencia-tecnica', categoryName: 'Assistência Técnica' },
  { id: 5, slug: 'web-design', name: 'Web Design', description: 'Criação de sites', price: 200, rating: 4.8, category: 'design-tecnologia', categoryName: 'Design e Tecnologia' },
  { id: 6, slug: 'aulas-matematica', name: 'Aulas de Matemática', description: 'Professor particular', price: 50, rating: 4.9, category: 'aulas', categoryName: 'Aulas' }
])

const filteredServices = computed(() => {
  let filtered = services.value

  if (searchQuery.value) {
    filtered = filtered.filter(service => 
      service.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (categoryFilter.value) {
    filtered = filtered.filter(service => service.category === categoryFilter.value)
  }

  return filtered
})
</script>

<style scoped>
.services-page {
  min-height: 100vh;
  padding: var(--space-4xl) 0;
  background: var(--bg-secondary);
}

.page-header {
  text-align: center;
  margin-bottom: var(--space-4xl);
  animation: fadeIn var(--transition-base) ease-out;
}

.page-header h1 {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: var(--space-lg);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-header p {
  font-size: var(--text-xl);
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
}

.search-filters {
  display: flex;
  gap: var(--space-xl);
  margin-bottom: var(--space-4xl);
  align-items: center;
  background: var(--bg-primary);
  padding: var(--space-2xl);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-lg);
  animation: slideInUp var(--transition-base) ease-out;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 500px;
}

.search-input {
  width: 100%;
  padding: var(--space-lg) var(--space-lg) var(--space-lg) var(--space-4xl);
  border: 2px solid var(--border-primary);
  border-radius: var(--radius-xl);
  font-size: var(--text-base);
  background: var(--bg-secondary);
  color: var(--text-primary);
  transition: all var(--transition-base);
}

.search-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
  background: var(--bg-primary);
}

.search-icon {
  position: absolute;
  left: var(--space-lg);
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: var(--text-tertiary);
  transition: color var(--transition-base);
}

.search-input:focus + .search-icon {
  color: var(--color-primary);
}

.filter-select {
  padding: var(--space-lg);
  border: 2px solid var(--border-primary);
  border-radius: var(--radius-lg);
  background: var(--bg-secondary);
  color: var(--text-primary);
  min-width: 200px;
  font-weight: 500;
  transition: all var(--transition-base);
}

.filter-select:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
  background: var(--bg-primary);
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--space-2xl);
}

.service-card {
  background: var(--bg-primary);
  padding: var(--space-2xl);
  border-radius: var(--radius-2xl);
  border: 1px solid var(--border-primary);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
  animation: fadeIn var(--transition-base) ease-out;
}

.service-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--gradient-primary);
  transform: scaleX(0);
  transition: transform var(--transition-base);
}

.service-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-2xl);
  border-color: var(--color-primary-light);
}

.service-card:hover::before {
  transform: scaleX(1);
}

.service-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
}

.service-category {
  background: var(--color-primary-light);
  color: var(--color-primary);
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.service-rating {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.stars {
  color: #fbbf24;
  font-size: var(--text-lg);
}

.rating-text {
  color: var(--text-tertiary);
  font-size: var(--text-sm);
  font-weight: 600;
}

.service-card h3 {
  font-size: var(--text-xl);
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: var(--space-md);
  line-height: 1.3;
}

.service-card p {
  color: var(--text-secondary);
  margin-bottom: var(--space-xl);
  line-height: 1.7;
  font-size: var(--text-base);
}

.service-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--space-lg);
  border-top: 1px solid var(--border-primary);
}

.service-price {
  display: flex;
  flex-direction: column;
}

.price-label {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.price {
  font-size: var(--text-2xl);
  font-weight: 800;
  color: var(--color-primary);
  margin-top: var(--space-xs);
}

.btn-service {
  background: var(--gradient-primary);
  color: white;
  padding: var(--space-md) var(--space-xl);
  border-radius: var(--radius-lg);
  text-decoration: none;
  font-weight: 700;
  font-size: var(--text-sm);
  transition: all var(--transition-base);
  box-shadow: var(--shadow-sm);
}

.btn-service:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-primary-lg);
}

@media (max-width: 768px) {
  .services-page {
    padding: var(--space-2xl) 0;
  }
  
  .page-header h1 {
    font-size: var(--text-3xl);
  }
  
  .page-header p {
    font-size: var(--text-lg);
  }
  
  .search-filters {
    flex-direction: column;
    align-items: stretch;
    padding: var(--space-lg);
  }
  
  .search-box {
    max-width: none;
  }
  
  .services-grid {
    grid-template-columns: 1fr;
    gap: var(--space-lg);
  }
  
  .service-card {
    padding: var(--space-lg);
  }
  
  .service-footer {
    flex-direction: column;
    gap: var(--space-lg);
    align-items: stretch;
  }
  
  .btn-service {
    text-align: center;
  }
}
</style>