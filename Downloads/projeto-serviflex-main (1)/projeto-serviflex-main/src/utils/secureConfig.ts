// Configuração segura para produção
const isProduction = import.meta.env.PROD;

// Função para log seguro - só mostra em desenvolvimento
export const secureLog = {
  info: (message: string, data?: any) => {
    if (!isProduction) {
      console.log(`ℹ️ ${message}`, data);
    }
  },
  
  warn: (message: string, data?: any) => {
    if (!isProduction) {
      console.warn(`⚠️ ${message}`, data);
    }
  },
  
  error: (message: string, data?: any) => {
    if (!isProduction) {
      console.error(`❌ ${message}`, data);
    }
  },
  
  success: (message: string, data?: any) => {
    if (!isProduction) {
      console.log(`✅ ${message}`, data);
    }
  }
};

// Função para mascarar dados sensíveis
export const maskSensitiveData = (data: any): any => {
  if (typeof data === 'string') {
    // Mascarar emails
    if (data.includes('@')) {
      const [username, domain] = data.split('@');
      return `${username.substring(0, 2)}***@${domain}`;
    }
    
    // Mascarar telefones
    if (data.includes('(') && data.includes(')')) {
      return data.replace(/\d{4}-\d{4}/, '****-****');
    }
    
    // Mascarar outras informações sensíveis
    if (data.length > 10) {
      return `${data.substring(0, 3)}***${data.substring(data.length - 3)}`;
    }
  }
  
  return data;
};

// Configurações de ambiente seguras
export const secureConfig = {
  // URLs públicas (podem ser expostas)
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  appUrl: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
  
  // Configurações de desenvolvimento
  isDevelopment: !isProduction,
  isProduction,
  
  // Função para obter configurações sem expor dados sensíveis
  getPublicConfig: () => ({
    environment: isProduction ? 'production' : 'development',
    version: '1.0.0',
    features: {
      auth: true,
      payments: true,
      notifications: true
    }
  })
};

// Interceptar console.log em produção para evitar vazamento de dados
if (isProduction) {
  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;
  
  console.log = (...args) => {
    // Em produção, só permite logs de sistema essenciais
    if (args[0]?.includes?.('System:') || args[0]?.includes?.('Error:')) {
      originalLog(...args);
    }
  };
  
  console.warn = (...args) => {
    // Permite warnings em produção
    originalWarn(...args);
  };
  
  console.error = (...args) => {
    // Permite errors em produção
    originalError(...args);
  };
}

export default secureConfig;