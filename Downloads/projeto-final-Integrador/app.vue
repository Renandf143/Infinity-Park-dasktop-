<template>
  <NuxtLayout>
    <Whatsapp />
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import Whatsapp from '@/components/global/whatsapp/Whatsapp.vue'

const router = useRouter()

useSeoMeta({
  // Default
  charset: 'utf-8',
  xUaCompatible: 'IE=edge',
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',

  // Title and Description
  title: 'Serviflix - Conecte Talentos a Oportunidades Reais',
  ogTitle: 'Serviflix - Plataforma de Serviços Autônomos',
  description: 'Plataforma inovadora que conecta profissionais autônomos a clientes. Encontre ou ofereça serviços de reparos, limpeza, tecnologia, beleza e muito mais.',
  ogDescription: 'Conecte talentos a oportunidades reais. A plataforma que facilita a vida de profissionais autônomos e clientes.',
  robots: 'index, follow',
  googlebot: 'max-image-preview',
  author: 'Serviflix',

  // Theme
  themeColor: '#ffffff',
  msapplicationTileColor: '#ffffff',
  appleMobileWebAppStatusBarStyle: 'default',

  // Site URL
  ogType: 'website',
  ogImageType: 'image/jpeg',
  ogImage: '',
  ogUrl: 'https://serviflix.com.br',
  ogSiteName: 'Serviflix',
  ogLocale: 'pt_BR',
  applicationName: 'Serviflix',
  appleMobileWebAppTitle: 'Serviflix'
})

watch(router.afterEach, () => {
  window.scrollTo(0, 0) // Rola o scroll para o topo ao navegar
})
</script>
