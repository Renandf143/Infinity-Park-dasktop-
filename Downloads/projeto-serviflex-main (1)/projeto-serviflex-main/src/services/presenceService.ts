import { doc, setDoc, onSnapshot, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

interface UserPresence {
  online: boolean;
  lastSeen: any;
  userId: string;
}

class PresenceService {
  private unsubscribeMap: Map<string, () => void> = new Map();
  private currentUserId: string | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  /**
   * Iniciar presença online para o usuário atual
   */
  async startPresence(userId: string) {
    // Se já está rodando para este usuário, não iniciar novamente
    if (this.currentUserId === userId && this.heartbeatInterval) {
      return;
    }

    // Parar presença anterior se existir
    if (this.currentUserId && this.currentUserId !== userId) {
      await this.stopPresence();
    }

    this.currentUserId = userId;

    try {
      // Marcar como online
      await setDoc(
        doc(db, "presence", userId),
        {
          online: true,
          lastSeen: serverTimestamp(),
          userId,
        },
        { merge: true }
      );

      // Atualizar a cada 20 segundos (mais frequente para melhor precisão)
      this.heartbeatInterval = setInterval(async () => {
        if (this.currentUserId) {
          try {
            await updateDoc(doc(db, "presence", this.currentUserId), {
              online: true,
              lastSeen: serverTimestamp(),
            });
          } catch (error) {
            console.error("Erro no heartbeat:", error);
          }
        }
      }, 20000);

      // Marcar como offline ao sair
      window.addEventListener("beforeunload", this.handleBeforeUnload);
      document.addEventListener("visibilitychange", this.handleVisibilityChange);

      console.log("✅ Presença online iniciada para:", userId);
    } catch (error) {
      console.error("Erro ao iniciar presença:", error);
    }
  }

  /**
   * Parar presença online
   */
  async stopPresence() {
    if (this.currentUserId) {
      try {
        await setDoc(
          doc(db, "presence", this.currentUserId),
          {
            online: false,
            lastSeen: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (error) {
        console.error("Erro ao parar presença:", error);
      }
    }

    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    window.removeEventListener("beforeunload", this.handleBeforeUnload);
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);

    this.currentUserId = null;
    console.log("🔴 Presença online parada");
  }

  /**
   * Observar presença de um usuário
   */
  subscribeToUserPresence(
    userId: string,
    callback: (presence: UserPresence | null) => void
  ) {
    const presenceRef = doc(db, "presence", userId);

    const unsubscribe = onSnapshot(
      presenceRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as UserPresence;
          
          // Considerar online se:
          // 1. O campo online está true
          // 2. A última atualização foi há menos de 1 minuto (mais rigoroso)
          const lastSeen = data.lastSeen?.toDate ? data.lastSeen.toDate() : new Date(0);
          const now = new Date();
          const diffSeconds = (now.getTime() - lastSeen.getTime()) / 1000;
          
          const isOnline = data.online && diffSeconds < 60;
          
          callback({
            ...data,
            online: isOnline,
          });
        } else {
          // Se não existe documento, criar um offline
          callback({
            online: false,
            lastSeen: null,
            userId,
          });
        }
      },
      (error) => {
        console.error("Erro ao observar presença:", error);
        callback(null);
      }
    );

    this.unsubscribeMap.set(userId, unsubscribe);
    return unsubscribe;
  }

  /**
   * Parar de observar presença de um usuário
   */
  unsubscribeFromUserPresence(userId: string) {
    const unsubscribe = this.unsubscribeMap.get(userId);
    if (unsubscribe) {
      unsubscribe();
      this.unsubscribeMap.delete(userId);
    }
  }

  /**
   * Observar presença de múltiplos usuários
   */
  subscribeToMultiplePresences(
    userIds: string[],
    callback: (presences: Map<string, UserPresence | null>) => void
  ) {
    const presencesMap = new Map<string, UserPresence | null>();
    const unsubscribes: (() => void)[] = [];

    // Inicializar todos como offline primeiro
    userIds.forEach((userId) => {
      presencesMap.set(userId, {
        online: false,
        lastSeen: null,
        userId,
      });
    });

    // Chamar callback inicial
    callback(new Map(presencesMap));

    // Subscrever para cada usuário
    userIds.forEach((userId) => {
      const unsubscribe = this.subscribeToUserPresence(userId, (presence) => {
        presencesMap.set(userId, presence);
        callback(new Map(presencesMap));
      });
      unsubscribes.push(unsubscribe);
    });

    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
  }

  /**
   * Handler para antes de sair da página
   */
  private handleBeforeUnload = () => {
    if (this.currentUserId) {
      // Usar sendBeacon para garantir que a requisição seja enviada
      const data = JSON.stringify({
        online: false,
        lastSeen: new Date().toISOString(),
      });

      // Tentar marcar como offline (pode não funcionar sempre)
      navigator.sendBeacon(
        `/api/presence/${this.currentUserId}/offline`,
        data
      );
    }
  };

  /**
   * Handler para mudança de visibilidade da página
   */
  private handleVisibilityChange = async () => {
    if (document.hidden) {
      // Página ficou oculta - manter online mas atualizar lastSeen
      if (this.currentUserId) {
        try {
          await updateDoc(doc(db, "presence", this.currentUserId), {
            online: true,
            lastSeen: serverTimestamp(),
          });
        } catch (error) {
          console.error("Erro ao atualizar presença (hidden):", error);
        }
      }
    } else {
      // Página ficou visível - garantir que está online
      if (this.currentUserId) {
        try {
          await updateDoc(doc(db, "presence", this.currentUserId), {
            online: true,
            lastSeen: serverTimestamp(),
          });
        } catch (error) {
          console.error("Erro ao atualizar presença (visible):", error);
        }
      }
    }
  };

  /**
   * Verificar se um usuário está online (sem listener)
   */
  async isUserOnline(userId: string): Promise<boolean> {
    try {
      const presenceRef = doc(db, "presence", userId);
      const snapshot = await import("firebase/firestore").then((m) =>
        m.getDoc(presenceRef)
      );

      if (snapshot.exists()) {
        const data = snapshot.data() as UserPresence;
        const lastSeen = data.lastSeen?.toDate
          ? data.lastSeen.toDate()
          : new Date(0);
        const now = new Date();
        const diffMinutes = (now.getTime() - lastSeen.getTime()) / 1000 / 60;

        return data.online && diffMinutes < 2;
      }

      return false;
    } catch (error) {
      console.error("Erro ao verificar status online:", error);
      return false;
    }
  }
}

export const presenceService = new PresenceService();
