<template>
  <div class="provider-profile-page">
    <!-- Header do Perfil -->
    <section class="profile-header">
      <div class="container-custom">
        <div class="profile-hero">
          <div class="profile-avatar-section">
            <img :src="provider.avatar" :alt="provider.name" class="profile-avatar">
            <div class="profile-badge" v-if="provider.verified">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M23,12L20.56,9.22L20.9,5.54L17.29,4.72L15.4,1.54L12,3L8.6,1.54L6.71,4.72L3.1,5.53L3.44,9.21L1,12L3.44,14.78L3.1,18.47L6.71,19.29L8.6,22.47L12,21L15.4,22.46L17.29,19.28L20.9,18.46L20.56,14.78L23,12M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z"/>
              </svg>
              Verificado
            </div>
          </div>
          
          <div class="profile-info">
            <h1>{{ provider.name }}</h1>
            <p class="profile-title">{{ provider.title }}</p>
            
            <div class="profile-stats">
              <div class="stat-item">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"/>
                </svg>
                <span><strong>{{ provider.rating }}</strong> ({{ provider.reviews }} avaliações)</span>
              </div>
              <div class="stat-item">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/>
                </svg>
                <span><strong>{{ provider.completedJobs }}</strong> trabalhos concluídos</span>
              </div>
              <div class="stat-item">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z"/>
                </svg>
                <span>Responde em <strong>{{ provider.responseTime }}</strong></span>
              </div>
              <div class="stat-item">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"/>
                </svg>
                <span>{{ provider.location }}</span>
              </div>
            </div>

            <div class="profile-actions">
              <button class="btn-contact-primary">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M6,9H18V11H6M14,14H6V12H14M18,8H6V6H18"/>
                </svg>
                Enviar mensagem
              </button>
              <button class="btn-share">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18,16.08C17.24,16.08 16.56,16.38 16.04,16.85L8.91,12.7C8.96,12.47 9,12.24 9,12C9,11.76 8.96,11.53 8.91,11.3L15.96,7.19C16.5,7.69 17.21,8 18,8A3,3 0 0,0 21,5A3,3 0 0,0 18,2A3,3 0 0,0 15,5C15,5.24 15.04,5.47 15.09,5.7L8.04,9.81C7.5,9.31 6.79,9 6,9A3,3 0 0,0 3,12A3,3 0 0,0 6,15C6.79,15 7.5,14.69 8.04,14.19L15.16,18.34C15.11,18.55 15.08,18.77 15.08,19C15.08,20.61 16.39,21.91 18,21.91C19.61,21.91 20.92,20.61 20.92,19A2.92,2.92 0 0,0 18,16.08Z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Conteúdo do Perfil -->
    <section class="profile-content">
      <div class="container-custom">
        <div class="profile-layout">
          <!-- Coluna Principal -->
          <div class="main-content">
            <!-- Sobre -->
            <div class="content-card">
              <h2>Sobre</h2>
              <p>{{ provider.bio }}</p>
            </div>

            <!-- Especialidades -->
            <div class="content-card">
              <h2>Especialidades</h2>
              <div class="tags-list">
                <span v-for="skill in provider.skills" :key="skill" class="tag">
                  {{ skill }}
                </span>
              </div>
            </div>

            <!-- Serviços Oferecidos -->
            <div class="content-card">
              <h2>Serviços Oferecidos ({{ provider.services.length }})</h2>
              <div class="services-grid">
                <div v-for="service in provider.services" :key="service.id" class="service-card-mini">
                  <img :src="service.image" :alt="service.title">
                  <div class="service-info-mini">
                    <h3>{{ service.title }}</h3>
                    <p>{{ service.description }}</p>
                    <div class="service-footer-mini">
                      <span class="price">R$ {{ service.price }}</span>
                      <NuxtLink :to="`/servicos/${service.id}`" class="btn-view-mini">
                        Ver detalhes
                      </NuxtLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Portfólio -->
            <div class="content-card">
              <h2>Portfólio</h2>
              <div class="portfolio-grid">
                <div v-for="(item, index) in provider.portfolio" :key="index" class="portfolio-item">
                  <img :src="item.image" :alt="item.title">
                  <div class="portfolio-overlay">
                    <h4>{{ item.title }}</h4>
                  </div>
                </div>
              </div>
            </div>

            <!-- Avaliações -->
            <div class="content-card">
              <h2>Avaliações ({{ provider.reviews }})</h2>
              
              <div class="reviews-summary-mini">
                <div class="rating-big">
                  <div class="rating-number">{{ provider.rating }}</div>
                  <div class="rating-stars">{{ '⭐'.repeat(Math.floor(provider.rating)) }}</div>
                </div>
                <div class="rating-distribution">
                  <div v-for="star in [5,4,3,2,1]" :key="star" class="rating-row">
                    <span>{{ star }}⭐</span>
                    <div class="bar">
                      <div class="bar-fill" :style="{ width: getRandomPercentage() + '%' }"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="reviews-list">
                <div v-for="review in provider.reviewsList" :key="review.id" class="review-card">
                  <div class="review-header">
                    <img :src="review.user.avatar" :alt="review.user.name">
                    <div>
                      <h4>{{ review.user.name }}</h4>
                      <div class="review-meta">
                        <span class="stars">{{ '⭐'.repeat(review.rating) }}</span>
                        <span class="date">{{ review.date }}</span>
                      </div>
                    </div>
                  </div>
                  <p>{{ review.comment }}</p>
                  <div v-if="review.service" class="review-service">
                    Serviço: <strong>{{ review.service }}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <aside class="sidebar-content">
            <!-- Card de Contato -->
            <div class="sidebar-card">
              <h3>Entre em contato</h3>
              <form class="contact-form" @submit.prevent="handleContact">
                <div class="form-group">
                  <label>Seu nome</label>
                  <input type="text" v-model="contactForm.name" required>
                </div>
                <div class="form-group">
                  <label>Seu e-mail</label>
                  <input type="email" v-model="contactForm.email" required>
                </div>
                <div class="form-group">
                  <label>Mensagem</label>
                  <textarea v-model="contactForm.message" rows="4" required></textarea>
                </div>
                <button type="submit" class="btn-submit">Enviar mensagem</button>
              </form>
            </div>

            <!-- Disponibilidade -->
            <div class="sidebar-card">
              <h3>Disponibilidade</h3>
              <div class="availability-list">
                <div v-for="day in provider.availability" :key="day.day" class="availability-item">
                  <span class="day">{{ day.day }}</span>
                  <span class="hours">{{ day.hours }}</span>
                </div>
              </div>
            </div>

            <!-- Certificações -->
            <div class="sidebar-card" v-if="provider.certifications.length > 0">
              <h3>Certificações</h3>
              <div class="certifications-list">
                <div v-for="cert in provider.certifications" :key="cert" class="cert-item">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/>
                  </svg>
                  <span>{{ cert }}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const route = useRoute()
