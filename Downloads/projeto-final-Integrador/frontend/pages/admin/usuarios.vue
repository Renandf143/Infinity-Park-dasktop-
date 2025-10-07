<template>
  <div class="admin-users">
    <!-- Header -->
    <div class="page-header">
      <div class="header-left">
        <h2>Gerenciar Usuários</h2>
        <p>{{ filteredUsers.length }} usuários encontrados</p>
      </div>
      <div class="header-right">
        <button @click="showAddModal = true" class="btn-primary">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          Adicionar Usuário
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <div class="search-box">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar usuários..."
          class="search-input"
        >
      </div>
      
      <div class="filter-controls">
        <select v-model="selectedType" class="filter-select">
          <option value="">Todos os tipos</option>
          <option value="cliente">Cliente</option>
          <option value="profissional">Profissional</option>
          <option value="empresa">Empresa</option>
        </select>
        
        <select v-model="selectedStatus" class="filter-select">
          <option value="">Todos os status</option>
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
          <option value="pendente">Pendente</option>
        </select>
      </div>
    </div>

    <!-- Users Table -->
    <div class="table-container">
      <table class="users-table">
        <thead>
          <tr>
            <th>Usuário</th>
            <th>Tipo</th>
            <th>Status</th>
            <th>Data de Cadastro</th>
            <th>Último Acesso</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in paginatedUsers" :key="user.id" class="user-row">
            <td>
              <div class="user-info">
                <img :src="user.avatar" :alt="user.name" class="user-avatar">
                <div class="user-details">
                  <span class="user-name">{{ user.name }}</span>
                  <span class="user-email">{{ user.email }}</span>
                </div>
              </div>
            </td>
            <td>
              <span class="user-type" :class="user.type">{{ getUserTypeLabel(user.type) }}</span>
            </td>
            <td>
              <span class="status-badge" :class="user.status">{{ getStatusLabel(user.status) }}</span>
            </td>
            <td>{{ formatDate(user.createdAt) }}</td>
            <td>{{ formatDate(user.lastAccess) }}</td>
            <td>
              <div class="action-buttons">
                <button @click="editUser(user)" class="btn-action edit" title="Editar">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                </button>
                <button @click="toggleUserStatus(user)" class="btn-action" :class="user.status === 'ativo' ? 'disable' : 'enable'" :title="user.status === 'ativo' ? 'Desativar' : 'Ativar'">
                  <svg v-if="user.status === 'ativo'" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"/>
                  </svg>
                </button>
                <button @click="deleteUser(user)" class="btn-action delete" title="Excluir">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <button 
        @click="currentPage--" 
        :disabled="currentPage === 1"
        class="pagination-btn"
      >
        Anterior
      </button>
      
      <div class="pagination-info">
        Página {{ currentPage }} de {{ totalPages }}
      </div>
      
      <button 
        @click="currentPage++" 
        :disabled="currentPage === totalPages"
        class="pagination-btn"
      >
        Próxima
      </button>
    </div>

    <!-- Add/Edit User Modal -->
    <div v-if="showAddModal || editingUser" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ editingUser ? 'Editar Usuário' : 'Adicionar Usuário' }}</h3>
          <button @click="closeModal" class="modal-close">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="saveUser" class="modal-form">
          <div class="form-group">
            <label class="form-label">Nome Completo</label>
            <input v-model="userForm.name" type="text" class="form-input" required>
          </div>
          
          <div class="form-group">
            <label class="form-label">E-mail</label>
            <input v-model="userForm.email" type="email" class="form-input" required>
          </div>
          
          <div class="form-group">
            <label class="form-label">Tipo de Usuário</label>
            <select v-model="userForm.type" class="form-select" required>
              <option value="">Selecione</option>
              <option value="cliente">Cliente</option>
              <option value="profissional">Profissional</option>
              <option value="empresa">Empresa</option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label">Status</label>
            <select v-model="userForm.status" class="form-select" required>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
              <option value="pendente">Pendente</option>
            </select>
          </div>
          
          <div class="modal-actions">
            <button type="button" @click="closeModal" class="btn-secondary">Cancelar</button>
            <button type="submit" class="btn-primary">{{ editingUser ? 'Salvar' : 'Adicionar' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

// Estados
const searchQuery = ref('')
const selectedType = ref('')
const selectedStatus = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const showAddModal = ref(false)
const editingUser = ref(null)

const userForm = reactive({
  name: '',
  email: '',
  type: '',
  status: 'ativo'
})

// Dados mockados
const users = ref([
  {
    id: 1,
    name: 'João Silva',
    email: 'joao@email.com',
    type: 'cliente',
    status: 'ativo',
    avatar: '/assets/images/avatar1.jpg',
    createdAt: new Date('2024-01-15'),
    lastAccess: new Date('2024-02-10')
  },
  {
    id: 2,
    name: 'Maria Santos',
    email: 'maria@email.com',
    type: 'profissional',
    status: 'ativo',
    avatar: '/assets/images/avatar2.jpg',
    createdAt: new Date('2024-01-20'),
    lastAccess: new Date('2024-02-09')
  },
  {
    id: 3,
    name: 'TechSolutions Ltda',
    email: 'contato@techsolutions.com',
    type: 'empresa',
    status: 'pendente',
    avatar: '/assets/images/company1.jpg',
    createdAt: new Date('2024-02-01'),
    lastAccess: new Date('2024-02-08')
  }
])

// Computed
const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesType = !selectedType.value || user.type === selectedType.value
    const matchesStatus = !selectedStatus.value || user.status === selectedStatus.value
    
    return matchesSearch && matchesType && matchesStatus
  })
})

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage))

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredUsers.value.slice(start, end)
})

