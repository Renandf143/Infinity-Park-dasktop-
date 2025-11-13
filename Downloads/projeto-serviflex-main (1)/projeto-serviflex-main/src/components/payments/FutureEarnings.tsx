import { useState, useEffect } from 'react';
import { CalendarIcon, TrendingUpIcon } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../hooks/useAuth';

export function FutureEarnings() {
  const { user } = useAuth();
  const [futureEarnings, setFutureEarnings] = useState(0);
  const [scheduledServices, setScheduledServices] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadFutureEarnings = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        
        const q = query(
          collection(db, 'serviceRequests'),
          where('professionalId', '==', user.uid),
          where('status', 'in', ['accepted', 'in_progress']),
          where('date', '>=', today)
        );

        const snapshot = await getDocs(q);
        
        let total = 0;
        snapshot.docs.forEach(doc => {
          total += doc.data().estimatedValue || 0;
        });

        setFutureEarnings(total);
        setScheduledServices(snapshot.size);
      } catch (error) {
        console.error('Erro ao carregar ganhos futuros:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFutureEarnings();
  }, [user]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <div className="animate-pulse">
          <div className="h-6 bg-blue-500 rounded w-1/2 mb-4"></div>
          <div className="h-12 bg-blue-500 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
      <div className="flex items-center gap-2 mb-4">
        <CalendarIcon className="w-6 h-6" />
        <h3 className="text-lg font-semibold">Previsão de Ganhos</h3>
      </div>

      <div className="mb-6">
        <p className="text-sm text-blue-200 mb-2">Serviços Agendados</p>
        <p className="text-4xl font-bold">
          R$ {futureEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <TrendingUpIcon className="w-4 h-4 text-green-300" />
          <p className="text-sm text-blue-200">
            {scheduledServices} serviços confirmados
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-500">
        <div>
          <p className="text-sm text-blue-200 mb-1">Esta Semana</p>
          <p className="text-xl font-bold">R$ {(futureEarnings * 0.3).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        <div>
          <p className="text-sm text-blue-200 mb-1">Este Mês</p>
          <p className="text-xl font-bold">R$ {futureEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>
    </div>
  );
}
