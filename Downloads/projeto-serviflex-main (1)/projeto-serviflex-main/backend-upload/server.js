import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient, GridFSBucket, ObjectId } from 'mongodb';
import multer from 'multer';
import { Readable } from 'stream';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
const uri = process.env.MONGODB_URI;
let client;
let bucket;

async function connectDB() {
  try {
    client = new MongoClient(uri);
    await client.connect();
    const db = client.db('serviflex');
    bucket = new GridFSBucket(db, { bucketName: 'uploads' });
    console.log('✅ Conectado ao MongoDB GridFS');
  } catch (error) {
    console.error('❌ Erro ao conectar MongoDB:', error);
    process.exit(1);
  }
}

// Configurar Multer para memória
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  }
});

/**
 * POST /api/upload
 * Upload de arquivo para GridFS
 */
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const { userId, category } = req.body;

    console.log('📤 Recebendo upload:', {
      filename: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      userId,
      category
    });

    // Criar stream de upload
    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      metadata: {
        userId,
        category,
        contentType: req.file.mimetype,
        size: req.file.size,
        uploadedAt: new Date()
      }
    });

    // Converter buffer para stream
    const readableStream = Readable.from(req.file.buffer);

    // Fazer upload
    await new Promise((resolve, reject) => {
      readableStream
        .pipe(uploadStream)
        .on('error', reject)
        .on('finish', resolve);
    });

    const fileId = uploadStream.id.toString();
    const downloadUrl = `/api/files/${fileId}`;

    console.log('✅ Upload concluído:', fileId);

    res.json({
      success: true,
      fileId,
      url: downloadUrl,
      filename: req.file.originalname,
      size: req.file.size,
      contentType: req.file.mimetype
    });

  } catch (error) {
    console.error('❌ Erro no upload:', error);
    res.status(500).json({ error: 'Erro ao fazer upload' });
  }
});

/**
 * GET /api/files/:fileId
 * Download de arquivo do GridFS
 */
app.get('/api/files/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;

    if (!ObjectId.isValid(fileId)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    // Buscar informações do arquivo
    const files = await bucket.find({ _id: new ObjectId(fileId) }).toArray();

    if (files.length === 0) {
      return res.status(404).json({ error: 'Arquivo não encontrado' });
    }

    const file = files[0];

    // Configurar headers
    res.set({
      'Content-Type': file.metadata?.contentType || 'application/octet-stream',
      'Content-Length': file.length,
      'Content-Disposition': `inline; filename="${file.filename}"`,
      'Cache-Control': 'public, max-age=31536000'
    });

    // Stream do arquivo
    const downloadStream = bucket.openDownloadStream(new ObjectId(fileId));
    downloadStream.pipe(res);

  } catch (error) {
    console.error('❌ Erro no download:', error);
    res.status(500).json({ error: 'Erro ao baixar arquivo' });
  }
});

/**
 * DELETE /api/files/:fileId
 * Deletar arquivo do GridFS
 */
app.delete('/api/files/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;

    if (!ObjectId.isValid(fileId)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    await bucket.delete(new ObjectId(fileId));

    res.json({ success: true, message: 'Arquivo deletado' });

  } catch (error) {
    console.error('❌ Erro ao deletar:', error);
    res.status(500).json({ error: 'Erro ao deletar arquivo' });
  }
});

/**
 * GET /api/files/user/:userId
 * Listar arquivos de um usuário
 */
app.get('/api/files/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const files = await bucket
      .find({ 'metadata.userId': userId })
      .toArray();

    const fileList = files.map(file => ({
      fileId: file._id.toString(),
      filename: file.filename,
      size: file.length,
      contentType: file.metadata?.contentType,
      uploadDate: file.uploadDate,
      category: file.metadata?.category,
      url: `/api/files/${file._id.toString()}`
    }));

    res.json(fileList);

  } catch (error) {
    console.error('❌ Erro ao listar arquivos:', error);
    res.status(500).json({ error: 'Erro ao listar arquivos' });
  }
});

/**
 * GET /api/health
 * Health check
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mongodb: client ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Backend de Upload rodando na porta ${PORT}`);
    console.log(`📍 API: http://localhost:${PORT}/api`);
    console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
  });
}

startServer().catch(console.error);

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Encerrando servidor...');
  if (client) {
    await client.close();
  }
  process.exit(0);
});
