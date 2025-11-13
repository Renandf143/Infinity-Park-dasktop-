import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  User,
  UserCredential,
  sendPasswordResetEmail,
  sendEmailVerification
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  accountType: 'client' | 'professional';
  
  // Campos específicos para clientes
  cpf?: string;
  birthDate?: string;
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  preferences?: {
    serviceTypes: string[];
    budget: string;
    availability: string;
  };
  
  // Campos específicos para profissionais
  profession?: string;
  category?: string;
  experience?: string;
  description?: string;
  skills?: string[];
  location?: {
    city: string;
    state: string;
    address: string;
  };
  priceRange?: {
    min: number;
    max: number;
  };
}

/**
 * 🔐 SERVIÇO DE AUTENTICAÇÃO FIREBASE
 * 
 * Firebase como sistema PRINCIPAL de autenticação
 * MongoDB como sistema SECUNDÁRIO para backup de dados
 */
class AuthService {
  
  /**
   * 📝 Registrar novo usuário
   * 1. Cria conta no Firebase Authentication
   * 2. Salva dados no MongoDB como backup
   */
  async register(data: RegisterData): Promise<User> {
    try {
      console.log('🔐 Criando conta no Firebase...');
      
      // 1. Criar conta no Firebase (PRINCIPAL)
      const userCredential: UserCredential = await createUserWithEmailAndPassword(
        auth, 
        data.email, 
        data.password
      );
      
      const user = userCredential.user;
      
      // 2. Atualizar perfil do usuário
      await updateProfile(user, {
        displayName: data.name
      });
      
      console.log('✅ Conta criada no Firebase:', user.uid);
      
      // 3. Enviar email de verificação
      try {
        await sendEmailVerification(user);
        console.log('📧 Email de verificação enviado');
      } catch (emailError) {
        console.warn('⚠️ Erro ao enviar email de verificação:', emailError);
      }
      
      // 4. Salvar dados no Firestore
      try {
        await this.saveUserToFirestore(user, data);
      } catch (firestoreError) {
        console.error('❌ ERRO CRÍTICO ao salvar no Firestore:', firestoreError);
        // Tentar deletar o usuário criado se falhar ao salvar no Firestore
        try {
          await user.delete();
          console.log('🗑️ Usuário deletado devido a erro no Firestore');
        } catch (deleteError) {
          console.error('❌ Não foi possível deletar o usuário:', deleteError);
        }
        throw new Error('Erro ao salvar dados do usuário. Por favor, tente novamente.');
      }
      
      return user;
      
    } catch (error: any) {
      console.error('❌ Erro ao registrar:', error);
      throw this.handleFirebaseError(error);
    }
  }
  
