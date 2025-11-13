# Mapa Interativo de Profissionais Brasil - Código Completo em React

## 📋 Instruções de Instalação e Uso

### 1. Pré-requisitos
- Node.js 18+ instalado
- npm ou pnpm como gerenciador de pacotes

### 2. Instalação
```bash
# Clone ou crie um novo projeto React com Vite
npm create vite@latest mapa-profissionais -- --template react-ts
cd mapa-profissionais

# Instale as dependências
npm install
npm install lucide-react wouter next-themes tailwindcss tailwind-merge clsx
```

### 3. Estrutura de Pastas
```
src/
├── components/
│   ├── MapaBrasil.tsx
│   ├── RepresentantesList.tsx
│   ├── RepresentanteCard.tsx
│   └── ...
├── data/
│   └── profissionais.ts
├── pages/
│   ├── Home.tsx
│   └── NotFound.tsx
├── contexts/
│   └── ThemeContext.tsx
├── App.tsx
├── main.tsx
└── index.css
public/
└── mapa_brasil.svg
```

---

## 📄 Arquivos do Projeto

### 1. **src/App.tsx**
```typescript
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
```

### 2. **src/pages/Home.tsx**
```typescript
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
```

### 3. **src/components/MapaBrasil.tsx**
```typescript
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
```

### 4. **src/components/RepresentantesList.tsx**
```typescript
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
```

### 5. **src/components/RepresentanteCard.tsx**
```typescript
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
```

### 6. **src/data/profissionais.ts**
```typescript
export interface Profissional {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  especialidade?: string;
}

export interface EstadoProfissionais {
  uf: string;
  nome: string;
  profissionais: Profissional[];
}

export const profissionaisPorEstado: EstadoProfissionais[] = [
  {
    uf: "SP",
    nome: "São Paulo",
    profissionais: [
      {
        id: "1",
        nome: "Pedro Santos",
        email: "pedro.santos@yahoo.com.br",
        telefone: "+55 11 3678-9012",
        especialidade: "Engenharia de Software"
      },
      {
        id: "2",
        nome: "Maria Silva",
        email: "maria.silva@gmail.com",
        telefone: "+55 11 98765-4321",
        especialidade: "Design UX/UI"
      },
      {
        id: "3",
        nome: "João Oliveira",
        email: "joao.oliveira@hotmail.com",
        telefone: "+55 11 99876-5432",
        especialidade: "Consultoria Empresarial"
      }
    ]
  },
  {
    uf: "RJ",
    nome: "Rio de Janeiro",
    profissionais: [
      {
        id: "4",
        nome: "Ana Costa",
        email: "ana.costa@email.com",
        telefone: "+55 21 2567-8901",
        especialidade: "Marketing Digital"
      },
      {
        id: "5",
        nome: "Carlos Mendes",
        email: "carlos.mendes@outlook.com",
        telefone: "+55 21 99876-5432",
        especialidade: "Desenvolvimento Web"
      }
    ]
  },
  {
    uf: "MG",
    nome: "Minas Gerais",
    profissionais: [
      {
        id: "6",
        nome: "Lucas Ferreira",
        email: "lucas.ferreira@gmail.com",
        telefone: "+55 31 3456-7890",
        especialidade: "Análise de Dados"
      },
      {
        id: "7",
        nome: "Fernanda Rocha",
        email: "fernanda.rocha@email.com",
        telefone: "+55 31 98765-4321",
        especialidade: "Recursos Humanos"
      }
    ]
  },
  {
    uf: "BA",
    nome: "Bahia",
    profissionais: [
      {
        id: "8",
        nome: "Roberto Alves",
        email: "roberto.alves@hotmail.com",
        telefone: "+55 71 3234-5678",
        especialidade: "Administração"
      }
    ]
  },
  {
    uf: "RS",
    nome: "Rio Grande do Sul",
    profissionais: [
      {
        id: "9",
        nome: "Juliana Gomes",
        email: "juliana.gomes@gmail.com",
        telefone: "+55 51 3456-7890",
        especialidade: "Contabilidade"
      },
      {
        id: "10",
        nome: "Ricardo Souza",
        email: "ricardo.souza@email.com",
        telefone: "+55 51 99876-5432",
        especialidade: "Logística"
      }
    ]
  },
  {
    uf: "PR",
    nome: "Paraná",
    profissionais: [
      {
        id: "11",
        nome: "Beatriz Lima",
        email: "beatriz.lima@hotmail.com",
        telefone: "+55 41 3234-5678",
        especialidade: "Educação"
      }
    ]
  },
  {
    uf: "PE",
    nome: "Pernambuco",
    profissionais: [
      {
        id: "12",
        nome: "Gustavo Pereira",
        email: "gustavo.pereira@gmail.com",
        telefone: "+55 81 3456-7890",
        especialidade: "Saúde"
      }
    ]
  },
  {
    uf: "CE",
    nome: "Ceará",
    profissionais: [
      {
        id: "13",
        nome: "Camila Barbosa",
        email: "camila.barbosa@email.com",
        telefone: "+55 85 3234-5678",
        especialidade: "Turismo"
      }
    ]
  },
  {
    uf: "PA",
    nome: "Pará",
    profissionais: [
      {
        id: "14",
        nome: "Diego Santos",
        email: "diego.santos@hotmail.com",
        telefone: "+55 91 3456-7890",
        especialidade: "Meio Ambiente"
      }
    ]
  },
  {
    uf: "SC",
    nome: "Santa Catarina",
    profissionais: [
      {
        id: "15",
        nome: "Isabela Martins",
        email: "isabela.martins@gmail.com",
        telefone: "+55 47 3234-5678",
        especialidade: "Tecnologia"
      }
    ]
  }
];

export const getProfissionaisPorEstado = (uf: string): EstadoProfissionais | undefined => {
  return profissionaisPorEstado.find(estado => estado.uf === uf);
};
```

