export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser()

  // Se não há usuário logado, redirecionar para login
  if (!user.value) {
    return navigateTo('/entrar')
  }

  // Na simulação, não bloquear por email não verificado
  // Em produção, descomente a linha abaixo:
  // if (!user.value.email_confirmed_at) {
  //   return navigateTo('/auth/verify-email')
  // }
})