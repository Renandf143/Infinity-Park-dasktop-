<template>
  <header class="header" :class="{ 'header-dark': isDarkSection }">
    <div class="glass-nav">
      <div class="nav-container" :class="{ 'nav-dark': isDarkSection }">
        <!-- Logo -->
        <NuxtLink to="/" class="nav-brand">
          <div class="logo-icon">
            <svg width="20" height="12" viewBox="0 0 30 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.1594 0.99375L10.6219 4.66875C9.86719 5.27812 9.72188 6.375 10.2938 7.15781C10.8984 7.99219 12.075 8.15625 12.8859 7.52344L17.5406 3.90469C17.8688 3.65156 18.3375 3.70781 18.5953 4.03594C18.8531 4.36406 18.7922 4.83281 18.4641 5.09062L17.4844 5.85L25.7906 13.5H27.75C28.9922 13.5 30 12.4922 30 11.25V5.25C30 4.00781 28.9922 3 27.75 3H24.1875H24H23.9672L23.7844 2.88281L20.3812 0.703125C19.6641 0.24375 18.825 0 17.9719 0C16.95 0 15.9562 0.351562 15.1594 0.99375ZM16.2281 6.825C15.0971 7.2226 13.8047 8.70937 13.8047 8.70937C12.3281 9.8625 10.1859 9.5625 9.07969 8.04375C8.03906 6.61406 8.30156 4.61719 9.675 3.50625L13.575 0.351562C13.0313 0.121875 12.4453 0.00468743 11.85 0.00468743C10.9688 -7.17118e-08 10.1109 0.2625 9.375 0.75L6 3H2.25C1.00781 3 0 4.00781 0 5.25V11.25C0 12.4922 1.00781 13.5 2.25 13.5H7.32187L11.6063 17.4094C12.525 18.2484 13.9453 18.1828 14.7844 17.2641C15.0422 16.9781 15.2156 16.6453 15.3047 16.2984L16.1016 17.0297C17.0156 17.8687 18.4406 17.8078 19.2797 16.8937C19.4906 16.6641 19.6453 16.3969 19.7438 16.1203C20.6531 16.7297 21.8906 16.6031 22.6547 15.7687C23.4937 14.8547 23.4328 13.4297 22.5187 12.5906C22.5187 12.5906 19.3719 5.71981 16.2281 6.825Z" :fill="isDarkSection ? '#1f2937' : 'white'"/>
            </svg>
          </div>
          <span class="brand-text">Serviço <span class="brand-highlight">Flix</span></span>
        </NuxtLink>
        
        <!-- Menu Links -->
        <div class="nav-links">
          <NuxtLink to="/" class="nav-link">Início</NuxtLink>
          <NuxtLink to="/como-funciona" class="nav-link">Como Funciona</NuxtLink>
          <NuxtLink to="/categorias" class="nav-link">Categorias</NuxtLink>
          <NuxtLink to="/para-profissionais" class="nav-link">Para Profissionais</NuxtLink>
        </div>
        
        <!-- Auth Buttons -->
        <div class="auth-section">
          <div v-if="!isAuthenticated" class="auth-buttons">
            <NuxtLink to="/entrar" class="btn-entrar">Entrar</NuxtLink>
            <NuxtLink to="/cadastrar" class="btn-cadastrar">Cadastre-se</NuxtLink>
          </div>
          
          <div v-else class="user-menu">
            <span class="user-name">{{ user?.displayName || 'Usuário' }}</span>
            <button @click="handleLogout" class="btn-logout">Sair</button>
          </div>
        </div>
        
        <!-- Mobile Toggle -->
        <button 
          class="nav-toggle" 
          :class="{ active: mobileMenuOpen }"
          @click="toggleMobileMenu" 
          aria-label="Abrir menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
    
    <!-- Menu Mobile -->
    <div class="nav-mobile" :class="{ active: mobileMenuOpen }">
      <div class="nav-mobile-content">
        <NuxtLink to="/" class="nav-mobile-link" @click="closeMobileMenu">Início</NuxtLink>
        <NuxtLink to="/como-funciona" class="nav-mobile-link" @click="closeMobileMenu">Como Funciona</NuxtLink>
        <NuxtLink to="/categorias" class="nav-mobile-link" @click="closeMobileMenu">Categorias</NuxtLink>
        <NuxtLink to="/para-profissionais" class="nav-mobile-link" @click="closeMobileMenu">Para Profissionais</NuxtLink>
        
        <div v-if="!isAuthenticated" class="nav-mobile-actions">
          <NuxtLink to="/entrar" class="btn-entrar-mobile" @click="closeMobileMenu">Entrar</NuxtLink>
          <NuxtLink to="/cadastrar" class="btn-cadastrar-mobile" @click="closeMobileMenu">Cadastre-se</NuxtLink>
        </div>
        
        <div v-else class="nav-mobile-user">
          <span class="user-name-mobile">{{ user?.displayName || 'Usuário' }}</span>
          <button @click="handleLogout" class="btn-logout-mobile">Sair</button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
