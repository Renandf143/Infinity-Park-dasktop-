import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, XIcon } from 'lucide-react';

interface EmailSentNotificationProps {
  show: boolean;
  onClose: () => void;
  email: string;
}

export function EmailSentNotification({ show, onClose, email }: EmailSentNotificationProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircleIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email enviado!</h3>
                  <p className="text-sm text-gray-600">Verificação enviada com sucesso</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Fechar notificação"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-600">Enviado para:</p>
              <p className="font-medium text-gray-900">{email}</p>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Clique no link do email para verificar sua conta e continuar o processo de registro.
            </p>
            
            <button
              onClick={onClose}
              className="w-full py-2 bg-[#1E3A8A] text-white rounded-lg font-medium hover:bg-[#1e40af] transition-colors"
            >
              Entendi
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}