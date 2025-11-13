import { useState, useEffect } from 'react';
import { DownloadIcon, FileTextIcon, PrinterIcon } from 'lucide-react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../hooks/useAuth';

interface Receipt {
  id: string;
  date: Date;
  amount: number;
  serviceType: string;
  clientName: string;
  status: 'paid' | 'pending';
}

export function PaymentReceipts() {
  const { user } = useAuth();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadReceipts = async () => {
      try {
        const q = query(
          collection(db, 'serviceRequests'),
          where('professionalId', '==', user.uid),
          where('status', '==', 'completed'),
          orderBy('completedAt', 'desc')
        );

        const snapshot = await getDocs(q);
        const receiptsList: Receipt[] = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            date: data.completedAt?.toDate() || new Date(),
            amount: data.estimatedValue || 0,
            serviceType: data.serviceType,
            clientName: data.clientName,
            status: 'paid'
          };
        });

        setReceipts(receiptsList);
      } catch (error) {
        console.error('Erro ao carregar comprovantes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReceipts();
  }, [user]);

  const downloadPDF = (receipt: Receipt) => {
    // TODO: Implementar geração de PDF
    alert(`Gerando PDF do comprovante #${receipt.id}`);
  };

  const printReceipt = (receipt: Receipt) => {
    // TODO: Implementar impressão
    alert(`Imprimindo comprovante #${receipt.id}`);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Comprovantes de Pagamento</h3>

      <div className="space-y-4">
        {receipts.map(receipt => (
          <div key={receipt.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileTextIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Comprovante #{receipt.id.slice(0, 8)}</p>
                <p className="text-sm text-gray-600">{receipt.serviceType} - {receipt.clientName}</p>
                <p className="text-xs text-gray-500">{receipt.date.toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right mr-4">
                <p className="text-lg font-bold text-gray-900">
                  R$ {receipt.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                  Pago
                </span>
              </div>
              <button
                onClick={() => downloadPDF(receipt)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Baixar PDF"
              >
                <DownloadIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => printReceipt(receipt)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Imprimir"
              >
                <PrinterIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
