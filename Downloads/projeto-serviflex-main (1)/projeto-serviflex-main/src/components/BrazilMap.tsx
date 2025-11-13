import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MapPinIcon, UsersIcon, TrendingUpIcon, ArrowRight, RefreshCw } from "lucide-react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

interface StateData {
  name: string;
  slug: string;
  professionals: number;
  growth: number;
}

interface Professional {
  id: string;
  displayName: string;
  profession: string;
  photoURL?: string;
  state: string;
}

const stateNames: Record<string, string> = {
  TO: "Tocantins",
  BA: "Bahia",
  SE: "Sergipe",
  PE: "Pernambuco",
  AL: "Alagoas",
  RN: "Rio Grande do Norte",
  CE: "Ceará",
  PI: "Piauí",
  MA: "Maranhão",
  AP: "Amapá",
  PA: "Pará",
  RR: "Roraima",
  AM: "Amazonas",
  AC: "Acre",
  RO: "Rondônia",
  MT: "Mato Grosso",
  MS: "Mato Grosso do Sul",
  GO: "Goiás",
  PR: "Paraná",
  SC: "Santa Catarina",
  RS: "Rio Grande do Sul",
  SP: "São Paulo",
  MG: "Minas Gerais",
  RJ: "Rio de Janeiro",
  ES: "Espírito Santo",
  DF: "Distrito Federal",
  PB: "Paraíba",
};

