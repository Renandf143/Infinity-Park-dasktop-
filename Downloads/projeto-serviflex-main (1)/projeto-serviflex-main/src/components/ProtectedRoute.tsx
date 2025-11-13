import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { Loader2Icon } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireClient?: boolean;
  requireProfessional?: boolean;
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  requireClient = false,
  requireProfessional = false,
}: ProtectedRouteProps) {
  const { user, userData, loading, isClient, isProfessional } = useAuthContext();

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2Icon className="w-12 h-12 text-[#1E3A8A] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Verificar se requer autenticação
  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  // Verificar se requer ser cliente
  if (requireClient && !isClient) {
    return <Navigate to="/" replace />;
  }

  // Verificar se requer ser profissional
  if (requireProfessional && !isProfessional) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
