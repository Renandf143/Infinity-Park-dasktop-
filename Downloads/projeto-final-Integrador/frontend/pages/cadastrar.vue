<template>
  <div class="signup-page">
    <div class="signup-container">
      <div class="signup-card">
        <!-- Logo -->
        <div class="logo-section">
          <h1 class="logo-title">Servifflix</h1>
          <div class="logo-underline"></div>
        </div>

        <!-- Progress Steps -->
        <div class="progress-section">
          <div class="progress-steps">
            <div class="step" :class="{ active: currentStep >= 1 }">
              <div class="step-circle">1</div>
            </div>
            <div class="step-line" :class="{ active: currentStep >= 2 }"></div>
            <div class="step" :class="{ active: currentStep >= 2 }">
              <div class="step-circle">2</div>
            </div>
            <div class="step-line" :class="{ active: currentStep >= 3 }"></div>
            <div class="step" :class="{ active: currentStep >= 3 }">
              <div class="step-circle">3</div>
            </div>
            <div class="step-line" :class="{ active: currentStep >= 4 }"></div>
            <div class="step" :class="{ active: currentStep >= 4 }">
              <div class="step-circle">4</div>
            </div>
          </div>
          <p class="progress-text">Passo {{ currentStep }} de 4</p>
        </div>

        <!-- Header -->
        <div class="header-section">
          <h2 class="main-title">Crie sua conta no Servifflix</h2>
          <p class="main-subtitle">Encontre os melhores profissionais ou ofereça seus serviços</p>
        </div>

        <!-- ETAPA 1: Seleção de perfil e dados básicos -->
        <div v-if="currentStep === 1">
          <!-- Profile Selection -->
          <div class="profile-section">
            <h3 class="profile-title">Selecione seu perfil</h3>
            
            <div class="profile-options">
              <button
                type="button"
                @click="selectProfile('cliente')"
                class="profile-btn"
                :class="{ active: selectedProfile === 'cliente' }"
              >
                <div class="profile-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <h4>Sou Cliente</h4>
                <p>Preciso contratar serviços</p>
              </button>

              <button
                type="button"
                @click="selectProfile('profissional')"
                class="profile-btn"
                :class="{ active: selectedProfile === 'profissional' }"
              >
                <div class="profile-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 6h-2V4c0-1.11-.89-2-2-2H8c-1.11 0-2 .89-2 2v2H4c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zM8 4h8v2H8V4zm12 15H4V8h16v11z"/>
                  </svg>
                </div>
                <h4>Sou Profissional</h4>
                <p>Quero oferecer meus serviços</p>
              </button>
            </div>
          </div>  

          <!-- Google Signup (apenas para clientes) -->
          <div v-if="selectedProfile === 'cliente'" class="google-section">
            <button type="button" class="google-btn" @click="signupWithGoogle">
              <svg viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Cadastrar rapidamente com Google
            </button>
          </div>

          <!-- Divider (apenas para clientes) -->
          <div v-if="selectedProfile === 'cliente'" class="divider">
            <span>Ou preencha manualmente</span>
          </div>

          <!-- Seção de Benefícios Profissionais (apenas para profissionais) -->
          <div v-if="selectedProfile === 'profissional'" class="professional-benefits">
            <h3>Vantagens para Profissionais</h3>
            <div class="benefits-grid">
              <div class="benefit-item">
                <div class="benefit-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <span>Clientes pré-verificados</span>
              </div>
              <div class="benefit-item">
                <div class="benefit-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.9 1 3 1.9 3 3V21C3 22.1 3.9 23 5 23H19C20.1 23 21 22.1 21 21V9M12 8C14.8 8 17 10.2 17 13S14.8 18 12 18 7 15.8 7 13 9.2 8 12 8Z"/>
                  </svg>
                </div>
                <span>Pagamento garantido</span>
              </div>
              <div class="benefit-item">
                <div class="benefit-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                  </svg>
                </div>
                <span>Controle total da agenda</span>
              </div>
              <div class="benefit-item">
                <div class="benefit-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.5 5.6L10 7 8.6 4.5 10 2 7.5 3.4 5 2l1.4 2.5L5 7zm12 9.8L17 14l1.4 2.5L17 19l2.5-1.4L22 19l-1.4-2.5L22 14zM22 2l-2.5 1.4L17 2l1.4 2.5L17 7l2.5-1.4L22 7l-1.4-2.5zm-7.63 5.29c-.39-.39-1.02-.39-1.41 0L1.29 18.96c-.39.39-.39 1.02 0 1.41l2.34 2.34c.39.39 1.02.39 1.41 0L16.7 11.05c.39-.39.39-1.02 0-1.41l-2.33-2.35z"/>
                  </svg>
                </div>
                <span>Ferramentas profissionais</span>
              </div>
            </div>
          </div>

          <!-- Form Etapa 1 -->
          <form v-if="selectedProfile" @submit.prevent="nextStep" class="signup-form">
            <!-- Nome Completo -->
            <div class="form-group">
              <label for="name" class="form-label">Nome Completo</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                class="form-input"
                placeholder="Digite seu nome completo"
                required
              >
            </div>

            <!-- E-mail -->
            <div class="form-group">
              <label for="email" class="form-label">E-mail</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                class="form-input"
                placeholder="seu@email.com"
                required
              >
            </div>

            <!-- CPF -->
            <div class="form-group">
              <label for="cpf" class="form-label">CPF</label>
              <input
                id="cpf"
                v-model="form.cpf"
                type="text"
                class="form-input"
                placeholder="000.000.000-00"
                @input="formatCPF"
                required
              >
            </div>

            <!-- Telefone -->
            <div class="form-group">
              <label for="phone" class="form-label">
                Telefone (WhatsApp) 
                <span class="info-icon">ℹ</span>
              </label>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                class="form-input"
                placeholder="(11) 99999-9999"
                @input="formatPhone"
                required
              >
            </div>

            <!-- Security Icons -->
            <div class="security-badges">
              <div class="security-badge">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                </svg>
                <span>Dados Protegidos</span>
              </div>
              <div class="security-badge">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z"/>
                </svg>
                <span>SSL Seguro</span>
              </div>
              <div class="security-badge">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L18 8l-8 8z"/>
                </svg>
                <span>Verificação Obrigatória</span>
              </div>
            </div>

            <!-- Terms -->
            <div class="terms-section">
              <label class="checkbox-label">
                <input
                  v-model="form.acceptTerms"
                  type="checkbox"
                  class="checkbox-input"
                  required
                >
                <span class="checkbox-custom"></span>
                <span class="checkbox-text">
                  Li e aceito os <a href="/termos" target="_blank">Termos de Uso</a> e 
                  <a href="/privacidade" target="_blank">Política de Privacidade</a>
                </span>
              </label>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="submit-btn"
              :disabled="!canSubmitStep1 || loading"
            >
              {{ loading ? 'Processando...' : 'Continuar' }}
            </button>
          </form>
        </div>   

        <!-- ETAPA 2: Endereço (apenas para profissionais) -->
        <div v-if="currentStep === 2 && selectedProfile === 'profissional'">
          <form @submit.prevent="nextStep" class="signup-form">
            <!-- Logradouro -->
            <div class="form-group">
              <label for="logradouro" class="form-label">Logradouro</label>
              <input
                id="logradouro"
                v-model="form.logradouro"
                type="text"
                class="form-input"
                placeholder="Rua, Avenida, Travessa, etc."
                required
              >
            </div>

            <!-- Número -->
            <div class="form-group">
              <label for="numero" class="form-label">Número</label>
              <input
                id="numero"
                v-model="form.numero"
                type="text"
                class="form-input"
                placeholder="Número da residência ou estabelecimento"
                required
              >
            </div>

            <!-- Bairro -->
            <div class="form-group">
              <label for="bairro" class="form-label">Bairro</label>
              <input
                id="bairro"
                v-model="form.bairro"
                type="text"
                class="form-input"
                placeholder="Região ou distrito dentro da cidade"
                required
              >
            </div>

            <!-- Cidade -->
            <div class="form-group">
              <label for="cidade" class="form-label">Cidade</label>
              <input
                id="cidade"
                v-model="form.cidade"
                type="text"
                class="form-input"
                placeholder="Nome do município"
                required
              >
            </div>

            <!-- CEP -->
            <div class="form-group">
              <label for="cep" class="form-label">CEP</label>
              <input
                id="cep"
                v-model="form.cep"
                type="text"
                class="form-input"
                placeholder="00000-000"
                @input="formatCEP"
                required
              >
            </div>

            <!-- País -->
            <div class="form-group">
              <label for="pais" class="form-label">País</label>
              <input
                id="pais"
                v-model="form.pais"
                type="text"
                class="form-input"
                placeholder="Brasil"
                required
              >
            </div>

            <!-- Complemento -->
            <div class="form-group">
              <label for="complemento" class="form-label">Complemento</label>
              <input
                id="complemento"
                v-model="form.complemento"
                type="text"
                class="form-input"
                placeholder="Apartamento, bloco, casa, loja, etc."
              >
            </div>

            <!-- Navigation Buttons -->
            <div class="navigation-buttons">
              <button
                type="button"
                @click="previousStep"
                class="back-btn"
              >
                Voltar
              </button>
              <button
                type="submit"
                class="submit-btn"
                :disabled="!canSubmitStep2 || loading"
              >
                {{ loading ? 'Processando...' : 'Continuar' }}
              </button>
            </div>
          </form>
        </div>

        <!-- ETAPA 3: Comprovante de Residência -->
        <div v-if="currentStep === 3">
          <div class="document-verification-section">
            <h2 class="verification-title">Vamos garantir a segurança de todos</h2>
            <p class="verification-subtitle">
              Para manter nosso padrão mais seguro e confiável, precisamos verificar 
              alguns documentos. Tire uma foto e seus dados serão 
              totalmente protegidos.
            </p>

            <!-- Documento de Identidade -->
            <div class="document-section">
              <h3 class="document-title">Documento de Identidade</h3>
              <p class="document-subtitle">Envie sua foto com o seu RG ou CNH (frente e verso)</p>
              
              <div class="document-upload-grid">
                <!-- Frente do Documento -->
                <div class="document-upload-card">
                  <div class="document-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                    </svg>
                  </div>
                  <h4>FRENTE DO DOCUMENTO</h4>
                  <p>Foto deve estar nítida e sem reflexo</p>
                  <button 
                    type="button" 
                    class="upload-btn"
                    @click="$refs.documentFrontInput.click()"
                  >
                    {{ form.documentFront ? 'Documento enviado' : 'Selecionar arquivo' }}
                  </button>
                  <input
                    ref="documentFrontInput"
                    type="file"
                    accept="image/*"
                    @change="handleDocumentUpload('front', $event)"
                    style="display: none"
                  >
                </div>

                <!-- Verso do Documento -->
                <div class="document-upload-card">
                  <div class="document-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                    </svg>
                  </div>
                  <h4>VERSO DO DOCUMENTO</h4>
                  <p>Foto deve estar nítida e sem reflexo</p>
                  <button 
                    type="button" 
                    class="upload-btn"
                    @click="$refs.documentBackInput.click()"
                  >
                    {{ form.documentBack ? 'Documento enviado' : 'Selecionar arquivo' }}
                  </button>
                  <input
                    ref="documentBackInput"
                    type="file"
                    accept="image/*"
                    @change="handleDocumentUpload('back', $event)"
                    style="display: none"
                  >
                </div>
              </div>
            </div>

            <!-- Comprovante de Residência -->
            <div class="document-section">
              <h3 class="document-title">Comprovante de Residência</h3>
              <p class="document-subtitle">
                Envie uma conta de luz, água ou telefone dos últimos 3 meses
              </p>
              
              <div class="document-upload-single">
                <div class="document-upload-card">
                  <div class="document-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z"/>
                    </svg>
                  </div>
                  <h4>Comprovante de Residência</h4>
                  <p>Envie uma conta de luz, água ou telefone dos últimos 3 meses</p>
                  <button 
                    type="button" 
                    class="upload-btn"
                    @click="$refs.residenceProofInput.click()"
                  >
                    {{ form.residenceProof ? 'Documento enviado' : 'Selecionar arquivo' }}
                  </button>
                  <input
                    ref="residenceProofInput"
                    type="file"
                    accept="image/*,application/pdf"
                    @change="handleDocumentUpload('residence', $event)"
                    style="display: none"
                  >
                </div>
              </div>
            </div>

            <!-- Navigation Buttons -->
            <div class="navigation-buttons">
              <button
                type="button"
                @click="previousStep"
                class="back-btn"
              >
                Voltar
              </button>
              <button
                type="button"
                @click="nextStep"
                class="submit-btn"
                :disabled="!canSubmitStep3 || loading"
              >
                {{ loading ? 'Processando...' : selectedProfile === 'cliente' ? 'Finalizar Cadastro' : 'Continuar' }}
              </button>
            </div>
          </div>
        </div>

        <!-- ETAPA 4: Finalização do Cadastro Profissional -->
        <div v-if="currentStep === 4 && selectedProfile === 'profissional'">
          <div class="final-step-header">
            <div class="success-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L18 8l-8 8z"/>
              </svg>
            </div>
            <h2 class="final-title">Quase pronto!</h2>
            <p class="final-subtitle">Complete seu perfil profissional e defina sua senha para finalizar o cadastro</p>
          </div>

          <form @submit.prevent="handleSubmit" class="signup-form">
            <!-- Seção Informações Profissionais -->
            <div class="form-section">
              <h3 class="section-title">
                <svg viewBox="0 0 24 24" fill="currentColor" class="section-icon">
                  <path d="M20 6h-2V4c0-1.11-.89-2-2-2H8c-1.11 0-2 .89-2 2v2H4c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zM8 4h8v2H8V4zm12 15H4V8h16v11z"/>
                </svg>
                Informações Profissionais
              </h3>

              <!-- Profissão -->
              <div class="form-group">
                <label for="profissao" class="form-label">Sua Profissão Principal</label>
                <select
                  id="profissao"
                  v-model="form.profissao"
                  class="form-input"
                  required
                >
                  <option value="">Selecione sua profissão</option>
                  <option value="eletricista">Eletricista</option>
                  <option value="encanador">Encanador</option>
                  <option value="pedreiro">Pedreiro</option>
                  <option value="pintor">Pintor</option>
                  <option value="marceneiro">Marceneiro</option>
                  <option value="jardineiro">Jardineiro</option>
                  <option value="diarista">Diarista</option>
                  <option value="mecanico">Mecânico</option>
                  <option value="tecnico_informatica">Técnico em Informática</option>
                  <option value="fotografo">Fotógrafo</option>
                  <option value="designer">Designer</option>
                  <option value="personal_trainer">Personal Trainer</option>
                  <option value="professor_particular">Professor Particular</option>
                  <option value="cuidador">Cuidador</option>
                  <option value="massagista">Massagista</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <!-- Experiência -->
              <div class="form-group">
                <label for="experiencia" class="form-label">Tempo de Experiência</label>
                <select
                  id="experiencia"
                  v-model="form.experiencia"
                  class="form-input"
                  required
                >
                  <option value="">Selecione</option>
                  <option value="iniciante">Iniciante (menos de 1 ano)</option>
                  <option value="1_3_anos">1 a 3 anos</option>
                  <option value="3_5_anos">3 a 5 anos</option>
                  <option value="5_10_anos">5 a 10 anos</option>
                  <option value="mais_10_anos">Mais de 10 anos</option>
                </select>
              </div>

              <!-- Descrição dos Serviços -->
              <div class="form-group">
                <label for="descricao" class="form-label">Descreva seus serviços</label>
                <textarea
                  id="descricao"
                  v-model="form.descricao"
                  class="form-textarea"
                  placeholder="Conte sobre sua experiência, especialidades e diferenciais. Ex: Eletricista com 8 anos de experiência, especializado em instalações residenciais e comerciais..."
                  rows="4"
                  required
                ></textarea>
                <div class="char-counter" :class="{ valid: form.descricao.length >= 50, invalid: form.descricao.length > 0 && form.descricao.length < 50 }">
                  {{ form.descricao.length }}/50 caracteres mínimos
                </div>
              </div>

              <!-- Preço por Hora -->
              <div class="form-group">
                <label for="preco_hora" class="form-label">Preço por Hora (R$)</label>
                <div class="price-input-container">
                  <span class="currency-symbol">R$</span>
                  <input
                    id="preco_hora"
                    v-model="form.preco_hora"
                    type="number"
                    class="form-input price-input"
                    placeholder="75.00"
                    min="20"
                    max="500"
                    step="5"
                    required
                  >
                </div>
                <small class="form-hint">Valor entre R$ 20,00 e R$ 500,00 por hora</small>
              </div>

              <!-- Disponibilidade -->
              <div class="form-group">
                <label class="form-label">Dias Disponíveis para Trabalhar</label>
                <div class="availability-grid">
                  <label class="availability-item">
                    <input
                      v-model="form.disponibilidade"
                      type="checkbox"
                      value="segunda"
                      class="availability-checkbox"
                    >
                    <span class="availability-day">
                      <span class="day-short">SEG</span>
                      <span class="day-full">Segunda</span>
                    </span>
                  </label>
                  <label class="availability-item">
                    <input
                      v-model="form.disponibilidade"
                      type="checkbox"
                      value="terca"
                      class="availability-checkbox"
                    >
                    <span class="availability-day">
                      <span class="day-short">TER</span>
                      <span class="day-full">Terça</span>
                    </span>
                  </label>
                  <label class="availability-item">
                    <input
                      v-model="form.disponibilidade"
                      type="checkbox"
                      value="quarta"
                      class="availability-checkbox"
                    >
                    <span class="availability-day">
                      <span class="day-short">QUA</span>
                      <span class="day-full">Quarta</span>
                    </span>
                  </label>
                  <label class="availability-item">
                    <input
                      v-model="form.disponibilidade"
                      type="checkbox"
                      value="quinta"
                      class="availability-checkbox"
                    >
                    <span class="availability-day">
                      <span class="day-short">QUI</span>
                      <span class="day-full">Quinta</span>
                    </span>
                  </label>
                  <label class="availability-item">
                    <input
                      v-model="form.disponibilidade"
                      type="checkbox"
                      value="sexta"
                      class="availability-checkbox"
                    >
                    <span class="availability-day">
                      <span class="day-short">SEX</span>
                      <span class="day-full">Sexta</span>
                    </span>
                  </label>
                  <label class="availability-item">
                    <input
                      v-model="form.disponibilidade"
                      type="checkbox"
                      value="sabado"
                      class="availability-checkbox"
                    >
                    <span class="availability-day">
                      <span class="day-short">SÁB</span>
                      <span class="day-full">Sábado</span>
                    </span>
                  </label>
                  <label class="availability-item">
                    <input
                      v-model="form.disponibilidade"
                      type="checkbox"
                      value="domingo"
                      class="availability-checkbox"
                    >
                    <span class="availability-day">
                      <span class="day-short">DOM</span>
                      <span class="day-full">Domingo</span>
                    </span>
                  </label>
                </div>
                <small class="form-hint">Selecione pelo menos 3 dias da semana</small>
              </div>
            </div>

            <!-- Seção Segurança -->
            <div class="form-section">
              <h3 class="section-title">
                <svg viewBox="0 0 24 24" fill="currentColor" class="section-icon">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                </svg>
                Segurança da Conta
              </h3>

              <!-- Senha -->
              <div class="form-group">
                <label for="password" class="form-label">Senha</label>
                <div class="password-input-container">
                  <input
                    id="password"
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    class="form-input"
                    placeholder="Digite sua senha"
                    required
                  >
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="password-toggle"
                  >
                    <svg v-if="showPassword" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                    </svg>
                    <svg v-else viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                  </button>
                </div>
                <div class="password-requirements">
                  <p class="requirements-title">A senha deve conter:</p>
                  <ul class="requirements-list">
                    <li :class="{ valid: passwordValidation.minLength }">Pelo menos 8 caracteres</li>
                    <li :class="{ valid: passwordValidation.hasUppercase }">Uma letra maiúscula</li>
                    <li :class="{ valid: passwordValidation.hasLowercase }">Uma letra minúscula</li>
                    <li :class="{ valid: passwordValidation.hasNumber }">Um número</li>
                  </ul>
                </div>
              </div>

              <!-- Confirmar Senha -->
              <div class="form-group">
                <label for="confirmPassword" class="form-label">Confirmar Senha</label>
                <input
                  id="confirmPassword"
                  v-model="form.confirmPassword"
                  type="password"
                  class="form-input"
                  placeholder="Digite novamente sua senha"
                  required
                >
                <div v-if="form.confirmPassword && form.password !== form.confirmPassword" class="error-message">
                  As senhas não coincidem
                </div>
              </div>
            </div>

            <!-- Terms -->
            <div class="terms-section">
              <label class="checkbox-label">
                <input
                  v-model="form.acceptTerms"
                  type="checkbox"
                  class="checkbox-input"
                  required
                >
                <span class="checkbox-custom"></span>
                <span class="checkbox-text">
                  Li e aceito os <a href="/termos" target="_blank">Termos de Uso</a> e 
                  <a href="/privacidade" target="_blank">Política de Privacidade</a>
                </span>
              </label>
            </div>

            <!-- Navigation Buttons -->
            <div class="navigation-buttons">
              <button
                type="button"
                @click="previousStep"
                class="back-btn"
              >
                Voltar
              </button>
              <button
                type="submit"
                class="submit-btn"
                :disabled="!canSubmitStep4 || loading"
              >
                {{ loading ? 'Processando...' : 'Finalizar Cadastro' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Footer -->
        <div class="footer-section">
          <p>Já tem uma conta? <NuxtLink to="/entrar" class="login-link">Faça login</NuxtLink></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'auth'
})

