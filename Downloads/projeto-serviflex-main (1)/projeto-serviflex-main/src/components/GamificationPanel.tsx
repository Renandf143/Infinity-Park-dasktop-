import { useEffect, useState } from "react";
import {
  TrophyIcon,
  AwardIcon,
  TrendingUpIcon,
  LockIcon,
  StarIcon,
  ZapIcon,
  TargetIcon,
  CrownIcon,
  FlameIcon,
  TrendingDownIcon,
} from "lucide-react";
import { gamificationService } from "../services/gamificationService";
import { GamificationStats } from "../types/gamification";

interface GamificationPanelProps {
  userId: string;
}

export function GamificationPanel({ userId }: GamificationPanelProps) {
  const [stats, setStats] = useState<GamificationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<unknown[]>([]);
  const [activeTab, setActiveTab] = useState<
    "overview" | "achievements" | "leaderboard"
  >("overview");

  useEffect(() => {
    loadGamificationData();

    const setupRealtimeListeners = async () => {
      const { doc, onSnapshot, collection, query, where } = await import(
        "firebase/firestore"
      );
      const { db } = await import("../firebase");

      const unsubscribeProfile = onSnapshot(
        doc(db, "serviceProviders", userId),
        async () => {
          try {
            const gamificationStats =
              await gamificationService.getGamificationStats(userId);
            setStats(gamificationStats);
          } catch (error) {
            console.error("Erro ao atualizar gamificação:", error);
          }
        }
      );

      const reviewsQuery = query(
        collection(db, "reviews"),
        where("professionalId", "==", userId)
      );

      const unsubscribeReviews = onSnapshot(reviewsQuery, async () => {
        try {
          const gamificationStats =
            await gamificationService.getGamificationStats(userId);
          setStats(gamificationStats);
        } catch (error) {
          console.error("Erro ao atualizar gamificação:", error);
        }
      });

      const leaderboardInterval = setInterval(async () => {
        try {
          const leaderboardData = await gamificationService.getLeaderboard(10);
          setLeaderboard(leaderboardData);
        } catch (error) {
          console.error("Erro ao atualizar leaderboard:", error);
        }
      }, 30000);

      return () => {
        unsubscribeProfile();
        unsubscribeReviews();
        clearInterval(leaderboardInterval);
      };
    };

    const cleanup = setupRealtimeListeners();
    return () => {
      cleanup.then((fn) => fn && fn());
    };
  }, [userId]);

  const loadGamificationData = async () => {
    try {
      const [gamificationStats, leaderboardData] = await Promise.all([
        gamificationService.getGamificationStats(userId),
        gamificationService.getLeaderboard(10),
      ]);

      setStats(gamificationStats);
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error("Erro ao carregar gamificação:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return "from-yellow-400 to-yellow-600";
    if (rank === 2) return "from-gray-300 to-gray-500";
    if (rank === 3) return "from-orange-400 to-orange-600";
    return "from-blue-400 to-blue-600";
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return "👑";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return "⭐";
  };

  return (
    <div className="space-y-6">
      {/* Hero Card - Level & Progress */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative p-8 text-white">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-5xl">
                {stats.currentLevel.icon}
              </div>
              <div>
                <p className="text-white/80 text-sm font-medium mb-1">
                  Sua Classificação
                </p>
                <h2 className="text-4xl font-black mb-1">
                  {stats.currentLevel.name}
                </h2>
                <div className="flex items-center gap-2">
                  <StarIcon className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                  <span className="text-2xl font-bold">
                    {stats.currentStars}
                  </span>
                  <span className="text-white/80">estrelas</span>
                </div>
              </div>
            </div>

            {/* Ranking Badge */}
            <div className="text-center">
              <div
                className={`w-16 h-16 bg-gradient-to-br ${getRankColor(
                  stats.ranking
                )} rounded-full flex items-center justify-center text-3xl shadow-lg mb-2`}
              >
                {getRankIcon(stats.ranking)}
              </div>
              <p className="text-3xl font-black">#{stats.ranking}</p>
              <p className="text-white/80 text-sm">
                de {stats.totalProfessionals}
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <StarIcon className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                <p className="text-white/80 text-sm">Avaliação</p>
              </div>
              <p className="text-3xl font-black">
                {stats.averageRating.toFixed(1)}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrophyIcon className="w-5 h-5 text-yellow-300" />
                <p className="text-white/80 text-sm">Avaliações</p>
              </div>
              <p className="text-3xl font-black">{stats.totalReviews}</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <ZapIcon className="w-5 h-5 text-yellow-300" />
                <p className="text-white/80 text-sm">Taxa</p>
              </div>
              <p className="text-3xl font-black">
                {stats.currentLevel.platformFee}%
              </p>
            </div>
          </div>

          {/* Progress to Next Level */}
          {stats.nextLevel ? (
            <div className="bg-white/10 backdrop-blur rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <TrendingUpIcon className="w-5 h-5" />
                  <span className="font-semibold">
                    Próximo Nível: {stats.nextLevel.name}
                  </span>
                </div>
                <span className="text-2xl font-bold">
                  {Math.round(stats.progressToNextLevel)}%
                </span>
              </div>

              <div className="w-full bg-white/20 rounded-full h-4 mb-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-400 to-emerald-500 h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                  style={{ width: `${stats.progressToNextLevel}%` }}
                >
                  {stats.progressToNextLevel > 10 && (
                    <FlameIcon className="w-3 h-3 text-white" />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-white/80">
                  Necessário: {stats.nextLevel.minRating.toFixed(1)}⭐ •{" "}
                  {stats.nextLevel.minReviews} avaliações
                </span>
                <span className="font-semibold">
                  {stats.nextLevel.icon} {stats.nextLevel.name}
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 backdrop-blur rounded-xl p-5 border-2 border-yellow-400/50">
              <div className="flex items-center gap-3">
                <CrownIcon className="w-8 h-8 text-yellow-300" />
                <div>
                  <p className="font-bold text-lg">Nível Máximo Alcançado!</p>
                  <p className="text-white/80 text-sm">
                    Você é um dos melhores profissionais da plataforma
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Benefits */}
          <div className="mt-5 pt-5 border-t border-white/20">
            <p className="font-semibold mb-3 flex items-center gap-2">
              <TargetIcon className="w-5 h-5" />
              Benefícios do seu nível:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {stats.currentLevel.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-green-300 mt-0.5">✓</span>
                  <span className="text-white/90">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Qualification Warning */}
      {stats.needsQualification && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-xl p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
              <TrendingDownIcon className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-bold text-red-900 mb-2 flex items-center gap-2">
                ⚠️ Atenção: Qualificação Necessária
              </h4>
              <p className="text-red-800 mb-4 leading-relaxed">
                Sua avaliação está abaixo de 3.0 estrelas. Para manter a
                qualidade da plataforma, recomendamos fortemente que você
                realize cursos de qualificação profissional.
              </p>

              <div className="bg-white rounded-lg p-4 mb-4">
                <p className="font-bold text-gray-900 mb-3">
                  📚 Cursos Recomendados:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <a
                    href="https://www.senac.br"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all border border-blue-200"
                  >
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-2xl">
                      🎓
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">SENAC</p>
                      <p className="text-xs text-gray-600">
                        Cursos Profissionalizantes
                      </p>
                    </div>
                  </a>
                  <a
                    href="https://www.senai.br"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg hover:from-orange-100 hover:to-orange-200 transition-all border border-orange-200"
                  >
                    <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center text-2xl">
                      🎓
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">SENAI</p>
                      <p className="text-xs text-gray-600">Cursos Técnicos</p>
                    </div>
                  </a>
                </div>
              </div>

              <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3">
                <p className="text-sm text-yellow-900">
                  <strong>Importante:</strong> Profissionais com avaliação muito
                  baixa podem ter suas contas suspensas temporariamente até a
                  conclusão de cursos de qualificação.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
              activeTab === "overview"
                ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <TrophyIcon className="w-5 h-5 inline mr-2" />
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab("achievements")}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
              activeTab === "achievements"
                ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <AwardIcon className="w-5 h-5 inline mr-2" />
            Conquistas
          </button>
          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
              activeTab === "leaderboard"
                ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <CrownIcon className="w-5 h-5 inline mr-2" />
            Ranking
          </button>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Todos os Níveis
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      name: "Iniciante",
                      icon: "🌱",
                      minRating: 0,
                      minReviews: 0,
                      fee: 15,
                    },
                    {
                      name: "Bronze",
                      icon: "🥉",
                      minRating: 3.5,
                      minReviews: 5,
                      fee: 12,
                    },
                    {
                      name: "Prata",
                      icon: "🥈",
                      minRating: 4.0,
                      minReviews: 15,
                      fee: 10,
                    },
                    {
                      name: "Ouro",
                      icon: "🥇",
                      minRating: 4.5,
                      minReviews: 30,
                      fee: 8,
                    },
                    {
                      name: "Platina",
                      icon: "💎",
                      minRating: 4.7,
                      minReviews: 50,
                      fee: 6,
                    },
                    {
                      name: "Diamante",
                      icon: "💠",
                      minRating: 4.9,
                      minReviews: 100,
                      fee: 5,
                    },
                  ].map((level, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        stats.currentLevel.name === level.name
                          ? "bg-blue-50 border-blue-500 shadow-md"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{level.icon}</span>
                          <div>
                            <p className="font-bold text-gray-900">
                              {level.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {level.minRating}⭐ • {level.minReviews}+
                              avaliações
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">
                            {level.fee}%
                          </p>
                          <p className="text-xs text-gray-600">taxa</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === "achievements" && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Suas Conquistas (
                {stats.achievements.filter((a) => a.unlocked).length}/
                {stats.achievements.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {stats.achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`relative p-5 rounded-xl border-2 transition-all ${
                      achievement.unlocked
                        ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-400 shadow-lg"
                        : "bg-gray-50 border-gray-200 opacity-60"
                    }`}
                  >
                    {!achievement.unlocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-900/10 rounded-xl">
                        <LockIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    )}

                    <div className="text-center">
                      <div className="text-5xl mb-3">{achievement.icon}</div>
                      <p className="font-bold text-sm text-gray-900 mb-1">
                        {achievement.name}
                      </p>
                      <p className="text-xs text-gray-600 mb-3">
                        {achievement.description}
                      </p>
                      <div className="flex items-center justify-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                        <ZapIcon className="w-3 h-3" />+{achievement.points} pts
                      </div>
                      {achievement.unlocked && achievement.unlockedAt && (
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(achievement.unlockedAt).toLocaleDateString(
                            "pt-BR"
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Leaderboard Tab */}
          {activeTab === "leaderboard" && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Top 10 Profissionais
              </h3>
              <div className="space-y-3">
                {leaderboard.map((professional, index) => (
                  <div
                    key={professional.userId}
                    className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                      professional.userId === userId
                        ? "bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-500 shadow-lg"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg shadow-lg ${
                          professional.rank === 1
                            ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white"
                            : professional.rank === 2
                            ? "bg-gradient-to-br from-gray-300 to-gray-500 text-white"
                            : professional.rank === 3
                            ? "bg-gradient-to-br from-orange-400 to-orange-600 text-white"
                            : "bg-gradient-to-br from-blue-400 to-blue-600 text-white"
                        }`}
                      >
                        {professional.rank <= 3
                          ? getRankIcon(professional.rank)
                          : `#${professional.rank}`}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 flex items-center gap-2">
                          {professional.displayName}
                          {professional.userId === userId && (
                            <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                              Você
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <span className="text-xl">
                            {professional.level.icon}
                          </span>
                          {professional.level.name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-gray-900 flex items-center gap-1">
                        {professional.averageRating?.toFixed(1) || "0.0"}
                        <StarIcon className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      </p>
                      <p className="text-sm text-gray-600">
                        {professional.totalReviews || 0} avaliações
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
