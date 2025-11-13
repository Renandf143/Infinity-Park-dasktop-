import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  increment,
} from 'firebase/firestore';
import { db } from '../firebase';
import { ServicePackage, ServiceOrder } from '../types/servicePackage';

class ServicePackageService {
  // Criar pacote de serviço
  async createPackage(packageData: Omit<ServicePackage, 'id' | 'views' | 'orders' | 'rating' | 'reviewCount' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
    try {
      const docRef = await addDoc(collection(db, 'servicePackages'), {
        ...packageData,
        views: 0,
        orders: 0,
        rating: 0,
        reviewCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar pacote:', error);
      return null;
    }
  }

  // Buscar pacotes do profissional
  async getProfessionalPackages(professionalId: string): Promise<ServicePackage[]> {
    try {
      const q = query(
        collection(db, 'servicePackages'),
        where('professionalId', '==', professionalId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ServicePackage));
    } catch (error) {
      console.error('Erro ao buscar pacotes:', error);
      return [];
    }
  }

  // Buscar pacote por ID
  async getPackage(packageId: string): Promise<ServicePackage | null> {
    try {
      const docRef = doc(db, 'servicePackages', packageId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        // Incrementar visualizações
        await updateDoc(docRef, {
          views: increment(1),
        });
        
        return { id: docSnap.id, ...docSnap.data() } as ServicePackage;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar pacote:', error);
      return null;
    }
  }

  // Atualizar pacote
  async updatePackage(packageId: string, updates: Partial<ServicePackage>): Promise<boolean> {
    try {
      await updateDoc(doc(db, 'servicePackages', packageId), {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error('Erro ao atualizar pacote:', error);
      return false;
    }
  }

  // Deletar pacote
  async deletePackage(packageId: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, 'servicePackages', packageId));
      return true;
    } catch (error) {
      console.error('Erro ao deletar pacote:', error);
      return false;
    }
  }

  // Cliente fazer pedido
  async createOrder(orderData: Omit<ServiceOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
    try {
      const docRef = await addDoc(collection(db, 'serviceOrders'), {
        ...orderData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Incrementar contador de pedidos no pacote
      await updateDoc(doc(db, 'servicePackages', orderData.packageId), {
        orders: increment(1),
      });

      // Criar notificação para o profissional
      await addDoc(collection(db, 'serviceNotifications'), {
        userId: orderData.professionalId,
        type: 'new_order',
        message: `${orderData.clientName} fez um pedido: ${orderData.packageName}`,
        actionUrl: `/profissional/pedidos/${docRef.id}`,
        createdAt: serverTimestamp(),
        read: false,
        data: {
          orderId: docRef.id,
          clientId: orderData.clientId,
          total: orderData.total,
        },
      });

      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      return null;
    }
  }

  // Buscar pedidos do profissional
  async getProfessionalOrders(professionalId: string): Promise<ServiceOrder[]> {
    try {
      const q = query(
        collection(db, 'serviceOrders'),
        where('professionalId', '==', professionalId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ServiceOrder));
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      return [];
    }
  }

  // Buscar pedidos do cliente
  async getClientOrders(clientId: string): Promise<ServiceOrder[]> {
    try {
      const q = query(
        collection(db, 'serviceOrders'),
        where('clientId', '==', clientId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ServiceOrder));
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      return [];
    }
  }

  // Calcular total do pedido
  calculateOrderTotal(
    basePrice: number,
    selectedOption?: { price: number },
    selectedExtras: { price: number; quantity?: number }[] = []
  ): number {
    const optionPrice = selectedOption?.price || 0;
    const extrasTotal = selectedExtras.reduce((sum, extra) => {
      const quantity = extra.quantity || 1;
      return sum + (extra.price * quantity);
    }, 0);
    
    return basePrice + optionPrice + extrasTotal;
  }
}

export const servicePackageService = new ServicePackageService();
