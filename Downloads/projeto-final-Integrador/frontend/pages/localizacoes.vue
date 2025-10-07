<template>
  <div class="locations-page">
    <div class="container-custom">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <NuxtLink to="/">Início</NuxtLink>
        <span>/</span>
        <span>Localizações</span>
      </nav>

      <!-- Header -->
      <div class="page-header">
        <h1>Localizações Atendidas</h1>
        <p>Conheça todas as regiões de Ceilândia onde oferecemos nossos serviços</p>
      </div>

      <!-- Estatísticas -->
      <div class="stats-grid">
        <div class="stat-card" v-for="(count, type) in locationStats" :key="type">
          <div class="stat-number">{{ count }}</div>
          <div class="stat-label">{{ getTypeLabel(type) }}</div>
        </div>
      </div>

      <!-- Filtro por tipo -->
      <div class="section section-secondary">
        <h2 class="section-title">Filtrar por Tipo</h2>
        <div class="type-filters">
          <button 
            v-for="type in Object.keys(locationsByType)" 
            :key="type"
            @click="selectedType = selectedType === type ? '' : type"
            :class="['btn', 'btn-outline', { 'btn-primary': selectedType === type }]"
          >
            {{ getTypeLabel(type) }} ({{ locationsByType[type].length }})
          </button>
        </div>
      </div>

      <!-- Lista de localizações -->
      <div class="section section-primary">
        <div class="grid-3">
          <div 
            v-for="location in filteredLocations" 
            :key="location.id" 
            class="card location-card"
          >
            <div class="card-header">
              <div class="location-header">
                <h3>{{ location.name }}</h3>
                <span :class="['tag', 'tag-primary']">{{ getTypeLabel(location.type) }}</span>
              </div>
            </div>
            
            <div class="card-body">
              <p class="location-description">{{ location.description }}</p>
              
              <!-- Subsetores se existirem -->
              <div v-if="location.subsetores" class="subsetores">
                <h4>Subsetores:</h4>
                <div class="subsetor-tags">
                  <span v-for="subsetor in location.subsetores" :key="subsetor" class="tag">
                    {{ subsetor }}
                  </span>
                </div>
              </div>
            </div>

            <div class="card-footer">
              <NuxtLink to="/buscar" class="btn btn-primary btn-sm">
                Ver Profissionais
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Mapa das regiões -->
      <div class="section section-primary">
        <h2 class="section-title">Mapa das Regiões</h2>
        <div class="map-container">
          <img 
            src="~/assets/images/mapa-ceilandia.svg" 
            alt="Mapa das regiões de Ceilândia" 
            class="region-map"
          />
          <p class="map-note">Representação ilustrativa das regiões atendidas em Ceilândia - DF</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useLocations } from '~/composables/useLocations'

// Meta tags
useHead({
  title: 'Localizações Atendidas - ServiFlix',
  meta: [
    { name: 'description', content: 'Conheça todas as regiões de Ceilândia onde oferecemos nossos serviços' }
  ]
})

const { locations, getAllByType, getLocationStats } = useLocations()

// Estado reativo
const selectedType = ref('')

// Dados computados
const locationsByType = computed(() => getAllByType())
const locationStats = computed(() => getLocationStats())

const filteredLocations = computed(() => {
  if (!selectedType.value) return locations.value
  return locations.value.filter(location => location.type === selectedType.value)
})

// Labels dos tipos em português
const typeLabels = {
  'região': 'Regiões',
  'setor': 'Setores', 
  'condomínio': 'Condomínios',
  'expansão': 'Expansões'
}

const getTypeLabel = (type) => {
  return typeLabels[type] || type.charAt(0).toUpperCase() + type.slice(1)
}
</script>

<style scoped>
.locations-page {
  min-height: 100vh;
  background: var(--bg-secondary);
}

.location-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-md);
}

.location-header h3 {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-primary);
  flex: 1;
  margin: 0;
}

.location-description {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--space-lg);
}

.subsetores {
  margin-bottom: var(--space-lg);
}

.subsetores h4 {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
}

.subsetor-tags {
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.type-filters {
  display: flex;
  gap: var(--space-lg);
  flex-wrap: wrap;
  justify-content: center;
}

.map-container {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.region-map {
  width: 100%;
  height: auto;
  border: 2px solid var(--border-primary);
  border-radius: var(--radius-lg);
  background: var(--bg-primary);
  box-shadow: var(--shadow-md);
}

.map-note {
  margin-top: var(--space-lg);
  color: var(--text-tertiary);
  font-size: 0.9rem;
  font-style: italic;
}

@media (max-width: 768px) {
  .type-filters {
    flex-direction: column;
    align-items: center;
  }
  
  .location-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-sm);
  }
}
</style>