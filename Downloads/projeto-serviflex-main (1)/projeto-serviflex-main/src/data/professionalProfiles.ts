// Dados completos e seguros dos profissionais
export interface ProfessionalProfile {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  location: string;
  price: number;
  verified: boolean;
  premium: boolean;
  online: boolean;
  serviceType: string;
  title: string;
  description: string;
  availability: string;
  workingHours: string;
  skills: string[];
  category: string; // Categoria para filtros
  experience: string;
  completedJobs: number;
  responseTime: string;
  languages: string[];
  phone: string;
  email: string;
  website: string;
  
  portfolio: {
    images: Array<{
      url: string;
      title: string;
      description: string;
      category: string;
    }>;
    videos: Array<{
      thumbnail: string;
      title: string;
      duration: string;
    }>;
  };

  certifications: Array<{
    name: string;
    institution: string;
    year: string;
    verified: boolean;
  }>;

  stats: {
    totalClients: number;
    repeatClients: number;
    averageRating: number;
    onTimeRate: number;
    satisfactionRate: number;
    monthlyJobs: number;
    yearsActive: number;
  };

  about: {
    summary: string;
    specialties: string[];
    approach: string;
    equipment: string[];
  };

  services: Array<{
    name: string;
    price: number;
    duration: string;
    description: string;
    includes: string[];
    popular: boolean;
  }>;

  testimonials: Array<{
    name: string;
    avatar: string;
    rating: number;
    comment: string;
    date: string;
    service: string;
    verified: boolean;
    helpful: number;
  }>;

  schedule: {
    monday: { available: boolean; hours: string };
    tuesday: { available: boolean; hours: string };
    wednesday: { available: boolean; hours: string };
    thursday: { available: boolean; hours: string };
    friday: { available: boolean; hours: string };
    saturday: { available: boolean; hours: string };
    sunday: { available: boolean; hours: string };
  };

  policies: {
    cancellation: string;
    payment: string;
    guarantee: string;
    insurance: string;
  };
}

