import React from "react";
import { motion } from "framer-motion";
import {
  UserIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  TrendingUpIcon,
  StarIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  CreditCardIcon,
  CalendarIcon,
  HomeIcon,
  ClockIcon,
  DollarSignIcon,
} from "lucide-react";

interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  birthDate: string;
  address: {
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  preferences: {
    serviceTypes: string[];
    budget: string;
    availability: string;
  };
}

interface ClientRegistrationProps {
  clientData: ClientFormData;
  clientStep: 1 | 2 | 3;
  loading: boolean;
  error: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onServiceTypesChange: (serviceType: string) => void;
  onNext: () => void;
  onSubmit: () => void;
  onBack: () => void;
  setError: (error: string) => void;
}

const serviceTypes = [
  { id: 'limpeza', name: 'Limpeza', icon: '🧹' },
  { id: 'eletrica', name: 'Elétrica', icon: '⚡' },
  { id: 'encanamento', name: 'Encanamento', icon: '🔧' },
  { id: 'pintura', name: 'Pintura', icon: '🎨' },
  { id: 'jardinagem', name: 'Jardinagem', icon: '🌱' },
  { id: 'marcenaria', name: 'Marcenaria', icon: '🪚' },
  { id: 'design', name: 'Design', icon: '💻' },
  { id: 'fotografia', name: 'Fotografia', icon: '📸' },
];

