import { Timestamp } from "firebase/firestore";

export interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  senderPhoto?: string;
  createdAt: Timestamp;
  type?: "text" | "voice";
  voiceUrl?: string;
  voiceDuration?: number;
}

export interface Chat {
  id: string;
  participants: string[];
  participantsInfo: {
    [userId: string]: {
      name: string;
      photo: string;
    };
  };
  lastMessage: string;
  lastMessageAt: Timestamp;
  createdAt: Timestamp;
  typing?: {
    [userId: string]: boolean;
  };
  archived?: {
    [userId: string]: boolean;
  };
  pinned?: {
    [userId: string]: boolean;
  };
  muted?: {
    [userId: string]: boolean;
  };
}
