<template>
  <div class="meus-pedidos">
    <div class="container">
      <div class="page-header">
        <div class="header-content">
          <Icon3D name="orders" size="lg" />
          <div>
            <h1>Meus Pedidos</h1>
            <p>Acompanhe todos os seus pedidos e solicitações</p>
          </div>
        </div>
        <button class="btn-new-order">
          <Icon3D name="search" size="sm" />
          Novo Pedido
        </button>
      </div>

      <!-- Status Cards -->
      <div class="status-cards">
        <div class="status-card">
          <Icon3D name="orders" size="md" />
          <div class="status-info">
            <h3>3</h3>
            <p>Pedidos Ativos</p>
          </div>
        </div>
        <div class="status-card">
          <Icon3D name="chat" size="md" />
          <div class="status-info">
            <h3>2</h3>
            <p>Aguardando Resposta</p>
          </div>
        </div>
        <div class="status-card">
          <Icon3D name="wallet" size="md" />
          <div class="status-info">
            <h3>5</h3>
            <p>Concluídos</p>
          </div>
        </div>
      </div>

      <!-- Orders List -->
      <div class="orders-section">
        <div class="section-header">
          <h2>Pedidos Recentes</h2>
          <div class="filters">
            <select class="filter-select">
              <option value="all">Todos</option>
              <option value="active">Ativos</option>
              <option value="completed">Concluídos</option>
              <option value="cancelled">Cancelados</option>
            </select>
          </div>
        </div>

        <div class="orders-list">
          <!-- Mock Order Item -->
          <div class="order-item">
            <div class="order-header">
              <div class="order-info">
                <h3>Instalação de Ar Condicionado</h3>
                <p class="order-id">#PED-2024-001</p>
              </div>
              <div class="order-status active">Em Andamento</div>
            </div>
            <div class="order-details">
              <div class="detail-item">
                <Icon3D name="profile" size="sm" />
                <span>João Silva - Técnico em Refrigeração</span>
              </div>
              <div class="detail-item">
                <Icon3D name="wallet" size="sm" />
                <span>R$ 350,00</span>
              </div>
              <div class="detail-item">
                <Icon3D name="notifications" size="sm" />
                <span>Criado em 15/01/2024</span>
              </div>
            </div>
            <div class="order-actions">
              <button class="btn-chat">
                <Icon3D name="chat" size="sm" />
                Chat
              </button>
              <button class="btn-details">Ver Detalhes</button>
            </div>
          </div>

          <!-- Empty State -->
          <div class="empty-state">
            <Icon3D name="orders" size="xl" />
            <h3>Nenhum pedido encontrado</h3>
            <p>Você ainda não fez nenhum pedido. Que tal começar agora?</p>
            <button class="btn-primary">
              <Icon3D name="search" size="sm" />
              Buscar Serviços
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { user } = useAuth()
const { isCliente } = useUserType()

// Verificar se usuário está logado e é cliente
if (!user.value) {
  await navigateTo('/entrar')
}

if (!isCliente.value) {
  await navigateTo('/dashboard')
}

// Meta tags
useHead({
  title: 'Meus Pedidos - ServiFlix',
  meta: [
    { name: 'description', content: 'Acompanhe todos os seus pedidos no ServiFlix' }
  ]
})
</script>

<style scoped>
.meus-pedidos {
  min-height: 100vh;
  background: linear-gradient(135deg, #f3e8ff 0%, var(--bg-primary) 30%);
  padding: var(--space-xl) 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-lg);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-2xl);
  background: var(--bg-primary);
  padding: var(--space-xl);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-lg);
}

.header-content {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
}

.header-content h1 {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 var(--space-xs) 0;
}

.header-content p {
  color: var(--text-secondary);
  margin: 0;
}

.btn-new-order {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  background: #8b5cf6;
  color: white;
  border: none;
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-lg);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-new-order:hover {
  background: #7c3aed;
  transform: translateY(-2px);
}

.status-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-lg);
  margin-bottom: var(--space-2xl);
}

.status-card {
  background: var(--bg-primary);
  padding: var(--space-xl);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  transition: transform 0.3s ease;
}

.status-card:hover {
  transform: translateY(-4px);
}

.status-info h3 {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 var(--space-xs) 0;
}

.status-info p {
  color: var(--text-secondary);
  margin: 0;
  font-size: 14px;
}

.orders-section {
  background: var(--bg-primary);
  border-radius: var(--radius-2xl);
  padding: var(--space-2xl);
  box-shadow: var(--shadow-lg);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-xl);
}

.section-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.filter-select {
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.order-item {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  transition: all 0.3s ease;
}

.order-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-lg);
}

.order-info h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--space-xs) 0;
}

.order-id {
  color: var(--text-secondary);
  font-size: 14px;
  margin: 0;
}

.order-status {
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.order-status.active {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.order-details {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-lg);
  margin-bottom: var(--space-lg);
}

.detail-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--text-secondary);
  font-size: 14px;
}

.order-actions {
  display: flex;
  gap: var(--space-md);
}

.btn-chat {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  background: #4facfe;
  color: white;
  border: none;
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-lg);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-chat:hover {
  background: #00f2fe;
}

.btn-details {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-lg);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-details:hover {
  background: var(--bg-secondary);
}

.empty-state {
  text-align: center;
  padding: var(--space-3xl);
  color: var(--text-secondary);
}

.empty-state h3 {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  margin: var(--space-lg) 0 var(--space-md) 0;
}

.empty-state p {
  margin-bottom: var(--space-xl);
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  background: #8b5cf6;
  color: white;
  border: none;
  padding: var(--space-md) var(--space-xl);
  border-radius: var(--radius-lg);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: #7c3aed;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: var(--space-lg);
    text-align: center;
  }
  
  .order-header {
    flex-direction: column;
    gap: var(--space-md);
  }
  
  .order-details {
    flex-direction: column;
    gap: var(--space-md);
  }
  
  .order-actions {
    flex-direction: column;
  }
}
</style>