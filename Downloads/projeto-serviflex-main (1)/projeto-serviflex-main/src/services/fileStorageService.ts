import { Readable } from 'stream';
import { getStorageBucket, ObjectId } from '../database/mongodb-storage';

export interface FileMetadata {
  filename: string;
  contentType: string;
  size: number;
  uploadedBy: string;
  category: 'profile' | 'portfolio' | 'certificate' | 'document' | 'other';
  relatedTo?: string; // ID do usuário ou entidade relacionada
  uploadedAt: Date;
}

export interface StoredFile {
  _id: ObjectId;
  filename: string;
  contentType: string;
  size: number;
  uploadDate: Date;
  metadata: FileMetadata;
}

/**
 * Faz upload de um arquivo para o MongoDB GridFS
 */
export async function uploadFile(
  fileBuffer: Buffer,
  metadata: FileMetadata
): Promise<string> {
  try {
    const bucket = await getStorageBucket();

    return new Promise((resolve, reject) => {
      const uploadStream = bucket.openUploadStream(metadata.filename, {
        metadata: {
          ...metadata,
          uploadedAt: new Date()
        }
      });

      const readableStream = Readable.from(fileBuffer);
      
      readableStream.pipe(uploadStream)
        .on('error', (error) => {
          console.error('❌ Erro no upload:', error);
          reject(error);
        })
        .on('finish', () => {
          console.log('✅ Arquivo enviado:', uploadStream.id.toString());
          resolve(uploadStream.id.toString());
        });
    });
  } catch (error) {
    console.error('❌ Erro ao fazer upload:', error);
    throw error;
  }
}

/**
 * Faz download de um arquivo do MongoDB GridFS
 */
export async function downloadFile(fileId: string): Promise<Buffer> {
  try {
    const bucket = await getStorageBucket();
    const objectId = new ObjectId(fileId);

    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      
      bucket.openDownloadStream(objectId)
        .on('data', (chunk) => chunks.push(chunk))
        .on('error', (error) => {
          console.error('❌ Erro no download:', error);
          reject(error);
        })
        .on('end', () => {
          resolve(Buffer.concat(chunks));
        });
    });
  } catch (error) {
    console.error('❌ Erro ao fazer download:', error);
    throw error;
  }
}

/**
 * Obtém informações de um arquivo
 */
export async function getFileInfo(fileId: string): Promise<StoredFile | null> {
  try {
    const bucket = await getStorageBucket();
    const objectId = new ObjectId(fileId);

    const files = await bucket.find({ _id: objectId }).toArray();
    
    if (files.length === 0) {
      return null;
    }

    return files[0] as StoredFile;
  } catch (error) {
    console.error('❌ Erro ao obter info do arquivo:', error);
    throw error;
  }
}

/**
 * Lista arquivos por categoria
 */
export async function listFilesByCategory(
  category: FileMetadata['category'],
  relatedTo?: string
): Promise<StoredFile[]> {
  try {
    const bucket = await getStorageBucket();
    
    const query: any = { 'metadata.category': category };
    if (relatedTo) {
      query['metadata.relatedTo'] = relatedTo;
    }

    const files = await bucket.find(query).toArray();
    return files as StoredFile[];
  } catch (error) {
    console.error('❌ Erro ao listar arquivos:', error);
    throw error;
  }
}

/**
 * Lista todos os arquivos de um usuário
 */
export async function listUserFiles(userId: string): Promise<StoredFile[]> {
  try {
    const bucket = await getStorageBucket();
    
    const files = await bucket.find({
      'metadata.relatedTo': userId
    }).toArray();

    return files as StoredFile[];
  } catch (error) {
    console.error('❌ Erro ao listar arquivos do usuário:', error);
    throw error;
  }
}

/**
 * Deleta um arquivo do MongoDB GridFS
 */
export async function deleteFile(fileId: string): Promise<boolean> {
  try {
    const bucket = await getStorageBucket();
    const objectId = new ObjectId(fileId);

    await bucket.delete(objectId);
    console.log('✅ Arquivo deletado:', fileId);
    return true;
  } catch (error) {
    console.error('❌ Erro ao deletar arquivo:', error);
    throw error;
  }
}

/**
 * Deleta múltiplos arquivos
 */
export async function deleteMultipleFiles(fileIds: string[]): Promise<number> {
  let deletedCount = 0;
  
  for (const fileId of fileIds) {
    try {
      await deleteFile(fileId);
      deletedCount++;
    } catch (error) {
      console.error(`❌ Erro ao deletar arquivo ${fileId}:`, error);
    }
  }

  return deletedCount;
}

/**
 * Obtém URL temporária para visualização (base64)
 */
export async function getFileDataURL(fileId: string): Promise<string> {
  try {
    const fileBuffer = await downloadFile(fileId);
    const fileInfo = await getFileInfo(fileId);
    
    if (!fileInfo) {
      throw new Error('Arquivo não encontrado');
    }

    const base64 = fileBuffer.toString('base64');
    return `data:${fileInfo.contentType};base64,${base64}`;
  } catch (error) {
    console.error('❌ Erro ao gerar data URL:', error);
    throw error;
  }
}

/**
 * Valida tipo de arquivo
 */
export function validateFileType(
  contentType: string,
  allowedTypes: string[]
): boolean {
  return allowedTypes.some(type => contentType.includes(type));
}

/**
 * Valida tamanho do arquivo (em MB)
 */
export function validateFileSize(size: number, maxSizeMB: number): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return size <= maxSizeBytes;
}

// Tipos de arquivo permitidos
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
export const ALLOWED_ALL_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES];

// Tamanhos máximos (em MB)
export const MAX_IMAGE_SIZE_MB = 5;
export const MAX_DOCUMENT_SIZE_MB = 10;
