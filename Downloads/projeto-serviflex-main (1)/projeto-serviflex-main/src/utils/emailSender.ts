/**
 * Serviço de envio de emails usando EmailJS (gratuito)
 * Alternativa ao Firebase Functions que requer billing
 */

interface EmailParams {
  to_email: string;
  to_name: string;
  subject: string;
  message: string;
  action_url?: string;
}

class EmailSender {
  private serviceId = 'service_serviflex'; // Você vai configurar no EmailJS
  private templateId = 'template_notification'; // Você vai configurar no EmailJS
  private publicKey = 'YOUR_EMAILJS_PUBLIC_KEY'; // Você vai pegar no EmailJS

  /**
   * Envia email usando EmailJS
   */
  async sendEmail(params: EmailParams): Promise<boolean> {
    try {
      // Carregar EmailJS dinamicamente
      const emailjs = await this.loadEmailJS();
      
      await emailjs.send(
        this.serviceId,
        this.templateId,
        params,
        this.publicKey
      );

      console.log('✅ Email enviado com sucesso');
      return true;
    } catch (error) {
      console.error('❌ Erro ao enviar email:', error);
      return false;
    }
  }

  /**
   * Carrega a biblioteca EmailJS dinamicamente
   */
  private async loadEmailJS(): Promise<any> {
    if ((window as any).emailjs) {
      return (window as any).emailjs;
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
      script.onload = () => resolve((window as any).emailjs);
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  /**
   * Envia notificação de cancelamento
   */
  async sendCancellationNotification(
    professionalEmail: string,
    professionalName: string,
    clientName: string,
    serviceType: string,
    reason: string
  ): Promise<boolean> {
    return this.sendEmail({
      to_email: professionalEmail,
      to_name: professionalName,
      subject: '❌ Solicitação de Serviço Cancelada - ServiFlex',
      message: `${clientName} cancelou a solicitação do serviço de ${serviceType}.\n\nMotivo: ${reason}`,
      action_url: 'https://serviflex.com/profissional/servicos'
    });
  }

  /**
   * Envia notificação de nova solicitação
   */
  async sendNewRequestNotification(
    professionalEmail: string,
    professionalName: string,
    clientName: string,
    serviceType: string
  ): Promise<boolean> {
    return this.sendEmail({
      to_email: professionalEmail,
      to_name: professionalName,
      subject: '🔔 Nova Solicitação de Serviço - ServiFlex',
      message: `${clientName} solicitou um serviço de ${serviceType}. Acesse a plataforma para aceitar ou recusar.`,
      action_url: 'https://serviflex.com/profissional/servicos'
    });
  }
}

export const emailSender = new EmailSender();
