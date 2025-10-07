<template>
  <div class="chat-page">
    <div class="container">
      <div class="chat-container">
        <!-- Chat Sidebar -->
        <div class="chat-sidebar">
          <div class="sidebar-header">
            <svg class="icon-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <h2>Conversas</h2>
          </div>
          
          <div class="search-box">
            <svg class="icon-search" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input type="text" placeholder="Buscar conversas..." />
          </div>

          <div class="conversations-list">
            <!-- Mock Conversation -->
            <div class="conversation-item active">
              <div class="conversation-avatar">
                <img src="/default-avatar.svg" alt="João Silva" />
                <div class="status-dot online"></div>
              </div>
              <div class="conversation-info">
                <h4>João Silva</h4>
                <p>Técnico em Refrigeração</p>
                <small>Sobre instalação do ar...</small>
              </div>
              <div class="conversation-meta">
                <span class="time">14:30</span>
                <div class="unread-badge">2</div>
              </div>
            </div>

            <div class="conversation-item">
              <div class="conversation-avatar">
                <img src="/default-avatar.svg" alt="Maria Santos" />
                <div class="status-dot offline"></div>
              </div>
              <div class="conversation-info">
                <h4>Maria Santos</h4>
                <p>Eletricista</p>
                <small>Obrigado pelo contato!</small>
              </div>
              <div class="conversation-meta">
                <span class="time">Ontem</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Main -->
        <div class="chat-main">
          <div class="chat-header">
            <div class="chat-user-info">
              <img src="/default-avatar.svg" alt="João Silva" class="chat-avatar" />
              <div>
                <h3>João Silva</h3>
                <p>Técnico em Refrigeração • Online</p>
              </div>
            </div>
            <div class="chat-actions">
              <button class="btn-action">
                <svg class="icon-orders" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                </svg>
              </button>
              <button class="btn-action">
                <svg class="icon-settings" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m17-4a4 4 0 0 1-8 0 4 4 0 0 1 8 0zM7 17a4 4 0 0 1-8 0 4 4 0 0 1 8 0z"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="chat-messages">
            <!-- Messages -->
            <div class="message received">
              <div class="message-avatar">
                <img src="/default-avatar.svg" alt="João Silva" />
              </div>
              <div class="message-content">
                <div class="message-bubble">
                  <p>Olá! Vi seu pedido para instalação de ar condicionado. Posso ajudar com isso!</p>
                </div>
                <span class="message-time">14:25</span>
              </div>
            </div>

            <div class="message sent">
              <div class="message-content">
                <div class="message-bubble">
                  <p>Ótimo! Preciso instalar um split de 12.000 BTUs. Você tem disponibilidade para esta semana?</p>
                </div>
                <span class="message-time">14:27</span>
              </div>
            </div>

            <div class="message received">
              <div class="message-avatar">
                <img src="/default-avatar.svg" alt="João Silva" />
              </div>
              <div class="message-content">
                <div class="message-bubble">
                  <p>Sim, tenho disponibilidade. O valor seria R$ 350,00 incluindo mão de obra. Posso ir amanhã pela manhã se for conveniente.</p>
                </div>
                <span class="message-time">14:30</span>
              </div>
            </div>

            <!-- Typing Indicator -->
            <div class="typing-indicator">
              <div class="typing-avatar">
                <img src="/default-avatar.svg" alt="João Silva" />
              </div>
              <div class="typing-bubble">
                <div class="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>

          <div class="chat-input">
            <div class="input-container">
              <button class="btn-attachment">
                <svg class="icon-attachment" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.64 16.2a2 2 0 0 1-2.83-2.83l8.49-8.49"/>
                </svg>
              </button>
              <input 
                type="text" 
                placeholder="Digite sua mensagem..." 
                v-model="messageText"
                @keypress.enter="sendMessage"
              />
              <button class="btn-send" @click="sendMessage" :disabled="!messageText.trim()">
                <svg class="icon-send" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22,2 15,22 11,13 2,9"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const messageText = ref('')

