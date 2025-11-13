import { 
  CalendarIcon, 
  ClockIcon, 
  MapPinIcon, 
  UserIcon, 
  DollarSignIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlayCircleIcon,
  AlertCircleIcon
} from 'lucide-react';
import { ServiceRequest } from '../types/service';

interface ServiceRequestCardProps {
  service: ServiceRequest;
  userRole: 'client' | 'professional';
  onClick: () => void;
}

export function ServiceRequestCard({ service, userRole, onClick }: ServiceRequestCardProps) {
  const getStatusConfig = () => {
    switch (service.status) {
      case 'pending':
        return {
          label: 'Aguardando Aceitação',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
          icon: AlertCircleIcon,
          iconColor: 'text-yellow-600'
        };
      case 'accepted':
        return {
          label: 'Aceito',
          color: 'bg-blue-100 text-blue-800 border-blue-300',
          icon: CheckCircleIcon,
          iconColor: 'text-blue-600'
        };
      case 'scheduled':
        return {
          label: 'Agendado - Em Breve',
          color: 'bg-purple-100 text-purple-800 border-purple-300',
          icon: ClockIcon,
          iconColor: 'text-purple-600'
        };
      case 'in_progress':
        return {
          label: 'Em Andamento',
          color: 'bg-green-100 text-green-800 border-green-300',
          icon: PlayCircleIcon,
          iconColor: 'text-green-600'
        };
      case 'completed':
        return {
          label: 'Concluído - Aguardando Pagamento',
          color: 'bg-indigo-100 text-indigo-800 border-indigo-300',
          icon: CheckCircleIcon,
          iconColor: 'text-indigo-600'
        };
      case 'paid':
        return {
          label: 'Pago',
          color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: CheckCircleIcon,
          iconColor: 'text-emerald-600'
        };
      case 'cancelled':
        return {
          label: 'Cancelado',
          color: 'bg-gray-100 text-gray-800 border-gray-300',
          icon: XCircleIcon,
          iconColor: 'text-gray-600'
        };
      default:
        return {
          label: 'Desconhecido',
          color: 'bg-gray-100 text-gray-800 border-gray-300',
          icon: AlertCircleIcon,
          iconColor: 'text-gray-600'
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-blue-600 hover:shadow-lg transition-all duration-200 cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {service.serviceType}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {service.description}
          </p>
        </div>
        <div className={`ml-4 px-3 py-1 rounded-full border-2 ${statusConfig.color} flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap`}>
          <StatusIcon className={`w-4 h-4 ${statusConfig.iconColor}`} />
          {statusConfig.label}
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Participante */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <UserIcon className="w-4 h-4 text-blue-600" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500">
              {userRole === 'client' ? 'Profissional' : 'Cliente'}
            </p>
            <p className="text-sm font-semibold text-gray-900 truncate">
              {userRole === 'client' ? service.professionalName : service.clientName}
            </p>
          </div>
        </div>

        {/* Valor */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <DollarSignIcon className="w-4 h-4 text-green-600" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500">Valor</p>
            <p className="text-sm font-semibold text-gray-900">
              R$ {(service.finalPrice || service.estimatedPrice || 0).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Data */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
            <CalendarIcon className="w-4 h-4 text-purple-600" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500">Data</p>
            <p className="text-sm font-semibold text-gray-900">
              {new Date(service.scheduledDate).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>

        {/* Horário */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
            <ClockIcon className="w-4 h-4 text-orange-600" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500">Horário</p>
            <p className="text-sm font-semibold text-gray-900">
              {service.scheduledTime}
            </p>
          </div>
        </div>
      </div>

      {/* Localização */}
      <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
        <MapPinIcon className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
        <div className="min-w-0 flex-1">
          <p className="text-sm text-gray-900 font-medium">
            {service.address}
          </p>
          <p className="text-xs text-gray-600">
            {service.city}, {service.state}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
        <p className="text-xs text-gray-500">
          Criado em {new Date(service.createdAt).toLocaleDateString('pt-BR')}
        </p>
        <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
          Ver Detalhes →
        </button>
      </div>
    </div>
  );
}
