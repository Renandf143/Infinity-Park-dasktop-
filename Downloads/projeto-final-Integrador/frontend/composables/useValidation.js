// Composable para validações
export const useValidation = () => {
  const supabase = useSupabaseClient()

  // Verificar se email já existe
  const checkEmailExists = async (email) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error
      }

      return {
        exists: !!data,
        data
      }
    } catch (error) {
      console.error('Erro ao verificar email:', error)
      return {
        exists: false,
        error: error.message
      }
    }
  }

  // Verificar se CPF já existe
  const checkCPFExists = async (cpf) => {
    try {
      // Remove formatação do CPF
      const cleanCPF = cpf.replace(/\D/g, '')
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('cpf', cleanCPF)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error
      }

      return {
        exists: !!data,
        data
      }
    } catch (error) {
      console.error('Erro ao verificar CPF:', error)
      return {
        exists: false,
        error: error.message
      }
    }
  }

  // Validar CPF
  const validateCPF = (cpf) => {
    const cleanCPF = cpf.replace(/\D/g, '')
    
    if (cleanCPF.length !== 11) return false
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false // CPFs com todos os dígitos iguais
    
    // Validação do primeiro dígito verificador
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (10 - i)
    }
    let remainder = 11 - (sum % 11)
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cleanCPF.charAt(9))) return false
    
    // Validação do segundo dígito verificador
    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (11 - i)
    }
    remainder = 11 - (sum % 11)
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cleanCPF.charAt(10))) return false
    
    return true
  }

  // Validar email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Validar telefone
  const validatePhone = (phone) => {
    const cleanPhone = phone.replace(/\D/g, '')
    return cleanPhone.length >= 10 && cleanPhone.length <= 11
  }

  // Validar senha
  const validatePassword = (password) => {
    return {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      isValid: password.length >= 8 && 
               /[A-Z]/.test(password) && 
               /[a-z]/.test(password) && 
               /\d/.test(password)
    }
  }

  return {
    checkEmailExists,
    checkCPFExists,
    validateCPF,
    validateEmail,
    validatePhone,
    validatePassword
  }
}