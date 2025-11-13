import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * 🟢 Serviço de Status Online
 * Mantém o status online dos profissionais atualizado
 */
class OnlineStatusService {
  private intervalId: NodeJS.Timeout | null = null;
  private userId: string | null = null;
  private userType: string | null = null;

  /**
   * Iniciar rastreamento de status online
   */
  startTracking(userId: string, userType: string) {
    this.userId = userId;
    this.userType = userType;

    // Só rastrear se for profissional
    if (userType !== 'professional') {
      return;
    }

    console.log('🟢 Iniciando rastreamento de status online');

    // Atualizar imediatamente
    this.updateStatus();

    // Atualizar a cada 2 minutos
    this.intervalId = setInterval(() => {
      this.updateStatus();
    }, 2 * 60 * 1000);

    // Atualizar quando a janela ganhar foco
    window.addEventListener('focus', this.handleFocus);

    // Atualizar status ao sair
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  }

  /**
   * Parar rastreamento
   */
  stopTracking() {
    console.log('🔴 Parando rastreamento de status online');

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    window.removeEventListener('focus', this.handleFocus);
    window.removeEventListener('beforeunload', this.handleBeforeUnload);

    this.userId = null;
    this.userType = null;
  }

  /**
   * Atualizar status online
   */
  private async updateStatus() {
    if (!this.userId || this.userType !== 'professional') {
      return;
    }

    try {
      await updateDoc(doc(db, 'serviceProviders', this.userId), {
        lastActive: new Date(),
        updatedAt: new Date().toISOString()
      });
      console.log('✅ Status online atualizado');
    } catch (error) {
      console.warn('⚠️ Erro ao atualizar status online:', error);
    }
  }

  /**
   * Handler para quando a janela ganha foco
   */
  private handleFocus = () => {
    this.updateStatus();
  };

  /**
   * Handler para antes de sair da página
   */
  private handleBeforeUnload = () => {
    // Não podemos fazer chamadas assíncronas aqui
    // Mas podemos tentar enviar um beacon
    if (this.userId && this.userType === 'professional') {
      const data = JSON.stringify({
        lastActive: new Date().toISOString()
      });
      
      // Usar sendBeacon se disponível
      if (navigator.sendBeacon) {
        // Nota: Isso requer um endpoint no backend
        // Por enquanto, apenas logamos
        console.log('📡 Enviando status final');
      }
    }
  };
}

export const onlineStatusService = new OnlineStatusService();
