import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';

// Configuração do Firebase (use suas credenciais)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Mapeamento de categorias para ícones do Lucide React
const categoryIconMap: Record<string, string> = {
  // Construção e Reparos
  'eletricista': 'Zap',
  'encanador': 'Droplet',
  'pedreiro': 'Hammer',
  'pintor': 'Paintbrush',
  'marceneiro': 'Wrench',
  'serralheiro': 'Shield',
  'vidraceiro': 'Square',
  'gesseiro': 'Box',
  
  // Limpeza e Manutenção
  'faxineira': 'Sparkles',
  'jardineiro': 'Leaf',
  'dedetizador': 'Bug',
  'limpeza-piscina': 'Waves',
  
  // Tecnologia
  'tecnico-informatica': 'Laptop',
  'instalador-antena': 'Wifi',
  'tecnico-celular': 'Smartphone',
  
  // Automotivo
  'mecanico': 'Car',
  'eletricista-automotivo': 'Battery',
  'funileiro': 'Wrench',
  
  // Serviços Domésticos
  'chaveiro': 'Key',
  'desentupidor': 'Droplets',
  'instalador-ar-condicionado': 'Wind',
  'tecnico-geladeira': 'Refrigerator',
  'tecnico-maquina-lavar': 'WashingMachine',
  
  // Beleza e Estética
  'cabeleireiro': 'Scissors',
  'manicure': 'Hand',
  'esteticista': 'Sparkle',
  'barbeiro': 'Scissors',
  
  // Educação
  'professor-particular': 'GraduationCap',
  'instrutor-musica': 'Music',
  
  // Eventos
  'fotografo': 'Camera',
  'cinegrafista': 'Video',
  'dj': 'Music2',
  'decorador': 'Palette',
  
  // Saúde
  'personal-trainer': 'Dumbbell',
  'nutricionista': 'Apple',
  'fisioterapeuta': 'Heart',
  
  // Outros
  'mudancas': 'Truck',
  'montador-moveis': 'Package',
  'tapeceiro': 'Sofa',
  'costureira': 'Scissors',
};

async function updateCategoryIcons() {
  try {
    console.log('🔄 Iniciando atualização de ícones das categorias...\n');

    const categoriesRef = collection(db, 'serviceCategories');
    const snapshot = await getDocs(categoriesRef);

    let updated = 0;
    let notFound = 0;

    for (const docSnap of snapshot.docs) {
      const category = docSnap.data();
      const slug = category.slug;
      const newIcon = categoryIconMap[slug];

      if (newIcon) {
        await updateDoc(doc(db, 'serviceCategories', docSnap.id), {
          icon: newIcon,
          updatedAt: new Date(),
        });
        console.log(`✅ ${category.name} (${slug}) -> ${newIcon}`);
        updated++;
      } else {
        console.log(`⚠️  ${category.name} (${slug}) -> Ícone não encontrado no mapa`);
        notFound++;
      }
    }

    console.log(`\n📊 Resumo:`);
    console.log(`   ✅ Atualizados: ${updated}`);
    console.log(`   ⚠️  Não encontrados: ${notFound}`);
    console.log(`   📝 Total: ${snapshot.size}`);
    console.log('\n✨ Atualização concluída!');

  } catch (error) {
    console.error('❌ Erro ao atualizar ícones:', error);
  }
}

// Executar o script
updateCategoryIcons();
