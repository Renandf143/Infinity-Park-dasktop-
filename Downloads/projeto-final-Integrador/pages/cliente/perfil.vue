<template>
  <div>
    <Nav />
    <section class="profile-section">
      <div class="container">
        <div class="profile-header">
          <h1>Meu Perfil</h1>
          <p>Gerencie suas informações pessoais e preferências</p>
        </div>

        <div class="profile-content">
          <div class="profile-card">
            <h3>Informações Pessoais</h3>
            <div class="profile-form">
              <div class="form-group">
                <label>Foto de Perfil</label>
                <div class="avatar-upload">
                  <div class="avatar-preview">
                    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                      <circle cx="40" cy="40" r="40" fill="#E5E7EB"/>
                      <circle cx="40" cy="32" r="12" fill="#9CA3AF"/>
                      <path d="M16 64c0-13.255 10.745-24 24-24s24 10.745 24 24" fill="#9CA3AF"/>
                    </svg>
                  </div>
                  <button class="upload-btn">Alterar Foto</button>
                </div>
              </div>

              <div class="form-group">
                <label>Nome Completo</label>
                <input type="text" placeholder="Digite seu nome" class="form-input">
              </div>

              <div class="form-group">
                <label>Email</label>
                <input type="email" placeholder="Digite seu email" class="form-input">
              </div>

              <div class="form-group">
                <label>Telefone</label>
                <input type="tel" placeholder="Digite seu telefone" class="form-input">
              </div>

              <div class="form-group">
                <label>Endereço</label>
                <textarea placeholder="Digite seu endereço completo" class="form-textarea"></textarea>
              </div>

              <div class="form-group">
                <label>Preferências de Serviço</label>
                <select class="form-select">
                  <option>Limpeza</option>
                  <option>Reparos</option>
                  <option>Tecnologia</option>
                  <option>Beleza</option>
                </select>
              </div>

              <button class="btn-primary-large">Salvar Alterações</button>
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
.profile-section {
  background: linear-gradient(135deg, var(--cor-gelo) 0%, var(--cor-branco) 100%);
  padding: 4rem 0;
  min-height: 80vh;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
}

.profile-header {
  text-align: center;
  margin-bottom: 3rem;
}

.profile-header h1 {
  font-family: var(--bold);
  font-size: var(--f6);
  color: var(--cor-preto);
  margin-bottom: 1rem;
}

.profile-header p {
  font-family: var(--regular);
  font-size: var(--f2);
  color: var(--cor-cinza);
}

.profile-card {
  background: var(--cor-branco);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.profile-card h3 {
  font-family: var(--bold);
  font-size: var(--f3);
  color: var(--cor-preto);
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-family: var(--regular);
  font-size: var(--f2);
  color: var(--cor-cinza-escuro);
  margin-bottom: 0.5rem;
}

.form-input, .form-textarea, .form-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--cor-cinza-3);
  border-radius: 8px;
  font-family: var(--regular);
  font-size: var(--f2);
  color: var(--cor-preto);
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

.avatar-upload {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar-preview {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.upload-btn {
  background: var(--cor-azul-principal);
  color: var(--cor-branco);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-family: var(--regular);
  cursor: pointer;
}

.btn-primary-large {
  width: 100%;
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
}
</style>
