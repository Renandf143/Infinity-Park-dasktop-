<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-brand">
          <img src="/logo.png" alt="Serviflix Logo" class="footer-logo">
          <p class="footer-description">
            Conectando talentos a oportunidades reais. A plataforma que facilita a vida de profissionais autônomos e clientes em busca de serviços de qualidade.
          </p>
        </div>

        <div class="footer-links">
          <div class="link-group">
            <h4 class="link-title">Plataforma</h4>
            <a href="#" class="footer-link">Como Funciona</a>
            <a href="#" class="footer-link">Categorias</a>
            <a href="#" class="footer-link">Preços</a>
            <a href="#" class="footer-link">Segurança</a>
          </div>

          <div class="link-group">
            <h4 class="link-title">Empresa</h4>
            <a href="#" class="footer-link">Sobre Nós</a>
            <a href="#" class="footer-link">Carreiras</a>
            <a href="#" class="footer-link">Blog</a>
            <a href="#" class="footer-link">Contato</a>
          </div>

          <div class="link-group">
            <h4 class="link-title">Suporte</h4>
            <a href="#" class="footer-link">Central de Ajuda</a>
            <a href="#" class="footer-link">Termos de Uso</a>
            <a href="#" class="footer-link">Privacidade</a>
            <a href="#" class="footer-link">FAQ</a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="copyright">© 2024 Serviflix. Todos os direitos reservados.</p>
        <div class="footer-social">
          <a href="#" class="social-link">Instagram</a>
          <a href="#" class="social-link">Facebook</a>
          <a href="#" class="social-link">LinkedIn</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup></script>

<style scoped>
.footer {
  background: var(--cor-cinza-escuro);
  color: var(--cor-branco);
  padding: 4rem 0 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 4rem;
  margin-bottom: 3rem;
}

.footer-brand {
  max-width: 300px;
}

.footer-logo {
  height: 80px;
  margin-bottom: 1.5rem;
  filter: brightness(0) invert(1);
  transition: transform 0.3s ease;
  cursor: pointer;
}

.footer-logo:hover {
  transform: scale(1.05);
}

.footer-description {
  font-family: var(--regular);
  font-size: var(--f2);
  color: var(--cor-cinza-2);
  line-height: 1.6;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.link-group {
  display: flex;
  flex-direction: column;
}

.link-title {
  font-family: var(--bold);
  font-size: var(--f3);
  color: var(--cor-branco);
  margin-bottom: 1rem;
}

.footer-link {
  font-family: var(--regular);
  font-size: var(--f2);
  color: var(--cor-cinza-2);
  text-decoration: none;
  margin-bottom: 0.5rem;
  transition: color 0.3s;
}

.footer-link:hover {
  color: var(--cor-azul-principal);
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  border-top: 1px solid var(--cor-cinza);
}

.copyright {
  font-family: var(--regular);
  font-size: var(--f1);
  color: var(--cor-cinza-2);
}

.footer-social {
  display: flex;
  gap: 1.5rem;
}

.social-link {
  font-family: var(--regular);
  font-size: var(--f2);
  color: var(--cor-cinza-2);
  text-decoration: none;
  transition: color 0.3s;
}

.social-link:hover {
  color: var(--cor-azul-principal);
}

/* Responsivo */
@media screen and (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .footer-links {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .container {
    padding: 0 1rem;
  }
}
</style>
