// Serviço de autenticação mock para desenvolvimento
import { createProfessionalProfile } from '../data/professionalProfiles';

export interface UserData {
  name: string;
  phone: string;
  accountType: 'client' | 'professional' | 'company';
  professionalData?: {
    profession: string;
    experience: string;
    description: string;
    specialties: string[];
    availability: string;
    hourlyRate: string;
  };
}

export interface MockUser {
  uid: string;
  email: string;
  displayName: string;
}

export interface AuthResponse {
  user: MockUser;
  accountType: 'client' | 'professional' | 'company';
}

// Simular usuários registrados
const mockUsers: Record<string, { user: MockUser; accountType: string; userData: any }> = {};

export const mockAuthService = {
  async signInWithGoogle(accountType: 'client' | 'professional' | 'company'): Promise<AuthResponse> {
    // Simular delay da API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: MockUser = {
      uid: `google_${Date.now()}`,
      email: 'usuario@gmail.com',
      displayName: 'Usuário Google'
    };
    
    // Salvar no mock storage
    mockUsers[mockUser.uid] = {
      user: mockUser,
      accountType,
      userData: {}
    };
    
    // Se for profissional, criar perfil
    if (accountType === 'professional') {
      const professionalId = createProfessionalProfile({
        name: mockUser.displayName,
        email: mockUser.email,
        serviceType: 'Serviços Gerais',
        skills: ['Atendimento', 'Qualidade', 'Pontualidade']
      });
      
      console.log(`Perfil profissional Google criado com ID: ${professionalId}`);
    }
    
    // Salvar no localStorage
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    localStorage.setItem('accountType', accountType);
    localStorage.setItem('professionalLoggedIn', 'true');
    localStorage.setItem('professionalName', mockUser.displayName);
    
    return {
      user: mockUser,
      accountType
    };
  },

  async registerWithEmail(email: string, password: string, userData: UserData): Promise<AuthResponse> {
    // Simular delay da API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Verificar se email já existe
    const existingUser = Object.values(mockUsers).find(u => u.user.email === email);
    if (existingUser) {
      throw new Error('Este email já está em uso');
    }
    
    const mockUser: MockUser = {
      uid: `email_${Date.now()}`,
      email: email,
      displayName: userData.name
    };
    
    // Salvar no mock storage
    mockUsers[mockUser.uid] = {
      user: mockUser,
      accountType: userData.accountType,
      userData
    };
    
    // Se for profissional, criar perfil completo
    if (userData.accountType === 'professional' && userData.professionalData) {
      const professionalId = createProfessionalProfile({
        name: userData.name,
        email: email,
        phone: userData.phone,
        serviceType: userData.professionalData.profession,
        skills: userData.professionalData.specialties.length > 0 
          ? userData.professionalData.specialties 
          : ['Atendimento', 'Qualidade'],
        category: this.getCategoryFromProfession(userData.professionalData.profession)
      });
      
      console.log(`Perfil profissional criado com ID: ${professionalId}`);
    }
    
    // Salvar email para verificação
    localStorage.setItem('emailForSignIn', email);
    
    // NÃO salvar como logado ainda - usuário precisa verificar email primeiro
    console.log('📧 Email de verificação simulado enviado para:', email);
    
    return {
      user: mockUser,
      accountType: userData.accountType
    };
  },

  async sendVerificationEmail(email: string): Promise<void> {
    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Salvar email para verificação
    localStorage.setItem('emailForSignIn', email);
    
    console.log('📧 Email de verificação simulado reenviado para:', email);
  },

  async loginWithEmail(email: string, password: string): Promise<AuthResponse> {
    // Simular delay da API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Buscar usuário
    const userEntry = Object.values(mockUsers).find(u => u.user.email === email);
    if (!userEntry) {
      throw new Error('Usuário não encontrado');
    }
    
    // Simular verificação de senha (aceitar qualquer senha para demo)
    if (password.length < 6) {
      throw new Error('Senha incorreta');
    }
    
    // Salvar no localStorage
    localStorage.setItem('currentUser', JSON.stringify(userEntry.user));
    localStorage.setItem('accountType', userEntry.accountType);
    localStorage.setItem('professionalLoggedIn', 'true');
    localStorage.setItem('professionalName', userEntry.user.displayName);
    
    return {
      user: userEntry.user,
      accountType: userEntry.accountType as 'client' | 'professional' | 'company'
    };
  },

  async logout(): Promise<void> {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('accountType');
    localStorage.removeItem('professionalLoggedIn');
    localStorage.removeItem('professionalName');
  },

  getCurrentUser(): MockUser | null {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  },

  async getUserProfile(userId: string) {
    return mockUsers[userId]?.userData || null;
  },

  onAuthStateChange(callback: (user: MockUser | null) => void) {
    // Simular observer
    const user = this.getCurrentUser();
    callback(user);
    
    // Retornar função de cleanup
    return () => {};
  },

  async verifyEmail(email: string): Promise<void> {
    // Simular verificação de email
    const userEntry = Object.values(mockUsers).find(u => u.user.email === email);
    if (userEntry) {
      // Marcar como logado após verificação
      localStorage.setItem('currentUser', JSON.stringify(userEntry.user));
      localStorage.setItem('accountType', userEntry.accountType);
      localStorage.setItem('professionalLoggedIn', 'true');
      localStorage.setItem('professionalName', userEntry.user.displayName);
      localStorage.removeItem('emailForSignIn');
      
      console.log('✅ Email verificado com sucesso para:', email);
    }
  },

  getCategoryFromProfession(profession: string): string {
    const professionLower = profession.toLowerCase();
    
    if (professionLower.includes('limpeza') || professionLower.includes('diarista') || professionLower.includes('organiz')) {
      return 'limpeza-organizacao';
    }
    if (professionLower.includes('design') || professionLower.includes('gráfico') || professionLower.includes('criativ')) {
      return 'design-criacao';
    }
    if (professionLower.includes('desenvolv') || professionLower.includes('program') || professionLower.includes('tech') || professionLower.includes('ti')) {
      return 'tecnologia-suporte';
    }
    if (professionLower.includes('eletric') || professionLower.includes('encanador') || professionLower.includes('reparo') || professionLower.includes('manutenção')) {
      return 'reparos-manutencao';
    }
    if (professionLower.includes('marketing') || professionLower.includes('vendas') || professionLower.includes('publicidade')) {
      return 'marketing-vendas';
    }
    
    return 'servicos-gerais';
  }
};