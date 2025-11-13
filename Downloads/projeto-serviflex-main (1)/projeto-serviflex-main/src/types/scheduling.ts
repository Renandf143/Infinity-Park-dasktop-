export interface TimeSlot {
  start: string; // HH:mm format
  end: string;
}

export interface DaySchedule {
  dayOfWeek: number; // 0 = Domingo, 1 = Segunda, etc
  dayName: string;
  isAvailable: boolean;
  timeSlots: TimeSlot[];
}

export interface ProfessionalAvailability {
  professionalId: string;
  schedule: DaySchedule[];
  exceptions?: DateException[]; // Dias específicos com horários diferentes
  updatedAt: Date;
}

export interface DateException {
  date: string; // YYYY-MM-DD
  isAvailable: boolean;
  timeSlots?: TimeSlot[];
  reason?: string; // Ex: "Feriado", "Férias"
}

export interface Booking {
  id: string;
  professionalId: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  serviceType: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  duration: number; // em minutos
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  price: number;
  notes?: string;
  
  // Sistema de Custódia
  paymentId?: string;           // ID do pagamento em custódia
  paymentStatus?: 'pending' | 'held_in_escrow' | 'released' | 'refunded';
  
  createdAt: Date;
  updatedAt: Date;
}

export interface AvailableSlot {
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}