const sendMessage = () => {
  if (messageText.value.trim()) {
    // TODO: Implementar envio de mensagem
    console.log('Enviando mensagem:', messageText.value)
    messageText.value = ''
  }
}

// Meta tags
useHead({
  title: 'Chat - ServiFlix',
  meta: [
    { name: 'description', content: 'Chat com profissionais no ServiFlix' }
  ]
})
</script>

<style scoped>
.chat-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f3e8ff 0%, #ffffff 30%);
  padding: 2rem 0;
  font-family: 'Inter', sans-serif;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.chat-container {
  display: grid;
  grid-template-columns: 350px 1fr;
  height: 80vh;
  background: #ffffff;
  border-radius: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.chat-sidebar {
  background: #f8fafc;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background: #ffffff;
}

.sidebar-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.search-box input {
  flex: 1;
  border: 1px solid #d1d5db;
  background: #ffffff;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  color: #1f2937;
  font-size: 14px;
}

.search-box input:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.search-box input::placeholder {
  color: #9ca3af;
}

.conversations-list {
  flex: 1;
  overflow-y: auto;
}

.conversation-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: background 0.2s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.conversation-item:hover {
  background: #f1f5f9;
}

.conversation-item.active {
  background: rgba(139, 92, 246, 0.1);
  border-right: 3px solid #8b5cf6;
}

.conversation-avatar {
  position: relative;
}

.conversation-avatar img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e5e7eb;
}

.status-dot {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #f8fafc;
}

.status-dot.online {
  background: #10b981;
}

.status-dot.offline {
  background: #6b7280;
}

.conversation-info {
  flex: 1;
  min-width: 0;
}

.conversation-info h4 {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 2px 0;
}

.conversation-info p {
  font-size: 12px;
  color: #6b7280;
  margin: 0 0 4px 0;
}

.conversation-info small {
  font-size: 12px;
  color: #9ca3af;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.conversation-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.time {
  font-size: 11px;
  color: #9ca3af;
}

.unread-badge {
  background: #ef4444;
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 9999px;
  min-width: 16px;
  text-align: center;
}

.chat-main {
  display: flex;
  flex-direction: column;
  background: #ffffff;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f8fafc;
}

.chat-user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.chat-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e5e7eb;
}

.chat-user-info h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 2px 0;
}

