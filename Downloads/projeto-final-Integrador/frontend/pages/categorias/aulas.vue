<template>
  <div class="category-page">
    <div class="container-custom">
      <nav class="breadcrumb">
        <NuxtLink to="/">Início</NuxtLink>
        <span>/</span>
        <NuxtLink to="/categorias">Categorias</NuxtLink>
        <span>/</span>
        <span>Aulas</span>
      </nav>

      <div class="category-header">
        <div class="category-info">
          <div class="category-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,3H5C3.9,3 3,3.9 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.9 20.1,3 19,3M5,19V5H19V19H5Z"/>
            </svg>
          </div>
          <div class="category-details">
            <h1>Aulas</h1>
            <p>Professores particulares e cursos especializados</p>
            <div class="category-stats">
              <span>780 profissionais</span>
              <span>⭐ 4.9 (6.7k avaliações)</span>
            </div>
          </div>
        </div>
      </div>

      <div class="services-section">
        <h2>Tipos de Aula</h2>
        <div class="services-grid">
          <div v-for="service in services" :key="service.id" class="service-card">
            <div class="service-content">
              <h3>{{ service.name }}</h3>
              <p>{{ service.description }}</p>
              <div class="service-price">
                <span class="price">A partir de R$ {{ service.price }}/hora</span>
              </div>
              <NuxtLink :to="`/servicos/${service.slug}`" class="btn-service">
                Ver Professores
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
  title: 'Aulas - ServiFlix',
  meta: [{ name: 'description', content: 'Encontre professores particulares' }]
})

const services = ref([
  { id: 1, slug: 'matematica', name: 'Matemática', description: 'Aulas de matemática todos os níveis', price: 50 },
  { id: 2, slug: 'ingles', name: 'Inglês', description: 'Aulas de inglês conversação e gramática', price: 60 },
  { id: 3, slug: 'musica', name: 'Música', description: 'Aulas de instrumentos musicais', price: 70 }
])
</script>

<style scoped>
.category-page { min-height: 80vh; padding: var(--space-4xl) 0; background: var(--bg-secondary); }
.breadcrumb { display: flex; align-items: center; gap: var(--space-sm); margin-bottom: var(--space-2xl); }
.category-header { background: var(--bg-primary); padding: var(--space-3xl); border-radius: var(--radius-xl); margin-bottom: var(--space-3xl); }
.category-info { display: flex; align-items: center; gap: var(--space-2xl); }
.category-icon { width: 100px; height: 100px; background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); border-radius: var(--radius-xl); display: flex; align-items: center; justify-content: center; color: white; }
.services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--space-xl); }
.service-card { background: var(--bg-primary); padding: var(--space-xl); border-radius: var(--radius-lg); border: 1px solid var(--border-primary); }
.btn-service { background: var(--gradient-primary); color: white; padding: var(--space-md); border-radius: var(--radius-md); text-decoration: none; display: block; text-align: center; margin-top: var(--space-lg); }
</style>