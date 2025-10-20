<template>
  <div class="cadastro-page">
    <div class="cadastro-container">
      <!-- Seção Principal de Conteúdo -->
      <div class="cadastro-content">
        <!-- Cabeçalho com Hierarquia Clara -->
        <header class="cadastro-header">
          <h1 class="titulo-principal">Como você deseja se cadastrar?</h1>
          <p class="subtitulo-explicativo">Escolha a opção que melhor descreve você</p>
        </header>

        <!-- Cards de Opções -->
        <div class="cards-container">
          <!-- Card Cliente -->
          <div class="option-card" @click="navegarPara('cliente')">
            <div class="card-header">
              <div class="icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <h3 class="card-title">Cliente</h3>
            </div>
            <p class="card-description">Quero contratar serviços</p>
            <div class="card-footer">
              <span class="action-text">Começar</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          <!-- Card Profissional -->
          <div class="option-card" @click="navegarPara('profissional')">
            <div class="card-header">
              <div class="icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
              </div>
              <h3 class="card-title">Profissional</h3>
            </div>
            <p class="card-description">Quero oferecer serviços</p>
            <div class="card-footer">
              <span class="action-text">Começar</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          <!-- Card Empresa -->
          <div class="option-card" @click="navegarPara('empresa')">
            <div class="card-header">
              <div class="icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 21h18" />
                  <path d="M5 21V7l8-4v18" />
                  <path d="M19 21V11l-6-4" />
                  <path d="M9 9v.01" />
                  <path d="M9 12v.01" />
                  <path d="M9 15v.01" />
                  <path d="M9 18v.01" />
                </svg>
              </div>
              <h3 class="card-title">Empresa</h3>
            </div>
            <p class="card-description">Quero divulgar serviços</p>
            <div class="card-footer">
              <span class="action-text">Começar</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Link de Login -->
        <footer class="login-redirect">
          <p class="login-text">
            Já tem uma conta?
            <NuxtLink to="/login" class="login-link">Faça login</NuxtLink>
          </p>
        </footer>
      </div>

      <!-- Seção Visual -->
      <div class="cadastro-visual">
        <div class="visual-content">
          <img src="/assets/images/imagem-fundo-login.png" alt="Serviflix - Plataforma de Serviços" class="visual-image" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})

const navegarPara = (tipo) => {
  switch (tipo) {
    case 'cliente':
      navigateTo('/cliente/cadastro')
      break
    case 'profissional':
      navigateTo('/cadastro-profissional')
      break
    case 'empresa':
      navigateTo('/empresa/cadastro')
      break
  }
}
</script>

<style scoped>
/* ===== LAYOUT PRINCIPAL ===== */
.cadastro-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--cor-gelo) 0%, var(--cor-branco) 100%);
}

.cadastro-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
}

.cadastro-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  background: var(--cor-branco);
}

/* ===== HIERARQUIA VISUAL - CABEÇALHO ===== */
.cadastro-header {
  text-align: center;
  margin-bottom: 3rem;
  max-width: 600px;
}

.titulo-principal {
  font-family: var(--bold);
  font-size: var(--f6);
  color: var(--cor-preto);
  margin-bottom: 1rem;
  line-height: 1.2;
  font-weight: 700;
}

.subtitulo-explicativo {
  font-family: var(--regular);
  font-size: var(--f2);
  color: var(--cor-cinza);
  margin: 0;
  font-weight: 400;
  line-height: 1.4;
}

/* ===== CONTAINER DOS CARDS ===== */
.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  width: 100%;
  max-width: 900px;
  margin-bottom: 2rem;
}

/* ===== CARDS DE OPÇÃO ===== */
.option-card {
  background: var(--cor-branco);
  border: 1px solid var(--cor-cinza-3);
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;
}

.option-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--cor-azul-principal);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.option-card:hover {
  border-color: var(--cor-azul-principal);
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.12);
  transform: translateY(-2px);
}

.option-card:hover::before {
  transform: scaleX(1);
}

/* ===== CABEÇALHO DO CARD ===== */
.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.icon-wrapper {
  width: 48px;
  height: 48px;
  background: var(--cor-gelo);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--cor-azul-principal);
  transition: all 0.3s ease;
}

.option-card:hover .icon-wrapper {
  background: var(--cor-azul-principal);
  color: var(--cor-branco);
  transform: scale(1.05);
}

.card-title {
  font-family: var(--bold);
  font-size: var(--f3);
  color: var(--cor-preto);
  margin: 0;
  font-weight: 600;
}

/* ===== DESCRIÇÃO DO CARD ===== */
.card-description {
  font-family: var(--regular);
  font-size: var(--f2);
  color: var(--cor-cinza);
  margin: 0 0 1.25rem 0;
  line-height: 1.4;
}

/* ===== RODAPÉ DO CARD ===== */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
}

.action-text {
  font-family: var(--regular);
  font-size: var(--f2);
  color: var(--cor-azul-principal);
  font-weight: 500;
  transition: color 0.3s ease;
}

.option-card:hover .action-text {
  color: var(--cor-azul-royal);
}

.card-footer svg {
  color: var(--cor-azul-principal);
  transition: all 0.3s ease;
}

.option-card:hover .card-footer svg {
  color: var(--cor-azul-royal);
  transform: translateX(4px);
}

/* ===== RODAPÉ COM LINK DE LOGIN ===== */
.login-redirect {
  text-align: center;
  margin-top: 1.5rem;
}

.login-text {
  font-family: var(--regular);
  font-size: var(--f1);
  color: var(--cor-cinza);
  margin: 0;
  line-height: 1.5;
}

.login-link {
  color: var(--cor-azul-principal);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.login-link:hover {
  text-decoration: underline;
  color: var(--cor-azul-royal);
}

/* ===== SEÇÃO VISUAL ===== */
.cadastro-visual {
  background: var(--cor-gelo);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.visual-content {
  width: 100%;
  max-width: 500px;
  text-align: center;
}

.visual-image {
  width: 100%;
  height: auto;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(37, 99, 235, 0.15);
  transition: transform 0.3s ease;
}

.visual-image:hover {
  transform: scale(1.02);
}

/* ===== RESPONSIVIDADE ===== */
@media screen and (max-width: 1024px) {
  .cards-container {
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.25rem;
  }
}

@media screen and (max-width: 768px) {
  .cadastro-container {
    grid-template-columns: 1fr;
  }

  .cadastro-visual {
    display: none;
  }

  .cadastro-content {
    padding: 2rem 1rem;
  }

  .cadastro-header {
    margin-bottom: 2rem;
  }

  .titulo-principal {
    font-size: var(--f5);
  }

  .cards-container {
    grid-template-columns: 1fr;
    max-width: 400px;
    gap: 1rem;
  }

  .option-card {
    padding: 1.25rem;
  }

  .icon-wrapper {
    width: 44px;
    height: 44px;
  }

  .card-title {
    font-size: var(--f2);
  }

  .card-description {
    font-size: var(--f1);
  }
}

@media screen and (max-width: 480px) {
  .cadastro-content {
    padding: 1.5rem 0.75rem;
  }

  .cards-container {
    gap: 0.75rem;
  }

  .option-card {
    padding: 1rem;
  }

  .card-header {
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }

  .icon-wrapper {
    width: 40px;
    height: 40px;
  }

  .icon-wrapper svg {
    width: 20px;
    height: 20px;
  }

  .card-description {
    margin-bottom: 1rem;
  }
}
</style>
