import { ceilandiaLocations, getLocationOptions, getLocationsByType, getLocationById } from '~/utils/locations'

export const useLocations = () => {
  // Estado reativo das localizações
  const locations = ref(ceilandiaLocations)
  
  // Função para obter opções para selects
  const getSelectOptions = () => {
    return getLocationOptions()
  }
  
  // Função para obter localizações por tipo
  const getByType = (type) => {
    return getLocationsByType()[type] || []
  }
  
  // Função para buscar localização por ID
  const findById = (id) => {
    return getLocationById(id)
  }
  
  // Função para obter todas as localizações organizadas por tipo
  const getAllByType = () => {
    return getLocationsByType()
  }
  
  // Função para filtrar localizações
  const filterLocations = (searchTerm) => {
    if (!searchTerm) return locations.value
    
    const term = searchTerm.toLowerCase()
    return locations.value.filter(location => 
      location.name.toLowerCase().includes(term) ||
      location.description.toLowerCase().includes(term) ||
      location.type.toLowerCase().includes(term)
    )
  }
  
  // Função para obter estatísticas das localizações
  const getLocationStats = () => {
    const stats = {}
    locations.value.forEach(location => {
      stats[location.type] = (stats[location.type] || 0) + 1
    })
    return stats
  }
  
  return {
    locations: readonly(locations),
    getSelectOptions,
    getByType,
    findById,
    getAllByType,
    filterLocations,
    getLocationStats
  }
}