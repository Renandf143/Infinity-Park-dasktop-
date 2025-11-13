import { useEffect, useState, useCallback } from 'react';
import { 
  PlusIcon, TrashIcon, ImageIcon, 
  XIcon, ZoomInIcon, ChevronLeftIcon, ChevronRightIcon, CalendarIcon,
  TagIcon
} from 'lucide-react';
import { professionalProfileService } from '../services/professionalProfileService';
import { PortfolioItem } from '../types/professional';
import { useAuth } from '../hooks/useAuth';

interface PortfolioPanelProps {
  professionalId: string;
}

export function PortfolioPanel({ professionalId }: PortfolioPanelProps) {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [professionalCategory, setProfessionalCategory] = useState('');
  
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    category: '',
    completedAt: new Date().toISOString().split('T')[0]
  });
  
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [currentImageUrl, setCurrentImageUrl] = useState('');

  // Imagem placeholder em base64 (1x1 pixel cinza)
  const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZW0gSW5kaXNwb27DrXZlbDwvdGV4dD48L3N2Zz4=';

  // Função para normalizar URLs de imagens
  const normalizeImageUrl = (url: string): string => {
    if (!url) return url;
    
    // Rejeitar URLs inválidas
    const invalidPatterns = [
      'google.com/imgres',
      'google.com/search',
      'imgur.com/a/',
      'imgur.com/gallery/',
      'pinterest.com',
      'facebook.com',
      'instagram.com'
    ];
    
    for (const pattern of invalidPatterns) {
      if (url.includes(pattern)) {
        console.warn('⚠️ URL inválida detectada. Use um link direto da imagem (termina com .jpg, .png, etc)');
        return '';
      }
    }
    
    // Converter link de página do Imgur para link direto
    const imgurPageMatch = url.match(/imgur\.com\/([a-zA-Z0-9]+)$/);
    if (imgurPageMatch) {
      return `https://i.imgur.com/${imgurPageMatch[1]}.jpg`;
    }
    
    // Se for link do Imgur sem extensão, adicionar .jpg
    if (url.includes('i.imgur.com') && !url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return url + '.jpg';
    }
    
    // Verificar se é uma URL de imagem válida
    if (!url.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i) && !url.includes('firebasestorage')) {
      console.warn('⚠️ URL não parece ser uma imagem válida. Use links que terminem com .jpg, .png, etc');
      return '';
    }
    
    return url;
  };

  const loadProfessionalCategory = async () => {
    try {
      const { doc, getDoc } = await import('firebase/firestore');
      const { db } = await import('../firebase');
      
      const profDoc = await getDoc(doc(db, 'serviceProviders', professionalId));
      if (profDoc.exists()) {
        const data = profDoc.data();
        setProfessionalCategory(data.profession || data.category || '');
        // Auto-preencher categoria
        setNewItem(prev => ({ ...prev, category: data.profession || data.category || '' }));
      }
    } catch (error) {
      console.error('Erro ao carregar categoria:', error);
    }
  };

  const loadPortfolio = useCallback(async () => {
    try {
      const data = await professionalProfileService.getPortfolio(professionalId);
      setPortfolio(data);
    } catch (error) {
      console.error('Erro ao carregar portfólio:', error);
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    loadPortfolio();
    loadProfessionalCategory();
  }, [loadPortfolio, loadProfessionalCategory, professionalId]);

  const handleAddImageUrl = () => {
    if (!currentImageUrl.trim()) {
      alert('Cole a URL da imagem');
      return;
    }
    
    // Validar URL
    const invalidPatterns = [
      { pattern: 'google.com/imgres', message: '❌ Este é um link do Google Images.\n\n✅ Clique com botão direito na imagem e selecione "Copiar endereço da imagem"' },
      { pattern: 'google.com/search', message: '❌ Este é um link de busca do Google.\n\n✅ Abra a imagem e copie o link direto' },
      { pattern: 'imgur.com/a/', message: '❌ Este é um link de ÁLBUM do Imgur.\n\n✅ Abra o álbum, clique na imagem, e copie o link da imagem individual' },
      { pattern: 'imgur.com/gallery/', message: '❌ Este é um link de GALERIA do Imgur.\n\n✅ Abra a galeria, clique na imagem, e copie o link da imagem individual' },
      { pattern: 'pinterest.com', message: '❌ Links do Pinterest não funcionam.\n\n✅ Faça upload da imagem no Imgur ou use outro serviço' },
      { pattern: 'facebook.com', message: '❌ Links do Facebook não funcionam.\n\n✅ Faça upload da imagem no Imgur' },
      { pattern: 'instagram.com', message: '❌ Links do Instagram não funcionam.\n\n✅ Faça upload da imagem no Imgur' }
    ];
    
    for (const { pattern, message } of invalidPatterns) {
      if (currentImageUrl.includes(pattern)) {
        alert(message);
        return;
      }
    }
    
    // Verificar se termina com extensão de imagem
    if (!currentImageUrl.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i) && 
        !currentImageUrl.includes('firebasestorage') && 
        !currentImageUrl.includes('imgur.com')) {
      alert('❌ URL inválida.\n\n✅ Use um link direto de imagem que termine com .jpg, .png, .gif, etc.\n\nDica: Clique com botão direito na imagem e selecione "Copiar endereço da imagem"');
      return;
    }
    
    if (imageUrls.filter(url => url.trim()).length >= 10) {
      alert('Máximo de 10 imagens por trabalho');
      return;
    }
    
    // Normalizar URL antes de adicionar
    const normalizedUrl = normalizeImageUrl(currentImageUrl.trim());
    if (!normalizedUrl) {
      alert('URL inválida. Use um link direto de imagem do Imgur.');
      return;
    }
    
    setImageUrls(prev => [...prev.filter(url => url.trim()), normalizedUrl, '']);
    setCurrentImageUrl('');
  };

  const handleRemoveImageUrl = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddItem = async () => {
    const validUrls = imageUrls.filter(url => url.trim());
    
    if (!newItem.title || validUrls.length === 0) {
      alert('Preencha o título e adicione pelo menos uma URL de imagem');
      return;
    }

    try {
      await professionalProfileService.addPortfolioItem({
        professionalId,
        title: newItem.title,
        description: newItem.description,
        images: validUrls,
        category: newItem.category || professionalCategory,
        completedAt: new Date(newItem.completedAt)
      });

      alert('✅ Trabalho adicionado ao portfólio!');
      setShowAddModal(false);
      resetForm();
      loadPortfolio();
    } catch (error: unknown) {
      console.error('Erro ao adicionar item:', error);
      alert(error.message || 'Erro ao adicionar item ao portfólio');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Deseja realmente excluir este trabalho do portfólio?')) return;

    try {
      await professionalProfileService.deletePortfolioItem(itemId);
      alert('✅ Trabalho excluído!');
      loadPortfolio();
    } catch (error) {
      console.error('Erro ao excluir item:', error);
      alert('Erro ao excluir item');
    }
  };

  const resetForm = () => {
    setNewItem({
      title: '',
      description: '',
      category: professionalCategory,
      completedAt: new Date().toISOString().split('T')[0]
    });
    setImageUrls(['']);
    setCurrentImageUrl('');
  };

  const openImageModal = (item: PortfolioItem, index = 0) => {
    setSelectedItem(item);
    setCurrentImageIndex(index);
    setShowImageModal(true);
  };

  const nextImage = () => {
    if (selectedItem && currentImageIndex < selectedItem.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
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
      {/* Header com Stats */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold mb-2">Meu Portfólio</h3>
            <p className="text-white/90">
              Mostre seus melhores trabalhos e conquiste mais clientes
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold shadow-lg"
          >
            <PlusIcon className="w-5 h-5" />
            Adicionar Trabalho
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <p className="text-white/80 text-sm mb-1">Total de Trabalhos</p>
            <p className="text-3xl font-bold">{portfolio.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <p className="text-white/80 text-sm mb-1">Imagens</p>
            <p className="text-3xl font-bold">
              {portfolio.reduce((acc, item) => acc + item.images.length, 0)}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <p className="text-white/80 text-sm mb-1">Categoria</p>
            <p className="text-xl font-bold truncate">{professionalCategory || 'Geral'}</p>
          </div>
        </div>
      </div>

      {/* Portfolio Grid */}
      {portfolio.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-300 p-12 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-10 h-10 text-blue-600" />
          </div>
          <h4 className="text-xl font-bold text-gray-900 mb-2">Seu portfólio está vazio</h4>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Adicione fotos dos seus melhores trabalhos para mostrar sua qualidade e atrair mais clientes
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-lg"
          >
            Adicionar Primeiro Trabalho
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolio.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden group hover:shadow-xl transition-all duration-300"
            >
              {/* Image Gallery */}
              <div className="relative h-64 bg-gray-100 overflow-hidden">
                <img
                  src={normalizeImageUrl(item.images[0])}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                  crossOrigin="anonymous"
                  loading="lazy"
                  onClick={() => openImageModal(item, 0)}
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    if (!img.dataset.errorAttempts) {
                      img.dataset.errorAttempts = '1';
                      const normalizedUrl = normalizeImageUrl(item.images[0]);
                      if (normalizedUrl && !img.src.includes('weserv.nl')) {
                        img.src = `https://images.weserv.nl/?url=${encodeURIComponent(normalizedUrl)}`;
                      } else {
                        img.src = PLACEHOLDER_IMAGE;
                      }
                    } else {
                      img.src = PLACEHOLDER_IMAGE;
                    }
                  }}
                />
                
                {/* Overlay com ações */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => openImageModal(item, 0)}
                    className="p-3 bg-white rounded-full hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    <ZoomInIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id!)}
                    className="p-3 bg-white rounded-full hover:bg-red-600 hover:text-white transition-colors"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>

                {/* Image Counter */}
                {item.images.length > 1 && (
                  <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/70 backdrop-blur text-white text-sm rounded-full font-semibold">
                    <ImageIcon className="w-4 h-4 inline mr-1" />
                    {item.images.length}
                  </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-3 left-3 px-3 py-1 bg-blue-600 text-white text-xs rounded-full font-semibold">
                  {item.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h4 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {item.description || 'Sem descrição'}
                </p>
                
                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <CalendarIcon className="w-4 h-4" />
                    {new Date(item.completedAt).toLocaleDateString('pt-BR', { 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </div>
                  <button
                    onClick={() => openImageModal(item, 0)}
                    className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1"
                  >
                    Ver detalhes
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Adicionar Trabalho</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-5">
              {/* Título */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Título do Trabalho *
                </label>
                <input
                  type="text"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  placeholder="Ex: Instalação Elétrica Completa - Residência 3 Quartos"
                  maxLength={100}
                />
                <p className="text-xs text-gray-500 mt-1">{newItem.title.length}/100 caracteres</p>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descrição do Trabalho
                </label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                  placeholder="Descreva o trabalho realizado, materiais utilizados, desafios superados..."
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">{newItem.description.length}/500 caracteres</p>
              </div>

              {/* Categoria e Data */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <TagIcon className="w-4 h-4 inline mr-1" />
                    Categoria
                  </label>
                  <input
                    type="text"
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    placeholder={professionalCategory || 'Ex: Elétrica'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <CalendarIcon className="w-4 h-4 inline mr-1" />
                    Data de Conclusão *
                  </label>
                  <input
                    type="date"
                    value={newItem.completedAt}
                    onChange={(e) => setNewItem({ ...newItem, completedAt: e.target.value })}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </div>
              </div>

              {/* URLs de Imagens */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <ImageIcon className="w-4 h-4 inline mr-1" />
                  URLs das Fotos * (máx. 10)
                </label>
                
                {/* Info Box */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-900 mb-2">
                    <strong>💡 Como adicionar fotos:</strong>
                  </p>
                  <ol className="text-sm text-blue-800 space-y-1 ml-4">
                    <li>1. Faça upload da foto no <a href="https://imgur.com/upload" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Imgur</a> (gratuito)</li>
                    <li>2. Copie o link da imagem</li>
                    <li>3. Cole abaixo e clique em "Adicionar"</li>
                  </ol>
                </div>

                {/* Input para URL */}
                <div className="flex gap-2 mb-4">
                  <input
                    type="url"
                    value={currentImageUrl}
                    onChange={(e) => setCurrentImageUrl(e.target.value)}
                    placeholder="https://i.imgur.com/exemplo.jpg"
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImageUrl())}
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    disabled={!currentImageUrl.trim() || imageUrls.filter(url => url.trim()).length >= 10}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Adicionar
                  </button>
                </div>

                {/* Preview Grid */}
                {imageUrls.filter(url => url.trim()).length > 0 && (
                  <div className="grid grid-cols-4 gap-3">
                    {imageUrls.filter(url => url.trim()).map((url, index) => (
                      <div key={index} className="relative group bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={normalizeImageUrl(url)}
                          alt={`Imagem ${index + 1}`}
                          className="w-full h-24 object-cover"
                          crossOrigin="anonymous"
                          loading="lazy"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            const parent = img.parentElement;
                            
                            // Evitar loop infinito
                            if (img.dataset.errorAttempts) {
                              const attempts = parseInt(img.dataset.errorAttempts);
                              if (attempts >= 2) {
                                // Já tentou 2 vezes, mostrar erro
                                img.style.display = 'none';
                                if (parent && !parent.querySelector('.error-placeholder')) {
                                  const placeholder = document.createElement('div');
                                  placeholder.className = 'error-placeholder w-full h-24 flex items-center justify-center bg-gray-200 rounded-lg';
                                  placeholder.innerHTML = '<span class="text-gray-500 text-xs">❌ URL inválida</span>';
                                  parent.appendChild(placeholder);
                                }
                                return;
                              }
                              img.dataset.errorAttempts = (attempts + 1).toString();
                            } else {
                              img.dataset.errorAttempts = '1';
                            }
                            
                            // Primeira tentativa: usar proxy
                            if (!img.src.includes('weserv.nl')) {
                              const normalizedUrl = normalizeImageUrl(url);
                              if (normalizedUrl) {
                                img.src = `https://images.weserv.nl/?url=${encodeURIComponent(normalizedUrl)}`;
                              }
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImageUrl(index)}
                          className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-1 left-1 px-2 py-0.5 bg-black/70 text-white text-xs rounded">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-2">
                  {imageUrls.filter(url => url.trim()).length}/10 imagens adicionadas
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddItem}
                  disabled={!newItem.title || imageUrls.filter(url => url.trim()).length === 0}
                  className="flex-1 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  Adicionar ao Portfólio
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="px-6 py-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-bold"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Viewer Modal */}
      {showImageModal && selectedItem && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4">
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
          >
            <XIcon className="w-6 h-6" />
          </button>

          {/* Navigation */}
          {selectedItem.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                disabled={currentImageIndex === 0}
                className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors disabled:opacity-30"
              >
                <ChevronLeftIcon className="w-8 h-8" />
              </button>
              <button
                onClick={nextImage}
                disabled={currentImageIndex === selectedItem.images.length - 1}
                className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors disabled:opacity-30"
              >
                <ChevronRightIcon className="w-8 h-8" />
              </button>
            </>
          )}

          {/* Image */}
          <div className="max-w-5xl w-full">
            <img
              src={normalizeImageUrl(selectedItem.images[currentImageIndex])}
              alt={selectedItem.title}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              crossOrigin="anonymous"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                if (!img.dataset.errorAttempts) {
                  img.dataset.errorAttempts = '1';
                  const normalizedUrl = normalizeImageUrl(selectedItem.images[currentImageIndex]);
                  if (normalizedUrl && !img.src.includes('weserv.nl')) {
                    img.src = `https://images.weserv.nl/?url=${encodeURIComponent(normalizedUrl)}`;
                  } else {
                    img.src = PLACEHOLDER_IMAGE;
                  }
                } else {
                  img.src = PLACEHOLDER_IMAGE;
                }
              }}
            />
            
            {/* Info */}
            <div className="mt-4 text-white text-center">
              <h3 className="text-2xl font-bold mb-2">{selectedItem.title}</h3>
              <p className="text-gray-300 mb-2">{selectedItem.description}</p>
              <p className="text-sm text-gray-400">
                Imagem {currentImageIndex + 1} de {selectedItem.images.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
