import { useState, useEffect } from "react";
import { getProfissionaisPorEstado, EstadoProfissionais } from "@/data/profissionais";

interface MapaBrasilProps {
  onEstadoSelecionado?: (estado: EstadoProfissionais | null) => void;
}

export default function MapaBrasil({ onEstadoSelecionado }: MapaBrasilProps) {
  const [estadoSelecionado, setEstadoSelecionado] = useState<string | null>(null);
  const [svgContent, setSvgContent] = useState<string>("");

  // Carregar o SVG
  useEffect(() => {
    fetch("/mapa_brasil.svg")
      .then((res) => res.text())
      .then((content) => {
        setSvgContent(content);
      });
  }, []);

  // Atualizar o estado selecionado
  useEffect(() => {
    if (estadoSelecionado) {
      const estadoData = getProfissionaisPorEstado(estadoSelecionado);
      onEstadoSelecionado?.(estadoData || null);
    } else {
      onEstadoSelecionado?.(null);
    }
  }, [estadoSelecionado, onEstadoSelecionado]);

  // Adicionar event listeners aos estados do SVG
  useEffect(() => {
    if (!svgContent) return;

    const svgElement = document.getElementById("svg-map-container");
    if (!svgElement) return;

    const estados = svgElement.querySelectorAll(".estado");

    estados.forEach((estado) => {
      const textElement = estado.querySelector("text");
      const uf = textElement?.textContent?.trim() || "";

      // Adicionar click listener
      const handleClick = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        setEstadoSelecionado(uf === estadoSelecionado ? null : uf);
      };

      // Adicionar hover effect
      const handleMouseEnter = () => {
        const path = estado.querySelector("path");
        if (path && uf !== estadoSelecionado) {
          path.style.fill = "#0066cc";
          path.style.cursor = "pointer";
        }
      };

      const handleMouseLeave = () => {
        const path = estado.querySelector("path");
        if (path && uf !== estadoSelecionado) {
          path.style.fill = "#0094d9";
        }
      };

      estado.addEventListener("click", handleClick);
      estado.addEventListener("mouseenter", handleMouseEnter);
      estado.addEventListener("mouseleave", handleMouseLeave);

      // Cleanup
      return () => {
        estado.removeEventListener("click", handleClick);
        estado.removeEventListener("mouseenter", handleMouseEnter);
        estado.removeEventListener("mouseleave", handleMouseLeave);
      };
    });
  }, [svgContent, estadoSelecionado]);

  // Aplicar estilo ao estado selecionado
  useEffect(() => {
    if (!svgContent) return;

    const svgElement = document.getElementById("svg-map-container");
    if (!svgElement) return;

    const estados = svgElement.querySelectorAll(".estado");

    estados.forEach((estado) => {
      const textElement = estado.querySelector("text");
      const uf = textElement?.textContent?.trim() || "";
      const path = estado.querySelector("path");

      if (path) {
        if (uf === estadoSelecionado) {
          path.style.fill = "#ff6b6b";
          path.style.opacity = "1";
        } else {
          path.style.fill = "#0094d9";
          path.style.opacity = "1";
        }
      }
    });
  }, [svgContent, estadoSelecionado]);

  return (
    <div
      id="svg-map-container"
      dangerouslySetInnerHTML={{ __html: svgContent }}
      className="w-full max-w-2xl mx-auto"
      style={{
        cursor: "pointer",
      }}
    />
  );
}
