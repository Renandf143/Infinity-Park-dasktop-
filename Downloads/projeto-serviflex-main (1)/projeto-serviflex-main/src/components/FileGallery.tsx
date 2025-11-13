import React, { useEffect, useState } from 'react';
import { Download, Trash2, Eye, Loader2, Image as ImageIcon, FileText } from 'lucide-react';
import { useFileStorage } from '../hooks/useFileStorage';
import { StoredFile } from '../services/fileStorageService';

interface FileGalleryProps {
  userId: string;
  category?: 'profile' | 'portfolio' | 'certificate' | 'document' | 'other';
  onFileDelete?: (fileId: string) => void;
}

export function FileGallery({ userId, category, onFileDelete }: FileGalleryProps) {
  const { listFiles, listByCategory, getPreviewURL, remove, downloading } = useFileStorage();
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewUrls, setPreviewUrls] = useState<{ [key: string]: string }>({});
  const [selectedFile, setSelectedFile] = useState<StoredFile | null>(null);

  useEffect(() => {
    loadFiles();
  }, [userId, category]);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const loadedFiles = category
        ? await listByCategory(category, userId)
        : await listFiles(userId);
      
      setFiles(loadedFiles);

      // Carregar previews para imagens
      for (const file of loadedFiles) {
        if (file.contentType.startsWith('image/')) {
          const url = await getPreviewURL(file._id.toString());
          if (url) {
            setPreviewUrls(prev => ({ ...prev, [file._id.toString()]: url }));
          }
        }
      }
    } catch (error) {
      console.error('Erro ao carregar arquivos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fileId: string) => {
    if (!confirm('Tem certeza que deseja deletar este arquivo?')) return;

    const success = await remove(fileId);
    if (success) {
      setFiles(prev => prev.filter(f => f._id.toString() !== fileId));
      onFileDelete?.(fileId);
    }
  };

  const handleDownload = async (file: StoredFile) => {
    const url = await getPreviewURL(file._id.toString());
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.download = file.filename;
      link.click();
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Nenhum arquivo encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Grid de Arquivos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map((file) => {
          const fileId = file._id.toString();
          const isImage = file.contentType.startsWith('image/');
          const isPDF = file.contentType === 'application/pdf';

          return (
            <div
              key={fileId}
              className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Preview */}
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                {isImage && previewUrls[fileId] ? (
                  <img
                    src={previewUrls[fileId]}
                    alt={file.filename}
                    className="w-full h-full object-cover"
                  />
                ) : isPDF ? (
                  <FileText className="w-16 h-16 text-red-500" />
                ) : (
                  <ImageIcon className="w-16 h-16 text-gray-400" />
                )}
              </div>

              {/* Informações */}
              <div className="p-4">
                <h3 className="font-semibold text-sm truncate mb-2">
                  {file.filename}
                </h3>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Tamanho: {formatSize(file.size)}</p>
                  <p>Upload: {formatDate(file.uploadDate)}</p>
                  {file.metadata?.category && (
                    <p className="capitalize">
                      Categoria: {file.metadata.category}
                    </p>
                  )}
                </div>

                {/* Ações */}
                <div className="flex items-center space-x-2 mt-4">
                  <button
                    onClick={() => setSelectedFile(file)}
                    className="flex-1 py-2 px-3 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 flex items-center justify-center space-x-1"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">Ver</span>
                  </button>
                  <button
                    onClick={() => handleDownload(file)}
                    disabled={downloading}
                    className="flex-1 py-2 px-3 bg-green-50 text-green-600 rounded hover:bg-green-100 flex items-center justify-center space-x-1"
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-sm">Baixar</span>
                  </button>
                  <button
                    onClick={() => handleDelete(fileId)}
                    className="py-2 px-3 bg-red-50 text-red-600 rounded hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Preview */}
      {selectedFile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedFile(null)}
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-semibold">{selectedFile.filename}</h2>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              {selectedFile.contentType.startsWith('image/') && previewUrls[selectedFile._id.toString()] ? (
                <img
                  src={previewUrls[selectedFile._id.toString()]}
                  alt={selectedFile.filename}
                  className="w-full h-auto"
                />
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-24 h-24 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Preview não disponível</p>
                  <button
                    onClick={() => handleDownload(selectedFile)}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Baixar Arquivo
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
