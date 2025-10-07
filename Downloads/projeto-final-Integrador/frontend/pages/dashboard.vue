<template>
  <div class="dashboard-page">
    <div class="dashboard-container">
      <!-- Welcome Message -->
      <div v-if="showWelcome" class="welcome-banner">
        <div class="welcome-content">
          <div class="welcome-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L18 8l-8 8z"/>
            </svg>
          </div>
          <div class="welcome-text">
            <h2>{{ welcomeTitle }}</h2>
            <p>{{ welcomeMessage }}</p>
          </div>
          <button @click="showWelcome = false" class="close-welcome">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- User Info -->
      <div class="user-info-card">
        <div class="user-avatar">
          <div class="avatar-circle">
            {{ userInitials }}
          </div>
        </div>
        <div class="user-details">
          <h3>{{ profile?.full_name || 'Usuário' }}</h3>
          <p class="user-type">{{ userTypeLabel }}</p>
          <p class="user-status" :class="statusClass">
            {{ statusLabel }}
          </p>
        </div>
        <div class="user-actions">
          <button @click="handleLogout" class="logout-btn">
            Sair
          </button>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </div>
          <div class="stat-content">
            <h4>Email</h4>
            <p>{{ user?.email_confirmed_at ? 'Verificado' : 'Pendente' }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
          </div>
          <div class="stat-content">
            <h4>Conta</h4>
            <p>{{ profile?.status === 'active' ? 'Ativa' : 'Pendente' }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="stat-content">
            <h4>Perfil</h4>
            <p>{{ profile?.user_type === 'profissional' ? 'Profissional' : 'Cliente' }}</p>
          </div>
        </div>
      </div>

      <!-- Content based on user type -->
      <div v-if="profile?.user_type === 'profissional'" class="professional-content">
        <h3>Área do Profissional</h3>
        <p>Aqui você pode gerenciar seus serviços, agenda e clientes.</p>
        
        <div v-if="professionalData" class="professional-info">
          <h4>Suas Informações:</h4>
          <ul>
            <li><strong>Profissão:</strong> {{ professionalData.profession }}</li>
            <li><strong>Experiência:</strong> {{ professionalData.experience }}</li>
            <li><strong>Preço/hora:</strong> R$ {{ professionalData.hourly_rate }}</li>
            <li><strong>Cidade:</strong> {{ addressData?.city }}</li>
          </ul>
        </div>
      </div>

      <div v-else class="client-content">
        <h3>Área do Cliente</h3>
        <p>Aqui você pode buscar profissionais e contratar serviços.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

useHead({
  title: 'Dashboard - Servifflix',
  meta: [
    { name: 'description', content: 'Painel de controle do Servifflix' }
  ]
})

const route = useRoute()
const user = useSupabaseUser()
const supabase = useSupabaseClient()

// Estados
const profile = ref(null)
const professionalData = ref(null)
const addressData = ref(null)
const showWelcome = ref(false)

// Computed
const userInitials = computed(() => {
  if (profile.value?.full_name) {
    return profile.value.full_name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }
  return 'U'
})

const userTypeLabel = computed(() => {
  return profile.value?.user_type === 'profissional' ? 'Profissional' : 'Cliente'
})

const statusClass = computed(() => {
  return {
    'status-active': profile.value?.status === 'active',
    'status-pending': profile.value?.status === 'pending_verification'
  }
})

const statusLabel = computed(() => {
  switch (profile.value?.status) {
    case 'active':
      return 'Conta Ativa'
    case 'pending_verification':
      return 'Aguardando Verificação'
    default:
      return 'Status Desconhecido'
  }
})

const welcomeTitle = computed(() => {
  if (route.query.verified) {
    return 'Email verificado com sucesso!'
  }
  if (route.query.welcome === 'professional') {
    return 'Bem-vindo, Profissional!'
  }
  if (route.query.welcome === 'client') {
    return 'Bem-vindo, Cliente!'
  }
  if (route.query.welcome) {
    return 'Bem-vindo ao Servifflix!'
  }
  return ''
})

const welcomeMessage = computed(() => {
  if (route.query.verified) {
    return 'Sua conta foi verificada e está pronta para uso.'
  }
  if (route.query.welcome === 'professional') {
    return 'Sua conta profissional foi criada. Comece a oferecer seus serviços!'
  }
  if (route.query.welcome === 'client') {
    return 'Sua conta foi criada. Encontre os melhores profissionais!'
  }
  if (route.query.welcome) {
    return 'Sua conta foi criada com sucesso!'
  }
  return ''
})

// Methods
const loadProfile = async () => {
  if (!user.value) return

  try {
    // Carregar perfil básico
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.value.id)
      .single()

    if (profileError) {
      console.error('Erro ao carregar perfil:', profileError)
      return
    }

    profile.value = profileData

    // Se for profissional, carregar dados adicionais
    if (profileData.user_type === 'profissional') {
      // Carregar dados profissionais
      const { data: profData, error: profError } = await supabase
        .from('professionals')
        .select('*')
        .eq('user_id', user.value.id)
        .single()

      if (!profError) {
        professionalData.value = profData
      }

      // Carregar endereço
      const { data: addrData, error: addrError } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.value.id)
        .eq('is_primary', true)
        .single()

      if (!addrError) {
        addressData.value = addrData
      }
    }
  } catch (error) {
    console.error('Erro ao carregar perfil:', error)
  }
}

