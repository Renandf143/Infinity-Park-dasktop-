import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  Timestamp,
  addDoc,
  updateDoc,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase';
import { ProfessionalAvailability, Booking, DaySchedule, AvailableSlot } from '../types/scheduling';

class SchedulingService {
  
  /**
   * Salvar disponibilidade do profissional
   */
  async saveProfessionalAvailability(professionalId: string, schedule: DaySchedule[]): Promise<void> {
    try {
      const availabilityRef = doc(db, 'professionalAvailability', professionalId);
      
      await setDoc(availabilityRef, {
        professionalId,
        schedule,
        updatedAt: Timestamp.now()
      });
      
      console.log('✅ Disponibilidade salva com sucesso');
    } catch (error) {
      console.error('❌ Erro ao salvar disponibilidade:', error);
      throw error;
    }
  }
  
  /**
   * Buscar disponibilidade do profissional
   */
  async getProfessionalAvailability(professionalId: string): Promise<ProfessionalAvailability | null> {
    try {
      const availabilityRef = doc(db, 'professionalAvailability', professionalId);
      const availabilityDoc = await getDoc(availabilityRef);
      
      if (availabilityDoc.exists()) {
        const data = availabilityDoc.data();
        return {
          professionalId,
          schedule: data.schedule,
          exceptions: data.exceptions || [],
          updatedAt: data.updatedAt.toDate()
        };
      }
      
      // Retornar horário padrão se não existir
      return this.getDefaultAvailability(professionalId);
    } catch (error) {
      console.error('❌ Erro ao buscar disponibilidade:', error);
      return this.getDefaultAvailability(professionalId);
    }
  }
  
  /**
   * Disponibilidade padrão (Segunda a Sexta 8h-18h, Sábado 8h-12h)
   */
  private getDefaultAvailability(professionalId: string): ProfessionalAvailability {
    return {
      professionalId,
      schedule: [
        { dayOfWeek: 0, dayName: 'Domingo', isAvailable: false, timeSlots: [] },
        { dayOfWeek: 1, dayName: 'Segunda-feira', isAvailable: true, timeSlots: [{ start: '08:00', end: '18:00' }] },
        { dayOfWeek: 2, dayName: 'Terça-feira', isAvailable: true, timeSlots: [{ start: '08:00', end: '18:00' }] },
        { dayOfWeek: 3, dayName: 'Quarta-feira', isAvailable: true, timeSlots: [{ start: '08:00', end: '18:00' }] },
        { dayOfWeek: 4, dayName: 'Quinta-feira', isAvailable: true, timeSlots: [{ start: '08:00', end: '18:00' }] },
        { dayOfWeek: 5, dayName: 'Sexta-feira', isAvailable: true, timeSlots: [{ start: '08:00', end: '18:00' }] },
        { dayOfWeek: 6, dayName: 'Sábado', isAvailable: true, timeSlots: [{ start: '08:00', end: '12:00' }] },
      ],
      updatedAt: new Date()
    };
  }
  
  /**
   * Criar novo agendamento
   */
  async createBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      // Verificar se o horário está disponível
      const isAvailable = await this.checkAvailability(
        booking.professionalId,
        booking.date,
        booking.startTime,
        booking.endTime
      );
      
      if (!isAvailable) {
        throw new Error('Horário não disponível. Por favor, escolha outro horário.');
      }
      
      // Criar agendamento
      const bookingRef = await addDoc(collection(db, 'bookings'), {
        ...booking,
        status: 'pending',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      
      console.log('✅ Agendamento criado:', bookingRef.id);
      return bookingRef.id;
    } catch (error) {
      console.error('❌ Erro ao criar agendamento:', error);
      throw error;
    }
  }
  
