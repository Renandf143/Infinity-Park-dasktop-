import { useEffect, useState } from 'react';
import { WalletIcon, CreditCardIcon, ArrowDownIcon, PlusIcon, CheckCircleIcon, ClockIcon, XCircleIcon } from 'lucide-react';
import { paymentService } from '../services/paymentService';
import { BRAZILIAN_BANKS, BankAccount, Wallet, WithdrawalRequest } from '../types/payment';

interface WithdrawalPanelProps {
  userId: string;
}

export function WithdrawalPanel({ userId }: WithdrawalPanelProps) {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');

  const [newAccount, setNewAccount] = useState({
    bankCode: '',
    accountType: 'checking' as 'checking' | 'savings',
    accountNumber: '',
    accountDigit: '',
    agencyNumber: '',
    agencyDigit: '',
    holderName: '',
    holderDocument: '',
    isDefault: false
  });

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    try {
      const [walletData, accounts, withdrawalHistory] = await Promise.all([
        paymentService.getWallet(userId),
        paymentService.getBankAccounts(userId),
        paymentService.getWithdrawalHistory(userId)
      ]);

      setWallet(walletData);
      setBankAccounts(accounts);
      setWithdrawals(withdrawalHistory);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAccount = async () => {
    try {
      const bank = BRAZILIAN_BANKS.find(b => b.code === newAccount.bankCode);
      if (!bank) {
        alert('Selecione um banco');
        return;
      }

      const accountData: BankAccount = {
        userId,
        bankCode: newAccount.bankCode,
        bankName: bank.name,
        accountType: newAccount.accountType,
        accountNumber: newAccount.accountNumber,
        accountDigit: newAccount.accountDigit,
        agencyNumber: newAccount.agencyNumber,
        agencyDigit: newAccount.agencyDigit,
        holderName: newAccount.holderName,
        holderDocument: newAccount.holderDocument,
        isDefault: newAccount.isDefault,
        verified: false,
        createdAt: new Date()
      };

      await paymentService.saveBankAccount(accountData);
      alert('Conta bancária adicionada com sucesso!');
      setShowAddAccount(false);
      loadData();
    } catch (error) {
      console.error('Erro ao adicionar conta:', error);
      alert('Erro ao adicionar conta bancária');
    }
  };

  const handleWithdraw = async () => {
    try {
      const amount = parseFloat(withdrawAmount);
      if (isNaN(amount) || amount < 10) {
        alert('Valor mínimo para saque é R$ 10,00');
        return;
      }

      if (!selectedAccount) {
        alert('Selecione uma conta bancária');
        return;
      }

      await paymentService.requestWithdrawal(userId, amount, selectedAccount);
      alert('Solicitação de saque enviada com sucesso!');
      setShowWithdrawModal(false);
      setWithdrawAmount('');
      loadData();
    } catch (error: any) {
      console.error('Erro ao solicitar saque:', error);
      alert(error.message || 'Erro ao solicitar saque');
    }
  };

  if (loading || !wallet) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Wallet Card */}
      <div className="bg-[#1E40AF] rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm opacity-90">Saldo Disponível</p>
            <h3 className="text-4xl font-bold">R$ {wallet.balance.toFixed(2)}</h3>
          </div>
          <WalletIcon className="w-12 h-12 opacity-80" />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs opacity-80">Saldo Pendente</p>
            <p className="text-lg font-semibold">R$ {wallet.pendingBalance.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs opacity-80">Total Ganho</p>
            <p className="text-lg font-semibold">R$ {wallet.totalEarned.toFixed(2)}</p>
          </div>
        </div>

        <button
          onClick={() => setShowWithdrawModal(true)}
          disabled={wallet.balance < 10}
          className="w-full bg-white text-green-600 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <ArrowDownIcon className="w-5 h-5" />
          Solicitar Saque
        </button>
      </div>

      {/* Bank Accounts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <CreditCardIcon className="w-5 h-5 text-blue-600" />
            Contas Bancárias
          </h3>
          <button
            onClick={() => setShowAddAccount(!showAddAccount)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <PlusIcon className="w-4 h-4" />
            Adicionar Conta
          </button>
        </div>

        {showAddAccount && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Banco</label>
                <select
                  value={newAccount.bankCode}
                  onChange={(e) => setNewAccount({ ...newAccount, bankCode: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione o banco</option>
                  {BRAZILIAN_BANKS.map(bank => (
                    <option key={bank.code} value={bank.code}>{bank.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Conta</label>
                <select
                  value={newAccount.accountType}
                  onChange={(e) => setNewAccount({ ...newAccount, accountType: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="checking">Conta Corrente</option>
                  <option value="savings">Conta Poupança</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Agência</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newAccount.agencyNumber}
                    onChange={(e) => setNewAccount({ ...newAccount, agencyNumber: e.target.value })}
                    placeholder="0000"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={newAccount.agencyDigit}
                    onChange={(e) => setNewAccount({ ...newAccount, agencyDigit: e.target.value })}
                    placeholder="0"
                    maxLength={1}
                    className="w-16 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Conta</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newAccount.accountNumber}
                    onChange={(e) => setNewAccount({ ...newAccount, accountNumber: e.target.value })}
                    placeholder="00000000"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={newAccount.accountDigit}
                    onChange={(e) => setNewAccount({ ...newAccount, accountDigit: e.target.value })}
                    placeholder="0"
                    maxLength={1}
                    className="w-16 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Titular</label>
                <input
                  type="text"
                  value={newAccount.holderName}
                  onChange={(e) => setNewAccount({ ...newAccount, holderName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CPF/CNPJ</label>
                <input
                  type="text"
                  value={newAccount.holderDocument}
                  onChange={(e) => setNewAccount({ ...newAccount, holderDocument: e.target.value })}
                  placeholder="000.000.000-00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newAccount.isDefault}
                onChange={(e) => setNewAccount({ ...newAccount, isDefault: e.target.checked })}
                className="w-4 h-4 text-blue-600"
              />
              <label className="text-sm text-gray-700">Definir como conta padrão</label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddAccount}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Salvar Conta
              </button>
              <button
                onClick={() => setShowAddAccount(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {bankAccounts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Nenhuma conta bancária cadastrada</p>
        ) : (
          <div className="space-y-3">
            {bankAccounts.map((account) => (
              <div key={account.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{account.bankName}</p>
                    <p className="text-sm text-gray-600">
                      Ag: {account.agencyNumber}{account.agencyDigit && `-${account.agencyDigit}`} | 
                      Conta: {account.accountNumber}-{account.accountDigit}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{account.holderName}</p>
                  </div>
                  {account.isDefault && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                      Padrão
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Withdrawal History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico de Saques</h3>
        {withdrawals.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Nenhum saque realizado</p>
        ) : (
          <div className="space-y-3">
            {withdrawals.map((withdrawal) => (
              <div key={withdrawal.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">R$ {withdrawal.amount.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(withdrawal.requestedAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {withdrawal.status === 'pending' && (
                      <>
                        <ClockIcon className="w-5 h-5 text-yellow-500" />
                        <span className="text-sm font-medium text-yellow-700">Pendente</span>
                      </>
                    )}
                    {withdrawal.status === 'completed' && (
                      <>
                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-medium text-green-700">Concluído</span>
                      </>
                    )}
                    {withdrawal.status === 'failed' && (
                      <>
                        <XCircleIcon className="w-5 h-5 text-red-500" />
                        <span className="text-sm font-medium text-red-700">Falhou</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Solicitar Saque</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Valor</label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0.00"
                  min="10"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
                />
                <p className="text-xs text-gray-500 mt-1">Valor mínimo: R$ 10,00</p>
                <p className="text-xs text-gray-500">Saldo disponível: R$ {wallet.balance.toFixed(2)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Conta Bancária</label>
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione uma conta</option>
                  {bankAccounts.map(account => (
                    <option key={account.id} value={account.id}>
                      {account.bankName} - {account.accountNumber}-{account.accountDigit}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleWithdraw}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Confirmar Saque
                </button>
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