// Usar o composable real de autenticação
const { user, loading, isAuthenticated, signInWithGoogle, logout, initAuth } = useAuth()

const mobileMenuOpen = ref(false)
const isDarkSection = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
  
  // Adicionar/remover classe no body para prevenir scroll
  if (process.client) {
    if (mobileMenuOpen.value) {
      document.body.classList.add('nav-mobile-open')
    } else {
      document.body.classList.remove('nav-mobile-open')
    }
  }
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
  if (process.client) {
    document.body.classList.remove('nav-mobile-open')
  }
}

// Função simplificada para logout
const handleGoogleLogin = async () => {
  // Fechar menu mobile se estiver aberto
  closeMobileMenu()
  
  try {
    loading.value = true
    const result = await signInWithGoogle()
    
    if (result.success) {
      // Se for redirecionamento (OAuth), não fazer nada - o Supabase vai redirecionar
      if (result.redirecting) {
        console.log('Redirecionando para Google OAuth...')
        return
      }
      // Se login direto, redirecionar para dashboard
      await navigateTo('/dashboard')
    } else {
      console.error('Erro no login:', result.error)
      // Mostrar erro ou redirecionar para página de login
      await navigateTo('/entrar?error=' + encodeURIComponent(result.error || 'Erro no login'))
    }
  } catch (error) {
    console.error('Erro no login:', error)
    await navigateTo('/entrar?error=login_error')
  } finally {
    loading.value = false
  }
}

// Logout
const handleLogout = async () => {
  // Fechar menu mobile se estiver aberto
  closeMobileMenu()
  
  try {
    await logout()
    await navigateTo('/')
  } catch (error) {
    console.error('Erro no logout:', error)
  }
}



// Estado do scroll
const isScrolled = ref(false)

// Detectar seção atual e adaptar cores
const detectCurrentSection = () => {
  if (!process.client) return
  
  const sections = [
    { selector: '.hero', isDark: false },
    { selector: '.categories', isDark: true },
    { selector: '.featured-services', isDark: true },
    { selector: '.how-it-works', isDark: true },
    { selector: '.testimonials', isDark: true },
    { selector: '.why-choose', isDark: true },
    { selector: '.for-professionals', isDark: false },
    { selector: '.newsletter', isDark: false }
  ]
  
  const scrollY = window.scrollY + 100 // Offset para o header
  
  for (const section of sections) {
    const element = document.querySelector(section.selector)
    if (element) {
      const rect = element.getBoundingClientRect()
      const elementTop = rect.top + window.scrollY
      const elementBottom = elementTop + rect.height
      
      if (scrollY >= elementTop && scrollY <= elementBottom) {
        isDarkSection.value = section.isDark
        break
      }
    }
  }
}

// Fechar menu com tecla ESC e detectar scroll
onMounted(() => {
  // Garantir que o menu mobile está fechado
  mobileMenuOpen.value = false
  
  if (process.client) {
    document.body.classList.remove('nav-mobile-open')
    
    const handleEscape = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen.value) {
        closeMobileMenu()
      }
    }
    
    const handleScroll = () => {
      isScrolled.value = window.scrollY > 50
      detectCurrentSection()
    }
    
    document.addEventListener('keydown', handleEscape)
    window.addEventListener('scroll', handleScroll)
    
    // Detectar seção inicial
    detectCurrentSection()
    
    // Cleanup
    onUnmounted(() => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('scroll', handleScroll)
      document.body.classList.remove('nav-mobile-open')
    })
  }
})
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 20px 0;
}

