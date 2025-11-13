import { ObjectId } from 'mongodb';
import { auth } from '../firebase';
import { 
  getCollection, 
  ProfessionalDocument, 
  COLLECTIONS 
} from '../lib/mongodb';

export interface ProfessionalProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  profession: string;
  category: string;
  experience: string;
  description: string;
  specialties: string[];
  availability: string;
  hourlyRate: number;
  rating: number;
  reviewsCount: number;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  profileImage?: string;
  location?: {
    city: string;
    state: string;
  };
  stats?: {
    totalJobs: number;
    completedJobs: number;
    totalEarnings: number;
  };
}

// Converter documento MongoDB para interface do frontend
function convertMongoToProfessional(doc: ProfessionalDocument): ProfessionalProfile {
  return {
    id: doc._id?.toString() || '',
    userId: doc.userId,
    name: doc.name,
    email: doc.email,
    phone: doc.phone,
    profession: doc.profession,
    category: doc.category,
    experience: doc.experience,
    description: doc.description,
    specialties: doc.specialties || [],
    availability: doc.availability || 'Segunda a Sexta',
    hourlyRate: doc.hourlyRate || 0,
    rating: doc.rating || 0,
    reviewsCount: doc.reviewsCount || 0,
    verified: doc.verified || false,
    createdAt: doc.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: doc.updatedAt?.toISOString() || new Date().toISOString(),
    profileImage: doc.profileImage,
    location: doc.location,
    stats: doc.stats || {
      totalJobs: 0,
      completedJobs: 0,
      totalEarnings: 0
    }
  };
}

// Converter interface do frontend para documento MongoDB
function convertProfessionalToMongo(profile: Partial<ProfessionalProfile>): Partial<ProfessionalDocument> {
  const now = new Date();
  
  return {
    userId: profile.userId!,
    name: profile.name!,
    email: profile.email!,
    phone: profile.phone,
    profession: profile.profession!,
    category: profile.category!,
    experience: profile.experience!,
    description: profile.description!,
    specialties: profile.specialties || [],
    availability: profile.availability || 'Segunda a Sexta',
    hourlyRate: profile.hourlyRate || 0,
    rating: profile.rating || 0,
    reviewsCount: profile.reviewsCount || 0,
    verified: profile.verified || false,
    profileImage: profile.profileImage,
    location: profile.location,
    stats: profile.stats || {
      totalJobs: 0,
      completedJobs: 0,
      totalEarnings: 0
    },
    updatedAt: now
  };
}

