import { ref, computed } from 'vue'

const categories = ref([])
const loading = ref(false)
const error = ref(null)

export const useCategories = () => {
  const { $supabase } = useNuxtApp()

  const fetchCategories = async () => {
    try {
      loading.value = true
      error.value = null

      const { data, error: fetchError } = await $supabase
        .from('service_categories')
        .select('*')
        .eq('is_active', true)
        .is('parent_id', null) // Apenas categorias principais
        .order('sort_order', { ascending: true })

      if (fetchError) {
        throw fetchError
      }

      categories.value = data || []
      return { success: true, data }
    } catch (err) {
      console.error('Erro ao buscar categorias:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const fetchSubcategories = async (parentId) => {
    try {
      const { data, error: fetchError } = await $supabase
        .from('service_categories')
        .select('*')
        .eq('is_active', true)
        .eq('parent_id', parentId)
        .order('sort_order', { ascending: true })

      if (fetchError) {
        throw fetchError
      }

      return { success: true, data: data || [] }
    } catch (err) {
      console.error('Erro ao buscar subcategorias:', err)
      return { success: false, error: err.message }
    }
  }

  const getCategoryById = (id) => {
    return categories.value.find(cat => cat.id === id)
  }

  const getCategoryByName = (name) => {
    return categories.value.find(cat => cat.name.toLowerCase() === name.toLowerCase())
  }

  // Computed para categorias formatadas para o frontend
  const formattedCategories = computed(() => {
    return categories.value.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.name.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, ''),
      color: category.color || '#3b82f6',
      iconPath: getIconPath(category.icon || category.name),
      description: category.description
    }))
  })

  // Função para mapear ícones baseado no nome da categoria
  const getIconPath = (iconName) => {
    const iconMap = {
      'tecnologia': 'M2 3h20v18H2V3zm2 2v14h16V5H4zm2 2h12v2H6V7zm0 4h8v2H6v-2z',
      'design': 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
      'marketing': 'M7 4V2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2h4a1 1 0 0 1 0 2h-1v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6H3a1 1 0 0 1 0-2h4z',
      'consultoria': 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
      'educacao': 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z',
      'saude': 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
      'construcao': 'M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z',
      'juridico': 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
      'financeiro': 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
      'outros': 'M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zM13 12a1 1 0 11-2 0 1 1 0 012 0zM20 12a1 1 0 11-2 0 1 1 0 012 0z'
    }

    const key = iconName.toLowerCase()
    return iconMap[key] || iconMap['outros']
  }

  return {
    categories: readonly(categories),
    formattedCategories,
    loading: readonly(loading),
    error: readonly(error),
    fetchCategories,
    fetchSubcategories,
    getCategoryById,
    getCategoryByName
  }
}