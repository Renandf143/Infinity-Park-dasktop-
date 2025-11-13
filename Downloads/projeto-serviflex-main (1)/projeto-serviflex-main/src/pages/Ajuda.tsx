import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { HelpCircleIcon, MessageCircleIcon, BookOpenIcon, PhoneIcon } from 'lucide-react';

export function Ajuda() {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Central de Ajuda</h1>
          <p className="text-gray-600">Encontre respostas para suas dúvidas ou entre em contato conosco</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* FAQ */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <HelpCircleIcon className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Perguntas Frequentes</h2>
            </div>
            
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-medium text-gray-900 mb-2">Como contratar um profissional?</h3>
                <p className="text-sm text-gray-600">Navegue pelas categorias, escolha um profissional e clique em "Contratar".</p>
              </div>
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-medium text-gray-900 mb-2">Como me tornar um profissional?</h3>
                <p className="text-sm text-gray-600">Cadastre-se como profissional e complete seu perfil com suas habilidades.</p>
              </div>
              <div className="pb-4">
                <h3 className="font-medium text-gray-900 mb-2">Como funciona o pagamento?</h3>
                <p className="text-sm text-gray-600">Pagamentos são processados de forma segura através da plataforma.</p>
              </div>
            </div>
          </div>

          {/* Contato */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <MessageCircleIcon className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Entre em Contato</h2>
            </div>
            
            <div className="space-y-4">
              <button className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <div className="flex items-center space-x-3">
                  <MessageCircleIcon className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Chat Online</p>
                    <p className="text-sm text-gray-600">Fale conosco agora</p>
                  </div>
                </div>
              </button>
              
              <button className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Telefone</p>
                    <p className="text-sm text-gray-600">(11) 9999-9999</p>
                  </div>
                </div>
              </button>
              
              <button className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <div className="flex items-center space-x-3">
                  <BookOpenIcon className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">Documentação</p>
                    <p className="text-sm text-gray-600">Guias e tutoriais</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Recursos Adicionais */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recursos Úteis</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-3xl mb-2">📖</div>
              <h3 className="font-medium text-gray-900">Guia do Usuário</h3>
              <p className="text-sm text-gray-600 mt-1">Como usar a plataforma</p>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-3xl mb-2">🛡️</div>
              <h3 className="font-medium text-gray-900">Segurança</h3>
              <p className="text-sm text-gray-600 mt-1">Dicas de segurança</p>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-3xl mb-2">💡</div>
              <h3 className="font-medium text-gray-900">Dicas</h3>
              <p className="text-sm text-gray-600 mt-1">Aproveite melhor a plataforma</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}