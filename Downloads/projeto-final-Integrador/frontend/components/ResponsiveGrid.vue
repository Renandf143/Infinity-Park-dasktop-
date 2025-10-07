<template>
  <div 
    class="responsive-grid" 
    :class="[
      `grid-${columns}`,
      `gap-${gap}`,
      responsive && 'responsive',
      className
    ]"
    :style="customStyle"
  >
    <slot />
  </div>
</template>

<script setup>
const props = defineProps({
  columns: {
    type: [String, Number],
    default: 'auto'
  },
  gap: {
    type: String,
    default: 'md'
  },
  responsive: {
    type: Boolean,
    default: true
  },
  minItemWidth: {
    type: String,
    default: '280px'
  },
  className: {
    type: String,
    default: ''
  }
})

const customStyle = computed(() => {
  if (props.columns === 'auto') {
    return {
      '--min-item-width': props.minItemWidth
    }
  }
  return {}
})
</script>

<style scoped>
.responsive-grid {
  display: grid;
  width: 100%;
}

/* Grid Columns */
.grid-auto {
  grid-template-columns: repeat(auto-fit, minmax(var(--min-item-width, 280px), 1fr));
}

.grid-1 { grid-template-columns: 1fr; }
.grid-2 { grid-template-columns: repeat(2, 1fr); }
.grid-3 { grid-template-columns: repeat(3, 1fr); }
.grid-4 { grid-template-columns: repeat(4, 1fr); }
.grid-5 { grid-template-columns: repeat(5, 1fr); }
.grid-6 { grid-template-columns: repeat(6, 1fr); }

/* Gap Sizes */
.gap-xs { gap: var(--space-xs); }
.gap-sm { gap: var(--space-sm); }
.gap-md { gap: var(--space-md); }
.gap-lg { gap: var(--space-lg); }
.gap-xl { gap: var(--space-xl); }
.gap-2xl { gap: var(--space-2xl); }
.gap-3xl { gap: var(--space-3xl); }

/* Responsive Breakdowns */
.responsive.grid-6 {
  grid-template-columns: repeat(6, 1fr);
}

@media (max-width: 1440px) {
  .responsive.grid-6 {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 1024px) {
  .responsive.grid-6,
  .responsive.grid-5,
  .responsive.grid-4 {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .responsive.grid-6,
  .responsive.grid-5,
  .responsive.grid-4,
  .responsive.grid-3 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .responsive.grid-6,
  .responsive.grid-5,
  .responsive.grid-4,
  .responsive.grid-3,
  .responsive.grid-2 {
    grid-template-columns: 1fr;
  }
}
</style>