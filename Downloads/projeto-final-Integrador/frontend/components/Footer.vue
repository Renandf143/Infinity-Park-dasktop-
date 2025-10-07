<template>
  <footer class="footer">
    <div class="container-custom">
      <div class="footer-content">
        <!-- Logo e descrição -->
        <div class="footer-brand">
          <NuxtLink to="/" class="footer-logo">
            <img src="/logo.svg" alt="ServiFlix" class="logo-img">
            <span class="brand-name">ServiFlix</span>
          </NuxtLink>
          <p class="brand-description">
            Conectando você aos melhores profissionais para todos os serviços que você precisa.
          </p>
          <div class="social-links">
            <a href="#" class="social-link" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" class="social-link" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z"/>
              </svg>
            </a>
            <a href="#" class="social-link" aria-label="Twitter">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z"/>
              </svg>
            </a>
            <a href="#" class="social-link" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19M18.5 18.5V13.2A3.26 3.26 0 0 0 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57C12.92 12.8 13.54 12.17 14.31 12.17A1.4 1.4 0 0 1 15.71 13.57V18.5H18.5M6.88 8.56A1.68 1.68 0 0 0 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19A1.69 1.69 0 0 0 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56M8.27 18.5V10.13H5.5V18.5H8.27Z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Serviços -->
        <div class="footer-section">
          <h3 class="section-title">Serviços</h3>
          <ul class="footer-links">
            <li><NuxtLink to="/categorias/casa-jardim">Diaristas</NuxtLink></li>
            <li><NuxtLink to="/categorias/reformas">Eletricistas</NuxtLink></li>
            <li><NuxtLink to="/categorias/limpeza">Encanadores</NuxtLink></li>
            <li><NuxtLink to="/categorias/assistencia-tecnica">Pintores</NuxtLink></li>
            <li><NuxtLink to="/servicos">Ver todos</NuxtLink></li>
          </ul>
        </div>

        <!-- Empresa -->
        <div class="footer-section">
          <h3 class="section-title">Empresa</h3>
          <ul class="footer-links">
            <li><NuxtLink to="/sobre">Sobre nós</NuxtLink></li>
            <li><NuxtLink to="/como-funciona">Como funciona</NuxtLink></li>
            <li><NuxtLink to="/cadastrar/profissional">Seja um profissional</NuxtLink></li>
            <li><NuxtLink to="/carreiras">Carreiras</NuxtLink></li>
            <li><NuxtLink to="/blog">Blog</NuxtLink></li>
          </ul>
        </div>

        <!-- Suporte -->
        <div class="footer-section">
          <h3 class="section-title">Suporte</h3>
          <ul class="footer-links">
            <li><NuxtLink to="/ajuda">Central de ajuda</NuxtLink></li>
            <li><NuxtLink to="/contato">Contato</NuxtLink></li>
            <li><NuxtLink to="/privacidade">Política de privacidade</NuxtLink></li>
            <li><NuxtLink to="/termos">Termos de uso</NuxtLink></li>
          </ul>
        </div>
      </div>

      <!-- Rodapé inferior -->
      <div class="footer-bottom">
        <p class="copyright">
          © {{ currentYear }} ServiFlix. Todos os direitos reservados.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear()
</script>

<style scoped>
.footer {
  background: #1f2937;
  color: #9ca3af;
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 48px;
  padding: 64px 0 32px;
}

.footer-brand {
  max-width: 320px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  margin-bottom: 24px;
}

.logo-img {
  width: 32px;
  height: 32px;
}

.brand-name {
  font-size: 20px;
  font-weight: 700;
  color: #3b82f6;
}

.brand-description {
  color: #d1d5db;
  line-height: 1.6;
  margin-bottom: 32px;
  font-size: 14px;
}

.social-links {
  display: flex;
  gap: 12px;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #374151;
  border-radius: 8px;
  color: #9ca3af;
  transition: all 0.3s ease;
  text-decoration: none;
}

.social-link:hover {
  background: #3b82f6;
  color: white;
  transform: translateY(-2px);
}

.social-link svg {
  width: 20px;
  height: 20px;
}

.footer-section {
  display: flex;
  flex-direction: column;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: white;
  margin-bottom: 24px;
}

.footer-links {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-links a {
  color: #d1d5db;
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: 14px;
  font-weight: 400;
}

.footer-links a:hover {
  color: #3b82f6;
}

.footer-bottom {
  border-top: 1px solid #374151;
  padding: 24px 0;
  text-align: center;
}

.copyright {
  color: #9ca3af;
  font-size: 14px;
  font-weight: 400;
}
</style>