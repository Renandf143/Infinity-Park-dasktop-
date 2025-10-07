// Sistema avançado de filas de email com prioridades e retry
export default defineEventHandler(async (event) => {
  const { action, ...data } = await readBody(event)
  
  switch (action) {
    case 'add':
      return await addToQueue(data)
    case 'process':
      return await processQueue()
    case 'status':
      return await getQueueStatus()
    case 'retry':
      return await retryFailedEmails()
    default:
      throw createError({
        statusCode: 400,
        statusMessage: 'Ação inválida'
      })
  }
})

// Adicionar email à fila
async function addToQueue(emailData) {
  const {
    to,
    template,
    data,
    priority = 'normal',
    scheduledFor = null,
    maxRetries = 3
  } = emailData
  
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
    
    const queueItem = {
      recipient: to,
      template,
      template_data: data,
      priority: getPriorityValue(priority),
      status: 'pending',
      scheduled_for: scheduledFor || new Date().toISOString(),
      max_retries: maxRetries,
      retry_count: 0,
      created_at: new Date().toISOString()
    }
    
    const { data: result, error } = await supabase
      .from('email_queue')
      .insert(queueItem)
      .select()
      .single()
    
    if (error) throw error
    
    return {
      success: true,
      queueId: result.id,
      message: 'Email adicionado à fila'
    }
    
  } catch (error) {
    console.error('Erro ao adicionar à fila:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Processar fila de emails
async function processQueue() {
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
    
    // Buscar emails pendentes ordenados por prioridade e data
    const { data: emails, error } = await supabase
      .from('email_queue')
      .select('*')
      .eq('status', 'pending')
      .lte('scheduled_for', new Date().toISOString())
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(50) // Processar até 50 emails por vez
    
    if (error) throw error
    
    const results = {
      processed: 0,
      successful: 0,
      failed: 0,
      errors: []
    }
    
    for (const email of emails) {
      try {
        // Marcar como processando
        await supabase
          .from('email_queue')
          .update({ 
            status: 'processing',
            processing_started_at: new Date().toISOString()
          })
          .eq('id', email.id)
        
        // Enviar email
        const sendResult = await sendQueuedEmail(email)
        
        if (sendResult.success) {
          // Marcar como enviado
          await supabase
            .from('email_queue')
            .update({
              status: 'sent',
              sent_at: new Date().toISOString(),
              message_id: sendResult.messageId,
              provider: sendResult.provider
            })
            .eq('id', email.id)
          
          results.successful++
        } else {
          throw new Error(sendResult.error)
        }
        
      } catch (error) {
        console.error(`Erro ao processar email ${email.id}:`, error)
        
        // Incrementar contador de tentativas
        const newRetryCount = email.retry_count + 1
        
        if (newRetryCount >= email.max_retries) {
          // Marcar como falha permanente
          await supabase
            .from('email_queue')
            .update({
              status: 'failed',
              error_message: error.message,
              failed_at: new Date().toISOString()
            })
            .eq('id', email.id)
        } else {
          // Reagendar para retry
          const nextRetry = calculateNextRetry(newRetryCount)
          await supabase
            .from('email_queue')
            .update({
              status: 'pending',
              retry_count: newRetryCount,
              scheduled_for: nextRetry,
              last_error: error.message
            })
            .eq('id', email.id)
        }
        
        results.failed++
        results.errors.push({
          id: email.id,
          error: error.message
        })
      }
      
      results.processed++
    }
    
    return {
      success: true,
      results
    }
    
  } catch (error) {
    console.error('Erro ao processar fila:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Enviar email da fila
async function sendQueuedEmail(queueItem) {
  try {
    // Usar a API de envio existente
    const response = await $fetch('/api/email/send', {
      method: 'POST',
      body: {
        to: queueItem.recipient,
        template: queueItem.template,
        data: queueItem.template_data,
        priority: getPriorityName(queueItem.priority)
      }
    })
    
    return response
    
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

// Obter status da fila
async function getQueueStatus() {
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
    
    // Contar emails por status
    const { data: statusCounts, error } = await supabase
      .from('email_queue')
      .select('status')
    
    if (error) throw error
    
    const counts = statusCounts.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1
      return acc
    }, {})
    
    // Estatísticas dos últimos 7 dias
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const { data: recentStats, error: statsError } = await supabase
      .from('email_queue')
      .select('status, created_at')
      .gte('created_at', sevenDaysAgo.toISOString())
    
    if (statsError) throw statsError
    
    const dailyStats = {}
    recentStats.forEach(item => {
      const date = item.created_at.split('T')[0]
      if (!dailyStats[date]) {
        dailyStats[date] = { sent: 0, failed: 0, pending: 0 }
      }
      dailyStats[date][item.status]++
    })
    
    return {
      success: true,
      queue: {
        pending: counts.pending || 0,
        processing: counts.processing || 0,
        sent: counts.sent || 0,
        failed: counts.failed || 0,
        total: statusCounts.length
      },
      dailyStats,
      lastUpdated: new Date().toISOString()
    }
    
  } catch (error) {
    console.error('Erro ao obter status da fila:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Retentar emails falhados
async function retryFailedEmails() {
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
    
    // Buscar emails falhados que ainda podem ser retentados
    const { data: failedEmails, error } = await supabase
      .from('email_queue')
      .select('*')
      .eq('status', 'failed')
      .lt('retry_count', 'max_retries')
    
    if (error) throw error
    
    let retriedCount = 0
    
    for (const email of failedEmails) {
      const nextRetry = new Date()
      nextRetry.setMinutes(nextRetry.getMinutes() + 5) // Retry em 5 minutos
      
      await supabase
        .from('email_queue')
        .update({
          status: 'pending',
          scheduled_for: nextRetry.toISOString(),
          last_error: null
        })
        .eq('id', email.id)
      
      retriedCount++
    }
    
    return {
      success: true,
      retriedCount,
      message: `${retriedCount} emails reagendados para retry`
    }
    
  } catch (error) {
    console.error('Erro ao retentar emails:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Converter prioridade para valor numérico
function getPriorityValue(priority) {
  const priorities = {
    low: 1,
    normal: 5,
    high: 10,
    urgent: 15
  }
  return priorities[priority] || 5
}

// Converter valor numérico para nome da prioridade
function getPriorityName(value) {
  const priorities = {
    1: 'low',
    5: 'normal',
    10: 'high',
    15: 'urgent'
  }
  return priorities[value] || 'normal'
}

// Calcular próximo retry com backoff exponencial
function calculateNextRetry(retryCount) {
  const baseDelay = 5 // 5 minutos
  const exponentialDelay = Math.pow(2, retryCount - 1) * baseDelay
  const maxDelay = 60 // Máximo 60 minutos
  
  const delayMinutes = Math.min(exponentialDelay, maxDelay)
  
  const nextRetry = new Date()
  nextRetry.setMinutes(nextRetry.getMinutes() + delayMinutes)
  
  return nextRetry.toISOString()
}