export function ClientRegistration({
  clientData,
  clientStep,
  loading,
  error,
  onInputChange,
  onServiceTypesChange,
  onNext,
  onSubmit,
  onBack,
  setError,
}: ClientRegistrationProps) {
  return (
    <motion.div
      key="client-form"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-50"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-32 right-16 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-indigo-200 rounded-full opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 p-8 lg:p-12 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => {
              if (clientStep === 1) {
                onBack();
              } else {
                // Voltar para o passo anterior
                setError("");
              }
            }}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-all hover:translate-x-1"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="font-medium">Voltar</span>
          </button>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-6">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                    step <= clientStep
                      ? "bg-[#1E3A8A] text-white shadow-lg"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step < clientStep ? (
                    <CheckCircleIcon className="w-7 h-7" />
                  ) : (
                    step
                  )}
                </div>
                {step < 3 && (
                  <div
                    className={`w-20 h-1 mx-3 ${
                      step < clientStep ? "bg-[#1E3A8A]" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="relative mb-6"
            >
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] rounded-3xl flex items-center justify-center shadow-2xl">
                <UserIcon className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {clientStep === 1 && "Dados Pessoais"}
              {clientStep === 2 && "Endereço"}
              {clientStep === 3 && "Preferências"}
            </h2>
            <p className="text-gray-600">
              Passo {clientStep} de 3 - Vamos criar sua conta completa
            </p>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-xl shadow-sm"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 1: Dados Pessoais */}
        {clientStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nome */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Nome completo *
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <UserIcon className="w-5 h-5 text-gray-400 group-focus-within:text-[#1E3A8A] transition-colors" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={clientData.name}
                    onChange={onInputChange}
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] transition-all placeholder-gray-400 text-gray-900 font-medium shadow-sm hover:shadow-md"
                    placeholder="Digite seu nome completo"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Email *
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MailIcon className="w-5 h-5 text-gray-400 group-focus-within:text-[#1E3A8A] transition-colors" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={clientData.email}
                    onChange={onInputChange}
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] transition-all placeholder-gray-400 text-gray-900 font-medium shadow-sm hover:shadow-md"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>

              {/* Telefone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Telefone *
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <PhoneIcon className="w-5 h-5 text-gray-400 group-focus-within:text-[#1E3A8A] transition-colors" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={clientData.phone}
                    onChange={onInputChange}
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] transition-all placeholder-gray-400 text-gray-900 font-medium shadow-sm hover:shadow-md"
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>
              </div>

              {/* CPF */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  CPF *
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <CreditCardIcon className="w-5 h-5 text-gray-400 group-focus-within:text-[#1E3A8A] transition-colors" />
                  </div>
                  <input
                    type="text"
                    name="cpf"
                    value={clientData.cpf}
                    onChange={onInputChange}
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] transition-all placeholder-gray-400 text-gray-900 font-medium shadow-sm hover:shadow-md"
                    placeholder="000.000.000-00"
                    required
                  />
                </div>
              </div>

              {/* Data de Nascimento */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Data de Nascimento *
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <CalendarIcon className="w-5 h-5 text-gray-400 group-focus-within:text-[#1E3A8A] transition-colors" />
                  </div>
                  <input
                    type="date"
                    name="birthDate"
                    value={clientData.birthDate}
                    onChange={onInputChange}
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] transition-all placeholder-gray-400 text-gray-900 font-medium shadow-sm hover:shadow-md"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              onClick={onNext}
              className="w-full flex items-center justify-center gap-2 bg-[#1E3A8A] text-white py-4 px-6 rounded-2xl font-bold text-lg hover:bg-[#3B82F6] transition-all shadow-lg hover:shadow-xl"
            >
              Próximo
              <ArrowRightIcon className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {/* Step 2: Endereço */}
        {clientStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CEP */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  CEP *
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPinIcon className="w-5 h-5 text-gray-400 group-focus-within:text-[#1E3A8A] transition-colors" />
                  </div>
                  <input
                    type="text"
                    name="address.zipCode"
                    value={clientData.address.zipCode}
                    onChange={onInputChange}
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] transition-all placeholder-gray-400 text-gray-900 font-medium shadow-sm hover:shadow-md"
                    placeholder="00000-000"
                    required
                  />
                </div>
              </div>

              {/* Rua */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Rua *
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <HomeIcon className="w-5 h-5 text-gray-400 group-focus-within:text-[#1E3A8A] transition-colors" />
                  </div>
                  <input
                    type="text"
                    name="address.street"
                    value={clientData.address.street}
                    onChange={onInputChange}
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] transition-all placeholder-gray-400 text-gray-900 font-medium shadow-sm hover:shadow-md"
                    placeholder="Nome da rua"
                    required
                  />
                </div>
              </div>

              {/* Número */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Número *
                </label>
                <input
                  type="text"
                  name="address.number"
                  value={clientData.address.number}
                  onChange={onInputChange}
                  className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] transition-all placeholder-gray-400 text-gray-900 font-medium shadow-sm hover:shadow-md"
                  placeholder="123"
                  required
                />
              </div>

              {/* Complemento */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Complemento
                </label>
                <input
                  type="text"
                  name="address.complement"
                  value={clientData.address.complement}
                  onChange={onInputChange}
                  className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] transition-all placeholder-gray-400 text-gray-900 font-medium shadow-sm hover:shadow-md"
                  placeholder="Apto, Bloco, etc."
                />
              </div>

              {/* Bairro */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Bairro *
                </label>
                <input
                  type="text"
                  name="address.neighborhood"
                  value={clientData.address.neighborhood}
                  onChange={onInputChange}
                  className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] transition-all placeholder-gray-400 text-gray-900 font-medium shadow-sm hover:shadow-md"
                  placeholder="Nome do bairro"
                  required
                />
              </div>

              {/* Cidade */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Cidade *
                </label>
                <input
                  type="text"
                  name="address.city"
                  value={clientData.address.city}
                  onChange={onInputChange}
                  className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] transition-all placeholder-gray-400 text-gray-900 font-medium shadow-sm hover:shadow-md"
                  placeholder="Nome da cidade"
                  required
                />
              </div>

              {/* Estado */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Estado *
                </label>
                <select
                  name="address.state"
                  value={clientData.address.state}
                  onChange={onInputChange}
                  className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] transition-all text-gray-900 font-medium shadow-sm hover:shadow-md"
                  required
                >
                  <option value="">Selecione o estado</option>
                  <option value="SP">São Paulo</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="MG">Minas Gerais</option>
                  <option value="RS">Rio Grande do Sul</option>
                  <option value="PR">Paraná</option>
                  <option value="SC">Santa Catarina</option>
                  <option value="BA">Bahia</option>
                  <option value="GO">Goiás</option>
                  <option value="PE">Pernambuco</option>
                  <option value="CE">Ceará</option>
                </select>
              </div>
            </div>

            <button
              onClick={onNext}
              className="w-full flex items-center justify-center gap-2 bg-[#1E3A8A] text-white py-4 px-6 rounded-2xl font-bold text-lg hover:bg-[#3B82F6] transition-all shadow-lg hover:shadow-xl"
            >
              Próximo
              <ArrowRightIcon className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {/* Step 3: Preferências */}
        {clientStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            {/* Tipos de Serviço */}
            <div>
              <label className="block text-lg font-bold text-gray-900 mb-4">
                Que tipos de serviços você procura? *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {serviceTypes.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => onServiceTypesChange(service.id)}
                    className={`p-4 rounded-2xl border-2 transition-all text-center hover:scale-105 ${
                      clientData.preferences.serviceTypes.includes(service.id)
                        ? "border-[#1E3A8A] bg-[#1E3A8A] text-white shadow-lg"
                        : "border-gray-200 bg-white text-gray-700 hover:border-[#1E3A8A]"
                    }`}
                  >
                    <div className="text-2xl mb-2">{service.icon}</div>
                    <div className="font-semibold text-sm">{service.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Orçamento */}
            <div>
              <label className="block text-lg font-bold text-gray-900 mb-4">
                Qual seu orçamento médio? *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { value: "ate-100", label: "Até R$ 100", icon: "💰" },
                  { value: "100-500", label: "R$ 100 - R$ 500", icon: "💵" },
                  { value: "500-1000", label: "R$ 500 - R$ 1.000", icon: "💸" },
                  { value: "acima-1000", label: "Acima de R$ 1.000", icon: "🏆" },
                ].map((budget) => (
                  <button
                    key={budget.value}
                    type="button"
                    onClick={() => {
                      const event = {
                        target: { name: "preferences.budget", value: budget.value }
                      } as React.ChangeEvent<HTMLInputElement>;
                      onInputChange(event);
                    }}
                    className={`p-4 rounded-2xl border-2 transition-all text-center hover:scale-105 ${
                      clientData.preferences.budget === budget.value
                        ? "border-[#1E3A8A] bg-[#1E3A8A] text-white shadow-lg"
                        : "border-gray-200 bg-white text-gray-700 hover:border-[#1E3A8A]"
                    }`}
                  >
                    <div className="text-2xl mb-2">{budget.icon}</div>
                    <div className="font-semibold">{budget.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Disponibilidade */}
            <div>
              <label className="block text-lg font-bold text-gray-900 mb-4">
                Quando você precisa dos serviços? *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { value: "urgente", label: "Urgente (hoje/amanhã)", icon: "🚨" },
                  { value: "esta-semana", label: "Esta semana", icon: "📅" },
                  { value: "proximo-mes", label: "Próximo mês", icon: "🗓️" },
                  { value: "flexivel", label: "Flexível", icon: "⏰" },
                ].map((availability) => (
                  <button
                    key={availability.value}
                    type="button"
                    onClick={() => {
                      const event = {
                        target: { name: "preferences.availability", value: availability.value }
                      } as React.ChangeEvent<HTMLInputElement>;
                      onInputChange(event);
                    }}
                    className={`p-4 rounded-2xl border-2 transition-all text-center hover:scale-105 ${
                      clientData.preferences.availability === availability.value
                        ? "border-[#1E3A8A] bg-[#1E3A8A] text-white shadow-lg"
                        : "border-gray-200 bg-white text-gray-700 hover:border-[#1E3A8A]"
                    }`}
                  >
                    <div className="text-2xl mb-2">{availability.icon}</div>
                    <div className="font-semibold">{availability.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Finalizar */}
            <motion.button
              onClick={onSubmit}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full relative overflow-hidden bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white py-5 px-8 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#1E3A8A] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center gap-3">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Criando sua conta...
                    </>
                  ) : (
                    "Finalizar Cadastro com Google"
                  )}
                </span>
              </div>
            </motion.button>

            {/* Security Note */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-4">
              <ShieldCheckIcon className="w-4 h-4" />
              <span>Seus dados estão seguros e protegidos</span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}