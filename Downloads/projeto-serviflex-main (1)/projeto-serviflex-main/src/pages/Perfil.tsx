import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { UserIcon, MailIcon, PhoneIcon, EditIcon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function Perfil() {
  const navigate = useNavigate();
  const { user, getUserDisplayName } = useAuth();
  
  const getUserAccountType = () => {
    return localStorage.getItem('userAccountType') || 'client';
  };

  const isProfessional = getUserAccountType() === 'professional';

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header do Perfil */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <UserIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{getUserDisplayName()}</h1>
                <p className="text-gray-600">{user.email}</p>
                <span className={`inline-block mt-1 px-3 py-1 text-sm rounded-full ${
                  isProfessional 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {isProfessional ? 'Profissional' : 'Cliente'}
                </span>
              </div>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <EditIcon className="w-4 h-4" />
              <span>Editar Perfil</span>
            </button>
          </div>
        </div>

        {/* Informações do Perfil */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informações Pessoais */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações Pessoais</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <UserIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Nome</p>
                  <p className="font-medium">{getUserDisplayName()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MailIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{user.email}</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    user.emailVerified 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.emailVerified ? 'Verificado' : 'Não verificado'}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <PhoneIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Telefone</p>
                  <p className="font-medium">Não informado</p>
                </div>
              </div>
            </div>
          </div>

          {/* Configurações da Conta */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Configurações da Conta</h2>
            <div className="space-y-3">
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <p className="font-medium text-gray-900">Alterar Senha</p>
                <p className="text-sm text-gray-600">Atualize sua senha de acesso</p>
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <p className="font-medium text-gray-900">Notificações</p>
                <p className="text-sm text-gray-600">Gerencie suas preferências de notificação</p>
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <p className="font-medium text-gray-900">Privacidade</p>
                <p className="text-sm text-gray-600">Controle quem pode ver suas informações</p>
              </button>
            </div>
          </div>
        </div>

        {/* Ações Rápidas */}
        {isProfessional && (
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={() => navigate('/profissional/dashboard')}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
              >
                <div className="text-2xl mb-2">📊</div>
                <p className="font-medium">Dashboard</p>
                <p className="text-sm text-gray-600">Ver estatísticas</p>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
                <div className="text-2xl mb-2">💼</div>
                <p className="font-medium">Serviços</p>
                <p className="text-sm text-gray-600">Gerenciar serviços</p>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
                <div className="text-2xl mb-2">⭐</div>
                <p className="font-medium">Avaliações</p>
                <p className="text-sm text-gray-600">Ver feedback</p>
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}