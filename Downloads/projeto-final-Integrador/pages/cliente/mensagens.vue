<template>
  <div>
    <Nav />
    <section class="messages-section">
      <div class="container">
        <div class="page-header">
          <h1>Mensagens</h1>
          <p>Converse com os profissionais</p>
        </div>

        <div class="messages-layout">
          <div class="conversations-list">
            <h3>Conversas</h3>
            <div class="conversation-item active">
              <div class="conversation-avatar">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="20" r="20" fill="#E5E7EB"/>
                  <circle cx="20" cy="16" r="6" fill="#9CA3AF"/>
                  <path d="M8 32c0-6.627 5.373-12 12-12s12 5.373 12 12" fill="#9CA3AF"/>
                </svg>
              </div>
              <div class="conversation-info">
                <h4>Maria Santos</h4>
                <p>Olá! Quando podemos agendar a limpeza?</p>
                <span class="conversation-time">10:30</span>
              </div>
            </div>

            <div class="conversation-item">
              <div class="conversation-avatar">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="20" r="20" fill="#E5E7EB"/>
                  <circle cx="20" cy="16" r="6" fill="#9CA3AF"/>
                  <path d="M8 32c0-6.627 5.373-12 12-12s12 5.373 12 12" fill="#9CA3AF"/>
                </svg>
              </div>
              <div class="conversation-info">
                <h4>João Silva</h4>
                <p>O reparo foi concluído com sucesso!</p>
                <span class="conversation-time">Ontem</span>
              </div>
            </div>
          </div>

          <div class="chat-area">
            <div class="chat-header">
              <div class="chat-user">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="20" r="20" fill="#E5E7EB"/>
                  <circle cx="20" cy="16" r="6" fill="#9CA3AF"/>
                  <path d="M8 32c0-6.627 5.373-12 12-12s12 5.373 12 12" fill="#9CA3AF"/>
                </svg>
                <div>
                  <h4>Maria Santos</h4>
                  <span>Online</span>
                </div>
              </div>
            </div>

            <div class="chat-messages">
              <div class="message received">
                <p>Olá! Quando podemos agendar a limpeza?</p>
                <span class="message-time">10:30</span>
              </div>
              <div class="message sent">
                <p>Oi Maria! Que tal amanhã às 14h?</p>
                <span class="message-time">10:32</span>
              </div>
              <div class="message received">
                <p>Perfeito! Estarei lá no horário combinado.</p>
                <span class="message-time">10:35</span>
              </div>
            </div>

            <div class="chat-input">
              <input type="text" placeholder="Digite sua mensagem..." class="message-input">
              <button class="send-btn">Enviar</button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <Footer />
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})
</script>

<style scoped>
.messages-section {
  background: linear-gradient(135deg, var(--cor-gelo) 0%, var(--cor-branco) 100%);
  padding: 4rem 0;
  min-height: 80vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-header h1 {
  font-family: var(--bold);
  font-size: var(--f6);
  color: var(--cor-preto);
  margin-bottom: 1rem;
}

.messages-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  height: 600px;
}

.conversations-list {
  background: var(--cor-branco);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.conversations-list h3 {
  font-family: var(--bold);
  margin-bottom: 1rem;
}

.conversation-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 0.5rem;
}

.conversation-item.active {
  background: var(--cor-gelo);
}

.conversation-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
}

.conversation-avatar svg {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.conversation-info h4 {
  font-family: var(--bold);
  font-size: var(--f2);
  margin-bottom: 0.25rem;
}

.conversation-info p {
  font-family: var(--regular);
  font-size: var(--f1);
  color: var(--cor-cinza);
}

.chat-area {
  background: var(--cor-branco);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.chat-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--cor-cinza-3);
}

.chat-user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.chat-user svg {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.chat-messages {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

.message {
  margin-bottom: 1rem;
  max-width: 70%;
}

.message.sent {
  margin-left: auto;
  text-align: right;
}

.message p {
  background: var(--cor-gelo);
  padding: 0.75rem 1rem;
  border-radius: 12px;
  margin-bottom: 0.25rem;
}

.message.sent p {
  background: var(--cor-azul-principal);
  color: var(--cor-branco);
}

.message-time {
  font-size: var(--f0);
  color: var(--cor-cinza);
}

.chat-input {
  padding: 1.5rem;
  border-top: 1px solid var(--cor-cinza-3);
  display: flex;
  gap: 1rem;
}

.message-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid var(--cor-cinza-3);
  border-radius: 8px;
}

.send-btn {
  background: var(--cor-azul-principal);
  color: var(--cor-branco);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
}
</style>
