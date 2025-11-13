import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { DynamicIcon } from "../components/DynamicIcon";
import { LocationFilter } from "../components/LocationFilter";
import { 
  ArrowLeftIcon, Loader2Icon, MapPinIcon, StarIcon, 
  FilterIcon, XIcon, SlidersHorizontalIcon, SearchIcon
} from "lucide-react";
import { professionalService } from "../services/professionalService";
import { categoryService } from "../services/categoryService";
import { ServiceProviderProfile, ServiceCategory } from "../types/firestore";
import { categoriesData } from "../data/categoriesWithSubcategories";

export function CategoryPageNew() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const navigate = useNavigate();

  const [category, setCategory] = useState<ServiceCategory | null>(null);
  const [professionals, setProfessionals] = useState<ServiceProviderProfile[]>([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState<ServiceProviderProfile[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados de filtro
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500 });
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<"rating" | "price-low" | "price-high" | "reviews">("rating");
  
  // Filtros de localização
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  
  // Subcategorias disponíveis
  const [subcategories, setSubcategories] = useState<Array<{ id: string; name: string; icon: string }>>([]);

  // Função para calcular distância entre dois pontos
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const applyFilters = useCallback(() => {
    let filtered = [...professionals];

    // Filtro de busca
    if (searchTerm) {
      filtered = filtered.filter(prof => 
        prof.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prof.profession?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro de subcategorias
    if (selectedSubcategories.length > 0) {
      filtered = filtered.filter(prof => 
        selectedSubcategories.some(subcat => 
          prof.profession?.toLowerCase().includes(subcat.toLowerCase()) ||
          prof.skills?.some(skill => skill.toLowerCase().includes(subcat.toLowerCase()))
        )
      );
    }

    // Filtro de localização por estado
    if (selectedState) {
      filtered = filtered.filter(prof => {
        if (typeof prof.location === 'string') {
          return prof.location.includes(selectedState);
        }
        return prof.location?.state === selectedState;
      });
    }

    // Filtro de localização por cidade
    if (selectedCity) {
      filtered = filtered.filter(prof => {
        if (typeof prof.location === 'string') {
          return prof.location.toLowerCase().includes(selectedCity.toLowerCase());
        }
        return prof.location?.city?.toLowerCase().includes(selectedCity.toLowerCase());
      });
    }

    // Filtro de preço
    filtered = filtered.filter(prof => 
      prof.hourlyRate >= priceRange.min && prof.hourlyRate <= priceRange.max
    );

    // Filtro de avaliação
    if (minRating > 0) {
      filtered = filtered.filter(prof => prof.rating >= minRating);
    }

    // Se o usuário ativou localização, ordenar por distância
    if (userLocation) {
      filtered = filtered.map(prof => {
        let distance = Infinity;
        
        // Tentar obter coordenadas do profissional
        if (prof.location && typeof prof.location !== 'string') {
          if (prof.location.latitude && prof.location.longitude) {
            distance = calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              prof.location.latitude,
              prof.location.longitude
            );
          }
        }
        
        return { ...prof, distance };
      }).sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
    } else {
      // Ordenação normal
      switch (sortBy) {
        case "rating":
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case "price-low":
          filtered.sort((a, b) => a.hourlyRate - b.hourlyRate);
          break;
        case "price-high":
          filtered.sort((a, b) => b.hourlyRate - a.hourlyRate);
          break;
        case "reviews":
          filtered.sort((a, b) => b.reviewCount - a.reviewCount);
          break;
      }
    }

    setFilteredProfessionals(filtered);
  }, [professionals, searchTerm, selectedSubcategories, priceRange, minRating, sortBy, selectedState, selectedCity, userLocation]);

  const loadData = useCallback(async () => {
    if (!categorySlug) return;

    setLoading(true);
    try {
      const categoryData = await categoryService.getCategoryBySlug(categorySlug);
      setCategory(categoryData);

      const categoryInfo = categoriesData.find(cat => cat.slug === categorySlug);
      if (categoryInfo) {
        setSubcategories(categoryInfo.subcategories);
      }

      const professionalsData = await professionalService.getProfessionalsByCategory(categorySlug);
      setProfessionals(professionalsData);
      setFilteredProfessionals(professionalsData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  }, [categorySlug]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const toggleSubcategory = (subcategoryName: string) => {
    setSelectedSubcategories(prev => 
      prev.includes(subcategoryName)
        ? prev.filter(s => s !== subcategoryName)
        : [...prev, subcategoryName]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedSubcategories([]);
    setPriceRange({ min: 0, max: 500 });
    setMinRating(0);
    setSortBy("rating");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F0F4F8]">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2Icon className="w-8 h-8 animate-spin text-[#1E40AF]" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F0F4F8]">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Categoria não encontrada
            </h2>
            <button
              onClick={() => navigate("/categorias")}
              className="text-[#1E40AF] hover:underline"
            >
              Ver todas as categorias
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F0F4F8]">
      <Header />

      <main className="flex-1">
        {/* Header da Categoria */}
        <div className="bg-gradient-to-br from-[#1E40AF] to-[#1a3a99] text-white">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <button
              onClick={() => navigate("/categorias")}
              className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span>Voltar para categorias</span>
            </button>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center">
                <DynamicIcon name={category.icon} className="w-12 h-12 text-white" fallback={category.icon} />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">
                  {category.name}
                </h1>
                <p className="text-white/90 mt-2 text-lg">{category.description}</p>
              </div>
            </div>

            {/* Barra de busca */}
            <div className="mt-6">
              <div className="relative max-w-2xl">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar profissional ou serviço..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Filtros e Resultados */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <p className="text-gray-700 font-medium">
                {filteredProfessionals.length} profissionais encontrados
              </p>
              {(selectedSubcategories.length > 0 || searchTerm || minRating > 0) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-[#1E40AF] hover:underline flex items-center gap-1"
                >
                  <XIcon className="w-4 h-4" />
                  Limpar filtros
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-[#1E40AF] transition-colors"
            >
              <SlidersHorizontalIcon className="w-5 h-5" />
              <span className="font-medium">Filtros</span>
              {(selectedSubcategories.length > 0 || minRating > 0) && (
                <span className="bg-[#1E40AF] text-white text-xs px-2 py-1 rounded-full">
                  {selectedSubcategories.length + (minRating > 0 ? 1 : 0)}
                </span>
              )}
            </button>
          </div>

          {/* Painel de Filtros */}
          {showFilters && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Localização */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPinIcon className="w-5 h-5" />
                    Localização
                  </h3>
                  <LocationFilter
                    onLocationChange={(state, city) => {
                      setSelectedState(state);
                      setSelectedCity(city);
                    }}
                    onUseMyLocation={(lat, lng) => {
                      setUserLocation({ latitude: lat, longitude: lng });
                    }}
                    selectedState={selectedState}
                    selectedCity={selectedCity}
                  />
                </div>

                {/* Subcategorias */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FilterIcon className="w-5 h-5" />
                    Tipo de Serviço
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {subcategories.map((subcat) => (
                      <label
                        key={subcat.id}
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedSubcategories.includes(subcat.name)}
                          onChange={() => toggleSubcategory(subcat.name)}
                          className="w-4 h-4 text-[#1E40AF] rounded focus:ring-[#1E40AF]"
                        />
                        <DynamicIcon name={subcat.icon} className="w-5 h-5 text-gray-600" fallback={subcat.icon} />
                        <span className="text-sm text-gray-700">{subcat.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Faixa de Preço */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Faixa de Preço</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">
                        Mínimo: R$ {priceRange.min}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="500"
                        step="10"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">
                        Máximo: R$ {priceRange.max}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="500"
                        step="10"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Avaliação e Ordenação */}
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Avaliação Mínima</h3>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => setMinRating(rating === minRating ? 0 : rating)}
                          className={`flex items-center gap-1 px-3 py-2 rounded-lg border-2 transition-colors ${
                            minRating === rating
                              ? 'bg-[#1E40AF] text-white border-[#1E40AF]'
                              : 'bg-white text-gray-700 border-gray-200 hover:border-[#1E40AF]'
                          }`}
                        >
                          <StarIcon className={`w-4 h-4 ${minRating === rating ? 'fill-white' : 'fill-yellow-400 text-yellow-400'}`} />
                          <span className="text-sm font-medium">{rating}+</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Ordenar por</h3>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#1E40AF] focus:outline-none"
                    >
                      <option value="rating">Melhor avaliação</option>
                      <option value="price-low">Menor preço</option>
                      <option value="price-high">Maior preço</option>
                      <option value="reviews">Mais avaliações</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Lista de Profissionais */}
          {filteredProfessionals.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl">
              <p className="text-gray-600 mb-4">
                Nenhum profissional encontrado com esses filtros.
              </p>
              <button
                onClick={clearFilters}
                className="text-[#1E40AF] hover:underline font-medium"
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfessionals.map((professional) => (
                <ProfessionalCardNew
                  key={professional.userId}
                  professional={professional}
                  onClick={() => navigate(`/profissional/${professional.userId}`)}
                  showDistance={userLocation !== null}
                  distance={(professional as any).distance}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Card do Profissional
function ProfessionalCardNew({
  professional,
  onClick,
}: {
  professional: ServiceProviderProfile;
  onClick: () => void;
}) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden border-2 border-transparent hover:border-[#1E40AF]">
      {/* Foto */}
      <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold">
        {professional.displayName?.charAt(0).toUpperCase() || '?'}
      </div>

      {/* Informações */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900">
            {professional.displayName || 'Profissional'}
          </h3>
          {professional.verified && (
            <span className="text-green-600 text-xs font-medium bg-green-50 px-2 py-1 rounded">
              ✓ Verificado
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-3">{professional.profession}</p>

        {/* Rating */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1">
            <StarIcon className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="font-semibold text-sm">
              {professional.rating.toFixed(1)}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            ({professional.reviewCount} avaliações)
          </span>
        </div>

        {/* Localização */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <MapPinIcon className="w-4 h-4" />
          <span>{professional.location?.city}, {professional.location?.state}</span>
        </div>

        {/* Habilidades */}
        <div className="flex flex-wrap gap-2 mb-4">
          {professional.skills.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded"
            >
              {skill}
            </span>
          ))}
          {professional.skills.length > 3 && (
            <span className="text-xs text-gray-500">
              +{professional.skills.length - 3}
            </span>
          )}
        </div>

        {/* Preço */}
        <div className="pt-3 border-t border-gray-100 mb-4">
          <p className="text-sm text-gray-600">A partir de</p>
          <p className="text-2xl font-bold text-[#1E40AF]">
            R$ {professional.hourlyRate}
            <span className="text-sm font-normal text-gray-600">/hora</span>
          </p>
        </div>

        {/* Botão Ver Detalhes */}
        <button
          onClick={onClick}
          className="w-full bg-[#1E40AF] text-white py-3 rounded-lg font-semibold hover:bg-[#1a3a99] transition-colors flex items-center justify-center gap-2"
        >
          Ver Detalhes Completos
          <ArrowLeftIcon className="w-4 h-4 rotate-180" />
        </button>
      </div>
    </div>
  );
}
