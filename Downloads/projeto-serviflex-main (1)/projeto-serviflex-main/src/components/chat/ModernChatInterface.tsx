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
  ArrowLeft,
  Info,
  Settings,
  Bell,
  Pin,
  Download,
  Copy,
  Reply,
  Forward,
} from "lucide-react";

interface ModernChatInterfaceProps {
  currentUserId: string;
  currentUserName: string;
  currentUserPhoto?: string;
  autoOpenUserId?: string | null;
  userType: "professional" | "client";
}

export function ModernChatInterface({
  currentUserId,
  currentUserName,
  currentUserPhoto,
  autoOpenUserId,
  userType,
}: ModernChatInterfaceProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showChatOptions, setShowChatOptions] = useState(false);
  const [showChatInfo, setShowChatInfo] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "unread" | "archived">("all");
  const [typingUsers, setTypingUsers] = useState<{ [userId: string]: boolean }>({});
  const [hoveredMessage, setHoveredMessage] = useState<string | null>(null);
  const [showMobileChat, setShowMobileChat] = useState(false);
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

  useStartPresence(currentUserId);

  const otherUserIds = chats.map((chat) => 
    chat.participants.find((id) => id !== currentUserId) || ""
  ).filter(Boolean);
  const presences = useMultiplePresences(otherUserIds);

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
        setShowMobileChat(true);
      }
    }
  }, [autoOpenUserId, chats]);

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

  useEffect(() => {
    if (!selectedChat) {
      setTypingUsers({});
      return;
    }
    const unsubscribe = chatService.subscribeToTyping(
      selectedChat.id,
      (typing) => {
        setTypingUsers(typing);
      }
    );
    return () => unsubscribe();
  }, [selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleTyping = useCallback(() => {
    if (!selectedChat) return;
    chatService.setTyping(selectedChat.id, currentUserId, true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      chatService.setTyping(selectedChat.id, currentUserId, false);
    }, 3000);
  }, [selectedChat, currentUserId]);

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

  const handleArchiveChat = async (chatId: string, archive: boolean) => {
    try {
      await chatService.archiveChat(chatId, currentUserId, archive);
    } catch (error) {
      console.error("Erro ao arquivar:", error);
      alert("Erro ao arquivar conversa");
    }
  };

  const handlePinChat = async (chatId: string, pin: boolean) => {
    try {
      await chatService.pinChat(chatId, currentUserId, pin);
    } catch (error) {
      console.error("Erro ao fixar:", error);
      alert("Erro ao fixar conversa");
    }
  };

  const handleMuteChat = async (chatId: string, mute: boolean) => {
    try {
      await chatService.muteChat(chatId, currentUserId, mute);
    } catch (error) {
      console.error("Erro ao silenciar:", error);
      alert("Erro ao silenciar conversa");
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta conversa?")) return;
    
    try {
      await chatService.deleteChat(chatId, currentUserId);
      if (selectedChat?.id === chatId) {
        setSelectedChat(null);
        setShowMobileChat(false);
      }
    } catch (error) {
      console.error("Erro ao deletar:", error);
      alert("Erro ao deletar conversa");
    }
  };

  const filteredChats = chats
    .filter((chat) => {
      const otherUserId = chat.participants.find((id) => id !== currentUserId);
      const otherUserInfo = otherUserId ? chat.participantsInfo[otherUserId] : null;
      
      // Verificar se está arquivada ou deletada
      const isArchived = chat.archived?.[currentUserId] || false;
      const isDeleted = (chat as any).deleted?.[currentUserId] || false;
      
      // Não mostrar conversas deletadas
      if (isDeleted) return false;
      
      // Filtrar por tipo
      if (filterType === "archived" && !isArchived) return false;
      if (filterType === "all" && isArchived) return false;
      
      const matchesSearch = otherUserInfo?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      // Conversas fixadas primeiro
      const aPinned = a.pinned?.[currentUserId] || false;
      const bPinned = b.pinned?.[currentUserId] || false;
      
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      
      // Depois por data
      const timeA = a.lastMessageAt?.toMillis ? a.lastMessageAt.toMillis() : 0;
      const timeB = b.lastMessageAt?.toMillis ? b.lastMessageAt.toMillis() : 0;
      return timeB - timeA;
    });

  const getOtherUserInfo = (chat: Chat) => {
    const otherUserId = chat.participants.find((id) => id !== currentUserId);
    return otherUserId ? chat.participantsInfo[otherUserId] : null;
  };

  const isUserOnline = (userId: string) => {
    const presence = presences.get(userId);
    return presence?.online || false;
  };

  const isOtherUserTyping = () => {
    if (!selectedChat) return false;
    const otherUserId = selectedChat.participants.find((id) => id !== currentUserId);
    return otherUserId ? typingUsers[otherUserId] : false;
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatMessageTime = (timestamp: any) => {
    if (!timestamp?.toDate) return "";
    const date = timestamp.toDate();
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    } else if (diffDays === 1) {
      return "Ontem";
    } else if (diffDays < 7) {
      return date.toLocaleDateString("pt-BR", { weekday: "short" });
    } else {
      return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="text-center">
          <Loader2Icon className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Carregando conversas...</p>
        </div>
      </div>
    );
  }

  const themeColors = userType === "professional" 
    ? {
        primary: "from-blue-600 to-blue-700",
        primaryHover: "from-blue-700 to-blue-800",
        accent: "bg-blue-600",
        accentLight: "bg-blue-100",
        accentText: "text-blue-600",
        gradient: "from-gray-50 to-white",
      }
    : {
        primary: "from-indigo-600 to-indigo-700",
        primaryHover: "from-indigo-700 to-indigo-800",
        accent: "bg-indigo-600",
        accentLight: "bg-indigo-100",
        accentText: "text-indigo-600",
        gradient: "from-indigo-50 to-white",
      };

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 h-[calc(100vh-160px)] flex overflow-hidden">
      {/* Sidebar de Conversas */}
      <div className={`${showMobileChat ? 'hidden md:flex' : 'flex'} w-full md:w-[380px] border-r border-gray-200 flex-col bg-gradient-to-b ${themeColors.gradient}`}>
        {/* Header da Sidebar */}
        <div className="p-6 border-b border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl ${themeColors.accent} flex items-center justify-center shadow-lg`}>
                <MessageCircleIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Mensagens</h3>
                <p className="text-sm text-gray-500">{chats.length} conversas</p>
              </div>
            </div>
            <button className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors" aria-label="Configurações">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar conversas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all placeholder-gray-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 hover:bg-gray-100 rounded-lg p-1.5 transition-colors"
                aria-label="Limpar busca"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>

          <div className="flex gap-2 mt-4">
            {["all", "unread", "archived"].map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterType(filter as any)}
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  filterType === filter
                    ? `${themeColors.accent} text-white shadow-md`
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {filter === "all" ? "Todas" : filter === "unread" ? "Não lidas" : "Arquivadas"}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Conversas */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.length === 0 ? (
            <div className="text-center p-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircleIcon className="w-12 h-12 text-gray-300" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">
                {searchTerm ? "Nenhuma conversa encontrada" : "Nenhuma conversa ainda"}
              </h4>
              <p className="text-gray-500 text-sm max-w-xs mx-auto">
                {searchTerm
                  ? "Tente buscar por outro termo"
                  : userType === "professional"
                  ? "Suas conversas com clientes aparecerão aqui"
                  : "Suas conversas com profissionais aparecerão aqui"}
              </p>
            </div>
          ) : (
            <div className="p-2">
              {filteredChats.map((chat) => {
                const otherUserInfo = getOtherUserInfo(chat);
                if (!otherUserInfo) return null;

                const isSelected = selectedChat?.id === chat.id;
                const otherUserId = chat.participants.find((id) => id !== currentUserId);
                const online = otherUserId ? isUserOnline(otherUserId) : false;
                const isPinned = chat.pinned?.[currentUserId] || false;
                const isMuted = chat.muted?.[currentUserId] || false;

                return (
                  <button
                    key={chat.id}
                    onClick={() => {
                      setSelectedChat(chat);
                      setShowMobileChat(true);
                    }}
                    className={`w-full p-4 rounded-2xl transition-all text-left mb-2 group relative ${
                      isSelected 
                        ? `${themeColors.accentLight} shadow-lg scale-[1.02]` 
                        : "hover:bg-white hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative flex-shrink-0">
                        {otherUserInfo.photo ? (
                          <img
                            src={otherUserInfo.photo}
                            alt={otherUserInfo.name}
                            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white shadow-md"
                          />
                        ) : (
                          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center ring-4 ring-white shadow-md`}>
                            <span className="text-2xl font-bold text-white">
                              {otherUserInfo.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-white shadow-sm ${
                          online ? "bg-green-500" : "bg-gray-400"
                        }`}></div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {isPinned && (
                              <Pin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                            )}
                            <h4 className="font-bold text-gray-900 truncate text-base">
                              {otherUserInfo.name}
                            </h4>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                            {isMuted && (
                              <Bell className="w-4 h-4 text-gray-400" />
                            )}
                            <span className="text-xs text-gray-500 font-medium">
                              {formatMessageTime(chat.lastMessageAt)}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 truncate leading-relaxed">
                          {chat.lastMessage || "Nenhuma mensagem ainda"}
                        </p>
                        {online && (
                          <div className="flex items-center gap-1.5 mt-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs text-green-600 font-medium">Online</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          const isPinned = chat.pinned?.[currentUserId] || false;
                          handlePinChat(chat.id, !isPinned);
                        }}
                        className={`p-2 hover:bg-white rounded-lg shadow-sm ${
                          chat.pinned?.[currentUserId] ? 'bg-blue-100' : ''
                        }`}
                        aria-label={chat.pinned?.[currentUserId] ? "Desafixar" : "Fixar"}
                      >
                        <Pin className={`w-4 h-4 ${
                          chat.pinned?.[currentUserId] ? 'text-blue-600' : 'text-gray-500'
                        }`} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          const isArchived = chat.archived?.[currentUserId] || false;
                          handleArchiveChat(chat.id, !isArchived);
                        }}
                        className="p-2 hover:bg-white rounded-lg shadow-sm"
                        aria-label={chat.archived?.[currentUserId] ? "Desarquivar" : "Arquivar"}
                      >
                        <Archive className="w-4 h-4 text-gray-500" />
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
      <div className={`${!showMobileChat ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-gradient-to-b from-gray-50 via-white to-gray-50`}>
        {!selectedChat ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-md">
              <div className={`w-32 h-32 bg-gradient-to-br ${themeColors.primary} rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl`}>
                <MessageCircleIcon className="w-16 h-16 text-white" />
              </div>
              <h4 className="text-3xl font-bold text-gray-900 mb-4">
                Selecione uma conversa
              </h4>
              <p className="text-gray-600 text-lg leading-relaxed">
                Escolha uma conversa da lista para começar a trocar mensagens
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Header do Chat */}
            <div className="p-6 border-b border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowMobileChat(false)}
                    className="md:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    aria-label="Voltar"
                  >
                    <ArrowLeft className="w-6 h-6 text-gray-600" />
                  </button>
                  
                  {(() => {
                    const otherUserInfo = getOtherUserInfo(selectedChat);
                    if (!otherUserInfo) return null;
                    const otherUserId = selectedChat.participants.find((id) => id !== currentUserId);
                    const online = otherUserId ? isUserOnline(otherUserId) : false;

                    return (
                      <>
                        <div className="relative">
                          {otherUserInfo.photo ? (
                            <img
                              src={otherUserInfo.photo}
                              alt={otherUserInfo.name}
                              className="w-14 h-14 rounded-2xl object-cover ring-4 ring-blue-100 shadow-md"
                            />
                          ) : (
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${themeColors.primary} flex items-center justify-center ring-4 ring-blue-100 shadow-md`}>
                              <span className="text-xl font-bold text-white">
                                {otherUserInfo.name.charAt(0)}
                              </span>
                            </div>
                          )}
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-3 border-white shadow-sm ${
                            online ? "bg-green-500" : "bg-gray-400"
                          }`}></div>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-xl">
                            {otherUserInfo.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            {isOtherUserTyping() ? (
                              <>
                                <div className="flex gap-1">
                                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                                </div>
                                <p className="text-sm text-blue-600 font-semibold">Digitando...</p>
                              </>
                            ) : online ? (
                              <>
                                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                                <p className="text-sm text-green-600 font-medium">Online agora</p>
                              </>
                            ) : (
                              <>
                                <div className="w-2.5 h-2.5 bg-gray-400 rounded-full"></div>
                                <p className="text-sm text-gray-500">Offline</p>
                              </>
                            )}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <div className="flex items-center gap-2">
                  <button className={`p-3 hover:${themeColors.accentLight} rounded-xl transition-all`} aria-label="Ligar">
                    <Phone className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className={`p-3 hover:${themeColors.accentLight} rounded-xl transition-all`} aria-label="Videochamada">
                    <Video className="w-5 h-5 text-gray-600" />
                  </button>
                  <button 
                    onClick={() => setShowChatInfo(!showChatInfo)}
                    className={`p-3 hover:${themeColors.accentLight} rounded-xl transition-all`}
                    aria-label="Informações"
                  >
                    <Info className="w-5 h-5 text-gray-600" />
                  </button>
                  <div className="relative">
                    <button 
                      onClick={() => setShowChatOptions(!showChatOptions)}
                      className={`p-3 hover:${themeColors.accentLight} rounded-xl transition-all`}
                      aria-label="Mais opções"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>
                    
                    {showChatOptions && selectedChat && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-10">
                        <button 
                          onClick={() => {
                            const isPinned = selectedChat.pinned?.[currentUserId] || false;
                            handlePinChat(selectedChat.id, !isPinned);
                            setShowChatOptions(false);
                          }}
                          className="w-full px-5 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 transition-colors"
                        >
                          <Pin className="w-5 h-5" />
                          <span className="font-medium">
                            {selectedChat.pinned?.[currentUserId] ? "Desafixar" : "Fixar"}
                          </span>
                        </button>
                        <button 
                          onClick={() => {
                            const isMuted = selectedChat.muted?.[currentUserId] || false;
                            handleMuteChat(selectedChat.id, !isMuted);
                            setShowChatOptions(false);
                          }}
                          className="w-full px-5 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 transition-colors"
                        >
                          <Bell className="w-5 h-5" />
                          <span className="font-medium">
                            {selectedChat.muted?.[currentUserId] ? "Ativar notificações" : "Silenciar"}
                          </span>
                        </button>
                        <button 
                          onClick={() => {
                            const isArchived = selectedChat.archived?.[currentUserId] || false;
                            handleArchiveChat(selectedChat.id, !isArchived);
                            setShowChatOptions(false);
                          }}
                          className="w-full px-5 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 transition-colors"
                        >
                          <Archive className="w-5 h-5" />
                          <span className="font-medium">
                            {selectedChat.archived?.[currentUserId] ? "Desarquivar" : "Arquivar"}
                          </span>
                        </button>
                        <div className="border-t border-gray-200 my-2"></div>
                        <button 
                          onClick={() => {
                            handleDeleteChat(selectedChat.id);
                            setShowChatOptions(false);
                          }}
                          className="w-full px-5 py-3 text-left hover:bg-red-50 flex items-center gap-3 text-red-600 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                          <span className="font-medium">Excluir conversa</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Área de Mensagens */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2YzZjRmNiIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] bg-repeat">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <MessageCircleIcon className="w-12 h-12 text-gray-300" />
                    </div>
                    <p className="text-gray-500 text-lg mb-2">Nenhuma mensagem ainda</p>
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
                    const showName = !isCurrentUser && showAvatar;
                    
                    return (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${isCurrentUser ? "flex-row-reverse" : "flex-row"} ${!showAvatar && "mt-2"}`}
                        onMouseEnter={() => setHoveredMessage(message.id)}
                        onMouseLeave={() => setHoveredMessage(null)}
                      >
                        {showAvatar ? (
                          !isCurrentUser && (
                            <div className="flex-shrink-0">
                              {message.senderPhoto ? (
                                <img
                                  src={message.senderPhoto}
                                  alt={message.senderName}
                                  className="w-11 h-11 rounded-xl object-cover shadow-md"
                                />
                              ) : (
                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center shadow-md">
                                  <span className="text-sm font-bold text-white">
                                    {message.senderName.charAt(0)}
                                  </span>
                                </div>
                              )}
                            </div>
                          )
                        ) : (
                          <div className="w-11 flex-shrink-0"></div>
                        )}

                        <div className={`max-w-[70%] ${!showAvatar && (isCurrentUser ? "mr-14" : "ml-14")}`}>
                          {showName && (
                            <p className="text-sm font-semibold text-gray-700 mb-1 px-2">
                              {message.senderName}
                            </p>
                          )}
                          <div className="relative group">
                            <div
                              className={`rounded-2xl px-5 py-3.5 shadow-md transition-all ${
                                isCurrentUser
                                  ? `bg-gradient-to-r ${themeColors.primary} text-white`
                                  : "bg-white text-gray-900 border border-gray-200"
                              }`}
                            >
                              {message.type === "voice" && message.voiceUrl ? (
                                <VoiceMessagePlayer
                                  voiceUrl={message.voiceUrl}
                                  duration={message.voiceDuration || 0}
                                  isCurrentUser={isCurrentUser}
                                />
                              ) : (
                                <p className="text-[15px] break-words leading-relaxed whitespace-pre-wrap">
                                  {message.text}
                                </p>
                              )}
                            </div>
                            
                            {hoveredMessage === message.id && (
                              <div className={`absolute ${isCurrentUser ? 'left-0' : 'right-0'} top-0 -translate-y-full mb-2 flex gap-1 bg-white rounded-xl shadow-lg border border-gray-200 p-1`}>
                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Responder">
                                  <Reply className="w-4 h-4 text-gray-600" />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Copiar">
                                  <Copy className="w-4 h-4 text-gray-600" />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Encaminhar">
                                  <Forward className="w-4 h-4 text-gray-600" />
                                </button>
                              </div>
                            )}
                          </div>
                          
                          <div className={`flex items-center gap-2 mt-2 px-2 ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                            <p className="text-xs text-gray-500 font-medium">
                              {message.createdAt?.toDate
                                ? new Date(message.createdAt.toDate()).toLocaleTimeString("pt-BR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : ""}
                            </p>
                            {isCurrentUser && (
                              <CheckCheck className="w-4 h-4 text-blue-500" />
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
            <div className="p-6 border-t border-gray-200 bg-white">
              {isRecording ? (
                <div className="flex items-center gap-4 bg-gradient-to-r from-red-50 to-red-100 p-5 rounded-2xl border-2 border-red-200">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-lg"></div>
                    <div>
                      <p className="text-red-700 font-bold text-lg">
                        Gravando
                      </p>
                      <p className="text-red-600 text-sm font-medium">
                        {formatRecordingTime(recordingTime)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={cancelRecording}
                    className="p-3.5 hover:bg-red-200 rounded-xl transition-all text-red-600"
                    aria-label="Cancelar gravação"
                  >
                    <XCircle className="w-7 h-7" />
                  </button>
                  <button
                    onClick={stopRecording}
                    className="p-3.5 bg-red-600 hover:bg-red-700 rounded-xl transition-all text-white shadow-lg"
                    aria-label="Parar gravação"
                  >
                    <StopCircle className="w-7 h-7" />
                  </button>
                </div>
              ) : audioBlob ? (
                <div className="flex items-center gap-4 bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-2xl border-2 border-blue-200">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-12 h-12 ${themeColors.accent} rounded-xl flex items-center justify-center shadow-lg`}>
                      <Mic className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-blue-700 font-bold text-base">
                        Áudio gravado
                      </p>
                      <p className="text-blue-600 text-sm font-medium">
                        Duração: {formatRecordingTime(recordingTime)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={resetRecording}
                    className="p-3.5 hover:bg-blue-200 rounded-xl transition-all text-blue-600"
                    aria-label="Cancelar"
                  >
                    <XCircle className="w-7 h-7" />
                  </button>
                  <button
                    onClick={handleSendVoiceMessage}
                    disabled={sending}
                    className={`px-8 py-3.5 bg-gradient-to-r ${themeColors.primary} text-white rounded-xl hover:${themeColors.primaryHover} transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 font-bold shadow-xl`}
                  >
                    {sending ? (
                      <Loader2Icon className="w-6 h-6 animate-spin" />
                    ) : (
                      <Send className="w-6 h-6" />
                    )}
                    <span>Enviar</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="flex items-end gap-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className={`p-3.5 hover:${themeColors.accentLight} rounded-xl transition-all text-gray-600`}
                      aria-label="Anexar arquivo"
                    >
                      <Paperclip className="w-6 h-6" />
                    </button>
                    <button
                      type="button"
                      className={`p-3.5 hover:${themeColors.accentLight} rounded-xl transition-all text-gray-600`}
                      aria-label="Enviar imagem"
                    >
                      <ImageIcon className="w-6 h-6" />
                    </button>
                    <button
                      type="button"
                      onClick={startRecording}
                      className={`p-3.5 hover:${themeColors.accentLight} rounded-xl transition-all text-gray-600`}
                      aria-label="Gravar áudio"
                    >
                      <Mic className="w-6 h-6" />
                    </button>
                  </div>

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
                      className="w-full px-5 py-4 pr-14 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-[15px] placeholder-gray-400"
                      disabled={sending}
                      style={{ minHeight: "56px", maxHeight: "140px" }}
                    />
                    <button
                      type="button"
                      className="absolute right-4 bottom-4 p-2 hover:bg-gray-100 rounded-xl transition-colors"
                      aria-label="Emoji"
                    >
                      <Smile className="w-6 h-6 text-gray-400" />
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className={`px-8 py-4 bg-gradient-to-r ${themeColors.primary} text-white rounded-2xl hover:${themeColors.primaryHover} transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 font-bold shadow-xl`}
                  >
                    {sending ? (
                      <Loader2Icon className="w-6 h-6 animate-spin" />
                    ) : (
                      <Send className="w-6 h-6" />
                    )}
                    <span className="hidden sm:inline">Enviar</span>
                  </button>
                </form>
              )}

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
