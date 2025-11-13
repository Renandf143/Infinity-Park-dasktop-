import { DownloadIcon, FileTextIcon } from 'lucide-react';

export function TaxReports() {
  const reports = [
    { year: 2025, month: 'Novembro', revenue: 4200, taxes: 420, status: 'available' },
    { year: 2025, month: 'Outubro', revenue: 3800, taxes: 380, status: 'available' },
    { year: 2025, month: 'Setembro', revenue: 3600, taxes: 360, status: 'available' },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Relatórios Fiscais</h3>

      <div className="space-y-4">
        {reports.map((report, i) => (
          <div key={i} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileTextIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Relatório {report.month}/{report.year}</p>
                <p className="text-sm text-gray-600">
                  Receita: R$ {report.revenue.toLocaleString('pt-BR')} • 
                  Impostos: R$ {report.taxes.toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <DownloadIcon className="w-4 h-4" />
              Baixar PDF
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-900 font-medium mb-2">💡 Dica Fiscal</p>
        <p className="text-sm text-blue-700">
          Mantenha todos os comprovantes organizados para facilitar sua declaração de imposto de renda.
        </p>
      </div>
    </div>
  );
}
