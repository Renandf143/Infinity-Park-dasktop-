import { MongoClient, GridFSBucket, ObjectId } from 'mongodb';

const MONGODB_URI = process.env.VITE_MONGODB_STORAGE_URI || 'mongodb://localhost:27017';
const DATABASE_NAME = 'serviflex_storage';

let client: MongoClient | null = null;
let bucket: GridFSBucket | null = null;

/**
 * Conecta ao MongoDB e inicializa o GridFS Bucket
 */
export async function connectStorageDB() {
  if (client && bucket) {
    return { client, bucket };
  }

  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db(DATABASE_NAME);
    bucket = new GridFSBucket(db, {
      bucketName: 'files'
    });

    console.log('✅ Conectado ao MongoDB Storage');
    return { client, bucket };
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB Storage:', error);
    throw error;
  }
}

/**
 * Fecha a conexão com o MongoDB
 */
export async function disconnectStorageDB() {
  if (client) {
    await client.close();
    client = null;
    bucket = null;
    console.log('✅ Desconectado do MongoDB Storage');
  }
}

/**
 * Retorna o bucket do GridFS
 */
export async function getStorageBucket(): Promise<GridFSBucket> {
  if (!bucket) {
    const connection = await connectStorageDB();
    return connection.bucket;
  }
  return bucket;
}

/**
 * Retorna o cliente MongoDB
 */
export async function getStorageClient(): Promise<MongoClient> {
  if (!client) {
    const connection = await connectStorageDB();
    return connection.client;
  }
  return client;
}

export { ObjectId };