const handleLogout = async () => {
  const { logout } = useAuth()
  await logout()
}

// Lifecycle
onMounted(async () => {
  await loadProfile()
  
  // Mostrar mensagem de boas-vindas se necessário
  if (route.query.welcome || route.query.verified) {
    showWelcome.value = true
  }
})
</script>

<style scoped>
.dashboard-page {
  min-height: calc(100vh - 70px);
  background: #f8fafc;
  padding: 20px;
}

.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Welcome Banner */
.welcome-banner {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  color: white;
}

.welcome-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.welcome-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.welcome-icon svg {
  width: 24px;
  height: 24px;
}

.welcome-text {
  flex: 1;
}

.welcome-text h2 {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.welcome-text p {
  font-size: 14px;
  margin: 0;
  opacity: 0.9;
}

.close-welcome {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: background-color 0.2s ease;
}

.close-welcome:hover {
  background: rgba(255, 255, 255, 0.3);
}

.close-welcome svg {
  width: 16px;
  height: 16px;
}

/* User Info Card */
.user-info-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-avatar {
  flex-shrink: 0;
}

.avatar-circle {
  width: 64px;
  height: 64px;
  background: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  font-weight: 600;
}

.user-details {
  flex: 1;
}

.user-details h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.user-type {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 4px 0;
}

.user-status {
  font-size: 14px;
  font-weight: 500;
  margin: 0;
}

.status-active {
  color: #10b981;
}

.status-pending {
  color: #f59e0b;
}

.logout-btn {
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.logout-btn:hover {
  background: #dc2626;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  background: #eff6ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  flex-shrink: 0;
}

.stat-icon svg {
  width: 24px;
  height: 24px;
}

.stat-content h4 {
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  margin: 0 0 4px 0;
}

.stat-content p {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

/* Content Sections */
.professional-content,
.client-content {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.professional-content h3,
.client-content h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 12px 0;
}

.professional-content p,
.client-content p {
  color: #6b7280;
  margin: 0 0 20px 0;
}

.professional-info {
  background: #f8fafc;
  border-radius: 8px;
  padding: 16px;
}

.professional-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 12px 0;
}

.professional-info ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.professional-info li {
  color: #374151;
  margin-bottom: 8px;
  font-size: 14px;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-page {
    padding: 16px;
  }
  
  .user-info-card {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  
  .user-details {
    text-align: center;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .welcome-content {
    flex-direction: column;
    text-align: center;
  }
  
  .close-welcome {
    align-self: flex-end;
  }
}
</style>