export const professionalProfiles: Record<string, ProfessionalProfile> = {
  // LIMPEZA E ORGANIZAÇÃO
  '1': {
    id: '1',
    name: 'Maria Santos',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=800&fit=crop',
    rating: 4.9,
    reviews: 156,
    location: 'São Paulo, SP',
    price: 80,
    verified: true,
    premium: true,
    online: true,
    serviceType: 'Limpeza Residencial Completa',
    title: 'Especialista em Limpeza Residencial Premium',
    description: 'Especialista em limpeza profunda de residências, com 8 anos de experiência.',
    availability: 'Segunda a Sábado',
    workingHours: '08:00 - 18:00',
    skills: ['Limpeza Profunda', 'Organização', 'Produtos Ecológicos'],
    category: 'limpeza-organizacao',
    experience: '8 anos',
    completedJobs: 342,
    responseTime: '1 hora',
    languages: ['Português', 'Espanhol'],
    phone: '+55 (11) 99999-9999',
    email: 'maria.santos@serviflex.com',
    website: 'www.mariasantos-limpeza.com.br',
    
    portfolio: {
      images: [
        {
          url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop',
          title: 'Limpeza Residencial Completa',
          description: 'Casa de 3 quartos - Antes e depois',
          category: 'Residencial'
        }
      ],
      videos: [
        {
          thumbnail: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop',
          title: 'Processo de Limpeza',
          duration: '3:45'
        }
      ]
    },

    certifications: [
      {
        name: 'Certificação em Limpeza Hospitalar',
        institution: 'ANVISA',
        year: '2023',
        verified: true
      }
    ],

    stats: {
      totalClients: 156,
      repeatClients: 89,
      averageRating: 4.9,
      onTimeRate: 98,
      satisfactionRate: 97,
      monthlyJobs: 28,
      yearsActive: 8
    },

    about: {
      summary: 'Profissional dedicada com foco em excelência e satisfação do cliente.',
      specialties: ['Limpeza residencial completa', 'Organização de ambientes'],
      approach: 'Utilizo uma abordagem personalizada para cada cliente.',
      equipment: ['Aspiradores profissionais HEPA', 'Produtos ecológicos']
    },

    services: [
      {
        name: 'Limpeza Residencial Completa',
        price: 80,
        duration: '3-4 horas',
        description: 'Limpeza completa de todos os ambientes',
        includes: ['Todos os cômodos', 'Produtos inclusos'],
        popular: true
      }
    ],

    testimonials: [
      {
        name: 'Ana Silva',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
        rating: 5,
        comment: 'Excelente profissional! Super recomendo!',
        date: '15/03/2024',
        service: 'Limpeza Residencial Completa',
        verified: true,
        helpful: 12
      }
    ],

    schedule: {
      monday: { available: true, hours: '08:00-18:00' },
      tuesday: { available: true, hours: '08:00-18:00' },
      wednesday: { available: true, hours: '08:00-18:00' },
      thursday: { available: true, hours: '08:00-18:00' },
      friday: { available: true, hours: '08:00-18:00' },
      saturday: { available: true, hours: '08:00-16:00' },
      sunday: { available: false, hours: 'Indisponível' }
    },

    policies: {
      cancellation: '24 horas de antecedência',
      payment: 'Cartão, PIX ou dinheiro',
      guarantee: '7 dias de garantia',
      insurance: 'Seguro contra danos incluído'
    }
  },

  // TECNOLOGIA
  '2': {
    id: '2',
    name: 'João Silva',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop',
    rating: 4.8,
    reviews: 203,
    location: 'Rio de Janeiro, RJ',
    price: 120,
    verified: true,
    premium: true,
    online: true,
    serviceType: 'Desenvolvimento Web Full Stack',
    title: 'Desenvolvedor Full Stack Sênior',
    description: 'Desenvolvedor full stack com 10 anos de experiência.',
    availability: 'Todos os dias',
    workingHours: '09:00 - 21:00',
    skills: ['React', 'Node.js', 'TypeScript'],
    category: 'tecnologia-suporte',
    experience: '10 anos',
    completedJobs: 287,
    responseTime: '30 minutos',
    languages: ['Português', 'Inglês'],
    phone: '+55 (21) 98888-8888',
    email: 'joao.silva@serviflex.com',
    website: 'www.joaosilva-dev.com.br',
    
    portfolio: {
      images: [
        {
          url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
          title: 'E-commerce Completo',
          description: 'Plataforma de vendas online',
          category: 'E-commerce'
        }
      ],
      videos: [
        {
          thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
          title: 'Demo do E-commerce',
          duration: '5:20'
        }
      ]
    },

    certifications: [
      {
        name: 'AWS Certified Solutions Architect',
        institution: 'Amazon Web Services',
        year: '2023',
        verified: true
      }
    ],

    stats: {
      totalClients: 203,
      repeatClients: 145,
      averageRating: 4.8,
      onTimeRate: 96,
      satisfactionRate: 95,
      monthlyJobs: 15,
      yearsActive: 10
    },

    about: {
      summary: 'Desenvolvedor full stack apaixonado por criar soluções digitais inovadoras.',
      specialties: ['Desenvolvimento React/Next.js', 'APIs REST e GraphQL'],
      approach: 'Acredito em código limpo, testes automatizados e metodologias ágeis.',
      equipment: ['MacBook Pro M2', 'Monitores 4K']
    },

    services: [
      {
        name: 'Desenvolvimento Web Completo',
        price: 120,
        duration: '2-4 semanas',
        description: 'Site ou aplicação web do zero',
        includes: ['Design responsivo', 'SEO otimizado'],
        popular: true
      }
    ],

    testimonials: [
      {
        name: 'Marina Oliveira',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        rating: 5,
        comment: 'João desenvolveu nosso e-commerce. Resultado incrível!',
        date: '18/03/2024',
        service: 'Desenvolvimento Web Completo',
        verified: true,
        helpful: 18
      }
    ],

    schedule: {
      monday: { available: true, hours: '09:00-21:00' },
      tuesday: { available: true, hours: '09:00-21:00' },
      wednesday: { available: true, hours: '09:00-21:00' },
      thursday: { available: true, hours: '09:00-21:00' },
      friday: { available: true, hours: '09:00-21:00' },
      saturday: { available: true, hours: '10:00-18:00' },
      sunday: { available: true, hours: '14:00-20:00' }
    },

    policies: {
      cancellation: '48 horas de antecedência',
      payment: 'PIX, cartão ou transferência',
      guarantee: '30 dias de garantia',
      insurance: 'Seguro profissional incluído'
    }
  },

  // DESIGN E CRIAÇÃO
  '3': {
    id: '3',
    name: 'Ana Costa',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=800&fit=crop',
    rating: 4.7,
    reviews: 89,
    location: 'Belo Horizonte, MG',
    price: 90,
    verified: true,
    premium: false,
    online: true,
    serviceType: 'Design Gráfico e Identidade Visual',
    title: 'Designer Gráfica Especializada',
    description: 'Designer gráfica com foco em identidade visual e branding para empresas de todos os portes.',
    availability: 'Segunda a Sexta',
    workingHours: '09:00 - 18:00',
    skills: ['Photoshop', 'Illustrator', 'Figma', 'Branding', 'UI/UX'],
    category: 'design-criacao',
    experience: '7 anos',
    completedJobs: 298,
    responseTime: '2 horas',
    languages: ['Português', 'Inglês'],
    phone: '+55 (31) 97777-7777',
    email: 'ana.costa@serviflex.com',
    website: 'www.anacosta-design.com.br',
    
    portfolio: {
      images: [
        {
          url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
          title: 'Identidade Visual Completa',
          description: 'Logo e materiais gráficos para startup de tecnologia',
          category: 'Branding'
        }
      ],
      videos: [
        {
          thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
          title: 'Processo Criativo de Branding',
          duration: '4:12'
        }
      ]
    },

    certifications: [
      {
        name: 'Adobe Certified Expert - Photoshop',
        institution: 'Adobe',
        year: '2022',
        verified: true
      }
    ],

    stats: {
      totalClients: 89,
      repeatClients: 67,
      averageRating: 4.7,
      onTimeRate: 95,
      satisfactionRate: 94,
      monthlyJobs: 18,
      yearsActive: 7
    },

    about: {
      summary: 'Designer apaixonada por criar identidades visuais marcantes e funcionais.',
      specialties: ['Criação de logotipos e identidade visual completa', 'Design de materiais gráficos'],
      approach: 'Trabalho em estreita colaboração com o cliente para entender sua visão.',
      equipment: ['iMac 27" com tela Retina 5K', 'Adobe Creative Suite completo']
    },

    services: [
      {
        name: 'Identidade Visual Completa',
        price: 90,
        duration: '1-2 semanas',
        description: 'Logo e manual de marca completo para sua empresa',
        includes: ['Logo principal e variações', 'Manual de identidade'],
        popular: true
      }
    ],

    testimonials: [
      {
        name: 'Ricardo Santos',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        rating: 5,
        comment: 'Ana criou uma identidade visual incrível para minha empresa!',
        date: '22/03/2024',
        service: 'Identidade Visual Completa',
        verified: true,
        helpful: 15
      }
    ],

    schedule: {
      monday: { available: true, hours: '09:00-18:00' },
      tuesday: { available: true, hours: '09:00-18:00' },
      wednesday: { available: true, hours: '09:00-18:00' },
      thursday: { available: true, hours: '09:00-18:00' },
      friday: { available: true, hours: '09:00-18:00' },
      saturday: { available: false, hours: 'Indisponível' },
      sunday: { available: false, hours: 'Indisponível' }
    },

    policies: {
      cancellation: '24 horas de antecedência',
      payment: 'PIX, cartão ou transferência (50% antecipado)',
      guarantee: '15 dias para revisões',
      insurance: 'Seguro profissional incluído'
    }
  },

  // REFORMAS E REPAROS
  '4': {
    id: '4',
    name: 'Carlos Mendes',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=800&fit=crop',
    rating: 4.6,
    reviews: 124,
    location: 'Salvador, BA',
    price: 60,
    verified: true,
    premium: false,
    online: false,
    serviceType: 'Eletricista Residencial e Comercial',
    title: 'Eletricista Especializado em Instalações',
    description: 'Eletricista com 12 anos de experiência em instalações residenciais, comerciais e manutenção elétrica.',
    availability: 'Segunda a Sábado',
    workingHours: '08:00 - 17:00',
    skills: ['Instalação Elétrica', 'Manutenção', 'Automação', 'Segurança'],
    category: 'reparos-manutencao',
    experience: '12 anos',
    completedJobs: 521,
    responseTime: '1 hora',
    languages: ['Português'],
    phone: '+55 (71) 96666-6666',
    email: 'carlos.mendes@serviflex.com',
    website: 'www.carloseletricista.com.br',
    
    portfolio: {
      images: [
        {
          url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=600&fit=crop',
          title: 'Instalação Elétrica Residencial',
          description: 'Casa nova com instalação elétrica completa e moderna',
          category: 'Residencial'
        }
      ],
      videos: [
        {
          thumbnail: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop',
          title: 'Instalação de Tomadas e Interruptores',
          duration: '6:30'
        }
      ]
    },

    certifications: [
      {
        name: 'NR-10 - Segurança em Instalações Elétricas',
        institution: 'SENAI',
        year: '2023',
        verified: true
      }
    ],

    stats: {
      totalClients: 124,
      repeatClients: 98,
      averageRating: 4.6,
      onTimeRate: 92,
      satisfactionRate: 93,
      monthlyJobs: 22,
      yearsActive: 12
    },

    about: {
      summary: 'Eletricista experiente com foco em segurança e qualidade.',
      specialties: ['Instalações elétricas residenciais e comerciais', 'Manutenção preventiva e corretiva'],
      approach: 'Priorizo sempre a segurança e a qualidade do serviço.',
      equipment: ['Ferramentas profissionais certificadas', 'EPIs completos para segurança']
    },

    services: [
      {
        name: 'Instalação Elétrica Residencial',
        price: 60,
        duration: '1-2 dias',
        description: 'Instalação elétrica completa seguindo normas técnicas',
        includes: ['Projeto elétrico básico', 'Instalação completa'],
        popular: true
      }
    ],

    testimonials: [
      {
        name: 'Sandra Oliveira',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        rating: 5,
        comment: 'Carlos fez toda a instalação elétrica da minha casa. Trabalho impecável!',
        date: '25/03/2024',
        service: 'Instalação Elétrica Residencial',
        verified: true,
        helpful: 14
      }
    ],

    schedule: {
      monday: { available: true, hours: '08:00-17:00' },
      tuesday: { available: true, hours: '08:00-17:00' },
      wednesday: { available: true, hours: '08:00-17:00' },
      thursday: { available: true, hours: '08:00-17:00' },
      friday: { available: true, hours: '08:00-17:00' },
      saturday: { available: true, hours: '08:00-14:00' },
      sunday: { available: false, hours: 'Indisponível' }
    },

    policies: {
      cancellation: '24 horas de antecedência',
      payment: 'PIX, cartão ou dinheiro',
      guarantee: '6 meses de garantia',
      insurance: 'Seguro contra danos incluído'
    }
  },

  // MARKETING E VENDAS
  '5': {
    id: '5',
    name: 'Juliana Lima',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=800&fit=crop',
    rating: 4.8,
    reviews: 167,
    location: 'Curitiba, PR',
    price: 85,
    verified: true,
    premium: true,
    online: true,
    serviceType: 'Marketing Digital e Redes Sociais',
    title: 'Especialista em Marketing Digital',
    description: 'Especialista em marketing digital com foco em redes sociais, Google Ads e estratégias de crescimento online.',
    availability: 'Todos os dias',
    workingHours: '09:00 - 19:00',
    skills: ['Instagram', 'Facebook Ads', 'Google Ads', 'SEO', 'Copywriting'],
    category: 'marketing-vendas',
    experience: '6 anos',
    completedJobs: 367,
    responseTime: '1 hora',
    languages: ['Português', 'Inglês', 'Espanhol'],
    phone: '+55 (41) 95555-5555',
    email: 'juliana.lima@serviflex.com',
    website: 'www.julianamarketing.com.br',
    
    portfolio: {
      images: [
        {
          url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop',
          title: 'Campanha Instagram',
          description: 'Campanha que aumentou seguidores em 300% em 3 meses',
          category: 'Social Media'
        }
      ],
      videos: [
        {
          thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop',
          title: 'Como Crescer no Instagram',
          duration: '8:45'
        }
      ]
    },

    certifications: [
      {
        name: 'Google Ads Certified',
        institution: 'Google',
        year: '2023',
        verified: true
      }
    ],

    stats: {
      totalClients: 167,
      repeatClients: 134,
      averageRating: 4.8,
      onTimeRate: 97,
      satisfactionRate: 96,
      monthlyJobs: 25,
      yearsActive: 6
    },

    about: {
      summary: 'Especialista em marketing digital apaixonada por ajudar empresas a crescerem online.',
      specialties: ['Gestão completa de redes sociais', 'Campanhas de Google Ads e Facebook Ads'],
      approach: 'Trabalho com dados e métricas para garantir que cada estratégia gere resultados reais.',
      equipment: ['Ferramentas profissionais de análise', 'Software de design']
    },

    services: [
      {
        name: 'Gestão de Redes Sociais',
        price: 85,
        duration: 'Mensal',
        description: 'Gestão completa das suas redes sociais',
        includes: ['Planejamento de conteúdo', 'Posts diários'],
        popular: true
      }
    ],

    testimonials: [
      {
        name: 'Pedro Empresário',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        rating: 5,
        comment: 'Juliana transformou nossa presença digital! Vendas aumentaram 200%.',
        date: '28/03/2024',
        service: 'Gestão de Redes Sociais',
        verified: true,
        helpful: 25
      }
    ],

    schedule: {
      monday: { available: true, hours: '09:00-19:00' },
      tuesday: { available: true, hours: '09:00-19:00' },
      wednesday: { available: true, hours: '09:00-19:00' },
      thursday: { available: true, hours: '09:00-19:00' },
      friday: { available: true, hours: '09:00-19:00' },
      saturday: { available: true, hours: '10:00-16:00' },
      sunday: { available: true, hours: '14:00-18:00' }
    },

    policies: {
      cancellation: '48 horas de antecedência',
      payment: 'PIX, cartão ou transferência',
      guarantee: 'Resultados em 30 dias ou reembolso',
      insurance: 'Seguro profissional incluído'
    }
  }
};

