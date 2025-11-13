import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc, 
  getDocs,
  query, 
  where,
  serverTimestamp,
  Timestamp,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase';
import { ServiceRequest, ServiceStatus, StatusChange, ServiceNotification } from '../types/service';
import { notificationService } from './notificationService';
import { emailService } from './emailService';

class ServiceFlowService {
  private readonly SERVICES_COLLECTION = 'serviceRequests';
  private readonly NOTIFICATIONS_COLLECTION = 'serviceNotifications';

  // ==================== CRIAR SOLICITAÇÃO ====================
  async createServiceRequest(data: Omit<ServiceRequest, 'id' | 'status' | 'createdAt' | 'statusHistory' | 'notificationsSent'>): Promise<string> {
    try {
      const serviceRequest: Omit<ServiceRequest, 'id'> = {
        ...data,
        status: 'pending',
        createdAt: new Date(),
        statusHistory: [{
          from: 'pending' as ServiceStatus,
          to: 'pending' as ServiceStatus,
          timestamp: new Date(),
          userId: data.clientId,
          userName: data.clientName,
          notes: 'Solicitação criada'
        }],
        notificationsSent: {}
      };

      const docRef = await addDoc(collection(db, this.SERVICES_COLLECTION), {
        ...serviceRequest,
        createdAt: serverTimestamp(),
        scheduledDate: Timestamp.fromDate(serviceRequest.scheduledDate),
        statusHistory: serviceRequest.statusHistory.map(h => ({
          ...h,
          timestamp: Timestamp.now()
        }))
      });

      // Enviar notificação para o profissional
      await notificationService.notifyNewServiceRequest(
        data.professionalId,
        data.clientName,
        data.serviceType,
        docRef.id
      );

      console.log('✅ Solicitação criada:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Erro ao criar solicitação:', error);
      throw error;
    }
  }

  // ==================== ACEITAR SERVIÇO ====================
  async acceptService(serviceId: string, professionalId: string, professionalName: string): Promise<void> {
    try {
      const serviceRef = doc(db, this.SERVICES_COLLECTION, serviceId);
      const serviceDoc = await getDoc(serviceRef);

      if (!serviceDoc.exists()) {
        throw new Error('Serviço não encontrado');
      }

      const service = serviceDoc.data() as ServiceRequest;

      if (service.professionalId !== professionalId) {
        throw new Error('Você não tem permissão para aceitar este serviço');
      }

      if (service.status !== 'pending') {
        throw new Error('Este serviço não está mais disponível');
      }

      const statusChange: StatusChange = {
        from: 'pending',
        to: 'accepted',
        timestamp: new Date(),
        userId: professionalId,
        userName: professionalName,
        notes: 'Serviço aceito pelo profissional'
      };

      await updateDoc(serviceRef, {
        status: 'accepted',
        acceptedAt: serverTimestamp(),
        statusHistory: [...service.statusHistory, {
          ...statusChange,
          timestamp: Timestamp.now()
        }],
        'notificationsSent.acceptance': serverTimestamp()
      });

      // Notificar cliente
      await notificationService.notifyServiceAccepted(
        service.clientId,
        professionalName,
        service.serviceType,
        serviceId
      );

      // Agendar lembrete para 10 minutos antes
      this.scheduleReminder(serviceId, service);

      console.log('✅ Serviço aceito:', serviceId);
    } catch (error) {
      console.error('❌ Erro ao aceitar serviço:', error);
      throw error;
    }
  }

