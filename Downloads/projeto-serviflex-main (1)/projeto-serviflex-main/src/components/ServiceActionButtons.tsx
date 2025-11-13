import { useState } from "react";
import {
  CheckCircleIcon,
  PlayCircleIcon,
  XCircleIcon,
  MapPinIcon,
  KeyIcon,
  DollarSignIcon,
  Loader2Icon,
} from "lucide-react";
import { ServiceRequest } from "../types/service";
import { serviceFlowService } from "../services/serviceFlowService";

interface ServiceActionButtonsProps {
  service: ServiceRequest;
  userRole: "client" | "professional";
  userId: string;
  userName: string;
  onUpdate: () => void;
}

export function ServiceActionButtons({
  service,
  userRole,
  userId,
  userName,
  onUpdate,
}: ServiceActionButtonsProps) {
  const [loading, setLoading] = useState(false);
  const [showPixInput, setShowPixInput] = useState(false);
  const [pixKey, setPixKey] = useState("");
  const [finalPrice, setFinalPrice] = useState(service.estimatedPrice);

  const handleAccept = async () => {
    if (!confirm("Deseja aceitar este serviço?")) return;

    setLoading(true);
    try {
      await serviceFlowService.acceptService(service.id!, userId, userName);
      alert("✅ Serviço aceito! O cliente foi notificado.");
      onUpdate();
    } catch (error: any) {
      alert(`Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async () => {
    if (!confirm("Confirma que chegou ao local e deseja iniciar o serviço?"))
      return;

    setLoading(true);
    try {
      // Tentar obter localização
      let location;
      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>(
            (resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject);
            }
          );
          location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
        } catch (error) {
          console.log("Localização não disponível");
        }
      }

      await serviceFlowService.startService(
        service.id!,
        userId,
        userName,
        location
      );
      alert("✅ Serviço iniciado! Boa sorte!");
      onUpdate();
    } catch (error: any) {
      alert(`Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!pixKey.trim()) {
      alert("Informe sua chave PIX para receber o pagamento");
      return;
    }

    if (
      !confirm(
        `Confirma a conclusão do serviço?\n\nValor: R$ ${finalPrice.toFixed(
          2
        )}\nChave PIX: ${pixKey}`
      )
    )
      return;

    setLoading(true);
    try {
      await serviceFlowService.completeService(
        service.id!,
        userId,
        userName,
        finalPrice,
        pixKey
      );
      alert(
        "✅ Serviço concluído! O cliente foi notificado e receberá sua chave PIX."
      );
      setShowPixInput(false);
      onUpdate();
    } catch (error: any) {
      alert(`Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!confirm("Confirma que realizou o pagamento via PIX?")) return;

    setLoading(true);
    try {
      await serviceFlowService.confirmPayment(service.id!, userId);
      alert("✅ Pagamento confirmado! Obrigado por usar o ServiFlex.");
      onUpdate();
    } catch (error: any) {
      alert(`Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    const reason = prompt("Por favor, informe o motivo do cancelamento:");
    if (!reason) return;

    setLoading(true);
    try {
      await serviceFlowService.cancelService(
        service.id!,
        userId,
        userName,
        reason
      );
      alert("✅ Serviço cancelado.");
      onUpdate();
    } catch (error: unknown) {
      alert(`Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Profissional - Aceitar serviço
  if (userRole === "professional" && service.status === "pending") {
    return (
      <div className="flex gap-3">
        <button
          onClick={handleAccept}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold shadow-lg disabled:opacity-50"
        >
          {loading ? (
            <Loader2Icon className="w-5 h-5 animate-spin" />
          ) : (
            <CheckCircleIcon className="w-5 h-5" />
          )}
          Aceitar Serviço
        </button>
        <button
          onClick={handleCancel}
          disabled={loading}
          className="px-6 py-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-bold disabled:opacity-50"
        >
          Recusar
        </button>
      </div>
    );
  }

  // Profissional - Iniciar serviço
  if (
    userRole === "professional" &&
    (service.status === "accepted" || service.status === "scheduled")
  ) {
    // Verificar se está próximo do horário (10 minutos antes)
    const now = new Date();
    const scheduledDateTime = new Date(service.scheduledDate);
    const [hours, minutes] = service.scheduledTime.split(":");
    scheduledDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const diffInMinutes =
      (scheduledDateTime.getTime() - now.getTime()) / (1000 * 60);
    const isStartingSoon = diffInMinutes <= 10 && diffInMinutes >= -5;
    const canStart = diffInMinutes <= 15; // Pode iniciar 15 min antes

    return (
      <div className="space-y-3">
        {isStartingSoon && (
          <div className="bg-gradient-to-r from-orange-100 to-yellow-100 border-2 border-orange-400 rounded-xl p-4 animate-pulse">
            <p className="text-center font-bold text-orange-900 flex items-center justify-center gap-2">
              <span className="w-3 h-3 bg-orange-500 rounded-full animate-ping"></span>
              ⚡ Serviço começa em breve! Prepare-se para iniciar.
            </p>
          </div>
        )}

        <button
          onClick={handleStart}
          disabled={loading || !canStart}
          className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl transition-all font-bold shadow-lg disabled:opacity-50 ${
            isStartingSoon
              ? "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 animate-pulse"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          {loading ? (
            <Loader2Icon className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <MapPinIcon className="w-5 h-5" />
              <PlayCircleIcon className="w-5 h-5" />
            </>
          )}
          {isStartingSoon
            ? "🔥 INICIAR TRABALHO AGORA"
            : "Cheguei ao Local - Iniciar Serviço"}
        </button>

        {!canStart && diffInMinutes > 0 && (
          <p className="text-center text-sm text-gray-600">
            Você poderá iniciar o serviço {Math.ceil(diffInMinutes - 15)}{" "}
            minutos antes do horário agendado
          </p>
        )}

        <button
          onClick={handleCancel}
          disabled={loading}
          className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-semibold disabled:opacity-50"
        >
          Cancelar Solicitação
        </button>
      </div>
    );
  }

  // Profissional - Concluir serviço
  if (userRole === "professional" && service.status === "in_progress") {
    return (
      <div className="space-y-4">
        {!showPixInput ? (
          <button
            onClick={() => setShowPixInput(true)}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold shadow-lg"
          >
            <CheckCircleIcon className="w-5 h-5" />
            Concluir Serviço
          </button>
        ) : (
          <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-5 space-y-4">
            <h4 className="font-bold text-blue-900 flex items-center gap-2">
              <KeyIcon className="w-5 h-5" />
              Finalizar Serviço
            </h4>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Valor Final do Serviço
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                  R$
                </span>
                <input
                  type="number"
                  value={finalPrice}
                  onChange={(e) =>
                    setFinalPrice(parseFloat(e.target.value) || 0)
                  }
                  step="0.01"
                  min="0"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 font-bold text-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sua Chave PIX *
              </label>
              <input
                type="text"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                placeholder="CPF, e-mail, telefone ou chave aleatória"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
              <p className="text-xs text-gray-600 mt-1">
                O cliente receberá esta chave para fazer o pagamento
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleComplete}
                disabled={loading || !pixKey.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold disabled:opacity-50"
              >
                {loading ? (
                  <Loader2Icon className="w-5 h-5 animate-spin" />
                ) : (
                  <CheckCircleIcon className="w-5 h-5" />
                )}
                Confirmar Conclusão
              </button>
              <button
                onClick={() => setShowPixInput(false)}
                disabled={loading}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-bold"
              >
                Voltar
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Cliente - Confirmar pagamento
  if (userRole === "client" && service.status === "completed") {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-5">
        <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2 text-lg">
          <DollarSignIcon className="w-6 h-6" />
          Pagamento Pendente
        </h4>
        <p className="text-gray-700 mb-4">
          O serviço foi concluído. Realize o pagamento via PIX e confirme
          abaixo.
        </p>
        <button
          onClick={handleConfirmPayment}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-bold shadow-lg disabled:opacity-50"
        >
          {loading ? (
            <Loader2Icon className="w-5 h-5 animate-spin" />
          ) : (
            <CheckCircleIcon className="w-5 h-5" />
          )}
          Confirmar Pagamento Realizado
        </button>
      </div>
    );
  }

  // Botão de cancelar (disponível em alguns status)
  if (["pending", "accepted", "scheduled"].includes(service.status)) {
    return (
      <button
        onClick={handleCancel}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors font-semibold border-2 border-red-300 disabled:opacity-50"
      >
        {loading ? (
          <Loader2Icon className="w-5 h-5 animate-spin" />
        ) : (
          <XCircleIcon className="w-5 h-5" />
        )}
        Cancelar Solicitação de Serviço
      </button>
    );
  }

  return null;
}
