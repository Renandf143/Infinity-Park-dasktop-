import { TrendingUpIcon, TrendingDownIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../hooks/useAuth';

interface EarningsData {
  day: string;
  earnings: number;
}

export function EarningsChart() {
  const { user } = useAuth();
  const [period, setPeriod] = useState('7days');
  const [earningsData, setEarningsData] = useState<EarningsData[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user) return;
    
    const loadEarnings = async () => {
      try {
        setLoading(true);
        const today = new Date();
        const last7Days = new Date(today);
        last7Days.setDate(today.getDate() - 7);
        
        // Buscar serviços concluídos (sem filtro de data para evitar índice composto)
        const q = query(
          collection(db, 'serviceRequests'),
          where('professionalId', '==', user.uid),
          where('status', '==', 'completed')
        );
        
        const snapshot = await getDocs(q);
        
        // Agrupar por dia da semana
        const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        const earningsByDay: { [key: string]: number } = {};
        
        // Inicializar todos os dias com 0
        for (let i = 0; i < 7; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() - (6 - i));
          const dayName = dayNames[date.getDay()];
          earningsByDay[dayName] = 0;
        }
        
        // Somar ganhos por dia (filtrar últimos 7 dias no client-side)
        snapshot.docs.forEach(doc => {
          const data = doc.data();
          const completedDate = data.completedAt?.toDate();
          
          // Verificar se está nos últimos 7 dias
          if (completedDate && completedDate >= last7Days) {
            const dayName = dayNames[completedDate.getDay()];
            earningsByDay[dayName] += data.estimatedValue || 0;
          }
        });
        
        // Converter para array na ordem correta
        const dataArray: EarningsData[] = [];
        for (let i = 0; i < 7; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() - (6 - i));
          const dayName = dayNames[date.getDay()];
          dataArray.push({
            day: dayName,
            earnings: earningsByDay[dayName] || 0
          });
        }
        
        setEarningsData(dataArray);
      } catch (error) {
        console.error('Erro ao carregar ganhos:', error);
        // Dados de fallback
        setEarningsData([
          { day: 'Seg', earnings: 0 },
          { day: 'Ter', earnings: 0 },
          { day: 'Qua', earnings: 0 },
          { day: 'Qui', earnings: 0 },
          { day: 'Sex', earnings: 0 },
          { day: 'Sáb', earnings: 0 },
          { day: 'Dom', earnings: 0 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    loadEarnings();
  }, [user, period]);

  const maxEarnings = Math.max(...earningsData.map(d => d.earnings), 1);
  const totalWeek = earningsData.reduce((sum, d) => sum + d.earnings, 0);
  const avgDaily = earningsData.length > 0 ? totalWeek / earningsData.length : 0;
  const bestDay = Math.max(...earningsData.map(d => d.earnings), 0);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Ganhos dos Últimos 7 Dias</h3>
        <select 
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="7days">Últimos 7 dias</option>
          <option value="30days">Últimos 30 dias</option>
          <option value="3months">Últimos 3 meses</option>
        </select>
      </div>
      
      {/* Gráfico de Barras Simples */}
      <div className="h-64 flex items-end justify-between gap-2 mb-6">
        {earningsData.map((data, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div className="relative w-full group">
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                R$ {data.earnings.toFixed(2)}
              </div>
              
              {/* Barra */}
              <div 
                className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg hover:from-blue-700 hover:to-blue-500 transition-all cursor-pointer"
                style={{ height: `${(data.earnings / maxEarnings) * 100}%`, minHeight: '20px' }}
              />
            </div>
            <span className="text-xs text-gray-600 font-medium">{data.day}</span>
          </div>
        ))}
      </div>
      
      {/* Estatísticas */}
      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
        <div>
          <p className="text-sm text-gray-600 mb-1">Média Diária</p>
          <p className="text-xl font-bold text-gray-900">R$ {avgDaily.toFixed(0)}</p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUpIcon className="w-3 h-3 text-green-600" />
            <span className="text-xs text-green-600">+12%</span>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Melhor Dia</p>
          <p className="text-xl font-bold text-green-600">R$ {bestDay.toFixed(0)}</p>
          <p className="text-xs text-gray-500 mt-1">Sábado</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Total Semana</p>
          <p className="text-xl font-bold text-blue-600">R$ {totalWeek.toFixed(0)}</p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUpIcon className="w-3 h-3 text-green-600" />
            <span className="text-xs text-green-600">+23%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
