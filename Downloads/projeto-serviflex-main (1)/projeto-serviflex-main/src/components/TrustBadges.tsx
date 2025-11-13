import React from 'react';
import { ShieldCheckIcon, UsersIcon, StarIcon, TrophyIcon } from 'lucide-react';
export function TrustBadges() {
  const badges = [{
    icon: ShieldCheckIcon,
    text: 'Pagamento Seguro',
    subtext: '100% protegido',
    color: 'from-blue-500 to-blue-600',
    iconColor: 'text-white'
  }, {
    icon: UsersIcon,
    text: '50K+ Profissionais',
    subtext: 'Verificados',
    color: 'from-purple-500 to-purple-600',
    iconColor: 'text-white'
  }, {
    icon: StarIcon,
    text: '4.9/5 Avaliação',
    subtext: 'Média geral',
    color: 'from-yellow-500 to-yellow-600',
    iconColor: 'text-white'
  }, {
    icon: TrophyIcon,
    text: 'Sistema de Níveis',
    subtext: 'Gamificação ativa',
    color: 'from-green-500 to-green-600',
    iconColor: 'text-white'
  }];
  return <section className="w-full py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((badge, index) => <div key={index} className="group flex flex-col items-center justify-center gap-4 p-6 bg-white rounded-2xl hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-transparent hover:scale-105">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${badge.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                <badge.icon className={`w-8 h-8 ${badge.iconColor}`} />
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-900 text-base mb-1">
                  {badge.text}
                </p>
                <p className="text-sm text-gray-600">{badge.subtext}</p>
              </div>
            </div>)}
        </div>
      </div>
    </section>;
}