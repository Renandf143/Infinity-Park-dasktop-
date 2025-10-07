<template>
  <div class="debug-page">
    <h1>Debug OAuth - ServiFlix</h1>
    
    <div class="debug-info">
      <h2>Configurações Atuais:</h2>
      <p><strong>Supabase URL:</strong> {{ supabaseUrl }}</p>
      <p><strong>Callback URL esperada:</strong> {{ callbackUrl }}</p>
      
      <h2>Teste OAuth:</h2>
      <button @click="testGoogleLogin" :disabled="loading">
        {{ loading ? 'Testando...' : 'Testar Login Google' }}
      </button>
      
      <div v-if="result" class="result">
        <h3>Resultado:</h3>
        <pre>{{ JSON.stringify(result, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
const { $supabase } = useNuxtApp()
const loading = ref(false)
const result = ref(null)

const supabaseUrl = $supabase.supabaseUrl
const callbackUrl = `${supabaseUrl}/auth/v1/callback`

const testGoogleLogin = async () => {
  loading.value = true
  result.value = null
  
  try {
    console.log('Testando login Google...')
    console.log('Callback URL:', callbackUrl)
    
    const { data, error } = await $supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    
    result.value = { data, error }
    
    if (error) {
      console.error('Erro:', error)
    } else {
      console.log('Sucesso:', data)
    }
  } catch (err) {
    console.error('Erro no teste:', err)
    result.value = { error: err.message }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.debug-page {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.debug-info {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
}

.result {
  background: #e8f4f8;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
}

pre {
  white-space: pre-wrap;
  word-break: break-word;
}

button {
  background: #4285f4;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>