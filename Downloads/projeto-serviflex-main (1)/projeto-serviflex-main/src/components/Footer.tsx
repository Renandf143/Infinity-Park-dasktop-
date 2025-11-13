import React from 'react';
import { FacebookIcon, InstagramIcon, TwitterIcon, LinkedinIcon, MailIcon, PhoneIcon, MapPinIcon } from 'lucide-react';
export function Footer() {
  const footerLinks = {
    'Para Clientes': ['Como Contratar', 'Buscar Profissionais', 'Projetos', 'Garantias', 'Pagamentos'],
    'Para Profissionais': ['Como Vender', 'Criar Perfil', 'Dicas de Sucesso', 'Comunidade', 'Ferramentas'],
    Empresa: ['Sobre Nós', 'Carreiras', 'Imprensa', 'Blog', 'Parceiros'],
    Suporte: ['Central de Ajuda', 'Segurança', 'Termos de Uso', 'Política de Privacidade', 'Contato']
  };
  return <footer className="w-full bg-[#0F172A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="ServeFlex Logo" className="w-10 h-10 object-contain" />
              <h3 className="text-2xl font-bold text-white">ServiFlex</h3>
            </div>
            <p className="text-white/70 mb-6">
              Conectando talentos com oportunidades desde 2024.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#2563EB] transition-colors">
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#2563EB] transition-colors">
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#2563EB] transition-colors">
                <TwitterIcon className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#2563EB] transition-colors">
                <LinkedinIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => <div key={category}>
              <h4 className="font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map(link => <li key={link}>
                    <a href="#" className="text-white/70 hover:text-[#2563EB] transition-colors text-sm">
                      {link}
                    </a>
                  </li>)}
              </ul>
            </div>)}
        </div>
        {/* Contact Info */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#2563EB] rounded-lg flex items-center justify-center">
                <MailIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-white/70">Email</p>
                <p className="text-white font-medium">contato@serveflex.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#2563EB] rounded-lg flex items-center justify-center">
                <PhoneIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-white/70">Telefone</p>
                <p className="text-white font-medium">(11) 9999-9999</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#2563EB] rounded-lg flex items-center justify-center">
                <MapPinIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-white/70">Endereço</p>
                <p className="text-white font-medium">São Paulo, SP - Brasil</p>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/70 text-sm">
            © 2024 ServiFlex. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-white/70 hover:text-[#2563EB] text-sm transition-colors">
              Termos de Serviço
            </a>
            <a href="#" className="text-white/70 hover:text-[#2563EB] text-sm transition-colors">
              Política de Privacidade
            </a>
            <a href="#" className="text-white/70 hover:text-[#2563EB] text-sm transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>;
}