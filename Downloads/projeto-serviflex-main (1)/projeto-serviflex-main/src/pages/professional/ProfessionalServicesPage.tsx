import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { ServiceRequest } from '../../types/service';
import { ServiceRequestCard } from '../../components/ServiceRequestCard';
import { ServiceDetailModal } from '../../components/ServiceDetailModal';
import { useAuth } from '../../hooks/useAuth';
import { Header } from '../../components/Header';
import { 
  ClockIcon, 
  CheckCircleIcon, 
  PlayCircleIcon, 
  XCircleIcon,
  CalendarIcon,
  FilterIcon,
  SearchIcon,
  AlertCircleIcon
} from 'lucide-react';

type FilterType = 'all' | 'pending' | 'upcoming' | 'active' | 'completed' | 'cancelled';

export function ProfessionalServicesPage() {
  const { user, userData } = useAuth();
  const [services, setServices] = useState<ServiceRequest[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServiceRequest[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, 'serviceRequests'),
      where('professionalId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const servicesList: ServiceRequest[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        servicesList.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          scheduledDate: data.scheduledDate?.toDate() || new Date(),
          acceptedAt: data.acceptedAt?.toDate(),
          startedAt: data.startedAt?.toDate(),
          completedAt: data.completedAt?.toDate(),
          paidAt: data.paidAt?.toDate(),
        } as ServiceRequest);
      });
      setServices(servicesList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  // Verificar se o serviço está próximo de começar (10 minutos)
  const isServiceStartingSoon = (service: ServiceRequest): boolean => {
    if (service.status !== 'accepted' && service.status !== 'scheduled') return false;
    
    const now = new Date();
    const scheduledDateTime = new Date(service.scheduledDate);
    const [hours, minutes] = service.scheduledTime.split(':');
    scheduledDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const diffInMinutes = (scheduledDateTime.getTime() - now.getTime()) / (1000 * 60);
    
    return diffInMinutes <= 10 && diffInMinutes >= -5; // 10 min antes até 5 min depois
  };

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...services];

    // Filtro por status
    switch (activeFilter) {
      case 'pending':
        filtered = filtered.filter(s => s.status === 'pending');
        break;
      case 'upcoming':
        filtered = filtered.filter(s => 
          ['accepted', 'scheduled'].includes(s.status)
        );
        break;
      case 'active':
        filtered = filtered.filter(s => s.status === 'in_progress');
        break;
      case 'completed':
        filtered = filtered.filter(s => 
          ['completed', 'paid'].includes(s.status)
        );
        break;
      case 'cancelled':
        filtered = filtered.filter(s => s.status === 'cancelled');
        break;
    }

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredServices(filtered);
  }, [services, activeFilter, searchTerm]);

  const getFilterStats = () => {
    return {
      all: services.length,
      pending: services.filter(s => s.status === 'pending').length,
      upcoming: services.filter(s => ['accepted', 'scheduled'].includes(s.status)).length,
      active: services.filter(s => s.status === 'in_progress').length,
      completed: services.filter(s => ['completed', 'paid'].includes(s.status)).length,
      cancelled: services.filter(s => s.status === 'cancelled').length,
    };
  };

  const stats = getFilterStats();

  // Serviços que estão para começar
  const servicesStartingSoon = services.filter(isServiceStartingSoon);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Carregando seus serviços...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Meus Serviços</h1>
            <p className="text-gray-600">
              Gerencie suas solicitações e agendamentos
            </p>
          </div>

          {/* Alerta de Serviços Próximos */}
          {servicesStartingSoon.length > 0 && (
            <div className="mb-6 bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-300 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircleIcon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-orange-900 mb-2">
                    ⚡ Serviço{servicesStartingSoon.length > 1 ? 's' : ''} Próximo{servicesStartingSoon.length > 1 ? 's' : ''}!
                  </h3>
                  <p className="text-orange-800 mb-4">
                    Você tem {servicesStartingSoon.length} serviço{servicesStartingSoon.length > 1 ? 's' : ''} agendado{servicesStartingSoon.length > 1 ? 's' : ''} para começar em breve.
                  </p>
                  <div className="space-y-2">
                    {servicesStartingSoon.map(service => (
                      <button
                        key={service.id}
                        onClick={() => setSelectedService(service)}
                        className="w-full bg-white border-2 border-orange-300 rounded-lg p-4 hover:border-orange-500 transition-all text-left"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-bold text-gray-900">{service.serviceType}</p>
                            <p className="text-sm text-gray-600">
                              Cliente: {service.clientName} • {service.scheduledTime}
                            </p>
                          </div>
                          <div className="px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold text-sm">
                            Ver Detalhes →
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
              <div className="text-2xl focenter gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <CalendarIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.all}</p>
                  <p className="text-sm text-gray-600">Total</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <ClockIcon className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                  <p className="text-sm text-gray-600">Pendentes</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <CalendarIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.upcoming}</p>
                  <p className="text-sm text-gray-600">Agendados</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <PlayCircleIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                  <p className="text-sm text-gray-600">Em Andamento</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <CheckCircleIcon className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                  <p className="text-sm text-gray-600">Concluídos</p>
                </div>
              </div>
            </div>
          </div>

          {/* Busca e Filtros */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Busca */}
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por serviço, cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* Filtros */}
              <div className="flex items-center gap-2">
                <FilterIcon className="w-5 h-5 text-gray-500" />
                <select
                  value={activeFilter}
                  onChange={(e) => setActiveFilter(e.target.value as FilterType)}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 font-semibold"
                >
                  <option value="all">Todos ({stats.all})</option>
                  <option value="pending">Pendentes ({stats.pending})</option>
                  <option value="upcoming">Agendados ({stats.upcoming})</option>
                  <option value="active">Em Andamento ({stats.active})</option>
                  <option value="completed">Concluídos ({stats.completed})</option>
                  <option value="cancelled">Cancelados ({stats.cancelled})</option>
                </select>
              </div>
            </div>
          </div>

          {/* Filtros Rápidos */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                activeFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Todos ({stats.all})
            </button>
            <button
              onClick={() => setActiveFilter('pending')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                activeFilter === 'pending'
                  ? 'bg-yellow-600 text-white shadow-lg'
                  : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ClockIcon className="w-4 h-4 inline mr-1" />
              Pendentes ({stats.pending})
            </button>
            <button
              onClick={() => setActiveFilter('upcoming')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                activeFilter === 'upcoming'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <CalendarIcon className="w-4 h-4 inline mr-1" />
              Agendados ({stats.upcoming})
            </button>
            <button
              onClick={() => setActiveFilter('active')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                activeFilter === 'active'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <PlayCircleIcon className="w-4 h-4 inline mr-1" />
              Em Andamento ({stats.active})
            </button>
            <button
              onClick={() => setActiveFilter('completed')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                activeFilter === 'completed'
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <CheckCircleIcon className="w-4 h-4 inline mr-1" />
              Concluídos ({stats.completed})
            </button>
            <button
              onClick={() => setActiveFilter('cancelled')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                activeFilter === 'cancelled'
                  ? 'bg-gray-600 text-white shadow-lg'
                  : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <XCircleIcon className="w-4 h-4 inline mr-1" />
              Cancelados ({stats.cancelled})
            </button>
          </div>

          {/* Lista de Serviços */}
          {filteredServices.length === 0 ? (
            <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
              <svg
                className="w-24 h-24 text-gray-300 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {searchTerm ? 'Nenhum serviço encontrado' : 'Nenhum serviço nesta categoria'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? 'Tente buscar com outros termos'
                  : 'Você ainda não tem serviços nesta categoria.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredServices.map((service) => (
                <ServiceRequestCard
                  key={service.id}
                  service={service}
                  userRole="professional"
                  onClick={() => setSelectedService(service)}
                />
              ))}
            </div>
          )}

          {/* Modal de Detalhes */}
          {selectedService && (
            <ServiceDetailModal
              service={selectedService}
              userRole="professional"
              userId={user?.uid || ''}
              userName={userData?.name || user?.displayName || 'Profissional'}
              onClose={() => setSelectedService(null)}
              onUpdate={() => {}}
            />
          )}
        </div>
      </div>
    </>
  );
}
