import { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, XCircle, Eye, Plus, Loader2 } from 'lucide-react';
import { proposalService } from '../services/proposalService';
import { Proposal } from '../types/proposal';
import { ProposalCreator } from './ProposalCreator';
import { ProposalViewer } from './ProposalViewer';

interface ProposalsListProps {
  professionalId: string;
  professionalName: string;
  userType: 'professional' | 'client';
}

export function ProposalsList({ professionalId, professionalName, userType }: ProposalsListProps) {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreator, setShowCreator] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');

  useEffect(() => {
    loadProposals();
  }, [professionalId, userType]);

  const loadProposals = async () => {
    setLoading(true);
    const data = userType === 'professional'
      ? await proposalService.getProfessionalProposals(professionalId)
      : await proposalService.getClientProposals(professionalId);
    setProposals(data);
    setLoading(false);
  };

  const filteredProposals = proposals.filter(p => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock, label: 'Pendente' },
      accepted: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle, label: 'Aceita' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle, label: 'Recusada' },
      expired: { bg: 'bg-gray-100', text: 'text-gray-800', icon: XCircle, label: 'Expirada' },
    };
    const badge = badges[status as keyof typeof badges] || badges.pending;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.text}`}>
        <Icon className="w-4 h-4" />
        {badge.label}
      </span>
    );
  };

  if (showCreator) {
    return (
      <ProposalCreator
        professionalId={professionalId}
        professionalName={professionalName}
        onSuccess={() => {
          setShowCreator(false);
          loadProposals();
        }}
        onCancel={() => setShowCreator(false)}
      />
    );
  }

  if (selectedProposal) {
    return (
      <ProposalViewer
        proposal={selectedProposal}
        userType={userType}
        onClose={() => setSelectedProposal(null)}
        onUpdate={loadProposals}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Propostas</h2>
          <p className="text-gray-600 mt-1">
            {userType === 'professional' 
              ? 'Gerencie suas propostas enviadas'
              : 'Propostas recebidas de profissionais'}
          </p>
        </div>
        {userType === 'professional' && (
          <button
            onClick={() => setShowCreator(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nova Proposta
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { value: 'all', label: 'Todas' },
          { value: 'pending', label: 'Pendentes' },
          { value: 'accepted', label: 'Aceitas' },
          { value: 'rejected', label: 'Recusadas' },
        ].map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter(value as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              filter === value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {label} ({proposals.filter(p => value === 'all' || p.status === value).length})
          </button>
        ))}
      </div>

      {/* Lista de Propostas */}
      {filteredProposals.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhuma proposta {filter !== 'all' && filter}
          </h3>
          <p className="text-gray-600 mb-6">
            {userType === 'professional'
              ? 'Crie sua primeira proposta para um cliente'
              : 'Você ainda não recebeu propostas'}
          </p>
          {userType === 'professional' && (
            <button
              onClick={() => setShowCreator(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Criar Proposta
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredProposals.map((proposal) => (
            <div
              key={proposal.id}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{proposal.title}</h3>
                    {getStatusBadge(proposal.status)}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{proposal.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>
                      {userType === 'professional' ? 'Para' : 'De'}: {' '}
                      <span className="font-medium text-gray-900">
                        {userType === 'professional' ? proposal.clientName : proposal.professionalName}
                      </span>
                    </span>
                    <span>•</span>
                    <span>
                      {proposal.createdAt?.toDate
                        ? new Date(proposal.createdAt.toDate()).toLocaleDateString('pt-BR')
                        : 'Data não disponível'}
                    </span>
                    <span>•</span>
                    <span>
                      Válida até: {' '}
                      {proposal.validUntil?.toDate
                        ? new Date(proposal.validUntil.toDate()).toLocaleDateString('pt-BR')
                        : 'N/A'}
                    </span>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="text-2xl font-bold text-blue-600">
                    R$ {proposal.total.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {proposal.items.length} {proposal.items.length === 1 ? 'item' : 'itens'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setSelectedProposal(proposal)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Ver Detalhes
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