### 7. **src/index.css** (Tailwind + Tema Escuro)
```css
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

:root {
  --primary: #3b82f6;
  --primary-foreground: #f0f9ff;
  --radius: 0.65rem;
}

.dark {
  --primary: #3b82f6;
  --primary-foreground: #f0f9ff;
  --background: oklch(0.12 0.01 280);
  --foreground: oklch(0.95 0.01 65);
  --card: oklch(0.18 0.01 280);
  --card-foreground: oklch(0.95 0.01 65);
  --border: oklch(1 0 0 / 10%);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### 8. **src/main.tsx**
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### 9. **src/const.ts**
```typescript
export const APP_TITLE = "Mapa Interativo de Profissionais Brasil";
export const APP_LOGO = "/logo.svg";
```

### 10. **src/contexts/ThemeContext.tsx**
```typescript
import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = "light",
  switchable = false,
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
  switchable?: boolean;
}) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    if (switchable) {
      setTheme((prev) => (prev === "light" ? "dark" : "light"));
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
```

---

## 🗺️ Arquivo SVG do Mapa

O arquivo `public/mapa_brasil.svg` contém o mapa interativo do Brasil. Você pode baixá-lo do repositório:
[https://github.com/LucasBassetti/mapa-brasil-svg](https://github.com/LucasBassetti/mapa-brasil-svg)

Ou use este link direto:
```
https://raw.githubusercontent.com/LucasBassetti/mapa-brasil-svg/master/index.html
```

Extraia apenas o SVG e salve em `public/mapa_brasil.svg`.

---

## 🚀 Como Executar

```bash
# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev

# O aplicativo estará disponível em http://localhost:5173
```

---

## 🎨 Funcionalidades

✅ **Mapa Interativo** - Clique em qualquer estado para destacá-lo  
✅ **Lista de Profissionais** - Exibe profissionais cadastrados do estado selecionado  
✅ **Contato Direto** - Botões para WhatsApp e Email  
✅ **Tema Escuro** - Design moderno com tema escuro  
✅ **Responsivo** - Funciona em desktop e tablets  
✅ **Dados Mockados** - Pronto para integrar com API real  

---

## 📝 Personalizações

### Adicionar Mais Profissionais
Edite `src/data/profissionais.ts` e adicione novos estados e profissionais:

```typescript
{
  uf: "GO",
  nome: "Goiás",
  profissionais: [
    {
      id: "16",
      nome: "Seu Nome",
      email: "seu.email@example.com",
      telefone: "+55 62 9999-9999",
      especialidade: "Sua Especialidade"
    }
  ]
}
```

### Alterar Cores
Modifique as cores em `src/components/MapaBrasil.tsx`:
- `#0094d9` - Cor padrão dos estados
- `#0066cc` - Cor ao passar o mouse
- `#ff6b6b` - Cor ao clicar

---

## 🔗 Dependências Principais

- **React 18** - Framework UI
- **Tailwind CSS 4** - Estilização
- **Lucide React** - Ícones
- **Wouter** - Roteamento
- **TypeScript** - Type safety

---

## 📄 Licença

MIT - Sinta-se livre para usar em seus projetos!
