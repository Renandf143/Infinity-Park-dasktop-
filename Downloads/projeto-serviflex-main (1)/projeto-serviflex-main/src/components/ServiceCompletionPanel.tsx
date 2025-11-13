import { useState } from 'react';
import { CheckCircle, XCircle, Shield, Clock, AlertCircle } from 'lucide-react';
import { escrowService } from '../services/escrowService';
import { EscrowPayment } from '../types/payment';

interface ServiceCompletionPanelProps {
  payment: EscrowPayment;
  userRole: 'client' | 'professional';
  onUpdate: () => void;
}

export function ServiceCompletionPanel({ 
  payment, 
  userRole,
  onUpdate 
}: ServiceCompletionPanelProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirmCompletion = async () => {
    setLoading(true);
    try {
      if (userRole === 'professional') {
        await escrowService.professionalConfirmCompletion(payment.id);
      } else {
        await escrowService.clientConfirmCompletion(payment.id);
      }
      onUpdate();
    } catch (error) {
      console.error('Erro ao confirmar conclusão:', error);
      alert('Erro ao confirmar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestRefund = async () => {
    const reason = prompt('Por favor, informe o motivo do reembolso:');
    if (!reason) return;

    setLoading(true);
    try {
      await escrowService.refundPayment(payment.id, reason);
      onUpdate();
    } catch (error) {
      console.error('Erro ao solicitar reembolso:', error);
      alert('Erro ao solicitar reembolso. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = () => {
    switch (payment.status) {
      case 'held_in_escrow':
        return {
          color: 'blue',
          icon: Shield,
          text: 'Pagamento em Custódia'
        };
      case 'released':
        return {
          color: 'green',
          icon: CheckCircle,
          text: 'Pagamento Liberado'
        };
      case 'refunded':
        return {
          color: 'gray',
          icon: XCircle,
          text: 'Reembolsado'
        };
      default:
        return {
          color: 'yellow',
          icon: Clock,
          text: 'Aguardando Pagamento'
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  const daysUntilAutoRelease = payment.autoReleaseDate 
    ? Math.ceil((new Date(payment.autoReleaseDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
      {/* Status */}
      <div className={`bg-${statusInfo.color}-50 border border-${statusInfo.color}-200 rounded-lg p-4 mb-6`}>
        <div className="flex items-center gap-3">
          <StatusIcon className={`w-6 h-6 text-${statusInfo.color}-600`} />
          <div className="flex-1">
            <h3 className={`font-semibold text-${statusInfo.color}-900`}>
              {statusInfo.text}
            </h3>
            {payment.status === 'held_in_escrow' && (
              <p className={`text-sm text-${statusInfo.color}-700 mt-1`}>
                Liberação automática em {daysUntilAutoRelease} dias
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Valores */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Valor total</span>
          <span className="font-semibold">R$ {payment.amount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Taxa da plataforma</span>
          <span className="text-orange-600">- R$ {payment.platformFeeAmount.toFixed(2)}</span>
        </div>
        <div className="border-t pt-3 flex justify-between">
          <span className="font-semibold">Profissional recebe</span>
          <span className="font-bold text-green-600">
            R$ {payment.professionalAmount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Confirmações */}
      {payment.status === 'held_in_escrow' && (
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2">
            {payment.serviceCompletedByProfessional ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <Clock className="w-5 h-5 text-gray-400" />
            )}
            <span className={payment.serviceCompletedByProfessional ? 'text-green-700' : 'text-gray-600'}>
              Profissional confirmou conclusão
            </span>
          </div>
          <div className="flex items-center gap-2">
            {payment.serviceCompletedByClient ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <Clock className="w-5 h-5 text-gray-400" />
            )}
            <span className={payment.serviceCompletedByClient ? 'text-green-700' : 'text-gray-600'}>
              Cliente confirmou conclusão
            </span>
          </div>
        </div>
      )}

      {/* Ações */}
      {payment.status === 'held_in_escrow' && (
        <div className="space-y-3">
          {userRole === 'professional' && !payment.serviceCompletedByProfessional && (
            <button
              onClick={handleConfirmCompletion}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Confirmando...' : 'Confirmar Conclusão do Serviço'}
            </button>
          )}

          {userRole === 'client' && !payment.serviceCompletedByClient && (
            <>
              <button
                onClick={handleConfirmCompletion}
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Confirmando...' : 'Confirmar Serviço Concluído'}
              </button>
              <button
                onClick={handleRequestRefund}
                disabled={loading}
                className="w-full border-2 border-red-600 text-red-600 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                Solicitar Reembolso
              </button>
            </>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
              <p className="text-sm text-yellow-800">
                {userRole === 'client' 
                  ? 'Confirme apenas quando o serviço estiver completamente concluído.'
                  : 'Após ambas as partes confirmarem, o pagamento será liberado automaticamente.'
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
