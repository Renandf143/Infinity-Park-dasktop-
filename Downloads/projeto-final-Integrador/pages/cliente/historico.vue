<template>
  <div>
    <Nav />
    <section class="history-section">
      <div class="container">
        <div class="history-header">
          <h1>Histórico de Serviços</h1>
          <p>Todos os serviços que você já contratou</p>
        </div>

        <div class="history-content">
          <div class="history-filters">
            <select class="filter-select">
              <option>Todos os Status</option>
              <option>Concluídos</option>
              <option>Em Andamento</option>
              <option>Cancelados</option>
            </select>
            <select class="filter-select">
              <option>Todas as Categorias</option>
              <option>Limpeza</option>
              <option>Reparos</option>
              <option>Tecnologia</option>
            </select>
          </div>

          <div class="services-list">
            <div class="service-card">
              <div class="service-info">
                <h3>Limpeza Residencial Completa</h3>
                <p class="service-provider">Por: Maria Santos</p>
                <p class="service-date">15 de Janeiro, 2024</p>
              </div>
              <div class="service-status">
                <span class="status-badge completed">Concluído</span>
                <div class="service-rating">
                  <span>⭐⭐⭐⭐⭐</span>
                  <span>5.0</span>
                </div>
              </div>
              <div class="service-actions">
                <button class="btn-secondary">Ver Detalhes</button>
                <button class="btn-primary">Contratar Novamente</button>
              </div>
            </div>

            <div class="service-card">
              <div class="service-info">
                <h3>Reparo de Torneira</h3>
                <p class="service-provider">Por: João Silva</p>
                <p class="service-date">10 de Janeiro, 2024</p>
              </div>
              <div class="service-status">
                <span class="status-badge progress">Em Andamento</span>
              </div>
              <div class="service-actions">
                <button class="btn-secondary">Ver Detalhes</button>
                <button class="btn-secondary">Mensagem</button>
              </div>
            </div>

            <div class="service-card">
              <div class="service-info">
                <h3>Instalação de TV</h3>
                <p class="service-provider">Por: Carlos Tech</p>
                <p class="service-date">5 de Janeiro, 2024</p>
              </div>
              <div class="service-status">
                <span class="status-badge completed">Concluído</span>
                <div class="service-rating">
                  <span>⭐⭐⭐⭐</span>
                  <span>4.5</span>
                </div>
              </div>
              <div class="service-actions">
                <button class="btn-secondary">Ver Detalhes</button>
                <button class="btn-primary">Contratar Novamente</button>
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
.history-section {
  background: linear-gradient(135deg, var(--cor-gelo) 0%, var(--cor-branco) 100%);
  padding: 4rem 0;
  min-height: 80vh;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 2rem;
}

.history-header {
  text-align: center;
  margin-bottom: 3rem;
}

.history-header h1 {
  font-family: var(--bold);
  font-size: var(--f6);
  color: var(--cor-preto);
  margin-bottom: 1rem;
}

.history-header p {
  font-family: var(--regular);
  font-size: var(--f2);
  color: var(--cor-cinza);
}

.history-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 1px solid var(--cor-cinza-3);
  border-radius: 8px;
  font-family: var(--regular);
  background: var(--cor-branco);
}

.services-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.service-card {
  background: var(--cor-branco);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 2rem;
  align-items: center;
}

.service-info h3 {
  font-family: var(--bold);
  font-size: var(--f3);
  color: var(--cor-preto);
  margin-bottom: 0.5rem;
}

.service-provider {
  font-family: var(--regular);
  color: var(--cor-azul-principal);
  margin-bottom: 0.25rem;
}

.service-date {
  font-family: var(--regular);
  color: var(--cor-cinza);
  font-size: var(--f1);
}

.service-status {
  text-align: center;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: var(--f1);
  font-family: var(--regular);
  margin-bottom: 0.5rem;
  display: block;
}

.status-badge.completed {
  background: #D1FAE5;
  color: #065F46;
}

.status-badge.progress {
  background: #FEF3C7;
  color: #92400E;
}

.service-rating {
  font-size: var(--f1);
  color: var(--cor-cinza);
}

.service-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.btn-primary, .btn-secondary {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-family: var(--regular);
  font-size: var(--f1);
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.btn-primary {
  background: var(--cor-azul-principal);
  color: var(--cor-branco);
}

.btn-secondary {
  background: transparent;
  color: var(--cor-cinza-escuro);
  border: 1px solid var(--cor-cinza-2);
}

@media screen and (max-width: 768px) {
  .service-card {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .history-filters {
    flex-direction: column;
  }
}
</style>
