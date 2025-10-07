<template>
  <div class="user-dropdown" ref="dropdownRef">
    <!-- User Avatar Button -->
    <button 
      @click="toggleDropdown" 
      class="user-avatar-btn"
      :class="{ active: isOpen }"
    >
      <div class="avatar-container">
        <img 
          :src="user?.photoURL || '/default-avatar.png'" 
          :alt="user?.displayName" 
          class="user-avatar"
        />
        <div class="status-indicator" :class="statusClass"></div>
      </div>
      <div class="user-info">
        <span class="user-name">{{ user?.displayName || 'Usuário' }}</span>
        <span class="user-type-badge" :class="user?.userType">
          {{ getUserTypeLabel() }}
        </span>
      </div>
      <Icon3D name="dashboard" size="sm" class="dropdown-arrow" :class="{ rotated: isOpen }" />
    </button>

    <!-- Dropdown Menu -->
    <Transition name="dropdown">
      <div v-if="isOpen" class="dropdown-menu">
        <div class="dropdown-header">
          <div class="user-details">
            <img 
              :src="user?.photoURL || '/default-avatar.png'" 
              :alt="user?.displayName" 
              class="dropdown-avatar"
            />
            <div class="user-meta">
              <h4>{{ user?.displayName || 'Usuário' }}</h4>
              <p>{{ user?.email }}</p>
              <span class="account-status">
                <Icon3D name="profile" size="sm" />
                Conta {{ user?.status === 'ativo' ? 'Ativa' : 'Pendente' }}
              </span>
            </div>
          </div>
        </div>

        <div class="dropdown-divider"></div>

        <!-- Menu Items -->
        <div class="dropdown-section">
          <h5>Navegação</h5>
          <NuxtLink to="/dashboard" class="dropdown-item" @click="closeDropdown">
            <Icon3D name="dashboard" size="sm" />
            <span>Dashboard</span>
          </NuxtLink>
          
          <NuxtLink to="/perfil" class="dropdown-item" @click="closeDropdown">
            <Icon3D name="profile" size="sm" />
            <span>Meu Perfil</span>
          </NuxtLink>
        </div>

        <!-- Cliente Specific -->
        <div v-if="isCliente" class="dropdown-section">
          <h5>Meus Serviços</h5>
          <NuxtLink to="/meus-pedidos" class="dropdown-item" @click="closeDropdown">
            <Icon3D name="orders" size="sm" />
            <div class="item-content">
              <span>Meus Pedidos</span>
              <small>{{ pedidosCount }} ativos</small>
            </div>
            <div v-if="pedidosCount > 0" class="notification-badge">{{ pedidosCount }}</div>
          </NuxtLink>
          
          <NuxtLink to="/chat" class="dropdown-item" @click="closeDropdown">
            <Icon3D name="chat" size="sm" />
            <div class="item-content">
              <span>Chat</span>
              <small>Conversas com profissionais</small>
            </div>
            <div v-if="unreadMessages > 0" class="notification-badge">{{ unreadMessages }}</div>
          </NuxtLink>
          
          <NuxtLink to="/servicos" class="dropdown-item" @click="closeDropdown">
            <Icon3D name="search" size="sm" />
            <span>Buscar Serviços</span>
          </NuxtLink>
        </div>

        <!-- Professional/Company Specific -->
        <div v-if="isProfissional || isEmpresa" class="dropdown-section">
          <h5>Área Profissional</h5>
          <NuxtLink to="/meus-servicos" class="dropdown-item" @click="closeDropdown">
            <Icon3D name="orders" size="sm" />
            <span>Meus Serviços</span>
          </NuxtLink>
          
          <NuxtLink to="/propostas" class="dropdown-item" @click="closeDropdown">
            <Icon3D name="wallet" size="sm" />
            <div class="item-content">
              <span>Propostas</span>
              <small>{{ propostasCount }} pendentes</small>
            </div>
          </NuxtLink>
          
          <NuxtLink to="/chat-profissional" class="dropdown-item" @click="closeDropdown">
            <Icon3D name="chat" size="sm" />
            <span>Chat com Clientes</span>
          </NuxtLink>
        </div>

        <!-- Upgrade Option for Clients -->
        <div v-if="isCliente" class="dropdown-section upgrade-section">
          <h5>Crescer no ServiFlix</h5>
          <NuxtLink to="/upgrade" class="dropdown-item upgrade-item" @click="closeDropdown">
            <Icon3D name="wallet" size="sm" />
            <div class="item-content">
              <span>Oferecer Serviços</span>
              <small>Torne-se um profissional</small>
            </div>
            <div class="upgrade-badge">Novo</div>
          </NuxtLink>
        </div>

        <div class="dropdown-divider"></div>

        <!-- Account & Settings -->
        <div class="dropdown-section">
          <h5>Conta</h5>
          <NuxtLink to="/carteira" class="dropdown-item" @click="closeDropdown">
            <Icon3D name="wallet" size="sm" />
            <div class="item-content">
              <span>Carteira</span>
              <small>R$ {{ saldo.toFixed(2) }}</small>
            </div>
          </NuxtLink>
          
          <NuxtLink to="/notificacoes" class="dropdown-item" @click="closeDropdown">
            <Icon3D name="notifications" size="sm" />
            <div class="item-content">
              <span>Notificações</span>
              <small>{{ notificationsCount }} não lidas</small>
            </div>
            <div v-if="notificationsCount > 0" class="notification-badge">{{ notificationsCount }}</div>
          </NuxtLink>
          
          <NuxtLink to="/configuracoes" class="dropdown-item" @click="closeDropdown">
            <Icon3D name="settings" size="sm" />
            <span>Configurações</span>
          </NuxtLink>
          
          <NuxtLink to="/ajuda" class="dropdown-item" @click="closeDropdown">
            <Icon3D name="help" size="sm" />
            <span>Ajuda & Suporte</span>
          </NuxtLink>
        </div>

        <div class="dropdown-divider"></div>

        <!-- Logout -->
        <button @click="handleLogout" class="dropdown-item logout-item">
          <Icon3D name="logout" size="sm" />
          <span>Sair da Conta</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
