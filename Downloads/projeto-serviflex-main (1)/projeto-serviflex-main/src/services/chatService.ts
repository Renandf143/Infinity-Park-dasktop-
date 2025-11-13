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
        typing: {
          [userId1]: false,
          [userId2]: false,
        },
        unreadCount: {
          [userId1]: 0,
          [userId2]: 0,
        },
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

  async setTyping(chatId: string, userId: string, isTyping: boolean) {
    const chatRef = doc(db, "chats", chatId);
    await setDoc(
      chatRef,
      {
        typing: {
          [userId]: isTyping,
        },
      },
      { merge: true }
    );
  },

  subscribeToTyping(
    chatId: string,
    callback: (typing: { [userId: string]: boolean }) => void
  ) {
    const chatRef = doc(db, "chats", chatId);
    return onSnapshot(chatRef, (snapshot) => {
      const data = snapshot.data();
      if (data?.typing) {
        callback(data.typing);
      }
    });
  },

  async markAsRead(chatId: string, userId: string) {
    const chatRef = doc(db, "chats", chatId);
    await setDoc(
      chatRef,
      {
        unreadCount: {
          [userId]: 0,
        },
      },
      { merge: true }
    );
  },

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

    chats.sort((a, b) => {
      const timeA = a.lastMessageAt?.toMillis() || 0;
      const timeB = b.lastMessageAt?.toMillis() || 0;
      return timeB - timeA;
    });

    return chats;
  },

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
      
      messages.sort((a, b) => {
        const timeA = a.createdAt?.toMillis() || 0;
        const timeB = b.createdAt?.toMillis() || 0;
        return timeA - timeB;
      });
      
      callback(messages);
    });
  },

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
      
      chats.sort((a, b) => {
        const timeA = a.lastMessageAt?.toMillis() || 0;
        const timeB = b.lastMessageAt?.toMillis() || 0;
        return timeB - timeA;
      });
      
      callback(chats);
    });
  },
};
