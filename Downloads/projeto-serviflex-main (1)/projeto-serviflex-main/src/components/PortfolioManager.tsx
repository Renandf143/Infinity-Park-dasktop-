import { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon, EyeIcon, Loader2Icon } from 'lucide-react';
import { FileUploader } from './FileUploader';
import { professionalProfileService } from '../services/professionalProfileService';
import { PortfolioItem } from '../types/professional';

interface PortfolioManagerProps {
  professionalId: string;
}

export function PortfolioManager({ professionalId }: PortfolioManagerProps) {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploader, setShowUploader] = useState(false);
  const [uploadingItem, setUploadingItem] = useState<{
    title: string;
    description: string;
  }>({ title: '', description: '' });

  useEffect(() => {
    loadPortfolio();
  }, [professionalId]);

  const loadPortfolio = async () => {
    try {
      const items = await professionalProfileService.getPortfolio(professionalId);
      setPortfolio(items);
    } catch (error) {
      console.error('Erro ao carregar portfólio:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadComplete = async (url: string) => {
    try {
      await professionalProfileService.addPortfolioItem(professionalId, {
        title: uploadingItem.title,
        description: uploadingItem.description,
        imageUrl: url,
        category: 'Trabalho Realizado',
        date: new Date().toISOString()
      });

      alert('✅ Item adicionado ao portfólio!');
      setShowUploader(false);
      setUploadingItem({ title: '', description: '' });
      loadPortfolio();
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      alert('❌ Erro ao adicionar item ao portfólio');
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('Deseja realmente remover este item do portfólio?')) return;

    try {
      await professionalProfileService.deletePortfolioItem(itemId);
      alert('✅ Item removido!');
      loadPortfolio();
    } catch (error) {
      console.error('Erro ao remover item:', error);
      alert('❌ Erro ao remover item');
    }
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
          <h3 className="text-xl font-bold text-gray-900">Portfólio</h3>
          <p className="text-sm text-gray-600 mt-1">
            Mostre seus trabalhos realizados
          </p>
        </div>
        <button
          onClick={() => setShowUploader(!showUploader)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Adicionar Trabalho
        </button>
      </div>

      {/* Uploader */}
      {showUploader && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Novo Item do Portfólio</h4>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Título *
              </label>
              <input
                type="text"
                value={uploadingItem.title}
                onChange={(e) => setUploadingItem({ ...uploadingItem, title: e.target.value })}
                placeholder="Ex: Pintura de Apartamento"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                value={uploadingItem.description}
                onChange={(e) => setUploadingItem({ ...uploadingItem, description: e.target.value })}
                placeholder="Descreva o trabalho realizado..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <FileUploader
            type="image"
            onUploadComplete={handleUploadComplete}
            onUploadError={(error) => alert(`❌ ${error}`)}
            label="Foto do Trabalho"
            description="Adicione uma foto do trabalho realizado"
          />
        </div>
      )}

      {/* Portfolio Grid */}
      {portfolio.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-gray-600">Nenhum item no portfólio ainda</p>
          <p className="text-sm text-gray-500 mt-1">
            Adicione fotos dos seus trabalhos para atrair mais clientes
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolio.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-lg transition-shadow"
            >
              <div className="relative aspect-video">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center gap-2">
                  <button
                    onClick={() => window.open(item.imageUrl, '_blank')}
                    className="opacity-0 group-hover:opacity-100 p-2 bg-white rounded-lg hover:bg-gray-100 transition-all"
                  >
                    <EyeIcon className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 bg-white rounded-lg hover:bg-red-50 transition-all"
                  >
                    <TrashIcon className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-900">{item.title}</h4>
                {item.description && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                )}
                {item.date && (
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(item.date).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
