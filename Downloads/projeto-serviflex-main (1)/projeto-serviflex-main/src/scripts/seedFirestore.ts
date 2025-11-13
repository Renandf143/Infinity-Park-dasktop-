import { collection, doc, setDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";

/**
 * 🌱 Script para popular o Firestore com dados iniciais
 *
 * Execute no console do navegador:
 * import('./scripts/seedFirestore').then(m => m.seedFirestore())
 */

const categories = [
  {
    id: "eletricista",
    name: "Eletricista",
    description: "Instalação e manutenção elétrica residencial e comercial",
    icon: "⚡",
    slug: "eletricista",
  },
  {
    id: "encanador",
    name: "Encanador",
    description: "Instalação e reparo hidráulico, desentupimento",
    icon: "🔧",
    slug: "encanador",
  },
  {
    id: "pedreiro",
    name: "Pedreiro",
    description: "Construção, reforma e acabamento",
    icon: "🧱",
    slug: "pedreiro",
  },
  {
    id: "pintor",
    name: "Pintor",
    description: "Pintura residencial e comercial, textura",
    icon: "🎨",
    slug: "pintor",
  },
  {
    id: "marceneiro",
    name: "Marceneiro",
    description: "Móveis planejados, marcenaria em geral",
    icon: "🪚",
    slug: "marceneiro",
  },
  {
    id: "jardineiro",
    name: "Jardineiro",
    description: "Jardinagem, paisagismo e manutenção de jardins",
    icon: "🌱",
    slug: "jardineiro",
  },
  {
    id: "diarista",
    name: "Diarista",
    description: "Limpeza e organização residencial",
    icon: "🧹",
    slug: "diarista",
  },
  {
    id: "cozinheiro",
    name: "Cozinheiro",
    description: "Preparo de refeições, eventos e buffet",
    icon: "👨‍🍳",
    slug: "cozinheiro",
  },
  {
    id: "mecanico",
    name: "Mecânico",
    description: "Manutenção automotiva e reparos",
    icon: "🔩",
    slug: "mecanico",
  },
  {
    id: "tecnico-informatica",
    name: "Técnico de Informática",
    description: "Manutenção de computadores e redes",
    icon: "💻",
    slug: "tecnico-informatica",
  },
  {
    id: "professor-particular",
    name: "Professor Particular",
    description: "Aulas particulares e reforço escolar",
    icon: "📚",
    slug: "professor-particular",
  },
  {
    id: "personal-trainer",
    name: "Personal Trainer",
    description: "Treinamento físico personalizado",
    icon: "💪",
    slug: "personal-trainer",
  },
  {
    id: "fotografo",
    name: "Fotógrafo",
    description: "Fotografia profissional para eventos",
    icon: "📸",
    slug: "fotografo",
  },
  {
    id: "designer",
    name: "Designer",
    description: "Design gráfico e identidade visual",
    icon: "🎨",
    slug: "designer",
  },
  {
    id: "desenvolvedor",
    name: "Desenvolvedor",
    description: "Desenvolvimento de sites e aplicativos",
    icon: "👨‍💻",
    slug: "desenvolvedor",
  },
];

export async function seedFirestore() {
  console.log("🌱 Iniciando população do Firestore...");

  try {
    // Criar categorias
    console.log("📝 Criando categorias...");
    let created = 0;
    let errors = 0;

    for (const category of categories) {
      try {
        await setDoc(doc(db, "serviceCategories", category.id), category);
        console.log(`✅ Categoria criada: ${category.name}`);
        created++;
      } catch (err) {
        console.error(`❌ Erro ao criar ${category.name}:`, err);
        errors++;
      }
    }

    console.log("🎉 Processo concluído!");
    console.log(`✅ ${created} categorias criadas`);
    if (errors > 0) {
      console.log(`⚠️ ${errors} erros`);
    }

    return {
      success: errors === 0,
      categoriesCreated: created,
      errors,
    };
  } catch (error) {
    console.error("❌ Erro ao popular Firestore:", error);
    return {
      success: false,
      error,
    };
  }
}

// Função para verificar se as categorias existem
export async function checkCategories() {
  try {
    const categoriesRef = collection(db, "serviceCategories");
    const snapshot = await getDocs(categoriesRef);

    console.log(`📊 ${snapshot.size} categorias encontradas no Firestore`);

    snapshot.forEach((doc) => {
      console.log(`  - ${doc.data().name} (${doc.id})`);
    });

    return snapshot.size;
  } catch (error) {
    console.error("❌ Erro ao verificar categorias:", error);
    return 0;
  }
}

// Exportar para uso global no console
if (typeof window !== "undefined") {
  (window as any).seedFirestore = seedFirestore;
  (window as unknown).checkCategories = checkCategories;
}
