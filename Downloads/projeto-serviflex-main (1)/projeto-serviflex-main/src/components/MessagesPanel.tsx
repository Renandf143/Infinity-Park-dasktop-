import { useState, useEffect, useRef } from "react";
import { chatService } from "../services/chatService";
import { Chat, Message } from "../types/chat";
import {
  MessageCircleIcon,
  Send,
  Loader2Icon,
  Search,
  X,
} from "lucide-react";

interface MessagesPanelProps {
  currentUserId: string;
  currentUserName: string;
  currentUserPhoto?: string;
  autoOpenUserId?: string | null;
}

export function MessagesPanel({
  currentUserId,
  currentUserName,
  currentUserPhoto,
  autoOpenUserId,
}: MessagesPanelProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Carregar conversas
  useEffect(() => {
    setLoading(true);

    const unsubscribe = chatService.subscribeToUserChats(
      currentUserId,
      (updatedChats) => {
        setChats(updatedChats);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUserId]);

  // Auto-abrir chat quando autoOpenUserId é fornecido (pode ser chatId ou userId)
  useEffect(() => {
    if (autoOpenUserId && chats.length > 0) {
      // Primeiro tenta encontrar por chatId direto
      let chatToOpen = chats.find(chat => chat.id === autoOpenUserId);
      
      // Se não encontrar, tenta por participante
      if (!chatToOpen) {
        chatToOpen = chats.find(chat => 
          chat.participants.includes(autoOpenUserId)
        );
      }
      
      if (chatToOpen) {
        setSelectedChat(chatToOpen);
      }
    }
  }, [autoOpenUserId, chats]);

  // Carregar mensagens da conversa selecionada
  useEffect(() => {
    if (!selectedChat) {
      setMessages([]);
      return;
    }

    const unsubscribe = chatService.subscribeToMessages(
      selectedChat.id,
      (updatedMessages) => {
        setMessages(updatedMessages);
      }
    );

    return () => unsubscribe();
  }, [selectedChat]);

  // Auto scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !selectedChat || sending) return;

    setSending(true);
    try {
      await chatService.sendMessage(
        selectedChat.id,
        currentUserId,
        currentUserName,
        currentUserPhoto || "",
        newMessage
      );

      setNewMessage("");
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      alert("Erro ao enviar mensagem");
    } finally {
      setSending(false);
    }
  };

  const filteredChats = chats.filter((chat) => {
    const otherUserId = chat.participants.find((id) => id !== currentUserId);
    const otherUserInfo = otherUserId
      ? chat.participantsInfo[otherUserId]
      : null;
    return (
      otherUserInfo?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2Icon className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 h-[calc(100vh-220px)] flex overflow-hidden">
      {/* Lista de Conversas */}
      <div className="w-full md:w-96 border-r border-gray-200 flex flex-col bg-gray-50">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            Conversas
          </h3>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar conversas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:bg-gray-100 rounded p-1"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* Lista */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.length === 0 ? (
            <div className="text-center p-12">
              <MessageCircleIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm
                  ? "Nenhuma conversa encontrada"
                  : "Nenhuma conversa ainda"}
              </h4>
              <p className="text-gray-500 text-sm">
                {searchTerm
                  ? "Tente buscar por outro termo"
                  : "Suas conversas com profissionais aparecerão aqui"}
              </p>
            </div>
          ) : (
            <div>
              {filteredChats.map((chat) => {
                const otherUserId = chat.participants.find(
                  (id) => id !== currentUserId
                );
                const otherUserInfo = otherUserId
                  ? chat.participantsInfo[otherUserId]
                  : null;

                if (!otherUserInfo) return null;

                const isSelected = selectedChat?.id === chat.id;

                return (
                  <button
                    key={chat.id}
                    onClick={() => setSelectedChat(chat)}
                    className={`w-full p-4 hover:bg-white transition-all text-left border-l-4 ${
                      isSelected 
                        ? "bg-white border-blue-500 shadow-sm" 
                        : "border-transparent"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      {otherUserInfo.photo ? (
                        <img
                          src={otherUserInfo.photo}
                          alt={otherUserInfo.name}
                          className="w-12 h-12 rounded-full object-cover flex-shrink-0 ring-2 ring-gray-100"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 ring-2 ring-gray-100">
                          <span className="text-lg font-bold text-white">
                            {otherUserInfo.name.charAt(0)}
                          </span>
                        </div>
                      )}

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-900 truncate">
                            {otherUserInfo.name}
                          </h4>
                          <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                            {chat.lastMessageAt?.toDate
                              ? new Date(
                                  chat.lastMessageAt.toDate()
                                ).toLocaleDateString("pt-BR", {
                                  day: "2-digit",
                                  month: "2-digit",
                                })
                              : ""}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {chat.lastMessage || "Nenhuma mensagem ainda"}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Área de Chat */}
      <div className="flex-1 flex flex-col">
        {!selectedChat ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircleIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Selecione uma conversa
              </h4>
              <p className="text-gray-600">
                Escolha uma conversa para começar a enviar mensagens
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Header do Chat */}
            <div className="p-4 border-b border-gray-200 bg-white shadow-sm">
              <div className="flex items-center gap-3">
                {(() => {
                  const otherUserId = selectedChat.participants.find(
                    (id) => id !== currentUserId
                  );
                  const otherUserInfo = otherUserId
                    ? selectedChat.participantsInfo[otherUserId]
                    : null;

                  if (!otherUserInfo) return null;

                  return (
                    <>
                      {otherUserInfo.photo ? (
                        <img
                          src={otherUserInfo.photo}
                          alt={otherUserInfo.name}
                          className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-100"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center ring-2 ring-blue-100">
                          <span className="text-lg font-bold text-white">
                            {otherUserInfo.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-gray-900">
                          {otherUserInfo.name}
                        </h4>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <p className="text-xs text-gray-600">Online</p>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-center">
                  <div>
                    <p className="text-gray-500 mb-2">Nenhuma mensagem ainda</p>
                    <p className="text-sm text-gray-400">
                      Envie uma mensagem para iniciar a conversa
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((message) => {
                  const isCurrentUser = message.senderId === currentUserId;
                  return (
                    <div
                      key={message.id}
                      className={`flex gap-2 ${
                        isCurrentUser ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      {!isCurrentUser && (
                        <div className="flex-shrink-0">
                          {message.senderPhoto ? (
                            <img
                              src={message.senderPhoto}
                              alt={message.senderName}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-xs font-semibold">
                                {message.senderName.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                          isCurrentUser
                            ? "bg-[#1E40AF] text-white"
                            : "bg-white text-gray-900 border border-gray-200"
                        }`}
                      >
                        <p className="text-sm break-words">{message.text}</p>
                        <p
                          className={`text-xs mt-1 ${
                            isCurrentUser ? "text-white/70" : "text-gray-500"
                          }`}
                        >
                          {message.createdAt?.toDate
                            ? new Date(
                                message.createdAt.toDate()
                              ).toLocaleTimeString("pt-BR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : ""}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-gray-200 bg-white"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="px-6 py-2 bg-[#1E40AF] text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {sending ? (
                    <Loader2Icon className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