useHead({
  title: 'Cadastro - Servifflix',
  meta: [
    { name: 'description', content: 'Crie sua conta no Servifflix' }
  ]
})

// Estados
const loading = ref(false)
const selectedProfile = ref('')
const currentStep = ref(1)
const showPassword = ref(false)

// Dados do formulário
const form = reactive({
  // Etapa 1
  name: '',
  email: '',
  cpf: '',
  phone: '',
  acceptTerms: false,
  
  // Etapa 2 - Endereço (profissionais)
  logradouro: '',
  numero: '',
  bairro: '',
  cidade: '',
  cep: '',
  pais: 'Brasil',
  complemento: '',
  
  // Etapa 3 - Documentos
  documentFront: null,
  documentBack: null,
  residenceProof: null,
  
  // Etapa 4 - Informações Profissionais
  profissao: '',
  experiencia: '',
  descricao: '',
  preco_hora: '',
  disponibilidade: [],
  
  // Senha
  password: '',
  confirmPassword: ''
})

// Computed
const canSubmitStep1 = computed(() => {
  return selectedProfile.value && 
         form.name && 
         form.email && 
         form.cpf && 
         form.phone && 
         form.acceptTerms
})

const canSubmitStep2 = computed(() => {
  return form.logradouro && 
         form.numero && 
         form.bairro && 
         form.cidade && 
         form.cep
})