// Função para buscar perfil de forma segura
export function getProfessionalProfile(id: string): ProfessionalProfile | null {
  return professionalProfiles[id] || null;
}

// Função para listar todos os IDs disponíveis
export function getAvailableProfessionalIds(): string[] {
  return Object.keys(professionalProfiles);
}

// Função para criar perfil de profissional automaticamente
export function createProfessionalProfile(userData: {
  name: string;
  email: string;
  phone?: string;
  serviceType?: string;
  skills?: string[];
  category?: string;
}): string {
  const newId = Date.now().toString();
  
  const newProfile: ProfessionalProfile = {
    id: newId,
    name: userData.name,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=800&fit=crop',
    rating: 5.0,
    reviews: 0,
    location: 'Brasil',
    price: 50,
    verified: false,
    premium: false,
    online: true,
    serviceType: userData.serviceType || 'Serviços Gerais',
    title: `Profissional em ${userData.serviceType || 'Serviços Gerais'}`,
    description: `Profissional qualificado em ${userData.serviceType || 'diversos serviços'}.`,
    availability: 'Segunda a Sexta',
    workingHours: '09:00 - 18:00',
    skills: userData.skills || ['Atendimento', 'Qualidade', 'Pontualidade'],
    category: userData.category || 'servicos-gerais',
    experience: 'Novo profissional',
    completedJobs: 0,
    responseTime: '1 hora',
    languages: ['Português'],
    phone: userData.phone || '+55 (11) 99999-9999',
    email: userData.email,
    website: `www.${userData.name.toLowerCase().replace(/\s+/g, '')}.serviflex.com`,
    
    portfolio: {
      images: [
        {
          url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
          title: 'Trabalho Profissional',
          description: 'Exemplo de trabalho realizado',
          category: 'Geral'
        }
      ],
      videos: []
    },

    certifications: [
      {
        name: 'Profissional Cadastrado',
        institution: 'ServiFlex',
        year: new Date().getFullYear().toString(),
        verified: true
      }
    ],

    stats: {
      totalClients: 0,
      repeatClients: 0,
      averageRating: 5.0,
      onTimeRate: 100,
      satisfactionRate: 100,
      monthlyJobs: 0,
      yearsActive: 0
    },

    about: {
      summary: `Profissional dedicado em ${userData.serviceType || 'serviços gerais'}.`,
      specialties: userData.skills || ['Atendimento personalizado', 'Qualidade garantida'],
      approach: 'Trabalho com dedicação e foco na satisfação do cliente.',
      equipment: ['Ferramentas profissionais', 'Equipamentos de qualidade']
    },

    services: [
      {
        name: userData.serviceType || 'Serviço Profissional',
        price: 50,
        duration: '1-2 horas',
        description: `Serviço profissional de ${userData.serviceType || 'qualidade'}`,
        includes: ['Atendimento personalizado', 'Garantia de qualidade'],
        popular: true
      }
    ],

    testimonials: [],

    schedule: {
      monday: { available: true, hours: '09:00-18:00' },
      tuesday: { available: true, hours: '09:00-18:00' },
      wednesday: { available: true, hours: '09:00-18:00' },
      thursday: { available: true, hours: '09:00-18:00' },
      friday: { available: true, hours: '09:00-18:00' },
      saturday: { available: false, hours: 'Indisponível' },
      sunday: { available: false, hours: 'Indisponível' }
    },

    policies: {
      cancellation: '24 horas de antecedência',
      payment: 'PIX, cartão ou dinheiro',
      guarantee: 'Satisfação garantida',
      insurance: 'Seguro básico incluído'
    }
  };

  professionalProfiles[newId] = newProfile;
  return newId;
}

