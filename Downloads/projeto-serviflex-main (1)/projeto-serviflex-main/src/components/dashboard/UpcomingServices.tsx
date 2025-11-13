import { MapPinIcon, DollarSignIcon, ClockIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../hooks/useAuth';

interface Service {
  id: string;
  date: Date;
  time: string;
  serviceType: string;
  clientName: string;
  city: string;
  value: number;
  status: 'confirmed' | 'pending';
}

export function UpcomingServices() {
  const { user } = useAuth();
  const [upcomingServices, setUpcomingServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user) return;
    
    const loadUpcomingServices = async () => {
      try {
        setLoading(true);
        const today = new Date().toISOString().split('T')[0];
        
        // Buscar serviços aceitos (sem filtro de data para evitar índice composto)
        const q = query(
          collection(db, 'serviceRequests'),
          where('professionalId', '==', user.uid),
          where('status', 'in', ['accepted', 'in_progress'])
        );
        
        const snapshot = await getDocs(q);
        
        // Filtrar e ordenar no client-side
        const services: Service[] = snapshot.docs
          .map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              date: new Date(data.date + 'T00:00:00'),
              time: data.time,
              serviceType: data.serviceType,
              clientName: data.clientName,
              city: data.city,
              value: data.estimatedValue || 0,
              status: data.status === 'accepted' ? 'confirmed' : 'pending',
              dateStr: data.date
            };
          })
          .filter(service => service.dateStr >= today) // Filtrar data >= hoje
          .sort((a, b) => {
            // Ordenar por data e hora
            if (a.dateStr !== b.dateStr) {
              return a.dateStr.localeCompare(b.dateStr);
            }
            return a.time.localeCompare(b.time);
          })
          .slice(0, 5); // Limitar a 5
        
        setUpcomingServices(services);
      } catch (error) {
        console.error('Erro ao carregar próximos serviços:', error);
        setUpcomingServices([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadUpcomingServices();
  }, [user]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Próximos Agendamentos</h3>
        <span className="text-sm text-gray-500">{upcomingServices.length} serviços</span>
      </div>
      
      {upcomingServices.length === 0 ? (
        <div className="text-center py-8">
          <ClockIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Nenhum agendamento próximo</p>
        </div>
      ) : (
        <div className="space-y-4">
          {upcomingServices.map((service, i) => (
            <div key={service.id} className="flex gap-4">
              {/* Data */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex flex-col items-center justify-center">
                  <p className="text-xs text-blue-600 font-medium uppercase">
                    {service.date.toLocaleDateString('pt-BR', { weekday: 'short' })}
                  </p>
                  <p className="text-lg font-bold text-blue-600">{service.date.getDate()}</p>
                </div>
                {i < upcomingServices.length - 1 && (
                  <div className="w-0.5 flex-1 bg-gray-200 my-2" />
                )}
              </div>
              
              {/* Detalhes */}
              <div className="flex-1 pb-4">
                <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{service.serviceType}</p>
                      <p className="text-sm text-gray-600">{service.clientName}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      service.status === 'confirmed' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {service.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPinIcon className="w-4 h-4" />
                      {service.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSignIcon className="w-4 h-4" />
                      R$ {service.value.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <button className="w-full mt-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors">
        Ver Calendário Completo
      </button>
    </div>
  );
}
