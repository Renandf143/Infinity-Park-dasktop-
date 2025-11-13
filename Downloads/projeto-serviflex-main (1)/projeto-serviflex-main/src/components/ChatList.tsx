import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { MessageCircle, Search, X } from 'lucide-react';
import { ChatModal } from './ChatModal';

interface Chat {
  id: string;
  participants: string[];
  participantsInfo: {
    [key: string]: {
      name: string;
      photo: string;
      online: boolean;
      lastSeen: Timestamp | null;
    };
  };
  lastMessage: string;
  lastMessageAt: Timestamp;
  unreadCount: {
    [key: string]: number;
  };
}

interface ChatListProps {
  currentUserId: string;
  currentUserName: string;
  currentUserPhoto?: string;
}

export function ChatList({ currentUserId, currentUserName, currentUserPhoto }: ChatListProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [showChatModal, setShowChatModal] = useState(false);

  useEffect(() => {
    // Buscar conversas do usuário
    const chatsQuery = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', currentUserId),
      orderBy('lastMessageAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      chatsQuery,
      (snapshot) => {
        const chatsList: Chat[] = [];
        snapshot.forEach((doc) => {
          chatsList.push({ id: doc.id, ...doc.data() } as Chat);
        });
        setChats(chatsList);
        setLoading(false);
      },
      (error) => {
        console.error('Erro ao carregar conversas:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUserId]);

  const filteredChats = chats.filter((chat) => {
    const otherUserId = chat.participants.find((id) => id !== currentUserId);
    if (!otherUserId) return false;
    const otherUser = chat.participantsInfo[otherUserId];
    return otherUser?.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleOpenChat = (chat: Chat) => {
    setSelectedChat(chat);
    setShowChatModal(true);
  };

  const getOtherUser = (chat: Chat) => {
    const otherUserId = chat.participants.find((id) => id !== currentUserId);
    return otherUserId ? chat.participantsInfo[otherUserId] : null;
  };

  const formatTime = (timestamp: Timestamp) => {
    if (!timestamp?.toDate) return '';
    const date = timestamp.toDate();
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Agora';
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-blue-600" />
              Mensagens
            </h3>
            {chats.reduce((sum, chat) => sum + (chat.unreadCount[currentUserId] || 0), 0) > 0 && (
              <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                {chats.reduce((sum, chat) => sum + (chat.unreadCount[currentUserId] || 0), 0)}
              </span>
            )}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar conversas..."
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Chat List */}
        <div className="max-h-[500px] overflow-y-auto">
          {filteredChats.length === 0 ? (
            <div className="p-8 text-center">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">
                {searchTerm ? 'Nenhuma conversa encontrada' : 'Nenhuma mensagem ainda'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredChats.map((chat) => {
                const otherUser = getOtherUser(chat);
                if (!otherUser) return null;

                const unreadCount = chat.unreadCount[currentUserId] || 0;

                return (
                  <button
                    key={chat.id}
                    onClick={() => handleOpenChat(chat)}
                    className="w-full p-4 hover:bg-gray-50 transition-colors text-left flex gap-3"
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      {otherUser.photo ? (
                        <img
                          src={otherUser.photo}
                          alt={otherUser.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">
                            {otherUser.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      {otherUser.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`font-semibold text-gray-900 truncate ${unreadCount > 0 ? 'font-bold' : ''}`}>
                          {otherUser.name}
                        </h4>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                          {formatTime(chat.lastMessageAt)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className={`text-sm truncate ${unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                          {chat.lastMessage || 'Sem mensagens'}
                        </p>
                        {unreadCount > 0 && (
                          <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs font-bold rounded-full flex-shrink-0">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Chat Modal */}
      {showChatModal && selectedChat && (
        <ChatModal
          isOpen={showChatModal}
          onClose={() => {
            setShowChatModal(false);
            setSelectedChat(null);
          }}
          professionalId={selectedChat.participants.find((id) => id !== currentUserId) || ''}
          professionalName={getOtherUser(selectedChat)?.name || ''}
          professionalPhoto={getOtherUser(selectedChat)?.photo}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
          currentUserPhoto={currentUserPhoto}
        />
      )}
    </>
  );
}
