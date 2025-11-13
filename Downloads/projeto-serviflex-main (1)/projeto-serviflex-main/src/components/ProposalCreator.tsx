import { useState, useEffect } from 'react';
import { Plus, Trash2, FileText, DollarSign, Calendar, Send, Loader2 } from 'lucide-react';
import { proposalService } from '../services/proposalService';
import { ProposalItem } from '../types/proposal';

interface ProposalCreatorProps {
  professionalId: string;
  professionalName: string;
  clientId?: string;
  clientName?: string;
  serviceRequestId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ProposalCreator({
  professionalId,
  professionalName,
  clientId: initialClientId,
  clientName: initialClientName,
  serviceRequestId,
  onSuccess,
  onCancel,
}: ProposalCreatorProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState<ProposalItem[]>([
    { id: '1', description: '', quantity: 1, unitPrice: 0, total: 0 },
  ]);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<'fixed' | 'percentage'>('fixed');
  const [validDays, setValidDays] = useState(7);
  const [notes, setNotes] = useState('');
  const [terms, setTerms] = useState('Pagamento via PIX após conclusão do serviço.');
  const [sending, setSending] = useState(false);
  
  // Seleção de cliente
  const [selectedClientId, setSelectedClientId] = useState(initialClientId || '');
  const [selectedClientName, setSelectedClientName] = useState(initialClientName || '');
  const [clients, setClients] = useState<Array<{ id: string; name: string; email: string }>>([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [showClientInput, setShowClientInput] = useState(!initialClientId);
  const [manualClientName, setManualClientName] = useState('');
  const [manualClientEmail, setManualClientEmail] = useState('');

  // Buscar clientes que já solicitaram serviços
  useEffect(() => {
    if (initialClientId) return; // Se já tem cliente, não busca
    
    const loadClients = async () => {
      setLoadingClients(true);
      try {
        const { collection, query, where, getDocs } = await import('firebase/firestore');
        const { db } = await import('../firebase');
        
        // Buscar solicitações únicas por cliente
        const requestsQuery = query(
          collection(db, 'serviceRequests'),
          where('professionalId', '==', professionalId)
        );
        
        const snapshot = await getDocs(requestsQuery);
        const clientsMap = new Map();
        
        snapshot.docs.forEach(doc => {
          const data = doc.data();
          if (data.clientId && data.clientName) {
            clientsMap.set(data.clientId, {
              id: data.clientId,
              name: data.clientName,
              email: data.clientEmail || ''
            });
          }
        });
        
        setClients(Array.from(clientsMap.values()));
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      } finally {
        setLoadingClients(false);
      }
    };
    
    loadClients();
  }, [professionalId, initialClientId]);

  const handleAddItem = () => {
    const newId = (items.length + 1).toString();
    setItems([...items, { id: newId, description: '', quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length === 1) return;
    setItems(items.filter(item => item.id !== id));
  };

  const handleUpdateItem = (id: string, field: keyof ProposalItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.total = proposalService.calculateItemTotal(
            Number(updated.quantity),
            Number(updated.unitPrice)
          );
        }
        return updated;
      }
      return item;
    }));
  };

  const subtotal = proposalService.calculateSubtotal(items);
  const discountAmount = proposalService.calculateDiscount(subtotal, discount, discountType);
  const total = proposalService.calculateTotal(subtotal, discount, discountType);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    if (!title.trim() || items.some(item => !item.description.trim())) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    // Validar cliente
    let finalClientId = selectedClientId;
    let finalClientName = selectedClientName;

    if (!finalClientId) {
      if (showClientInput && manualClientName.trim()) {
        // Criar ID temporário para cliente manual
        finalClientId = 'manual-' + Date.now();
        finalClientName = manualClientName.trim();
      } else {
        alert('Selecione ou informe um cliente');
        return;
      }
    }

    setSending(true);
    const proposalId = await proposalService.createProposal(
      professionalId,
      professionalName,
      finalClientId,
      finalClientName,
      title,
      description,
      items,
      discount,
      discountType,
      validDays,
      notes,
      terms,
      serviceRequestId
    );

    setSending(false);

