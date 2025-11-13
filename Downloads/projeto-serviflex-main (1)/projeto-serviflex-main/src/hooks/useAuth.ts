import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { authService } from '../services/authService';
import { onlineStatusService } from '../services/onlineStatusService';
import { presenceService } from '../services/presenceService';

/**
 * 🔐 Hook de Autenticação
 * 
 * Gerencia o estado de autenticação do usuário
 * Sincroniza dados do Firebase com Firestore
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Observar mudanças no estado de autenticação
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      setError(null);

      if (firebaseUser) {
        setUser(firebaseUser);
        
        // Buscar dados completos do Firestore
        try {
          const data = await authService.getUserData(firebaseUser.uid);
          setUserData(data);
          
          // Iniciar rastreamento de status online se for profissional
          if (data?.userType === 'professional') {
            onlineStatusService.startTracking(firebaseUser.uid, data.userType);
          }

          // Iniciar presença online para TODOS os usuários (cliente e profissional)
          presenceService.startPresence(firebaseUser.uid);
        } catch (err) {
          console.warn('⚠️ Erro ao buscar dados do usuário:', err);
          setUserData(null);
        }
      } else {
        setUser(null);
        setUserData(null);
        
        // Parar rastreamento ao fazer logout
        onlineStatusService.stopTracking();
        presenceService.stopPresence();
      }

      setLoading(false);
    });

    return () => {
      unsubscribe();
      onlineStatusService.stopTracking();
      presenceService.stopPresence();
    };
  }, []);

  const refreshUserData = async () => {
    if (user) {
      try {
        const data = await authService.getUserData(user.uid);
        setUserData(data);
      } catch (err) {
        console.error('❌ Erro ao atualizar dados:', err);
      }
    }
  };

  const logout = async () => {
    onlineStatusService.stopTracking();
    presenceService.stopPresence();
    await authService.logout();
  };

  const getUserDisplayName = () => {
    if (userData?.displayName) return userData.displayName;
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'Usuário';
  };

  return {
    user,
    userData,
    loading,
    error,
    isAuthenticated: !!user,
    isClient: userData?.userType === 'client',
    isProfessional: userData?.userType === 'professional',
    refreshUserData,
    logout,
    getUserDisplayName
  };
}
