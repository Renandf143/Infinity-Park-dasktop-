import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '../firebase';
import { ServiceProviderProfile, User } from '../types/firestore';

/**
 * 👷 SERVIÇO DE PROFISSIONAIS
 */
class ProfessionalService {
  
  /**
   * Buscar todos os profissionais
   */
  async getAllProfessionals(): Promise<ServiceProviderProfile[]> {
    try {
      const providersRef = collection(db, 'serviceProviders');
      const q = query(providersRef, orderBy('rating', 'desc'), limit(50));
      const snapshot = await getDocs(q);
      
      const professionals: ServiceProviderProfile[] = [];
      
      for (const docSnap of snapshot.docs) {
        const providerData = docSnap.data();
        
        // Buscar dados do usuário
        const userDoc = await getDoc(doc(db, 'users', providerData.userId));
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          professionals.push({
            ...providerData,
            user: userData,
            // Adicionar campos do usuário para acesso direto
            displayName: userData.displayName,
            email: userData.email,
            phoneNumber: userData.phoneNumber
          } as ServiceProviderProfile);
        }
      }
      
      return professionals;
    } catch (error) {
      console.error('❌ Erro ao buscar profissionais:', error);
      return [];
    }
  }
  
  /**
   * Buscar profissional por ID
   */
  async getProfessionalById(userId: string): Promise<ServiceProviderProfile | null> {
    try {
      console.log('🔍 Buscando profissional:', userId);
      
      // MÉTODO 1: Tentar buscar diretamente pelo ID do documento
      let providerDoc = await getDoc(doc(db, 'serviceProviders', userId));
      
      // MÉTODO 2: Se não encontrou, buscar por userId
      if (!providerDoc.exists()) {
        console.log('⚠️ Documento não encontrado diretamente, buscando por userId...');
        const providersRef = collection(db, 'serviceProviders');
        const q = query(providersRef, where('userId', '==', userId), limit(1));
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          providerDoc = snapshot.docs[0];
          console.log('✅ Profissional encontrado por userId');
        }
      }
      
      if (providerDoc.exists()) {
        const providerData = providerDoc.data();
        console.log('✅ Dados do provedor encontrados:', providerData);
        
        // Usar o userId do documento, não o parâmetro
        const actualUserId = providerData.userId || userId;
        
        // Buscar dados do usuário
        const userDoc = await getDoc(doc(db, 'users', actualUserId));
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          console.log('✅ Dados do usuário encontrados:', userData);
          
          return {
            ...providerData,
            userId: actualUserId,
            user: userData,
            // Adicionar campos do usuário para acesso direto
            displayName: userData.displayName,
            email: userData.email,
            phoneNumber: userData.phoneNumber
          } as ServiceProviderProfile;
        } else {
          console.warn('⚠️ Usuário não encontrado:', actualUserId);
          
          // Retornar dados do provedor mesmo sem usuário
          return {
            ...providerData,
            userId: actualUserId,
            user: {
              uid: actualUserId,
              displayName: providerData.displayName || 'Profissional',
              email: providerData.email || '',
              photoURL: providerData.photoUrl || '',
              phoneNumber: providerData.phoneNumber || '',
              role: 'professional',
              createdAt: new Date(),
            } as User,
            displayName: providerData.displayName || 'Profissional',
            email: providerData.email || '',
            phoneNumber: providerData.phoneNumber || ''
          } as ServiceProviderProfile;
        }
      } else {
        console.warn('⚠️ Provedor não encontrado:', userId);
      }
      
      return null;
    } catch (error) {
      console.error('❌ Erro ao buscar profissional:', error);
      return null;
    }
  }
  
  /**
   * Buscar profissionais por filtros
   */
  async searchProfessionals(filters: {
    profession?: string;
    city?: string;
    state?: string;
    minRating?: number;
    maxPrice?: number;
    skills?: string[];
  }): Promise<ServiceProviderProfile[]> {
    try {
      const providersRef = collection(db, 'serviceProviders');
      const constraints: QueryConstraint[] = [];
      
      // Adicionar filtros
      if (filters.profession) {
        constraints.push(where('profession', '==', filters.profession));
      }
      
      if (filters.city) {
        constraints.push(where('location.city', '==', filters.city));
      }
      
      if (filters.state) {
        constraints.push(where('location.state', '==', filters.state));
      }
      
      if (filters.minRating) {
        constraints.push(where('rating', '>=', filters.minRating));
      }
      
      // Ordenar por rating
      constraints.push(orderBy('rating', 'desc'));
      constraints.push(limit(50));
      
      const q = query(providersRef, ...constraints);
      const snapshot = await getDocs(q);
      
      const professionals: ServiceProviderProfile[] = [];
      
      for (const docSnap of snapshot.docs) {
        const providerData = docSnap.data();
        
        // Filtrar por preço (não suportado diretamente no Firestore)
        if (filters.maxPrice && providerData.hourlyRate > filters.maxPrice) {
          continue;
        }
        
        // Filtrar por skills (não suportado diretamente no Firestore)
        if (filters.skills && filters.skills.length > 0) {
          const hasSkills = filters.skills.some(skill => 
            providerData.skills.includes(skill)
          );
          if (!hasSkills) continue;
        }
        
        // Buscar dados do usuário
        const userDoc = await getDoc(doc(db, 'users', providerData.userId));
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          professionals.push({
            ...providerData,
            user: userData,
            displayName: userData.displayName,
            email: userData.email,
            phoneNumber: userData.phoneNumber
          } as ServiceProviderProfile);
        }
      }
      
      return professionals;
    } catch (error) {
      console.error('❌ Erro ao buscar profissionais:', error);
      return [];
    }
  }
  
  /**
   * Buscar profissionais por profissão
   */
  async getProfessionalsByProfession(profession: string): Promise<ServiceProviderProfile[]> {
    return this.searchProfessionals({ profession });
  }
  
  /**
   * Buscar profissionais por categoria (slug)
   */
  async getProfessionalsByCategory(categorySlug: string): Promise<ServiceProviderProfile[]> {
    try {
      console.log('🔍 Buscando profissionais para categoria:', categorySlug);
      const providersRef = collection(db, 'serviceProviders');
      
      // PRIMEIRO: Tentar buscar por categorySlug
      let q = query(
        providersRef, 
        where('categorySlug', '==', categorySlug),
        limit(50)
      );
      let snapshot = await getDocs(q);
      
      console.log('📊 Busca por categorySlug encontrou:', snapshot.size, 'documentos');
      
      // SE NÃO ENCONTROU: Buscar todos e filtrar no cliente
      if (snapshot.size === 0) {
        console.log('⚠️ Nenhum profissional encontrado por categorySlug, buscando todos...');
        const allSnapshot = await getDocs(collection(db, 'serviceProviders'));
        console.log('📊 Total de profissionais no banco:', allSnapshot.size);
        
        // Listar todos para debug
        allSnapshot.forEach(doc => {
          const data = doc.data();
          console.log('  📄 Profissional:', {
            id: doc.id,
            profession: data.profession,
            category: data.category,
            categorySlug: data.categorySlug
          });
        });
        
        snapshot = allSnapshot;
      }
      
      const professionals: ServiceProviderProfile[] = [];
      
      for (const docSnap of snapshot.docs) {
        const providerData = docSnap.data();
        
        // Filtrar por categorySlug OU por correspondência de nome
        const matchesBySlug = providerData.categorySlug === categorySlug;
        const matchesByName = this.categorySlugMatchesName(categorySlug, providerData.category);
        
        if (!matchesBySlug && !matchesByName) {
          console.log('⏭️ Pulando profissional (não corresponde):', {
            profession: providerData.profession,
            categorySlug: providerData.categorySlug,
            category: providerData.category,
            buscando: categorySlug
          });
          continue;
        }
        
        console.log('✅ Profissional corresponde:', {
          id: docSnap.id,
          profession: providerData.profession,
          categorySlug: providerData.categorySlug,
          category: providerData.category
        });
        
        // Buscar dados do usuário
        const userDoc = await getDoc(doc(db, 'users', providerData.userId));
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          professionals.push({
            ...providerData,
            user: userData,
            displayName: userData.displayName,
            email: userData.email,
            phoneNumber: userData.phoneNumber
          } as ServiceProviderProfile);
        }
      }
      
      console.log('✅ Total de profissionais retornados:', professionals.length);
      
      // Ordenar no cliente por rating (decrescente)
      return professionals.sort((a, b) => b.rating - a.rating);
    } catch (error) {
      console.error('❌ Erro ao buscar profissionais por categoria:', error);
      return [];
    }
  }
  
  /**
   * Verificar se o slug da categoria corresponde ao nome
   */
  private categorySlugMatchesName(slug: string, categoryName: string): boolean {
    if (!categoryName) return false;
    
    // Mapa de correspondências
    const slugMap: { [key: string]: string[] } = {
      'limpeza-organizacao': ['Limpeza e Organização', 'limpeza', 'organizacao'],
      'reparos-manutencao': ['Reparos e Manutenção', 'reparos', 'manutencao'],
      'beleza-estetica': ['Beleza e Estética', 'beleza', 'estetica'],
      'saude-bemestar': ['Saúde e Bem-estar', 'saude', 'bem-estar'],
      'aulas-treinamentos': ['Aulas e Treinamentos', 'aulas', 'treinamentos'],
      'eventos-festas': ['Eventos e Festas', 'eventos', 'festas'],
      'transporte-mudancas': ['Transporte e Mudanças', 'transporte', 'mudancas'],
      'tecnologia-suporte': ['Tecnologia e Suporte', 'tecnologia', 'suporte'],
      'jardinagem-paisagismo': ['Jardinagem e Paisagismo', 'jardinagem', 'paisagismo'],
      'cuidados-pessoais': ['Cuidados Pessoais', 'cuidados'],
      'pet-care': ['Pet Care', 'pet'],
      'alimentacao': ['Alimentação', 'alimentacao']
    };
    
    const possibleNames = slugMap[slug] || [];
    return possibleNames.some(name => 
      categoryName.toLowerCase().includes(name.toLowerCase()) ||
      name.toLowerCase().includes(categoryName.toLowerCase())
    );
  }
  
  /**
   * Buscar profissionais por localização
   */
  async getProfessionalsByLocation(city: string, state: string): Promise<ServiceProviderProfile[]> {
    return this.searchProfessionals({ city, state });
  }
}

export const professionalService = new ProfessionalService();
