<template>
  <div>
    <Nav />
    <section class="security-section">
      <div class="container">
        <div class="page-header">
          <h1>Segurança e Privacidade</h1>
          <p>Gerencie suas configurações de segurança e privacidade</p>
        </div>

        <div class="security-content">
          <div class="security-card">
            <h3>Login e Autenticação</h3>
            <div class="security-item">
              <div class="security-info">
                <h4>Conta Google</h4>
                <p>Conectado via Google OAuth</p>
              </div>
              <button class="btn-secondary">Desconectar</button>
            </div>
            <div class="security-item">
              <div class="security-info">
                <h4>Alterar Senha</h4>
                <p>Última alteração: 15 de Janeiro, 2024</p>
              </div>
              <button class="btn-primary">Alterar</button>
            </div>
          </div>

          <div class="security-card">
            <h3>Privacidade</h3>
            <div class="privacy-item">
              <div class="privacy-info">
                <h4>Perfil Público</h4>
                <p>Permitir que profissionais vejam seu perfil</p>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" checked>
                <span class="slider"></span>
              </label>
            </div>
            <div class="privacy-item">
              <div class="privacy-info">
                <h4>Notificações por Email</h4>
                <p>Receber atualizações por email</p>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" checked>
                <span class="slider"></span>
              </label>
            </div>
            <div class="privacy-item">
              <div class="privacy-info">
                <h4>Compartilhar Localização</h4>
                <p>Permitir que profissionais vejam sua localização</p>
              </div>
              <label class="toggle-switch">
                <input type="checkbox">
                <span class="slider"></span>
              </label>
            </div>
          </div>

          <div class="security-card danger-zone">
            <h3>Zona de Perigo</h3>
            <div class="security-item">
              <div class="security-info">
                <h4>Excluir Conta</h4>
                <p>Remover permanentemente sua conta e todos os dados</p>
              </div>
              <button class="btn-danger">Excluir Conta</button>
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
.security-section {
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

.security-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.security-card {
  background: var(--cor-branco);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.security-card h3 {
  font-family: var(--bold);
  font-size: var(--f3);
  color: var(--cor-preto);
  margin-bottom: 1.5rem;
}

.security-item, .privacy-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid var(--cor-cinza-3);
}

.security-item:last-child, .privacy-item:last-child {
  border-bottom: none;
}

.security-info h4, .privacy-info h4 {
  font-family: var(--bold);
  font-size: var(--f2);
  color: var(--cor-preto);
  margin-bottom: 0.25rem;
}

.security-info p, .privacy-info p {
  font-family: var(--regular);
  color: var(--cor-cinza);
  font-size: var(--f1);
}

.btn-primary, .btn-secondary, .btn-danger {
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

.btn-danger {
  background: #dc2626;
  color: var(--cor-branco);
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--cor-cinza-3);
  transition: .4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--cor-azul-principal);
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.danger-zone {
  border: 1px solid #fecaca;
  background: #fef2f2;
}

.danger-zone h3 {
  color: #dc2626;
}
</style>
