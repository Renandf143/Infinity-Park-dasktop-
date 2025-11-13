import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { AvailabilitySettings, WeekSchedule, BlockedDate, Booking } from '../types/availability';

class AvailabilityService {
  // Horário padrão (Seg-Sex 8h-18h)
  private defaultSchedule: WeekSchedule = {
    monday: { enabled: true, slots: [{ start: '08:00', end: '18:00' }] },
    tuesday: { enabled: true, slots: [{ start: '08:00', end: '18:00' }] },
    wednesday: { enabled: true, slots: [{ start: '08:00', end: '18:00' }] },
    thursday: { enabled: true, slots: [{ start: '08:00', end: '18:00' }] },
    friday: { enabled: true, slots: [{ start: '08:00', end: '18:00' }] },
    saturday: { enabled: false, slots: [] },
    sunday: { enabled: false, slots: [] },
  };

  // Buscar configurações de disponibilidade
  async getAvailability(professionalId: string): Promise<AvailabilitySettings | null> {
    try {
      const docRef = doc(db, 'availability', professionalId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as AvailabilitySettings;
      }

      // Criar configuração padrão se não existir
      const defaultSettings: AvailabilitySettings = {
        professionalId,
        weekSchedule: this.defaultSchedule,
        blockedDates: [],
        advanceBookingDays: 30,
        bufferTime: 30,
        updatedAt: Timestamp.now(),
      };

      await setDoc(docRef, defaultSettings);
      return defaultSettings;
    } catch (error) {
      console.error('Erro ao buscar disponibilidade:', error);
      return null;
    }
  }

  // Atualizar horários da semana
  async updateWeekSchedule(professionalId: string, weekSchedule: WeekSchedule): Promise<boolean> {
    try {
      const docRef = doc(db, 'availability', professionalId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Atualizar documento existente
        await updateDoc(docRef, {
          weekSchedule,
          updatedAt: serverTimestamp(),
        });
      } else {
        // Criar novo documento
        const newSettings: AvailabilitySettings = {
          professionalId,
          weekSchedule,
          blockedDates: [],
          advanceBookingDays: 30,
          bufferTime: 30,
          updatedAt: Timestamp.now(),
        };
        await setDoc(docRef, newSettings);
      }

      console.log('✅ Horários salvos com sucesso no Firebase');
      return true;
    } catch (error) {
      console.error('❌ Erro ao atualizar horários:', error);
      return false;
    }
  }

  // Bloquear data
  async blockDate(professionalId: string, date: string, reason: string, type: string): Promise<boolean> {
    try {
      const docRef = doc(db, 'availability', professionalId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        const blockedDates = data.blockedDates || [];
        
        if (!blockedDates.includes(date)) {
          blockedDates.push(date);
          await updateDoc(docRef, {
            blockedDates,
            updatedAt: serverTimestamp(),
          });
        }
      }

      // Salvar detalhes do bloqueio
      await addDoc(collection(db, 'blockedDates'), {
        professionalId,
        date,
        reason,
        type,
        createdAt: serverTimestamp(),
      });

      return true;
    } catch (error) {
      console.error('Erro ao bloquear data:', error);
      return false;
    }
  }

  // Desbloquear data
  async unblockDate(professionalId: string, date: string): Promise<boolean> {
    try {
      const docRef = doc(db, 'availability', professionalId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        const blockedDates = (data.blockedDates || []).filter((d: string) => d !== date);
        
        await updateDoc(docRef, {
          blockedDates,
          updatedAt: serverTimestamp(),
        });
      }

      return true;
    } catch (error) {
      console.error('Erro ao desbloquear data:', error);
      return false;
    }
  }

  // Verificar se data/horário está disponível
  async isAvailable(
    professionalId: string,
    date: string,
    startTime: string,
    endTime: string
  ): Promise<boolean> {
    try {
      const settings = await this.getAvailability(professionalId);
      if (!settings) return false;

      // Verificar se data está bloqueada
      if (settings.blockedDates.includes(date)) return false;

      // Verificar dia da semana
      const dayOfWeek = new Date(date + 'T00:00:00').getDay();
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const daySchedule = settings.weekSchedule[dayNames[dayOfWeek] as keyof WeekSchedule];

      if (!daySchedule.enabled) return false;

      // Verificar se horário está dentro dos slots disponíveis
      const isInSlot = daySchedule.slots.some(slot => {
        return startTime >= slot.start && endTime <= slot.end;
      });

      if (!isInSlot) return false;

      // Verificar conflitos com agendamentos existentes
      const bookingsQuery = query(
        collection(db, 'bookings'),
        where('professionalId', '==', professionalId),
        where('date', '==', date),
        where('status', 'in', ['pending', 'confirmed'])
      );

      const snapshot = await getDocs(bookingsQuery);
      const hasConflict = snapshot.docs.some(doc => {
        const booking = doc.data();
        return !(endTime <= booking.startTime || startTime >= booking.endTime);
      });

      return !hasConflict;
    } catch (error) {
      console.error('Erro ao verificar disponibilidade:', error);
      return false;
    }
  }

  // Buscar horários disponíveis para uma data
  async getAvailableSlots(professionalId: string, date: string, duration: number = 60): Promise<string[]> {
    try {
      const settings = await this.getAvailability(professionalId);
      if (!settings) return [];

      // Verificar se data está bloqueada
      if (settings.blockedDates.includes(date)) return [];

      // Verificar dia da semana
      const dayOfWeek = new Date(date + 'T00:00:00').getDay();
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const daySchedule = settings.weekSchedule[dayNames[dayOfWeek] as keyof WeekSchedule];

      if (!daySchedule.enabled) return [];

      // Buscar agendamentos existentes
      const bookingsQuery = query(
        collection(db, 'bookings'),
        where('professionalId', '==', professionalId),
        where('date', '==', date),
        where('status', 'in', ['pending', 'confirmed'])
      );

      const snapshot = await getDocs(bookingsQuery);
      const bookedSlots = snapshot.docs.map(doc => ({
        start: doc.data().startTime,
        end: doc.data().endTime,
      }));

      // Gerar slots disponíveis
      const availableSlots: string[] = [];

      daySchedule.slots.forEach(slot => {
        let currentTime = this.timeToMinutes(slot.start);
        const endTime = this.timeToMinutes(slot.end);

        while (currentTime + duration <= endTime) {
          const slotStart = this.minutesToTime(currentTime);
          const slotEnd = this.minutesToTime(currentTime + duration);

          // Verificar se não conflita com agendamentos
          const hasConflict = bookedSlots.some(booked => {
            const bookedStart = this.timeToMinutes(booked.start);
            const bookedEnd = this.timeToMinutes(booked.end);
            return !(currentTime + duration <= bookedStart || currentTime >= bookedEnd);
          });

          if (!hasConflict) {
            availableSlots.push(slotStart);
          }

          currentTime += duration + settings.bufferTime;
        }
      });

      return availableSlots;
    } catch (error) {
      console.error('Erro ao buscar slots disponíveis:', error);
      return [];
    }
  }

  // Helpers
  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }
}

export const availabilityService = new AvailabilityService();
