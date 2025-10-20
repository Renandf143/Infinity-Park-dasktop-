import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Criar categorias
  const categories = [
    {
      name: 'Reparos e Manutenção',
      slug: 'reparos-manutencao',
      description: 'Eletricistas, encanadores, marceneiros e técnicos especializados',
      icon: 'reparos'
    },
    {
      name: 'Limpeza e Organização',
      slug: 'limpeza-organizacao',
      description: 'Serviços de limpeza residencial, comercial e organização de ambientes',
      icon: 'limpeza'
    },
    {
      name: 'Tecnologia',
      slug: 'tecnologia',
      description: 'Desenvolvedores, designers, suporte técnico e consultoria em TI',
      icon: 'tecnologia'
    },
    {
      name: 'Beleza e Bem-estar',
      slug: 'beleza-bem-estar',
      description: 'Cabeleireiros, esteticistas, massoterapeutas e personal trainers',
      icon: 'beleza'
    },
    {
      name: 'Educação e Ensino',
      slug: 'educacao-ensino',
      description: 'Professores particulares, tutores e instrutores especializados',
      icon: 'educacao'
    },
    {
      name: 'Eventos e Entretenimento',
      slug: 'eventos-entretenimento',
      description: 'Fotógrafos, DJs, decoradores e organizadores de eventos',
      icon: 'eventos'
    }
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category
    })
  }

  console.log('✅ Categorias criadas com sucesso!')
  console.log('🎉 Seed concluído!')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
