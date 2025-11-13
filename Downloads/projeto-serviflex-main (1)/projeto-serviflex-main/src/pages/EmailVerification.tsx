import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MailIcon, CheckCircleIcon, XCircleIcon, RefreshCwIcon } from 'lucide-react';
import { authService } from '../services/auth';

export function EmailVerification() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'sending' | 'sent' | 'error' | 'verified'>('sending');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Verificar se há email salvo
    const savedEmail = localStorage.getItem('emailForSignIn');
    if (savedEmail) {
      setEmail(savedEmail);
      setStatus('sent');
    } else {
      // Se não há email, redirecionar para registro
      navigate('/registro');
    }
  }, [navigate]);

  const handleResendEmail = async () => {
    if (!email) return;
    
    setLoading(true);
    try {
      await authService.sendVerificationEmail(email);
      setStatus('sent');
    } catch (error) {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToRegister = () => {
    localStorage.removeItem('emailForSignIn');
    navigate('/registro');
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/logo.png" alt="ServeFlex Logo" className="w-12 h-12 object-contain" />
            <h1 className="text-2xl font-bold text-[#1E3A8A]">ServiFlex</h1>
          </div>
        </div>

        {/* Content based on status */}
        {status === 'sending' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
              <RefreshCwIcon className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Enviando verificação...
            </h2>
            <p className="text-gray-600">
              Aguarde enquanto enviamos o email de verificação.
            </p>
          </motion.div>
        )}

        {status === 'sent' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <MailIcon className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Verifique seu email
            </h2>
            <p className="text-gray-600 mb-6">
              Enviamos um link de verificação para:
            </p>
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="font-semibold text-gray-900">{email}</p>
            </div>
            <p className="text-sm text-gray-600 mb-8">
              Clique no link do email para verificar sua conta e continuar.
            </p>
            
            <div className="space-y-4">
              <button
                onClick={handleResendEmail}
                disabled={loading}
                className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all disabled:opacity-50"
              >
                {loading ? 'Enviando...' : 'Reenviar email'}
              </button>
              
              <button
                onClick={handleBackToRegister}
                className="w-full py-3 bg-[#1E3A8A] text-white rounded-xl font-semibold hover:bg-[#1e40af] transition-all"
              >
                Voltar ao registro
              </button>
            </div>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <XCircleIcon className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Erro ao enviar email
            </h2>
            <p className="text-gray-600 mb-8">
              Não foi possível enviar o email de verificação. Tente novamente.
            </p>
            
            <div className="space-y-4">
              <button
                onClick={handleResendEmail}
                disabled={loading}
                className="w-full py-3 bg-[#1E3A8A] text-white rounded-xl font-semibold hover:bg-[#1e40af] transition-all disabled:opacity-50"
              >
                {loading ? 'Tentando...' : 'Tentar novamente'}
              </button>
              
              <button
                onClick={handleBackToRegister}
                className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
              >
                Voltar ao registro
              </button>
            </div>
          </motion.div>
        )}

        {status === 'verified' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircleIcon className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Email verificado!
            </h2>
            <p className="text-gray-600 mb-8">
              Sua conta foi verificada com sucesso. Você pode continuar usando o ServiFlex.
            </p>
            
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 bg-[#1E3A8A] text-white rounded-xl font-semibold hover:bg-[#1e40af] transition-all"
            >
              Continuar
            </button>
          </motion.div>
        )}

        {/* Help text */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            Não recebeu o email? Verifique sua caixa de spam ou{' '}
            <button
              onClick={handleResendEmail}
              className="text-[#1E3A8A] hover:text-[#1e40af] font-medium"
            >
              reenvie o email
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}