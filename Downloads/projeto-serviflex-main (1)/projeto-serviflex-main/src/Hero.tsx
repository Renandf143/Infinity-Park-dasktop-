import React, { useState, Component } from 'react';
// ... existing code ...
export function Hero() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/categorias?search=${encodeURIComponent(searchQuery)}`);
    }
  };
  const popularSearches = ['Design Gráfico', 'Desenvolvimento Web', 'Marketing Digital', 'Redação'];
  return <section className="relative w-full min-h-[700px] bg-gradient-to-br from-[#0A2240] via-[#509BF5] to-[#0A2240] overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <img src="/logo.png" alt="ServeFlex Logo" className="w-16 h-16 object-contain" />
              <h1 className="text-5xl md:text-6xl font-bold text-white">
                ServiFlex
              </h1>
            </div>
            {/* Main Headline */}
            <p className="text-xl md:text-2xl text-white/90 mb-4">
              Conecte-se com os melhores profissionais freelancers
            </p>
            <p className="text-lg text-white/80 mb-12">
              Milhares de especialistas prontos para transformar suas ideias em
              realidade
            </p>
            {/* Search Bar */}
            <div className="max-w-2xl">
              <form onSubmit={handleSearch}>
                <div className="relative backdrop-blur-lg bg-white/10 rounded-2xl p-2 shadow-2xl border border-white/20">
                  <div className="flex flex-col md:flex-row gap-2">
                    <div className="flex-1 relative">
                      <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                      <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="O que você precisa? Ex: Design de logo, Desenvolvimento web..." className="w-full pl-12 pr-4 py-4 bg-white/90 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D97941] transition-all" />
                    </div>
                    <button type="submit" className="px-8 py-4 bg-[#D97941] text-white rounded-xl font-semibold hover:bg-[#509BF5] transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                      Buscar
                    </button>
                  </div>
                </div>
              </form>
              {/* Popular searches */}
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="text-white/70 text-sm">Popular:</span>
                {popularSearches.map(term => <button key={term} onClick={() => {
                setSearchQuery(term);
                navigate(`/categorias?search=${encodeURIComponent(term)}`);
              }} className="px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white text-sm rounded-full hover:bg-white/20 transition-all border border-white/20">
                    {term}
                  </button>)}
              </div>
            </div>
          </div>
          {/* Right Content - Hero Image */}
          <div className="relative hidden lg:block">
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=800&fit=crop" alt="Profissional trabalhando com cliente" className="rounded-3xl shadow-2xl w-full h-[500px] object-cover border-4 border-white/20" />
              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-2xl max-w-xs">
                <div className="flex items-center gap-4 mb-3">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" alt="Profissional" className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-gray-900">Ana Silva</p>
                    <p className="text-sm text-gray-600">Designer UX/UI</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-[#D97941]">★</span>
                    <span className="font-semibold text-gray-900">4.9</span>
                  </div>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-600">200+ projetos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
}