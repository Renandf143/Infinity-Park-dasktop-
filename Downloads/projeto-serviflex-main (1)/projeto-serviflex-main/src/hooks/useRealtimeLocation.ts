import { useState, useEffect, useCallback } from 'react';
import { doc, updateDoc, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: Date;
  speed?: number;
  heading?: number;
}

export interface LocationTracking {
  userId: string;
  location: LocationData;
  isActive: boolean;
  lastUpdate: Date;
  battery?: number;
}

export function useRealtimeLocation(userId: string | null, shouldTrack: boolean = false) {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [tracking, setTracking] = useState<LocationTracking | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  // Iniciar rastreamento de localização
  const startTracking = useCallback(async () => {
    if (!userId || !navigator.geolocation) {
      setError('Geolocalização não suportada');
      return;
    }

    setIsTracking(true);
    setError(null);

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date(position.timestamp),
          speed: position.coords.speed || undefined,
          heading: position.coords.heading || undefined,
        };

        setLocation(locationData);

        // Atualizar no Firestore
        try {
          const userRef = doc(db, 'users', userId);
          await updateDoc(userRef, {
            'realtimeLocation': {
              latitude: locationData.latitude,
              longitude: locationData.longitude,
              accuracy: locationData.accuracy,
              timestamp: Timestamp.fromDate(locationData.timestamp),
              speed: locationData.speed,
              heading: locationData.heading,
              isActive: true,
            },
            'lastLocationUpdate': Timestamp.now(),
          });
        } catch (err) {
          console.error('Erro ao atualizar localização:', err);
        }
      },
      (err) => {
        setError(err.message);
        setIsTracking(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
      setIsTracking(false);
    };
  }, [userId]);

  // Parar rastreamento
  const stopTracking = useCallback(async () => {
    if (!userId) return;

    setIsTracking(false);

    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        'realtimeLocation.isActive': false,
      });
    } catch (err) {
      console.error('Erro ao parar rastreamento:', err);
    }
  }, [userId]);

  // Observar localização de outro usuário
  useEffect(() => {
    if (!userId) return;

    const userRef = doc(db, 'users', userId);
    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.realtimeLocation) {
          setTracking({
            userId,
            location: {
              latitude: data.realtimeLocation.latitude,
              longitude: data.realtimeLocation.longitude,
              accuracy: data.realtimeLocation.accuracy,
              timestamp: data.realtimeLocation.timestamp?.toDate() || new Date(),
              speed: data.realtimeLocation.speed,
              heading: data.realtimeLocation.heading,
            },
            isActive: data.realtimeLocation.isActive || false,
            lastUpdate: data.lastLocationUpdate?.toDate() || new Date(),
            battery: data.realtimeLocation.battery,
          });
        }
      }
    });

    return () => unsubscribe();
  }, [userId]);

  // Auto-start tracking se necessário
  useEffect(() => {
    if (shouldTrack && !isTracking) {
      startTracking();
    }
  }, [shouldTrack, isTracking, startTracking]);

  return {
    location,
    tracking,
    error,
    isTracking,
    startTracking,
    stopTracking,
  };
}
