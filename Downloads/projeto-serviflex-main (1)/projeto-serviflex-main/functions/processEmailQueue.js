/**
 * Cloud Function para processar fila de emails
 * 
 * Trigger: Quando um documento é criado em emailQueue
 * Ação: Envia o email e marca como processado
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

// Inicializar Admin SDK se ainda não foi inicializado
if (!admin.apps.length) {
  admin.initializeApp();
}

// Configurar transporter do nodemailer
// IMPORTANTE: Configure suas credenciais SMTP no Firebase Functions config
const getTransporter = () => {
  const smtpConfig = functions.config().smtp;
  
  if (smtpConfig && smtpConfig.host) {
    // Configuração SMTP customizada
    return nodemailer.createTransport({
      host: smtpConfig.host,
      port: parseInt(smtpConfig.port) || 587,
      secure: smtpConfig.security === 'SSL/TLS', // true para 465, false para outros
      auth: {
        user: smtpConfig.user,
        pass: smtpConfig.password
      }
    });
  } else {
    // Fallback para Gmail (configuração antiga)
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: functions.config().email?.user || process.env.EMAIL_USER,
        pass: functions.config().email?.password || process.env.EMAIL_PASSWORD
      }
    });
  }
};

const transporter = getTransporter();

exports.processEmailQueue = functions.firestore
  .document('emailQueue/{emailId}')
  .onCreate(async (snap, context) => {
    try {
      const emailData = snap.data();
      const emailId = context.params.emailId;

      console.log('📧 Processando email da fila:', emailId);

      // Verificar se já foi processado
      if (emailData.processed) {
        console.log('⏭️ Email já foi processado, pulando...');
        return null;
      }

      // Configurar opções do email
      const smtpConfig = functions.config().smtp;
      const defaultFrom = smtpConfig?.from || '"ServiFlex" <noreply@serviflex.com>';
      
      const mailOptions = {
        from: emailData.from || defaultFrom,
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html
      };

      // Enviar email
      const info = await transporter.sendMail(mailOptions);

      console.log('✅ Email enviado com sucesso!');
      console.log('   Para:', emailData.to);
      console.log('   Assunto:', emailData.subject);
      console.log('   Message ID:', info.messageId);

      // Marcar como processado
      await snap.ref.update({
        processed: true,
        processedAt: admin.firestore.FieldValue.serverTimestamp(),
        messageId: info.messageId,
        attempts: (emailData.attempts || 0) + 1,
        lastAttemptAt: admin.firestore.FieldValue.serverTimestamp(),
        error: null
      });

      return null;
    } catch (error) {
      console.error('❌ Erro ao enviar email:', error);

      // Atualizar documento com erro
      await snap.ref.update({
        attempts: (snap.data().attempts || 0) + 1,
        lastAttemptAt: admin.firestore.FieldValue.serverTimestamp(),
        error: error.message,
        errorCode: error.code
      });

      // Se falhou 3 vezes, marcar como falha permanente
      if ((snap.data().attempts || 0) >= 2) {
        await snap.ref.update({
          processed: true,
          failed: true,
          failedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        console.error('❌ Email falhou após 3 tentativas');
      }

      return null;
    }
  });

// Função para verificar configuração de email
// Execute: firebase functions:config:set smtp.host="..." smtp.port="..." smtp.user="..." smtp.password="..." smtp.from="..."
exports.getEmailConfig = functions.https.onRequest((req, res) => {
  const smtpConfig = functions.config().smtp;
  const emailConfig = functions.config().email;
  
  res.json({
    smtp: {
      configured: !!smtpConfig?.host,
      host: smtpConfig?.host || 'não configurado',
      port: smtpConfig?.port || 'não configurado',
      user: smtpConfig?.user ? '***' + smtpConfig.user.slice(-10) : 'não configurado',
      from: smtpConfig?.from || 'não configurado',
      security: smtpConfig?.security || 'não configurado'
    },
    gmail_fallback: {
      configured: !!emailConfig?.user,
      user: emailConfig?.user ? '***' + emailConfig.user.slice(-10) : 'não configurado'
    }
  });
});
