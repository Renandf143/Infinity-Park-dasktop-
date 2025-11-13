// VERSÃO TEMPORÁRIA SEM ÍNDICES
// Use este arquivo se os índices demorarem muito para serem criados
// Renomeie para chatService.ts para usar

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
} from "firebase/firestore";
import { db } from "../firebase";
import { Chat, Message } from "../types/chat";

export const chatService = {
  getChatId(userId1: string, userId2: string): string {
    return [userId1, userId2].sort().join("_");
  },

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
    }

    return chatId;
  },

  async sendMessage(
    chatId: string,
    senderId: string,
    senderName: string,
    senderPhoto: string,
    text: string
  ) {
    await addDoc(collection(db, "chats", chatId, "messages"), {
      text: text.trim(),
      senderId,
      senderName,
      senderPhoto,
      createdAt: Timestamp.now(),
    });

    await setDoc(
      doc(db, "chats", chatId),
      {
        lastMessage: text.trim(),
        lastMessageAt: Timestamp.now(),
      },
      { merge: true }
    );
  },

  // SEM orderBy - ordena no cliente
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

    // Ordenar no cliente
    chats.sort((a, b) => {
      const timeA = a.lastMessageAt?.toMillis() || 0;
      const timeB = b.lastMessageAt?.toMillis() || 0;
      return timeB - timeA;
    });

    return chats;
  },

  // SEM orderBy - ordena no cliente
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
      
      // Ordenar no cliente
      messages.sort((a, b) => {
        const timeA = a.createdAt?.toMillis() || 0;
        const timeB = b.createdAt?.toMillis() || 0;
        return timeA - timeB;
      });
      
      callback(messages);
    });
  },

  // SEM orderBy - ordena no cliente
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
      
      // Ordenar no cliente
      chats.sort((a, b) => {
        const timeA = a.lastMessageAt?.toMillis() || 0;
        const timeB = b.lastMessageAt?.toMillis() || 0;
        return timeB - timeA;
      });
      
      callback(chats);
    });
  },
};
