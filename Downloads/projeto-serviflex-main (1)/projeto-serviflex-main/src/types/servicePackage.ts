import { Timestamp } from 'firebase/firestore';

export interface ServiceOption {
  id: string;
  name: string;
  description: string;
  price: number;
  required: boolean; // Se é obrigatório escolher
}

export interface ServiceExtra {
  id: string;
  name: string;
  description: string;
  price: number;
  maxQuantity?: number; // Quantidade máxima que pode adicionar
}

export interface ServicePackage {
  id: string;
  professionalId: string;
  professionalName: string;
  name: string; // Ex: "Instalação de Ar Condicionado"
  description: string;
  category: string; // Ex: "Instalação", "Manutenção", "Reparo"
  basePrice: number;
  estimatedDuration: number; // Em minutos
  images: string[];
  
  // Opções (cliente escolhe UMA)
  options: ServiceOption[]; // Ex: "Split 9.000 BTUs", "Split 12.000 BTUs"
  
  // Extras (cliente pode adicionar vários)
  extras: ServiceExtra[]; // Ex: "Suporte extra", "Tubulação adicional"
  
  // Disponibilidade
  available: boolean;
  
  // Estatísticas
  views: number;
  orders: number;
  rating: number;
  reviewCount: number;
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ServiceOrder {
  id: string;
  packageId: string;
  packageName: string;
  professionalId: string;
  professionalName: string;
  clientId: string;
  clientName: string;
  
  // Escolhas do cliente
  selectedOption?: ServiceOption;
  selectedExtras: ServiceExtra[];
  
  // Valores
  basePrice: number;
  optionPrice: number;
  extrasTotal: number;
  total: number;
  
  // Agendamento
  preferredDate?: string;
  preferredTime?: string;
  
  // Endereço
  address: string;
  city: string;
  state: string;
  zipCode: string;
  
  // Observações
  notes?: string;
  
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
