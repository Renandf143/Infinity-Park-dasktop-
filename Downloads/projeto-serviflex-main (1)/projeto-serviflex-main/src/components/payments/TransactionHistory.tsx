import { useState, useEffect } from 'react';
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  FilterIcon,
  DownloadIcon,
  SearchIcon
} from 'lucide-react';
import { collection, query, where, getDocs, orderBy, limit as firestoreLimit } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../hooks/useAuth';

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: Date;
  status: 'completed' | 'pending' | 'failed';
  category: string;
  reference?: string;
}

interface TransactionHistoryProps {
  limit?: number;
}

export function TransactionHistory({ limit: limitProp }: TransactionHistoryProps) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'credit' | 'debit'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user) return;

    const loadTransactions = async () => {
      try {
        setLoading(true);

        // Buscar serviços concluídos (créditos)
        const servicesQuery = query(
          collection(db, 'serviceRequests'),
          where('professionalId', '==', user.uid),
          where('status', '==', 'completed'),
          orderBy('completedAt', 'desc'),
          ...(limitProp ? [firestoreLimit(limitProp)] : [])
        );

        const servicesSnapshot = await getDocs(servicesQuery);
        
        const transactionsList: Transaction[] = [];

        // Adicionar serviços como créditos
        servicesSnapshot.docs.forEach(doc => {
          const data = doc.data();
          transactionsList.push({
            id: doc.id,
            type: 'credit',
            amount: data.estimatedValue || 0,
            description: `Serviço: ${data.serviceType}`,
            date: data.completedAt?.toDate() || new Date(),
            status: 'completed',
            category: 'Serviço',
            reference: doc.id
          });

          // Taxa da plataforma como débito
          transactionsList.push({
            id: `${doc.id}-fee`,
            type: 'debit',
            amount: (data.estimatedValue || 0) * 0.10,
            description: 'Taxa da Plataforma (10%)',
            date: data.completedAt?.toDate() || new Date(),
            status: 'completed',
            category: 'Taxa',
            reference: doc.id
          });
        });

        // Ordenar por data
        transactionsList.sort((a, b) => b.date.getTime() - a.date.getTime());

        setTransactions(transactionsList);
      } catch (error) {
        console.error('Erro ao carregar transações:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [user, limitProp]);

  const filteredTransactions = transactions.filter(t => {
    if (filter !== 'all' && t.type !== filter) return false;
    if (searchTerm && !t.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const totalCredit = transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
  const totalDebit = transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalCredit - totalDebit;

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {limitProp ? 'Transações Recentes' : 'Histórico de Transações'}
        </h3>
        {!limitProp && (
          <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <DownloadIcon className="w-4 h-4" />
            Exportar
          </button>
        )}
      </div>

      {/* Resumo */}
      {!limitProp && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total Recebido</p>
            <p className="text-2xl font-bold text-green-600">
              R$ {totalCredit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total Taxas</p>
            <p className="text-2xl font-bold text-red-600">
              R$ {totalDebit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Saldo</p>
            <p className="text-2xl font-bold text-blue-600">
              R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      )}

      {/* Filtros */}
      {!limitProp && (
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar transação..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todas</option>
            <option value="credit">Créditos</option>
            <option value="debit">Débitos</option>
          </select>
        </div>
      )}

      {/* Lista de Transações */}
      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Nenhuma transação encontrada</p>
        ) : (
          filteredTransactions.map(transaction => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {transaction.type === 'credit' ? (
                    <ArrowDownIcon className="w-5 h-5 text-green-600" />
                  ) : (
                    <ArrowUpIcon className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-sm text-gray-600">
                    {transaction.date.toLocaleDateString('pt-BR')} • {transaction.category}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${
                  transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'credit' ? '+' : '-'} R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  transaction.status === 'completed' ? 'bg-green-100 text-green-700' :
                  transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {transaction.status === 'completed' ? 'Concluído' :
                   transaction.status === 'pending' ? 'Pendente' : 'Falhou'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {limitProp && transactions.length > 0 && (
        <button className="w-full mt-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors">
          Ver Todas as Transações
        </button>
      )}
    </div>
  );
}
