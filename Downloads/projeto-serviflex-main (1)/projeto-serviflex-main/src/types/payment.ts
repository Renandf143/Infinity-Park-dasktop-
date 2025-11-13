export type PaymentStatus = 
  | 'pending'           // Aguardando pagamento
  | 'processing'        // Processando pagamento
  | 'held_in_escrow'    // Retido em custódia
  | 'released'          // Liberado para profissional
  | 'refunded'          // Reembolsado ao cliente
  | 'cancelled';        // Cancelado

export type PaymentMethod = 'pix' | 'credit_card' | 'debit_card' | 'bank_transfer';

export interface EscrowPayment {
  id: string;
  serviceRequestId: string;
  clientId: string;
  professionalId: string;
  amount: number;
  platformFee: number;          // Taxa da plataforma (%)
  platformFeeAmount: number;    // Valor da taxa
  professionalAmount: number;   // Valor que o profissional receberá
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  
  // Datas importantes
  paidAt?: Date;                // Quando o cliente pagou
  heldAt?: Date;                // Quando foi retido em custódia
  releasedAt?: Date;            // Quando foi liberado
  refundedAt?: Date;            // Quando foi reembolsado
  
  // Confirmações
  serviceCompletedByProfessional?: boolean;
  serviceCompletedByClient?: boolean;
  autoReleaseDate?: Date;       // Data de liberação automática
  
  // Dados do pagamento
  transactionId?: string;
  paymentProof?: string;        // URL da prova de pagamento
  
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentConfig {
  platformFeePercentage: number;  // Ex: 10 = 10%
  autoReleaseDays: number;        // Dias para liberação automática
  minAmount: number;
  maxAmount: number;
}

// Tipos para saque/retirada
export interface BankAccount {
  id?: string;
  userId: string;
  bankCode: string;
  bankName: string;
  accountType: 'checking' | 'savings';
  agency: string;
  accountNumber: string;
  accountDigit: string;
  holderName: string;
  holderDocument: string;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Withdrawal {
  id?: string;
  userId: string;
  amount: number;
  bankAccountId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  requestedAt: Date;
  processedAt?: Date;
  completedAt?: Date;
  failureReason?: string;
  transactionId?: string;
}

export interface Wallet {
  userId: string;
  balance: number;
  pendingBalance: number;
  totalEarned: number;
  totalWithdrawn: number;
  lastUpdated: Date;
}

// Lista de bancos brasileiros
export const BRAZILIAN_BANKS = [
  { code: '001', name: 'Banco do Brasil' },
  { code: '033', name: 'Santander' },
  { code: '104', name: 'Caixa Econômica Federal' },
  { code: '237', name: 'Bradesco' },
  { code: '341', name: 'Itaú' },
  { code: '077', name: 'Banco Inter' },
  { code: '260', name: 'Nubank' },
  { code: '290', name: 'PagSeguro' },
  { code: '323', name: 'Mercado Pago' },
  { code: '336', name: 'Banco C6' },
  { code: '380', name: 'PicPay' },
  { code: '422', name: 'Banco Safra' },
  { code: '748', name: 'Sicredi' },
  { code: '756', name: 'Bancoob' },
  { code: '212', name: 'Banco Original' },
  { code: '389', name: 'Banco Mercantil' },
  { code: '041', name: 'Banrisul' },
  { code: '070', name: 'BRB' },
  { code: '136', name: 'Unicred' },
  { code: '655', name: 'Neon' },
];
