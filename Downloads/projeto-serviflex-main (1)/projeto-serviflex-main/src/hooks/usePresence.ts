import { useEffect, useState } from "react";
import { presenceService } from "../services/presenceService";

interface UserPresence {
  online: boolean;
  lastSeen: any;
  userId: string;
}

/**
 * Hook para observar a presença online de um usuário
 */
export function useUserPresence(userId: string | null) {
  const [presence, setPresence] = useState<UserPresence | null>(null);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (!userId) {
      setPresence(null);
      setIsOnline(false);
      return;
    }

    const unsubscribe = presenceService.subscribeToUserPresence(
      userId,
      (newPresence) => {
        setPresence(newPresence);
        setIsOnline(newPresence?.online || false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [userId]);

  return { presence, isOnline };
}

/**
 * Hook para observar a presença de múltiplos usuários
 */
export function useMultiplePresences(userIds: string[]) {
  const [presences, setPresences] = useState<Map<string, UserPresence | null>>(
    new Map()
  );

  useEffect(() => {
    if (userIds.length === 0) {
      setPresences(new Map());
      return;
    }

    const unsubscribe = presenceService.subscribeToMultiplePresences(
      userIds,
      (newPresences) => {
        setPresences(newPresences);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [userIds.join(",")]);

  return presences;
}

/**
 * Hook para iniciar a presença do usuário atual
 */
export function useStartPresence(userId: string | null) {
  useEffect(() => {
    if (!userId) return;

    presenceService.startPresence(userId);

    return () => {
      presenceService.stopPresence();
    };
  }, [userId]);
}
