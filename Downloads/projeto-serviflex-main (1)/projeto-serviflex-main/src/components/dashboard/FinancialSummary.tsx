import { TrendingUpIcon, DollarSignIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../hooks/useAuth';

export function FinancialSummary() {
  const { user } = useAuth();
  const [financial, setFinancial] = useState({
    totalEarned: 0,
    platformFee: 0,
    tips: 0,
    bonus: 0,
    available: 0,
    percentageChange: 0
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user) return;
    
    const loadFinancial = async () => {
      try {
        setLoading(true);
        
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
        
        console.log('📊 FinancialSummary - Total de serviços concluídos:', snapshot.size);
        
        let totalEarned = 0;
        let tips = 0;
        let servicesThisMonth = 0;
        
        // Filtrar por data no client-side
        snapshot.docs.forEach(doc => {
          const data = doc.data();
          const completedAt = data.completedAt?.toDate();
          
          console.log('📊 Serviço:', {
            id: doc.id,
            value: data.estimatedValue,
            completedAt: completedAt,
            isThisMonth: completedAt && completedAt >= startOfMonth
          });
          
          // Verificar se é do mês atual
          if (completedAt && completedAt >= startOfMonth) {
            totalEarned += data.estimatedValue || 0;
            tips += data.tip || 0;
            servicesThisMonth++;
          }
        });
        
        console.log('📊 Resumo:', {
          servicesThisMonth,
          totalEarned,
          tips
        });
        
        const platformFee = totalEarned * 0.15; // 15% de taxa
        const bonus = totalEarned >= 5000 ? 200 : 0; // Bônus se atingir meta
        const available = totalEarned - platformFee + tips + bonus;
        
        setFinancial({
          totalEarned,
          platformFee,
          tips,
          bonus,
          available,
          percentageChange: 23 // Calcular comparação com mês anterior
        });
      } catch (error) {
        console.error('Erro ao carregar resumo financeiro:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadFinancial();
  }, [user]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-4">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo Financeiro</h3>
      
      <div className="space-y-4">
        {/* Total Ganho */}
        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <TrendingUpIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Ganho (Mês)</p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {financial.totalEarned.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
          <span className="text-green-600 font-semibold">+{financial.percentageChange}%</span>
        </div>
        
        {/* Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Serviços Concluídos</span>
            <span className="font-semibold text-gray-900">
              R$ {financial.totalEarned.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Taxa da Plataforma (15%)</span>
            <span className="font-semibold text-red-600">
              - R$ {financial.platformFee.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Gorjetas</span>
            <span className="font-semibold text-green-600">
              + R$ {financial.tips.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Bônus de Performance</span>
            <span className="font-semibold text-blue-600">
              + R$ {financial.bonus.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          
          <div className="pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900">Disponível para Saque</span>
              <span className="text-xl font-bold text-green-600">
                R$ {financial.available.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
        
        <button className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
          <DollarSignIcon className="w-5 h-5" />
          Solicitar Saque
        </button>
      </div>
    </div>
  );
}
