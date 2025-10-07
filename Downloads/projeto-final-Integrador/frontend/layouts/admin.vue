<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside class="admin-sidebar" :class="{ 'collapsed': sidebarCollapsed }">
      <div class="sidebar-header">
        <NuxtLink to="/admin" class="admin-logo">
          <img src="/logo.svg" alt="ServiFlix" class="logo">
          <span v-if="!sidebarCollapsed" class="brand-name">ServiFlix Admin</span>
        </NuxtLink>
        <button @click="toggleSidebar" class="sidebar-toggle">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
        </button>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section">
          <h3 v-if="!sidebarCollapsed" class="nav-title">Dashboard</h3>
          <NuxtLink to="/admin" class="nav-item" active-class="active">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
            </svg>
            <span v-if="!sidebarCollapsed">Visão Geral</span>
          </NuxtLink>
        </div>

        <div class="nav-section">
          <h3 v-if="!sidebarCollapsed" class="nav-title">Usuários</h3>
          <NuxtLink to="/admin/usuarios" class="nav-item" active-class="active">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 7c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4 4-1.79 4-4zm-4 6c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z"/>
            </svg>
            <span v-if="!sidebarCollapsed">Usuários</span>
          </NuxtLink>
          <NuxtLink to="/admin/empresas" class="nav-item" active-class="active">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
            </svg>
            <span v-if="!sidebarCollapsed">Empresas</span>
          </NuxtLink>
          <NuxtLink to="/admin/profissionais" class="nav-item" active-class="active">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span v-if="!sidebarCollapsed">Profissionais</span>
          </NuxtLink>
        </div>

        <div class="nav-section">
          <h3 v-if="!sidebarCollapsed" class="nav-title">Serviços</h3>
          <NuxtLink to="/admin/servicos" class="nav-item" active-class="active">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span v-if="!sidebarCollapsed">Serviços</span>
          </NuxtLink>
          <NuxtLink to="/admin/categorias" class="nav-item" active-class="active">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/>
            </svg>
            <span v-if="!sidebarCollapsed">Categorias</span>
          </NuxtLink>
        </div>

        <div class="nav-section">
          <h3 v-if="!sidebarCollapsed" class="nav-title">Sistema</h3>
          <NuxtLink to="/admin/configuracoes" class="nav-item" active-class="active">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
            </svg>
            <span v-if="!sidebarCollapsed">Configurações</span>
          </NuxtLink>
          <NuxtLink to="/admin/relatorios" class="nav-item" active-class="active">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
            </svg>
            <span v-if="!sidebarCollapsed">Relatórios</span>
          </NuxtLink>
        </div>
      </nav>

      <div class="sidebar-footer">
        <button @click="logout" class="logout-btn">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
          </svg>
          <span v-if="!sidebarCollapsed">Sair</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="admin-main" :class="{ 'expanded': sidebarCollapsed }">
      <!-- Top Bar -->
      <header class="admin-header">
        <div class="header-left">
          <h1 class="page-title">{{ pageTitle }}</h1>
        </div>
        <div class="header-right">
          <div class="admin-user">
            <img src="/assets/images/admin-avatar.jpg" alt="Admin" class="user-avatar">
            <span class="user-name">Administrador</span>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <div class="admin-content">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
// Estados
const sidebarCollapsed = ref(false)

// Computed
const pageTitle = computed(() => {
  const route = useRoute()
  const titles = {
    '/admin': 'Dashboard',
    '/admin/usuarios': 'Usuários',
    '/admin/empresas': 'Empresas',
    '/admin/profissionais': 'Profissionais',
    '/admin/servicos': 'Serviços',
    '/admin/categorias': 'Categorias',
    '/admin/configuracoes': 'Configurações',
    '/admin/relatorios': 'Relatórios'
  }
  return titles[route.path] || 'Admin'
})

// Methods
function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

async function logout() {
  await navigateTo('/entrar')
}

// Meta
useHead({
  title: `${pageTitle.value} - ServiFlix Admin`,
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: var(--bg-primary);
}

.admin-sidebar {
  width: 280px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-primary);
  display: flex;
  flex-direction: column;
  transition: width var(--transition-base);
  position: fixed;
  height: 100vh;
  z-index: 1000;
}

.admin-sidebar.collapsed {
  width: 80px;
}

.sidebar-header {
  padding: var(--space-xl);
  border-bottom: 1px solid var(--border-primary);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.admin-logo {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  text-decoration: none;
}

.admin-logo .logo {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.brand-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-primary);
  white-space: nowrap;
}

.sidebar-toggle {
  background: none;
  border: none;
  color: var(--text-tertiary);
  cursor: pointer;
  padding: var(--space-xs);
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
}

.sidebar-toggle:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.sidebar-toggle svg {
  width: 20px;
  height: 20px;
}

.sidebar-nav {
  flex: 1;
  padding: var(--space-lg);
  overflow-y: auto;
}

.nav-section {
  margin-bottom: var(--space-xl);
}

.nav-title {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-sm);
  padding: 0 var(--space-sm);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-sm);
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
  margin-bottom: var(--space-xs);
}

.nav-item:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.nav-item.active {
  background: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
}

.nav-item svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.sidebar-footer {
  padding: var(--space-lg);
  border-top: 1px solid var(--border-primary);
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  width: 100%;
  padding: var(--space-sm);
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
}

.logout-btn:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.logout-btn svg {
  width: 20px;
  height: 20px;
}

.admin-main {
  flex: 1;
  margin-left: 280px;
  transition: margin-left var(--transition-base);
}

.admin-main.expanded {
  margin-left: 80px;
}

.admin-header {
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-primary);
  padding: var(--space-lg) var(--space-xl);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
}

.admin-user {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  object-fit: cover;
}

.user-name {
  font-weight: 600;
  color: var(--text-primary);
}

.admin-content {
  padding: var(--space-xl);
}

/* Responsividade */
@media (max-width: 768px) {
  .admin-sidebar {
    transform: translateX(-100%);
  }
  
  .admin-sidebar.collapsed {
    transform: translateX(0);
    width: 100%;
  }
  
  .admin-main {
    margin-left: 0;
  }
  
  .admin-main.expanded {
    margin-left: 0;
  }
}
</style>