// Adicionando mais profissionais para testar filtros
professionalProfiles['6'] = {
  id: '6',
  name: 'Patricia Limpeza',
  image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=800&fit=crop',
  rating: 4.5,
  reviews: 89,
  location: 'São Paulo, SP',
  price: 50,
  verified: true,
  premium: false,
  online: true,
  serviceType: 'Limpeza Básica',
  title: 'Diarista Experiente',
  description: 'Diarista com 5 anos de experiência em limpeza residencial básica.',
  availability: 'Segunda a Sexta',
  workingHours: '08:00 - 16:00',
  skills: ['Limpeza Básica', 'Organização'],
  category: 'limpeza-organizacao',
  experience: '5 anos',
  completedJobs: 156,
  responseTime: '2 horas',
  languages: ['Português'],
  phone: '+55 (11) 98888-7777',
  email: 'patricia.limpeza@serviflex.com',
  website: 'www.patricialimpeza.com.br',
  
  portfolio: {
    images: [
      {
        url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop',
        title: 'Limpeza Básica',
        description: 'Apartamento pequeno - limpeza semanal',
        category: 'Residencial'
      }
    ],
    videos: []
  },

  certifications: [
    {
      name: 'Curso de Limpeza Profissional',
      institution: 'SENAC',
      year: '2022',
      verified: true
    }
  ],

  stats: {
    totalClients: 89,
    repeatClients: 67,
    averageRating: 4.5,
    onTimeRate: 95,
    satisfactionRate: 92,
    monthlyJobs: 20,
    yearsActive: 5
  },

  about: {
    summary: 'Diarista dedicada com foco em qualidade e pontualidade.',
    specialties: ['Limpeza residencial básica', 'Manutenção semanal'],
    approach: 'Trabalho com eficiência e cuidado com os pertences dos clientes.',
    equipment: ['Produtos de limpeza básicos', 'Equipamentos manuais']
  },

  services: [
    {
      name: 'Limpeza Básica',
      price: 50,
      duration: '2-3 horas',
      description: 'Limpeza básica de ambientes residenciais',
      includes: ['Varrer', 'Passar pano', 'Organizar'],
      popular: true
    }
  ],

  testimonials: [
    {
      name: 'Carlos Silva',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      rating: 5,
      comment: 'Ótima profissional! Preço justo e bom trabalho.',
      date: '10/03/2024',
      service: 'Limpeza Básica',
      verified: true,
      helpful: 8
    }
  ],

  schedule: {
    monday: { available: true, hours: '08:00-16:00' },
    tuesday: { available: true, hours: '08:00-16:00' },
    wednesday: { available: true, hours: '08:00-16:00' },
    thursday: { available: true, hours: '08:00-16:00' },
    friday: { available: true, hours: '08:00-16:00' },
    saturday: { available: false, hours: 'Indisponível' },
    sunday: { available: false, hours: 'Indisponível' }
  },

  policies: {
    cancellation: '12 horas de antecedência',
    payment: 'PIX ou dinheiro',
    guarantee: '3 dias de garantia',
    insurance: 'Seguro básico incluído'
  }
};