  // ==================== INICIAR SERVIÇO ====================
  async startService(
    serviceId: string, 
    professionalId: string, 
    professionalName: string,
    location?: { lat: number; lng: number }
  ): Promise<void> {
    try {
      const serviceRef = doc(db, this.SERVICES_COLLECTION, serviceId);
      const serviceDoc = await getDoc(serviceRef);

      if (!serviceDoc.exists()) {
        throw new Error('Serviço não encontrado');
      }

      const service = serviceDoc.data() as ServiceRequest;

      if (service.professionalId !== professionalId) {
        throw new Error('Você não tem permissão para iniciar este serviço');
      }

      if (service.status !== 'accepted' && service.status !== 'scheduled') {
        throw new Error('Este serviço não pode ser iniciado');
      }

      // VALIDAÇÃO DE HORÁRIO - Só pode iniciar no horário agendado ou depois
      const scheduledDateTime = new Date(service.scheduledDate);
      const [hours, minutes] = service.scheduledTime.split(':');
      scheduledDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      const now = new Date();
      const timeDiffMinutes = (now.getTime() - scheduledDateTime.getTime()) / (1000 * 60);
      
      // Permitir iniciar até 15 minutos antes do horário agendado
      if (timeDiffMinutes < -15) {
        const timeUntilStart = Math.abs(Math.floor(timeDiffMinutes));
        throw new Error(`Você só pode iniciar o serviço no horário agendado (${service.scheduledTime}). Faltam ${timeUntilStart} minutos.`);
      }

      const statusChange: StatusChange = {
        from: service.status,
        to: 'in_progress',
        timestamp: new Date(),
        userId: professionalId,
        userName: professionalName,
        notes: 'Serviço iniciado'
      };

      const updateData: any = {
        status: 'in_progress',
        startedAt: serverTimestamp(),
        statusHistory: [...service.statusHistory, {
          ...statusChange,
          timestamp: Timestamp.now()
        }]
      };

      if (location) {
        updateData.professionalArrivalLocation = {
          ...location,
          timestamp: Timestamp.now()
        };
      }

      await updateDoc(serviceRef, updateData);

      // Notificar cliente
      await notificationService.notifyServiceStarted(
        service.clientId,
        professionalName,
        service.serviceType,
        serviceId
      );

      console.log('✅ Serviço iniciado:', serviceId);
    } catch (error) {
      console.error('❌ Erro ao iniciar serviço:', error);
      throw error;
    }
  }

  // ==================== CONCLUIR SERVIÇO ====================
  async completeService(
    serviceId: string, 
    professionalId: string, 
    professionalName: string,
    finalPrice?: number,
    pixKey?: string
  ): Promise<void> {
    try {
      const serviceRef = doc(db, this.SERVICES_COLLECTION, serviceId);
      const serviceDoc = await getDoc(serviceRef);

      if (!serviceDoc.exists()) {
        throw new Error('Serviço não encontrado');
      }

      const service = serviceDoc.data() as ServiceRequest;

      if (service.professionalId !== professionalId) {
        throw new Error('Você não tem permissão para concluir este serviço');
      }

      if (service.status !== 'in_progress') {
        throw new Error('Este serviço não está em andamento');
      }

      const statusChange: StatusChange = {
        from: 'in_progress',
        to: 'completed',
        timestamp: new Date(),
        userId: professionalId,
        userName: professionalName,
        notes: 'Serviço concluído'
      };

      await updateDoc(serviceRef, {
        status: 'completed',
        completedAt: serverTimestamp(),
        finalPrice: finalPrice || service.estimatedPrice,
        pixKey: pixKey || service.pixKey,
        statusHistory: [...service.statusHistory, {
          ...statusChange,
          timestamp: Timestamp.now()
        }],
        'notificationsSent.completion': serverTimestamp()
      });

      // Notificar cliente com chave PIX
      await notificationService.notifyServiceCompleted(
        service.clientId,
        professionalName,
        service.serviceType,
        serviceId,
        pixKey || service.pixKey || ''
      );

      console.log('✅ Serviço concluído:', serviceId);
    } catch (error) {
      console.error('❌ Erro ao concluir serviço:', error);
      throw error;
    }
  }

