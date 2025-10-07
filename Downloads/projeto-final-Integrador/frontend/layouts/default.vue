<template>
  <div class="app-layout">
    <Header />
    <main class="main-content">
      <NuxtPage />
    </main>
    <Footer />
  </div>
</template>

<script setup>
// Layout padrão do site com transições profissionais
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  position: relative;
  padding-top: 70px;
}

/* Remove padding-top na página inicial para a imagem ficar por baixo do header */
.main-content:has(.home-page) {
  padding-top: 0;
}

/* Transições de página */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>