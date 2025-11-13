import { useState } from 'react';
import {
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  NavigationIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  PlayCircleIcon,
  DollarSignIcon
} from 'lucide-react';

interface Service {
  id: string;
  clientName: string;
  clientPhoto?: string;
  serviceType: string;
  time: string;
  endTime?: string;
  address: string;
  city: string;
  estimatedValue: number;
  status: string;
  latitude?: number;
  longitude?: number;
}

interface DayTimelineViewProps {
  services: Service[];
  date: Date;
  onServiceClick: (service: Service) => void;
}

export function DayTimelineView({ services, date, onServiceClick }: DayTimelineViewProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  // Calcular posição e altura do serviço na timeline
  const getServicePosition = (service: Service) => {
    const [hours, minutes] = service.time.split(':').map(Number);
    const startMinutes = hours * 60 + minutes;
    
    // Duração padrão de 2 horas se não especificado
    let duration = 120;
    if (service.endTime) {
      const [endHours, endMinutes] = service.endTime.split(':').map(Number);
      const endTotalMinutes = endHours * 60 + endMinutes;
      duration = endTotalMinutes - startMinutes;
    }
    
    return {
      top: `${(startMinutes / 1440) * 100}%`,
      height: `${(duration / 1440) * 100}%`
    };
  };

  // Detectar conflitos
  const hasConflict = (service: Service) => {
    const serviceStart = parseTime(service.time);
    const serviceEnd = service.endTime ? parseTime(service.endTime) : serviceStart + 2;

    return services.some(other => {
      if (other.id === service.id) return false;
      
      const otherStart = parseTime(other.time);
      const otherEnd = other.endTime ? parseTime(other.endTime) : otherStart + 2;

      return (
        (serviceStart >= otherStart && serviceStart < otherEnd) ||
        (serviceEnd > otherStart && serviceEnd <= otherEnd) ||
        (serviceStart <= otherStart && serviceEnd >= otherEnd)
      );
    });
  };

  const parseTime = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours + minutes / 60;
  };

  // Calcular tempo de viagem entre serviços
  const getTravelTime = (from: Service, to: Service): number => {
    // Simulação - em produção, usar Google Maps Distance Matrix API
    return Math.floor(Math.random() * 30) + 10; // 10-40 minutos
  };

  const sortedServices = [...services].sort((a, b) => 
    parseTime(a.time) - parseTime(b.time)
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900">
          {date.toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long',
            year: 'numeric'
          })}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {services.length} serviços agendados
        </p>
      </div>

      {/* Timeline */}
      <div className="flex">
        {/* Coluna de Horas */}
        <div className="w-20 flex-shrink-0 border-r border-gray-200">
          {hours.map(hour => (
            <div key={hour} className="h-20 border-b border-gray-100 px-3 py-2">
              <span className="text-sm font-medium text-gray-600">
                {hour.toString().padStart(2, '0')}:00
              </span>
            </div>
          ))}
        </div>

        {/* Coluna de Serviços */}
        <div className="flex-1 relative">
          {/* Linhas de hora */}
          {hours.map(hour => (
            <div key={hour} className="h-20 border-b border-gray-100" />
          ))}

          {/* Serviços */}
          <div className="absolute inset-0">
            {sortedServices.map((service, index) => {
              const position = getServicePosition(service);
              const conflict = hasConflict(service);
              const nextService = sortedServices[index + 1];
              const travelTime = nextService ? getTravelTime(service, nextService) : 0;

              return (
                <div key={service.id}>
                  {/* Card do Serviço */}
                  <button
                    onClick={() => onServiceClick(service)}
                    className={`absolute left-2 right-2 rounded-lg p-3 border-2 transition-all hover:shadow-lg ${
                      conflict 
                        ? 'bg-red-50 border-red-300' 
                        : service.status === 'accepted'
                        ? 'bg-green-50 border-green-300'
                        : service.status === 'in_progress'
                        ? 'bg-blue-50 border-blue-300'
                        : 'bg-gray-50 border-gray-300'
                    }`}
                    style={position}
                  >
                    <div className="flex items-start gap-3">
                      {/* Foto do Cliente */}
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                        {service.clientPhoto ? (
                          <img 
                            src={service.clientPhoto} 
                            alt={service.clientName}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          service.clientName.charAt(0).toUpperCase()
                        )}
                      </div>

                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">
                              {service.clientName}
                            </p>
                            <p className="text-sm text-gray-600 truncate">
                              {service.serviceType}
                            </p>
                          </div>
                          
                          {conflict && (
                            <AlertTriangleIcon className="w-5 h-5 text-red-500 flex-shrink-0 ml-2" />
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-xs text-gray-600 mt-2">
                          <span className="flex items-center gap-1">
                            <ClockIcon className="w-3 h-3" />
                            {service.time}
                            {service.endTime && ` - ${service.endTime}`}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSignIcon className="w-3 h-3" />
                            R$ {service.estimatedValue.toFixed(2)}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-gray-600 mt-1 truncate">
                          <MapPinIcon className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{service.city}</span>
                        </div>

                        {/* Status Badge */}
                        <div className="mt-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                            service.status === 'accepted' ? 'bg-green-100 text-green-700' :
                            service.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {service.status === 'accepted' && <CheckCircleIcon className="w-3 h-3" />}
                            {service.status === 'in_progress' && <PlayCircleIcon className="w-3 h-3" />}
                            {service.status === 'accepted' ? 'Aceito' :
                             service.status === 'in_progress' ? 'Em Andamento' : 'Concluído'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Indicador de Viagem */}
                  {nextService && (
                    <div 
                      className="absolute left-1/2 -translate-x-1/2 w-0.5 bg-blue-300 z-10"
                      style={{
                        top: `calc(${position.top} + ${position.height})`,
                        height: '40px'
                      }}
                    >
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 py-1 rounded shadow-sm border border-blue-300 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-xs text-blue-600 font-medium">
                          <NavigationIcon className="w-3 h-3" />
                          {travelTime} min
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Linha do horário atual */}
          <CurrentTimeLine />
        </div>
      </div>
    </div>
  );
}

// Linha indicadora do horário atual
function CurrentTimeLine() {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Atualizar a cada minuto
  useState(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  });

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const totalMinutes = hours * 60 + minutes;
  const position = (totalMinutes / 1440) * 100;

  return (
    <div 
      className="absolute left-0 right-0 z-20 pointer-events-none"
      style={{ top: `${position}%` }}
    >
      <div className="flex items-center">
        <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-lg" />
        <div className="flex-1 h-0.5 bg-red-500" />
      </div>
      <div className="absolute left-4 -top-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-lg">
        {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}
      </div>
    </div>
  );
}
