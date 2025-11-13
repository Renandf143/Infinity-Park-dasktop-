import { useState, useRef, useEffect } from 'react';
import { MenuIcon, XIcon, UserIcon, LogOutIcon, LayoutDashboardIcon, CalendarIcon, MessageCircleIcon, SettingsIcon, ChevronDownIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { NotificationBell } from './NotificationBell';
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user, loading, logout, getUserDisplayName, userData } = useAuth();

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const menuItems = [{
    label: 'Início',
    href: '/'
  }, {
    label: 'Como Funciona',
    href: '/como-funciona'
  }, {
    label: 'Categorias',
    href: '/categorias'
  }, {
    label: 'Sobre Nós',
    href: '/sobre'
  }, {
    label: 'Contato',
    href: '/contato'
  }];


  const handleNavClick = (href: string) => {
    navigate(href);
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };
  return <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 group">
              <img
                src="/logo-serviflex.png"
                alt="ServiFlex"
                className="h-10 w-auto"
              />
              <span className="text-2xl font-bold text-[#2563EB] hidden sm:block">
                ServiFlex
              </span>
            </button>
          </div>          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {menuItems.map(item => <button key={item.label} onClick={() => handleNavClick(item.href)} className="px-4 py-2 text-[#64748B] hover:text-[#2563EB] transition-colors font-medium rounded-lg hover:bg-gray-50">
                {item.label}
              </button>)}
          </nav>
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {loading ? (
              <div className="w-20 h-10 bg-gray-200 animate-pulse rounded-lg"></div>
            ) : user ? (
              <>
                {/* Notification Bell */}
                <NotificationBell userId={user.uid} />
                
                {/* Usuário logado - Dropdown Menu */}
                <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <div className="w-8 h-8 bg-[#1E40AF] rounded-full flex items-center justify-center text-white font-bold">
                    {getUserDisplayName().charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {getUserDisplayName()}
                  </span>
                  <ChevronDownIcon className={`w-4 h-4 text-gray-500 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{getUserDisplayName()}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                        {userData?.userType === 'professional' ? 'Profissional' : 'Cliente'}
                      </span>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      {userData?.userType === 'professional' ? (
                        <>
                          <button
                            onClick={() => {
                              navigate('/profissional/dashboard');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <LayoutDashboardIcon className="w-4 h-4" />
                            <span className="text-sm font-medium">Dashboard</span>
                          </button>
                          <button
                            onClick={() => {
                              navigate('/profissional/servicos');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <CalendarIcon className="w-4 h-4" />
                            <span className="text-sm font-medium">Solicitações</span>
                          </button>
                          <button
                            onClick={() => {
                              navigate(`/profissional/${user.uid}`);
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <UserIcon className="w-4 h-4" />
                            <span className="text-sm font-medium">Meu Perfil Público</span>
                          </button>
                          <button
                            onClick={() => {
                              navigate('/profissional/perfil');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <SettingsIcon className="w-4 h-4" />
                            <span className="text-sm font-medium">Editar Perfil</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              navigate('/cliente/servicos');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <CalendarIcon className="w-4 h-4" />
                            <span className="text-sm font-medium">Meus Serviços</span>
                          </button>
                          <button
                            onClick={() => {
                              navigate('/cliente/mensagens');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <MessageCircleIcon className="w-4 h-4" />
                            <span className="text-sm font-medium">Mensagens</span>
                          </button>
                          <button
                            onClick={() => {
                              navigate('/cliente/dashboard?tab=profile');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <UserIcon className="w-4 h-4" />
                            <span className="text-sm font-medium">Meu Perfil</span>
                          </button>
                          <button
                            onClick={() => {
                              navigate('/cliente/dashboard?tab=settings');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <SettingsIcon className="w-4 h-4" />
                            <span className="text-sm font-medium">Configurações</span>
                          </button>
                        </>
                      )}
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-100 pt-2">
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOutIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">Sair</span>
                      </button>
                    </div>
                  </div>
                )}
                </div>
              </>
            ) : (
              // Usuário não logado
              <>
                <button onClick={() => navigate('/login')} className="px-5 py-2.5 text-[#64748B] hover:text-[#2563EB] hover:bg-gray-50 rounded-lg transition-all font-medium">
                  Entrar
                </button>
                <button onClick={() => navigate('/register')} className="px-6 py-2.5 bg-[#2563EB] text-white rounded-lg hover:bg-[#1E40AF] transition-all font-medium shadow-md hover:shadow-lg">
                  Cadastrar
                </button>
              </>
            )}
          </div>
          {/* Mobile Menu Button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-[#64748B] hover:text-[#2563EB] transition-colors">
            {isMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && <div className="md:hidden py-4 border-t border-gray-200 bg-white">
            <nav className="flex flex-col space-y-2">
              {menuItems.map(item => <button key={item.label} onClick={() => handleNavClick(item.href)} className="text-left px-4 py-3 text-[#64748B] hover:text-[#2563EB] hover:bg-gray-50 rounded-lg transition-all font-medium">
                  {item.label}
                </button>)}
              <div className="pt-4 border-t border-gray-200 flex flex-col space-y-2">
                {loading ? (
                  <div className="px-4 py-3 bg-gray-200 animate-pulse rounded-lg"></div>
                ) : user ? (
                  // Usuário logado - Mobile
                  <>
                    <div className="flex items-center space-x-2 px-4 py-3 bg-gray-50 rounded-lg">
                      <UserIcon className="w-4 h-4 text-[#2563EB]" />
                      <span className="text-sm font-medium text-gray-700">
                        {getUserDisplayName()}
                      </span>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all font-medium text-left"
                    >
                      <LogOutIcon className="w-4 h-4" />
                      <span>Sair</span>
                    </button>
                  </>
                ) : (
                  // Usuário não logado - Mobile
                  <>
                    <button onClick={() => {
                      navigate('/login');
                      setIsMenuOpen(false);
                    }} className="px-4 py-3 text-[#64748B] hover:bg-gray-50 rounded-lg transition-all font-medium text-left">
                      Entrar
                    </button>
                    <button onClick={() => {
                      navigate('/register');
                      setIsMenuOpen(false);
                    }} className="px-6 py-3 bg-[#2563EB] text-white rounded-lg hover:bg-[#1E40AF] transition-all font-medium">
                      Cadastrar
                    </button>
                  </>
                )}
              </div>
            </nav>
          </div>}
      </div>
    </header>;
}