import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PlayCircleIcon,
  DollarSignIcon,
  AlertCircleIcon,
  UserIcon
} from 'lucide-react';
import { ServiceRequest } from '../types/service';

interface ServiceTimelineProps {
  service: ServiceRequest;
}

export function ServiceTimeline({ service }: ServiceTimelineProps) {
  const getEventIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return { Icon: AlertCircleIcon, color: 'text-yellow-600', bg: 'bg-yellow-100' };
      case 'accepted':
        return { Icon: CheckCircleIcon, color: 'text-blue-600', bg: 'bg-blue-100' };
      case 'scheduled':
        return { Icon: ClockIcon, color: 'text-purple-600', bg: 'bg-purple-100' };
      case 'in_progress':
        return { Icon: PlayCircleIcon, color: 'text-green-600', bg: 'bg-green-100' };
      case 'completed':
        return { Icon: CheckCircleIcon, color: 'text-indigo-600', bg: 'bg-indigo-100' };
      case 'paid':
        return { Icon: DollarSignIcon, color: 'text-emerald-600', bg: 'bg-emerald-100' };
      case 'cancelled':
        return { Icon: XCircleIcon, color: 'text-gray-600', bg: 'bg-gray-100' };
      default:
        return { Icon: AlertCircleIcon, color: 'text-gray-600', bg: 'bg-gray-100' };
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Solicitação Criada',
      accepted: 'Serviço Aceito',
      scheduled: 'Agendamento Confirmado',
      in_progress: 'Serviço Iniciado',
      completed: 'Serviço Concluído',
      paid: 'Pagamento Confirmado',
      cancelled: 'Serviço Cancelado'
    };
    return labels[status] || status;
  };

  const sortedHistory = [...service.statusHistory].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <ClockIcon className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-900">Histórico do Serviço</h3>
      </div>

      <div className="relative">
        {/* Linha vertical */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

        {/* Eventos */}
        <div className="space-y-6">
          {sortedHistory.map((event, index) => {
            const { Icon, color, bg } = getEventIcon(event.to);
            const isLast = index === sortedHistory.length - 1;

            return (
              <div key={index} className="relative flex gap-4">
                {/* Ícone */}
                <div className={`relative z-10 w-12 h-12 ${bg} rounded-full flex items-center justify-center flex-shrink-0 border-4 border-white shadow-md`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>

                {/* Conteúdo */}
                <div className={`flex-1 pb-6 ${!isLast ? 'border-b border-gray-200' : ''}`}>
                  <div className="bg-white rounded-xl p-4 border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-gray-900 text-lg">
                        {getStatusLabel(event.to)}
                      </h4>
                      <span className="text-xs text-gray-500 font-semibold whitespace-nowrap ml-2">
                        {new Date(event.timestamp).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-2">
                      {new Date(event.timestamp).toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>

                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <UserIcon className="w-4 h-4 text-gray-500" />
                      <span className="font-semibold">{event.userName}</span>
                    </div>

                    {event.notes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-700 italic">"{event.notes}"</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Informações adicionais */}
      <div className="bg-blue-50 rounded-xl p-5 border-2 border-blue-200 mt-8">
        <h4 className="font-bold text-blue-900 mb-3">Informações do Agendamento</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Criado em:</p>
            <p className="font-semibold text-gray-900">
              {new Date(service.createdAt).toLocaleString('pt-BR')}
            </p>
          </div>
          {service.acceptedAt && (
            <div>
              <p className="text-gray-600">Aceito em:</p>
              <p className="font-semibold text-gray-900">
                {new Date(service.acceptedAt).toLocaleString('pt-BR')}
              </p>
            </div>
          )}
          {service.startedAt && (
            <div>
              <p className="text-gray-600">Iniciado em:</p>
              <p className="font-semibold text-gray-900">
                {new Date(service.startedAt).toLocaleString('pt-BR')}
              </p>
            </div>
          )}
          {service.completedAt && (
            <div>
              <p className="text-gray-600">Concluído em:</p>
              <p className="font-semibold text-gray-900">
                {new Date(service.completedAt).toLocaleString('pt-BR')}
              </p>
            </div>
          )}
          {service.paidAt && (
            <div>
              <p className="text-gray-600">Pago em:</p>
              <p className="font-semibold text-gray-900">
                {new Date(service.paidAt).toLocaleString('pt-BR')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
