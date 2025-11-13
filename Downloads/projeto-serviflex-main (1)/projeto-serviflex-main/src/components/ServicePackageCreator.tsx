import { useState } from 'react';
import { Plus, Trash2, Save, X, Package } from 'lucide-react';
import { servicePackageService } from '../services/servicePackageService';
import { ServiceOption, ServiceExtra } from '../types/servicePackage';

interface ServicePackageCreatorProps {
  professionalId: string;
  professionalName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ServicePackageCreator({
  professionalId,
  professionalName,
  onSuccess,
  onCancel,
}: ServicePackageCreatorProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Instalação');
  const [basePrice, setBasePrice] = useState(0);
  const [estimatedDuration, setEstimatedDuration] = useState(60);
  const [available, setAvailable] = useState(true);
  
  const [options, setOptions] = useState<ServiceOption[]>([]);
  const [extras, setExtras] = useState<ServiceExtra[]>([]);
  
  const [saving, setSaving] = useState(false);

  const categories = [
    'Instalação',
    'Manutenção',
    'Reparo',
    'Limpeza',
    'Consultoria',
    'Outro',
  ];

  const handleAddOption = () => {
    setOptions([
      ...options,
      {
        id: Date.now().toString(),
        name: '',
        description: '',
        price: 0,
        required: false,
      },
    ]);
  };

  const handleRemoveOption = (id: string) => {
    setOptions(options.filter(opt => opt.id !== id));
  };

  const handleUpdateOption = (id: string, field: keyof ServiceOption, value: any) => {
    setOptions(options.map(opt => opt.id === id ? { ...opt, [field]: value } : opt));
  };

  const handleAddExtra = () => {
    setExtras([
      ...extras,
      {
        id: Date.now().toString(),
        name: '',
        description: '',
        price: 0,
        maxQuantity: 1,
      },
    ]);
  };

  const handleRemoveExtra = (id: string) => {
    setExtras(extras.filter(ext => ext.id !== id));
  };

  const handleUpdateExtra = (id: string, field: keyof ServiceExtra, value: any) => {
    setExtras(extras.map(ext => ext.id === id ? { ...ext, [field]: value } : ext));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Preencha o nome do serviço');
      return;
    }

    setSaving(true);
    const packageId = await servicePackageService.createPackage({
      professionalId,
      professionalName,
      name,
      description,
      category,
      basePrice,
      estimatedDuration,
      images: [],
      options,
      extras,
      available,
    });

    setSaving(false);

    if (packageId) {
      alert('Pacote de serviço criado com sucesso!');
      onSuccess?.();
    } else {
      alert('Erro ao criar pacote');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-t-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package className="w-6 h-6" />
          <div>
            <h2 className="text-xl font-bold">Novo Pacote de Serviço</h2>
            <p className="text-sm text-purple-100">Crie um serviço tipo cardápio para seus clientes</p>
          </div>
        </div>
        {onCancel && (
          <button type="button" onClick={onCancel} className="p-2 hover:bg-white/10 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* Informações Básicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Serviço *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Instalação de Ar Condicionado Split"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o que está incluído no serviço..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preço Base
            </label>
            <input
              type="number"
              value={basePrice}
              onChange={(e) => setBasePrice(Number(e.target.value))}
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duração Estimada (minutos)
            </label>
            <input
              type="number"
              value={estimatedDuration}
              onChange={(e) => setEstimatedDuration(Number(e.target.value))}
              min="15"
              step="15"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
              className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
            />
            <label className="text-sm font-medium text-gray-700">
              Disponível para pedidos
            </label>
          </div>
        </div>

        {/* Opções (cliente escolhe UMA) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Opções</h3>
              <p className="text-sm text-gray-600">Cliente escolhe UMA opção (ex: tamanho, modelo)</p>
            </div>
            <button
              type="button"
              onClick={handleAddOption}
              className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Adicionar opção
            </button>
          </div>

          <div className="space-y-3">
            {options.map((option) => (
              <div key={option.id} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  <div className="md:col-span-4">
                    <input
                      type="text"
                      value={option.name}
                      onChange={(e) => handleUpdateOption(option.id, 'name', e.target.value)}
                      placeholder="Nome (ex: Split 12.000 BTUs)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <input
                      type="text"
                      value={option.description}
                      onChange={(e) => handleUpdateOption(option.id, 'description', e.target.value)}
                      placeholder="Descrição"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <input
                      type="number"
                      value={option.price}
                      onChange={(e) => handleUpdateOption(option.id, 'price', Number(e.target.value))}
                      placeholder="+ R$"
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div className="md:col-span-1 flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={option.required}
                      onChange={(e) => handleUpdateOption(option.id, 'required', e.target.checked)}
                      className="w-4 h-4 text-purple-600 rounded"
                      title="Obrigatório"
                    />
                  </div>
                  <div className="md:col-span-1 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(option.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Extras (cliente pode adicionar vários) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Extras</h3>
              <p className="text-sm text-gray-600">Cliente pode adicionar VÁRIOS (ex: suporte extra, material)</p>
            </div>
            <button
              type="button"
              onClick={handleAddExtra}
              className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Adicionar extra
            </button>
          </div>

          <div className="space-y-3">
            {extras.map((extra) => (
              <div key={extra.id} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  <div className="md:col-span-4">
                    <input
                      type="text"
                      value={extra.name}
                      onChange={(e) => handleUpdateExtra(extra.id, 'name', e.target.value)}
                      placeholder="Nome (ex: Suporte extra)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <input
                      type="text"
                      value={extra.description}
                      onChange={(e) => handleUpdateExtra(extra.id, 'description', e.target.value)}
                      placeholder="Descrição"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <input
                      type="number"
                      value={extra.price}
                      onChange={(e) => handleUpdateExtra(extra.id, 'price', Number(e.target.value))}
                      placeholder="+ R$"
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div className="md:col-span-1 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveExtra(extra.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Exemplo de Cálculo */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="font-semibold text-purple-900 mb-2">💡 Exemplo de Cálculo</h4>
          <div className="text-sm text-purple-800 space-y-1">
            <p>Preço Base: R$ {basePrice.toFixed(2)}</p>
            {options.length > 0 && <p>+ Opção escolhida: R$ {options[0]?.price?.toFixed(2) || '0.00'}</p>}
            {extras.length > 0 && <p>+ Extras: R$ {extras[0]?.price?.toFixed(2) || '0.00'}</p>}
            <p className="font-bold pt-2 border-t border-purple-300">
              Total: R$ {(basePrice + (options[0]?.price || 0) + (extras[0]?.price || 0)).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4 rounded-b-xl border-t border-gray-200 flex items-center justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Salvando...' : 'Criar Pacote'}
        </button>
      </div>
    </form>
  );
}
