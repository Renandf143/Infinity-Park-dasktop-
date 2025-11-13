import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const mockProfessionals = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@email.com',
    phone: '(11) 99999-9999',
    profession: 'Eletricista',
    category: 'manutencao',
    experience: '5-10',
    description: 'Eletricista experiente com mais de 8 anos de atuação em instalações residenciais e comerciais.',
    specialties: ['Instalação elétrica', 'Manutenção preventiva', 'Automação residencial'],
    availability: 'Segunda a Sábado - 8h às 18h',
    hourlyRate: 85,
    rating: 4.8,
    reviewsCount: 24,
    verified: true,
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    location: {
      city: 'São Paulo',
      state: 'SP'
    },
    stats: {
      totalJobs: 45,
      completedJobs: 42,
      totalEarnings: 15600
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@email.com',
    phone: '(21) 98888-8888',
    profession: 'Encanadora',
    category: 'manutencao',
    experience: '3-5',
    description: 'Especialista em sistemas hidráulicos e reparos de emergência.',
    specialties: ['Vazamentos', 'Instalação de tubulações', 'Desentupimento'],
    availability: 'Segunda a Sexta - 7h às 17h',
    hourlyRate: 70,
    rating: 4.9,
    reviewsCount: 18,
    verified: true,
    profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    location: {
      city: 'Rio de Janeiro',
      state: 'RJ'
    },
    stats: {
      totalJobs: 32,
      completedJobs: 30,
      totalEarnings: 8900
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Carlos Oliveira',
    email: 'carlos@email.com',
    phone: '(31) 97777-7777',
    profession: 'Pintor',
    category: 'reformas',
    experience: '7+',
    description: 'Pintor profissional com experiência em residências e escritórios.',
    specialties: ['Pintura interna', 'Pintura externa', 'Textura', 'Grafiato'],
    availability: 'Segunda a Sábado - 8h às 17h',
    hourlyRate: 60,
    rating: 4.7,
    reviewsCount: 35,
    verified: true,
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    location: {
      city: 'Belo Horizonte',
      state: 'MG'
    },
    stats: {
      totalJobs: 67,
      completedJobs: 63,
      totalEarnings: 12400
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Ana Costa',
    email: 'ana@email.com',
    phone: '(11) 96666-6666',
    profession: 'Diarista',
    category: 'limpeza',
    experience: '3-5',
    description: 'Serviços de limpeza residencial e comercial com produtos ecológicos.',
    specialties: ['Limpeza pesada', 'Organização', 'Limpeza pós-obra'],
    availability: 'Segunda a Sexta - 8h às 16h',
    hourlyRate: 45,
    rating: 4.6,
    reviewsCount: 28,
    verified: true,
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    location: {
      city: 'São Paulo',
      state: 'SP'
    },
    stats: {
      totalJobs: 89,
      completedJobs: 85,
      totalEarnings: 9800
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Pedro Almeida',
    email: 'pedro@email.com',
    phone: '(85) 95555-5555',
    profession: 'Técnico em Informática',
    category: 'tecnologia',
    experience: '5-10',
    description: 'Técnico especializado em manutenção de computadores e redes.',
    specialties: ['Formatação', 'Instalação de software', 'Redes', 'Hardware'],
    availability: 'Segunda a Sábado - 9h às 18h',
    hourlyRate: 80,
    rating: 4.9,
    reviewsCount: 42,
    verified: true,
    profileImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    location: {
      city: 'Fortaleza',
      state: 'CE'
    },
    stats: {
      totalJobs: 78,
      completedJobs: 76,
      totalEarnings: 18200
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Lucia Ferreira',
    email: 'lucia@email.com',
    phone: '(47) 94444-4444',
    profession: 'Manicure',
    category: 'beleza',
    experience: '3-5',
    description: 'Manicure e pedicure profissional com atendimento domiciliar.',
    specialties: ['Manicure', 'Pedicure', 'Esmaltação em gel', 'Nail art'],
    availability: 'Terça a Sábado - 9h às 19h',
    hourlyRate: 50,
    rating: 4.8,
    reviewsCount: 56,
    verified: true,
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    location: {
      city: 'Florianópolis',
      state: 'SC'
    },
    stats: {
      totalJobs: 124,
      completedJobs: 120,
      totalEarnings: 14500
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

async function seedDatabase() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Conectado ao MongoDB');
    
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection('professionals');
    
    // Limpar coleção existente
    await collection.deleteMany({});
    console.log('🧹 Coleção limpa');
    
    // Inserir dados
    const result = await collection.insertMany(mockProfessionals);
    console.log(`✅ ${result.insertedCount} profissionais inseridos`);
    
    // Criar índices para performance
    await collection.createIndex({ category: 1 });
    await collection.createIndex({ 'location.city': 1 });
    await collection.createIndex({ 'location.state': 1 });
    await collection.createIndex({ rating: -1 });
    console.log('📊 Índices criados');
    
  } catch (error) {
    console.error('❌ Erro ao popular banco:', error);
  } finally {
    await client.close();
    console.log('🔌 Conexão fechada');
  }
}

seedDatabase();