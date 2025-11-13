export interface Subcategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  slug: string;
  subcategories: Subcategory[];
}

export const categoriesData: Category[] = [
  {
    id: 'limpeza-organizacao',
    name: 'Limpeza e Organização',
    description: 'Diaristas, faxineiras, organizadores',
    icon: '🧹',
    slug: 'limpeza-organizacao',
    subcategories: [
      { id: 'limpeza-residencial', name: 'Limpeza Residencial', description: 'Limpeza completa de casas e apartamentos', icon: '🏠' },
      { id: 'limpeza-comercial', name: 'Limpeza Comercial', description: 'Limpeza de escritórios e estabelecimentos', icon: '🏢' },
      { id: 'limpeza-pos-obra', name: 'Limpeza Pós-Obra', description: 'Limpeza após reformas e construções', icon: '🏗️' },
      { id: 'organizacao-ambientes', name: 'Organização de Ambientes', description: 'Organização de cômodos e espaços', icon: '📦' },
      { id: 'personal-organizer', name: 'Personal Organizer', description: 'Consultoria em organização profissional', icon: '✨' },
      { id: 'passadoria', name: 'Passadoria', description: 'Serviço de passar roupas', icon: '👔' }
    ]
  },
  {
    id: 'reparos-manutencao',
    name: 'Reparos e Manutenção',
    description: 'Eletricistas, encanadores, marceneiros, pintores',
    icon: '🔧',
    slug: 'reparos-manutencao',
    subcategories: [
      { id: 'eletricista', name: 'Eletricista', description: 'Instalação e manutenção elétrica', icon: '⚡' },
      { id: 'encanador', name: 'Encanador', description: 'Instalação e reparo hidráulico', icon: '🚰' },
      { id: 'marceneiro', name: 'Marceneiro', description: 'Móveis planejados e marcenaria', icon: '🪚' },
      { id: 'pintor', name: 'Pintor', description: 'Pintura residencial e comercial', icon: '🎨' },
      { id: 'pedreiro', name: 'Pedreiro', description: 'Construção e reforma', icon: '🧱' },
      { id: 'serralheiro', name: 'Serralheiro', description: 'Trabalhos em metal e ferro', icon: '🔩' },
      { id: 'vidraceiro', name: 'Vidraceiro', description: 'Instalação e reparo de vidros', icon: '🪟' },
      { id: 'gesseiro', name: 'Gesseiro', description: 'Trabalhos em gesso e drywall', icon: '⬜' }
    ]
  },
  {
    id: 'beleza-estetica',
    name: 'Beleza e Estética',
    description: 'Cabeleireiros, manicures, esteticistas, maquiadores',
    icon: '💅',
    slug: 'beleza-estetica',
    subcategories: [
      { id: 'cabeleireiro', name: 'Cabeleireiro', description: 'Corte, coloração e tratamentos', icon: '💇' },
      { id: 'manicure-pedicure', name: 'Manicure e Pedicure', description: 'Cuidados com unhas', icon: '💅' },
      { id: 'maquiador', name: 'Maquiador', description: 'Maquiagem profissional', icon: '💄' },
      { id: 'esteticista', name: 'Esteticista', description: 'Tratamentos estéticos faciais e corporais', icon: '✨' },
      { id: 'depilacao', name: 'Depilação', description: 'Serviços de depilação', icon: '🪒' },
      { id: 'designer-sobrancelhas', name: 'Designer de Sobrancelhas', description: 'Design e micropigmentação', icon: '👁️' },
      { id: 'barbeiro', name: 'Barbeiro', description: 'Corte e barba masculina', icon: '💈' }
    ]
  },
  {
    id: 'saude-bemestar',
    name: 'Saúde e Bem-estar',
    description: 'Fisioterapeutas, personal trainers, massagistas',
    icon: '💪',
    slug: 'saude-bemestar',
    subcategories: [
      { id: 'personal-trainer', name: 'Personal Trainer', description: 'Treinamento físico personalizado', icon: '🏋️' },
      { id: 'fisioterapeuta', name: 'Fisioterapeuta', description: 'Fisioterapia e reabilitação', icon: '🩺' },
      { id: 'massagista', name: 'Massagista', description: 'Massagens terapêuticas e relaxantes', icon: '💆' },
      { id: 'nutricionista', name: 'Nutricionista', description: 'Consultoria nutricional', icon: '🥗' },
      { id: 'psicologo', name: 'Psicólogo', description: 'Atendimento psicológico', icon: '🧠' },
      { id: 'yoga-pilates', name: 'Yoga e Pilates', description: 'Aulas de yoga e pilates', icon: '🧘' }
    ]
  },
  {
    id: 'aulas-treinamentos',
    name: 'Aulas e Treinamentos',
    description: 'Professores particulares, instrutores, coaches',
    icon: '📚',
    slug: 'aulas-treinamentos',
    subcategories: [
      { id: 'professor-matematica', name: 'Professor de Matemática', description: 'Aulas particulares de matemática', icon: '🔢' },
      { id: 'professor-portugues', name: 'Professor de Português', description: 'Aulas de português e redação', icon: '📝' },
      { id: 'professor-ingles', name: 'Professor de Inglês', description: 'Aulas de inglês', icon: '🇬🇧' },
      { id: 'professor-musica', name: 'Professor de Música', description: 'Aulas de instrumentos musicais', icon: '🎵' },
      { id: 'reforco-escolar', name: 'Reforço Escolar', description: 'Reforço em diversas matérias', icon: '📖' },
      { id: 'coach', name: 'Coach', description: 'Coaching pessoal e profissional', icon: '🎯' },
      { id: 'instrutor-informatica', name: 'Instrutor de Informática', description: 'Aulas de computação', icon: '💻' }
    ]
  },
  {
    id: 'eventos-festas',
    name: 'Eventos e Festas',
    description: 'Organizadores, decoradores, buffet, animadores',
    icon: '🎉',
    slug: 'eventos-festas',
    subcategories: [
      { id: 'organizador-eventos', name: 'Organizador de Eventos', description: 'Planejamento completo de eventos', icon: '📋' },
      { id: 'decorador', name: 'Decorador', description: 'Decoração de festas e eventos', icon: '🎈' },
      { id: 'buffet', name: 'Buffet', description: 'Serviço de buffet e catering', icon: '🍽️' },
      { id: 'animador-festas', name: 'Animador de Festas', description: 'Animação infantil e adulta', icon: '🤡' },
      { id: 'fotografo-eventos', name: 'Fotógrafo de Eventos', description: 'Fotografia profissional', icon: '📸' },
      { id: 'dj', name: 'DJ', description: 'DJ para festas e eventos', icon: '🎧' },
      { id: 'mestre-cerimonia', name: 'Mestre de Cerimônia', description: 'Apresentação de eventos', icon: '🎤' }
    ]
  },
  {
    id: 'transporte-mudancas',
    name: 'Transporte e Mudanças',
    description: 'Carretos, mudanças, fretes, motoristas',
    icon: '🚚',
    slug: 'transporte-mudancas',
    subcategories: [
      { id: 'mudancas', name: 'Mudanças', description: 'Serviço completo de mudanças', icon: '📦' },
      { id: 'carreto', name: 'Carreto', description: 'Transporte de cargas pequenas', icon: '🚐' },
      { id: 'frete', name: 'Frete', description: 'Transporte de mercadorias', icon: '🚛' },
      { id: 'motorista-particular', name: 'Motorista Particular', description: 'Motorista pessoal', icon: '🚗' },
      { id: 'montador-moveis', name: 'Montador de Móveis', description: 'Montagem e desmontagem', icon: '🔧' }
    ]
  },
  {
    id: 'tecnologia-suporte',
    name: 'Tecnologia e Suporte',
    description: 'Técnicos de informática, instalação de equipamentos',
    icon: '💻',
    slug: 'tecnologia-suporte',
    subcategories: [
      { id: 'tecnico-informatica', name: 'Técnico de Informática', description: 'Manutenção de computadores', icon: '🖥️' },
      { id: 'instalacao-redes', name: 'Instalação de Redes', description: 'Redes e cabeamento', icon: '🌐' },
      { id: 'suporte-ti', name: 'Suporte de TI', description: 'Suporte técnico', icon: '🛠️' },
      { id: 'desenvolvedor-web', name: 'Desenvolvedor Web', description: 'Criação de sites', icon: '👨‍💻' },
      { id: 'instalacao-cameras', name: 'Instalação de Câmeras', description: 'Sistemas de segurança', icon: '📹' },
      { id: 'assistencia-celular', name: 'Assistência de Celular', description: 'Reparo de smartphones', icon: '📱' }
    ]
  },
  {
    id: 'jardinagem-paisagismo',
    name: 'Jardinagem e Paisagismo',
    description: 'Jardineiros, paisagistas, podadores',
    icon: '🌱',
    slug: 'jardinagem-paisagismo',
    subcategories: [
      { id: 'jardineiro', name: 'Jardineiro', description: 'Manutenção de jardins', icon: '🌿' },
      { id: 'paisagista', name: 'Paisagista', description: 'Projeto de paisagismo', icon: '🏞️' },
      { id: 'podador', name: 'Podador', description: 'Poda de árvores e plantas', icon: '✂️' },
      { id: 'irrigacao', name: 'Irrigação', description: 'Sistemas de irrigação', icon: '💧' },
      { id: 'horta-urbana', name: 'Horta Urbana', description: 'Implantação de hortas', icon: '🥬' }
    ]
  },
  {
    id: 'cuidados-pessoais',
    name: 'Cuidados Pessoais',
    description: 'Babás, cuidadores de idosos, enfermeiros',
    icon: '👶',
    slug: 'cuidados-pessoais',
    subcategories: [
      { id: 'baba', name: 'Babá', description: 'Cuidados com crianças', icon: '👶' },
      { id: 'cuidador-idosos', name: 'Cuidador de Idosos', description: 'Cuidados com idosos', icon: '👴' },
      { id: 'enfermeiro', name: 'Enfermeiro', description: 'Cuidados de enfermagem', icon: '👨‍⚕️' },
      { id: 'acompanhante-hospitalar', name: 'Acompanhante Hospitalar', description: 'Acompanhamento em hospitais', icon: '🏥' },
      { id: 'cuidador-especial', name: 'Cuidador de Necessidades Especiais', description: 'Cuidados especializados', icon: '♿' }
    ]
  },
  {
    id: 'pet-care',
    name: 'Pet Care',
    description: 'Veterinários, adestradores, banho e tosa, pet sitters',
    icon: '🐾',
    slug: 'pet-care',
    subcategories: [
      { id: 'veterinario', name: 'Veterinário', description: 'Atendimento veterinário', icon: '🩺' },
      { id: 'banho-tosa', name: 'Banho e Tosa', description: 'Higiene e estética pet', icon: '🛁' },
      { id: 'adestrador', name: 'Adestrador', description: 'Adestramento de cães', icon: '🐕' },
      { id: 'pet-sitter', name: 'Pet Sitter', description: 'Cuidados temporários', icon: '🏠' },
      { id: 'passeador-caes', name: 'Passeador de Cães', description: 'Passeios com pets', icon: '🦮' },
      { id: 'hotel-pet', name: 'Hotel Pet', description: 'Hospedagem para pets', icon: '🏨' }
    ]
  },
  {
    id: 'alimentacao',
    name: 'Alimentação',
    description: 'Chefs particulares, confeiteiros, cozinheiros',
    icon: '👨‍🍳',
    slug: 'alimentacao',
    subcategories: [
      { id: 'chef-particular', name: 'Chef Particular', description: 'Chef em domicílio', icon: '👨‍🍳' },
      { id: 'confeiteiro', name: 'Confeiteiro', description: 'Bolos e doces', icon: '🎂' },
      { id: 'cozinheiro', name: 'Cozinheiro', description: 'Preparo de refeições', icon: '🍳' },
      { id: 'marmitex', name: 'Marmitex', description: 'Marmitas e refeições', icon: '🍱' },
      { id: 'salgadeiro', name: 'Salgadeiro', description: 'Salgados para festas', icon: '🥟' },
      { id: 'barista', name: 'Barista', description: 'Serviço de café', icon: '☕' }
    ]
  }
];
