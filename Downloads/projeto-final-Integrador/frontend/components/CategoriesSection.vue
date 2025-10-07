<template>
  <section class="section-padding bg-white">
    <div class="max-w-7xl mx-auto">
      <h2 class="text-3xl font-bold text-center text-text mb-12">
        Categorias Populares
      </h2>
      
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <div 
          v-for="category in categories" 
          :key="category.id"
          class="text-center group cursor-pointer"
        >
          <div class="w-16 h-16 mx-auto mb-4 bg-secondary rounded-full flex items-center justify-center group-hover:bg-primary transition-colors">
            <div class="w-8 h-8 bg-primary rounded-full group-hover:bg-white transition-colors"></div>
          </div>
          <h3 class="font-semibold text-text group-hover:text-primary transition-colors">
            {{ category.name }}
          </h3>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const categories = [
  { id: 1, name: 'Limpeza', icon: '🧹' },
  { id: 2, name: 'Reformas', icon: '🔨' },
  { id: 3, name: 'Beleza', icon: '💄' },
  { id: 4, name: 'Tecnologia', icon: '💻' },
  { id: 5, name: 'Educação', icon: '📚' },
  { id: 6, name: 'Saúde', icon: '🏥' }
]
</script>