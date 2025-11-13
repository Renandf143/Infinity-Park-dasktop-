import { useState, useEffect, useRef, useCallback } from "react";
import { chatService } from "../../services/chatService";
import { Chat, Message } from "../../types/chat";
import { useVoiceRecorder } from "../../hooks/useVoiceRecorder";
import { VoiceMessagePlayer } from "./VoiceMessagePlayer";
import { useStartPresence, useMultiplePresences } from "../../hooks/usePresence";
import {
  MessageCircleIcon,
  Send,
  Loader2Icon,
  Search,
  X,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  CheckCheck,
  Archive,
  Star,
  Trash2,
  Image as ImageIcon,
  Mic,
  StopCircle,
  XCircle,
} from "lucide-react";

interface ProfessionalMessagesPanelProps {
  currentUserId: string;
  currentUserName: string;
  currentUserPhoto?: string;
  autoOpenUserId?: string | null;
}

export function ProfessionalMessagesPanel({
  currentUserId,
  currentUserName,
  currentUserPhoto,
  autoOpenUserId,
}: ProfessionalMessagesPanelProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showChatOptions, setShowChatOptions] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "unread" | "archived">("all");
  const [typingUsers, setTypingUsers] = useState<{ [userId: string]: boolean }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    isRecording,
    recordingTime,
    audioBlob,
    startRecording,
    stopRecording,
    cancelRecording,
    resetRecording,
  } = useVoiceRecorder();

  // Iniciar presença online do usuário atual
  useStartPresence(currentUserId);

  // Observar presença de todos os usuários nas conversas
  const otherUserIds = chats
    .map((chat) => chat.participants.find((id) => id !== currentUserId))
    .filter((id): id is string => Boolean(id) && id !== "");
  const presences = useMultiplePresences(otherUserIds);

  // Carregar conversas
  useEffect(() => {
    setLoading(true);

    const unsubscribe = chatService.subscribeToUserChats(
      currentUserId,
      async (updatedChats) => {
        setChats(updatedChats);
        setLoading(false);

        // Inicializar presença para todos os participantes
        const allParticipants = updatedChats.flatMap((chat) => chat.participants);
        const uniqueParticipants = [...new Set(allParticipants)];
        await chatService.initializePresenceForUsers(uniqueParticipants);
      }
    );

    return () => unsubscribe();
  }, [currentUserId]);

  // Auto-abrir chat quando autoOpenUserId é fornecido
  useEffect(() => {
    if (autoOpenUserId && chats.length > 0) {
      let chatToOpen = chats.find(chat => chat.id === autoOpenUserId);
      
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

    // Marcar mensagens como lidas
    chatService.markAsRead(selectedChat.id, currentUserId).catch(console.error);

    const unsubscribe = chatService.subscribeToMessages(
      selectedChat.id,
      (updatedMessages) => {
        setMessages(updatedMessages);
        // Auto scroll quando novas mensagens chegam
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    );

    return () => unsubscribe();
  }, [selectedChat, currentUserId]);

  // Listener para status de digitação
  useEffect(() => {
    if (!selectedChat) {
      setTypingUsers({});
      return;
    }

    const unsubscribe = chatService.subscribeToTyping(
      selectedChat.id,
      (typing) => {
        // Filtrar apenas usuários que não são o atual
        const filteredTyping: { [userId: string]: boolean } = {};
        Object.keys(typing).forEach((userId) => {
          if (userId !== currentUserId && typing[userId]) {
            filteredTyping[userId] = typing[userId];
          }
        });
        setTypingUsers(filteredTyping);
      }
    );

    return () => unsubscribe();
  }, [selectedChat, currentUserId]);

  // Auto scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Atualizar status de digitação
  const handleTyping = useCallback(() => {
    if (!selectedChat) return;

    // Marcar como digitando
    chatService.setTyping(selectedChat.id, currentUserId, true).catch(console.error);

    // Limpar timeout anterior
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Parar de digitar após 2 segundos de inatividade
    typingTimeoutRef.current = setTimeout(() => {
      chatService.setTyping(selectedChat.id, currentUserId, false).catch(console.error);
    }, 2000);
  }, [selectedChat, currentUserId]);

  // Limpar status de digitação ao desmontar ou trocar de chat
  useEffect(() => {
    return () => {
      if (selectedChat && typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        chatService.setTyping(selectedChat.id, currentUserId, false).catch(console.error);
      }
    };
  }, [selectedChat, currentUserId]);



  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !selectedChat || sending) return;

    const messageToSend = newMessage.trim();
    setNewMessage(""); // Limpar imediatamente para melhor UX
    setSending(true);

    try {
      // Limpar status de digitação antes de enviar
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      await chatService.setTyping(selectedChat.id, currentUserId, false);

      await chatService.sendMessage(
        selectedChat.id,
        currentUserId,
        currentUserName,
        currentUserPhoto || "",
        messageToSend
      );
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      alert("Erro ao enviar mensagem");
      setNewMessage(messageToSend); // Restaurar mensagem em caso de erro
    } finally {
      setSending(false);
    }
  };

  const handleSendVoiceMessage = async () => {
    if (!audioBlob || !selectedChat || sending) return;

    setSending(true);
    try {
      await chatService.sendVoiceMessage(
        selectedChat.id,
        currentUserId,
        currentUserName,
        currentUserPhoto || "",
        audioBlob,
        recordingTime
      );

      resetRecording();
    } catch (error) {
      console.error("Erro ao enviar mensagem de voz:", error);
      alert("Erro ao enviar mensagem de voz");
    } finally {
      setSending(false);
    }
  };

  const filteredChats = chats.filter((chat) => {
    const otherUserId = chat.participants.find((id) => id !== currentUserId);
    const otherUserInfo = otherUserId
      ? chat.participantsInfo[otherUserId]
      : null;
    
    const matchesSearch = otherUserInfo?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const getOtherUserInfo = (chat: Chat) => {
    const otherUserId = chat.participants.find((id) => id !== currentUserId);
    return otherUserId ? chat.participantsInfo[otherUserId] : null;
  };

  const isUserOnline = (userId: string) => {
    if (!userId) return false;
    const presence = presences.get(userId);
    return presence?.online || false;
  };

  const isOtherUserTyping = () => {
    if (!selectedChat) return false;
    const otherUserId = selectedChat.participants.find((id) => id !== currentUserId);
    if (!otherUserId) return false;
    return typingUsers[otherUserId] === true;
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2Icon className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando mensagens...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 h-[calc(100vh-180px)] flex overflow-hidden">
      {/* Lista de Conversas - Sidebar */}
      <div className="w-full md:w-96 border-r border-gray-200 flex flex-col bg-gradient-to-b from-gray-50 to-white">
        {/* Header da Lista */}
        <div className="p-5 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <MessageCircleIcon className="w-6 h-6 text-blue-600" />
              Mensagens
            </h3>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              {chats.length}
            </span>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar conversas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:bg-gray-100 rounded-full p-1 transition-colors"
                aria-label="Limpar busca"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Filtros */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setFilterType("all")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filterType === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilterType("unread")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filterType === "unread"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Não lidas
            </button>
            <button
              onClick={() => setFilterType("archived")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filterType === "archived"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Arquivadas
            </button>
          </div>
        </div>

        {/* Lista de Conversas */}
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
                  : "Suas conversas com clientes aparecerão aqui"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredChats.map((chat) => {
                const otherUserInfo = getOtherUserInfo(chat);
                if (!otherUserInfo) return null;

                const isSelected = selectedChat?.id === chat.id;
                const hasUnread = false;

                return (
                  <button
                    key={chat.id}
                    onClick={() => setSelectedChat(chat)}
                    className={`w-full p-4 hover:bg-white transition-all text-left border-l-4 relative group ${
                      isSelected 
                        ? "bg-white border-blue-600 shadow-sm" 
                        : "border-transparent hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar com Status */}
                      <div className="relative flex-shrink-0">
                        {otherUserInfo.photo ? (
                          <img
                            src={otherUserInfo.photo}
                            alt={otherUserInfo.name}
                            className="w-14 h-14 rounded-full object-cover ring-2 ring-gray-100"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center ring-2 ring-gray-100">
                            <span className="text-xl font-bold text-white">
                              {otherUserInfo.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        {(() => {
                          const otherUserId = chat.participants.find((id) => id !== currentUserId);
                          const online = otherUserId ? isUserOnline(otherUserId) : false;
                          return (
                            <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                              online ? "bg-green-500" : "bg-gray-400"
                            }`}></div>
                          );
                        })()}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`font-semibold truncate ${
                            hasUnread ? "text-gray-900" : "text-gray-700"
                          }`}>
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
                        <div className="flex items-center justify-between">
                          <p className={`text-sm truncate ${
                            hasUnread ? "font-medium text-gray-900" : "text-gray-600"
                          }`}>
                            {chat.lastMessage || "Nenhuma mensagem ainda"}
                          </p>
                          {hasUnread && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 ml-2"></span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Ações rápidas (aparecem no hover) */}
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button className="p-1.5 hover:bg-gray-100 rounded-lg" aria-label="Favoritar">
                        <Star className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded-lg" aria-label="Arquivar">
                        <Archive className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Área de Chat */}
      <div className="flex-1 flex flex-col bg-gradient-to-b from-gray-50 to-white">
        {!selectedChat ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md px-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <MessageCircleIcon className="w-12 h-12 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-3">
                Selecione uma conversa
              </h4>
              <p className="text-gray-600">
                Escolha uma conversa da lista para começar a enviar mensagens aos seus clientes
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Header do Chat */}
            <div className="p-5 border-b border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {(() => {
                    const otherUserInfo = getOtherUserInfo(selectedChat);
                    if (!otherUserInfo) return null;

                    return (
                      <>
                        <div className="relative">
                          {otherUserInfo.photo ? (
                            <img
                              src={otherUserInfo.photo}
                              alt={otherUserInfo.name}
                              className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-100"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center ring-2 ring-blue-100">
                              <span className="text-lg font-bold text-white">
                                {otherUserInfo.name.charAt(0)}
                              </span>
                            </div>
                          )}
                          {(() => {
                            const otherUserId = selectedChat.participants.find((id) => id !== currentUserId);
                            const online = otherUserId ? isUserOnline(otherUserId) : false;
                            return (
                              <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                                online ? "bg-green-500" : "bg-gray-400"
                              }`}></div>
                            );
                          })()}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg">
                            {otherUserInfo.name}
                          </h4>
                          <div className="flex items-center gap-2">
                            {isOtherUserTyping() ? (
                              <>
                                <div className="flex gap-1">
                                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                                </div>
                                <p className="text-sm text-blue-600 font-medium">Digitando...</p>
                              </>
                            ) : (() => {
                              const otherUserId = selectedChat.participants.find((id) => id !== currentUserId);
                              const online = otherUserId ? isUserOnline(otherUserId) : false;
                              return online ? (
                                <>
                                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                  <p className="text-sm text-gray-600">Online agora</p>
                                </>
                              ) : (
                                <>
                                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                  <p className="text-sm text-gray-500">Offline</p>
                                </>
                              );
                            })()}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Ações do Chat */}
                <div className="flex items-center gap-2">
                  <button className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors" aria-label="Ligar">
                    <Phone className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors" aria-label="Videochamada">
                    <Video className="w-5 h-5 text-gray-600" />
                  </button>
                  <div className="relative">
                    <button 
                      onClick={() => setShowChatOptions(!showChatOptions)}
                      className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
                      aria-label="Mais opções"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>
                    
                    {showChatOptions && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-10">
                        <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700">
                          <Star className="w-4 h-4" />
                          Favoritar
                        </button>
                        <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700">
                          <Archive className="w-4 h-4" />
                          Arquivar
                        </button>
                        <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-red-600">
                          <Trash2 className="w-4 h-4" />
                          Excluir
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-center">
                  <div>
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircleIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 mb-2">Nenhuma mensagem ainda</p>
                    <p className="text-sm text-gray-400">
                      Envie uma mensagem para iniciar a conversa
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message, index) => {
                    const isCurrentUser = message.senderId === currentUserId;
                    const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId;
                    
                    return (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${
                          isCurrentUser ? "flex-row-reverse" : "flex-row"
                        } ${!showAvatar && "mt-1"}`}
                      >
                        {/* Avatar */}
                        {showAvatar ? (
                          !isCurrentUser && (
                            <div className="flex-shrink-0">
                              {message.senderPhoto ? (
                                <img
                                  src={message.senderPhoto}
                                  alt={message.senderName}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
                                  <span className="text-sm font-semibold text-white">
                                    {message.senderName.charAt(0)}
                                  </span>
                                </div>
                              )}
                            </div>
                          )
                        ) : (
                          <div className="w-10 flex-shrink-0"></div>
                        )}

                        {/* Mensagem */}
                        <div className={`max-w-[70%] ${!showAvatar && (isCurrentUser ? "mr-13" : "ml-13")}`}>
                          <div
                            className={`rounded-2xl px-4 py-3 ${
                              isCurrentUser
                                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                                : "bg-white text-gray-900 border border-gray-200 shadow-sm"
                            }`}
                          >
                            {message.type === "voice" && message.voiceUrl ? (
                              <VoiceMessagePlayer
                                voiceUrl={message.voiceUrl}
                                duration={message.voiceDuration || 0}
                                isCurrentUser={isCurrentUser}
                              />
                            ) : (
                              <p className="text-sm break-words leading-relaxed">{message.text}</p>
                            )}
                          </div>
                          <div className={`flex items-center gap-2 mt-1 px-2 ${
                            isCurrentUser ? "justify-end" : "justify-start"
                          }`}>
                            <p className="text-xs text-gray-500">
                              {message.createdAt?.toDate
                                ? new Date(
                                    message.createdAt.toDate()
                                  ).toLocaleTimeString("pt-BR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : ""}
                            </p>
                            {isCurrentUser && (
                              <CheckCheck className="w-4 h-4 text-blue-600" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input de Mensagem */}
            <div className="p-5 border-t border-gray-200 bg-white">
              {isRecording ? (
                /* Interface de Gravação */
                <div className="flex items-center gap-3 bg-red-50 p-4 rounded-xl">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-600 font-medium">
                      Gravando: {formatRecordingTime(recordingTime)}
                    </span>
                  </div>
                  <button
                    onClick={cancelRecording}
                    className="p-3 hover:bg-red-100 rounded-xl transition-colors text-red-600"
                    aria-label="Cancelar gravação"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                  <button
                    onClick={stopRecording}
                    className="p-3 bg-red-600 hover:bg-red-700 rounded-xl transition-colors text-white"
                    aria-label="Parar gravação"
                  >
                    <StopCircle className="w-6 h-6" />
                  </button>
                </div>
              ) : audioBlob ? (
                /* Preview do Áudio Gravado */
                <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-xl">
                  <div className="flex items-center gap-3 flex-1">
                    <Mic className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-600 font-medium">
                      Áudio gravado: {formatRecordingTime(recordingTime)}
                    </span>
                  </div>
                  <button
                    onClick={resetRecording}
                    className="p-3 hover:bg-blue-100 rounded-xl transition-colors text-blue-600"
                    aria-label="Cancelar"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleSendVoiceMessage}
                    disabled={sending}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-lg shadow-blue-500/30"
                  >
                    {sending ? (
                      <Loader2Icon className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                    <span>Enviar</span>
                  </button>
                </div>
              ) : (
                /* Interface Normal */
                <form onSubmit={handleSendMessage} className="flex items-end gap-3">
                  {/* Botões de Anexo */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-3 hover:bg-gray-100 rounded-xl transition-colors text-gray-600"
                      aria-label="Anexar arquivo"
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      className="p-3 hover:bg-gray-100 rounded-xl transition-colors text-gray-600"
                      aria-label="Enviar imagem"
                    >
                      <ImageIcon className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={startRecording}
                      className="p-3 hover:bg-gray-100 rounded-xl transition-colors text-gray-600"
                      aria-label="Gravar áudio"
                    >
                      <Mic className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Input */}
                  <div className="flex-1 relative">
                    <textarea
                      value={newMessage}
                      onChange={(e) => {
                        setNewMessage(e.target.value);
                        handleTyping();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                      placeholder="Digite sua mensagem..."
                      rows={1}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      disabled={sending}
                      style={{ minHeight: "48px", maxHeight: "120px" }}
                    />
                    <button
                      type="button"
                      className="absolute right-3 bottom-3 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                      aria-label="Emoji"
                    >
                      <Smile className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  {/* Botão Enviar */}
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-lg shadow-blue-500/30"
                  >
                    {sending ? (
                      <Loader2Icon className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                    <span className="hidden sm:inline">Enviar</span>
                  </button>
                </form>
              )}

              {/* Input de arquivo oculto */}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*,.pdf,.doc,.docx"
                aria-label="Selecionar arquivo"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
