// Sistema avançado de templates de email
export default defineEventHandler(async (event) => {
  const { type, data } = await readBody(event)
  
  const templates = {
    // Template de boas-vindas para clientes
    welcome_client: {
      subject: `🎉 Bem-vindo ao Servifflix, ${data.name}!`,
      html: generateWelcomeClientTemplate(data),
      text: generateWelcomeClientText(data)
    },
    
    // Template de boas-vindas para profissionais
    welcome_professional: {
      subject: `🚀 Sua jornada profissional começa agora, ${data.name}!`,
      html: generateWelcomeProfessionalTemplate(data),
      text: generateWelcomeProfessionalText(data)
    },
    
    // Template de verificação de email
    email_verification: {
      subject: `🔐 Confirme seu email - Servifflix`,
      html: generateEmailVerificationTemplate(data),
      text: generateEmailVerificationText(data)
    },
    
    // Template de documentos aprovados
    documents_approved: {
      subject: `✅ Documentos aprovados - Sua conta está ativa!`,
      html: generateDocumentsApprovedTemplate(data),
      text: generateDocumentsApprovedText(data)
    },
    
    // Template de documentos rejeitados
    documents_rejected: {
      subject: `❌ Documentos precisam ser reenviados`,
      html: generateDocumentsRejectedTemplate(data),
      text: generateDocumentsRejectedText(data)
    },
    
    // Template de primeiro serviço contratado
    first_service_hired: {
      subject: `🎊 Parabéns! Seu primeiro serviço foi contratado!`,
      html: generateFirstServiceTemplate(data),
      text: generateFirstServiceText(data)
    },
    
    // Template de lembrete de perfil incompleto
    profile_incomplete: {
      subject: `⚠️ Complete seu perfil para receber mais clientes`,
      html: generateProfileIncompleteTemplate(data),
      text: generateProfileIncompleteText(data)
    }
  }
  
  return templates[type] || { error: 'Template não encontrado' }
})

