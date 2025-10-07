<template>
  <div class="category-page">
    <div class="container-custom">
      <nav class="breadcrumb">
        <NuxtLink to="/">Início</NuxtLink>
        <span>/</span>
        <NuxtLink to="/categorias">Categorias</NuxtLink>
        <span>/</span>
        <span>Eventos</span>
      </nav>

      <div class="category-header">
        <div class="category-info">
          <div class="category-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1M17,12H12V17H17V12Z"/>
            </svg>
          </div>
          <div class="category-details">
            <h1>Eventos</h1>
            <p>Organização e serviços para eventos especiais</p>
            <div class="category-stats">
              <span>290 profissionais</span>
              <span>⭐ 4.9 (1.8k avaliações)</span>
            </div>
          </div>
        </div>
      </div>

      <div class="services-section">
        <h2>Serviços para Eventos</h2>
        <div class="services-grid">
          <div v-for="service in services" :key="service.id" class="service-card">
            <div class="service-content">
              <h3>{{ service.name }}</h3>
              <p>{{ service.description }}</p>
              <div class="service-price">
                <span class="price">A partir de R$ {{ service.price }}</span>
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
</template>

<script setup>
useHead({
  title: 'Eventos - ServiFlix',
  meta: [{ name: 'description', content: 'Organização e serviços para eventos' }]
})

const services = ref([
  { id: 1, slug: 'fotografo', name: 'Fotógrafo', description: 'Fotografia profissional para eventos', price: 300 },
  { id: 2, slug: 'dj', name: 'DJ', description: 'Animação musical para festas', price: 400 },
  { id: 3, slug: 'decoracao', name: 'Decoração', description: 'Decoração temática para eventos', price: 500 },
  { id: 4, slug: 'buffet', name: 'Buffet', description: 'Serviços de alimentação', price: 25 },
  { id: 5, slug: 'cerimonial', name: 'Cerimonial', description: 'Organização completa de eventos', price: 800 },
  { id: 6, slug: 'videomaker', name: 'Videomaker', description: 'Filmagem profissional', price: 600 }
])
</script>

<style scoped>
.category-page { min-height: 80vh; padding: var(--space-4xl) 0; background: var(--bg-secondary); }
.breadcrumb { display: flex; align-items: center; gap: var(--space-sm); margin-bottom: var(--space-2xl); }
.category-header { background: var(--bg-primary); padding: var(--space-3xl); border-radius: var(--radius-xl); margin-bottom: var(--space-3xl); }
.category-info { display: flex; align-items: center; gap: var(--space-2xl); }
.category-icon { width: 100px; height: 100px; background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%); border-radius: var(--radius-xl); display: flex; align-items: center; justify-content: center; color: white; }
.services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--space-xl); }
.service-card { background: var(--bg-primary); padding: var(--space-xl); border-radius: var(--radius-lg); border: 1px solid var(--border-primary); }
.btn-service { background: var(--gradient-primary); color: white; padding: var(--space-md); border-radius: var(--radius-md); text-decoration: none; display: block; text-align: center; margin-top: var(--space-lg); }
</style>