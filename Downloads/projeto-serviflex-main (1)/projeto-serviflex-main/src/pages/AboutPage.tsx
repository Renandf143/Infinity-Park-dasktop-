import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ShieldCheckIcon, UsersIcon, TrendingUpIcon, HeartIcon, AwardIcon, TargetIcon, ZapIcon, GlobeIcon } from 'lucide-react';
export function AboutPage() {
  const values = [{
    icon: ShieldCheckIcon,
    title: 'Segurança',
    description: 'Profissionais verificados e avaliados pela comunidade'
  }, {
    icon: HeartIcon,
    title: 'Compromisso',
    description: 'Dedicação em conectar pessoas aos melhores profissionais'
  }, {
    icon: TrendingUpIcon,
    title: 'Inovação',
    description: 'Tecnologia de ponta para facilitar sua experiência'
  }, {
    icon: UsersIcon,
    title: 'Comunidade',
    description: 'Rede colaborativa de profissionais e clientes'
  }];
  const achievements = [{
    icon: AwardIcon,
    number: '50K+',
    label: 'Profissionais Cadastrados'
  }, {
    icon: UsersIcon,
    number: '200K+',
    label: 'Serviços Realizados'
  }, {
    icon: GlobeIcon,
    number: '500+',
    label: 'Cidades Atendidas'
  }, {
    icon: ZapIcon,
    number: '4.8★',
    label: 'Avaliação Média'
  }];
  const team = [{
    name: 'Renan Gomes Lobo',
    role: 'CEO',
    description: 'Visionário com 15 anos de experiência em tecnologia e marketplace'
  }, {
    name: 'João Gabriel',
    role: 'COO',
    description: 'Expert em gestão de operações e relacionamento com profissionais'
  }, {
    name: 'Leandra Beatriz',
    role: 'VP',
    description: 'Especialista em desenvolvimento de plataformas escaláveis'
  }, {
    name: 'Arthur Alves',
    role: 'Diretor',
    description: 'Estrategista digital com foco em crescimento e engajamento'
  }];
  return <div className="w-full min-h-screen bg-white">
      <Header />
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-br from-[#2563EB] to-[#1E40AF] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Sobre o Serviflix
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Conectando pessoas aos melhores profissionais desde 2020
          </p>
        </div>
      </div>
      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <div className="inline-block px-4 py-2 bg-[#2563EB]/10 rounded-full mb-6">
              <span className="text-[#2563EB] font-semibold text-sm">
                NOSSA MISSÃO
              </span>
            </div>
            <h2 className="text-4xl font-bold text-[#1E293B] mb-6">
              Facilitando o Acesso a Serviços de Qualidade
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              O Serviflix nasceu com o objetivo de simplificar a contratação de
              serviços profissionais. Acreditamos que encontrar o profissional
              certo não deveria ser uma tarefa complicada.
            </p>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Nossa plataforma conecta milhares de profissionais qualificados a
              clientes que precisam de seus serviços, garantindo qualidade,
              segurança e confiança em cada interação.
            </p>
            <div className="flex items-center gap-4">
              <TargetIcon className="w-12 h-12 text-[#2563EB]" />
              <div>
                <p className="font-bold text-[#1E293B] text-lg">Nossa Visão</p>
                <p className="text-gray-600">
                  Ser a plataforma número 1 de serviços no Brasil
                </p>
              </div>
            </div>
          </div>
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop" alt="Team" className="rounded-3xl shadow-2xl" />
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl">
              <p className="text-4xl font-bold text-[#2563EB] mb-1">4 anos</p>
              <p className="text-gray-600 font-semibold">de excelência</p>
            </div>
          </div>
        </div>
        {/* Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-[#2563EB]/10 rounded-full mb-4">
              <span className="text-[#2563EB] font-semibold text-sm">
                NOSSOS VALORES
              </span>
            </div>
            <h2 className="text-4xl font-bold text-[#1E293B]">
              O Que Nos Move
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border-2 border-gray-100 hover:border-[#2563EB] hover:shadow-xl transition-all group">
                <div className="w-14 h-14 bg-gradient-to-br from-[#2563EB] to-[#1E40AF] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#1E293B] mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>)}
          </div>
        </div>
        {/* Achievements */}
        <div className="bg-gradient-to-br from-[#2563EB] to-[#1E40AF] rounded-3xl p-12 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Nossos Números
            </h2>
            <p className="text-xl text-white/90">
              Crescimento constante e resultados que nos orgulham
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <achievement.icon className="w-8 h-8 text-white" />
                </div>
                <p className="text-4xl font-bold text-white mb-2">
                  {achievement.number}
                </p>
                <p className="text-white/90 font-medium">{achievement.label}</p>
              </div>)}
          </div>
        </div>
        {/* Team */}
        <div>
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-[#2563EB]/10 rounded-full mb-4">
              <span className="text-[#2563EB] font-semibold text-sm">
                NOSSA EQUIPE
              </span>
            </div>
            <h2 className="text-4xl font-bold text-[#1E293B] mb-4">
              Conheça Quem Faz Acontecer
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Profissionais dedicados e apaixonados por conectar pessoas
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => <div key={index} className="bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-[#2563EB] hover:shadow-xl transition-all group">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#1E293B] mb-1">
                    {member.name}
                  </h3>
                  <p className="text-[#2563EB] font-semibold mb-3">
                    {member.role}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {member.description}
                  </p>
                </div>
              </div>)}
          </div>
        </div>
      </div>
      <Footer />
    </div>;
}