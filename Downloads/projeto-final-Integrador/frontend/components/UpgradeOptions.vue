<template>
  <div v-if="showUpgradeOptions" class="upgrade-options">
    <div class="upgrade-header">
      <h2>Quer oferecer seus serviços?</h2>
      <p>Escolha o tipo de conta que melhor se adequa ao seu perfil</p>
    </div>

    <div class="upgrade-cards">
      <!-- Profissional Individual -->
      <div class="upgrade-card">
        <div class="card-header">
          <div class="card-icon">👨‍💼</div>
          <h3>Profissional</h3>
          <p class="card-subtitle">Para freelancers e autônomos</p>
        </div>
        
        <div class="card-features">
          <ul>
            <li>✅ Perfil profissional</li>
            <li>✅ Receber solicitações</li>
            <li>✅ Portfólio online</li>
            <li>✅ Chat com clientes</li>
            <li>✅ Sistema de avaliações</li>
          </ul>
        </div>
        
        <div class="card-footer">
          <button @click="goToProfessionalSignup" class="btn-upgrade">
            Tornar-se Profissional
          </button>
          <small>Processo rápido - 5 minutos</small>
        </div>
      </div>

      <!-- Empresa -->
      <div class="upgrade-card featured">
        <div class="featured-badge">Mais Popular</div>
        <div class="card-header">
          <div class="card-icon">🏢</div>
          <h3>Empresa</h3>
          <p class="card-subtitle">Para empresas e equipes</p>
        </div>
        
        <div class="card-features">
          <ul>
            <li>✅ Tudo do plano Profissional</li>
            <li>✅ Múltiplos colaboradores</li>
            <li>✅ Gestão de equipe</li>
            <li>✅ Relatórios avançados</li>
            <li>✅ Suporte prioritário</li>
            <li>✅ API personalizada</li>
          </ul>
        </div>
        
        <div class="card-footer">
          <button @click="goToCompanySignup" class="btn-upgrade featured">
            Cadastrar Empresa
          </button>
          <small>Processo completo - 15 minutos</small>
        </div>
      </div>
    </div>

    <div class="upgrade-footer">
      <button @click="dismissUpgrade" class="btn-dismiss">
        Continuar como Cliente
      </button>
      <p>Você pode fazer upgrade a qualquer momento nas configurações</p>
    </div>
  </div>
</template>

<script setup>
const { user } = useAuth()
const { isCliente } = useUserType()

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['dismiss'])

const showUpgradeOptions = computed(() => {
  return props.show && isCliente.value
})

const goToProfessionalSignup = () => {
  navigateTo('/cadastrar/profissional')
}

const goToCompanySignup = () => {
  navigateTo('/cadastrar/empresa')
}

const dismissUpgrade = () => {
  emit('dismiss')
  // Salvar preferência para não mostrar novamente por um tempo
  localStorage.setItem('upgrade_dismissed', Date.now().toString())
}
</script>

<style scoped>
.upgrade-options {
  background: var(--bg-primary);
  border-radius: var(--radius-2xl);
  padding: var(--space-2xl);
  margin: var(--space-xl) 0;
  box-shadow: var(--shadow-2xl);
  border: 1px solid var(--border-primary);
}

.upgrade-header {
  text-align: center;
  margin-bottom: var(--space-2xl);
}

.upgrade-header h2 {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-md);
}

.upgrade-header p {
  font-size: 16px;
  color: var(--text-secondary);
}

.upgrade-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-xl);
  margin-bottom: var(--space-2xl);
}

.upgrade-card {
  background: var(--bg-secondary);
  border: 2px solid var(--border-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  position: relative;
  transition: all 0.3s ease;
}

.upgrade-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.upgrade-card.featured {
  border-color: #8b5cf6;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, var(--bg-secondary) 100%);
}

.featured-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #8b5cf6;
  color: white;
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 600;
}

.card-header {
  text-align: center;
  margin-bottom: var(--space-xl);
}

.card-icon {
  font-size: 48px;
  margin-bottom: var(--space-md);
}

.card-header h3 {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
}

.card-subtitle {
  color: var(--text-secondary);
  font-size: 14px;
}

.card-features {
  margin-bottom: var(--space-xl);
}

.card-features ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.card-features li {
  padding: var(--space-sm) 0;
  color: var(--text-primary);
  font-size: 14px;
}

.card-footer {
  text-align: center;
}

.btn-upgrade {
  width: 100%;
  padding: var(--space-md) var(--space-lg);
  background: #8b5cf6;
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: var(--space-md);
}

.btn-upgrade:hover {
  background: #7c3aed;
  transform: translateY(-2px);
}

.btn-upgrade.featured {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
}

.card-footer small {
  color: var(--text-secondary);
  font-size: 12px;
}

.upgrade-footer {
  text-align: center;
  padding-top: var(--space-xl);
  border-top: 1px solid var(--border-primary);
}

.btn-dismiss {
  background: none;
  border: 1px solid var(--border-primary);
  color: var(--text-secondary);
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-lg);
  cursor: pointer;
  font-size: 14px;
  margin-bottom: var(--space-md);
  transition: all 0.3s ease;
}

.btn-dismiss:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.upgrade-footer p {
  color: var(--text-secondary);
  font-size: 12px;
  margin: 0;
}

@media (max-width: 768px) {
  .upgrade-cards {
    grid-template-columns: 1fr;
  }
  
  .upgrade-options {
    padding: var(--space-lg);
  }
}
</style>