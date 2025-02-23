import { ref } from 'vue';
import { useNuxtApp } from '#app'; // Ensure correct import
import { useRouter } from 'vue-router';

export const useAuth = () => {
  const { $supabase } = useNuxtApp(); // Correctly get Supabase from Nuxt context
  const router = useRouter();

  const user = ref(null);
  const session = ref(null);

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

  const signInWithEmail = async (email, password) => {
    console.log("Signing in with:", email);
    const { data, error } = await $supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error("Sign-in error:", error.message);
      return;
    }

    console.log("Sign-in successful!", data);
    user.value = data.user;
    router.push('/'); // Redirect to home after sign-in
  };

  const signOut = async () => {
    console.log("Signing out...");
    await $supabase.auth.signOut();
    user.value = null;
    session.value = null;
    router.push('/login');
  };

  // Handle auth state changes
  $supabase.auth.onAuthStateChange((event, sessionData) => {
    console.log("Auth state changed:", event, sessionData);
    session.value = sessionData;
    user.value = sessionData?.user ?? null;
  });

  return { user, session, signInWithEmail, signOut, loadSession }; // Return loadSession for use in components
};
