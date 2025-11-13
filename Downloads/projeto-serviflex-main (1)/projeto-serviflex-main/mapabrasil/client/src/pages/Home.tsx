import { useState } from "react";
import MapaBrasil from "@/components/MapaBrasil";
import RepresentantesList from "@/components/RepresentantesList";
import { EstadoProfissionais } from "@/data/profissionais";
import { APP_TITLE } from "@/const";

export default function Home() {
  const [estadoSelecionado, setEstadoSelecionado] = useState<EstadoProfissionais | null>(null);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 py-4 px-6">
        <h1 className="text-white text-2xl font-bold">{APP_TITLE}</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
            {/* Mapa */}
            <div className="flex-1 flex justify-center">
              <MapaBrasil onEstadoSelecionado={setEstadoSelecionado} />
            </div>

            {/* Lista de Representantes */}
            <div className="flex-shrink-0">
              <RepresentantesList estado={estadoSelecionado} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
