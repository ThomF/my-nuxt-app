<template>
  <div class="container">
    <template v-if="user">
      <h1>Welcome, {{ displayName }}</h1>
      <p>Session Active ✅</p>

      <div class="actions">
        <NuxtLink class="btn" to="/account">Edit Profile</NuxtLink>
        <button class="btn outline" @click="handleSignOut">Sign Out</button>
      </div>

      <div v-if="profileLoaded" class="mini-profile">
        <img
          v-if="avatarUrl"
          :src="avatarUrl"
          alt="avatar"
          class="avatar"
          @error="onAvatarError"
        />
        <div v-else class="avatar fallback">{{ initials }}</div>
        <div class="text">
          <div class="name-row">
            <strong>{{ displayName }}</strong>
            <span v-if="profile?.verified" class="badge" title="Verified">✔</span>
          </div>
          <small>{{ user.email }}</small>
        </div>
      </div>
    </template> 

    <template v-else>
      <!-- Render your login component -->
      <Login />
     </template>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'
import { useSupabaseClient, useSupabaseUser } from '#imports'
import { useAuth } from '~/composables/useAuth'

const supabase = useSupabaseClient()
const { user: supaUser, signOut } = useAuth()

// reactive auth user
const user = computed(() => supaUser.value || null)

// profile state
const profile = ref(null)
const profileLoaded = ref(false)

// load the profile row when user is present
const loadProfile = async () => {
  profileLoaded.value = false
  profile.value = null
  if (!user.value) return
  const { data, error } = await supabase
    .from('profiles')                      // <--- table name
    .select('full_name, profile_photo, verified')
    .eq('user_uuid', user.value.id)        // <--- FK to auth.users.id
    .maybeSingle()

  if (!error) profile.value = data || null
  profileLoaded.value = true
}

watchEffect(() => {
  if (user.value) loadProfile()
})

// derived UI bits
const displayName = computed(() => {
  return profile.value?.full_name?.trim() || user.value?.email || 'User'
})

const avatarUrl = computed(() => profile.value?.profile_photo || '')
const initials = computed(() => {
  const n = (profile.value?.full_name || user.value?.email || 'U').trim()
  return n.slice(0, 2).toUpperCase()
})

const onAvatarError = () => {
  if (profile.value) profile.value.profile_photo = ''
}

// actions
const handleSignOut = async () => {
  await signOut()
}
</script>

<style scoped>
.container {
  text-align: center;
  max-width: 720px;
  margin: 40px auto;
  padding: 20px;
}
.actions {
  margin-top: 12px;
  display: flex;
  gap: 10px;
  justify-content: center;
}
.btn {
  background: #1d4ed8;
  color: #fff;
  padding: 10px 16px;
  border-radius: 10px;
  text-decoration: none;
}
.btn:hover { background: #2563eb; }
.btn.outline {
  background: transparent;
  border: 1px solid #cbd5e1;
  color: #0f172a;
}

.mini-profile {
  margin: 20px auto 0;
  max-width: 420px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}
.avatar {
  width: 56px; height: 56px;
  border-radius: 999px;
  object-fit: cover;
  background: #0b1020;
}
.avatar.fallback {
  width: 56px; height: 56px;
  border-radius: 999px;
  display: grid; place-items: center;
  background: #e5edff; color: #334155; font-weight: 700;
}
.text { text-align: left; }
.name-row { display: flex; align-items: center; gap: 6px; }
.badge {
  display: inline-flex; align-items: center; justify-content: center;
  width: 18px; height: 18px; border-radius: 50%;
  background: #22c55e; color: #0b1020; font-size: 12px;
}
</style>
