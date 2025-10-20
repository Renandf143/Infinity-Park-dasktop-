<template>
  <div>
    <Nav />
    <section class="favorites-section">
      <div class="container">
        <div class="page-header">
          <h1>Meus Favoritos</h1>
          <p>Profissionais que você marcou como favoritos</p>
        </div>

        <div class="favorites-grid">
          <div class="provider-card">
            <div class="provider-avatar">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="40" r="40" fill="#E5E7EB"/>
                <circle cx="40" cy="32" r="12" fill="#9CA3AF"/>
                <path d="M16 64c0-13.255 10.745-24 24-24s24 10.745 24 24" fill="#9CA3AF"/>
              </svg>
            </div>
            <h3>Maria Santos</h3>
            <p class="provider-category">Limpeza Residencial</p>
            <div class="provider-rating">⭐ 4.9 (127 avaliações)</div>
            <p class="provider-location">São Paulo, SP</p>
            <div class="provider-actions">
              <button class="btn-primary">Contratar</button>
              <button class="btn-secondary">Mensagem</button>
            </div>
          </div>

          <div class="provider-card">
            <div class="provider-avatar">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="40" r="40" fill="#E5E7EB"/>
                <circle cx="40" cy="32" r="12" fill="#9CA3AF"/>
                <path d="M16 64c0-13.255 10.745-24 24-24s24 10.745 24 24" fill="#9CA3AF"/>
              </svg>
            </div>
            <h3>João Silva</h3>
            <p class="provider-category">Eletricista</p>
            <div class="provider-rating">⭐ 4.8 (89 avaliações)</div>
            <p class="provider-location">São Paulo, SP</p>
            <div class="provider-actions">
              <button class="btn-primary">Contratar</button>
              <button class="btn-secondary">Mensagem</button>
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
.favorites-section {
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

.page-header p {
  font-family: var(--regular);
  font-size: var(--f2);
  color: var(--cor-cinza);
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.provider-card {
  background: var(--cor-branco);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.provider-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin: 0 auto 1rem;
  overflow: hidden;
}

.provider-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.provider-card h3 {
  font-family: var(--bold);
  font-size: var(--f3);
  color: var(--cor-preto);
  margin-bottom: 0.5rem;
}

.provider-category {
  font-family: var(--regular);
  color: var(--cor-azul-principal);
  margin-bottom: 0.5rem;
}

.provider-rating {
  font-family: var(--regular);
  color: var(--cor-cinza);
  font-size: var(--f1);
  margin-bottom: 0.5rem;
}

.provider-location {
  font-family: var(--regular);
  color: var(--cor-cinza);
  font-size: var(--f1);
  margin-bottom: 1.5rem;
}

.provider-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.btn-primary, .btn-secondary {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-family: var(--regular);
  font-size: var(--f1);
  cursor: pointer;
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
</style>
