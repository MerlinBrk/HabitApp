import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xytftodiuxefsylkdaig.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5dGZ0b2RpdXhlZnN5bGtkYWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MTE1NTEsImV4cCI6MjA2NDI4NzU1MX0.YzuTozhquDy5C1JiTAUyLUB6xmPIRdGeINRuphMD8PU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
