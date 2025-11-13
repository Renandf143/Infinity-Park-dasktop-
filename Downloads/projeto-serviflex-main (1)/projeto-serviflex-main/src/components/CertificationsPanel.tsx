import { useEffect, useState } from 'react';
import { PlusIcon, AwardIcon, TrashIcon, CheckCircleIcon, ExternalLinkIcon, CalendarIcon, UploadIcon } from 'lucide-react';
import { professionalProfileService } from '../services/professionalProfileService';
import { uploadService } from '../services/uploadService';
import { Certification } from '../types/professional';

interface CertificationsPanelProps {
  professionalId: string;
}

export function CertificationsPanel({ professionalId }: CertificationsPanelProps) {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCert, setNewCert] = useState({
    title: '',
    issuer: '',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    credentialId: '',
    credentialUrl: '',
    description: '',
    imageUrl: ''
  });
  // Removido upload de arquivo - agora usa apenas URL

  useEffect(() => {
    loadCertifications();
  }, [professionalId]);

  const loadCertifications = async () => {
    try {
      const data = await professionalProfileService.getCertifications(professionalId);
      setCertifications(data);
    } catch (error) {
      console.error('Erro ao carregar certificações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCertification = async () => {
    if (!newCert.title || !newCert.issuer || !newCert.imageUrl) {
      alert('Preencha os campos obrigatórios e adicione a URL da imagem do certificado');
      return;
    }

    try {
      await professionalProfileService.addCertification({
        professionalId,
        title: newCert.title,
        issuer: newCert.issuer,
        issueDate: new Date(newCert.issueDate),
        expiryDate: newCert.expiryDate ? new Date(newCert.expiryDate) : undefined,
        credentialId: newCert.credentialId,
        credentialUrl: newCert.credentialUrl,
        description: newCert.description,
        imageUrl: newCert.imageUrl
      });

      alert('✅ Certificação adicionada! Aguarde verificação.');
      setShowAddModal(false);
      setNewCert({
        title: '',
        issuer: '',
        issueDate: new Date().toISOString().split('T')[0],
        expiryDate: '',
        credentialId: '',
        credentialUrl: '',
        description: '',
        imageUrl: ''
      });
      loadCertifications();
    } catch (error: any) {
      console.error('Erro ao adicionar certificação:', error);
      alert(error.message || 'Erro ao adicionar certificação');
    }
  };

  const handleDeleteCertification = async (certId: string) => {
    if (!confirm('Deseja realmente excluir esta certificação?')) return;

    try {
      await professionalProfileService.deleteCertification(certId);
      alert('Certificação excluída!');
      loadCertifications();
    } catch (error) {
      console.error('Erro ao excluir certificação:', error);
      alert('Erro ao excluir certificação');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Minhas Certificações</h3>
            <p className="text-sm text-gray-600 mt-1">
              Adicione seus certificados e qualificações profissionais
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <PlusIcon className="w-5 h-5" />
            Adicionar Certificação
          </button>
        </div>
      </div>

      {/* Certifications List */}
      {certifications.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <AwardIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma certificação cadastrada</h4>
          <p className="text-gray-600 mb-6">Adicione suas certificações para aumentar sua credibilidade</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Adicionar Primeira Certificação
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certifications.map((cert) => (
            <div key={cert.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative">
              {/* Verified Badge */}
              {cert.verified && (
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    <CheckCircleIcon className="w-4 h-4" />
                    Verificado
                  </div>
                </div>
              )}

              {/* Certificate Image */}
              {cert.imageUrl && (
                <div className="mb-4 rounded-lg overflow-hidden">
                  <img
                    src={cert.imageUrl}
                    alt={cert.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AwardIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{cert.title}</h4>
                  <p className="text-sm text-gray-600">{cert.issuer}</p>
                </div>
              </div>

              {/* Description */}
              {cert.description && (
                <p className="text-sm text-gray-700 mb-4">{cert.description}</p>
              )}

              {/* Dates */}
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="w-4 h-4" />
                  <span>Emitido: {new Date(cert.issueDate).toLocaleDateString('pt-BR')}</span>
                </div>
                {cert.expiryDate && (
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Validade: {new Date(cert.expiryDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                )}
              </div>

              {/* Credential Info */}
              {cert.credentialId && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">ID da Credencial</p>
                  <p className="text-sm font-mono text-gray-900">{cert.credentialId}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                  >
                    <ExternalLinkIcon className="w-4 h-4" />
                    Verificar Credencial
                  </a>
                )}
                <button
                  onClick={() => handleDeleteCertification(cert.id!)}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Adicionar Certificação</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título da Certificação *</label>
                <input
                  type="text"
                  value={newCert.title}
                  onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Eletricista Profissional NR-10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instituição Emissora *</label>
                <input
                  type="text"
                  value={newCert.issuer}
                  onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: SENAI, CREA, etc."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data de Emissão *</label>
                  <input
                    type="date"
                    value={newCert.issueDate}
                    onChange={(e) => setNewCert({ ...newCert, issueDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data de Validade</label>
                  <input
                    type="date"
                    value={newCert.expiryDate}
                    onChange={(e) => setNewCert({ ...newCert, expiryDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ID da Credencial</label>
                <input
                  type="text"
                  value={newCert.credentialId}
                  onChange={(e) => setNewCert({ ...newCert, credentialId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: ABC123456"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL de Verificação</label>
                <input
                  type="url"
                  value={newCert.credentialUrl}
                  onChange={(e) => setNewCert({ ...newCert, credentialUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://exemplo.com/verificar"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                <textarea
                  value={newCert.description}
                  onChange={(e) => setNewCert({ ...newCert, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Descreva o que você aprendeu ou as competências adquiridas..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL da Imagem do Certificado *
                </label>
                
                {/* Info Box */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 mb-3">
                  <p className="text-sm text-blue-900 mb-1">
                    <strong>💡 Como adicionar:</strong>
                  </p>
                  <p className="text-xs text-blue-800">
                    Faça upload no <a href="https://imgur.com/upload" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Imgur</a> e cole o link aqui
                  </p>
                </div>

                <input
                  type="url"
                  value={newCert.imageUrl}
                  onChange={(e) => setNewCert({ ...newCert, imageUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://i.imgur.com/exemplo.jpg"
                />
                
                {/* Preview */}
                {newCert.imageUrl && (
                  <div className="mt-3">
                    <img
                      src={newCert.imageUrl}
                      alt="Preview"
                      className="max-h-48 mx-auto rounded-lg border-2 border-gray-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                <p className="text-xs text-gray-500 mt-2">
                  Cole a URL da imagem do seu certificado
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAddCertification}
                  disabled={!newCert.title || !newCert.issuer || !newCert.imageUrl}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Adicionar Certificação
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
