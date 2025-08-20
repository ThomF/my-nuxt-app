// composables/useAuth.js
import { useSupabaseClient, useSupabaseUser } from '#imports'

export function useAuth() {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const signInWithEmail = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

  // allow passing options like { emailRedirectTo }
  const signUpWithEmail = (email, password, options = {}) =>
    supabase.auth.signUp({ email, password, options })

  const signOut = () => supabase.auth.signOut()
  const loadSession = () => supabase.auth.getSession()

  return { user, signInWithEmail, signUpWithEmail, signOut, loadSession }
}
