<template>
  <div class="how-it-works-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container-custom">
        <div class="hero-content">
          <h1>Como Funciona o ServiFlix</h1>
          <p>Conectamos você aos melhores profissionais de forma simples e segura</p>
        </div>
      </div>
    </section>

    <!-- Steps Section -->
    <section class="steps-section">
      <div class="container-custom">
        <h2 class="section-title">Em 3 passos simples</h2>
        
        <div class="steps-grid">
          <div class="step-card">
            <div class="step-number">1</div>
            <div class="step-icon">🔍</div>
            <h3>Encontre o Profissional</h3>
            <p>Navegue pelas categorias ou use nossa busca para encontrar o serviço que precisa. Compare perfis, avaliações e preços.</p>
          </div>
          
          <div class="step-card">
            <div class="step-number">2</div>
            <div class="step-icon">💬</div>
            <h3>Entre em Contato</h3>
            <p>Converse diretamente com o profissional, tire suas dúvidas e negocie os detalhes do serviço.</p>
          </div>
          
          <div class="step-card">
            <div class="step-number">3</div>
            <div class="step-icon">✅</div>
            <h3>Contrate com Segurança</h3>
            <p>Finalize a contratação com nossa garantia. Pague apenas quando o serviço for concluído com qualidade.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="container-custom">
        <h2 class="section-title">Por que escolher o ServiFlix?</h2>
        
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🛡️</div>
            <h3>Profissionais Verificados</h3>
            <p>Todos os profissionais passam por verificação de identidade e qualificação antes de se cadastrar.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">⭐</div>
            <h3>Avaliações Reais</h3>
            <p>Sistema transparente de avaliações com comentários de clientes reais para ajudar na sua escolha.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">💰</div>
            <h3>Preços Justos</h3>
            <p>Compare propostas de diferentes profissionais e escolha a melhor opção para seu orçamento.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">🔒</div>
            <h3>Pagamento Seguro</h3>
            <p>Seus dados estão protegidos e você só paga quando o serviço for concluído satisfatoriamente.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">📞</div>
            <h3>Suporte 24/7</h3>
            <p>Nossa equipe está sempre disponível para ajudar com qualquer dúvida ou problema.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">📱</div>
            <h3>App Mobile</h3>
            <p>Acesse todos os serviços pelo nosso aplicativo disponível para iOS e Android.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq-section">
      <div class="container-custom">
        <h2 class="section-title">Perguntas Frequentes</h2>
        
        <div class="faq-list">
          <div v-for="(faq, index) in faqs" :key="index" class="faq-item">
            <button 
              @click="toggleFaq(index)" 
              class="faq-question"
              :class="{ active: activeFaq === index }"
            >
              {{ faq.question }}
              <svg class="faq-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
              </svg>
            </button>
            <div v-show="activeFaq === index" class="faq-answer">
              <p>{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container-custom">
        <div class="cta-content">
          <h2>Pronto para começar?</h2>
          <p>Encontre o profissional ideal para suas necessidades</p>
          <div class="cta-buttons">
            <NuxtLink to="/categorias" class="btn-primary">Explorar Serviços</NuxtLink>
            <NuxtLink to="/cadastrar" class="btn-secondary">Cadastrar-se</NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
useHead({
  title: 'Como Funciona - ServiFlix',
  meta: [
    { name: 'description', content: 'Saiba como funciona o ServiFlix e como encontrar os melhores profissionais' }
  ]
})

const activeFaq = ref(null)

const faqs = ref([
  {
    question: 'Como posso ter certeza da qualidade dos profissionais?',
    answer: 'Todos os profissionais passam por verificação de identidade e qualificação. Além disso, temos um sistema de avaliações transparente onde você pode ver comentários de outros clientes.'
  },
  {
    question: 'Como funciona o pagamento?',
    answer: 'O pagamento é feito diretamente entre você e o profissional. Recomendamos que seja feito apenas após a conclusão satisfatória do serviço.'
  },
  {
    question: 'E se eu não ficar satisfeito com o serviço?',
    answer: 'Temos uma equipe de suporte dedicada para resolver qualquer problema. Entre em contato conosco e trabalharemos para encontrar uma solução.'
  },
  {
    question: 'Posso cancelar um serviço agendado?',
    answer: 'Sim, você pode cancelar um serviço. Recomendamos entrar em contato com o profissional com antecedência para evitar transtornos.'
  },
  {
    question: 'Como faço para me tornar um profissional na plataforma?',
    answer: 'É simples! Clique em "Cadastrar-se" e escolha a opção "Sou Profissional". Preencha seus dados e aguarde a verificação.'
  }
])

const toggleFaq = (index) => {
  activeFaq.value = activeFaq.value === index ? null : index
}
</script>

<style scoped>
.how-it-works-page {
  min-height: 100vh;
}

.hero-section {
  background: var(--gradient-primary);
  color: white;
  padding: var(--space-6xl) 0;
  text-align: center;
}

.hero-content h1 {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  margin-bottom: var(--space-xl);
}

.hero-content p {
  font-size: 1.2rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

.steps-section {
  padding: var(--space-6xl) 0;
  background: var(--bg-primary);
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: var(--space-4xl);
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-3xl);
  max-width: 1200px;
  margin: 0 auto;
}

.step-card {
  text-align: center;
  position: relative;
  padding: var(--space-2xl);
}

.step-number {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 60px;
  background: var(--gradient-primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 800;
  box-shadow: var(--shadow-lg);
}

.step-icon {
  font-size: 4rem;
  margin: var(--space-2xl) 0 var(--space-xl);
}

.step-card h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-lg);
}

