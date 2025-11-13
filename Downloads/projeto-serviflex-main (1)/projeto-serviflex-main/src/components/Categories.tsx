import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SparklesIcon, WrenchIcon, ScissorsIcon, HeartPulseIcon, GraduationCapIcon, PartyPopperIcon, TruckIcon, LaptopIcon, LeafIcon, BabyIcon, PawPrintIcon, ChefHatIcon } from 'lucide-react';
export function Categories() {
  const navigate = useNavigate();
  const categories = [{
    icon: SparklesIcon,
    name: 'Limpeza e Organização',
    count: '12.5K+ profissionais',
    color: 'from-blue-500 to-blue-600',
    slug: 'limpeza-organizacao',
    description: 'Diaristas, faxineiras, organizadores'
  }, {
    icon: WrenchIcon,
    name: 'Reparos e Manutenção',
    count: '8.9K+ profissionais',
    color: 'from-[#1E40AF] to-[#2563EB]',
    slug: 'reparos-manutencao',
    description: 'Eletricistas, encanadores, marceneiros, pintores'
  }, {
    icon: ScissorsIcon,
    name: 'Beleza e Estética',
    count: '15.2K+ profissionais',
    color: 'from-[#2563EB] to-[#1E40AF]',
    slug: 'beleza-estetica',
    description: 'Cabeleireiros, manicures, esteticistas, maquiadores'
  }, {
    icon: HeartPulseIcon,
    name: 'Saúde e Bem-estar',
    count: '6.7K+ profissionais',
    color: 'from-[#1E40AF] to-[#2563EB]',
    slug: 'saude-bem-estar',
    description: 'Fisioterapeutas, personal trainers, massagistas'
  }, {
    icon: GraduationCapIcon,
    name: 'Aulas e Treinamentos',
    count: '9.4K+ profissionais',
    color: 'from-[#2563EB] to-[#1E40AF]',
    slug: 'aulas-treinamentos',
    description: 'Professores particulares, instrutores, coaches'
  }, {
    icon: PartyPopperIcon,
    name: 'Eventos e Festas',
    count: '5.3K+ profissionais',
    color: 'from-[#1E40AF] to-[#2563EB]',
    slug: 'eventos-festas',
    description: 'Organizadores, decoradores, buffet, animadores'
  }, {
    icon: TruckIcon,
    name: 'Transporte e Mudanças',
    count: '4.8K+ profissionais',
    color: 'from-[#2563EB] to-[#1E40AF]',
    slug: 'transporte-mudancas',
    description: 'Carretos, mudanças, fretes, motoristas'
  }, {
    icon: LaptopIcon,
    name: 'Tecnologia e Suporte',
    count: '7.1K+ profissionais',
    color: 'from-[#1E40AF] to-[#2563EB]',
    slug: 'tecnologia-suporte',
    description: 'Técnicos de informática, instalação de equipamentos'
  }, {
    icon: LeafIcon,
    name: 'Jardinagem e Paisagismo',
    count: '3.6K+ profissionais',
    color: 'from-[#2563EB] to-[#1E40AF]',
    slug: 'jardinagem-paisagismo',
    description: 'Jardineiros, paisagistas, podadores'
  }, {
    icon: BabyIcon,
    name: 'Cuidados Pessoais',
    count: '5.9K+ profissionais',
    color: 'from-[#1E40AF] to-[#2563EB]',
    slug: 'cuidados-pessoais',
    description: 'Babás, cuidadores de idosos, enfermeiros'
  }, {
    icon: PawPrintIcon,
    name: 'Pet Care',
    count: '4.2K+ profissionais',
    color: 'from-[#2563EB] to-[#1E40AF]',
    slug: 'pet-care',
    description: 'Veterinários, adestradores, banho e tosa, pet sitters'
  }, {
    icon: ChefHatIcon,
    name: 'Alimentação',
    count: '6.5K+ profissionais',
    color: 'from-[#1E40AF] to-[#2563EB]',
    slug: 'alimentacao',
    description: 'Chefs particulares, confeiteiros, cozinheiros'
  }];
  return <section className="w-full py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="inline-block px-6 py-2 bg-blue-100 rounded-full mb-6">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">
              CATEGORIAS
            </span>
          </motion.div>
          <motion.h2 initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: 0.1
        }} className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Serviços do Dia a Dia
          </motion.h2>
          <motion.p initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: 0.2
        }} className="text-xl text-gray-600 max-w-3xl mx-auto">
            Encontre profissionais qualificados para os serviços que você
            precisa no seu cotidiano
          </motion.p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {categories.map((category, index) => <motion.button key={index} initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: index * 0.05
        }} onClick={() => navigate(`/categoria/${category.slug}`)} className="group bg-white p-6 rounded-2xl hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-500 transform hover:scale-105">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                <category.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {category.name}
              </h3>
              <p className="text-xs text-gray-500 mb-2 font-medium">
                {category.count}
              </p>
              <p className="text-xs text-gray-600 leading-relaxed">
                {category.description}
              </p>
            </motion.button>)}
        </div>
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="text-center">
          <button onClick={() => navigate('/categorias')} className="px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:shadow-xl transition-all transform hover:scale-105">
            Ver Todas as Categorias
          </button>
        </motion.div>
      </div>
    </section>;
}