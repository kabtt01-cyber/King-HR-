import { createClient } from '@supabase/supabase-js';

const meta = import.meta as any;
const supabaseUrl = (meta.env?.VITE_SUPABASE_URL as string) || '';
const supabaseAnonKey = (meta.env?.VITE_SUPABASE_ANON_KEY as string) || '';

// A helper flag to check if Supabase is fully configured
export const isSupabaseConfigured = 
  supabaseUrl && 
  supabaseAnonKey && 
  (supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://')) &&
  !supabaseUrl.includes('your-supabase-url') && 
  !supabaseUrl.includes('VITE_SUPABASE_ANON_KEY') &&
  !supabaseAnonKey.includes('your-supabase-anon-key');

// Initialize the client. If not configured, we'll use fallback values or handle gracefully in code
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'placeholder-key'
);
