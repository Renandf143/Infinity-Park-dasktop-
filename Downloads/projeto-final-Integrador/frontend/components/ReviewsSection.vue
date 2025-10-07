<template>
  <section class="reviews-section">
    <div class="container">
      <div class="section-header">
        <h2>Avaliações dos nossos clientes</h2>
        <p>Veja o que nossos clientes dizem sobre a ServiFlix</p>
      </div>
      
      <div class="reviews-grid">
        <div class="review-card" v-for="review in reviews" :key="review.id">
          <div class="review-header">
            <div class="reviewer-info">
              <div class="reviewer-avatar">
                {{ review.name.charAt(0) }}
              </div>
              <div class="reviewer-details">
                <h4>{{ review.name }}</h4>
                <p>{{ review.service }}</p>
              </div>
            </div>
            <div class="review-rating">
              <span class="stars">★★★★★</span>
              <span class="rating-number">{{ review.rating }}</span>
            </div>
          </div>
          <p class="review-text">"{{ review.text }}"</p>
          <div class="review-date">{{ review.date }}</div>
        </div>
      </div>
      
      <div class="reviews-cta">
        <p>Mais de 10.000 avaliações positivas</p>
        <button class="btn-reviews">Ver todas as avaliações</button>
      </div>
    </div>
  </section>
</template>

<script setup>
const reviews = [
  {
    id: 1,
    name: 'Maria Silva',
    service: 'Limpeza Residencial',
    rating: '5.0',
    text: 'Excelente serviço! A diarista foi muito profissional e deixou minha casa impecável.',
    date: 'Há 2 dias'
  },
  {
    id: 2,
    name: 'João Santos',
    service: 'Instalação Elétrica',
    rating: '5.0',
    text: 'Eletricista chegou no horário, muito competente e resolveu o problema rapidamente.',
    date: 'Há 1 semana'
  },
  {
    id: 3,
    name: 'Ana Costa',
    service: 'Pintura',
    rating: '4.9',
    text: 'Trabalho de pintura ficou perfeito. Recomendo a plataforma para todos!',
    date: 'Há 3 dias'
  },
  {
    id: 4,
    name: 'Carlos Oliveira',
    service: 'Encanamento',
    rating: '5.0',
    text: 'Problema resolvido rapidamente. Profissional muito educado e competente.',
    date: 'Há 5 dias'
  },
  {
    id: 5,
    name: 'Fernanda Lima',
    service: 'Jardinagem',
    rating: '4.8',
    text: 'Meu jardim ficou lindo! Serviço de qualidade e preço justo.',
    date: 'Há 1 semana'
  },
  {
    id: 6,
    name: 'Roberto Mendes',
    service: 'Montagem de Móveis',
    rating: '5.0',
    text: 'Montagem perfeita e rápida. Super recomendo a ServiFlix!',
    date: 'Há 4 dias'
  }
]
</script>

<style scoped>
.reviews-section {
  padding: 80px 0;
  background: #f8fafc;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-header {
  text-align: center;
  margin-bottom: 64px;
}

.section-header h2 {
  font-size: 36px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 16px;
}

.section-header p {
  font-size: 18px;
  color: #6b7280;
}

.reviews-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  margin-bottom: 48px;
}

.review-card {
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.review-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.reviewer-info {
  display: flex;
  gap: 12px;
}

.reviewer-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #9333ea);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
  color: white;
}

.reviewer-details h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.reviewer-details p {
  font-size: 14px;
  color: #6b7280;
}

.review-rating {
  text-align: right;
}

.stars {
  color: #fbbf24;
  font-size: 16px;
  margin-right: 4px;
}

.rating-number {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.review-text {
  font-size: 16px;
  line-height: 1.6;
  color: #374151;
  margin-bottom: 16px;
  font-style: italic;
}

.review-date {
  font-size: 12px;
  color: #9ca3af;
}

.reviews-cta {
  text-align: center;
  padding: 32px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.reviews-cta p {
  font-size: 18px;
  color: #6b7280;
  margin-bottom: 16px;
}

.btn-reviews {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-reviews:hover {
  background: #2563eb;
  transform: translateY(-1px);
}
</style>