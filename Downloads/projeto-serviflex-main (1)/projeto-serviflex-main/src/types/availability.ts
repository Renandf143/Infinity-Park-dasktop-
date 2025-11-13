import { Timestamp } from 'firebase/firestore';

export interface TimeSlot {
  start: string; // "09:00"
  end: string;   // "10:00"
}

export interface DaySchedule {
  enabled: boolean;
  slots: TimeSlot[];
}

export interface WeekSchedule {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface BlockedDate {
  id: string;
  date: string; // "2025-01-15"
  reason: string;
  type: 'vacation' | 'personal' | 'holiday' | 'other';
  createdAt: Timestamp;
}

export interface Booking {
  id: string;
  professionalId: string;
  clientId: string;
  clientName: string;
  date: string; // "2025-01-15"
  startTime: string; // "09:00"
  endTime: string; // "10:00"
  serviceType: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: Timestamp;
}

export interface AvailabilitySettings {
  professionalId: string;
  weekSchedule: WeekSchedule;
  blockedDates: string[]; // Array de datas bloqueadas
  advanceBookingDays: number; // Quantos dias de antecedência aceita agendamentos
  bufferTime: number; // Tempo de buffer entre agendamentos (minutos)
  updatedAt: Timestamp;
}
