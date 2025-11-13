import { useState, useEffect } from "react";
import {
  PlayIcon,
  PauseIcon,
  StopCircleIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  PhoneIcon,
  MessageCircleIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  NavigationIcon,
  CameraIcon,
  FileTextIcon,
  DollarSignIcon,
} from "lucide-react";
import { useServiceTimer } from "../hooks/useServiceTimer";
import { Service } from "../types/service";
import { RealtimeMap } from "./RealtimeMap";
import { useRealtimeLocation } from "../hooks/useRealtimeLocation";
import {
  doc,
  updateDoc,
  Timestamp,
  addDoc,
  collection,
} from "firebase/firestore";
import { db } from "../firebase";

interface ServiceExecutionPanelProps {
  service: Service;
  onComplete: () => void;
}

export function ServiceExecutionPanel({
  service,
  onComplete,
}: ServiceExecutionPanelProps) {
  const {
    elapsedTime,
    isRunning,
    isPaused,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    formatTime,
  } = useServiceTimer(service.id || null);

  const { tracking, startTracking, stopTracking } = useRealtimeLocation(
    service.professionalId,
    false
  );
  const [notes, setNotes] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [showConfirmComplete, setShowConfirmComplete] = useState(false);

  const timeFormatted = formatTime(elapsedTime);

  useEffect(() => {
    // Auto-start tracking quando serviço inicia
    if (service.status === "in_progress" && !tracking?.isActive) {
      startTracking();
    }
  }, [service.status, tracking, startTracking]);

  const handleStartService = async () => {
    await startTimer();
    await startTracking();
  };

  const handleCompleteService = async () => {
    setShowConfirmComplete(true);
  };

  const confirmComplete = async () => {
    await stopTimer();
    await stopTracking();

    // Gerar PIX para pagamento
    await generatePixPayment();

    setShowConfirmComplete(false);
    onComplete();
  };

  const generatePixPayment = async () => {
    if (!service.id) return;

    try {
      // Aqui você integraria com uma API de pagamento real (Mercado Pago, PagSeguro, etc)
      // Por enquanto, vamos simular
      const pixData = {
        qrCode: `00020126580014br.gov.bcb.pix0136${
          service.professionalId
        }520400005303986540${service.price.toFixed(2)}5802BR5925${
          service.professionalName
        }6009SAO PAULO62070503***6304`,
        copyPaste: `00020126580014br.gov.bcb.pix0136${
          service.professionalId
        }520400005303986540${service.price.toFixed(2)}5802BR5925${
          service.professionalName
        }6009SAO PAULO62070503***6304`,
      };

      const serviceRef = doc(db, "services", service.id);
      await updateDoc(serviceRef, {
        pixQRCode: pixData.qrCode,
        pixCopyPaste: pixData.copyPaste,
        paymentStatus: "pending",
        updatedAt: Timestamp.now(),
      });

      // Criar notificação para o cliente
      await addDoc(collection(db, "notifications"), {
        userId: service.clientId,
        type: "payment_required",
        title: "Pagamento Disponível",
        message: `O serviço foi concluído! Efetue o pagamento de R$ ${service.price.toFixed(
          2
        )}`,
        serviceId: service.id,
        read: false,
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Erro ao gerar PIX:", error);
    }
  };

  const getStatusColor = () => {
    switch (service.status) {
      case "accepted":
        return "blue";
      case "on_way":
        return "purple";
      case "arrived":
        return "green";
      case "in_progress":
        return "orange";
      case "awaiting_payment":
        return "yellow";
      case "completed":
        return "green";
      default:
        return "gray";
    }
  };

  const getStatusText = () => {
    switch (service.status) {
      case "accepted":
        return "Aceito - Pronto para Iniciar";
      case "on_way":
        return "A Caminho";
      case "arrived":
        return "Chegou ao Local";
      case "in_progress":
        return "Em Andamento";
      case "awaiting_payment":
        return "Aguardando Pagamento";
      case "completed":
        return "Concluído";
      default:
        return "Pendente";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header com Status */}
      <div
        className={`bg-gradient-to-r from-${getStatusColor()}-500 to-${getStatusColor()}-600 text-white p-6`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Execução do Serviço</h1>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <span className="font-semibold">{getStatusText()}</span>
            </div>
          </div>

          {/* Cronômetro Grande */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <ClockIcon className="w-8 h-8" />
              <span className="text-lg font-semibold">Tempo de Serviço</span>
            </div>
            <div className="text-7xl font-bold font-mono tracking-wider mb-4">
              {timeFormatted.formatted}
            </div>
            <div className="flex items-center justify-center gap-2 text-sm opacity-90">
              {isRunning && !isPaused && (
                <>
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span>Em execução</span>
                </>
              )}
              {isPaused && <span>⏸️ Pausado</span>}
              {!isRunning && elapsedTime > 0 && <span>✅ Finalizado</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Informações do Cliente */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-blue-600" />
            Informações do Cliente
          </h2>
          <div className="flex items-center gap-4">
            {service.clientPhoto ? (
              <img
                src={service.clientPhoto}
                alt={service.clientName}
                className="w-16 h-16 rounded-full object-cover border-4 border-blue-100"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <UserIcon className="w-8 h-8 text-white" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg">
                {service.clientName}
              </h3>
              <p className="text-gray-600">{service.serviceType}</p>
              <div className="flex items-center gap-2 mt-2">
                <MapPinIcon className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {service.location.address}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              {service.clientPhone && (
                <a
                  href={`tel:${service.clientPhone}`}
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

        {/* Controles do Serviço */}
        {service.status === "accepted" && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="font-bold text-gray-900 mb-4">Iniciar Serviço</h2>
            <p className="text-gray-600 mb-4">
              Clique no botão abaixo para iniciar o cronômetro e o rastreamento
              do serviço.
            </p>
            <button
              onClick={handleStartService}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-3"
            >
              <PlayIcon className="w-6 h-6" />
              Iniciar Serviço
            </button>
          </div>
        )}

        {service.status === "in_progress" && (
          <>
            {/* Controles do Cronômetro */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="font-bold text-gray-900 mb-4">Controles</h2>
              <div className="grid grid-cols-2 gap-4">
                {!isPaused ? (
                  <button
                    onClick={pauseTimer}
                    className="py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <PauseIcon className="w-5 h-5" />
                    Pausar
                  </button>
                ) : (
                  <button
                    onClick={resumeTimer}
                    className="py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <PlayIcon className="w-5 h-5" />
                    Retomar
                  </button>
                )}
                <button
                  onClick={handleCompleteService}
                  className="py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircleIcon className="w-5 h-5" />
                  Finalizar Serviço
                </button>
              </div>
            </div>

            {/* Mapa de Rastreamento */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <NavigationIcon className="w-5 h-5 text-blue-600" />
                Sua Localização
              </h2>
              <RealtimeMap
                professionalLocation={tracking || undefined}
                height="300px"
              />
            </div>

            {/* Notas do Serviço */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileTextIcon className="w-5 h-5 text-blue-600" />
                Notas do Serviço
              </h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Adicione observações sobre o serviço..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
              />
            </div>
          </>
        )}

        {/* Informações de Pagamento */}
        {service.status === "awaiting_payment" && (
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 shadow-sm border-2 border-yellow-300">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                <DollarSignIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-yellow-900 text-lg mb-2">
                  Aguardando Pagamento
                </h2>
                <p className="text-yellow-800 mb-4">
                  O serviço foi concluído! O cliente recebeu o QR Code PIX para
                  efetuar o pagamento de{" "}
                  <span className="font-bold">
                    R$ {service.price.toFixed(2)}
                  </span>
                </p>
                <div className="flex items-center gap-2 text-sm text-yellow-700">
                  <ClockIcon className="w-4 h-4" />
                  <span>Tempo total: {timeFormatted.formatted}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Confirmação */}
      {showConfirmComplete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Finalizar Serviço?
              </h3>
              <p className="text-gray-600">
                O cronômetro será parado e um QR Code PIX será gerado para o
                cliente efetuar o pagamento.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Tempo total:</span>
                <span className="font-bold text-gray-900">
                  {timeFormatted.formatted}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Valor:</span>
                <span className="font-bold text-green-600 text-lg">
                  R$ {service.price.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmComplete(false)}
                className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmComplete}
                className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-xl transition-all shadow-lg"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
