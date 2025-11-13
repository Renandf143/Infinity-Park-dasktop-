import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import userRoutes from './routes/users.js';

// Configurar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());

// Conexão MongoDB
let db;
const client = new MongoClient(process.env.MONGODB_URI);

async function connectDB() {
  try {
    await client.connect();
    db = client.db(process.env.DB_NAME);
    console.log('✅ Conectado ao MongoDB');
  } catch (error) {
    console.error('❌ Erro ao conectar MongoDB:', error);
    process.exit(1);
  }
}

// Rotas da API
app.use('/api/users', userRoutes);

// 🔍 GET - Buscar todos os profissionais
app.get('/api/professionals', async (req, res) => {
  try {
    const professionals = await db.collection('professionals').find({}).toArray();
    res.json({ success: true, data: professionals });
  } catch (error) {
    console.error('Erro ao buscar profissionais:', error);
    res.status(500).json({ success: false, error: 'Erro interno do servidor' });
  }
});

// 🔍 GET - Buscar profissional por ID
app.get('/api/professionals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const professional = await db.collection('professionals').findOne({ id });
    
    if (!professional) {
      return res.status(404).json({ success: false, error: 'Profissional não encontrado' });
    }
    
    res.json({ success: true, data: professional });
  } catch (error) {
    console.error('Erro ao buscar profissional:', error);
    res.status(500).json({ success: false, error: 'Erro interno do servidor' });
  }
});

// 🔍 GET - Buscar profissionais por categoria
app.get('/api/professionals/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const professionals = await db.collection('professionals')
      .find({ category })
      .sort({ rating: -1 })
      .limit(20)
      .toArray();
    
    res.json({ success: true, data: professionals });
  } catch (error) {
    console.error('Erro ao buscar profissionais por categoria:', error);
    res.status(500).json({ success: false, error: 'Erro interno do servidor' });
  }
});

// 🔍 POST - Buscar profissionais com filtros
app.post('/api/professionals/search', async (req, res) => {
  try {
    const { category, city, state, minRating, maxPrice, search } = req.body;
    
    let query = {};
    
    if (category) query.category = category;
    if (city) query['location.city'] = city;
    if (state) query['location.state'] = state;
    if (minRating) query.rating = { $gte: minRating };
    if (maxPrice) query.hourlyRate = { $lte: maxPrice };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { profession: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const professionals = await db.collection('professionals')
      .find(query)
      .sort({ rating: -1 })
      .limit(50)
      .toArray();
    
    res.json({ success: true, data: professionals });
  } catch (error) {
    console.error('Erro ao buscar profissionais com filtros:', error);
    res.status(500).json({ success: false, error: 'Erro interno do servidor' });
  }
});

// 📝 POST - Criar profissional
app.post('/api/professionals', async (req, res) => {
  try {
    const professionalData = {
      ...req.body,
      id: Date.now().toString(), // ID simples baseado em timestamp
      rating: 0,
      reviewsCount: 0,
      verified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stats: {
        totalJobs: 0,
        completedJobs: 0,
        totalEarnings: 0
      }
    };
    
    const result = await db.collection('professionals').insertOne(professionalData);
    
    res.status(201).json({ 
      success: true, 
      data: { ...professionalData, _id: result.insertedId }
    });
  } catch (error) {
    console.error('Erro ao criar profissional:', error);
    res.status(500).json({ success: false, error: 'Erro interno do servidor' });
  }
});

// 📝 PUT - Atualizar profissional
app.put('/api/professionals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    const result = await db.collection('professionals').updateOne(
      { id },
      { $set: updates }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, error: 'Profissional não encontrado' });
    }
    
    const updatedProfessional = await db.collection('professionals').findOne({ id });
    res.json({ success: true, data: updatedProfessional });
  } catch (error) {
    console.error('Erro ao atualizar profissional:', error);
    res.status(500).json({ success: false, error: 'Erro interno do servidor' });
  }
});

// 🗑️ DELETE - Deletar profissional
app.delete('/api/professionals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.collection('professionals').deleteOne({ id });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, error: 'Profissional não encontrado' });
    }
    
    res.json({ success: true, message: 'Profissional deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar profissional:', error);
    res.status(500).json({ success: false, error: 'Erro interno do servidor' });
  }
});

// 🏥 Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API funcionando!', 
    timestamp: new Date().toISOString() 
  });
});

// Inicializar servidor
async function startServer() {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📍 API: http://localhost:${PORT}/api`);
    console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
  });
}

startServer().catch(console.error);

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Encerrando servidor...');
  await client.close();
  process.exit(0);
});