import { useState } from 'react';
import { X, Shield, CreditCard, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';
import { escrowService } from '../services/escrowService';
import { PaymentMethod } from '../types/payment';

interface EscrowPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceRequestId: string;
  professionalId: string;
  professionalName: string;
  amount: number;
  clientId: string;
  onPaymentSuccess: (paymentId: string) => void;
}

export function EscrowPaymentModal({
  isOpen,
  onClose,
  serviceRequestId,
  professionalId,
  professionalName,
  amount,
  clientId,
  onPaymentSuccess
}: EscrowPaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'method' | 'confirm' | 'success'>('method');

  if (!isOpen) return null;

  const config = escrowService.getConfig();
  const platformFee = (amount * config.platformFeePercentage) / 100;
  const professionalAmount = amount - platformFee;

  const handlePayment = async () => {
    setLoading(true);
    try {
      const paymentId = await escrowService.createEscrowPayment(
        serviceRequestId,
        clientId,
        professionalId,
        amount,
        paymentMethod
      );

      // Simular confirmação de pagamento (em produção, integrar com gateway)
      await escrowService.confirmPayment(paymentId, `TXN-${Date.now()}`);
      
      setStep('success');
      setTimeout(() => {
        onPaymentSuccess(paymentId);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold">Pagamento Seguro</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {step === 'method' && (
            <>
              {/* Info do Serviço */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-700 mb-1">Você está contratando:</p>
                <p className="font-bold text-blue-900">{professionalName}</p>
              </div>

              {/* Detalhes do Pagamento */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Valor do serviço</span>
                  <span className="font-medium">R$ {amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Taxa da plataforma ({config.platformFeePercentage}%)</span>
                  <span className="font-medium text-orange-600">- R$ {platformFee.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-semibold">Profissional receberá</span>
                  <span className="font-bold text-green-600">R$ {professionalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Como Funciona */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex gap-2 mb-2">
                  <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <h3 className="font-semibold text-green-900">Sistema de Custódia</h3>
                </div>
                <ul className="text-sm text-green-800 space-y-1 ml-7">
                  <li>• Seu pagamento fica retido com segurança</li>
                  <li>• O profissional só recebe após conclusão</li>
                  <li>• Você confirma quando o serviço for concluído</li>
                  <li>• Liberação automática em {config.autoReleaseDays} dias</li>
                </ul>
              </div>

              {/* Método de Pagamento */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Método de Pagamento
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'pix', label: 'PIX', icon: '💳' },
                    { value: 'credit_card', label: 'Cartão de Crédito', icon: '💳' },
                    { value: 'debit_card', label: 'Cartão de Débito', icon: '💳' },
                  ].map((method) => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => setPaymentMethod(method.value as PaymentMethod)}
                      className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                        paymentMethod === method.value
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{method.icon}</span>
                        <span className="font-medium">{method.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setStep('confirm')}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Continuar
              </button>
            </>
          )}

          {step === 'confirm' && (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Confirmar Pagamento</h3>
                <p className="text-gray-600">
                  Você está prestes a pagar R$ {amount.toFixed(2)}
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-semibold mb-1">Importante:</p>
                    <p>O valor ficará retido em custódia até a conclusão do serviço. Você terá {config.autoReleaseDays} dias para confirmar.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('method')}
                  disabled={loading}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Voltar
                </button>
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Processando...' : 'Confirmar Pagamento'}
                </button>
              </div>
            </>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-900 mb-2">
                Pagamento Confirmado!
              </h3>
              <p className="text-gray-600 mb-4">
                Seu pagamento está seguro em custódia
              </p>
              <p className="text-sm text-gray-500">
                O profissional foi notificado e entrará em contato
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
