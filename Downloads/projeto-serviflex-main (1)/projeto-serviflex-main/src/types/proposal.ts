import { Timestamp } from 'firebase/firestore';

export interface ProposalItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Proposal {
  id: string;
  professionalId: string;
  professionalName: string;
  clientId: string;
  clientName: string;
  serviceRequestId?: string;
  title: string;
  description: string;
  items: ProposalItem[];
  subtotal: number;
  discount: number;
  discountType: 'fixed' | 'percentage';
  total: number;
  validUntil: Timestamp;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  notes?: string;
  terms?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  acceptedAt?: Timestamp;
  rejectedAt?: Timestamp;
  rejectionReason?: string;
}

export interface ProposalTemplate {
  id: string;
  professionalId: string;
  name: string;
  items: ProposalItem[];
  terms: string;
  createdAt: Timestamp;
}
