import express from 'express';
import bcrypt from 'bcryptjs';
import { userService } from '../services/userService.js';

const router = express.Router();

/**
 * 📝 POST /api/users/register - Registrar novo usuário (backup do Firebase)
 */
router.post('/register', async (req, res) => {
  try {
    console.log('📝 Salvando dados do usuário no MongoDB (backup):', req.body.email);

    // Verificar se já existe usuário com este firebaseUid
    if (req.body.firebaseUid) {
      const existingUser = await userService.getUserByFirebaseUid(req.body.firebaseUid);
      if (existingUser) {
        return res.status(200).json({
          success: true,
          message: 'Usuário já existe',
          data: existingUser
        });
      }
    }

    const userData = {
      firebaseUid: req.body.firebaseUid,
      email: req.body.email,
      name: req.body.name,
      phone: req.body.phone,
      accountType: req.body.accountType,
      profileImage: req.body.profileImage || null,
      
      // Campos específicos para clientes
      ...(req.body.accountType === 'client' && {
        cpf: req.body.cpf,
        birthDate: req.body.birthDate,
        address: req.body.address,
        preferences: req.body.preferences
      }),
      
      // Campos específicos para profissionais
      ...(req.body.accountType === 'professional' && {
        profession: req.body.profession,
        experience: req.body.experience,
        description: req.body.description,
        skills: req.body.skills || [],
        location: req.body.location || {},
        priceRange: req.body.priceRange || {}
      })
    };

    const user = await userService.createUser(userData);
    
    res.status(201).json({
      success: true,
      message: 'Dados salvos no MongoDB com sucesso',
      data: user
    });
  } catch (error) {
    console.error('❌ Erro ao salvar no MongoDB:', error);
    
    res.status(400).json({
      success: false,
      message: error.message,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * 📝 POST /api/users - Criar novo usuário
 */
router.post('/', async (req, res) => {
  try {
    console.log('📝 Criando usuário:', req.body);

    const userData = {
      firebaseUid: req.body.firebaseUid,
      email: req.body.email,
      name: req.body.name,
      phone: req.body.phone,
      accountType: req.body.accountType,
      profileImage: req.body.profileImage,
      
      // Campos específicos para profissionais
      ...(req.body.accountType === 'professional' && {
        profession: req.body.profession,
        experience: req.body.experience,
        description: req.body.description,
        skills: req.body.skills || [],
        location: req.body.location || {},
        priceRange: req.body.priceRange || {}
      })
    };

    const user = await userService.createUser(userData);
    
    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      data: user
    });
  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error);
    
    res.status(400).json({
      success: false,
      message: error.message,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * 👤 GET /api/users/firebase/:uid - Buscar usuário por Firebase UID
 */
router.get('/firebase/:uid', async (req, res) => {
  try {
    const user = await userService.getUserByFirebaseUid(req.params.uid);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('❌ Erro ao buscar usuário:', error);
    
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * 📧 GET /api/users/email/:email - Buscar usuário por email
 */
router.get('/email/:email', async (req, res) => {
  try {
    const user = await userService.getUserByEmail(req.params.email);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('❌ Erro ao buscar usuário:', error);
    
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * 🔧 PUT /api/users/firebase/:uid - Atualizar usuário
 */
router.put('/firebase/:uid', async (req, res) => {
  try {
    const updateData = { ...req.body };
    delete updateData.firebaseUid; // Não permitir alterar o UID
    delete updateData._id; // Não permitir alterar o ID

    const user = await userService.updateUser(req.params.uid, updateData);
    
    res.json({
      success: true,
      message: 'Usuário atualizado com sucesso',
      data: user
    });
  } catch (error) {
    console.error('❌ Erro ao atualizar usuário:', error);
    
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * 👷 GET /api/users/professionals - Listar profissionais
 */
router.get('/professionals', async (req, res) => {
  try {
    const { profession, location, minRating } = req.query;
    
    const filters = {};
    if (profession) {
      filters.profession = { $regex: profession, $options: 'i' };
    }
    if (minRating) {
      filters.rating = { $gte: parseFloat(minRating) };
    }

    const professionals = await userService.getProfessionals(filters);
    
    res.json({
      success: true,
      data: professionals,
      count: professionals.length
    });
  } catch (error) {
    console.error('❌ Erro ao listar profissionais:', error);
    
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * 🔍 GET /api/users/professionals/search/:profession - Buscar profissionais por profissão
 */
router.get('/professionals/search/:profession', async (req, res) => {
  try {
    const professionals = await userService.getProfessionalsByProfession(req.params.profession);
    
    res.json({
      success: true,
      data: professionals,
      count: professionals.length
    });
  } catch (error) {
    console.error('❌ Erro ao buscar profissionais:', error);
    
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * ❌ DELETE /api/users/firebase/:uid - Desativar usuário
 */
router.delete('/firebase/:uid', async (req, res) => {
  try {
    const success = await userService.deactivateUser(req.params.uid);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Usuário desativado com sucesso'
    });
  } catch (error) {
    console.error('❌ Erro ao desativar usuário:', error);
    
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export default router;