// Template de boas-vindas para clientes
function generateWelcomeClientTemplate(data) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bem-vindo ao Servifflix</title>
        <style>
            ${getEmailStyles()}
        </style>
    </head>
    <body>
        <div class="email-container">
            <!-- Header -->
            <div class="email-header">
                <div class="logo">
                    <h1>Servifflix</h1>
                    <p>Conectando você aos melhores profissionais</p>
                </div>
            </div>
            
            <!-- Hero Section -->
            <div class="hero-section">
                <div class="hero-icon">🎉</div>
                <h2>Bem-vindo, ${data.name}!</h2>
                <p>Sua conta foi criada com sucesso. Agora você pode encontrar os melhores profissionais de Ceilândia.</p>
            </div>
            
            <!-- Verification Button -->
            <div class="cta-section">
                <a href="${data.verificationUrl}" class="cta-button">
                    Confirmar Email e Ativar Conta
                </a>
                <p class="cta-subtitle">Clique no botão acima para verificar seu email</p>
            </div>
            
            <!-- Benefits Section -->
            <div class="benefits-section">
                <h3>O que você pode fazer agora:</h3>
                <div class="benefits-grid">
                    <div class="benefit-item">
                        <div class="benefit-icon">🔍</div>
                        <h4>Buscar Profissionais</h4>
                        <p>Encontre especialistas verificados em diversas áreas</p>
                    </div>
                    <div class="benefit-item">
                        <div class="benefit-icon">⭐</div>
                        <h4>Ver Avaliações</h4>
                        <p>Confira avaliações reais de outros clientes</p>
                    </div>
                    <div class="benefit-item">
                        <div class="benefit-icon">💬</div>
                        <h4>Chat Direto</h4>
                        <p>Converse diretamente com os profissionais</p>
                    </div>
                    <div class="benefit-item">
                        <div class="benefit-icon">🛡️</div>
                        <h4>Pagamento Seguro</h4>
                        <p>Transações protegidas e garantidas</p>
                    </div>
                </div>
            </div>
            
            <!-- Quick Actions -->
            <div class="quick-actions">
                <h3>Primeiros Passos:</h3>
                <div class="action-list">
                    <div class="action-item">
                        <span class="step-number">1</span>
                        <div class="action-content">
                            <h4>Confirme seu email</h4>
                            <p>Clique no botão acima para ativar sua conta</p>
                        </div>
                    </div>
                    <div class="action-item">
                        <span class="step-number">2</span>
                        <div class="action-content">
                            <h4>Complete seu perfil</h4>
                            <p>Adicione foto e informações para uma experiência melhor</p>
                        </div>
                    </div>
                    <div class="action-item">
                        <span class="step-number">3</span>
                        <div class="action-content">
                            <h4>Encontre profissionais</h4>
                            <p>Use nossa busca avançada para encontrar o que precisa</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Footer -->
            ${getEmailFooter()}
        </div>
    </body>
    </html>
  `
}

// Template de boas-vindas para profissionais
function generateWelcomeProfessionalTemplate(data) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bem-vindo ao Servifflix - Profissional</title>
        <style>
            ${getEmailStyles()}
        </style>
    </head>
    <body>
        <div class="email-container">
            <!-- Header -->
            <div class="email-header professional">
                <div class="logo">
                    <h1>Servifflix</h1>
                    <p>Sua plataforma profissional</p>
                </div>
            </div>
            
            <!-- Hero Section -->
            <div class="hero-section">
                <div class="hero-icon">🚀</div>
                <h2>Bem-vindo, ${data.name}!</h2>
                <p>Sua conta profissional foi criada. Prepare-se para expandir seus negócios!</p>
                <div class="professional-badge">
                    <span class="badge-icon">⭐</span>
                    <span>Profissional ${data.profissao}</span>
                </div>
            </div>
            
            <!-- Verification Button -->
            <div class="cta-section">
                <a href="${data.verificationUrl}" class="cta-button professional">
                    Confirmar Email e Ativar Perfil
                </a>
                <p class="cta-subtitle">Ative sua conta para começar a receber clientes</p>
            </div>
            
            <!-- Professional Stats -->
            <div class="stats-section">
                <h3>Seu Perfil Profissional:</h3>
                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-number">${data.experiencia}</div>
                        <div class="stat-label">Experiência</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">R$ ${data.preco_hora}</div>
                        <div class="stat-label">Por Hora</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${data.disponibilidade?.length || 0}</div>
                        <div class="stat-label">Dias Disponíveis</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${data.cidade}</div>
                        <div class="stat-label">Localização</div>
                    </div>
                </div>
            </div>
            
            <!-- Professional Benefits -->
            <div class="benefits-section">
                <h3>Vantagens Exclusivas para Profissionais:</h3>
                <div class="benefits-grid">
                    <div class="benefit-item">
                        <div class="benefit-icon">💰</div>
                        <h4>Receba Pagamentos</h4>
                        <p>Sistema de pagamento seguro e rápido</p>
                    </div>
                    <div class="benefit-item">
                        <div class="benefit-icon">📅</div>
                        <h4>Gerencie Agenda</h4>
                        <p>Controle total dos seus horários</p>
                    </div>
                    <div class="benefit-item">
                        <div class="benefit-icon">📊</div>
                        <h4>Relatórios Detalhados</h4>
                        <p>Acompanhe seu desempenho e ganhos</p>
                    </div>
                    <div class="benefit-item">
                        <div class="benefit-icon">🎯</div>
                        <h4>Clientes Qualificados</h4>
                        <p>Receba solicitações de clientes verificados</p>
                    </div>
                </div>
            </div>
            
            <!-- Next Steps -->
            <div class="quick-actions">
                <h3>Próximos Passos para o Sucesso:</h3>
                <div class="action-list">
                    <div class="action-item">
                        <span class="step-number">1</span>
                        <div class="action-content">
                            <h4>Confirme seu email</h4>
                            <p>Ative sua conta para aparecer nas buscas</p>
                        </div>
                    </div>
                    <div class="action-item">
                        <span class="step-number">2</span>
                        <div class="action-content">
                            <h4>Aguarde aprovação dos documentos</h4>
                            <p>Analisaremos seus documentos em até 24h</p>
                        </div>
                    </div>
                    <div class="action-item">
                        <span class="step-number">3</span>
                        <div class="action-content">
                            <h4>Complete seu portfólio</h4>
                            <p>Adicione fotos dos seus trabalhos</p>
                        </div>
                    </div>
                    <div class="action-item">
                        <span class="step-number">4</span>
                        <div class="action-content">
                            <h4>Comece a receber clientes</h4>
                            <p>Sua conta aparecerá nas buscas automaticamente</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Footer -->
            ${getEmailFooter()}
        </div>
    </body>
    </html>
  `
}

