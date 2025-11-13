import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Clock, Star, Package, Check } from 'lucide-react';
import { ServicePackage, ServiceOption, ServiceExtra } from '../types/servicePackage';
import { servicePackageService } from '../services/servicePackageService';

interface ServicePackageOrderProps {
  packageData: ServicePackage;
  clientId: string;
  clientName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ServicePackageOrder({
  packageData,
  clientId,
  clientName,
  onSuccess,
  onCancel,
}: ServicePackageOrderProps) {
  const [selectedOption, setSelectedOption] = useState<ServiceOption | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<Map<string, number>>(new Map());
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [notes, setNotes] = useState('');
  const [ordering, setOrdering] = useState(false);

  // Selecionar primeira opção obrigatória automaticamente
  useEffect(() => {
    const requiredOption = packageData.options.find(opt => opt.required);
    if (requiredOption && !selectedOption) {
      setSelectedOption(requiredOption);
    }
  }, [packageData.options, selectedOption]);

  const handleToggleExtra = (extra: ServiceExtra) => {
    const newExtras = new Map(selectedExtras);
    const currentQty = newExtras.get(extra.id) || 0;
    
    if (currentQty === 0) {
      newExtras.set(extra.id, 1);
    } else {
      newExtras.delete(extra.id);
    }
    
    setSelectedExtras(newExtras);
  };

  const handleChangeExtraQty = (extraId: string, delta: number, maxQty?: number) => {
    const newExtras = new Map(selectedExtras);
    const currentQty = newExtras.get(extraId) || 0;
    const newQty = Math.max(0, currentQty + delta);
    
    if (maxQty && newQty > maxQty) return;
    
    if (newQty === 0) {
      newExtras.delete(extraId);
    } else {
      newExtras.set(extraId, newQty);
    }
    
    setSelectedExtras(newExtras);
  };

  const calculateTotal = () => {
    let total = packageData.basePrice;
    
    if (selectedOption) {
      total += selectedOption.price;
    }
    
    packageData.extras.forEach(extra => {
      const qty = selectedExtras.get(extra.id) || 0;
      total += extra.price * qty;
    });
    
    return total;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address || !city || !state || !zipCode) {
      alert('Preencha todos os campos de endereço');
      return;
    }

    const hasRequiredOption = packageData.options.some(opt => opt.required);
    if (hasRequiredOption && !selectedOption) {
      alert('Selecione uma opção obrigatória');
      return;
    }

    setOrdering(true);

    const extrasArray = packageData.extras
      .filter(extra => selectedExtras.has(extra.id))
      .map(extra => ({
        ...extra,
        quantity: selectedExtras.get(extra.id),
      }));

    const orderId = await servicePackageService.createOrder({
      packageId: packageData.id,
      packageName: packageData.name,
      professionalId: packageData.professionalId,
      professionalName: packageData.professionalName,
      clientId,
      clientName,
      selectedOption: selectedOption || undefined,
      selectedExtras: extrasArray,
      basePrice: packageData.basePrice,
      optionPrice: selectedOption?.price || 0,
      extrasTotal: extrasArray.reduce((sum, e) => sum + (e.price * (e.quantity || 1)), 0),
      total: calculateTotal(),
      preferredDate,
      preferredTime,
      address,
      city,
      state,
      zipCode,
      notes,
      status: 'pending',
    });

    setOrdering(false);

    if (orderId) {
      alert('Pedido realizado com sucesso! O profissional foi notificado.');
      onSuccess?.();
    } else {
      alert('Erro ao realizar pedido');
    }
  };

