import { TrendingUpIcon } from 'lucide-react';

export function RevenueChart() {
  // Dados de exemplo - integrar com dados reais
  const data = [
    { month: 'Jan', revenue: 2400, expenses: 400 },
    { month: 'Fev', revenue: 3200, expenses: 500 },
    { month: 'Mar', revenue: 2800, expenses: 450 },
    { month: 'Abr', revenue: 3800, expenses: 600 },
    { month: 'Mai', revenue: 4200, expenses: 650 },
    { month: 'Jun', revenue: 3600, expenses: 550 },
  ];

  const maxValue = Math.max(...data.map(d => Math.max(d.revenue, d.expenses)));

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Receita vs Despesas</h3>
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <option>Últimos 6 meses</option>
          <option>Últimos 12 meses</option>
          <option>Este ano</option>
        </select>
      </div>

      {/* Gráfico Simples */}
      <div className="h-64 flex items-end justify-between gap-4">
        {data.map((item, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full flex gap-1">
              <div
                className="flex-1 bg-gradient-to-t from-green-600 to-green-400 rounded-t"
                style={{ height: `${(item.revenue / maxValue) * 200}px` }}
                title={`Receita: R$ ${item.revenue}`}
              />
              <div
                className="flex-1 bg-gradient-to-t from-red-600 to-red-400 rounded-t"
                style={{ height: `${(item.expenses / maxValue) * 200}px` }}
                title={`Despesas: R$ ${item.expenses}`}
              />
            </div>
            <span className="text-xs text-gray-600 font-medium">{item.month}</span>
          </div>
        ))}
      </div>

      {/* Legenda */}
      <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-sm text-gray-600">Receita</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-sm text-gray-600">Despesas</span>
        </div>
      </div>
    </div>
  );
}
