import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, ShieldCheckIcon, ScaleIcon, FileTextIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function TermsOfService() {
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
          <div className="bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] px-8 py-12 text-white">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <FileTextIcon className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Termos de Uso</h1>
                <p className="text-blue-100">Plataforma ServiFlex</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="w-4 h-4" />
                <span>Última atualização: 21/10/2025</span>
              </div>
              <div className="flex items-center gap-2">
                <ScaleIcon className="w-4 h-4" />
                <span>Juridicamente vinculante</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-12 prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-[#1E3A8A] text-white rounded-lg flex items-center justify-center text-sm font-bold">1</span>
                Aceitação dos Termos
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Ao acessar, cadastrar-se ou utilizar de qualquer forma os serviços da plataforma digital <strong>ServiFlex</strong>, 
                o USUÁRIO, seja pessoa física ou jurídica, declara ter lido, compreendido e aceito integralmente e sem ressalvas 
                todas as disposições contidas nestes TERMOS DE USO, em nossa POLÍTICA DE PRIVACIDADE e na POLÍTICA DE USO E SEGURANÇA.
              </p>
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mt-4 rounded-r-lg">
                <p className="text-amber-800 font-medium">
                  ⚠️ Estes Termos constituem um contrato juridicamente vinculante entre o USUÁRIO e a SERVIFLEX. 
                  Caso não concorde com qualquer disposição aqui estabelecida, o USUÁRIO não deve utilizar a plataforma.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-[#1E3A8A] text-white rounded-lg flex items-center justify-center text-sm font-bold">2</span>
                Definições
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-bold text-gray-900 mb-2">PLATAFORMA</h3>
                  <p className="text-gray-700 text-sm">O ambiente digital, incluindo website, aplicativos móveis e quaisquer outros meios, de titularidade da SERVIFLEX.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-bold text-gray-900 mb-2">SERVIFLEX</h3>
                  <p className="text-gray-700 text-sm">A empresa fornecedora da plataforma digital, responsável pela intermediação de serviços.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-bold text-gray-900 mb-2">CLIENTE</h3>
                  <p className="text-gray-700 text-sm">USUÁRIO que utiliza a Plataforma para buscar, contratar e pagar por serviços.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-bold text-gray-900 mb-2">PROFISSIONAL</h3>
                  <p className="text-gray-700 text-sm">USUÁRIO qualificado que utiliza a Plataforma para oferecer e prestar serviços aos CLIENTES.</p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-[#1E3A8A] text-white rounded-lg flex items-center justify-center text-sm font-bold">3</span>
                Objeto e Natureza Jurídica da Plataforma
              </h2>
              <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl mb-4">
                <p className="text-blue-900 font-medium mb-3">
                  🔗 A SERVIFLEX é uma plataforma digital que atua como <strong>ELO TECNOLÓGICO E COMERCIAL</strong>, 
                  facilitando a conexão, negociação e contratação de serviços entre CLIENTES e PROFISSIONAIS qualificados.
                </p>
              </div>
              <div className="bg-red-50 border border-red-200 p-6 rounded-xl">
                <h3 className="font-bold text-red-900 mb-2">⚠️ IMPORTANTE:</h3>
                <p className="text-red-800">
                  A SERVIFLEX <strong>NÃO É PRESTADORA DE SERVIÇOS TERCEIROS</strong>. Ela não é parte do contrato de prestação 
                  de serviços celebrado entre o CLIENTE e o PROFISSIONAL. Nossa atuação está enquadrada como provedora de 
                  serviços de intermediação, conforme legislação vigente.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-[#1E3A8A] text-white rounded-lg flex items-center justify-center text-sm font-bold">4</span>
                Cadastro e Conta do Usuário
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-[#1E3A8A] text-white rounded-full flex items-center justify-center text-xs font-bold mt-1">✓</span>
                  <p className="text-gray-700">O cadastro é pessoal, intransferível e vedado a menores de 18 anos.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-[#1E3A8A] text-white rounded-full flex items-center justify-center text-xs font-bold mt-1">✓</span>
                  <p className="text-gray-700">O USUÁRIO é responsável por todas as atividades realizadas em sua conta e pela confidencialidade de sua senha.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-[#1E3A8A] text-white rounded-full flex items-center justify-center text-xs font-bold mt-1">✓</span>
                  <p className="text-gray-700">É obrigatório fornecer informações verídicas, completas e atualizadas, sob as penas da lei.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-[#1E3A8A] text-white rounded-full flex items-center justify-center text-xs font-bold mt-1">✓</span>
                  <p className="text-gray-700">A Plataforma pode utilizar mecanismos de qualificação e confiabilidade para avaliar PROFISSIONAIS.</p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-[#1E3A8A] text-white rounded-lg flex items-center justify-center text-sm font-bold">5</span>
                Responsabilidades dos Usuários
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Clientes */}
                <div className="bg-blue-50 p-6 rounded-xl">
                  <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                    👤 Clientes
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2"></span>
                      <span className="text-blue-800">Fornecer descrições claras e precisas sobre o SERVIÇO necessário</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2"></span>
                      <span className="text-blue-800">Pagar integralmente pelo SERVIÇO conforme acordado</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2"></span>
                      <span className="text-blue-800">Avaliar o SERVIÇO de forma justa e construtiva</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2"></span>
                      <span className="text-blue-800">Comunicar-se de forma respeitosa e ética</span>
                    </li>
                  </ul>
                </div>

                {/* Profissionais */}
                <div className="bg-purple-50 p-6 rounded-xl">
                  <h3 className="text-xl font-bold text-purple-900 mb-4 flex items-center gap-2">
                    🔧 Profissionais
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-purple-600 rounded-full mt-2"></span>
                      <span className="text-purple-800">Manter qualificações, licenças e certificados atualizados</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-purple-600 rounded-full mt-2"></span>
                      <span className="text-purple-800">Cumprir prazos, escopo e padrões de qualidade acordados</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-purple-600 rounded-full mt-2"></span>
                      <span className="text-purple-800">Ser transparente e ético em todas as negociações</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-purple-600 rounded-full mt-2"></span>
                      <span className="text-purple-800">Fornecer comprovantes fiscais exigidos por lei</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-purple-600 rounded-full mt-2"></span>
                      <span className="text-purple-800">Arcar com obrigações trabalhistas e tributárias</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-[#1E3A8A] text-white rounded-lg flex items-center justify-center text-sm font-bold">6</span>
                Processo de Negociação e Pagamento
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  A Plataforma centraliza a comunicação inicial, mas o acordo final (escopo, preço, prazo, formas de pagamento) 
                  é de responsabilidade exclusiva do CLIENTE e do PROFISSIONAL.
                </p>
                <div className="bg-green-50 border border-green-200 p-4 rounded-xl">
                  <h3 className="font-bold text-green-900 mb-2">💳 Checkout Seguro</h3>
                  <p className="text-green-800">
                    A SERVIFLEX pode oferecer ferramentas de pagamento integradas, funcionando como intermediadora de pagamento. 
                    Condições específicas serão apresentadas no momento da transação.
                  </p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
                  <h3 className="font-bold text-yellow-900 mb-2">⚠️ Pagamentos Externos</h3>
                  <p className="text-yellow-800">
                    A SERVIFLEX não se responsabiliza por transações realizadas fora da Plataforma. 
                    Recomendamos utilizar sempre as ferramentas de pagamento da Plataforma para garantir segurança.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-[#1E3A8A] text-white rounded-lg flex items-center justify-center text-sm font-bold">7</span>
                Segurança e Moderação
              </h2>
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <ShieldCheckIcon className="w-8 h-8 text-green-600" />
                  <h3 className="text-xl font-bold text-gray-900">Sistema de Segurança LGPD</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Implementamos um sistema de segurança robusto, em conformidade com a Lei Geral de Proteção de Dados 
                  (LGPD - Lei 13.709/18), para proteger os dados dos USUÁRIOS.
                </p>
                <p className="text-gray-700">
                  A plataforma se reserva o direito de monitorar, moderar, editar ou remover qualquer CONTEÚDO que viole 
                  estes Termos ou a legislação aplicável.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-[#1E3A8A] text-white rounded-lg flex items-center justify-center text-sm font-bold">8</span>
                Limitação de Responsabilidade
              </h2>
              <div className="bg-red-50 border border-red-200 p-6 rounded-xl">
                <h3 className="font-bold text-red-900 mb-4">A SERVIFLEX NÃO SE RESPONSABILIZA POR:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-red-600 rounded-full mt-2"></span>
                    <span className="text-red-800">A qualidade, segurança ou resultado dos SERVIÇOS prestados pelos PROFISSIONAIS</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-red-600 rounded-full mt-2"></span>
                    <span className="text-red-800">Danos resultantes da interação entre CLIENTES e PROFISSIONAIS</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-red-600 rounded-full mt-2"></span>
                    <span className="text-red-800">Informações imprecisas fornecidas pelos USUÁRIOS</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-red-600 rounded-full mt-2"></span>
                    <span className="text-red-800">Danos decorrentes de caso fortuito ou força maior</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-[#1E3A8A] text-white rounded-lg flex items-center justify-center text-sm font-bold">9</span>
                Disposições Finais
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Estes Termos podem ser alterados a qualquer tempo. As alterações serão comunicadas com antecedência 
                  mínima de 30 dias por meio de alertas na Plataforma e/ou e-mail cadastrado.
                </p>
                <p className="text-gray-700">
                  O uso continuado da Plataforma após as alterações constitui aceitação tácita dos novos Termos.
                </p>
                <p className="text-gray-700">
                  Estes Termos são regidos pelas leis da República Federativa do Brasil.
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
                onClick={() => navigate('/privacy-policy')}
                className="text-[#1E3A8A] hover:text-[#3B82F6] font-medium text-sm transition-colors"
              >
                Ver Política de Privacidade →
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}