const { user, logout } = useAuth()
const { isCliente, isProfissional, isEmpresa } = useUserType()

const dropdownRef = ref(null)
const isOpen = ref(false)

// Mock data - replace with real data from API
const pedidosCount = ref(3)
const unreadMessages = ref(2)
const propostasCount = ref(5)
const notificationsCount = ref(7)
const saldo = ref(150.75)

const statusClass = computed(() => {
  return user.value?.status === 'ativo' ? 'online' : 'pending'
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = () => {
  isOpen.value = false
}

const getUserTypeLabel = () => {
  const labels = {
    cliente: 'Cliente',
    profissional: 'Profissional',
    empresa: 'Empresa',
    admin: 'Admin'
  }
  return labels[user.value?.userType] || 'Cliente'
}

const handleLogout = async () => {
  closeDropdown()
  const result = await logout()
  if (result.success) {
    await navigateTo('/')
  }
}

// Close dropdown when clicking outside
onMounted(() => {
  const handleClickOutside = (event) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
      closeDropdown()
    }
  }

  document.addEventListener('click', handleClickOutside)
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})

// Close dropdown on route change
watch(() => useRoute().path, () => {
  closeDropdown()
})
</script>

<style scoped>
.user-dropdown {
  position: relative;
}

.user-avatar-btn {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid transparent;
  border-radius: var(--radius-xl);
  padding: var(--space-sm) var(--space-md);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

.user-avatar-btn:hover {
  border-color: rgba(139, 92, 246, 0.3);
  transform: translateY(-2px);
  box-shadow: 
    0 8px 30px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.user-avatar-btn.active {
  border-color: #8b5cf6;
  background: rgba(139, 92, 246, 0.05);
}

.avatar-container {
  position: relative;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.status-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.status-indicator.online {
  background: #10b981;
}

.status-indicator.pending {
  background: #f59e0b;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.user-name {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 14px;
}

.user-type-badge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.user-type-badge.cliente {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.user-type-badge.profissional {
  background: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
}

.user-type-badge.empresa {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.dropdown-arrow {
  transition: transform 0.3s ease;
}

.dropdown-arrow.rotated {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 320px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-2xl);
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  z-index: 1000;
  overflow: hidden;
}

.dropdown-header {
  padding: var(--space-lg);
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%);
}

.user-details {
  display: flex;
  gap: var(--space-md);
  align-items: center;
}

.dropdown-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(255, 255, 255, 0.8);
}

.user-meta h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 4px 0;
}

.user-meta p {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0 0 8px 0;
}

.account-status {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: 12px;
  color: #10b981;
  font-weight: 500;
}

.dropdown-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.1), transparent);
  margin: var(--space-sm) 0;
}

.dropdown-section {
  padding: var(--space-md) var(--space-lg);
}

.dropdown-section h5 {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 var(--space-md) 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  border-radius: var(--radius-lg);
  text-decoration: none;
  color: var(--text-primary);
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
  position: relative;
  margin-bottom: var(--space-xs);
}

.dropdown-item:hover {
  background: rgba(139, 92, 246, 0.08);
  transform: translateX(4px);
}

.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.item-content span {
  font-weight: 500;
  font-size: 14px;
}

.item-content small {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 2px;
}

.notification-badge {
  background: #ef4444;
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: var(--radius-full);
  min-width: 18px;
  text-align: center;
}

.upgrade-section {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%);
  border-radius: var(--radius-lg);
  margin: var(--space-sm);
}

.upgrade-item {
  background: rgba(139, 92, 246, 0.1);
  border: 1px dashed rgba(139, 92, 246, 0.3);
}

.upgrade-item:hover {
  background: rgba(139, 92, 246, 0.15);
  border-color: rgba(139, 92, 246, 0.5);
}

.upgrade-badge {
  background: linear-gradient(135deg, #8b5cf6, #10b981);
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: var(--radius-full);
  text-transform: uppercase;
}

.logout-item {
  color: #ef4444;
  font-weight: 500;
}

.logout-item:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

/* Transitions */
.dropdown-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-5px) scale(0.98);
}

/* Responsive */
@media (max-width: 768px) {
  .dropdown-menu {
    width: 280px;
    right: -20px;
  }
  
  .user-info {
    display: none;
  }
  
  .user-avatar-btn {
    padding: var(--space-sm);
  }
}
</style>