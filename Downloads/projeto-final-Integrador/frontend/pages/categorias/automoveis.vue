<template>
  <div class="category-page">
    <div class="container-custom">
      <nav class="breadcrumb">
        <NuxtLink to="/">Início</NuxtLink>
        <span>/</span>
        <NuxtLink to="/categorias">Categorias</NuxtLink>
        <span>/</span>
        <span>Automóveis</span>
      </nav>

      <div class="category-header">
        <div class="category-info">
          <div class="category-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M5,11L6.5,6.5H17.5L19,11M17.5,16A1.5,1.5 0 0,1 16,14.5A1.5,1.5 0 0,1 17.5,13A1.5,1.5 0 0,1 19,14.5A1.5,1.5 0 0,1 17.5,16M6.5,16A1.5,1.5 0 0,1 5,14.5A1.5,1.5 0 0,1 6.5,13A1.5,1.5 0 0,1 8,14.5A1.5,1.5 0 0,1 6.5,16M18.92,6C18.72,5.42 18.16,5 17.5,5H6.5C5.84,5 5.28,5.42 5.08,6L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V19H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6Z"/>
            </svg>
          </div>
          <div class="category-details">
            <h1>Automóveis</h1>
            <p>Serviços automotivos e cuidados com veículos</p>
            <div class="category-stats">
              <span>220 profissionais</span>
              <span>⭐ 4.6 (2.1k avaliações)</span>
            </div>
          </div>
        </div>
      </div>

      <div class="services-section">
        <h2>Serviços Automotivos</h2>
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
  title: 'Automóveis - ServiFlix',
  meta: [{ name: 'description', content: 'Serviços automotivos e cuidados com veículos' }]
})

const services = ref([
  { id: 1, slug: 'mecanico', name: 'Mecânico', description: 'Reparos e manutenção automotiva', price: 80 },
  { id: 2, slug: 'lavagem', name: 'Lavagem de Carros', description: 'Lavagem e enceramento', price: 25 },
  { id: 3, slug: 'eletrica-automotiva', name: 'Elétrica Automotiva', description: 'Reparos no sistema elétrico', price: 100 },
  { id: 4, slug: 'funilaria', name: 'Funilaria e Pintura', description: 'Reparos na lataria', price: 200 },
  { id: 5, slug: 'borracharia', name: 'Borracharia', description: 'Troca e reparo de pneus', price: 30 }
])
</script>

<style scoped>
.category-page { min-height: 80vh; padding: var(--space-4xl) 0; background: var(--bg-secondary); }
.breadcrumb { display: flex; align-items: center; gap: var(--space-sm); margin-bottom: var(--space-2xl); }
.category-header { background: var(--bg-primary); padding: var(--space-3xl); border-radius: var(--radius-xl); margin-bottom: var(--space-3xl); }
.category-info { display: flex; align-items: center; gap: var(--space-2xl); }
.category-icon { width: 100px; height: 100px; background: linear-gradient(135deg, #64748b 0%, #475569 100%); border-radius: var(--radius-xl); display: flex; align-items: center; justify-content: center; color: white; }
.services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--space-xl); }
.service-card { background: var(--bg-primary); padding: var(--space-xl); border-radius: var(--radius-lg); border: 1px solid var(--border-primary); }
.btn-service { background: var(--gradient-primary); color: white; padding: var(--space-md); border-radius: var(--radius-md); text-decoration: none; display: block; text-align: center; margin-top: var(--space-lg); }
</style>