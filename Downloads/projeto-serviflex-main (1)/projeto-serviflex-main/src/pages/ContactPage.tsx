import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { MailIcon, PhoneIcon, MapPinIcon, ClockIcon, SendIcon, CheckCircleIcon } from 'lucide-react';
export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  const contactInfo = [{
    icon: MailIcon,
    title: 'Email',
    content: 'contato@serviflix.com.br',
    link: 'mailto:contato@serviflix.com.br'
  }, {
    icon: PhoneIcon,
    title: 'Telefone',
    content: '(11) 3000-0000',
    link: 'tel:+551130000000'
  }, {
    icon: MapPinIcon,
    title: 'Endereço',
    content: 'Av. Paulista, 1000 - São Paulo, SP',
    link: '#'
  }, {
    icon: ClockIcon,
    title: 'Horário',
    content: 'Seg a Sex: 8h às 18h',
    link: '#'
  }];
  const faqs = [{
    question: 'Como funciona a plataforma?',
    answer: 'Você busca o serviço desejado, compara profissionais e contrata diretamente através da plataforma.'
  }, {
    question: 'Os profissionais são verificados?',
    answer: 'Sim, todos os profissionais passam por um processo de verificação e são avaliados pela comunidade.'
  }, {
    question: 'Como faço para me tornar um profissional?',
    answer: 'Acesse a página de cadastro, preencha suas informações e aguarde a aprovação.'
  }, {
    question: 'Existe garantia nos serviços?',
    answer: 'Sim, oferecemos garantia de satisfação e suporte dedicado para resolver qualquer problema.'
  }];
  return <div className="w-full min-h-screen bg-white">
      <Header />
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-br from-[#2563EB] to-[#1E40AF] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Entre em Contato
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Estamos aqui para ajudar. Envie sua mensagem e responderemos o mais
            breve possível
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 border-2 border-gray-100 shadow-xl">
              <h2 className="text-3xl font-bold text-[#1E293B] mb-6">
                Envie sua Mensagem
              </h2>
              {submitted ? <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircleIcon className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1E293B] mb-2">
                    Mensagem Enviada!
                  </h3>
                  <p className="text-gray-600 text-center">
                    Obrigado pelo contato. Responderemos em breve.
                  </p>
                </div> : <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[#1E293B] mb-2">
                        Nome Completo *
                      </label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all" placeholder="Seu nome" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#1E293B] mb-2">
                        Email *
                      </label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all" placeholder="seu@email.com" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[#1E293B] mb-2">
                        Telefone
                      </label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all" placeholder="(11) 99999-9999" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#1E293B] mb-2">
                        Assunto *
                      </label>
                      <select name="subject" value={formData.subject} onChange={handleChange} required className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all bg-white">
                        <option value="">Selecione um assunto</option>
                        <option value="duvida">Dúvida</option>
                        <option value="suporte">Suporte Técnico</option>
                        <option value="parceria">Parceria</option>
                        <option value="sugestao">Sugestão</option>
                        <option value="reclamacao">Reclamação</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1E293B] mb-2">
                      Mensagem *
                    </label>
                    <textarea name="message" value={formData.message} onChange={handleChange} required rows={6} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all resize-none" placeholder="Descreva sua mensagem..." />
                  </div>
                  <button type="submit" className="w-full px-8 py-4 bg-gradient-to-r from-[#2563EB] to-[#1E40AF] text-white rounded-xl font-semibold hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                    Enviar Mensagem
                    <SendIcon className="w-5 h-5" />
                  </button>
                </form>}
            </div>
          </div>
          {/* Contact Info */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => <a key={index} href={info.link} className="block bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border-2 border-gray-100 hover:border-[#2563EB] hover:shadow-xl transition-all group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#2563EB] to-[#1E40AF] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <info.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">
                      {info.title}
                    </p>
                    <p className="text-lg font-bold text-[#1E293B] group-hover:text-[#2563EB] transition-colors">
                      {info.content}
                    </p>
                  </div>
                </div>
              </a>)}
          </div>
        </div>
        {/* FAQ Section */}
        <div>
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-[#2563EB]/10 rounded-full mb-4">
              <span className="text-[#2563EB] font-semibold text-sm">FAQ</span>
            </div>
            <h2 className="text-4xl font-bold text-[#1E293B] mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-lg text-gray-600">
              Encontre respostas rápidas para as dúvidas mais comuns
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => <div key={index} className="bg-white p-6 rounded-2xl border-2 border-gray-100 hover:border-[#2563EB] hover:shadow-lg transition-all">
                <h3 className="text-lg font-bold text-[#1E293B] mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>)}
          </div>
        </div>
      </div>
      <Footer />
    </div>;
}