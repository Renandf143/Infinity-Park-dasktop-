import React from 'react';
import { ShieldCheckIcon, UsersIcon, TrendingUpIcon, HeartIcon } from 'lucide-react';
import { motion } from 'framer-motion';
export function About() {
  const features = [{
    icon: ShieldCheckIcon,
    title: 'Segurança Garantida',
    description: 'Todos os profissionais são verificados e avaliados pela comunidade',
    color: 'from-blue-500 to-blue-600'
  }, {
    icon: UsersIcon,
    title: 'Milhares de Profissionais',
    description: 'Rede com os melhores prestadores de serviço do Brasil',
    color: 'from-purple-500 to-purple-600'
  }, {
    icon: TrendingUpIcon,
    title: 'Pagamento Protegido',
    description: 'Sistema seguro de pagamento com garantia de reembolso',
    color: 'from-green-500 to-green-600'
  }, {
    icon: HeartIcon,
    title: 'Satisfação Garantida',
    description: 'Suporte dedicado para garantir a melhor experiência',
    color: 'from-red-500 to-red-600'
  }];
  return <section id="sobre" className="w-full py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div initial={{
          opacity: 0,
          x: -50
        }} whileInView={{
          opacity: 1,
          x: 0
        }} viewport={{
          once: true
        }}>
            <div className="inline-block px-6 py-2 bg-blue-100 rounded-full mb-6">
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">
                SOBRE A SERVIFLEX
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Conectando Pessoas aos Melhores Profissionais
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              A ServiFlex é uma plataforma inovadora criada para facilitar a
              vida de profissionais autônomos, conectando talentos a
              oportunidades reais de serviço.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Com milhares de profissionais verificados em diversas categorias,
              garantimos qualidade, confiança e excelência em cada serviço
              prestado.
            </p>
            <div className="grid grid-cols-3 gap-6">
              {[{
              value: '50K+',
              label: 'Profissionais'
            }, {
              value: '200K+',
              label: 'Serviços'
            }, {
              value: '4.9★',
              label: 'Avaliação'
            }].map((stat, index) => <motion.div key={index} initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: index * 0.1
            }} className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                  <p className="text-3xl font-bold text-blue-600 mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </motion.div>)}
            </div>
          </motion.div>
          {/* Right Content - Features Grid */}
          <motion.div initial={{
          opacity: 0,
          x: 50
        }} whileInView={{
          opacity: 1,
          x: 0
        }} viewport={{
          once: true
        }} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, index) => <motion.div key={index} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: index * 0.1
          }} className="bg-white p-6 rounded-2xl hover:shadow-2xl transition-all border-2 border-gray-100 hover:border-blue-500 group">
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>)}
          </motion.div>
        </div>
      </div>
    </section>;
}