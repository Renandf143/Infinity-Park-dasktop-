import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  HomeIcon,
  SettingsIcon,
  BarChart3Icon,
  CalendarIcon,
  MessageCircleIcon,
  StarIcon,
  TrendingUpIcon,
  DollarSignIcon,
  BellIcon,
  LogOutIcon,
  UserIcon,
  MenuIcon,
  XIcon,
  CheckIcon,
  XCircleIcon,
  ClockIcon,
  MapPinIcon,
  FileTextIcon,
  AlertCircleIcon,
  TrophyIcon,
  WalletIcon,
  AwardIcon,
  ImageIcon,
} from "lucide-react";
import { GamificationPanel } from "../../components/GamificationPanel";
import { WithdrawalPanel } from "../../components/WithdrawalPanel";
import { ReviewsPanel } from "../../components/ReviewsPanel";
import { PortfolioPanel } from "../../components/PortfolioPanel";
import { CertificationsPanel } from "../../components/CertificationsPanel";
import { ModernChatInterface } from "../../components/chat/ModernChatInterface";
import { EarningsChart } from "../../components/dashboard/EarningsChart";
import { UpcomingServices } from "../../components/dashboard/UpcomingServices";
import { MonthlyGoals } from "../../components/dashboard/MonthlyGoals";
import { QuickActions } from "../../components/dashboard/QuickActions";
import { FinancialSummary } from "../../components/dashboard/FinancialSummary";
import { PerformanceInsights } from "../../components/dashboard/PerformanceInsights";
import { ProfessionalCalendar } from "../../components/ProfessionalCalendar";
import { PaymentSystem } from "../../components/payments/PaymentSystem";
import { ProposalsList } from "../../components/ProposalsList";
import { AvailabilityManager } from "../../components/AvailabilityManager";
import '../../utils/createTestData';

