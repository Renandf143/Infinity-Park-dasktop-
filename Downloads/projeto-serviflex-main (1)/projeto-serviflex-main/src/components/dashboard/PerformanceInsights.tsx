import { AlertCircleIcon, CheckIcon, TrophyIcon, TrendingUpIcon, TrendingDownIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../hooks/useAuth';

export function PerformanceInsights() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    acceptanceRate: 0,
    avgResponseTime: 0,
    completionRate: 0,
    portfolioPhotos: 0
  });

  useEffect(() => {
    if (!user) return;

    const loadMetrics = async () => {
      try {
        setLoading(true);

        // Buscar todas as solicitações
        const allRequestsQuery = query(
          collection(db, 'serviceRequests'),
          where('professionalId', '==', user.uid)
        );
        const allSnapshot = await getDocs(allRequestsQuery);
        
        let totalRequests = 0;
        let acceptedRequests = 0;
        let rejectedRequests = 0;
        let completedRequests = 0;
        let totalResponseTime = 0;
        let requestsWithResponse = 0;

        allSnapshot.docs.forEach(docSnap => {
          const data = docSnap.data();
          
          // Contar apenas solicitações que não estão pendentes (foram respondidas)
          if (data.status !== 'pending') {
            totalRequests++;
          }

          if (data.status === 'accepted' || data.status === 'in_progress' || data.status === 'completed') {
            acceptedRequests++;
          }

          if (data.status === 'rejected') {
            rejectedRequests++;
          }

          if (data.status === 'completed') {
            completedRequests++;
          }

          // Calcular tempo de resposta (apenas para solicitações respondidas)
          if (data.respondedAt && data.createdAt) {
            const responseTime = (data.respondedAt.toMillis() - data.createdAt.toMillis()) / 1000 / 60; // minutos
            totalResponseTime += responseTime;
            requestsWithResponse++;
          }
        });

        // Buscar fotos do portfólio
        const providerDoc = await getDoc(doc(db, 'serviceProviders', user.uid));
        const portfolioPhotos = providerDoc.data()?.portfolio?.length || 0;

        // Calcular métricas
        const acceptanceRate = totalRequests > 0 ? (acceptedRequests / totalRequests) * 100 : 100;
        const avgResponseTime = requestsWithResponse > 0 ? totalResponseTime / requestsWithResponse : 0;
        const completionRate = acceptedRequests > 0 ? (completedRequests / acceptedRequests) * 100 : 0;

        setMetrics({
          acceptanceRate,
          avgResponseTime,
          completionRate,
          portfolioPhotos
        });
      } catch (error) {
        console.error('Erro ao carregar métricas:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, [user]);

  // Média do mercado (pode vir de uma collection separada)
  const marketAverage = {
    acceptanceRate: 75,
    avgResponseTime: 45,
    completionRate: 85
  };

  const displayMetrics = [
    {
      label: 'Taxa de Aceitação',
      value: `${metrics.acceptanceRate.toFixed(0)}%`,
      comparison: metrics.acceptanceRate > 0 
        ? `${Math.abs(metrics.acceptanceRate - marketAverage.acceptanceRate).toFixed(0)}% vs média`
        : 'Sem dados ainda',
      isPositive: metrics.acceptanceRate >= marketAverage.acceptanceRate
    },
    {
      label: 'Tempo de Resposta',
      value: metrics.avgResponseTime > 0 ? `${metrics.avgResponseTime.toFixed(0)}min` : '0min',
      comparison: metrics.avgResponseTime > 0
        ? `${Math.abs(marketAverage.avgResponseTime - metrics.avgResponseTime).toFixed(0)}min vs média`
        : 'Sem dados ainda',
      isPositive: metrics.avgResponseTime > 0 ? metrics.avgResponseTime <= marketAverage.avgResponseTime : true
    }
  ];

  // Insights dinâmicos baseados nos dados reais
  const generateInsights = () => {
    const insights = [];

    // Insight sobre tempo de resposta
    if (metrics.avgResponseTime === 0) {
      insights.push({
        type: 'info',
        icon: AlertCircleIcon,
        title: 'Comece a responder solicitações',
        message: 'Aceite ou recuse solicitações para começar a medir seu tempo de resposta. Profissionais que respondem rápido têm 35% mais contratações',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-500',
        iconColor: 'text-blue-600'
      });
    } else if (metrics.avgResponseTime > 30) {
      insights.push({
        type: 'warning',
        icon: AlertCircleIcon,
        title: 'Oportunidade de Melhoria',
        message: `Seu tempo de resposta (${metrics.avgResponseTime.toFixed(0)}min) está acima da média. Profissionais que respondem em até 10min têm 35% mais contratações`,
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-500',
        iconColor: 'text-yellow-600'
      });
    } else {
      insights.push({
        type: 'success',
        icon: CheckIcon,
        title: 'Excelente tempo de resposta!',
        message: `Você responde em média em ${metrics.avgResponseTime.toFixed(0)}min. Continue assim!`,
        bgColor: 'bg-green-50',
        borderColor: 'border-green-500',
        iconColor: 'text-green-600'
      });
    }

    // Insight sobre taxa de conclusão
    if (metrics.completionRate === 0) {
      insights.push({
        type: 'info',
        icon: AlertCircleIcon,
        title: 'Comece a concluir serviços',
        message: 'Aceite solicitações e conclua os serviços para melhorar sua taxa de conclusão e reputação',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-500',
        iconColor: 'text-blue-600'
      });
    } else if (metrics.completionRate >= marketAverage.completionRate) {
      insights.push({
        type: 'success',
        icon: CheckIcon,
        title: 'Você está indo bem!',
        message: `Sua taxa de conclusão (${metrics.completionRate.toFixed(0)}%) está acima da média (${marketAverage.completionRate}%)`,
        bgColor: 'bg-green-50',
        borderColor: 'border-green-500',
        iconColor: 'text-green-600'
      });
    } else {
      insights.push({
        type: 'warning',
        icon: AlertCircleIcon,
        title: 'Atenção à taxa de conclusão',
        message: `Sua taxa de conclusão (${metrics.completionRate.toFixed(0)}%) está abaixo da média. Tente concluir todos os serviços aceitos`,
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-500',
        iconColor: 'text-yellow-600'
      });
    }

    // Insight sobre portfólio
    if (metrics.portfolioPhotos < 5) {
      insights.push({
        type: 'tip',
        icon: TrophyIcon,
        title: 'Dica Pro',
        message: `Você tem ${metrics.portfolioPhotos} foto${metrics.portfolioPhotos !== 1 ? 's' : ''} no portfólio. Adicione mais fotos do seu trabalho para aumentar contratações em 40%`,
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-500',
        iconColor: 'text-blue-600'
      });
    } else {
      insights.push({
        type: 'success',
        icon: TrophyIcon,
        title: 'Ótimo portfólio!',
        message: `Você tem ${metrics.portfolioPhotos} fotos no portfólio. Profissionais com portfólio completo têm mais contratações`,
        bgColor: 'bg-green-50',
        borderColor: 'border-green-500',
        iconColor: 'text-green-600'
      });
    }

    return insights;
  };

  const insights = generateInsights();

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Análise de Performance</h3>
      
      {/* Métricas */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {displayMetrics.map((metric, i) => (
          <div key={i} className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-600">{metric.value}</p>
            <p className="text-sm text-gray-600 mt-1">{metric.label}</p>
            <div className="flex items-center justify-center gap-1 mt-1">
              {metric.isPositive ? (
                <TrendingUpIcon className="w-3 h-3 text-green-600" />
              ) : (
                <TrendingDownIcon className="w-3 h-3 text-red-600" />
              )}
              <p className={`text-xs ${metric.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {metric.comparison}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Insights Acionáveis */}
      <div className="space-y-3">
        {insights.map((insight, i) => (
          <div 
            key={i}
            className={`flex items-start gap-3 p-3 ${insight.bgColor} border-l-4 ${insight.borderColor} rounded`}
          >
            <insight.icon className={`w-5 h-5 ${insight.iconColor} flex-shrink-0 mt-0.5`} />
            <div>
              <p className="text-sm font-semibold text-gray-900">{insight.title}</p>
              <p className="text-xs text-gray-600 mt-1">{insight.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