.step-card p {
  color: var(--text-secondary);
  line-height: 1.6;
}

.features-section {
  padding: var(--space-6xl) 0;
  background: var(--bg-secondary);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-2xl);
}

.feature-card {
  background: var(--bg-primary);
  padding: var(--space-2xl);
  border-radius: var(--radius-xl);
  text-align: center;
  border: 1px solid var(--border-primary);
  transition: all var(--transition-base);
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: var(--space-xl);
}

.feature-card h3 {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-lg);
}

.feature-card p {
  color: var(--text-secondary);
  line-height: 1.6;
}

.faq-section {
  padding: var(--space-6xl) 0;
  background: var(--bg-primary);
}

.faq-list {
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  border-bottom: 1px solid var(--border-primary);
}

.faq-question {
  width: 100%;
  padding: var(--space-xl) 0;
  background: none;
  border: none;
  text-align: left;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all var(--transition-base);
}

.faq-question:hover {
  color: var(--color-primary);
}

.faq-icon {
  width: 24px;
  height: 24px;
  transition: transform var(--transition-base);
}

.faq-question.active .faq-icon {
  transform: rotate(180deg);
}

.faq-answer {
  padding-bottom: var(--space-xl);
}

.faq-answer p {
  color: var(--text-secondary);
  line-height: 1.6;
}

.cta-section {
  background: var(--gradient-primary);
  color: white;
  padding: var(--space-6xl) 0;
  text-align: center;
}

.cta-content h2 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: var(--space-lg);
}

.cta-content p {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: var(--space-3xl);
}

.cta-buttons {
  display: flex;
  gap: var(--space-lg);
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary, .btn-secondary {
  padding: var(--space-lg) var(--space-2xl);
  border-radius: var(--radius-lg);
  font-weight: 600;
  text-decoration: none;
  transition: all var(--transition-base);
  min-width: 180px;
}

.btn-primary {
  background: white;
  color: var(--color-primary);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
}

.btn-secondary {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.btn-secondary:hover {
  background: white;
  color: var(--color-primary);
}

@media (max-width: 768px) {
  .steps-grid {
    grid-template-columns: 1fr;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
}
</style>