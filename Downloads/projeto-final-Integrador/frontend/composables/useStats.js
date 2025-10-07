import { ref } from 'vue'

const stats = ref({
  totalProfessionals: 0,
  totalServices: 0,
  averageRating: 0,
  totalOrders: 0
})
const loading = ref(false)
const error = ref(null)

export const useStats = () => {
  const { $supabase } = useNuxtApp()

  const fetchPlatformStats = async () => {
    try {
      loading.value = true
      error.value = null

      // Buscar estatísticas em paralelo
      const [
        professionalsResult,
        servicesResult,
        ordersResult,
        ratingsResult
      ] = await Promise.all([
        // Total de profissionais
        $supabase
          .from('profiles')
          .select('id', { count: 'exact' })
          .eq('user_type', 'profissional')
          .eq('status', 'ativo'),
        
        // Total de serviços ativos
        $supabase
          .from('services')
          .select('id', { count: 'exact' })
          .eq('status', 'ativo'),
        
        // Total de pedidos concluídos
        $supabase
          .from('orders')
          .select('id', { count: 'exact' })
          .eq('status', 'concluido'),
        
        // Média geral de avaliações
        $supabase
          .from('reviews')
          .select('rating')
          .eq('is_public', true)
      ])

      // Processar resultados
      const totalProfessionals = professionalsResult.count || 0
      const totalServices = servicesResult.count || 0
      const totalOrders = ordersResult.count || 0

      // Calcular média de avaliações
      let averageRating = 0
      if (ratingsResult.data && ratingsResult.data.length > 0) {
        const sum = ratingsResult.data.reduce((acc, review) => acc + review.rating, 0)
        averageRating = Math.round((sum / ratingsResult.data.length) * 10) / 10
      }

      stats.value = {
        totalProfessionals,
        totalServices,
        averageRating,
        totalOrders
      }

      return { success: true, data: stats.value }
    } catch (err) {
      console.error('Erro ao buscar estatísticas:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const fetchCategoryStats = async () => {
    try {
      const { data, error: fetchError } = await $supabase
        .from('service_categories')
        .select(`
          id,
          name,
          services:services(count)
        `)
        .eq('is_active', true)
        .is('parent_id', null)

      if (fetchError) {
        throw fetchError
      }

      return { success: true, data: data || [] }
    } catch (err) {
      console.error('Erro ao buscar estatísticas de categorias:', err)
      return { success: false, error: err.message }
    }
  }

  const fetchRecentActivity = async (limit = 10) => {
    try {
      // Buscar atividades recentes (pedidos, avaliações, etc.)
      const [ordersResult, reviewsResult] = await Promise.all([
        $supabase
          .from('orders')
          .select(`
            id,
            title,
            status,
            created_at,
            client:profiles!client_id(full_name)
          `)
          .order('created_at', { ascending: false })
          .limit(limit),
        
        $supabase
          .from('reviews')
          .select(`
            id,
            rating,
            created_at,
            reviewer:profiles!reviewer_id(full_name),
            service:services!service_id(title)
          `)
          .eq('is_public', true)
          .order('created_at', { ascending: false })
          .limit(limit)
      ])

      const activities = []

      // Adicionar pedidos
      if (ordersResult.data) {
        ordersResult.data.forEach(order => {
          activities.push({
            type: 'order',
            id: order.id,
            title: `Novo pedido: ${order.title}`,
            user: order.client?.full_name,
            createdAt: order.created_at,
            status: order.status
          })
        })
      }

      // Adicionar avaliações
      if (reviewsResult.data) {
        reviewsResult.data.forEach(review => {
          activities.push({
            type: 'review',
            id: review.id,
            title: `Nova avaliação para: ${review.service?.title}`,
            user: review.reviewer?.full_name,
            createdAt: review.created_at,
            rating: review.rating
          })
        })
      }

      // Ordenar por data
      activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

      return { success: true, data: activities.slice(0, limit) }
    } catch (err) {
      console.error('Erro ao buscar atividades recentes:', err)
      return { success: false, error: err.message }
    }
  }

  // Função para formatar números grandes
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k'
    }
    return num.toString()
  }

  // Função para gerar estatísticas formatadas para exibição
  const getFormattedStats = () => {
    return {
      professionals: {
        value: formatNumber(stats.value.totalProfessionals),
        label: 'Profissionais',
        raw: stats.value.totalProfessionals
      },
      services: {
        value: formatNumber(stats.value.totalServices),
        label: 'Serviços realizados',
        raw: stats.value.totalServices
      },
      rating: {
        value: stats.value.averageRating.toFixed(1),
        label: 'Avaliação média',
        raw: stats.value.averageRating
      },
      orders: {
        value: formatNumber(stats.value.totalOrders),
        label: 'Pedidos concluídos',
        raw: stats.value.totalOrders
      }
    }
  }

  return {
    stats: readonly(stats),
    loading: readonly(loading),
    error: readonly(error),
    fetchPlatformStats,
    fetchCategoryStats,
    fetchRecentActivity,
    getFormattedStats,
    formatNumber
  }
}