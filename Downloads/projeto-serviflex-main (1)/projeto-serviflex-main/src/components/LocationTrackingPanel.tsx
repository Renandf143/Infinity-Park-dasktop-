import { useState, useEffect } from 'react';
import { MapPinIcon, NavigationIcon, PowerIcon, AlertTriangleIcon, CheckCircleIcon, BatteryIcon, SignalIcon } from 'lucide-react';
import { useRealtimeLocation } from '../hooks/useRealtimeLocation';

interface LocationTrackingPanelProps {
  userId: string;
  userName: string;
  onTrackingChange?: (isTracking: boolean) => void;
}

export function LocationTrackingPanel({ userId, userName, onTrackingChange }: LocationTrackingPanelProps) {
  const { location, isTracking, error, startTracking, stopTracking } = useRealtimeLocation(userId, false);
  const [battery, setBattery] = useState<number | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  // Monitorar bateria
  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((batteryManager: any) => {
        setBattery(batteryManager.level * 100);
        
        batteryManager.addEventListener('levelchange', () => {
          setBattery(batteryManager.level * 100);
        });
      });
    }
  }, []);

  // Notificar mudanças
  useEffect(() => {
    onTrackingChange?.(isTracking);
  }, [isTracking, onTrackingChange]);

  // Aviso de bateria baixa
  useEffect(() => {
    if (battery !== null && battery < 20 && isTracking) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  }, [battery, isTracking]);

  const handleToggleTracking = async () => {
    if (isTracking) {
      await stopTracking();
    } else {
      await startTracking();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
      {/* Header */}
      <div className={`p-4 ${isTracking ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-gray-500 to-gray-600'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <NavigationIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Rastreamento em Tempo Real</h3>
              <p className="text-white/80 text-sm">{userName}</p>
            </div>
          </div>
          <div className={`w-4 h-4 rounded-full ${isTracking ? 'bg-white animate-pulse' : 'bg-white/40'}`}></div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Status */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isTracking ? 'bg-green-100' : 'bg-gray-200'}`}>
              {isTracking ? (
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
              ) : (
                <PowerIcon className="w-5 h-5 text-gray-600" />
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {isTracking ? 'Rastreamento Ativo' : 'Rastreamento Desativado'}
              </p>
              <p className="text-sm text-gray-600">
                {isTracking ? 'Sua localização está sendo compartilhada' : 'Ative para compartilhar sua localização'}
              </p>
            </div>
          </div>
        </div>

        {/* Informações de Localização */}
        {location && isTracking && (
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-1">
                <MapPinIcon className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-semibold text-blue-900">Precisão</span>
              </div>
              <p className="text-lg font-bold text-blue-900">±{location.accuracy.toFixed(0)}m</p>
            </div>

            {location.speed !== undefined && location.speed > 0 && (
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-1">
                  <NavigationIcon className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-semibold text-purple-900">Velocidade</span>
                </div>
                <p className="text-lg font-bold text-purple-900">{(location.speed * 3.6).toFixed(1)} km/h</p>
              </div>
            )}

            {battery !== null && (
              <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 mb-1">
                  <BatteryIcon className="w-4 h-4 text-orange-600" />
                  <span className="text-xs font-semibold text-orange-900">Bateria</span>
                </div>
                <p className="text-lg font-bold text-orange-900">{battery.toFixed(0)}%</p>
              </div>
            )}

            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-1">
                <SignalIcon className="w-4 h-4 text-green-600" />
                <span className="text-xs font-semibold text-green-900">Sinal</span>
              </div>
              <p className="text-lg font-bold text-green-900">Forte</p>
            </div>
          </div>
        )}

        {/* Aviso de Bateria Baixa */}
        {showWarning && (
          <div className="p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg flex items-start gap-3">
            <AlertTriangleIcon className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-yellow-900">Bateria Baixa</p>
              <p className="text-xs text-yellow-700">
                Sua bateria está em {battery?.toFixed(0)}%. Considere desativar o rastreamento para economizar energia.
              </p>
            </div>
          </div>
        )}

        {/* Erro */}
        {error && (
          <div className="p-4 bg-red-50 border-2 border-red-300 rounded-lg flex items-start gap-3">
            <AlertTriangleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-900">Erro no Rastreamento</p>
              <p className="text-xs text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Botão de Controle */}
        <button
          onClick={handleToggleTracking}
          className={`w-full py-4 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2 ${
            isTracking
              ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
              : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
          }`}
        >
          <PowerIcon className="w-5 h-5" />
          {isTracking ? 'Desativar Rastreamento' : 'Ativar Rastreamento'}
        </button>

        {/* Informações */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <MapPinIcon className="w-4 h-4" />
            Como funciona?
          </h4>
          <ul className="space-y-1 text-xs text-blue-800">
            <li>• Sua localização é atualizada em tempo real</li>
            <li>• Clientes podem ver onde você está durante o serviço</li>
            <li>• Aumenta a confiança e segurança</li>
            <li>• Você pode desativar a qualquer momento</li>
          </ul>
        </div>

        {/* Coordenadas (para debug) */}
        {location && isTracking && (
          <details className="text-xs text-gray-600">
            <summary className="cursor-pointer font-semibold">Detalhes Técnicos</summary>
            <div className="mt-2 p-2 bg-gray-100 rounded font-mono">
              <p>Lat: {location.latitude.toFixed(6)}</p>
              <p>Lng: {location.longitude.toFixed(6)}</p>
              <p>Timestamp: {location.timestamp.toLocaleString()}</p>
            </div>
          </details>
        )}
      </div>
    </div>
  );
}
