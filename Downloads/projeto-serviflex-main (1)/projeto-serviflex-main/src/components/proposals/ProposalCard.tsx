import { Proposal } from '../../types/proposal';
import { Calendar, Clock, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface ProposalCardProps {
  proposal: Proposal;
  userType: 'professional' | 'client';
  onAccept?: (proposalId: string) => void;
  onReject?: (proposalId: string) => void;
  onClick?: () => void;
}

export function ProposalCard({ proposal, userType, onAccept, onReject, onClick }: ProposalCardProps) {
  const getStatusBadge = () => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendente', icon: AlertCircle },
      accepted: { bg: 'bg-green-100', text: 'text-green-800', label: 'Aceita', icon: CheckCircle },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Recusada', icon: XCircle },
      expired: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Expirada', icon: XCircle },
    };

    const badge = badges[proposal.status];
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.text}`}>
        <Icon className="w-4 h-4" />
        {badge.label}
      </span>
    );
  };

  const isExpired = () => {
    if (proposal.status !== 'pending') return false;
    const validUntil = proposal.validUntil instanceof Date 
      ? proposal.validUntil 
      : new Date(proposal.validUntil);
    return validUntil < new Date();
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {userType === 'professional' ? proposal.clientName : proposal.professionalName}
          </h3>
          <p className="text-sm text-gray-600">{proposal.description}</p>
        </div>
        {getStatusBadge()}
      </div>

      {/* Detalhes */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>
            Válida até: {new Date(proposal.validUntil).toLocaleDateString('pt-BR')}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>Duração: {proposal.estimatedDuration}</span>
        </div>
      </div>

      {/* Itens */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Itens do Orçamento</span>
        </div>
        <div className="space-y-2">
          {proposal.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-600">
                {item.description} ({item.quantity}x)
              </span>
              <span className="font-medium text-gray-900">
                R$ {item.total.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Totais */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-medium">R$ {proposal.subtotal.toFixed(2)}</span>
        </div>
        {proposal.discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Desconto ({proposal.discountPercentage}%):</span>
            <span className="font-medium text-green-600">- R$ {proposal.discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
          <span>Total:</span>
          <span className="text-blue-600">R$ {proposal.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Observações */}
      {proposal.notes && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-4">
          <p className="text-sm text-gray-700">{proposal.notes}</p>
        </div>
      )}

      {/* Ações para Cliente */}
      {userType === 'client' && proposal.status === 'pending' && !isExpired() && (
        <div className="flex gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAccept?.(proposal.id);
            }}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Aceitar Proposta
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReject?.(proposal.id);
            }}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Recusar
          </button>
        </div>
      )}

      {/* Resposta do Cliente */}
      {proposal.status === 'accepted' && proposal.clientResponse && (
        <div className="bg-green-50 border-l-4 border-green-500 p-3">
          <p className="text-sm font-medium text-green-900 mb-1">Resposta do cliente:</p>
          <p className="text-sm text-green-700">{proposal.clientResponse}</p>
        </div>
      )}

      {proposal.status === 'rejected' && proposal.rejectionReason && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3">
          <p className="text-sm font-medium text-red-900 mb-1">Motivo da recusa:</p>
          <p className="text-sm text-red-700">{proposal.rejectionReason}</p>
        </div>
      )}
    </div>
  );
}
