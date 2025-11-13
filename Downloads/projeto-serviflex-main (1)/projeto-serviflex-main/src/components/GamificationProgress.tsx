import React from 'react';
import { TrophyIcon, GiftIcon, TrendingUpIcon, BookOpenIcon } from 'lucide-react';
interface GamificationProgressProps {
  currentLevel: number;
  currentRating: number;
  totalReviews: number;
  completedJobs: number;
}
export function GamificationProgress({
  currentLevel,
  currentRating,
  totalReviews,
  completedJobs
}: GamificationProgressProps) {
  const levels = [{
    level: 1,
    name: 'Iniciante',
    minRating: 0,
    minReviews: 0,
    benefits: ['Acesso básico à plataforma', 'Perfil público']
  }, {
    level: 2,
    name: 'Bronze',
    minRating: 4.0,
    minReviews: 10,
    benefits: ['5% desconto em materiais', 'Badge Bronze no perfil']
  }, {
    level: 3,
    name: 'Prata',
    minRating: 4.3,
    minReviews: 30,
    benefits: ['10% desconto em materiais', 'Destaque em buscas', 'Badge Prata']
  }, {
    level: 4,
    name: 'Ouro',
    minRating: 4.6,
    minReviews: 75,
    benefits: ['15% desconto em materiais', 'Prioridade em buscas', 'Badge Ouro', 'Acesso a promoções exclusivas']
  }, {
    level: 5,
    name: 'Diamante',
    minRating: 4.8,
    minReviews: 150,
    benefits: ['20% desconto em materiais', 'Máxima visibilidade', 'Badge Diamante', 'Promoções VIP', 'Suporte prioritário']
  }];
  const currentLevelData = levels[currentLevel - 1];
  const nextLevelData = levels[currentLevel] || null;
  const getProgressToNextLevel = () => {
    if (!nextLevelData) return 100;
    const ratingProgress = currentRating / nextLevelData.minRating * 100;
    const reviewsProgress = totalReviews / nextLevelData.minReviews * 100;
    return Math.min((ratingProgress + reviewsProgress) / 2, 100);
  };
  return <div className="bg-white rounded-2xl p-8 border border-gray-200">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Sistema de Progressão
          </h2>
          <p className="text-gray-600">
            Evolua e desbloqueie benefícios exclusivos
          </p>
        </div>
        <TrophyIcon className="w-12 h-12 text-yellow-500" />
      </div>
      {/* Current Level */}
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Nível Atual</p>
            <h3 className="text-3xl font-bold text-gray-900">
              {currentLevelData.name}
            </h3>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-blue-600">{currentLevel}/5</p>
            <p className="text-sm text-gray-600">estrelas</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Avaliação média:</span>
            <span className="font-bold text-gray-900">
              {currentRating.toFixed(1)} ⭐
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total de avaliações:</span>
            <span className="font-bold text-gray-900">{totalReviews}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Trabalhos concluídos:</span>
            <span className="font-bold text-gray-900">{completedJobs}</span>
          </div>
        </div>
      </div>
      {/* Progress to Next Level */}
      {nextLevelData && <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-gray-900">
              Próximo Nível: {nextLevelData.name}
            </h4>
            <span className="text-sm text-gray-600">
              {Math.round(getProgressToNextLevel())}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500" style={{
          width: `${getProgressToNextLevel()}%`
        }}></div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-1">Avaliação necessária</p>
              <p className="font-bold text-gray-900">
                {nextLevelData.minRating.toFixed(1)} ⭐
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Atual: {currentRating.toFixed(1)}
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-1">Avaliações necessárias</p>
              <p className="font-bold text-gray-900">
                {nextLevelData.minReviews}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Atual: {totalReviews}
              </p>
            </div>
          </div>
        </div>}
      {/* Current Benefits */}
      <div className="mb-8">
        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <GiftIcon className="w-5 h-5 text-green-600" />
          Benefícios Ativos
        </h4>
        <div className="space-y-2">
          {currentLevelData.benefits.map((benefit, index) => <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              {benefit}
            </div>)}
        </div>
      </div>
      {/* Next Level Benefits */}
      {nextLevelData && <div className="p-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUpIcon className="w-5 h-5 text-blue-600" />
            Desbloqueie no Próximo Nível
          </h4>
          <div className="space-y-2">
            {nextLevelData.benefits.map((benefit, index) => <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                {benefit}
              </div>)}
          </div>
        </div>}
      {/* Low Rating Warning */}
      {currentRating < 4.0 && totalReviews >= 5 && <div className="mt-6 p-6 bg-orange-50 border-2 border-orange-200 rounded-xl">
          <div className="flex items-start gap-3">
            <BookOpenIcon className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-orange-900 mb-2">
                Melhore suas Habilidades
              </h4>
              <p className="text-sm text-orange-800 mb-3">
                Sua avaliação está abaixo do esperado. Recomendamos fazer cursos
                de qualificação para melhorar seus serviços.
              </p>
              <button className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-semibold hover:bg-orange-700 transition-all">
                Ver Cursos do Senac
              </button>
            </div>
          </div>
        </div>}
    </div>;
}