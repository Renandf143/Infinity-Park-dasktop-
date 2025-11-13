import React from 'react';
import { StarIcon, TrophyIcon, AwardIcon } from 'lucide-react';
interface GamificationBadgeProps {
  level: number;
  compact?: boolean;
}
export function GamificationBadge({
  level,
  compact = false
}: GamificationBadgeProps) {
  const getLevelInfo = (level: number) => {
    switch (level) {
      case 1:
        return {
          name: 'Iniciante',
          color: 'bg-gray-500',
          textColor: 'text-gray-700'
        };
      case 2:
        return {
          name: 'Bronze',
          color: 'bg-amber-600',
          textColor: 'text-amber-700'
        };
      case 3:
        return {
          name: 'Prata',
          color: 'bg-gray-400',
          textColor: 'text-gray-700'
        };
      case 4:
        return {
          name: 'Ouro',
          color: 'bg-yellow-500',
          textColor: 'text-yellow-700'
        };
      case 5:
        return {
          name: 'Diamante',
          color: 'bg-blue-600',
          textColor: 'text-blue-700'
        };
      default:
        return {
          name: 'Iniciante',
          color: 'bg-gray-500',
          textColor: 'text-gray-700'
        };
    }
  };
  const levelInfo = getLevelInfo(level);
  if (compact) {
    return <div className={`inline-flex items-center gap-1 px-2 py-1 ${levelInfo.color} rounded-full`}>
        <StarIcon className="w-3 h-3 text-white fill-white" />
        <span className="text-xs font-bold text-white">{level}</span>
      </div>;
  }
  return <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${levelInfo.color} to-opacity-80 rounded-xl shadow-lg`}>
      <div className="flex items-center gap-1">
        {[...Array(level)].map((_, i) => <StarIcon key={i} className="w-4 h-4 text-white fill-white" />)}
      </div>
      <span className="text-sm font-bold text-white">{levelInfo.name}</span>
    </div>;
}