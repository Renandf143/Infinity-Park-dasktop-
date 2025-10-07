<template>
  <div class="debug-page">
    <h1>Debug OAuth URLs</h1>
    
    <div class="debug-info">
      <h2>URLs Atuais:</h2>
      <p><strong>Window Origin:</strong> {{ windowOrigin }}</p>
      <p><strong>Callback URL:</strong> {{ callbackUrl }}</p>
      <p><strong>Supabase URL:</strong> {{ supabaseUrl }}</p>
      <p><strong>Supabase Callback:</strong> {{ supabaseCallback }}</p>
      
      <h2>URLs que devem estar no Google Cloud Console:</h2>
      <div class="urls-config">
        <h3>Authorized JavaScript origins:</h3>
        <code>{{ windowOrigin }}</code><br>
        <code>{{ supabaseUrl }}</code>
        
        <h3>Authorized redirect URIs:</h3>
        <code>{{ callbackUrl }}</code><br>
        <code>{{ supabaseCallback }}</code>
      </div>
      
      <button @click="testLogin" :disabled="loading">
        {{ loading ? 'Testando...' : 'Testar Login' }}
      </button>
      
      <div v-if="result" class="result">
        <pre>{{ JSON.stringify(result, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
const { $supabase } = useNuxtApp()
const loading = ref(false)
const result = ref(null)

const windowOrigin = ref('')
const callbackUrl = ref('')
const supabaseUrl = ref('')
const supabaseCallback = ref('')

onMounted(() => {
  windowOrigin.value = window.location.origin
  callbackUrl.value = `${window.location.origin}/auth/callback`
  supabaseUrl.value = $supabase.supabaseUrl
  supabaseCallback.value = `${$supabase.supabaseUrl}/auth/v1/callback`
})

const testLogin = async () => {
  loading.value = true
  result.value = null
  
  try {
    const { data, error } = await $supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: callbackUrl.value
      }
    })
    
    result.value = { data, error, callbackUrl: callbackUrl.value }
  } catch (err) {
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
  font-family: monospace;
}

.debug-info {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
}

.urls-config {
  background: #e8f4f8;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
}

.urls-config code {
  background: #fff;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
  margin: 0.25rem 0;
}

.result {
  background: #f0f0f0;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
}

button {
  background: #4285f4;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 1rem 0;
}

button:disabled {
  opacity: 0.5;
}
</style>