export default defineNuxtRouteMiddleware((to, from) => {
  const userCookie = useCookie('auth_user'); // Read stored auth state

  // 🚨 Prevent infinite loop: If already on /login, don't redirect
  if (!userCookie.value && to.path !== '/login') {
    return navigateTo('/login'); 
  }
});
