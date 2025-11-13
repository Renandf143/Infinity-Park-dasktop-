import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  Timestamp,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "../firebase";

interface RealtimeStats {
  onlineProfessionals: number;
  totalProfessionals: number;
  averageRating: number;
  totalServices: number;
  todayServices: number;
  loading: boolean;
}

export function useRealtimeStats(): RealtimeStats {
  const [stats, setStats] = useState<RealtimeStats>({
    onlineProfessionals: 0,
    totalProfessionals: 0,
    averageRating: 0,
    totalServices: 0,
    todayServices: 0,
    loading: true,
  });

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const fetchStats = async () => {
      try {
        console.log('📊 Buscando estatísticas em tempo real...');

        // 1. Buscar todos os profissionais ativos
        const professionalsRef = collection(db, "serviceProviders");
        const allProfessionalsQuery = query(
          professionalsRef,
          where("isActive", "==", true)
        );
        
        // 2. Listener em tempo real para todos os profissionais
        unsubscribe = onSnapshot(
          allProfessionalsQuery,
          async (snapshot) => {
            const totalProfessionals = snapshot.size;
            console.log('👥 Total de profissionais:', totalProfessionals);

            // Filtrar profissionais online (últimos 10 minutos)
            const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
            let onlineCount = 0;
            let totalRating = 0;
            let ratingCount = 0;

            snapshot.forEach((doc) => {
              const data = doc.data();
              
              // Contar profissionais online
              if (data.lastActive) {
                const lastActiveTime = data.lastActive.toDate?.() || new Date(data.lastActive);
                if (lastActiveTime.getTime() >= tenMinutesAgo) {
                  onlineCount++;
                }
              }
              
              // Calcular avaliação média
              if (data.rating && data.rating > 0) {
                totalRating += data.rating;
                ratingCount++;
              }
            });

            const averageRating = ratingCount > 0 ? totalRating / ratingCount : 0;
            console.log('🟢 Profissionais online:', onlineCount);
            console.log('⭐ Avaliação média:', averageRating.toFixed(1));

            // 3. Buscar estatísticas de serviços
            let totalServices = 0;
            let todayServices = 0;

            try {
              const servicesRef = collection(db, "services");
              const allServicesSnapshot = await getDocs(servicesRef);
              totalServices = allServicesSnapshot.size;

              // Contar serviços de hoje
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const todayTimestamp = today.getTime();

              allServicesSnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.createdAt) {
                  const createdAt = data.createdAt.toDate?.() || new Date(data.createdAt);
                  if (createdAt.getTime() >= todayTimestamp) {
                    todayServices++;
                  }
                }
              });

              console.log('✅ Total de serviços:', totalServices);
              console.log('📅 Serviços hoje:', todayServices);
            } catch (error) {
              console.warn('⚠️ Erro ao buscar serviços:', error);
            }

            // Atualizar estado
            setStats({
              onlineProfessionals: onlineCount,
              totalProfessionals,
              averageRating: parseFloat(averageRating.toFixed(1)),
              totalServices,
              todayServices,
              loading: false,
            });
          },
          (error) => {
            console.error('❌ Erro no listener de profissionais:', error);
            setStats((prev) => ({ ...prev, loading: false }));
          }
        );

      } catch (error) {
        console.error("❌ Erro ao buscar estatísticas:", error);
        setStats((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchStats();

    // Cleanup
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return stats;
}
