<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
// Initialize auth when app starts
const { initAuth } = useAuth()

onMounted(() => {
  initAuth()
})
</script>