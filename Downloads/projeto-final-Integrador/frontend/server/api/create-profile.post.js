import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // Configuração do Supabase com service role (bypass RLS)
    const supabaseUrl = process.env.SUPABASE_URL || 'https://pntjwgzivjnkpkfswmeg.supabase.co'
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sua-service-role-key'
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
    
    // Criar perfil usando service role (bypassa RLS)
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        ...body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      })
    
    if (error) {
      console.error('Erro ao criar perfil:', error)
      throw createError({
        statusCode: 500,
        statusMessage: `Erro ao criar perfil: ${error.message}`
      })
    }
    
    return {
      success: true,
      data
    }
    
  } catch (error) {
    console.error('Erro na API create-profile:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Erro interno do servidor'
    })
  }
})