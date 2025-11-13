import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { CalendarIcon, ClockIcon, StarIcon } from 'lucide-react';

interface Service {
  id: string;
  professionalName: string;
  category: string;
  date: Date;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
  rating?: number;
}

export function ClientDashboard() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirecionar para página de mensagens se tab=messages
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'messages') {
      navigate('/cliente/mensagens', { replace: true });
    }
  }, [searchParams, navigate]);

  useEffect(() => {
    const fetchServices = async () => {
      if (!user) return;

      try {
        const servicesRef = collection(db, 'services');
        const q = query(
          servicesRef,
          where('clientId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        
        const snapshot = await getDocs(q);
        const servicesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().createdAt?.toDate() || new Date()
        })) as Service[];

        setServices(servicesData);
      } catch (error) {
        console.error('Erro ao buscar serviços:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [user]);

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts = {
      pending: 'Pendente',
      confirmed: 'Confirmado',
      completed: 'Concluído',
      cancelled: 'Cancelado'
    };
    return texts[status as keyof typeof texts] || status;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Meus Serviços</h1>
          <p className="text-gray-600 mt-2">Acompanhe seus agendamentos e histórico</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : services.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum serviço agendado
            </h3>
            <p className="text-gray-600 mb-6">
              Comece a contratar profissionais para seus projetos
            </p>
            <a
              href="/categorias"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Explorar Profissionais
            </a>
          </div>
        ) : (
          <div className="grid gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {service.professionalName}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          service.status
                        )}`}
                      >
                        {getStatusText(service.status)}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{service.category}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" />
                        {service.date.toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex items-center gap-2">
                        <ClockIcon className="w-4 h-4" />
                        {service.date.toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>

                    {service.rating && (
                      <div className="flex items-center gap-2 mt-3">
                        <StarIcon className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="font-semibold">{service.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      R$ {service.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
