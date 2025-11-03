<template>
  <nav class="navbar">
    <div class="left">
      <NuxtLink to="/" class="brand">MyApp</NuxtLink>
      <NuxtLink to="/" class="link">Home</NuxtLink>
      <NuxtLink to="/heroes" class="link">Hero Registry</NuxtLink>

      <NuxtLink to="/about" class="link">About</NuxtLink>
      <NuxtLink to="/account" class="link">Account</NuxtLink>
    </div>

    <div class="right" v-if="user">
      <div class="avatar-wrap" @click="toggleMenu">
        <img
          v-if="avatarUrl"
          :src="avatarUrl"
          alt="avatar"
          class="avatar"
          @error="onAvatarError"
        />
        <div v-else class="avatar fallback">{{ initials }}</div>
      </div>

      <div v-if="menuOpen" class="menu" @click.stop>
        <div class="menu-header">
          <strong>{{ displayName }}</strong>
          <small>{{ user.email }}</small>
        </div>
        <NuxtLink to="/account" class="menu-item" @click="closeMenu">Account</NuxtLink>
        <button class="menu-item danger" @click="logout">Logout</button>
      </div>
    </div>

    <button v-else class="login-button" @click="goToLogin">Login</button>
  </nav>
</template>

<script setup>
import { ref, computed, watchEffect, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useSupabaseClient, useSupabaseUser } from '#imports'
import { useAuth } from '~/composables/useAuth'
import { NuxtLink } from '#components'

const router = useRouter()
const supabase = useSupabaseClient()
const { user: supaUser, signOut } = useAuth()

const user = computed(() => supaUser.value || null)
const profile = ref(null)

// load profile when user changes
const loadProfile = async () => {
  profile.value = null
  if (!user.value) return
  const { data, error } = await supabase
    .from('profiles')                     // <--- table name
    .select('full_name, profile_photo')
    .eq('user_uuid', user.value.id)
    .maybeSingle()
  if (!error) profile.value = data || null
}

watchEffect(() => {
  if (user.value) loadProfile()
})

// UI derived
const displayName = computed(() =>
  profile.value?.full_name?.trim() || user.value?.email || 'User'
)
const avatarUrl = computed(() => profile.value?.profile_photo || '')
const initials = computed(() => {
  const n = (profile.value?.full_name || user.value?.email || 'U').trim()
  return n.slice(0, 2).toUpperCase()
})
const onAvatarError = () => { if (profile.value) profile.value.profile_photo = '' }

// dropdown behavior
const menuOpen = ref(false)
const toggleMenu = () => { menuOpen.value = !menuOpen.value }
const closeMenu = () => { menuOpen.value = false }
const onDocClick = (e) => {
  // close if clicking outside the avatar/menu
  const menu = document.querySelector('.menu')
  const avatar = document.querySelector('.avatar-wrap')
  if (menuOpen.value && menu && avatar && !menu.contains(e.target) && !avatar.contains(e.target)) {
    menuOpen.value = false
  }
}
onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))

// actions
const goToLogin = () => router.push('/') // your login lives on index via <Login />
const logout = async () => {
  await signOut()
  menuOpen.value = false
  router.push('/')
}
</script>

<style scoped>
.navbar {
  position: sticky; top: 0; z-index: 50;
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 14px; background: #111827; color: #e5e7eb;
  border-bottom: 1px solid #1f2937;
}
.left { display: flex; align-items: center; gap: 14px; }
.brand { font-weight: 800; color: #93c5fd; text-decoration: none; margin-right: 6px; }
.link { color: #e5e7eb; text-decoration: none; opacity: 0.9; }
.link:hover { opacity: 1; }

.right { position: relative; }
.avatar-wrap { width: 40px; height: 40px; border-radius: 999px; overflow: hidden; cursor: pointer; border: 1px solid #374151; }
.avatar { width: 100%; height: 100%; object-fit: cover; background: #0b1020; }
.avatar.fallback { width: 40px; height: 40px; display: grid; place-items: center; background: #374151; color: #cbd5e1; font-weight: 700; }

.menu {
  position: absolute; right: 0; top: 52px; min-width: 220px;
  background: #111827; border: 1px solid #374151; border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.45); padding: 8px;
}
.menu-header { padding: 8px 10px 10px; border-bottom: 1px solid #1f2937; margin-bottom: 6px; }
.menu-item {
  width: 100%; text-align: left; background: transparent; color: #e5e7eb;
  border: none; padding: 10px 10px; border-radius: 8px; cursor: pointer;
  display: block; text-decoration: none;
}
.menu-item:hover { background: #1f2937; }
.menu-item.danger { color: #fca5a5; }

.login-button {
  background: #1d4ed8; color: #fff; border: none;
  padding: 8px 14px; border-radius: 10px; cursor: pointer;
}
.login-button:hover { background: #2563eb; }


</style>
