import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { FilterSidebar } from '../components/FilterSidebar';
import { ProfessionalCard } from '../components/ProfessionalCard';
import { BrazilMap } from '../components/BrazilMap';
import { FilterIcon, MapIcon, GridIcon } from 'lucide-react';
import { professionalService, ProfessionalProfile as Professional } from '../services/professionalService';
import { useSearchParams } from 'react-router-dom';
export function CategoriesPage() {
  const [searchParams] = useSearchParams();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    priceRange: [0, 500] as [number, number],
    minRating: 0,
    location: '',
    availability: ''
  });
  useEffect(() => {
    const fetchProfessionals = async () => {
      setLoading(true);
      try {
        const searchQuery = searchParams.get('search');
        const category = searchParams.get('category');
        const data = await professionalService.searchProfessionals({
          search: searchQuery || undefined,
          category: category || undefined,
          minRating: filters.minRating,
          maxPrice: filters.priceRange[1],
          location: selectedState || filters.location
        });
        setProfessionals(data);
      } catch (error) {
        console.error('Error fetching professionals:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfessionals();
  }, [searchParams, filters, selectedState]);
  const handleStateSelect = (state: string) => {
    setSelectedState(state || null);
  };
  return <div className="w-full min-h-screen bg-gray-50">
      <Header />
      <div className="w-full bg-gradient-to-br from-[#2563EB] to-[#1E40AF] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Encontre Profissionais
          </h1>
          <p className="text-xl text-white/90">
            Milhares de especialistas prontos para atender você
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* View Toggle */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => setShowMap(!showMap)} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${showMap ? 'bg-[#2563EB] text-white' : 'bg-white text-gray-700 border-2 border-gray-200'}`}>
              <MapIcon className="w-5 h-5" />
              Mapa
            </button>
            <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg font-medium border-2 border-gray-200">
              <FilterIcon className="w-5 h-5" />
              Filtros
            </button>
          </div>
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">
              {professionals.length}
            </span>{' '}
            profissionais encontrados
          </p>
        </div>
        {/* Map View */}
        {showMap && <div className="mb-8">
            <BrazilMap onStateSelect={handleStateSelect} selectedState={selectedState} />
          </div>}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block">
            <FilterSidebar filters={filters} setFilters={setFilters} />
          </div>
          {/* Filters Sidebar - Mobile */}
          {showFilters && <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
              <div className="absolute right-0 top-0 bottom-0 w-80 bg-white overflow-y-auto">
                <FilterSidebar filters={filters} setFilters={setFilters} onClose={() => setShowFilters(false)} showCloseButton />
              </div>
            </div>}
          {/* Professionals Grid */}
          <div className="lg:col-span-3">
            {loading ? <div className="text-center py-12">
                <div className="inline-block w-12 h-12 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">
                  Carregando profissionais...
                </p>
              </div> : professionals.length === 0 ? <div className="text-center py-12">
                <GridIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nenhum profissional encontrado
                </h3>
                <p className="text-gray-600">
                  Tente ajustar os filtros ou pesquisar por outros termos
                </p>
              </div> : <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {professionals.map(professional => <ProfessionalCard key={professional.id} professional={professional} />)}
              </div>}
          </div>
        </div>
      </div>
      <Footer />
    </div>;
}