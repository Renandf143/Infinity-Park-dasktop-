export default defineNuxtPlugin(async () => {
  // Aguardar um pouco para garantir que o Firebase foi inicializado
  await new Promise(resolve => setTimeout(resolve, 100))

  try {
    const { initAuth } = useFirebaseAuth()
    await initAuth()
  } catch (error) {
    console.warn('Erro ao inicializar autenticação:', error)
  }
})
