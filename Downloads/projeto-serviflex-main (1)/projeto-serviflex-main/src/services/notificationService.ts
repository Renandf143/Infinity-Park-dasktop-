import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  Timestamp,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";

export interface Notification {
  id?: string;
  userId: string;
  title: string;
  message: string;
  type: "service" | "message" | "payment" | "review" | "system";
  read: boolean;
  createdAt: Date | Timestamp;
  data?: any;
  link?: string;
}

class NotificationService {
  // Criar notificação
  async createNotification(
    notification: Omit<Notification, "id" | "createdAt" | "read">
  ): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, "notifications"), {
        ...notification,
        read: false,
        createdAt: Timestamp.now(),
      });

      console.log("✅ Notificação criada:", docRef.id);

      // Tentar enviar notificação push se disponível
      this.sendPushNotification(notification);

      return docRef.id;
    } catch (error) {
      console.error("❌ Erro ao criar notificação:", error);
      throw error;
    }
  }

  // Enviar notificação push (Web Push API)
  private async sendPushNotification(
    notification: Omit<Notification, "id" | "createdAt" | "read">
  ) {
    try {
      // Verificar se o navegador suporta notificações
      if (!("Notification" in window)) {
        console.log("Navegador não suporta notificações");
        return;
      }

      // Verificar permissão
      if (Notification.permission === "granted") {
        new Notification(notification.title, {
          body: notification.message,
          icon: "/logo-serviflex.png",
          badge: "/logo-serviflex.png",
          tag: notification.type,
          requireInteraction: false,
          silent: false,
        });
      } else if (Notification.permission !== "denied") {
        // Solicitar permissão
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          new Notification(notification.title, {
            body: notification.message,
            icon: "/logo-serviflex.png",
          });
        }
      }
    } catch (error) {
      console.error("Erro ao enviar push notification:", error);
    }
  }

  // Solicitar permissão para notificações
  async requestPermission(): Promise<NotificationPermission> {
    if (!("Notification" in window)) {
      console.log("Navegador não suporta notificações");
      return "denied";
    }

    if (Notification.permission === "granted") {
      return "granted";
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      return permission;
    }

    return Notification.permission;
  }

  // Buscar notificações do usuário
  async getUserNotifications(
    userId: string,
    limitCount: number = 50
  ): Promise<Notification[]> {
    try {
      const q = query(
        collection(db, "notifications"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      const notifications: Notification[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        notifications.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as Notification);
      });

      return notifications;
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
      return [];
    }
  }

  // Listener em tempo real para notificações
  subscribeToNotifications(
    userId: string,
    callback: (notifications: Notification[]) => void
  ): () => void {
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(50)
    );

    return onSnapshot(q, (snapshot) => {
      const notifications: Notification[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        notifications.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as Notification);
      });

      callback(notifications);
    });
  }

  // Marcar notificação como lida
  async markAsRead(notificationId: string): Promise<void> {
    try {
      await updateDoc(doc(db, "notifications", notificationId), {
        read: true,
      });
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error);
      throw error;
    }
  }

  // Marcar todas como lidas
  async markAllAsRead(userId: string): Promise<void> {
    try {
      const q = query(
        collection(db, "notifications"),
        where("userId", "==", userId),
        where("read", "==", false)
      );

      const snapshot = await getDocs(q);
      const promises = snapshot.docs.map((doc) =>
        updateDoc(doc.ref, { read: true })
      );

      await Promise.all(promises);
    } catch (error) {
      console.error("Erro ao marcar todas como lidas:", error);
      throw error;
    }
  }

  // Notificações específicas por tipo de evento

  async notifyNewServiceRequest(
    professionalId: string,
    clientName: string,
    serviceType: string,
    serviceId: string
  ) {
    return this.createNotification({
      userId: professionalId,
      title: "🔔 Nova Solicitação de Serviço!",
      message: `${clientName} solicitou um serviço de ${serviceType}`,
      type: "service",
      link: `/profissional/servicos`,
      data: { serviceId },
    });
  }

  async notifyServiceAccepted(
    clientId: string,
    professionalName: string,
    serviceType: string,
    serviceId: string
  ) {
    return this.createNotification({
      userId: clientId,
      title: "✅ Serviço Aceito!",
      message: `${professionalName} aceitou seu pedido de ${serviceType}`,
      type: "service",
      link: `/cliente/servicos`,
      data: { serviceId },
    });
  }

  async notifyServiceStarted(
    clientId: string,
    professionalName: string,
    serviceType: string,
    serviceId: string
  ) {
    return this.createNotification({
      userId: clientId,
      title: "🚀 Serviço Iniciado!",
      message: `${professionalName} iniciou o serviço de ${serviceType}`,
      type: "service",
      link: `/cliente/servicos`,
      data: { serviceId },
    });
  }

  async notifyServiceCompleted(
    clientId: string,
    professionalName: string,
    serviceType: string,
    serviceId: string,
    pixKey: string
  ) {
    return this.createNotification({
      userId: clientId,
      title: "✨ Serviço Concluído!",
      message: `${professionalName} concluiu o serviço. Realize o pagamento via PIX.`,
      type: "payment",
      link: `/cliente/servicos`,
      data: { serviceId, pixKey },
    });
  }

  async notifyPaymentConfirmed(
    professionalId: string,
    clientName: string,
    amount: number,
    serviceId: string
  ) {
    return this.createNotification({
      userId: professionalId,
      title: "💰 Pagamento Confirmado!",
      message: `${clientName} confirmou o pagamento de R$ ${amount.toFixed(2)}`,
      type: "payment",
      link: `/profissional/servicos`,
      data: { serviceId, amount },
    });
  }

  async notifyNewMessage(userId: string, senderName: string, chatId: string) {
    return this.createNotification({
      userId,
      title: "💬 Nova Mensagem",
      message: `${senderName} enviou uma mensagem`,
      type: "message",
      link: `/cliente/mensagens?chatId=${chatId}`,
      data: { chatId },
    });
  }

  async notifyNewReview(
    professionalId: string,
    clientName: string,
    rating: number
  ) {
    return this.createNotification({
      userId: professionalId,
      title: "⭐ Nova Avaliação!",
      message: `${clientName} avaliou seu serviço com ${rating} estrelas`,
      type: "review",
      link: `/profissional/${professionalId}#avaliacoes`,
    });
  }

  async notifyServiceCancelled(
    userId: string,
    otherUserName: string,
    serviceType: string,
    reason: string
  ) {
    return this.createNotification({
      userId,
      title: "❌ Serviço Cancelado",
      message: `${otherUserName} cancelou o serviço de ${serviceType}. Motivo: ${reason}`,
      type: "service",
      link: `/cliente/servicos`,
    });
  }

  async notifyServiceStartingSoon(
    professionalId: string,
    serviceType: string,
    clientName: string,
    time: string
  ) {
    return this.createNotification({
      userId: professionalId,
      title: "⏰ Serviço em Breve!",
      message: `Seu serviço de ${serviceType} com ${clientName} começa às ${time}`,
      type: "service",
      link: `/profissional/servicos`,
    });
  }
}

export const notificationService = new NotificationService();
