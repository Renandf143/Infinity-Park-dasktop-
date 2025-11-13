import React, { useState } from 'react';
import { FileUploadManager } from '../components/FileUploadManager';
import { FileGallery } from '../components/FileGallery';
import { useAuth } from '../hooks/useAuth';
import { Upload, Image, FileText, Award, File } from 'lucide-react';

/**
 * Página de Exemplo - Sistema de Armazenamento de Arquivos
 * 
 * Demonstra como usar o sistema de upload e galeria de arquivos
 * para diferentes categorias (perfil, portfólio, certificados, documentos)
 */
export function FileStorageExample() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'portfolio' | 'certificate' | 'document'>('profile');
  const [refreshKey, setRefreshKey] = useState(0);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Faça login para acessar o sistema de arquivos</p>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Foto de Perfil', icon: Image, accept: 'image/*', maxSize: 5 },
    { id: 'portfolio', label: 'Portfólio', icon: Image, accept: 'image/*', maxSize: 5 },
    { id: 'certificate', label: 'Certificados', icon: Award, accept: 'image/*,application/pdf', maxSize: 10 },
    { id: 'document', label: 'Documentos', icon: FileText, accept: 'application/pdf', maxSize: 10 }
  ];

  const activeTabData = tabs.find(t => t.id === activeTab);

  const handleUploadComplete = (fileId: string) => {
    console.log('Upload concluído:', fileId);
    // Atualizar galeria
    setRefreshKey(prev => prev + 1);
  };

  const handleFileDelete = (fileId: string) => {
    console.log('Arquivo deletado:', fileId);
    // Atualizar galeria
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sistema de Armazenamento de Arquivos
          </h1>
          <p className="text-gray-600">
            Gerencie suas imagens, certificados e documentos
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`
                      flex items-center space-x-2 px-6 py-4 border-b-2 font-medium text-sm
                      ${activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Upload className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold">Upload de Arquivos</h2>
            </div>
            
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Categoria:</strong> {activeTabData?.label}
              </p>
              <p className="text-sm text-blue-800">
                <strong>Tipos aceitos:</strong> {activeTabData?.accept}
              </p>
              <p className="text-sm text-blue-800">
                <strong>Tamanho máximo:</strong> {activeTabData?.maxSize}MB
              </p>
            </div>

            <FileUploadManager
              category={activeTab}
              relatedTo={user.uid}
              onUploadComplete={handleUploadComplete}
              acceptedTypes={activeTabData?.accept}
              maxSizeMB={activeTabData?.maxSize}
              multiple={activeTab !== 'profile'}
            />
          </div>

          {/* Info Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-2 mb-4">
              <File className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold">Informações</h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  📸 Foto de Perfil
                </h3>
                <p className="text-sm text-gray-600">
                  Sua foto de perfil será exibida em todo o sistema. Use uma imagem clara e profissional.
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  🎨 Portfólio
                </h3>
                <p className="text-sm text-gray-600">
                  Adicione imagens dos seus trabalhos anteriores para mostrar sua experiência aos clientes.
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  🏆 Certificados
                </h3>
                <p className="text-sm text-gray-600">
                  Faça upload de certificados e qualificações para aumentar sua credibilidade.
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  📄 Documentos
                </h3>
                <p className="text-sm text-gray-600">
                  Armazene contratos, propostas e outros documentos importantes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">
            Meus Arquivos - {activeTabData?.label}
          </h2>
          
          <FileGallery
            key={`${activeTab}-${refreshKey}`}
            userId={user.uid}
            category={activeTab}
            onFileDelete={handleFileDelete}
          />
        </div>

        {/* Footer Info */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-900 mb-2">
            ⚠️ Importante
          </h3>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Os arquivos são armazenados de forma segura no MongoDB</li>
            <li>• Imagens são limitadas a 5MB</li>
            <li>• Documentos PDF são limitados a 10MB</li>
            <li>• Você pode deletar arquivos a qualquer momento</li>
            <li>• Mantenha backups de documentos importantes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
