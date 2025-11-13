import React from 'react';
import { XIcon, DollarSignIcon, StarIcon, MapPinIcon, CalendarIcon } from 'lucide-react';
interface FilterSidebarProps {
  filters: {
    priceRange: [number, number];
    minRating: number;
    location: string;
    availability: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    priceRange: [number, number];
    minRating: number;
    location: string;
    availability: string;
  }>>;
  onClose?: () => void;
  showCloseButton?: boolean;
}
export function FilterSidebar({
  filters,
  setFilters,
  onClose,
  showCloseButton
}: FilterSidebarProps) {
  const ratings = [{
    value: 0,
    label: 'Todas'
  }, {
    value: 3,
    label: '3+ estrelas'
  }, {
    value: 4,
    label: '4+ estrelas'
  }, {
    value: 4.5,
    label: '4.5+ estrelas'
  }, {
    value: 5,
    label: '5 estrelas'
  }];
  const availabilityOptions = ['Todos os dias', 'Segunda a Sexta', 'Segunda a Sábado', 'Fins de semana'];
  return <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-[#1E293B] flex items-center gap-2">
          <DollarSignIcon className="w-5 h-5 text-[#2563EB]" />
          Filtros
        </h3>
        {showCloseButton && <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden">
            <XIcon className="w-5 h-5" />
          </button>}
      </div>
      {/* Price Range */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-[#1E293B] mb-3">
          Faixa de Preço
        </label>
        <div className="space-y-3">
          <input type="range" min="0" max="500" value={filters.priceRange[1]} onChange={e => setFilters(prev => ({
          ...prev,
          priceRange: [0, parseInt(e.target.value)]
        }))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2563EB]" />
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-600">R$ 0</span>
            <span className="font-bold text-[#2563EB]">
              R$ {filters.priceRange[1]}
            </span>
          </div>
        </div>
      </div>
      {/* Rating Filter */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-[#1E293B] mb-3 flex items-center gap-2">
          <StarIcon className="w-4 h-4 text-[#2563EB]" />
          Avaliação Mínima
        </label>
        <div className="space-y-2">
          {ratings.map(rating => <button key={rating.value} onClick={() => setFilters(prev => ({
          ...prev,
          minRating: rating.value
        }))} className={`w-full px-4 py-3 rounded-lg text-left transition-all ${filters.minRating === rating.value ? 'bg-[#2563EB] text-white shadow-md' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}>
              <div className="flex items-center gap-2">
                {rating.value > 0 && <>
                    <StarIcon className={`w-4 h-4 ${filters.minRating === rating.value ? 'fill-white text-white' : 'fill-yellow-400 text-yellow-400'}`} />
                    <span className="font-medium">{rating.label}</span>
                  </>}
                {rating.value === 0 && <span className="font-medium">{rating.label}</span>}
              </div>
            </button>)}
        </div>
      </div>
      {/* Location Filter */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-[#1E293B] mb-3 flex items-center gap-2">
          <MapPinIcon className="w-4 h-4 text-[#2563EB]" />
          Localização
        </label>
        <input type="text" placeholder="Digite a cidade ou estado" value={filters.location} onChange={e => setFilters(prev => ({
        ...prev,
        location: e.target.value
      }))} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent" />
      </div>
      {/* Availability Filter */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-[#1E293B] mb-3 flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-[#2563EB]" />
          Disponibilidade
        </label>
        <select value={filters.availability} onChange={e => setFilters(prev => ({
        ...prev,
        availability: e.target.value
      }))} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent bg-white">
          <option value="">Qualquer horário</option>
          {availabilityOptions.map(option => <option key={option} value={option}>
              {option}
            </option>)}
        </select>
      </div>
      {/* Clear Filters */}
      <button onClick={() => setFilters({
      priceRange: [0, 500],
      minRating: 0,
      location: '',
      availability: ''
    })} className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
        Limpar Filtros
      </button>
    </div>;
}