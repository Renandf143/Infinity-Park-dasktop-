import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserIcon,
  BriefcaseIcon,
  ArrowLeftIcon,
  CheckIcon,
  MailIcon,
  LockIcon,
  PhoneIcon,
  MapPinIcon,
  Loader2Icon,
  AlertCircleIcon,
} from "lucide-react";
import { authService } from "../services/authService";
import { ValidatedInput } from "../components/ValidatedInput";
import { CEPInput } from "../components/CEPInput";
import {
  checkEmailExists,
  checkPhoneExists,
  checkCPFExists,
  formatPhone,
  formatCPF,
  validateCPF,
} from "../services/validationService";

type AccountType = "client" | "professional" | null;

export function Register() {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState<AccountType>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <img
                src="/logo-serviflex.png"
                alt="ServiFlex"
                className="h-10 w-auto"
              />
              <span className="text-2xl font-bold text-[#2563EB]">
                ServiFlex
              </span>
            </button>

            <button
              onClick={() => navigate("/login")}
              className="text-sm text-gray-600 hover:text-[#1E3A8A] font-medium"
            >
              Já tem conta? <span className="text-[#1E3A8A]">Entrar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {!accountType ? (
            <AccountTypeSelector setAccountType={setAccountType} />
          ) : accountType === "client" ? (
            <ClientRegisterForm
              setAccountType={setAccountType}
              navigate={navigate}
            />
          ) : (
            <ProfessionalRegisterForm
              setAccountType={setAccountType}
              navigate={navigate}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ==================== SELETOR DE TIPO ====================
function AccountTypeSelector({ setAccountType }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Bem-vindo ao ServiFlex
        </h1>
        <p className="text-xl text-gray-600">Como deseja se cadastrar?</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Cliente */}
        <motion.button
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setAccountType("client")}
          className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all border-2 border-transparent hover:border-[#1E3A8A] overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-500" />

          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-[#1E3A8A] to-[#1e40af] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
              <UserIcon className="w-10 h-10 text-white" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Sou Cliente
            </h3>
            <p className="text-gray-600 mb-6">
              Encontre e contrate profissionais qualificados para seus projetos
            </p>

            <div className="space-y-3">
              {[
                "Busca rápida de profissionais",
                "Avaliações verificadas",
                "Chat direto com profissionais",
                "Pagamento seguro",
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.button>

        {/* Profissional */}
        <motion.button
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setAccountType("professional")}
          className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all border-2 border-transparent hover:border-[#1E3A8A] overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-500" />

          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-[#1E3A8A] to-[#1e40af] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
              <BriefcaseIcon className="w-10 h-10 text-white" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Sou Profissional
            </h3>
            <p className="text-gray-600 mb-6">
              Ofereça seus serviços e conquiste novos clientes
            </p>

            <div className="space-y-3">
              {[
                "Perfil profissional completo",
                "Receba solicitações de clientes",
                "Gerencie seus serviços",
                "Aumente sua renda",
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
}

// ==================== FORMULÁRIO CLIENTE ====================
function ClientRegisterForm({ setAccountType, navigate }: any) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    password: "",
    confirmPassword: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  });

  const [validations, setValidations] = useState({
    email: true,
    phone: true,
    cpf: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validations.email || !validations.phone || !validations.cpf) {
      setError("Corrija os campos inválidos antes de continuar");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (formData.password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres");
      return;
    }

    if (!formData.cep || !formData.city || !formData.state) {
      setError("Preencha o endereço completo");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        cpf: formData.cpf.replace(/[^\d]/g, ""),
        accountType: "client",
        address: {
          street: formData.street,
          number: formData.number,
          complement: formData.complement,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
          zipCode: formData.cep,
        },
      });

      alert("✅ Conta criada com sucesso! Verifique seu email.");
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        <button
          onClick={() => setAccountType(null)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Voltar</span>
        </button>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Cadastro de Cliente
          </h2>
          <p className="text-gray-600">
            Preencha seus dados para começar a contratar profissionais
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3">
            <AlertCircleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nome Completo *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1E3A8A] focus:ring-4 focus:ring-blue-50 transition-all outline-none"
              placeholder="João Silva"
            />
          </div>

          {/* Email com Validação */}
          <ValidatedInput
            label="Email"
            type="email"
            value={formData.email}
            onChange={(value) => setFormData({ ...formData, email: value })}
            onValidation={(isValid) =>
              setValidations({ ...validations, email: isValid })
            }
            validator={async (email) => {
              if (!email.includes("@")) {
                return { valid: false, message: "Email inválido" };
              }
              const exists = await checkEmailExists(email);
              return exists
                ? { valid: false, message: "❌ Este email já está cadastrado" }
                : { valid: true, message: "✓ Email disponível" };
            }}
            icon={<MailIcon className="w-5 h-5" />}
            placeholder="joao@email.com"
            required
          />

          {/* Telefone com Validação */}
          <ValidatedInput
            label="Telefone"
            type="tel"
            value={formData.phone}
            onChange={(value) => setFormData({ ...formData, phone: value })}
            onValidation={(isValid) =>
              setValidations({ ...validations, phone: isValid })
            }
            validator={async (phone) => {
              const cleaned = phone.replace(/[^\d]/g, "");
              if (cleaned.length < 10) {
                return { valid: false, message: "Telefone inválido" };
              }
              const exists = await checkPhoneExists(phone);
              return exists
                ? {
                    valid: false,
                    message: "❌ Este telefone já está cadastrado",
                  }
                : { valid: true, message: "✓ Telefone disponível" };
            }}
            formatter={formatPhone}
            icon={<PhoneIcon className="w-5 h-5" />}
            placeholder="(11) 99999-9999"
            required
          />

          {/* CPF com Validação */}
          <ValidatedInput
            label="CPF"
            type="text"
            value={formData.cpf}
            onChange={(value) => setFormData({ ...formData, cpf: value })}
            onValidation={(isValid) =>
              setValidations({ ...validations, cpf: isValid })
            }
            validator={async (cpf) => {
              if (!validateCPF(cpf)) {
                return { valid: false, message: "CPF inválido" };
              }
              const exists = await checkCPFExists(cpf);
              return exists
                ? { valid: false, message: "❌ Este CPF já está cadastrado" }
                : { valid: true, message: "✓ CPF válido" };
            }}
            formatter={formatCPF}
            icon={<UserIcon className="w-5 h-5" />}
            placeholder="000.000.000-00"
            required
          />

          {/* CEP */}
          <CEPInput
            value={formData.cep}
            onChange={(value) => setFormData({ ...formData, cep: value })}
            onAddressFound={(address) => {
              setFormData({
                ...formData,
                cep: address.cep,
                street: address.street,
                neighborhood: address.neighborhood,
                city: address.city,
                state: address.state,
              });
            }}
          />

          {/* Endereço */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Rua *
              </label>
              <input
                type="text"
                required
                value={formData.street}
                onChange={(e) =>
                  setFormData({ ...formData, street: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1E3A8A] focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                placeholder="Rua das Flores"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Número *
              </label>
              <input
                type="text"
                required
                value={formData.number}
                onChange={(e) =>
                  setFormData({ ...formData, number: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1E3A8A] focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                placeholder="123"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Complemento
              </label>
              <input
                type="text"
                value={formData.complement}
                onChange={(e) =>
                  setFormData({ ...formData, complement: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1E3A8A] focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                placeholder="Apto 101"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Bairro *
              </label>
              <input
                type="text"
                required
                value={formData.neighborhood}
                onChange={(e) =>
                  setFormData({ ...formData, neighborhood: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1E3A8A] focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                placeholder="Centro"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cidade *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1E3A8A] focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                placeholder="São Paulo"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Estado *
              </label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    state: e.target.value.toUpperCase(),
                  })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1E3A8A] focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                placeholder="SP"
                maxLength={2}
              />
            </div>
          </div>

          {/* Senha */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Senha *
            </label>
            <div className="relative">
              <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1E3A8A] focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                placeholder="Mínimo 6 caracteres"
              />
            </div>
          </div>

          {/* Confirmar Senha */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Confirmar Senha *
            </label>
            <div className="relative">
              <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1E3A8A] focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                placeholder="Repita a senha"
              />
            </div>
          </div>

          {/* Botão */}
          <button
            type="submit"
            disabled={
              loading ||
              !validations.email ||
              !validations.phone ||
              !validations.cpf
            }
            className="w-full bg-gradient-to-r from-[#1E3A8A] to-[#1e40af] text-white py-4 rounded-xl font-semibold text-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2Icon className="w-5 h-5 animate-spin" />
                Criando conta...
              </>
            ) : (
              "Criar Conta"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Ao criar uma conta, você concorda com nossos{" "}
          <button
            onClick={() => navigate("/terms-of-service")}
            className="text-[#1E3A8A] hover:underline"
          >
            Termos de Serviço
          </button>
        </p>
      </div>
    </motion.div>
  );
}

// ==================== STEP COMPONENTS ====================
function Step1Personal({
  formData,
  setFormData,
  validations,
  setValidations,
  onNext,
}: any) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Dados Pessoais</h3>
        <p className="text-gray-600">Informações básicas para sua conta</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Nome Completo *
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1E3A8A] focus:ring-4 focus:ring-blue-50 transition-all outline-none"
          placeholder="João Silva"
        />
      </div>

      <ValidatedInput
        label="Email"
        type="email"
        value={formData.email}
        onChange={(value) => setFormData({ ...formData, email: value })}
        onValidation={(isValid) =>
          setValidations({ ...validations, email: isValid })
        }
        validator={async (email) => {
          if (!email.includes("@")) {
            return { valid: false, message: "Email inválido" };
          }
          const exists = await checkEmailExists(email);
          return exists
            ? { valid: false, message: "❌ Este email já está cadastrado" }
            : { valid: true, message: "✓ Email disponível" };
        }}
        icon={<MailIcon className="w-5 h-5" />}
        placeholder="joao@email.com"
        required
      />

      <ValidatedInput
        label="Telefone"
        type="tel"
        value={formData.phone}
        onChange={(value) => setFormData({ ...formData, phone: value })}
        onValidation={(isValid) =>
          setValidations({ ...validations, phone: isValid })
        }
        validator={async (phone) => {
          const cleaned = phone.replace(/[^\d]/g, "");
          if (cleaned.length < 10) {
            return { valid: false, message: "Telefone inválido" };
          }
          const exists = await checkPhoneExists(phone);
          return exists
            ? { valid: false, message: "❌ Este telefone já está cadastrado" }
            : { valid: true, message: "✓ Telefone disponível" };
        }}
        formatter={formatPhone}
        icon={<PhoneIcon className="w-5 h-5" />}
        placeholder="(11) 99999-9999"
        required
      />

      <ValidatedInput
        label="CPF"
        type="text"
        value={formData.cpf}
        onChange={(value) => setFormData({ ...formData, cpf: value })}
        onValidation={(isValid) =>
          setValidations({ ...validations, cpf: isValid })
        }
        validator={async (cpf) => {
          if (!validateCPF(cpf)) {
            return { valid: false, message: "CPF inválido" };
          }
          const exists = await checkCPFExists(cpf);
          return exists
            ? { valid: false, message: "❌ Este CPF já está cadastrado" }
            : { valid: true, message: "✓ CPF válido" };
        }}
        formatter={formatCPF}
        icon={<UserIcon className="w-5 h-5" />}
        placeholder="000.000.000-00"
        required
      />

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Senha *
        </label>
        <div className="relative">
          <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="password"
            required
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1E3A8A] focus:ring-4 focus:ring-blue-50 transition-all outline-none"
            placeholder="Mínimo 6 caracteres"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Confirmar Senha *
        </label>
        <div className="relative">
          <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="password"
            required
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1E3A8A] focus:ring-4 focus:ring-blue-50 transition-all outline-none"
            placeholder="Repita a senha"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="w-full bg-gradient-to-r from-[#1E3A8A] to-[#1e40af] text-white py-4 rounded-xl font-semibold text-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
      >
        Próximo
      </button>
    </div>
  );
}

function Step2Professional({
  formData,
  setFormData,
  newSkill,
  setNewSkill,
  addSkill,
  removeSkill,
  onNext,
}: any) {
  const [suggestedCategories, setSuggestedCategories] = useState<string[]>([]);

  // Categorias disponíveis no site
  const availableCategories = [
    { name: 'Limpeza e Organização', keywords: ['limpeza', 'diarista', 'faxina', 'organização', 'organizador'] },
    { name: 'Reparos e Manutenção', keywords: ['eletricista', 'encanador', 'marceneiro', 'pintor', 'pedreiro', 'serralheiro', 'vidraceiro', 'gesseiro', 'reparo', 'manutenção'] },
    { name: 'Beleza e Estética', keywords: ['cabeleireiro', 'manicure', 'pedicure', 'maquiador', 'esteticista', 'depilação', 'sobrancelha', 'barbeiro', 'beleza'] },
    { name: 'Saúde e Bem-estar', keywords: ['personal', 'trainer', 'fisioterapeuta', 'massagista', 'nutricionista', 'psicólogo', 'yoga', 'pilates', 'saúde'] },
    { name: 'Aulas e Treinamentos', keywords: ['professor', 'aula', 'ensino', 'matemática', 'português', 'inglês', 'música', 'reforço', 'coach', 'instrutor'] },
    { name: 'Eventos e Festas', keywords: ['evento', 'festa', 'organizador', 'decorador', 'buffet', 'animador', 'fotógrafo', 'dj', 'mestre'] },
    { name: 'Transporte e Mudanças', keywords: ['mudança', 'carreto', 'frete', 'motorista', 'transporte', 'montador'] },
    { name: 'Tecnologia e Suporte', keywords: ['técnico', 'informática', 'ti', 'rede', 'desenvolvedor', 'web', 'câmera', 'celular', 'tecnologia'] },
    { name: 'Jardinagem e Paisagismo', keywords: ['jardineiro', 'paisagista', 'podador', 'irrigação', 'horta', 'jardim'] },
    { name: 'Cuidados Pessoais', keywords: ['babá', 'cuidador', 'idoso', 'enfermeiro', 'acompanhante'] },
    { name: 'Pet Care', keywords: ['veterinário', 'pet', 'banho', 'tosa', 'adestrador', 'cachorro', 'gato', 'animal'] },
    { name: 'Alimentação', keywords: ['chef', 'confeiteiro', 'cozinheiro', 'marmita', 'salgado', 'barista', 'comida'] }
  ];

  const detectCategory = (profession: string) => {
    const professionLower = profession.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const matches: string[] = [];

    availableCategories.forEach(category => {
      const hasMatch = category.keywords.some(keyword => 
        professionLower.includes(keyword.toLowerCase())
      );
      if (hasMatch) {
        matches.push(category.name);
      }
    });

    setSuggestedCategories(matches);
    
    // Auto-seleciona a primeira categoria encontrada
    if (matches.length > 0 && !formData.category) {
      setFormData({ ...formData, category: matches[0] });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Informações Profissionais
        </h3>
        <p className="text-gray-600">Conte-nos sobre sua experiência</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Profissão *
        </label>
        <input
          type="text"
          required
          value={formData.profession}
          onChange={(e) => {
            setFormData({ ...formData, profession: e.target.value });
            detectCategory(e.target.value);
          }}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1E3A8A] focus:ring-4 focus:ring-blue-50 transition-all outline-none"
          placeholder="Ex: Eletricista, Encanador, Pintor"
        />
      </div>

      {/* Campo de Categoria com detecção automática */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Categoria *
        </label>
        <select
          required
          value={formData.category || ''}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1E3A8A] focus:ring-4 focus:ring-blue-50 transition-all outline-none"
        >
          <option value="">Selecione uma categoria...</option>
          {availableCategories.map(cat => (
            <option key={cat.name} value={cat.name}>{cat.name}</option>
          ))}
        </select>
        {suggestedCategories.length > 0 && (
          <p className="mt-2 text-sm text-green-600">
            ✓ Categoria detectada automaticamente: {suggestedCategories.join(', ')}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Experiência *
        </label>
        <select
          required
          value={formData.experience}
          onChange={(e) =>
            setFormData({ ...formData, experience: e.target.value })
          }
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1E3A8A] focus:ring-4 focus:ring-blue-50 transition-all outline-none"
        >
          <option value="">Selecione...</option>
          <option value="0-1">Menos de 1 ano</option>
          <option value="1-3">1 a 3 anos</option>
          <option value="3-5">3 a 5 anos</option>
          <option value="5-10">5 a 10 anos</option>
          <option value="10+">Mais de 10 anos</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Descrição *
        </label>
        <textarea
          required
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1E3A8A] focus:ring-4 focus:ring-blue-50 transition-all outline-none resize-none"
          rows={4}
          placeholder="Descreva seus serviços e experiência..."
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Habilidades *
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), addSkill())
            }
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1E3A8A] focus:ring-4 focus:ring-blue-50 transition-all outline-none"
            placeholder="Ex: Instalação elétrica"
          />
          <button
            type="button"
            onClick={addSkill}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-colors"
          >
            Adicionar
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.skills.map((skill: string) => (
            <span
              key={skill}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="hover:text-blue-900"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="w-full bg-gradient-to-r from-[#1E3A8A] to-[#1e40af] text-white py-4 rounded-xl font-semibold text-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
      >
        Próximo
      </button>
    </div>
  );
}

function Step3Location({ formData, setFormData, onSubmit, loading }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Localização e Preços
        </h3>
        <p className="text-gray-600">Onde você atende e quanto cobra</p>
      </div>

      <CEPInput
        value={formData.cep}
        onChange={(value) => setFormData({ ...formData, cep: value })}
        onAddressFound={(address) => {
          setFormData({
            ...formData,
            street: address.street,
            neighborhood: address.neighborhood,
            city: address.city,
            state: address.state,
          });
        }}
      />

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Rua *
          </label>
          <input
            type="text"
            required
            value={formData.street}
            onChange={(e) =>
              setFormData({ ...formData, street: e.target.value })
            }
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1E3A8A] focus:ring-4 focus:ring-blue-50 transition-all outline-none"
            placeholder="Rua das Flores"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Número *
          </label>
          <input
            type="text"
            required
            value={formData.number}
            onChange={(e) =>
              setFormData({ ...formData, number: e.target.value })
            }
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1E3A8A] focus:ring-4 focus:ring-blue-50 transition-all outline-none"
            placeholder="123"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Complemento
          </label>
          <input
            type="text"
            value={formData.complement}
            onChange={(e) =>
              setFormData({ ...formData, complement: e.target.value })
            }
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1E3A8A] focus:ring-4 focus:ring-blue-50 transition-all outline-none"
            placeholder="Apto 101"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Bairro *
          </label>
          <input
            type="text"
            required
            value={formData.neighborhood}
            onChange={(e) =>
              setFormData({ ...formData, neighborhood: e.target.value })
            }
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1E3A8A] focus:ring-4 focus:ring-blue-50 transition-all outline-none"
            placeholder="Centro"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Cidade *
          </label>
          <input
            type="text"
            required
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1E3A8A] focus:ring-4 focus:ring-blue-50 transition-all outline-none"
            placeholder="São Paulo"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Estado *
          </label>
          <input
            type="text"
            required
            value={formData.state}
            onChange={(e) =>
              setFormData({ ...formData, state: e.target.value.toUpperCase() })
            }
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1E3A8A] focus:ring-4 focus:ring-blue-50 transition-all outline-none"
            placeholder="SP"
            maxLength={2}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Preço Mínimo (R$) *
          </label>
          <input
            type="number"
            required
            value={formData.priceMin}
            onChange={(e) =>
              setFormData({ ...formData, priceMin: e.target.value })
            }
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1E3A8A] focus:ring-4 focus:ring-blue-50 transition-all outline-none"
            placeholder="50"
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Preço Máximo (R$) *
          </label>
          <input
            type="number"
            required
            value={formData.priceMax}
            onChange={(e) =>
              setFormData({ ...formData, priceMax: e.target.value })
            }
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1E3A8A] focus:ring-4 focus:ring-blue-50 transition-all outline-none"
            placeholder="200"
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={loading}
        className="w-full bg-gradient-to-r from-[#1E3A8A] to-[#1e40af] text-white py-4 rounded-xl font-semibold text-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2Icon className="w-5 h-5 animate-spin" />
            Criando conta...
          </>
        ) : (
          "Criar Conta Profissional"
        )}
      </button>
    </div>
  );
}