const providerId = route.params.id

const contactForm = ref({
  name: '',
  email: '',
  message: ''
})

const provider = ref({
  id: providerId,
  name: 'Maria Silva Profissional',
  title: 'Especialista em Limpeza Residencial',
  avatar: '/placeholder-avatar.jpg',
  verified: true,
  rating: 4.9,
  reviews: 234,
  completedJobs: 156,
  responseTime: '2 horas',
  location: 'São Paulo, SP',
  bio: 'Profissional com mais de 10 anos de experiência em limpeza residencial e comercial. Comprometida com a qualidade e satisfação dos clientes. Utilizo produtos de alta qualidade e técnicas modernas para garantir os melhores resultados.',
  skills: ['Limpeza Residencial', 'Limpeza Pós-Obra', 'Limpeza de Estofados', 'Organização', 'Higienização'],
  services: [
    {
      id: 1,
      title: 'Limpeza Residencial Completa',
      description: 'Limpeza profunda de todos os cômodos',
      price: 120,
      image: '/placeholder.jpg'
    }
  ],
  portfolio: [
    { title: 'Projeto 1', image: '/placeholder.jpg' },
    { title: 'Projeto 2', image: '/placeholder.jpg' },
    { title: 'Projeto 3', image: '/placeholder.jpg' }
  ],
  reviewsList: [
    {
      id: 1,
      user: { name: 'Ana Costa', avatar: '/placeholder-avatar.jpg' },
      rating: 5,
      date: '15/09/2024',
      comment: 'Excelente profissional! Muito atenciosa e caprichosa.',
      service: 'Limpeza Residencial'
    }
  ],
  availability: [
    { day: 'Segunda', hours: '8h - 18h' },
    { day: 'Terça', hours: '8h - 18h' },
    { day: 'Quarta', hours: '8h - 18h' },
    { day: 'Quinta', hours: '8h - 18h' },
    { day: 'Sexta', hours: '8h - 18h' },
    { day: 'Sábado', hours: '9h - 14h' }
  ],
  certifications: [
    'Certificado em Limpeza Profissional',
    'Treinamento em Produtos Químicos',
    'Curso de Organização Residencial'
  ]
})

