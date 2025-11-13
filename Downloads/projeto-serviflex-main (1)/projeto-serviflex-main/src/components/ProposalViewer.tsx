import { useState } from 'react';
import { X, CheckCircle, XCircle, Download, Printer, Loader2 } from 'lucide-react';
import { Proposal } from '../types/proposal';
import { proposalService } from '../services/proposalService';

interface ProposalViewerProps {
  proposal: Proposal;
  userType: 'professional' | 'client';
  onClose: () => void;
  onUpdate: () => void;
}

export function ProposalViewer({ proposal, userType, onClose, onUpdate }: ProposalViewerProps) {
  const [loading, setLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const handleAccept = async () => {
    if (userType !== 'client' || proposal.status !== 'pending') return;
    
    const confirm = window.confirm('Deseja aceitar esta proposta?');
    if (!confirm) return;

    setLoading(true);
    const success = await proposalService.acceptProposal(proposal.id, proposal.clientId);
    setLoading(false);

    if (success) {
      alert('Proposta aceita com sucesso!');
      onUpdate();
      onClose();
    } else {
      alert('Erro ao aceitar proposta');
    }
  };

  const handleReject = async () => {
    if (userType !== 'client' || proposal.status !== 'pending') return;

    setLoading(true);
    const success = await proposalService.rejectProposal(
      proposal.id,
      proposal.clientId,
      rejectionReason
    );
    setLoading(false);

    if (success) {
      alert('Proposta recusada');
      onUpdate();
      onClose();
    } else {
      alert('Erro ao recusar proposta');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const isExpired = proposal.validUntil?.toDate && new Date() > proposal.validUntil.toDate();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl w-full max-w-4xl my-8 shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{proposal.title}</h2>
            <p className="text-blue-100 text-sm mt-1">
              Proposta #{proposal.id.substring(0, 8)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status e Validade */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-semibold text-gray-900 capitalize">{proposal.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Válida até</p>
              <p className={`font-semibold ${isExpired ? 'text-red-600' : 'text-gray-900'}`}>
                {proposal.validUntil?.toDate
                  ? new Date(proposal.validUntil.toDate()).toLocaleDateString('pt-BR')
                  : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Criada em</p>
              <p className="font-semibold text-gray-900">
                {proposal.createdAt?.toDate
                  ? new Date(proposal.createdAt.toDate()).toLocaleDateString('pt-BR')
                  : 'N/A'}
              </p>
            </div>
          </div>

          {/* Partes */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Profissional</p>
              <p className="font-semibold text-gray-900">{proposal.professionalName}</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Cliente</p>
              <p className="font-semibold text-gray-900">{proposal.clientName}</p>
            </div>
          </div>

          {/* Descrição */}
          {proposal.description && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Descrição</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{proposal.description}</p>
            </div>
          )}

          {/* Itens */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Itens do Orçamento</h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Descrição</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Qtd</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Preço Unit.</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {proposal.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.description}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-center">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">
                        R$ {item.unitPrice.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                        R$ {item.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totais */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Subtotal:</span>
              <span className="font-medium text-gray-900">R$ {proposal.subtotal.toFixed(2)}</span>
            </div>
            {proposal.discount > 0 && (
              <div className="flex items-center justify-between text-red-600">
                <span>
                  Desconto ({proposal.discountType === 'percentage' ? `${proposal.discount}%` : 'R$'}):
                </span>
                <span className="font-medium">
                  - R$ {(proposal.subtotal - proposal.total).toFixed(2)}
                </span>
              </div>
            )}
            <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-blue-600">R$ {proposal.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Observações */}
          {proposal.notes && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Observações</h3>
              <p className="text-gray-700 whitespace-pre-wrap bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                {proposal.notes}
              </p>
            </div>
          )}

          {/* Termos */}
          {proposal.terms && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Termos e Condições</h3>
              <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-200">
                {proposal.terms}
              </p>
            </div>
          )}

          {/* Motivo de Recusa */}
          {proposal.status === 'rejected' && proposal.rejectionReason && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-900 mb-2">Motivo da Recusa</h3>
              <p className="text-red-700">{proposal.rejectionReason}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-xl border-t border-gray-200 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Imprimir
            </button>
            <button
              onClick={() => alert('Funcionalidade de download em desenvolvimento')}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>

          <div className="flex gap-3">
            {userType === 'client' && proposal.status === 'pending' && !isExpired && (
              <>
                <button
                  onClick={() => setShowRejectModal(true)}
                  disabled={loading}
                  className="px-6 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <XCircle className="w-5 h-5" />
                  Recusar
                </button>
                <button
                  onClick={handleAccept}
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <CheckCircle className="w-5 h-5" />
                  )}
                  Aceitar Proposta
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Recusa */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recusar Proposta</h3>
            <p className="text-gray-600 mb-4">Por favor, informe o motivo da recusa:</p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Ex: Valor acima do orçamento, prazo não atende..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 mb-4"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleReject}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                Confirmar Recusa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