const canSubmitStep3 = computed(() => {
  return form.documentFront && 
         form.documentBack && 
         form.residenceProof
})

const canSubmitStep4 = computed(() => {
  return form.profissao && 
         form.experiencia && 
         form.descricao && 
         form.descricao.length >= 50 &&
         form.preco_hora && 
         form.disponibilidade.length >= 3 &&
         form.password && 
         form.confirmPassword && 
         form.password === form.confirmPassword && 
         passwordValidation.value.isValid &&
         form.acceptTerms
})

const passwordValidation = computed(() => {
  const password = form.password
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    isValid: password.length >= 8 && 
             /[A-Z]/.test(password) && 
             /[a-z]/.test(password) && 
             /\d/.test(password)
  }
})

// Methods
const selectProfile = (type) => {
  selectedProfile.value = type
}

function formatCPF(event) {
  let value = event.target.value.replace(/\D/g, '')
  if (value.length <= 11) {
    value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    form.cpf = value
  }
}

function formatPhone(event) {
  let value = event.target.value.replace(/\D/g, '')
  if (value.length <= 11) {
    value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    form.phone = value
  }
}

function formatCEP(event) {
  let value = event.target.value.replace(/\D/g, '')
  if (value.length <= 8) {
    value = value.replace(/(\d{5})(\d{3})/, '$1-$2')
    form.cep = value
  }
}

