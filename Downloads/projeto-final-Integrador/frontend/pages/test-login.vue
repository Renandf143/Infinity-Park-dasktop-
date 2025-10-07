<template>
  <div class="test-login">
    <h1>Teste de Login</h1>
    <div class="status">
      <p>Usuário logado: {{ isAuthenticated ? 'Sim' : 'Não' }}</p>
      <p>Loading: {{ loading ? 'Sim' : 'Não' }}</p>
      <p v-if="user">Nome: {{ user.displayName }}</p>
      <p v-if="user">Email: {{ user.email }}</p>
    </div>
    
    <div class="actions">
      <button @click="testGoogleLogin" :disabled="loading">
        {{ loading ? 'Carregando...' : 'Testar Login Google' }}
      </button>
      <button @click="testLogout" v-if="isAuthenticated">
        Logout
      </button>
    </div>
    
    <div class="debug" v-if="debugInfo">
      <h3>Debug Info:</h3>
      <pre>{{ debugInfo }}</pre>
    </div>
  </div>
</template>

<script setup>
const { user, loading, isAuthenticated, signInWithGoogle, logout } = useAuth()
const debugInfo = ref(null)

const testGoogleLogin = async () => {
  try {
    console.log('Testando login...')
    const result = await signInWithGoogle()
    debugInfo.value = JSON.stringify(result, null, 2)
    console.log('Resultado:', result)
  } catch (error) {
    console.error('Erro:', error)
    debugInfo.value = error.message
  }
}

const testLogout = async () => {
  try {
    const result = await logout()
    debugInfo.value = JSON.stringify(result, null, 2)
  } catch (error) {
    debugInfo.value = error.message
  }
}
</script>

<style scoped>
.test-login {
  padding: 50px 20px;
  max-width: 600px;
  margin: 0 auto;
}
</style>