import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { XIcon, MapPinIcon, StarIcon, UsersIcon } from 'lucide-react';
import { professionalService, ProfessionalProfile as Professional } from '../services/professionalService';
interface BrazilState {
  id: string;
  name: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}
export function InteractiveBrazilMap() {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [stateCounts, setStateCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  // Posições aproximadas dos estados no mapa SVG (em porcentagem)
  const brazilStates: BrazilState[] = [{
    id: 'AC',
    name: 'Acre',
    position: {
      x: 8,
      y: 48,
      width: 12,
      height: 15
    }
  }, {
    id: 'AL',
    name: 'Alagoas',
    position: {
      x: 82,
      y: 52,
      width: 6,
      height: 8
    }
  }, {
    id: 'AP',
    name: 'Amapá',
    position: {
      x: 42,
      y: 8,
      width: 10,
      height: 12
    }
  }, {
    id: 'AM',
    name: 'Amazonas',
    position: {
      x: 15,
      y: 20,
      width: 25,
      height: 28
    }
  }, {
    id: 'BA',
    name: 'Bahia',
    position: {
      x: 65,
      y: 48,
      width: 18,
      height: 25
    }
  }, {
    id: 'CE',
    name: 'Ceará',
    position: {
      x: 72,
      y: 32,
      width: 12,
      height: 12
    }
  }, {
    id: 'DF',
    name: 'Distrito Federal',
    position: {
      x: 58,
      y: 60,
      width: 3,
      height: 3
    }
  }, {
    id: 'ES',
    name: 'Espírito Santo',
    position: {
      x: 70,
      y: 72,
      width: 6,
      height: 8
    }
  }, {
    id: 'GO',
    name: 'Goiás',
    position: {
      x: 52,
      y: 58,
      width: 15,
      height: 18
    }
  }, {
    id: 'MA',
    name: 'Maranhão',
    position: {
      x: 55,
      y: 28,
      width: 18,
      height: 18
    }
  }, {
    id: 'MT',
    name: 'Mato Grosso',
    position: {
      x: 35,
      y: 48,
      width: 20,
      height: 22
    }
  }, {
    id: 'MS',
    name: 'Mato Grosso do Sul',
    position: {
      x: 42,
      y: 70,
      width: 15,
      height: 15
    }
  }, {
    id: 'MG',
    name: 'Minas Gerais',
    position: {
      x: 58,
      y: 65,
      width: 18,
      height: 20
    }
  }, {
    id: 'PA',
    name: 'Pará',
    position: {
      x: 38,
      y: 22,
      width: 22,
      height: 25
    }
  }, {
    id: 'PB',
    name: 'Paraíba',
    position: {
      x: 82,
      y: 42,
      width: 8,
      height: 6
    }
  }, {
    id: 'PR',
    name: 'Paraná',
    position: {
      x: 50,
      y: 82,
      width: 12,
      height: 10
    }
  }, {
    id: 'PE',
    name: 'Pernambuco',
    position: {
      x: 78,
      y: 45,
      width: 10,
      height: 10
    }
  }, {
    id: 'PI',
    name: 'Piauí',
    position: {
      x: 68,
      y: 38,
      width: 12,
      height: 15
    }
  }, {
    id: 'RJ',
    name: 'Rio de Janeiro',
    position: {
      x: 68,
      y: 78,
      width: 8,
      height: 6
    }
  }, {
    id: 'RN',
    name: 'Rio Grande do Norte',
    position: {
      x: 82,
      y: 35,
      width: 10,
      height: 8
    }
  }, {
    id: 'RS',
    name: 'Rio Grande do Sul',
    position: {
      x: 48,
      y: 92,
      width: 14,
      height: 12
    }
  }, {
    id: 'RO',
    name: 'Rondônia',
    position: {
      x: 25,
      y: 48,
      width: 12,
      height: 15
    }
  }, {
    id: 'RR',
    name: 'Roraima',
    position: {
      x: 28,
      y: 8,
      width: 12,
      height: 15
    }
  }, {
    id: 'SC',
    name: 'Santa Catarina',
    position: {
      x: 52,
      y: 88,
      width: 12,
      height: 8
    }
  }, {
    id: 'SP',
    name: 'São Paulo',
    position: {
      x: 58,
      y: 78,
      width: 12,
      height: 10
    }
  }, {
    id: 'SE',
    name: 'Sergipe',
    position: {
      x: 80,
      y: 50,
      width: 6,
      height: 6
    }
  }, {
    id: 'TO',
    name: 'Tocantins',
    position: {
      x: 58,
      y: 45,
      width: 12,
      height: 18
    }
  }];
  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const allProfessionals = await professionalService.getAllProfessionals();
        const counts: Record<string, number> = {};
        allProfessionals.forEach(prof => {
          const state = prof.location?.state || '';
          if (state) {
            counts[state] = (counts[state] || 0) + 1;
          }
        });
        setStateCounts(counts);
      } catch (error) {
        console.error('Error fetching professionals:', error);
      }
    };
    fetchProfessionals();
  }, []);
  const handleStateClick = async (stateId: string) => {
    setSelectedState(stateId);
    setLoading(true);
    try {
      const stateName = brazilStates.find(s => s.id === stateId)?.name || '';
      const allProfessionals = await professionalService.getAllProfessionals();
      const filtered = allProfessionals.filter(prof => 
        prof.location?.city?.includes(stateName) || 
        prof.location?.state?.includes(stateId) ||
        prof.location?.state === stateId
      );
      setProfessionals(filtered);
    } catch (error) {
      console.error('Error fetching professionals:', error);
    } finally {
      setLoading(false);
    }
  };
  const getStateColor = (stateId: string) => {
    const count = stateCounts[stateId] || 0;
    if (count > 50) return 'rgba(96, 165, 250, 0.7)';
    if (count > 20) return 'rgba(147, 197, 253, 0.6)';
    if (count > 0) return 'rgba(191, 219, 254, 0.5)';
    return 'rgba(71, 85, 105, 0.3)';
  };
  return <section className="w-full py-20 bg-[#1E40AF] relative overflow-hidden" style={{
    borderTopLeftRadius: '50% 5%',
    borderTopRightRadius: '50% 5%'
  }}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-white/10 rounded-full mb-4 backdrop-blur-sm border border-white/20">
            <span className="text-white font-semibold text-sm">
              MAPA INTERATIVO
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Profissionais em Todo o Brasil
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Clique em um estado para ver todos os profissionais cadastrados na
            região
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
              <div className="relative w-full" style={{
              paddingBottom: '100%'
            }}>
                {/* Mapa base do Brasil */}
                <img src="/Brazil_Blank_Map.svg" alt="Mapa do Brasil" className="absolute inset-0 w-full h-full object-contain" />
                {/* Camada de interação - Estados clicáveis */}
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" style={{
                pointerEvents: 'none'
              }}>
                  {brazilStates.map(state => <g key={state.id}>
                      {/* Área clicável do estado */}
                      <rect x={state.position.x} y={state.position.y} width={state.position.width} height={state.position.height} fill={selectedState === state.id ? 'rgba(30, 58, 138, 0.8)' : hoveredState === state.id ? 'rgba(37, 99, 235, 0.6)' : getStateColor(state.id)} stroke={selectedState === state.id || hoveredState === state.id ? '#FFFFFF' : 'transparent'} strokeWidth="0.5" className="cursor-pointer transition-all duration-300" style={{
                    pointerEvents: 'all'
                  }} onMouseEnter={() => setHoveredState(state.id)} onMouseLeave={() => setHoveredState(null)} onClick={() => handleStateClick(state.id)} />
                      {/* Label do estado */}
                      {(hoveredState === state.id || selectedState === state.id) && <text x={state.position.x + state.position.width / 2} y={state.position.y + state.position.height / 2} fill="white" fontSize="3" fontWeight="bold" textAnchor="middle" dominantBaseline="middle" className="pointer-events-none">
                          {state.id}
                        </text>}
                      {/* Contador de profissionais */}
                      {stateCounts[state.id] > 0 && !selectedState && !hoveredState && <text x={state.position.x + state.position.width / 2} y={state.position.y + state.position.height / 2} fill="white" fontSize="2.5" fontWeight="bold" textAnchor="middle" dominantBaseline="middle" className="pointer-events-none">
                            {stateCounts[state.id]}
                          </text>}
                    </g>)}
                </svg>
                {/* Tooltip do estado em hover */}
                {hoveredState && <motion.div initial={{
                opacity: 0,
                y: -10
              }} animate={{
                opacity: 1,
                y: 0
              }} className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-xl pointer-events-none z-10">
                    <p className="font-semibold text-sm">
                      {brazilStates.find(s => s.id === hoveredState)?.name}
                    </p>
                    <p className="text-xs text-gray-300">
                      {stateCounts[hoveredState] || 0} profissionais
                    </p>
                  </motion.div>}
              </div>
              {/* Legend */}
              <div className="mt-6 flex items-center justify-center gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[#BFDBFE]"></div>
                  <span className="text-sm text-gray-300">
                    1-20 profissionais
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[#93C5FD]"></div>
                  <span className="text-sm text-gray-300">
                    21-50 profissionais
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[#60A5FA]"></div>
                  <span className="text-sm text-gray-300">
                    50+ profissionais
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Info Panel */}
          <div className="lg:col-span-1">
            <AnimatePresence mode="wait">
              {!selectedState ? <motion.div key="info" initial={{
              opacity: 0,
              x: 20
            }} animate={{
              opacity: 1,
              x: 0
            }} exit={{
              opacity: 0,
              x: -20
            }} className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                  <UsersIcon className="w-12 h-12 text-blue-400 mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Selecione um Estado
                  </h3>
                  <p className="text-gray-300 mb-6">
                    Clique em qualquer estado no mapa para ver os profissionais
                    disponíveis naquela região.
                  </p>
                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-3xl font-bold text-white mb-1">
                        {Object.values(stateCounts).reduce((a, b) => a + b, 0)}
                      </p>
                      <p className="text-sm text-gray-400">
                        Total de Profissionais
                      </p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-3xl font-bold text-white mb-1">27</p>
                      <p className="text-sm text-gray-400">Estados Cobertos</p>
                    </div>
                  </div>
                </motion.div> : <motion.div key="professionals" initial={{
              opacity: 0,
              x: 20
            }} animate={{
              opacity: 1,
              x: 0
            }} exit={{
              opacity: 0,
              x: -20
            }} className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 max-h-[600px] overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">
                        {brazilStates.find(s => s.id === selectedState)?.name}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {professionals.length} profissionais encontrados
                      </p>
                    </div>
                    <button onClick={() => setSelectedState(null)} className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all">
                      <XIcon className="w-5 h-5 text-white" />
                    </button>
                  </div>
                  {loading ? <div className="text-center py-8">
                      <div className="inline-block w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    </div> : professionals.length === 0 ? <div className="text-center py-8">
                      <MapPinIcon className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                      <p className="text-gray-400">
                        Nenhum profissional encontrado neste estado
                      </p>
                    </div> : <div className="space-y-4">
                      {professionals.map(prof => <motion.div key={prof.id} initial={{
                  opacity: 0,
                  y: 10
                }} animate={{
                  opacity: 1,
                  y: 0
                }} onClick={() => navigate(`/profissional/${prof.id}`)} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                          <div className="flex items-start gap-3">
                            <img src={prof.image} alt={prof.name} className="w-12 h-12 rounded-lg object-cover" />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">
                                {prof.name}
                              </h4>
                              <p className="text-sm text-gray-400 mb-2 truncate">
                                {prof.serviceType}
                              </p>
                              <div className="flex items-center gap-3 text-xs">
                                <div className="flex items-center gap-1">
                                  <StarIcon className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-gray-300">
                                    {prof.rating}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPinIcon className="w-3 h-3 text-gray-400" />
                                  <span className="text-gray-400">
                                    {prof.location ? `${prof.location.city}, ${prof.location.state}` : 'Localização não informada'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-white">
                                R$ {prof.price}
                              </p>
                              <p className="text-xs text-gray-400">/hora</p>
                            </div>
                          </div>
                        </motion.div>)}
                    </div>}
                  {professionals.length > 0 && <button onClick={() => navigate(`/categorias?location=${selectedState}`)} className="w-full mt-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-all">
                      Ver Todos em{' '}
                      {brazilStates.find(s => s.id === selectedState)?.name}
                    </button>}
                </motion.div>}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>;
}