<template>
  <div class="upgrade-page">
    <div class="container">
      <div class="upgrade-header">
        <h1>Ofereça seus Serviços</h1>
        <p>Escolha o tipo de conta que melhor se adequa ao seu perfil e comece a ganhar dinheiro</p>
      </div>

      <UpgradeOptions :show="true" @dismiss="goToDashboard" />
      
      <div class="upgrade-footer">
        <button @click="goToDashboard" class="btn-back">
          ← Voltar ao Dashboard
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const { user } = useAuth()
const { isCliente } = useUserType()

// Verificar se usuário está logado
if (!user.value) {
  await navigateTo('/entrar')
}

// Se não for cliente, redirecionar
if (!isCliente.value) {
  await navigateTo('/dashboard')
}

const goToDashboard = () => {
  navigateTo('/dashboard')
}

// Meta tags
useHead({
  title: 'Upgrade de Conta - ServiFlix',
  meta: [
    { name: 'description', content: 'Torne-se um profissional ou empresa no ServiFlix' }
  ]
})
</script>

<style scoped>
.upgrade-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f3e8ff 0%, var(--bg-primary) 30%);
  padding: var(--space-xl) 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-lg);
}

.upgrade-header {
  text-align: center;
  margin-bottom: var(--space-2xl);
}

.upgrade-header h1 {
  font-size: 36px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-md);
}

.upgrade-header p {
  font-size: 18px;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
}

.upgrade-footer {
  text-align: center;
  margin-top: var(--space-2xl);
}

.btn-back {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
  padding: var(--space-md) var(--space-xl);
  border-radius: var(--radius-lg);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-back:hover {
  background: var(--bg-tertiary);
  transform: translateY(-2px);
}
</style>