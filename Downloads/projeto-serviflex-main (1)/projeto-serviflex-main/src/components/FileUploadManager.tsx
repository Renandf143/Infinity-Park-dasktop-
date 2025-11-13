import React, { useState, useRef } from 'react';
import { Upload, X, File, Image, FileText, Loader2 } from 'lucide-react';
import { useFileStorage } from '../hooks/useFileStorage';
import { useAuth } from '../hooks/useAuth';

interface FileUploadManagerProps {
  category: 'profile' | 'portfolio' | 'certificate' | 'document' | 'other';
  relatedTo?: string;
  onUploadComplete?: (fileId: string) => void;
  acceptedTypes?: string;
  maxSizeMB?: number;
  multiple?: boolean;
}

export function FileUploadManager({
  category,
  relatedTo,
  onUploadComplete,
  acceptedTypes = 'image/*,application/pdf',
  maxSizeMB = 5,
  multiple = false
}: FileUploadManagerProps) {
  const { user } = useAuth();
  const { upload, uploading, error } = useFileStorage();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validar tamanho
    const validFiles = files.filter(file => {
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > maxSizeMB) {
        alert(`${file.name} é muito grande. Máximo: ${maxSizeMB}MB`);
        return false;
      }
      return true;
    });

    if (multiple) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
    } else {
      setSelectedFiles(validFiles.slice(0, 1));
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!user || selectedFiles.length === 0) return;

    for (const file of selectedFiles) {
      try {
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));

        const fileId = await upload(file, {
          uploadedBy: user.uid,
          category,
          relatedTo: relatedTo || user.uid
        });

        if (fileId) {
          setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
          onUploadComplete?.(fileId);
        }
      } catch (err) {
        console.error(`Erro ao fazer upload de ${file.name}:`, err);
      }
    }

    // Limpar após upload
    setTimeout(() => {
      setSelectedFiles([]);
      setUploadProgress({});
    }, 1000);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="w-8 h-8 text-blue-500" />;
    } else if (file.type === 'application/pdf') {
      return <FileText className="w-8 h-8 text-red-500" />;
    }
    return <File className="w-8 h-8 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="space-y-4">
      {/* Área de Upload */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600 mb-2">
          Clique para selecionar {multiple ? 'arquivos' : 'arquivo'}
        </p>
        <p className="text-sm text-gray-500">
          Máximo: {maxSizeMB}MB por arquivo
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Lista de Arquivos Selecionados */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-700">
            Arquivos Selecionados ({selectedFiles.length})
          </h3>
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3 flex-1">
                {getFileIcon(file)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                  {uploadProgress[file.name] !== undefined && (
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full transition-all"
                        style={{ width: `${uploadProgress[file.name]}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleRemoveFile(index)}
                className="p-1 hover:bg-gray-200 rounded"
                disabled={uploading}
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Botão de Upload */}
      {selectedFiles.length > 0 && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {uploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Enviando...</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <span>Fazer Upload</span>
            </>
          )}
        </button>
      )}

      {/* Mensagem de Erro */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}
