import { useState } from 'react';
import {
  uploadFile,
  downloadFile,
  deleteFile,
  getFileInfo,
  listUserFiles,
  listFilesByCategory,
  getFileDataURL,
  validateFileType,
  validateFileSize,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_DOCUMENT_TYPES,
  MAX_IMAGE_SIZE_MB,
  MAX_DOCUMENT_SIZE_MB,
  FileMetadata,
  StoredFile
} from '../services/fileStorageService';

export function useFileStorage() {
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Upload de arquivo com validação
   */
  const upload = async (
    file: File,
    metadata: Omit<FileMetadata, 'filename' | 'contentType' | 'size' | 'uploadedAt'>
  ): Promise<string | null> => {
    setUploading(true);
    setError(null);

    try {
      // Validação de tipo
      const isImage = metadata.category === 'profile' || metadata.category === 'portfolio';
      const allowedTypes = isImage ? ALLOWED_IMAGE_TYPES : [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES];
      
      if (!validateFileType(file.type, allowedTypes)) {
        throw new Error(`Tipo de arquivo não permitido: ${file.type}`);
      }

      // Validação de tamanho
      const maxSize = isImage ? MAX_IMAGE_SIZE_MB : MAX_DOCUMENT_SIZE_MB;
      if (!validateFileSize(file.size, maxSize)) {
        throw new Error(`Arquivo muito grande. Máximo: ${maxSize}MB`);
      }

      // Converter File para Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Fazer upload
      const fileId = await uploadFile(buffer, {
        filename: file.name,
        contentType: file.type,
        size: file.size,
        uploadedAt: new Date(),
        ...metadata
      });

      return fileId;
    } catch (err: any) {
      setError(err.message);
      console.error('Erro no upload:', err);
      return null;
    } finally {
      setUploading(false);
    }
  };

  /**
   * Download de arquivo
   */
  const download = async (fileId: string): Promise<Buffer | null> => {
    setDownloading(true);
    setError(null);

    try {
      const buffer = await downloadFile(fileId);
      return buffer;
    } catch (err: any) {
      setError(err.message);
      console.error('Erro no download:', err);
      return null;
    } finally {
      setDownloading(false);
    }
  };

  /**
   * Obter URL de visualização
   */
  const getPreviewURL = async (fileId: string): Promise<string | null> => {
    setError(null);

    try {
      const dataURL = await getFileDataURL(fileId);
      return dataURL;
    } catch (err: any) {
      setError(err.message);
      console.error('Erro ao gerar preview:', err);
      return null;
    }
  };

  /**
   * Deletar arquivo
   */
  const remove = async (fileId: string): Promise<boolean> => {
    setError(null);

    try {
      await deleteFile(fileId);
      return true;
    } catch (err: any) {
      setError(err.message);
      console.error('Erro ao deletar:', err);
      return false;
    }
  };

  /**
   * Listar arquivos do usuário
   */
  const listFiles = async (userId: string): Promise<StoredFile[]> => {
    setError(null);

    try {
      const files = await listUserFiles(userId);
      return files;
    } catch (err: any) {
      setError(err.message);
      console.error('Erro ao listar arquivos:', err);
      return [];
    }
  };

  /**
   * Listar arquivos por categoria
   */
  const listByCategory = async (
    category: FileMetadata['category'],
    relatedTo?: string
  ): Promise<StoredFile[]> => {
    setError(null);

    try {
      const files = await listFilesByCategory(category, relatedTo);
      return files;
    } catch (err: any) {
      setError(err.message);
      console.error('Erro ao listar por categoria:', err);
      return [];
    }
  };

  /**
   * Obter informações do arquivo
   */
  const getInfo = async (fileId: string): Promise<StoredFile | null> => {
    setError(null);

    try {
      const info = await getFileInfo(fileId);
      return info;
    } catch (err: any) {
      setError(err.message);
      console.error('Erro ao obter info:', err);
      return null;
    }
  };

  return {
    upload,
    download,
    getPreviewURL,
    remove,
    listFiles,
    listByCategory,
    getInfo,
    uploading,
    downloading,
    error
  };
}
