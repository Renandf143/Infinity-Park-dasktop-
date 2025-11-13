import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Loader2Icon, ArrowRightIcon, SearchIcon } from "lucide-react";
import { categoryService } from "../services/categoryService";
import { professionalService } from "../services/professionalService";
import { ServiceCategory, ServiceProviderProfile } from "../types/firestore";

interface CategoryWithProfessionals {
  category: ServiceCategory;
  professionals: ServiceProviderProfile[];
}

export function AllCategoriesWithProfessionals() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<CategoryWithProfessionals[]>([]);
  const [filteredData, setFilteredData] = useState<CategoryWithProfessionals[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

  const handleFilterData = useCallback((query: string) => {
    if (!query.trim()) {
      setFilteredData(data);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = data
      .map(({ category, professionals }) => {
        const matchingProfessionals = professionals.filter(
          (prof) =>
            prof.displayName?.toLowerCase().includes(lowerQuery) ||
            prof.profession?.toLowerCase().includes(lowerQuery) ||
            prof.bio?.toLowerCase().includes(lowerQuery)
        );

        const categoryMatches =
          category.name.toLowerCase().includes(lowerQuery) ||
          category.description.toLowerCase().includes(lowerQuery);

        if (categoryMatches) {
          return { category, professionals };
        }

        if (matchingProfessionals.length > 0) {
          return { category, professionals: matchingProfessionals };
        }

        return null;
      })
      .filter((item): item is CategoryWithProfessionals => item !== null);

    setFilteredData(filtered);
  }, [data]);

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    const query = searchParams.get("search") || "";
    setSearchQuery(query);
    if (data.length > 0) {
      handleFilterData(query);
    }
  }, [searchParams, data, handleFilterData]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const categories = await categoryService.getAllCategories();
      const categoriesWithProfessionals: CategoryWithProfessionals[] = [];

      for (const category of categories) {
        const professionals = await professionalService.getProfessionalsByCategory(category.slug);
        categoriesWithProfessionals.push({ category, professionals });
      }

      setData(categoriesWithProfessionals);
      setFilteredData(categoriesWithProfessionals);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/categorias?search=${encodeURIComponent(searchQuery)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2Icon className="w-12 h-12 animate-spin text-[#1E3A8A] mx-auto mb-4" />
            <p className="text-gray-600">Carregando categorias...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <div className="bg-gradient-to-br from-[#1E3A8A] to-[#1e40af] text-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {searchQuery ? `Resultados para "${searchQuery}"` : "Categorias de Serviços"}
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mb-6">
              Encontre profissionais qualificados em diversas áreas
            </p>
            <form onSubmit={handleSearch} className="max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por serviço ou profissional..."
                  className="w-full px-6 py-4 pr-14 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#1E3A8A] hover:bg-[#1e40af] rounded-lg transition-colors">
                  <SearchIcon className="w-5 h-5 text-white" />
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          {searchQuery && filteredData.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Nenhum resultado encontrado</h2>
              <p className="text-gray-600 mb-6">Tente buscar por outros termos ou explore todas as categorias</p>
              <button onClick={() => { setSearchQuery(""); navigate("/categorias"); }} className="px-6 py-3 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#1e40af] transition-colors font-medium">
                Ver Todas as Categorias
              </button>
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📋</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Nenhuma categoria encontrada</h2>
              <p className="text-gray-600 mb-6">Configure as categorias primeiro</p>
              <button onClick={() => navigate("/setup")} className="px-6 py-3 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#1e40af] transition-colors font-medium">
                Configurar Categorias
              </button>
            </div>
          ) : (
            <>
              {searchQuery && (
                <div className="mb-6 text-gray-600">
                  Encontrados <span className="font-semibold text-gray-900">{filteredData.length}</span> {filteredData.length === 1 ? "resultado" : "resultados"}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredData.map(({ category, professionals }) => (
                  <div key={category.id} onClick={() => navigate(`/categoria/${category.slug}`)} className="group bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-[#1E3A8A] hover:shadow-xl transition-all cursor-pointer">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#1E3A8A] to-[#1e40af] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      {(category as any).iconSvg ? (
                        <div className="w-8 h-8 text-white" dangerouslySetInnerHTML={{ __html: (category as unknown).iconSvg }} />
                      ) : (
                        <span className="text-3xl">{category.icon}</span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#1E3A8A] transition-colors">{category.name}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{category.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-[#1E3A8A]">{professionals.length}</span>
                        </div>
                        <span className="text-sm text-gray-600">{professionals.length === 1 ? "profissional" : "profissionais"}</span>
                      </div>
                      <ArrowRightIcon className="w-5 h-5 text-[#1E3A8A] group-hover:translate-x-1 transition-transform" />
                    </div>
                    {professionals.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex -space-x-2">
                          {professionals.slice(0, 3).map((prof, idx) => (
                            <div key={prof.userId} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-semibold text-gray-600" style={{ zIndex: 3 - idx }}>
                              {prof.user.photoUrl ? (
                                <img src={prof.user.photoUrl} alt="" className="w-full h-full rounded-full object-cover" />
                              ) : (
                                prof.user.displayName.charAt(0).toUpperCase()
                              )}
                            </div>
                          ))}
                          {professionals.length > 3 && (
                            <div className="w-8 h-8 rounded-full bg-[#1E3A8A] border-2 border-white flex items-center justify-center text-xs font-semibold text-white">
                              +{professionals.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {data.length > 0 && (
          <div className="bg-gray-50 py-16">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">É um profissional?</h2>
              <p className="text-gray-600 mb-8">Cadastre-se gratuitamente e comece a receber solicitações de clientes</p>
              <button onClick={() => navigate("/register")} className="px-8 py-4 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#1e40af] transition-colors font-semibold text-lg shadow-lg hover:shadow-xl">
                Cadastrar como Profissional
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
