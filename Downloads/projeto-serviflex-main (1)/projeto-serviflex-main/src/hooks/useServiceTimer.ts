import { useState, useEffect, useCallback, useRef } from 'react';
import { doc, updateDoc, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

export function useServiceTimer(serviceId: string | null) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Observar mudanças no serviço
  useEffect(() => {
    if (!serviceId) return;

    const serviceRef = doc(db, 'services', serviceId);
    const unsubscribe = onSnapshot(serviceRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        
        if (data.startedAt && data.status === 'in_progress') {
          setStartTime(data.startedAt.toDate());
          setIsRunning(true);
          setIsPaused(false);
        } else if (data.status === 'completed' || data.status === 'awaiting_payment') {
          setIsRunning(false);
          if (data.actualDuration) {
            setElapsedTime(data.actualDuration * 60); // converter minutos para segundos
          }
        }
      }
    });

    return () => unsubscribe();
  }, [serviceId]);

  // Atualizar cronômetro
  useEffect(() => {
    if (isRunning && !isPaused && startTime) {
      intervalRef.current = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, startTime]);

  const startTimer = useCallback(async () => {
    if (!serviceId) return;

    const now = new Date();
    setStartTime(now);
    setIsRunning(true);
    setIsPaused(false);
    setElapsedTime(0);

    try {
      const serviceRef = doc(db, 'services', serviceId);
      await updateDoc(serviceRef, {
        status: 'in_progress',
        startedAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Erro ao iniciar timer:', error);
    }
  }, [serviceId]);

  const pauseTimer = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resumeTimer = useCallback(() => {
    setIsPaused(false);
  }, []);

  const stopTimer = useCallback(async () => {
    if (!serviceId) return;

    setIsRunning(false);
    const durationMinutes = Math.ceil(elapsedTime / 60);

    try {
      const serviceRef = doc(db, 'services', serviceId);
      await updateDoc(serviceRef, {
        status: 'awaiting_payment',
        completedAt: Timestamp.now(),
        actualDuration: durationMinutes,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Erro ao parar timer:', error);
    }
  }, [serviceId, elapsedTime]);

  const formatTime = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: secs.toString().padStart(2, '0'),
      formatted: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`,
    };
  }, []);

  return {
    elapsedTime,
    isRunning,
    isPaused,
    startTime,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    formatTime,
  };
}
