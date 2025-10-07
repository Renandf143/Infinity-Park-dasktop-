<template>
  <div class="category-page">
    <div class="container-custom">
      <nav class="breadcrumb">
        <NuxtLink to="/">Início</NuxtLink>
        <span>/</span>
        <NuxtLink to="/categorias">Categorias</NuxtLink>
        <span>/</span>
        <span>Assistência Técnica</span>
      </nav>

      <div class="category-header">
        <div class="category-info">
          <div class="category-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z"/>
            </svg>
          </div>
          <div class="category-details">
            <h1>Assistência Técnica</h1>
            <p>Reparo de equipamentos e eletrônicos</p>
            <div class="category-stats">
              <span>650 profissionais</span>
              <span>⭐ 4.6 (5.8k avaliações)</span>
            </div>
          </div>
        </div>
      </div>

      <div class="services-section">
        <h2>Serviços Técnicos</h2>
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
  title: 'Assistência Técnica - ServiFlix',
  meta: [{ name: 'description', content: 'Reparo de equipamentos eletrônicos' }]
})

const services = ref([
  { id: 1, slug: 'celular', name: 'Reparo de Celular', description: 'Conserto de smartphones e tablets', price: 80 },
  { id: 2, slug: 'computador', name: 'Reparo de Computador', description: 'Manutenção de PCs e notebooks', price: 100 },
  { id: 3, slug: 'eletrodomesticos', name: 'Eletrodomésticos', description: 'Reparo de geladeiras, máquinas, etc.', price: 120 }
])
</script>

<style scoped>
.category-page { min-height: 80vh; padding: var(--space-4xl) 0; background: var(--bg-secondary); }
.breadcrumb { display: flex; align-items: center; gap: var(--space-sm); margin-bottom: var(--space-2xl); }
.category-header { background: var(--bg-primary); padding: var(--space-3xl); border-radius: var(--radius-xl); margin-bottom: var(--space-3xl); }
.category-info { display: flex; align-items: center; gap: var(--space-2xl); }
.category-icon { width: 100px; height: 100px; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); border-radius: var(--radius-xl); display: flex; align-items: center; justify-content: center; color: white; }
.services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--space-xl); }
.service-card { background: var(--bg-primary); padding: var(--space-xl); border-radius: var(--radius-lg); border: 1px solid var(--border-primary); }
.btn-service { background: var(--gradient-primary); color: white; padding: var(--space-md); border-radius: var(--radius-md); text-decoration: none; display: block; text-align: center; margin-top: var(--space-lg); }
</style>