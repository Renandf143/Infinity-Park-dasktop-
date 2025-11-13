import { useState, useEffect, useRef } from 'react';
import { BellIcon, XIcon, CheckIcon, MessageCircleIcon, DollarSignIcon, StarIcon, AlertCircleIcon, CalendarIcon } from 'lucide-react';
import { collection, query, where, onSnapshot, orderBy, limit, updateDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'service' | 'message' | 'payment' | 'review' | 'system';
  read: boolean;
  createdAt: any;
  link?: string;
  data?: any;
}

interface NotificationBellProps {
  userId: string;
}

export function NotificationBell({ userId }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Carregar notificações
  useEffect(() => {
    if (!userId) {
      console.log('❌ NotificationBell: userId não fornecido');
      return;
    }

    console.log('🔔 NotificationBell: Iniciando listener para userId:', userId);
    setLoading(true);

    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(20)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          console.log('📬 Notificações recebidas:', snapshot.size);
          
          const notifs: Notification[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            notifs.push({
              id: doc.id,
              userId: data.userId,
              title: data.title,
              message: data.message,
              type: data.type,
              read: data.read || false,
              createdAt: data.createdAt,
              link: data.link,
              data: data.data
            });
          });

          setNotifications(notifs);
          setUnreadCount(notifs.filter(n => !n.read).length);
          setLoading(false);
          
          console.log('✅ Notificações carregadas:', notifs.length, 'não lidas:', notifs.filter(n => !n.read).length);
        },
        (error) => {
          console.error('❌ Erro no listener de notificações:', error);
          setLoading(false);
        }
      );

      return () => {
        console.log('🔌 Desconectando listener de notificações');
        unsubscribe();
      };
    } catch (error) {
      console.error('❌ Erro ao configurar listener:', error);
      setLoading(false);
    }
  }, [userId]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = async (notification: Notification) => {
    try {
      // Marcar como lida
      if (!notification.read) {
        await updateDoc(doc(db, 'notifications', notification.id), {
          read: true
        });
      }
      
      // Redirecionar se tiver link
      if (notification.link) {
        navigate(notification.link);
      }
      
      setIsOpen(false);
    } catch (error) {
      console.error('Erro ao processar notificação:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.read);
      
      const promises = unreadNotifications.map(notification =>
        updateDoc(doc(db, 'notifications', notification.id), {
          read: true
        })
      );

      await Promise.all(promises);
      console.log('✅ Todas as notificações marcadas como lidas');
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageCircleIcon className="w-5 h-5 text-blue-600" />;
      case 'payment':
        return <DollarSignIcon className="w-5 h-5 text-green-600" />;
      case 'review':
        return <StarIcon className="w-5 h-5 text-yellow-600" />;
      case 'service':
        return <CalendarIcon className="w-5 h-5 text-purple-600" />;
      default:
        return <AlertCircleIcon className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'message':
        return 'bg-blue-50 border-blue-200';
      case 'payment':
        return 'bg-green-50 border-green-200';
      case 'review':
        return 'bg-yellow-50 border-yellow-200';
      case 'service':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (minutes < 1) return 'Agora';
      if (minutes < 60) return `${minutes}m atrás`;
      if (hours < 24) return `${hours}h atrás`;
      if (days < 7) return `${days}d atrás`;
      return date.toLocaleDateString('pt-BR');
    } catch (error) {
      return '';
    }
  };

  if (!userId) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => {
          console.log('🔔 Sino clicado! Estado atual:', isOpen, '→ Novo estado:', !isOpen);
          console.log('📊 Notificações:', notifications.length, 'Não lidas:', unreadCount);
          setIsOpen(!isOpen);
        }}
        className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
        title="Notificações"
      >
        <BellIcon className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border-2 border-gray-200 z-[9999] max-h-[600px] flex flex-col"
          style={{ 
            position: 'absolute',
            top: '100%',
            right: 0,
            zIndex: 9999
          }}
        >
          {/* Header */}
          <div className="p-4 border-b-2 border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Notificações</h3>
              <p className="text-xs text-gray-600">
                {loading ? 'Carregando...' : unreadCount > 0 ? `${unreadCount} não lida${unreadCount > 1 ? 's' : ''}` : 'Tudo em dia!'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  title="Marcar todas como lidas"
                >
                  <CheckIcon className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando notificações...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <BellIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 font-semibold">Nenhuma notificação</p>
                <p className="text-sm text-gray-500 mt-1">
                  Você receberá notificações sobre seus serviços aqui
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${getNotificationColor(notification.type)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className={`text-sm font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatTime(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && !loading && (
            <div className="p-3 border-t-2 border-gray-200 bg-gray-50">
              <p className="text-center text-xs text-gray-500">
                {notifications.length} notificação{notifications.length > 1 ? 'ões' : ''} no total
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
