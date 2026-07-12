import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = 'https://lydgwyqtbrwzmkilwwpr.supabase.co';
export const supabaseAnonKey = 'sb_publishable_pqwAhim7_9Ps5z_XAS6-vw_OniV8ogp';

// Always configured as we are using the official provided Supabase credentials
export const isSupabaseConfigured = true;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

