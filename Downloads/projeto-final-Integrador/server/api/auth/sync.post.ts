export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { firebaseUid, email, name, avatar } = body

    // Validação básica
    if (!firebaseUid || !email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Firebase UID e email são obrigatórios'
      })
    }

    // Para desenvolvimento, vamos simular uma resposta de sucesso
    // sem usar o banco de dados por enquanto
    const mockUser = {
      id: 'user_' + Date.now(),
      firebaseUid,
      email,
      name: name || 'Usuário',
      avatar,
      userType: 'CLIENT',
      isVerified: true,
      providerProfile: null
    }

    console.log('Usuário sincronizado (mock):', mockUser)

    return {
      success: true,
      user: mockUser
    }

  } catch (error: any) {
    console.error('Erro na sincronização:', error)

    return {
      success: false,
      error: error.message || 'Erro interno do servidor'
    }
  }
})
