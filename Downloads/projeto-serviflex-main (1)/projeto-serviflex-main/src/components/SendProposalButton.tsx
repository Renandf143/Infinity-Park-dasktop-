import { useState } from 'react';
import { FileText } from 'lucide-react';
import { ProposalCreator } from './ProposalCreator';

interface SendProposalButtonProps {
  professionalId: string;
  professionalName: string;
  clientId: string;
  clientName: string;
  serviceRequestId: string;
  serviceType: string;
  onSuccess?: () => void;
}

export function SendProposalButton({
  professionalId,
  professionalName,
  clientId,
  clientName,
  serviceRequestId,
  serviceType,
  onSuccess,
}: SendProposalButtonProps) {
  const [showCreator, setShowCreator] = useState(false);

  if (showCreator) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="w-full max-w-4xl my-8">
          <ProposalCreator
            professionalId={professionalId}
            professionalName={professionalName}
            clientId={clientId}
            clientName={clientName}
            serviceRequestId={serviceRequestId}
            onSuccess={() => {
              setShowCreator(false);
              onSuccess?.();
            }}
            onCancel={() => setShowCreator(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowCreator(true)}
      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
    >
      <FileText className="w-4 h-4" />
      Enviar Proposta
    </button>
  );
}
