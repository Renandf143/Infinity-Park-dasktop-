import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { ServiceRequest, ServiceStatus } from '../../types/service';
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
  SearchIcon
} from 'lucide-react';

type FilterType = 'all' | 'pending' | 'active' | 'completed' | 'cancelled';

export function ClientServicesPage() {
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
      where('clientId', '==', user.uid),
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

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...services];

    // Filtro por status
    switch (activeFilter) {
      case 'pending':
        filtered = filtered.filter(s => s.status === 'pending');
        break;
      case 'active':
        filtered = filtered.filter(s => 
          ['accepted', 'scheduled', 'in_progress'].includes(s.status)
        );
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
        s.professionalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredServices(filtered);
  }, [services, activeFilter, searchTerm]);

  const getFilterStats = () => {
    return {
      all: services.length,
      pending: services.filter(s => s.status === 'pending').length,
      active: services.filter(s => ['accepted', 'scheduled', 'in_progress'].includes(s.status)).length,
      completed: services.filter(s => ['completed', 'paid'].includes(s.status)).length,
      cancelled: services.filter(s => s.status === 'cancelled').length,
    };
  };

  const stats = getFilterStats();

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
            Acompanhe seus agendamentos e histórico de serviços
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
            <div className="flex items-center gap-3">
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
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <PlayCircleIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                <p className="text-sm text-gray-600">Ativos</p>
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
                placeholder="Buscar por serviço, profissional..."
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
                <option value="active">Ativos ({stats.active})</option>
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
            onClick={() => setActiveFilter('active')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              activeFilter === 'active'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <PlayCircleIcon className="w-4 h-4 inline mr-1" />
            Ativos ({stats.active})
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
                : 'Você ainda não contratou nenhum serviço nesta categoria.'}
            </p>
            <button
              onClick={() => window.location.href = '/categorias'}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Explorar Profissionais
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredServices.map((service) => (
              <ServiceRequestCard
                key={service.id}
                service={service}
                userRole="client"
                onClick={() => setSelectedService(service)}
              />
            ))}
          </div>
        )}

        {/* Modal de Detalhes */}
        {selectedService && (
          <ServiceDetailModal
            service={selectedService}
            userRole="client"
            userId={user?.uid || ''}
            userName={userData?.name || user?.displayName || 'Cliente'}
            onClose={() => setSelectedService(null)}
            onUpdate={() => {}}
          />
        )}
        </div>
      </div>
    </>
  );
}
