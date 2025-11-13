import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
  addDoc,
  Timestamp,
  onSnapshot,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import { Chat, Message } from "../types/chat";

export const chatService = {
  // Criar ID único para conversa
  getChatId(userId1: string, userId2: string): string {
    return [userId1, userId2].sort().join("_");
  },

  // Criar ou obter conversa
  async getOrCreateChat(
    userId1: string,
    userId2: string,
    user1Info: { name: string; photo: string },
    user2Info: { name: string; photo: string }
  ): Promise<string> {
    const chatId = this.getChatId(userId1, userId2);
    const chatRef = doc(db, "chats", chatId);
    const chatDoc = await getDoc(chatRef);

    if (!chatDoc.exists()) {
      await setDoc(chatRef, {
        participants: [userId1, userId2],
        participantsInfo: {
          [userId1]: user1Info,
          [userId2]: user2Info,
        },
        lastMessage: "",
        lastMessageAt: Timestamp.now(),
        createdAt: Timestamp.now(),
      });

      // Inicializar presença para ambos os usuários se não existir
      await this.initializePresenceForUsers([userId1, userId2]);
    }

    return chatId;
  },

  // Inicializar presença para usuários (se não existir)
  async initializePresenceForUsers(userIds: string[]) {
    try {
      const presencePromises = userIds.map(async (userId) => {
        const presenceRef = doc(db, "presence", userId);
        const presenceDoc = await getDoc(presenceRef);
        
        // Só criar se não existir
        if (!presenceDoc.exists()) {
          await setDoc(presenceRef, {
            online: false,
            lastSeen: Timestamp.now(),
            userId,
          });
          console.log("✅ Presença inicializada para:", userId);
        }
      });

      await Promise.all(presencePromises);
    } catch (error) {
      console.error("Erro ao inicializar presença:", error);
    }
  },

  // Enviar mensagem de texto
  async sendMessage(
    chatId: string,
    senderId: string,
    senderName: string,
    senderPhoto: string,
    text: string
  ) {
    // Adicionar mensagem
    await addDoc(collection(db, "chats", chatId, "messages"), {
      text: text.trim(),
      senderId,
      senderName,
      senderPhoto,
      type: "text",
      createdAt: Timestamp.now(),
    });

    // Atualizar última mensagem
    await setDoc(
      doc(db, "chats", chatId),
      {
        lastMessage: text.trim(),
        lastMessageAt: Timestamp.now(),
      },
      { merge: true }
    );

    // Limpar indicador de digitação
    await this.setTyping(chatId, senderId, false);
  },

  // Enviar mensagem de voz
  async sendVoiceMessage(
    chatId: string,
    senderId: string,
    senderName: string,
    senderPhoto: string,
    audioBlob: Blob,
    duration: number
  ) {
    try {
      // Verificar se storage está disponível
      if (!storage) {
        throw new Error("Firebase Storage não está disponível");
      }

      // Upload do áudio para o Firebase Storage
      const timestamp = Date.now();
      const audioRef = ref(storage, `voice-messages/${chatId}/${senderId}_${timestamp}.webm`);
      await uploadBytes(audioRef, audioBlob);
      const voiceUrl = await getDownloadURL(audioRef);

      // Adicionar mensagem
      await addDoc(collection(db, "chats", chatId, "messages"), {
        text: "🎤 Mensagem de voz",
        senderId,
        senderName,
        senderPhoto,
        type: "voice",
        voiceUrl,
        voiceDuration: duration,
        createdAt: Timestamp.now(),
      });

      // Atualizar última mensagem
      await setDoc(
        doc(db, "chats", chatId),
        {
          lastMessage: "🎤 Mensagem de voz",
          lastMessageAt: Timestamp.now(),
        },
        { merge: true }
      );

      return voiceUrl;
    } catch (error) {
      console.error("Erro ao enviar mensagem de voz:", error);
      throw error;
    }
  },

  // Atualizar status de digitação
  async setTyping(chatId: string, userId: string, isTyping: boolean) {
    try {
      const chatRef = doc(db, "chats", chatId);
      await updateDoc(chatRef, {
        [`typing.${userId}`]: isTyping,
      });
    } catch (error) {
      console.error("Erro ao atualizar status de digitação:", error);
    }
  },

  // Listener para status de digitação
  subscribeToTyping(chatId: string, callback: (typing: { [userId: string]: boolean }) => void) {
    const chatRef = doc(db, "chats", chatId);
    
    return onSnapshot(chatRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        callback(data.typing || {});
      }
    });
  },

  // Buscar conversas do usuário (SEM orderBy para evitar índice)
  async getUserChats(userId: string): Promise<Chat[]> {
    const chatsQuery = query(
      collection(db, "chats"),
      where("participants", "array-contains", userId)
    );

    const snapshot = await getDocs(chatsQuery);
    const chats: Chat[] = [];

    snapshot.forEach((doc) => {
      chats.push({ id: doc.id, ...doc.data() } as Chat);
    });

    // Ordenar no código JavaScript
    chats.sort((a, b) => {
      const timeA = a.lastMessageAt?.toMillis ? a.lastMessageAt.toMillis() : 0;
      const timeB = b.lastMessageAt?.toMillis ? b.lastMessageAt.toMillis() : 0;
      return timeB - timeA;
    });

    return chats;
  },

  // Listener em tempo real para mensagens (SEM orderBy para evitar índice)
  subscribeToMessages(
    chatId: string,
    callback: (messages: Message[]) => void
  ) {
    const messagesQuery = query(
      collection(db, "chats", chatId, "messages")
    );

    return onSnapshot(messagesQuery, (snapshot) => {
      const messages: Message[] = [];
      snapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() } as Message);
      });
      
      // Ordenar no código JavaScript
      messages.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeA - timeB;
      });
      
      callback(messages);
    });
  },

  // Listener em tempo real para conversas do usuário (SEM orderBy para evitar índice)
  subscribeToUserChats(userId: string, callback: (chats: Chat[]) => void) {
    const chatsQuery = query(
      collection(db, "chats"),
      where("participants", "array-contains", userId)
    );

    return onSnapshot(chatsQuery, (snapshot) => {
      const chats: Chat[] = [];
      snapshot.forEach((doc) => {
        chats.push({ id: doc.id, ...doc.data() } as Chat);
      });
      
      // Ordenar no código JavaScript
      chats.sort((a, b) => {
        const timeA = a.lastMessageAt?.toMillis ? a.lastMessageAt.toMillis() : 0;
        const timeB = b.lastMessageAt?.toMillis ? b.lastMessageAt.toMillis() : 0;
        return timeB - timeA;
      });
      
      callback(chats);
    });
  },

  // Arquivar conversa
  async archiveChat(chatId: string, userId: string, archive: boolean) {
    try {
      const chatRef = doc(db, "chats", chatId);
      await updateDoc(chatRef, {
        [`archived.${userId}`]: archive,
      });
    } catch (error) {
      console.error("Erro ao arquivar conversa:", error);
      throw error;
    }
  },

  // Fixar conversa
  async pinChat(chatId: string, userId: string, pin: boolean) {
    try {
      const chatRef = doc(db, "chats", chatId);
      await updateDoc(chatRef, {
        [`pinned.${userId}`]: pin,
      });
    } catch (error) {
      console.error("Erro ao fixar conversa:", error);
      throw error;
    }
  },

  // Silenciar conversa
  async muteChat(chatId: string, userId: string, mute: boolean) {
    try {
      const chatRef = doc(db, "chats", chatId);
      await updateDoc(chatRef, {
        [`muted.${userId}`]: mute,
      });
    } catch (error) {
      console.error("Erro ao silenciar conversa:", error);
      throw error;
    }
  },

  // Deletar conversa (apenas para o usuário)
  async deleteChat(chatId: string, userId: string) {
    try {
      // Não deletamos a conversa, apenas arquivamos e marcamos como deletada
      const chatRef = doc(db, "chats", chatId);
      await updateDoc(chatRef, {
        [`archived.${userId}`]: true,
        [`deleted.${userId}`]: true,
      });
    } catch (error) {
      console.error("Erro ao deletar conversa:", error);
      throw error;
    }
  },

  // Marcar mensagens como lidas
  async markAsRead(chatId: string, userId: string) {
    try {
      const chatRef = doc(db, "chats", chatId);
      await updateDoc(chatRef, {
        [`unreadCount.${userId}`]: 0,
        [`lastReadAt.${userId}`]: Timestamp.now(),
      });
    } catch (error) {
      console.error("Erro ao marcar como lida:", error);
    }
  },
};
