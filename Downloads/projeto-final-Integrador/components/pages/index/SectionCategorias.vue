<template>
  <section class="categorias">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Categorias de Serviços</h2>
        <p class="section-description">
          Encontre profissionais qualificados em diversas áreas para atender suas necessidades
        </p>
      </div>

      <div class="categories-grid">
        <div class="category-card" v-for="category in categories" :key="category.id">
          <div class="category-icon">
            <Icones :nome="category.icon" />
          </div>
          <h3 class="category-title">{{ category.title }}</h3>
          <p class="category-description">{{ category.description }}</p>
          <div class="category-stats">
            <span class="stat">{{ category.items }} items</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import Icones from '@/components/global/icones/Icones.vue'

const categories = [
  {
    id: 1,
    title: 'Reparos e Manutenção',
    description: 'Eletricistas, encanadores, marceneiros e técnicos especializados',
    items: '250+',
    icon: 'reparos'
  },
  {
    id: 2,
    title: 'Limpeza e Organização',
    description: 'Serviços de limpeza residencial, comercial e organização de ambientes',
    items: '180+',
    icon: 'limpeza'
  },
  {
    id: 3,
    title: 'Tecnologia',
    description: 'Desenvolvedores, designers, suporte técnico e consultoria em TI',
    items: '320+',
    icon: 'tecnologia'
  },
  {
    id: 4,
    title: 'Beleza e Bem-estar',
    description: 'Cabeleireiros, esteticistas, massoterapeutas e personal trainers',
    items: '150+',
    icon: 'beleza'
  },
  {
    id: 5,
    title: 'Educação e Ensino',
    description: 'Professores particulares, tutores e instrutores especializados',
    items: '200+',
    icon: 'educacao'
  },
  {
    id: 6,
    title: 'Eventos e Entretenimento',
    description: 'Fotógrafos, DJs, decoradores e organizadores de eventos',
    items: '120+',
    icon: 'eventos'
  }
]
</script>

<style scoped>
.categorias {
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

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.category-card {
  background: var(--cor-branco);
  border: 1px solid var(--cor-cinza-3);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s;
  cursor: pointer;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(37, 99, 235, 0.1);
  border-color: var(--cor-azul-principal);
}

.category-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, var(--cor-azul-principal), var(--cor-azul-royal));
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.category-icon svg {
  width: 30px;
  height: 30px;
  fill: var(--cor-branco);
}

.category-title {
  font-family: var(--bold);
  font-size: var(--f4);
  color: var(--cor-preto);
  margin-bottom: 1rem;
}

.category-description {
  font-family: var(--regular);
  font-size: var(--f2);
  color: var(--cor-cinza);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.category-stats {
  display: flex;
  justify-content: center;
}

.stat {
  background: var(--cor-gelo);
  color: var(--cor-azul-principal);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-family: var(--regular);
  font-size: var(--f1);
  font-weight: 500;
}

/* Responsivo */
@media screen and (max-width: 768px) {
  .categorias {
    padding: 4rem 0;
  }

  .container {
    padding: 0 1rem;
  }

  .categories-grid {
    grid-template-columns: 1fr;
  }
}
</style>
