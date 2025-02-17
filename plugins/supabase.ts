import { defineNuxtPlugin, useRuntimeConfig } from '#app';
import { createClient } from '@supabase/supabase-js';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const supabase = createClient(config.public.SUPABASE_URL, config.public.SUPABASE_ANON_KEY);

  nuxtApp.provide('supabase', supabase); // This makes `$supabase` available in the app
});
