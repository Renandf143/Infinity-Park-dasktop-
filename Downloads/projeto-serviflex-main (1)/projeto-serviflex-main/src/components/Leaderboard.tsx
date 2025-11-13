import { useState, useEffect } from "react";
import { gamificationService } from "../services/gamificationService";
import { TrophyIcon, StarIcon, UserIcon, Loader2Icon } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  photoUrl?: string;
  averageRating: number;
  totalReviews: number;
  stars: number;
  level: any;
}

interface LeaderboardProps {
  limit?: number;
  currentUserId?: string;
}

export function Leaderboard({ limit = 10, currentUserId }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const data = await gamificationService.getLeaderboard(limit);
        setLeaderboard(data);
      } catch (error) {
        console.error("Erro ao carregar leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, [limit]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-sm text-center">
        <Loader2Icon className="w-8 h-8 animate-spin mx-auto text-blue-600" />
        <p className="text-gray-600 mt-2">Carregando ranking...</p>
      </div>
    );
  }

  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white";
      case 2:
        return "bg-gradient-to-br from-gray-300 to-gray-500 text-white";
      case 3:
        return "bg-gradient-to-br from-orange-400 to-orange-600 text-white";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
        <div className="flex items-center gap-3">
          <TrophyIcon className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Top {limit} Profissionais</h2>
            <p className="text-blue-100 text-sm">
              Os melhores profissionais da plataforma
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {leaderboard.map((entry) => (
          <div
            key={entry.userId}
            className={`p-4 hover:bg-gray-50 transition-colors ${
              entry.userId === currentUserId ? "bg-blue-50" : ""
            }`}
          >
            <div className="flex items-center gap-4">
              {/* Rank */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 ${getMedalColor(
                  entry.rank
                )}`}
              >
                {entry.rank <= 3 ? (
                  <TrophyIcon className="w-6 h-6" />
                ) : (
                  entry.rank
                )}
              </div>

              {/* Avatar */}
              <div className="flex-shrink-0">
                {entry.photoUrl ? (
                  <img
                    src={entry.photoUrl}
                    alt={entry.displayName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-gray-500" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {entry.displayName}
                  </h3>
                  {entry.userId === currentUserId && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                      Você
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-medium">
                      {entry.averageRating.toFixed(1)}
                    </span>
                  </div>
                  <span>•</span>
                  <span>{entry.totalReviews} avaliações</span>
                </div>
              </div>

              {/* Stars Badge */}
              <div
                className="px-3 py-1 rounded-full text-sm font-semibold flex-shrink-0"
                style={{
                  backgroundColor: entry.level.color + "20",
                  color: entry.level.color,
                }}
              >
                {entry.level.icon} {entry.level.name}
              </div>
            </div>
          </div>
        ))}
      </div>

      {leaderboard.length === 0 && (
        <div className="p-12 text-center">
          <TrophyIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">Nenhum profissional no ranking ainda</p>
        </div>
      )}
    </div>
  );
}
