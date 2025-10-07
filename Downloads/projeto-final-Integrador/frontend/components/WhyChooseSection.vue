<template>
  <section class="section-padding bg-white">
    <div class="max-w-7xl mx-auto">
      <h2 class="text-3xl font-bold text-center text-text mb-12">
        Por que escolher a ServiFlx
      </h2>
      
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div 
          v-for="feature in features" 
          :key="feature.id"
          class="text-center"
        >
          <div class="w-16 h-16 mx-auto mb-6 bg-secondary rounded-full flex items-center justify-center">
            <span class="text-2xl">{{ feature.icon }}</span>
          </div>
          
          <h3 class="text-lg font-semibold text-text mb-3">{{ feature.title }}</h3>
          <p class="text-text-light text-sm">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const features = [
  {
    id: 1,
    icon: '✅',
    title: 'Profissionais verificados',
    description: 'Todos os prestadores passam por verificação de identidade e qualificação'
  },
  {
    id: 2,
    icon: '💰',
    title: 'Preços justos',
    description: 'Compare orçamentos e escolha a melhor opção para seu bolso'
  },
  {
    id: 3,
    icon: '🛡️',
    title: 'Avaliação real',
    description: 'Sistema de avaliações transparente com comentários reais'
  },
  {
    id: 4,
    icon: '⚡',
    title: 'Suporte 24/7',
    description: 'Nossa equipe está sempre disponível para ajudar você'
  }
]
</script>