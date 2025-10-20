<template>
  <section class="servicos">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Serviços Mais Bem Avaliados</h2>
        <p class="section-description">
          Descubra os profissionais com as melhores avaliações da nossa plataforma
        </p>
      </div>

      <div class="services-grid">
        <div
          class="service-card"
          v-for="service in topServices"
          :key="service.id"
        >
          <div class="service-image">
            <PlaceholderImage
              :width="350"
              :height="200"
              :name="service.title"
              class="service-placeholder"
            />
            <div class="service-badge">
              <span class="rating">★ {{ service.rating }}</span>
            </div>
          </div>

          <div class="service-content">
            <div class="service-header">
              <h3 class="service-title">{{ service.title }}</h3>
              <p class="service-provider">por {{ service.provider }}</p>
            </div>

            <p class="service-description">{{ service.description }}</p>

            <div class="service-details">
              <div class="service-stats">
                <span class="stat-item">
                  <Icones nome="mais" />
                  {{ service.completedJobs }} trabalhos
                </span>
                <span class="stat-item">
                  <Icones nome="seta" />
                  {{ service.responseTime }}
                </span>
              </div>

              <div class="service-price">
                <span class="price">A partir de R$ {{ service.price }}</span>
              </div>
            </div>

            <button class="btn-solicitar" @click="solicitarServico(service)">
              Solicitar Serviço
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import Icones from '@/components/global/icones/Icones.vue'
import PlaceholderImage from '@/components/global/PlaceholderImage.vue'

const topServices = [
  {
    id: 1,
    title: 'Instalação Elétrica Completa',
    provider: 'Carlos Santos',
    description: 'Instalação e manutenção elétrica residencial e comercial com garantia de 1 ano.',
    rating: 4.9,
    completedJobs: 89,
    responseTime: '2h resposta',
    price: '150,00'
  },
  {
    id: 2,
    title: 'Limpeza Pós-Obra',
    provider: 'Ana Silva',
    description: 'Limpeza completa após reformas e construções, incluindo vidros e pisos.',
    rating: 5.0,
    completedJobs: 127,
    responseTime: '1h resposta',
    price: '200,00'
  },
  {
    id: 3,
    title: 'Desenvolvimento de Site',
    provider: 'Pedro Alves',
    description: 'Criação de sites responsivos e modernos com foco na experiência do usuário.',
    rating: 4.8,
    completedJobs: 67,
    responseTime: '4h resposta',
    price: '800,00'
  },
  {
    id: 4,
    title: 'Corte e Escova Profissional',
    provider: 'Juliana Rocha',
    description: 'Serviços completos de cabelo com produtos de alta qualidade e técnicas modernas.',
    rating: 5.0,
    completedJobs: 134,
    responseTime: '30min resposta',
    price: '80,00'
  },
  {
    id: 5,
    title: 'Aulas de Inglês Online',
    provider: 'Fernanda Costa',
    description: 'Aulas particulares de inglês com metodologia personalizada para cada aluno.',
    rating: 4.9,
    completedJobs: 78,
    responseTime: '1h resposta',
    price: '60,00'
  },
  {
    id: 6,
    title: 'Ensaio Fotográfico',
    provider: 'Roberto Lima',
    description: 'Sessões fotográficas profissionais para eventos, retratos e produtos.',
    rating: 4.8,
    completedJobs: 92,
    responseTime: '2h resposta',
    price: '300,00'
  }
]

const solicitarServico = (service) => {
  // Por enquanto, apenas simulação - implementação futura com backend
  console.log('Solicitando serviço:', service.title)

  // Simular ação de solicitação
  alert(`Serviço "${service.title}" solicitado com sucesso!

Prestador: ${service.provider}
Preço: R$ ${service.price}

Em breve implementaremos o sistema completo de pedidos.`)

  // Futura implementação:
  // - Verificar se usuário está logado
  // - Abrir modal de solicitação
  // - Enviar dados para API
  // - Mostrar confirmação
}
</script>

<style scoped>
.servicos {
  padding: 6rem 0;
  background: var(--cor-branco);
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

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.service-card {
  background: var(--cor-branco);
  border: 1px solid var(--cor-cinza-3);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(37, 99, 235, 0.15);
}

.service-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.service-placeholder {
  width: 100% !important;
  height: 100% !important;
  border-radius: 0 !important;
  transition: transform 0.3s;
}

.service-card:hover .service-placeholder {
  transform: scale(1.05);
}

.service-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--cor-azul-principal);
  color: var(--cor-branco);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: var(--f1);
  font-family: var(--bold);
}

.service-content {
  padding: 1.5rem;
}

.service-header {
  margin-bottom: 1rem;
}

.service-title {
  font-family: var(--bold);
  font-size: var(--f4);
  color: var(--cor-preto);
  margin-bottom: 0.25rem;
}

.service-provider {
  font-family: var(--regular);
  font-size: var(--f2);
  color: var(--cor-azul-principal);
}

.service-description {
  font-family: var(--regular);
  font-size: var(--f2);
  color: var(--cor-cinza);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.service-details {
  margin-bottom: 1.5rem;
}

.service-stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--regular);
  font-size: var(--f1);
  color: var(--cor-cinza);
}

.stat-item svg {
  width: 16px;
  height: 16px;
  fill: var(--cor-azul-principal);
}

.service-price {
  text-align: right;
}

.price {
  font-family: var(--bold);
  font-size: var(--f3);
  color: var(--cor-azul-principal);
}

.btn-solicitar {
  width: 100%;
  background: var(--cor-azul-principal);
  color: var(--cor-branco);
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-family: var(--regular);
  font-size: var(--f2);
  cursor: pointer;
  transition: all 0.3s;
}

.btn-solicitar:hover {
  background: var(--cor-azul-royal);
  transform: translateY(-2px);
}

/* Responsivo */
@media screen and (max-width: 768px) {
  .servicos {
    padding: 4rem 0;
  }

  .container {
    padding: 0 1rem;
  }

  .services-grid {
    grid-template-columns: 1fr;
  }

  .service-stats {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
