<template>
  <section class="profissionais">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Nossos Profissionais</h2>
        <p class="section-description">Conheça alguns dos talentos que fazem parte da nossa plataforma</p>
      </div>

      <div class="carousel-container">
        <div class="carousel-track" ref="carouselTrack">
          <div class="professional-card" v-for="professional in professionals" :key="professional.id">
            <div class="professional-image">
              <PlaceholderImage :width="100" :height="100" :name="professional.name" class="professional-avatar" />
              <div class="professional-badge">
                <span class="rating">★ {{ professional.rating }}</span>
              </div>
            </div>
            <div class="professional-info">
              <h3 class="professional-name">{{ professional.name }}</h3>
              <p class="professional-category">{{ professional.category }}</p>
              <p class="professional-location">{{ professional.location }}</p>
              <div class="professional-stats">
                <span class="stat">{{ professional.jobs }} trabalhos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import PlaceholderImage from '@/components/global/PlaceholderImage.vue'

const carouselTrack = ref(null)
let animationId = null

const professionals = [
  {
    id: 1,
    name: 'Ana Silva',
    category: 'Limpeza Residencial',
    location: 'São Paulo, SP',
    rating: 4.9,
    jobs: 127
  },
  {
    id: 2,
    name: 'Carlos Santos',
    category: 'Eletricista',
    location: 'Rio de Janeiro, RJ',
    rating: 4.8,
    jobs: 89
  },
  {
    id: 3,
    name: 'Maria Oliveira',
    category: 'Designer Gráfico',
    location: 'Belo Horizonte, MG',
    rating: 5.0,
    jobs: 156
  },
  {
    id: 4,
    name: 'João Pereira',
    category: 'Encanador',
    location: 'Brasília, DF',
    rating: 4.7,
    jobs: 203
  },
  {
    id: 5,
    name: 'Fernanda Costa',
    category: 'Professora de Inglês',
    location: 'Porto Alegre, RS',
    rating: 4.9,
    jobs: 78
  },
  {
    id: 6,
    name: 'Roberto Lima',
    category: 'Fotógrafo',
    location: 'Salvador, BA',
    rating: 4.8,
    jobs: 92
  },
  {
    id: 7,
    name: 'Juliana Rocha',
    category: 'Cabeleireira',
    location: 'Fortaleza, CE',
    rating: 5.0,
    jobs: 134
  },
  {
    id: 8,
    name: 'Pedro Alves',
    category: 'Desenvolvedor Web',
    location: 'Recife, PE',
    rating: 4.9,
    jobs: 67
  }
]

const startCarousel = () => {
  if (!carouselTrack.value) return

  let scrollPosition = 0
  const scrollSpeed = 0.5
  const cardWidth = 280 // largura do card + gap
  const totalWidth = cardWidth * professionals.length

  const animate = () => {
    scrollPosition += scrollSpeed

    if (scrollPosition >= totalWidth) {
      scrollPosition = 0
    }

    carouselTrack.value.style.transform = `translateX(-${scrollPosition}px)`
    animationId = requestAnimationFrame(animate)
  }

  animate()
}

onMounted(() => {
  startCarousel()
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<style scoped>
.profissionais {
  padding: 6rem 0;
  background: var(--cor-gelo);
  overflow: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-family: var(--bold);
  font-size: var(--f6);
  color: var(--cor-preto);
  margin-bottom: 1rem;
}

.section-description {
  font-family: var(--regular);
  font-size: var(--f3);
  color: var(--cor-cinza);
  max-width: 600px;
  margin: 0 auto;
}

.carousel-container {
  overflow: hidden;
  width: 100%;
}

.carousel-track {
  display: flex;
  gap: 2rem;
  width: fit-content;
}

.professional-card {
  min-width: 260px;
  background: var(--cor-branco);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: transform 0.3s;
}

.professional-card:hover {
  transform: translateY(-5px);
}

.professional-image {
  position: relative;
  margin-bottom: 1rem;
}

.professional-avatar {
  border-radius: 50% !important;
  border: 3px solid var(--cor-azul-principal);
}

.professional-badge {
  position: absolute;
  top: -5px;
  right: 50%;
  transform: translateX(50%);
  background: var(--cor-azul-principal);
  color: var(--cor-branco);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: var(--f0);
  font-family: var(--bold);
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.professional-info {
  text-align: center;
}

.professional-name {
  font-family: var(--bold);
  font-size: var(--f3);
  color: var(--cor-preto);
  margin-bottom: 0.5rem;
}

.professional-category {
  font-family: var(--regular);
  font-size: var(--f2);
  color: var(--cor-azul-principal);
  margin-bottom: 0.25rem;
}

.professional-location {
  font-family: var(--regular);
  font-size: var(--f1);
  color: var(--cor-cinza);
  margin-bottom: 1rem;
}

.professional-stats {
  display: flex;
  justify-content: center;
}

.stat {
  background: var(--cor-gelo);
  color: var(--cor-cinza-escuro);
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-family: var(--regular);
  font-size: var(--f0);
}

/* Responsivo */
@media screen and (max-width: 768px) {
  .profissionais {
    padding: 4rem 0;
  }

  .container {
    padding: 0 1rem;
  }

  .professional-card {
    min-width: 220px;
  }
}
</style>