function getRandomPercentage() {
  return Math.random() * 100
}

function handleContact() {
  console.log('Contact form:', contactForm.value)
  alert('Mensagem enviada com sucesso!')
  contactForm.value = { name: '', email: '', message: '' }
}

useHead({
  title: `${provider.value.name} - ServiFlix`,
  meta: [
    { name: 'description', content: provider.value.bio }
  ]
})
</script>

<style scoped>
.provider-profile-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.profile-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60px 0 40px;
  color: white;
}

.profile-hero {
  display: flex;
  gap: 40px;
  align-items: flex-start;
}

.profile-avatar-section {
  position: relative;
}

.profile-avatar {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  border: 6px solid white;
  object-fit: cover;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
}

.profile-badge {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: #4caf50;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.profile-badge svg {
  width: 16px;
  height: 16px;
}

.profile-info {
  flex: 1;
}

.profile-info h1 {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 8px;
}

.profile-title {
  font-size: 18px;
  opacity: 0.9;
  margin-bottom: 24px;
}

.profile-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.stat-item svg {
  width: 20px;
  height: 20px;
}

.profile-actions {
  display: flex;
  gap: 12px;
}

.btn-contact-primary {
  padding: 14px 32px;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.3s;
}

.btn-contact-primary:hover {
  transform: scale(1.05);
}

.btn-contact-primary svg {
  width: 20px;
  height: 20px;
}

.btn-share {
  padding: 14px;
  background: rgba(255,255,255,0.2);
  color: white;
  border: 2px solid white;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-share:hover {
  background: rgba(255,255,255,0.3);
}

.btn-share svg {
  width: 20px;
  height: 20px;
}

.profile-content {
  padding: 40px 0;
}

.profile-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 32px;
}

.content-card {
  background: white;
  border-radius: 12px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.content-card h2 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

.content-card p {
  color: #666;
  line-height: 1.8;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.tag {
  background: #e8eaf6;
  color: #667eea;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.service-card-mini {
  border: 2px solid #f0f0f0;
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 0.3s;
}

.service-card-mini:hover {
  border-color: #667eea;
}

.service-card-mini img {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.service-info-mini {
  padding: 16px;
}

.service-info-mini h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.service-info-mini p {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
}

.service-footer-mini {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-size: 20px;
  font-weight: 700;
  color: #667eea;
}

.btn-view-mini {
  padding: 8px 16px;
  background: #667eea;
  color: white;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.3s;
}

.btn-view-mini:hover {
  background: #5568d3;
}

.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.portfolio-item {
  position: relative;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
}

.portfolio-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.portfolio-item:hover img {
  transform: scale(1.1);
}

.portfolio-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  padding: 20px;
  color: white;
}

.portfolio-overlay h4 {
  font-size: 16px;
  font-weight: 600;
}

.reviews-summary-mini {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 32px;
  margin-bottom: 32px;
  padding-bottom: 32px;
  border-bottom: 1px solid #f0f0f0;
}

.rating-big {
  text-align: center;
}

.rating-number {
  font-size: 48px;
  font-weight: 700;
  color: #333;
}

.rating-stars {
  font-size: 24px;
  margin-top: 8px;
}

.rating-distribution {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rating-row {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
}

.rating-row span {
  width: 50px;
}

.bar {
  flex: 1;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: #ffc107;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.review-card {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.review-header {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.review-header img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.review-header h4 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.review-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
}

.stars {
  color: #ffc107;
}

.date {
  color: #999;
}

.review-card p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 8px;
}

.review-service {
  font-size: 14px;
  color: #999;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sidebar-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  position: sticky;
  top: 20px;
}

.sidebar-card h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

.contact-form .form-group {
  margin-bottom: 16px;
}

.contact-form label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.contact-form input,
.contact-form textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
}

.contact-form input:focus,
.contact-form textarea:focus {
  outline: none;
  border-color: #667eea;
}

.btn-submit {
  width: 100%;
  padding: 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-submit:hover {
  background: #5568d3;
}

.availability-list,
.certifications-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.availability-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
}

.day {
  font-weight: 600;
  color: #333;
}

.hours {
  color: #666;
}

.cert-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.cert-item svg {
  width: 16px;
  height: 16px;
  color: #4caf50;
}

@media (max-width: 1024px) {
  .profile-layout {
    grid-template-columns: 1fr;
  }

  .profile-hero {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .profile-stats {
    grid-template-columns: 1fr;
  }

  .profile-actions {
    justify-content: center;
  }
}
</style>
