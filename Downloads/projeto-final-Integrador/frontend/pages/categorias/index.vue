<template>
  <div class="categories-page">
    <div class="container-custom">
      <!-- Header -->
      <div class="page-header">
        <h1>Todas as Categorias</h1>
        <p>Encontre o profissional ideal para suas necessidades</p>
      </div>

      <!-- Search -->
      <div class="search-section">
        <div class="search-box">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Buscar categoria ou serviço..."
            class="search-input"
          >
          <svg class="search-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
          </svg>
        </div>
      </div>

      <!-- Categories Grid -->
      <div class="categories-grid">
        <NuxtLink 
          v-for="category in filteredCategories" 
          :key="category.slug"
          :to="`/categorias/${category.slug}`" 
          class="category-card"
        >
          <div class="category-icon" :style="{ background: category.gradient }">
            <component :is="category.icon" />
          </div>
          <div class="category-content">
            <h3>{{ category.name }}</h3>
            <p>{{ category.description }}</p>
            <div class="category-stats">
              <span class="professionals-count">{{ category.professionalsCount }} profissionais</span>
              <span class="rating">⭐ {{ category.rating }}</span>
            </div>
          </div>
          <div class="category-arrow">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
// Meta tags
useHead({
  title: 'Categorias de Serviços - ServiFlix',
  meta: [
    { name: 'description', content: 'Explore todas as categorias de serviços disponíveis no ServiFlix' }
  ]
})

const searchQuery = ref('')

// Dados das categorias
const categories = ref([
  {
    slug: 'casa-jardim',
    name: 'Casa e Jardim',
    description: 'Serviços para sua casa e área externa',
    professionalsCount: 1250,
    rating: 4.8,
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    icon: 'IconHome'
  },
  {
    slug: 'reformas',
    name: 'Reformas',
    description: 'Reformas e construção em geral',
    professionalsCount: 890,
    rating: 4.7,
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    icon: 'IconTools'
  },
  {
    slug: 'limpeza',
    name: 'Limpeza',
    description: 'Serviços de limpeza residencial e comercial',
    professionalsCount: 2100,
    rating: 4.9,
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    icon: 'IconCleaning'
  },
  {
    slug: 'assistencia-tecnica',
    name: 'Assistência Técnica',
    description: 'Reparo de equipamentos e eletrônicos',
    professionalsCount: 650,
    rating: 4.6,
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    icon: 'IconTech'
  },
  {
    slug: 'design-tecnologia',
    name: 'Design e Tecnologia',
    description: 'Serviços digitais e criativos',
    professionalsCount: 420,
    rating: 4.8,
    gradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
    icon: 'IconDesign'
  },
  {
    slug: 'aulas',
    name: 'Aulas',
    description: 'Professores particulares e cursos',
    profissionalsCount: 780,
    rating: 4.9,
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    icon: 'IconEducation'
  },
  {
    slug: 'transporte',
    name: 'Transporte',
    description: 'Mudanças, carretos e entregas',
    profissionalsCount: 340,
    rating: 4.7,
    gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    icon: 'IconTransport'
  },
  {
    slug: 'beleza-bem-estar',
    name: 'Beleza e Bem-estar',
    description: 'Cuidados pessoais e estética',
    profissionalsCount: 560,
    rating: 4.8,
    gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
    icon: 'IconBeauty'
  },
  {
    slug: 'eventos',
    name: 'Eventos',
    description: 'Organização e serviços para eventos',
    professionalsCount: 290,
    rating: 4.9,
    gradient: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
    icon: 'IconEvents'
  },
  {
    slug: 'saude',
    name: 'Saúde',
    description: 'Profissionais de saúde e cuidados médicos',
    professionalsCount: 180,
    rating: 4.9,
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    icon: 'IconHealth'
  },
  {
    slug: 'automoveis',
    name: 'Automóveis',
    description: 'Serviços automotivos e cuidados com veículos',
    profissionalsCount: 220,
    rating: 4.6,
    gradient: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
    icon: 'IconCar'
  }
])

const filteredCategories = computed(() => {
  if (!searchQuery.value) return categories.value
  
  return categories.value.filter(category => 
    category.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
</script>

<style scoped>
.categories-page {
  min-height: 80vh;
  padding: var(--space-6xl) 0;
  background: var(--bg-secondary);
}

.page-header {
  text-align: center;
  margin-bottom: var(--space-4xl);
}

.page-header h1 {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: var(--space-lg);
  letter-spacing: -0.02em;
}

.page-header p {
  font-size: 1.2rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
}

.search-section {
  margin-bottom: var(--space-4xl);
  display: flex;
  justify-content: center;
}

.search-box {
  position: relative;
  max-width: 500px;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: var(--space-lg) var(--space-lg) var(--space-lg) var(--space-4xl);
  border: 2px solid var(--border-primary);
  border-radius: var(--radius-xl);
  font-size: 1rem;
  background: var(--bg-primary);
  transition: all var(--transition-base);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-icon {
  position: absolute;
  left: var(--space-lg);
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: var(--text-tertiary);
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--space-2xl);
}

.category-card {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-2xl);
  border: 1px solid var(--border-primary);
  transition: all var(--transition-base);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: var(--space-xl);
  position: relative;
  overflow: hidden;
}

.category-card::before {
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

.category-card:hover::before {
  transform: scaleX(1);
}

.category-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
  border-color: var(--color-primary);
}

.category-icon {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  flex-shrink: 0;
  transition: all var(--transition-base);
}

.category-card:hover .category-icon {
  transform: scale(1.1) rotate(-5deg);
}

.category-content {
  flex: 1;
}

.category-content h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
}

.category-content p {
  color: var(--text-secondary);
  margin-bottom: var(--space-lg);
  line-height: 1.6;
}

.category-stats {
  display: flex;
  gap: var(--space-lg);
  font-size: 0.9rem;
}

.professionals-count {
  color: var(--text-tertiary);
  font-weight: 500;
}

.rating {
  color: var(--text-tertiary);
  font-weight: 500;
}

.category-arrow {
  color: var(--color-primary);
  transition: all var(--transition-base);
  flex-shrink: 0;
}

.category-card:hover .category-arrow {
  transform: translateX(5px);
}

.category-arrow svg {
  width: 24px;
  height: 24px;
}

@media (max-width: 768px) {
  .categories-grid {
    grid-template-columns: 1fr;
  }
  
  .category-card {
    flex-direction: column;
    text-align: center;
    gap: var(--space-lg);
  }
  
  .category-arrow {
    transform: rotate(90deg);
  }
  
  .category-card:hover .category-arrow {
    transform: rotate(90deg) translateX(5px);
  }
}
</style>