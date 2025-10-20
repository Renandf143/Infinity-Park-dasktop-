<template>
  <div class="auth-section">
    <!-- Usuário não logado -->
    <div v-if="!isAuthenticated && !loading" class="auth-buttons">
      <NuxtLink to="/login" class="btn-secondary">Entrar</NuxtLink>
      <NuxtLink to="/cadastro" class="btn-primary">Cadastrar</NuxtLink>
    </div>

    <!-- Loading -->
    <div v-else-if="loading" class="auth-loading">
      <div class="loading-spinner"></div>
    </div>

    <!-- Usuário logado -->
    <div v-else class="user-menu">
      <div class="user-info" @click="toggleMenu">
        <img
          v-if="user?.photoURL"
          :src="user.photoURL"
          :alt="user.displayName"
          class="user-avatar"
        >
        <div v-else class="user-avatar-placeholder">
          {{ user?.displayName?.charAt(0) || 'U' }}
        </div>
        <span class="user-name">{{ user?.displayName || 'Usuário' }}</span>
        <Icones nome="seta" class="dropdown-icon" />
      </div>

      <div v-if="showMenu" class="dropdown-menu">
        <!-- Dashboard -->
        <NuxtLink to="/cliente/dashboard" class="menu-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
          </svg>
          Dashboard
        </NuxtLink>

        <!-- Perfil -->
        <NuxtLink to="/cliente/perfil" class="menu-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
          Meu Perfil
        </NuxtLink>

        <!-- Histórico de Serviços -->
        <NuxtLink to="/cliente/historico" class="menu-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
          </svg>
          Histórico de Serviços
        </NuxtLink>

        <!-- Favoritos -->
        <NuxtLink to="/cliente/favoritos" class="menu-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          Favoritos
        </NuxtLink>

        <!-- Mensagens -->
        <NuxtLink to="/cliente/mensagens" class="menu-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
          </svg>
          Mensagens
        </NuxtLink>

        <!-- Avaliações -->
        <NuxtLink to="/cliente/avaliacoes" class="menu-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
          Avaliações
        </NuxtLink>

        <!-- Notificações -->
        <NuxtLink to="/cliente/notificacoes" class="menu-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
          </svg>
          Notificações
        </NuxtLink>

        <div class="menu-divider"></div>

        <!-- Segurança -->
        <NuxtLink to="/cliente/seguranca" class="menu-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
          </svg>
          Segurança e Privacidade
        </NuxtLink>

        <!-- Sair -->
        <button @click="handleLogout" class="menu-item logout">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
          </svg>
          Sair
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import Icones from '@/components/global/icones/Icones.vue'

const { user, loading, isAuthenticated, signOut } = useFirebaseAuth()
const showMenu = ref(false)

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

const handleLogout = async () => {
  showMenu.value = false
  await signOut()
}

// Fechar menu ao clicar fora
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (!e.target?.closest('.user-menu')) {
      showMenu.value = false
    }
  })
})
</script>

<style scoped>
.auth-section {
  position: relative;
}

.auth-buttons {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.btn-secondary {
  background: transparent;
  color: var(--cor-cinza-escuro);
  border: 1px solid var(--cor-cinza-2);
  padding: 0.5rem 1.5rem;
  border-radius: 6px;
  font-family: var(--regular);
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background: var(--cor-gelo);
}

.btn-primary {
  background: var(--cor-azul-principal);
  color: var(--cor-branco);
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 6px;
  font-family: var(--regular);
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover {
  background: var(--cor-azul-royal);
}

.auth-loading {
  display: flex;
  align-items: center;
  padding: 0.5rem;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--cor-cinza-3);
  border-top: 2px solid var(--cor-azul-principal);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.user-menu {
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.user-info:hover {
  background: var(--cor-gelo);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.user-avatar-placeholder {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--cor-azul-principal);
  color: var(--cor-branco);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--bold);
  font-size: var(--f1);
}

.user-name {
  font-family: var(--regular);
  color: var(--cor-preto);
  font-size: var(--f2);
}

.dropdown-icon {
  width: 16px;
  height: 16px;
  fill: var(--cor-cinza);
  transition: transform 0.3s;
}

.user-info:hover .dropdown-icon {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.1),
    0 4px 16px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  min-width: 280px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
}

.dropdown-menu::-webkit-scrollbar {
  width: 6px;
}

.dropdown-menu::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.dropdown-menu::-webkit-scrollbar-thumb {
  background: rgba(37, 99, 235, 0.3);
  border-radius: 3px;
}

.dropdown-menu::-webkit-scrollbar-thumb:hover {
  background: rgba(37, 99, 235, 0.5);
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  color: var(--cor-preto);
  text-decoration: none;
  font-family: var(--regular);
  font-size: var(--f2);
  font-weight: 500;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  margin: 0 0.5rem;
  width: calc(100% - 1rem);
}

.menu-item:hover {
  background: rgba(37, 99, 235, 0.1);
  backdrop-filter: blur(10px);
  transform: translateX(4px);
}

.menu-item svg {
  width: 18px;
  height: 18px;
  color: var(--cor-azul-principal);
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.menu-item:hover svg {
  transform: scale(1.1);
}

.menu-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(37, 99, 235, 0.3), transparent);
  margin: 0.75rem 1rem;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.menu-item.logout {
  color: #dc2626;
  margin-top: 0.5rem;
  border-top: 1px solid rgba(220, 38, 38, 0.2);
  padding-top: 1rem;
}

.menu-item.logout:hover {
  background: rgba(220, 38, 38, 0.1);
  backdrop-filter: blur(10px);
}

.menu-item.logout svg {
  color: #dc2626;
}

/* Responsivo */
@media screen and (max-width: 768px) {
  .auth-buttons {
    gap: 0.5rem;
  }

  .btn-secondary,
  .btn-primary {
    padding: 0.4rem 1rem;
    font-size: var(--f1);
  }

  .user-name {
    display: none;
  }
}
</style>
