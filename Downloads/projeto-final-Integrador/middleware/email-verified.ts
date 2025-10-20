export default defineNuxtRouteMiddleware((to, from) => {
  const { user, isEmailVerified, loading } = useFirebaseAuth()

  // Se ainda está carregando, aguardar
  if (loading.value) {
    return
  }

  // Se não está autenticado, deixar o middleware auth lidar
  if (!user.value) {
    return
  }

  // Se o email não foi verificado, redirecionar para página de verificação
  if (!isEmailVerified.value) {
    return navigateTo('/verificar-email')
  }
})
