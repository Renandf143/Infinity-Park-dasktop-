<template>
  <div class="category-page">
    <div class="container-custom">
      <nav class="breadcrumb">
        <NuxtLink to="/">Início</NuxtLink>
        <span>/</span>
        <NuxtLink to="/categorias">Categorias</NuxtLink>
        <span>/</span>
        <span>Saúde</span>
      </nav>

      <div class="category-header">
        <div class="category-info">
          <div class="category-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M17,13H13V17H11V13H7V11H11V7H13V11H17V13Z"/>
            </svg>
          </div>
          <div class="category-details">
            <h1>Saúde</h1>
            <p>Profissionais de saúde e cuidados médicos</p>
            <div class="category-stats">
              <span>180 profissionais</span>
              <span>⭐ 4.9 (3.2k avaliações)</span>
            </div>
          </div>
        </div>
      </div>

      <div class="services-section">
        <h2>Serviços de Saúde</h2>
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
  title: 'Saúde - ServiFlix',
  meta: [{ name: 'description', content: 'Profissionais de saúde e cuidados médicos' }]
})

const services = ref([
  { id: 1, slug: 'enfermagem', name: 'Enfermagem Domiciliar', description: 'Cuidados de enfermagem em casa', price: 80 },
  { id: 2, slug: 'fisioterapia', name: 'Fisioterapia', description: 'Fisioterapia domiciliar', price: 100 },
  { id: 3, slug: 'cuidador', name: 'Cuidador de Idosos', description: 'Cuidados especializados para idosos', price: 60 },
  { id: 4, slug: 'nutricao', name: 'Nutrição', description: 'Consultas nutricionais', price: 120 },
  { id: 5, slug: 'psicologia', name: 'Psicologia', description: 'Atendimento psicológico', price: 150 }
])
</script>

<style scoped>
.category-page { min-height: 80vh; padding: var(--space-4xl) 0; background: var(--bg-secondary); }
.breadcrumb { display: flex; align-items: center; gap: var(--space-sm); margin-bottom: var(--space-2xl); }
.category-header { background: var(--bg-primary); padding: var(--space-3xl); border-radius: var(--radius-xl); margin-bottom: var(--space-3xl); }
.category-info { display: flex; align-items: center; gap: var(--space-2xl); }
.category-icon { width: 100px; height: 100px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: var(--radius-xl); display: flex; align-items: center; justify-content: center; color: white; }
.services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--space-xl); }
.service-card { background: var(--bg-primary); padding: var(--space-xl); border-radius: var(--radius-lg); border: 1px solid var(--border-primary); }
.btn-service { background: var(--gradient-primary); color: white; padding: var(--space-md); border-radius: var(--radius-md); text-decoration: none; display: block; text-align: center; margin-top: var(--space-lg); }
</style>