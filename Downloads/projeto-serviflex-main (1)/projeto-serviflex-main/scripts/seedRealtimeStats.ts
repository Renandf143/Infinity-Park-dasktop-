import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp, updateDoc, doc } from 'firebase/firestore';

// Configuração do Firebase (use suas credenciais)
const firebaseConfig = {
  apiKey: "AIzaSyAOrqfRotf67NDB1N8bz1Nl0Ydne-a69l0",
  authDomain: "serviflex-f5ba3.firebaseapp.com",
  projectId: "serviflex-f5ba3",
  storageBucket: "serviflex-f5ba3.firebasestorage.app",
  messagingSenderId: "969678237154",
  appId: "1:969678237154:web:9587d5a80cda0d5e1d1dbb"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedData() {
  console.log('🌱 Iniciando seed de dados em tempo real...');

  try {
    // Criar profissionais com lastActive
    const professionalsData = [
      { name: 'João Silva', specialty: 'Eletricista', lastActive: new Date() },
      { name: 'Maria Santos', specialty: 'Encanadora', lastActive: new Date(Date.now() - 2 * 60 * 1000) },
      { name: 'Pedro Costa', specialty: 'Jardineiro', lastActive: new Date(Date.now() - 10 * 60 * 1000) },
      { name: 'Ana Oliveira', specialty: 'Limpeza', lastActive: new Date() },
      { name: 'Carlos Souza', specialty: 'Pintor', lastActive: new Date(Date.now() - 1 * 60 * 1000) },
    ];

    console.log('📝 Criando profissionais...');
    for (const prof of professionalsData) {
      await addDoc(collection(db, 'professionals'), {
        ...prof,
        lastActive: Timestamp.fromDate(prof.lastActive),
        createdAt: Timestamp.now()
      });
    }
    console.log(`✅ ${professionalsData.length} profissionais criados`);

    // Criar serviços com ratings
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const servicesData = [
      { title: 'Instalação elétrica', rating: 5, createdAt: new Date() },
      { title: 'Reparo de encanamento', rating: 4.5, createdAt: new Date() },
      { title: 'Jardinagem', rating: 5, createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      { title: 'Limpeza residencial', rating: 4.8, createdAt: new Date() },
      { title: 'Pintura de parede', rating: 4.7, createdAt: new Date() },
      { title: 'Manutenção ar condicionado', rating: 5, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    ];

    console.log('📝 Criando serviços...');
    for (const service of servicesData) {
      await addDoc(collection(db, 'services'), {
        ...service,
        createdAt: Timestamp.fromDate(service.createdAt)
      });
    }
    console.log(`✅ ${servicesData.length} serviços criados`);

    console.log('🎉 Seed concluído com sucesso!');
    console.log('\n📊 Estatísticas esperadas:');
    console.log(`- Profissionais online (últimos 5 min): ${professionalsData.filter(p => (Date.now() - p.lastActive.getTime()) < 5 * 60 * 1000).length}`);
    console.log(`- Total de profissionais: ${professionalsData.length}`);
    console.log(`- Serviços de hoje: ${servicesData.filter(s => s.createdAt >= today).length}`);
    console.log(`- Total de serviços: ${servicesData.length}`);
    console.log(`- Avaliação média: ${(servicesData.reduce((sum, s) => sum + s.rating, 0) / servicesData.length).toFixed(1)}`);

  } catch (error) {
    console.error('❌ Erro ao fazer seed:', error);
  }
}

seedData();
