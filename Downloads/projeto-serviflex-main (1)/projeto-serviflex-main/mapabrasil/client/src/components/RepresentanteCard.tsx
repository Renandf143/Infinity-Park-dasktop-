import { Mail, MessageCircle } from "lucide-react";
import { Profissional } from "@/data/profissionais";

interface RepresentanteCardProps {
  profissional: Profissional;
}

export default function RepresentanteCard({ profissional }: RepresentanteCardProps) {
  return (
    <div className="bg-slate-700 rounded-lg p-4 flex items-center justify-between gap-4 mb-3">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-12 h-12 rounded-full bg-slate-500 flex items-center justify-center text-white font-bold">
          {profissional.nome.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-sm">{profissional.nome}</h3>
          <p className="text-slate-300 text-xs truncate">{profissional.email}</p>
          <p className="text-slate-400 text-xs">{profissional.telefone}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <a
          href={`https://wa.me/${profissional.telefone.replace(/\D/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-slate-600 hover:bg-slate-500 p-2 rounded transition-colors"
          title="Enviar mensagem WhatsApp"
        >
          <MessageCircle className="w-4 h-4 text-white" />
        </a>
        <a
          href={`mailto:${profissional.email}`}
          className="bg-slate-600 hover:bg-slate-500 p-2 rounded transition-colors"
          title="Enviar email"
        >
          <Mail className="w-4 h-4 text-white" />
        </a>
      </div>
    </div>
  );
}
