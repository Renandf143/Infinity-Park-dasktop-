import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { CreditCardIcon, PlusIcon, HistoryIcon } from 'lucide-react';

export function Pagamentos() {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pagamentos</h1>
          <p className="text-gray-600">Gerencie seus métodos de pagamento e histórico</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Métodos de Pagamento */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Métodos de Pagamento</h2>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <PlusIcon className="w-4 h-4" />
                <span>Adicionar</span>
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CreditCardIcon className="w-6 h-6 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">**** **** **** 1234</p>
                    <p className="text-sm text-gray-600">Visa • Expira 12/25</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <CreditCardIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Adicione um cartão de crédito</p>
              </div>
            </div>
          </div>

          {/* Histórico */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <HistoryIcon className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Histórico Recente</h2>
            </div>
            
            <div className="space-y-3">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">Serviço de Limpeza</p>
                    <p className="text-sm text-gray-600">15 de Nov, 2024</p>
                  </div>
                  <span className="text-green-600 font-semibold">R$ 150,00</span>
                </div>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">Consultoria TI</p>
                    <p className="text-sm text-gray-600">10 de Nov, 2024</p>
                  </div>
                  <span className="text-green-600 font-semibold">R$ 300,00</span>
                </div>
              </div>
              
              <button className="w-full py-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                Ver histórico completo
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}