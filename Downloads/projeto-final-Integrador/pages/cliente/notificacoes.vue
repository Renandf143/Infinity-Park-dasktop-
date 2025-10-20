<template>
  <div>
    <Nav />
    <section class="notifications-section">
      <div class="container">
        <div class="page-header">
          <h1>Notificações</h1>
          <p>Mantenha-se atualizado sobre seus serviços</p>
        </div>

        <div class="notifications-content">
          <div class="notifications-filters">
            <button class="filter-btn active">Todas</button>
            <button class="filter-btn">Não Lidas</button>
            <button class="filter-btn">Serviços</button>
            <button class="filter-btn">Promoções</button>
          </div>

          <div class="notifications-list">
            <div class="notification-item unread">
              <div class="notification-icon service">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <div class="notification-content">
                <h4>Serviço Concluído</h4>
                <p>Maria Santos concluiu o serviço de limpeza. Avalie o profissional!</p>
                <span class="notification-time">2 horas atrás</span>
              </div>
            </div>

            <div class="notification-item">
              <div class="notification-icon promotion">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <div class="notification-content">
                <h4>Promoção Especial</h4>
                <p>20% de desconto em serviços de limpeza nesta semana!</p>
                <span class="notification-time">1 dia atrás</span>
              </div>
            </div>

            <div class="notification-item">
              <div class="notification-icon message">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                </svg>
              </div>
              <div class="notification-content">
                <h4>Nova Mensagem</h4>
                <p>João Silva enviou uma mensagem sobre o reparo elétrico.</p>
                <span class="notification-time">2 dias atrás</span>
              </div>
            </div>

            <div class="notification-item">
              <div class="notification-icon service">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                </svg>
              </div>
              <div class="notification-content">
                <h4>Novo Profissional Disponível</h4>
                <p>Carlos Tech está disponível na sua região para serviços de tecnologia.</p>
                <span class="notification-time">3 dias atrás</span>
              </div>
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
.notifications-section {
  background: linear-gradient(135deg, var(--cor-gelo) 0%, var(--cor-branco) 100%);
  padding: 4rem 0;
  min-height: 80vh;
}

.container {
  max-width: 800px;
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

.notifications-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: center;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--cor-cinza-3);
  border-radius: 20px;
  background: var(--cor-branco);
  font-family: var(--regular);
  cursor: pointer;
  transition: all 0.3s;
}

.filter-btn.active {
  background: var(--cor-azul-principal);
  color: var(--cor-branco);
  border-color: var(--cor-azul-principal);
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.notification-item {
  background: var(--cor-branco);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.notification-item.unread {
  border-left: 4px solid var(--cor-azul-principal);
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notification-icon.service {
  background: #d1fae5;
  color: #065f46;
}

.notification-icon.promotion {
  background: #fef3c7;
  color: #92400e;
}

.notification-icon.message {
  background: #dbeafe;
  color: #1e40af;
}

.notification-content h4 {
  font-family: var(--bold);
  font-size: var(--f2);
  color: var(--cor-preto);
  margin-bottom: 0.5rem;
}

.notification-content p {
  font-family: var(--regular);
  color: var(--cor-cinza);
  margin-bottom: 0.5rem;
}

.notification-time {
  font-family: var(--regular);
  font-size: var(--f1);
  color: var(--cor-cinza);
}
</style>