function signupWithGoogle() {
  alert('Cadastro com Google em desenvolvimento!')
}

function nextStep() {
  if (currentStep.value === 1) {
    if (selectedProfile.value === 'cliente') {
      currentStep.value = 3
    } else {
      currentStep.value = 2
    }
  } else if (currentStep.value === 2) {
    currentStep.value = 3
  } else if (currentStep.value === 3) {
    if (selectedProfile.value === 'cliente') {
      handleSubmit()
    } else {
      currentStep.value = 4
    }
  }
}

function previousStep() {
  if (currentStep.value === 4) {
    currentStep.value = 3
  } else if (currentStep.value === 3) {
    if (selectedProfile.value === 'cliente') {
      currentStep.value = 1
    } else {
      currentStep.value = 2
    }
  } else if (currentStep.value === 2) {
    currentStep.value = 1
  }
}

function handleDocumentUpload(type, event) {
  const file = event.target.files[0]
  if (file) {
    // Validar tamanho do arquivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Arquivo muito grande. Máximo 5MB.')
      return
    }
    
    // Validar tipo do arquivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      alert('Tipo de arquivo não permitido. Use JPG, PNG ou PDF.')
      return
    }
    
    // Armazenar o arquivo
    if (type === 'front') {
      form.documentFront = file
    } else if (type === 'back') {
      form.documentBack = file
    } else if (type === 'residence') {
      form.residenceProof = file
    }
  }
}

