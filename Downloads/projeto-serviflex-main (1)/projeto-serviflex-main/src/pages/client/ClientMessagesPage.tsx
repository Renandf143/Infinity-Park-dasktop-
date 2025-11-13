import { useAuthContext } from "../../contexts/AuthContext";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { ModernChatInterface } from "../../components/chat/ModernChatInterface";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

export function ClientMessagesPage() {
  const { user, loading } = useAuthContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [autoOpenUserId, setAutoOpenUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const chatId = searchParams.get('chatId');
    if (chatId) {
      setAutoOpenUserId(chatId);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Mensagens</h1>
          <p className="text-gray-600 mt-1">Converse com os profissionais</p>
        </div>

        <ModernChatInterface
          currentUserId={user.uid}
          currentUserName={user.displayName || "Cliente"}
          currentUserPhoto={user.photoURL || ""}
          autoOpenUserId={autoOpenUserId}
          userType="client"
        />
      </main>

      <Footer />
    </div>
  );
}
