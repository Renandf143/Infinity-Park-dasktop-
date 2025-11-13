import { useState, useEffect } from 'react';
import { CalendarIcon, ClockIcon, Loader2Icon, CheckCircleIcon, XCircleIcon } from 'lucide-react';
import { schedulingService } from '../services/schedulingService';
import { AvailableSlot } from '../types/scheduling';

interface BookingCalendarProps {
  professionalId: string;
  professionalName: string;
  onBookingComplete: (bookingId: string) => void;
}

export function BookingCalendar({
  professionalId,
  professionalName,
  onBookingComplete,
}: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);
  
  // Form data
  const [serviceType, setServiceType] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [price, setPrice] = useState('');

  // Gerar próximos 30 dias
  const getNext30Days = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push({
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
        dayNumber: date.getDate(),
        month: date.toLocaleDateString('pt-BR', { month: 'short' }),
        isToday: i === 0,
      });
    }
    
    return days;
  };

  const days = getNext30Days();

  useEffect(() => {
    if (selectedDate) {
      loadAvailableSlots();
    }
  }, [selectedDate]);

  const loadAvailableSlots = async () => {
    setLoading(true);
    try {
      const slots = await schedulingService.getAvailableSlots(
        professionalId,
        selectedDate,
        60 // 1 hora de duração padrão
      );
      setAvailableSlots(slots);
    } catch (error) {
      console.error('Erro ao carregar horários:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedSlot || !serviceType || !clientName || !clientPhone || !price) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    setBooking(true);
    try {
      const bookingId = await schedulingService.createBooking({
        professionalId,
        clientId: 'temp-client-id', // TODO: Pegar do contexto de autenticação
        clientName,
        clientPhone,
        serviceType,
        date: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        duration: 60,
        status: 'pending',
        price: parseFloat(price),
        notes,
      });

      alert('✅ Agendamento realizado com sucesso!');
      onBookingComplete(bookingId);
    } catch (error: any) {
      alert(`❌ ${error.message}`);
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Seleção de Data */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-blue-600" />
          Selecione uma Data
        </h3>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => (
            <button
              key={day.date}
              onClick={() => {
                setSelectedDate(day.date);
                setSelectedSlot(null);
              }}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedDate === day.date
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              } ${day.isToday ? 'ring-2 ring-blue-200' : ''}`}
            >
              <div className="text-xs text-gray-600 uppercase">{day.dayName}</div>
              <div className="text-lg font-bold text-gray-900">{day.dayNumber}</div>
              <div className="text-xs text-gray-500">{day.month}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Horários Disponíveis */}
      {selectedDate && (
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ClockIcon className="w-5 h-5 text-blue-600" />
            Horários Disponíveis
          </h3>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2Icon className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          ) : availableSlots.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
              <XCircleIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Nenhum horário disponível para esta data</p>
              <p className="text-sm text-gray-500 mt-1">Tente selecionar outra data</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {availableSlots.map((slot, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedSlot(slot)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedSlot === slot
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="text-sm font-semibold text-gray-900">
                    {slot.startTime}
                  </div>
                  <div className="text-xs text-gray-500">
                    {slot.endTime}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Formulário de Agendamento */}
      {selectedSlot && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Confirmar Agendamento
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tipo de Serviço *
              </label>
              <input
                type="text"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                placeholder="Ex: Pintura de sala"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Seu Nome *
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Nome completo"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Telefone *
              </label>
              <input
                type="tel"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="(00) 00000-0000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Valor do Serviço *
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Observações
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Detalhes adicionais sobre o serviço..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="bg-white rounded-lg p-4 border border-blue-300">
              <div className="flex items-start gap-3">
                <CheckCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-gray-900 mb-1">Resumo do Agendamento:</p>
                  <p className="text-gray-700">
                    <strong>Profissional:</strong> {professionalName}
                  </p>
                  <p className="text-gray-700">
                    <strong>Data:</strong> {new Date(selectedDate).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="text-gray-700">
                    <strong>Horário:</strong> {selectedSlot.startTime} - {selectedSlot.endTime}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleBooking}
              disabled={booking}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {booking ? (
                <>
                  <Loader2Icon className="w-5 h-5 animate-spin" />
                  Agendando...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="w-5 h-5" />
                  Confirmar Agendamento
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
