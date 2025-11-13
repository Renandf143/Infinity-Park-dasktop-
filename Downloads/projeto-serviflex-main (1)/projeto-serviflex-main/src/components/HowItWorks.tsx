import {
  SearchIcon,
  UserCheckIcon,
  CalendarCheckIcon,
  StarIcon,
  ArrowRightIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export function HowItWorks() {
  const navigate = useNavigate();

  const steps = [
    {
      icon: SearchIcon,
      number: "01",
      title: "Busque o Serviço",
      description:
        "Encontre o profissional ideal navegando por categorias ou usando a busca",
    },
    {
      icon: UserCheckIcon,
      number: "02",
      title: "Escolha o Profissional",
      description:
        "Compare perfis, avaliações e preços para tomar a melhor decisão",
    },
    {
      icon: CalendarCheckIcon,
      number: "03",
      title: "Agende o Serviço",
      description:
        "Combine data, horário e detalhes diretamente com o prestador",
    },
    {
      icon: StarIcon,
      number: "04",
      title: "Avalie a Experiência",
      description:
        "Após o serviço, deixe sua avaliação e ajude outros clientes",
    },
  ];

  return (
    <section
      id="como-funciona"
      className="w-full py-24 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-1.5 bg-blue-50 text-[#1E3A8A] text-sm font-semibold rounded-full mb-4">
            COMO FUNCIONA
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simples, Rápido e Seguro
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Em apenas 4 passos você encontra e contrata o profissional perfeito
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-[#1E3A8A] hover:shadow-xl transition-all duration-300">
                  {/* Number Badge */}
                  <div className="relative inline-flex items-center justify-center w-12 h-12 bg-[#1E3A8A] rounded-xl mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-white font-bold text-lg">
                      {step.number}
                    </span>
                    {index < steps.length - 1 && (
                      <ArrowRightIcon className="hidden lg:block absolute -right-8 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-300" />
                    )}
                  </div>

                  {/* Icon */}
                  <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-100 transition-colors">
                    <step.icon className="w-7 h-7 text-[#1E3A8A]" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <button
            onClick={() => navigate("/categorias")}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#1E3A8A] text-white rounded-xl font-semibold hover:bg-[#1e40af] transition-all shadow-lg hover:shadow-xl"
          >
            Começar Agora
            <ArrowRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
