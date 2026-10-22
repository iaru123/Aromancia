import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string) ||
  'https://gjglnjxkcjhywctzzdre.supabase.co';
const supabaseKey =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string) ||
  'sb_publishable_Kx8lcV_WmEwqBprUOHnXWA_gT8Yzq_T';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