  const total = calculateTotal();

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg border border-gray-200 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-t-xl">
        <div className="flex items-center gap-3 mb-2">
          <Package className="w-6 h-6" />
          <h2 className="text-2xl font-bold">{packageData.name}</h2>
        </div>
        <p className="text-green-100">{packageData.description}</p>
        <div className="flex items-center gap-4 mt-3 text-sm">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {packageData.estimatedDuration} min
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            {packageData.rating.toFixed(1)} ({packageData.reviewCount})
          </span>
          <span className="bg-green-800 px-2 py-1 rounded">{packageData.category}</span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Opções */}
        {packageData.options.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              Escolha uma opção {packageData.options.some(o => o.required) && <span className="text-red-600">*</span>}
            </h3>
            <div className="space-y-2">
              {packageData.options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedOption(option)}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                    selectedOption?.id === option.id
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedOption?.id === option.id
                            ? 'border-green-600 bg-green-600'
                            : 'border-gray-300'
                        }`}>
                          {selectedOption?.id === option.id && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="font-medium text-gray-900">{option.name}</span>
                      </div>
                      {option.description && (
                        <p className="text-sm text-gray-600 mt-1 ml-7">{option.description}</p>
                      )}
                    </div>
                    <span className="text-lg font-bold text-green-600">
                      {option.price > 0 ? `+ R$ ${option.price.toFixed(2)}` : 'Incluído'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Extras */}
        {packageData.extras.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Extras (opcional)</h3>
            <div className="space-y-2">
              {packageData.extras.map((extra) => {
                const qty = selectedExtras.get(extra.id) || 0;
                const isSelected = qty > 0;

                return (
                  <div
                    key={extra.id}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      isSelected ? 'border-green-600 bg-green-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleExtra(extra)}
                            className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                          />
                          <span className="font-medium text-gray-900">{extra.name}</span>
                        </div>
                        {extra.description && (
                          <p className="text-sm text-gray-600 mt-1 ml-7">{extra.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {isSelected && extra.maxQuantity && extra.maxQuantity > 1 && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleChangeExtraQty(extra.id, -1)}
                              className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-medium">{qty}</span>
                            <button
                              type="button"
                              onClick={() => handleChangeExtraQty(extra.id, 1, extra.maxQuantity)}
                              className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        <span className="text-lg font-bold text-green-600 min-w-[100px] text-right">
                          + R$ {(extra.price * qty).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Endereço */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Endereço do Serviço *</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Rua, número, complemento"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Cidade"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="Estado"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="CEP"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
        </div>

        {/* Data e Hora Preferidas */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Data e Hora Preferidas (opcional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="date"
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
            <input
              type="time"
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Observações */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Observações (opcional)</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Alguma informação adicional..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Resumo do Pedido */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <h3 className="font-semibold text-gray-900 mb-3">Resumo do Pedido</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Serviço base:</span>
              <span className="font-medium">R$ {packageData.basePrice.toFixed(2)}</span>
            </div>
            {selectedOption && selectedOption.price > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">{selectedOption.name}:</span>
                <span className="font-medium">+ R$ {selectedOption.price.toFixed(2)}</span>
              </div>
            )}
            {Array.from(selectedExtras.entries()).map(([extraId, qty]) => {
              const extra = packageData.extras.find(e => e.id === extraId);
              if (!extra) return null;
              return (
                <div key={extraId} className="flex justify-between">
                  <span className="text-gray-600">{extra.name} (x{qty}):</span>
                  <span className="font-medium">+ R$ {(extra.price * qty).toFixed(2)}</span>
                </div>
              );
            })}
            <div className="pt-2 border-t border-gray-200 flex justify-between">
              <span className="text-lg font-bold text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-green-600">R$ {total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4 rounded-b-xl border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          <p>Profissional: <span className="font-medium text-gray-900">{packageData.professionalName}</span></p>
          <p>Duração estimada: {packageData.estimatedDuration} minutos</p>
        </div>
        <div className="flex gap-3">
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
            disabled={ordering}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2 text-lg font-semibold"
          >
            <ShoppingCart className="w-5 h-5" />
            {ordering ? 'Processando...' : `Fazer Pedido - R$ ${total.toFixed(2)}`}
          </button>
        </div>
      </div>
    </form>
  );
}
