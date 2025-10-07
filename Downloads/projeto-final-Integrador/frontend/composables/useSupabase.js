// Composable principal para interações com Supabase
export const useSupabase = () => {
  const { $supabase } = useNuxtApp()

  // =====================================================
  // PROFILES / USUÁRIOS
  // =====================================================

  const getProfile = async (userId) => {
    try {
      const { data, error } = await $supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Erro ao buscar perfil:', error)
      return { success: false, error: error.message }
    }
  }

  const updateProfile = async (userId, profileData) => {
    try {
      const { data, error } = await $supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          phone: profileData.phone,
          user_type: profileData.user_type,
          avatar_url: profileData.avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      return { success: false, error: error.message }
    }
  }

  const getAllUsers = async (filters = {}) => {
    try {
      let query = $supabase
        .from('users_complete')
        .select('*')
        .order('created_at', { ascending: false })

      // Aplicar filtros
      if (filters.userType) {
        query = query.eq('user_type', filters.userType)
      }
      if (filters.status) {
        query = query.eq('status', filters.status)
      }
      if (filters.search) {
        query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
      }

      const { data, error } = await query

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
      return { success: false, error: error.message }
    }
  }

  const updateUserStatus = async (userId, status) => {
    try {
      const { data, error } = await $supabase
        .from('profiles')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      return { success: false, error: error.message }
    }
  }

  const deleteUser = async (userId) => {
    try {
      const { error } = await $supabase
        .from('profiles')
        .delete()
        .eq('id', userId)

      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Erro ao deletar usuário:', error)
      return { success: false, error: error.message }
    }
  }

  // =====================================================
  // EMPRESAS
  // =====================================================

  const createCompany = async (companyData) => {
    try {
      const { data, error } = await $supabase
        .from('companies')
        .insert({
          user_id: companyData.user_id,
          company_name: companyData.company_name,
          cnpj: companyData.cnpj,
          company_size: companyData.company_size,
          business_area: companyData.business_area,
          responsible_name: companyData.responsible_name,
          position: companyData.position,
          phone: companyData.phone,
          cep: companyData.cep,
          street: companyData.street,
          number: companyData.number,
          complement: companyData.complement,
          neighborhood: companyData.neighborhood,
          city: companyData.city,
          state: companyData.state
        })
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Erro ao criar empresa:', error)
      return { success: false, error: error.message }
    }
  }

  const getCompany = async (userId) => {
    try {
      const { data, error } = await $supabase
        .from('companies')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Erro ao buscar empresa:', error)
      r