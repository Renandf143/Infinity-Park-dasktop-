export type EscrowStatus = 
  | 'pending_payment'      // Aguardando pagamento do cliente
  | 'payment_received'     // Pagamento recebido, em custódia
  | 'service_in_progress'  // Serviço em andamento
  | 'awaiting_confirmation'// Aguardando confirmação do cliente
  | 'completed'            // Serviço confirmado, pagamento liberado
  | 'disputed'             // Em disputa
  | 'refunded'             // Reembolsado ao cliente
  | 'cancelled';           // Cancelado

export type DisputeStatus = 
  | 'open'                 // Disputa aberta
  | 'under_review'         // Em análise
  | 'resolved_client'      // Resolvida a favor do cliente
  | 'resolved_professional'// Resolvida a favor do profissional
  | 'closed';              // Fechada

export interface EscrowTransaction {
  id: string;
  serviceId: string;
  bookingId?: string;
  
  // Partes envolvidas
  clientId: string;
  clientName: string;
  professionalId: string;
  professionalName: string;
  
  // Valores
  amount: number;              // Valor total
  platformFee: number;         // Taxa da plataforma (%)
  platformFeeAmount: number;   // Valor da taxa
  professionalAmount: number;  // Valor que vai para o profissional
  
  // Status
  status: EscrowStatus;
  
  // Pagamento
  paymentMethod: 'pix' | 'credit_card' | 'debit_card';
  paymentId?: string;          // ID do pagamento no gateway
  paidAt?: Date;
  
  // Confirmação
  serviceStartedAt?: Date;
  serviceCompletedAt?: Date;
  confirmedAt?: Date;
  confirmedBy?: string;
  
  // Liberação
  releasedAt?: Date;
  releasedAmount?: number;
  
  // Disputa
  disputeId?: string;
  disputeReason?: string;
  
  // Reembolso
  refundedAt?: Date;
  refundAmount?: number;
  refundReason?: string;
  
  // Metadados
  description: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Timeline
  timeline: EscrowTimelineEvent[];
}

export interface EscrowTimelineEvent {
  timestamp: Date;
  status: EscrowStatus;
  description: string;
  actor?: string;  // Quem realizou a ação
  metadata?: Record<string, any>;
}

export interface Dispute {
  id: string;
  escrowId: string;
  serviceId: string;
  
  // Partes
  openedBy: 'client' | 'professional';
  clientId: string;
  professionalId: string;
  
  // Detalhes
  reason: string;
  description: string;
  evidence: DisputeEvidence[];
  
  // Status
  status: DisputeStatus;
  resolution?: string;
  resolvedBy?: string;
  resolvedAt?: Date;
  
  // Valores
  disputedAmount: number;
  refundAmount?: number;
  
  // Datas
  createdAt: Date;
  updatedAt: Date;
  
  // Mensagens
  messages: DisputeMessage[];
}

export interface DisputeEvidence {
  id: string;
  type: 'image' | 'document' | 'video';
  url: string;
  description: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface DisputeMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'client' | 'professional' | 'admin';
  message: string;
  timestamp: Date;
}

export interface EscrowConfig {
  platformFeePercentage: number;  // Taxa da plataforma (ex: 10%)
  autoReleaseAfterDays: number;   // Dias para liberação automática
  disputeWindowDays: number;      // Dias para abrir disputa
  refundWindowDays: number;       // Dias para solicitar reembolso
}

export interface PaymentIntent {
  id: string;
  escrowId: string;
  amount: number;
  method: 'pix' | 'credit_card' | 'debit_card';
  status: 'pending' | 'processing' | 'succeeded' | 'failed';
  pixCode?: string;
  pixQrCode?: string;
  expiresAt?: Date;
  createdAt: Date;
}
