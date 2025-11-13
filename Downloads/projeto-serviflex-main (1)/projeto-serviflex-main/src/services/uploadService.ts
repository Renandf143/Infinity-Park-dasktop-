import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase';

export type FileType = 'image' | 'pdf' | 'document';

export interface UploadProgress {
  progress: number;
  status: 'uploading' | 'success' | 'error';
  url?: string;
  error?: string;
}

class UploadService {
  
  /**
   * Tipos de arquivo aceitos
   */
  private readonly ACCEPTED_TYPES = {
    image: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
    pdf: ['application/pdf'],
    document: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
  };

  /**
   * Tamanhos máximos (em bytes)
   */
  private readonly MAX_SIZES = {
    image: 5 * 1024 * 1024, // 5MB
    pdf: 10 * 1024 * 1024, // 10MB
    document: 10 * 1024 * 1024 // 10MB
  };

  /**
   * Validar arquivo
   */
  validateFile(file: File, type: FileType): { valid: boolean; error?: string } {
    console.log('🔍 Validando arquivo:', {
      nome: file.name,
      tipo: file.type,
      tamanho: file.size,
      tipoEsperado: type
    });

    // Verificar tipo
    let isValidType = false;
    
    if (type === 'image') {
      // Aceitar qualquer arquivo que comece com "image/" OU tenha extensão de imagem
      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
      
      isValidType = file.type.startsWith('image/') || imageExtensions.includes(fileExtension);
      
      console.log('✅ Validação de imagem:', {
        mimeType: file.type,
        extensao: fileExtension,
        valido: isValidType
      });
    } else {
      const acceptedTypes = this.ACCEPTED_TYPES[type];
      isValidType = acceptedTypes.includes(file.type);
    }
    
    if (!isValidType) {
      console.error('❌ Tipo de arquivo inválido:', file.type);
      return {
        valid: false,
        error: `Tipo de arquivo não aceito. Aceitos: ${this.getAcceptedExtensions(type)}`
      };
    }

    // Verificar tamanho
    const maxSize = this.MAX_SIZES[type];
    if (file.size > maxSize) {
      console.error('❌ Arquivo muito grande:', file.size, 'máximo:', maxSize);
      return {
        valid: false,
        error: `Arquivo muito grande. Tamanho máximo: ${this.formatFileSize(maxSize)}`
      };
    }

    console.log('✅ Arquivo válido!');
    return { valid: true };
  }

  /**
   * Upload de arquivo com progresso
   */
  async uploadFile(
    file: File,
    path: string,
    type: FileType,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      // Validar arquivo
      const validation = this.validateFile(file, type);
      if (!validation.valid) {
        reject(new Error(validation.error));
        return;
      }

      // Gerar nome único
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(7);
      const extension = file.name.split('.').pop();
      const fileName = `${timestamp}_${randomString}.${extension}`;
      const fullPath = `${path}/${fileName}`;

      // Criar referência
      const storageRef = ref(storage, fullPath);

      // Upload
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress?.({
            progress,
            status: 'uploading'
          });
        },
        (error) => {
          console.error('❌ Erro no upload:', error);
          onProgress?.({
            progress: 0,
            status: 'error',
            error: error.message
          });
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            onProgress?.({
              progress: 100,
              status: 'success',
              url: downloadURL
            });
            resolve(downloadURL);
          } catch (error: unknown) {
            reject(error);
          }
        }
      );
    });
  }

  /**
   * Upload de imagem para portfólio
   */
  async uploadPortfolioImage(
    professionalId: string,
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<string> {
    const path = `portfolio/${professionalId}`;
    return this.uploadFile(file, path, 'image', onProgress);
  }

  /**
   * Upload de certificado
   */
  async uploadCertificate(
    professionalId: string,
    file: File,
    type: FileType,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<string> {
    const path = `certificates/${professionalId}`;
    return this.uploadFile(file, path, type, onProgress);
  }

  /**
   * Upload de foto de perfil
   */
  async uploadProfilePhoto(
    userId: string,
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<string> {
    const path = `profiles/${userId}`;
    return this.uploadFile(file, path, 'image', onProgress);
  }

  /**
   * Deletar arquivo
   */
  async deleteFile(url: string): Promise<void> {
    try {
      const fileRef = ref(storage, url);
      await deleteObject(fileRef);
      console.log('✅ Arquivo deletado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao deletar arquivo:', error);
      throw error;
    }
  }

  /**
   * Comprimir imagem antes do upload
   */
  async compressImage(file: File, maxWidth = 1920, quality = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Redimensionar se necessário
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                });
                resolve(compressedFile);
              } else {
                reject(new Error('Erro ao comprimir imagem'));
              }
            },
            'image/jpeg',
            quality
          );
        };
        
        img.onerror = () => reject(new Error('Erro ao carregar imagem'));
      };
      
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    });
  }

  /**
   * Obter extensões aceitas
   */
  getAcceptedExtensions(type: FileType): string {
    const extensions: Record<FileType, string> = {
      image: '.jpg, .jpeg, .png, .webp, .gif',
      pdf: '.pdf',
      document: '.pdf, .doc, .docx, .xls, .xlsx'
    };
    return extensions[type];
  }

  /**
   * Formatar tamanho de arquivo
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Obter tipo de arquivo pela URL
   */
  getFileTypeFromUrl(url: string): FileType {
    const extension = url.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(extension || '')) {
      return 'image';
    }
    
    if (extension === 'pdf') {
      return 'pdf';
    }
    
    return 'document';
  }

  /**
   * Gerar thumbnail de imagem
   */
  async generateThumbnail(file: File, maxSize = 300): Promise<File> {
    return this.compressImage(file, maxSize, 0.7);
  }
}

export const uploadService = new UploadService();
