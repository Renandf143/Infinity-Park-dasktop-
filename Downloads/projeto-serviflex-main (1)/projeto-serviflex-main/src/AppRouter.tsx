import { BrowserRouter, Routes, Route } from "react-router-dom";
import { App } from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ProfessionalDashboard } from "./pages/professional/ProfessionalDashboard";
import { ProfessionalProfile } from "./pages/ProfessionalProfile";
import { TermsOfService } from "./pages/TermsOfService";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { CategoryPageNew } from "./pages/CategoryPageNew";
import { AllCategoriesWithProfessionals } from "./pages/AllCategoriesWithProfessionals";
import { SetupPage } from "./pages/SetupPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { HowItWorksPage } from "./pages/HowItWorksPage";
import { ProfessionalDetailPage } from "./pages/ProfessionalDetailPage";
import { HireServicePage } from "./pages/HireServicePage";
import { ClientDashboard } from "./pages/client/ClientDashboard";
import { ClientMessagesPage } from "./pages/client/ClientMessagesPage";
import { ClientServicesPage } from "./pages/client/ClientServicesPage";
import { ProfessionalServicesPage } from "./pages/professional/ProfessionalServicesPage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recuperar-senha" element={<ForgotPassword />} />
          <Route
            path="/profissional/dashboard"
            element={
              <ProtectedRoute requireProfessional>
                <ProfessionalDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profissional/perfil"
            element={
              <ProtectedRoute requireProfessional>
                <ProfessionalProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profissional/servicos"
            element={
              <ProtectedRoute requireProfessional>
                <ProfessionalServicesPage />
              </ProtectedRoute>
            }
          />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/setup" element={<SetupPage />} />
          <Route
            path="/categorias"
            element={<AllCategoriesWithProfessionals />}
          />
          <Route path="/sobre" element={<AboutPage />} />
          <Route path="/contato" element={<ContactPage />} />
          <Route path="/como-funciona" element={<HowItWorksPage />} />
          <Route
            path="/categoria/:categorySlug"
            element={<CategoryPageNew />}
          />
          <Route
            path="/profissional/:professionalId"
            element={<ProfessionalDetailPage />}
          />
          <Route
            path="/contratar/:professionalId"
            element={
              <ProtectedRoute>
                <HireServicePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cliente/dashboard"
            element={
              <ProtectedRoute>
                <ClientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cliente/mensagens"
            element={
              <ProtectedRoute>
                <ClientMessagesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cliente/servicos"
            element={
              <ProtectedRoute>
                <ClientServicesPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
