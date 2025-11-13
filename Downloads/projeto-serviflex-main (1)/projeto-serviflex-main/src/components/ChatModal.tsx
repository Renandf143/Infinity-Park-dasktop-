import { useState, useEffect, useRef } from "react";
import { X, Send, Loader2Icon, Image as ImageIcon, Paperclip, Smile, Phone, Video, MoreVertical, CheckCheck } from "lucide-react";
import { chatService } from "../services/chatService";
import { useUserPresence } from "../hooks/usePresence";
import { Message } from "../types/chat";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  professionalId: string;
  professionalName: string;
  professionalPhoto?: string;
  currentUserId: string;
  currentUserName: string;
  currentUserPhoto?: string;
}

export function ChatModal({
  isOpen,
  onClose,
  professionalId,
  professionalName,
  professionalPhoto,
  currentUserId,
  currentUserName,
  currentUserPhoto,
}: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState<{ [userId: string]: boolean }>({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Criar ID único para a conversa (sempre na mesma ordem)
  const chatId = [currentUserId, professionalId].sort().join("_");

  // Usar hook de presença para o profissional
  const { isOnline: otherUserOnline } = useUserPresence(professionalId);
  
  // Verificar se o outro usuário está digitando
  const isTyping = typingUsers[professionalId] === true;

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);

    // Criar ou obter conversa usando o chatService
    const initChat = async () => {
      try {
        await chatService.getOrCreateChat(
          currentUserId,
          professionalId,
          { name: currentUserName, photo: currentUserPhoto || "" },
          { name: professionalName, photo: professionalPhoto || "" }
        );
      } catch (error) {
        console.error("Erro ao criar chat:", error);
      }
    };

    initChat();

    // Listener para mensagens
    const unsubscribeMessages = chatService.subscribeToMessages(
      chatId,
      (updatedMessages) => {
        setMessages(updatedMessages);
        setLoading(false);
      }
    );

    // Listener para status de digitação
    const unsubscribeTyping = chatService.subscribeToTyping(
      chatId,
      (typing) => {
        setTypingUsers(typing);
      }
    );

    // Marcar mensagens como lidas
    chatService.markAsRead(chatId, currentUserId).catch(console.error);

    // Cleanup ao fechar
    return () => {
      unsubscribeMessages();
      unsubscribeTyping();
      
      // Limpar status de digitação
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      chatService.setTyping(chatId, currentUserId, false).catch(console.error);
    };
  }, [
    isOpen,
    chatId,
    currentUserId,
    professionalId,
    currentUserName,
    currentUserPhoto,
    professionalName,
    professionalPhoto,
  ]);

  // Auto scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Indicador de digitação
  const handleTyping = () => {
    // Marcar como digitando
    chatService.setTyping(chatId, currentUserId, true).catch(console.error);

    // Limpar timeout anterior
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Parar de digitar após 2 segundos
    typingTimeoutRef.current = setTimeout(() => {
      chatService.setTyping(chatId, currentUserId, false).catch(console.error);
    }, 2000);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || sending) return;

    const messageToSend = newMessage.trim();
    setNewMessage(""); // Limpar imediatamente
    setSending(true);
    
    try {
      // Limpar status de digitação
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      await chatService.setTyping(chatId, currentUserId, false);

      // Enviar mensagem usando chatService
      await chatService.sendMessage(
        chatId,
        currentUserId,
        currentUserName,
        currentUserPhoto || "",
        messageToSend
      );

      inputRef.current?.focus();
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      alert("Erro ao enviar mensagem");
      setNewMessage(messageToSend); // Restaurar em caso de erro
    } finally {
      setSending(false);
    }
  };

  // Emojis rápidos
  const quickEmojis = ['👍', '❤️', '😊', '😂', '🎉', '👏', '🔥', '✅'];

  const handleEmojiClick = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl h-[600px] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1E40AF] to-[#2563EB] text-white p-4 rounded-t-xl flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative">
              {professionalPhoto ? (
                <img
                  src={professionalPhoto}
                  alt={professionalName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/30">
                  <span className="text-lg font-bold">
                    {professionalName.charAt(0)}
                  </span>
                </div>
              )}
              {/* Indicador de online */}
              {otherUserOnline && (
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{professionalName}</h3>
              <p className="text-xs text-white/90 flex items-center gap-1">
                {isTyping ? (
                  <>
                    <span className="flex gap-1">
                      <span className="w-2 h-2 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </span>
                    <span className="ml-1">digitando...</span>
                  </>
                ) : otherUserOnline ? (
                  <>
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    Online
                  </>
                ) : (
                  'Offline'
                )}
              </p>
            </div>
          </div>
          
          {/* Ações do header */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Funcionalidade de chamada em desenvolvimento')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Ligar"
            >
              <Phone className="w-5 h-5" />
            </button>
            <button
              onClick={() => alert('Funcionalidade de vídeo em desenvolvimento')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Videochamada"
            >
              <Video className="w-5 h-5" />
            </button>
            <button
              onClick={() => alert('Mais opções')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Mais opções"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2Icon className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : messages.length === 0 ? (
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
                    className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm ${
                      isCurrentUser
                        ? "bg-gradient-to-br from-[#1E40AF] to-[#2563EB] text-white"
                        : "bg-white text-gray-900 border border-gray-200"
                    }`}
                  >
                    {/* Renderizar imagem */}
                    {message.type === 'image' && message.fileUrl && (
                      <div className="mb-2">
                        <img
                          src={message.fileUrl}
                          alt={message.fileName || 'Imagem'}
                          className="max-w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => window.open(message.fileUrl, '_blank')}
                        />
                      </div>
                    )}

                    {/* Renderizar arquivo */}
                    {message.type === 'file' && message.fileUrl && (
                      <a
                        href={message.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 p-2 rounded-lg mb-2 ${
                          isCurrentUser ? 'bg-white/10' : 'bg-gray-100'
                        }`}
                      >
                        <Paperclip className="w-4 h-4" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{message.fileName}</p>
                          {message.fileSize && (
                            <p className="text-xs opacity-70">
                              {(message.fileSize / 1024).toFixed(1)} KB
                            </p>
                          )}
                        </div>
                      </a>
                    )}

                    <p className="text-sm break-words whitespace-pre-wrap">{message.text}</p>
                    <div className={`flex items-center justify-between gap-2 mt-1`}>
                      <p
                        className={`text-xs ${
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
                      {isCurrentUser && (
                        <span className="flex-shrink-0">
                          <CheckCheck className={`w-4 h-4 ${message.read ? 'text-blue-300' : 'text-white/50'}`} />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 bg-white rounded-b-xl">
          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex flex-wrap gap-2">
                {quickEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => handleEmojiClick(emoji)}
                    className="text-2xl hover:scale-125 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSendMessage} className="flex gap-2">
            {/* Botões de ação */}
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Emojis"
              >
                <Smile className="w-5 h-5" />
              </button>
              <label className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer" title="Anexar arquivo">
                <Paperclip className="w-5 h-5" />
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSending(true);
                      try {
                        await chatService.sendFile(
                          chatId,
                          currentUserId,
                          currentUserName,
                          currentUserPhoto || "",
                          file
                        );
                      } catch (error) {
                        console.error('Erro ao enviar arquivo:', error);
                        alert('Erro ao enviar arquivo');
                      } finally {
                        setSending(false);
                        e.target.value = '';
                      }
                    }
                  }}
                />
              </label>
              <label className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer" title="Enviar imagem">
                <ImageIcon className="w-5 h-5" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSending(true);
                      try {
                        await chatService.sendImage(
                          chatId,
                          currentUserId,
                          currentUserName,
                          currentUserPhoto || "",
                          file
                        );
                      } catch (error) {
                        console.error('Erro ao enviar imagem:', error);
                        alert('Erro ao enviar imagem');
                      } finally {
                        setSending(false);
                        e.target.value = '';
                      }
                    }
                  }}
                />
              </label>
            </div>

            {/* Input de mensagem */}
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              placeholder="Digite sua mensagem..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              disabled={sending}
              autoFocus
            />

            {/* Botão enviar */}
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="px-6 py-3 bg-gradient-to-r from-[#1E40AF] to-[#2563EB] text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
            >
              {sending ? (
                <Loader2Icon className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>

          {/* Dica de atalho */}
          <p className="text-xs text-gray-400 mt-2 text-center">
            Pressione Enter para enviar • Shift + Enter para nova linha
          </p>
        </div>
      </div>
    </div>
  );
}
