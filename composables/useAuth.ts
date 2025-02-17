import { ref } from 'vue';
import type { User, Session } from '@supabase/supabase-js';

export const useAuth = () => {
  const { $supabase } = useNuxtApp(); // ✅ Correctly access Supabase
  
  const user = ref<User | null>(null);
  const session = ref<Session | null>(null);

  const loadSession = async () => {
    const { data, error } = await $supabase.auth.getSession();
    if (error) {
      console.error('Error fetching session:', error.message);
      return;
    }
    session.value = data?.session ?? null;
    user.value = data?.user ?? null;
  };

  // Track auth state changes
  $supabase.auth.onAuthStateChange((_, sessionData) => {
    session.value = sessionData ?? null;
    user.value = sessionData?.user ?? null;
  });

  loadSession();

  return { user, session, signOut: () => $supabase.auth.signOut() };
};
