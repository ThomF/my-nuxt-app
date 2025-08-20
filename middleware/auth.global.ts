// middleware/auth.global.js
import { useSupabaseUser } from '#imports'
export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()
  if (to.path !== '/login' && !user.value) {
    return navigateTo('/login')
  }
})
