import nodemailer from 'nodemailer'
import { Resend } from 'resend'

// Sistema avançado de envio de emails com fallback
export default defineEventHandler(async (event) => {
  const { to, template, data, priority = 'normal' } = await readBody(event)
  
  try {
    // 1. Gerar template
    const emailContent = await generateEmailTemplate(template, data)
    if (!emailContent) {
      throw new Error('Template não encontrado')
    }
    
    // 2. Escolher provedor baseado na prioridade
    const provider = selectEmailProvider(priority)
    
    // 3. Enviar email
    const result = await sendEmailWithProvider(provider, {
      to,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text
    })
    
    // 4. Log do envio
    await logEmailSent({
      to,
      template,
      provider: result.provider,
      messageId: result.messageId,
      status: 'sent',
      timestamp: new Date().toISOString()
    })
    
    return {
      success: true,
      messageId: result.messageId,
      provider: result.provider
    }
    
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    
    // Log do erro
    await logEmailError({
      to,
      template,
      error: error.message,
      timestamp: new Date().toISOString()
    })
    
    return {
      success: false,
      error: error.message
    }
  }
})

// Gerar template de email
async function generateEmailTemplate(template, data) {
  const templates = {
    welcome_client: () => ({
      subject: `🎉 Bem-vindo ao Servifflix, ${data.name}!`,
      html: generateWelcomeClientHTML(data),
      text: generateWelcomeClientText(data)
    }),
    welcome_professional: () => ({
      subject: `🚀 Sua jornada profissional começa agora, ${data.name}!`,
      html: generateWelcomeProfessionalHTML(data),
      text: generateWelcomeProfessionalText(data)
    }),
    email_verification: () => ({
      subject: `🔐 Confirme seu email - Servifflix`,
      html: generateEmailVerificationHTML(data),
      text: generateEmailVerificationText(data)
    }),
    documents_approved: () => ({
      subject: `✅ Documentos aprovados - Sua conta está ativa!`,
      html: generateDocumentsApprovedHTML(data),
      text: generateDocumentsApprovedText(data)
    }),
    documents_rejected: () => ({
      subject: `❌ Documentos precisam ser reenviados`,
      html: generateDocumentsRejectedHTML(data),
      text: generateDocumentsRejectedText(data)
    }),
    first_service_hired: () => ({
      subject: `🎊 Parabéns! Seu primeiro serviço foi contratado!`,
      html: generateFirstServiceHTML(data),
      text: generateFirstServiceText(data)
    }),
    profile_incomplete: () => ({
      subject: `⚠️ Complete seu perfil para receber mais clientes`,
      html: generateProfileIncompleteHTML(data),
      text: generateProfileIncompleteText(data)
    }),
    service_request: () => ({
      subject: `🔔 Nova solicitação de serviço!`,
      html: generateServiceRequestHTML(data),
      text: generateServiceRequestText(data)
    }),
    service_completed: () => ({
      subject: `✅ Serviço concluído - Avalie sua experiência`,
      html: generateServiceCompletedHTML(data),
      text: generateServiceCompletedText(data)
    }),
    payment_received: () => ({
      subject: `💰 Pagamento recebido - R$ ${data.amount}`,
      html: generatePaymentReceivedHTML(data),
      text: generatePaymentReceivedText(data)
    }),
    weekly_summary: () => ({
      subject: `📊 Seu resumo semanal - Servifflix`,
      html: generateWeeklySummaryHTML(data),
      text: generateWeeklySummaryText(data)
    }),
    password_reset: () => ({
      subject: `🔑 Redefinir senha - Servifflix`,
      html: generatePasswordResetHTML(data),
      text: generatePasswordResetText(data)
    })
  }
  
  return templates[template] ? templates[template]() : null
}

// Selecionar provedor de email baseado na prioridade
function selectEmailProvider(priority) {
  const providers = {
    high: ['resend', 'smtp_primary', 'smtp_backup'],
    normal: ['smtp_primary', 'resend', 'smtp_backup'],
    low: ['smtp_backup', 'smtp_primary', 'resend']
  }
  
  return providers[priority] || providers.normal
}