  /**
   * 💾 Salvar dados do usuário no Firestore
   */
  private async saveUserToFirestore(user: User, data: RegisterData): Promise<void> {
    try {
      // Salvar dados básicos do usuário
      const userDoc = {
        uid: user.uid,
        email: data.email,
        displayName: data.name,
        userType: data.accountType,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        photoUrl: user.photoURL || null,
        phoneNumber: data.phone,
        cpf: data.cpf || null,
        address: data.address?.street ? `${data.address.street}, ${data.address.number} - ${data.address.city}/${data.address.state}` : '',
        fullAddress: data.address || null,
        emailVerified: user.emailVerified,
        isActive: true
      };
      
      await setDoc(doc(db, 'users', user.uid), userDoc);
      console.log('✅ Usuário salvo no Firestore');
      
      // Se for profissional, criar perfil de provedor de serviço
      if (data.accountType === 'professional') {
        // Buscar o slug da categoria baseado na profissão ou usar a categoria fornecida
        const categorySlug = data.category 
          ? this.getCategorySlug(data.category)
          : this.getProfessionSlug(data.profession || '');
        
        console.log('📝 Dados do profissional:', {
          profession: data.profession,
          category: data.category,
          categorySlug: categorySlug,
          location: data.location
        });
        
        const providerProfile = {
          userId: user.uid,
          displayName: data.name,
          email: data.email,
          phoneNumber: data.phone,
          bio: data.description || '',
          skills: data.skills || [],
          hourlyRate: data.priceRange?.min || 0,
          availability: 'available',
          portfolioLink: '',
          yearsOfExperience: this.parseExperience(data.experience || ''),
          verified: false,
          rating: 0,
          reviewCount: 0,
          location: {
            city: data.location?.city || '',
            state: data.location?.state || '',
            address: data.location?.address || ''
          },
          profession: data.profession || '',
          category: data.category || '',
          categorySlug: categorySlug,
          priceRange: {
            min: data.priceRange?.min || 0,
            max: data.priceRange?.max || 0
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastActive: new Date(),
          isActive: true,
          // Estatísticas
          stats: {
            totalJobs: 0,
            completedJobs: 0,
            totalEarnings: 0,
            responseTime: 0
          }
        };
        
        console.log('💾 Salvando perfil profissional:', providerProfile);
        await setDoc(doc(db, 'serviceProviders', user.uid), providerProfile);
        console.log('✅ Perfil de profissional salvo no Firestore');
        console.log('📍 ID do profissional:', user.uid);
        console.log('📍 CategorySlug:', categorySlug);
      }
      
    } catch (error) {
      console.error('❌ Erro ao salvar no Firestore:', error);
      throw error;
    }
  }
  
  private parseExperience(experience: string): number {
    if (experience.includes('Menos de 1')) return 0;
    if (experience.includes('1-2')) return 1;
    if (experience.includes('3-5')) return 3;
    if (experience.includes('5-10')) return 5;
    if (experience.includes('Mais de 10')) return 10;
    return 0;
  }
  
  private getCategorySlug(category: string): string {
    const categorySlugMap: { [key: string]: string } = {
      'Limpeza e Organização': 'limpeza-organizacao',
      'Reparos e Manutenção': 'reparos-manutencao',
      'Beleza e Estética': 'beleza-estetica',
      'Saúde e Bem-estar': 'saude-bemestar',
      'Aulas e Treinamentos': 'aulas-treinamentos',
      'Eventos e Festas': 'eventos-festas',
      'Transporte e Mudanças': 'transporte-mudancas',
      'Tecnologia e Suporte': 'tecnologia-suporte',
      'Jardinagem e Paisagismo': 'jardinagem-paisagismo',
      'Cuidados Pessoais': 'cuidados-pessoais',
      'Pet Care': 'pet-care',
      'Alimentação': 'alimentacao'
    };
    
    return categorySlugMap[category] || category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');
  }
  
  private getProfessionSlug(profession: string): string {
    const slugMap: { [key: string]: string } = {
      'Eletricista': 'eletricista',
      'Encanador': 'encanador',
      'Pedreiro': 'pedreiro',
      'Pintor': 'pintor',
      'Marceneiro': 'marceneiro',
      'Jardineiro': 'jardineiro',
      'Diarista': 'diarista',
      'Cozinheiro': 'cozinheiro',
      'Mecânico': 'mecanico',
      'Técnico de Informática': 'tecnico-informatica',
      'Professor Particular': 'professor-particular',
      'Personal Trainer': 'personal-trainer',
      'Fotógrafo': 'fotografo',
      'Designer': 'designer',
      'Desenvolvedor': 'desenvolvedor'
    };
    
    return slugMap[profession] || profession.toLowerCase().replace(/\s+/g, '-');
  }
  
  /**
   * 🔑 Login com email e senha
   */
  async login(email: string, password: string): Promise<any> {
    try {
      console.log('🔐 Fazendo login no Firebase...');
      
      // Validar entrada
      if (!email || !password) {
        throw new Error('Email e senha são obrigatórios');
      }
      
      // Validar formato do email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Email inválido');
      }
      
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;
      
      console.log('✅ Login realizado:', user.uid);
      
      // Buscar dados completos do Firestore
      const userData = await this.getUserData(user.uid);
      
      // Atualizar lastActive se for profissional
      if (userData?.userType === 'professional') {
        try {
          await updateDoc(doc(db, 'serviceProviders', user.uid), {
            lastActive: new Date(),
            updatedAt: new Date().toISOString()
          });
          console.log('✅ Status online atualizado');
        } catch (error) {
          console.warn('⚠️ Erro ao atualizar status online:', error);
        }
      }
      
      return userData;
      
    } catch (error: any) {
      console.error('❌ Erro ao fazer login:', error);
      throw this.handleFirebaseError(error);
    }
  }
  