async function handleSubmit() {
  loading.value = true
  
  try {
    const { registerClient, registerProfessional } = useAuth()
    const { checkEmailExists, checkCPFExists, validateCPF, validateEmail } = useValidation()
    
    // Validações básicas
    if (!validateEmail(form.email)) {
      alert('Email inválido')
      return
    }
    
    if (!validateCPF(form.cpf)) {
      alert('CPF inválido')
      return
    }
    
    // Verificar se email já existe
    const emailCheck = await checkEmailExists(form.email)
    if (emailCheck.exists) {
      alert('Este email já está em uso. Tente fazer login ou use outro email.')
      return
    }

    // Verificar se CPF já existe
    const cpfCheck = await checkCPFExists(form.cpf)
    if (cpfCheck.exists) {
      alert('Este CPF já está cadastrado. Tente fazer login ou entre em contato com o suporte.')
      return
    }
    
    // Preparar dados do usuário
    const userData = {
      name: form.name,
      email: form.email,
      cpf: form.cpf.replace(/\D/g, ''), // Remove formatação
      phone: form.phone.replace(/\D/g, ''), // Remove formatação
      password: form.password
    }

    // Adicionar dados específicos para profissionais
    if (selectedProfile.value === 'profissional') {
      Object.assign(userData, {
        logradouro: form.logradouro,
        numero: form.numero,
        bairro: form.bairro,
        cidade: form.cidade,
        cep: form.cep.replace(/\D/g, ''), // Remove formatação
        pais: form.pais,
        complemento: form.complemento,
        profissao: form.profissao,
        experiencia: form.experiencia,
        descricao: form.descricao,
        preco_hora: parseFloat(form.preco_hora),
        disponibilidade: form.disponibilidade
      })
    }

    // Registrar usuário
    let result
    if (selectedProfile.value === 'profissional') {
      result = await registerProfessional(userData)
    } else {
      result = await registerClient(userData)
    }

    if (!result.success) {
      alert(`Erro ao criar conta: ${result.error}`)
      return
    }

    // Sucesso - redirecionar para verificação de email
    if (result.needsVerification) {
      await navigateTo(`/auth/verify-email?email=${encodeURIComponent(form.email)}&type=${selectedProfile.value}`)
    } else {
      // Se não precisar de verificação, redirecionar direto para dashboard
      await navigateTo('/dashboard?welcome=true')
    }

  } catch (error) {
    console.error('Erro geral ao criar conta:', error)
    alert('Erro inesperado ao criar conta. Tente novamente.')
  } finally {
    loading.value = false
  }
}
</script><style scop
ed>
.signup-page {
  min-height: calc(100vh - 70px);
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.signup-container {
  width: 100%;
  max-width: 480px;
}

.signup-card {
  background: white;
  border-radius: 12px;
  padding: 40px 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* Logo Section */
.logo-section {
  text-align: center;
  margin-bottom: 30px;
}

.logo-title {
  font-size: 24px;
  font-weight: 600;
  color: #3b82f6;
  margin: 0 0 8px 0;
}

.logo-underline {
  width: 40px;
  height: 3px;
  background: #3b82f6;
  margin: 0 auto;
}

/* Progress Section */
.progress-section {
  text-align: center;
  margin-bottom: 30px;
}

.progress-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.step {
  display: flex;
  align-items: center;
}

.step-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e5e7eb;
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
}

.step.active .step-circle {
  background: #3b82f6;
  color: white;
}

.step-line {
  width: 40px;
  height: 2px;
  background: #e5e7eb;
  margin: 0 8px;
  transition: all 0.3s ease;
}

.step-line.active {
  background: #3b82f6;
}

.progress-text {
  color: #9ca3af;
  font-size: 14px;
  margin: 0;
}

/* Header Section */
.header-section {
  text-align: center;
  margin-bottom: 30px;
}

.main-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.main-subtitle {
  color: #6b7280;
  font-size: 16px;
  margin: 0;
  line-height: 1.5;
}

/* Profile Section */
.profile-section {
  margin-bottom: 30px;
}

.profile-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 16px 0;
}

