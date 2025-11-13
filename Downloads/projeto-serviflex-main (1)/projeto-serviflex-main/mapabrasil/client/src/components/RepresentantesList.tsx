import { EstadoProfissionais } from "@/data/profissionais";
import RepresentanteCard from "./RepresentanteCard";
import { ChevronDown } from "lucide-react";

interface RepresentantesListProps {
  estado: EstadoProfissionais | null;
}

export default function RepresentantesList({ estado }: RepresentantesListProps) {
  return (
    <div className="w-full max-w-sm">
      <div className="bg-slate-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-lg font-semibold">Representantes</h2>
          {estado && (
            <div className="flex items-center gap-2 bg-slate-700 px-3 py-1 rounded">
              <span className="text-white text-sm font-medium">{estado.nome}</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>
          )}
        </div>

        {estado ? (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {estado.profissionais.length > 0 ? (
              estado.profissionais.map((profissional) => (
                <RepresentanteCard key={profissional.id} profissional={profissional} />
              ))
            ) : (
              <p className="text-slate-400 text-sm text-center py-4">
                Nenhum profissional cadastrado neste estado.
              </p>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-400 text-sm">
              Clique em um estado no mapa para ver os profissionais cadastrados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
