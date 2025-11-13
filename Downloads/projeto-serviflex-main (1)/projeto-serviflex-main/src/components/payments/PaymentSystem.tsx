import { useState } from 'react';
import { 
  DollarSignIcon, 
  TrendingUpIcon, 
  DownloadIcon,
  FilterIcon,
  CreditCardIcon,
  WalletIcon,
  CalendarIcon,
  FileTextIcon,
  PlusIcon
} from 'lucide-react';
import { TransactionHistory } from './TransactionHistory';
import { PaymentReceipts } from './PaymentReceipts';
import { RevenueChart } from './RevenueChart';
import { FutureEarnings } from './FutureEarnings';
import { TaxReports } from './TaxReports';
import { BankAccounts } from './BankAccounts';
import { WithdrawalRequest } from './WithdrawalRequest';

export function PaymentSystem() {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'receipts' | 'reports' | 'accounts'>('overview');

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: DollarSignIcon },
    { id: 'transactions', label: 'Transações', icon: WalletIcon },
    { id: 'receipts', label: 'Comprovantes', icon: FileTextIcon },
    { id: 'reports', label: 'Relatórios', icon: CalendarIcon },
    { id: 'accounts', label: 'Contas Bancárias', icon: CreditCardIcon },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Sistema de Pagamentos</h2>
            <p className="text-sm text-gray-600 mt-1">Gerencie seus ganhos e transações</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors">
            <PlusIcon className="w-5 h-5" />
            Solicitar Saque
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-6 border-b border-gray-200">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors relative ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Esquerda */}
          <div className="lg:col-span-2 space-y-6">
            <RevenueChart />
            <FutureEarnings />
          </div>

          {/* Coluna Direita */}
          <div className="space-y-6">
            <WithdrawalRequest />
            <TransactionHistory limit={5} />
          </div>
        </div>
      )}

      {activeTab === 'transactions' && <TransactionHistory />}
      {activeTab === 'receipts' && <PaymentReceipts />}
      {activeTab === 'reports' && <TaxReports />}
      {activeTab === 'accounts' && <BankAccounts />}
    </div>
  );
}
