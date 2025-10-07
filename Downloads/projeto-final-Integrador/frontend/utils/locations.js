// Localizações e regiões de Ceilândia - DF
export const ceilandiaLocations = [
  {
    id: 'ceilandia-norte',
    name: 'Ceilândia Norte',
    description: 'Parte norte da RA de Ceilândia, com quadras QNM / QNN etc.',
    type: 'região'
  },
  {
    id: 'ceilandia-sul',
    name: 'Ceilândia Sul',
    description: 'Parte sul da cidade.',
    type: 'região'
  },
  {
    id: 'ceilandia-centro',
    name: 'Ceilândia Centro',
    description: 'Setor central da cidade.',
    type: 'região'
  },
  {
    id: 'guariroba',
    name: 'Guariroba',
    description: 'Originalmente parte da área tradicional de Ceilândia.',
    type: 'setor'
  },
  {
    id: 'setor-o',
    name: 'Setor O',
    description: 'Um dos setores planejados dentro de Ceilândia.',
    type: 'setor'
  },
  {
    id: 'setor-p',
    name: 'Setor P',
    description: 'Dividido em P Norte e P Sul.',
    type: 'setor',
    subsetores: ['P Norte', 'P Sul']
  },
  {
    id: 'setor-q',
    name: 'Setor Q',
    description: 'Com quadras QNQ etc.',
    type: 'setor'
  },
  {
    id: 'setor-r',
    name: 'Setor R',
    description: 'Também consta nas expansões da RA Ceilândia.',
    type: 'setor'
  },
  {
    id: 'condominio-prive-lucena-roriz',
    name: 'Condomínio Privê Lucena Roriz',
    description: 'Parte da expansão da RA.',
    type: 'condomínio'
  },
  {
    id: 'expansoes-setores-onp',
    name: 'Expansões dos Setores O, N e P',
    description: 'Partes novas da cidade.',
    type: 'expansão'
  },
  {
    id: 'nova-ceilandia',
    name: 'Nova Ceilândia',
    description: 'Parte da expansão da área norte (incluída no Ceilândia Norte).',
    type: 'expansão'
  }
];

// Função para obter todas as localizações organizadas por tipo
export const getLocationsByType = () => {
  const locationsByType = {};
  
  ceilandiaLocations.forEach(location => {
    if (!locationsByType[location.type]) {
      locationsByType[location.type] = [];
    }
    locationsByType[location.type].push(location);
  });
  
  return locationsByType;
};

// Função para buscar localização por ID
export const getLocationById = (id) => {
  return ceilandiaLocations.find(location => location.id === id);
};

// Função para obter lista simples para selects
export const getLocationOptions = () => {
  return ceilandiaLocations.map(location => ({
    value: location.id,
    label: location.name
  }));
};

// Função para filtrar localizações por tipo
export const getLocationsByTypeFilter = (type) => {
  return ceilandiaLocations.filter(location => location.type === type);
};