professionalProfiles['7'] = {
  id: '7',
  name: 'Roberto Tech',
  image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=800&fit=crop',
  rating: 4.2,
  reviews: 45,
  location: 'Rio de Janeiro, RJ',
  price: 200,
  verified: true,
  premium: false,
  online: true,
  serviceType: 'Suporte Técnico Premium',
  title: 'Técnico em TI Sênior',
  description: 'Técnico especializado em suporte avançado e consultoria em TI.',
  availability: 'Todos os dias',
  workingHours: '08:00 - 20:00',
  skills: ['Redes', 'Servidores', 'Segurança', 'Consultoria'],
  category: 'tecnologia-suporte',
  experience: '15 anos',
  completedJobs: 89,
  responseTime: '1 hora',
  languages: ['Português', 'Inglês'],
  phone: '+55 (21) 97777-6666',
  email: 'roberto.tech@serviflex.com',
  website: 'www.robertotech.com.br',
  
  portfolio: {
    images: [
      {
        url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
        title: 'Infraestrutura de Rede',
        description: 'Implementação de rede corporativa completa',
        category: 'Redes'
      }
    ],
    videos: []
  },

  certifications: [
    {
      name: 'CCNA - Cisco Certified Network Associate',
      institution: 'Cisco',
      year: '2023',
      verified: true
    }
  ],

  stats: {
    totalClients: 45,
    repeatClients: 38,
    averageRating: 4.2,
    onTimeRate: 88,
    satisfactionRate: 90,
    monthlyJobs: 8,
    yearsActive: 15
  },

  about: {
    summary: 'Técnico sênior especializado em soluções corporativas de TI.',
    specialties: ['Infraestrutura de rede', 'Segurança da informação'],
    approach: 'Foco em soluções robustas e escaláveis para empresas.',
    equipment: ['Equipamentos de rede profissionais', 'Ferramentas de diagnóstico']
  },

  services: [
    {
      name: 'Consultoria em TI',
      price: 200,
      duration: '2-4 horas',
      description: 'Consultoria especializada em infraestrutura de TI',
      includes: ['Análise completa', 'Relatório técnico', 'Recomendações'],
      popular: true
    }
  ],

  testimonials: [
    {
      name: 'Empresa ABC',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      rating: 4,
      comment: 'Excelente conhecimento técnico, mas preço um pouco alto.',
      date: '05/03/2024',
      service: 'Consultoria em TI',
      verified: true,
      helpful: 5
    }
  ],

  schedule: {
    monday: { available: true, hours: '08:00-20:00' },
    tuesday: { available: true, hours: '08:00-20:00' },
    wednesday: { available: true, hours: '08:00-20:00' },
    thursday: { available: true, hours: '08:00-20:00' },
    friday: { available: true, hours: '08:00-20:00' },
    saturday: { available: true, hours: '09:00-17:00' },
    sunday: { available: true, hours: '10:00-16:00' }
  },

  policies: {
    cancellation: '24 horas de antecedência',
    payment: 'PIX, cartão ou transferência',
    guarantee: '30 dias de garantia',
    insurance: 'Seguro profissional incluído'
  }
};