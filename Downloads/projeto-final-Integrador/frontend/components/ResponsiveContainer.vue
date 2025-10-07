<template>
  <div 
    class="responsive-container"
    :class="[
      `size-${size}`,
      centered && 'centered',
      fluid && 'fluid',
      className
    ]"
  >
    <slot />
  </div>
</template>

<script setup>
const props = defineProps({
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['xs', 'sm', 'default', 'lg', 'xl', '2xl', 'full'].includes(value)
  },
  centered: {
    type: Boolean,
    default: true
  },
  fluid: {
    type: Boolean,
    default: false
  },
  className: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.responsive-container {
  width: 100%;
  padding-left: var(--space-lg);
  padding-right: var(--space-lg);
}

.responsive-container.centered {
  margin-left: auto;
  margin-right: auto;
}

.responsive-container.fluid {
  max-width: none;
  padding-left: 0;
  padding-right: 0;
}

/* Container Sizes */
.size-xs { max-width: 480px; }
.size-sm { max-width: 640px; }
.size-default { max-width: 1320px; }
.size-lg { max-width: 1440px; }
.size-xl { max-width: 1600px; }
.size-2xl { max-width: 1920px; }
.size-full { max-width: none; }

/* Responsive Padding */
@media (min-width: 640px) {
  .responsive-container:not(.fluid) {
    padding-left: var(--space-xl);
    padding-right: var(--space-xl);
  }
}

@media (min-width: 1024px) {
  .responsive-container:not(.fluid) {
    padding-left: var(--space-2xl);
    padding-right: var(--space-2xl);
  }
}

@media (min-width: 1440px) {
  .responsive-container:not(.fluid) {
    padding-left: var(--space-3xl);
    padding-right: var(--space-3xl);
  }
}

@media (max-width: 480px) {
  .responsive-container:not(.fluid) {
    padding-left: var(--space-md);
    padding-right: var(--space-md);
  }
}
</style>