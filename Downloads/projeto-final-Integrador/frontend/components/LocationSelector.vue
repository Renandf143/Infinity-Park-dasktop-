<template>
  <div class="location-selector">
    <label v-if="label" :for="inputId" class="location-label">{{ label }}</label>
    <select 
      :id="inputId"
      :value="modelValue" 
      @input="$emit('update:modelValue', $event.target.value)"
      :class="selectClass"
      :disabled="disabled"
    >
      <option value="">{{ placeholder }}</option>
      <optgroup v-for="(locations, type) in locationsByType" :key="type" :label="getTypeLabel(type)">
        <option v-for="location in locations" :key="location.id" :value="location.id">
          {{ location.name }}
        </option>
      </optgroup>
    </select>
  </div>
</template>

<script setup>
import { useLocations } from '~/composables/useLocations'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Selecione uma localização'
  },
  selectClass: {
    type: String,
    default: 'location-select'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  groupByType: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue'])

const { getAllByType } = useLocations()

// ID único para o input
const inputId = `location-selector-${Math.random().toString(36).substr(2, 9)}`

// Localizações organizadas por tipo
const locationsByType = computed(() => {
  if (!props.groupByType) {
    return { all: getAllByType() }
  }
  return getAllByType()
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
.location-selector {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.location-label {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.location-select {
  padding: var(--space-md);
  border: 2px solid var(--border-primary);
  border-radius: var(--radius-md);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all var(--transition-base);
}

.location-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.location-select:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.location-select optgroup {
  font-weight: 600;
  color: var(--text-secondary);
}

.location-select option {
  padding: var(--space-sm);
  color: var(--text-primary);
}
</style>