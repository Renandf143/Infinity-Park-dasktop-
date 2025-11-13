import { doc, updateDoc, Timestamp, addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';

export interface PixPaymentData {
  amount: number;
  professionalId: string;
  professionalName: string;
  serviceId: string;
}

export const paymentService = {
  /**
   * Gera um código PIX para pagamento
   * Em produção, isso seria integrado com Mercado Pago, PagSeguro, etc.
   */
  async generatePixPayment(data: PixPaymentData): Promise<{ qrCode: string; copyPaste: string }> {
    // Simulação de geração de PIX
    // Em produção, você faria uma chamada para a API do provedor de pagamento
    
    const pixKey = data.professionalId; // Chave PIX do profissional
    const amount = data.amount.toFixed(2);
    
    // Formato EMV do PIX (simplificado para demonstração)
    const pixCode = `00020126580014br.gov.bcb.pix0136${pixKey}520400005303986540${amount}5802BR5925${data.professionalName.substring(0, 25).padEnd(25, ' ')}6009SAO PAULO62070503***6304`;
    
    return {
      qrCode: pixCode,
      copyPaste: pixCode,
    };
  },

  /**
   * Simula o processamento de um pagamento PIX
   * Em produção, isso seria um webhook do provedor de pagamento
   */
  async simulatePixPayment(serviceId: string, clientId: string): Promise<void> {
    try {
      const serviceRef = doc(db, 'services', serviceId);
      
      // Atualizar status do serviço
      await updateDoc(serviceRef, {
        paymentStatus: 'paid',
        status: 'completed',
        paidAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      // Criar notificação para o profissional
      const serviceDoc = await (await import('firebase/firestore')).getDoc(serviceRef);
      const serviceData = serviceDoc.data();
      
      if (serviceData) {
        await addDoc(collection(db, 'notifications'), {
          userId: serviceData.professionalId,
          type: 'payment_received',
          title: 'Pagamento Recebido! 💰',
          message: `Você recebeu R$ ${serviceData.price.toFixed(2)} pelo serviço concluído`,
          serviceId,
          read: false,
          createdAt: Timestamp.now(),
        });

        // Criar notificação para o cliente
        await addDoc(collection(db, 'notifications'), {
          userId: clientId,
          type: 'payment_confirmed',
          title: 'Pagamento Confirmado! ✅',
          message: 'Seu pagamento foi confirmado com sucesso',
          serviceId,
          read: false,
          createdAt: Timestamp.now(),
        });
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      throw error;
    }
  },

  /**
   * Verifica o status de um pagamento
   */
  async checkPaymentStatus(serviceId: string): Promise<'pending' | 'paid' | 'failed'> {
    try {
      const serviceRef = doc(db, 'services', serviceId);
      const serviceDoc = await (await import('firebase/firestore')).getDoc(serviceRef);
      
      if (serviceDoc.exists()) {
        return serviceDoc.data().paymentStatus || 'pending';
      }
      
      return 'pending';
    } catch (error) {
      console.error('Erro ao verificar status do pagamento:', error);
      return 'failed';
    }
  },

  /**
   * Calcula o valor do serviço baseado no tempo
   */
  calculateServicePrice(durationMinutes: number, hourlyRate: number): number {
    const hours = durationMinutes / 60;
    return Math.ceil(hours * hourlyRate * 100) / 100; // Arredondar para 2 casas decimais
  },
};
