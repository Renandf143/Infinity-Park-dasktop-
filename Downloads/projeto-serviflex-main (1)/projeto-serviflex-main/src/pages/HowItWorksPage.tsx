import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { SearchIcon, UserCheckIcon, CalendarCheckIcon, StarIcon, ShieldCheckIcon, CreditCardIcon, MessageCircleIcon, TrendingUpIcon } from 'lucide-react';
export function HowItWorksPage() {
  const steps = [{
    icon: SearchIcon,
    number: '01',
    title: 'Busque o Serviço',
    description: 'Encontre o profissional ideal navegando por categorias ou usando nossa busca inteligente',
    details: ['Navegue por mais de 50 categorias de serviços', 'Use filtros avançados para refinar sua busca', 'Compare perfis e avaliações de profissionais', 'Veja portfolios e trabalhos anteriores']
  }, {
    icon: UserCheckIcon,
    number: '02',
    title: 'Escolha o Profissional',
    description: 'Compare perfis, avaliações e preços para tomar a melhor decisão',
    details: ['Veja avaliações reais de outros clientes', 'Compare preços e condições de pagamento', 'Verifique disponibilidade em tempo real', 'Leia sobre a experiência do profissional']
  }, {
    icon: CalendarCheckIcon,
    number: '03',
    title: 'Agende o Serviço',
    description: 'Combine data, horário e detalhes diretamente com o prestador',
    details: ['Escolha data e horário convenientes', 'Defina o local de atendimento', 'Especifique detalhes do serviço', 'Receba confirmação instantânea']
  }, {
    icon: StarIcon,
    number: '04',
    title: 'Avalie a Experiência',
    description: 'Após o serviço, deixe sua avaliação e ajude outros clientes',
    details: ['Avalie a qualidade do serviço', 'Deixe comentários detalhados', 'Ajude outros clientes a decidir', 'Contribua para a comunidade']
  }];
  const features = [{
    icon: ShieldCheckIcon,
    title: 'Segurança Garantida',
    description: 'Todos os profissionais são verificados e possuem documentação validada'
  }, {
    icon: CreditCardIcon,
    title: 'Pagamento Protegido',
    description: 'Sistema seguro de pagamento com diversas opções e garantia de reembolso'
  }, {
    icon: MessageCircleIcon,
    title: 'Suporte 24/7',
    description: 'Equipe dedicada para auxiliar em qualquer momento do processo'
  }, {
    icon: TrendingUpIcon,
    title: 'Satisfação Garantida',
    description: 'Se não ficar satisfeito, trabalhamos para resolver ou devolvemos seu dinheiro'
  }];
  const benefits = {
    clients: ['Acesso a milhares de profissionais qualificados', 'Comparação fácil de preços e avaliações', 'Agendamento online rápido e seguro', 'Pagamento protegido pela plataforma', 'Suporte dedicado durante todo o processo', 'Garantia de satisfação ou reembolso'],
    professionals: ['Visibilidade para milhares de clientes', 'Agenda digital integrada', 'Recebimento garantido e rápido', 'Ferramentas de gestão profissional', 'Marketing e divulgação gratuitos', 'Comunidade de profissionais para networking']
  };
  return <div className="w-full min-h-screen bg-white">
      <Header />
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-br from-[#2563EB] to-[#1E40AF] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Como Funciona
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Em apenas 4 passos simples você encontra e contrata o profissional
            perfeito
          </p>
        </div>
      </div>
      {/* Steps Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-20">
          {steps.map((step, index) => <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}>
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute -top-4 -left-4 w-20 h-20 bg-[#2563EB]/10 rounded-full"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-br from-[#2563EB] to-[#1E40AF] rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-6xl font-bold text-[#2563EB]/20">
                    {step.number}
                  </span>
                  <h2 className="text-3xl font-bold text-[#1E293B]">
                    {step.title}
                  </h2>
                </div>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {step.description}
                </p>
                <ul className="space-y-3">
                  {step.details.map((detail, idx) => <li key={idx} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-[#2563EB]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 bg-[#2563EB] rounded-full"></div>
                      </div>
                      <span className="text-gray-700">{detail}</span>
                    </li>)}
                </ul>
              </div>
              <div className="flex-1">
                <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl border-2 border-gray-100 shadow-xl">
                  <img src={`https://images.unsplash.com/photo-${index === 0 ? '1551434678-e512fa0a9e3e' : index === 1 ? '1522071820081-009f0129c71c' : index === 2 ? '1542744173-8e7e53415bb0' : '1556742502-ec7c0e9f34b1'}?w=600&h=400&fit=crop`} alt={step.title} className="w-full h-64 object-cover rounded-2xl" />
                </div>
              </div>
            </div>)}
        </div>
      </div>
      {/* Features Section */}
      <div className="w-full bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-[#2563EB]/10 rounded-full mb-4">
              <span className="text-[#2563EB] font-semibold text-sm">
                DIFERENCIAIS
              </span>
            </div>
            <h2 className="text-4xl font-bold text-[#1E293B] mb-4">
              Por Que Escolher o Serviflix?
            </h2>
            <p className="text-lg text-gray-600">
              Garantimos a melhor experiência para clientes e profissionais
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => <div key={index} className="bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-[#2563EB] hover:shadow-xl transition-all group">
                <div className="w-14 h-14 bg-gradient-to-br from-[#2563EB] to-[#1E40AF] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#1E293B] mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>)}
          </div>
        </div>
      </div>
      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-gradient-to-br from-[#2563EB] to-[#1E40AF] rounded-3xl p-8 text-white">
            <h3 className="text-3xl font-bold mb-6">Para Clientes</h3>
            <ul className="space-y-4">
              {benefits.clients.map((benefit, index) => <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-white/90">{benefit}</span>
                </li>)}
            </ul>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white">
            <h3 className="text-3xl font-bold mb-6">Para Profissionais</h3>
            <ul className="space-y-4">
              {benefits.professionals.map((benefit, index) => <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-white/90">{benefit}</span>
                </li>)}
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>;
}