  // ==================== CONFIRMAR PAGAMENTO ====================
  async confirmPayment(
    serviceId: string, 
    clientId: string,
    paymentProof?: string
  ): Promise<void> {
    try {
      const serviceRef = doc(db, this.SERVICES_COLLECTION, serviceId);
      const serviceDoc = await getDoc(serviceRef);

      if (!serviceDoc.exists()) {
        throw new Error('Serviço não encontrado');
      }

      const service = serviceDoc.data() as ServiceRequest;

      if (service.clientId !== clientId) {
        throw new Error('Você não tem permissão para confirmar este pagamento');
      }

      if (service.status !== 'completed') {
        throw new Error('Este serviço ainda não foi concluído');
      }

      const statusChange: StatusChange = {
        from: 'completed',
        to: 'paid',
        timestamp: new Date(),
        userId: clientId,
        userName: service.clientName,
        notes: 'Pagamento confirmado'
      };

      await updateDoc(serviceRef, {
        status: 'paid',
        paidAt: serverTimestamp(),
        paymentProof,
        statusHistory: [...service.statusHistory, {
          ...statusChange,
          timestamp: Timestamp.now()
        }]
      });

      // Notificar profissional
      await notificationService.notifyPaymentConfirmed(
        service.professionalId,
        service.clientName,
        service.finalPrice || service.estimatedPrice,
        serviceId
      );

      console.log('✅ Pagamento confirmado:', serviceId);
    } catch (error) {
      console.error('❌ Erro ao confirmar pagamento:', error);
      throw error;
    }
  }