export function BrazilMap() {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [statesData, setStatesData] = useState<Record<string, StateData>>({});
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProfessionals, setLoadingProfessionals] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleStateClick = useCallback((stateSlug: string) => {
    setSelectedState(stateSlug);
  }, []);

  // Buscar contagem de profissionais por estado com listener em tempo real
  useEffect(() => {
    const professionalsRef = collection(db, "serviceProviders");
    
    // Listener em tempo real
    const unsubscribe = onSnapshot(
      professionalsRef,
      (snapshot) => {
        console.log("📊 Total de documentos encontrados:", snapshot.size);
        
        const stateCount: Record<string, number> = {};
        const stateCountLastMonth: Record<string, number> = {};
        const allStates: string[] = [];
        
        // Data de 30 dias atrás
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          
          // Debug: mostrar estrutura do primeiro documento
          if (allStates.length === 0) {
            console.log("📄 Exemplo de documento:", {
              id: doc.id,
              keys: Object.keys(data),
              data: data
            });
          }
          
          // Buscar em TODOS os campos possíveis
          const state = 
            data.state || 
            data.estado || 
            data.address?.state || 
            data.address?.estado ||
            data.location?.state || 
            data.location?.estado ||
            data.user?.state ||
            data.user?.estado ||
            data.user?.address?.state ||
            data.user?.address?.estado ||
            data.serviceProviderProfile?.state ||
            data.serviceProviderProfile?.address?.state;
          
          if (state) {
            const stateUpper = state.toUpperCase().trim();
            allStates.push(stateUpper);
            stateCount[stateUpper] = (stateCount[stateUpper] || 0) + 1;
            
            // Verificar se foi criado há mais de 30 dias
            const createdAt = data.createdAt?.toDate?.() || new Date(data.createdAt || Date.now());
            if (createdAt < thirtyDaysAgo) {
              stateCountLastMonth[stateUpper] = (stateCountLastMonth[stateUpper] || 0) + 1;
            }
          } else {
            console.log("⚠️ Documento sem estado:", doc.id, "Campos disponíveis:", Object.keys(data));
          }
        });

        console.log("🗺️ Estados encontrados:", allStates);
        console.log("📈 Contagem por estado:", stateCount);

        const newStatesData: Record<string, StateData> = {};
        
        Object.keys(stateNames).forEach((slug) => {
          const currentCount = stateCount[slug] || 0;
          const lastMonthCount = stateCountLastMonth[slug] || 0;
          
          // Calcular crescimento real
          let growth = 0;
          if (lastMonthCount > 0) {
            growth = Math.round(((currentCount - lastMonthCount) / lastMonthCount) * 100);
          } else if (currentCount > 0) {
            // Se não tinha profissionais antes, crescimento é 100%
            growth = 100;
          }
          
          // Garantir que o crescimento não seja negativo para exibição
          growth = Math.max(0, growth);
          
          newStatesData[slug] = {
            name: stateNames[slug],
            slug,
            professionals: currentCount,
            growth: growth,
          };
        });

        setStatesData(newStatesData);
        setLoading(false);
      },
      (error) => {
        console.error("❌ Erro ao buscar profissionais:", error);
        setLoading(false);
      }
    );

    // Cleanup
    return () => unsubscribe();
  }, []);

  // Buscar profissionais do estado selecionado com listener em tempo real
  useEffect(() => {
    if (!selectedState) {
      setProfessionals([]);
      return;
    }

    console.log("🔍 Buscando profissionais para o estado:", selectedState);
    setLoadingProfessionals(true);
    
    const professionalsRef = collection(db, "serviceProviders");
    
    // Listener em tempo real para profissionais do estado
    const unsubscribe = onSnapshot(
      professionalsRef,
      (snapshot) => {
        const stateProfessionals: Professional[] = [];
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          
          // Buscar em TODOS os campos possíveis
          const state = 
            data.state || 
            data.estado || 
            data.address?.state || 
            data.address?.estado ||
            data.location?.state || 
            data.location?.estado ||
            data.user?.state ||
            data.user?.estado ||
            data.user?.address?.state ||
            data.user?.address?.estado ||
            data.serviceProviderProfile?.state ||
            data.serviceProviderProfile?.address?.state;
          
          if (state && state.toUpperCase().trim() === selectedState) {
            console.log("✅ Profissional encontrado:", {
              id: doc.id,
              name: data.displayName || data.name,
              state: state
            });
            
            stateProfessionals.push({
              id: doc.id,
              displayName: data.displayName || data.name || data.user?.displayName || data.user?.name || "Profissional",
              profession: data.profession || data.profissao || data.category || data.serviceCategory || data.user?.profession || "Profissional",
              photoURL: data.photoURL || data.photoUrl || data.user?.photoUrl || data.user?.photoURL || data.user?.photo,
              state: selectedState,
            });
          }
        });

        console.log(`📋 Total de profissionais encontrados em ${selectedState}:`, stateProfessionals.length);
        
        // Ordenar por nome
        stateProfessionals.sort((a, b) => a.displayName.localeCompare(b.displayName));
        
        setProfessionals(stateProfessionals.slice(0, 10));
        setLoadingProfessionals(false);
      },
      (error) => {
        console.error("❌ Erro ao buscar profissionais do estado:", error);
        setLoadingProfessionals(false);
      }
    );

    // Cleanup
    return () => unsubscribe();
  }, [selectedState]);

  const totalProfessionals = Object.values(statesData).reduce(
    (sum, state) => sum + state.professionals,
    0
  );
  const avgGrowth = Object.keys(statesData).length > 0
    ? Math.round(
        Object.values(statesData).reduce((sum, state) => sum + state.growth, 0) /
          Object.keys(statesData).length
      )
    : 0;

  useEffect(() => {
    if (!containerRef.current) return;

    fetch("/mapa_brasil.html")
      .then((res) => res.text())
      .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const svgElement = doc.querySelector("#svg-map");

        if (svgElement && containerRef.current) {
          containerRef.current.innerHTML = "";
          containerRef.current.appendChild(svgElement.cloneNode(true));

          const svg = containerRef.current.querySelector("#svg-map");
          if (svg) {
            svg.setAttribute("width", "100%");
            svg.setAttribute("height", "100%");
            svg.setAttribute("class", "max-w-2xl w-full h-auto mx-auto");
          }

          const estados = containerRef.current.querySelectorAll<SVGAElement>(".estado");

          estados.forEach((estado) => {
            const textElement = estado.querySelector("text");
            const stateCode = textElement?.textContent?.trim();

            if (stateCode && statesData[stateCode]) {
              estado.style.cursor = "pointer";
              estado.style.transition = "all 0.3s ease";

              estado.addEventListener("click", (e) => {
                e.preventDefault();
                handleStateClick(stateCode);
              });
            }
          });
        }
      })
      .catch((error) => console.error("Erro ao carregar mapa:", error));
  }, [handleStateClick, statesData]);

  useEffect(() => {
    if (!containerRef.current) return;

    const estados = containerRef.current.querySelectorAll<SVGAElement>(".estado");

    estados.forEach((estado) => {
      const textElement = estado.querySelector("text");
      const stateCode = textElement?.textContent?.trim();
      const path = estado.querySelector("path");
      const circle = estado.querySelector(".circle");

      if (stateCode) {
        const isSelected = selectedState === stateCode;

        if (path) {
          if (isSelected) {
            path.setAttribute("fill", "#3B82F6");
            path.setAttribute("stroke", "#60A5FA");
            path.setAttribute("stroke-width", "2");
          } else {
            path.setAttribute("fill", "#374151");
            path.setAttribute("stroke", "#4B5563");
            path.setAttribute("stroke-width", "1");
          }
        }

        if (circle) {
          if (isSelected) {
            circle.setAttribute("fill", "#3B82F6");
          } else {
            circle.setAttribute("fill", "#374151");
          }
        }

        if (isSelected) {
          estado.style.filter = "drop-shadow(0 4px 12px rgba(59, 130, 246, 0.6))";
          estado.style.transform = "scale(1.03)";
          estado.style.transformOrigin = "center";
        } else {
          estado.style.opacity = "1";
          estado.style.filter = "none";
          estado.style.transform = "scale(1)";
        }
      }
    });
  }, [selectedState]);

  if (loading) {
    return (
      <section className="w-full py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando dados...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 text-sm font-semibold rounded-full">
              COBERTURA NACIONAL
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-600 text-xs font-semibold rounded-full">
              <RefreshCw className="w-3 h-3" />
              Tempo Real
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Profissionais em Todo o Brasil
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Conectamos você com profissionais qualificados em todos os estados. Dados atualizados em tempo real.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <UsersIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total de Profissionais</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalProfessionals.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <MapPinIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Estados Atendidos</p>
                <p className="text-2xl font-bold text-gray-900">27</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                <TrendingUpIcon className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Crescimento Médio</p>
                <p className="text-2xl font-bold text-gray-900">+{avgGrowth}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <div
              ref={containerRef}
              className="relative w-full flex items-center justify-center bg-slate-50 rounded-xl p-4"
              style={{ minHeight: "500px" }}
            />
            <p className="text-center text-sm text-gray-500 mt-4">
              Clique em um estado para ver os profissionais
            </p>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm sticky top-4 max-h-[600px] overflow-y-auto">
              {selectedState && statesData[selectedState] ? (
                <>
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {statesData[selectedState].name}
                    </h3>
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-sm font-semibold rounded-full">
                      {statesData[selectedState].slug}
                    </span>
                  </div>

                  <div className="mb-6 p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <UsersIcon className="w-5 h-5 text-blue-600" />
                        <span className="text-sm text-gray-600">Profissionais</span>
                      </div>
                      <span className="text-xl font-bold text-gray-900">
                        {statesData[selectedState].professionals}
                      </span>
                    </div>
                  </div>

                  {loadingProfessionals ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2 text-sm text-gray-600">Carregando...</p>
                    </div>
                  ) : professionals.length > 0 ? (
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        Profissionais Disponíveis
                      </h4>
                      {professionals.map((prof) => (
                        <div
                          key={prof.id}
                          className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {prof.photoURL ? (
                              <img
                                src={prof.photoURL}
                                alt={prof.displayName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-blue-600 font-semibold text-lg">
                                {prof.displayName.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-sm truncate">
                              {prof.displayName}
                            </p>
                            <p className="text-xs text-gray-600 truncate">
                              {prof.profession}
                            </p>
                          </div>
                          <button
                            onClick={() => navigate(`/profissional/${prof.id}`)}
                            className="flex-shrink-0 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Ver perfil"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => navigate(`/profissionais?estado=${selectedState}`)}
                        className="w-full mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-sm"
                      >
                        Ver Todos os Profissionais
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <UsersIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-600">
                        Nenhum profissional encontrado neste estado
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <MapPinIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Clique em um estado no mapa para ver os profissionais
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
