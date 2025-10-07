<template>
  <div class="contact-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container-custom">
        <div class="hero-content">
          <h1>Entre em Contato</h1>
          <p>Estamos aqui para ajudar você. Entre em contato conosco!</p>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="contact-section">
      <div class="container-custom">
        <div class="contact-grid">
          <!-- Contact Form -->
          <div class="contact-form-container">
            <h2>Envie sua Mensagem</h2>
            <form @submit.prevent="handleSubmit" class="contact-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="name">Nome</label>
                  <input 
                    id="name"
                    v-model="form.name" 
                    type="text" 
                    required 
                    class="form-input"
                    placeholder="Seu nome completo"
                  >
                </div>
                <div class="form-group">
                  <label for="email">E-mail</label>
                  <input 
                    id="email"
                    v-model="form.email" 
                    type="email" 
                    required 
                    class="form-input"
                    placeholder="seu@email.com"
                  >
                </div>
              </div>

              <div class="form-group">
                <label for="phone">Telefone</label>
                <input 
                  id="phone"
                  v-model="form.phone" 
                  type="tel" 
                  class="form-input"
                  placeholder="(11) 99999-9999"
                >
              </div>

              <div class="form-group">
                <label for="subject">Assunto</label>
                <select id="subject" v-model="form.subject" required class="form-input">
                  <option value="">Selecione um assunto</option>
                  <option value="duvida">Dúvida Geral</option>
                  <option value="suporte">Suporte Técnico</option>
                  <option value="reclamacao">Reclamação</option>
                  <option value="sugestao">Sugestão</option>
                  <option value="parceria">Parceria</option>
                </select>
              </div>

              <div class="form-group">
                <label for="message">Mensagem</label>
                <textarea 
                  id="message"
                  v-model="form.message" 
                  required 
                  class="form-textarea"
                  placeholder="Descreva sua dúvida ou solicitação..."
                  rows="5"
                ></textarea>
              </div>

              <button type="submit" :disabled="loading" class="btn-submit">
                <span v-if="!loading">Enviar Mensagem</span>
                <span v-else>Enviando...</span>
              </button>

              <div v-if="success" class="success-message">
                {{ success }}
              </div>

              <div v-if="error" class="error-message">
                {{ error }}
              </div>
            </form>
          </div>

          <!-- Contact Info -->
          <div class="contact-info">
            <h2>Outras Formas de Contato</h2>
            
            <div class="contact-methods">
              <div class="contact-method">
                <div class="method-icon">📧</div>
                <div class="method-content">
                  <h3>E-mail</h3>
                  <p>contato@serviflix.com</p>
                  <span>Respondemos em até 24h</span>
                </div>
              </div>

              <div class="contact-method">
                <div class="method-icon">📞</div>
                <div class="method-content">
                  <h3>Telefone</h3>
                  <p>(11) 3000-0000</p>
                  <span>Seg a Sex, 8h às 18h</span>
                </div>
              </div>

              <div class="contact-method">
                <div class="method-icon">💬</div>
                <div class="method-content">
                  <h3>WhatsApp</h3>
                  <p>(11) 99999-9999</p>
                  <span>Seg a Sex, 8h às 18h</span>
                </div>
              </div>

              <div class="contact-method">
                <div class="method-icon">📍</div>
                <div class="method-content">
                  <h3>Endereço</h3>
                  <p>Av. Paulista, 1000<br>São Paulo - SP</p>
                  <span>CEP: 01310-100</span>
                </div>
              </div>
            </div>

            <!-- Social Media -->
            <div class="social-media">
              <h3>Siga-nos nas Redes Sociais</h3>
              <div class="social-links">
                <a href="#" class="social-link facebook">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" class="social-link instagram">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" class="social-link twitter">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" class="social-link linkedin">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
useHead({
  title: 'Contato - ServiFlix',
  meta: [
    { name: 'description', content: 'Entre em contato com o ServiFlix' }
  ]
})

const form = ref({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
})

const loading = ref(false)
const success = ref('')
const error = ref('')

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    // Simular envio (substituir por API real)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    success.value = 'Mensagem enviada com sucesso! Entraremos em contato em breve.'
    
    // Limpar formulário
    form.value = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    }
  } catch (err) {
    error.value = 'Erro ao enviar mensagem. Tente novamente.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.contact-page {
  min-height: 100vh;
}

.hero-section {
  background: var(--gradient-primary);
  color: white;
  padding: var(--space-6xl) 0 var(--space-4xl);
  text-align: center;
}

.hero-content h1 {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 800;
  margin-bottom: var(--space-lg);
}

.hero-content p {
  font-size: 1.2rem;
  opacity: 0.9;
}

.contact-section {
  padding: var(--space-6xl) 0;
  background: var(--bg-secondary);
}

.contact-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-4xl);
  max-width: 1200px;
  margin: 0 auto;
}

.contact-form-container {
  background: var(--bg-primary);
  padding: var(--space-3xl);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
}

.contact-form-container h2 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-2xl);
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.form-group label {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.form-input, .form-textarea {
  padding: var(--space-lg);
  border: 2px solid var(--border-primary);
  border-radius: var(--radius-md);
  font-size: 1rem;
  transition: all var(--transition-base);
  background: var(--bg-primary);
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.btn-submit {
  background: var(--gradient-primary);
  color: white;
  border: none;
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-primary-lg);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.success-message {
  background: var(--success-500);
  color: white;
  padding: var(--space-md);
  border-radius: var(--radius-md);
  text-align: center;
}

.error-message {
  background: var(--error-500);
  color: white;
  padding: var(--space-md);
  border-radius: var(--radius-md);
  text-align: center;
}

.contact-info {
  background: var(--bg-primary);
  padding: var(--space-3xl);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  height: fit-content;
}

.contact-info h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-2xl);
}

.contact-methods {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
  margin-bottom: var(--space-3xl);
}

.contact-method {
  display: flex;
  gap: var(--space-lg);
  align-items: flex-start;
}

.method-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.method-content h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-xs);
}

.method-content p {
  color: var(--text-secondary);
  margin-bottom: var(--space-xs);
}

.method-content span {
  color: var(--text-tertiary);
  font-size: 0.9rem;
}

.social-media h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-lg);
}

.social-links {
  display: flex;
  gap: var(--space-md);
}

.social-link {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-base);
  text-decoration: none;
}

.social-link svg {
  width: 20px;
  height: 20px;
}

.social-link.facebook {
  background: #1877f2;
  color: white;
}

.social-link.instagram {
  background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
  color: white;
}

.social-link.twitter {
  background: #1da1f2;
  color: white;
}

.social-link.linkedin {
  background: #0077b5;
  color: white;
}

.social-link:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

@media (max-width: 768px) {
  .contact-grid {
    grid-template-columns: 1fr;
    gap: var(--space-2xl);
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .contact-form-container,
  .contact-info {
    padding: var(--space-2xl);
  }
}
</style>