export function ProfessionalDashboard() {
  const navigate = useNavigate();
  const { user, userData, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [serviceRequests, setServiceRequests] = useState<unknown[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [stats, setStats] = useState({
    rating: 0,
    reviewCount: 0,
    totalJobs: 0,
    totalEarnings: 0,
    ratingChange: 0,
    jobsChange: 0,
    earningsChange: 0,
  });

  const loadDashboardData = useCallback(async () => {
    if (!user) return;

    try {
      const { doc, getDoc, collection, query, where, getDocs, Timestamp } = await import(
        "firebase/firestore"
      );
      const { db } = await import("../../firebase");

      // Buscar perfil profissional
      const providerDoc = await getDoc(doc(db, "serviceProviders", user.uid));

      let currentRating = 0;
      let currentReviewCount = 0;

      if (providerDoc.exists()) {
        const data = providerDoc.data();
        currentRating = data.rating || 0;
        currentReviewCount = data.reviewCount || 0;
      }

      // Calcular estatísticas do mês atual
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

      // Serviços do mês atual
      const currentMonthQuery = query(
        collection(db, "serviceRequests"),
        where("professionalId", "==", user.uid),
        where("status", "==", "completed"),
        where("completedAt", ">=", Timestamp.fromDate(startOfMonth))
      );

      const currentMonthSnapshot = await getDocs(currentMonthQuery);
      let currentMonthJobs = 0;
      let currentMonthEarnings = 0;

      currentMonthSnapshot.docs.forEach(doc => {
        currentMonthJobs++;
        currentMonthEarnings += doc.data().estimatedValue || 0;
      });

      // Serviços do mês passado
      const lastMonthQuery = query(
        collection(db, "serviceRequests"),
        where("professionalId", "==", user.uid),
        where("status", "==", "completed"),
        where("completedAt", ">=", Timestamp.fromDate(startOfLastMonth)),
        where("completedAt", "<=", Timestamp.fromDate(endOfLastMonth))
      );

      const lastMonthSnapshot = await getDocs(lastMonthQuery);
      let lastMonthJobs = 0;
      let lastMonthEarnings = 0;

      lastMonthSnapshot.docs.forEach(doc => {
        lastMonthJobs++;
        lastMonthEarnings += doc.data().estimatedValue || 0;
      });

      // Calcular mudanças percentuais
      const jobsChange = lastMonthJobs > 0 
        ? ((currentMonthJobs - lastMonthJobs) / lastMonthJobs) * 100 
        : currentMonthJobs > 0 ? 100 : 0;

      const earningsChange = lastMonthEarnings > 0 
        ? ((currentMonthEarnings - lastMonthEarnings) / lastMonthEarnings) * 100 
        : currentMonthEarnings > 0 ? 100 : 0;

      // Rating change (comparar com média histórica)
      const ratingChange = currentRating >= 4.5 ? 5 : currentRating >= 4.0 ? 0 : -5;

      setStats({
        rating: currentRating,
        reviewCount: currentReviewCount,
        totalJobs: currentMonthJobs,
        totalEarnings: currentMonthEarnings,
        ratingChange,
        jobsChange,
        earningsChange,
      });

      // Buscar todas as solicitações
      setLoadingRequests(true);
      const requestsQuery = query(
        collection(db, "serviceRequests"),
        where("professionalId", "==", user.uid)
      );

      const querySnapshot = await getDocs(requestsQuery);
      const requests = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      requests.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
        return dateB.getTime() - dateA.getTime();
      });

      setServiceRequests(requests);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoadingRequests(false);
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
      return;
    }

    if (user && userData) {
      loadDashboardData();
    }
  }, [user, userData, loading, navigate, loadDashboardData]);

  // Listener em tempo real para estatísticas do profissional
  useEffect(() => {
    if (!user) return;

    const setupRealtimeListeners = async () => {
      const { doc, onSnapshot, collection, query, where } = await import(
        "firebase/firestore"
      );
      const { db } = await import("../../firebase");

      // Listener para perfil profissional
      const unsubscribeProfile = onSnapshot(
        doc(db, "serviceProviders", user.uid),
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setStats({
              rating: data.rating || 0,
              reviewCount: data.reviewCount || 0,
              totalJobs: data.stats?.totalJobs || 0,
              totalEarnings: data.stats?.totalEarnings || 0,
            });
          }
        }
      );

      // Listener para solicitações
      const requestsQuery = query(
        collection(db, "serviceRequests"),
        where("professionalId", "==", user.uid)
      );

      const unsubscribeRequests = onSnapshot(requestsQuery, (snapshot) => {
        const requests = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        requests.sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
          return dateB.getTime() - dateA.getTime();
        });

        setServiceRequests(requests);
        setLoadingRequests(false);
      });

      return () => {
        unsubscribeProfile();
        unsubscribeRequests();
      };
    };

    const unsubscribePromise = setupRealtimeListeners();

    return () => {
      unsubscribePromise.then((cleanup) => cleanup && cleanup());
    };
  }, [user]);

  const handleAcceptRequest = async (requestId: string) => {
    try {
      const { doc, updateDoc, serverTimestamp } = await import(
        "firebase/firestore"
      );
      const { db } = await import("../../firebase");

      await updateDoc(doc(db, "serviceRequests", requestId), {
        status: "accepted",
        respondedAt: serverTimestamp(), // Adiciona timestamp de resposta
        updatedAt: serverTimestamp(),
      });

      alert("Serviço aceito! O cliente será notificado.");
      loadDashboardData();
    } catch (error) {
      console.error("Erro ao aceitar solicitação:", error);
      alert("Erro ao aceitar solicitação.");
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    const reason = prompt("Por que você está recusando? (opcional)");

    try {
      const { doc, updateDoc, serverTimestamp } = await import(
        "firebase/firestore"
      );
      const { db } = await import("../../firebase");

      await updateDoc(doc(db, "serviceRequests", requestId), {
        status: "rejected",
        rejectionReason: reason || "",
        respondedAt: serverTimestamp(), // Adiciona timestamp de resposta
        updatedAt: serverTimestamp(),
      });

      alert("Serviço recusado.");
      loadDashboardData();
    } catch (error) {
      console.error("Erro ao recusar solicitação:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const menuItems = [
    { id: "overview", label: "Visão Geral", icon: BarChart3Icon },
    {
      id: "requests",
      label: "Solicitações",
      icon: CalendarIcon,
      badge: serviceRequests.filter((r) => r.status === "pending").length,
    },
    { id: "proposals", label: "Propostas", icon: FileTextIcon },
    { id: "agenda", label: "Agenda", icon: CalendarIcon },
    { id: "availability", label: "Disponibilidade", icon: ClockIcon },
    { id: "reviews", label: "Avaliações", icon: StarIcon },
    { id: "portfolio", label: "Portfólio", icon: ImageIcon },
    { id: "certifications", label: "Certificações", icon: AwardIcon },
    { id: "gamification", label: "Gamificação", icon: TrophyIcon },
    { id: "payments", label: "Pagamentos", icon: WalletIcon },
    { id: "messages", label: "Mensagens", icon: MessageCircleIcon },
    { id: "settings", label: "Configurações", icon: SettingsIcon },
  ];

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 group"
            >
              <img
                src="/logo-serviflex.png"
                alt="ServiFlex"
                className="h-10 w-auto"
              />
              <span className="text-xl font-bold text-[#2563EB]">
                ServiFlex
              </span>
            </button>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <XIcon className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#1E40AF] rounded-full flex items-center justify-center text-white font-bold text-lg">
                {user?.displayName?.charAt(0).toUpperCase() || "P"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {user?.displayName || "Profissional"}
                </p>
                <p className="text-sm text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <button
              onClick={() => navigate("/")}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <HomeIcon className="w-5 h-5" />
              <span className="font-medium">Ir para o Site</span>
            </button>

            <div className="pt-4 pb-2">
              <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Dashboard
              </p>
            </div>

            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative ${
                  activeTab === item.id
                    ? "bg-[#2563EB] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="ml-auto w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOutIcon className="w-5 h-5" />
              <span className="font-medium">Sair</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <MenuIcon className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {menuItems.find((item) => item.id === activeTab)?.label ||
                    "Dashboard"}
                </h1>
                <p className="text-sm text-gray-500">Bem-vindo de volta!</p>
              </div>
            </div>
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg relative"
              >
                <BellIcon className="w-6 h-6 text-gray-600" />
                {serviceRequests.filter((r) => r.status === "pending").length >
                  0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                    {
                      serviceRequests.filter((r) => r.status === "pending")
                        .length
                    }
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[500px] overflow-hidden flex flex-col">
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">
                      Notificações
                    </h3>
                    <button
                      onClick={() => setNotificationsOpen(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XIcon className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Notifications List */}
                  <div className="overflow-y-auto flex-1">
                    {serviceRequests.filter((r) => r.status === "pending")
                      .length === 0 ? (
                      <div className="p-8 text-center">
                        <BellIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">
                          Nenhuma notificação nova
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {serviceRequests
                          .filter((r) => r.status === "pending")
                          .slice(0, 5)
                          .map((request) => (
                            <button
                              key={request.id}
                              onClick={() => {
                                setActiveTab("requests");
                                setNotificationsOpen(false);
                              }}
                              className="w-full p-4 hover:bg-gray-50 transition-colors text-left"
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                                  {request.clientName
                                    ?.charAt(0)
                                    .toUpperCase() || "C"}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-gray-900 text-sm">
                                    Nova solicitação de {request.clientName}
                                  </p>
                                  <p className="text-sm text-gray-600 truncate">
                                    {request.serviceType}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <CalendarIcon className="w-3 h-3 text-gray-400" />
                                    <p className="text-xs text-gray-500">
                                      {new Date(
                                        request.date + "T00:00:00"
                                      ).toLocaleDateString("pt-BR")}{" "}
                                      às {request.time}
                                    </p>
                                  </div>
                                  <p className="text-xs text-blue-600 font-medium mt-1">
                                    R$ {request.estimatedValue?.toFixed(2)}
                                  </p>
                                </div>
                                <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></span>
                              </div>
                            </button>
                          ))}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  {serviceRequests.filter((r) => r.status === "pending")
                    .length > 0 && (
                    <div className="px-4 py-3 border-t border-gray-200">
                      <button
                        onClick={() => {
                          setActiveTab("requests");
                          setNotificationsOpen(false);
                        }}
                        className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        Ver todas as solicitações
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Coluna Esquerda (2/3) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <StarIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    {stats.ratingChange !== 0 && stats.ratingChange !== undefined && (
                      <span className={`text-sm font-medium ${stats.ratingChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stats.ratingChange > 0 ? '+' : ''}{stats.ratingChange?.toFixed(0) || 0}%
                      </span>
                    )}
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.rating?.toFixed(1) || '0.0'}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Avaliação ({stats.reviewCount})
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <TrendingUpIcon className="w-6 h-6 text-green-600" />
                    </div>
                    {stats.jobsChange !== 0 && stats.jobsChange !== undefined && (
                      <span className={`text-sm font-medium ${stats.jobsChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stats.jobsChange > 0 ? '+' : ''}{stats.jobsChange?.toFixed(0) || 0}%
                      </span>
                    )}
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalJobs || 0}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Trabalhos Concluídos (mês)
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <DollarSignIcon className="w-6 h-6 text-yellow-600" />
                    </div>
                    {stats.earningsChange !== 0 && stats.earningsChange !== undefined && (
                      <span className={`text-sm font-medium ${stats.earningsChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stats.earningsChange > 0 ? '+' : ''}{stats.earningsChange?.toFixed(0) || 0}%
                      </span>
                    )}
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    R$ {stats.totalEarnings?.toFixed(0) || '0'}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Ganhos (mês)</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <CalendarIcon className="w-6 h-6 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium text-yellow-600">
                      Pendente
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {
                      serviceRequests.filter((r) => r.status === "pending")
                        .length
                    }
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Novas Solicitações
                  </p>
                </div>
                </div>
                
                {/* Gráfico de Ganhos */}
                <EarningsChart />
                
                {/* Próximos Agendamentos */}
                <UpcomingServices />
                
                {/* Performance e Insights */}
                <PerformanceInsights />
              </div>
              
              {/* Coluna Direita (1/3) */}
              <div className="space-y-6">
                {/* Metas do Mês */}
                <MonthlyGoals />
                
                {/* Quick Actions */}
                <QuickActions />
                
                {/* Resumo Financeiro */}
                <FinancialSummary />
              </div>
            </div>
          )}

          {activeTab === "requests" && (
            <div className="space-y-6">
              {loadingRequests ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Carregando solicitações...</p>
                </div>
              ) : serviceRequests.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <AlertCircleIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Nenhuma solicitação ainda
                  </h4>
                  <p className="text-gray-600">
                    Quando clientes solicitarem seus serviços, elas aparecerão
                    aqui.
                  </p>
                </div>
              ) : (
                serviceRequests.map((request) => (
                  <div
                    key={request.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {request.clientName?.charAt(0).toUpperCase() || "C"}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">
                            {request.clientName}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {request.createdAt?.toDate
                              ? new Date(
                                  request.createdAt.toDate()
                                ).toLocaleString("pt-BR")
                              : "Data não disponível"}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          request.status === "pending"
                            ? "bg-yellow-500 text-white"
                            : request.status === "accepted"
                            ? "bg-green-500 text-white"
                            : "bg-gray-400 text-white"
                        }`}
                      >
                        {request.status === "pending"
                          ? "Pendente"
                          : request.status === "accepted"
                          ? "Aceito"
                          : "Recusado"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-start gap-2">
                        <FileTextIcon className="w-5 h-5 text-gray-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Serviço:
                          </p>
                          <p className="text-gray-900">{request.serviceType}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <CalendarIcon className="w-5 h-5 text-gray-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Data e Horário:
                          </p>
                          <p className="text-gray-900">
                            {new Date(
                              request.date + "T00:00:00"
                            ).toLocaleDateString("pt-BR")}{" "}
                            às {request.time}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPinIcon className="w-5 h-5 text-gray-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Local:
                          </p>
                          <p className="text-gray-900">
                            {request.address} - {request.city}/{request.state}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <DollarSignIcon className="w-5 h-5 text-gray-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Valor:
                          </p>
                          <p className="text-gray-900 font-bold">
                            R$ {request.estimatedValue?.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Descrição:
                      </p>
                      <p className="text-gray-900">{request.description}</p>
                    </div>

                    {request.status === "pending" && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleAcceptRequest(request.id)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#2563EB] text-white rounded-lg font-semibold hover:bg-[#1E40AF] transition-colors"
                        >
                          <CheckIcon className="w-5 h-5" />
                          Aceitar Serviço
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request.id)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-red-500 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors"
                        >
                          <XCircleIcon className="w-5 h-5" />
                          Recusar
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "reviews" && user && (
            <ReviewsPanel professionalId={user.uid} />
          )}

          {activeTab === "portfolio" && user && (
            <PortfolioPanel professionalId={user.uid} />
          )}

          {activeTab === "certifications" && user && (
            <CertificationsPanel professionalId={user.uid} />
          )}

          {activeTab === "gamification" && user && (
            <GamificationPanel userId={user.uid} />
          )}

          {activeTab === "payments" && user && (
            <PaymentSystem />
          )}

          {activeTab === "messages" && user && (
            <ModernChatInterface
              currentUserId={user.uid}
              currentUserName={user.displayName || "Profissional"}
              currentUserPhoto={user.photoURL || ""}
              userType="professional"
            />
          )}

          {activeTab === "proposals" && user && (
            <ProposalsList
              professionalId={user.uid}
              professionalName={user.displayName || "Profissional"}
              userType="professional"
            />
          )}

          {activeTab === "availability" && user && (
            <AvailabilityManager professionalId={user.uid} />
          )}

          {activeTab === "agenda" && user && (
            <ProfessionalCalendar professionalId={user.uid} />
          )}

          {activeTab === "settings" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Configurações
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={user?.displayName || ""}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <button
                  onClick={() => navigate("/profissional/perfil")}
                  className="w-full px-6 py-3 bg-[#2563EB] text-white rounded-lg font-semibold hover:bg-[#1E40AF] transition-colors"
                >
                  Editar Perfil Completo
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Notifications Overlay */}
      {notificationsOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setNotificationsOpen(false)}
        ></div>
      )}
    </div>
  );
}
