<template>
  <div>
    <Nav />
    <section class="reviews-section">
      <div class="container">
        <div class="page-header">
          <h1>Minhas Avaliações</h1>
          <p>Avaliações que você fez para os profissionais</p>
        </div>

        <div class="reviews-list">
          <div class="review-card">
            <div class="review-header">
              <div class="provider-info">
                <div class="provider-avatar">
                  <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
                    <circle cx="25" cy="25" r="25" fill="#E5E7EB"/>
                    <circle cx="25" cy="20" r="8" fill="#9CA3AF"/>
                    <path d="M10 40c0-8.284 6.716-15 15-15s15 6.716 15 15" fill="#9CA3AF"/>
                  </svg>
                </div>
                <div>
                  <h3>Maria Santos</h3>
                  <p>Limpeza Residencial</p>
                </div>
              </div>
              <div class="review-rating">
                <span class="stars">⭐⭐⭐⭐⭐</span>
                <span class="rating-number">5.0</span>
              </div>
            </div>
            <div class="review-content">
              <p>"Excelente profissional! Muito caprichosa e pontual. Recomendo!"</p>
              <span class="review-date">15 de Janeiro, 2024</span>
            </div>
            <div class="review-actions">
              <button class="btn-secondary">Editar Avaliação</button>
              <button class="btn-primary">Contratar Novamente</button>
            </div>
          </div>

          <div class="review-card">
            <div class="review-header">
              <div class="provider-info">
                <div class="provider-avatar">
                  <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
                    <circle cx="25" cy="25" r="25" fill="#E5E7EB"/>
                    <circle cx="25" cy="20" r="8" fill="#9CA3AF"/>
                    <path d="M10 40c0-8.284 6.716-15 15-15s15 6.716 15 15" fill="#9CA3AF"/>
                  </svg>
                </div>
                <div>
                  <h3>João Silva</h3>
                  <p>Eletricista</p>
                </div>
              </div>
              <div class="review-rating">
                <span class="stars">⭐⭐⭐⭐</span>
                <span class="rating-number">4.0</span>
              </div>
            </div>
            <div class="review-content">
              <p>"Bom trabalho, resolveu o problema rapidamente."</p>
              <span class="review-date">10 de Janeiro, 2024</span>
            </div>
            <div class="review-actions">
              <button class="btn-secondary">Editar Avaliação</button>
              <button class="btn-primary">Contratar Novamente</button>
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
.reviews-section {
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

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.review-card {
  background: var(--cor-branco);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.provider-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.provider-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.provider-info h3 {
  font-family: var(--bold);
  font-size: var(--f3);
  color: var(--cor-preto);
}

.provider-info p {
  font-family: var(--regular);
  color: var(--cor-azul-principal);
}

.review-rating {
  text-align: right;
}

.stars {
  font-size: var(--f2);
}

.rating-number {
  font-family: var(--bold);
  color: var(--cor-azul-principal);
  margin-left: 0.5rem;
}

.review-content p {
  font-family: var(--regular);
  font-size: var(--f2);
  color: var(--cor-preto);
  margin-bottom: 1rem;
  font-style: italic;
}

.review-date {
  font-family: var(--regular);
  font-size: var(--f1);
  color: var(--cor-cinza);
}

.review-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-primary, .btn-secondary {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-family: var(--regular);
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
