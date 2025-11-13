import { 
  signInWithPopup, 
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

/**
 * 🔒 SERVIÇO DE AUTENTICAÇÃO FIREBASE
 * 
 * Apenas Google Auth - dados salvos no MongoDB
 */

export interface AuthResponse {
  user: FirebaseUser;
  accountType: 'client' | 'professional';
}

export const firebaseAuthService = {
  /**
   * 🔒 Login com Google
   */
  async signInWithGoogle(accountType: 'client' | 'professional' = 'client'): Promise<AuthResponse> {
    try {
      console.log('🚀 Iniciando login com Google...');
      
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      console.log('✅ Login com Google bem-sucedido:', user.email);
      
      return {
        user,
        accountType
      };
    } catch (error: unknown) {
      console.error('❌ Erro no login com Google:', error);
      
      const firebaseError = error as { code?: string; message?: string };
      let errorMessage = 'Erro ao fazer login com Google';
      
      if (firebaseError.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Login cancelado pelo usuário';
      } else if (firebaseError.code === 'auth/popup-blocked') {
        errorMessage = 'Popup bloqueado. Permita popups para este site';
      } else if (firebaseError.code === 'auth/cancelled-popup-request') {
        errorMessage = 'Solicitação de popup cancelada';
      }
      
      throw new Error(errorMessage);
    }
  },

  /**
   * 🔒 Logout
   */
  async logout(): Promise<void> {
    try {
      await signOut(auth);
      console.log('✅ Logout realizado com sucesso');
    } catch (error: unknown) {
      console.error('❌ Erro no logout:', error);
      throw new Error('Erro ao fazer logout');
    }
  },

  /**
   * 👤 Obter usuário atual
   */
  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  },

  /**
   * 👂 Observar mudanças no estado de autenticação
   */
  onAuthStateChange(callback: (user: FirebaseUser | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  },

  /**
   * ✅ Verificar se usuário está logado
   */
  isAuthenticated(): boolean {
    return !!auth.currentUser;
  },

  /**
   * 👤 Obter informações do usuário
   */
  getUserInfo() {
    const user = auth.currentUser;
    if (!user) return null;

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    };
  }
};