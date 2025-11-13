import { useState, useEffect } from 'react';
import { Clock, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { availabilityService } from '../services/availabilityService';
import { AvailabilitySettings } from '../types/availability';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

interface ProfessionalAvailabilityDisplayProps {
  professionalId: string;
}

export function ProfessionalAvailabilityDisplay({ professionalId }: ProfessionalAvailabilityDisplayProps) {
  const [availability, setAvailability] = useState<AvailabilitySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAvailableToday, setIsAvailableToday] = useState(false);

  const daysOfWeek = [
    { key: 'monday', label: 'Seg', fullLabel: 'Segunda-feira' },
    { key: 'tuesday', label: 'Ter', fullLabel: 'Terça-feira' },
    { key: 'wednesday', label: 'Qua', fullLabel: 'Quarta-feira' },
    { key: 'thursday', label: 'Qui', fullLabel: 'Quinta-feira' },
    { key: 'friday', label: 'Sex', fullLabel: 'Sexta-feira' },
    { key: 'saturday', label: 'Sáb', fullLabel: 'Sábado' },
    { key: 'sunday', label: 'Dom', fullLabel: 'Domingo' },
  ];

  // Listener em tempo real para disponibilidade
  useEffect(() => {
    if (!professionalId) return;

    console.log('👂 Iniciando listener de disponibilidade para:', professionalId);

    const unsubscribe = onSnapshot(
      doc(db, 'availability', professionalId),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const settings = docSnapshot.data() as AvailabilitySettings;
          console.log('🔄 Disponibilidade atualizada em tempo real!');
          setAvailability(settings);

          // Verificar se está disponível hoje
          const today = new Date();
          const dayOfWeek = today.getDay();
          const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
          const todayName = dayNames[dayOfWeek] as keyof typeof settings.weekSchedule;
          const todayStr = today.toISOString().split('T')[0];

          const daySchedule = settings.weekSchedule[todayName];
          const isEnabled = daySchedule && daySchedule.enabled && daySchedule.slots.length > 0;
          const isNotBlocked = !settings.blockedDates.includes(todayStr);

          setIsAvailableToday(isEnabled && isNotBlocked);
        } else {
          console.log('⚠️ Disponibilidade não configurada ainda');
          // Criar configuração padrão
          loadAvailability();
        }
        setLoading(false);
      },
      (error) => {
        console.error('❌ Erro no listener de disponibilidade:', error);
        // Fallback para carregamento único
        loadAvailability();
      }
    );

    return () => {
      console.log('🔌 Desconectando listener de disponibilidade');
      unsubscribe();
    };
  }, [professionalId]);

  const loadAvailability = async () => {
    setLoading(true);
    try {
      const settings = await availabilityService.getAvailability(professionalId);
      setAvailability(settings);

      // Verificar se está disponível hoje
      if (settings) {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const todayName = dayNames[dayOfWeek] as keyof typeof settings.weekSchedule;
        const todayStr = today.toISOString().split('T')[0];

        const daySchedule = settings.weekSchedule[todayName];
        const isEnabled = daySchedule && daySchedule.enabled && daySchedule.slots.length > 0;
        const isNotBlocked = !settings.blockedDates.includes(todayStr);

        setIsAvailableToday(isEnabled && isNotBlocked);
      }
    } catch (error) {
      console.error('Erro ao carregar disponibilidade:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="animate-pulse space-y-3">
          <div className="h-5 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!availability) {
    return null;
  }

  const today = new Date();
  const dayOfWeek = today.getDay();

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Disponibilidade</h3>
        </div>
        {isAvailableToday ? (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Disponível Hoje
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
            <XCircle className="w-4 h-4" />
            Indisponível Hoje
          </div>
        )}
      </div>

      {/* Dias da Semana */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {daysOfWeek.map(({ key, label }, index) => {
          const daySchedule = availability.weekSchedule[key as keyof typeof availability.weekSchedule];
          const isEnabled = daySchedule && daySchedule.enabled && daySchedule.slots.length > 0;
          const isToday = index === (dayOfWeek === 0 ? 6 : dayOfWeek - 1);

          return (
            <div
              key={key}
              className={`text-center p-2 rounded-lg border-2 transition-all ${
                isToday
                  ? 'border-blue-500 bg-blue-50'
                  : isEnabled
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className={`text-xs font-medium ${
                isToday
                  ? 'text-blue-700'
                  : isEnabled
                  ? 'text-green-700'
                  : 'text-gray-400'
              }`}>
                {label}
              </div>
              {isEnabled ? (
                <CheckCircle className={`w-4 h-4 mx-auto mt-1 ${
                  isToday ? 'text-blue-600' : 'text-green-600'
                }`} />
              ) : (
                <XCircle className="w-4 h-4 mx-auto mt-1 text-gray-300" />
              )}
            </div>
          );
        })}
      </div>

      {/* Horários da Semana */}
      <div className="pt-4 border-t border-gray-200">
        <p className="text-sm font-medium text-gray-700 mb-3">Horários da semana:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {daysOfWeek.map(({ key, fullLabel }, index) => {
            const daySchedule = availability.weekSchedule[key as keyof typeof availability.weekSchedule];
            const isEnabled = daySchedule && daySchedule.enabled && daySchedule.slots.length > 0;
            const isToday = index === (dayOfWeek === 0 ? 6 : dayOfWeek - 1);

            return (
              <div
                key={key}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  isToday && isEnabled
                    ? 'bg-blue-50 border-blue-200'
                    : isEnabled
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <span className={`font-medium ${
                  isToday ? 'text-blue-900' : 'text-gray-900'
                }`}>
                  {fullLabel}
                </span>
                <span className={`text-sm font-semibold ${
                  isToday && isEnabled
                    ? 'text-blue-700'
                    : isEnabled
                    ? 'text-green-700'
                    : 'text-gray-500'
                }`}>
                  {isEnabled
                    ? daySchedule.slots.map(slot => `${slot.start} - ${slot.end}`).join(', ')
                    : 'Fechado'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legenda */}
      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>Disponível</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-gray-300"></div>
          <span>Indisponível</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span>Hoje</span>
        </div>
      </div>
    </div>
  );
}
