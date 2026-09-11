import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ulnsjzcyjcheiuxpazoj.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsbnNqemN5amNoZWl1eHBhem9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwNzc3MjYsImV4cCI6MjEwNDY1MzcyNn0.O2g6OgLcNpSFdXqlieB2oMbgCfKJ0M22q0KZVtmhCI4'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
