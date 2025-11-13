import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc, 
  getDocs,
  query, 
  where,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import { EscrowPayment, PaymentConfig, PaymentMethod, PaymentStatus } from '../types/payment';

const ESCROW_COLLECTION = 'escrowPayments';
const CONFIG: PaymentConfig = {
  platformFeePercentage: 10,  // 10% de taxa
  autoReleaseDays: 7,         // Libera automaticamente após 7 dias
  minAmount: 10,
  maxAmount: 50000
};

class EscrowService {
  // Criar pagamento em custódia
  async createEscrowPayment(
    serviceRequestId: string,
    clientId: string,
    professionalId: string,
    amount: number,
    paymentMethod: PaymentMethod
  ): Promise<string> {
    const platformFeeAmount = (amount * CONFIG.platformFeePercentage) / 100;
    const professionalAmount = amount - platformFeeAmount;
    
    const autoReleaseDate = new Date();
    autoReleaseDate.setDate(autoReleaseDate.getDate() + CONFIG.autoReleaseDays);

    const payment: Omit<EscrowPayment, 'id'> = {
      serviceRequestId,
      clientId,
      professionalId,
      amount,
      platformFee: CONFIG.platformFeePercentage,
      platformFeeAmount,
      professionalAmount,
      status: 'pending',
      paymentMethod,
      autoReleaseDate,
      serviceCompletedByProfessional: false,
      serviceCompletedByClient: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await addDoc(collection(db, ESCROW_COLLECTION), {
      ...payment,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      autoReleaseDate: Timestamp.fromDate(autoReleaseDate)
    });

    return docRef.id;
  }

  // Confirmar pagamento (cliente pagou)
  async confirmPayment(paymentId: string, transactionId: string): Promise<void> {
    const paymentRef = doc(db, ESCROW_COLLECTION, paymentId);
    
    await updateDoc(paymentRef, {
      status: 'held_in_escrow',
      transactionId,
      paidAt: serverTimestamp(),
      heldAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }

  // Profissional confirma conclusão do serviço
  async professionalConfirmCompletion(paymentId: string): Promise<void> {
    const paymentRef = doc(db, ESCROW_COLLECTION, paymentId);
    const paymentDoc = await getDoc(paymentRef);
    
    if (!paymentDoc.exists()) {
      throw new Error('Pagamento não encontrado');
    }

    const payment = paymentDoc.data() as EscrowPayment;
    
    await updateDoc(paymentRef, {
      serviceCompletedByProfessional: true,
      updatedAt: serverTimestamp()
    });

    // Se cliente também confirmou, libera automaticamente
    if (payment.serviceCompletedByClient) {
      await this.releasePayment(paymentId);
    }
  }

  // Cliente confirma conclusão do serviço
  async clientConfirmCompletion(paymentId: string): Promise<void> {
    const paymentRef = doc(db, ESCROW_COLLECTION, paymentId);
    const paymentDoc = await getDoc(paymentRef);
    
    if (!paymentDoc.exists()) {
      throw new Error('Pagamento não encontrado');
    }

    const payment = paymentDoc.data() as EscrowPayment;
    
    await updateDoc(paymentRef, {
      serviceCompletedByClient: true,
      updatedAt: serverTimestamp()
    });

    // Se profissional também confirmou, libera automaticamente
    if (payment.serviceCompletedByProfessional) {
      await this.releasePayment(paymentId);
    }
  }

  // Liberar pagamento para o profissional
  async releasePayment(paymentId: string): Promise<void> {
    const paymentRef = doc(db, ESCROW_COLLECTION, paymentId);
    
    await updateDoc(paymentRef, {
      status: 'released',
      releasedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }

  // Reembolsar cliente
  async refundPayment(paymentId: string, reason: string): Promise<void> {
    const paymentRef = doc(db, ESCROW_COLLECTION, paymentId);
    
    await updateDoc(paymentRef, {
      status: 'refunded',
      refundedAt: serverTimestamp(),
      refundReason: reason,
      updatedAt: serverTimestamp()
    });
  }

  // Buscar pagamento por ID
  async getPaymentById(paymentId: string): Promise<EscrowPayment | null> {
    const paymentDoc = await getDoc(doc(db, ESCROW_COLLECTION, paymentId));
    
    if (!paymentDoc.exists()) {
      return null;
    }

    return {
      id: paymentDoc.id,
      ...paymentDoc.data()
    } as EscrowPayment;
  }

  // Buscar pagamentos do cliente
  async getClientPayments(clientId: string): Promise<EscrowPayment[]> {
    const q = query(
      collection(db, ESCROW_COLLECTION),
      where('clientId', '==', clientId)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as EscrowPayment));
  }

  // Buscar pagamentos do profissional
  async getProfessionalPayments(professionalId: string): Promise<EscrowPayment[]> {
    const q = query(
      collection(db, ESCROW_COLLECTION),
      where('professionalId', '==', professionalId)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as EscrowPayment));
  }

  // Buscar pagamentos em custódia que devem ser liberados automaticamente
  async getPaymentsForAutoRelease(): Promise<EscrowPayment[]> {
    const now = new Date();
    const q = query(
      collection(db, ESCROW_COLLECTION),
      where('status', '==', 'held_in_escrow'),
      where('autoReleaseDate', '<=', Timestamp.fromDate(now))
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as EscrowPayment));
  }

  // Obter configuração
  getConfig(): PaymentConfig {
    return CONFIG;
  }
}

export const escrowService = new EscrowService();
