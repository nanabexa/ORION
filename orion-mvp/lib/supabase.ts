import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yvhmsayphptujetfjgnt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2aG1zYXlwaHB0dWpldGZqZ250Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0MjI5MTYsImV4cCI6MjA5NTk5ODkxNn0.qo4xFzE75zbUNXYUmtV8kbEiBuA2I4Nz48_nZiZoaxs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
