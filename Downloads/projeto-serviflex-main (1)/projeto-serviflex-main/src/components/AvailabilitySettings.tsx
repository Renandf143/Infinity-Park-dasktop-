import { useState, useEffect } from 'react';
import { ClockIcon, PlusIcon, TrashIcon, SaveIcon, Loader2Icon } from 'lucide-react';
import { DaySchedule, TimeSlot } from '../types/scheduling';
import { schedulingService } from '../services/schedulingService';

interface AvailabilitySettingsProps {
  professionalId: string;
}

export function AvailabilitySettings({ professionalId }: AvailabilitySettingsProps) {
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAvailability();
  }, [professionalId]);

  const loadAvailability = async () => {
    try {
      const availability = await schedulingService.getProfessionalAvailability(professionalId);
      if (availability) {
        setSchedule(availability.schedule);
      }
    } catch (error) {
      console.error('Erro ao carregar disponibilidade:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDay = (dayIndex: number) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].isAvailable = !newSchedule[dayIndex].isAvailable;
    setSchedule(newSchedule);
  };

  const handleAddTimeSlot = (dayIndex: number) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].timeSlots.push({ start: '09:00', end: '17:00' });
    setSchedule(newSchedule);
  };

  const handleRemoveTimeSlot = (dayIndex: number, slotIndex: number) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].timeSlots.splice(slotIndex, 1);
    setSchedule(newSchedule);
  };

  const handleTimeChange = (
    dayIndex: number,
    slotIndex: number,
    field: 'start' | 'end',
    value: string
  ) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].timeSlots[slotIndex][field] = value;
    setSchedule(newSchedule);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await schedulingService.saveProfessionalAvailability(professionalId, schedule);
      alert('✅ Disponibilidade salva com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('❌ Erro ao salvar disponibilidade');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2Icon className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Disponibilidade</h3>
          <p className="text-sm text-gray-600 mt-1">
            Configure seus horários de atendimento
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2Icon className="w-4 h-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <SaveIcon className="w-4 h-4" />
              Salvar
            </>
          )}
        </button>
      </div>

      <div className="space-y-4">
        {schedule.map((day, dayIndex) => (
          <div
            key={day.dayOfWeek}
            className={`border rounded-lg p-4 transition-all ${
              day.isAvailable ? 'border-blue-200 bg-blue-50/50' : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={day.isAvailable}
                  onChange={() => handleToggleDay(dayIndex)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="font-semibold text-gray-900">{day.dayName}</span>
              </div>
              {day.isAvailable && (
                <button
                  onClick={() => handleAddTimeSlot(dayIndex)}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                  Adicionar Horário
                </button>
              )}
            </div>

            {day.isAvailable && (
              <div className="space-y-2 ml-8">
                {day.timeSlots.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">
                    Nenhum horário configurado
                  </p>
                ) : (
                  day.timeSlots.map((slot, slotIndex) => (
                    <div key={slotIndex} className="flex items-center gap-3">
                      <ClockIcon className="w-4 h-4 text-gray-400" />
                      <input
                        type="time"
                        value={slot.start}
                        onChange={(e) =>
                          handleTimeChange(dayIndex, slotIndex, 'start', e.target.value)
                        }
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <span className="text-gray-500">até</span>
                      <input
                        type="time"
                        value={slot.end}
                        onChange={(e) =>
                          handleTimeChange(dayIndex, slotIndex, 'end', e.target.value)
                        }
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {day.timeSlots.length > 1 && (
                        <button
                          onClick={() => handleRemoveTimeSlot(dayIndex, slotIndex)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {!day.isAvailable && (
              <p className="text-sm text-gray-500 ml-8">Fechado</p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>💡 Dica:</strong> Configure seus horários de atendimento para que os clientes
          possam agendar serviços apenas nos horários disponíveis. O sistema evita
          automaticamente conflitos de agendamento.
        </p>
      </div>
    </div>
  );
}
