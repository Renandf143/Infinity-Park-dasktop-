import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import axios from 'axios';

/**
 * 🔍 SERVIÇO DE VALIDAÇÃO
 */

// Validar CPF
export function validateCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/[^\d]/g, '');
  if (cleaned.length !== 11 || /^(\d)\1{10}$/.test(cleaned)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cleaned.charAt(i)) * (10 - i);
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleaned.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cleaned.charAt(i)) * (11 - i);
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  return digit === parseInt(cleaned.charAt(10));
}

// Formatar CPF
export function formatCPF(value: string): string {
  const cleaned = value.replace(/[^\d]/g, '');
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
  if (cleaned.length <= 9) return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
  return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`;
}

// Formatar Telefone
export function formatPhone(value: string): string {
  const cleaned = value.replace(/[^\d]/g, '');
  if (cleaned.length <= 2) return cleaned;
  if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
}

// Formatar CEP
export function formatCEP(value: string): string {
  const cleaned = value.replace(/[^\d]/g, '');
  if (cleaned.length <= 5) return cleaned;
  return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 8)}`;
}

// Verificar se email já existe
export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error('Erro ao verificar email:', error);
    return false;
  }
}

// Verificar se telefone já existe
export async function checkPhoneExists(phone: string): Promise<boolean> {
  try {
    const cleaned = phone.replace(/[^\d]/g, '');
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('phoneNumber', '==', phone));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error('Erro ao verificar telefone:', error);
    return false;
  }
}

// Verificar se CPF já existe
export async function checkCPFExists(cpf: string): Promise<boolean> {
  try {
    const cleaned = cpf.replace(/[^\d]/g, '');
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('cpf', '==', cleaned));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error('Erro ao verificar CPF:', error);
    return false;
  }
}

// Buscar endereço por CEP
export async function fetchAddressByCEP(cep: string) {
  const cleaned = cep.replace(/[^\d]/g, '');
  if (cleaned.length !== 8) {
    throw new Error('CEP inválido');
  }

  try {
    const response = await axios.get(`https://viacep.com.br/ws/${cleaned}/json/`);
    
    if (response.data.erro) {
      throw new Error('CEP não encontrado');
    }

    return {
      street: response.data.logradouro || '',
      neighborhood: response.data.bairro || '',
      city: response.data.localidade || '',
      state: response.data.uf || '',
      cep: formatCEP(cleaned)
    };
  } catch (error: any) {
    if (error.message === 'CEP não encontrado') {
      throw error;
    }
    throw new Error('Erro ao buscar CEP. Verifique sua conexão.');
  }
}

// Debounce helper
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
