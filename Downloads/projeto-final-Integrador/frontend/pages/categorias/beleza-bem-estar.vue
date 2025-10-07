<template>
  <div class="category-page">
    <div class="container-custom">
      <nav class="breadcrumb">
        <NuxtLink to="/">Início</NuxtLink>
        <span>/</span>
        <NuxtLink to="/categorias">Categorias</NuxtLink>
        <span>/</span>
        <span>Beleza e Bem-estar</span>
      </nav>

      <div class="category-header">
        <div class="category-info">
          <div class="category-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2M21,9V7L15,1H9V3H15.5L20,7.5V9H21M7,10A2,2 0 0,1 9,12A2,2 0 0,1 7,14A2,2 0 0,1 5,12A2,2 0 0,1 7,10M17,10A2,2 0 0,1 19,12A2,2 0 0,1 17,14A2,2 0 0,1 15,12A2,2 0 0,1 17,10M7,15C8.67,15 10,16.33 10,18V22H4V18C4,16.33 5.33,15 7,15M17,15C18.67,15 20,16.33 20,18V22H14V18C14,16.33 15.33,15 17,15Z"/>
            </svg>
          </div>
          <div class="category-details">
            <h1>Beleza e Bem-estar</h1>
            <p>Cuidados pessoais e serviços de estética</p>
            <div class="category-stats">
              <span>560 profissionais</span>
              <span>⭐ 4.8 (4.5k avaliações)</span>
            </div>
          </div>
        </div>
      </div>

      <div class="services-section">
        <h2>Serviços de Beleza</h2>
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
  title: 'Beleza e Bem-estar - ServiFlix',
  meta: [{ name: 'description', content: 'Serviços de beleza e cuidados pessoais' }]
})

const services = ref([
  { id: 1, slug: 'cabeleireiro', name: 'Cabeleireiro', description: 'Cortes, coloração e tratamentos', price: 50 },
  { id: 2, slug: 'manicure', name: 'Manicure e Pedicure', description: 'Cuidados com unhas', price: 30 },
  { id: 3, slug: 'esteticista', name: 'Esteticista', description: 'Tratamentos faciais e corporais', price: 80 },
  { id: 4, slug: 'massagem', name: 'Massagem', description: 'Massagens relaxantes e terapêuticas', price: 100 },
  { id: 5, slug: 'maquiagem', name: 'Maquiagem', description: 'Maquiagem para eventos especiais', price: 120 },
  { id: 6, slug: 'personal-trainer', name: 'Personal Trainer', description: 'Treinamento físico personalizado', price: 80 }
])
</script>

<style scoped>
.category-page { min-height: 80vh; padding: var(--space-4xl) 0; background: var(--bg-secondary); }
.breadcrumb { display: flex; align-items: center; gap: var(--space-sm); margin-bottom: var(--space-2xl); }
.category-header { background: var(--bg-primary); padding: var(--space-3xl); border-radius: var(--radius-xl); margin-bottom: var(--space-3xl); }
.category-info { display: flex; align-items: center; gap: var(--space-2xl); }
.category-icon { width: 100px; height: 100px; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); border-radius: var(--radius-xl); display: flex; align-items: center; justify-content: center; color: white; }
.services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--space-xl); }
.service-card { background: var(--bg-primary); padding: var(--space-xl); border-radius: var(--radius-lg); border: 1px solid var(--border-primary); }
.btn-service { background: var(--gradient-primary); color: white; padding: var(--space-md); border-radius: var(--radius-md); text-decoration: none; display: block; text-align: center; margin-top: var(--space-lg); }
</style>