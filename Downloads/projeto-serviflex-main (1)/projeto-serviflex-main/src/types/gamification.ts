export interface StarLevel {
  stars: number;
  name: string;
  minRating: number;
  maxRating: number;
  minReviews: number;
  benefits: string[];
  icon: string;
  color: string;
  platformFee: number; // Porcentagem de taxa da plataforma
  needsQualification?: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface GamificationStats {
  currentStars: number;
  averageRating: number;
  totalReviews: number;
  currentLevel: StarLevel;
  nextLevel: StarLevel | null;
  progressToNextLevel: number;
  achievements: Achievement[];
  ranking: number;
  totalProfessionals: number;
  needsQualification: boolean;
  qualificationCourses?: string[];
}

export const STAR_LEVELS: StarLevel[] = [
  {
    stars: 1,
    name: 'Iniciante',
    minRating: 0,
    maxRating: 2.9,
    minReviews: 0,
    benefits: [
      'Perfil básico',
      'Receber solicitações',
      'Acesso à plataforma'
    ],
    icon: '⭐',
    color: '#9CA3AF',
    platformFee: 15,
    needsQualification: true
  },
  {
    stars: 2,
    name: 'Aprendiz',
    minRating: 3.0,
    maxRating: 3.4,
    minReviews: 3,
    benefits: [
      'Perfil básico',
      'Receber solicitações',
      'Badge de Aprendiz',
      '5% desconto em materiais parceiros'
    ],
    icon: '⭐⭐',
    color: '#60A5FA',
    platformFee: 12
  },
  {
    stars: 3,
    name: 'Profissional',
    minRating: 3.5,
    maxRating: 3.9,
    minReviews: 5,
    benefits: [
      'Destaque na busca',
      'Badge de Profissional',
      'Prioridade em solicitações',
      '10% desconto em materiais',
      'Visibilidade aumentada'
    ],
    icon: '⭐⭐⭐',
    color: '#8B5CF6',
    platformFee: 10
  },
  {
    stars: 4,
    name: 'Especialista',
    minRating: 4.0,
    maxRating: 4.4,
    minReviews: 10,
    benefits: [
      'Perfil destacado',
      'Badge de Especialista',
      'Taxa reduzida (8%)',
      '15% desconto em materiais',
      'Suporte prioritário',
      'Acesso a promoções exclusivas'
    ],
    icon: '⭐⭐⭐⭐',
    color: '#F59E0B',
    platformFee: 8
  },
  {
    stars: 5,
    name: 'Mestre',
    minRating: 4.5,
    maxRating: 5.0,
    minReviews: 20,
    benefits: [
      'Perfil premium',
      'Badge de Mestre',
      'Taxa mínima (5%)',
      '20% desconto em materiais',
      'Suporte VIP 24/7',
      'Destaque máximo na plataforma',
      'Acesso antecipado a novos recursos',
      'Programa de indicação premium'
    ],
    icon: '⭐⭐⭐⭐⭐',
    color: '#EF4444',
    platformFee: 5
  }
];

export const ACHIEVEMENTS_LIST: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  {
    id: 'first_job',
    name: 'Primeiro Trabalho',
    description: 'Complete seu primeiro serviço',
    icon: '🎯',
    points: 50
  },
  {
    id: 'five_jobs',
    name: 'Trabalhador Dedicado',
    description: 'Complete 5 serviços',
    icon: '💪',
    points: 100
  },
  {
    id: 'ten_jobs',
    name: 'Profissional Ativo',
    description: 'Complete 10 serviços',
    icon: '🔥',
    points: 200
  },
  {
    id: 'perfect_rating',
    name: 'Perfeição',
    description: 'Mantenha avaliação 5.0 com 10+ avaliações',
    icon: '⭐',
    points: 300
  },
  {
    id: 'three_stars',
    name: '3 Estrelas',
    description: 'Alcance 3 estrelas',
    icon: '⭐⭐⭐',
    points: 150
  },
  {
    id: 'four_stars',
    name: '4 Estrelas',
    description: 'Alcance 4 estrelas',
    icon: '⭐⭐⭐⭐',
    points: 250
  },
  {
    id: 'five_stars',
    name: '5 Estrelas',
    description: 'Alcance 5 estrelas',
    icon: '⭐⭐⭐⭐⭐',
    points: 500
  },
  {
    id: 'qualified',
    name: 'Qualificado',
    description: 'Complete um curso de qualificação',
    icon: '🎓',
    points: 200
  }
];

export const QUALIFICATION_COURSES = [
  {
    id: 'senac_eletrica',
    name: 'Eletricista Residencial - SENAC',
    institution: 'SENAC',
    duration: '40 horas',
    category: 'Elétrica',
    url: 'https://www.senac.br'
  },
  {
    id: 'senac_hidraulica',
    name: 'Instalador Hidráulico - SENAC',
    institution: 'SENAC',
    duration: '30 horas',
    category: 'Hidráulica',
    url: 'https://www.senac.br'
  },
  {
    id: 'senac_pintura',
    name: 'Pintor Profissional - SENAC',
    institution: 'SENAC',
    duration: '25 horas',
    category: 'Pintura',
    url: 'https://www.senac.br'
  },
  {
    id: 'senai_mecanica',
    name: 'Mecânico de Manutenção - SENAI',
    institution: 'SENAI',
    duration: '60 horas',
    category: 'Mecânica',
    url: 'https://www.senai.br'
  },
  {
    id: 'senai_marcenaria',
    name: 'Marceneiro - SENAI',
    institution: 'SENAI',
    duration: '50 horas',
    category: 'Marcenaria',
    url: 'https://www.senai.br'
  }
];
