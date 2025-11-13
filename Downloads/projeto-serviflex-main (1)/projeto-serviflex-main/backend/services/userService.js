import { MongoClient } from 'mongodb';
import { User } from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * 👤 SERVIÇO DE USUÁRIOS
 * 
 * Gerencia operações CRUD para usuários no MongoDB
 */

class UserService {
  constructor() {
    this.client = null;
    this.db = null;
    this.collection = null;
  }

  // Conectar ao MongoDB
  async connect() {
    if (!this.client) {
      this.client = new MongoClient(process.env.MONGODB_URI);
      await this.client.connect();
      this.db = this.client.db(process.env.DB_NAME || 'serviflix');
      this.collection = this.db.collection('users');
      
      // Criar índices
      await this.createIndexes();
    }
  }

  // Criar índices para otimização
  async createIndexes() {
    try {
      await this.collection.createIndex({ firebaseUid: 1 }, { unique: true });
      await this.collection.createIndex({ email: 1 }, { unique: true });
      await this.collection.createIndex({ accountType: 1 });
      await this.collection.createIndex({ profession: 1 });
      await this.collection.createIndex({ isActive: 1 });
      console.log('✅ Índices criados com sucesso');
    } catch (error) {
      console.log('ℹ️ Índices já existem ou erro ao criar:', error.message);
    }
  }

  // Criar novo usuário
  async createUser(userData) {
    await this.connect();

    const user = new User(userData);
    const validation = user.validate();

    if (!validation.isValid) {
      throw new Error(`Dados inválidos: ${validation.errors.join(', ')}`);
    }

    try {
      const result = await this.collection.insertOne(user.toDocument());
      console.log('✅ Usuário criado:', result.insertedId);
      
      return {
        _id: result.insertedId,
        ...user.toDocument()
      };
    } catch (error) {
      if (error.code === 11000) {
        if (error.keyPattern?.firebaseUid) {
          throw new Error('Usuário já existe com este Firebase UID');
        }
        if (error.keyPattern?.email) {
          throw new Error('Email já está em uso');
        }
      }
      throw error;
    }
  }

  // Buscar usuário por Firebase UID
  async getUserByFirebaseUid(firebaseUid) {
    await this.connect();
    
    const doc = await this.collection.findOne({ firebaseUid });
    return doc ? User.fromDocument(doc) : null;
  }

  // Buscar usuário por email
  async getUserByEmail(email) {
    await this.connect();
    
    const doc = await this.collection.findOne({ email });
    return doc ? User.fromDocument(doc) : null;
  }

  // Buscar usuário por ID
  async getUserById(id) {
    await this.connect();
    
    const { ObjectId } = await import('mongodb');
    const doc = await this.collection.findOne({ _id: new ObjectId(id) });
    return doc ? User.fromDocument(doc) : null;
  }

  // Atualizar usuário
  async updateUser(firebaseUid, updateData) {
    await this.connect();

    updateData.updatedAt = new Date();
    
    const result = await this.collection.updateOne(
      { firebaseUid },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      throw new Error('Usuário não encontrado');
    }

    return await this.getUserByFirebaseUid(firebaseUid);
  }

  // Listar profissionais
  async getProfessionals(filters = {}) {
    await this.connect();

    const query = { 
      accountType: 'professional',
      isActive: true,
      ...filters
    };

    const professionals = await this.collection
      .find(query)
      .sort({ rating: -1, reviewCount: -1 })
      .toArray();

    return professionals.map(doc => User.fromDocument(doc));
  }

  // Buscar profissionais por profissão
  async getProfessionalsByProfession(profession) {
    await this.connect();

    const professionals = await this.collection
      .find({
        accountType: 'professional',
        profession: { $regex: profession, $options: 'i' },
        isActive: true
      })
      .sort({ rating: -1, reviewCount: -1 })
      .toArray();

    return professionals.map(doc => User.fromDocument(doc));
  }

  // Desativar usuário
  async deactivateUser(firebaseUid) {
    await this.connect();

    const result = await this.collection.updateOne(
      { firebaseUid },
      { 
        $set: { 
          isActive: false,
          updatedAt: new Date()
        }
      }
    );

    return result.modifiedCount > 0;
  }

  // Fechar conexão
  async close() {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      this.collection = null;
    }
  }
}

export const userService = new UserService();