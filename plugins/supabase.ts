import { defineNuxtPlugin, useRuntimeConfig } from '#app';
import { createClient } from '@supabase/supabase-js';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const supabase = createClient(config.public.SUPABASE_URL, config.public.SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true, // ✅ Ensures session persists
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });

  nuxtApp.provide('supabase', supabase);
});
