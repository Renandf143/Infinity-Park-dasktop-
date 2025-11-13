import { useState, useRef } from 'react';
import { UploadIcon, FileIcon, ImageIcon, FileTextIcon, XIcon, CheckCircleIcon, Loader2Icon, AlertCircleIcon } from 'lucide-react';
import { uploadService, FileType, UploadProgress } from '../services/uploadService';

interface FileUploaderProps {
  type: FileType;
  onUploadComplete: (url: string) => void;
  onUploadError?: (error: string) => void;
  maxFiles?: number;
  compress?: boolean;
  label?: string;
  description?: string;
}

export function FileUploader({
  type,
  onUploadComplete,
  onUploadError,
  maxFiles = 1,
  compress = true,
  label,
  description
}: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getIcon = () => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-8 h-8" />;
      case 'pdf':
        return <FileTextIcon className="w-8 h-8" />;
      case 'document':
        return <FileIcon className="w-8 h-8" />;
    }
  };

  const getLabel = () => {
    if (label) return label;
    
    switch (type) {
      case 'image':
        return 'Selecionar Imagem';
      case 'pdf':
        return 'Selecionar PDF';
      case 'document':
        return 'Selecionar Documento';
    }
  };

  const getDescription = () => {
    if (description) return description;
    
    const extensions = uploadService.getAcceptedExtensions(type);
    const maxSize = type === 'image' ? '5MB' : '10MB';
    return `Formatos aceitos: ${extensions} | Tamanho máximo: ${maxSize}`;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar arquivo
    const validation = uploadService.validateFile(file, type);
    if (!validation.valid) {
      onUploadError?.(validation.error || 'Arquivo inválido');
      return;
    }

    setSelectedFile(file);

    // Gerar preview para imagens
    if (type === 'image') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setProgress({ progress: 0, status: 'uploading' });

    try {
      let fileToUpload = selectedFile;

      // Comprimir imagem se necessário
      if (type === 'image' && compress) {
        fileToUpload = await uploadService.compressImage(selectedFile);
      }

      // Upload
      const url = await uploadService.uploadFile(
        fileToUpload,
        'uploads',
        type,
        (progressData) => {
          setProgress(progressData);
        }
      );

      onUploadComplete(url);
      
      // Reset
      setSelectedFile(null);
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      console.error('Erro no upload:', error);
      onUploadError?.(error.message || 'Erro ao fazer upload');
      setProgress({ progress: 0, status: 'error', error: error.message });
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreview(null);
    setProgress(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {!selectedFile && (
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            accept={uploadService.getAcceptedExtensions(type)}
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center gap-3"
          >
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
              {getIcon()}
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">{getLabel()}</p>
              <p className="text-sm text-gray-500 mt-1">{getDescription()}</p>
            </div>
            <button
              type="button"
              className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <UploadIcon className="w-4 h-4" />
              Escolher Arquivo
            </button>
          </label>
        </div>
      )}

      {/* Preview e Upload */}
      {selectedFile && (
        <div className="border-2 border-blue-300 rounded-xl p-6 bg-blue-50">
          <div className="flex items-start gap-4">
            {/* Preview */}
            <div className="flex-shrink-0">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-lg border-2 border-white shadow-sm"
                />
              ) : (
                <div className="w-24 h-24 bg-white rounded-lg border-2 border-gray-200 flex items-center justify-center">
                  {type === 'pdf' ? (
                    <FileTextIcon className="w-12 h-12 text-red-500" />
                  ) : (
                    <FileIcon className="w-12 h-12 text-gray-400" />
                  )}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{selectedFile.name}</p>
              <p className="text-sm text-gray-600 mt-1">
                {uploadService.formatFileSize(selectedFile.size)}
              </p>

              {/* Progress */}
              {progress && progress.status === 'uploading' && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Enviando...</span>
                    <span className="font-semibold text-blue-600">
                      {Math.round(progress.progress)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Success */}
              {progress && progress.status === 'success' && (
                <div className="mt-3 flex items-center gap-2 text-green-600">
                  <CheckCircleIcon className="w-5 h-5" />
                  <span className="text-sm font-semibold">Upload concluído!</span>
                </div>
              )}

              {/* Error */}
              {progress && progress.status === 'error' && (
                <div className="mt-3 flex items-start gap-2 text-red-600">
                  <AlertCircleIcon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{progress.error}</span>
                </div>
              )}

              {/* Actions */}
              {!progress && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <Loader2Icon className="w-4 h-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <UploadIcon className="w-4 h-4" />
                        Enviar
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={uploading}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    <XIcon className="w-4 h-4" />
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
