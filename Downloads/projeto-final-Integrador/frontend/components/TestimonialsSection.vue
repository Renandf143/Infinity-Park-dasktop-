<template>
  <section class="section-padding bg-gray-50">
    <div class="max-w-7xl mx-auto">
      <h2 class="text-3xl font-bold text-center text-text mb-12">
        O que nossos clientes dizem
      </h2>
      
      <div class="grid md:grid-cols-3 gap-8">
        <div 
          v-for="testimonial in testimonials" 
          :key="testimonial.id"
          class="card"
        >
          <div class="flex items-center mb-4">
            <div class="flex text-yellow-400 mb-2">
              <span v-for="i in 5" :key="i">⭐</span>
            </div>
          </div>
          
          <p class="text-text-light mb-6 italic">
            "{{ testimonial.comment }}"
          </p>
          
          <div class="flex items-center">
            <div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-semibold mr-4">
              {{ testimonial.name.charAt(0) }}
            </div>
            <div>
              <h4 class="font-semibold text-text">{{ testimonial.name }}</h4>
              <p class="text-sm text-text-light">{{ testimonial.service }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const testimonials = [
  {
    id: 1,
    name: 'Maria Silva',
    service: 'Limpeza Residencial',
    comment: 'Excelente serviço! A profissional foi muito atenciosa e deixou minha casa impecável.'
  },
  {
    id: 2,
    name: 'João Santos',
    service: 'Reforma Banheiro',
    comment: 'Trabalho de qualidade, dentro do prazo e preço justo. Recomendo!'
  },
  {
    id: 3,
    name: 'Ana Costa',
    service: 'Montagem de Móveis',
    comment: 'Profissional pontual e cuidadoso. Montou todos os móveis perfeitamente.'
  }
]
</script>