.glass-nav {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

.nav-container {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  padding: 12px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.nav-container.nav-dark {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: white;
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 12px;
}

.brand-text {
  font-size: 16px;
  font-weight: 600;
  color: white;
  transition: all 0.3s ease;
}

.nav-dark .brand-text {
  color: #1f2937;
}

.brand-highlight {
  color: #fbbf24;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-link {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-weight: 400;
  font-size: 14px;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.nav-link:hover {
  color: white;
}

.nav-link.router-link-active {
  color: white;
}

.nav-dark .nav-link {
  color: rgba(31, 41, 55, 0.8);
}

.nav-dark .nav-link:hover {
  color: #1f2937;
}

.nav-dark .nav-link.router-link-active {
  color: #1f2937;
}

.auth-section {
  display: flex;
  align-items: center;
}

.auth-buttons {
  display: flex;
  align-items: center;
  gap: 16px;
}

.btn-entrar {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-weight: 400;
  font-size: 14px;
  transition: all 0.3s ease;
}

.btn-entrar:hover {
  color: white;
}

.nav-dark .btn-entrar {
  color: rgba(31, 41, 55, 0.8);
}

.nav-dark .btn-entrar:hover {
  color: #1f2937;
}

.btn-cadastrar {
  background: white;
  color: #1e40af;
  text-decoration: none;
  padding: 8px 18px;
  border-radius: 25px;
  font-weight: 500;
  font-size: 13px;
  transition: all 0.3s ease;
  border: none;
}

.btn-cadastrar:hover {
  background: #f8fafc;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.nav-dark .btn-cadastrar {
  background: #3b82f6;
  color: white;
}

.nav-dark .btn-cadastrar:hover {
  background: #2563eb;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-name {
  font-weight: 500;
  color: white;
  font-size: 14px;
  transition: all 0.3s ease;
}

.nav-dark .user-name {
  color: #1f2937;
}

.btn-logout {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
  padding: 6px 14px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 400;
  font-size: 13px;
  transition: all 0.3s ease;
}

.btn-logout:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.nav-dark .btn-logout {
  background: rgba(31, 41, 55, 0.1);
  border: 1px solid rgba(31, 41, 55, 0.2);
  color: rgba(31, 41, 55, 0.8);
}

.nav-dark .btn-logout:hover {
  background: rgba(31, 41, 55, 0.2);
  color: #1f2937;
}

/* Mobile Menu Toggle */
.nav-toggle {
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  gap: 3px;
}

.nav-toggle span {
  width: 20px;
  height: 2px;
  background: white;
  border-radius: 1px;
  transition: all 0.3s ease;
}

.nav-dark .nav-toggle span {
  background: #1f2937;
}

.nav-toggle.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.nav-toggle.active span:nth-child(2) {
  opacity: 0;
}

.nav-toggle.active span:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

/* Mobile Menu */
.nav-mobile {
  position: fixed;
  top: 80px;
  left: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  transform: translateY(-20px);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 999;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.nav-mobile.active {
  transform: translateY(0);
  opacity: 1;
  visibility: visible;
}

.nav-mobile-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.nav-mobile-link {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-weight: 400;
  font-size: 16px;
  padding: 8px 0;
  transition: all 0.3s ease;
}

.nav-mobile-link:hover {
  color: white;
}

.nav-mobile-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-entrar-mobile {
  color: white;
  text-decoration: none;
  font-weight: 400;
  font-size: 16px;
  padding: 10px 0;
  text-align: center;
  transition: all 0.3s ease;
}

.btn-cadastrar-mobile {
  background: white;
  color: #1e40af;
  text-decoration: none;
  padding: 10px 0;
  border-radius: 15px;
  font-weight: 500;
  font-size: 16px;
  text-align: center;
  transition: all 0.3s ease;
}

.nav-mobile-user {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-name-mobile {
  color: white;
  font-weight: 500;
  font-size: 16px;
}

.btn-logout-mobile {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 10px 0;
  border-radius: 15px;
  cursor: pointer;
  font-weight: 400;
  font-size: 16px;
  transition: all 0.3s ease;
}

/* Responsive */
@media (max-width: 1024px) {
  .nav-links {
    display: none;
  }
  
  .auth-section {
    display: none;
  }
  
  .nav-toggle {
    display: flex;
  }
}

@media (max-width: 768px) {
  .glass-nav {
    padding: 0 16px;
  }
  
  .nav-container {
    padding: 10px 20px;
  }
  
  .brand-text {
    font-size: 15px;
  }
  
  .nav-mobile {
    left: 16px;
    right: 16px;
  }
}

/* Prevent body scroll when mobile menu is open */
:global(body.nav-mobile-open) {
  overflow: hidden;
}
</style>