// Template de verificação de email
function generateEmailVerificationTemplate(data) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirme seu Email - Servifflix</title>
        <style>
            ${getEmailStyles()}
        </style>
    </head>
    <body>
        <div class="email-container">
            <!-- Header -->
            <div class="email-header">
                <div class="logo">
                    <h1>Servifflix</h1>
                </div>
            </div>
            
            <!-- Verification Section -->
            <div class="verification-section">
                <div class="verification-icon">🔐</div>
                <h2>Confirme seu Email</h2>
                <p>Olá, ${data.name}! Para ativar sua conta e começar a usar o Servifflix, confirme seu email clicando no botão abaixo.</p>
                
                <a href="${data.verificationUrl}" class="verification-button">
                    Confirmar Email
                </a>
                
                <div class="verification-info">
                    <p><strong>Por que precisamos confirmar seu email?</strong></p>
                    <ul>
                        <li>Garantir a segurança da sua conta</li>
                        <li>Enviar notificações importantes</li>
                        <li>Recuperar sua senha se necessário</li>
                        <li>Manter você informado sobre seus serviços</li>
                    </ul>
                </div>
                
                <div class="security-notice">
                    <div class="notice-icon">⚠️</div>
                    <div class="notice-content">
                        <h4>Importante:</h4>
                        <p>Este link expira em 24 horas. Se você não solicitou esta conta, pode ignorar este email.</p>
                    </div>
                </div>
                
                <div class="manual-link">
                    <p>Se o botão não funcionar, copie e cole este link no seu navegador:</p>
                    <div class="link-box">
                        ${data.verificationUrl}
                    </div>
                </div>
            </div>
            
            <!-- Footer -->
            ${getEmailFooter()}
        </div>
    </body>
    </html>
  `
}

// Estilos CSS para emails
function getEmailStyles() {
  return `
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    
    body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        color: #374151;
        background-color: #f8fafc;
    }
    
    .email-container {
        max-width: 600px;
        margin: 0 auto;
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }
    
    .email-header {
        background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
        padding: 40px 30px;
        text-align: center;
        color: white;
    }
    
    .email-header.professional {
        background: linear-gradient(135deg, #059669 0%, #10b981 100%);
    }
    
    .logo h1 {
        font-size: 28px;
        font-weight: 800;
        margin-bottom: 8px;
    }
    
    .logo p {
        font-size: 16px;
        opacity: 0.9;
    }
    
    .hero-section {
        padding: 40px 30px;
        text-align: center;
    }
    
    .hero-icon {
        font-size: 48px;
        margin-bottom: 20px;
    }
    
    .hero-section h2 {
        font-size: 28px;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 16px;
    }
    
    .hero-section p {
        font-size: 18px;
        color: #6b7280;
        margin-bottom: 24px;
    }
    
    .professional-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: #10b981;
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-weight: 600;
        font-size: 14px;
    }
    
    .cta-section {
        padding: 0 30px 40px;
        text-align: center;
    }
    
    .cta-button {
        display: inline-block;
        background: #3b82f6;
        color: white;
        text-decoration: none;
        padding: 16px 32px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 16px;
        transition: background-color 0.3s ease;
    }
    
    .cta-button.professional {
        background: #10b981;
    }
    
    .cta-subtitle {
        font-size: 14px;
        color: #9ca3af;
    }
    
    .benefits-section, .stats-section, .quick-actions {
        padding: 40px 30px;
        border-top: 1px solid #e5e7eb;
    }
    
    .benefits-section h3, .stats-section h3, .quick-actions h3 {
        font-size: 20px;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 24px;
        text-align: center;
    }
    
    .benefits-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
    }
    
    .benefit-item {
        text-align: center;
        padding: 20px;
        background: #f8fafc;
        border-radius: 8px;
    }
    
    .benefit-icon {
        font-size: 32px;
        margin-bottom: 12px;
    }
    
    .benefit-item h4 {
        font-size: 16px;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 8px;
    }
    
    .benefit-item p {
        font-size: 14px;
        color: #6b7280;
    }
    
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
    }
    
    .stat-item {
        text-align: center;
        padding: 16px;
        background: #f0fdf4;
        border-radius: 8px;
    }
    
    .stat-number {
        font-size: 18px;
        font-weight: 700;
        color: #059669;
        margin-bottom: 4px;
    }
    
    .stat-label {
        font-size: 12px;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .action-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }
    
    .action-item {
        display: flex;
        align-items: flex-start;
        gap: 16px;
        padding: 16px;
        background: #f8fafc;
        border-radius: 8px;
    }
    
    .step-number {
        width: 32px;
        height: 32px;
        background: #3b82f6;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 14px;
        flex-shrink: 0;
    }
    
    .action-content h4 {
        font-size: 16px;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 4px;
    }
    
    .action-content p {
        font-size: 14px;
        color: #6b7280;
    }
    
    .verification-section {
        padding: 40px 30px;
        text-align: center;
    }
    
    .verification-icon {
        font-size: 64px;
        margin-bottom: 24px;
    }
    
    .verification-section h2 {
        font-size: 24px;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 16px;
    }
    
    .verification-section p {
        font-size: 16px;
        color: #6b7280;
        margin-bottom: 32px;
    }
    
    .verification-button {
        display: inline-block;
        background: #3b82f6;
        color: white;
        text-decoration: none;
        padding: 16px 32px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 32px;
    }
    
    .verification-info {
        background: #eff6ff;
        border: 1px solid #bfdbfe;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 24px;
        text-align: left;
    }
    
    .verification-info p {
        font-weight: 600;
        color: #1e40af;
        margin-bottom: 12px;
    }
    
    .verification-info ul {
        list-style: none;
        padding: 0;
    }
    
    .verification-info li {
        color: #1e40af;
        margin-bottom: 8px;
        padding-left: 20px;
        position: relative;
    }
    
    .verification-info li::before {
        content: '✓';
        position: absolute;
        left: 0;
        color: #10b981;
        font-weight: bold;
    }
    
    .security-notice {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        background: #fef3c7;
        border: 1px solid #fbbf24;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 24px;
        text-align: left;
    }
    
    .notice-icon {
        font-size: 20px;
        flex-shrink: 0;
    }
    
    .notice-content h4 {
        font-size: 14px;
        font-weight: 600;
        color: #92400e;
        margin-bottom: 4px;
    }
    
    .notice-content p {
        font-size: 14px;
        color: #92400e;
        margin: 0;
    }
    
    .manual-link {
        text-align: center;
    }
    
    .manual-link p {
        font-size: 14px;
        color: #6b7280;
        margin-bottom: 12px;
    }
    
    .link-box {
        background: #f3f4f6;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        padding: 12px;
        font-size: 12px;
        color: #374151;
        word-break: break-all;
        font-family: monospace;
    }
    
    .email-footer {
        background: #f8fafc;
        padding: 24px 30px;
        text-align: center;
        border-top: 1px solid #e5e7eb;
    }
    
    .email-footer p {
        font-size: 14px;
        color: #9ca3af;
        margin-bottom: 8px;
    }
    
    .email-footer a {
        color: #3b82f6;
        text-decoration: none;
    }
    
    @media (max-width: 600px) {
        .email-container {
            margin: 0 10px;
        }
        
        .email-header, .hero-section, .cta-section, .benefits-section, .stats-section, .quick-actions, .verification-section {
            padding: 30px 20px;
        }
        
        .benefits-grid {
            grid-template-columns: 1fr;
        }
        
        .stats-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }
  `
}

// Footer padrão para emails
function getEmailFooter() {
  return `
    <div class="email-footer">
        <p><strong>Servifflix</strong> - Conectando profissionais e clientes</p>
        <p>Este email foi enviado automaticamente. Não responda a este email.</p>
        <p>
            <a href="https://servifflix.com">Visite nosso site</a> | 
            <a href="https://servifflix.com/suporte">Central de Ajuda</a> | 
            <a href="https://servifflix.com/unsubscribe">Cancelar emails</a>
        </p>
        <p style="margin-top: 16px; font-size: 12px;">
            © 2025 Servifflix. Todos os direitos reservados.<br>
            Ceilândia, Brasília - DF
        </p>
    </div>
  `
}

// Funções para gerar versões em texto simples
function generateWelcomeClientText(data) {
  return `
