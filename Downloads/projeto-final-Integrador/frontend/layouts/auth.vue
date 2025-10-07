<template>
  <div class="auth-layout">
    <main class="auth-main">
      <slot />
    </main>
    
    <!-- Footer -->
    <footer class="auth-footer">
      <div class="footer-content">
        <p>&copy; 2025 Servifflix. Todos os direitos reservados.</p>
        <div class="footer-links">
          <a href="/termos">Termos de Uso</a>
          <a href="/privacidade">Política de Privacidade</a>
          <a href="/suporte">Suporte</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.auth-main {
  flex: 1;
}

.auth-footer {
  background: white;
  border-top: 1px solid #e5e7eb;
  padding: 20px 0;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.footer-content p {
  color: #6b7280;
  font-size: 14px;
  margin: 0;
}

.footer-links {
  display: flex;
  gap: 24px;
}

.footer-links a {
  color: #6b7280;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s ease;
}

.footer-links a:hover {
  color: #3b82f6;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    text-align: center;
  }
  
  .footer-links {
    justify-content: center;
  }
}
</style>