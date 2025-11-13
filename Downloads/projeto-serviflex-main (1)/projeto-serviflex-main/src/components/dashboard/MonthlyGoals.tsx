import { TrophyIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../hooks/useAuth';

interface Goal {
  id: string;
  label: string;
  current: number;
  target: number;
  unit: string;
  color: string;
}

export function MonthlyGoals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 'earnings',
      label: 'Ganhos',
      current: 0,
      target: 5000,
      unit: 'R$',
      color: 'white'
    },
    {
      id: 'services',
      label: 'Serviços Realizados',
      current: 0,
      target: 25,
      unit: '',
      color: 'yellow-400'
    },
    {
      id: 'rating',
      label: 'Manter Avaliação',
      current: 0,
      target: 4.5,
      unit: '⭐',
      color: 'green-400'
    }
  ]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user) return;
    
    const loadGoals = async () => {
      try {
        setLoading(true);
        
        // Buscar perfil do profissional
        const providerDoc = await getDoc(doc(db, 'serviceProviders', user.uid));
        const providerData = providerDoc.data();
        const rating = providerData?.rating || 0;
        
        // Calcular início do mês
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        // Buscar serviços concluídos (sem filtro de data para evitar índice composto)
        const q = query(
          collection(db, 'serviceRequests'),
          where('professionalId', '==', user.uid),
          where('status', '==', 'completed')
        );
        
        const snapshot = await getDocs(q);
        
        let totalEarnings = 0;
        let totalServices = 0;
        
        // Filtrar por mês atual no client-side
        snapshot.docs.forEach(doc => {
          const data = doc.data();
          const completedAt = data.completedAt?.toDate();
          
          // Verificar se é do mês atual
          if (completedAt && completedAt >= startOfMonth) {
            totalEarnings += data.estimatedValue || 0;
            totalServices++;
          }
        });
        
        setGoals([
          {
            id: 'earnings',
            label: 'Ganhos',
            current: totalEarnings,
            target: 5000,
            unit: 'R$',
            color: 'white'
          },
          {
            id: 'services',
            label: 'Serviços Realizados',
            current: totalServices,
            target: 25,
            unit: '',
            color: 'yellow-400'
          },
          {
            id: 'rating',
            label: 'Manter Avaliação',
            current: rating,
            target: 4.5,
            unit: '⭐',
            color: 'green-400'
          }
        ]);
      } catch (error) {
        console.error('Erro ao carregar metas:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadGoals();
  }, [user]);

  const getProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getRemaining = (current: number, target: number, unit: string) => {
    const remaining = target - current;
    if (remaining <= 0) return null;
    return unit === 'R$' ? `R$ ${remaining.toFixed(0)}` : `${remaining}`;
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <div className="animate-pulse">
          <div className="h-6 bg-blue-500 rounded w-1/2 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-blue-500 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
      <div className="flex items-center gap-2 mb-4">
        <TrophyIcon className="w-6 h-6" />
        <h3 className="text-lg font-semibold">Metas do Mês</h3>
      </div>
      
      <div className="space-y-4">
        {goals.map((goal) => {
          const progress = getProgress(goal.current, goal.target);
          const remaining = getRemaining(goal.current, goal.target, goal.unit);
          const isCompleted = progress >= 100;
          
          return (
            <div key={goal.id}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">{goal.label}</span>
                <span className="text-sm font-bold">
                  {goal.unit === 'R$' && 'R$ '}
                  {goal.current.toFixed(goal.unit === '⭐' ? 1 : 0)}
                  {goal.unit !== 'R$' && goal.unit !== '' && ` ${goal.unit}`}
                  {' / '}
                  {goal.unit === 'R$' && 'R$ '}
                  {goal.target.toFixed(goal.unit === '⭐' ? 1 : 0)}
                  {goal.unit !== 'R$' && goal.unit !== '' && ` ${goal.unit}`}
                </span>
              </div>
              
              <div className="w-full bg-blue-800 rounded-full h-3 overflow-hidden">
                <div 
                  className={`bg-${goal.color} rounded-full h-3 transition-all duration-500`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              <p className="text-xs text-blue-200 mt-1">
                {isCompleted ? (
                  <span className="flex items-center gap-1">
                    ✅ Meta atingida!
                  </span>
                ) : (
                  `${progress.toFixed(0)}% concluído${remaining ? ` • Faltam ${remaining}` : ''}`
                )}
              </p>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 pt-6 border-t border-blue-500">
        <p className="text-sm text-blue-200 mb-2">Recompensa ao atingir todas as metas:</p>
        <div className="flex items-center gap-2">
          <TrophyIcon className="w-5 h-5 text-yellow-400" />
          <p className="text-sm font-bold">Badge "Profissional Destaque" + Destaque no site</p>
        </div>
      </div>
    </div>
  );
}