Bem-vindo ao Servifflix, ${data.name}!

Sua conta foi criada com sucesso. Agora você pode encontrar os melhores profissionais de Ceilândia.

Para ativar sua conta, acesse: ${data.verificationUrl}

O que você pode fazer agora:
- Buscar profissionais verificados
- Ver avaliações de outros clientes
- Conversar diretamente com profissionais
- Fazer pagamentos seguros

Primeiros passos:
1. Confirme seu email
2. Complete seu perfil
3. Encontre profissionais

Servifflix - Conectando você aos melhores profissionais
  `
}

function generateWelcomeProfessionalText(data) {
  return `
Bem-vindo ao Servifflix, ${data.name}!

Sua conta profissional foi criada. Prepare-se para expandir seus negócios!

Profissão: ${data.profissao}
Experiência: ${data.experiencia}
Preço por hora: R$ ${data.preco_hora}
Localização: ${data.cidade}

Para ativar sua conta, acesse: ${data.verificationUrl}

Vantagens exclusivas:
- Sistema de pagamento seguro
- Gerenciamento de agenda
- Relatórios detalhados
- Clientes qualificados

Próximos passos:
1. Confirme seu email
2. Aguarde aprovação dos documentos
3. Complete seu portfólio
4. Comece a receber clientes

Servifflix - Sua plataforma profissional
  `
}

function generateEmailVerificationText(data) {
  return `
