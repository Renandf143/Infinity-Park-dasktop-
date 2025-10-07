<template>
  <section class="section-padding bg-white">
    <div class="max-w-7xl mx-auto">
      <h2 class="text-3xl font-bold text-center text-text mb-12">
        Como funciona
      </h2>
      
      <div class="grid md:grid-cols-3 gap-8">
        <div 
          v-for="(step, index) in steps" 
          :key="step.id"
          class="text-center"
        >
          <div class="w-16 h-16 mx-auto mb-6 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {{ index + 1 }}
          </div>
          
          <h3 class="text-xl font-semibold text-text mb-4">{{ step.title }}</h3>
          <p class="text-text-light">{{ step.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const steps = [
  {
    id: 1,
    title: 'Solicite um serviço',
    description: 'Descreva o que você precisa e receba orçamentos de profissionais qualificados'
  },
  {
    id: 2,
    title: 'Compare e qualifique',
    description: 'Analise perfis, avaliações e escolha o profissional ideal para seu projeto'
  },
  {
    id: 3,
    title: 'Serviços realizados',
    description: 'Acompanhe o progresso e avalie o serviço após a conclusão'
  }
]
</script>