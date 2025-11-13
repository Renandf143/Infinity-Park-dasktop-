import { Clock, Calendar } from 'lucide-react';

interface AvailabilityFilterProps {
  filterByAvailability: boolean;
  onToggle: (enabled: boolean) => void;
}

export function AvailabilityFilter({ filterByAvailability, onToggle }: AvailabilityFilterProps) {
  const today = new Date();
  const dayNames = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const todayName = dayNames[today.getDay()];

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Disponíveis Hoje</h3>
            <p className="text-sm text-gray-600">
              <Calendar className="w-3 h-3 inline mr-1" />
              {todayName}, {today.toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={filterByAvailability}
            onChange={(e) => onToggle(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
      {filterByAvailability && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-600">
            ✅ Mostrando apenas profissionais com horários disponíveis para {todayName.toLowerCase()}
          </p>
        </div>
      )}
    </div>
  );
}
