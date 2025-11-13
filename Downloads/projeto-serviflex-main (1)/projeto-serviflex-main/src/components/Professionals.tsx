import React, { useEffect, useState, useRef } from "react";
import {
  StarIcon,
  BadgeCheckIcon,
  MapPinIcon,
  Loader2Icon,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { professionalService } from "../services/professionalService";
import { AvailabilityFilter } from "./AvailabilityFilter";

export function Professionals() {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [professionals, setProfessionals] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterByAvailability, setFilterByAvailability] = useState(false);

  // Carregar profissionais reais do Firestore
  useEffect(() => {
    loadProfessionals();
  }, [filterByAvailability]);

  const loadProfessionals = async () => {
    setLoading(true);
    try {
      const { collection, getDocs, limit, query } = await import("firebase/firestore");
      const { db } = await import("../firebase");

      // Buscar todos os profissionais (sem filtros para evitar problemas de índice)
      const professionalsQuery = query(
        collection(db, "serviceProviders"),
        limit(20)
      );

      const querySnapshot = await getDocs(professionalsQuery);
      let professionalsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().displayName || "Profissional",
        profession: doc.data().profession || "Serviços Gerais",
        rating: doc.data().rating || 5.0,
        reviewsCount: doc.data().reviewCount || 0,
        hourlyRate: doc.data().hourlyRate || 50,
        location: doc.data().location || { city: "Brasil", state: "BR" },
        verified: doc.data().verified || false,
        profileImage: doc.data().photoUrl || null,
        ...doc.data(),
      }));

      // Filtrar por disponibilidade se ativado
      if (filterByAvailability) {
        const availableIds = [];
        for (const pro of professionalsData) {
          const isAvailable = await professionalService.isProfessionalAvailableToday(pro.id);
          if (isAvailable) {
            availableIds.push(pro.id);
          }
        }
        professionalsData = professionalsData.filter(pro => availableIds.includes(pro.id));
        console.log(`✅ ${professionalsData.length} profissionais disponíveis hoje`);
      }

      // Ordenar manualmente por rating
      professionalsData.sort((a, b) => b.rating - a.rating);

      console.log("Profissionais carregados:", professionalsData);
      setProfessionals(professionalsData);
    } catch (error) {
      console.error("Erro ao carregar profissionais:", error);
      // Se houver erro, mostrar mensagem mas não quebrar a página
      setProfessionals([]);
    } finally {
      setLoading(false);
    }
  };
  // Duplicate professionals for seamless loop
  const allProfessionals = [...professionals, ...professionals];
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || professionals.length === 0) return;
    let scrollAmount = 0;
    const scrollSpeed = 1;
    const cardWidth = 384;
    const scroll = () => {
      scrollAmount += scrollSpeed;
      if (scrollAmount >= cardWidth * professionals.length) {
        scrollAmount = 0;
      }
      scrollContainer.scrollLeft = scrollAmount;
    };
    const intervalId = setInterval(scroll, 30);
    return () => clearInterval(intervalId);
  }, [professionals.length]);
  return (
    <section className="w-full py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          className="text-center mb-8"
        >
          <div className="inline-block px-6 py-2 bg-blue-100 rounded-full mb-6">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">
              PROFISSIONAIS
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Profissionais em Destaque
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conecte-se com especialistas verificados e altamente avaliados
          </p>
        </motion.div>
        
        {/* Filtro de Disponibilidade */}
        <div className="max-w-2xl mx-auto mb-12">
          <AvailabilityFilter
            filterByAvailability={filterByAvailability}
            onToggle={setFilterByAvailability}
          />
        </div>
        {/* Loading State */}
        {loading ? (
          <div className="text-center py-20">
            <Loader2Icon className="w-12 h-12 animate-spin text-[#2563EB] mx-auto mb-4" />
            <p className="text-gray-600">Carregando profissionais...</p>
          </div>
        ) : professionals.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 mb-4">
              Nenhum profissional cadastrado ainda.
            </p>
            <button
              onClick={() => navigate("/register")}
              className="px-6 py-3 bg-[#2563EB] text-white rounded-lg font-semibold hover:bg-[#1E40AF] transition-colors"
            >
              Seja o Primeiro Profissional
            </button>
          </div>
        ) : (
          <>
            {/* Auto-scrolling carousel */}
            <div className="relative mb-12">
              <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-hidden scroll-smooth"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                {allProfessionals.map((pro, index) => (
                  <motion.div
                    key={`${pro.id}-${index}`}
                    initial={{
                      opacity: 0,
                      scale: 0.9,
                    }}
                    whileInView={{
                      opacity: 1,
                      scale: 1,
                    }}
                    viewport={{
                      once: true,
                    }}
                    onClick={() => navigate(`/profissional/${pro.id}`)}
                    className="flex-shrink-0 w-[360px] group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-gray-100 hover:border-blue-500 hover:-translate-y-2"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      {filterByAvailability && (
                        <div className="absolute top-4 right-4 z-10">
                          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                            <Clock className="w-3 h-3" />
                            Disponível Hoje
                          </div>
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="relative">
                            <img
                              src={
                                pro.profileImage ||
                                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                              }
                              alt={pro.name}
                              className="w-20 h-20 rounded-full object-cover ring-4 ring-gray-100 group-hover:ring-[#2563EB]/20 transition-all"
                            />
                            {pro.verified && (
                              <div className="absolute -bottom-1 -right-1 bg-[#2563EB] rounded-full p-1">
                                <BadgeCheckIcon className="w-5 h-5 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-[#1E293B] mb-1 group-hover:text-[#2563EB] transition-colors">
                              {pro.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {pro.profession}
                            </p>
                            <div className="flex items-center gap-1 mb-2">
                              <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-semibold text-[#1E293B]">
                                {pro.rating}
                              </span>
                              <span className="text-sm text-gray-500">
                                ({pro.reviewsCount})
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <MapPinIcon className="w-4 h-4" />
                              {pro.location
                                ? `${pro.location.city}, ${pro.location.state}`
                                : "Localização não informada"}
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                          <span className="text-lg font-bold text-[#2563EB]">
                            R$ {pro.hourlyRate}/hora
                          </span>
                          <button className="px-4 py-2 bg-[#2563EB] text-white rounded-lg text-sm font-semibold hover:bg-[#1E40AF] transition-colors">
                            Ver Perfil
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              {/* Gradient overlays */}
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent pointer-events-none z-10"></div>
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent pointer-events-none z-10"></div>
            </div>
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              className="text-center"
            >
              <button
                onClick={() => navigate("/categorias")}
                className="px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:shadow-xl transition-all transform hover:scale-105"
              >
                Ver Todos os Profissionais
              </button>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
