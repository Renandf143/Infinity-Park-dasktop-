import { prisma } from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isActive: true
      },
      include: {
        _count: {
          select: {
            services: {
              where: {
                isActive: true
              }
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    const formattedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      icon: category.icon,
      serviceCount: category._count.services
    }))

    return {
      success: true,
      data: formattedCategories
    }

  } catch (error: any) {
    console.error('Erro ao buscar categorias:', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao buscar categorias'
    })
  }
})
