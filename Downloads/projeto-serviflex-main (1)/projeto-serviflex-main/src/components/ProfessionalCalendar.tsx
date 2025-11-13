import { useState, useEffect } from 'react';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  NavigationIcon,
  MessageCircleIcon,
  DollarSignIcon,
  CalendarIcon,
  FilterIcon
} from 'lucide-react';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

interface Service {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientPhoto?: string;
  serviceType: string;
  date: string;
  time: string;
  endTime?: string;
  address: string;
  city: string;
  state: string;
  estimatedValue: number;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  description: string;
  latitude?: number;
  longitude?: number;
  createdAt: any;
}

interface ProfessionalCalendarProps {
  professionalId: string;
}

export function ProfessionalCalendar({ professionalId }: ProfessionalCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('week');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Carregar serviços
  useEffect(() => {
    loadServices();
  }, [professionalId, currentDate]);

  const loadServices = async () => {
    setLoading(true);
    try {
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const q = query(
        collection(db, 'serviceRequests'),
        where('professionalId', '==', professionalId),
        where('status', 'in', ['accepted', 'in_progress', 'completed'])
      );

      const snapshot = await getDocs(q);
      const servicesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Service[];

      setServices(servicesData);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
    } finally {
      setLoading(false);
    }
  };

  // Detectar conflitos de horário
  const detectConflicts = (date: string): Service[] => {
    const dayServices = services.filter(s => s.date === date);
    const conflicts: Service[] = [];

    dayServices.forEach((service, i) => {
      const serviceStart = parseTime(service.time);
      const serviceEnd = service.endTime ? parseTime(service.endTime) : serviceStart + 2; // 2h padrão

      dayServices.slice(i + 1).forEach(otherService => {
        const otherStart = parseTime(otherService.time);
        const otherEnd = otherService.endTime ? parseTime(otherService.endTime) : otherStart + 2;

        // Verifica sobreposição
        if (
          (serviceStart >= otherStart && serviceStart < otherEnd) ||
          (serviceEnd > otherStart && serviceEnd <= otherEnd) ||
          (serviceStart <= otherStart && serviceEnd >= otherEnd)
        ) {
          if (!conflicts.find(c => c.id === service.id)) conflicts.push(service);
          if (!conflicts.find(c => c.id === otherService.id)) conflicts.push(otherService);
        }
      });
    });

    return conflicts;
  };

  const parseTime = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours + minutes / 60;
  };

  // Obter serviços do dia
  const getServicesForDate = (date: Date): Service[] => {
    const dateStr = date.toISOString().split('T')[0];
    return services
      .filter(s => s.date === dateStr)
      .sort((a, b) => parseTime(a.time) - parseTime(b.time));
  };

  // Navegação de mês
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  // Gerar dias do mês
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Dias do mês anterior
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Dias do mês atual
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const days = getDaysInMonth();
  const monthName = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Header com Controles */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 capitalize">{monthName}</h2>
            <p className="text-sm text-gray-600">
              {services.filter(s => s.status === 'accepted').length} serviços agendados
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Filtro de Status */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">Todos</option>
              <option value="accepted">Aceitos</option>
              <option value="in_progress">Em Andamento</option>
              <option value="completed">Concluídos</option>
            </select>

            {/* Modo de Visualização */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('day')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'day' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                Dia
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'week' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                Semana
              </button>
              <button
                onClick={() => setViewMode('month')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'month' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                Mês
              </button>
            </div>

            {/* Navegação */}
            <div className="flex gap-2">
              <button
                onClick={previousMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Hoje
              </button>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRightIcon className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Legenda */}
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Aceito</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Em Andamento</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span className="text-gray-600">Concluído</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangleIcon className="w-4 h-4 text-red-500" />
            <span className="text-gray-600">Conflito de Horário</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendário */}
        <div className="lg:col-span-2">
          <CalendarView
            days={days}
            services={services}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            detectConflicts={detectConflicts}
            setSelectedService={setSelectedService}
          />
        </div>

        {/* Detalhes do Dia Selecionado */}
        <div className="space-y-6">
          <DayDetails
            selectedDate={selectedDate}
            services={getServicesForDate(selectedDate)}
            detectConflicts={detectConflicts}
            setSelectedService={setSelectedService}
          />
        </div>
      </div>

      {/* Modal de Detalhes do Serviço */}
      {selectedService && (
        <ServiceDetailsModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
          conflicts={detectConflicts(selectedService.date)}
        />
      )}
    </div>
  );
}

