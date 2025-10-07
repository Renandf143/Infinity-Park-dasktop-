<template>
  <div class="auth-callback">
    <div class="callback-container">
      <div class="loading-spinner">
        <div class="spinner"></div>
      </div>
      <h2>Processando login...</h2>
      <p>Aguarde enquanto finalizamos seu login.</p>
    </div>
  </div>
</template>

<script setup>
const { $supabase } = useNuxtApp()
const { initAuth } = useAuth()

onMounted(async () => {
  try {
    console.log('Processando callback do OAuth...')
    
    // Aguardar um pouco para o Supabase processar
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Verificar se há sessão ativa
    const { data: { session }, error } = await $supabase.auth.getSession()
    
    if (error) {
      console.error('Erro no callback:', error)
      await navigateTo('/entrar?error=callback_error')
      return
    }
    
    if (session) {
      console.log('Login realizado com sucesso:', session.user)
      
      // Inicializar auth
      await initAuth()
      
      // Redirecionar baseado no tipo de usuário
      const userType = session.user.user_metadata?.user_type || 'cliente'
      
      if (userType === 'cliente') {
        await navigateTo('/dashboard?welcome=true')
      } else {
        await navigateTo('/dashboard')
      }
    } else {
      console.log('Nenhuma sessão encontrada, redirecionando para login')
      await navigateTo('/entrar?error=no_session')
    }
  } catch (error) {
    console.error('Erro no processamento do callback:', error)
    await navigateTo('/entrar?error=callback_error')
  }
})

// Meta tags
useHead({
  title: 'Processando Login - ServiFlix',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>

<style scoped>
.auth-callback {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f3e8ff 0%, var(--bg-primary) 30%, #f3e8ff 100%);
}

.callback-container {
  text-align: center;
  padding: var(--space-3xl);
  background: var(--bg-primary);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-2xl);
  border: 1px solid var(--border-primary);
}

.loading-spinner {
  margin-bottom: var(--space-xl);
  display: flex;
  justify-content: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--border-primary);
  border-top: 4px solid #8b5cf6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

h2 {
  color: var(--text-primary);
  margin-bottom: var(--space-md);
  font-size: 24px;
  font-weight: 600;
}

p {
  color: var(--text-secondary);
  font-size: 16px;
}
</style>