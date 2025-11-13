import { useState, useEffect } from 'react';
import { MapPinIcon, NavigationIcon, Loader2Icon, XIcon } from 'lucide-react';

interface LocationFilterProps {
  onLocationChange: (state: string, city: string) => void;
  onUseMyLocation: (latitude: number, longitude: number) => void;
  selectedState: string;
  selectedCity: string;
}

const BRAZILIAN_STATES = [
  { code: 'AC', name: 'Acre' },
  { code: 'AL', name: 'Alagoas' },
  { code: 'AP', name: 'Amapá' },
  { code: 'AM', name: 'Amazonas' },
  { code: 'BA', name: 'Bahia' },
  { code: 'CE', name: 'Ceará' },
  { code: 'DF', name: 'Distrito Federal' },
  { code: 'ES', name: 'Espírito Santo' },
  { code: 'GO', name: 'Goiás' },
  { code: 'MA', name: 'Maranhão' },
  { code: 'MT', name: 'Mato Grosso' },
  { code: 'MS', name: 'Mato Grosso do Sul' },
  { code: 'MG', name: 'Minas Gerais' },
  { code: 'PA', name: 'Pará' },
  { code: 'PB', name: 'Paraíba' },
  { code: 'PR', name: 'Paraná' },
  { code: 'PE', name: 'Pernambuco' },
  { code: 'PI', name: 'Piauí' },
  { code: 'RJ', name: 'Rio de Janeiro' },
  { code: 'RN', name: 'Rio Grande do Norte' },
  { code: 'RS', name: 'Rio Grande do Sul' },
  { code: 'RO', name: 'Rondônia' },
  { code: 'RR', name: 'Roraima' },
  { code: 'SC', name: 'Santa Catarina' },
  { code: 'SP', name: 'São Paulo' },
  { code: 'SE', name: 'Sergipe' },
  { code: 'TO', name: 'Tocantins' },
];

export function LocationFilter({ 
  onLocationChange, 
  onUseMyLocation, 
  selectedState, 
  selectedCity 
}: LocationFilterProps) {
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [detectedLocation, setDetectedLocation] = useState<{ city: string; state: string } | null>(null);
  const [cityInput, setCityInput] = useState(selectedCity);

  useEffect(() => {
    setCityInput(selectedCity);
  }, [selectedCity]);

  const handleDetectLocation = async () => {
    setDetectingLocation(true);
    
    try {
      // Obter coordenadas
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
        });
      });

      const { latitude, longitude } = position.coords;

      // Usar API de geocoding reverso do Google Maps
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&language=pt-BR`
      );

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const addressComponents = data.results[0].address_components;
        
        let city = '';
        let state = '';

        addressComponents.forEach((component: any) => {
          if (component.types.includes('administrative_area_level_2')) {
            city = component.long_name;
          }
          if (component.types.includes('administrative_area_level_1')) {
            state = component.short_name;
          }
        });

        if (city && state) {
          setDetectedLocation({ city, state });
          setCityInput(city);
          onLocationChange(state, city);
          onUseMyLocation(latitude, longitude);
        }
      }
    } catch (error) {
      console.error('Erro ao detectar localização:', error);
      alert('Não foi possível detectar sua localização. Por favor, selecione manualmente.');
    } finally {
      setDetectingLocation(false);
    }
  };

  const handleStateChange = (stateCode: string) => {
    onLocationChange(stateCode, cityInput);
  };

  const handleCityChange = (city: string) => {
    setCityInput(city);
    if (selectedState) {
      onLocationChange(selectedState, city);
    }
  };

  const handleClear = () => {
    setCityInput('');
    setDetectedLocation(null);
    onLocationChange('', '');
  };

  return (
    <div className="space-y-4">
      {/* Botão de Detectar Localização */}
      <button
        onClick={handleDetectLocation}
        disabled={detectingLocation}
        className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {detectingLocation ? (
          <>
            <Loader2Icon className="w-5 h-5 animate-spin" />
            Detectando localização...
          </>
        ) : (
          <>
            <NavigationIcon className="w-5 h-5" />
            Usar Minha Localização
          </>
        )}
      </button>

      {/* Localização Detectada */}
      {detectedLocation && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-900">
              {detectedLocation.city}, {detectedLocation.state}
            </span>
          </div>
          <button
            onClick={handleClear}
            className="text-green-600 hover:text-green-700"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="text-center text-sm text-gray-500">ou</div>

      {/* Seleção Manual */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado
          </label>
          <select
            value={selectedState}
            onChange={(e) => handleStateChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos os estados</option>
            {BRAZILIAN_STATES.map((state) => (
              <option key={state.code} value={state.code}>
                {state.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cidade
          </label>
          <input
            type="text"
            value={cityInput}
            onChange={(e) => handleCityChange(e.target.value)}
            placeholder="Digite a cidade..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Informação */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          💡 Ative sua localização para encontrar profissionais próximos a você automaticamente!
        </p>
      </div>
    </div>
  );
}
