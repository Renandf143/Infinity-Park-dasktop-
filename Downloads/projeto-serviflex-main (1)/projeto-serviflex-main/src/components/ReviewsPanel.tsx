import { useEffect, useState } from 'react';
import { StarIcon, ThumbsUpIcon, UserIcon } from 'lucide-react';
import { professionalProfileService } from '../services/professionalProfileService';
import { Review, ReviewStats } from '../types/professional';

interface ReviewsPanelProps {
  professionalId: string;
}

export function ReviewsPanel({ professionalId }: ReviewsPanelProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [likedReviews, setLikedReviews] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadReviews();
    loadLikedReviews();
  }, [professionalId]);

  const loadReviews = async () => {
    try {
      const [reviewsData, statsData] = await Promise.all([
        professionalProfileService.getReviews(professionalId),
        professionalProfileService.getReviewStats(professionalId)
      ]);
      setReviews(reviewsData);
      setStats(statsData);
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLikedReviews = () => {
    // Carregar do localStorage quais reviews o usuário já deu like
    const liked = localStorage.getItem('likedReviews');
    if (liked) {
      setLikedReviews(new Set(JSON.parse(liked)));
    }
  };

  const handleLike = async (reviewId: string) => {
    console.log('🔵 handleLike chamado com ID:', reviewId);
    
    if (!reviewId) {
      console.error('❌ Review ID não fornecido');
      alert('Erro: ID da avaliação não encontrado');
      return;
    }

    // Atualizar UI imediatamente (otimista)
    const isLiked = likedReviews.has(reviewId);
    console.log('🔵 Status atual:', isLiked ? 'JÁ CURTIDO' : 'NÃO CURTIDO');
    
    const newLiked = new Set(likedReviews);
    
    if (isLiked) {
      newLiked.delete(reviewId);
      console.log('🔵 Removendo like...');
    } else {
      newLiked.add(reviewId);
      console.log('🔵 Adicionando like...');
    }
    
    setLikedReviews(newLiked);
    localStorage.setItem('likedReviews', JSON.stringify([...newLiked]));
    console.log('✅ UI atualizada localmente');

    // Atualizar contador localmente
    setReviews(prevReviews => 
      prevReviews.map(review => 
        review.id === reviewId
          ? { ...review, helpful: (review.helpful || 0) + (isLiked ? -1 : 1) }
          : review
      )
    );
    console.log('✅ Contador atualizado localmente');

    try {
      console.log('🔵 Iniciando atualização no Firestore...');
      const { doc, updateDoc, increment, getDoc } = await import('firebase/firestore');
      const { db } = await import('../firebase');

      const reviewRef = doc(db, 'reviews', reviewId);
      console.log('🔵 Buscando documento...');
      
      const reviewDoc = await getDoc(reviewRef);

      if (!reviewDoc.exists()) {
        console.error('❌ Review não encontrado no Firestore');
        alert('Erro: Avaliação não encontrada no banco de dados');
        return;
      }

      console.log('✅ Documento encontrado:', reviewDoc.data());
      console.log('🔵 Atualizando campo helpful...');

      // Atualizar no Firestore
      await updateDoc(reviewRef, {
        helpful: increment(isLiked ? -1 : 1)
      });

      console.log(`✅ Like ${isLiked ? 'removido' : 'adicionado'} com sucesso no Firestore!`);
      
      // Recarregar para garantir sincronização
      setTimeout(() => {
        console.log('🔵 Recarregando reviews...');
        loadReviews();
      }, 500);
      
    } catch (error: any) {
      console.error('❌ ERRO DETALHADO:', {
        message: error.message,
        code: error.code,
        stack: error.stack,
        error: error
      });
      
      // Reverter mudança em caso de erro
      setLikedReviews(likedReviews);
      localStorage.setItem('likedReviews', JSON.stringify([...likedReviews]));
      loadReviews();
      
      alert(`Erro ao registrar like:\n${error.message}\n\nVerifique o console para mais detalhes.`);
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
      {/* Stats Card */}
      {stats && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Average Rating */}
            <div className="text-center">
              <div className="text-6xl font-bold text-gray-900 mb-2">
                {stats.averageRating.toFixed(1)}
              </div>
              <div className="flex items-center justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`w-6 h-6 ${
                      star <= Math.round(stats.averageRating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-600">{stats.totalReviews} avaliações</p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution];
                const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
                
                return (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 w-8">{rating}★</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 rounded-full h-2 transition-all"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Avaliações dos Clientes</h3>
        
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <StarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma avaliação ainda</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {review.clientPhoto ? (
                      <img
                        src={review.clientPhoto}
                        alt={review.clientName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <UserIcon className="w-6 h-6 text-gray-500" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{review.clientName}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Serviço:</span> {review.serviceType}
                    </p>

                    <p className="text-gray-700">{review.comment}</p>

                    {/* Helpful */}
                    <div className="mt-3 flex items-center gap-4">
                      <button 
                        onClick={() => {
                          console.log('Clicou em like, review ID:', review.id);
                          if (review.id) {
                            handleLike(review.id);
                          } else {
                            console.error('Review sem ID!', review);
                            alert('Erro: Esta avaliação não tem ID');
                          }
                        }}
                        disabled={!review.id}
                        className={`flex items-center gap-1 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          review.id && likedReviews.has(review.id)
                            ? 'text-blue-600 font-semibold'
                            : 'text-gray-500 hover:text-blue-600'
                        }`}
                      >
                        <ThumbsUpIcon className={`w-4 h-4 ${review.id && likedReviews.has(review.id) ? 'fill-current' : ''}`} />
                        <span>Útil ({review.helpful || 0})</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
