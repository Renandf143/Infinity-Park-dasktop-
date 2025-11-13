/**
 * 🔒 CONTENT SECURITY POLICY (CSP)
 * Configurações de segurança para prevenir ataques XSS e injeção de código
 */

export const CSP_DIRECTIVES = {
  // Scripts permitidos
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Necessário para Vite em dev
    "'unsafe-eval'", // Necessário para Vite em dev
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
    'https://apis.google.com',
    'https://accounts.google.com'
  ],
  
  // Estilos permitidos
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Necessário para styled-components
    'https://fonts.googleapis.com'
  ],
  
  // Fontes permitidas
  'font-src': [
    "'self'",
    'https://fonts.gstatic.com',
    'data:'
  ],
  
  // Imagens permitidas
  'img-src': [
    "'self'",
    'data:',
    'blob:',
    'https://*.firebasestorage.app',
    'https://firebasestorage.googleapis.com',
    'https://www.google-analytics.com',
    'https://lh3.googleusercontent.com' // Google profile photos
  ],
  
  // Conexões permitidas
  'connect-src': [
    "'self'",
    'https://*.firebaseio.com',
    'https://*.googleapis.com',
    'https://*.google.com',
    'https://firestore.googleapis.com',
    'https://identitytoolkit.googleapis.com',
    'https://securetoken.googleapis.com',
    'wss://*.firebaseio.com'
  ],
  
  // Frames permitidos
  'frame-src': [
    "'self'",
    'https://accounts.google.com',
    'https://*.firebaseapp.com'
  ],
  
  // Objetos (Flash, etc) - bloqueados
  'object-src': ["'none'"],
  
  // Base URI
  'base-uri': ["'self'"],
  
  // Form actions
  'form-action': ["'self'"],
  
  // Frame ancestors (prevenir clickjacking)
  'frame-ancestors': ["'none'"],
  
  // Upgrade insecure requests
  'upgrade-insecure-requests': []
};

// Gerar string CSP
export function generateCSPString(): string {
  return Object.entries(CSP_DIRECTIVES)
    .map(([directive, values]) => {
      if (values.length === 0) {
        return directive;
      }
      return `${directive} ${values.join(' ')}`;
    })
    .join('; ');
}

// Headers de segurança adicionais
export const SECURITY_HEADERS = {
  // Prevenir clickjacking
  'X-Frame-Options': 'DENY',
  
  // Prevenir MIME sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // XSS Protection (legacy, mas ainda útil)
  'X-XSS-Protection': '1; mode=block',
  
  // Referrer Policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions Policy
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  
  // Strict Transport Security (HTTPS only)
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
};

/**
 * Aplicar headers de segurança no index.html
 * Adicione estas meta tags no <head>
 */
export const SECURITY_META_TAGS = `
  <!-- 🔒 Security Headers -->
  <meta http-equiv="Content-Security-Policy" content="${generateCSPString()}">
  <meta http-equiv="X-Content-Type-Options" content="nosniff">
  <meta http-equiv="X-Frame-Options" content="DENY">
  <meta http-equiv="X-XSS-Protection" content="1; mode=block">
  <meta name="referrer" content="strict-origin-when-cross-origin">
`;
