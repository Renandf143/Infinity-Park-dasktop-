import { useState, useEffect } from 'react';
import {
  ClockIcon,
  MapPinIcon,
  UserIcon,
  PhoneIcon,
  MessageCircleIcon,
  CheckCircleIcon,
  DollarSignIcon,
  CopyIcon,
  QrCodeIcon,
  AlertCircleIcon,
  TrendingUpIcon,
  NavigationIcon,
} from 'lucide-react';
import { Service } from '../types/service';
import { RealtimeMap } from './RealtimeMap';
import { useRealtimeLocation } from '../hooks/useRealtimeLocation';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { PixQRCode } from './PixQRCode';

interface ClientServiceMonitorProps {
  service: Service;
  onPaymentComplete?: () => void;
}

export function ClientServiceMonitor({ service, onPaymentComplete }: ClientServiceMonitorProps) {
  const { tracking } = useRealtimeLocation(service.professionalId, false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [copied, setCopied] = useState(false);
  const [liveService, setLiveService] = useState<Service>(service);

  // Observar mudanças no serviço em tempo real
  useEffect(() => {
    if (!service.id) return;

    const serviceRef = doc(db, 'services', service.id);
    const unsubscribe = onSnapshot(serviceRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setLiveService({
          ...data,
          id: snapshot.id,
          scheduledDate: data.scheduledDate?.toDate(),
          acceptedAt: data.acceptedAt?.toDate(),
          startedAt: data.startedAt?.toDate(),
          completedAt: data.completedAt?.toDate(),
          paidAt: data.paidAt?.toDate(),
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        } as Service);
      }
    });

    return () => unsubscribe();
  }, [service.id]);

  // Atualizar cronômetro
  useEffect(() => {
    if (liveService.status === 'in_progress' && liveService.startedAt) {
      const interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - liveService.startedAt!.getTime()) / 1000);
        setElapsedTime(elapsed);
      }, 1000);

      return () => clearInterval(interval);
    } else if (liveService.actualDuration) {
      setElapsedTime(liveService.actualDuration * 60);
    }
  }, [liveService.status, liveService.startedAt, liveService.actualDuration]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const copyPixCode = async () => {
    if (liveService.pixCopyPaste) {
      await navigator.clipboard.writeText(liveService.pixCopyPaste);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusInfo = () => {
    switch (liveService.status) {
      case 'accepted':
        return {
          color: 'blue',
          icon: CheckCircleIcon,
          text: 'Serviço Aceito',
          description: 'O profissional aceitou seu serviço e está se preparando',
        };
      case 'on_way':
        return {
          color: 'purple',
          icon: NavigationIcon,
          text: 'A Caminho',
          description: 'O profissional está se deslocando até você',
        };
      case 'arrived':
        return {
          color: 'green',
          icon: MapPinIcon,
          text: 'Chegou',
          description: 'O profissional chegou ao local',
        };
      case 'in_progress':
        return {
          color: 'orange',
          icon: TrendingUpIcon,
          text: 'Em Andamento',
          description: 'O serviço está sendo realizado',
        };
      case 'awaiting_payment':
        return {
          color: 'yellow',
          icon: DollarSignIcon,
          text: 'Aguardando Pagamento',
          description: 'Serviço concluído! Efetue o pagamento',
        };
      case 'completed':
        return {
          color: 'green',
          icon: CheckCircleIcon,
          text: 'Concluído',
          description: 'Serviço finalizado com sucesso',
        };
      default:
        return {
          color: 'gray',
          icon: ClockIcon,
          text: 'Pendente',
          description: 'Aguardando aceitação',
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header com Status */}
      <div className={`bg-gradient-to-r from-${statusInfo.color}-500 to-${statusInfo.color}-600 text-white p-6`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Acompanhar Serviço</h1>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full">
              <statusInfo.icon className="w-5 h-5" />
              <span className="font-semibold">{statusInfo.text}</span>
            </div>
          </div>

          {/* Cronômetro */}
          {(liveService.status === 'in_progress' || liveService.status === 'awaiting_payment' || liveService.status === 'completed') && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <ClockIcon className="w-6 h-6" />
                <span className="font-semibold">Tempo de Serviço</span>
              </div>
              <div className="text-5xl font-bold font-mono tracking-wider">
                {formatTime(elapsedTime)}
              </div>
              {liveService.status === 'in_progress' && (
                <div className="flex items-center justify-center gap-2 mt-2 text-sm opacity-90">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span>Em execução</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Status Description */}
        <div className={`bg-${statusInfo.color}-50 border-2 border-${statusInfo.color}-200 rounded-xl p-4`}>
          <p className={`text-${statusInfo.color}-900 font-semibold`}>{statusInfo.description}</p>
        </div>

        {/* Informações do Profissional */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-blue-600" />
            Profissional
          </h2>
          <div className="flex items-center gap-4">
            {liveService.professionalPhoto ? (
              <img
                src={liveService.professionalPhoto}
                alt={liveService.professionalName}
                className="w-16 h-16 rounded-full object-cover border-4 border-blue-100"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <UserIcon className="w-8 h-8 text-white" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg">{liveService.professionalName}</h3>
              <p className="text-gray-600">{liveService.serviceType}</p>
            </div>
            <div className="flex gap-2">
              {liveService.professionalPhone && (
                <a
                  href={`tel:${liveService.professionalPhone}`}
                  className="w-12 h-12 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors shadow-lg"
                >
                  <PhoneIcon className="w-6 h-6 text-white" />
                </a>
              )}
              <button className="w-12 h-12 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors shadow-lg">
                <MessageCircleIcon className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Rastreamento em Tempo Real */}
        {(liveService.status === 'on_way' || liveService.status === 'in_progress') && tracking?.isActive && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <NavigationIcon className="w-5 h-5 text-blue-600" />
              Localização em Tempo Real
            </h2>
            <RealtimeMap
              professionalLocation={tracking}
              height="300px"
            />
          </div>
        )}

        {/* Timeline do Serviço */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="font-bold text-gray-900 mb-4">Linha do Tempo</h2>
          <div className="space-y-4">
            {liveService.acceptedAt && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircleIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Serviço Aceito</p>
                  <p className="text-sm text-gray-600">
                    {liveService.acceptedAt.toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            )}

            {liveService.startedAt && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <TrendingUpIcon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Serviço Iniciado</p>
                  <p className="text-sm text-gray-600">
                    {liveService.startedAt.toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            )}

            {liveService.completedAt && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircleIcon className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Serviço Concluído</p>
                  <p className="text-sm text-gray-600">
                    {liveService.completedAt.toLocaleString('pt-BR')}
                  </p>
                  <p className="text-sm text-gray-600">
                    Duração: {formatTime(elapsedTime)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pagamento PIX */}
        {liveService.status === 'awaiting_payment' && liveService.pixQRCode && (
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 shadow-lg border-2 border-green-300">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCodeIcon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-green-900 mb-2">Pagamento via PIX</h2>
              <p className="text-green-800">
                Escaneie o QR Code ou copie o código para efetuar o pagamento
              </p>
            </div>

            {/* Valor */}
            <div className="bg-white rounded-xl p-4 mb-6 text-center">
              <p className="text-gray-600 mb-1">Valor a Pagar</p>
              <p className="text-4xl font-bold text-green-600">
                R$ {liveService.price.toFixed(2)}
              </p>
            </div>

            {/* QR Code */}
            {liveService.pixQRCode && (
              <div className="bg-white rounded-xl p-6 mb-4">
                <PixQRCode value={liveService.pixQRCode} size={300} />
              </div>
            )}

            {/* Código Copia e Cola */}
            <div className="bg-white rounded-xl p-4 mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Código PIX (Copia e Cola)</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={liveService.pixCopyPaste}
                  readOnly
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-mono"
                />
                <button
                  onClick={copyPixCode}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                    copied
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {copied ? (
                    <>
                      <CheckCircleIcon className="w-5 h-5" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <CopyIcon className="w-5 h-5" />
                      Copiar
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Instruções */}
            <div className="bg-green-600 text-white rounded-xl p-4">
              <h3 className="font-bold mb-2">Como pagar:</h3>
              <ol className="space-y-1 text-sm">
                <li>1. Abra o app do seu banco</li>
                <li>2. Escolha a opção PIX</li>
                <li>3. Escaneie o QR Code ou cole o código</li>
                <li>4. Confirme o pagamento</li>
                <li>5. Aguarde a confirmação automática</li>
              </ol>
            </div>
          </div>
        )}

        {/* Serviço Concluído */}
        {liveService.status === 'completed' && (
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 shadow-lg border-2 border-green-300 text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircleIcon className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-green-900 mb-2">Serviço Concluído!</h2>
            <p className="text-green-800 mb-4">
              Pagamento confirmado com sucesso
            </p>
            <div className="bg-white rounded-xl p-4 inline-block">
              <p className="text-gray-600 text-sm mb-1">Tempo Total</p>
              <p className="text-2xl font-bold text-gray-900">{formatTime(elapsedTime)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
