import { mockAuthService, MockUser } from './mockAuth';
import { firebaseAuthService } from './firebaseAuth';
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
export interface AuthResponse {
  user: MockUser;
  accountType: 'client' | 'professional' | 'company';
}
export const authService = {
  async signInWithGoogle(accountType: 'client' | 'professional' | 'company'): Promise<AuthResponse> {
    try {
      // Tentar Firebase primeiro, se falhar usar mock
      return await firebaseAuthService.signInWithGoogle(accountType);
    } catch (error) {
      console.warn('Firebase falhou, usando mock service:', error);
      return mockAuthService.signInWithGoogle(accountType);
    }
  },
  
  async registerWithEmail(email: string, password: string, userData: UserData): Promise<AuthResponse> {
    try {
      // Tentar Firebase primeiro
      const result = await firebaseAuthService.registerWithEmail(email, password, userData);
      
      // Enviar email de verificação
      await this.sendVerificationEmail(email);
      
      return result;
    } catch (error) {
      console.warn('Firebase falhou, usando mock service:', error);
      return mockAuthService.registerWithEmail(email, password, userData);
    }
  },
  
  async loginWithEmail(email: string, password: string): Promise<AuthResponse> {
    try {
      return await firebaseAuthService.loginWithEmail(email, password);
    } catch (error) {
      console.warn('Firebase falhou, usando mock service:', error);
      return mockAuthService.loginWithEmail(email, password);
    }
  },
  
  async sendVerificationEmail(email: string): Promise<void> {
    try {
      await firebaseAuthService.sendVerificationEmail(email);
    } catch (error) {
      console.warn('Não foi possível enviar email de verificação:', error);
      // Para mock, apenas simular
      console.log('📧 Email de verificação simulado enviado para:', email);
    }
  },
  
  async logout(): Promise<void> {
    try {
      await firebaseAuthService.logout();
    } catch (error) {
      await mockAuthService.logout();
    }
  },
  
  getCurrentUser() {
    try {
      return firebaseAuthService.getCurrentUser() || mockAuthService.getCurrentUser();
    } catch (error) {
      return mockAuthService.getCurrentUser();
    }
  },
  
  async getUserProfile(userId: string) {
    try {
      return await firebaseAuthService.getUserProfile(userId);
    } catch (error) {
      return mockAuthService.getUserProfile(userId);
    }
  },
  
  onAuthStateChange(callback: (user: any) => void) {
    try {
      return firebaseAuthService.onAuthStateChange(callback);
    } catch (error) {
      return mockAuthService.onAuthStateChange(callback);
    }
  }
};