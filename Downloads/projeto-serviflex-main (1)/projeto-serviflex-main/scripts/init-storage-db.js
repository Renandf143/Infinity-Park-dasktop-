/**
 * Script de Inicialização do Banco de Dados de Storage
 * 
 * Este script:
 * 1. Conecta ao MongoDB
 * 2. Cria o banco de dados serviflex_storage
 * 3. Cria índices para melhor performance
 * 4. Configura o GridFS bucket
 */

const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.VITE_MONGODB_STORAGE_URI || 'mongodb://localhost:27017';
const DATABASE_NAME = 'serviflex_storage';

async function initStorageDatabase() {
  console.log('🚀 Iniciando configuração do banco de dados de storage...\n');

  let client;

  try {
    // Conectar ao MongoDB
    console.log('📡 Conectando ao MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Conectado ao MongoDB\n');

    // Selecionar banco de dados
    const db = client.db(DATABASE_NAME);
    console.log(`📦 Banco de dados: ${DATABASE_NAME}\n`);

    // Criar coleções se não existirem
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    if (!collectionNames.includes('files.files')) {
      console.log('📁 Criando coleção files.files...');
      await db.createCollection('files.files');
      console.log('✅ Coleção files.files criada\n');
    } else {
      console.log('✅ Coleção files.files já existe\n');
    }

    if (!collectionNames.includes('files.chunks')) {
      console.log('📁 Criando coleção files.chunks...');
      await db.createCollection('files.chunks');
      console.log('✅ Coleção files.chunks criada\n');
    } else {
      console.log('✅ Coleção files.chunks já existe\n');
    }

    // Criar índices para melhor performance
    console.log('🔍 Criando índices...');
    
    const filesCollection = db.collection('files.files');
    
    // Índice para busca por usuário
    await filesCollection.createIndex({ 'metadata.uploadedBy': 1 });
    console.log('✅ Índice criado: metadata.uploadedBy');

    // Índice para busca por categoria
    await filesCollection.createIndex({ 'metadata.category': 1 });
    console.log('✅ Índice criado: metadata.category');

    // Índice para busca por entidade relacionada
    await filesCollection.createIndex({ 'metadata.relatedTo': 1 });
    console.log('✅ Índice criado: metadata.relatedTo');

    // Índice para ordenação por data
    await filesCollection.createIndex({ uploadDate: -1 });
    console.log('✅ Índice criado: uploadDate');

    // Índice composto para queries comuns
    await filesCollection.createIndex({ 
      'metadata.category': 1, 
      'metadata.relatedTo': 1 
    });
    console.log('✅ Índice composto criado: category + relatedTo\n');

    // Estatísticas
    const stats = await db.stats();
    console.log('📊 Estatísticas do banco de dados:');
    console.log(`   - Tamanho: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   - Coleções: ${stats.collections}`);
    console.log(`   - Índices: ${stats.indexes}\n`);

    console.log('✅ Configuração concluída com sucesso!');
    console.log('\n📝 Próximos passos:');
    console.log('   1. Configure VITE_MONGODB_STORAGE_URI no arquivo .env');
    console.log('   2. Importe os componentes de upload no seu projeto');
    console.log('   3. Use FileUploadManager e FileGallery nos seus componentes\n');

  } catch (error) {
    console.error('❌ Erro durante a configuração:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 Conexão fechada');
    }
  }
}

// Executar script
initStorageDatabase();