.profile-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.profile-btn {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.profile-btn:hover {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.02);
}

.profile-btn.active {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.05);
}

.profile-icon {
  width: 40px;
  height: 40px;
  background: #3b82f6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  color: white;
}

.profile-icon svg {
  width: 20px;
  height: 20px;
}

.profile-btn h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.profile-btn p {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
}

/* Google Section */
.google-section {
  margin-bottom: 20px;
}

.google-btn {
  width: 100%;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 16px;
  font-weight: 500;
  color: #374151;
}

.google-btn:hover {
  border-color: #d1d5db;
  background: #f9fafb;
}

.google-btn svg {
  width: 20px;
  height: 20px;
}

/* Divider */
.divider {
  text-align: center;
  margin: 20px 0;
  position: relative;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e5e7eb;
}

.divider span {
  background: white;
  padding: 0 16px;
  color: #9ca3af;
  font-size: 14px;
}

/* Professional Benefits Section */
.professional-benefits {
  background: #3b82f6;
  border: 1px solid #2563eb;
  border-radius: 12px;
  padding: 28px;
  margin-bottom: 24px;
  color: white;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.15);
}

.professional-benefits h3 {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 20px 0;
  text-align: center;
  color: white;
  letter-spacing: -0.025em;
}

.benefits-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.benefit-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.benefit-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.benefit-icon {
  width: 24px;
  height: 24px;
  color: #dbeafe;
  flex-shrink: 0;
  margin-top: 2px;
}

