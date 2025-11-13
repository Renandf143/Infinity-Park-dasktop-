import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const categories = [
  {
    id: 'eletricista',
    name: 'Eletricista',
    description: 'Instalação e manutenção elétrica residencial e comercial',
    icon: '⚡',
    slug: 'eletricista'
  },
  {
    id: 'encanador',
    name: 'Encanador',
    description: 'Instalação e reparo hidráulico, desentupimento',
    icon: '🔧',
    slug: 'encanador'
  },
  {
    id: 'pedreiro',
    name: 'Pedreiro',
    description: 'Construção, reforma e acabamento',
    icon: '🧱',
    slug: 'pedreiro'
  },
  {
    id: 'pintor',
    name: 'Pintor',
    description: 'Pintura residencial e comercial, textura',
    icon: '🎨',
    slug: 'pintor'
  },
  {
    id: 'marceneiro',
    name: 'Marceneiro',
    description: 'Móveis planejados, marcenaria em geral',
    icon: '🪚',
    slug: 'marceneiro'
  },
  {
    id: 'jardineiro',
    name: 'Jardineiro',
    description: 'Jardinagem, paisagismo e manutenção de jardins',
    icon: '🌱',
    slug: 'jardineiro'
  },
  {
    id: 'diarista',
    name: 'Diarista',
    description: 'Limpeza e organização residencial',
    icon: '🧹',
    slug: 'diarista'
  },
  {
    id: 'cozinheiro',
    name: 'Cozinheiro',
    description: 'Preparo de refeições, eventos e buffet',
    icon: '👨‍🍳',
    slug: 'cozinheiro'
  },
  {
    id: 'mecanico',
    name: 'Mecânico',
    description: 'Manutenção automotiva e reparos',
    icon: '🔩',
    slug: 'mecanico'
  },
  {
    id: 'tecnico-informatica',
    name: 'Técnico de Informática',
    description: 'Manutenção de computadores e redes',
    icon: '💻',
    slug: 'tecnico-informatica'
  },
  {
    id: 'professor-particular',
    name: 'Professor Particular',
    description: 'Aulas particulares e reforço escolar',
    icon: '📚',
    slug: 'professor-particular'
  },
  {
    id: 'personal-trainer',
    name: 'Personal Trainer',
    description: 'Treinamento físico personalizado',
    icon: '💪',
    slug: 'personal-trainer'
  },
  {
    id: 'fotografo',
    name: 'Fotógrafo',
    description: 'Fotografia profissional para eventos',
    icon: '📸',
    slug: 'fotografo'
  },
  {
    id: 'designer',
    name: 'Designer',
    description: 'Design gráfico e identidade visual',
    icon: '🎨',
    slug: 'designer'
  },
  {
    id: 'desenvolvedor',
    name: 'Desenvolvedor',
    description: 'Desenvolvimento de sites e aplicativos',
    icon: '👨‍💻',
    slug: 'desenvolvedor'
  }
];

/**
 * Criar todas as categorias no Firestore
 */
export async function createAllCategories() {
  console.log('🌱 Iniciando criação de categorias...');
  console.log('📊 Total de categorias a criar:', categories.length);
  
  let created = 0;
  let errors = 0;
  const errorDetails: string[] = [];
  
  for (const category of categories) {
    try {
      console.log(`📝 Criando: ${category.name}...`);
      
      await setDoc(doc(db, 'serviceCategories', category.id), {
        name: category.name,
        description: category.description,
        icon: category.icon,
        slug: category.slug
      });
      
      console.log(`✅ ${category.name} criada com sucesso!`);
      created++;
      
    } catch (error: any) {
      console.error(`❌ Erro ao criar ${category.name}:`, error.message);
      errors++;
      errorDetails.push(`${category.name}: ${error.message}`);
    }
  }
  
  console.log('\n🎉 Processo concluído!');
  console.log(`✅ Categorias criadas: ${created}/${categories.length}`);
  
  if (errors > 0) {
    console.log(`❌ Erros: ${errors}`);
    console.log('Detalhes dos erros:');
    errorDetails.forEach(err => console.log(`  - ${err}`));
  }
  
  // Verificar quantas existem agora
  await checkAllCategories();
  
  return {
    success: errors === 0,
    created,
    errors,
    errorDetails
  };
}

/**
 * Verificar quantas categorias existem
 */
export async function checkAllCategories() {
  try {
    console.log('\n🔍 Verificando categorias no Firestore...');
    
    const categoriesRef = collection(db, 'serviceCategories');
    const snapshot = await getDocs(categoriesRef);
    
    console.log(`📊 Total encontrado: ${snapshot.size} categorias`);
    
    if (snapshot.size > 0) {
      console.log('\n📋 Categorias existentes:');
      snapshot.forEach(doc => {
        const data = doc.data();
        console.log(`  ${data.icon} ${data.name} (${doc.id})`);
      });
    } else {
      console.log('⚠️ Nenhuma categoria encontrada!');
    }
    
    return snapshot.size;
  } catch (error: any) {
    console.error('❌ Erro ao verificar categorias:', error.message);
    return 0;
  }
}

/**
 * Deletar todas as categorias (para resetar)
 */
export async function deleteAllCategories() {
  try {
    console.log('🗑️ Deletando todas as categorias...');
    
    const { deleteDoc } = await import('firebase/firestore');
    const categoriesRef = collection(db, 'serviceCategories');
    const snapshot = await getDocs(categoriesRef);
    
    let deleted = 0;
    for (const docSnapshot of snapshot.docs) {
      await deleteDoc(docSnapshot.ref);
      deleted++;
      console.log(`✅ Deletada: ${docSnapshot.data().name}`);
    }
    
    console.log(`🎉 ${deleted} categorias deletadas`);
    return deleted;
  } catch (error) {
    console.error('❌ Erro ao deletar:', error);
    return 0;
  }
}

// Exportar para uso global no console
if (typeof window !== 'undefined') {
  (window as any).createAllCategories = createAllCategories;
  (window as any).checkAllCategories = checkAllCategories;
  (window as unknown).deleteAllCategories = deleteAllCategories;
  
  console.log('✅ Funções disponíveis no console:');
  console.log('  - createAllCategories() - Criar todas as categorias');
  console.log('  - checkAllCategories() - Verificar categorias existentes');
  console.log('  - deleteAllCategories() - Deletar todas (cuidado!)');
}
