import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  XIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  DollarSignIcon,
  PhoneIcon,
  MailIcon,
  MessageSquareIcon,
  FileTextIcon,
  TagIcon,
  CreditCardIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlayCircleIcon,
  MessageCircleIcon,
} from "lucide-react";
import { ServiceRequest } from "../types/service";
import { ServiceActionButtons } from "./ServiceActionButtons";
import { chatService } from "../services/chatService";

interface ServiceDetailModalProps {
  service: ServiceRequest;
  userRole: "client" | "professional";
  userId: string;
  userName: string;
  onClose: () => void;
  onUpdate: () => void;
}

export function ServiceDetailModal({
  service,
  userRole,
  userId,
  userName,
  onClose,
  onUpdate,
}: ServiceDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"details" | "timeline">("details");
  const [loadingChat, setLoadingChat] = useState(false);
  const navigate = useNavigate();

  const handleSendMessage = async () => {
    setLoadingChat(true);
    try {
      const otherUserId = userRole === "client" ? service.professionalId : service.clientId;
      const otherUserName = userRole === "client" ? service.professionalName : service.clientName;
      const otherUserEmail = userRole === "client" ? service.professionalEmail : service.clientEmail;
      
      // Criar ou obter o chat
      const chatId = await chatService.getOrCreateChat(
        userId,
        otherUserId,
        { name: userName, photo: "" },
        { name: otherUserName, photo: "" }
      );
      
      // Redirecionar para mensagens com o chatId
      navigate(`/cliente/mensagens?chatId=${chatId}`);
      onClose();
    } catch (error) {
      console.error("Erro ao abrir chat:", error);
      alert("Erro ao abrir conversa. Tente novamente.");
    } finally {
      setLoadingChat(false);
    }
  };

  const getStatusConfig = () => {
    switch (service.status) {
      case "pending":
        return {
          label: "Aguardando Aceitação",
          color: "bg-yellow-100 text-yellow-800 border-yellow-300",
          icon: AlertCircleIcon,
          iconColor: "text-yellow-600",
        };
      case "accepted":
        return {
          label: "Aceito",
          color: "bg-blue-100 text-blue-800 border-blue-300",
          icon: CheckCircleIcon,
          iconColor: "text-blue-600",
        };
      case "scheduled":
        return {
          label: "Agendado",
          color: "bg-purple-100 text-purple-800 border-purple-300",
          icon: ClockIcon,
          iconColor: "text-purple-600",
        };
      case "in_progress":
        return {
          label: "Em Andamento",
          color: "bg-green-100 text-green-800 border-green-300",
          icon: PlayCircleIcon,
          iconColor: "text-green-600",
        };
      case "completed":
        return {
          label: "Concluído",
          color: "bg-indigo-100 text-indigo-800 border-indigo-300",
          icon: CheckCircleIcon,
          iconColor: "text-indigo-600",
        };
      case "paid":
        return {
          label: "Pago",
          color: "bg-emerald-100 text-emerald-800 border-emerald-300",
          icon: CheckCircleIcon,
          iconColor: "text-emerald-600",
        };
      case "cancelled":
        return {
          label: "Cancelado",
          color: "bg-gray-100 text-gray-800 border-gray-300",
          icon: XCircleIcon,
          iconColor: "text-gray-600",
        };
      default:
        return {
          label: "Desconhecido",
          color: "bg-gray-100 text-gray-800 border-gray-300",
          icon: AlertCircleIcon,
          iconColor: "text-gray-600",
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  const otherParty =
    userRole === "client"
      ? {
          name: service.professionalName,
          email: service.professionalEmail,
          phone: service.professionalPhone,
          role: "Profissional",
        }
      : {
          name: service.clientName,
          email: service.clientEmail,
          phone: service.clientPhone,
          role: "Cliente",
        };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{service.serviceType}</h2>
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 ${statusConfig.color} text-sm font-semibold`}
              >
                <StatusIcon className={`w-4 h-4 ${statusConfig.iconColor}`} />
                {statusConfig.label}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <XIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-white border-opacity-30">
            <button
              onClick={() => setActiveTab("details")}
              className={`px-4 py-2 font-semibold transition-colors ${
                activeTab === "details"
                  ? "border-b-2 border-white text-white"
                  : "text-blue-100 hover:text-white"
              }`}
            >
              Detalhes
            </button>
            <button
              onClick={() => setActiveTab("timeline")}
              className={`px-4 py-2 font-semibold transition-colors ${
                activeTab === "timeline"
                  ? "border-b-2 border-white text-white"
                  : "text-blue-100 hover:text-white"
              }`}
            >
              Histórico
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "details" ? (
            <div className="space-y-6">
              {/* Descrição */}
              <div className="bg-gray-50 rounded-xl p-5 border-2 border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <FileTextIcon className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-gray-900">
                    Descrição do Serviço
                  </h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Informações do Participante */}
              <div className="bg-blue-50 rounded-xl p-5 border-2 border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-gray-900">
                      {otherParty.role}
                    </h3>
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={loadingChat}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingChat ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Abrindo...
                      </>
                    ) : (
                      <>
                        <MessageCircleIcon className="w-4 h-4" />
                        Tirar Dúvida
                      </>
                    )}
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {otherParty.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {otherParty.name}
                      </p>
                      <p className="text-sm text-gray-600">{otherParty.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <MailIcon className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{otherParty.email}</span>
                  </div>
                  {otherParty.phone && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <PhoneIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{otherParty.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Grid de Informações */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <TagIcon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">
                        Categoria
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {service.category}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <CalendarIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">
                        Data
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {new Date(service.scheduledDate).toLocaleDateString(
                          "pt-BR",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <ClockIcon className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">
                        Horário
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {service.scheduledTime}
                      </p>
                      <p className="text-xs text-gray-600">
                        Duração: {service.estimatedDuration} min
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <DollarSignIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">
                        Valor
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        R${" "}
                        {(
                          service.finalPrice ||
                          service.estimatedPrice ||
                          0
                        ).toFixed(2)}
                      </p>
                      {service.finalPrice &&
                        service.finalPrice !== service.estimatedPrice && (
                          <p className="text-xs text-gray-600">
                            Estimado: R${" "}
                            {(service.estimatedPrice || 0).toFixed(2)}
                          </p>
                        )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Localização */}
              <div className="bg-white rounded-xl p-5 border-2 border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <MapPinIcon className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-gray-900">Localização</h3>
                </div>
                <p className="text-gray-900 font-semibold mb-1">
                  {service.address}
                </p>
                <p className="text-gray-600">
                  {service.city}, {service.state}
                </p>
              </div>

              {/* Informações de Pagamento */}
              {service.status === "completed" && service.pixKey && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-300">
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCardIcon className="w-5 h-5 text-green-600" />
                    <h3 className="font-bold text-green-900">
                      Informações de Pagamento
                    </h3>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <p className="text-sm text-gray-600 mb-2">
                      Chave PIX do Profissional:
                    </p>
                    <p className="text-lg font-bold text-gray-900 break-all">
                      {service.pixKey}
                    </p>
                  </div>
                  <p className="text-sm text-gray-700 mt-3">
                    Realize o pagamento via PIX e confirme após a conclusão.
                  </p>
                </div>
              )}

              {/* Avaliação */}
              {service.rating && (
                <div className="bg-yellow-50 rounded-xl p-5 border-2 border-yellow-200">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquareIcon className="w-5 h-5 text-yellow-600" />
                    <h3 className="font-bold text-gray-900">Avaliação</h3>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < (service.rating || 0)
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-sm font-semibold text-gray-700 ml-1">
                      {service.rating.toFixed(1)}
                    </span>
                  </div>
                  {service.review && (
                    <p className="text-gray-700 italic">"{service.review}"</p>
                  )}
                </div>
              )}

              {/* Histórico do Serviço */}
              <div className="bg-gray-50 rounded-xl p-5 border-2 border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <ClockIcon className="w-5 h-5 text-gray-600" />
                  <h3 className="font-bold text-gray-900">Histórico</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Serviço Criado
                      </p>
                      <p className="text-xs text-gray-600">
                        {new Date(service.createdAt).toLocaleString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  {service.acceptedAt && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Aceito pelo Profissional
                        </p>
                        <p className="text-xs text-gray-600">
                          {new Date(service.acceptedAt).toLocaleString("pt-BR")}
                        </p>
                      </div>
                    </div>
                  )}
                  {service.startedAt && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Serviço Iniciado
                        </p>
                        <p className="text-xs text-gray-600">
                          {new Date(service.startedAt).toLocaleString("pt-BR")}
                        </p>
                      </div>
                    </div>
                  )}
                  {service.completedAt && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Serviço Concluído
                        </p>
                        <p className="text-xs text-gray-600">
                          {new Date(service.completedAt).toLocaleString(
                            "pt-BR"
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                  {service.paidAt && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Pagamento Confirmado
                        </p>
                        <p className="text-xs text-gray-600">
                          {new Date(service.paidAt).toLocaleString("pt-BR")}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <ClockIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Histórico detalhado em breve</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t-2 border-gray-200 p-6 bg-gray-50">
          <ServiceActionButtons
            service={service}
            userRole={userRole}
            userId={userId}
            userName={userName}
            onUpdate={() => {
              onUpdate();
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
}
