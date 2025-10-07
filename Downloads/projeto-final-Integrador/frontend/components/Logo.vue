<template>
  <div class="logo-container">
    <img 
      src="/logo.svg" 
      :alt="alt || 'Logo'" 
      :class="logoClass"
      :style="logoStyle"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  size: {
    type: String,
    default: 'medium'
  },
  alt: {
    type: String,
    default: 'Logo'
  },
  customClass: {
    type: String,
    default: ''
  }
})

const logoClass = computed(() => {
  const sizeClasses = {
    small: 'h-8 w-auto',
    medium: 'h-12 w-auto',
    large: 'h-16 w-auto',
    xlarge: 'h-24 w-auto'
  }
  
  return `${sizeClasses[props.size] || sizeClasses.medium} ${props.customClass}`
})

const logoStyle = computed(() => {
  return {
    maxWidth: '100%',
    height: 'auto'
  }
})
</script>

<style scoped>
.logo-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

img {
  transition: all 0.3s ease;
}

img:hover {
  transform: scale(1.05);
}
</style>