    if (proposalId) {
      alert('Proposta enviada com sucesso!');
      onSuccess?.();
    } else {
      alert('Erro ao enviar proposta');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6" />
          <div>
            <h2 className="text-xl font-bold">Nova Proposta</h2>
            {selectedClientName && (
              <p className="text-sm text-blue-100">Para: {selectedClientName}</p>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Seleção de Cliente */}
        {!initialClientId && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Cliente * (Para quem você está enviando esta proposta?)
            </label>
            
            <div className="space-y-3">
              {/* Opção 1: Selecionar cliente existente */}
              {clients.length > 0 && (
                <div>
                  <label className="flex items-center gap-2 mb-2">
                    <input
                      type="radio"
                      checked={!showClientInput}
                      onChange={() => setShowClientInput(false)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Selecionar cliente que já solicitou serviço
                    </span>
                  </label>
                  
                  {!showClientInput && (
                    <select
                      value={selectedClientId}
                      onChange={(e) => {
                        const client = clients.find(c => c.id === e.target.value);
                        setSelectedClientId(e.target.value);
                        setSelectedClientName(client?.name || '');
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required={!showClientInput}
                    >
                      <option value="">Selecione um cliente...</option>
                      {clients.map(client => (
                        <option key={client.id} value={client.id}>
                          {client.name} {client.email && `(${client.email})`}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}
              
              {/* Opção 2: Informar cliente manualmente */}
              <div>
                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    checked={showClientInput}
                    onChange={() => setShowClientInput(true)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Informar novo cliente
                  </span>
                </label>
                
                {showClientInput && (
                  <div className="space-y-2 ml-6">
                    <input
                      type="text"
                      value={manualClientName}
                      onChange={(e) => {
                        setManualClientName(e.target.value);
                        setSelectedClientName(e.target.value);
                      }}
                      placeholder="Nome do cliente"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required={showClientInput}
                    />
                    <input
                      type="email"
                      value={manualClientEmail}
                      onChange={(e) => setManualClientEmail(e.target.value)}
                      placeholder="Email do cliente (opcional)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Informações Básicas */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título da Proposta *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Instalação de Ar Condicionado"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva os detalhes do serviço..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Itens */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-medium text-gray-700">Itens do Orçamento *</label>
            <button
              type="button"
              onClick={handleAddItem}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Adicionar item
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  <div className="md:col-span-5">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                      placeholder="Descrição do item"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleUpdateItem(item.id, 'quantity', Number(e.target.value))}
                      placeholder="Qtd"
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => handleUpdateItem(item.id, 'unitPrice', Number(e.target.value))}
                      placeholder="Preço"
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="md:col-span-2 flex items-center">
                    <span className="text-sm font-medium text-gray-900">
                      R$ {item.total.toFixed(2)}
                    </span>
                  </div>
                  <div className="md:col-span-1 flex items-center justify-end">
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totais */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Subtotal:</span>
            <span className="text-sm font-medium text-gray-900">R$ {subtotal.toFixed(2)}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Desconto:</span>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              min="0"
              step="0.01"
              className="w-24 px-3 py-1 border border-gray-300 rounded-lg text-sm"
            />
            <select
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value as 'fixed' | 'percentage')}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
            >
              <option value="fixed">R$</option>
              <option value="percentage">%</option>
            </select>
            <span className="text-sm text-red-600">
              - R$ {discountAmount.toFixed(2)}
            </span>
          </div>

          <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">Total:</span>
            <span className="text-2xl font-bold text-blue-600">R$ {total.toFixed(2)}</span>
          </div>
        </div>

        {/* Validade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Validade da Proposta
          </label>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <input
              type="number"
              value={validDays}
              onChange={(e) => setValidDays(Number(e.target.value))}
              min="1"
              max="90"
              className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
            />
            <span className="text-sm text-gray-600">dias</span>
          </div>
        </div>

        {/* Observações */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Observações
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Informações adicionais..."
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Termos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Termos e Condições
          </label>
          <textarea
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
            placeholder="Condições de pagamento, garantias, etc..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={sending}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {sending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Enviar Proposta
            </>
          )}
        </button>
      </div>
    </form>
  );
}
