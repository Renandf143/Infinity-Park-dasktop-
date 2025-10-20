<template>
  <section class="hero">
    <div class="container">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            Conecte Talentos a
            <span class="highlight">Oportunidades Reais</span>
          </h1>
          <p class="hero-description">
            O Serviflix é a plataforma que facilita a vida de profissionais autônomos,
            conectando prestadores de serviços qualificados a clientes que precisam de
            soluções rápidas e confiáveis. Encontre ou ofereça serviços de forma segura.
          </p>
          <div class="hero-actions">
            <button class="btn-primary-large">Encontrar Serviços</button>
            <button class="btn-secondary-large">Oferecer Serviços</button>
          </div>
        </div>
        <div class="hero-visual">
          <div class="hero-image">
            <img src="~/assets/images/imagem-fundo-2.png" alt="Serviflix - Conectando talentos" class="hero-bg-image">
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup></script>

<style scoped>
.hero {
  background: linear-gradient(135deg, var(--cor-gelo) 0%, var(--cor-branco) 100%);
  padding: 4rem 0 6rem;
  min-height: 80vh;
  display: flex;
  align-items: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero-title {
  font-family: var(--bold);
  font-size: var(--f7);
  color: var(--cor-preto);
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.highlight {
  color: var(--cor-azul-principal);
}

.hero-description {
  font-family: var(--regular);
  font-size: var(--f3);
  color: var(--cor-cinza);
  line-height: 1.6;
  margin-bottom: 2rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
}

.btn-primary-large {
  background: var(--cor-azul-principal);
  color: var(--cor-branco);
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-family: var(--regular);
  font-size: var(--f2);
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary-large:hover {
  background: var(--cor-azul-royal);
  transform: translateY(-2px);
}

.btn-secondary-large {
  background: transparent;
  color: var(--cor-cinza-escuro);
  border: 2px solid var(--cor-cinza-2);
  padding: 1rem 2rem;
  border-radius: 8px;
  font-family: var(--regular);
  font-size: var(--f2);
  cursor: pointer;
  transition: all 0.3s;
}

.btn-secondary-large:hover {
  background: var(--cor-gelo);
  border-color: var(--cor-azul-principal);
}

.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-image {
  position: relative;
  width: 100%;
  max-width: 600px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(37, 99, 235, 0.15);
  transition: transform 0.3s ease;
}

.hero-image:hover {
  transform: translateY(-10px);
}

.hero-bg-image {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 20px;
}

/* Responsivo */
@media screen and (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }

  .hero-title {
    font-size: var(--f6);
  }

  .hero-actions {
    justify-content: center;
    flex-wrap: wrap;
  }

  .container {
    padding: 0 1rem;
  }
}
</style>
