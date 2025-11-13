import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export function Stats() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    professionals: 0,
    projects: 0,
    avgRating: 0,
    categories: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { collection, getDocs, query, where } = await import('firebase/firestore');
      const { db } = await import('../firebase');
      
      // Contar profissionais
      const professionalsSnapshot = await getDocs(collection(db, 'serviceProviders'));
      const professionalsCount = professionalsSnapshot.size;
      
      // Contar solicitações
      const requestsSnapshot = await getDocs(collection(db, 'serviceRequests'));
      const projectsCount = requestsSnapshot.size;
      
      // Calcular média de avaliação
      let totalRating = 0;
      let ratingCount = 0;
      professionalsSnapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.rating) {
          totalRating += data.rating;
          ratingCount++;
        }
      });
      const avgRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : 5.0;
      
      // Contar categorias
      const categoriesSnapshot = await getDocs(collection(db, 'categories'));
      const categoriesCount = categoriesSnapshot.size;
      
      setStats({
        professionals: professionalsCount,
        projects: projectsCount,
        avgRating: parseFloat(avgRating),
        categories: categoriesCount
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const statsDisplay = [
    {
      value: stats.professionals > 0 ? `${stats.professionals}+` : '0',
      label: 'Profissionais Cadastrados'
    },
    {
      value: stats.projects > 0 ? `${stats.projects}+` : '0',
      label: 'Solicitações de Serviço'
    },
    {
      value: `${stats.avgRating}/5`,
      label: 'Avaliação Média'
    },
    {
      value: stats.categories > 0 ? `${stats.categories}+` : '12',
      label: 'Categorias Disponíveis'
    }
  ];
  return <section className="w-full py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 relative overflow-hidden">
      {/* Glassmorphism background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Números que Impressionam
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Junte-se a milhares de clientes e profissionais satisfeitos
          </p>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {statsDisplay.map((stat, index) => <motion.div key={index} initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: index * 0.1
        }} className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 text-center border-2 border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <div className="text-5xl font-bold text-white mb-3">
                {stat.value}
              </div>
              <div className="text-white/90 text-lg font-medium">
                {stat.label}
              </div>
            </motion.div>)}
        </div>
        {/* CTA Section */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="text-center backdrop-blur-xl bg-white/10 rounded-3xl p-12 border-2 border-white/20">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para começar seu próximo projeto?
          </h3>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Conecte-se com profissionais talentosos ou ofereça seus serviços
            hoje mesmo
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/categorias')}
              className="px-10 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-2xl transition-all transform hover:scale-105"
            >
              Contratar Profissional
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="px-10 py-4 bg-transparent text-white border-2 border-white rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all"
            >
              Oferecer Serviços
            </button>
          </div>
        </motion.div>
      </div>
    </section>;
}