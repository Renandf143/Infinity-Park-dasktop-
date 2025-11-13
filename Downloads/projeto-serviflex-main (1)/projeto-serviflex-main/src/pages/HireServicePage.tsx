import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { professionalService } from "../services/professionalService";
import { ServiceProviderProfile } from "../types/firestore";
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  DollarSignIcon,
  FileTextIcon,
  CheckCircleIcon,
  Loader2Icon,
  AlertCircleIcon,
} from "lucide-react";

export function HireServicePage() {
  const { professionalId } = useParams<{ professionalId: string }>();
  const navigate = useNavigate();
  const [professional, setProfessional] =
    useState<ServiceProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);

  // Dados do formulário
  const [formData, setFormData] = useState({
    serviceType: "",
    description: "",
    date: "",
    time: "",
    duration: "2",
    address: "",
    city: "",
    state: "",
    budget: "",
    additionalInfo: "",
  });

  const loadProfessional = useCallback(async () => {
    if (!professionalId) return;

    setLoading(true);
    try {
      const data = await professionalService.getProfessionalById(
        professionalId
      );
      setProfessional(data);
    } catch (error) {
      console.error("Erro ao carregar profissional:", error);
    } finally {
      setLoading(false);
    }
  }, [professionalId]);

  useEffect(() => {
    loadProfessional();
  }, [loadProfessional]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () => {
    const hours = parseFloat(formData.duration) || 0;
    const hourlyRate = professional?.hourlyRate || 0;
    return hours * hourlyRate;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Salvar solicitação no Firestore
      try {
        const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");
        const { db } = await import("../firebase");
        const { auth } = await import("../firebase");

        const currentUser = auth.currentUser;
        if (!currentUser) {
          alert("Você precisa estar logado para contratar um serviço.");
          return;
        }

        const serviceRequest = {
          professionalId: professionalId,
          professionalName: professional.displayName,
          clientId: currentUser.uid,
          clientName: currentUser.displayName || "Cliente",
          clientEmail: currentUser.email,
          serviceType: formData.serviceType,
          description: formData.description,
          date: formData.date,
          time: formData.time,
          duration: parseFloat(formData.duration),
          address: formData.address,
          city: formData.city,
          state: formData.state,
          additionalInfo: formData.additionalInfo,
          estimatedValue: calculateTotal(),
          hourlyRate: professional.hourlyRate,
          status: "pending",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        console.log('Salvando solicitação:', serviceRequest);
        const docRef = await addDoc(collection(db, "serviceRequests"), serviceRequest);
        console.log('Solicitação salva com ID:', docRef.id);

        alert("Solicitação enviada com sucesso! O profissional receberá sua proposta.");
        navigate(`/profissional/${professionalId}`);
      } catch (error) {
        console.error("Erro ao enviar solicitação:", error);
        alert("Erro ao enviar solicitação. Tente novamente.");
      }
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <Loader2Icon
            style={{ color: "#1E40AF" }}
            className="w-12 h-12 animate-spin mx-auto mb-4"
          />
          <p className="text-gray-600">Carregando...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!professional) {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Profissional não encontrado
          </h1>
          <button
            onClick={() => navigate("/categorias")}
            style={{ backgroundColor: "#1E40AF" }}
            className="px-6 py-3 text-white rounded-lg hover:opacity-90 transition-colors"
          >
            Ver Categorias
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Header />

      {/* Header */}
      <div style={{ backgroundColor: "#1E40AF" }} className="text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => navigate(`/profissional/${professionalId}`)}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Voltar ao perfil
          </button>
          <h1 className="text-3xl font-bold mb-2">Contratar Serviço</h1>
          <p className="text-white/90">
            Você está contratando: {professional.displayName} -{" "}
            {professional.profession}
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          {[
            { num: 1, label: "Detalhes do Serviço" },
            { num: 2, label: "Local e Data" },
            { num: 3, label: "Confirmação" },
          ].map((item, index) => (
            <div key={item.num} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  style={step >= item.num ? { backgroundColor: "#1E40AF" } : {}}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step >= item.num
                      ? "text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step > item.num ? (
                    <CheckCircleIcon className="w-6 h-6" />
                  ) : (
                    item.num
                  )}
                </div>
                <span className="text-sm mt-2 text-gray-600 text-center">
                  {item.label}
                </span>
              </div>
              {index < 2 && (
                <div
                  style={step > item.num ? { backgroundColor: "#1E40AF" } : {}}
                  className={`h-1 flex-1 ${
                    step > item.num ? "" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm p-8"
        >
          {/* Step 1: Detalhes do Serviço */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Detalhes do Serviço
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Serviço *
                </label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1E40AF] focus:outline-none"
                >
                  <option value="">Selecione o tipo de serviço</option>
                  {professional.skills.map((skill, index) => (
                    <option key={index} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição do Serviço *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  placeholder="Descreva detalhadamente o serviço que você precisa..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1E40AF] focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duração Estimada (horas) *
                </label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1E40AF] focus:outline-none"
                >
                  <option value="1">1 hora</option>
                  <option value="2">2 horas</option>
                  <option value="3">3 horas</option>
                  <option value="4">4 horas</option>
                  <option value="6">6 horas</option>
                  <option value="8">8 horas (dia inteiro)</option>
                </select>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSignIcon className="w-5 h-5 text-blue-700" />
                  <span className="font-semibold text-blue-900">
                    Valor Estimado
                  </span>
                </div>
                <p className="text-3xl font-bold text-blue-900">
                  R$ {calculateTotal().toFixed(2)}
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  {formData.duration} hora(s) × R$ {professional.hourlyRate}
                  /hora
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Local e Data */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Local e Data
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data Preferencial *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1E40AF] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Horário Preferencial *
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1E40AF] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Endereço Completo *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  placeholder="Rua, número, complemento"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1E40AF] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    placeholder="Cidade"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1E40AF] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    placeholder="UF"
                    maxLength={2}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1E40AF] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Informações Adicionais
                </label>
                <textarea
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Alguma informação adicional sobre o local ou acesso?"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1E40AF] focus:outline-none resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 3: Confirmação */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Confirme os Dados
              </h2>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FileTextIcon className="w-5 h-5" />
                    Serviço
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-gray-600">Tipo:</span>{" "}
                      <span className="font-medium">
                        {formData.serviceType}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-600">Descrição:</span>{" "}
                      <span className="font-medium">
                        {formData.description}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-600">Duração:</span>{" "}
                      <span className="font-medium">
                        {formData.duration} hora(s)
                      </span>
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5" />
                    Data e Horário
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-gray-600">Data:</span>{" "}
                      <span className="font-medium">
                        {new Date(
                          formData.date + "T00:00:00"
                        ).toLocaleDateString("pt-BR")}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-600">Horário:</span>{" "}
                      <span className="font-medium">{formData.time}</span>
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPinIcon className="w-5 h-5" />
                    Local
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p className="font-medium">{formData.address}</p>
                    <p>
                      {formData.city}, {formData.state}
                    </p>
                    {formData.additionalInfo && (
                      <p className="text-gray-600 italic">
                        {formData.additionalInfo}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-700 mb-1">
                        Valor Total Estimado
                      </p>
                      <p className="text-4xl font-bold text-blue-900">
                        R$ {calculateTotal().toFixed(2)}
                      </p>
                    </div>
                    <DollarSignIcon className="w-12 h-12 text-blue-700" />
                  </div>
                </div>

                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 flex gap-3">
                  <AlertCircleIcon className="w-5 h-5 text-yellow-700 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-semibold mb-1">Importante:</p>
                    <p>
                      Este é um valor estimado. O profissional poderá ajustar o
                      valor final após avaliar o serviço. Você receberá uma
                      notificação quando o profissional responder sua
                      solicitação.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Voltar
              </button>
            )}
            <button
              type="submit"
              style={{ backgroundColor: "#1E40AF" }}
              className="flex-1 px-6 py-3 text-white rounded-lg font-semibold hover:opacity-90 transition-colors"
            >
              {step === 3 ? "Enviar Solicitação" : "Continuar"}
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}
