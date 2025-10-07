<template>
  <div class="admin-dashboard">
    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon users">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 7c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4 4-1.79 4-4zm-4 6c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ stats.totalUsers }}</h3>
          <p>Total de Usuários</p>
          <span class="stat-change positive">+12% este mês</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon companies">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ stats.totalCompanies }}</h3>
          <p>Empresas Cadastradas</p>
          <span class="stat-change positive">+8% este mês</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon services">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ stats.totalServices }}</h3>
          <p>Serviços Ativos</p>
          <span class="stat-change positive">+15% este mês</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon revenue">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3>R$ {{ formatCurrency(stats.totalRevenue) }}</h3>
          <p>Receita Total</p>
          <span class="stat-change positive">+22% este mês</span>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="charts-section">
      <div class="chart-card">
        <div class="chart-header">
          <h3>Usuários por Mês</h3>
          <select v-model="selectedPeriod" class="period-select">
            <option value="6m">Últimos 6 meses</option>
            <option value="1y">Último ano</option>
            <option value="2y">Últimos 2 anos</option>
          </select>
        </div>
        <div class="chart-placeholder">
          <div class="chart-bars">
            <div v-for="(value, index) in chartData" :key="index" class="chart-bar">
              <div class="bar" :style="{ height: `${(value / Math.max(...chartData)) * 100}%` }"></div>
              <span class="bar-label">{{ getMonthLabel(index) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="activity-card">
        <div class="activity-header">
          <h3>Atividade Recente</h3>
          <NuxtLink to="/admin/usuarios" class="view-all">Ver todos</NuxtLink>
        </div>
        <div class="activity-list">
          <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
            <div class="activity-icon" :class="activity.type">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path v-if="activity.type === 'user'" d="M16 7c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4 4-1.79 4-4zm-4 6c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z"/>
                <path v-else-if="activity.type === 'company'" d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
                <path v-else d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <div class="activity-content">
              <p class="activity-text">{{ activity.text }}</p>
              <span class="activity-time">{{ formatTime(activity.time) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <h3>Ações Rápidas</h3>
      <div class="actions-grid">
        <NuxtLink to="/admin/usuarios" class="action-card">
          <div class="action-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </div>
          <div class="action-content">
            <h4>Adicionar Usuário</h4>
            <p>Criar novo usuário no sistema</p>
          </div>
        </NuxtLink>

        <NuxtLink to="/admin/empresas" class="action-card">
          <div class="action-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </div>
          <div class="action-content">
            <h4>Nova Empresa</h4>
            <p>Cadastrar nova empresa</p>
          </div>
        </NuxtLink>

        <NuxtLink to="/admin/categorias" class="action-card">
          <div class="action-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/>
            </svg>
          </div>
          <div class="action-content">
            <h4>Gerenciar Categorias</h4>
            <p>Organizar categorias de serviços</p>
          </div>
        </NuxtLink>

        <NuxtLink to="/admin/relatorios" class="action-card">
          <div class="action-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
            </svg>
          </div>
          <div class="action-content">
            <h4>Ver Relatórios</h4>
            <p>Análises e estatísticas</p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

// Estados
const selectedPeriod = ref('6m')

// Dados mockados
const stats = reactive({
  totalUsers: 1247,
  totalCompanies: 89,
  totalServices: 456,
  totalRevenue: 125430
})

const chartData = ref([120, 150, 180, 200, 170, 220])

const recentActivities = ref([
  {
    id: 1,
    type: 'user',
    text: 'Novo usuário cadastrado: João Silva',
    time: new Date(Date.now() - 5 * 60 * 1000)
  },
  {
    id: 2,
    type: 'company',
    text: 'Empresa "TechSolutions" aprovada',
    time: new Date(Date.now() - 15 * 60 * 1000)
  },
  {
    id: 3,
    type: 'service',
    text: 'Novo serviço publicado: Desenvolvimento Web',
    time: new Date(Date.now() - 30 * 60 * 1000)
  },
  {
    id: 4,
    type: 'user',
    text: 'Usuário Maria Santos fez login',
    time: new Date(Date.now() - 45 * 60 * 1000)
  }
])

// Methods
function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR').format(value)
}

function formatTime(date) {
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  
  if (minutes < 1) return 'Agora'
  if (minutes < 60) return `${minutes}m atrás`
  
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h atrás`
  
  const days = Math.floor(hours / 24)
  return `${days}d atrás`
}

function getMonthLabel(index) {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun']
  return months[index] || `M${index + 1}`
}

// Meta
useHead({
  title: 'Dashboard - ServiFlix Admin'
})
</script>

<style scoped>
.admin-dashboard {
  max-width: 1400px;
  margin: 0 auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-xl);
  margin-bottom: var(--space-3xl);
}

.stat-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  transition: all var(--transition-base);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-icon.users {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
}

.stat-icon.companies {
  background: linear-gradient(135deg, #10b981, #047857);
}

.stat-icon.services {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.stat-icon.revenue {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.stat-icon svg {
  width: 24px;
  height: 24px;
}

.stat-content h3 {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-xs);
}

.stat-content p {
  color: var(--text-secondary);
  font-size: var(--text-sm);
  margin-bottom: var(--space-xs);
}

.stat-change {
  font-size: var(--text-xs);
  font-weight: 600;
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
}

.stat-change.positive {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.charts-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-xl);
  margin-bottom: var(--space-3xl);
}

.chart-card,
.activity-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
}

.chart-header,
.activity-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-xl);
}

.chart-header h3,
.activity-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.period-select {
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: var(--text-sm);
}

.view-all {
  color: #8b5cf6;
  text-decoration: none;
  font-size: var(--text-sm);
  font-weight: 600;
}

.view-all:hover {
  text-decoration: underline;
}

.chart-placeholder {
  height: 300px;
  display: flex;
  align-items: end;
  justify-content: center;
}

.chart-bars {
  display: flex;
  align-items: end;
  gap: var(--space-lg);
  height: 250px;
  width: 100%;
  max-width: 400px;
}

.chart-bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
}

.bar {
  width: 100%;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  min-height: 20px;
  transition: all var(--transition-base);
}

.bar-label {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  font-weight: 600;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.activity-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.activity-icon.user {
  background: #3b82f6;
}

.activity-icon.company {
  background: #10b981;
}

.activity-icon.service {
  background: #f59e0b;
}

.activity-icon svg {
  width: 16px;
  height: 16px;
}

.activity-content {
  flex: 1;
}

.activity-text {
  color: var(--text-primary);
  font-size: var(--text-sm);
  margin-bottom: var(--space-xs);
}

.activity-time {
  color: var(--text-tertiary);
  font-size: var(--text-xs);
}

.quick-actions h3 {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-xl);
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-lg);
}

.action-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  display: flex;
  align-items: center;
  gap: var(--space-md);
  text-decoration: none;
  transition: all var(--transition-base);
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: #8b5cf6;
}

.action-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.action-icon svg {
  width: 20px;
  height: 20px;
}

.action-content h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-xs);
}

.action-content p {
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

/* Responsividade */
@media (max-width: 1024px) {
  .charts-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>