.benefit-icon svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.benefit-item span {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;
  color: white;
}

/* Form Styles */
.signup-form {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input::placeholder {
  color: #9ca3af;
}

.info-icon {
  color: #9ca3af;
  cursor: help;
}

/* Security Badges */
.security-badges {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
  gap: 8px;
}

.security-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #6b7280;
}

.security-badge svg {
  width: 16px;
  height: 16px;
  color: #10b981;
}

/* Terms Section */
.terms-section {
  margin: 20px 0;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  font-size: 14px;
  line-height: 1.5;
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
  margin-top: 2px;
}

.checkbox-input:checked + .checkbox-custom {
  background: #3b82f6;
  border-color: #3b82f6;
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '✓';
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.checkbox-text {
  color: #374151;
}

.checkbox-text a {
  color: #3b82f6;
  text-decoration: none;
}

.checkbox-text a:hover {
  text-decoration: underline;
}

/* Submit Button */
.submit-btn {
  width: 100%;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 14px 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-btn:hover:not(:disabled) {
  background: #2563eb;
}

.submit-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

/* Navigation Buttons */
.navigation-buttons {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.back-btn {
  flex: 1;
  background: white;
  color: #6b7280;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-btn:hover {
  border-color: #d1d5db;
  background: #f9fafb;
}

/* Document Verification Section */
.document-verification-section {
  text-align: center;
}

.verification-title {
  font-size: 24px;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 12px;
}

.verification-subtitle {
  color: #718096;
  margin-bottom: 40px;
  line-height: 1.6;
}

.document-section {
  margin-bottom: 40px;
  text-align: left;
}

.document-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 8px;
}

.document-subtitle {
  color: #718096;
  margin-bottom: 24px;
  font-size: 14px;
}

.document-upload-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 32px;
}

.document-upload-single {
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
}

.document-upload-card {
  background: #f7fafc;
  border: 2px dashed #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  max-width: 280px;
}

.document-upload-card:hover {
  border-color: #4299e1;
  background: #ebf8ff;
}

.document-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 16px;
  color: #4299e1;
}

