import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Serviço para envio de emails
 * Os emails são enviados através de Cloud Functions que monitoram a coleção 'emailQueue'
 */

interface EmailData {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

class EmailService {
  private readonly EMAIL_QUEUE_COLLECTION = "emailQueue";

  /**
   * Envia um email adicionando à fila de processamento
   */
  async sendEmail(emailData: EmailData): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.EMAIL_QUEUE_COLLECTION), {
        ...emailData,
        from: emailData.from || "ServiFlex <noreply@serviflex.com>",
        createdAt: Timestamp.now(),
        processed: false,
        attempts: 0,
      });

      console.log("✅ Email adicionado à fila:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("❌ Erro ao adicionar email à fila:", error);
      throw error;
    }
  }

  /**
   * Envia email de cancelamento de serviço
   * NOTA: Requer Firebase Functions (plano Blaze pago)
   * Alternativa: Use emailSender.ts com EmailJS (gratuito)
   */
  async sendCancellationEmail(
    professionalEmail: string,
    professionalName: string,
    clientName: string,
    serviceType: string,
    reason: string
  ): Promise<void> {
    const subject = "❌ Solicitação de Serviço Cancelada - ServiFlex";

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">❌ Serviço Cancelado</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1f2937;">Olá ${professionalName},</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            Informamos que <strong>${clientName}</strong> cancelou a solicitação do serviço de <strong>${serviceType}</strong>.
          </p>
          <div style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 8px;">
            <p style="color: #991b1b; margin: 0;">
              <strong>Motivo do cancelamento:</strong><br>
              ${reason}
            </p>
          </div>
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
            Não se preocupe! Você continuará recebendo novas solicitações de serviço através da plataforma.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://serviflex.com/profissional/servicos" 
               style="background: #2563EB; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
              Ver Minhas Solicitações
            </a>
          </div>
        </div>
        <div style="background: #e5e7eb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
          <p>ServiFlex - Conectando você aos melhores profissionais</p>
          <p style="margin-top: 10px;">
            <a href="https://serviflex.com" style="color: #2563EB; text-decoration: none;">Acessar Plataforma</a>
          </p>
        </div>
      </div>
    `;

    await this.sendEmail({
      to: professionalEmail,
      subject,
      html,
    });
  }

  /**
   * Envia email de nova solicitação
   */
  async sendNewRequestEmail(
    professionalEmail: string,
    professionalName: string,
    clientName: string,
    serviceType: string
  ): Promise<void> {
    const subject = "🔔 Nova Solicitação de Serviço - ServiFlex";

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #2563EB 0%, #1e40af 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">🔔 Nova Solicitação!</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1f2937;">Olá ${professionalName}!</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            <strong>${clientName}</strong> solicitou um serviço de <strong>${serviceType}</strong>.
          </p>
          <div style="background: #dbeafe; border-left: 4px solid #2563EB; padding: 15px; margin: 20px 0; border-radius: 8px;">
            <p style="color: #1e40af; margin: 0;">
              <strong>Ação necessária:</strong><br>
              Acesse a plataforma para aceitar ou recusar esta solicitação.
            </p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://serviflex.com/profissional/servicos" 
               style="background: #2563EB; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
              Ver Solicitação
            </a>
          </div>
        </div>
        <div style="background: #e5e7eb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
          <p>ServiFlex - Conectando você aos melhores profissionais</p>
        </div>
      </div>
    `;

    await this.sendEmail({
      to: professionalEmail,
      subject,
      html,
    });
  }
}

export const emailService = new EmailService();
