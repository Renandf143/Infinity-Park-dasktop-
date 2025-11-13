/**
 * Script para atualizar os ícones das categorias no Firestore
 * 
 * Este script substitui os emojis por nomes de ícones do Lucide React
 * 
 * Como executar:
 * 1. Instale as dependências: npm install firebase
 * 2. Configure as variáveis de ambiente no arquivo .env
 * 3. Execute: node scripts/updateCategoryIcons.js
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, updateDoc } = require('firebase/firestore');
require('dotenv').config();

// Configuração do Firebase
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// Mapeamento de emojis para nomes de ícones do Lucide React
const iconMapping = {
  // Categorias principais
  '🧹': 'Sparkles',
  '🔧': 'Wrench',
  '💅': 'Scissors',
  '💪': 'Heart',
  '📚': 'BookOpen',
  '🎉': 'PartyPopper',
  '🚚': 'Truck',
  '💻': 'Laptop',
  '🌱': 'Leaf',
  '👶': 'Baby',
  '🐾': 'PawPrint',
  '👨‍🍳': 'ChefHat',
  
  // Subcategorias - Limpeza
  '🏠': 'Home',
  '🏢': 'Building2',
  '🏗️': 'HardHat',
  '📦': 'Package',
  '✨': 'Sparkle',
  '👔': 'Shirt',
  
  // Subcategorias - Reparos
  '⚡': 'Zap',
  '🚰': 'Droplet',
  '🪚': 'Hammer',
  '🎨': 'Paintbrush',
  '🧱': 'Blocks',
  '🔩': 'Settings',
  '🪟': 'GlassWater',
  '⬜': 'Square',
  
  // Subcategorias - Beleza
  '💇': 'User',
  '💄': 'Palette',
  '🪒': 'Scissors',
  '👁️': 'Sparkle',
  '💈': 'Scissors',
  
  // Subcategorias - Saúde
  '🏋️': 'Dumbbell',
  '🩺': 'Stethoscope',
  '💆': 'HandMetal',
  '🥗': 'Salad',
  '🧠': 'Brain',
  '🧘': 'PersonStanding',
  
  // Subcategorias - Aulas
  '🔢': 'Calculator',
  '📝': 'FileText',
  '🇬🇧': 'Languages',
  '🎵': 'Music',
  '📖': 'BookMarked',
  '🎯': 'Target',
  
  // Subcategorias - Eventos
  '📋': 'ClipboardList',
  '🎈': 'Balloon',
  '🍽️': 'UtensilsCrossed',
  '🤡': 'Smile',
  '📸': 'Camera',
  '🎧': 'Headphones',
  '🎤': 'Mic',
  
  // Subcategorias - Transporte
  '🚐': 'Van',
  '🚛': 'Truck',
  '🚗': 'Car',
  
  // Subcategorias - Tecnologia
  '🖥️': 'Cpu',
  '🌐': 'Network',
  '🛠️': 'Settings',
  '👨‍💻': 'Code',
  '📹': 'Video',
  '📱': 'Smartphone',
  
  // Subcategorias - Jardinagem
  '🌿': 'TreePine',
  '🏞️': 'Mountain',
  '✂️': 'Scissors',
  '💧': 'Droplets',
  '🥬': 'Sprout',
  
  // Subcategorias - Cuidados Pessoais
  '👴': 'UserCircle',
  '👨‍⚕️': 'UserPlus',
  '🏥': 'Hospital',
  '♿': 'Accessibility',
  
  // Subcategorias - Pet Care
  '🛁': 'Bath',
  '🐕': 'Dog',
  '🦮': 'Dog',
  '🏨': 'Hotel',
  
  // Subcategorias - Alimentação
  '🎂': 'Cake',
  '🍳': 'CookingPot',
  '🍱': 'UtensilsCrossed',
  '🥟': 'UtensilsCrossed',
  '☕': 'Coffee',
};

async function updateCategoryIcons() {
  try {
    console.log('🚀 Iniciando atualização de ícones...\n');
    
    // Inicializar Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    // Buscar todas as categorias
    const categoriesRef = collection(db, 'categories');
    const categoriesSnapshot = await getDocs(categoriesRef);
    
    let updatedCount = 0;
    let errorCount = 0;
    
    for (const categoryDoc of categoriesSnapshot.docs) {
      const categoryData = categoryDoc.data();
      const categoryId = categoryDoc.id;
      
      try {
        // Atualizar ícone da categoria principal
        const newIcon = iconMapping[categoryData.icon] || categoryData.icon;
        
        // Atualizar subcategorias
        const updatedSubcategories = (categoryData.subcategories || []).map(sub => ({
          ...sub,
          icon: iconMapping[sub.icon] || sub.icon,
        }));
        
        // Atualizar documento no Firestore
        await updateDoc(doc(db, 'categories', categoryId), {
          icon: newIcon,
          subcategories: updatedSubcategories,
        });
        
        console.log(`✅ Categoria atualizada: ${categoryData.name}`);
        console.log(`   Ícone: ${categoryData.icon} → ${newIcon}`);
        updatedCount++;
        
      } catch (error) {
        console.error(`❌ Erro ao atualizar categoria ${categoryData.name}:`, error);
        errorCount++;
      }
    }
    
    console.log('\n📊 Resumo da atualização:');
    console.log(`   ✅ Categorias atualizadas: ${updatedCount}`);
    console.log(`   ❌ Erros: ${errorCount}`);
    console.log('\n✨ Atualização concluída!');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  }
}

// Executar script
updateCategoryIcons();