// Enviar email com fallback entre provedores
async function sendEmailWithProvider(providers, emailData) {
  for (const provider of providers) {
    try {
      const result = await sendWithSpecificProvider(provider, emailData)
      return { ...result, provider }
    } catch (error) {
      console.warn(`Falha no provedor ${provider}:`, error.message)
      continue
    }
  }
  
  throw new Error('Todos os provedores de email falharam')
}

// Enviar com provedor específico
async function sendWithSpecificProvider(provider, emailData) {
  switch (provider) {
    case 'resend':
      return await sendWithResend(emailData)
    case 'smtp_primary':
      return await sendWithSMTP('primary', emailData)
    case 'smtp_backup':
      return await sendWithSMTP('backup', emailData)
    default:
      throw new Error(`Provedor desconhecido: ${provider}`)
  }
}

// Enviar com Resend
async function sendWithResend(emailData) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  
  const result = await resend.emails.send({
    from: 'Servifflix <noreply@servifflix.com>',
    to: emailData.to,
    subject: emailData.subject,
    html: emailData.html,
    text: emailData.text,
    headers: {
      'X-Entity-Ref-ID': generateMessageId(),
    },
  })
  
  return { messageId: result.id }
}

// Enviar com SMTP
async function sendWithSMTP(config, emailData) {
  const configs = {
    primary: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    },
    backup: {
      host: process.env.SMTP_BACKUP_HOST || 'smtp.sendgrid.net',
      port: parseInt(process.env.SMTP_BACKUP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_BACKUP_USER,
        pass: process.env.SMTP_BACKUP_PASS
      }
    }
  }
  
  const transporter = nodemailer.createTransporter(configs[config])
  
  const result = await transporter.sendMail({
    from: `"Servifflix" <${configs[config].auth.user}>`,
    to: emailData.to,
    subject: emailData.subject,
    html: emailData.html,
    text: emailData.text,
    messageId: generateMessageId()
  })
  
  return { messageId: result.messageId }
}

// Gerar ID único para mensagem
function generateMessageId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}@servifflix.com`
}

// Log de email enviado
async function logEmailSent(logData) {
  // Aqui você pode salvar no banco de dados
  console.log('Email enviado:', logData)
  
  // Exemplo de salvamento no Supabase
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
    
    await supabase
      .from('email_logs')
      .insert({
        recipient: logData.to,
        template: logData.template,
        provider: logData.provider,
        message_id: logData.messageId,
        status: logData.status,
        sent_at: logData.timestamp
      })
  } catch (error) {
    console.error('Erro ao salvar log:', error)
  }
}

// Log de erro de email
async function logEmailError(errorData) {
  console.error('Erro no email:', errorData)
  
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
    
    await supabase
      .from('email_logs')
      .insert({
        recipient: errorData.to,
        template: errorData.template,
        status: 'failed',
        error_message: errorData.error,
        sent_at: errorData.timestamp
      })
  } catch (error) {
    console.error('Erro ao salvar log de erro:', error)
  }
}

// Templates HTML (versões simplificadas - você pode expandir)
function generateWelcomeClientHTML(data) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 40px; text-align: center; color: white;">
        <h1 style="font-size: 28px; margin: 0;">Servifflix</h1>
        <p style="margin: 8px 0 0 0;">Conectando você aos melhores profissionais</p>
      </div>
      
      <div style="padding: 40px; text-align: center;">
        <div style="font-size: 48px; margin-bottom: 20px;">🎉</div>
        <h2 style="color: #1f2937; margin-bottom: 16px;">Bem-vindo, ${data.name}!</h2>
        <p style="color: #6b7280; font-size: 18px; margin-bottom: 32px;">
          Sua conta foi criada com sucesso. Agora você pode encontrar os melhores profissionais de Ceilândia.
        </p>
        
        <a href="${data.verificationUrl}" style="display: inline-block; background: #3b82f6; color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600;">
          Confirmar Email e Ativar Conta
        </a>
      </div>
    </div>
  `
}

