<template>
  <div class="placeholder-image" :style="{ width: width + 'px', height: height + 'px' }">
    <div class="placeholder-content">
      <Icones :nome="icon" v-if="icon" />
      <span v-else>{{ initials }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Icones from '@/components/global/icones/Icones.vue'

const props = defineProps({
  width: {
    type: Number,
    default: 150
  },
  height: {
    type: Number,
    default: 150
  },
  name: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: null
  }
})

const initials = computed(() => {
  if (!props.name) return '?'
  return props.name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
})
</script>

<style scoped>
.placeholder-image {
  background: linear-gradient(135deg, var(--cor-azul-principal), var(--cor-azul-royal));
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--cor-branco);
  font-family: var(--bold);
  font-size: var(--f3);
}

.placeholder-content svg {
  width: 40%;
  height: 40%;
  fill: var(--cor-branco);
}
</style>
