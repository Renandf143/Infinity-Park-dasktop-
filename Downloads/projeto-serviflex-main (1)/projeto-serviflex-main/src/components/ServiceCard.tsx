import {
  ClockIcon,
  MapPinIcon,
  UserIcon,
  DollarSignIcon,
  PlayIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
} from 'lucide-react';
import { Service } from '../types/service';

interface ServiceCardProps {
  service: Service;
  onAccept?: () => void;
  onReject?: () => void;
  onStart?: () => void;
  onClick?: () => void;
}

export function ServiceCard({ service, onAccept, onReject, onStart, onClick }: ServiceCardProps) {
  const getStatusColor = () => {
    switch (service.status) {
      case 'pending': return 'yellow';
      case 'accepted': return 'blue';
      case 'on_way': return 'purple';
      case 'arrived': return 'green';
      case 'in_progress': return 'orange';
      case 'awaiting_payment': return 'yellow';
      case 'completed': return 'green';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
  };

  const getStatusText = () => {
    switch (service.status) {
      case 'pending': return 'Novo Pedido';
      case 'accepted': return 'Aceito';
      case 'on_way': return 'A Caminho';
      case 'arrived': return 'No Local';
      case 'in_progress': return 'Em Andamento';
      case 'awaiting_payment': return 'Aguardando Pagamento';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      default: return 'Desconhecido';
    }
  };

  const statusColor = getStatusColor();

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border-2 border-gray-200 hover:shadow-lg transition-all cursor-pointer overflow-hidden"
    >
      {/* Header com Status */}
      <div className={`bg-gradient-to-r from-${statusColor}-500 to-${statusColor}-600 text-white p-4`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Serviço #{service.id?.substring(0, 8)}</p>
            <h3 className="font-bold text-lg">{service.serviceType}</h3>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold">{getStatusText()}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Cliente */}
        <div className="flex items-center gap-3">
          {service.clientPhoto ? (
            <img
              src={service.clientPhoto}
              alt={service.clientName}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-white" />
            </div>
          )}
          <div className="flex-1">
            <p className="font-semibold text-gray-900">{service.clientName}</p>
            <p className="text-sm text-gray-600">{service.category}</p>
          </div>
        </div>

        {/* Informações */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ClockIcon className="w-4 h-4" />
            <span>{new Date(service.scheduledDate).toLocaleDateString('pt-BR')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <DollarSignIcon className="w-4 h-4" />
            <span className="font-semibold text-green-600">R$ {service.price.toFixed(2)}</span>
          </div>
        </div>

        {/* Localização */}
        <div className="flex items-start gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <MapPinIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{service.location.address}</span>
        </div>

        {/* Descrição */}
        {service.description && (
          <p className="text-sm text-gray-700 line-clamp-2">{service.description}</p>
        )}

        {/* Ações */}
        {service.status === 'pending' && (
          <div className="flex gap-2 pt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAccept?.();
              }}
              className="flex-1 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <CheckCircleIcon className="w-4 h-4" />
              Aceitar
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReject?.();
              }}
              className="flex-1 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <XCircleIcon className="w-4 h-4" />
              Recusar
            </button>
          </div>
        )}

        {service.status === 'accepted' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStart?.();
            }}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <PlayIcon className="w-5 h-5" />
            Iniciar Serviço
          </button>
        )}

        {service.status === 'in_progress' && (
          <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <AlertCircleIcon className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-semibold text-orange-900">
              Serviço em andamento - Clique para gerenciar
            </span>
          </div>
        )}

        {service.status === 'awaiting_payment' && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <DollarSignIcon className="w-5 h-5 text-yellow-600" />
            <span className="text-sm font-semibold text-yellow-900">
              Aguardando pagamento do cliente
            </span>
          </div>
        )}

        {service.status === 'completed' && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircleIcon className="w-5 h-5 text-green-600" />
            <span className="text-sm font-semibold text-green-900">
              Serviço concluído e pago
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