  /**
   * Verificar se um horário está disponível
   */
  async checkAvailability(
    professionalId: string,
    date: string,
    startTime: string,
    endTime: string
  ): Promise<boolean> {
    try {
      // 1. Verificar se o dia da semana está disponível
      const availability = await this.getProfessionalAvailability(professionalId);
      const dateObj = new Date(date);
      const dayOfWeek = dateObj.getDay();
      
      const daySchedule = availability?.schedule.find(s => s.dayOfWeek === dayOfWeek);
      
      if (!daySchedule || !daySchedule.isAvailable) {
        return false;
      }
      
      // 2. Verificar se o horário está dentro do expediente
      const isWithinWorkingHours = daySchedule.timeSlots.some(slot => {
        return startTime >= slot.start && endTime <= slot.end;
      });
      
      if (!isWithinWorkingHours) {
        return false;
      }
      
      // 3. Verificar se não há conflito com outros agendamentos
      const bookingsRef = collection(db, 'bookings');
      const q = query(
        bookingsRef,
        where('professionalId', '==', professionalId),
        where('date', '==', date),
        where('status', 'in', ['pending', 'confirmed'])
      );
      
      const existingBookings = await getDocs(q);
      
      // Verificar conflitos de horário
      for (const bookingDoc of existingBookings.docs) {
        const booking = bookingDoc.data();
        
        // Verificar se há sobreposição de horários
        const hasConflict = this.checkTimeConflict(
          startTime,
          endTime,
          booking.startTime,
          booking.endTime
        );
        
        if (hasConflict) {
          console.log('⚠️ Conflito de horário detectado:', {
            solicitado: { startTime, endTime },
            existente: { startTime: booking.startTime, endTime: booking.endTime }
          });
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('❌ Erro ao verificar disponibilidade:', error);
      return false;
    }
  }
  
  /**
   * Verificar se dois horários têm conflito
   */
  private checkTimeConflict(
    start1: string,
    end1: string,
    start2: string,
    end2: string
  ): boolean {
    // Converter para minutos desde meia-noite
    const toMinutes = (time: string) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };
    
    const start1Min = toMinutes(start1);
    const end1Min = toMinutes(end1);
    const start2Min = toMinutes(start2);
    const end2Min = toMinutes(end2);
    
    // Verificar sobreposição
    return (start1Min < end2Min && end1Min > start2Min);
  }
  
  /**
   * Buscar horários disponíveis para um dia específico
   */
  async getAvailableSlots(
    professionalId: string,
    date: string,
    duration: number = 60 // duração em minutos
  ): Promise<AvailableSlot[]> {
    try {
      const availability = await this.getProfessionalAvailability(professionalId);
      const dateObj = new Date(date);
      const dayOfWeek = dateObj.getDay();
      
      const daySchedule = availability?.schedule.find(s => s.dayOfWeek === dayOfWeek);
      
      if (!daySchedule || !daySchedule.isAvailable) {
        return [];
      }
      
      // Buscar agendamentos existentes
      const bookingsRef = collection(db, 'bookings');
      const q = query(
        bookingsRef,
        where('professionalId', '==', professionalId),
        where('date', '==', date),
        where('status', 'in', ['pending', 'confirmed'])
      );
      
      const existingBookings = await getDocs(q);
      const bookedSlots = existingBookings.docs.map(doc => {
        const data = doc.data();
        return {
          startTime: data.startTime,
          endTime: data.endTime
        };
      });
      
      // Gerar slots disponíveis
      const availableSlots: AvailableSlot[] = [];
      
      for (const timeSlot of daySchedule.timeSlots) {
        const slots = this.generateTimeSlots(
          timeSlot.start,
          timeSlot.end,
          duration,
          bookedSlots
        );
        
        availableSlots.push(...slots.map(slot => ({
          date,
          startTime: slot.start,
          endTime: slot.end,
          isAvailable: true
        })));
      }
      
      return availableSlots;
    } catch (error) {
      console.error('❌ Erro ao buscar horários disponíveis:', error);
      return [];
    }
  }
  
  /**
   * Gerar slots de tempo
   */
  private generateTimeSlots(
    start: string,
    end: string,
    duration: number,
    bookedSlots: { startTime: string; endTime: string }[]
  ): { start: string; end: string }[] {
    const slots: { start: string; end: string }[] = [];
    
    const toMinutes = (time: string) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };
    
    const toTimeString = (minutes: number) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    };
    
    let currentTime = toMinutes(start);
    const endTime = toMinutes(end);
    
    while (currentTime + duration <= endTime) {
      const slotStart = toTimeString(currentTime);
      const slotEnd = toTimeString(currentTime + duration);
      
      // Verificar se não conflita com slots já agendados
      const hasConflict = bookedSlots.some(booked => 
        this.checkTimeConflict(slotStart, slotEnd, booked.startTime, booked.endTime)
      );
      
      if (!hasConflict) {
        slots.push({ start: slotStart, end: slotEnd });
      }
      
      currentTime += duration;
    }
    
    return slots;
  }
  
  /**
   * Buscar agendamentos do profissional
   */
  async getProfessionalBookings(professionalId: string): Promise<Booking[]> {
    try {
      const bookingsRef = collection(db, 'bookings');
      const q = query(
        bookingsRef,
        where('professionalId', '==', professionalId)
      );
      
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate()
      })) as Booking[];
    } catch (error) {
      console.error('❌ Erro ao buscar agendamentos:', error);
      return [];
    }
  }
  
  /**
   * Atualizar status do agendamento
   */
  async updateBookingStatus(bookingId: string, status: Booking['status']): Promise<void> {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      
      await updateDoc(bookingRef, {
        status,
        updatedAt: Timestamp.now()
      });
      
      console.log('✅ Status do agendamento atualizado:', status);
    } catch (error) {
      console.error('❌ Erro ao atualizar status:', error);
      throw error;
    }
  }
  
  /**
   * Listener em tempo real para agendamentos
   */
  subscribeToBookings(
    professionalId: string,
    callback: (bookings: Booking[]) => void
  ): () => void {
    const bookingsRef = collection(db, 'bookings');
    const q = query(
      bookingsRef,
      where('professionalId', '==', professionalId)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bookings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate()
      })) as Booking[];
      
      callback(bookings);
    });
    
    return unsubscribe;
  }
}

export const schedulingService = new SchedulingService();
