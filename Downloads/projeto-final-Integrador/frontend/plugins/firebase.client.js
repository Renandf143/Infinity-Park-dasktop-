import { createClient } from '@supabase/supabase-js'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  const supabaseUrl = config.public.supabaseUrl || 'https://pntjwgzivjnkpkfswmeg.supabase.co'
  const supabaseKey = config.public.supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBudGp3Z3ppdmpua3BrZnN3bWVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NzczNjQsImV4cCI6MjA3NTM1MzM2NH0.XjZewQzh0KW-WGEc0zPnd1moiiLz6OlfoLugl8uXU-M'
  
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      redirectTo: process.client ? `${window.location.origin}/auth/callback` : undefined,
      autoRefreshToken: true,
      persistSession: true
    }
  })

  return {
    provide: {
      supabase
    }
  }
})