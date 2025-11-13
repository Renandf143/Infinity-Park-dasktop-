import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
export function AuthCallback() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Com Firebase, não precisamos mais de callback de redirect
    // Redirecionamos diretamente para login
    console.log('⚠️ Callback não necessário com Firebase. Redirecionando...');
    navigate('/login');
  }, [navigate]);
  return <div className="w-full min-h-screen bg-gradient-to-br from-[#2563EB] via-[#1E40AF] to-[#0F172A] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-xl font-semibold">Processando login...</p>
      </div>
    </div>;
}