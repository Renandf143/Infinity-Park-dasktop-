import { prisma } from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const {
      category,
      location,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc'
    } = query

    // Construir filtros
    const where: any = {
      isActive: true
    }

    if (category) {
      where.category = {
        slug: category
      }
    }

    if (location) {
      where.provider = {
        OR: [
          { locationCity: { contains: location as string, mode: 'insensitive' } },
          { locationState: { contains: location as string, mode: 'insensitive' } }
        ]
      }
    }

    // Buscar serviços
    const services = await prisma.service.findMany({
      where,
      include: {
        provider: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true
              }
            }
          }
        },
        category: {
          select: {
            name: true,
            icon: true,
            slug: true
          }
        },
        _count: {
          select: {
            orders: {
              where: {
                status: 'COMPLETED'
              }
            }
          }
        }
      },
      orderBy: {
        [sortBy as string]: order
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit)
    })

    // Contar total para paginação
    const total = await prisma.service.count({ where })

    // Formatar resposta
    const formattedServices = services.map(service => ({
      id: service.id,
      title: service.title,
      description: service.description,
      priceFrom: service.priceFrom,
      priceTo: service.priceTo,
      duration: service.duration,
      provider: {
        id: service.provider.id,
        name: service.provider.user.name,
        avatar: service.provider.user.avatar,
        rating: service.provider.rating,
        totalJobs: service.provider.totalJobs,
        locationCity: service.provider.locationCity,
        locationState: service.provider.locationState,
        isAvailable: service.provider.isAvailable
      },
      category: service.category,
      completedJobs: service._count.orders,
      createdAt: service.createdAt
    }))

    return {
      success: true,
      data: formattedServices,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    }

  } catch (error: any) {
    console.error('Erro ao buscar serviços:', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao buscar serviços'
    })
  }
})
