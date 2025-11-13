import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Proposal, ProposalItem } from '../types/proposal';

class ProposalService {
  // Criar proposta
  async createProposal(
    professionalId: string,
    professionalName: string,
    clientId: string,
    clientName: string,
    title: string,
    description: string,
    items: ProposalItem[],
    discount: number,
    discountType: 'fixed' | 'percentage',
    validDays: number,
    notes?: string,
    terms?: string,
    serviceRequestId?: string
  ): Promise<string | null> {
    try {
      const subtotal = items.reduce((sum, item) => sum + item.total, 0);
      const discountAmount = discountType === 'percentage' 
        ? (subtotal * discount) / 100 
        : discount;
      const total = subtotal - discountAmount;

      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + validDays);

      const proposalData = {
        professionalId,
        professionalName,
        clientId,
        clientName,
        serviceRequestId: serviceRequestId || null,
        title,
        description,
        items,
        subtotal,
        discount,
        discountType,
        total,
        validUntil: Timestamp.fromDate(validUntil),
        status: 'pending',
        notes: notes || '',
        terms: terms || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'proposals'), proposalData);

      // Criar notificação para o cliente
      await addDoc(collection(db, 'serviceNotifications'), {
        userId: clientId,
        type: 'proposal',
        message: `${professionalName} enviou uma proposta: ${title}`,
        actionUrl: `/cliente/propostas/${docRef.id}`,
        createdAt: serverTimestamp(),
        read: false,
        data: {
          proposalId: docRef.id,
          professionalId,
          total,
        },
      });

      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar proposta:', error);
      return null;
    }
  }

  // Buscar proposta por ID
  async getProposal(proposalId: string): Promise<Proposal | null> {
    try {
      const docRef = doc(db, 'proposals', proposalId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Proposal;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar proposta:', error);
      return null;
    }
  }

  // Buscar propostas do profissional
  async getProfessionalProposals(professionalId: string): Promise<Proposal[]> {
    try {
      const q = query(
        collection(db, 'proposals'),
        where('professionalId', '==', professionalId),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Proposal));
    } catch (error) {
      console.error('Erro ao buscar propostas:', error);
      return [];
    }
  }

  // Buscar propostas do cliente
  async getClientProposals(clientId: string): Promise<Proposal[]> {
    try {
      const q = query(
        collection(db, 'proposals'),
        where('clientId', '==', clientId),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Proposal));
    } catch (error) {
      console.error('Erro ao buscar propostas:', error);
      return [];
    }
  }

  // Cliente aceitar proposta
  async acceptProposal(proposalId: string, clientId: string): Promise<boolean> {
    try {
      const proposal = await this.getProposal(proposalId);
      if (!proposal || proposal.clientId !== clientId) return false;

      await updateDoc(doc(db, 'proposals', proposalId), {
        status: 'accepted',
        acceptedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Notificar profissional
      await addDoc(collection(db, 'serviceNotifications'), {
        userId: proposal.professionalId,
        type: 'proposal_accepted',
        message: `${proposal.clientName} aceitou sua proposta: ${proposal.title}`,
        actionUrl: `/profissional/propostas/${proposalId}`,
        createdAt: serverTimestamp(),
        read: false,
        data: {
          proposalId,
          clientId,
          total: proposal.total,
        },
      });

      return true;
    } catch (error) {
      console.error('Erro ao aceitar proposta:', error);
      return false;
    }
  }

  // Cliente recusar proposta
  async rejectProposal(proposalId: string, clientId: string, reason?: string): Promise<boolean> {
    try {
      const proposal = await this.getProposal(proposalId);
      if (!proposal || proposal.clientId !== clientId) return false;

      await updateDoc(doc(db, 'proposals', proposalId), {
        status: 'rejected',
        rejectedAt: serverTimestamp(),
        rejectionReason: reason || '',
        updatedAt: serverTimestamp(),
      });

      // Notificar profissional
      await addDoc(collection(db, 'serviceNotifications'), {
        userId: proposal.professionalId,
        type: 'proposal_rejected',
        message: `${proposal.clientName} recusou sua proposta: ${proposal.title}`,
        actionUrl: `/profissional/propostas/${proposalId}`,
        createdAt: serverTimestamp(),
        read: false,
        data: {
          proposalId,
          clientId,
          reason: reason || 'Não informado',
        },
      });

      return true;
    } catch (error) {
      console.error('Erro ao recusar proposta:', error);
      return false;
    }
  }

  // Calcular total de um item
  calculateItemTotal(quantity: number, unitPrice: number): number {
    return quantity * unitPrice;
  }

  // Calcular subtotal
  calculateSubtotal(items: ProposalItem[]): number {
    return items.reduce((sum, item) => sum + item.total, 0);
  }

  // Calcular desconto
  calculateDiscount(subtotal: number, discount: number, discountType: 'fixed' | 'percentage'): number {
    return discountType === 'percentage' ? (subtotal * discount) / 100 : discount;
  }

  // Calcular total final
  calculateTotal(subtotal: number, discount: number, discountType: 'fixed' | 'percentage'): number {
    const discountAmount = this.calculateDiscount(subtotal, discount, discountType);
    return subtotal - discountAmount;
  }
}

export const proposalService = new ProposalService();
