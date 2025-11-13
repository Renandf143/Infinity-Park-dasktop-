import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { gamificationService } from "../services/gamificationService";
import { GamificationStats } from "../types/gamification";

export function useGamificationStats(professionalId: string | undefined) {
  const [stats, setStats] = useState<GamificationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!professionalId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Carregar dados iniciais
    const loadInitialData = async () => {
      try {
        const gamificationData = await gamificationService.getGamificationStats(professionalId);
        setStats(gamificationData);
        setError(null);
      } catch (err) {
        console.error("Erro ao carregar estatísticas de gamificação:", err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();

    // Listener em tempo real
    const unsubscribe = onSnapshot(
      doc(db, "serviceProviders", professionalId),
      async (docSnap) => {
        if (docSnap.exists()) {
          try {
            const gamificationData = await gamificationService.getGamificationStats(professionalId);
            setStats(gamificationData);
            setError(null);
          } catch (err) {
            console.error("Erro ao atualizar estatísticas de gamificação:", err);
            setError(err as Error);
          }
        }
      },
      (err) => {
        console.error("Erro no listener de gamificação:", err);
        setError(err as Error);
      }
    );

    return () => unsubscribe();
  }, [professionalId]);

  return { stats, loading, error };
}
