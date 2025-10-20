<template>
  <div>
    <Nav />
    <section class="dashboard-section">
      <div class="container">
        <div class="dashboard-header">
          <h1>Dashboard do Cliente</h1>
          <p>Visão geral dos seus serviços e atividades</p>
        </div>

        <div class="dashboard-grid">
          <!-- Visão Geral -->
          <div class="dashboard-card">
            <h3>Serviços Contratados</h3>
            <div class="stats">
              <div class="stat-item">
                <span class="stat-number">5</span>
                <span class="stat-label">Em Andamento</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">12</span>
                <span class="stat-label">Concluídos</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">1</span>
                <span class="stat-label">Cancelados</span>
              </div>
            </div>
          </div>

          <!-- Status de Pedidos -->
          <div class="dashboard-card">
            <h3>Pedidos Recentes</h3>
            <div class="recent-orders">
              <div class="order-item">
                <span class="order-service">Limpeza Residencial</span>
                <span class="order-status status-progress">Em Andamento</span>
              </div>
              <div class="order-item">
                <span class="order-service">Reparo Elétrico</span>
                <span class="order-status status-completed">Concluído</span>
              </div>
            </div>
          </div>

          <!-- Recomendações -->
          <div class="dashboard-card">
            <h3>Profissionais Recomendados</h3>
            <p>Com base no seu histórico de serviços</p>
            <div class="recommendations">
              <div class="recommendation-item">
                <span>João Silva - Eletricista</span>
                <span class="rating">⭐ 4.8</span>
              </div>
              <div class="recommendation-item">
                <span>Maria Santos - Limpeza</span>
                <span class="rating">⭐ 4.9</span>
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
.dashboard-section {
  background: linear-gradient(135deg, var(--cor-gelo) 0%, var(--cor-branco) 100%);
  padding: 4rem 0;
  min-height: 80vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 3rem;
}

.dashboard-header h1 {
  font-family: var(--bold);
  font-size: var(--f6);
  color: var(--cor-preto);
  margin-bottom: 1rem;
}

.dashboard-header p {
  font-family: var(--regular);
  font-size: var(--f2);
  color: var(--cor-cinza);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.dashboard-card {
  background: var(--cor-branco);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.dashboard-card h3 {
  font-family: var(--bold);
  font-size: var(--f3);
  color: var(--cor-preto);
  margin-bottom: 1.5rem;
}

.stats {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-family: var(--bold);
  font-size: var(--f5);
  color: var(--cor-azul-principal);
}

.stat-label {
  font-family: var(--regular);
  font-size: var(--f1);
  color: var(--cor-cinza);
}

.recent-orders, .recommendations {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-item, .recommendation-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--cor-gelo);
  border-radius: 8px;
}

.order-service {
  font-family: var(--regular);
  color: var(--cor-preto);
}

.order-status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: var(--f0);
  font-family: var(--regular);
}

.status-progress {
  background: #FEF3C7;
  color: #92400E;
}

.status-completed {
  background: #D1FAE5;
  color: #065F46;
}

.rating {
  font-family: var(--regular);
  color: var(--cor-azul-principal);
}
</style>
