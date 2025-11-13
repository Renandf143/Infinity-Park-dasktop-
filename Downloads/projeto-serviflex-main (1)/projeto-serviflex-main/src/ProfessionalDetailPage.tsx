import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ChatModal } from '../components/ChatModal';
import { BookingModal } from '../components/BookingModal';
import { StarIcon, BadgeCheckIcon, MapPinIcon, CalendarIcon, ClockIcon, AwardIcon, MessageCircleIcon, ArrowLeftIcon, CheckCircleIcon, BriefcaseIcon, PlayCircleIcon, FileTextIcon, TrendingUpIcon, UsersIcon, ShieldCheckIcon } from 'lucide-react';
const professionalData = {
  '1': {
    id: 1,
    name: 'Maria Santos',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=800&fit=crop',
    rating: 4.9,
    reviews: 156,
    location: 'São Paulo, SP',
    price: 80,
    verified: true,
    serviceType: 'Limpeza Residencial Completa',
    description: 'Especialista em limpeza profunda de residências, com 8 anos de experiência. Utilizo produtos ecológicos e equipamentos modernos para garantir a melhor qualidade.',
    availability: 'Segunda a Sábado',
    skills: ['Limpeza Profunda', 'Organização', 'Produtos Ecológicos', 'Higienização'],
    experience: '8 anos',
    completedJobs: 342,
    responseTime: '1 hora',
    languages: ['Português', 'Espanhol'],
    portfolio: [{
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop',
      title: 'Limpeza Residencial Completa',
      description: 'Casa de 3 quartos - São Paulo',
      beforeImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      category: 'Residencial'
    }, {
      image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800&h=600&fit=crop',
      title: 'Organização de Closet',
      description: 'Closet de 15m² - Jardins',
      beforeImage: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&h=600&fit=crop',
      category: 'Organização'
    }, {
      image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&h=600&fit=crop',
      title: 'Limpeza Pós-Obra',
      description: 'Apartamento 120m² - Moema',
      beforeImage: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=800&h=600&fit=crop',
      category: 'Pós-Obra'
    }, {
      image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop',
      title: 'Higienização de Estofados',
      description: 'Sofá e poltronas - Vila Mariana',
      beforeImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop',
      category: 'Higienização'
    }, {
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop',
      title: 'Limpeza de Cozinha Profissional',
      description: 'Restaurante - Pinheiros',
      beforeImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
      category: 'Comercial'
    }, {
      image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop',
      title: 'Organização de Escritório',
      description: 'Home office - Brooklin',
      beforeImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
      category: 'Comercial'
    }],
    certifications: [{
      name: 'Técnicas Avançadas de Limpeza',
      institution: 'SENAI',
      year: '2022',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop'
    }, {
      name: 'Produtos Ecológicos e Sustentabilidade',
      institution: 'Green Clean Academy',
      year: '2023',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=300&fit=crop'
    }, {
      name: 'Organização Profissional',
      institution: 'Instituto Marie Kondo',
      year: '2021',
      image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=300&fit=crop'
    }],
    videoIntro: 'https://www.youtube.com/embed/dQw4w9WgXcQ?si=example',
    about: 'Profissional dedicada com foco em excelência e satisfação do cliente. Trabalho com produtos de alta qualidade e equipamentos modernos. Meu objetivo é transformar cada ambiente em um espaço limpo, organizado e acolhedor. Acredito que um ambiente limpo reflete diretamente na qualidade de vida e bem-estar das pessoas.',
    services: [{
      name: 'Limpeza Residencial Completa',
      price: 80,
      duration: '3-4 horas',
      description: 'Limpeza completa de todos os ambientes, incluindo banheiros, cozinha, quartos e áreas comuns.'
    }, {
      name: 'Limpeza Profunda',
      price: 120,
      duration: '5-6 horas',
      description: 'Limpeza detalhada com foco em áreas difíceis, incluindo janelas, azulejos e cantos.'
    }, {
      name: 'Organização de Ambientes',
      price: 100,
      duration: '4 horas',
      description: 'Organização de closets, armários, despensas e outros espaços.'
    }],
    testimonials: [{
      name: 'Ana Silva',
      rating: 5,
      comment: 'Excelente profissional! Minha casa ficou impecável. Super recomendo!',
      date: '15/03/2024',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
    }, {
      name: 'Carlos Mendes',
      rating: 5,
      comment: 'Pontual, eficiente e muito cuidadosa. Voltarei a contratar com certeza.',
      date: '10/03/2024',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
    }, {
      name: 'Juliana Costa',
      rating: 5,
      comment: 'Superou todas as expectativas! Profissionalismo e qualidade excepcionais.',
      date: '05/03/2024',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
    }],
    achievements: [{
      icon: TrendingUpIcon,
      value: '98%',
      label: 'Taxa de Satisfação'
    }, {
      icon: UsersIcon,
      value: '342',
      label: 'Clientes Atendidos'
    }, {
      icon: ShieldCheckIcon,
      value: '100%',
      label: 'Serviços Garantidos'
    }]
  }
};
export function ProfessionalDetailPage() {
  const {
    professionalId
  } = useParams<{
    professionalId: string;
  }>();
  const navigate = useNavigate();
  const [showChat, setShowChat] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedPortfolio, setSelectedPortfolio] = useState<number | null>(null);
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const professional = professionalId ? professionalData[professionalId as keyof typeof professionalData] : null;
  if (!professional) {
    return <div className="w-full min-h-screen bg-white">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Profissional não encontrado
          </h1>
          <button onClick={() => navigate('/')} className="px-6 py-3 bg-[#0A2240] text-white rounded-lg hover:bg-[#509BF5] transition-colors">
            Voltar para Início
          </button>
        </div>
        <Footer />
      </div>;
  }
  const categories = ['Todos', ...Array.from(new Set(professional.portfolio.map(p => p.category)))];
  const filteredPortfolio = selectedCategory === 'Todos' ? professional.portfolio : professional.portfolio.filter(p => p.category === selectedCategory);
  return <div className="w-full min-h-screen bg-[#F5F5F5]">
      <Header />
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-br from-[#0A2240] to-[#509BF5] py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors">
            <ArrowLeftIcon className="w-5 h-5" />
            Voltar
          </button>
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="relative flex-shrink-0">
              <img src={professional.image} alt={professional.name} className="w-32 h-32 rounded-2xl object-cover ring-4 ring-white/20" />
              {professional.verified && <div className="absolute -bottom-2 -right-2 bg-[#D97941] rounded-full p-2">
                  <BadgeCheckIcon className="w-6 h-6 text-white" />
                </div>}
            </div>
            <div className="flex-1 text-white">
              <h1 className="text-4xl font-bold mb-2">{professional.name}</h1>
              <p className="text-xl text-white/90 mb-4">
                {professional.serviceType}
              </p>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <StarIcon className="w-5 h-5 fill-white text-white" />
                  <span className="font-semibold">{professional.rating}</span>
                  <span className="text-white/80">
                    ({professional.reviews})
                  </span>
                </div>
                <div className="flex items-center gap-1 text-white/90">
                  <MapPinIcon className="w-4 h-4" />
                  {professional.location}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Achievements */}
            <div className="grid grid-cols-3 gap-4">
              {professional.achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return <div key={index} className="bg-white p-6 rounded-xl text-center border border-gray-200">
                    <Icon className="w-8 h-8 text-[#509BF5] mx-auto mb-3" />
                    <p className="text-3xl font-bold text-[#0A2240] mb-1">
                      {achievement.value}
                    </p>
                    <p className="text-sm text-gray-600">{achievement.label}</p>
                  </div>;
            })}
            </div>
            {/* Video Introduction */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-[#0A2240] mb-4 flex items-center gap-2">
                <PlayCircleIcon className="w-6 h-6 text-[#509BF5]" />
                Apresentação em Vídeo
              </h2>
              <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
                <iframe width="100%" height="100%" src={professional.videoIntro} title="Apresentação do Profissional" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full"></iframe>
              </div>
            </div>
            {/* About */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-[#0A2240] mb-4">Sobre</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                {professional.about}
              </p>
              <div className="flex flex-wrap gap-2">
                {professional.skills.map((skill, index) => <span key={index} className="px-4 py-2 bg-[#509BF5]/10 text-[#0A2240] rounded-full text-sm font-medium">
                    {skill}
                  </span>)}
              </div>
            </div>
            {/* Portfolio - Enhanced */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#0A2240]">
                  Portfólio de Trabalhos
                </h2>
                <span className="text-sm text-gray-600">
                  {filteredPortfolio.length} projetos
                </span>
              </div>
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map(category => <button key={category} onClick={() => setSelectedCategory(category)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category ? 'bg-[#509BF5] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    {category}
                  </button>)}
              </div>
              {/* Portfolio Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPortfolio.map((item, index) => <div key={index} onClick={() => setSelectedPortfolio(index)} className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-xl mb-3">
                      <img src={item.image} alt={item.title} className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <button onClick={e => {
                      e.stopPropagation();
                      setShowBeforeAfter(!showBeforeAfter);
                    }} className="px-4 py-2 bg-white text-[#0A2240] rounded-lg text-sm font-semibold">
                          Ver Antes/Depois
                        </button>
                      </div>
                      <div className="absolute top-3 right-3 px-3 py-1 bg-[#D97941] text-white rounded-full text-xs font-semibold">
                        {item.category}
                      </div>
                    </div>
                    <h3 className="font-bold text-[#0A2240] mb-1 group-hover:text-[#509BF5] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>)}
              </div>
              {/* Before/After Modal */}
              {showBeforeAfter && selectedPortfolio !== null && <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowBeforeAfter(false)}>
                  <div className="bg-white rounded-2xl p-6 max-w-4xl w-full" onClick={e => e.stopPropagation()}>
                    <h3 className="text-2xl font-bold text-[#0A2240] mb-6">
                      Antes e Depois
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm font-semibold text-gray-600 mb-2">
                          ANTES
                        </p>
                        <img src={filteredPortfolio[selectedPortfolio].beforeImage} alt="Antes" className="w-full h-80 object-cover rounded-xl" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600 mb-2">
                          DEPOIS
                        </p>
                        <img src={filteredPortfolio[selectedPortfolio].image} alt="Depois" className="w-full h-80 object-cover rounded-xl" />
                      </div>
                    </div>
                    <button onClick={() => setShowBeforeAfter(false)} className="mt-6 w-full py-3 bg-[#0A2240] text-white rounded-xl font-semibold hover:bg-[#509BF5] transition-colors">
                      Fechar
                    </button>
                  </div>
                </div>}
            </div>
            {/* Certifications */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-[#0A2240] mb-6 flex items-center gap-2">
                <AwardIcon className="w-6 h-6 text-[#D97941]" />
                Certificações e Cursos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {professional.certifications.map((cert, index) => <div key={index} className="border border-gray-200 rounded-xl overflow-hidden hover:border-[#509BF5] transition-all group">
                    <img src={cert.image} alt={cert.name} className="w-full h-32 object-cover group-hover:scale-105 transition-transform" />
                    <div className="p-4">
                      <h3 className="font-bold text-[#0A2240] text-sm mb-1">
                        {cert.name}
                      </h3>
                      <p className="text-xs text-gray-600 mb-1">
                        {cert.institution}
                      </p>
                      <p className="text-xs text-[#509BF5] font-semibold">
                        {cert.year}
                      </p>
                    </div>
                  </div>)}
              </div>
            </div>
            {/* Services */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-[#0A2240] mb-6">
                Serviços Oferecidos
              </h2>
              <div className="space-y-4">
                {professional.services.map((service, index) => <div key={index} onClick={() => setSelectedService(index)} className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${selectedService === index ? 'border-[#509BF5] bg-[#509BF5]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-[#0A2240] text-lg mb-2">
                          {service.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {service.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          Duração: {service.duration}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-[#0A2240]">
                          R$ {service.price}
                        </p>
                        <p className="text-sm text-gray-500">por serviço</p>
                      </div>
                    </div>
                  </div>)}
              </div>
            </div>
            {/* Testimonials */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-[#0A2240] mb-6">
                Avaliações dos Clientes
              </h2>
              <div className="space-y-6">
                {professional.testimonials.map((testimonial, index) => <div key={index} className="border-b border-gray-100 pb-6 last:border-0">
                    <div className="flex items-start gap-4">
                      <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-bold text-[#0A2240]">
                              {testimonial.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {testimonial.date}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(testimonial.rating)].map((_, i) => <StarIcon key={i} className="w-4 h-4 fill-[#D97941] text-[#D97941]" />)}
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {testimonial.comment}
                        </p>
                      </div>
                    </div>
                  </div>)}
              </div>
            </div>
          </div>
          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white p-6 rounded-xl border border-gray-200">
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-1">A partir de</p>
                <p className="text-4xl font-bold text-[#0A2240]">
                  R$ {professional.price}
                  <span className="text-lg text-gray-500 font-normal">
                    /hora
                  </span>
                </p>
              </div>
              <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 text-gray-700">
                  <CalendarIcon className="w-5 h-5 text-[#509BF5]" />
                  <span className="text-sm">{professional.availability}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <ClockIcon className="w-5 h-5 text-[#509BF5]" />
                  <span className="text-sm">
                    Responde em {professional.responseTime}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <BriefcaseIcon className="w-5 h-5 text-[#509BF5]" />
                  <span className="text-sm">{professional.experience}</span>
                </div>
              </div>
              <button onClick={() => setShowBooking(true)} className="w-full py-4 bg-[#509BF5] text-white rounded-xl font-semibold hover:bg-[#0A2240] transition-all mb-3 shadow-lg">
                Contratar Agora
              </button>
              <button onClick={() => setShowChat(true)} className="w-full py-4 border-2 border-[#509BF5] text-[#509BF5] rounded-xl font-semibold hover:bg-[#509BF5] hover:text-white transition-all flex items-center justify-center gap-2">
                <MessageCircleIcon className="w-5 h-5" />
                Enviar Mensagem
              </button>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <ShieldCheckIcon className="w-5 h-5 text-[#D97941]" />
                  <span>Pagamento 100% seguro</span>
                </div>
                <p className="text-xs text-gray-500">
                  Seu pagamento é protegido até a conclusão do serviço
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {showChat && <ChatModal professional={professional} onClose={() => setShowChat(false)} />}
      {showBooking && <BookingModal professional={professional} onClose={() => setShowBooking(false)} />}
    </div>;
}