<template>
  <section class="section-padding bg-gray-50">
    <div class="max-w-7xl mx-auto">
      <h2 class="text-3xl font-bold text-center text-text mb-12">
        Principais serviços pedidos
      </h2>
      
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="service in services" 
          :key="service.id"
          class="card"
        >
          <div class="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
            <img 
              :src="service.image" 
              :alt="service.title"
              class="w-full h-full object-cover"
            >
          </div>
          
          <h3 class="text-xl font-semibold text-text mb-2">{{ service.title }}</h3>
          <p class="text-text-light mb-4">{{ service.description }}</p>
          
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <div class="flex text-yellow-400">
                <span v-for="i in 5" :key="i">⭐</span>
              </div>
              <span class="ml-2 text-sm text-text-light">{{ service.rating }}</span>
            </div>
            <span class="text-lg font-bold text-primary">R$ {{ service.price }}</span>
          </div>
          
          <button class="btn-secondary w-full">Ver Detalhes</button>
        </div>
      </div>
      
      <div class="text-center mt-12">
        <button class="btn-primary">Ver todos os serviços</button>
      </div>
    </div>
  </section>
</template>

<script setup>
const services = [
  {
    id: 1,
    title: 'Faxina e Limpeza',
    description: 'Serviço completo de limpeza residencial e comercial',
    rating: '4.9',
    price: '80',
    image: '/api/placeholder/400/250'
  },
  {
    id: 2,
    title: 'Serviços de Pedreiro',
    description: 'Reformas, reparos e construção em geral',
    rating: '4.8',
    price: '120',
    image: '/api/placeholder/400/250'
  },
  {
    id: 3,
    title: 'Instalação de Móveis',
    description: 'Montagem e instalação de móveis diversos',
    rating: '4.9',
    price: '60',
    image: '/api/placeholder/400/250'
  }
]
</script>