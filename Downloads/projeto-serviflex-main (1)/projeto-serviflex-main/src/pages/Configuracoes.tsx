import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { SettingsIcon, BellIcon, ShieldIcon, CreditCardIcon } from 'lucide-react';

export function Configuracoes() {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Configurações</h1>
          <p className="text-gray-600">Gerencie suas preferências e configurações da conta</p>
        </div>

        <div className="space-y-6">
          {/* Notificações */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <BellIcon className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Notificações</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Email de novos serviços</p>
                  <p className="text-sm text-gray-600">Receba notificações sobre novos serviços disponíveis</p>
                </div>
                <input type="checkbox" className="w-5 h-5 text-blue-600" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Mensagens</p>
                  <p className="text-sm text-gray-600">Notificações de novas mensagens</p>
                </div>
                <input type="checkbox" className="w-5 h-5 text-blue-600" defaultChecked />
              </div>
            </div>
          </div>

          {/* Privacidade */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <ShieldIcon className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Privacidade</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Perfil público</p>
                  <p className="text-sm text-gray-600">Permitir que outros vejam seu perfil</p>
                </div>
                <input type="checkbox" className="w-5 h-5 text-green-600" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Mostrar telefone</p>
                  <p className="text-sm text-gray-600">Exibir telefone no seu perfil público</p>
                </div>
                <input type="checkbox" className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>

          {/* Pagamentos */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <CreditCardIcon className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900">Pagamentos</h2>
            </div>
            <div className="space-y-4">
              <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <p className="font-medium text-gray-900">Métodos de pagamento</p>
                <p className="text-sm text-gray-600">Gerencie cartões e contas bancárias</p>
              </button>
              <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <p className="font-medium text-gray-900">Histórico de transações</p>
                <p className="text-sm text-gray-600">Veja todas as suas transações</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}