import React, { useState } from 'react';
import { storageService } from '../services/storageService';
import { Upload, CheckCircle, AlertCircle, Loader } from 'lucide-react';

interface SmartFileUploaderProps {
  userId: string;
  category: 'profile' | 'portfolio' | 'certificate' | 'document';
  onUploadComplete?: (result: any) => void;
  maxSize?: number; // em MB
}

export const SmartFileUploader: React.FC<SmartFileUploaderProps> = ({
  userId,
  category,
  onUploadComplete,
  maxSize = 100
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<any>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Verificar tamanho máximo
    const maxBytes = maxSize * 1024 * 1024;
    if (selectedFile.size > maxBytes) {
      setError(`Arquivo muito grande. Máximo: ${maxSize}MB`);
      return;
    }

    setFile(selectedFile);
    setError(null);
    setResult(null);

    // Obter recomendação de storage
    const rec = storageService.getStorageRecommendation(selectedFile);
    setRecommendation(rec);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const uploadResult = await storageService.uploadFile(
        file,
        userId,
        category,
        (progressValue) => {
          setProgress(progressValue);
        }
      );

      setResult(uploadResult);
      onUploadComplete?.(uploadResult);
      
      console.log('✅ Upload concluído:', uploadResult);
    } catch (err: any) {
      setError(err.message || 'Erro no upload');
      console.error('❌ Erro no upload:', err);
    } finally {
      setUploading(false);
    }
  };

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">Upload de Arquivo</h3>

      {/* Input de arquivo */}
      <div className="mb-4">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-10 h-10 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Clique para selecionar</span> ou arraste
            </p>
            <p className="text-xs text-gray-500">
              Máximo: {maxSize}MB
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            disabled={uploading}
          />
        </label>
      </div>

      {/* Informações do arquivo */}
      {file && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="font-medium text-sm truncate">{file.name}</p>
              <p className="text-xs text-gray-500 mt-1">
                {formatSize(file.size)} • {file.type || 'Tipo desconhecido'}
              </p>
            </div>
          </div>

          {/* Recomendação de storage */}
          {recommendation && (
            <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
              <p className="text-xs font-medium text-blue-800">
                📦 Storage: {recommendation.storage === 'firebase' ? 'Firebase Storage' : 'MongoDB GridFS'}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {recommendation.reason}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Barra de progresso */}
      {uploading && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Enviando...
            </span>
            <span className="text-sm font-medium text-blue-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Resultado */}
      {result && (
        <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-start">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800">
                Upload concluído!
              </p>
              <p className="text-xs text-green-600 mt-1">
                Storage: {result.storage === 'firebase' ? 'Firebase' : 'GridFS'}
              </p>
              <p className="text-xs text-green-600 truncate mt-1">
                URL: {result.url}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Erro */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">Erro no upload</p>
              <p className="text-xs text-red-600 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Botão de upload */}
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center ${
          !file || uploading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {uploading ? (
          <>
            <Loader className="w-5 h-5 mr-2 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Upload className="w-5 h-5 mr-2" />
            Fazer Upload
          </>
        )}
      </button>

      {/* Informações adicionais */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          <strong>Automático:</strong> Arquivos pequenos (&lt;5MB) vão para Firebase Storage.
          Arquivos grandes (&gt;5MB) vão para MongoDB GridFS.
        </p>
      </div>
    </div>
  );
};