// Methods
function getUserTypeLabel(type) {
  const labels = {
    cliente: 'Cliente',
    profissional: 'Profissional',
    empresa: 'Empresa'
  }
  return labels[type] || type
}

function getStatusLabel(status) {
  const labels = {
    ativo: 'Ativo',
    inativo: 'Inativo',
    pendente: 'Pendente'
  }
  return labels[status] || status
}

function formatDate(date) {
  return new Intl.DateTimeFormat('pt-BR').format(date)
}

function editUser(user) {
  editingUser.value = user
  Object.assign(userForm, {
    name: user.name,
    email: user.email,
    type: user.type,
    status: user.status
  })
}

function closeModal() {
  showAddModal.value = false
  editingUser.value = null
  Object.assign(userForm, {
    name: '',
    email: '',
    type: '',
    status: 'ativo'
  })
}

function saveUser() {
  if (editingUser.value) {
    // Editar usuário existente
    const index = users.value.findIndex(u => u.id === editingUser.value.id)
    if (index !== -1) {
      users.value[index] = {
        ...users.value[index],
        ...userForm
      }
    }
  } else {
    // Adicionar novo usuário
    const newUser = {
      id: Date.now(),
      ...userForm,
      avatar: '/assets/images/default-avatar.jpg',
      createdAt: new Date(),
      lastAccess: new Date()
    }
    users.value.push(newUser)
  }
  
  closeModal()
}

function toggleUserStatus(user) {
  user.status = user.status === 'ativo' ? 'inativo' : 'ativo'
}

function deleteUser(user) {
  if (confirm(`Tem certeza que deseja excluir o usuário ${user.name}?`)) {
    const index = users.value.findIndex(u => u.id === user.id)
    if (index !== -1) {
      users.value.splice(index, 1)
    }
  }
}

// Meta
useHead({
  title: 'Usuários - ServiFlix Admin'
})
</script>

<style scoped>
.admin-users {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-xl);
}

.header-left h2 {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-xs);
}

.header-left p {
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-lg);
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -3px rgba(139, 92, 246, 0.3);
}

.btn-primary svg {
  width: 16px;
  height: 16px;
}

.filters-section {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  margin-bottom: var(--space-xl);
  display: flex;
  gap: var(--space-lg);
  align-items: center;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-box svg {
  position: absolute;
  left: var(--space-md);
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: var(--text-tertiary);
}

.search-input {
  width: 100%;
  padding: var(--space-md) var(--space-md) var(--space-md) 40px;
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  background: var(--bg-primary);
  color: var(--text-primary);
}

.filter-controls {
  display: flex;
  gap: var(--space-md);
}

.filter-select {
  padding: var(--space-md);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  background: var(--bg-primary);
  color: var(--text-primary);
  min-width: 150px;
}

.table-container {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: var(--space-xl);
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th {
  background: var(--bg-tertiary);
  padding: var(--space-lg);
  text-align: left;
  font-weight: 600;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-primary);
}

.user-row {
  border-bottom: 1px solid var(--border-primary);
  transition: background-color var(--transition-base);
}

.user-row:hover {
  background: var(--bg-tertiary);
}

.users-table td {
  padding: var(--space-lg);
  vertical-align: middle;
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  object-fit: cover;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  color: var(--text-primary);
  font-size: var(--text-sm);
}

.user-email {
  color: var(--text-secondary);
  font-size: var(--text-xs);
}

.user-type {
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
}

.user-type.cliente {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.user-type.profissional {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.user-type.empresa {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.status-badge {
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.ativo {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.status-badge.inativo {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.status-badge.pendente {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.action-buttons {
  display: flex;
  gap: var(--space-sm);
}

.btn-action {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-base);
}

.btn-action svg {
  width: 16px;
  height: 16px;
}

.btn-action.edit {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.btn-action.edit:hover {
  background: #3b82f6;
  color: white;
}

.btn-action.enable {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.btn-action.enable:hover {
  background: #10b981;
  color: white;
}

.btn-action.disable {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.btn-action.disable:hover {
  background: #f59e0b;
  color: white;
}

.btn-action.delete {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.btn-action.delete:hover {
  background: #ef4444;
  color: white;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-lg);
}

.pagination-btn {
  padding: var(--space-sm) var(--space-lg);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  background: var(--bg-secondary);
  color: var(--text-primary);
  cursor: pointer;
  transition: all var(--transition-base);
}

.pagination-btn:hover:not(:disabled) {
  background: var(--bg-tertiary);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-xl);
  border-bottom: 1px solid var(--border-primary);
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.modal-close {
  background: none;
  border: none;
  color: var(--text-tertiary);
  cursor: pointer;
  padding: var(--space-xs);
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
}

.modal-close:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.modal-close svg {
  width: 20px;
  height: 20px;
}

.modal-form {
  padding: var(--space-xl);
}

.form-group {
  margin-bottom: var(--space-lg);
}

.form-label {
  display: block;
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
}

.form-input,
.form-select {
  width: 100%;
  padding: var(--space-md);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.modal-actions {
  display: flex;
  gap: var(--space-md);
  justify-content: flex-end;
  margin-top: var(--space-xl);
}

.btn-secondary {
  padding: var(--space-md) var(--space-lg);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  background: var(--bg-secondary);
  color: var(--text-primary);
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-secondary:hover {
  background: var(--bg-tertiary);
}

/* Responsividade */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-lg);
  }
  
  .filters-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-controls {
    flex-direction: column;
  }
  
  .table-container {
    overflow-x: auto;
  }
  
  .users-table {
    min-width: 800px;
  }
}
</style>