.chat-user-info p {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

.chat-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-action {
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #6b7280;
}

.btn-action:hover {
  background: #f3f4f6;
  color: #374151;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #ffffff;
}

.message {
  display: flex;
  gap: 0.75rem;
  max-width: 70%;
}

.message.sent {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-avatar img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e5e7eb;
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.message.sent .message-content {
  align-items: flex-end;
}

.message-bubble {
  background: #f1f5f9;
  padding: 0.75rem 1rem;
  border-radius: 1.25rem;
  max-width: 100%;
  border: 1px solid #e5e7eb;
}

.message.sent .message-bubble {
  background: #8b5cf6;
  color: white;
  border-color: #8b5cf6;
}

.message-bubble p {
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
}

.message-time {
  font-size: 11px;
  color: #9ca3af;
}

.typing-indicator {
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
}

.typing-avatar img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e5e7eb;
}

.typing-bubble {
  background: #f1f5f9;
  padding: 0.75rem 1rem;
  border-radius: 1.25rem;
  border: 1px solid #e5e7eb;
}

.typing-dots {
  display: flex;
  gap: 4px;
}

.typing-dots span {
  width: 6px;
  height: 6px;
  background: #9ca3af;
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.typing-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

.chat-input {
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  background: #f8fafc;
}

.input-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 1.5rem;
  padding: 0.5rem;
}

.btn-attachment {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: background 0.2s ease;
  color: #6b7280;
}

.btn-attachment:hover {
  background: #f3f4f6;
  color: #374151;
}

.input-container input {
  flex: 1;
  border: none;
  background: none;
  padding: 0.75rem;
  color: #1f2937;
  font-size: 14px;
}

.input-container input:focus {
  outline: none;
}

.input-container input::placeholder {
  color: #9ca3af;
}

.btn-send {
  background: #8b5cf6;
  border: none;
  border-radius: 0.75rem;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-send:hover:not(:disabled) {
  background: #7c3aed;
  transform: translateY(-1px);
}

.btn-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Ícones SVG */
.icon-chat,
.icon-search,
.icon-attachment,
.icon-send,
.icon-orders,
.icon-settings {
  width: 20px;
  height: 20px;
  color: #6b7280;
  transition: color 0.2s ease;
}

.sidebar-header .icon-chat {
  width: 24px;
  height: 24px;
  color: #8b5cf6;
}

.search-box .icon-search {
  width: 18px;
  height: 18px;
  color: #9ca3af;
}

.btn-attachment .icon-attachment {
  width: 18px;
  height: 18px;
}

.btn-send .icon-send {
  width: 18px;
  height: 18px;
  color: white;
}

.btn-action .icon-orders,
.btn-action .icon-settings {
  width: 16px;
  height: 16px;
}

.btn-action:hover .icon-orders,
.btn-action:hover .icon-settings {
  color: #374151;
}

.btn-attachment:hover .icon-attachment {
  color: #374151;
}

/* Responsividade melhorada */
@media (max-width: 1024px) {
  .chat-container {
    grid-template-columns: 300px 1fr;
    height: 82vh;
  }
  
  .chat-sidebar {
    min-width: 280px;
  }
}

@media (max-width: 768px) {
  .chat-page {
    padding: 0.5rem 0;
  }
  
  .container {
    padding: 0 0.5rem;
  }
  
  .chat-container {
    grid-template-columns: 1fr;
    height: calc(100vh - 80px);
    border-radius: 0.75rem;
  }
  
  .chat-sidebar {
    display: none;
  }
  
  .chat-header {
    padding: 1rem;
    border-radius: 0.75rem 0.75rem 0 0;
  }
  
  .chat-messages {
    padding: 1rem;
    gap: 0.75rem;
  }
  
  .message {
    max-width: 85%;
  }
  
  .message-bubble {
    padding: 0.625rem 0.875rem;
    border-radius: 1rem;
  }
  
  .message-bubble p {
    font-size: 0.9rem;
  }
  
  .chat-input {
    padding: 1rem;
    border-radius: 0 0 0.75rem 0.75rem;
  }
  
  .input-container {
    border-radius: 1.25rem;
    padding: 0.375rem;
  }
  
  .input-container input {
    padding: 0.625rem;
    font-size: 0.9rem;
  }
  
  .btn-send {
    min-width: 36px;
    height: 36px;
    border-radius: 0.625rem;
  }
}

@media (max-width: 480px) {
  .chat-page {
    padding: 0;
  }
  
  .container {
    padding: 0;
  }
  
  .chat-container {
    height: 100vh;
    border-radius: 0;
  }
  
  .chat-header {
    padding: 0.75rem;
    border-radius: 0;
  }
  
  .chat-user-info h3 {
    font-size: 0.9rem;
  }
  
  .chat-user-info p {
    font-size: 0.75rem;
  }
  
  .chat-avatar {
    width: 32px;
    height: 32px;
  }
  
  .chat-messages {
    padding: 0.75rem;
  }
  
  .message {
    max-width: 90%;
  }
  
  .message-avatar img {
    width: 28px;
    height: 28px;
  }
  
  .message-bubble {
    padding: 0.5rem 0.75rem;
  }
  
  .message-bubble p {
    font-size: 0.85rem;
    line-height: 1.3;
  }
  
  .message-time {
    font-size: 0.7rem;
  }
  
  .chat-input {
    padding: 0.75rem;
    border-radius: 0;
  }
  
  .input-container {
    padding: 0.25rem;
  }
  
  .input-container input {
    padding: 0.5rem;
    font-size: 0.85rem;
  }
  
  .btn-attachment {
    padding: 0.375rem;
  }
  
  .btn-send {
    min-width: 32px;
    height: 32px;
    padding: 0.5rem;
  }
  
  .icon-attachment,
  .icon-send {
    width: 16px;
    height: 16px;
  }
}
</style>