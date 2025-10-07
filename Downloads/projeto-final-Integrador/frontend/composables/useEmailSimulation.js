// Composable para simular envio de emails (desenvolvimento)
export const useEmailSimulation = () => {
  
  // Simular envio de email de verificação
  const simulateVerificationEmail = (email, userType) => {
    const verificationUrl = `${window.location.origin}/auth/verify-email?token=simulated_token&type=signup&email=${encodeURIComponent(email)}`
    
    console.log('📧 EMAIL DE VERIFICAÇÃO SIMULADO')
    console.log('================================')
    console.log(`Para: ${email}`)
    console.log(`Tipo de usuário: ${userType}`)
    console.log(`Link de verificação: ${verificationUrl}`)
    console.log('================================')
    
    // Mostrar notificação visual
    if (typeof window !== 'undefined') {
      const notification = document.createElement('div')
      notification.innerHTML = `
        <div style="
          position: fixed;
          top: 20px;
          right: 20px;
          background: #10b981;
          color: white;
          padding: 16px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          z-index: 10000;
          max-width: 400px;
          font-family: system-ui, -apple-system, sans-serif;
        ">
          <div style="font-weight: 600; margin-bottom: 8px;">
            📧 Email de Verificação Enviado!
          </div>
          <div style="font-size: 14px; opacity: 0.9; margin-bottom: 12px;">
            Verifique o console do navegador para ver o link de verificação.
          </div>
          <button onclick="this.parentElement.parentElement.remove()" style="
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
          ">
            Fechar
          </button>
        </div>
      `
      document.body.appendChild(notification)
      
      // Auto remover após 10 segundos
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove()
        }
      }, 10000)
    }
    
    return { success: true }
  }

  // Simular verificação de token
  const simulateTokenVerification = (token) => {
    console.log('🔐 VERIFICAÇÃO DE TOKEN SIMULADA')
    console.log('===============================')
    console.log(`Token: ${token}`)
    console.log('Status: Token válido (simulado)')
    console.log('===============================')
    
    return { success: true, verified: true }
  }

  return {
    simulateVerificationEmail,
    simulateTokenVerification
  }
}