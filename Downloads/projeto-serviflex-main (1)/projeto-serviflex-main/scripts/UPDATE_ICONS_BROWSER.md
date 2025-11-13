# Script para Atualizar Ícones das Categorias

## 🚀 Como Usar (No Console do Navegador)

1. Abra seu site no navegador
2. Pressione F12 para abrir o DevTools
3. Vá na aba "Console"
4. Cole e execute o código abaixo:

```javascript
// Mapeamento de categorias para ícones do Lucide React
const categoryIconMap = {
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

// Função para atualizar os ícones
async function updateCategoryIcons() {
  const { collection, getDocs, doc, updateDoc } = await import('firebase/firestore');
  const { db } = await import('./firebase');
  
  console.log('🔄 Iniciando atualização de ícones...\n');
  
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
      console.log(`⚠️  ${category.name} (${slug}) -> Ícone não encontrado`);
      notFound++;
    }
  }
  
  console.log(`\n📊 Resumo:`);
  console.log(`   ✅ Atualizados: ${updated}`);
  console.log(`   ⚠️  Não encontrados: ${notFound}`);
  console.log(`   📝 Total: ${snapshot.size}`);
  console.log('\n✨ Concluído!');
}

// Executar
updateCategoryIcons();
```

## 📝 Ícones Disponíveis

Todos os ícones são do Lucide React. Veja a lista completa em:
https://lucide.dev/icons/

## 🎨 Como Adicionar Mais Categorias

Adicione no objeto `categoryIconMap`:

```javascript
'slug-da-categoria': 'NomeDoIcone',
```

Exemplo:
```javascript
'designer-grafico': 'Palette',
'advogado': 'Scale',
'contador': 'Calculator',
```

## ⚠️ Importante

- Execute este script apenas UMA VEZ
- Certifique-se de estar logado no sistema
- Aguarde a conclusão antes de recarregar a página
