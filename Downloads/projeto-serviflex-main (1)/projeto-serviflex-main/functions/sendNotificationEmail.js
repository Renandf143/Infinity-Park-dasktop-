/**
 * Cloud Function para enviar e-mails quando notificações são criadas
 * 
 * Trigger: Quando um documento é criado em serviceNotifications
 * Ação: Envia e-mail para o usuário
 * 
 * Migrado de functions.config() para .env
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

// Configurar transporter do nodemailer usando variáveis de ambiente
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURITY === 'SSL/TLS', // true para 465, false para outros
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

exports.sendNotificationEmail = functions.firestore
  .document('serviceNotifications/{notificationId}')
  .onCreate(async (snap, context) => {
    try {
      const notification = snap.data();
      const notificationId = context.params.notificationId;

      console.log('📧 Nova notificação criada:', notificationId);

      // Buscar dados do usuário
      const userDoc = await admin.firestore()
        .collection('users')
        .doc(notification.userId)
        .get();

      if (!userDoc.exists) {
        console.log('❌ Usuário não encontrado:', notification.userId);
        return null;
      }

      const userData = userDoc.data();
      const userEmail = userData.email;
      const userName = userData.name || userData.displayName || 'Usuário';

      if (!userEmail) {
        console.log('❌ E-mail não encontrado para o usuário');
        return null;
      }

      // Montar o e-mail baseado no tipo de notificação
      const emailContent = getEmailContent(notification, userName);

      // Configurar email com remetente customizado
      const defaultFrom = process.env.SMTP_FROM || '"ServiFlex" <noreply@serviflex.com>';

      const mailOptions = {
        from: defaultFrom,
        to: userEmail,
        subject: emailContent.subject,
        html: emailContent.html
      };

      await transporter.sendMail(mailOptions);

      console.log('✅ E-mail enviado para:', userEmail);

      // Marcar que o e-mail foi enviado
      await snap.ref.update({
        emailSent: true,
        emailSentAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return null;
    } catch (error) {
      console.error('❌ Erro ao enviar e-mail:', error);
      return null;
    }
  });

/**
 * Gera o conteúdo do e-mail baseado no tipo de notificação
 */
function getEmailContent(notification, userName) {
  const baseUrl = 'https://serviflex.com'; // Altere para sua URL

  const templates = {
    request: {
      subject: '🔔 Nova Solicitação de Serviço - ServiFlex',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2563EB 0%, #1e40af 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">ServiFlex</h1>
          </div>
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #1f2937;">Olá ${userName}!</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              ${notification.message}
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${baseUrl}${notification.actionUrl}" 
                 style="background: #2563EB; color: white; padding: 15px 30px; tex
t-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                Ver Detalhes
              </a>
            </div>
          </div>
          <div style="background: #e5e7eb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
            <p>ServiFlex - Conectando você aos melhores profissionais</p>
          </div>
        </div>
      `
    },
    acceptance: {
      subject: '✅ Serviço Aceito - ServiFlex',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">✅ Serviço Aceito!</h1>
          </div>
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #1f2937;">Ótimas notícias, ${userName}!</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              ${notification.message}
            </p>
            <div style="background: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 8px;">
              <p style="color: #065f46; margin: 0;">
                <strong>Próximos passos:</strong><br>
                O profissional entrará em contato com você em breve para confirmar os detalhes.
              </p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${baseUrl}${notification.actionUrl}" 
                 style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                Ver Serviço
              </a>
            </div>
          </div>
          <div style="background: #e5e7eb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
            <p>ServiFlex - Conectando você aos melhores profissionais</p>
          </div>
        </div>
      `
    },
    reminder: {
      subject: '⏰ Lembrete: Serviço em Breve - ServiFlex',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; text-align: center;
">
            <h1 style="color: white; margin: 0;">⏰ Lembrete</h1>
          </div>
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #1f2937;">Olá ${userName}!</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              ${notification.message}
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${baseUrl}${notification.actionUrl}" 
                 style="background: #f59e0b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                Ver Detalhes
              </a>
            </div>
          </div>
          <div style="background: #e5e7eb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
            <p>ServiFlex - Conectando você aos melhores profissionais</p>
          </div>
        </div>
      `
    },
    start: {
      subject: '🚀 Serviço Iniciado - ServiFlex',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">🚀 Serviço Iniciado!</h1>
          </div>
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #1f2937;">Olá ${userName}!</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              ${notification.message}
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${baseUrl}${notification.actionUrl}" 
                 style="background: #8b5cf6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                Acompanhar Serviço
              </a>
            </div>
          </div>
          <div style="background: #e5e7eb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
            <p>ServiFlex - Conectando você aos melhores profissionais</p>
          </div>
        </div>
      `
    },
    completion: {
      subject: '✅ Serviço Concluído - ServiFlex',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">✅ Serviço Concluído!</h1>
          </div>
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #1f2937;">Olá ${userName}!</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              ${notification.message}
            </p>
            <div style="background: #e0e7ff; border-left: 4px solid #6366f1; padding: 15px; margin: 20px 0; border-radius: 8px;">
              <p style="color: #3730a3; margin: 0;">
                <strong>Próximo passo:</strong><br>
                Realize o pagamento via PIX e confirme na plataforma.
              </p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${baseUrl}${notification.actionUrl}" 
                 style="background: #6366f1; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8p
x; display: inline-block; font-weight: bold;">
                Realizar Pagamento
              </a>
            </div>
          </div>
          <div style="background: #e5e7eb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
            <p>ServiFlex - Conectando você aos melhores profissionais</p>
          </div>
        </div>
      `
    },
    payment: {
      subject: '💰 Pagamento Recebido - ServiFlex',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">💰 Pagamento Confirmado!</h1>
          </div>
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #1f2937;">Parabéns, ${userName}!</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              ${notification.message}
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${baseUrl}${notification.actionUrl}" 
                 style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                Ver Detalhes
              </a>
            </div>
          </div>
          <div style="background: #e5e7eb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
            <p>ServiFlex - Conectando você aos melhores profissionais</p>
          </div>
        </div>
      `
    },
    cancellation: {
      subject: '❌ Solicitação de Serviço Cancelada - ServiFlex',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">❌ Serviço Cancelado</h1>
          </div>
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #1f2937;">Olá ${userName},</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              ${notification.message}
            </p>
            <div style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 8px;">
              <p style="color: #991b1b; margin: 0;">
                <strong>Motivo do cancelamento:</strong><br>
                ${notification.data?.reason || 'Não informado'}
              </p>
            </div>
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
              Não se preocupe! Você pode continuar recebendo novas solicitações de serviço através da plataforma.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${baseUrl}/profissional/servicos" 
                 style="background: #2563EB; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                Ver Minhas Solicitações
              </a>
            </div>
          </div>
          <div style="background: #e5e7eb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
            <p>ServiFlex - Conectando você aos melhores profissionais</p>
            <p style="margin-top: 10px;">
              <a href="${baseUrl}" style="color: #2563EB; text-decoration: none;">Acessar Plataforma</a>
            </p>
          </div>
        </div>
      `
    }
  };

  return templates[notification.type] || templates.request;
}
