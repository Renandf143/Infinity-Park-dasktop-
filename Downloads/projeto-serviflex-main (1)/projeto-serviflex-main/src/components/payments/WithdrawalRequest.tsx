import { useState } from 'react';
import { DollarSignIcon, AlertCircleIcon } from 'lucide-react';

export function WithdrawalRequest() {
  const [amount, setAmount] = useState('');
  const availableBalance = 3245.50; // Buscar do Firestore

  const handleWithdrawal = () => {
    const value = parseFloat(amount);
    if (value > availableBalance) {
      alert('Saldo insuficiente');
      return;
    }
    if (value < 50) {
      alert('Valor mínimo para saque: R$ 50,00');
      return;
    }
    // TODO: Implementar solicitação de saque
    alert(`Solicitação de saque de R$ ${value.toFixed(2)} enviada!`);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Solicitar Saque</h3>

      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-2">Saldo Disponível</p>
        <p className="text-3xl font-bold text-green-600">
          R$ {availableBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Valor do Saque
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setAmount('100')}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            R$ 100
          </button>
          <button
            onClick={() => setAmount('500')}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            R$ 500
          </button>
          <button
            onClick={() => setAmount(availableBalance.toString())}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            Tudo
          </button>
        </div>

        <button
          onClick={handleWithdrawal}
          disabled={!amount || parseFloat(amount) <= 0}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <DollarSignIcon className="w-5 h-5" />
          Solicitar Saque
        </button>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-900 font-medium mb-1">Informações Importantes</p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Valor mínimo: R$ 50,00</li>
              <li>• Prazo: 1-2 dias úteis</li>
              <li>• Sem taxas de saque</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
