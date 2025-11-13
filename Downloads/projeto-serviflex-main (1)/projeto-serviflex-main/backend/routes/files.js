const express = require('express');
const { MongoClient, GridFSBucket, ObjectId } = require('mongodb');
const router = express.Router();

// Configuração do MongoDB
const uri = process.env.MONGODB_URI;
const dbName = 'serviflex';

let client;
let bucket;

// Conectar ao MongoDB
async function connectGridFS() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    bucket = new GridFSBucket(db, { bucketName: 'uploads' });
    console.log('✅ GridFS conectado no backend');
  }
  return bucket;
}

/**
 * GET /api/files/:fileId
 * Download de arquivo do GridFS
 */
router.get('/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    
    // Validar ObjectId
    if (!ObjectId.isValid(fileId)) {
      return res.status(400).json({ error: 'ID de arquivo inválido' });
    }

    const bucket = await connectGridFS();
    
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
      'Cache-Control': 'public, max-age=31536000' // Cache de 1 ano
    });

    // Stream do arquivo
    const downloadStream = bucket.openDownloadStream(new ObjectId(fileId));
    
    downloadStream
      .on('error', (error) => {
        console.error('❌ Erro ao fazer stream do arquivo:', error);
        res.status(500).json({ error: 'Erro ao baixar arquivo' });
      })
      .pipe(res);

  } catch (error) {
    console.error('❌ Erro no endpoint de download:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * DELETE /api/files/:fileId
 * Deletar arquivo do GridFS
 */
router.delete('/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    
    if (!ObjectId.isValid(fileId)) {
      return res.status(400).json({ error: 'ID de arquivo inválido' });
    }

    const bucket = await connectGridFS();
    await bucket.delete(new ObjectId(fileId));
    
    res.json({ 
      success: true, 
      message: 'Arquivo deletado com sucesso' 
    });

  } catch (error) {
    console.error('❌ Erro ao deletar arquivo:', error);
    res.status(500).json({ error: 'Erro ao deletar arquivo' });
  }
});

/**
 * GET /api/files/user/:userId
 * Listar arquivos de um usuário
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const bucket = await connectGridFS();
    
    const files = await bucket
      .find({ 'metadata.userId': userId })
      .toArray();

    const fileList = files.map(file => ({
      fileId: file._id.toString(),
      filename: file.filename,
      size: file.length,
      contentType: file.metadata?.contentType,
      uploadDate: file.uploadDate,
      category: file.metadata?.category
    }));

    res.json(fileList);

  } catch (error) {
    console.error('❌ Erro ao listar arquivos:', error);
    res.status(500).json({ error: 'Erro ao listar arquivos' });
  }
});

module.exports = router;
