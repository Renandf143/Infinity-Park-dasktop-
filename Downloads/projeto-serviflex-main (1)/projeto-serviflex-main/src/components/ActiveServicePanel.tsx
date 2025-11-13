import { useState, useEffect } from 'react';
import { 
  MapPinIcon, 
  ClockIcon, 
  PhoneIcon, 
  MessageCircleIcon, 
  AlertCircleIcon,
  CheckCircleIcon,
  NavigationIcon,
  TrendingUpIcon,
  UserIcon,
  XIcon
} from 'lucide-react';
import { RealtimeMap } from './RealtimeMap';
import { useRealtimeLocation } from '../hooks/useRealtimeLocation';

interface ActiveServicePanelProps {
  serviceId: string;
  professionalId: string;
  professionalName: string;
  professionalPhoto?: string;
  professionalPhone?: string;
  serviceType: string;
  scheduledTime: Date;
  onClose?: () => void;
}

export function ActiveServicePanel({
  serviceId,
  professionalId,
  professionalName,
  professionalPhoto,
  professionalPhone,
  serviceType,
  scheduledTime,
  onClose,
}: ActiveServicePanelProps) {
  const { tracking } = useRealtimeLocation(professionalId, false);
  const [clientLocation, setClientLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [serviceStatus, setServiceStatus] = useState<'pending' | 'on_way' | 'arrived' | 'in_progress' | 'completed'>('pending');
  const [elapsedTime, setElapsedTime] = useState(0);

  // Get client location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setClientLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        }
      );
    }
  }, []);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Auto-detect service status based on location
  useEffect(() => {
    if (!tracking?.location || !clientLocation) return;

    const distance = calculateDistance(
      tracking.location.latitude,
      tracking.location.longitude,
      clientLocation.latitude,
      clientLocation.longitude
    );

    if (distance < 0.05) { // Menos de 50m
      setServiceStatus('arrived');
    } else if (distance < 5) { // Menos de 5km
      setServiceStatus('on_way');
    }
  }, [tracking, clientLocation]);

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

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min ${secs}s`;
  };

  const getStatusInfo = () => {
    switch (serviceStatus) {
      case 'pending':
        return {
          color: 'yellow',
          icon: ClockIcon,
          text: 'Aguardando Início',
          description: 'O profissional ainda não iniciou o deslocamento'
        };
      case 'on_way':
        return {
          color: 'blue',
          icon: NavigationIcon,
          text: 'A Caminho',
          description: 'O profissional está se deslocando até você'
        };
      case 'arrived':
        return {
          color: 'green',
          icon: CheckCircleIcon,
          text: 'Chegou',
          description: 'O profissional chegou ao local'
        };
      case 'in_progress':
        return {
          color: 'purple',
          icon: TrendingUpIcon,
          text: 'Em Andamento',
          description: 'O serviço está sendo realizado'
        };
      case 'completed':
        return {
          color: 'green',
          icon: CheckCircleIcon,
          text: 'Concluído',
          description: 'O serviço foi finalizado'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Serviço Ativo</h2>
            {onClose && (
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                <XIcon className="w-6 h-6 text-white" />
              </button>
            )}
          </div>

          {/* Status Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 bg-${statusInfo.color}-100 border-2 border-${statusInfo.color}-300 rounded-full`}>
            <statusInfo.icon className={`w-5 h-5 text-${statusInfo.color}-700`} />
            <span className={`font-bold text-${statusInfo.color}-900`}>{statusInfo.text}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Professional Info */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            {professionalPhoto ? (
              <img
                src={professionalPhoto}
                alt={professionalName}
                className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <UserIcon className="w-8 h-8 text-white" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg">{professionalName}</h3>
              <p className="text-gray-600">{serviceType}</p>
              <p className="text-sm text-gray-500">
                Agendado para: {scheduledTime.toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="flex gap-2">
              {professionalPhone && (
                <a
                  href={`tel:${professionalPhone}`}
                  className="w-12 h-12 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors shadow-lg"
                >
                  <PhoneIcon className="w-6 h-6 text-white" />
                </a>
              )}
              <button className="w-12 h-12 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors shadow-lg">
                <MessageCircleIcon className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Status Description */}
          <div className={`p-4 bg-${statusInfo.color}-50 border-2 border-${statusInfo.color}-200 rounded-xl`}>
            <p className={`text-${statusInfo.color}-900 font-semibold`}>{statusInfo.description}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <ClockIcon className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-blue-900">Tempo Decorrido</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">{formatTime(elapsedTime)}</p>
            </div>

            {tracking?.location && clientLocation && (
              <>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPinIcon className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-semibold text-purple-900">Distância</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-900">
                    {calculateDistance(
                      tracking.location.latitude,
                      tracking.location.longitude,
                      clientLocation.latitude,
                      clientLocation.longitude
                    ).toFixed(2)} km
                  </p>
                </div>

                {tracking.location.speed && tracking.location.speed > 0 && (
                  <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <NavigationIcon className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-semibold text-green-900">Velocidade</span>
                    </div>
                    <p className="text-2xl font-bold text-green-900">
                      {(tracking.location.speed * 3.6).toFixed(0)} km/h
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Map */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <MapPinIcon className="w-5 h-5 text-blue-600" />
              Rastreamento em Tempo Real
            </h3>
            <RealtimeMap
              professionalLocation={tracking || undefined}
              clientLocation={clientLocation || undefined}
              showRoute={true}
              height="400px"
            />
          </div>

          {/* Warning if not tracking */}
          {!tracking?.isActive && (
            <div className="p-4 bg-yellow-50 border-2 border-yellow-300 rounded-xl flex items-start gap-3">
              <AlertCircleIcon className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-yellow-900">Rastreamento Desativado</p>
                <p className="text-sm text-yellow-700 mt-1">
                  O profissional não está compartilhando a localização no momento. 
                  Entre em contato se necessário.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setServiceStatus('in_progress')}
              className="py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-xl transition-all shadow-lg"
            >
              Marcar como Em Andamento
            </button>
            <button
              onClick={() => setServiceStatus('completed')}
              className="py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-xl transition-all shadow-lg"
            >
              Finalizar Serviço
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
