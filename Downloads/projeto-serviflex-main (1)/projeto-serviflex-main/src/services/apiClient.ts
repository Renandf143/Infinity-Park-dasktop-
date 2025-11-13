/**
 * 🌐 CLIENTE DA API
 * 
 * Comunicação com o backend MongoDB
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro de conexão'
      };
    }
  }

  // 🔍 GET - Buscar todos os profissionais
  async getAllProfessionals() {
    return this.request('/professionals');
  }

  // 🔍 GET - Buscar profissional por ID
  async getProfessionalById(id: string) {
    return this.request(`/professionals/${id}`);
  }

  // 🔍 GET - Buscar profissionais por categoria
  async getProfessionalsByCategory(category: string) {
    return this.request(`/professionals/category/${category}`);
  }

  // 🔍 POST - Buscar profissionais com filtros
  async searchProfessionals(filters: {
    category?: string;
    city?: string;
    state?: string;
    minRating?: number;
    maxPrice?: number;
    search?: string;
  }) {
    return this.request('/professionals/search', {
      method: 'POST',
      body: JSON.stringify(filters),
    });
  }

  // 📝 POST - Criar profissional
  async createProfessional(professionalData: any) {
    return this.request('/professionals', {
      method: 'POST',
      body: JSON.stringify(professionalData),
    });
  }

  // 📝 PUT - Atualizar profissional
  async updateProfessional(id: string, updates: any) {
    return this.request(`/professionals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // 🗑️ DELETE - Deletar profissional
  async deleteProfessional(id: string) {
    return this.request(`/professionals/${id}`, {
      method: 'DELETE',
    });
  }

  // 👤 POST - Criar usuário
  async post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // 👤 GET - Buscar dados
  async get(endpoint: string) {
    return this.request(endpoint);
  }

  // 👤 PUT - Atualizar dados
  async put(endpoint: string, data: unknown) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // 👤 DELETE - Deletar dados
  async delete(endpoint: string) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // 🏥 Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export const apiClient = new ApiClient();