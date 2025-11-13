import { apiClient } from './apiClient';

/**
 * 👤 SERVIÇO DE USUÁRIOS
 * 
 * Integração com API do backend para gerenciar usuários
 */

export interface CreateUserData {
  firebaseUid: string;
  email: string;
  name: string;
  phone: string;
  accountType: 'client' | 'professional';
  profileImage?: string;
  
  // Campos específicos para clientes
  cpf?: string;
  birthDate?: string;
  address?: {
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  preferences?: {
    serviceTypes?: string[];
    budget?: string;
    availability?: string;
  };
  
  // Campos específicos para profissionais
  profession?: string;
  experience?: string;
  description?: string;
  skills?: string[];
  location?: {
    city?: string;
    state?: string;
    address?: string;
  };
  priceRange?: {
    min?: number;
    max?: number;
  };
}

export interface User {
  _id: string;
  firebaseUid: string;
  email: string;
  name: string;
  phone: string;
  accountType: 'client' | 'professional';
  profileImage?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Campos específicos para profissionais
  profession?: string;
  experience?: string;
  description?: string;
  skills?: string[];
  portfolio?: string[];
  rating?: number;
  reviewCount?: number;
  isVerified?: boolean;
  availability?: 'available' | 'busy' | 'unavailable';
  location?: {
    city?: string;
    state?: string;
    address?: string;
  };
  priceRange?: {
    min?: number;
    max?: number;
  };
}

export const userService = {
  /**
   * 📝 Criar novo usuário
   */
  async createUser(userData: CreateUserData): Promise<User> {
    try {
      console.log('📝 Criando usuário no backend:', userData);
      
      const response = await apiClient.post('/users', userData);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Erro ao criar usuário');
      }
      
      console.log('✅ Usuário criado no backend:', response.data.data);
      return response.data.data;
    } catch (error: any) {
      console.error('❌ Erro ao criar usuário:', error);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('Erro ao criar usuário no servidor');
    }
  },

  /**
   * 👤 Buscar usuário por Firebase UID
   */
  async getUserByFirebaseUid(firebaseUid: string): Promise<User | null> {
    try {
      const response = await apiClient.get(`/users/firebase/${firebaseUid}`);
      
      if (!response.data.success) {
        return null;
      }
      
      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      
      console.error('❌ Erro ao buscar usuário:', error);
      throw new Error('Erro ao buscar usuário');
    }
  },

  /**
   * 📧 Buscar usuário por email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const response = await apiClient.get(`/users/email/${encodeURIComponent(email)}`);
      
      if (!response.data.success) {
        return null;
      }
      
      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      
      console.error('❌ Erro ao buscar usuário por email:', error);
      throw new Error('Erro ao buscar usuário');
    }
  },

  /**
   * 🔧 Atualizar usuário
   */
  async updateUser(firebaseUid: string, updateData: Partial<CreateUserData>): Promise<User> {
    try {
      const response = await apiClient.put(`/users/firebase/${firebaseUid}`, updateData);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Erro ao atualizar usuário');
      }
      
      return response.data.data;
    } catch (error: any) {
      console.error('❌ Erro ao atualizar usuário:', error);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('Erro ao atualizar usuário');
    }
  },

  /**
   * 👷 Listar profissionais
   */
  async getProfessionals(filters?: {
    profession?: string;
    location?: string;
    minRating?: number;
  }): Promise<User[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.profession) params.append('profession', filters.profession);
      if (filters?.location) params.append('location', filters.location);
      if (filters?.minRating) params.append('minRating', filters.minRating.toString());
      
      const response = await apiClient.get(`/users/professionals?${params.toString()}`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Erro ao buscar profissionais');
      }
      
      return response.data.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar profissionais:', error);
      throw new Error('Erro ao buscar profissionais');
    }
  },

  /**
   * 🔍 Buscar profissionais por profissão
   */
  async searchProfessionalsByProfession(profession: string): Promise<User[]> {
    try {
      const response = await apiClient.get(`/users/professionals/search/${encodeURIComponent(profession)}`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Erro ao buscar profissionais');
      }
      
      return response.data.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar profissionais por profissão:', error);
      throw new Error('Erro ao buscar profissionais');
    }
  },

  /**
   * ❌ Desativar usuário
   */
  async deactivateUser(firebaseUid: string): Promise<boolean> {
    try {
      const response = await apiClient.delete(`/users/firebase/${firebaseUid}`);
      
      return response.data.success;
    } catch (error: any) {
      console.error('❌ Erro ao desativar usuário:', error);
      throw new Error('Erro ao desativar usuário');
    }
  }
};