function generateWelcomeProfessionalHTML(data) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 40px; text-align: center; color: white;">
        <h1 style="font-size: 28px; margin: 0;">Servifflix</h1>
        <p style="margin: 8px 0 0 0;">Sua plataforma profissional</p>
      </div>
      
      <div style="padding: 40px; text-align: center;">
        <div style="font-size: 48px; margin-bottom: 20px;">🚀</div>
        <h2 style="color: #1f2937; margin-bottom: 16px;">Bem-vindo, ${data.name}!</h2>
        <p style="color: #6b7280; font-size: 18px; margin-bottom: 24px;">
          Sua conta profissional foi criada. Prepare-se para expandir seus negócios!
        </p>
        
        <div style="background: #10b981; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; margin-bottom: 32px;">
          ⭐ Profissional ${data.profissao}
        </div>
        
        <br>
        
        <a href="${data.verificationUrl}" style="display: inline-block; background: #10b981; color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600;">
          Confirmar Email e Ativar Perfil
        </a>
      </div>
    </div>
  `
}

function generateEmailVerificationHTML(data) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 40px; text-align: center; color: white;">
        <h1 style="font-size: 28px; margin: 0;">Servifflix</h1>
      </div>
      
      <div style="padding: 40px; text-align: center;">
        <div style="font-size: 64px; margin-bottom: 24px;">🔐</div>
        <h2 style="color: #1f2937; margin-bottom: 16px;">Confirme seu Email</h2>
        <p style="color: #6b7280; font-size: 16px; margin-bottom: 32px;">
          Olá, ${data.name}! Para ativar sua conta e começar a usar o Servifflix, confirme seu email clicando no botão abaixo.
        </p>
        
        <a href="${data.verificationUrl}" style="display: inline-block; background: #3b82f6; color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; margin-bottom: 32px;">
          Confirmar Email
        </a>
        
        <div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <p style="color: #92400e; margin: 0;"><strong>⚠️ Importante:</strong> Este link expira em 24 horas.</p>
        </div>
      </div>
    </div>
  `
}

// Adicionar mais templates conforme necessário...
function generateDocumentsApprovedHTML(data) {
  return `<div>Documentos aprovados para ${data.name}</div>`
}

function generateDocumentsRejectedHTML(data) {
  return `<div>Documentos rejeitados para ${data.name}</div>`
}

function generateFirstServiceHTML(data) {
  return `<div>Primeiro serviço para ${data.name}</div>`
}

function generateProfileIncompleteHTML(data) {
  return `<div>Perfil incompleto para ${data.name}</div>`
}

function generateServiceRequestHTML(data) {
  return `<div>Nova solicitação para ${data.name}</div>`
}

function generateServiceCompletedHTML(data) {
  return `<div>Serviço concluído para ${data.name}</div>`
}

function generatePaymentReceivedHTML(data) {
  return `<div>Pagamento recebido para ${data.name}</div>`
}

function generateWeeklySummaryHTML(data) {
  return `<div>Resumo semanal para ${data.name}</div>`
}

function generatePasswordResetHTML(data) {
  return `<div>Reset de senha para ${data.name}</div>`
}

// Versões em texto simples
function generateWelcomeClientText(data) {
  return `Bem-vindo ao Servifflix, ${data.name}! Confirme seu email: ${data.verificationUrl}`
}

function generateWelcomeProfessionalText(data) {
  return `Bem-vindo, profissional ${data.name}! Confirme seu email: ${data.verificationUrl}`
}

function generateEmailVerificationText(data) {
  return `Confirme seu email, ${data.name}: ${data.verificationUrl}`
}

function generateDocumentsApprovedText(data) {
  return `Documentos aprovados, ${data.name}!`
}

function generateDocumentsRejectedText(data) {
  return `Documentos rejeitados, ${data.name}. Motivo: ${data.rejectionReason}`
}

function generateFirstServiceText(data) {
  return `Primeiro serviço contratado, ${data.name}!`
}

function generateProfileIncompleteText(data) {
  return `Complete seu perfil, ${data.name}!`
}

function generateServiceRequestText(data) {
  return `Nova solicitação de serviço, ${data.name}!`
}

function generateServiceCompletedText(data) {
  return `Serviço concluído, ${data.name}!`
}

function generatePaymentReceivedText(data) {
  return `Pagamento recebido: R$ ${data.amount}, ${data.name}!`
}

function generateWeeklySummaryText(data) {
  return `Seu resumo semanal, ${data.name}!`
}

function generatePasswordResetText(data) {
  return `Reset de senha, ${data.name}: ${data.resetUrl}`
}