// ==================== FORMULÁRIO PROFISSIONAL ====================
function ProfessionalRegisterForm({ setAccountType, navigate }: any) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    // Passo 1
    name: "",
    email: "",
    phone: "",
    cpf: "",
    password: "",
    confirmPassword: "",
    // Passo 2
    profession: "",
    category: "",
    experience: "",
    description: "",
    skills: [] as string[],
    // Passo 3
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    priceMin: "",
    priceMax: "",
  });

  const [validations, setValidations] = useState({
    email: true,
    phone: true,
    cpf: true,
  });

  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()],
      });
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skill),
    });
  };

  const handleNext = () => {
    setError("");

    if (step === 1) {
      if (
        !formData.name ||
        !formData.email ||
        !formData.phone ||
        !formData.cpf ||
        !formData.password
      ) {
        setError("Preencha todos os campos obrigatórios");
        return;
      }
      if (!validations.email || !validations.phone || !validations.cpf) {
        setError("Corrija os campos inválidos antes de continuar");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("As senhas não coincidem");
        return;
      }
      if (formData.password.length < 6) {
        setError("A senha deve ter no mínimo 6 caracteres");
        return;
      }
    }

    if (step === 2) {
      if (
        !formData.profession ||
        !formData.category ||
        !formData.experience ||
        !formData.description
      ) {
        setError("Preencha todos os campos obrigatórios");
        return;
      }
      if (formData.skills.length === 0) {
        setError("Adicione pelo menos uma habilidade");
        return;
      }
    }

    setStep(step + 1);
  };

  const handleSubmit = async () => {
    if (
      !formData.cep ||
      !formData.city ||
      !formData.state ||
      !formData.priceMin ||
      !formData.priceMax
    ) {
      setError("Preencha todos os campos obrigatórios");
      return;
    }

    if (parseFloat(formData.priceMax) <= parseFloat(formData.priceMin)) {
      setError("O preço máximo deve ser maior que o mínimo");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        cpf: formData.cpf.replace(/[^\d]/g, ""),
        accountType: "professional",
        profession: formData.profession,
        category: formData.category,
        experience: formData.experience,
        description: formData.description,
        skills: formData.skills,
        location: {
          city: formData.city,
          state: formData.state,
          address: `${formData.street}, ${formData.number}${
            formData.complement ? ", " + formData.complement : ""
          }`,
        },
        address: {
          street: formData.street,
          number: formData.number,
          complement: formData.complement,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
          zipCode: formData.cep,
        },
        priceRange: {
          min: parseFloat(formData.priceMin),
          max: parseFloat(formData.priceMax),
        },
      });

      alert("✅ Conta criada com sucesso!");
      navigate("/profissional/dashboard");
    } catch (err: unknown) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-3xl mx-auto"
    >
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        <button
          onClick={() =>
            step === 1 ? setAccountType(null) : setStep(step - 1)
          }
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Voltar</span>
        </button>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold text-gray-900">
              Cadastro Profissional
            </h2>
            <span className="text-sm font-semibold text-gray-600">
              Passo {step}/3
            </span>
          </div>

          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-all ${
                  s <= step
                    ? "bg-gradient-to-r from-[#1E3A8A] to-[#1e40af]"
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3">
            <AlertCircleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {step === 1 && (
          <Step1Personal
            formData={formData}
            setFormData={setFormData}
            validations={validations}
            setValidations={setValidations}
            onNext={handleNext}
          />
        )}
        {step === 2 && (
          <Step2Professional
            formData={formData}
            setFormData={setFormData}
            newSkill={newSkill}
            setNewSkill={setNewSkill}
            addSkill={addSkill}
            removeSkill={removeSkill}
            onNext={handleNext}
          />
        )}
        {step === 3 && (
          <Step3Location
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            loading={loading}
          />
        )}
      </div>
    </motion.div>
  );
}
