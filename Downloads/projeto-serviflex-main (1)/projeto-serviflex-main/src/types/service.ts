export type ServiceStatus = 
  | 'pending'           // Aguardando aceitação do profissional
  | 'accepted'          // Profissional aceitou
  | 'scheduled'         // Agendado (10 min antes)
  | 'in_progress'       // Profissional iniciou o serviço
  | 'completed'         // Serviço concluído
  | 'cancelled'         // Cancelado
  | 'paid';             // Pago pelo cliente

export interface ServiceRequest {
  id?: string;
  
  // Participantes
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  
  professionalId: string;
  professionalName: string;
  professionalEmail: string;
  professionalPhone?: string;
  
  // Detalhes do serviço
  serviceType: string;
  description: string;
  category: string;
  
  // Localização
  address: string;
  city: string;
  state: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  
  // Agendamento
  scheduledDate: Date;
  scheduledTime: string;
  estimatedDuration: number; // em minutos
  
  // Status e controle
  status: ServiceStatus;
  
  // Timestamps importantes
  createdAt: Date;
  acceptedAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  paidAt?: Date;
  
  // Valores
  estimatedPrice: number;
  finalPrice?: number;
  
  // Pagamento
  pixKey?: string;
  paymentProof?: string;
  
  // Geolocalização (opcional)
  professionalArrivalLocation?: {
    lat: number;
    lng: number;
    timestamp: Date;
  };
  
  // Avaliação
  rating?: number;
  review?: string;
  
  // Logs e histórico
  statusHistory: StatusChange[];
  
  // Notificações enviadas
  notificationsSent: {
    acceptance?: Date;
    reminder10min?: Date;
    reminderArrival?: Date;
    completion?: Date;
  };
}

export interface StatusChange {
  from: ServiceStatus;
  to: ServiceStatus;
  timestamp: Date;
  userId: string;
  userName: string;
  notes?: string;
}

export interface ServiceNotification {
  id?: string;
  userId: string;
  serviceId: string;
  type: 'request' | 'acceptance' | 'reminder' | 'start' | 'completion' | 'payment';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}
