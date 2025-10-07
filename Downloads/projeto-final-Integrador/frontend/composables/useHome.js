// Composable para a página inicial
export const useHome = () => {
  // Dados das categorias
  const categories = ref([
    {
      id: 'limpeza',
      name: 'Limpeza',
      icon: '🧹',
      description: 'Diaristas e faxineiras',
      count: '2.5k+ profissionais',
      path: '/categoria/limpeza'
    },
    {
      id: 'reformas',
      name: 'Reformas',
      icon: '🔨',
      description: 'Pedreiros e pintores',
      count: '1.8k+ profissionais',
      path: '/categoria/reformas'
    },
    {
      id: 'eletrica',
      name: 'Elétrica',
      icon: '⚡',
      description: 'Eletricistas certificados',
      count: '1.2k+ profissionais',
      path: '/categoria/eletrica'
    },
    {
      id: 'encanamento',
      name: 'Encanamento',
      icon: '🔧',
      description: 'Encanadores experientes',
      count: '900+ profissionais',
      path: '/categoria/encanamento'
    },
    {
      id: 'jardinagem',
      name: 'Jardinagem',
      icon: '🌱',
      description: 'Jardineiros e paisagistas',
      count: '650+ profissionais',
      path: '/categoria/jardinagem'
    },
    {
      id: 'tecnologia',
      name: 'Tecnologia',
      icon: '💻',
      description: 'Técnicos em informática',
      count: '800+ profissionais',
      path: '/categoria/tecnologia'
    }
  ])

  // Dados dos profissionais em destaque
  const featuredProfessionals = ref([
    {
      id: 1,
      name: 'João Silva',
      specialty: 'Eletricista Residencial',
      location: 'São Paulo, SP',
      rating: 4.9,
      services: 150,
      experience: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 2,
      name: 'Maria Santos',
      specialty: 'Diarista Especializada',
      location: 'Rio de Janeiro, RJ',
      rating: 5.0,
      services: 300,
      experience: 8,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 3,
      name: 'Carlos Oliveira',
      specialty: 'Pedreiro e Pintor',
      location: 'Belo Horizonte, MG',
      rating: 4.8,
      services: 200,
      experience: 12,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    }
  ])

  // Dados dos depoimentos
  const testimonials = ref([
    {
      id: 1,
      rating: 5,
      text: 'Encontrei um eletricista excelente através do ServiFlix. Serviço rápido, preço justo e muito profissional!',
      author: {
        name: 'Ana Costa',
        subtitle: 'Cliente desde 2023',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      }
    },
    {
      id: 2,
      rating: 5,
      text: 'Plataforma muito fácil de usar. A diarista que contratei foi pontual e fez um trabalho impecável!',
      author: {
        name: 'Roberto Lima',
        subtitle: 'Cliente desde 2022',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
      }
    },
    {
      id: 3,
      rating: 5,
      text: 'Reforma da minha casa ficou perfeita! Os profissionais são realmente verificados e qualificados.',
      author: {
        name: 'Fernanda Silva',
        subtitle: 'Cliente desde 2023',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
      }
    }
  ])

  // Estatísticas do hero
  const heroStats = ref([
    { number: '50k+', label: 'Profissionais' },
    { number: '200k+', label: 'Serviços' },
    { number: '4.9★', label: 'Avaliação' }
  ])

  // Função de busca
  const searchQuery = ref('')
  
  const handleSearch = () => {
    if (searchQuery.value.trim()) {
      navigateTo(`/buscar?q=${encodeURIComponent(searchQuery.value)}`)
    }
  }

  // Função para contatar profissional
  const contactProfessional = (professionalId) => {
    navigateTo(`/profissional/${professionalId}`)
  }

  return {
    categories,
    featuredProfessionals,
    testimonials,
    heroStats,
    searchQuery,
    handleSearch,
    contactProfessional
  }
}