Confirme seu Email - Servifflix

Olá, ${data.name}!

Para ativar sua conta e começar a usar o Servifflix, confirme seu email acessando:

${data.verificationUrl}

Por que precisamos confirmar seu email?
- Garantir a segurança da sua conta
- Enviar notificações importantes
- Recuperar sua senha se necessário
- Manter você informado sobre seus serviços

IMPORTANTE: Este link expira em 24 horas.

Servifflix - Conectando profissionais e clientes
  `
}

function generateDocumentsApprovedText(data) {
  return `
Documentos Aprovados - Servifflix

Parabéns, ${data.name}!

Seus documentos foram aprovados e sua conta está totalmente ativa.

Agora você pode:
- Receber solicitações de clientes
- Aparecer nas buscas
- Gerenciar sua agenda
- Receber pagamentos

Acesse sua conta: https://servifflix.com/dashboard

Servifflix - Sua plataforma profissional
  `
}

function generateDocumentsRejectedText(data) {
  return `
Documentos Precisam ser Reenviados - Servifflix

Olá, ${data.name},

Infelizmente seus documentos não puderam ser aprovados.

Motivo: ${data.rejectionReason}

Para reenviar seus documentos:
1. Acesse sua conta
2. Vá em "Meus Documentos"
3. Faça upload dos documentos corrigidos

Precisa de ajuda? Entre em contato: suporte@servifflix.com

Servifflix - Estamos aqui para ajudar
  `
}

function generateFirstServiceText(data) {
  return `
Parabéns! Seu Primeiro Serviço foi Contratado - Servifflix

${data.name}, você recebeu sua primeira contratação!

Cliente: ${data.clientName}
Serviço: ${data.serviceName}
Valor: R$ ${data.serviceValue}
Data: ${data.serviceDate}

Próximos passos:
1. Entre em contato com o cliente
2. Confirme os detalhes do serviço
3. Execute o trabalho com excelência
4. Receba sua avaliação

Acesse sua agenda: https://servifflix.com/agenda

Servifflix - Seu sucesso é nosso sucesso!
  `
}

function generateProfileIncompleteText(data) {
  return `
Complete seu Perfil - Servifflix

Olá, ${data.name},

Seu perfil está ${data.completionPercentage}% completo.

Para receber mais clientes, complete:
${data.missingFields.map(field => `- ${field}`).join('\n')}

Perfis completos recebem 3x mais contratações!

Complete agora: https://servifflix.com/perfil

Servifflix - Maximize suas oportunidades
  `
}