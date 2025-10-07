// Sistema avançado de notificações com múltiplos canais
export const useNotifications = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  // Enviar notificação inteligente (escolhe o melhor canal)
  const sendSmartNotification = async (notification) => {
    try {
      const {
        userId,
        type,
        title,
        message,
        data = {},
        priority = 'normal',
        channels = ['email', 'push', 'in_app']
      } = notification

      // 1. Obter preferências do usuário
      const userPreferences = await getUserNotificationPreferences(userId)
      
      // 2. Filtrar canais baseado nas preferências
      const enabledChannels = channels.filter(channel => 
        userPreferences[`${type}_${channel}`] !== false
      )

      // 3. Determinar melhor canal baseado no contexto
      const optimalChannels = await determineOptimalChannels(
        userId, 
        type, 
        priority, 
        enabledChannels
      )

      const results = []

      // 4. Enviar por cada canal
      for (const channel of optimalChannels) {
        try {
          let result
          switch (channel) {
            case 'email':
              result = await sendEmailNotification({
                userId,
                type,
                title,
                message,
                data,
                priority
              })
              break
            case 'push':
              result = await sendPushNotification({
                userId,
                title,
                message,
                data
              })
              break
            case 'in_app':
              result = await sendInAppNotification({
                userId,
                type,
                title,
                message,
                data
              })
              break
            case 'sms':
              result = await sendSMSNotification({
                userId,
                message,
                data
              })
              break
          }
          
          results.push({
            channel,
            success: true,
            result
          })
        } catch (error) {
          results.push({
            channel,
            success: false,
            error: error.message
          })
        }
      }

      // 5. Log da notificação
      await logNotification({
        userId,
        type,
        title,
        message,
        channels: optimalChannels,
        results,
        timestamp: new Date().toISOString()
      })

      return {
        success: true,
        channels: optimalChannels,
        results
      }

    } catch (error) {
      console.error('Erro ao enviar notificação inteligente:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Obter preferências de notificação do usuário
  const getUserNotificationPreferences = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      // Preferências padrão se não existir
      return data || {
        // Verificação de email
        email_verification_email: true,
        email_verification_push: false,
        email_verification_in_app: true,
        
        // Boas-vindas
        welcome_email: true,
        welcome_push: true,
        welcome_in_app: true,
        
        // Serviços
        service_request_email: true,
        service_request_push: true,
        service_request_in_app: true,
        service_request_sms: false,
        
        service_accepted_email: true,
        service_accepted_push: true,
        service_accepted_in_app: true,
        service_accepted_sms: true,
        
        service_completed_email: true,
        service_completed_push: true,
        service_completed_in_app: true,
        
        // Pagamentos
        payment_received_email: true,
        payment_received_push: true,
        payment_received_in_app: true,
        payment_received_sms: false,
        
        // Marketing
        marketing_email: true,
        marketing_push: false,
        marketing_in_app: false,
        marketing_sms: false,
        
        // Resumos
        weekly_summary_email: true,
        weekly_summary_push: false,
        weekly_summary_in_app: false
      }
    } catch (error) {
      console.error('Erro ao obter preferências:', error)
      return {}
    }
  }

  // Determinar canais ótimos baseado no contexto
  const determineOptimalChannels = async (userId, type, priority, enabledChannels) => {
    try {
      // Obter dados do usuário para contexto
      const { data: profile } = await supabase
        .from('profiles')
        .select('last_seen, timezone, user_type')
        .eq('id', userId)
        .single()

      const now = new Date()
      const lastSeen = profile?.last_seen ? new Date(profile.last_seen) : null
      const isOnline = lastSeen && (now - lastSeen) < 5 * 60 * 1000 // 5 minutos

      // Regras de otimização
      const rules = {
        // Notificações urgentes sempre usam todos os canais
        urgent: () => enabledChannels,
        
        // Verificação de email sempre por email
        email_verification: () => ['email', 'in_app'].filter(c => enabledChannels.includes(c)),
        
        // Solicitações de serviço
        service_request: () => {
          if (isOnline) {
            return ['push', 'in_app'].filter(c => enabledChannels.includes(c))
          } else {
            return ['email', 'sms', 'push'].filter(c => enabledChannels.includes(c))
          }
        },
        
        // Pagamentos sempre múltiplos canais
        payment_received: () => enabledChannels,
        
        // Marketing apenas se usuário estiver offline
        marketing: () => {
          if (isOnline) {
            return ['in_app'].filter(c => enabledChannels.includes(c))
          } else {
            return ['email'].filter(c => enabledChannels.includes(c))
          }
        },
        
        // Padrão baseado na prioridade
        default: () => {
          switch (priority) {
            case 'high':
              return enabledChannels.slice(0, 2) // Primeiros 2 canais
            case 'normal':
              return enabledChannels.slice(0, 1) // Primeiro canal
            case 'low':
              return isOnline ? ['in_app'] : ['email']
            default:
              return enabledChannels.slice(0, 1)
          }
        }
      }

      const rule = rules[type] || rules[priority] || rules.default
      return rule()

    } catch (error) {
      console.error('Erro ao determinar canais ótimos:', error)
      return enabledChannels.slice(0, 1) // Fallback para primeiro canal
    }
  }

  // Enviar notificação por email
  const sendEmailNotification = async (notification) => {
    try {
      // Mapear tipos para templates
      const templateMap = {
        email_verification: 'email_verification',
        welcome_client: 'welcome_client',
        welcome_professional: 'welcome_professional',
        service_request: 'service_request',
        service_accepted: 'service_accepted',
        service_completed: 'service_completed',
        payment_received: 'payment_received',
        documents_approved: 'documents_approved',
        documents_rejected: 'documents_rejected',
        weekly_summary: 'weekly_summary'
      }

      const template = templateMap[notification.type] || 'generic'

      // Obter email do usuário
      const { data: profile } = await supabase
        .from('profiles')
        .select('email, name')
        .eq('id', notification.userId)
        .single()

      if (!profile?.email) {
        throw new Error('Email do usuário não encontrado')
      }

      // Adicionar à fila de email
      const response = await $fetch('/api/email/queue', {
        method: 'POST',
        body: {
          action: 'add',
          to: profile.email,
          template,
          data: {
            name: profile.name,
            ...notification.data
          },
          priority: notification.priority
        }
      })

      return response

    } catch (error) {
      console.error('Erro ao enviar email:', error)
      throw error
    }
  }

  // Enviar notificação push
  const sendPushNotification = async (notification) => {
    try {
      // Obter tokens de push do usuário
      const { data: tokens } = await supabase
        .from('push_tokens')
        .select('token, platform')
        .eq('user_id', notification.userId)
        .eq('active', true)

      if (!tokens || tokens.length === 0) {
        throw new Error('Nenhum token de push encontrado')
      }

      const results = []

      for (const tokenData of tokens) {
        try {
          // Aqui você integraria com Firebase, OneSignal, etc.
          const pushResult = await sendPushToToken({
            token: tokenData.token,
            platform: tokenData.platform,
            title: notification.title,
            body: notification.message,
            data: notification.data
          })

          results.push({
            token: tokenData.token,
            success: true,
            result: pushResult
          })
        } catch (error) {
          results.push({
            token: tokenData.token,
            success: false,
            error: error.message
          })
        }
      }

      return {
        success: true,
        results
      }

    } catch (error) {
      console.error('Erro ao enviar push:', error)
      throw error
    }
  }

  // Enviar notificação in-app
  const sendInAppNotification = async (notification) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: notification.userId,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          data: notification.data,
          read: false,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      // Enviar via realtime para usuários online
      await supabase
        .channel(`user:${notification.userId}`)
        .send({
          type: 'broadcast',
          event: 'notification',
          payload: data
        })

      return {
        success: true,
        notificationId: data.id
      }

    } catch (error) {
      console.error('Erro ao enviar notificação in-app:', error)
      throw error
    }
  }

  // Enviar SMS
  const sendSMSNotification = async (notification) => {
    try {
      // Obter telefone do usuário
      const { data: profile } = await supabase
        .from('profiles')
        .select('phone')
        .eq('id', notification.userId)
        .single()

      if (!profile?.phone) {
        throw new Error('Telefone do usuário não encontrado')
      }

      // Aqui você integraria com Twilio, AWS SNS, etc.
      const smsResult = await sendSMS({
        to: profile.phone,
        message: notification.message
      })

      return smsResult

    } catch (error) {
      console.error('Erro ao enviar SMS:', error)
      throw error
    }
  }

  // Enviar push para token específico
  const sendPushToToken = async (pushData) => {
    // Implementação específica do provedor de push
    // Exemplo com Firebase:
    /*
    const admin = require('firebase-admin')
    
    const message = {
      token: pushData.token,
      notification: {
        title: pushData.title,
        body: pushData.body
      },
      data: pushData.data
    }
    
    return await admin.messaging().send(message)
    */
    
    // Por enquanto, simular sucesso
    return {
      success: true,
      messageId: `push_${Date.now()}`
    }
  }

  // Enviar SMS
  const sendSMS = async (smsData) => {
    // Implementação específica do provedor de SMS
    // Exemplo com Twilio:
    /*
    const twilio = require('twilio')
    const client = twilio(accountSid, authToken)
    
    return await client.messages.create({
      body: smsData.message,
      from: '+1234567890',
      to: smsData.to
    })
    */
    
    // Por enquanto, simular sucesso
    return {
      success: true,
      messageId: `sms_${Date.now()}`
    }
  }

  // Log de notificação
  const logNotification = async (logData) => {
    try {
      await supabase
        .from('notification_logs')
        .insert({
          user_id: logData.userId,
          type: logData.type,
          title: logData.title,
          message: logData.message,
          channels: logData.channels,
          results: logData.results,
          sent_at: logData.timestamp
        })
    } catch (error) {
      console.error('Erro ao salvar log de notificação:', error)
    }
  }

  // Obter notificações in-app do usuário
  const getInAppNotifications = async (limit = 20, offset = 0) => {
    try {
      if (!user.value) return { notifications: [], total: 0 }

      const { data, error, count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', user.value.id)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) throw error

      return {
        notifications: data || [],
        total: count || 0
      }
    } catch (error) {
      console.error('Erro ao obter notificações:', error)
      return { notifications: [], total: 0 }
    }
  }

  // Marcar notificação como lida
  const markAsRead = async (notificationId) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('id', notificationId)
        .eq('user_id', user.value.id)

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Erro ao marcar como lida:', error)
      return { success: false, error: error.message }
    }
  }

  // Marcar todas como lidas
  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('user_id', user.value.id)
        .eq('read', false)

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error)
      return { success: false, error: error.message }
    }
  }

  // Atualizar preferências de notificação
  const updateNotificationPreferences = async (preferences) => {
    try {
      if (!user.value) throw new Error('Usuário não logado')

      const { error } = await supabase
        .from('user_notification_preferences')
        .upsert({
          user_id: user.value.id,
          ...preferences,
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Erro ao atualizar preferências:', error)
      return { success: false, error: error.message }
    }
  }

  return {
    sendSmartNotification,
    sendEmailNotification,
    sendPushNotification,
    sendInAppNotification,
    sendSMSNotification,
    getInAppNotifications,
    markAsRead,
    markAllAsRead,
    updateNotificationPreferences,
    getUserNotificationPreferences
  }
}