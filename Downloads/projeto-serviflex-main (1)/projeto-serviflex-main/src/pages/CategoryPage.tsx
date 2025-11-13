import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { FilterSidebar } from '../components/FilterSidebar';
import { ProfessionalCard } from '../components/ProfessionalCard';
import { ArrowLeftIcon, SlidersHorizontalIcon } from 'lucide-react';
import { professionalService, ProfessionalProfile as Professional } from '../services/professionalService';
const categoryData = {
  'limpeza-organizacao': {
    name: 'Limpeza e Organização',
    description: 'Profissionais especializados em limpeza residencial, comercial e organização de ambientes',
    professionals: [{
      id: 1,
      name: 'Maria Santos',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      rating: 4.9,
      reviews: 156,
      location: 'São Paulo, SP',
      price: 80,
      verified: true,
      serviceType: 'Limpeza Residencial Completa',
      description: 'Especialista em limpeza profunda de residências, com 8 anos de experiência. Utilizo produtos ecológicos e equipamentos modernos.',
      availability: 'Segunda a Sábado',
      skills: ['Limpeza Profunda', 'Organização', 'Produtos Ecológicos']
    }, {
      id: 2,
      name: 'João Silva',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      rating: 5.0,
      reviews: 203,
      location: 'Rio de Janeiro, RJ',
      price: 120,
      verified: true,
      serviceType: 'Limpeza Comercial',
      description: 'Equipe especializada em limpeza de escritórios e estabelecimentos comerciais. Atendimento 24h.',
      availability: 'Todos os dias',
      skills: ['Limpeza Comercial', 'Pós-Obra', 'Higienização']
    }, {
      id: 3,
      name: 'Ana Costa',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
      rating: 4.8,
      reviews: 89,
      location: 'Belo Horizonte, MG',
      price: 90,
      verified: true,
      serviceType: 'Personal Organizer',
      description: 'Organização profissional de ambientes, guarda-roupas e espaços corporativos.',
      availability: 'Segunda a Sexta',
      skills: ['Organização', 'Decoração', 'Consultoria']
    }]
  },
  'reparos-manutencao': {
    name: 'Reparos e Manutenção',
    description: 'Profissionais qualificados em reparos elétricos, hidráulicos e manutenção geral',
    professionals: [{
      id: 4,
      name: 'Carlos Ferreira',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      rating: 4.9,
      reviews: 178,
      location: 'São Paulo, SP',
      price: 150,
      verified: true,
      serviceType: 'Eletricista Profissional',
      description: 'Eletricista com 15 anos de experiência. Instalações, manutenções e reparos elétricos residenciais e comerciais.',
      availability: 'Segunda a Sábado',
      skills: ['Instalação Elétrica', 'Manutenção', 'Emergências']
    }, {
      id: 5,
      name: 'Roberto Lima',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
      rating: 5.0,
      reviews: 145,
      location: 'Curitiba, PR',
      price: 130,
      verified: true,
      serviceType: 'Encanador Especializado',
      description: 'Serviços hidráulicos completos: vazamentos, entupimentos, instalações e reformas.',
      availability: 'Todos os dias',
      skills: ['Hidráulica', 'Desentupimento', 'Instalações']
    }]
  },
  'beleza-estetica': {
    name: 'Beleza e Estética',
    description: 'Profissionais de beleza, estética e cuidados pessoais',
    professionals: [{
      id: 6,
      name: 'Juliana Alves',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
      rating: 4.9,
      reviews: 234,
      location: 'São Paulo, SP',
      price: 100,
      verified: true,
      serviceType: 'Cabeleireira Profissional',
      description: 'Especialista em cortes, coloração e tratamentos capilares. Atendimento domiciliar disponível.',
      availability: 'Terça a Sábado',
      skills: ['Corte', 'Coloração', 'Tratamentos']
    }, {
      id: 7,
      name: 'Beatriz Santos',
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop',
      rating: 5.0,
      reviews: 189,
      location: 'Rio de Janeiro, RJ',
      price: 120,
      verified: true,
      serviceType: 'Esteticista',
      description: 'Tratamentos faciais, corporais e design de sobrancelhas. Produtos de alta qualidade.',
      availability: 'Segunda a Sexta',
      skills: ['Estética Facial', 'Design de Sobrancelhas', 'Massagem']
    }]
  },
  'saude-bem-estar': {
    name: 'Saúde e Bem-estar',
    description: 'Profissionais de saúde, fitness e bem-estar',
    professionals: [{
      id: 8,
      name: 'Dr. Pedro Oliveira',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
      rating: 5.0,
      reviews: 167,
      location: 'Brasília, DF',
      price: 200,
      verified: true,
      serviceType: 'Fisioterapeuta',
      description: 'Fisioterapia ortopédica e esportiva. Atendimento domiciliar e em clínica.',
      availability: 'Segunda a Sexta',
      skills: ['Fisioterapia', 'RPG', 'Pilates']
    }]
  },
  'aulas-treinamentos': {
    name: 'Aulas e Treinamentos',
    description: 'Professores particulares e personal trainers',
    professionals: [{
      id: 9,
      name: 'Lucas Martins',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      rating: 4.8,
      reviews: 142,
      location: 'São Paulo, SP',
      price: 150,
      verified: true,
      serviceType: 'Personal Trainer',
      description: 'Personal trainer com foco em emagrecimento e ganho de massa muscular. Treinos personalizados.',
      availability: 'Segunda a Sábado',
      skills: ['Musculação', 'HIIT', 'Funcional']
    }]
  },
  'eventos-festas': {
    name: 'Eventos e Festas',
    description: 'Profissionais para organização de eventos e festas',
    professionals: [{
      id: 10,
      name: 'Mariana Costa',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      rating: 4.9,
      reviews: 198,
      location: 'Rio de Janeiro, RJ',
      price: 300,
      verified: true,
      serviceType: 'Organizadora de Eventos',
      description: 'Planejamento completo de eventos corporativos e sociais. Decoração e coordenação.',
      availability: 'Todos os dias',
      skills: ['Planejamento', 'Decoração', 'Coordenação']
    }]
  },
  'transporte-mudancas': {
    name: 'Transporte e Mudanças',
    description: 'Serviços de transporte, mudanças e fretes',
    professionals: [{
      id: 11,
      name: 'Fernando Silva',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
      rating: 4.7,
      reviews: 134,
      location: 'São Paulo, SP',
      price: 250,
      verified: true,
      serviceType: 'Mudanças Residenciais',
      description: 'Serviço completo de mudanças com equipe treinada e caminhões equipados.',
      availability: 'Todos os dias',
      skills: ['Mudanças', 'Embalagem', 'Montagem']
    }]
  },
  'tecnologia-suporte': {
    name: 'Tecnologia e Suporte',
    description: 'Suporte técnico e serviços de TI',
    professionals: [{
      id: 12,
      name: 'Rafael Costa',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      rating: 5.0,
      reviews: 176,
      location: 'São Paulo, SP',
      price: 180,
      verified: true,
      serviceType: 'Técnico em Informática',
      description: 'Manutenção de computadores, notebooks e redes. Atendimento rápido e eficiente.',
      availability: 'Segunda a Sábado',
      skills: ['Manutenção', 'Redes', 'Software']
    }]
  }
};
export function CategoryPage() {
  const {
    categorySlug
  } = useParams<{
    categorySlug: string;
  }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    priceRange: [0, 500],
    minRating: 0,
    location: '',
    availability: ''
  });
  const categoryNames: Record<string, string> = {
    'limpeza-organizacao': 'Limpeza e Organização',
    'reparos-manutencao': 'Reparos e Manutenção',
    'beleza-estetica': 'Beleza e Estética',
    'saude-bem-estar': 'Saúde e Bem-estar',
    'aulas-treinamentos': 'Aulas e Treinamentos',
    'eventos-festas': 'Eventos e Festas',
    'transporte-mudancas': 'Transporte e Mudanças',
    'tecnologia-suporte': 'Tecnologia e Suporte'
  };
  const categoryDescriptions: Record<string, string> = {
    'limpeza-organizacao': 'Profissionais especializados em limpeza residencial, comercial e organização de ambientes',
    'reparos-manutencao': 'Profissionais qualificados em reparos elétricos, hidráulicos e manutenção geral',
    'beleza-estetica': 'Profissionais de beleza, estética e cuidados pessoais',
    'saude-bem-estar': 'Profissionais de saúde, fitness e bem-estar',
    'aulas-treinamentos': 'Professores particulares e personal trainers',
    'eventos-festas': 'Profissionais para organização de eventos e festas',
    'transporte-mudancas': 'Serviços de transporte, mudanças e fretes',
    'tecnologia-suporte': 'Suporte técnico e serviços de TI'
  };
  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        setLoading(true);
        const searchQuery = searchParams.get('search') || '';
        const data = await professionalService.searchProfessionals({
          category: categorySlug,
          minRating: filters.minRating,
          maxPrice: filters.priceRange[1],
          location: filters.location,
          availability: filters.availability,
          search: searchQuery
        });
        setProfessionals(data);
      } catch (error) {
        console.error('Error loading professionals:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfessionals();
  }, [categorySlug, filters, searchParams]);
  const categoryName = categorySlug ? categoryNames[categorySlug] : null;
  const categoryDescription = categorySlug ? categoryDescriptions[categorySlug] : null;
  if (!categoryName) {
    return <div className="w-full min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Categoria não encontrada
          </h1>
          <button onClick={() => navigate('/')} className="px-6 py-3 bg-[#2563EB] text-white rounded-lg hover:bg-[#1E40AF] transition-colors">
            Voltar para Início
          </button>
        </div>
        <Footer />
      </div>;
  }
  return <div className="w-full min-h-screen bg-gray-50">
      <Header />
      {/* Category Header */}
      <div className="w-full bg-gradient-to-br from-[#2563EB] to-[#1E40AF] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors">
            <ArrowLeftIcon className="w-5 h-5" />
            Voltar
          </button>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {categoryName}
          </h1>
          <p className="text-xl text-white/90 max-w-3xl">
            {categoryDescription}
          </p>
          <div className="mt-6 flex items-center gap-4 text-white/90">
            <span className="font-semibold">
              {loading ? 'Carregando...' : `${professionals.length} profissionais encontrados`}
            </span>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-8">
          {/* Mobile Filter Toggle */}
          <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden fixed bottom-6 right-6 z-40 p-4 bg-[#2563EB] text-white rounded-full shadow-2xl hover:bg-[#1E40AF] transition-all">
            <SlidersHorizontalIcon className="w-6 h-6" />
          </button>
          {/* Filters Sidebar */}
          <div className={`
            ${showFilters ? 'fixed inset-0 z-50 bg-black/50 lg:relative lg:bg-transparent' : 'hidden lg:block'}
          `}>
            <div className={`
              ${showFilters ? 'fixed right-0 top-0 h-full w-80 bg-white shadow-2xl overflow-y-auto' : ''}
              lg:sticky lg:top-24 lg:w-80
            `}>
              <FilterSidebar filters={filters} setFilters={setFilters} onClose={() => setShowFilters(false)} showCloseButton={showFilters} />
            </div>
          </div>
          {/* Professionals Grid */}
          <div className="flex-1">
            {loading ? <div className="text-center py-20">
                <p className="text-xl text-gray-600">
                  Carregando profissionais...
                </p>
              </div> : professionals.length === 0 ? <div className="text-center py-20">
                <p className="text-xl text-gray-600 mb-4">
                  Nenhum profissional encontrado com os filtros selecionados
                </p>
                <button onClick={() => setFilters({
              priceRange: [0, 500],
              minRating: 0,
              location: '',
              availability: ''
            })} className="px-6 py-3 bg-[#2563EB] text-white rounded-lg hover:bg-[#1E40AF] transition-colors">
                  Limpar Filtros
                </button>
              </div> : <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {professionals.map(professional => <ProfessionalCard key={professional.id} professional={professional} />)}
              </div>}
          </div>
        </div>
      </div>
      <Footer />
    </div>;
}