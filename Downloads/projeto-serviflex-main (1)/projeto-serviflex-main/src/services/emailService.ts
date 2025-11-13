import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

class EmailService {
  private readonly companyEmail = import.meta.env.VITE_COMPANY_EMAIL || 'suporteserviflix@gmail.com';

  /**
   * Enviar mensagem de contato
   */
  async sendContactMessage(data: ContactFormData): Promise<boolean> {
    try {
      console.log('📧 Enviando mensagem de contato...');

      // Salvar no Firestore (coleção de mensagens de contato)
      await addDoc(collection(db, 'contactMessages'), {
        ...data,
        status: 'pending',
        createdAt: serverTimestamp(),
        readAt: null,
      });

      console.log('✅ Mensagem salva no Firestore');

      // Tentar enviar email via Cloud Function (se existir)
      try {
        const response = await fetch('/api/send-contact-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: this.companyEmail,
            from: data.email,
            subject: `[Contato] ${data.subject}`,
            html: this.generateEmailHTML(data),
          }),
        });

        if (response.ok) {
          console.log('✅ Email enviado com sucesso');
        } else {
          console.warn('⚠️ Erro ao enviar email, mas mensagem foi salva');
        }
      } catch (emailError) {
        console.warn('⚠️ Serviço de email não disponível, mas mensagem foi salva:', emailError);
      }

      return true;
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem:', error);
      return false;
    }
  }

  /**
   * Gerar HTML do email
   */
  private generateEmailHTML(data: ContactFormData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
          }
          .header {
            background: linear-gradient(135deg, #2563EB 0%, #1E40AF 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: white;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .field {
            margin-bottom: 20px;
          }
          .label {
            font-weight: bold;
            color: #2563EB;
            margin-bottom: 5px;
          }
          .value {
            padding: 10px;
            background-color: #f5f5f5;
            border-left: 3px solid #2563EB;
            border-radius: 5px;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            color: #666;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📧 Nova Mensagem de Contato</h1>
            <p>ServiFlex - Plataforma de Serviços</p>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">👤 Nome:</div>
              <div class="value">${data.name}</div>
            </div>
            
            <div class="field">
              <div class="label">📧 Email:</div>
              <div class="value">${data.email}</div>
            </div>
            
            ${data.phone ? `
            <div class="field">
              <div class="label">📱 Telefone:</div>
              <div class="value">${data.phone}</div>
            </div>
            ` : ''}
            
            <div class="field">
              <div class="label">📋 Assunto:</div>
              <div class="value">${this.getSubjectLabel(data.subject)}</div>
            </div>
            
            <div class="field">
              <div class="label">💬 Mensagem:</div>
              <div class="value">${data.message.replace(/\n/g, '<br>')}</div>
            </div>
          </div>
          <div class="footer">
            <p>Esta mensagem foi enviada através do formulário de contato do ServiFlex</p>
            <p>Data: ${new Date().toLocaleString('pt-BR')}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Obter label do assunto
   */
  private getSubjectLabel(subject: string): string {
    const labels: { [key: string]: string } = {
      duvida: '❓ Dúvida',
      suporte: '🛠️ Suporte Técnico',
      parceria: '🤝 Parceria',
      sugestao: '💡 Sugestão',
      reclamacao: '⚠️ Reclamação',
    };
    return labels[subject] || subject;
  }

  /**
   * Buscar mensagens de contato (para admin)
   */
  async getContactMessages() {
    // Implementar se necessário
  }
}

export const emailService = new EmailService();
