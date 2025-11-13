import { useState, useEffect } from 'react';
import { Calendar, Clock, X, Plus, Trash2, Save, AlertCircle } from 'lucide-react';
import { availabilityService } from '../services/availabilityService';
import { WeekSchedule, TimeSlot } from '../types/availability';

interface AvailabilityManagerProps {
  professionalId: string;
}

export function AvailabilityManager({ professionalId }: AvailabilityManagerProps) {
  const [weekSchedule, setWeekSchedule] = useState<WeekSchedule | null>(null);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [blockDate, setBlockDate] = useState('');
  const [blockReason, setBlockReason] = useState('');
  const [blockType, setBlockType] = useState<'vacation' | 'personal' | 'holiday' | 'other'>('personal');

  const daysOfWeek = [
    { key: 'monday', label: 'Segunda-feira' },
    { key: 'tuesday', label: 'Terça-feira' },
    { key: 'wednesday', label: 'Quarta-feira' },
    { key: 'thursday', label: 'Quinta-feira' },
    { key: 'friday', label: 'Sexta-feira' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' },
  ];

  useEffect(() => {
    loadAvailability();
  }, [professionalId]);

  const loadAvailability = async () => {
    setLoading(true);
    const settings = await availabilityService.getAvailability(professionalId);
    if (settings) {
      setWeekSchedule(settings.weekSchedule);
      setBlockedDates(settings.blockedDates);
    }
    setLoading(false);
  };

  const handleToggleDay = (day: string) => {
    if (!weekSchedule) return;
    setWeekSchedule({
      ...weekSchedule,
      [day]: {
        ...weekSchedule[day as keyof WeekSchedule],
        enabled: !weekSchedule[day as keyof WeekSchedule].enabled,
      },
    });
  };

  const handleAddSlot = (day: string) => {
    if (!weekSchedule) return;
    const daySchedule = weekSchedule[day as keyof WeekSchedule];
    setWeekSchedule({
      ...weekSchedule,
      [day]: {
        ...daySchedule,
        slots: [...daySchedule.slots, { start: '09:00', end: '17:00' }],
      },
    });
  };

  const handleRemoveSlot = (day: string, index: number) => {
    if (!weekSchedule) return;
    const daySchedule = weekSchedule[day as keyof WeekSchedule];
    setWeekSchedule({
      ...weekSchedule,
      [day]: {
        ...daySchedule,
        slots: daySchedule.slots.filter((_, i) => i !== index),
      },
    });
  };

  const handleUpdateSlot = (day: string, index: number, field: 'start' | 'end', value: string) => {
    if (!weekSchedule) return;
    const daySchedule = weekSchedule[day as keyof WeekSchedule];
    const updatedSlots = [...daySchedule.slots];
    updatedSlots[index] = { ...updatedSlots[index], [field]: value };
    setWeekSchedule({
      ...weekSchedule,
      [day]: {
        ...daySchedule,
        slots: updatedSlots,
      },
    });
  };

  const handleSave = async () => {
    if (!weekSchedule) {
      alert('⚠️ Nenhuma configuração para salvar');
      return;
    }

    setSaving(true);
    try {
      const success = await availabilityService.updateWeekSchedule(professionalId, weekSchedule);
      if (success) {
        alert('✅ Horários salvos com sucesso! Suas configurações foram atualizadas.');
        await loadAvailability(); // Recarregar para confirmar
      } else {
        alert('❌ Erro ao salvar horários. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('❌ Erro ao salvar horários. Verifique sua conexão e tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleBlockDate = async () => {
    if (!blockDate) {
      alert('⚠️ Selecione uma data para bloquear');
      return;
    }

    try {
      const success = await availabilityService.blockDate(professionalId, blockDate, blockReason, blockType);
      if (success) {
        setBlockedDates([...blockedDates, blockDate]);
        setBlockDate('');
        setBlockReason('');
        setBlockType('personal');
        alert('✅ Data bloqueada com sucesso!');
        await loadAvailability(); // Recarregar para confirmar
      } else {
        alert('❌ Erro ao bloquear data. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao bloquear data:', error);
      alert('❌ Erro ao bloquear data. Verifique sua conexão e tente novamente.');
    }
  };

  const handleUnblockDate = async (date: string) => {
    if (!confirm('Deseja realmente desbloquear esta data?')) return;

    try {
      const success = await availabilityService.unblockDate(professionalId, date);
      if (success) {
        setBlockedDates(blockedDates.filter(d => d !== date));
        alert('✅ Data desbloqueada com sucesso!');
        await loadAvailability(); // Recarregar para confirmar
      } else {
        alert('❌ Erro ao desbloquear data. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao desbloquear data:', error);
      alert('❌ Erro ao desbloquear data. Verifique sua conexão e tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Horários da Semana */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Horários de Trabalho</h3>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>

        <div className="space-y-4">
          {daysOfWeek.map(({ key, label }) => {
            const daySchedule = weekSchedule?.[key as keyof WeekSchedule];
            if (!daySchedule) return null;

            return (
              <div key={key} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={daySchedule.enabled}
                      onChange={() => handleToggleDay(key)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className={`font-medium ${daySchedule.enabled ? 'text-gray-900' : 'text-gray-400'}`}>
                      {label}
                    </span>
                  </div>
                  {daySchedule.enabled && (
                    <button
                      onClick={() => handleAddSlot(key)}
                      className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar horário
                    </button>
                  )}
                </div>

                {daySchedule.enabled && (
                  <div className="space-y-2 ml-8">
                    {daySchedule.slots.map((slot, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <input
                          type="time"
                          value={slot.start}
                          onChange={(e) => handleUpdateSlot(key, index, 'start', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-gray-500">até</span>
                        <input
                          type="time"
                          value={slot.end}
                          onChange={(e) => handleUpdateSlot(key, index, 'end', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        {daySchedule.slots.length > 1 && (
                          <button
                            onClick={() => handleRemoveSlot(key, index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bloquear Datas */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Bloquear Datas</h3>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
              <input
                type="date"
                value={blockDate}
                onChange={(e) => setBlockDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
              <select
                value={blockType}
                onChange={(e) => setBlockType(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="personal">Pessoal</option>
                <option value="vacation">Férias</option>
                <option value="holiday">Feriado</option>
                <option value="other">Outro</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Motivo (opcional)</label>
            <input
              type="text"
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              placeholder="Ex: Viagem, compromisso pessoal..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleBlockDate}
            disabled={!blockDate}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Bloquear Data
          </button>
        </div>

        {/* Datas Bloqueadas */}
        {blockedDates.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Datas Bloqueadas</h4>
            <div className="space-y-2">
              {blockedDates.sort().map((date) => (
                <div key={date} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="text-sm text-gray-900">
                    {new Date(date + 'T00:00:00').toLocaleDateString('pt-BR', {
                      weekday: 'long',
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                  <button
                    onClick={() => handleUnblockDate(date)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dica */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900">
          <p className="font-medium mb-1">Dica:</p>
          <p>Configure seus horários de trabalho e bloqueie datas indisponíveis. Os clientes só poderão solicitar serviços nos horários disponíveis.</p>
        </div>
      </div>
    </div>
  );
}
