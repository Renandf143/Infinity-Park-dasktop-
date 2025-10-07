import { ref, computed } from 'vue'

const services = ref([])
const featuredServices = ref([])
const loading = ref(false)
const error = ref(null)

export const useServices = () => {
  const { $supabase } = useNuxtApp()

  const fetchServices = async (filters = {}) => {
    try {
      loading.value = true
      error.value = null

      let query = $supabase
        .from('services')
        .select(`
          *,
          provider:profiles!provider_id(
            id,
            full_name,
            avatar_url,
            user_type
          ),
          category:service_categories!category_id(
            id,
            name,
            color,
            icon
          )
        `)
        .eq('status', 'ativo')

      // Aplicar filtros
      if (filters.category_id) {
        query = query.eq('category_id', filters.category_id)
      }

      if (filters.location_type) {
        query = query.eq('location_type', filters.location_type)
      }

      if (filters.price_min) {
        query = query.gte('price_value', filters.price_min)
      }

      if (filters.price_max) {
        query = query.lte('price_value', filters.price_max)
      }

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      // Ordenação
      const orderBy = filters.orderBy || 'rating'
      const orderDirection = filters.orderDirection || 'desc'
      query = query.order(orderBy, { ascending: orderDirection === 'asc' })

      // Limite
      if (filters.limit) {
        query = query.limit(filters.limit)
      }

      const { data, error: fetchError } = await query

      if (fetchError) {
        throw fetchError
      }

      services.value = data || []
      return { success: true, data }
    } catch (err) {
      console.error('Erro ao buscar serviços:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const fetchFeaturedServices = async (limit = 6) => {
    try {
      const { data, error: fetchError } = await $supabase
        .from('services')
        .select(`
          *,
          provider:profiles!provider_id(
            id,
            full_name,
            avatar_url,
            user_type
          ),
          category:service_categories!category_id(
            id,
            name,
            color,
            icon
          )
        `)
        .eq('status', 'ativo')
        .gte('rating', 4.5) // Apenas serviços bem avaliados
        .gt('total_reviews', 0) // Que tenham pelo menos uma avaliação
        .order('rating', { ascending: false })
        .order('total_reviews', { ascending: false })
        .limit(limit)

      if (fetchError) {
        throw fetchError
      }

      featuredServices.value = data || []
      return { success: true, data }
    } catch (err) {
      console.error('Erro ao buscar serviços em destaque:', err)
      return { success: false, error: err.message }
    }
  }

  const fetchServiceById = async (id) => {
    try {
      const { data, error: fetchError } = await $supabase
        .from('services')
        .select(`
          *,
          provider:profiles!provider_id(
            id,
            full_name,
            avatar_url,
            user_type,
            phone
          ),
          category:service_categories!category_id(
            id,
            name,
            color,
            icon
          )
        `)
        .eq('id', id)
        .eq('status', 'ativo')
        .single()

      if (fetchError) {
        throw fetchError
      }

      return { success: true, data }
    } catch (err) {
      console.error('Erro ao buscar serviço:', err)
      return { success: false, error: err.message }
    }
  }

  const searchServices = async (query, filters = {}) => {
    try {
      loading.value = true
      error.value = null

      let supabaseQuery = $supabase
        .from('services')
        .select(`
          *,
          provider:profiles!provider_id(
            id,
            full_name,
            avatar_url,
            user_type
          ),
          category:service_categories!category_id(
            id,
            name,
            color,
            icon
          )
        `)
        .eq('status', 'ativo')

      // Busca por texto
      if (query && query.trim()) {
        supabaseQuery = supabaseQuery.or(
          `title.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`
        )
      }

      // Aplicar outros filtros
      if (filters.category_id) {
        supabaseQuery = supabaseQuery.eq('category_id', filters.category_id)
      }

      if (filters.location_type) {
        supabaseQuery = supabaseQuery.eq('location_type', filters.location_type)
      }

      if (filters.price_min) {
        supabaseQuery = supabaseQuery.gte('price_value', filters.price_min)
      }

      if (filters.price_max) {
        supabaseQuery = supabaseQuery.lte('price_value', filters.price_max)
      }

      // Ordenação
      supabaseQuery = supabaseQuery.order('rating', { ascending: false })

      const { data, error: fetchError } = await supabaseQuery

      if (fetchError) {
        throw fetchError
      }

      return { success: true, data: data || [] }
    } catch (err) {
      console.error('Erro na busca de serviços:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Computed para serviços formatados para o frontend
  const formattedServices = computed(() => {
    return services.value.map(service => ({
      id: service.id,
      title: service.title,
      description: service.description,
      price: service.price_value,
      priceType: service.price_type,
      rating: service.rating || 0,
      totalReviews: service.total_reviews || 0,
      image: service.images?.[0] || '/images/service-placeholder.jpg',
      images: service.images || [],
      provider: {
        id: service.provider?.id,
        name: service.provider?.full_name,
        avatar: service.provider?.avatar_url
      },
      category: {
        id: service.category?.id,
        name: service.category?.name,
        color: service.category?.color
      },
      locationType: service.location_type,
      serviceArea: service.service_area || [],
      tags: service.tags || [],
      duration: service.duration_estimate
    }))
  })

  const formattedFeaturedServices = computed(() => {
    return featuredServices.value.map(service => ({
      id: service.id,
      title: service.title,
      description: service.description,
      price: service.price_value,
      rating: service.rating || 0,
      image: service.images?.[0] || '/images/service-placeholder.jpg',
      provider: {
        name: service.provider?.full_name,
        avatar: service.provider?.avatar_url
      },
      category: {
        name: service.category?.name,
        color: service.category?.color
      }
    }))
  })

  return {
    services: readonly(services),
    featuredServices: readonly(featuredServices),
    formattedServices,
    formattedFeaturedServices,
    loading: readonly(loading),
    error: readonly(error),
    fetchServices,
    fetchFeaturedServices,
    fetchServiceById,
    searchServices
  }
}