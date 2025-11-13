import React, { useEffect, useState } from 'react';
import { SearchIcon, ArrowRightIcon, PlayCircleIcon, CheckCircleIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRealtimeStats } from '../hooks/useRealtimeStats';

export function Hero() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0
  });
  const realtimeStats = useRealtimeStats();
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/categorias?search=${encodeURIComponent(searchQuery)}`);
    }
  };
  const popularSearches = ['Limpeza Residencial', 'Eletricista', 'Encanador', 'Jardineiro'];
  
  // Formatar números
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace('.0', '') + 'k+';
    }
    return num.toLocaleString('pt-BR');
  };

  const stats = [{
    value: realtimeStats.loading ? '...' : formatNumber(realtimeStats.totalProfessionals),
    label: 'Profissionais Ativos'
  }, {
    value: realtimeStats.loading ? '...' : `${realtimeStats.averageRating.toFixed(1)}★`,
    label: 'Avaliação Média'
  }, {
    value: realtimeStats.loading ? '...' : formatNumber(realtimeStats.totalServices),
    label: 'Serviços Realizados'
  }];
  
  const benefits = ['Profissionais Verificados', 'Pagamento Seguro', 'Suporte 24/7'];
  return <section className="relative w-full min-h-[90vh] bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <motion.div animate={{
        x: mousePosition.x,
        y: mousePosition.y
      }} transition={{
        type: 'spring',
        stiffness: 50
      }} className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#2563EB] rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <motion.div animate={{
        x: -mousePosition.x,
        y: -mousePosition.y
      }} transition={{
        type: 'spring',
        stiffness: 50
      }} className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#1E40AF] rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => <motion.div key={i} className="absolute w-2 h-2 bg-white rounded-full" initial={{
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        opacity: Math.random() * 0.5
      }} animate={{
        y: [null, Math.random() * window.innerHeight],
        opacity: [null, 0]
      }} transition={{
        duration: Math.random() * 10 + 10,
        repeat: Infinity,
        ease: 'linear'
      }} />)}
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div initial={{
          opacity: 0,
          x: -50
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.8
        }} className="z-10">
            {/* Badge */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.2
          }} className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-white/90 text-sm font-medium">
                {realtimeStats.loading 
                  ? 'Carregando...' 
                  : `+${realtimeStats.onlineProfessionals.toLocaleString('pt-BR')} profissionais online agora`}
              </span>
            </motion.div>
            <motion.h1 initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.3
          }} className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Encontre o{' '}
              <span className="text-[#1E40AF]">
                Profissional
              </span>{' '}
              Ideal
            </motion.h1>
            <motion.p initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.4
          }} className="text-xl text-white/80 mb-8 leading-relaxed">
              Conectamos você aos melhores profissionais verificados. Rápido,
              seguro e sem complicações.
            </motion.p>
            {/* Benefits */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.5
          }} className="flex flex-wrap gap-4 mb-8">
              {benefits.map((benefit, index) => <div key={index} className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
                  <CheckCircleIcon className="w-5 h-5 text-green-400" />
                  <span className="text-white/90 text-sm font-medium">
                    {benefit}
                  </span>
                </div>)}
            </motion.div>
            {/* Search Bar */}
            <motion.form initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.6
          }} onSubmit={handleSearch} className="mb-6">
              <div className="relative group">
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Buscar por serviço ou profissional..." className="w-full px-6 py-5 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-[#2563EB] transition-all group-hover:bg-white/15" />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-[#1E40AF] rounded-xl hover:shadow-xl transition-all transform hover:scale-105">
                  <SearchIcon className="w-6 h-6 text-white" />
                </button>
              </div>
            </motion.form>
            {/* Popular Searches */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.7
          }} className="flex flex-wrap gap-2 items-center mb-8">
              <span className="text-sm text-white/60">Popular:</span>
              {popularSearches.map(term => <button key={term} onClick={() => {
              setSearchQuery(term);
              navigate(`/categorias?search=${encodeURIComponent(term)}`);
            }} className="px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 text-white/80 text-sm rounded-full hover:bg-white/10 hover:border-white/20 transition-all">
                  {term}
                </button>)}
            </motion.div>
            {/* CTA Buttons */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.8
          }} className="flex flex-wrap gap-4">
              <button onClick={() => navigate('/register')} className="group px-8 py-4 bg-[#1E40AF] text-white rounded-xl font-semibold hover:shadow-2xl transition-all transform hover:scale-105 flex items-center gap-2">
                Começar Agora
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => navigate('/como-funciona')} className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all flex items-center gap-2">
                <PlayCircleIcon className="w-5 h-5" />
                Como Funciona
              </button>
            </motion.div>
          </motion.div>
          {/* Right Content - Image */}
          <motion.div initial={{
          opacity: 0,
          scale: 0.9
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          duration: 0.8,
          delay: 0.3
        }} className="relative z-10 hidden lg:block">
            <div className="relative">
              {/* Main Image */}
              <motion.div animate={{
              y: [0, -20, 0]
            }} transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut'
            }} className="relative">
                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=800&fit=crop" alt="Equipe de profissionais" className="w-full h-[600px] object-cover rounded-3xl shadow-2xl border-4 border-white/10" />
                {/* Floating Card 1 */}
                <motion.div animate={{
                y: [0, -15, 0]
              }} transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut'
              }} className="absolute -left-8 top-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#1E40AF] rounded-xl flex items-center justify-center">
                      <CheckCircleIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {realtimeStats.loading 
                          ? '...' 
                          : `+${realtimeStats.todayServices} Serviços`}
                      </p>
                      <p className="text-xs text-gray-600">Hoje</p>
                    </div>
                  </div>
                </motion.div>
                {/* Floating Card 2 */}
                <motion.div animate={{
                y: [0, 15, 0]
              }} transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: 'easeInOut'
              }} className="absolute -right-8 bottom-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">⭐</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {realtimeStats.loading 
                          ? '...' 
                          : `${realtimeStats.averageRating.toFixed(1)}/5.0`}
                      </p>
                      <p className="text-xs text-gray-600">Avaliação</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
        {/* Stats Bar */}
        <motion.div initial={{
        opacity: 0,
        y: 50
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 1,
        duration: 0.8
      }} className="mt-20 grid grid-cols-3 gap-8">
          {stats.map((stat, index) => <motion.div key={index} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 1.2 + index * 0.1
        }} className="text-center p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
              <p className="text-4xl font-bold text-white mb-2">{stat.value}</p>
              <p className="text-white/60">{stat.label}</p>
            </motion.div>)}
        </motion.div>
      </div>
    </section>;
}