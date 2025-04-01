import { createClient } from '@supabase/supabase-js'

// Temporarily hardcode the values
const supabase = createClient(
  "https://ezpvwagkuuvglouoblnj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6cHZ3YWdrdXV2Z2xvdW9ibG5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxODkwMDAsImV4cCI6MjA1Nzc2NTAwMH0.cXa512fGWqIZQYxmFXoW8_hzV7q7t1pE-20IG_4wxHg"
)

export default supabase