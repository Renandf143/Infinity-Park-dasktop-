export interface Professional {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profession: string;
  category: string;
  experience: string;
  description: string;
  specialties: string[];
  availability: string;
  hourlyRate: number;
  rating: number;
  reviewsCount: number;
  verified: boolean;
  profileImage?: string;
  location?: {
    city: string;
    state: string;
  };
  stats?: {
    totalJobs: number;
    completedJobs: number;
    totalEarnings: number;
  };
}

export const mockProfessionals: Professional[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@email.com',
    phone: '(11) 99999-9999',
    profession: 'Eletricista',
    category: 'manutencao',
    experience: '5-10',
    description: 'Eletricista experiente com mais de 8 anos de atuação em instalações residenciais e comerciais.',
    specialties: ['Instalação elétrica', 'Manutenção preventiva', 'Automação residencial'],
    availability: 'Segunda a Sábado - 8h às 18h',
    hourlyRate: 85,
    rating: 4.8,
    reviewsCount: 24,
    verified: true,
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    location: {
      city: 'São Paulo',
      state: 'SP'
    },
    stats: {
      totalJobs: 45,
      completedJobs: 42,
      totalEarnings: 15600
    }
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@email.com',
    phone: '(21) 98888-8888',
    profession: 'Encanadora',
    category: 'manutencao',
    experience: '3-5',
    description: 'Especialista em sistemas hidráulicos e reparos de emergência.',
    specialties: ['Vazamentos', 'Instalação de tubulações', 'Desentupimento'],
    availability: 'Segunda a Sexta - 7h às 17h',
    hourlyRate: 70,
    rating: 4.9,
    reviewsCount: 18,
    verified: true,
    profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    location: {
      city: 'Rio de Janeiro',
      state: 'RJ'
    },
    stats: {
      totalJobs: 32,
      completedJobs: 30,
      totalEarnings: 8900
    }
  },
  {
    id: '3',
    name: 'Carlos Oliveira',
    email: 'carlos@email.com',
    phone: '(31) 97777-7777',
    profession: 'Pintor',
    category: 'reformas',
    experience: '7+',
    description: 'Pintor profissional com experiência em residências e escritórios.',
    specialties: ['Pintura interna', 'Pintura externa', 'Textura', 'Grafiato'],
    availability: 'Segunda a Sábado - 8h às 17h',
    hourlyRate: 60,
    rating: 4.7,
    reviewsCount: 35,
    verified: true,
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    location: {
      city: 'Belo Horizonte',
      state: 'MG'
    },
    stats: {
      totalJobs: 67,
      completedJobs: 63,
      totalEarnings: 12400
    }
  },
  {
    id: '4',
    name: 'Ana Costa',
    email: 'ana@email.com',
    phone: '(11) 96666-6666',
    profession: 'Diarista',
    category: 'limpeza',
    experience: '3-5',
    description: 'Serviços de limpeza residencial e comercial com produtos ecológicos.',
    specialties: ['Limpeza pesada', 'Organização', 'Limpeza pós-obra'],
    availability: 'Segunda a Sexta - 8h às 16h',
    hourlyRate: 45,
    rating: 4.6,
    reviewsCount: 28,
    verified: true,
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    location: {
      city: 'São Paulo',
      state: 'SP'
    },
    stats: {
      totalJobs: 89,
      completedJobs: 85,
      totalEarnings: 9800
    }
  },
  {
    id: '5',
    name: 'Pedro Almeida',
    email: 'pedro@email.com',
    phone: '(85) 95555-5555',
    profession: 'Técnico em Informática',
    category: 'tecnologia',
    experience: '5-10',
    description: 'Técnico especializado em manutenção de computadores e redes.',
    specialties: ['Formatação', 'Instalação de software', 'Redes', 'Hardware'],
    availability: 'Segunda a Sábado - 9h às 18h',
    hourlyRate: 80,
    rating: 4.9,
    reviewsCount: 42,
    verified: true,
    profileImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    location: {
      city: 'Fortaleza',
      state: 'CE'
    },
    stats: {
      totalJobs: 78,
      completedJobs: 76,
      totalEarnings: 18200
    }
  },
  {
    id: '6',
    name: 'Lucia Ferreira',
    email: 'lucia@email.com',
    phone: '(47) 94444-4444',
    profession: 'Manicure',
    category: 'beleza',
    experience: '3-5',
    description: 'Manicure e pedicure profissional com atendimento domiciliar.',
    specialties: ['Manicure', 'Pedicure', 'Esmaltação em gel', 'Nail art'],
    availability: 'Terça a Sábado - 9h às 19h',
    hourlyRate: 50,
    rating: 4.8,
    reviewsCount: 56,
    verified: true,
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    location: {
      city: 'Florianópolis',
      state: 'SC'
    },
    stats: {
      totalJobs: 124,
      completedJobs: 120,
      totalEarnings: 14500
    }
  }
];

// Função para buscar profissionais por categoria
export function getProfessionalsByCategory(category: string): Professional[] {
  return mockProfessionals.filter(prof => prof.category === category);
}

// Função para buscar profissional por ID
export function getProfessionalById(id: string): Professional | undefined {
  return mockProfessionals.find(prof => prof.id === id);
}

// Função para buscar todos os profissionais
export function getAllProfessionals(): Professional[] {
  return mockProfessionals;
}

// Função para buscar profissionais com filtros
export function searchProfessionals(filters: {
  category?: string;
  city?: string;
  state?: string;
  minRating?: number;
  maxPrice?: number;
  search?: string;
}): Professional[] {
  let results = mockProfessionals;

  if (filters.category) {
    results = results.filter(prof => prof.category === filters.category);
  }

  if (filters.city) {
    results = results.filter(prof => prof.location?.city === filters.city);
  }

  if (filters.state) {
    results = results.filter(prof => prof.location?.state === filters.state);
  }

  if (filters.minRating) {
    results = results.filter(prof => prof.rating >= filters.minRating!);
  }

  if (filters.maxPrice) {
    results = results.filter(prof => prof.hourlyRate <= filters.maxPrice!);
  }

  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    results = results.filter(prof => 
      prof.name.toLowerCase().includes(searchTerm) ||
      prof.profession.toLowerCase().includes(searchTerm) ||
      prof.description.toLowerCase().includes(searchTerm)
    );
  }

  return results;
}