import { GamificationStats } from "../types/gamification";
import { Leaderboard } from "./Leaderboard";
import {
  StarIcon,
  CheckCircleIcon,
  TrophyIcon,
  TrendingUpIcon,
  UsersIcon,
  BriefcaseIcon,
  AwardIcon,
} from "lucide-react";

interface GamificationSectionProps {
  stats: GamificationStats;
  completedJobs?: number;
  totalClients?: number;
  userId?: string;
}

export function GamificationSection({
  stats,
  completedJobs = 0,
  totalClients = 0,
  userId,
}: GamificationSectionProps) {
  return (
    <div className="space-y-6">
      {/* Card de Boas-vindas */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Gamificação</h2>
        <p className="text-blue-100">Bem-vindo de volta!</p>
      </div>

      {/* Estatísticas Principais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <BriefcaseIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{completedJobs}</div>
          <div className="text-sm text-gray-600">Trabalhos</div>
        </div>

        <div className="bg-green-50 rounded-xl p-4 text-center">
          <CheckCircleIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">
            {stats.totalReviews}
          </div>
          <div className="text-sm text-gray-600">Avaliações</div>
        </div>

        <div className="bg-purple-50 rounded-xl p-4 text-center">
          <UsersIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{totalClients}</div>
          <div className="text-sm text-gray-600">Clientes</div>
        </div>

        <div className="bg-yellow-50 rounded-xl p-4 text-center">
          <TrendingUpIcon className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">
            {stats.progressToNextLevel.toFixed(0)}%
          </div>
          <div className="text-sm text-gray-600">Progresso</div>
        </div>
      </div>

      {/* Card de Nível e Progresso */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrophyIcon className="w-6 h-6" />
              <span className="text-sm opacity-90">Avaliação Média</span>
            </div>
            <div className="text-3xl font-bold">
              {stats.averageRating.toFixed(1)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90 mb-1">Total de Avaliações</div>
            <div className="text-3xl font-bold">{stats.totalReviews}</div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span>
              Progresso para {stats.nextLevel?.name || "Próximo Nível"}
            </span>
            <span>{stats.progressToNextLevel.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-blue-900/50 rounded-full h-3">
            <div
              className="bg-white rounded-full h-3 transition-all duration-500"
              style={{ width: `${stats.progressToNextLevel}%` }}
            />
          </div>
          <div className="text-xs opacity-75 mt-2">
            {stats.nextLevel
              ? `Avaliação necessária: ${stats.nextLevel.minRating.toFixed(
                  1
                )}+ | Mínimo de ${stats.nextLevel.minReviews} avaliações`
              : "Nível máximo alcançado!"}
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold mb-2">
            Benefícios do seu nível:
          </div>
          <div className="space-y-1">
            {stats.currentLevel.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <CheckCircleIcon className="w-4 h-4 flex-shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="text-sm">
            <span className="opacity-75">Taxa da plataforma: </span>
            <span className="font-bold text-lg">
              {stats.currentLevel.platformFee}%
            </span>
          </div>
        </div>
      </div>

      {/* Ranking Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrophyIcon className="w-6 h-6 text-yellow-500" />
            <h3 className="text-xl font-bold text-gray-900">Seu Ranking</h3>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">
              #{stats.ranking}
            </div>
            <div className="text-sm text-gray-600">
              de {stats.totalProfessionals}
            </div>
          </div>
        </div>

        {stats.ranking <= 10 && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center gap-2 text-yellow-800">
              <TrophyIcon className="w-5 h-5" />
              <span className="font-semibold">
                Parabéns! Você está no Top 10!
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Leaderboard */}
      <Leaderboard limit={10} currentUserId={userId} />

      {/* Conquistas */}
      {stats.achievements.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Conquistas</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {stats.achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  achievement.unlocked
                    ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300"
                    : "bg-gray-50 border-gray-200 opacity-50"
                }`}
              >
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <div className="font-semibold text-gray-900 text-sm mb-1">
                  {achievement.name}
                </div>
                <div className="text-xs text-gray-600 mb-2">
                  {achievement.description}
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-blue-600">
                  <StarIcon className="w-3 h-3" />
                  {achievement.points} pontos
                </div>
                {achievement.unlocked && achievement.unlockedAt && (
                  <div className="text-xs text-gray-500 mt-1">
                    Desbloqueado em{" "}
                    {new Date(achievement.unlockedAt).toLocaleDateString(
                      "pt-BR"
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alerta de Qualificação */}
      {stats.needsQualification && (
        <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AwardIcon className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Melhore seu Nível com Qualificação
              </h3>
              <p className="text-gray-700 mb-4">
                Para alcançar níveis mais altos e reduzir sua taxa da
                plataforma, considere fazer cursos de qualificação profissional.
              </p>
              <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium">
                Ver Cursos Disponíveis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
