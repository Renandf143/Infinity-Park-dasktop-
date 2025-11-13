import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ChatModal } from "../components/ChatModal";
import { professionalService } from "../services/professionalService";
import { professionalProfileService } from "../services/professionalProfileService";
import { useAuthContext } from "../contexts/AuthContext";
import { ServiceProviderProfile } from "../types/firestore";
import { Review, PortfolioItem, Certification, ReviewReply } from "../types/professional";
import { addDoc, collection, Timestamp, onSnapshot, doc, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import {
  StarIcon,
  MapPinIcon,
  ArrowLeftIcon,
  Loader2Icon,
  PhoneIcon,
  MailIcon,
  AwardIcon,
  ImageIcon,
  CheckCircleIcon,
  CalendarIcon,
  ExternalLinkIcon,
  UserIcon,
  SendIcon,
  MessageCircleIcon,
  BriefcaseIcon,
  ClockIcon,
  TrendingUpIcon,
  ShieldCheckIcon,
  ThumbsUpIcon,
  BadgeCheckIcon,
  SparklesIcon,
  TrophyIcon,
  Share2Icon,
  CopyIcon,
  XIcon,
  MapIcon,
  ZoomInIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  NavigationIcon,
  ActivityIcon,
} from "lucide-react";
import { RealtimeMap } from "../components/RealtimeMap";
import { useRealtimeLocation } from "../hooks/useRealtimeLocation";

export function ProfessionalDetailPage() {
  const { professionalId } = useParams<{ professionalId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [professional, setProfessional] =
    useState<ServiceProviderProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [reviewReplies, setReviewReplies] = useState<Map<string, ReviewReply[]>>(new Map());
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "sobre" | "portfolio" | "certificacoes" | "avaliacoes" | "experiencia"
  >("sobre");

  // Chat modal
  const [showChatModal, setShowChatModal] = useState(false);

  // Review form
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
    serviceType: "",
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  // Share modal
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);

  // Gallery modal
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Review reply
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  // Location tracking
  const { tracking: professionalTracking } = useRealtimeLocation(professionalId || null, false);
  const [clientLocation, setClientLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [showRouteOnMap, setShowRouteOnMap] = useState(false);

  // Get client location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setClientLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.log('Erro ao obter localização do cliente:', error);
        }
      );
    }
  }, []);

  const handleOpenChat = () => {
    if (!user) {
      alert("Você precisa estar logado para enviar mensagens");
      navigate("/login");
      return;
    }
    setShowChatModal(true);
  };

  const handleShareProfile = () => {
    const link = `${window.location.origin}/profissional/${professionalId}`;
    setShareLink(link);
    setShowShareModal(true);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      console.error("Erro ao copiar link:", error);
    }
  };

  const handleOpenGallery = (images: string[], startIndex = 0) => {
    setGalleryImages(images);
    setCurrentImageIndex(startIndex);
    setShowGalleryModal(true);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleSubmitReply = async (reviewId: string) => {
    if (!user || !replyText.trim()) return;

    setSubmittingReply(true);
    try {
      await addDoc(collection(db, "reviewReplies"), {
        reviewId,
        professionalId,
        userId: user.uid,
        userName: user.displayName || "Usuário",
        userPhoto: user.photoURL || "",
        text: replyText,
        createdAt: Timestamp.now(),
      });

      alert("Resposta enviada com sucesso!");
      setReplyingTo(null);
      setReplyText("");
      loadAllData();
    } catch (error) {
      console.error("Erro ao enviar resposta:", error);
      alert("Erro ao enviar resposta");
    } finally {
      setSubmittingReply(false);
    }
  };

  const loadAllData = useCallback(async () => {
    if (!professionalId) {
      console.error('❌ professionalId não fornecido');
      setLoading(false);
      return;
    }

    console.log('🔄 Carregando dados do profissional em tempo real:', professionalId);
    setLoading(true);
    
    try {
      // Carregar dados iniciais
      const [profData, reviewsData, portfolioData, certificationsData, repliesData] =
        await Promise.all([
          professionalService.getProfessionalById(professionalId),
          professionalProfileService.getReviews(professionalId),
          professionalProfileService.getPortfolio(professionalId),
          professionalProfileService.getCertifications(professionalId),
          professionalProfileService.getAllReviewReplies(professionalId),
        ]);

      console.log('✅ Dados carregados:', {
        profissional: profData ? 'Encontrado' : 'Não encontrado',
        avaliacoes: reviewsData.length,
        portfolio: portfolioData.length,
        certificacoes: certificationsData.length,
        respostas: repliesData.size
      });

      setProfessional(profData);
      setReviews(reviewsData);
      setPortfolio(portfolioData);
      setCertifications(certificationsData);
      setReviewReplies(repliesData);
    } catch (error: unknown) {
      console.error("❌ Erro ao carregar dados:", error);
      // Se for erro de índice, mostrar aviso mas não quebrar a página
      if (error?.code === 'failed-precondition' || error?.message?.includes('index')) {
        console.warn('⚠️ Alguns recursos podem estar limitados. Crie os índices do Firestore para habilitar todas as funcionalidades.');
      }
    } finally {
      setLoading(false);
    }
  }, [professionalId]);

  // Carregar dados iniciais
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Listener em tempo real para dados do profissional
  useEffect(() => {
    if (!professionalId) return;

    console.log('👂 Iniciando listener em tempo real para:', professionalId);
    
    // Listener para dados do profissional
    const unsubscribeProfessional = onSnapshot(
      doc(db, 'serviceProviders', professionalId),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          console.log('🔄 Dados do profissional atualizados em tempo real');
          setProfessional({
            id: docSnapshot.id,
            ...data
          } as ServiceProviderProfile);
        } else {
          console.warn('⚠️ Profissional não encontrado:', professionalId);
        }
      },
      (error) => {
        console.error('❌ Erro no listener do profissional:', error);
      }
    );

    // Listener para avaliações
    const reviewsQuery = query(
      collection(db, 'reviews'),
      where('professionalId', '==', professionalId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeReviews = onSnapshot(
      reviewsQuery,
      (snapshot) => {
        const reviewsData = snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data()
        })) as Review[];
        console.log('🔄 Avaliações atualizadas em tempo real:', reviewsData.length);
        setReviews(reviewsData);
      },
      (error) => {
        console.error('❌ Erro no listener de avaliações:', error);
        // Se der erro de índice, usar dados já carregados
        if (error.code === 'failed-precondition') {
          console.warn('⚠️ Índice necessário. Usando dados já carregados.');
        }
      }
    );

    // Cleanup
    return () => {
      console.log('🔌 Desconectando listeners');
      unsubscribeProfessional();
      unsubscribeReviews();
    };
  }, [professionalId]);

  const handleSubmitReview = async () => {
    if (!user || !professionalId) {
      alert("Você precisa estar logado para avaliar");
      navigate("/login");
      return;
    }

    if (!reviewForm.comment.trim() || !reviewForm.serviceType.trim()) {
      alert("Preencha todos os campos");
      return;
    }

    setSubmittingReview(true);
    try {
      await addDoc(collection(db, "reviews"), {
        professionalId,
        clientId: user.uid,
        clientName: user.displayName || "Cliente",
        clientPhoto: user.photoURL || "",
        rating: reviewForm.rating,
        comment: reviewForm.comment,
        serviceType: reviewForm.serviceType,
        helpful: 0,
        createdAt: Timestamp.now(),
      });

      alert("Avaliação enviada com sucesso!");
      setShowReviewModal(false);
      setReviewForm({ rating: 5, comment: "", serviceType: "" });
      loadAllData();
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
      alert("Erro ao enviar avaliação");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <Loader2Icon className="w-12 h-12 animate-spin mx-auto mb-4 text-[#1E40AF]" />
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!professional) {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Profissional não encontrado
          </h1>
          <button
            onClick={() => navigate("/categorias")}
            className="px-6 py-3 bg-[#1E40AF] text-white rounded-lg hover:opacity-90 transition-colors"
          >
            Ver Categorias
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : professional.rating || 0;

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div className="bg-[#1E40AF] text-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Voltar
          </button>

          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {professional.user?.photoUrl || professional.photoUrl ? (
                <img
                  src={professional.user?.photoUrl || professional.photoUrl || ''}
                  alt={professional.user?.displayName || professional.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white/20"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
                  <UserIcon className="w-12 h-12 text-white" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">
                {professional.user.displayName}
              </h1>

              <p className="text-base text-white/90 mb-3">
                {professional.profession}
              </p>

              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <StarIcon className="w-5 h-5 text-yellow-300 fill-current" />
                  <span className="font-semibold">
                    {averageRating.toFixed(1)}
                  </span>
                  <span className="text-white/70">
                    ({reviews.length}{" "}
                    {reviews.length === 1 ? "avaliação" : "avaliações"})
                  </span>
                </div>

                {professional.location && (
                  <div className="flex items-center gap-1 text-white/80">
                    <MapPinIcon className="w-4 h-4" />
                    {typeof professional.location === "string"
                      ? professional.location
                      : `${professional.location.city}, ${professional.location.state}`}
                  </div>
                )}

                <div className="flex items-center gap-1 text-white/80">
                  <BriefcaseIcon className="w-4 h-4" />
                  <span>{professional.completedJobs || 0} trabalhos concluídos</span>
                </div>

                <div className="flex items-center gap-1 text-white/80">
                  <ClockIcon className="w-4 h-4" />
                  <span>Responde em até 2h</span>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {professional.verified && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-green-500/20 border border-green-300/30 text-white rounded-full text-xs font-semibold">
                    <BadgeCheckIcon className="w-3.5 h-3.5" />
                    Verificado
                  </div>
                )}
                {(professional.completedJobs || 0) > 50 && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 border border-yellow-300/30 text-white rounded-full text-xs font-semibold">
                    <TrophyIcon className="w-3.5 h-3.5" />
                    Top Profissional
                  </div>
                )}
                {averageRating >= 4.5 && reviews.length >= 10 && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-purple-500/20 border border-purple-300/30 text-white rounded-full text-xs font-semibold">
                    <SparklesIcon className="w-3.5 h-3.5" />
                    Altamente Recomendado
                  </div>
                )}
                <div className="flex items-center gap-1 px-3 py-1 bg-blue-500/20 border border-blue-300/30 text-white rounded-full text-xs font-semibold">
                  <ShieldCheckIcon className="w-3.5 h-3.5" />
                  Garantia de Qualidade
                </div>
              </div>

              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => navigate(`/contratar/${professionalId}`)}
                  className="px-5 py-2 bg-white text-[#1E40AF] rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm"
                >
                  Contratar Serviço
                </button>
                <button
                  onClick={handleOpenChat}
                  className="px-5 py-2 bg-transparent text-white border-2 border-white rounded-lg font-medium hover:bg-white/10 transition-colors text-sm flex items-center gap-2"
                >
                  <MessageCircleIcon className="w-4 h-4" />
                  Entrar em Contato
                </button>
                <button
                  onClick={handleShareProfile}
                  className="px-5 py-2 bg-transparent text-white border-2 border-white rounded-lg font-medium hover:bg-white/10 transition-colors text-sm flex items-center gap-2"
                >
                  <Share2Icon className="w-4 h-4" />
                  Compartilhar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto">
            {[
              { id: "sobre", label: "Sobre" },
              { id: "experiencia", label: "Experiência" },
              { id: "avaliacoes", label: `Avaliações (${reviews.length})` },
              { id: "portfolio", label: `Portfólio (${portfolio.length})` },
              {
                id: "certificacoes",
                label: `Certificações (${certifications.length})`,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`py-3 px-6 border-b-2 font-medium transition-colors text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-[#1E40AF] text-[#1E40AF]"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "sobre" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <BriefcaseIcon className="w-8 h-8 opacity-80" />
                  <TrendingUpIcon className="w-5 h-5 opacity-60" />
                </div>
                <p className="text-2xl font-bold mb-1">{professional.completedJobs || 0}</p>
                <p className="text-sm opacity-90">Trabalhos Concluídos</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-4 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <StarIcon className="w-8 h-8 opacity-80 fill-current" />
                  <TrendingUpIcon className="w-5 h-5 opacity-60" />
                </div>
                <p className="text-2xl font-bold mb-1">{averageRating.toFixed(1)}</p>
                <p className="text-sm opacity-90">Avaliação Média</p>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <ThumbsUpIcon className="w-8 h-8 opacity-80" />
                  <TrendingUpIcon className="w-5 h-5 opacity-60" />
                </div>
                <p className="text-2xl font-bold mb-1">{reviews.length}</p>
                <p className="text-sm opacity-90">Avaliações</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <ClockIcon className="w-8 h-8 opacity-80" />
                  <TrendingUpIcon className="w-5 h-5 opacity-60" />
                </div>
                <p className="text-2xl font-bold mb-1">2h</p>
                <p className="text-sm opacity-90">Tempo de Resposta</p>
              </div>
            </div>

            {/* Bio */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-[#1E40AF]" />
                Sobre
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {professional.bio || "Nenhuma descrição disponível."}
              </p>
            </div>

            {/* Skills */}
            {professional.skills && professional.skills.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5 text-[#1E40AF]" />
                  Habilidades
                </h2>
                <div className="flex flex-wrap gap-2">
                  {professional.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-full text-sm font-medium border border-blue-200 hover:shadow-md transition-shadow"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Diferenciais */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrophyIcon className="w-5 h-5 text-[#1E40AF]" />
                Diferenciais
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ShieldCheckIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Garantia de Qualidade</h3>
                    <p className="text-sm text-gray-600">Todos os serviços com garantia de satisfação</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ClockIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Resposta Rápida</h3>
                    <p className="text-sm text-gray-600">Responde mensagens em até 2 horas</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BadgeCheckIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Profissional Verificado</h3>
                    <p className="text-sm text-gray-600">Identidade e qualificações verificadas</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                  <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrophyIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Alta Reputação</h3>
                    <p className="text-sm text-gray-600">Avaliação média de {averageRating.toFixed(1)} estrelas</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Disponibilidade */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ClockIcon className="w-5 h-5 text-[#1E40AF]" />
                Disponibilidade
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { day: "Segunda-feira", hours: "08:00 - 18:00", available: true },
                  { day: "Terça-feira", hours: "08:00 - 18:00", available: true },
                  { day: "Quarta-feira", hours: "08:00 - 18:00", available: true },
                  { day: "Quinta-feira", hours: "08:00 - 18:00", available: true },
                  { day: "Sexta-feira", hours: "08:00 - 18:00", available: true },
                  { day: "Sábado", hours: "08:00 - 12:00", available: true },
                  { day: "Domingo", hours: "Fechado", available: false },
                ].map((schedule, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      schedule.available
                        ? "bg-green-50 border-green-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <span className="font-medium text-gray-900">{schedule.day}</span>
                    <span
                      className={`text-sm font-semibold ${
                        schedule.available ? "text-green-700" : "text-gray-500"
                      }`}
                    >
                      {schedule.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Localização e Rastreamento em Tempo Real */}
            {professional.location && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <MapIcon className="w-5 h-5 text-[#1E40AF]" />
                    Localização e Rastreamento
                  </h2>
                  {professionalTracking?.isActive && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 border border-green-300 rounded-full">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-semibold text-green-700">Ao Vivo</span>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Informações de Localização */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPinIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Atende em</p>
                        <p className="text-gray-900 font-semibold">
                          {typeof professional.location === "string"
                            ? professional.location
                            : `${professional.location.city}, ${professional.location.state}`}
                        </p>
                      </div>
                    </div>

                    {professionalTracking?.isActive && (
                      <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <NavigationIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Status</p>
                          <p className="text-gray-900 font-semibold">Rastreamento Ativo</p>
                          <p className="text-xs text-gray-600 mt-1">
                            Precisão: ±{professionalTracking.location.accuracy.toFixed(0)}m
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Controles do Mapa */}
                  {professionalTracking?.isActive && clientLocation && (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <input
                        type="checkbox"
                        id="showRoute"
                        checked={showRouteOnMap}
                        onChange={(e) => setShowRouteOnMap(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <label htmlFor="showRoute" className="text-sm font-medium text-gray-700 cursor-pointer">
                        Mostrar rota até minha localização
                      </label>
                    </div>
                  )}
                  
                  {/* Mapa em Tempo Real */}
                  <RealtimeMap
                    professionalLocation={professionalTracking || undefined}
                    clientLocation={clientLocation || undefined}
                    showRoute={showRouteOnMap}
                    height="400px"
                  />

                  {/* Informações Adicionais */}
                  {!professionalTracking?.isActive && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <ActivityIcon className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-yellow-900">Rastreamento Desativado</p>
                          <p className="text-xs text-yellow-700 mt-1">
                            O profissional não está compartilhando a localização em tempo real no momento. 
                            Durante o serviço, você poderá acompanhar a localização dele aqui.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {professionalTracking?.isActive && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                        <ShieldCheckIcon className="w-4 h-4" />
                        Segurança e Transparência
                      </h4>
                      <ul className="space-y-1 text-xs text-blue-800">
                        <li>• Acompanhe a localização do profissional em tempo real</li>
                        <li>• Veja a rota e tempo estimado de chegada</li>
                        <li>• Maior segurança para você e para o profissional</li>
                        <li>• Rastreamento ativo apenas durante o serviço</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Contact */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MailIcon className="w-5 h-5 text-[#1E40AF]" />
                Contato
              </h2>
              <div className="space-y-3">
                {professional.phoneNumber && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <PhoneIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Telefone</p>
                      <p className="text-gray-900 font-medium">{professional.phoneNumber}</p>
                    </div>
                  </div>
                )}
                {professional.user.email && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <MailIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">E-mail</p>
                      <p className="text-gray-900 font-medium">{professional.user.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "experiencia" && (
          <div className="space-y-6">
            {/* Áreas de Atuação */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-[#1E40AF]" />
                Áreas de Atuação
              </h2>
              {professional.skills && professional.skills.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {professional.skills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckCircleIcon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-900 font-medium">{skill}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">
                  Nenhuma área de atuação cadastrada ainda.
                </p>
              )}
            </div>

            {/* Estatísticas Reais */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUpIcon className="w-5 h-5 text-[#1E40AF]" />
                Estatísticas de Desempenho
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-blue-900">Serviços Concluídos</span>
                    <BriefcaseIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-3xl font-bold text-blue-900">{professional.completedJobs || 0}</p>
                  <p className="text-xs text-blue-700 mt-1">Total de trabalhos finalizados</p>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border-2 border-yellow-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-yellow-900">Avaliação Média</span>
                    <StarIcon className="w-5 h-5 text-yellow-600" />
                  </div>
                  <p className="text-3xl font-bold text-yellow-900">
                    {professional.rating ? professional.rating.toFixed(1) : '0.0'}
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Baseado em {professional.reviewCount || 0} avaliações
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-green-900">Membro desde</span>
                    <CalendarIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-xl font-bold text-green-900">
                    {professional.createdAt && typeof professional.createdAt === 'object' && 'toDate' in professional.createdAt
                      ? professional.createdAt.toDate().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
                      : professional.createdAt && typeof professional.createdAt === 'string'
                      ? new Date(professional.createdAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
                      : 'Recente'
                    }
                  </p>
                  <p className="text-xs text-green-700 mt-1">Data de cadastro na plataforma</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-purple-900">Taxa de Resposta</span>
                    <MessageCircleIcon className="w-5 h-5 text-purple-600" />
                  </div>
                  <p className="text-3xl font-bold text-purple-900">
                    {professional.responseRate ? `${professional.responseRate}%` : 'N/A'}
                  </p>
                  <p className="text-xs text-purple-700 mt-1">Tempo médio de resposta</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "avaliacoes" && (
          <div className="space-y-6">
            {/* Resumo de Avaliações */}
            {reviews.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Resumo das Avaliações</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Média Geral */}
                  <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200">
                    <div className="text-5xl font-bold text-gray-900 mb-2">{averageRating.toFixed(1)}</div>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          className={`w-6 h-6 ${
                            star <= Math.round(averageRating)
                              ? "text-yellow-500 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 font-medium">{reviews.length} avaliações</p>
                  </div>

                  {/* Distribuição de Estrelas */}
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const count = reviews.filter(r => r.rating === stars).length;
                      const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                      return (
                        <div key={stars} className="flex items-center gap-3">
                          <div className="flex items-center gap-1 w-20">
                            <span className="text-sm font-medium text-gray-700">{stars}</span>
                            <StarIcon className="w-4 h-4 text-yellow-500 fill-current" />
                          </div>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Botão Avaliar */}
            {reviews.length > 0 && (
              <div className="flex justify-end">
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="px-6 py-3 bg-[#1E40AF] text-white rounded-lg hover:opacity-90 transition-colors font-medium flex items-center gap-2"
                >
                  <StarIcon className="w-5 h-5" />
                  Deixar Avaliação
                </button>
              </div>
            )}

            {/* Lista de Avaliações */}
            {reviews.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <StarIcon className="w-10 h-10 text-yellow-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhuma avaliação ainda
                </h3>
                <p className="text-gray-600 mb-6">
                  Seja o primeiro a avaliar este profissional
                </p>
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="px-6 py-3 bg-[#1E40AF] text-white rounded-lg hover:opacity-90 transition-colors font-medium"
                >
                  Deixar Avaliação
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      {review.clientPhoto ? (
                        <img
                          src={review.clientPhoto}
                          alt={review.clientName}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center border-2 border-blue-300">
                          <UserIcon className="w-6 h-6 text-blue-600" />
                        </div>
                      )}

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {review.clientName}
                            </p>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <CalendarIcon className="w-3.5 h-3.5" />
                              {new Date(review.createdAt).toLocaleDateString(
                                "pt-BR",
                                {
                                  day: "2-digit",
                                  month: "long",
                                  year: "numeric",
                                }
                              )}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <StarIcon
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= review.rating
                                    ? "text-yellow-500 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium mb-3 border border-blue-200">
                          {review.serviceType}
                        </div>

                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>

                        {/* Ações da avaliação */}
                        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                          <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                            <ThumbsUpIcon className="w-4 h-4" />
                            <span>Útil ({review.helpful || 0})</span>
                          </button>
                          <button
                            onClick={() => setReplyingTo(review.id)}
                            className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            <MessageCircleIcon className="w-4 h-4" />
                            <span>Responder</span>
                          </button>
                          <button
                            onClick={() => {
                              const reviewLink = `${window.location.origin}/profissional/${professionalId}?review=${review.id}`;
                              navigator.clipboard.writeText(reviewLink);
                              alert("Link da avaliação copiado!");
                            }}
                            className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            <Share2Icon className="w-4 h-4" />
                            <span>Compartilhar</span>
                          </button>
                        </div>

                        {/* Formulário de Resposta */}
                        {replyingTo === review.id && (
                          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-start gap-3">
                              {user?.photoURL ? (
                                <img
                                  src={user.photoURL}
                                  alt="Você"
                                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-300"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                                  <UserIcon className="w-5 h-5 text-blue-600" />
                                </div>
                              )}
                              <div className="flex-1">
                                <textarea
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  placeholder="Escreva sua resposta..."
                                  className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                  rows={3}
                                />
                                <div className="flex gap-2 mt-2">
                                  <button
                                    onClick={() => handleSubmitReply(review.id)}
                                    disabled={submittingReply || !replyText.trim()}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 flex items-center gap-2"
                                  >
                                    {submittingReply ? (
                                      <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Enviando...
                                      </>
                                    ) : (
                                      <>
                                        <SendIcon className="w-4 h-4" />
                                        Enviar
                                      </>
                                    )}
                                  </button>
                                  <button
                                    onClick={() => {
                                      setReplyingTo(null);
                                      setReplyText("");
                                    }}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                                  >
                                    Cancelar
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Respostas Existentes */}
                        {review.id && reviewReplies.has(review.id) && reviewReplies.get(review.id)?.length > 0 && (
                          <div className="mt-4 ml-8 space-y-3">
                            {reviewReplies.get(review.id)?.map((reply) => (
                              <div key={reply.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-start gap-3">
                                  {reply.userPhoto ? (
                                    <img
                                      src={reply.userPhoto}
                                      alt={reply.userName}
                                      className="w-8 h-8 rounded-full object-cover border-2 border-gray-300"
                                    />
                                  ) : (
                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                      <UserIcon className="w-4 h-4 text-gray-500" />
                                    </div>
                                  )}
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <p className="font-semibold text-sm text-gray-900">
                                        {reply.userName}
                                      </p>
                                      {reply.userId === professionalId && (
                                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                                          Profissional
                                        </span>
                                      )}
                                      <span className="text-xs text-gray-500">
                                        {new Date(reply.createdAt).toLocaleDateString("pt-BR")}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-700">{reply.text}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "portfolio" && (
          <div className="space-y-6">
            {portfolio.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ImageIcon className="w-10 h-10 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhum trabalho no portfólio
                </h3>
                <p className="text-gray-600">
                  Este profissional ainda não adicionou trabalhos ao portfólio
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolio.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1"
                  >
                    <div 
                      className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden group cursor-pointer"
                      onClick={() => item.images.length > 0 && handleOpenGallery(item.images, 0)}
                    >
                      {item.images[0] ? (
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      {item.images.length > 0 && (
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <ZoomInIcon className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      )}
                      {item.images.length > 1 && (
                        <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/80 text-white text-xs rounded-lg font-medium backdrop-blur-sm flex items-center gap-1">
                          <ImageIcon className="w-3.5 h-3.5" />
                          +{item.images.length - 1}
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1.5 bg-blue-500 text-white text-xs rounded-lg font-semibold shadow-lg">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <h4 className="font-bold text-gray-900 mb-2 text-lg">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
                        <CalendarIcon className="w-4 h-4" />
                        <span>Concluído em {new Date(item.completedAt).toLocaleDateString("pt-BR")}</span>
                      </div>

                      {item.links && item.links.length > 0 && (
                        <div className="space-y-2">
                          {item.links.map((link, index) => (
                            <a
                              key={index}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium border border-blue-200"
                            >
                              <ExternalLinkIcon className="w-4 h-4" />
                              <span>Ver Projeto Completo</span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "certificacoes" && (
          <div className="space-y-6">
            {certifications.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AwardIcon className="w-10 h-10 text-purple-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhuma certificação cadastrada
                </h3>
                <p className="text-gray-600">
                  Este profissional ainda não adicionou certificações
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {certifications.map((cert) => (
                  <div
                    key={cert.id}
                    className="bg-white rounded-xl shadow-sm p-6 relative border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1"
                  >
                    {cert.verified && (
                      <div className="absolute top-4 right-4 z-10">
                        <div className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full text-xs font-bold shadow-lg">
                          <CheckCircleIcon className="w-4 h-4" />
                          Verificado
                        </div>
                      </div>
                    )}

                    {cert.imageUrl && (
                      <div className="mb-5 rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm">
                        <img
                          src={cert.imageUrl}
                          alt={cert.title}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    )}

                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <AwardIcon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-1 text-lg">
                          {cert.title}
                        </h4>
                        <p className="text-sm text-gray-600 font-medium">{cert.issuer}</p>
                      </div>
                    </div>

                    {cert.description && (
                      <p className="text-sm text-gray-700 mb-4 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-200">
                        {cert.description}
                      </p>
                    )}

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-2 rounded-lg">
                        <CalendarIcon className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">Emitido:</span>
                        <span>{new Date(cert.issueDate).toLocaleDateString("pt-BR")}</span>
                      </div>
                      {cert.expiryDate && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-orange-50 p-2 rounded-lg">
                          <CalendarIcon className="w-4 h-4 text-orange-600" />
                          <span className="font-medium">Validade:</span>
                          <span>{new Date(cert.expiryDate).toLocaleDateString("pt-BR")}</span>
                        </div>
                      )}
                    </div>

                    {cert.credentialId && (
                      <div className="mb-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-600 mb-1.5 font-semibold uppercase tracking-wide">
                          ID da Credencial
                        </p>
                        <p className="text-sm font-mono text-gray-900 font-semibold break-all">
                          {cert.credentialId}
                        </p>
                      </div>
                    )}

                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all text-sm font-bold shadow-md hover:shadow-lg"
                      >
                        <ExternalLinkIcon className="w-4 h-4" />
                        Verificar Credencial
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chat Modal */}
      {showChatModal && user && (
        <ChatModal
          isOpen={showChatModal}
          onClose={() => setShowChatModal(false)}
          professionalId={professionalId!}
          professionalName={professional.user.displayName}
          professionalPhoto={professional.user.photoUrl}
          currentUserId={user.uid}
          currentUserName={user.displayName || "Usuário"}
          currentUserPhoto={user.photoURL || ""}
        />
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Avaliar {professional.user.displayName}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avaliação
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() =>
                        setReviewForm({ ...reviewForm, rating: star })
                      }
                      className="focus:outline-none"
                    >
                      <StarIcon
                        className={`w-8 h-8 ${
                          star <= reviewForm.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Serviço
                </label>
                <input
                  type="text"
                  value={reviewForm.serviceType}
                  onChange={(e) =>
                    setReviewForm({
                      ...reviewForm,
                      serviceType: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Instalação elétrica"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comentário
                </label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, comment: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Conte como foi sua experiência..."
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSubmitReview}
                  disabled={submittingReview}
                  className="flex-1 px-4 py-3 bg-[#1E40AF] text-white rounded-lg hover:opacity-90 transition-colors font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submittingReview ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <SendIcon className="w-5 h-5" />
                      Enviar Avaliação
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Compartilhar Perfil
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="text-center py-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Share2Icon className="w-10 h-10 text-white" />
                </div>
                <p className="text-gray-600 mb-4">
                  Compartilhe o perfil de {professional.user.displayName}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 mb-2 font-semibold">Link do Perfil</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={shareLink}
                    readOnly
                    className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-mono text-gray-700"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                      linkCopied
                        ? "bg-green-500 text-white"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {linkCopied ? (
                      <>
                        <CheckCircleIcon className="w-4 h-4" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <CopyIcon className="w-4 h-4" />
                        Copiar
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    window.open(
                      `https://wa.me/?text=${encodeURIComponent(
                        `Confira o perfil de ${professional.user.displayName}: ${shareLink}`
                      )}`,
                      "_blank"
                    );
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                >
                  <MessageCircleIcon className="w-5 h-5" />
                  WhatsApp
                </button>
                <button
                  onClick={() => {
                    window.open(
                      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        shareLink
                      )}`,
                      "_blank"
                    );
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Share2Icon className="w-5 h-5" />
                  Facebook
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      {showGalleryModal && galleryImages.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
          <button
            onClick={() => setShowGalleryModal(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <XIcon className="w-8 h-8" />
          </button>

          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Imagem Principal */}
            <div className="relative max-w-5xl max-h-full">
              <img
                src={galleryImages[currentImageIndex]}
                alt={`Imagem ${currentImageIndex + 1}`}
                className="max-w-full max-h-[85vh] object-contain rounded-lg"
              />

              {/* Contador */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black/70 text-white rounded-full text-sm font-medium backdrop-blur-sm">
                {currentImageIndex + 1} / {galleryImages.length}
              </div>
            </div>

            {/* Botões de Navegação */}
            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <ChevronLeftIcon className="w-8 h-8" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <ChevronRightIcon className="w-8 h-8" />
                </button>
              </>
            )}

            {/* Miniaturas */}
            {galleryImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4 py-2 bg-black/50 rounded-lg backdrop-blur-sm">
                {galleryImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? "border-blue-500 scale-110"
                        : "border-white/30 hover:border-white/60"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Miniatura ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