// Componente do Calendário
function CalendarView({ days, services, selectedDate, setSelectedDate, detectConflicts, setSelectedService }: any) {
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Cabeçalho dos dias da semana */}
      <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
        {weekDays.map(day => (
          <div key={day} className="p-3 text-center text-sm font-semibold text-gray-700">
            {day}
          </div>
        ))}
      </div>

      {/* Dias do mês */}
      <div className="grid grid-cols-7">
        {days.map((day: Date | null, index: number) => {
          if (!day) {
            return <div key={index} className="aspect-square border-b border-r border-gray-100 bg-gray-50" />;
          }

          const dateStr = day.toISOString().split('T')[0];
          const dayServices = services.filter((s: any) => s.date === dateStr);
          const conflicts = detectConflicts(dateStr);
          const hasConflict = conflicts.length > 0;
          const isToday = day.toDateString() === new Date().toDateString();
          const isSelected = day.toDateString() === selectedDate.toDateString();

          return (
            <button
              key={index}
              onClick={() => setSelectedDate(day)}
              className={`aspect-square border-b border-r border-gray-100 p-2 hover:bg-gray-50 transition-colors relative ${
                isSelected ? 'bg-blue-50 ring-2 ring-blue-500 ring-inset' : ''
              }`}
            >
              <div className={`text-sm font-semibold mb-1 ${
                isToday ? 'w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto' :
                isSelected ? 'text-blue-600' : 'text-gray-900'
              }`}>
                {day.getDate()}
              </div>

              {/* Indicadores de serviços */}
              {dayServices.length > 0 && (
                <div className="space-y-1">
                  {dayServices.slice(0, 2).map((service: any) => (
                    <div
                      key={service.id}
                      className={`text-xs px-1 py-0.5 rounded truncate ${
                        service.status === 'accepted' ? 'bg-green-100 text-green-700' :
                        service.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {service.time}
                    </div>
                  ))}
                  {dayServices.length > 2 && (
                    <div className="text-xs text-gray-500 font-medium">
                      +{dayServices.length - 2} mais
                    </div>
                  )}
                </div>
              )}

              {/* Alerta de conflito */}
              {hasConflict && (
                <AlertTriangleIcon className="w-4 h-4 text-red-500 absolute top-1 right-1" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Componente de Detalhes do Dia
function DayDetails({ selectedDate, services, detectConflicts, setSelectedService }: any) {
  const conflicts = detectConflicts(selectedDate.toISOString().split('T')[0]);
  const hasConflicts = conflicts.length > 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {selectedDate.toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long' 
          })}
        </h3>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
          {services.length} serviços
        </span>
      </div>

      {/* Alerta de Conflito */}
      {hasConflicts && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <div className="flex items-start gap-2">
            <AlertTriangleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-900">Conflito de Horário Detectado!</p>
              <p className="text-xs text-red-700 mt-1">
                {conflicts.length} serviços com horários sobrepostos
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Serviços */}
      {services.length === 0 ? (
        <div className="text-center py-12">
          <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Nenhum serviço agendado</p>
        </div>
      ) : (
        <div className="space-y-3">
          {services.map((service: Service) => {
            const isConflict = conflicts.some(c => c.id === service.id);
            
            return (
              <button
                key={service.id}
                onClick={() => setSelectedService(service)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                  isConflict ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Foto do Cliente */}
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {service.clientPhoto ? (
                      <img 
                        src={service.clientPhoto} 
                        alt={service.clientName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      service.clientName.charAt(0).toUpperCase()
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <p className="font-semibold text-gray-900">{service.clientName}</p>
                        <p className="text-sm text-gray-600">{service.serviceType}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        service.status === 'accepted' ? 'bg-green-100 text-green-700' :
                        service.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {service.status === 'accepted' ? 'Aceito' :
                         service.status === 'in_progress' ? 'Em Andamento' : 'Concluído'}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-600 mt-2">
                      <span className="flex items-center gap-1">
                        <ClockIcon className="w-3 h-3" />
                        {service.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSignIcon className="w-3 h-3" />
                        R$ {service.estimatedValue.toFixed(2)}
                      </span>
                    </div>

                    {isConflict && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-red-600 font-medium">
                        <AlertTriangleIcon className="w-3 h-3" />
                        Conflito de horário
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Modal de Detalhes do Serviço
function ServiceDetailsModal({ service, onClose, conflicts }: any) {
  const isConflict = conflicts.some((c: Service) => c.id === service.id);
  
  const openMaps = () => {
    const address = encodeURIComponent(`${service.address}, ${service.city}, ${service.state}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
  };

  const callClient = () => {
    window.location.href = `tel:${service.clientPhone}`;
  };

  const emailClient = () => {
    window.location.href = `mailto:${service.clientEmail}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Detalhes do Serviço</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XCircleIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Alerta de Conflito */}
          {isConflict && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <div className="flex items-start gap-3">
                <AlertTriangleIcon className="w-6 h-6 text-red-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-red-900">⚠️ Conflito de Horário!</p>
                  <p className="text-sm text-red-700 mt-1">
                    Este serviço tem conflito com outro(s) {conflicts.length - 1} serviço(s) no mesmo horário.
                  </p>
                  <p className="text-sm text-red-700 mt-2 font-medium">
                    Recomendamos reagendar um dos serviços para evitar problemas.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Informações do Cliente */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
            <p className="text-sm font-semibold text-blue-900 mb-4">INFORMAÇÕES DO CLIENTE</p>
            
            <div className="flex items-start gap-4 mb-4">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                {service.clientPhoto ? (
                  <img 
                    src={service.clientPhoto} 
                    alt={service.clientName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  service.clientName.charAt(0).toUpperCase()
                )}
              </div>
              
              <div className="flex-1">
                <h4 className="text-xl font-bold text-gray-900 mb-1">{service.clientName}</h4>
                <div className="space-y-2">
                  <button
                    onClick={callClient}
                    className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <PhoneIcon className="w-4 h-4" />
                    {service.clientPhone}
                  </button>
                  <button
                    onClick={emailClient}
                    className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <MailIcon className="w-4 h-4" />
                    {service.clientEmail}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={callClient}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                <PhoneIcon className="w-5 h-5" />
                Ligar
              </button>
              <button
                onClick={() => window.open(`https://wa.me/${service.clientPhone.replace(/\D/g, '')}`, '_blank')}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
              >
                <MessageCircleIcon className="w-5 h-5" />
                WhatsApp
              </button>
            </div>
          </div>

          {/* Detalhes do Serviço */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Serviço</p>
                <p className="font-semibold text-gray-900">{service.serviceType}</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Valor</p>
                <p className="font-semibold text-gray-900">R$ {service.estimatedValue.toFixed(2)}</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Data</p>
                <p className="font-semibold text-gray-900">
                  {new Date(service.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Horário</p>
                <p className="font-semibold text-gray-900">{service.time}</p>
              </div>
            </div>

            {/* Endereço */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-2">
                  <MapPinIcon className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Endereço</p>
                    <p className="font-semibold text-gray-900">{service.address}</p>
                    <p className="text-sm text-gray-600">{service.city}/{service.state}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={openMaps}
                className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <NavigationIcon className="w-5 h-5" />
                Abrir no Google Maps
              </button>
            </div>

            {/* Descrição */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Descrição do Serviço</p>
              <p className="text-gray-900">{service.description}</p>
            </div>

            {/* Status */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Status</p>
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                service.status === 'accepted' ? 'bg-green-100 text-green-700' :
                service.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {service.status === 'accepted' ? '✅ Aceito' :
                 service.status === 'in_progress' ? '🔄 Em Andamento' : '✔️ Concluído'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