.document-icon svg {
  width: 100%;
  height: 100%;
}

.document-upload-card h4 {
  font-size: 14px;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.document-upload-card p {
  color: #718096;
  font-size: 12px;
  margin-bottom: 16px;
  line-height: 1.4;
}

.upload-btn {
  background: #4299e1;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.upload-btn:hover {
  background: #3182ce;
}

/* Final Step Styles */
.final-step-header {
  text-align: center;
  margin-bottom: 40px;
}

.success-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  color: white;
  box-shadow: 0 8px 32px rgba(16, 185, 129, 0.3);
}

.success-icon svg {
  width: 40px;
  height: 40px;
}

.final-title {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 12px 0;
}

.final-subtitle {
  font-size: 16px;
  color: #6b7280;
  line-height: 1.6;
  max-width: 400px;
  margin: 0 auto;
}

/* Form Sections */
.form-section {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 20px 0;
}

.section-icon {
  width: 20px;
  height: 20px;
  color: #3b82f6;
}

/* Price Input */
.price-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.currency-symbol {
  position: absolute;
  left: 12px;
  color: #6b7280;
  font-weight: 600;
  z-index: 1;
}

.price-input {
  padding-left: 40px !important;
}

/* Form Hints */
.form-hint {
  display: block;
  margin-top: 6px;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.4;
}

/* Availability Grid */
.availability-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 12px;
  margin-top: 12px;
}

.availability-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.availability-checkbox {
  display: none;
}

.availability-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 8px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  transition: all 0.2s ease;
  width: 100%;
  min-height: 70px;
  justify-content: center;
}

.availability-checkbox:checked + .availability-day {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.day-short {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.day-full {
  font-size: 11px;
  margin-top: 4px;
  opacity: 0.8;
}

.availability-item:hover .availability-day {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.05);
}

/* Textarea */
.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: all 0.2s ease;
}

.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea::placeholder {
  color: #9ca3af;
}

/* Character Counter */
.char-counter {
  text-align: right;
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}

.char-counter.valid {
  color: #10b981;
}

.char-counter.invalid {
  color: #ef4444;
}

/* Password Input */
.password-input-container {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
}

.password-toggle svg {
  width: 20px;
  height: 20px;
}

.password-requirements {
  margin-top: 8px;
}

.requirements-title {
  font-size: 12px;
  color: #6b7280;
  margin: 0 0 4px 0;
}

.requirements-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.requirements-list li {
  font-size: 12px;
  color: #ef4444;
  margin-bottom: 2px;
}

.requirements-list li.valid {
  color: #10b981;
}

.error-message {
  color: #ef4444;
  font-size: 14px;
  margin-top: 4px;
}

/* Footer */
.footer-section {
  text-align: center;
  margin-top: 20px;
}

.footer-section p {
  color: #6b7280;
  font-size: 14px;
  margin: 0;
}

.login-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
}

.login-link:hover {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 768px) {
  .signup-container {
    max-width: 100%;
  }
  
  .signup-card {
    padding: 30px 20px;
  }
  
  .profile-options {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .security-badges {
    flex-direction: column;
    gap: 12px;
  }
  
  .document-upload-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .document-upload-card {
    max-width: none;
  }
  
  .availability-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
  }
  
  .availability-day {
    padding: 12px 4px;
    min-height: 60px;
  }
  
  .final-title {
    font-size: 24px;
  }
  
  .success-icon {
    width: 60px;
    height: 60px;
  }
  
  .success-icon svg {
    width: 30px;
    height: 30px;
  }
  
  .navigation-buttons {
    flex-direction: column;
  }
  
  .benefits-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .professional-benefits {
    padding: 24px 20px;
  }
  
  .professional-benefits h3 {
    font-size: 18px;
  }
  
  .benefit-item {
    padding: 14px;
  }
  
  .benefit-item span {
    font-size: 14px;
  }
}
</style>