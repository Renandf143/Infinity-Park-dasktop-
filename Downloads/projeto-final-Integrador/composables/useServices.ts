export const useServices = () => {
  const services = ref([])
  const categories = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Buscar serviços
  const fetchServices = async (filters = {}) => {
    try {
      loading.value = true
      error.value = null

      const { data } = await $fetch('/api/services', {
        query: filters
      })

      services.value = data.data
      return { success: true, data: data.data, pagination: data.pagination }
    } catch (err: any) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Buscar categorias
  const fetchCategories = async () => {
    try {
      const { data } = await $fetch('/api/categories')
      categories.value = data.data
      return { success: true, data: data.data }
    } catch (err: any) {
      error.value = err.message
      return { success: false, error: err.message }
    }
  }

  // Buscar serviços mais bem avaliados
  const getTopRatedServices = async (limit = 6) => {
    return await fetchServices({
      sortBy: 'provider.rating',
      order: 'desc',
      limit
    })
  }

  // Buscar serviços por categoria
  const getServicesByCategory = async (categorySlug: string, limit = 10) => {
    return await fetchServices({
      category: categorySlug,
      limit
    })
  }

  // Buscar serviços por localização
  const getServicesByLocation = async (location: string, limit = 10) => {
    return await fetchServices({
      location,
      limit
    })
  }

  return {
    services: readonly(services),
    categories: readonly(categories),
    loading: readonly(loading),
    error: readonly(error),
    fetchServices,
    fetchCategories,
    getTopRatedServices,
    getServicesByCategory,
    getServicesByLocation
  }
}
