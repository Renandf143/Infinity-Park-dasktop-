import { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon, DownloadIcon, FileTextIcon, ImageIcon, Loader2Icon } from 'lucide-react';
import { FileUploader } from './FileUploader';
import { professionalProfileService } from '../services/professionalProfileService';
import { uploadService, FileType } from '../services/uploadService';
import { Certification } from '../types/professional';

interface CertificateManagerProps {
  professionalId: string;
}

export function CertificateManager({ professionalId }: CertificateManagerProps) {
  const [certificates, setCertificates] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploader, setShowUploader] = useState(false);
  const [selectedFileType, setSelectedFileType] = useState<FileType>('pdf');
  const [uploadingCert, setUploadingCert] = useState<{
    name: string;
    issuer: string;
    issueDate: string;
    expiryDate: string;
    credentialId: string;
  }>({
    name: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    credentialId: ''
  });

  useEffect(() => {
    loadCertificates();
  }, [professionalId]);

  const loadCertificates = async () => {
    try {
      const certs = await professionalProfileService.getCertifications(professionalId);
      setCertificates(certs);
    } catch (error) {
      console.error('Erro ao carregar certificados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadComplete = async (url: string) => {
    try {
      await professionalProfileService.addCertification(professionalId, {
        name: uploadingCert.name,
        issuer: uploadingCert.issuer,
        issueDate: uploadingCert.issueDate,
        expiryDate: uploadingCert.expiryDate || undefined,
        credentialId: uploadingCert.credentialId || undefined,
        certificateUrl: url,
        verified: false
      });

      alert('✅ Certificado adicionado!');
      setShowUploader(false);
      setUploadingCert({
        name: '',
        issuer: '',
        issueDate: '',
        expiryDate: '',
        credentialId: ''
      });
      loadCertificates();
    } catch (error) {
      console.error('Erro ao adicionar certificado:', error);
      alert('❌ Erro ao adicionar certificado');
    }
  };

  const handleDelete = async (certId: string) => {
    if (!confirm('Deseja realmente remover este certificado?')) return;

    try {
      await professionalProfileService.deleteCertification(certId);
      alert('✅ Certificado removido!');
      loadCertificates();
    } catch (error) {
      console.error('Erro ao remover certificado:', error);
      alert('❌ Erro ao remover certificado');
    }
  };

  const getFileIcon = (url: string) => {
    const fileType = uploadService.getFileTypeFromUrl(url);
    
    if (fileType === 'image') {
      return <ImageIcon className="w-6 h-6 text-blue-600" />;
    }
    
    return <FileTextIcon className="w-6 h-6 text-red-600" />;
  };

  const getFileTypeName = (url: string) => {
    const fileType = uploadService.getFileTypeFromUrl(url);
    
    if (fileType === 'image') return 'Imagem';
    if (fileType === 'pdf') return 'PDF';
    return 'Documento';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2Icon className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Certificados</h3>
          <p className="text-sm text-gray-600 mt-1">
            Adicione seus certificados e qualificações
          </p>
        </div>
        <button
          onClick={() => setShowUploader(!showUploader)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Adicionar Certificado
        </button>
      </div>

      {/* Uploader */}
      {showUploader && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Novo Certificado</h4>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nome do Certificado *
              </label>
              <input
                type="text"
                value={uploadingCert.name}
                onChange={(e) => setUploadingCert({ ...uploadingCert, name: e.target.value })}
                placeholder="Ex: Curso de Pintura Profissional"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Instituição Emissora *
              </label>
              <input
                type="text"
                value={uploadingCert.issuer}
                onChange={(e) => setUploadingCert({ ...uploadingCert, issuer: e.target.value })}
                placeholder="Ex: SENAI"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Data de Emissão *
                </label>
                <input
                  type="date"
                  value={uploadingCert.issueDate}
                  onChange={(e) => setUploadingCert({ ...uploadingCert, issueDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Data de Validade
                </label>
                <input
                  type="date"
                  value={uploadingCert.expiryDate}
                  onChange={(e) => setUploadingCert({ ...uploadingCert, expiryDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ID da Credencial
              </label>
              <input
                type="text"
                value={uploadingCert.credentialId}
                onChange={(e) => setUploadingCert({ ...uploadingCert, credentialId: e.target.value })}
                placeholder="Número de registro ou ID"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Seletor de Tipo de Arquivo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tipo de Arquivo *
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedFileType('pdf')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedFileType === 'pdf'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <FileTextIcon className="w-8 h-8 mx-auto mb-2 text-red-600" />
                  <p className="text-sm font-semibold text-gray-900">PDF</p>
                  <p className="text-xs text-gray-500">Recomendado</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedFileType('image')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedFileType === 'image'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <ImageIcon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm font-semibold text-gray-900">Imagem</p>
                  <p className="text-xs text-gray-500">JPG, PNG</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedFileType('document')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedFileType === 'document'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <FileTextIcon className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                  <p className="text-sm font-semibold text-gray-900">Documento</p>
                  <p className="text-xs text-gray-500">DOC, XLS</p>
                </button>
              </div>
            </div>
          </div>

          <FileUploader
            type={selectedFileType}
            onUploadComplete={handleUploadComplete}
            onUploadError={(error) => alert(`❌ ${error}`)}
            label={`Arquivo do Certificado (${selectedFileType.toUpperCase()})`}
            description={`Envie o certificado em formato ${selectedFileType.toUpperCase()}`}
          />
        </div>
      )}

      {/* Certificates List */}
      {certificates.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-gray-600">Nenhum certificado adicionado ainda</p>
          <p className="text-sm text-gray-500 mt-1">
            Adicione seus certificados para aumentar sua credibilidade
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
                  {getFileIcon(cert.certificateUrl)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{cert.issuer}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>Emitido em: {new Date(cert.issueDate).toLocaleDateString('pt-BR')}</span>
                        {cert.expiryDate && (
                          <span>Validade: {new Date(cert.expiryDate).toLocaleDateString('pt-BR')}</span>
                        )}
                      </div>
                      {cert.credentialId && (
                        <p className="text-xs text-gray-500 mt-1">
                          ID: {cert.credentialId}
                        </p>
                      )}
                      <span className="inline-block mt-2 px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded">
                        {getFileTypeName(cert.certificateUrl)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <a
                        href={cert.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Visualizar"
                      >
                        <DownloadIcon className="w-5 h-5" />
                      </a>
                      <button
                        onClick={() => handleDelete(cert.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remover"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
