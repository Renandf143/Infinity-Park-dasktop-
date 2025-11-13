import { useEffect, useRef, useState } from 'react';
import { MapPinIcon, NavigationIcon, ActivityIcon, BatteryIcon, ClockIcon, AlertCircleIcon } from 'lucide-react';
import { LocationTracking } from '../hooks/useRealtimeLocation';

interface RealtimeMapProps {
  professionalLocation?: LocationTracking;
  clientLocation?: { latitude: number; longitude: number };
  showRoute?: boolean;
  height?: string;
  onMapLoad?: (map: google.maps.Map) => void;
}

export function RealtimeMap({
  professionalLocation,
  clientLocation,
  showRoute = false,
  height = '400px',
  onMapLoad,
}: RealtimeMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [professionalMarker, setProfessionalMarker] = useState<google.maps.Marker | null>(null);
  const [clientMarker, setClientMarker] = useState<google.maps.Marker | null>(null);
  const [routePolyline, setRoutePolyline] = useState<google.maps.Polyline | null>(null);
  const [distance, setDistance] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Inicializar mapa
  useEffect(() => {
    if (!mapRef.current || map) return;

    // Validar chave da API
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey || apiKey === 'undefined' || apiKey === '') {
      console.error('❌ Chave da API do Google Maps não configurada');
      console.error('📝 Adicione VITE_GOOGLE_MAPS_API_KEY no arquivo .env');
      setError('Chave da API do Google Maps não configurada. Verifique o arquivo .env');
      setIsLoading(false);
      return;
    }

    const initMap = () => {
      try {
        const defaultCenter = professionalLocation?.location
          ? { lat: professionalLocation.location.latitude, lng: professionalLocation.location.longitude }
          : { lat: -15.7801, lng: -47.9292 }; // Brasília como padrão

        const newMap = new google.maps.Map(mapRef.current!, {
          center: defaultCenter,
          zoom: 14,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }],
            },
          ],
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        });

        setMap(newMap);
        setIsLoading(false);
        onMapLoad?.(newMap);
      } catch (error) {
        console.error('❌ Erro ao inicializar mapa:', error);
        setIsLoading(false);
      }
    };

    // Carregar Google Maps API com loading=async
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry,places&loading=async`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      script.onerror = (error) => {
        console.error('❌ Erro ao carregar Google Maps API:', error);
        console.error('🔑 Verifique se a chave da API está correta');
        console.error('💳 Verifique se a cobrança está habilitada no Google Cloud Console');
        setError('Erro ao carregar Google Maps. Verifique se a cobrança está habilitada no Google Cloud Console.');
        setIsLoading(false);
      };
      document.head.appendChild(script);
    } else {
      initMap();
    }
  }, [mapRef, map, professionalLocation, onMapLoad]);

  // Atualizar marcador do profissional
  useEffect(() => {
    if (!map || !professionalLocation?.location) return;

    const position = {
      lat: professionalLocation.location.latitude,
      lng: professionalLocation.location.longitude,
    };

    if (professionalMarker) {
      professionalMarker.setPosition(position);
      
      // Animar movimento suave
      if (professionalLocation.location.heading) {
        professionalMarker.setIcon({
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 6,
          fillColor: '#1E40AF',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
          rotation: professionalLocation.location.heading,
        });
      }
    } else {
      const marker = new google.maps.Marker({
        position,
        map,
        title: 'Profissional',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#1E40AF',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 3,
        },
        animation: google.maps.Animation.DROP,
      });

      // Info window com detalhes
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; font-family: system-ui;">
            <h3 style="margin: 0 0 8px 0; font-weight: 600; color: #1E40AF;">Profissional</h3>
            <p style="margin: 4px 0; font-size: 12px; color: #6B7280;">
              <strong>Precisão:</strong> ${professionalLocation.location.accuracy.toFixed(0)}m
            </p>
            ${professionalLocation.location.speed ? `
              <p style="margin: 4px 0; font-size: 12px; color: #6B7280;">
                <strong>Velocidade:</strong> ${(professionalLocation.location.speed * 3.6).toFixed(1)} km/h
              </p>
            ` : ''}
            <p style="margin: 4px 0; font-size: 12px; color: #10B981;">
              <strong>Status:</strong> ${professionalLocation.isActive ? 'Ativo' : 'Inativo'}
            </p>
          </div>
        `,
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      setProfessionalMarker(marker);
    }

    // Centralizar no profissional
    map.panTo(position);
  }, [map, professionalLocation, professionalMarker]);

  // Atualizar marcador do cliente
  useEffect(() => {
    if (!map || !clientLocation) return;

    const position = {
      lat: clientLocation.latitude,
      lng: clientLocation.longitude,
    };

    if (clientMarker) {
      clientMarker.setPosition(position);
    } else {
      const marker = new google.maps.Marker({
        position,
        map,
        title: 'Você',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#10B981',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; font-family: system-ui;">
            <h3 style="margin: 0; font-weight: 600; color: #10B981;">Sua Localização</h3>
          </div>
        `,
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      setClientMarker(marker);
    }
  }, [map, clientLocation, clientMarker]);

  // Desenhar rota
  useEffect(() => {
    if (!map || !showRoute || !professionalLocation?.location || !clientLocation) return;

    const directionsService = new google.maps.DirectionsService();

    directionsService.route(
      {
        origin: {
          lat: professionalLocation.location.latitude,
          lng: professionalLocation.location.longitude,
        },
        destination: {
          lat: clientLocation.latitude,
          lng: clientLocation.longitude,
        },
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK' && result) {
          // Remover rota anterior
          if (routePolyline) {
            routePolyline.setMap(null);
          }

          // Desenhar nova rota
          const polyline = new google.maps.Polyline({
            path: result.routes[0].overview_path,
            geodesic: true,
            strokeColor: '#1E40AF',
            strokeOpacity: 0.8,
            strokeWeight: 4,
            map,
          });

          setRoutePolyline(polyline);

          // Atualizar distância e duração
          const leg = result.routes[0].legs[0];
          setDistance(leg.distance?.text || '');
          setDuration(leg.duration?.text || '');

          // Ajustar bounds para mostrar toda a rota
          const bounds = new google.maps.LatLngBounds();
          result.routes[0].overview_path.forEach((point) => {
            bounds.extend(point);
          });
          map.fitBounds(bounds);
        }
      }
    );
  }, [map, showRoute, professionalLocation, clientLocation, routePolyline]);

  // Calcular tempo desde última atualização
  const getTimeSinceUpdate = () => {
    if (!professionalLocation?.lastUpdate) return '';
    
    const now = new Date();
    const diff = now.getTime() - professionalLocation.lastUpdate.getTime();
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 60) return `${seconds}s atrás`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}min atrás`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h atrás`;
  };

  return (
    <div className="relative">
      {/* Mapa */}
      <div
        ref={mapRef}
        style={{ height }}
        className="w-full rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg"
      />

      {/* Error */}
      {error && (
        <div className="absolute inset-0 bg-red-50 flex items-center justify-center rounded-xl border-2 border-red-200">
          <div className="text-center p-8 max-w-md">
            <AlertCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-red-900 mb-2">Erro ao Carregar Mapa</h3>
            <p className="text-sm text-red-700 mb-4">{error}</p>
            <div className="bg-white rounded-lg p-4 text-left">
              <p className="text-xs text-gray-700 mb-2"><strong>Possíveis soluções:</strong></p>
              <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                <li>Verifique se o arquivo .env está configurado</li>
                <li>Habilite a cobrança no Google Cloud Console</li>
                <li>Ative as APIs necessárias do Google Maps</li>
                <li>Consulte o arquivo HABILITAR_GOOGLE_MAPS.md</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && !error && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded-xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando mapa...</p>
          </div>
        </div>
      )}

      {/* Status Cards */}
      {professionalLocation && (
        <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2">
          {/* Status de Rastreamento */}
          <div className="bg-white rounded-lg shadow-lg px-4 py-2 flex items-center gap-2 border-2 border-gray-200">
            <div className={`w-3 h-3 rounded-full ${professionalLocation.isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="text-sm font-semibold text-gray-900">
              {professionalLocation.isActive ? 'Rastreamento Ativo' : 'Offline'}
            </span>
          </div>

          {/* Precisão */}
          {professionalLocation.location.accuracy && (
            <div className="bg-white rounded-lg shadow-lg px-4 py-2 flex items-center gap-2 border-2 border-gray-200">
              <ActivityIcon className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-gray-900">
                ±{professionalLocation.location.accuracy.toFixed(0)}m
              </span>
            </div>
          )}

          {/* Velocidade */}
          {professionalLocation.location.speed && professionalLocation.location.speed > 0 && (
            <div className="bg-white rounded-lg shadow-lg px-4 py-2 flex items-center gap-2 border-2 border-gray-200">
              <NavigationIcon className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-gray-900">
                {(professionalLocation.location.speed * 3.6).toFixed(1)} km/h
              </span>
            </div>
          )}

          {/* Última Atualização */}
          <div className="bg-white rounded-lg shadow-lg px-4 py-2 flex items-center gap-2 border-2 border-gray-200">
            <ClockIcon className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-semibold text-gray-900">
              {getTimeSinceUpdate()}
            </span>
          </div>
        </div>
      )}

      {/* Informações de Rota */}
      {showRoute && distance && duration && (
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 border-2 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPinIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Distância</p>
                <p className="text-lg font-bold text-gray-900">{distance}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ClockIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tempo estimado</p>
                <p className="text-lg font-bold text-gray-900">{duration}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Aviso de Erro */}
      {!professionalLocation?.isActive && professionalLocation && (
        <div className="absolute bottom-4 left-4 right-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg p-3 flex items-start gap-2">
          <AlertCircleIcon className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-yellow-900">Rastreamento Inativo</p>
            <p className="text-xs text-yellow-700">O profissional não está compartilhando a localização no momento.</p>
          </div>
        </div>
      )}
    </div>
  );
}