  // ==================== BUSCAR SERVIÇOS ====================
  async getServicesByUser(userId: string, role: 'client' | 'professional'): Promise<ServiceRequest[]> {
    try {
      const field = role === 'client' ? 'clientId' : 'professionalId';
      const q = query(
        collection(db, this.SERVICES_COLLECTION),
        where(field, '==', userId),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        scheduledDate: doc.data().scheduledDate?.toDate(),
        acceptedAt: doc.data().acceptedAt?.toDate(),
        startedAt: doc.data().startedAt?.toDate(),
        completedAt: doc.data().completedAt?.toDate(),
        paidAt: doc.data().paidAt?.toDate(),
      })) as ServiceRequest[];
    } catch (error) {
      console.error('❌ Erro ao buscar serviços:', error);
      throw error;
    }
  }

  // ==================== BUSCAR SERVIÇO POR ID ====================
  async getServiceById(serviceId: string): Promise<ServiceRequest | null> {
    try {
      const serviceDoc = await getDoc(doc(db, this.SERVICES_COLLECTION, serviceId));
      
      if (!serviceDoc.exists()) {
        return null;
      }

      const data = serviceDoc.data();
      return {
        id: serviceDoc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        scheduledDate: data.scheduledDate?.toDate(),
        acceptedAt: data.acceptedAt?.toDate(),
        startedAt: data.startedAt?.toDate(),
        completedAt: data.completedAt?.toDate(),
        paidAt: data.paidAt?.toDate(),
      } as ServiceRequest;
    } catch (error) {
      console.error('❌ Erro ao buscar serviço:', error);
      throw error;
    }
  }

  // ==================== NOTIFICAÇÕES ====================
  private async sendNotification(notification: Omit<ServiceNotification, 'id'>): Promise<void> {
    try {
      await addDoc(collection(db, this.NOTIFICATIONS_COLLECTION), {
        ...notification,
        createdAt: serverTimestamp()
      });
      console.log('✅ Notificação enviada:', notification.type);
    } catch (error) {
      console.error('❌ Erro ao enviar notificação:', error);
    }
  }

  async getNotifications(userId: string): Promise<ServiceNotification[]> {
    try {
      const q = query(
        collection(db, this.NOTIFICATIONS_COLLECTION),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as ServiceNotification[];
    } catch (error) {
      console.error('❌ Erro ao buscar notificações:', error);
      return [];
    }
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      await updateDoc(doc(db, this.NOTIFICATIONS_COLLECTION, notificationId), {
        read: true
      });
    } catch (error) {
      console.error('❌ Erro ao marcar notificação como lida:', error);
    }
  }

  // ==================== LEMBRETES ====================
  private scheduleReminder(serviceId: string, service: ServiceRequest): void {
    const scheduledTime = new Date(service.scheduledDate);
    scheduledTime.setHours(parseInt(service.scheduledTime.split(':')[0]));
    scheduledTime.setMinutes(parseInt(service.scheduledTime.split(':')[1]));

    const reminderTime = new Date(scheduledTime.getTime() - 10 * 60 * 1000); // 10 minutos antes
    const now = new Date();

    if (reminderTime > now) {
      const delay = reminderTime.getTime() - now.getTime();
      
      setTimeout(async () => {
        try {
          // Atualizar status para scheduled
          await updateDoc(doc(db, this.SERVICES_COLLECTION, serviceId), {
            status: 'scheduled',
            'notificationsSent.reminder10min': serverTimestamp()
          });

          // Enviar lembrete para profissional
          await this.sendNotification({
            userId: service.professionalId,
            serviceId,
            type: 'reminder',
            title: '⏰ Lembrete: Serviço em 10 minutos!',
            message: `Serviço com ${service.clientName} às ${service.scheduledTime}`,
            read: false,
            createdAt: new Date(),
            actionUrl: `/dashboard/servicos/${serviceId}`
          });

          // Enviar lembrete para cliente
          await this.sendNotification({
            userId: service.clientId,
            serviceId,
            type: 'reminder',
            title: '⏰ Lembrete: Profissional chegando em breve!',
            message: `${service.professionalName} deve chegar às ${service.scheduledTime}`,
            read: false,
            createdAt: new Date(),
            actionUrl: `/dashboard/servicos/${serviceId}`
          });

          console.log('✅ Lembretes enviados para serviço:', serviceId);
        } catch (error) {
          console.error('❌ Erro ao enviar lembretes:', error);
        }
      }, delay);

      console.log(`⏰ Lembrete agendado para ${reminderTime.toLocaleString()}`);
    }
  }

  // ==================== CANCELAR SERVIÇO ====================
  async cancelService(
    serviceId: string, 
    userId: string, 
    userName: string,
    reason: string
  ): Promise<void> {
    try {
      const serviceRef = doc(db, this.SERVICES_COLLECTION, serviceId);
      const serviceDoc = await getDoc(serviceRef);

      if (!serviceDoc.exists()) {
        throw new Error('Serviço não encontrado');
      }

      const service = serviceDoc.data() as ServiceRequest;

      if (service.clientId !== userId && service.professionalId !== userId) {
        throw new Error('Você não tem permissão para cancelar este serviço');
      }

      if (service.status === 'completed' || service.status === 'paid') {
        throw new Error('Não é possível cancelar um serviço já concluído');
      }

      const statusChange: StatusChange = {
        from: service.status,
        to: 'cancelled',
        timestamp: new Date(),
        userId,
        userName,
        notes: `Cancelado: ${reason}`
      };

      await updateDoc(serviceRef, {
        status: 'cancelled',
        statusHistory: [...(service.statusHistory || []), {
          ...statusChange,
          timestamp: Timestamp.now()
        }]
      });

      // Notificar a outra parte
      const otherUserId = userId === service.clientId ? service.professionalId : service.clientId;
      const otherUserName = userId === service.clientId ? service.professionalName : service.clientName;
      const otherUserEmail = userId === service.clientId ? service.professionalEmail : service.clientEmail;

      // 1. Enviar notificação no sino
      await notificationService.notifyServiceCancelled(
        otherUserId,
        userName,
        service.serviceType,
        reason
      );

      // 2. Enviar email (apenas se foi o cliente que cancelou e o destinatário é o profissional)
      if (userId === service.clientId && otherUserEmail) {
        try {
          await emailService.sendCancellationEmail(
            otherUserEmail,
            otherUserName,
            userName,
            service.serviceType,
            reason
          );
          console.log('✅ Email de cancelamento enviado para:', otherUserEmail);
        } catch (emailError) {
          console.error('⚠️ Erro ao enviar email (continuando):', emailError);
          // Não falha a operação se o email não for enviado
        }
      }

      console.log('✅ Serviço cancelado:', serviceId);
    } catch (error) {
      console.error('❌ Erro ao cancelar serviço:', error);
      throw error;
    }
  }
}

export const serviceFlowService = new ServiceFlowService();