  /**
   * 🔵 Login com Google
   */
  async loginWithGoogle(): Promise<any> {
    try {
      console.log('🔐 Fazendo login com Google...');
      
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;
      
      console.log('✅ Login com Google realizado:', user.uid);
      
      // Verificar se é primeiro login e salvar no Firestore
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (!userDoc.exists()) {
          // Primeiro login - salvar dados básicos
          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || '',
            userType: 'client', // Padrão para login Google
            photoUrl: user.photoURL || null,
            phoneNumber: user.phoneNumber || '',
            address: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            emailVerified: user.emailVerified,
            isActive: true
          });
        }
      } catch (error) {
        console.warn('⚠️ Erro ao verificar/salvar usuário:', error);
      }
      
      // Buscar dados completos do Firestore
      const userData = await this.getUserData(user.uid);
      
      return userData;
      
    } catch (error: any) {
      console.error('❌ Erro ao fazer login com Google:', error);
      throw this.handleFirebaseError(error);
    }
  }
  
  /**
   * 🚪 Logout
   */
  async logout(): Promise<void> {
    try {
      await signOut(auth);
      console.log('✅ Logout realizado');
    } catch (error: any) {
      console.error('❌ Erro ao fazer logout:', error);
      throw this.handleFirebaseError(error);
    }
  }
  

  
  /**
   * 📧 Recuperar senha
   */
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
      console.log('✅ Email de recuperação enviado');
    } catch (error: any) {
      console.error('❌ Erro ao enviar email de recuperação:', error);
      throw this.handleFirebaseError(error);
    }
  }
  
  /**
   * 👤 Obter usuário atual
   */
  getCurrentUser(): User | null {
    return auth.currentUser;
  }
  
  /**
   * 🔄 Atualizar perfil do usuário
   */
  async updateUserProfile(updates: { displayName?: string; photoURL?: string }): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado');
    
    try {
      await updateProfile(user, updates);
      
      // Atualizar no Firestore também
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: updates.displayName,
        photoUrl: updates.photoURL,
        updatedAt: new Date().toISOString()
      });
      
      console.log('✅ Perfil atualizado');
    } catch (error: any) {
      console.error('❌ Erro ao atualizar perfil:', error);
      throw this.handleFirebaseError(error);
    }
  }
  
  /**
   * 🔍 Buscar dados completos do usuário no Firestore
   */
  async getUserData(firebaseUid: string): Promise<any> {
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUid));
      
      if (userDoc.exists()) {
        return userDoc.data();
      }
      
      return null;
    } catch (error) {
      console.error('❌ Erro ao buscar dados do usuário:', error);
      return null;
    }
  }
  
  /**
   * ⚠️ Tratar erros do Firebase
   */
  private handleFirebaseError(error: any): Error {
    const errorMessages: { [key: string]: string } = {
      'auth/email-already-in-use': 'Este email já está cadastrado',
      'auth/weak-password': 'Senha muito fraca. Use no mínimo 6 caracteres',
      'auth/invalid-email': 'Email inválido',
      'auth/user-not-found': 'Email ou senha incorretos',
      'auth/wrong-password': 'Email ou senha incorretos',
      'auth/invalid-credential': 'Email ou senha incorretos. Verifique suas credenciais e tente novamente',
      'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde',
      'auth/network-request-failed': 'Erro de conexão. Verifique sua internet',
      'auth/popup-closed-by-user': 'Login cancelado pelo usuário',
      'auth/user-disabled': 'Esta conta foi desativada',
      'auth/operation-not-allowed': 'Operação não permitida',
      'auth/invalid-login-credentials': 'Email ou senha incorretos'
    };
    
    const message = errorMessages[error.code] || error.message || 'Erro ao fazer login. Tente novamente';
    return new Error(message);
  }
}

export const authService = new AuthService();
