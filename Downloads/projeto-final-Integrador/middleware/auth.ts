export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated, loading } = useFirebaseAuth()

  // Se ainda está carregando, aguardar
  if (loading.value) {
    return
  }

  // Se não está autenticado, redirecionar para login
  if (!isAuthenticated.value) {
    return navigateTo('/login?redirect=' + encodeURIComponent(to.fullPath))
  }
})
