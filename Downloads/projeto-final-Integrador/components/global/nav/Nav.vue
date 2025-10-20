<template>
  <nav class="navbar">
    <div class="container">
      <div class="nav-brand">
        <NuxtLink to="/">
          <img src="/logo.png" alt="Serviflix Logo" class="logo">
        </NuxtLink>
      </div>

      <div class="nav-menu">
        <NuxtLink to="/" class="nav-link">Início</NuxtLink>
        <NuxtLink to="/categorias" class="nav-link">Categorias</NuxtLink>
        <NuxtLink to="/como-funciona" class="nav-link">Como Funciona</NuxtLink>
        <NuxtLink to="/contato" class="nav-link">Contato</NuxtLink>
      </div>

      <div class="nav-actions">
        <AuthButton />
      </div>
    </div>
  </nav>
</template>

<script setup>
import AuthButton from '@/components/global/AuthButton.vue'
</script>

<style scoped>
.navbar {
  background: var(--cor-branco);
  padding: 1.2rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-brand .logo {
  height: 60px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.nav-brand .logo:hover {
  transform: scale(1.05);
}

.nav-menu {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: var(--cor-cinza-escuro);
  text-decoration: none;
  font-family: var(--regular);
  font-size: var(--f2);
  transition: color 0.3s;
}

.nav-link:hover {
  color: var(--cor-azul-principal);
}

.nav-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.btn-secondary {
  background: transparent;
  color: var(--cor-cinza-escuro);
  border: 1px solid var(--cor-cinza-2);
  padding: 0.5rem 1.5rem;
  border-radius: 6px;
  font-family: var(--regular);
  cursor: pointer;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background: var(--cor-gelo);
}

.btn-primary {
  background: var(--cor-azul-principal);
  color: var(--cor-branco);
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 6px;
  font-family: var(--regular);
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover {
  background: var(--cor-azul-royal);
}

/* Responsivo */
@media screen and (max-width: 768px) {
  .nav-menu {
    display: none;
  }

  .container {
    padding: 0 1rem;
  }
}
</style>
