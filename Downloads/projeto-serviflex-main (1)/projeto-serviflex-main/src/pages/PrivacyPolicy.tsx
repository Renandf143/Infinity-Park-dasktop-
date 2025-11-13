import React from "react";
import { motion } from "framer-motion";
import { ArrowLeftIcon, ShieldIcon, EyeIcon, LockIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span className="font-medium">Voltar</span>
            </button>
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="ServiFlex Logo"
                className="w-8 h-8 object-contain"
              />
              <h1 className="text-2xl font-bold text-[#1E3A8A]">ServiFlex</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 px-8 py-12 text-white">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <ShieldIcon className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  Política de Privacidade
                </h1>
                <p className="text-green-100">Proteção de Dados - LGPD</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <LockIcon className="w-4 h-4" />
                <span>Última atualização: 21/10/2025</span>
              </div>
              <div className="flex items-center gap-2">
                <EyeIcon className="w-4 h-4" />
                <span>Conforme LGPD</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-12">
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-green-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                  1
                </span>
                Introdução
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                A <strong>ServiFlex</strong> está comprometida com a proteção da
                privacidade e dos dados pessoais de todos os usuários de nossa
                plataforma. Esta Política de Privacidade descreve como
                coletamos, usamos, armazenamos e protegemos suas informações
                pessoais, em conformidade com a Lei Geral de Proteção de Dados
                (LGPD - Lei 13.709/18).
              </p>
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                <p className="text-green-800 font-medium">
                  🛡️ Seu direito à privacidade é fundamental para nós. Esta
                  política explica de forma transparente como tratamos seus
                  dados pessoais.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-green-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                  2
                </span>
                Dados Coletados
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 p-6 rounded-xl">
                  <h3 className="text-xl font-bold text-blue-900 mb-4">
                    📋 Dados de Cadastro
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      <span className="text-blue-800">Nome completo</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      <span className="text-blue-800">E-mail</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      <span className="text-blue-800">Telefone</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      <span className="text-blue-800">CPF/CNPJ</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      <span className="text-blue-800">Endereço</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-6 rounded-xl">
                  <h3 className="text-xl font-bold text-purple-900 mb-4">
                    🔧 Dados Profissionais
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                      <span className="text-purple-800">Área de atuação</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                      <span className="text-purple-800">
                        Experiência profissional
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                      <span className="text-purple-800">Certificações</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                      <span className="text-purple-800">Portfólio</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                      <span className="text-purple-800">Avaliações</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  📊 Dados de Uso
                </h3>
                <p className="text-gray-700 mb-3">
                  Coletamos automaticamente informações sobre como você usa
                  nossa plataforma:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-2">
                      📱
                    </div>
                    <span className="text-sm text-gray-600">
                      Dispositivo usado
                    </span>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-2">
                      🌐
                    </div>
                    <span className="text-sm text-gray-600">Navegador</span>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-2">
                      📍
                    </div>
                    <span className="text-sm text-gray-600">Localização</span>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-2">
                      ⏰
                    </div>
                    <span className="text-sm text-gray-600">
                      Horários de uso
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-green-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                  3
                </span>
                Finalidade do Tratamento
              </h2>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                  <h3 className="font-bold text-blue-900 mb-2">
                    🎯 Prestação de Serviços
                  </h3>
                  <p className="text-blue-800">
                    Utilizamos seus dados para conectar clientes e
                    profissionais, facilitar negociações e garantir a qualidade
                    dos serviços.
                  </p>
                </div>
                <div className="bg-green-50 border border-green-200 p-4 rounded-xl">
                  <h3 className="font-bold text-green-900 mb-2">
                    🔒 Segurança e Verificação
                  </h3>
                  <p className="text-green-800">
                    Verificamos identidades, prevenimos fraudes e mantemos a
                    segurança da plataforma.
                  </p>
                </div>
                <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl">
                  <h3 className="font-bold text-purple-900 mb-2">
                    📈 Melhoria da Plataforma
                  </h3>
                  <p className="text-purple-800">
                    Analisamos dados de uso para melhorar funcionalidades e
                    experiência do usuário.
                  </p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
                  <h3 className="font-bold text-yellow-900 mb-2">
                    📧 Comunicação
                  </h3>
                  <p className="text-yellow-800">
                    Enviamos notificações importantes, atualizações de serviços
                    e comunicações relevantes.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-green-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                  4
                </span>
                Compartilhamento de Dados
              </h2>
              <div className="bg-red-50 border border-red-200 p-6 rounded-xl mb-4">
                <h3 className="font-bold text-red-900 mb-2">
                  🚫 NÃO VENDEMOS SEUS DADOS
                </h3>
                <p className="text-red-800">
                  A ServiFlex nunca vende, aluga ou comercializa dados pessoais
                  de usuários para terceiros.
                </p>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Compartilhamos dados apenas quando:
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-1">
                    ✓
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">
                      Necessário para o serviço
                    </p>
                    <p className="text-gray-600 text-sm">
                      Entre clientes e profissionais para viabilizar a prestação
                      de serviços
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-1">
                    ✓
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">Obrigação legal</p>
                    <p className="text-gray-600 text-sm">
                      Quando exigido por autoridades competentes ou determinação
                      judicial
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-1">
                    ✓
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">
                      Com seu consentimento
                    </p>
                    <p className="text-gray-600 text-sm">
                      Quando você autoriza expressamente o compartilhamento
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-green-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                  5
                </span>
                Seus Direitos (LGPD)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <h3 className="font-bold text-blue-900 mb-2">📋 Acesso</h3>
                  <p className="text-blue-800 text-sm">
                    Solicitar informações sobre seus dados pessoais que tratamos
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl">
                  <h3 className="font-bold text-green-900 mb-2">✏️ Correção</h3>
                  <p className="text-green-800 text-sm">
                    Corrigir dados incompletos, inexatos ou desatualizados
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl">
                  <h3 className="font-bold text-purple-900 mb-2">
                    🗑️ Exclusão
                  </h3>
                  <p className="text-purple-800 text-sm">
                    Solicitar a exclusão de dados desnecessários ou excessivos
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-xl">
                  <h3 className="font-bold text-yellow-900 mb-2">
                    📤 Portabilidade
                  </h3>
                  <p className="text-yellow-800 text-sm">
                    Solicitar a portabilidade de seus dados para outro
                    fornecedor
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded-xl">
                  <h3 className="font-bold text-red-900 mb-2">🚫 Oposição</h3>
                  <p className="text-red-800 text-sm">
                    Opor-se ao tratamento realizado com base no legítimo
                    interesse
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-bold text-gray-900 mb-2">
                    ℹ️ Informação
                  </h3>
                  <p className="text-gray-800 text-sm">
                    Obter informações sobre compartilhamento de dados
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-green-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                  6
                </span>
                Segurança dos Dados
              </h2>
              <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <LockIcon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">
                      Criptografia
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Dados protegidos com criptografia de ponta
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <ShieldIcon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">
                      Monitoramento
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Sistemas de segurança 24/7
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <EyeIcon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Auditoria</h3>
                    <p className="text-gray-600 text-sm">
                      Revisões regulares de segurança
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-green-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                  7
                </span>
                Contato - Encarregado de Dados
              </h2>
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl">
                <p className="text-gray-700 mb-4">
                  Para exercer seus direitos ou esclarecer dúvidas sobre o
                  tratamento de dados pessoais, entre em contato com nosso
                  Encarregado de Dados (DPO):
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-bold text-gray-900 mb-2">📧 E-mail</h3>
                    <p className="text-[#1E3A8A] font-medium">
                      privacidade@serviflex.com
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-bold text-gray-900 mb-2">
                      ⏱️ Prazo de Resposta
                    </h3>
                    <p className="text-gray-700">Até 15 dias úteis</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-green-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                  8
                </span>
                Alterações na Política
              </h2>
              <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl">
                <p className="text-yellow-800 mb-3">
                  Esta Política de Privacidade pode ser atualizada
                  periodicamente para refletir mudanças em nossas práticas ou na
                  legislação aplicável.
                </p>
                <p className="text-yellow-800">
                  <strong>
                    Notificaremos você sobre alterações significativas
                  </strong>{" "}
                  por e-mail ou através de avisos em nossa plataforma, com
                  antecedência mínima de 30 dias.
                </p>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-6 border-t">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                © 2025 ServiFlex. Todos os direitos reservados.
              </div>
              <button
                onClick={() => navigate("/terms-of-service")}
                className="text-[#1E3A8A] hover:text-[#3B82F6] font-medium text-sm transition-colors"
              >
                Ver Termos de Uso →
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
