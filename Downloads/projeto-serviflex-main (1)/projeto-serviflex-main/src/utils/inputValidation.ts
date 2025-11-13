/**
 * 🔒 VALIDAÇÃO DE ENTRADA DE DADOS
 * Validações específicas para formulários da aplicação
 */

import { sanitizeInput, isValidEmail, isValidPhone, isValidCPF, isValidCNPJ } from './security';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Validar dados de registro de usuário
export function validateUserRegistration(data: {
  displayName: string;
  email: string;
  password: string;
  phone?: string;
}): ValidationResult {
  const errors: string[] = [];
  
  // Nome
  if (!data.displayName || data.displayName.trim().length < 3) {
    errors.push('Nome deve ter no mínimo 3 caracteres');
  }
  if (data.displayName && data.displayName.length > 100) {
    errors.push('Nome deve ter no máximo 100 caracteres');
  }
  
  // Email
  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Email inválido');
  }
  
  // Senha
  if (!data.password || data.password.length < 6) {
    errors.push('Senha deve ter no mínimo 6 caracteres');
  }
  if (data.password && data.password.length > 128) {
    errors.push('Senha muito longa');
  }
  
  // Telefone (opcional)
  if (data.phone && !isValidPhone(data.phone)) {
    errors.push('Telefone inválido');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Validar perfil de profissional
export function validateProfessionalProfile(data: {
  displayName: string;
  profession: string;
  bio?: string;
  hourlyRate?: number;
  skills?: string[];
  cpf?: string;
  cnpj?: string;
}): ValidationResult {
  const errors: string[] = [];
  
  // Nome
  if (!data.displayName || data.displayName.trim().length < 3) {
    errors.push('Nome deve ter no mínimo 3 caracteres');
  }
  
  // Profissão
  if (!data.profession || data.profession.trim().length < 3) {
    errors.push('Profissão deve ter no mínimo 3 caracteres');
  }
  
  // Bio
  if (data.bio && data.bio.length > 1000) {
    errors.push('Biografia deve ter no máximo 1000 caracteres');
  }
  
  // Valor por hora
  if (data.hourlyRate !== undefined && (data.hourlyRate < 0 || data.hourlyRate > 10000)) {
    errors.push('Valor por hora inválido');
  }
  
  // Habilidades
  if (data.skills && data.skills.length > 20) {
    errors.push('Máximo de 20 habilidades permitidas');
  }
  
  // CPF
  if (data.cpf && !isValidCPF(data.cpf)) {
    errors.push('CPF inválido');
  }
  
  // CNPJ
  if (data.cnpj && !isValidCNPJ(data.cnpj)) {
    errors.push('CNPJ inválido');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Validar avaliação
export function validateReview(data: {
  rating: number;
  comment: string;
}): ValidationResult {
  const errors: string[] = [];
  
  // Rating
  if (!data.rating || data.rating < 1 || data.rating > 5) {
    errors.push('Avaliação deve ser entre 1 e 5 estrelas');
  }
  
  // Comentário
  if (!data.comment || data.comment.trim().length < 10) {
    errors.push('Comentário deve ter no mínimo 10 caracteres');
  }
  if (data.comment && data.comment.length > 1000) {
    errors.push('Comentário deve ter no máximo 1000 caracteres');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Validar mensagem de chat
export function validateChatMessage(text: string): ValidationResult {
  const errors: string[] = [];
  
  if (!text || text.trim().length === 0) {
    errors.push('Mensagem não pode estar vazia');
  }
  if (text && text.length > 5000) {
    errors.push('Mensagem muito longa (máximo 5000 caracteres)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Validar solicitação de serviço
export function validateServiceRequest(data: {
  serviceType: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  address: string;
  city: string;
  state: string;
}): ValidationResult {
  const errors: string[] = [];
  
  // Tipo de serviço
  if (!data.serviceType || data.serviceType.trim().length < 3) {
    errors.push('Tipo de serviço inválido');
  }
  
  // Descrição
  if (!data.description || data.description.trim().length < 10) {
    errors.push('Descrição deve ter no mínimo 10 caracteres');
  }
  if (data.description && data.description.length > 2000) {
    errors.push('Descrição muito longa');
  }
  
  // Data
  const requestDate = new Date(data.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (requestDate < today) {
    errors.push('Data não pode ser no passado');
  }
  
  // Duração
  if (!data.duration || data.duration < 0.5 || data.duration > 24) {
    errors.push('Duração inválida (0.5 a 24 horas)');
  }
  
  // Endereço
  if (!data.address || data.address.trim().length < 5) {
    errors.push('Endereço inválido');
  }
  
  // Cidade
  if (!data.city || data.city.trim().length < 2) {
    errors.push('Cidade inválida');
  }
  
  // Estado
  if (!data.state || data.state.length !== 2) {
    errors.push('Estado inválido (use sigla com 2 letras)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Sanitizar dados antes de salvar
export function sanitizeUserInput<T extends Record<string, any>>(data: T): T {
  const sanitized: any = {};
  
  for (const key in data) {
    const value = data[key];
    
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? sanitizeInput(item) : item
      );
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}
