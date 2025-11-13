import { useState } from 'react';
import { CreditCardIcon, PlusIcon, TrashIcon, CheckCircleIcon } from 'lucide-react';

interface BankAccount {
  id: string;
  bankName: string;
  accountType: 'checking' | 'savings';
  accountNumber: string;
  isPrimary: boolean;
}

export function BankAccounts() {
  const [accounts, setAccounts] = useState<BankAccount[]>([
    {
      id: '1',
      bankName: 'Banco do Brasil',
      accountType: 'checking',
      accountNumber: '****-1234',
      isPrimary: true
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Contas Bancárias</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Adicionar Conta
        </button>
      </div>

      <div className="space-y-4">
        {accounts.map(account => (
          <div key={account.id} className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CreditCardIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900">{account.bankName}</p>
                  {account.isPrimary && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                      <CheckCircleIcon className="w-3 h-3" />
                      Principal
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {account.accountType === 'checking' ? 'Conta Corrente' : 'Poupança'} • {account.accountNumber}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!account.isPrimary && (
                <button className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm">
                  Tornar Principal
                </button>
              )}
              <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddForm && (
        <div className="mt-6 p-6 border-2 border-dashed border-gray-300 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-4">Adicionar Nova Conta</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Banco</label>
              <input
                type="text"
                placeholder="Nome do banco"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Conta</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="checking">Conta Corrente</option>
                  <option value="savings">Poupança</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Agência</label>
                <input
                  type="text"
                  placeholder="0000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Número da Conta</label>
              <input
                type="text"
                placeholder="00000-0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-3">
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Adicionar
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <p className="text-sm text-yellow-900 font-medium mb-2">🔒 Segurança</p>
        <p className="text-sm text-yellow-700">
          Suas informações bancárias são criptografadas e protegidas. Nunca compartilhamos seus dados.
        </p>
      </div>
    </div>
  );
}
