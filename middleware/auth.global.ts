export default defineNuxtRouteMiddleware((to, from) => {
  const userCookie = useCookie('auth_user'); // Read stored auth state

  // 🚨 Prevent infinite loop: If already on /login, don't redirect
  // fairly certain this doesnt do anything since i am sure we are not storing any cookies
  if (!userCookie.value && to.path !== '/login') {
    return navigateTo('/login'); 
  }
});
