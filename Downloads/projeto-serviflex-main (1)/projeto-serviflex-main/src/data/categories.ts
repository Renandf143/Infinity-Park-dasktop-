export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  keywords: string[];
  subcategories?: string[];
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'limpeza-organizacao',
    name: 'Limpeza e Organização',
    description: 'Serviços de limpeza residencial, comercial e organização',
    icon: '🧹',
    keywords: ['limpeza', 'diarista', 'organização', 'faxina', 'doméstica', 'arrumação'],
    subcategories: ['Limpeza Residencial', 'Limpeza Comercial', 'Organização', 'Limpeza Pós-Obra']
  },
  {
    id: 'reparos-manutencao',
    name: 'Reparos e Manutenção',
    description: 'Serviços de reparo, manutenção e instalação',
    icon: '🔧',
    keywords: ['eletricista', 'encanador', 'reparo', 'manutenção', 'instalação', 'conserto'],
    subcategories: ['Elétrica', 'Hidráulica', 'Pintura', 'Marcenaria', 'Serralheria']
  },
  {
    id: 'tecnologia-suporte',
    name: 'Tecnologia e Suporte',
    description: 'Desenvolvimento, suporte técnico e serviços digitais',
    icon: '💻',
    keywords: ['desenvolvedor', 'programador', 'tech', 'ti', 'suporte', 'computador'],
    subcategories: ['Desenvolvimento Web', 'Suporte Técnico', 'Design Digital', 'Consultoria TI']
  },
  {
    id: 'design-criacao',
    name: 'Design e Criação',
    description: 'Serviços criativos, design gráfico e marketing visual',
    icon: '🎨',
    keywords: ['design', 'gráfico', 'criativo', 'arte', 'logo', 'identidade'],
    subcategories: ['Design Gráfico', 'Design de Interiores', 'Fotografia', 'Ilustração']
  },
  {
    id: 'marketing-vendas',
    name: 'Marketing e Vendas',
    description: 'Estratégias de marketing, vendas e comunicação',
    icon: '📈',
    keywords: ['marketing', 'vendas', 'publicidade', 'social media', 'comunicação'],
    subcategories: ['Marketing Digital', 'Redes Sociais', 'Vendas', 'Publicidade']
  },
  {
    id: 'educacao-consultoria',
    name: 'Educação e Consultoria',
    description: 'Ensino, treinamento e consultoria especializada',
    icon: '📚',
    keywords: ['professor', 'ensino', 'consultoria', 'treinamento', 'educação'],
    subcategories: ['Aulas Particulares', 'Consultoria', 'Treinamento', 'Coaching']
  },
  {
    id: 'saude-bem-estar',
    name: 'Saúde e Bem-estar',
    description: 'Serviços de saúde, fitness e bem-estar',
    icon: '💪',
    keywords: ['personal', 'fitness', 'saúde', 'massagem', 'terapia', 'bem-estar'],
    subcategories: ['Personal Trainer', 'Massoterapia', 'Nutrição', 'Terapias']
  },
  {
    id: 'beleza-estetica',
    name: 'Beleza e Estética',
    description: 'Serviços de beleza, estética e cuidados pessoais',
    icon: '💄',
    keywords: ['cabelo', 'maquiagem', 'estética', 'beleza', 'manicure', 'pedicure'],
    subcategories: ['Cabeleireiro', 'Maquiagem', 'Manicure', 'Estética Facial']
  },
  {
    id: 'servicos-gerais',
    name: 'Serviços Gerais',
    description: 'Outros serviços profissionais diversos',
    icon: '⚙️',
    keywords: ['geral', 'diversos', 'outros', 'variados'],
    subcategories: ['Diversos']
  }
];

// Função para detectar categoria automaticamente
export function detectCategoryFromProfession(profession: string): string {
  const professionLower = profession.toLowerCase();
  
  for (const category of serviceCategories) {
    for (const keyword of category.keywords) {
      if (professionLower.includes(keyword)) {
        return category.id;
      }
    }
  }
  
  return 'servicos-gerais';
}

// Função para obter categoria por ID
export function getCategoryById(id: string): ServiceCategory | undefined {
  return serviceCategories.find(cat => cat.id === id);
}

// Função para obter todas as categorias
export function getAllCategories(): ServiceCategory[] {
  return serviceCategories;
}