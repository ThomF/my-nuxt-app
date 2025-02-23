import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export const useAuth = () => {
  const { $supabase } = useNuxtApp();
  const router = useRouter();

  const user = ref(null);
  const session = ref(null);

  // ✅ Load session on app start
  const loadSession = async () => {
    console.log("Loading session...");
    const { data, error } = await $supabase.auth.getSession();
    if (error) {
      console.error("Session fetch failed:", error.message);
      return;
    }
    session.value = data.session;
    user.value = data.session?.user ?? null;
    console.log("User loaded:", user.value);
  };

  // ✅ Sign in user
  const signInWithEmail = async (email, password) => {
    console.log("Signing in with:", email);
    const { data, error } = await $supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error("Sign-in error:", error.message);
      return;
    }

    console.log("Sign-in successful!", data);
    user.value = data.user;

    // ✅ Redirect to home
    router.push('/');
  };

  // ✅ Sign out user
  const signOut = async () => {
    console.log("Signing out...");
    await $supabase.auth.signOut();
    user.value = null;
    session.value = null;
    router.push('/login');
  };

  // 🔄 Handle auth state changes
  $supabase.auth.onAuthStateChange((event, sessionData) => {
    console.log("Auth state changed:", event, sessionData);
    session.value = sessionData;
    user.value = sessionData?.user ?? null;
  });

  onMounted(loadSession);

  return { user, session, signInWithEmail, signOut };
};
