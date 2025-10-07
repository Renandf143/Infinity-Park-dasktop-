// Composable para gerenciar cadastro de profissionais
export const useProfessionalRegistration = () => {
  const { $supabase } = useNuxtApp()

  // Criar conta completa de profissional
  const createProfessionalAccount = async (formData) => {
    try {
      // 1. Criar usuário no Supabase Auth com confirmação de email
      const { data: authData, error: authError } = await $supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify-email`,
          data: {
            full_name: formData.name,
            user_type: 'profissional',
            phone: formData.phone,
            cpf: formData.cpf
          }
        }
      })

      if (authError) {
        throw new Error(`Erro na autenticação: ${authError.message}`)
      }

      const userId = authData.user?.id
      if (!userId) {
        throw new Error('ID do usuário não encontrado')
      }

      // 2. Criar perfil na tabela profiles
      const { error: profileError } = await $supabase
        .from('profiles')
        .insert({
          id: userId,
          full_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          cpf: formData.cpf,
          user_type: 'profissional',
          status: 'pending_verification'
        })

      if (profileError) {
        throw new Error(`Erro ao criar perfil: ${profileError.message}`)
      }

      // 3. Salvar endereço
      const { error: addressError } = await $supabase
        .from('addresses')
        .insert({
          user_id: userId,
          street: formData.logradouro,
          number: formData.numero,
          complement: formData.complemento || null,
          neighborhood: formData.bairro,
          city: formData.cidade,
          state: 'SP', // Você pode adicionar um campo para estado no formulário
          cep: formData.cep,
          country: formData.pais || 'Brasil',
          is_primary: true
        })

      if (addressError) {
        console.warn('Erro ao salvar endereço:', addressError)
        // Não falha o cadastro por causa do endereço
      }

      // 4. Salvar informações profissionais
      const { error: professionalError } = await $supabase
        .from('professionals')
        .insert({
          user_id: userId,
          profession: formData.profissao,
          experience: formData.experiencia,
          description: formData.descricao,
          hourly_rate: parseFloat(formData.preco_hora),
          availability: formData.disponibilidade || [],
          status: 'pending_verification'
        })

      if (professionalError) {
        throw new Error(`Erro ao salvar dados profissionais: ${professionalError.message}`)
      }

      // 5. Registrar documentos (placeholder - você pode implementar upload depois)
      if (formData.documentFront || formData.documentBack || formData.residenceProof) {
        const documentsToInsert = []
        
        if (formData.documentFront) {
          documentsToInsert.push({
            user_id: userId,
            document_type: 'identity',
            file_name: formData.documentFront.name,
            file_size: formData.documentFront.size,
            status: 'pending_verification'
          })
        }
        
        if (formData.residenceProof) {
          documentsToInsert.push({
            user_id: userId,
            document_type: 'residence_proof',
            file_name: formData.residenceProof.name,
            file_size: formData.residenceProof.size,
            status: 'pending_verification'
          })
        }

        if (documentsToInsert.length > 0) {
          const { error: documentsError } = await $supabase
            .from('user_documents')
            .insert(documentsToInsert)

          if (documentsError) {
            console.warn('Erro ao registrar documentos:', documentsError)
            // Não falha o cadastro por causa dos documentos
          }
        }
      }

      return {
        success: true,
        user: authData.user,
        message: 'Conta de profissional criada com sucesso!'
      }

    } catch (error) {
      console.error('Erro ao criar conta de profissional:', error)
      return {
        success: false,
        error: error.message || 'Erro inesperado ao criar conta'
      }
    }
  }

  // Criar conta de cliente (mais simples)
  const createClientAccount = async (formData) => {
    try {
      // 1. Criar usuário no Supabase Auth com confirmação de email
      const { data: authData, error: authError } = await $supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify-email`,
          data: {
            full_name: formData.name,
            user_type: 'cliente',
            phone: formData.phone,
            cpf: formData.cpf
          }
        }
      })

      if (authError) {
        throw new Error(`Erro na autenticação: ${authError.message}`)
      }

      const userId = authData.user?.id
      if (!userId) {
        throw new Error('ID do usuário não encontrado')
      }

      // 2. Criar perfil na tabela profiles
      const { error: profileError } = await $supabase
        .from('profiles')
        .insert({
          id: userId,
          full_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          cpf: formData.cpf,
          user_type: 'cliente',
          status: 'active' // Clientes ficam ativos imediatamente
        })

      if (profileError) {
        throw new Error(`Erro ao criar perfil: ${profileError.message}`)
      }

      // 3. Registrar documentos (se houver)
      if (formData.documentFront || formData.documentBack || formData.residenceProof) {
        const documentsToInsert = []
        
        if (formData.documentFront) {
          documentsToInsert.push({
            user_id: userId,
            document_type: 'identity',
            file_name: formData.documentFront.name,
            file_size: formData.documentFront.size,
            status: 'pending_verification'
          })
        }
        
        if (formData.residenceProof) {
          documentsToInsert.push({
            user_id: userId,
            document_type: 'residence_proof',
            file_name: formData.residenceProof.name,
            file_size: formData.residenceProof.size,
            status: 'pending_verification'
          })
        }

        if (documentsToInsert.length > 0) {
          const { error: documentsError } = await $supabase
            .from('user_documents')
            .insert(documentsToInsert)

          if (documentsError) {
            console.warn('Erro ao registrar documentos:', documentsError)
          }
        }
      }

      return {
        success: true,
        user: authData.user,
        message: 'Conta de cliente criada com sucesso!'
      }

    } catch (error) {
      console.error('Erro ao criar conta de cliente:', error)
      return {
        success: false,
        error: error.message || 'Erro inesperado ao criar conta'
      }
    }
  }

  // Verificar se email já existe
  const checkEmailExists = async (email) => {
    try {
      const { data, error } = await $supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error
      }

      return { exists: !!data }
    } catch (error) {
      console.error('Erro ao verificar email:', error)
      return { exists: false, error: error.message }
    }
  }

  // Verificar se CPF já existe
  const checkCPFExists = async (cpf) => {
    try {
      const { data, error } = await $supabase
        .from('profiles')
        .select('cpf')
        .eq('cpf', cpf)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error
      }

      return { exists: !!data }
    } catch (error) {
      console.error('Erro ao verificar CPF:', error)
      return { exists: false, error: error.message }
    }
  }

  return {
    createProfessionalAccount,
    createClientAccount,
    checkEmailExists,
    checkCPFExists
  }
}