export const mongodbProfessionalService = {
  /**
   * 🔍 Buscar perfil do profissional atual
   */
  async getCurrentProfessionalProfile(): Promise<ProfessionalProfile | null> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('Usuário não logado');
      }

      console.log('🔍 Buscando perfil do profissional no MongoDB:', currentUser.uid);

      const collection = await getCollection<ProfessionalDocument>(COLLECTIONS.PROFESSIONALS);
      const doc = await collection.findOne({ userId: currentUser.uid });

      if (!doc) {
        console.log('❌ Perfil profissional não encontrado');
        return null;
      }

      console.log('✅ Perfil profissional encontrado');
      return convertMongoToProfessional(doc);
    } catch (error) {
      console.error('❌ Erro ao buscar perfil profissional:', error);
      throw error;
    }
  },

  /**
   * 📝 Criar perfil do profissional
   */
  async createProfessionalProfile(
    profileData: Omit<ProfessionalProfile, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewsCount' | 'verified' | 'stats'>
  ): Promise<ProfessionalProfile> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('Usuário não logado');
      }

      console.log('📝 Criando perfil profissional no MongoDB:', profileData);

      const now = new Date();
      const mongoData: ProfessionalDocument = {
        ...convertProfessionalToMongo({
          ...profileData,
          userId: currentUser.uid
        }) as ProfessionalDocument,
        rating: 0,
        reviewsCount: 0,
        verified: false,
        stats: {
          totalJobs: 0,
          completedJobs: 0,
          totalEarnings: 0
        },
        createdAt: now,
        updatedAt: now
      };

      const collection = await getCollection<ProfessionalDocument>(COLLECTIONS.PROFESSIONALS);
      const result = await collection.insertOne(mongoData);

      if (!result.insertedId) {
        throw new Error('Erro ao inserir profissional no MongoDB');
      }

      const createdDoc = await collection.findOne({ _id: result.insertedId });
      if (!createdDoc) {
        throw new Error('Erro ao recuperar profissional criado');
      }

      console.log('✅ Perfil profissional criado no MongoDB');
      return convertMongoToProfessional(createdDoc);
    } catch (error) {
      console.error('❌ Erro ao criar perfil profissional:', error);
      throw error;
    }
  },

  /**
   * 📝 Atualizar perfil do profissional
   */
  async updateProfessionalProfile(
    profileId: string,
    updates: Partial<ProfessionalProfile>
  ): Promise<ProfessionalProfile> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('Usuário não logado');
      }

      console.log('📝 Atualizando perfil profissional no MongoDB:', profileId);

      const collection = await getCollection<ProfessionalDocument>(COLLECTIONS.PROFESSIONALS);
      
      // Verificar se o profissional pertence ao usuário
      const existing = await collection.findOne({ 
        _id: new ObjectId(profileId),
        userId: currentUser.uid 
      });

      if (!existing) {
        throw new Error('Profissional não encontrado ou não autorizado');
      }

      const mongoUpdates = convertProfessionalToMongo(updates);
      
      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(profileId) },
        { $set: mongoUpdates },
        { returnDocument: 'after' }
      );

      if (!result.value) {
        throw new Error('Erro ao atualizar profissional');
      }

      console.log('✅ Perfil profissional atualizado no MongoDB');
      return convertMongoToProfessional(result.value);
    } catch (error) {
      console.error('❌ Erro ao atualizar perfil profissional:', error);
      throw error;
    }
  },

  /**
   * 🔍 Buscar profissionais por categoria
   */
  async getProfessionalsByCategory(category: string): Promise<ProfessionalProfile[]> {
    try {
      console.log('🔍 Buscando profissionais da categoria no MongoDB:', category);

      const collection = await getCollection<ProfessionalDocument>(COLLECTIONS.PROFESSIONALS);
      const docs = await collection
        .find({ category })
        .sort({ rating: -1 })
        .limit(20)
        .toArray();

      const professionals = docs.map(convertMongoToProfessional);
      console.log(`✅ Encontrados ${professionals.length} profissionais na categoria ${category}`);
      
      return professionals;
    } catch (error) {
      console.error('❌ Erro ao buscar profissionais por categoria:', error);
      throw error;
    }
  },

  /**
   * 🔍 Buscar profissional por ID
   */
  async getProfessionalById(id: string): Promise<ProfessionalProfile | null> {
    try {
      console.log('🔍 Buscando profissional por ID no MongoDB:', id);

      const collection = await getCollection<ProfessionalDocument>(COLLECTIONS.PROFESSIONALS);
      const doc = await collection.findOne({ _id: new ObjectId(id) });

      if (!doc) {
        console.log('❌ Profissional não encontrado');
        return null;
      }

      console.log('✅ Profissional encontrado');
      return convertMongoToProfessional(doc);
    } catch (error) {
      console.error('❌ Erro ao buscar profissional por ID:', error);
      throw error;
    }
  },

  /**
   * 🔍 Buscar todos os profissionais
   */
  async getAllProfessionals(): Promise<ProfessionalProfile[]> {
    try {
      console.log('🔍 Buscando todos os profissionais no MongoDB');

      const collection = await getCollection<ProfessionalDocument>(COLLECTIONS.PROFESSIONALS);
      const docs = await collection
        .find({})
        .sort({ createdAt: -1 })
        .limit(50)
        .toArray();

      const professionals = docs.map(convertMongoToProfessional);
      console.log(`✅ Encontrados ${professionals.length} profissionais`);
      
      return professionals;
    } catch (error) {
      console.error('❌ Erro ao buscar profissionais:', error);
      throw error;
    }
  },

  /**
   * 🔍 Buscar profissionais com filtros
   */
  async searchProfessionals(filters: {
    category?: string;
    city?: string;
    state?: string;
    minRating?: number;
    maxPrice?: number;
    search?: string;
  }): Promise<ProfessionalProfile[]> {
    try {
      console.log('🔍 Buscando profissionais com filtros no MongoDB:', filters);

      const collection = await getCollection<ProfessionalDocument>(COLLECTIONS.PROFESSIONALS);
      
      // Construir query do MongoDB
      const query: any = {};

      if (filters.category) {
        query.category = filters.category;
      }

      if (filters.city) {
        query['location.city'] = filters.city;
      }

      if (filters.state) {
        query['location.state'] = filters.state;
      }

      if (filters.minRating) {
        query.rating = { $gte: filters.minRating };
      }

      if (filters.maxPrice) {
        query.hourlyRate = { $lte: filters.maxPrice };
      }

      if (filters.search) {
        query.$or = [
          { name: { $regex: filters.search, $options: 'i' } },
          { profession: { $regex: filters.search, $options: 'i' } },
          { description: { $regex: filters.search, $options: 'i' } }
        ];
      }

      const docs = await collection
        .find(query)
        .sort({ rating: -1 })
        .limit(30)
        .toArray();

      const professionals = docs.map(convertMongoToProfessional);
      console.log(`✅ Encontrados ${professionals.length} profissionais com filtros`);
      
      return professionals;
    } catch (error) {
      console.error('❌ Erro ao buscar profissionais com filtros:', error);
      throw error;
    }
  },

  /**
   * 🗑️ Deletar perfil do profissional
   */
  async deleteProfessionalProfile(profileId: string): Promise<void> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('Usuário não logado');
      }

      console.log('🗑️ Deletando perfil profissional no MongoDB:', profileId);

      const collection = await getCollection<ProfessionalDocument>(COLLECTIONS.PROFESSIONALS);
      
      const result = await collection.deleteOne({ 
        _id: new ObjectId(profileId),
        userId: currentUser.uid 
      });

      if (result.deletedCount === 0) {
        throw new Error('Profissional não encontrado ou não autorizado');
      }

      console.log('✅ Perfil profissional deletado do MongoDB');
    } catch (error) {
      console.error('❌ Erro ao deletar perfil profissional:', error);
      throw error;
    }
  },

  /**
   * ✅ Verificar se usuário já tem perfil profissional
   */
  async checkExistingProfile(): Promise<boolean> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        return false;
      }

      const collection = await getCollection<ProfessionalDocument>(COLLECTIONS.PROFESSIONALS);
      const doc = await collection.findOne({ userId: currentUser.uid });

      return !!doc;
    } catch (error) {
      console.error('❌ Erro ao verificar perfil existente:', error);
      return false;
    }
  }
};