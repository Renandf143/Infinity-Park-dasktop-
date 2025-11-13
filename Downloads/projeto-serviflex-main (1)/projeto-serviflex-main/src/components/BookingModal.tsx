import React, { useState } from 'react';
import { XIcon, CalendarIcon, ClockIcon, MapPinIcon, CheckCircleIcon } from 'lucide-react';
interface Service {
  name: string;
  price: number;
  duration: string;
}
interface BookingModalProps {
  professional: {
    name: string;
    image: string;
    serviceType: string;
    services: Service[];
  };
  onClose: () => void;
}
export function BookingModal({
  professional,
  onClose
}: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    serviceIndex: 0,
    date: '',
    time: '',
    address: '',
    notes: ''
  });
  const selectedService = professional.services[bookingData.serviceIndex];
  const availableDates = Array.from({
    length: 14
  }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return date;
  });
  const availableTimes = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Handle booking submission
      console.log('Booking submitted:', bookingData);
    }
  };
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      weekday: 'short'
    });
  };
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-[#1E3A8A] to-[#1e40af]">
          <div className="flex items-center gap-4">
            <img src={professional.image} alt={professional.name} className="w-12 h-12 rounded-full object-cover border-2 border-white" />
            <div>
              <h3 className="font-semibold text-white">{professional.name}</h3>
              <p className="text-sm text-white/80">
                {professional.serviceType}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <XIcon className="w-6 h-6 text-white" />
          </button>
        </div>
        {/* Progress Steps */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {['Serviço', 'Data', 'Endereço', 'Confirmar'].map((label, index) => <div key={label} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm ${step > index + 1 ? 'bg-green-500 text-white' : step === index + 1 ? 'bg-[#1E3A8A] text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {step > index + 1 ? '✓' : index + 1}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${step === index + 1 ? 'text-[#1E3A8A]' : 'text-gray-500'}`}>
                    {label}
                  </span>
                  {index < 3 && <div className={`w-8 h-0.5 mx-2 ${step > index + 1 ? 'bg-green-500' : 'bg-gray-200'}`} />}
                </div>)}
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 max-h-[500px] overflow-y-auto">
            {/* Step 1: Select Service */}
            {step === 1 && <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Escolha o Serviço
                </h3>
                {professional.services.map((service, index) => <label key={index} className={`block p-6 border-2 rounded-xl cursor-pointer transition-all ${bookingData.serviceIndex === index ? 'border-[#1E3A8A] bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="service" value={index} checked={bookingData.serviceIndex === index} onChange={() => setBookingData({
                ...bookingData,
                serviceIndex: index
              })} className="sr-only" />
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {service.name}
                      </h4>
                      <p className="text-xl font-bold text-[#1E3A8A]">
                        R$ {service.price}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600">
                      Duração: {service.duration}
                    </p>
                  </label>)}
              </div>}
            {/* Step 2: Select Date & Time */}
            {step === 2 && <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Escolha Data e Horário
                  </h3>
                  {/* Date Selection */}
                  <div className="mb-6">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <CalendarIcon className="w-5 h-5" />
                      Data
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {availableDates.slice(0, 8).map(date => {
                    const dateStr = date.toISOString().split('T')[0];
                    return <label key={dateStr} className={`p-3 border-2 rounded-lg cursor-pointer text-center transition-all ${bookingData.date === dateStr ? 'border-[#1E3A8A] bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                            <input type="radio" name="date" value={dateStr} checked={bookingData.date === dateStr} onChange={e => setBookingData({
                        ...bookingData,
                        date: e.target.value
                      })} className="sr-only" />
                            <div className="text-xs text-gray-600 mb-1">
                              {formatDate(date).split(',')[0]}
                            </div>
                            <div className="font-semibold text-gray-900">
                              {date.getDate()}
                            </div>
                          </label>;
                  })}
                    </div>
                  </div>
                  {/* Time Selection */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <ClockIcon className="w-5 h-5" />
                      Horário
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {availableTimes.map(time => <label key={time} className={`p-3 border-2 rounded-lg cursor-pointer text-center transition-all ${bookingData.time === time ? 'border-[#1E3A8A] bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                          <input type="radio" name="time" value={time} checked={bookingData.time === time} onChange={e => setBookingData({
                      ...bookingData,
                      time: e.target.value
                    })} className="sr-only" />
                          <div className="font-semibold text-gray-900">
                            {time}
                          </div>
                        </label>)}
                    </div>
                  </div>
                </div>
              </div>}
            {/* Step 3: Address & Notes */}
            {step === 3 && <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Informações do Endereço
                </h3>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <MapPinIcon className="w-5 h-5" />
                    Endereço Completo *
                  </label>
                  <textarea value={bookingData.address} onChange={e => setBookingData({
                ...bookingData,
                address: e.target.value
              })} required rows={3} className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent resize-none" placeholder="Rua, número, complemento, bairro, cidade, CEP" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Observações (opcional)
                  </label>
                  <textarea value={bookingData.notes} onChange={e => setBookingData({
                ...bookingData,
                notes: e.target.value
              })} rows={4} className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent resize-none" placeholder="Alguma informação adicional que o profissional precisa saber?" />
                </div>
              </div>}
            {/* Step 4: Confirmation */}
            {step === 4 && <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircleIcon className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Confirme sua Reserva
                  </h3>
                  <p className="text-gray-600">
                    Revise os detalhes antes de finalizar
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <div className="flex items-start justify-between pb-4 border-b border-gray-200">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Serviço</p>
                      <p className="font-semibold text-gray-900">
                        {selectedService.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Duração: {selectedService.duration}
                      </p>
                    </div>
                    <p className="text-xl font-bold text-[#1E3A8A]">
                      R$ {selectedService.price}
                    </p>
                  </div>
                  <div className="pb-4 border-b border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Data e Horário</p>
                    <p className="font-semibold text-gray-900">
                      {bookingData.date && new Date(bookingData.date + 'T00:00:00').toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}{' '}
                      às {bookingData.time}
                    </p>
                  </div>
                  <div className="pb-4 border-b border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Endereço</p>
                    <p className="text-gray-900">{bookingData.address}</p>
                  </div>
                  {bookingData.notes && <div>
                      <p className="text-sm text-gray-600 mb-1">Observações</p>
                      <p className="text-gray-900">{bookingData.notes}</p>
                    </div>}
                </div>
                <div className="bg-blue-50 border-2 border-[#1E3A8A]/20 rounded-xl p-4">
                  <p className="text-sm text-gray-700">
                    <strong>Importante:</strong> O pagamento será processado de
                    forma segura através da plataforma. Você receberá uma
                    confirmação por email após a reserva.
                  </p>
                </div>
              </div>}
          </div>
          {/* Footer Actions */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between gap-4">
              {step > 1 && <button type="button" onClick={() => setStep(step - 1)} className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-all">
                  Voltar
                </button>}
              <button type="submit" disabled={step === 1 && bookingData.serviceIndex === null || step === 2 && (!bookingData.date || !bookingData.time) || step === 3 && !bookingData.address} className="flex-1 px-6 py-3 bg-[#1E3A8A] text-white rounded-lg font-semibold hover:bg-[#1e40af] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {step === 4 ? 'Confirmar Reserva' : 'Continuar'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>;
}