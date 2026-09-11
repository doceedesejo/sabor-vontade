import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ulnsjzcyjcheiuxpazoj.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsbnNqemN5amNoZWl1eHBhem9qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTA3NzcyNiwiZXhwIjoyMTA0NjUzNzI2fQ.j98oRWIwE0jiw4C9D_J4zlqkk9kn972SrpmYzW4zLUg'

export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
