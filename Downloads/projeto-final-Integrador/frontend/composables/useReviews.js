import { ref, computed } from 'vue'

const reviews = ref([])
const loading = ref(false)
const error = ref(null)

export const useReviews = () => {
  const { $supabase } = useNuxtApp()

  const fetchReviews = async (filters = {}) => {
    try {
      loading.value = true
      error.value = null

      let query = $supabase
        .from('reviews')
        .select(`
          *,
          reviewer:profiles!reviewer_id(
            id,
            full_name,
            avatar_url
          ),
          reviewed:profiles!reviewed_id(
            id,
            full_name,
            avatar_url
          ),
          service:services!service_id(
            id,
            title
          )
        `)
        .eq('is_public', true)

      // Aplicar filtros
      if (filters.service_id) {
        query = query.eq('service_id', filters.service_id)
      }

      if (filters.reviewed_id) {
        query = query.eq('reviewed_id', filters.reviewed_id)
      }

      if (filters.min_rating) {
        query = query.gte('rating', filters.min_rating)
      }

      // Ordenação
      query = query.order('created_at', { ascending: false })

      // Limite
      if (filters.limit) {
        query = query.limit(filters.limit)
      }

      const { data, error: fetchError } = await query

      if (fetchError) {
        throw fetchError
      }

      reviews.value = data || []
      return { success: true, data }
    } catch (err) {
      console.error('Erro ao buscar avaliações:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const fetchTestimonials = async (limit = 6) => {
    try {
      const { data, error: fetchError } = await $supabase
        .from('reviews')
        .select(`
          *,
          reviewer:profiles!reviewer_id(
            id,
            full_name,
            avatar_url
          ),
          service:services!service_id(
            id,
            title,
            category:service_categories!category_id(
              name
            )
          )
        `)
        .eq('is_public', true)
        .gte('rating', 4) // Apenas avaliações boas
        .not('comment', 'is', null) // Que tenham comentário
        .order('created_at', { ascending: false })
        .limit(limit)

      if (fetchError) {
        throw fetchError
      }

      return { success: true, data: data || [] }
    } catch (err) {
      console.error('Erro ao buscar depoimentos:', err)
      return { success: false, error: err.message }
    }
  }

  const createReview = async (reviewData) => {
    try {
      const { user } = useAuth()
      
      if (!user.value) {
        throw new Error('Usuário não autenticado')
      }

      const { data, error: insertError } = await $supabase
        .from('reviews')
        .insert({
          ...reviewData,
          reviewer_id: user.value.id
        })
        .select()
        .single()

      if (insertError) {
        throw insertError
      }

      return { success: true, data }
    } catch (err) {
      console.error('Erro ao criar avaliação:', err)
      return { success: false, error: err.message }
    }
  }

  const getAverageRating = async (serviceId) => {
    try {
      const { data, error: fetchError } = await $supabase
        .from('reviews')
        .select('rating')
        .eq('service_id', serviceId)
        .eq('is_public', true)

      if (fetchError) {
        throw fetchError
      }

      if (!data || data.length === 0) {
        return { success: true, average: 0, count: 0 }
      }

      const average = data.reduce((sum, review) => sum + review.rating, 0) / data.length
      return { 
        success: true, 
        average: Math.round(average * 10) / 10, // Arredondar para 1 casa decimal
        count: data.length 
      }
    } catch (err) {
      console.error('Erro ao calcular média de avaliações:', err)
      return { success: false, error: err.message }
    }
  }

  // Computed para avaliações formatadas
  const formattedReviews = computed(() => {
    return reviews.value.map(review => ({
      id: review.id,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      createdAt: review.created_at,
      reviewer: {
        id: review.reviewer?.id,
        name: review.reviewer?.full_name,
        avatar: review.reviewer?.avatar_url || '/images/avatar-placeholder.jpg'
      },
      service: {
        id: review.service?.id,
        title: review.service?.title
      }
    }))
  })

  // Função para formatar depoimentos para a página inicial
  const formatTestimonials = (testimonials) => {
    return testimonials.map(testimonial => ({
      id: testimonial.id,
      name: testimonial.reviewer?.full_name || 'Cliente',
      location: 'Ceilândia', // Pode ser expandido para incluir localização real
      text: testimonial.comment,
      avatar: testimonial.reviewer?.avatar_url || '/images/avatar-placeholder.jpg',
      rating: testimonial.rating,
      service: testimonial.service?.title,
      category: testimonial.service?.category?.name
    }))
  }

  return {
    reviews: readonly(reviews),
    formattedReviews,
    loading: readonly(loading),
    error: readonly(error),
    fetchReviews,
    fetchTestimonials,
    createReview,
    getAverageRating,
    formatTestimonials
  }
}