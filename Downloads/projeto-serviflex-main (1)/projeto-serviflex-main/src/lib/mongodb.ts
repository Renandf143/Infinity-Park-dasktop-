import { MongoClient, Db, Collection } from 'mongodb';

/**
 * 🍃 CONFIGURAÇÃO DO MONGODB
 * 
 * Banco de dados principal para armazenar:
 * - Profissionais
 * - Serviços
 * - Avaliações
 * - Jobs
 */

// Configuração da conexão
const MONGODB_URI = import.meta.env.VITE_MONGODB_URI || 'mongodb+srv://renangomesdf3_db_user:<db_password>@serviflex.p2ce0wt.mongodb.net/?appName=ServiFlex';
const DB_NAME = 'serviflex';

if (!MONGODB_URI) {
  throw new Error(
    '🔒 ERRO: Variável VITE_MONGODB_URI não encontrada.\n' +
    'Configure no arquivo .env:\n' +
    'VITE_MONGODB_URI=sua_connection_string_mongodb'
  );
}

// Cliente MongoDB (singleton)
let client: MongoClient | null = null;
let db: Db | null = null;

/**
 * Conectar ao MongoDB
 */
export async function connectToMongoDB(): Promise<Db> {
  try {
    if (db) {
      return db;
    }

    console.log('🍃 Conectando ao MongoDB...');
    
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    db = client.db(DB_NAME);
    
    console.log('✅ MongoDB conectado com sucesso');
    return db;
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error);
    throw error;
  }
}

/**
 * Obter coleção do MongoDB
 */
export async function getCollection<T = any>(collectionName: string): Promise<Collection<T>> {
  const database = await connectToMongoDB();
  return database.collection<T>(collectionName);
}

/**
 * Fechar conexão com MongoDB
 */
export async function closeMongoDB(): Promise<void> {
  try {
    if (client) {
      await client.close();
      client = null;
      db = null;
      console.log('✅ Conexão MongoDB fechada');
    }
  } catch (error) {
    console.error('❌ Erro ao fechar conexão MongoDB:', error);
  }
}

// Interfaces para as coleções
export interface ProfessionalDocument {
  _id?: string;
  userId: string; // ID do Firebase Auth
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
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceDocument {
  _id?: string;
  professionalId: string;
  title: string;
  description: string;
  category: string;
  price: number;
  duration: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewDocument {
  _id?: string;
  professionalId: string;
  clientId: string; // ID do Firebase Auth
  clientName: string;
  rating: number;
  comment: string;
  serviceType: string;
  createdAt: Date;
}

export interface JobDocument {
  _id?: string;
  professionalId: string;
  clientId: string; // ID do Firebase Auth
  clientName: string;
  serviceId?: string;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  price: number;
  scheduledDate?: Date;
  completedDate?: Date;
  location?: {
    address: string;
    city: string;
    state: string;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Nomes das coleções
export const COLLECTIONS = {
  PROFESSIONALS: 'professionals',
  SERVICES: 'services',
  REVIEWS: 'reviews',
  JOBS: 'jobs'
} as const;

// Log de desenvolvimento
if (import.meta.env.DEV) {
  console.log('🍃 MongoDB configurado para desenvolvimento');
}