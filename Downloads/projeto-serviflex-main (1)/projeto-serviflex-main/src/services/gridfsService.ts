interface UploadResult {
  fileId: string;
  filename: string;
  size: number;
  contentType: string;
  uploadDate?: Date;
}

class GridFSService {
  private readonly backendUrl: string;

  constructor() {
    // URL do backend de upload
    this.backendUrl = import.meta.env.VITE_UPLOAD_BACKEND_URL || 'http://localhost:5001';
    console.log('📡 GridFS Backend URL:', this.backendUrl);
  }

  /**
   * Verificar se backend está online
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.backendUrl}/api/health`);
      const data = await response.json();
      return data.status === 'ok';
    } catch (error) {
      console.error('❌ Backend offline:', error);
      return false;
    }
  }

  /**
   * Upload de arquivo para GridFS via backend
   */
  async uploadFile(
    file: File,
    metadata?: Record<string, any>
  ): Promise<UploadResult> {
    try {
      console.log('📤 Enviando arquivo para backend GridFS...');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', metadata?.userId || 'anonymous');
      formData.append('category', metadata?.category || 'general');

      const response = await fetch(`${this.backendUrl}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Erro no upload: ${response.statusText}`);
      }

      const data = await response.json();

      console.log('✅ Arquivo enviado para GridFS:', data);

      return {
        fileId: data.fileId,
        filename: data.filename,
        size: data.size,
        contentType: data.contentType,
      };
    } catch (error) {
      console.error('❌ Erro no upload GridFS:', error);
      throw error;
    }
  }

  /**
   * Download de arquivo do GridFS via backend
   */
  async downloadFile(fileId: string): Promise<Blob> {
    try {
      const response = await fetch(`${this.backendUrl}/api/files/${fileId}`);

      if (!response.ok) {
        throw new Error(`Erro no download: ${response.statusText}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('❌ Erro no download GridFS:', error);
      throw error;
    }
  }

  /**
   * Obter URL de download (para usar no frontend)
   */
  getDownloadUrl(fileId: string): string {
    return `${this.backendUrl}/api/files/${fileId}`;
  }

  /**
   * Deletar arquivo do GridFS via backend
   */
  async deleteFile(fileId: string): Promise<void> {
    try {
      const response = await fetch(`${this.backendUrl}/api/files/${fileId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Erro ao deletar: ${response.statusText}`);
      }

      console.log('✅ Arquivo deletado do GridFS:', fileId);
    } catch (error) {
      console.error('❌ Erro ao deletar arquivo:', error);
      throw error;
    }
  }

  /**
   * Listar arquivos de um usuário via backend
   */
  async listUserFiles(userId: string): Promise<any[]> {
    try {
      const response = await fetch(`${this.backendUrl}/api/files/user/${userId}`);

      if (!response.ok) {
        throw new Error(`Erro ao listar arquivos: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Erro ao listar arquivos:', error);
      return [];
    }
  }
}

export const gridfsService = new GridFSService();
