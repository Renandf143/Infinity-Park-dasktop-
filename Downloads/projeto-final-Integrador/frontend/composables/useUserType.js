import { ref, computed } from 'vue'

export const useUserType = () => {
  const { $supabase } = useNuxtApp()
  const { user } = useAuth()

  const loading = ref(false)

  // Verificar se usuário é cliente
  const isCliente = computed(() => user.value?.userType === 'cliente')
  
  // Verificar se usuário é profissional
  const isProfissional = computed(() => user.value?.userType === 'profissional')
  
  // Verificar se usuário é empresa
  const isEmpresa = computed(() => user.value?.userType === 'empresa')
  
  // Verificar se usuário é admin
  const isAdmin = computed(() => user.value?.userType === 'admin')

  // Atualizar tipo de usuário
  const updateUserType = async (newType) => {
    if (!user.value) {
      return { success: false, error: 'Usuário não autenticado' }
    }

    loading.value = true

    try {
      const { error } = await $supabase
        .from('profiles')
        .update({ user_type: newType })
        .eq('id', user.value.id)

      if (error) {
        console.error('Erro ao atualizar tipo de usuário:', error)
        return { success: false, error: error.message }
      }

      // Atualizar dados locais
      const updatedUser = { ...user.value, userType: newType }
      user.value = updatedUser
      localStorage.setItem('user', JSON.stringify(updatedUser))

      return { success: true }
    } catch (error) {
      console.error('Erro ao atualizar tipo de usuário:', error)
      return { success: false, error: 'Erro interno' }
    } finally {
      loading.value = false
    }
  }

  // Solicitar upgrade para profissional
  const requestProfessionalUpgrade = async (professionalData) => {
    if (!user.value) {
      return { success: false, error: 'Usuário não autenticado' }
    }

    loading.value = true

    try {
      // Atualizar perfil com dados profissionais
      const { error: profileError } = await $supabase
        .from('profiles')
        .update({
          user_type: 'profissional',
          status: 'pendente', // Aguardando aprovação
          phone: professionalData.phone,
          full_name: professionalData.fullName
        })
        .eq('id', user.value.id)

      if (profileError) {
        console.error('Erro ao atualizar perfil:', profileError)
        return { success: false, error: profileError.message }
      }

      // Criar notificação para admin
      await $supabase
        .from('notifications')
        .insert({
          user_id: user.value.id,
          title: 'Solicitação de Upgrade para Profissional',
          message: `${user.value.displayName} solicitou upgrade para conta profissional`,
          type: 'system'
        })

      return { success: true, message: 'Solicitação enviada! Aguarde aprovação.' }
    } catch (error) {
      console.error('Erro ao solicitar upgrade:', error)
      return { success: false, error: 'Erro interno' }
    } finally {
      loading.value = false
    }
  }

  // Solicitar upgrade para empresa
  const requestCompanyUpgrade = async (companyData) => {
    if (!user.value) {
      return { success: false, error: 'Usuário não autenticado' }
    }

    loading.value = true

    try {
      // Criar registro da empresa
      const { error: companyError } = await $supabase
        .from('companies')
        .insert({
          user_id: user.value.id,
          company_name: companyData.companyName,
          cnpj: companyData.cnpj,
          company_size: companyData.companySize,
          business_area: companyData.businessArea,
          responsible_name: companyData.responsibleName,
          position: companyData.position,
          phone: companyData.phone,
          cep: companyData.cep,
          street: companyData.street,
          number: companyData.number,
          complement: companyData.complement,
          neighborhood: companyData.neighborhood,
          city: companyData.city,
          state: companyData.state,
          status: 'pendente'
        })

      if (companyError) {
        console.error('Erro ao criar empresa:', companyError)
        return { success: false, error: companyError.message }
      }

      // Atualizar perfil do usuário
      const { error: profileError } = await $supabase
        .from('profiles')
        .update({
          user_type: 'empresa',
          status: 'pendente'
        })
        .eq('id', user.value.id)

      if (profileError) {
        console.error('Erro ao atualizar perfil:', profileError)
        return { success: false, error: profileError.message }
      }

      // Criar notificação para admin
      await $supabase
        .from('notifications')
        .insert({
          user_id: user.value.id,
          title: 'Nova Empresa Cadastrada',
          message: `${companyData.companyName} foi cadastrada e aguarda aprovação`,
          type: 'system'
        })

      return { success: true, message: 'Empresa cadastrada! Aguarde aprovação.' }
    } catch (error) {
      console.error('Erro ao cadastrar empresa:', error)
      return { success: false, error: 'Erro interno' }
    } finally {
      loading.value = false
    }
  }

  // Buscar dados da empresa do usuário
  const getUserCompany = async () => {
    if (!user.value || user.value.userType !== 'empresa') {
      return null
    }

    try {
      const { data, error } = await $supabase
        .from('companies')
        .select('*')
        .eq('user_id', user.value.id)
        .single()

      if (error) {
        console.error('Erro ao buscar empresa:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Erro ao buscar empresa:', error)
      return null
    }
  }

  return {
    loading: readonly(loading),
    isCliente,
    isProfissional,
    isEmpresa,
    isAdmin,
    updateUserType,
    requestProfessionalUpgrade,
    requestCompanyUpgrade,
    getUserCompany
  }
}